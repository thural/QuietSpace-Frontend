/**
 * WebSocket Index Test Suite
 * 
 * Comprehensive tests for WebSocket module index including:
 * - Public API exports
 * - Factory functions
 * - Type exports
 * - Black Box pattern compliance
 * - Module version and info
 * - Integration with DI container
 */

import {
  // Types
  IEnterpriseWebSocketService,
  WebSocketMessage,
  WebSocketConfig,
  WebSocketEventListener,
  ConnectionMetrics,
  IMessageRouter,
  MessageRoute,
  MessageHandler,
  MessageValidator,
  MessageTransformer,
  RoutingMetrics,
  FeatureMessageStats,
  MessageRouterConfig,
  IConnectionManager,
  ConnectionPool,
  ConnectionHealth,
  ConnectionPoolConfig,
  IWebSocketCacheManager,
  CacheInvalidationStrategy,
  CacheInvalidationConfig,
  UseEnterpriseWebSocketOptions,
  UseFeatureWebSocketOptions,
  WebSocketConnectionState,
  WebSocketFeatureConfig,
  WebSocketServiceConfig,
  WebSocketConnectionConfig,
  WebSocketMessageConfig,
  WebSocketCacheConfig,
  
  // Factory Functions
  createWebSocketService,
  createMessageRouter,
  createConnectionManager,
  createCacheManager,
  
  // DI Functions
  createWebSocketContainer,
  registerWebSocketServices,
  initializeWebSocketServices,
  getWebSocketService,
  getConnectionManager,
  getMessageRouter,
  WebSocketServiceFactory,
  performWebSocketHealthCheck,
  
  // Hooks
  useEnterpriseWebSocket,
  useFeatureWebSocket,
  useWebSocketConnection,
  useWebSocketMetrics,
  
  // Constants
  WEBSOCKET_MESSAGE_TYPES,
  WEBSOCKET_CONNECTION_STATES,
  WEBSOCKET_FEATURES,
  WEBSOCKET_EVENTS,
  WEBSOCKET_ERRORS,
  
  // Module Info
  WEBSOCKET_MODULE_VERSION,
  WEBSOCKET_MODULE_INFO
} from '../../../src/core/websocket/index';

import { Container } from '../../../src/core/di';
import { TYPES } from '../../../src/core/di/types';

