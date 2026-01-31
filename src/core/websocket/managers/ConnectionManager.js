/**
 * WebSocket Connection Manager.
 * 
 * Manages connection pooling, health monitoring, and automatic failover
 * for enterprise WebSocket connections.
 */

import { TYPES } from '../../di/types.js';
import { LoggerService } from '../../services/LoggerService.js';

// Import types via JSDoc typedefs
/**
 * @typedef {import('../services/EnterpriseWebSocketService.js').IEnterpriseWebSocketService} IEnterpriseWebSocketService
 * @typedef {import('../services/EnterpriseWebSocketService.js').WebSocketMessage} WebSocketMessage
 * @typedef {import('../services/EnterpriseWebSocketService.js').ConnectionMetrics} ConnectionMetrics
 * @typedef {import('../../cache/index.js').CacheService} CacheService
 */

/**
 * Connection pool interface
 * 
 * @interface ConnectionPool
 * @description Represents a pooled WebSocket connection
 */
export class ConnectionPool {
    /**
     * Connection identifier
     * 
     * @type {string}
     */
    id = '';

    /**
     * Feature identifier
     * 
     * @type {string}
     */
    feature = '';

    /**
     * WebSocket service instance
     * 
     * @type {IEnterpriseWebSocketService}
     */
    service;

    /**
     * Connection priority
     * 
     * @type {number}
     */
    priority = 0;

    /**
     * Whether connection is active
     * 
     * @type {boolean}
     */
    isActive = false;

    /**
     * Last usage timestamp
     * 
     * @type {Date}
     */
    lastUsed = new Date();

    /**
     * Connection health score
     * 
     * @type {number}
     */
    healthScore = 100;

    /**
     * Creates connection pool entry
     * 
     * @param {Object} options - Pool options
     * @returns {ConnectionPool} Connection pool instance
     * @description Creates new connection pool entry
     */
    static create(options = {}) {
        const pool = new ConnectionPool();
        Object.assign(pool, options);
        return pool;
    }
}

/**
 * Connection health interface
 * 
 * @interface ConnectionHealth
 * @description Health status of WebSocket connection
 */
export class ConnectionHealth {
    /**
     * Connection identifier
     * 
     * @type {string}
     */
    connectionId = '';

    /**
     * Health status
     * 
     * @type {string}
     */
    status = 'healthy';

    /**
     * Connection latency in milliseconds
     * 
     * @type {number}
     */
    latency = 0;

    /**
     * Connection uptime in milliseconds
     * 
     * @type {number}
     */
    uptime = 0;

    /**
     * Error count
     * 
     * @type {number}
     */
    errorCount = 0;

    /**
     * Last error timestamp
     * 
     * @type {Date}
     */
    lastError;

    /**
     * Last health check timestamp
     * 
     * @type {Date}
     */
    lastHealthCheck = new Date();

    /**
     * Creates connection health status
     * 
     * @param {Object} options - Health options
     * @returns {ConnectionHealth} Health status instance
     * @description Creates new connection health status
     */
    static create(options = {}) {
        const health = new ConnectionHealth();
        Object.assign(health, options);
        return health;
    }
}

/**
 * Connection pool configuration interface
 * 
 * @interface ConnectionPoolConfig
 * @description Configuration for connection pool management
 */
export class ConnectionPoolConfig {
    /**
     * Maximum connections per feature
     * 
     * @type {number}
     */
    maxConnections = 5;

    /**
     * Health check interval in milliseconds
     * 
     * @type {number}
     */
    healthCheckInterval = 30000;

    /**
     * Connection timeout in milliseconds
     * 
     * @type {number}
     */
    connectionTimeout = 10000;

    /**
     * Maximum retry attempts
     * 
     * @type {number}
     */
    maxRetries = 3;

    /**
     * Load balancing strategy
     * 
     * @type {string}
     */
    loadBalancingStrategy = 'round-robin';

    /**
     * Enable automatic failover
     * 
     * @type {boolean}
     */
    enableFailover = true;

    /**
     * Creates connection pool configuration
     * 
     * @param {Object} options - Configuration options
     * @returns {ConnectionPoolConfig} Configuration instance
     * @description Creates new connection pool configuration
     */
    static create(options = {}) {
        const config = new ConnectionPoolConfig();
        Object.assign(config, options);
        return config;
    }
}

