/**
 * WebSocket DI Container.
 * 
 * Dependency injection container for WebSocket services following
 * enterprise architecture patterns.
 */

import { Container } from '../../di/Container.js';
import { TYPES } from '../../di/types.js';
import { EnterpriseWebSocketService } from '../services/EnterpriseWebSocketService.js';
import { ConnectionManager } from '../managers/ConnectionManager.js';
import { MessageRouter } from '../services/MessageRouter.js';
import { WebSocketCacheManager } from '../cache/WebSocketCacheManager.js';
import { LoggerService } from '../../services/LoggerService.js';

// Import types via JSDoc typedefs
/**
 * @typedef {import('../../cache/index.js').CacheServiceManager} CacheServiceManager
 */

/**
 * Create WebSocket Container
 * 
 * Creates and configures the WebSocket dependency injection container
 * with all WebSocket-related services.
 * 
 * @param {Container} parentContainer - Parent DI container
 * @returns {Container} WebSocket DI container
 * @description Creates WebSocket DI container with all services registered
 */
export function createWebSocketContainer(parentContainer) {
    console.log('🌐 Creating WebSocket DI container...');

    const webSocketContainer = parentContainer.createChild();

    // Register WebSocket services as singletons for shared state
    webSocketContainer.registerSingleton(EnterpriseWebSocketService);

    webSocketContainer.registerSingletonByToken(
        TYPES.ENTERPRISE_WEBSOCKET_SERVICE,
        EnterpriseWebSocketService
    );

    // Register Connection Manager
    webSocketContainer.registerSingleton(ConnectionManager);

    webSocketContainer.registerSingletonByToken(
        TYPES.CONNECTION_MANAGER,
        ConnectionManager
    );

    // Register Message Router
    webSocketContainer.registerSingleton(MessageRouter);

    webSocketContainer.registerSingletonByToken(
        TYPES.MESSAGE_ROUTER,
        MessageRouter
    );

    // Register WebSocket Cache Manager
    webSocketContainer.registerSingleton(WebSocketCacheManager);

    webSocketContainer.registerSingletonByToken(
        TYPES.WEBSOCKET_CACHE_MANAGER,
        WebSocketCacheManager
    );

    // Register WebSocket Service Factory
    webSocketContainer.registerSingleton(WebSocketServiceFactory);

    webSocketContainer.registerSingletonByToken(
        TYPES.WEBSOCKET_SERVICE_FACTORY,
        WebSocketServiceFactory
    );

    // Register WebSocket Configuration
    webSocketContainer.registerInstanceByToken(
        TYPES.WEBSOCKET_CONFIG,
        {
            url: process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080',
            reconnectInterval: 3000,
            maxReconnectAttempts: 5,
            timeout: 10000,
            heartbeatInterval: 30000,
            enableCompression: false,
            enableEncryption: false,
            enableMetrics: true,
            enableCacheIntegration: false,
            enableAutoReconnect: true,
            enableMessageValidation: true,
            headers: {},
            subprotocols: []
        }
    );

    // Register WebSocket Connection Pool Configuration
    webSocketContainer.registerInstanceByToken(
        TYPES.WEBSOCKET_CONNECTION_POOL_CONFIG,
        {
            maxConnections: 5,
            healthCheckInterval: 30000,
            connectionTimeout: 10000,
            maxRetries: 3,
            loadBalancingStrategy: 'round-robin',
            enableFailover: true
        }
    );

    // Register WebSocket Cache Configuration
    webSocketContainer.registerInstanceByToken(
        TYPES.WEBSOCKET_CACHE_CONFIG,
        {
            enableAutoInvalidation: true,
            enableMessagePersistence: false,
            enableMetrics: true,
            defaultTTL: 300000,
            maxCacheSize: 1000
        }
    );

    // Register WebSocket Message Router Configuration
    webSocketContainer.registerInstanceByToken(
        TYPES.WEBSOCKET_MESSAGE_ROUTER_CONFIG,
        {
            enableValidation: true,
            enableTransformation: false,
            enableMetrics: true,
            defaultTimeout: 30000,
            maxConcurrentMessages: 100,
            enableQueuing: true,
            maxQueueSize: 1000
        }
    );

    console.log('✅ WebSocket DI container created successfully');
    return webSocketContainer;
}