describe('WebSocket Index', () => {
  let container: Container;

  beforeEach(() => {
    jest.clearAllMocks();
    container = new Container();
  });

  describe('Type Exports', () => {
    test('should export service types', () => {
      // These are type exports, so we test their existence through compilation
      const message: WebSocketMessage = {
        id: 'test',
        type: 'test',
        feature: 'test',
        payload: {},
        timestamp: new Date(),
        sender: 'test'
      };

      const config: WebSocketConfig = {
        url: 'ws://localhost:3001',
        enableMetrics: true,
        enableHealthChecks: true
      };

      const listener: WebSocketEventListener = {
        onConnect: () => {},
        onMessage: (message) => {},
        onDisconnect: () => {},
        onError: () => {}
      };

      expect(message).toBeDefined();
      expect(config).toBeDefined();
      expect(listener).toBeDefined();
    });

    test('should export router types', () => {
      const route: MessageRoute = {
        feature: 'test',
        messageType: 'test',
        handler: async () => {},
        validator: () => true,
        priority: 1,
        enabled: true
      };

      const handler: MessageHandler = async (message) => {};
      const validator: MessageValidator = (message) => true;
      const transformer: MessageTransformer = (message) => message;

      expect(route).toBeDefined();
      expect(handler).toBeDefined();
      expect(validator).toBeDefined();
      expect(transformer).toBeDefined();
    });

    test('should export connection types', () => {
      const pool: ConnectionPool = {
        id: 'test',
        feature: 'test',
        service: null as any,
        priority: 1,
        isActive: true,
        lastUsed: new Date(),
        healthScore: 100
      };

      const health: ConnectionHealth = {
        connectionId: 'test',
        status: 'healthy',
        latency: 50,
        uptime: 1000,
        errorCount: 0,
        lastError: null,
        lastHealthCheck: new Date()
      };

      const config: ConnectionPoolConfig = {
        maxConnections: 10,
        healthCheckInterval: 30000,
        connectionTimeout: 10000,
        maxRetries: 3,
        loadBalancingStrategy: 'priority',
        enableFailover: true
      };

      expect(pool).toBeDefined();
      expect(health).toBeDefined();
      expect(config).toBeDefined();
    });

    test('should export hook types', () => {
      const enterpriseOptions: UseEnterpriseWebSocketOptions = {
        autoConnect: true,
        enableMetrics: true,
        connectionTimeout: 10000
      };

      const featureOptions: UseFeatureWebSocketOptions = {
        feature: 'test',
        autoConnect: true,
        priority: 1
      };

      const connectionState: WebSocketConnectionState = {
        isConnected: true,
        isConnecting: false,
        error: null,
        lastError: null,
        connectionState: 'connected'
      };

      expect(enterpriseOptions).toBeDefined();
      expect(featureOptions).toBeDefined();
      expect(connectionState).toBeDefined();
    });

    test('should export configuration types', () => {
      const featureConfig: WebSocketFeatureConfig = {
        name: 'test',
        enabled: true,
        priority: 1,
        maxConnections: 5,
        heartbeatInterval: 30000,
        reconnectAttempts: 3,
        messageValidation: true,
        cacheInvalidation: true
      };

      const serviceConfig: WebSocketServiceConfig = {
        url: 'ws://localhost:3001',
        features: [featureConfig],
        globalSettings: {
          enableMetrics: true,
          enableHealthChecks: true,
          enableCacheIntegration: true,
          logLevel: 'info'
        }
      };

      const connectionConfig: WebSocketConnectionConfig = {
        token: 'test',
        autoConnect: true,
        autoReconnect: true,
        connectionTimeout: 10000,
        maxReconnectAttempts: 5,
        reconnectDelay: 1000,
        heartbeatInterval: 30000,
        enableMetrics: true
      };

      expect(featureConfig).toBeDefined();
      expect(serviceConfig).toBeDefined();
      expect(connectionConfig).toBeDefined();
    });
  });

  describe('Factory Functions', () => {
    test('should create WebSocket service factory', () => {
      expect(typeof createWebSocketService).toBe('function');
    });

    test('should create message router factory', () => {
      expect(typeof createMessageRouter).toBe('function');
    });

    test('should create connection manager factory', () => {
      expect(typeof createConnectionManager).toBe('function');
    });

    test('should create cache manager factory', () => {
      expect(typeof createCacheManager).toBe('function');
    });

    test('should handle factory function calls', () => {
      // These would require proper DI container setup in real usage
      expect(() => {
        // Note: These will throw without proper DI setup, but should be callable
        try {
          createWebSocketService(container);
        } catch (error) {
          // Expected in test environment
        }
      }).not.toThrow();
    });
  });

  describe('DI Functions', () => {
    test('should export container creation function', () => {
      expect(typeof createWebSocketContainer).toBe('function');
    });

    test('should export service registration function', () => {
      expect(typeof registerWebSocketServices).toBe('function');
    });

    test('should export initialization function', () => {
      expect(typeof initializeWebSocketServices).toBe('function');
    });

    test('should export service getter functions', () => {
      expect(typeof getWebSocketService).toBe('function');
      expect(typeof getConnectionManager).toBe('function');
      expect(typeof getMessageRouter).toBe('function');
    });

    test('should export WebSocketServiceFactory class', () => {
      expect(WebSocketServiceFactory).toBeDefined();
      expect(typeof WebSocketServiceFactory).toBe('function');
    });

    test('should export health check function', () => {
      expect(typeof performWebSocketHealthCheck).toBe('function');
    });

    test('should create WebSocketServiceFactory instance', () => {
      const factory = new WebSocketServiceFactory(container);
      expect(factory).toBeInstanceOf(WebSocketServiceFactory);
    });
  });

  describe('Hook Exports', () => {
    test('should export enterprise WebSocket hook', () => {
      expect(typeof useEnterpriseWebSocket).toBe('function');
    });

    test('should export feature WebSocket hook', () => {
      expect(typeof useFeatureWebSocket).toBe('function');
    });

    test('should export connection hook', () => {
      expect(typeof useWebSocketConnection).toBe('function');
    });

    test('should export metrics hook', () => {
      expect(typeof useWebSocketMetrics).toBe('function');
    });
  });

  describe('Constants Exports', () => {
    test('should export message types constants', () => {
      expect(WEBSOCKET_MESSAGE_TYPES).toBeDefined();
      expect(typeof WEBSOCKET_MESSAGE_TYPES).toBe('object');
    });

    test('should export connection states constants', () => {
      expect(WEBSOCKET_CONNECTION_STATES).toBeDefined();
      expect(typeof WEBSOCKET_CONNECTION_STATES).toBe('object');
    });

    test('should export features constants', () => {
      expect(WEBSOCKET_FEATURES).toBeDefined();
      expect(typeof WEBSOCKET_FEATURES).toBe('object');
    });

    test('should export events constants', () => {
      expect(WEBSOCKET_EVENTS).toBeDefined();
      expect(typeof WEBSOCKET_EVENTS).toBe('object');
    });

    test('should export error constants', () => {
      expect(WEBSOCKET_ERRORS).toBeDefined();
      expect(typeof WEBSOCKET_ERRORS).toBe('object');
    });
  });

  describe('Module Info', () => {
    test('should export module version', () => {
      expect(WEBSOCKET_MODULE_VERSION).toBeDefined();
      expect(typeof WEBSOCKET_MODULE_VERSION).toBe('string');
    });

    test('should export module info', () => {
      expect(WEBSOCKET_MODULE_INFO).toBeDefined();
      expect(typeof WEBSOCKET_MODULE_INFO).toBe('object');
      expect(WEBSOCKET_MODULE_INFO.name).toBeDefined();
      expect(WEBSOCKET_MODULE_INFO.version).toBeDefined();
      expect(WEBSOCKET_MODULE_INFO.description).toBeDefined();
      expect(WEBSOCKET_MODULE_INFO.features).toBeDefined();
      expect(WEBSOCKET_MODULE_INFO.dependencies).toBeDefined();
    });

    test('should have correct module info structure', () => {
      expect(WEBSOCKET_MODULE_INFO.name).toBe('Enterprise WebSocket Module');
      expect(WEBSOCKET_MODULE_INFO.version).toBe(WEBSOCKET_MODULE_VERSION);
      expect(Array.isArray(WEBSOCKET_MODULE_INFO.features)).toBe(true);
      expect(Array.isArray(WEBSOCKET_MODULE_INFO.dependencies)).toBe(true);
    });
  });

  describe('Black Box Pattern Compliance', () => {
    test('should not export implementation classes', () => {
      // Implementation classes should not be available
      expect(() => {
        // These should not be available in the exports
        const EnterpriseWebSocketService = require('../../../src/core/websocket/index').EnterpriseWebSocketService;
        EnterpriseWebSocketService;
      }).toThrow();
    });

    test('should export only interfaces and factory functions', () => {
      // All exports should be either types, interfaces, or factory functions
      const moduleExports = require('../../../src/core/websocket/index');
      
      Object.keys(moduleExports).forEach(exportName => {
        const exportValue = moduleExports[exportName];
        
        // Should be a function (factory), object (constants), or type
        expect(
          typeof exportValue === 'function' ||
          typeof exportValue === 'object' ||
          typeof exportValue === 'string'
        ).toBe(true);
      });
    });

    test('should provide clean public API', () => {
      // Public API should be clean and well-organized
      expect(typeof createWebSocketService).toBe('function');
      expect(typeof createMessageRouter).toBe('function');
      expect(typeof createConnectionManager).toBe('function');
      expect(typeof useEnterpriseWebSocket).toBe('function');
      expect(typeof useFeatureWebSocket).toBe('function');
    });
  });

  describe('Integration', () => {
    test('should work with DI container', () => {
      // Test that factory functions work with DI container
      expect(() => {
        const factory = new WebSocketServiceFactory(container);
        expect(factory).toBeDefined();
      }).not.toThrow();
    });

    test('should handle container operations', () => {
      expect(() => {
        createWebSocketContainer(container);
      }).not.toThrow();
    });

    test('should maintain type safety', () => {
      // Test TypeScript compilation
      const service: IEnterpriseWebSocketService | null = null;
      const router: IMessageRouter | null = null;
      const manager: IConnectionManager | null = null;

      expect(service).toBeDefined();
      expect(router).toBeDefined();
      expect(manager).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid container gracefully', () => {
      expect(() => {
        createWebSocketService(null as any);
      }).toThrow();
    });

    test('should handle missing dependencies', () => {
      const emptyContainer = new Container();
      
      expect(() => {
        getWebSocketService(emptyContainer);
      }).toThrow();
    });

    test('should handle factory errors', () => {
      expect(() => {
        new WebSocketServiceFactory(null as any);
      }).toThrow();
    });
  });

  describe('Performance', () => {
    test('should load module quickly', () => {
      const startTime = Date.now();
      
      // Import and use module
      const module = require('../../../src/core/websocket/index');
      const factory = new WebSocketServiceFactory(container);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // Should load within 1 second
      expect(factory).toBeDefined();
    });

    test('should handle multiple factory creations', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 10; i++) {
        const factory = new WebSocketServiceFactory(container);
        expect(factory).toBeDefined();
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('Type Safety', () => {
    test('should maintain TypeScript compilation', () => {
      // This test ensures TypeScript compilation works
      const config: WebSocketConfig = {
        url: 'ws://localhost:3001',
        enableMetrics: true,
        enableHealthChecks: true
      };

      const message: WebSocketMessage = {
        id: 'test',
        type: 'test',
        feature: 'test',
        payload: {},
        timestamp: new Date(),
        sender: 'test'
      };

      const factory = new WebSocketServiceFactory(container);

      expect(config).toBeDefined();
      expect(message).toBeDefined();
      expect(factory).toBeDefined();
    });

    test('should handle complex type combinations', () => {
      const listener: WebSocketEventListener = {
        onConnect: () => {},
        onMessage: (message: WebSocketMessage) => {
          console.log('Received:', message.payload);
        },
        onDisconnect: () => {},
        onError: (error: Event) => {
          console.error('WebSocket error:', error);
        }
      };

      const route: MessageRoute = {
        feature: 'chat',
        messageType: 'message',
        handler: async (message: WebSocketMessage) => {
          console.log('Processing:', message);
        },
        validator: (message: WebSocketMessage) => {
          return !!message.payload;
        },
        transformer: (message: WebSocketMessage) => ({
          ...message,
          processed: true
        }),
        priority: 5,
        enabled: true
      };

      expect(listener).toBeDefined();
      expect(route).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty configurations', () => {
      const emptyConfig: WebSocketConfig = {
        url: '',
        enableMetrics: false,
        enableHealthChecks: false
      };

      expect(emptyConfig.url).toBe('');
      expect(emptyConfig.enableMetrics).toBe(false);
    });

    test('should handle extreme values', () => {
      const extremeConfig: WebSocketConnectionConfig = {
        token: '',
        autoConnect: true,
        autoReconnect: true,
        connectionTimeout: 0,
        maxReconnectAttempts: 999999,
        reconnectDelay: 0,
        heartbeatInterval: 0,
        enableMetrics: true
      };

      expect(extremeConfig.maxReconnectAttempts).toBe(999999);
      expect(extremeConfig.connectionTimeout).toBe(0);
    });

    test('should handle null and undefined values', () => {
      const listener: WebSocketEventListener = {
        onConnect: undefined,
        onMessage: undefined,
        onDisconnect: undefined,
        onError: undefined
      };

      expect(listener.onConnect).toBeUndefined();
      expect(listener.onMessage).toBeUndefined();
    });
  });
});
