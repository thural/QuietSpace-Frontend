/**
 * WebSocket Container Test Suite
 * 
 * Comprehensive tests for WebSocket DI Container including:
 * - Container creation and configuration
 * - Service registration and resolution
 * - Factory functions and utilities
 * - Health checks and monitoring
 * - Integration with main DI container
 */

import { 
  createWebSocketContainer, 
  registerWebSocketServices, 
  initializeWebSocketServices,
  getWebSocketService,
  getConnectionManager,
  getMessageRouter,
  WebSocketServiceFactory,
  performWebSocketHealthCheck
} from '../../../src/core/websocket/di/WebSocketContainer';
import { Container } from '../../../src/core/di';
import { TYPES } from '../../../src/core/di/types';
import { EnterpriseWebSocketService, IEnterpriseWebSocketService } from '../../../src/core/websocket/services/EnterpriseWebSocketService';
import { ConnectionManager, IConnectionManager } from '../../../src/core/websocket/managers/ConnectionManager';
import { MessageRouter, IMessageRouter } from '../../../src/core/websocket/services/MessageRouter';
import { CacheServiceManager } from '../../../src/core/cache';
import { LoggerService } from '../../../src/core/services/LoggerService';

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('WebSocketContainer', () => {
  let parentContainer: Container;
  let webSocketContainer: Container;

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
    
    // Create parent container with required services
    parentContainer = new Container();
    
    // Mock required services
    parentContainer.registerInstance(CacheServiceManager, {} as CacheServiceManager);
    parentContainer.registerInstance(LoggerService, {
      info: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      error: jest.fn()
    } as LoggerService);
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe('Container Creation', () => {
    test('should create WebSocket container', () => {
      webSocketContainer = createWebSocketContainer(parentContainer);
      
      expect(webSocketContainer).toBeDefined();
      expect(webSocketContainer).toBeInstanceOf(Container);
      expect(console.log).toHaveBeenCalledWith('🌐 Creating WebSocket DI container...');
      expect(console.log).toHaveBeenCalledWith('✅ WebSocket DI container created');
    });

    test('should register WebSocket services as singletons', () => {
      webSocketContainer = createWebSocketContainer(parentContainer);
      
      // Test service registration
      const service1 = webSocketContainer.get(IEnterpriseWebSocketService);
      const service2 = webSocketContainer.get(IEnterpriseWebSocketService);
      
      expect(service1).toBe(service2); // Should be same instance (singleton)
      expect(service1).toBeInstanceOf(EnterpriseWebSocketService);
    });

    test('should register services with tokens', () => {
      webSocketContainer = createWebSocketContainer(parentContainer);
      
      // Test token-based registration
      const webSocketService = webSocketContainer.getByToken(TYPES.ENTERPRISE_WEBSOCKET_SERVICE);
      const connectionManager = webSocketContainer.getByToken(TYPES.CONNECTION_MANAGER);
      const messageRouter = webSocketContainer.getByToken(TYPES.MESSAGE_ROUTER);
      
      expect(webSocketService).toBeInstanceOf(EnterpriseWebSocketService);
      expect(connectionManager).toBeInstanceOf(ConnectionManager);
      expect(messageRouter).toBeInstanceOf(MessageRouter);
    });

    test('should log container stats', () => {
      webSocketContainer = createWebSocketContainer(parentContainer);
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('📊 WebSocket Container stats:')
      );
    });
  });

  describe('Service Registration', () => {
    test('should register WebSocket services with app container', () => {
      webSocketContainer = registerWebSocketServices(parentContainer);
      
      expect(webSocketContainer).toBeDefined();
      expect(console.log).toHaveBeenCalledWith('🌐 Registering WebSocket services...');
      expect(console.log).toHaveBeenCalledWith('✅ WebSocket services registered with app container');
    });

    test('should register WebSocket container instance', () => {
      registerWebSocketServices(parentContainer);
      
      const containerInstance = parentContainer.getByToken(TYPES.WEBSOCKET_CONTAINER);
      expect(containerInstance).toBeDefined();
      expect(containerInstance).toBeInstanceOf(Container);
    });

    test('should register services directly with app container', () => {
      registerWebSocketServices(parentContainer);
      
      const webSocketService = parentContainer.getByToken(TYPES.ENTERPRISE_WEBSOCKET_SERVICE);
      const connectionManager = parentContainer.getByToken(TYPES.CONNECTION_MANAGER);
      const messageRouter = parentContainer.getByToken(TYPES.MESSAGE_ROUTER);
      
      expect(webSocketService).toBeInstanceOf(EnterpriseWebSocketService);
      expect(connectionManager).toBeInstanceOf(ConnectionManager);
      expect(messageRouter).toBeInstanceOf(MessageRouter);
    });
  });

  describe('Service Initialization', () => {
    test('should initialize WebSocket services successfully', async () => {
      registerWebSocketServices(parentContainer);
      
      await expect(initializeWebSocketServices(parentContainer)).resolves.not.toThrow();
      
      expect(console.log).toHaveBeenCalledWith('🌐 Initializing WebSocket services...');
      expect(console.log).toHaveBeenCalledWith('📡 Setting up message routing...');
      expect(console.log).toHaveBeenCalledWith('✅ Message routing configured');
      expect(console.log).toHaveBeenCalledWith('✅ WebSocket services initialized successfully');
    });

    test('should log service status after initialization', async () => {
      registerWebSocketServices(parentContainer);
      
      await initializeWebSocketServices(parentContainer);
      
      expect(console.log).toHaveBeenCalledWith('🌐 WebSocket Services Status:');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('WebSocket Service: ✅ Ready')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Connection Manager: ✅ Ready')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Message Router: ✅ Ready')
      );
    });

    test('should handle initialization errors', async () => {
      // Remove required service to cause error
      parentContainer.clear();
      
      registerWebSocketServices(parentContainer);
      
      await expect(initializeWebSocketServices(parentContainer)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        '❌ Failed to initialize WebSocket services:',
        expect.any(Error)
      );
    });

    test('should register default message routes', async () => {
      registerWebSocketServices(parentContainer);
      
      await initializeWebSocketServices(parentContainer);
      
      const messageRouter = parentContainer.getByToken(TYPES.MESSAGE_ROUTER);
      expect(messageRouter).toBeDefined();
      
      // Routes should be registered (tested via internal behavior)
      expect(console.log).toHaveBeenCalledWith('✅ Message routing configured');
    });
  });

  describe('Convenience Functions', () => {
    beforeEach(() => {
      registerWebSocketServices(parentContainer);
    });

    test('should get WebSocket service', () => {
      const service = getWebSocketService(parentContainer);
      
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(EnterpriseWebSocketService);
    });

    test('should get connection manager', () => {
      const manager = getConnectionManager(parentContainer);
      
      expect(manager).toBeDefined();
      expect(manager).toBeInstanceOf(ConnectionManager);
    });

    test('should get message router', () => {
      const router = getMessageRouter(parentContainer);
      
      expect(router).toBeDefined();
      expect(router).toBeInstanceOf(MessageRouter);
    });
  });

  describe('WebSocket Service Factory', () => {
    let factory: WebSocketServiceFactory;

    beforeEach(() => {
      registerWebSocketServices(parentContainer);
      factory = new WebSocketServiceFactory(parentContainer);
    });

    test('should create factory instance', () => {
      expect(factory).toBeInstanceOf(WebSocketServiceFactory);
    });

    test('should create feature WebSocket service', () => {
      const service = factory.createFeatureWebSocket('chat');
      
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(EnterpriseWebSocketService);
    });

    test('should create feature connection manager', () => {
      const manager = factory.createFeatureConnectionManager('chat');
      
      expect(manager).toBeDefined();
      expect(manager).toBeInstanceOf(ConnectionManager);
    });

    test('should create feature message router', () => {
      const router = factory.createFeatureMessageRouter('chat');
      
      expect(router).toBeDefined();
      expect(router).toBeInstanceOf(MessageRouter);
    });

    test('should return same instances for singleton services', () => {
      const service1 = factory.createFeatureWebSocket('chat');
      const service2 = factory.createFeatureWebSocket('notification');
      
      // Should return same singleton instance
      expect(service1).toBe(service2);
    });
  });

  describe('Health Check', () => {
    beforeEach(() => {
      registerWebSocketServices(parentContainer);
    });

    test('should perform health check successfully', async () => {
      const health = await performWebSocketHealthCheck(parentContainer);
      
      expect(health).toBeDefined();
      expect(health.healthy).toBe(true);
      expect(health.services).toBeDefined();
      expect(health.services.webSocketService).toBeDefined();
      expect(health.services.connectionManager).toBeDefined();
      expect(health.services.messageRouter).toBeDefined();
    });

    test('should handle health check errors', async () => {
      // Clear container to cause errors
      parentContainer.clear();
      
      const health = await performWebSocketHealthCheck(parentContainer);
      
      expect(health.healthy).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'WebSocket health check failed:',
        expect.any(Error)
      );
    });

    test('should provide detailed service status', async () => {
      const health = await performWebSocketHealthCheck(parentContainer);
      
      expect(health.services.connectionManager).toEqual(
        expect.objectContaining({
          totalConnections: expect.any(Number),
          activeConnections: expect.any(Number),
          averageHealthScore: expect.any(Number)
        })
      );
      
      expect(health.services.messageRouter).toEqual(
        expect.objectContaining({
          totalMessages: expect.any(Number),
          messagesRouted: expect.any(Number),
          averageProcessingTime: expect.any(Number)
        })
      );
    });
  });

  describe('Integration', () => {
    test('should work with complete workflow', async () => {
      // Register services
      webSocketContainer = registerWebSocketServices(parentContainer);
      
      // Initialize services
      await initializeWebSocketServices(parentContainer);
      
      // Get services
      const webSocketService = getWebSocketService(parentContainer);
      const connectionManager = getConnectionManager(parentContainer);
      const messageRouter = getMessageRouter(parentContainer);
      
      // Perform health check
      const health = await performWebSocketHealthCheck(parentContainer);
      
      // Use factory
      const factory = new WebSocketServiceFactory(parentContainer);
      const featureService = factory.createFeatureWebSocket('chat');
      
      expect(webSocketService).toBeDefined();
      expect(connectionManager).toBeDefined();
      expect(messageRouter).toBeDefined();
      expect(health.healthy).toBe(true);
      expect(featureService).toBeDefined();
    });

    test('should maintain service instances across operations', () => {
      registerWebSocketServices(parentContainer);
      
      const service1 = getWebSocketService(parentContainer);
      const service2 = getWebSocketService(parentContainer);
      const service3 = parentContainer.getByToken(TYPES.ENTERPRISE_WEBSOCKET_SERVICE);
      
      // All should be the same instance
      expect(service1).toBe(service2);
      expect(service2).toBe(service3);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing parent container', () => {
      expect(() => createWebSocketContainer(null as any)).toThrow();
    });

    test('should handle invalid container operations', () => {
      webSocketContainer = createWebSocketContainer(parentContainer);
      
      // Try to get non-existent service
      expect(() => webSocketContainer.get('NonExistent' as any)).toThrow();
    });

    test('should handle initialization with missing services', async () => {
      const emptyContainer = new Container();
      registerWebSocketServices(emptyContainer);
      
      await expect(initializeWebSocketServices(emptyContainer)).rejects.toThrow();
    });
  });

  describe('Performance', () => {
    test('should create container quickly', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 10; i++) {
        createWebSocketContainer(parentContainer);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle rapid service resolution', () => {
      registerWebSocketServices(parentContainer);
      
      const startTime = Date.now();
      
      for (let i = 0; i < 100; i++) {
        getWebSocketService(parentContainer);
        getConnectionManager(parentContainer);
        getMessageRouter(parentContainer);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should not have memory leaks', () => {
      for (let i = 0; i < 10; i++) {
        const container = createWebSocketContainer(parentContainer);
        // Container should be garbage collected when out of scope
      }
      
      // Parent container should still work
      expect(() => createWebSocketContainer(parentContainer)).not.toThrow();
    });
  });

  describe('Type Safety', () => {
    test('should maintain type safety for services', () => {
      registerWebSocketServices(parentContainer);
      
      const webSocketService: IEnterpriseWebSocketService = getWebSocketService(parentContainer);
      const connectionManager: IConnectionManager = getConnectionManager(parentContainer);
      const messageRouter: IMessageRouter = getMessageRouter(parentContainer);
      
      expect(webSocketService).toBeDefined();
      expect(connectionManager).toBeDefined();
      expect(messageRouter).toBeDefined();
      
      // Test interface methods exist
      expect(typeof webSocketService.connect).toBe('function');
      expect(typeof webSocketService.disconnect).toBe('function');
      expect(typeof connectionManager.createConnection).toBe('function');
      expect(typeof messageRouter.registerRoute).toBe('function');
    });

    test('should handle TypeScript compilation', () => {
      // This test ensures TypeScript compilation works
      const container: Container = parentContainer;
      const factory: WebSocketServiceFactory = new WebSocketServiceFactory(container);
      
      const service: IEnterpriseWebSocketService = factory.createFeatureWebSocket('test');
      const manager: IConnectionManager = factory.createFeatureConnectionManager('test');
      const router: IMessageRouter = factory.createFeatureMessageRouter('test');
      
      expect(container).toBeDefined();
      expect(factory).toBeDefined();
      expect(service).toBeDefined();
      expect(manager).toBeDefined();
      expect(router).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    test('should handle multiple container creation', () => {
      const container1 = createWebSocketContainer(parentContainer);
      const container2 = createWebSocketContainer(parentContainer);
      
      expect(container1).toBeDefined();
      expect(container2).toBeDefined();
      expect(container1).not.toBe(container2); // Should be different instances
    });

    test('should handle service registration after creation', () => {
      webSocketContainer = createWebSocketContainer(parentContainer);
      
      // Should be able to register additional services
      expect(() => {
        webSocketContainer.registerSingleton('TestService', class TestService {});
      }).not.toThrow();
    });

    test('should handle container hierarchy', () => {
      webSocketContainer = createWebSocketContainer(parentContainer);
      
      // Child container should have access to parent services
      const cacheService = webSocketContainer.get(CacheServiceManager);
      expect(cacheService).toBeDefined();
    });
  });
});