/**
 * WebSocket Service Factory
 * 
 * @class WebSocketServiceFactory
 * @description Factory for creating WebSocket services
 */
export class WebSocketServiceFactory {
    /**
     * Container instance
     * 
     * @type {Container}
     */
    container;

    /**
     * Logger service
     * 
     * @type {LoggerService}
     */
    logger;

    /**
     * Creates WebSocket service factory
     * 
     * @param {Container} container - DI container
     * @param {LoggerService} [logger] - Logger service
     * @description Initializes WebSocket service factory
     */
    constructor(container, logger) {
        this.container = container;
        this.logger = logger || new LoggerService();
    }

    /**
     * Creates enterprise WebSocket service
     * 
     * @returns {EnterpriseWebSocketService} WebSocket service
     * @description Creates new enterprise WebSocket service
     */
    createEnterpriseWebSocketService() {
        try {
            const config = this.container.getByToken(TYPES.WEBSOCKET_CONFIG);
            const logger = this.container.getByToken(TYPES.LOGGER_SERVICE);
            
            this.logger.info('Creating Enterprise WebSocket service');
            
            return new EnterpriseWebSocketService(config, logger);
        } catch (error) {
            this.logger.error('Failed to create Enterprise WebSocket service:', error);
            throw error;
        }
    }

    /**
     * Creates connection manager
     * 
     * @returns {ConnectionManager} Connection manager
     * @description Creates new connection manager
     */
    createConnectionManager() {
        try {
            const config = this.container.getByToken(TYPES.WEBSOCKET_CONNECTION_POOL_CONFIG);
            const logger = this.container.getByToken(TYPES.LOGGER_SERVICE);
            const cacheService = this.container.getByToken(TYPES.CACHE_SERVICE_MANAGER);
            
            this.logger.info('Creating Connection Manager');
            
            return new ConnectionManager(config, logger, cacheService);
        } catch (error) {
            this.logger.error('Failed to create Connection Manager:', error);
            throw error;
        }
    }

    /**
     * Creates message router
     * 
     * @returns {MessageRouter} Message router
     * @description Creates new message router
     */
    createMessageRouter() {
        try {
            const config = this.container.getByToken(TYPES.WEBSOCKET_MESSAGE_ROUTER_CONFIG);
            const logger = this.container.getByToken(TYPES.LOGGER_SERVICE);
            
            this.logger.info('Creating Message Router');
            
            return new MessageRouter(config, logger);
        } catch (error) {
            this.logger.error('Failed to create Message Router:', error);
            throw error;
        }
    }

    /**
     * Creates WebSocket cache manager
     * 
     * @returns {WebSocketCacheManager} Cache manager
     * @description Creates new WebSocket cache manager
     */
    createWebSocketCacheManager() {
        try {
            const config = this.container.getByToken(TYPES.WEBSOCKET_CACHE_CONFIG);
            const cacheService = this.container.getByToken(TYPES.CACHE_SERVICE_MANAGER);
            const logger = this.container.getByToken(TYPES.LOGGER_SERVICE);
            
            this.logger.info('Creating WebSocket Cache Manager');
            
            return new WebSocketCacheManager(config, cacheService, logger);
        } catch (error) {
            this.logger.error('Failed to create WebSocket Cache Manager:', error);
            throw error;
        }
    }

    /**
     * Creates WebSocket service with configuration
     * 
     * @param {Object} [config] - Service configuration
     * @returns {EnterpriseWebSocketService} Configured WebSocket service
     * @description Creates WebSocket service with custom configuration
     */
    createWebSocketService(config = {}) {
        const defaultConfig = this.container.getByToken(TYPES.WEBSOCKET_CONFIG);
        const mergedConfig = { ...defaultConfig, ...config };
        const logger = this.container.getByToken(TYPES.LOGGER_SERVICE);
        
        return new EnterpriseWebSocketService(mergedConfig, logger);
    }