/**
 * Connection Manager Interface
 * 
 * @interface IConnectionManager
 * @description Interface for connection management
 */
export class IConnectionManager {
    /**
     * Creates new connection
     * 
     * @param {string} feature - Feature identifier
     * @param {number} [priority] - Connection priority
     * @returns {Promise<string>} Connection ID
     * @description Creates new WebSocket connection
     */
    async createConnection(feature, priority = 0) {
        throw new Error('Method must be implemented');
    }

    /**
     * Gets connection for feature
     * 
     * @param {string} feature - Feature identifier
     * @returns {Promise} Connection service or null
     * @description Gets available connection for feature
     */
    async getConnection(feature) {
        throw new Error('Method must be implemented');
    }

    /**
     * Releases connection
     * 
     * @param {string} connectionId - Connection identifier
     * @returns {Promise} Connection release promise
     * @description Releases connection back to pool
     */
    async releaseConnection(connectionId) {
        throw new Error('Method must be implemented');
    }

    /**
     * Gets connection health
     * 
     * @param {string} connectionId - Connection identifier
     * @returns {Promise} Connection health or null
     * @description Gets health status of connection
     */
    async getConnectionHealth(connectionId) {
        throw new Error('Method must be implemented');
    }

    /**
     * Gets all connections
     * 
     * @returns {Promise} All connections
     * @description Returns all managed connections
     */
    async getAllConnections() {
        throw new Error('Method must be implemented');
    }

    /**
     * Closes all connections
     * 
     * @returns {Promise} Close promise
     * @description Closes all managed connections
     */
    async closeAllConnections() {
        throw new Error('Method must be implemented');
    }
}

/**
 * WebSocket Connection Manager Implementation
 * 
 * @class ConnectionManager
 * @description Manages WebSocket connection pooling and health monitoring
 */
export class ConnectionManager extends IConnectionManager {
    /**
     * Connection pool configuration
     * 
     * @type {ConnectionPoolConfig}
     */
    config;

    /**
     * Connection pools by feature
     * 
     * @type {Map}
     */
    connectionPools = new Map();

    /**
     * Connection health status
     * 
     * @type {Map}
     */
    connectionHealth = new Map();

    /**
     * Logger service
     * 
     * @type {LoggerService}
     */
    logger;

    /**
     * Cache service
     * 
     * @type {CacheService}
     */
    cacheService;

    /**
     * Health check timer
     * 
     * @type {number}
     */
    healthCheckTimer;

    /**
     * Creates connection manager
     * 
     * @param {ConnectionPoolConfig} config - Pool configuration
     * @param {LoggerService} [logger] - Logger service
     * @param {CacheService} [cacheService] - Cache service
     * @description Initializes connection manager
     */
    constructor(config, logger, cacheService) {
        this.config = ConnectionPoolConfig.create(config);
        this.logger = logger || new LoggerService();
        this.cacheService = cacheService;
        this.startHealthCheck();
    }

    /**
     * Creates new connection
     * 
     * @param {string} feature - Feature identifier
     * @param {number} [priority] - Connection priority
     * @returns {Promise<string>} Connection ID
     * @description Creates new WebSocket connection
     */
    async createConnection(feature, priority = 0) {
        try {
            // Check if we can reuse existing connection
            const existingConnection = await this.getAvailableConnection(feature);
            if (existingConnection) {
                existingConnection.lastUsed = new Date();
                this.logger.debug(`Reusing existing connection for feature: ${feature}`);
                return existingConnection.id;
            }

            // Check connection limits
            const featureConnections = this.getFeatureConnections(feature);
            if (featureConnections.length >= this.config.maxConnections) {
                // Remove least recently used connection
                const lruConnection = featureConnections
                    .sort((a, b) => a.lastUsed - b.lastUsed)[0];
                await this.closeConnection(lruConnection.id);
            }

            // Create new connection
            const connectionId = this.generateConnectionId();
            const connection = this.createWebSocketService();
            
            const poolEntry = ConnectionPool.create({
                id: connectionId,
                feature,
                service: connection,
                priority,
                isActive: true,
                lastUsed: new Date(),
                healthScore: 100
            });

            // Add to pool
            if (!this.connectionPools.has(feature)) {
                this.connectionPools.set(feature, []);
            }
            this.connectionPools.get(feature).push(poolEntry);

            // Initialize health tracking
            this.connectionHealth.set(connectionId, ConnectionHealth.create({
                connectionId,
                status: 'healthy',
                lastHealthCheck: new Date()
            }));

            // Connect the service
            await connection.connect();

            this.logger.info(`Created new connection for feature: ${feature} (${connectionId})`);
            
            return connectionId;
            
        } catch (error) {
            this.logger.error(`Failed to create connection for feature: ${feature}`, error);
            throw error;
        }
    }

