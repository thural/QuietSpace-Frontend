/**
 * Connection Manager Test Suite
 * 
 * Comprehensive tests for WebSocket Connection Manager including:
 * - Connection pooling and management
 * - Health monitoring and failover
 * - Load balancing strategies
 * - Performance and memory management
 * - Error handling and edge cases
 */

import { ConnectionManager, IConnectionManager, ConnectionPool, ConnectionHealth } from '../../../src/core/websocket/managers/ConnectionManager';
import { CacheService } from '../../../src/core/cache';
import { LoggerService } from '../../../src/core/services/LoggerService';
import { IEnterpriseWebSocketService, WebSocketMessage, ConnectionMetrics } from '../../../src/core/websocket/services/EnterpriseWebSocketService';

// Mock implementations
const mockCacheService: Partial<CacheService> = {
  getCache: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    invalidate: jest.fn(),
    invalidatePattern: jest.fn(),
    getStats: jest.fn(() => ({}))
  }))
};

const mockLoggerService: Partial<LoggerService> = {
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  error: jest.fn()
};

const mockWebSocketService: Partial<IEnterpriseWebSocketService> = {
  isConnected: jest.fn(() => true),
  connect: jest.fn(),
  disconnect: jest.fn(),
  sendMessage: jest.fn(),
  getConnectionMetrics: jest.fn(() => ({
    connectionUptime: 10000,
    messagesSent: 5,
    messagesReceived: 3,
    lastError: null
  }))
};

