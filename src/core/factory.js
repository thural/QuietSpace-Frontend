/**
 * Core System Factory Functions
 * 
 * Factory functions for creating core system services following Black Box pattern.
 * Provides clean service creation with dependency injection support.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./types.js').ICoreServices} ICoreServices
 * @typedef {import('./types.js').ICacheService} ICacheService
 * @typedef {import('./types.js').ICacheServiceManager} ICacheServiceManager
 * @typedef {import('./types.js').IWebSocketService} IWebSocketService
 * @typedef {import('./types.js').IAuthService} IAuthService
 * @typedef {import('./types.js').IThemeService} IThemeService
 * @typedef {import('./types.js').ILoggerService} ILoggerService
 * @typedef {import('./types.js').INetworkService} INetworkService
 * @typedef {import('./types.js').IServiceContainer} IServiceContainer
 * @typedef {import('./config.js').CoreConfig} CoreConfig
 * @typedef {import('./config.js').CacheConfig} CacheConfig
 * @typedef {import('./config.js').WebSocketConfig} WebSocketConfig
 * @typedef {import('./config.js').ThemeConfig} ThemeConfig
 * @typedef {import('./config.js').ServiceConfig} ServiceConfig
 */

import { createCacheServiceManager } from './cache/index.js';
import { createDefaultAuthService } from './auth/index.js';
import { createTheme } from './theme/index.js';
import { createLogger } from './services/index.js';
import { createApiClient } from './network/index.js';
import { Container } from './di/index.js';

/**
 * Creates a complete core services instance
 * 
 * @function createCoreServices
 * @param {CoreConfig} [config] - Optional core configuration
 * @returns {ICoreServices} Configured core services
 * @description Creates a complete core services instance with all subsystems
 */
export function createCoreServices(config) {
    const container = createServiceContainer();

    // Create individual services
    const cache = createCacheServiceManager(config?.cache);
    const auth = createDefaultAuthService(config?.auth);
    const theme = createTheme(config?.theme);
    const services = createLogger(config?.services);
    const network = createApiClient(config?.network);

    // WebSocket service would be created here if available
    const websocket = {}; // Placeholder for WebSocket service

    // Register services in container
    container.registerInstance('cache', cache);
    container.registerInstance('auth', auth);
    container.registerInstance('theme', theme);
    container.registerInstance('services', services);
    container.registerInstance('network', network);
    container.registerInstance('websocket', websocket);

    return {
        container,
        cache,
        auth,
        theme,
        services,
        network,
        websocket
    };
}

/**
 * Creates a service container for dependency injection
 * 
 * @function createServiceContainer
 * @param {ServiceConfig} [config] - Optional service configuration
 * @returns {IServiceContainer} Configured service container
 * @description Creates a service container with dependency injection
 */
export function createServiceContainer(config) {
    const container = new Container();
    
    // Configure container if config provided
    if (config) {
        if (config.enableDI) {
            // Configure dependency injection
            container.enableAutoRegistration = true;
        }
        
        if (config.enableDiscovery) {
            // Configure service discovery
            container.enableServiceDiscovery = true;
        }
        
        if (config.registryUrl) {
            // Configure service registry
            container.setRegistryUrl(config.registryUrl);
        }
        
        if (config.healthCheckInterval) {
            // Configure health checking
            container.setHealthCheckInterval(config.healthCheckInterval);
        }
        
        if (config.enableMetrics) {
            // Enable metrics collection
            container.enableMetrics();
        }
    }

    return container;
}

/**
 * Creates cache service with configuration
 * 
 * @function createCacheService
 * @param {CacheConfig} [config] - Optional cache configuration
 * @returns {ICacheServiceManager} Configured cache service
 * @description Creates a cache service with specified configuration
 */
export function createCacheService(config) {
    return createCacheServiceManager(config);
}

/**
 * Creates authentication service with configuration
 * 
 * @function createAuthService
 * @param {Object} [config] - Optional authentication configuration
 * @returns {IAuthService} Configured authentication service
 * @description Creates an authentication service with specified configuration
 */
export function createAuthService(config) {
    return createDefaultAuthService(config);
}

/**
 * Creates theme service with configuration
 * 
 * @function createThemeService
 * @param {ThemeConfig} [config] - Optional theme configuration
 * @returns {IThemeService} Configured theme service
 * @description Creates a theme service with specified configuration
 */
export function createThemeService(config) {
    return createTheme(config);
}

/**
 * Creates logger service with configuration
 * 
 * @function createLoggerService
 * @param {ServiceConfig} [config] - Optional logger configuration
 * @returns {ILoggerService} Configured logger service
 * @description Creates a logger service with specified configuration
 */
export function createLoggerService(config) {
    return createLogger(config);
}

/**
 * Creates network service with configuration
 * 
 * @function createNetworkService
 * @param {Object} [config] - Optional network configuration
 * @returns {INetworkService} Configured network service
 * @description Creates a network service with specified configuration
 */
export function createNetworkService(config) {
    return createApiClient(config);
}

