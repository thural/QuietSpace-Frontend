/**
 * WebSocket DI Container.
 * 
 * Dependency injection container for WebSocket services following
 * enterprise architecture patterns.
 */

import { Container } from '../../di';
import { TYPES } from '../../di/types';
import { EnterpriseWebSocketService, IEnterpriseWebSocketService } from '../services/EnterpriseWebSocketService';
import { ConnectionManager, IConnectionManager } from '../managers/ConnectionManager';
import { MessageRouter, IMessageRouter } from '../services/MessageRouter';
import { CacheServiceManager } from '../../cache';
import { LoggerService } from '../../services/LoggerService';

/**
 * Create WebSocket Container
 * 
 * Creates and configures the WebSocket dependency injection container
 * with all WebSocket-related services.
 */
export function createWebSocketContainer(
  parentContainer: Container
): Container {
  console.log('🌐 Creating WebSocket DI container...');

  const webSocketContainer = parentContainer.createChild();

  // Register WebSocket services as singletons for shared state
  webSocketContainer.registerSingleton<IEnterpriseWebSocketService>(
    EnterpriseWebSocketService
  );

  webSocketContainer.registerSingletonByToken(
    TYPES.ENTERPRISE_WEBSOCKET_SERVICE,
    EnterpriseWebSocketService
  );

  // Register Connection Manager
  webSocketContainer.registerSingleton<IConnectionManager>(
    ConnectionManager
  );

  webSocketContainer.registerSingletonByToken(
    TYPES.CONNECTION_MANAGER,
    ConnectionManager
  );

  // Register Message Router
  webSocketContainer.registerSingleton<IMessageRouter>(
    MessageRouter
  );

  webSocketContainer.registerSingletonByToken(
    TYPES.MESSAGE_ROUTER,
    MessageRouter
  );

  console.log('✅ WebSocket DI container created');
  console.log(`📊 WebSocket Container stats: ${JSON.stringify(webSocketContainer.getStats())}`);

  return webSocketContainer;
}

/**
 * Register WebSocket Services
 * 
 * Registers WebSocket services with the main application container.
 * This function should be called during application initialization.
 */
export function registerWebSocketServices(
  appContainer: Container
): Container {
  console.log('🌐 Registering WebSocket services...');

  // Create WebSocket container as child of app container
  const webSocketContainer = createWebSocketContainer(appContainer);

  // Register the WebSocket container with the app container
  appContainer.registerInstanceByToken(
    TYPES.WEBSOCKET_CONTAINER,
    webSocketContainer
  );

  // Register WebSocket services directly with app container for easy access
  appContainer.registerSingletonByToken(
    TYPES.ENTERPRISE_WEBSOCKET_SERVICE,
    EnterpriseWebSocketService
  );

  appContainer.registerSingletonByToken(
    TYPES.CONNECTION_MANAGER,
    ConnectionManager
  );

  appContainer.registerSingletonByToken(
    TYPES.MESSAGE_ROUTER,
    MessageRouter
  );

  console.log('✅ WebSocket services registered with app container');

  return webSocketContainer;
}

/**
 * Initialize WebSocket Services
 * 
 * Initializes WebSocket services and performs startup configuration.
 * This function should be called after DI container setup.
 */
export async function initializeWebSocketServices(
  container: Container
): Promise<void> {
  console.log('🌐 Initializing WebSocket services...');

  try {
    // Get WebSocket services
    const webSocketService = container.getByToken<IEnterpriseWebSocketService>(
      TYPES.ENTERPRISE_WEBSOCKET_SERVICE
    );

    const connectionManager = container.getByToken<IConnectionManager>(
      TYPES.CONNECTION_MANAGER
    );

    const messageRouter = container.getByToken<IMessageRouter>(
      TYPES.MESSAGE_ROUTER
    );

    const cacheService = container.get<CacheServiceManager>(CacheServiceManager);
    const loggerService = container.get<LoggerService>(LoggerService);

    // Initialize message router with default routes
    console.log('📡 Setting up message routing...');

    // Example: Register chat message routes
    messageRouter.registerRoute({
      feature: 'chat',
      messageType: 'message',
      handler: async (message) => {
        loggerService.info(`[Chat] Message received: ${message.payload.content}`);
        // Cache message for chat history
        const chatCache = cacheService.getCache('chat');
        chatCache.set(`message:${message.payload.chatId}:${message.id}`, message, 3600000); // 1 hour
      },
      validator: (message) => {
        return !!(
          message.payload &&
          message.payload.chatId &&
          message.payload.content &&
          message.payload.senderId
        );
      },
      priority: 5,
      enabled: true
    });

    // Example: Register notification routes
    messageRouter.registerRoute({
      feature: 'notification',
      messageType: 'push',
      handler: async (message) => {
        loggerService.info(`[Notification] Push notification: ${message.payload.title}`);
        // Cache notification for offline access
        const notificationCache = cacheService.getCache('notification');
        notificationCache.set(`notification:${message.id}`, message, 86400000); // 24 hours
      },
      priority: 3,
      enabled: true
    });

    // Example: Register feed update routes
    messageRouter.registerRoute({
      feature: 'feed',
      messageType: 'update',
      handler: async (message) => {
        loggerService.info(`[Feed] Update received: ${message.payload.type}`);
        // Invalidate relevant cache entries
        await cacheService.invalidatePattern('feed:*');
        await cacheService.invalidatePattern('post:*');
      },
      priority: 4,
      enabled: true
    });

    console.log('✅ Message routing configured');

    // Log service status
    console.log('🌐 WebSocket Services Status:');
    console.log(`  - WebSocket Service: ${webSocketService ? '✅ Ready' : '❌ Not Available'}`);
    console.log(`  - Connection Manager: ${connectionManager ? '✅ Ready' : '❌ Not Available'}`);
    console.log(`  - Message Router: ${messageRouter ? '✅ Ready' : '❌ Not Available'}`);

    console.log('✅ WebSocket services initialized successfully');

  } catch (error) {
    console.error('❌ Failed to initialize WebSocket services:', error);
    throw error;
  }
}