describe('ConnectionManager', () => {
  let connectionManager: ConnectionManager;
  let cacheService: CacheService;
  let loggerService: LoggerService;

  beforeEach(() => {
    jest.clearAllMocks();
    cacheService = mockCacheService as CacheService;
    loggerService = mockLoggerService as LoggerService;
    connectionManager = new ConnectionManager(cacheService, loggerService);
  });

  afterEach(() => {
    connectionManager.cleanup();
  });

  describe('Basic Functionality', () => {
    test('should create connection manager instance', () => {
      expect(connectionManager).toBeInstanceOf(ConnectionManager);
      expect(connectionManager.getAllConnections()).toEqual([]);
    });

    test('should create connection successfully', async () => {
      const connectionId = await connectionManager.createConnection('chat', 1);
      
      expect(connectionId).toBeDefined();
      expect(connectionId).toMatch(/^conn_chat_\d+_[a-z0-9]+$/);
      
      const connections = connectionManager.getAllConnections();
      expect(connections).toHaveLength(1);
      expect(connections[0].feature).toBe('chat');
      expect(connections[0].priority).toBe(1);
      expect(connections[0].isActive).toBe(true);
    });

    test('should get connection for feature', async () => {
      const connectionId = await connectionManager.createConnection('chat', 1);
      
      // Mock the service for the connection
      const connection = connectionManager.getAllConnections()[0];
      connection.service = mockWebSocketService as IEnterpriseWebSocketService;
      
      const retrievedService = await connectionManager.getConnection('chat');
      expect(retrievedService).toBe(mockWebSocketService);
    });

    test('should return null for non-existent feature', async () => {
      const service = await connectionManager.getConnection('nonexistent');
      expect(service).toBeNull();
    });

    test('should release connection successfully', async () => {
      const connectionId = await connectionManager.createConnection('chat', 1);
      await connectionManager.releaseConnection(connectionId);
      
      const connection = connectionManager.getAllConnections().find(c => c.id === connectionId);
      expect(connection?.isActive).toBe(false);
    });

    test('should remove connection successfully', async () => {
      const connectionId = await connectionManager.createConnection('chat', 1);
      await connectionManager.removeConnection(connectionId);
      
      const connections = connectionManager.getAllConnections();
      expect(connections).toHaveLength(0);
    });

    test('should get connection health', async () => {
      const connectionId = await connectionManager.createConnection('chat', 1);
      const health = connectionManager.getConnectionHealth(connectionId);
      
      expect(health).toBeDefined();
      expect(health?.connectionId).toBe(connectionId);
      expect(health?.status).toBe('healthy');
    });

    test('should return null health for non-existent connection', () => {
      const health = connectionManager.getConnectionHealth('nonexistent');
      expect(health).toBeNull();
    });
  });

  describe('Connection Pool Management', () => {
    test('should enforce maximum connections limit', async () => {
      // Create connections up to the limit
      const maxConnections = 10; // Default config
      const connectionIds: string[] = [];
      
      for (let i = 0; i < maxConnections + 5; i++) {
        try {
          const connectionId = await connectionManager.createConnection(`feature${i}`, 1);
          connectionIds.push(connectionId);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toContain('Maximum connections reached');
        }
      }
      
      expect(connectionManager.getAllConnections()).toHaveLength(maxConnections);
    });

    test('should cleanup idle connections', async () => {
      const connectionId1 = await connectionManager.createConnection('chat', 1);
      const connectionId2 = await connectionManager.createConnection('notification', 1);
      
      // Release one connection to make it idle
      await connectionManager.releaseConnection(connectionId1);
      
      // Mock time passage (5+ minutes)
      const originalConnection = connectionManager.getAllConnections().find(c => c.id === connectionId1);
      if (originalConnection) {
        originalConnection.lastUsed = new Date(Date.now() - 6 * 60 * 1000); // 6 minutes ago
      }
      
      // Create a new connection to trigger cleanup
      await connectionManager.createConnection('feed', 1);
      
      // Idle connection should be cleaned up (this is tested via internal behavior)
      expect(loggerService.info).toHaveBeenCalledWith(
        expect.stringContaining('Cleaned up')
      );
    });

    test('should handle multiple connections for same feature', async () => {
      const connectionId1 = await connectionManager.createConnection('chat', 1);
      const connectionId2 = await connectionManager.createConnection('chat', 2);
      const connectionId3 = await connectionManager.createConnection('chat', 3);
      
      const connections = connectionManager.getAllConnections();
      const chatConnections = connections.filter(c => c.feature === 'chat');
      
      expect(chatConnections).toHaveLength(3);
      expect(connections).toHaveLength(3);
    });
  });

  describe('Health Monitoring', () => {
    test('should perform health check on all connections', async () => {
      const connectionId1 = await connectionManager.createConnection('chat', 1);
      const connectionId2 = await connectionManager.createConnection('notification', 1);
      
      // Mock services for connections
      const connections = connectionManager.getAllConnections();
      connections.forEach(conn => {
        conn.service = mockWebSocketService as IEnterpriseWebSocketService;
      });
      
      await connectionManager.performHealthCheck();
      
      // Health should be updated for all connections
      const health1 = connectionManager.getConnectionHealth(connectionId1);
      const health2 = connectionManager.getConnectionHealth(connectionId2);
      
      expect(health1?.status).toBe('healthy');
      expect(health2?.status).toBe('healthy');
    });

    test('should handle failed health checks', async () => {
      const connectionId = await connectionManager.createConnection('chat', 1);
      
      // Mock service that throws error
      const failingService = {
        ...mockWebSocketService,
        isConnected: jest.fn(() => false),
        sendMessage: jest.fn().mockRejectedValue(new Error('Connection failed'))
      };
      
      const connection = connectionManager.getAllConnections()[0];
      connection.service = failingService as IEnterpriseWebSocketService;
      
      await connectionManager.performHealthCheck();
      
      const health = connectionManager.getConnectionHealth(connectionId);
      expect(health?.status).toBe('unhealthy');
      expect(health?.errorCount).toBeGreaterThan(0);
    });

    test('should calculate health scores correctly', async () => {
      const connectionId = await connectionManager.createConnection('chat', 1);
      
      // Mock service with high latency
      const slowService = {
        ...mockWebSocketService,
        sendMessage: jest.fn().mockImplementation(() => {
          return new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
        })
      };
      
      const connection = connectionManager.getAllConnections()[0];
      connection.service = slowService as IEnterpriseWebSocketService;
      
      await connectionManager.performHealthCheck();
      
      const health = connectionManager.getConnectionHealth(connectionId);
      expect(health?.latency).toBeGreaterThan(0);
    });

    test('should cleanup unhealthy connections when failover enabled', async () => {
      const connectionId = await connectionManager.createConnection('chat', 1);
      
      // Mock failing service
      const failingService = {
        ...mockWebSocketService,
        isConnected: jest.fn(() => false),
        sendMessage: jest.fn().mockRejectedValue(new Error('Failed'))
      };
      
      const connection = connectionManager.getAllConnections()[0];
      connection.service = failingService as IEnterpriseWebSocketService;
      connection.healthScore = 10; // Set low health score
      
      await connectionManager.performHealthCheck();
      
      // Should log cleanup of unhealthy connections
      expect(loggerService.warn).toHaveBeenCalledWith(
        expect.stringContaining('Removed')
      );
    });
  });

  describe('Load Balancing Strategies', () => {
    test('should select connections by priority', async () => {
      const connectionId1 = await connectionManager.createConnection('chat', 1);
      const connectionId2 = await connectionManager.createConnection('chat', 3);
      const connectionId3 = await connectionManager.createConnection('chat', 2);
      
      // Mock services
      const connections = connectionManager.getAllConnections();
      connections.forEach(conn => {
        conn.service = mockWebSocketService as IEnterpriseWebSocketService;
      });
      
      const service = await connectionManager.getConnection('chat');
      
      // Should select the highest priority connection
      const selectedConnection = connections.find(c => c.service === service);
      expect(selectedConnection?.priority).toBe(3);
    });

    test('should handle round-robin selection', async () => {
      // This tests the internal round-robin logic
      const connectionId1 = await connectionManager.createConnection('chat', 1);
      const connectionId2 = await connectionManager.createConnection('chat', 1);
      
      const connections = connectionManager.getAllConnections();
      connections.forEach(conn => {
        conn.service = mockWebSocketService as IEnterpriseWebSocketService;
      });
      
      // Multiple calls should rotate through connections
      const service1 = await connectionManager.getConnection('chat');
      const service2 = await connectionManager.getConnection('chat');
      
      expect(service1).toBeDefined();
      expect(service2).toBeDefined();
    });
  });

  describe('Configuration Management', () => {
    test('should use default configuration', () => {
      // Test that default config is applied
      expect(connectionManager.getAllConnections()).toEqual([]);
    });

    test('should handle configuration changes', () => {
      // Configuration is set in constructor, this tests it doesn't crash
      expect(() => new ConnectionManager(cacheService, loggerService)).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle connection creation errors', async () => {
      // Test with invalid parameters
      await expect(connectionManager.createConnection('', -1)).rejects.toThrow();
    });

    test('should handle service unavailability', async () => {
      const connectionId = await connectionManager.createConnection('chat', 1);
      
      // Don't set service, should handle gracefully
      const service = await connectionManager.getConnection('chat');
      expect(service).toBeNull();
    });

    test('should handle health check failures gracefully', async () => {
      const connectionId = await connectionManager.createConnection('chat', 1);
      
      // Health check should not throw even with invalid connections
      await expect(connectionManager.performHealthCheck()).resolves.not.toThrow();
    });

    test('should handle removal of non-existent connections', async () => {
      await expect(connectionManager.removeConnection('nonexistent')).resolves.not.toThrow();
    });

    test('should handle release of non-existent connections', async () => {
      await expect(connectionManager.releaseConnection('nonexistent')).resolves.not.toThrow();
    });
  });

  describe('Performance', () => {
    test('should handle rapid connection creation', async () => {
      const startTime = Date.now();
      const connectionIds: string[] = [];
      
      // Create multiple connections rapidly
      for (let i = 0; i < 5; i++) {
        const connectionId = await connectionManager.createConnection(`feature${i}`, 1);
        connectionIds.push(connectionId);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
      expect(connectionManager.getAllConnections()).toHaveLength(5);
    });

    test('should handle concurrent operations', async () => {
      const promises: Promise<string>[] = [];
      
      // Create connections concurrently
      for (let i = 0; i < 3; i++) {
        promises.push(connectionManager.createConnection(`feature${i}`, 1));
      }
      
      const connectionIds = await Promise.all(promises);
      expect(connectionIds).toHaveLength(3);
      expect(connectionManager.getAllConnections()).toHaveLength(3);
    });

    test('should not have memory leaks', async () => {
      const initialConnections = connectionManager.getAllConnections().length;
      
      // Create and remove connections
      for (let i = 0; i < 5; i++) {
        const connectionId = await connectionManager.createConnection(`feature${i}`, 1);
        await connectionManager.removeConnection(connectionId);
      }
      
      const finalConnections = connectionManager.getAllConnections().length;
      expect(finalConnections).toBe(initialConnections);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty feature names', async () => {
      await expect(connectionManager.createConnection('', 1)).rejects.toThrow();
    });

    test('should handle negative priorities', async () => {
      const connectionId = await connectionManager.createConnection('chat', -1);
      expect(connectionId).toBeDefined();
      
      const connection = connectionManager.getAllConnections()[0];
      expect(connection.priority).toBe(-1);
    });

    test('should handle very high priorities', async () => {
      const connectionId = await connectionManager.createConnection('chat', 999999);
      expect(connectionId).toBeDefined();
      
      const connection = connectionManager.getAllConnections()[0];
      expect(connection.priority).toBe(999999);
    });

    test('should handle special characters in feature names', async () => {
      const connectionId = await connectionManager.createConnection('chat-with_special.chars', 1);
      expect(connectionId).toBeDefined();
      expect(connectionId).toContain('chat-with_special.chars');
    });

    test('should handle cleanup on manager destruction', async () => {
      const connectionId = await connectionManager.createConnection('chat', 1);
      
      // Cleanup should not throw
      await expect(connectionManager.cleanup()).resolves.not.toThrow();
      
      expect(loggerService.info).toHaveBeenCalledWith(
        expect.stringContaining('Cleanup completed')
      );
    });
  });

  describe('Integration', () => {
    test('should work with complete connection lifecycle', async () => {
      // Create connection
      const connectionId = await connectionManager.createConnection('chat', 1);
      expect(connectionId).toBeDefined();
      
      // Mock service
      const connection = connectionManager.getAllConnections()[0];
      connection.service = mockWebSocketService as IEnterpriseWebSocketService;
      
      // Get connection
      const service = await connectionManager.getConnection('chat');
      expect(service).toBe(mockWebSocketService);
      
      // Check health
      const health = connectionManager.getConnectionHealth(connectionId);
      expect(health?.status).toBe('healthy');
      
      // Release connection
      await connectionManager.releaseConnection(connectionId);
      const releasedConnection = connectionManager.getAllConnections().find(c => c.id === connectionId);
      expect(releasedConnection?.isActive).toBe(false);
      
      // Remove connection
      await connectionManager.removeConnection(connectionId);
      expect(connectionManager.getAllConnections()).toHaveLength(0);
    });

    test('should handle multiple features with different priorities', async () => {
      const chatId = await connectionManager.createConnection('chat', 1);
      const notificationId = await connectionManager.createConnection('notification', 3);
      const feedId = await connectionManager.createConnection('feed', 2);
      
      const connections = connectionManager.getAllConnections();
      expect(connections).toHaveLength(3);
      
      // Mock services
      connections.forEach(conn => {
        conn.service = mockWebSocketService as IEnterpriseWebSocketService;
      });
      
      // Test getting connections for different features
      const chatService = await connectionManager.getConnection('chat');
      const notificationService = await connectionManager.getConnection('notification');
      const feedService = await connectionManager.getConnection('feed');
      
      expect(chatService).toBeDefined();
      expect(notificationService).toBeDefined();
      expect(feedService).toBeDefined();
    });
  });

  describe('Type Safety', () => {
    test('should maintain type safety for interfaces', () => {
      const manager: IConnectionManager = connectionManager;
      expect(manager).toBeDefined();
      
      // Test interface methods exist
      expect(typeof manager.createConnection).toBe('function');
      expect(typeof manager.getConnection).toBe('function');
      expect(typeof manager.releaseConnection).toBe('function');
      expect(typeof manager.removeConnection).toBe('function');
      expect(typeof manager.performHealthCheck).toBe('function');
    });

    test('should handle TypeScript compilation', () => {
      // This test ensures TypeScript compilation works
      const connectionId: Promise<string> = connectionManager.createConnection('chat', 1);
      const service: Promise<IEnterpriseWebSocketService | null> = connectionManager.getConnection('chat');
      const health: ConnectionHealth | null = connectionManager.getConnectionHealth('test');
      const connections: ConnectionPool[] = connectionManager.getAllConnections();
      
      expect(connectionId).toBeDefined();
      expect(service).toBeDefined();
      expect(health).toBeDefined();
      expect(connections).toBeDefined();
    });
  });
});