    /**
     * Creates connection manager with configuration
     * 
     * @param {Object} [config] - Manager configuration
     * @returns {ConnectionManager} Configured connection manager
     * @description Creates connection manager with custom configuration
     */
    createConnectionManagerWithConfig(config = {}) {
        const defaultConfig = this.container.getByToken(TYPES.WEBSOCKET_CONNECTION_POOL_CONFIG);
        const mergedConfig = { ...defaultConfig, ...config };
        const logger = this.container.getByToken(TYPES.LOGGER_SERVICE);
        const cacheService = this.container.getByToken(TYPES.CACHE_SERVICE_MANAGER);
        
        return new ConnectionManager(mergedConfig, logger, cacheService);
    }

    /**
     * Creates message router with configuration
     * 
     * @param {Object} [config] - Router configuration
     * @returns {MessageRouter} Configured message router
     * @description Creates message router with custom configuration
     */
    createMessageRouterWithConfig(config = {}) {
        const defaultConfig = this.container.getByToken(TYPES.WEBSOCKET_MESSAGE_ROUTER_CONFIG);
        const mergedConfig = { ...defaultConfig, ...config };
        const logger = this.container.getByToken(TYPES.LOGGER_SERVICE);
        
        return new MessageRouter(mergedConfig, logger);
    }

    /**
     * Creates WebSocket cache manager with configuration
     * 
     * @param {Object} [config] - Cache configuration
     * @returns {WebSocketCacheManager} Configured cache manager
     * @description Creates cache manager with custom configuration
     */
    createWebSocketCacheManagerWithConfig(config = {}) {
        const defaultConfig = this.container.getByToken(TYPES.WEBSOCKET_CACHE_CONFIG);
        const mergedConfig = { ...defaultConfig, ...config };
        const cacheService = this.container.getByToken(TYPES.CACHE_SERVICE_MANAGER);
        const logger = this.container.getByToken(TYPES.LOGGER_SERVICE);
        
        return new WebSocketCacheManager(mergedConfig, cacheService, logger);
    }
}

/**
 * WebSocket Service Factory Instance
 * 
 * @param {Container} container - DI container
 * @returns {WebSocketServiceFactory} Factory instance
 * @description Creates WebSocket service factory instance
 */
export function createWebSocketServiceFactory(container) {
    const logger = container.getByToken(TYPES.LOGGER_SERVICE);
    return new WebSocketServiceFactory(container, logger);
}

/**
 * Get WebSocket Service from Container
 * 
 * @param {Container} container - DI container
 * @returns {EnterpriseWebSocketService} WebSocket service
 * @description Gets WebSocket service from DI container
 */
export function getWebSocketService(container) {
    return container.getByToken(TYPES.ENTERPRISE_WEBSOCKET_SERVICE);
}

/**
 * Get Connection Manager from Container
 * 
 * @param {Container} container - DI container
 * @returns {ConnectionManager} Connection manager
 * @description Gets connection manager from DI container
 */
export function getConnectionManager(container) {
    return container.getByToken(TYPES.CONNECTION_MANAGER);
}

/**
 * Get Message Router from Container
 * 
 * @param {Container} container - DI container
 * @returns {MessageRouter} Message router
 * @description Gets message router from DI container
 */
export function getMessageRouter(container) {
    return container.getByToken(TYPES.MESSAGE_ROUTER);
}

/**
 * Get WebSocket Cache Manager from Container
 * 
 * @param {Container} container - DI container
 * @returns {WebSocketCacheManager} Cache manager
 * @description Gets cache manager from DI container
 */
export function getWebSocketCacheManager(container) {
    return container.getByToken(TYPES.WEBSOCKET_CACHE_MANAGER);
}

/**
 * Get WebSocket Configuration from Container
 * 
 * @param {Container} container - DI container
 * @returns {Object} WebSocket configuration
 * @description Gets WebSocket configuration from DI container
 */
export function getWebSocketConfig(container) {
    return container.getByToken(TYPES.WEBSOCKET_CONFIG);
}

/**
 * Get WebSocket Service Factory from Container
 * 
 * @param {Container} container - DI container
 * @returns {WebSocketServiceFactory} Service factory
 * @description Gets WebSocket service factory from DI container
 */
export function getWebSocketServiceFactory(container) {
    return container.getByToken(TYPES.WEBSOCKET_SERVICE_FACTORY);
}
