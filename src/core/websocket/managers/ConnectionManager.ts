/**
 * WebSocket Connection Manager.
 *
 * Manages connection pooling, health monitoring, and automatic failover
 * for enterprise WebSocket connections.
 */

import { ICacheServiceManager } from '../../cache';
import { Injectable, Inject } from '../../di';
import { TYPES } from '../../di/types';
import { LoggerService } from '../../services/LoggerService';
import { IEnterpriseWebSocketService, WebSocketMessage, ConnectionMetrics } from '../services/EnterpriseWebSocketService';

export interface ConnectionPool {
  id: string;
  feature: string;
  service: IEnterpriseWebSocketService;
  priority: number;
  isActive: boolean;
  lastUsed: Date;
  healthScore: number;
}

export interface ConnectionHealth {
  connectionId: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency: number;
  uptime: number;
  errorCount: number;
  lastError: Date | null;
  lastHealthCheck: Date;
}

export interface ConnectionPoolConfig {
  maxConnections: number;
  healthCheckInterval: number;
  connectionTimeout: number;
  maxRetries: number;
  loadBalancingStrategy: 'round-robin' | 'least-connections' | 'priority';
  enableFailover: boolean;
}

/**
 * Connection Manager Interface
 */
export interface IConnectionManager {
  createConnection(feature: string, priority?: number): Promise<string>;
  getConnection(feature: string): Promise<IEnterpriseWebSocketService | null>;
  releaseConnection(connectionId: string): Promise<void>;
  getConnectionHealth(connectionId: string): ConnectionHealth | null;
  getAllConnections(): ConnectionPool[];
  removeConnection(connectionId: string): Promise<void>;
  performHealthCheck(): Promise<void>;
}

/**
 * Connection Manager Implementation
 */
@Injectable()
export class ConnectionManager implements IConnectionManager {
  private readonly connections: Map<string, ConnectionPool> = new Map();
  private readonly healthStatus: Map<string, ConnectionHealth> = new Map();
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private readonly config: ConnectionPoolConfig;
  private roundRobinIndex = 0;

  constructor(
    @Inject(TYPES.CACHE_SERVICE) private readonly cache: ICacheServiceManager,
    private readonly logger: LoggerService
  ) {
    this.config = this.getDefaultConfig();
    this.startHealthChecks();
  }

  async createConnection(feature: string, priority: number = 1): Promise<string> {
    const connectionId = this.generateConnectionId(feature);

    // Check if we've reached max connections
    if (this.connections.size >= this.config.maxConnections) {
      await this.cleanupIdleConnections();

      if (this.connections.size >= this.config.maxConnections) {
        throw new Error(`Maximum connections (${this.config.maxConnections}) reached`);
      }
    }

    // Create connection pool entry
    const connectionPool: ConnectionPool = {
      id: connectionId,
      feature,
      service: null as any, // Will be injected
      priority,
      isActive: true,
      lastUsed: new Date(),
      healthScore: 100
    };

    this.connections.set(connectionId, connectionPool);

    // Initialize health status
    this.healthStatus.set(connectionId, {
      connectionId,
      status: 'healthy',
      latency: 0,
      uptime: 0,
      errorCount: 0,
      lastError: null,
      lastHealthCheck: new Date()
    });

    this.logger.info(`[ConnectionManager] Created connection for feature: ${feature}, ID: ${connectionId}`);

    return connectionId;
  }

  async getConnection(feature: string): Promise<IEnterpriseWebSocketService | null> {
    const availableConnections = Array.from(this.connections.values())
      .filter(conn => conn.feature === feature && conn.isActive)
      .sort((a, b) => this.compareConnections(a, b));

    if (availableConnections.length === 0) {
      this.logger.warn(`[ConnectionManager] No available connections for feature: ${feature}`);
      return null;
    }

    const selectedConnection = this.selectConnection(availableConnections);
    selectedConnection.lastUsed = new Date();

    this.logger.debug(`[ConnectionManager] Selected connection: ${selectedConnection.id} for feature: ${feature}`);

    return selectedConnection.service;
  }