/**
 * Creates WebSocket service with configuration
 * 
 * @function createWebSocketService
 * @param {WebSocketConfig} [config] - Optional WebSocket configuration
 * @returns {IWebSocketService} Configured WebSocket service
 * @description Creates a WebSocket service with specified configuration
 */
export function createWebSocketService(config) {
    // Placeholder implementation
    return {
        connect: () => Promise.resolve(),
        disconnect: () => Promise.resolve(),
        send: () => Promise.resolve(),
        on: () => {},
        off: () => {},
        isConnected: () => false
    };
}

/**
 * Creates a minimal core services instance for testing
 * 
 * @function createTestCoreServices
 * @returns {ICoreServices} Minimal core services for testing
 * @description Creates a minimal core services instance suitable for testing
 */
export function createTestCoreServices() {
    const container = createServiceContainer({ enableMetrics: false });
    
    // Create mock services for testing
    const cache = createCacheService({ maxSize: 10, defaultTtl: 60000 });
    const auth = createAuthService({ sessionTimeout: 300000 });
    const theme = createThemeService({ name: 'test', variant: 'light' });
    const services = createLoggerService({ logLevel: 'error' });
    const network = createNetworkService({ timeout: 5000 });
    const websocket = createWebSocketService({ reconnectInterval: 1000 });

    return {
        container,
        cache,
        auth,
        theme,
        services,
        network,
        websocket
    };
}

/**
 * Creates a development core services instance
 * 
 * @function createDevelopmentCoreServices
 * @returns {ICoreServices} Development core services
 * @description Creates a core services instance optimized for development
 */
export function createDevelopmentCoreServices() {
    const config = {
        cache: {
            maxSize: 100,
            defaultTtl: 300000, // 5 minutes
            enableMetrics: true
        },
        auth: {
            tokenRefreshInterval: 60000, // 1 minute
            sessionTimeout: 1800000, // 30 minutes
            enableTwoFactorAuth: false
        },
        theme: {
            name: 'development',
            variant: 'light'
        },
        services: {
            logLevel: 'debug',
            enableMetrics: true
        },
        network: {
            timeout: 10000,
            retryAttempts: 2
        }
    };

    return createCoreServices(config);
}

/**
 * Creates a production core services instance
 * 
 * @function createProductionCoreServices
 * @returns {ICoreServices} Production core services
 * @description Creates a core services instance optimized for production
 */
export function createProductionCoreServices() {
    const config = {
        cache: {
            maxSize: 10000,
            defaultTtl: 3600000, // 1 hour
            enableMetrics: true
        },
        auth: {
            tokenRefreshInterval: 300000, // 5 minutes
            sessionTimeout: 7200000, // 2 hours
            enableTwoFactorAuth: true
        },
        theme: {
            name: 'production',
            variant: 'light'
        },
        services: {
            logLevel: 'error',
            enableMetrics: true
        },
        network: {
            timeout: 30000,
            retryAttempts: 3
        }
    };

    return createCoreServices(config);
}

/**
 * Creates a test core services instance
 * 
 * @function createTestCoreServices
 * @returns {ICoreServices} Test core services
 * @description Creates a core services instance optimized for testing
 */
export function createTestCoreServices() {
    const config = {
        cache: {
            maxSize: 50,
            defaultTtl: 60000, // 1 minute
            enableMetrics: false
        },
        auth: {
            tokenRefreshInterval: 30000, // 30 seconds
            sessionTimeout: 600000, // 10 minutes
            enableTwoFactorAuth: false
        },
        theme: {
            name: 'test',
            variant: 'light'
        },
        services: {
            logLevel: 'silent',
            enableMetrics: false
        },
        network: {
            timeout: 5000,
            retryAttempts: 1
        }
    };

    return createCoreServices(config);
}

/**
 * Validates core services configuration
 * 
 * @function validateCoreServicesConfig
 * @param {CoreConfig} config - Configuration to validate
 * @returns {string[]} Array of validation errors
 * @description Validates core services configuration and returns errors
 */
export function validateCoreServicesConfig(config) {
    const errors = [];

    if (!config || typeof config !== 'object') {
        errors.push('Configuration must be an object');
        return errors;
    }

    // Validate cache config
    if (config.cache) {
        if (config.cache.maxSize !== undefined && (typeof config.cache.maxSize !== 'number' || config.cache.maxSize < 1)) {
            errors.push('Cache maxSize must be a positive number');
        }
        
        if (config.cache.defaultTtl !== undefined && (typeof config.cache.defaultTtl !== 'number' || config.cache.defaultTtl < 1000)) {
            errors.push('Cache defaultTtl must be at least 1000ms');
        }
    }

    // Validate auth config
    if (config.auth) {
        if (config.auth.tokenRefreshInterval !== undefined && (typeof config.auth.tokenRefreshInterval !== 'number' || config.auth.tokenRefreshInterval < 60000)) {
            errors.push('Auth tokenRefreshInterval must be at least 60000ms');
        }
        
        if (config.auth.sessionTimeout !== undefined && (typeof config.auth.sessionTimeout !== 'number' || config.auth.sessionTimeout < 300000)) {
            errors.push('Auth sessionTimeout must be at least 300000ms');
        }
    }

    return errors;
}