    /**
     * Gets connection for feature
     * 
     * @param {string} feature - Feature identifier
     * @returns {Promise} Connection service or null
     * @description Gets available connection for feature
     */
    async getConnection(feature) {
        const connection = await this.getAvailableConnection(feature);
        if (connection) {
            connection.lastUsed = new Date();
            return connection.service;
        }
        
        // Create new connection if none available
        const connectionId = await this.createConnection(feature);
        const poolEntry = this.findConnectionById(connectionId);
        return poolEntry ? poolEntry.service : null;
    }

    /**
     * Releases connection
     * 
     * @param {string} connectionId - Connection identifier
     * @returns {Promise} Connection release promise
     * @description Releases connection back to pool
     */
    async releaseConnection(connectionId) {
        const poolEntry = this.findConnectionById(connectionId);
        if (poolEntry) {
            poolEntry.lastUsed = new Date();
            this.logger.debug(`Connection released: ${connectionId}`);
        }
    }

    /**
     * Gets connection health
     * 
     * @param {string} connectionId - Connection identifier
     * @returns {Promise} Connection health or null
     * @description Gets health status of connection
     */
    async getConnectionHealth(connectionId) {
        return this.connectionHealth.get(connectionId) || null;
    }

    /**
     * Gets all connections
     * 
     * @returns {Promise} All connections
     * @description Returns all managed connections
     */
    async getAllConnections() {
        const allConnections = [];
        
        for (const [feature, connections] of this.connectionPools) {
            for (const poolEntry of connections) {
                allConnections.push({
                    connectionId: poolEntry.id,
                    feature,
                    priority: poolEntry.priority,
                    isActive: poolEntry.isActive,
                    lastUsed: poolEntry.lastUsed,
                    healthScore: poolEntry.healthScore,
                    health: this.connectionHealth.get(poolEntry.id)
                });
            }
        }
        
        return allConnections;
    }

    /**
     * Closes all connections
     * 
     * @returns {Promise} Close promise
     * @description Closes all managed connections
     */
    async closeAllConnections() {
        const closePromises = [];
        
        for (const [feature, connections] of this.connectionPools) {
            for (const poolEntry of connections) {
                closePromises.push(this.closeConnection(poolEntry.id));
            }
        }
        
        await Promise.all(closePromises);
        
        this.connectionPools.clear();
        this.connectionHealth.clear();
        
        this.logger.info('All connections closed');
    }

    /**
     * Gets available connection for feature
     * 
     * @private
     * @param {string} feature - Feature identifier
     * @returns {ConnectionPool|null} Available connection or null
     * @description Gets available connection using load balancing strategy
     */
    async getAvailableConnection(feature) {
        const connections = this.getFeatureConnections(feature);
        const activeConnections = connections.filter(conn => conn.isActive);
        
        if (activeConnections.length === 0) {
            return null;
        }

        // Apply load balancing strategy
        switch (this.config.loadBalancingStrategy) {
            case 'least-connections':
                return activeConnections.reduce((min, conn) => 
                    conn.lastUsed < min.lastUsed ? conn : min
                );
            
            case 'priority':
                return activeConnections.reduce((max, conn) => 
                    conn.priority > max.priority ? conn : max
                );
            
            case 'round-robin':
            default:
                // Simple round-robin based on last used time
                return activeConnections.reduce((oldest, conn) => 
                    conn.lastUsed < oldest.lastUsed ? conn : oldest
                );
        }
    }

    /**
     * Gets connections for feature
     * 
     * @private
     * @param {string} feature - Feature identifier
     * @returns {Array} Feature connections
     * @description Gets all connections for specific feature
     */
    getFeatureConnections(feature) {
        return this.connectionPools.get(feature) || [];
    }

    /**
     * Finds connection by ID
     * 
     * @private
     * @param {string} connectionId - Connection identifier
     * @returns {ConnectionPool|null} Connection pool entry or null
     * @description Finds connection pool entry by ID
     */
    findConnectionById(connectionId) {
        for (const connections of this.connectionPools.values()) {
            const found = connections.find(conn => conn.id === connectionId);
            if (found) {
                return found;
            }
        }
        return null;
    }