/**
 * Get WebSocket Service
 * 
 * Convenience function to get the WebSocket service from the container.
 */
export function getWebSocketService(
  container: Container
): IEnterpriseWebSocketService {
  return container.getByToken<IEnterpriseWebSocketService>(
    TYPES.ENTERPRISE_WEBSOCKET_SERVICE
  );
}

/**
 * Get Connection Manager
 * 
 * Convenience function to get the connection manager from the container.
 */
export function getConnectionManager(
  container: Container
): IConnectionManager {
  return container.getByToken<IConnectionManager>(
    TYPES.CONNECTION_MANAGER
  );
}

/**
 * Get Message Router
 * 
 * Convenience function to get the message router from the container.
 */
export function getMessageRouter(
  container: Container
): IMessageRouter {
  return container.getByToken<IMessageRouter>(
    TYPES.MESSAGE_ROUTER
  );
}

/**
 * WebSocket Service Factory
 * 
 * Factory for creating WebSocket services with specific configurations.
 */
export class WebSocketServiceFactory {
  constructor(private container: Container) { }

  /**
   * Create a WebSocket service for a specific feature
   */
  createFeatureWebSocket(feature: string): IEnterpriseWebSocketService {
    const service = this.container.getByToken<IEnterpriseWebSocketService>(
      TYPES.ENTERPRISE_WEBSOCKET_SERVICE
    );

    // Feature-specific configuration could be applied here
    return service;
  }

  /**
   * Create a connection manager for a specific feature
   */
  createFeatureConnectionManager(feature: string): IConnectionManager {
    const manager = this.container.getByToken<IConnectionManager>(
      TYPES.CONNECTION_MANAGER
    );

    // Feature-specific configuration could be applied here
    return manager;
  }

  /**
   * Create a message router for a specific feature
   */
  createFeatureMessageRouter(feature: string): IMessageRouter {
    const router = this.container.getByToken<IMessageRouter>(
      TYPES.MESSAGE_ROUTER
    );

    // Feature-specific configuration could be applied here
    return router;
  }
}

/**
 * WebSocket Health Check
 * 
 * Performs health checks on all WebSocket services.
 */
export async function performWebSocketHealthCheck(
  container: Container
): Promise<{ healthy: boolean; services: any }> {
  const healthStatus = {
    healthy: true,
    services: {
      webSocketService: 'unknown' as string | object,
      connectionManager: 'unknown' as string | object,
      messageRouter: 'unknown' as string | object
    }
  };

  try {
    // Check WebSocket service
    const webSocketService = getWebSocketService(container);
    const connectionState = webSocketService.getConnectionState();
    healthStatus.services.webSocketService = connectionState;

    if (connectionState === 'error') {
      healthStatus.healthy = false;
    }

    // Check connection manager
    const connectionManager = getConnectionManager(container);
    const connections = connectionManager.getAllConnections();
    healthStatus.services.connectionManager = {
      totalConnections: connections.length,
      activeConnections: connections.filter(c => c.isActive).length,
      averageHealthScore: connections.reduce((sum, c) => sum + c.healthScore, 0) / connections.length || 0
    };

    // Check message router
    const messageRouter = getMessageRouter(container);
    const metrics = messageRouter.getMetrics();
    healthStatus.services.messageRouter = {
      totalMessages: metrics.totalMessages,
      messagesRouted: metrics.messagesRouted,
      averageProcessingTime: metrics.averageProcessingTime
    };

  } catch (error) {
    console.error('WebSocket health check failed:', error);
    healthStatus.healthy = false;
  }

  return healthStatus;
}