  async releaseConnection(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.isActive = false;
      this.logger.debug(`[ConnectionManager] Released connection: ${connectionId}`);
    }
  }

  getConnectionHealth(connectionId: string): ConnectionHealth | null {
    return this.healthStatus.get(connectionId) || null;
  }

  getAllConnections(): ConnectionPool[] {
    return Array.from(this.connections.values());
  }

  async removeConnection(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (connection) {
      // Disconnect the WebSocket service
      if (connection.service && connection.service.isConnected()) {
        connection.service.disconnect();
      }

      this.connections.delete(connectionId);
      this.healthStatus.delete(connectionId);

      this.logger.info(`[ConnectionManager] Removed connection: ${connectionId}`);
    }
  }

  async performHealthCheck(): Promise<void> {
    const healthPromises = Array.from(this.connections.entries()).map(
      async ([connectionId, connection]) => {
        try {
          const health = await this.checkConnectionHealth(connection);
          this.healthStatus.set(connectionId, health);
          connection.healthScore = this.calculateHealthScore(health);
        } catch (error) {
          this.logger.error(`[ConnectionManager] Health check failed for ${connectionId}:`, error);

          // Mark as unhealthy
          const health: ConnectionHealth = {
            connectionId,
            status: 'unhealthy',
            latency: 0,
            uptime: 0,
            errorCount: (this.healthStatus.get(connectionId)?.errorCount || 0) + 1,
            lastError: new Date(),
            lastHealthCheck: new Date()
          };

          this.healthStatus.set(connectionId, health);
          connection.healthScore = 0;
        }
      }
    );

    await Promise.all(healthPromises);

    // Clean up unhealthy connections if failover is enabled
    if (this.config.enableFailover) {
      await this.cleanupUnhealthyConnections();
    }
  }

  private async checkConnectionHealth(connection: ConnectionPool): Promise<ConnectionHealth> {
    if (!connection.service) {
      throw new Error('Connection service not available');
    }

    const startTime = Date.now();
    const currentHealth = this.healthStatus.get(connection.id) || {
      connectionId: connection.id,
      status: 'healthy',
      latency: 0,
      uptime: 0,
      errorCount: 0,
      lastError: null,
      lastHealthCheck: new Date()
    };

    try {
      // Check if connected
      const isConnected = connection.service.isConnected();
      const metrics = connection.service.getConnectionMetrics();

      // Calculate latency (ping test)
      const latency = await this.measureLatency(connection.service);

      // Update health status
      const health: ConnectionHealth = {
        ...currentHealth,
        status: this.determineHealthStatus(isConnected, latency, currentHealth.errorCount),
        latency,
        uptime: metrics.connectionUptime,
        lastHealthCheck: new Date()
      };

      return health;
    } catch (error) {
      return {
        ...currentHealth,
        status: 'unhealthy',
        latency: 0,
        errorCount: currentHealth.errorCount + 1,
        lastError: new Date(),
        lastHealthCheck: new Date()
      };
    }
  }

  private async measureLatency(service: IEnterpriseWebSocketService): Promise<number> {
    const startTime = Date.now();

    try {
      // Send a ping message
      await service.sendMessage({
        type: 'ping',
        feature: 'health-check',
        payload: { timestamp: startTime }
      });

      // For now, return a simulated latency
      // In a real implementation, you'd wait for a pong response
      return Date.now() - startTime;
    } catch (error) {
      return 9999; // High latency indicates failure
    }
  }

  private determineHealthStatus(isConnected: boolean, latency: number, errorCount: number): 'healthy' | 'degraded' | 'unhealthy' {
    if (!isConnected || errorCount > 5) {
      return 'unhealthy';
    }

    if (latency > 1000 || errorCount > 2) {
      return 'degraded';
    }

    return 'healthy';
  }

  private calculateHealthScore(health: ConnectionHealth): number {
    let score = 100;

    // Deduct points for poor status
    if (health.status === 'unhealthy') score -= 80;
    else if (health.status === 'degraded') score -= 40;

    // Deduct points for high latency
    if (health.latency > 2000) score -= 30;
    else if (health.latency > 1000) score -= 15;
    else if (health.latency > 500) score -= 5;

    // Deduct points for errors
    score -= Math.min(health.errorCount * 10, 50);

    return Math.max(0, score);
  }

  private selectConnection(connections: ConnectionPool[]): ConnectionPool {
    switch (this.config.loadBalancingStrategy) {
      case 'round-robin':
        return this.selectRoundRobin(connections);
      case 'least-connections':
        return this.selectLeastConnections(connections);
      case 'priority':
        return this.selectByPriority(connections);
      default:
        return connections[0];
    }
  }

  private selectRoundRobin(connections: ConnectionPool[]): ConnectionPool {
    const connection = connections[this.roundRobinIndex % connections.length];
    this.roundRobinIndex++;
    return connection;
  }

  private selectLeastConnections(connections: ConnectionPool[]): ConnectionPool {
    return connections.reduce((best, current) => {
      const bestHealth = this.healthStatus.get(best.id);
      const currentHealth = this.healthStatus.get(current.id);

      if (!bestHealth || !currentHealth) return best;

      return bestHealth.errorCount < currentHealth.errorCount ? best : current;
    });
  }

  private selectByPriority(connections: ConnectionPool[]): ConnectionPool {
    return connections.reduce((best, current) =>
      current.priority > best.priority ? current : best
    );
  }

  private compareConnections(a: ConnectionPool, b: ConnectionPool): number {
    // Sort by health score first, then by priority
    const healthScoreDiff = b.healthScore - a.healthScore;
    if (healthScoreDiff !== 0) return healthScoreDiff;

    return b.priority - a.priority;
  }

  private async cleanupIdleConnections(): Promise<void> {
    const now = new Date();
    const idleThreshold = 5 * 60 * 1000; // 5 minutes

    const idleConnections = Array.from(this.connections.entries()).filter(
      ([_, connection]) =>
        !connection.isActive &&
        (now.getTime() - connection.lastUsed.getTime()) > idleThreshold
    );

    for (const [connectionId] of idleConnections) {
      await this.removeConnection(connectionId);
    }

    if (idleConnections.length > 0) {
      this.logger.info(`[ConnectionManager] Cleaned up ${idleConnections.length} idle connections`);
    }
  }

  private async cleanupUnhealthyConnections(): Promise<void> {
    const unhealthyConnections = Array.from(this.connections.entries()).filter(
      ([_, connection]) => connection.healthScore < 20
    );

    for (const [connectionId] of unhealthyConnections) {
      await this.removeConnection(connectionId);
    }

    if (unhealthyConnections.length > 0) {
      this.logger.warn(`[ConnectionManager] Removed ${unhealthyConnections.length} unhealthy connections`);
    }
  }

  private startHealthChecks(): void {
    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck().catch(error => {
        this.logger.error('[ConnectionManager] Health check failed:', error);
      });
    }, this.config.healthCheckInterval);
  }

  private generateConnectionId(feature: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `conn_${feature}_${timestamp}_${random}`;
  }

  private getDefaultConfig(): ConnectionPoolConfig {
    return {
      maxConnections: 10,
      healthCheckInterval: 30000, // 30 seconds
      connectionTimeout: 10000, // 10 seconds
      maxRetries: 3,
      loadBalancingStrategy: 'priority',
      enableFailover: true
    };
  }

  /**
   * Cleanup method to be called when shutting down
   */
  async cleanup(): Promise<void> {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }

    // Disconnect all connections
    const disconnectPromises = Array.from(this.connections.entries()).map(
      async ([connectionId]) => this.removeConnection(connectionId)
    );

    await Promise.all(disconnectPromises);

    this.logger.info('[ConnectionManager] Cleanup completed');
  }
}