    /**
     * Closes specific connection
     * 
     * @private
     * @param {string} connectionId - Connection identifier
     * @returns {Promise} Close promise
     * @description Closes specific connection
     */
    async closeConnection(connectionId) {
        const poolEntry = this.findConnectionById(connectionId);
        if (poolEntry) {
            try {
                await poolEntry.service.disconnect();
                poolEntry.isActive = false;
                
                // Remove from pool
                for (const [feature, connections] of this.connectionPools) {
                    const index = connections.findIndex(conn => conn.id === connectionId);
                    if (index > -1) {
                        connections.splice(index, 1);
                        break;
                    }
                }
                
                // Remove health tracking
                this.connectionHealth.delete(connectionId);
                
                this.logger.info(`Connection closed: ${connectionId}`);
            } catch (error) {
                this.logger.error(`Failed to close connection: ${connectionId}`, error);
            }
        }
    }

    /**
     * Creates WebSocket service
     * 
     * @private
     * @returns {IEnterpriseWebSocketService} WebSocket service
     * @description Creates new WebSocket service instance
     */
    createWebSocketService() {
        // This would create an actual WebSocket service instance
        // For now, return a mock implementation
        return {
            connect: async () => {},
            disconnect: async () => {},
            send: async () => {},
            getConnectionState: () => 'connected'
        };
    }

    /**
     * Generates connection ID
     * 
     * @private
     * @returns {string} Unique connection ID
     * @description Generates unique connection identifier
     */
    generateConnectionId() {
        return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Starts health check monitoring
     * 
     * @private
     * @returns {void}
     * @description Starts periodic health checks
     */
    startHealthCheck() {
        if (this.healthCheckTimer) {
            clearInterval(this.healthCheckTimer);
        }

        this.healthCheckTimer = setInterval(async () => {
            await this.performHealthCheck();
        }, this.config.healthCheckInterval);
    }

    /**
     * Performs health check on all connections
     * 
     * @private
     * @returns {Promise} Health check results
     * @description Performs health check on all connections
     */
    async performHealthCheck() {
        const now = new Date();
        
        for (const [connectionId, health] of this.connectionHealth) {
            try {
                const poolEntry = this.findConnectionById(connectionId);
                if (poolEntry && poolEntry.isActive) {
                    // Check connection state
                    const connectionState = poolEntry.service.getConnectionState();
                    
                    if (connectionState === 'connected') {
                        health.status = 'healthy';
                        health.latency = this.measureLatency(poolEntry);
                        health.uptime = now - (health.lastHealthCheck || now);
                    } else {
                        health.status = 'unhealthy';
                        health.errorCount++;
                        health.lastError = now;
                    }
                } else {
                    health.status = 'unhealthy';
                }
                
                health.lastHealthCheck = now;
                
                // Update health score
                poolEntry.healthScore = this.calculateHealthScore(health);
                
            } catch (error) {
                health.status = 'unhealthy';
                health.errorCount++;
                health.lastError = now;
                this.logger.error(`Health check failed for connection: ${connectionId}`, error);
            }
        }
    }

    /**
     * Measures connection latency
     * 
     * @private
     * @param {ConnectionPool} poolEntry - Connection pool entry
     * @returns {number} Latency in milliseconds
     * @description Measures round-trip latency
     */
    measureLatency(poolEntry) {
        const startTime = Date.now();
        // Send ping message and measure response time
        // For now, return mock latency
        return Date.now() - startTime;
    }

    /**
     * Calculates health score
     * 
     * @private
     * @param {ConnectionHealth} health - Connection health
     * @returns {number} Health score (0-100)
     * @description Calculates health score based on various factors
     */
    calculateHealthScore(health) {
        let score = 100;
        
        // Penalize unhealthy status
        if (health.status === 'unhealthy') {
            score -= 50;
        } else if (health.status === 'degraded') {
            score -= 25;
        }
        
        // Penalize high latency
        if (health.latency > 1000) {
            score -= 20;
        } else if (health.latency > 500) {
            score -= 10;
        }
        
        // Penalize errors
        score -= Math.min(health.errorCount * 5, 30);
        
        return Math.max(0, score);
    }
}
