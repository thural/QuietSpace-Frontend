/**
 * Cache Module Factory Functions
 * 
 * Provides factory functions for creating cache services following Black Box pattern.
 * Consumers use these factories to get configured cache instances.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./interfaces.js').ICacheProvider} ICacheProvider
 * @typedef {import('./interfaces.js').ICacheServiceManager} ICacheServiceManager
 * @typedef {import('./interfaces.js').CacheConfig} CacheConfig
 * @typedef {import('./interfaces.js').CacheServiceConfig} CacheServiceConfig
 * @typedef {import('./interfaces.js').CacheEvents} CacheEvents
 */

// Import DI types
/**
 * @typedef {import('../di/container/Container.js').Container} Container
 * @typedef {import('../di/types.js').TYPES} TYPES
 */

// Import constants
import { DEFAULT_TTL, CACHE_SIZE_LIMITS, CLEANUP_INTERVALS, FEATURE_CACHE_CONFIGS } from './constants.js';

/**
 * Creates a cache provider with the specified configuration.
 * 
 * @function createCacheProvider
 * @param {Object} [config] - Cache configuration options
 * @param {CacheEvents} [events] - Optional cache event handlers
 * @returns {ICacheProvider} Configured cache provider instance
 * @description Creates a new cache provider with optional configuration
 */
export function createCacheProvider(config = {}, events = undefined) {
    // Create default configuration
    const defaultConfig = {
        defaultTTL: DEFAULT_TTL.FIVE_MINUTES,
        maxSize: CACHE_SIZE_LIMITS.DEFAULT,
        cleanupInterval: CLEANUP_INTERVALS.MINUTE,
        enableStats: true,
        enableLRU: true
    };

    const finalConfig = { ...defaultConfig, ...config };

    // Return a mock implementation for now
    // In a real implementation, this would return an actual CacheProvider instance
    return /** @type {ICacheProvider} */ ({
        get: (key) => null,
        getEntry: (key) => null,
        set: (key, data, ttl) => { },
        invalidate: (key) => false,
        delete: (key) => false,
        invalidatePattern: (pattern) => 0,
        clear: () => { },
        has: (key) => false,
        getStats: () => ({
            size: 0,
            hits: 0,
            misses: 0,
            hitRate: 0,
            evictions: 0,
            totalRequests: 0
        }),
        getConfig: () => finalConfig,
        updateConfig: (newConfig) => {
            Object.assign(finalConfig, /** @type {any} */(newConfig));
        },
        dispose: () => { }
    });
}

/**
 * Creates a cache service manager with the specified configuration.
 * 
 * @function createCacheServiceManager
 * @param {Object} [config] - Cache service configuration
 * @returns {ICacheServiceManager} Configured cache service manager instance
 * @description Creates a new cache service manager with optional configuration
 */
export function createCacheServiceManager(config = {}) {
    const defaultConfig = {
        defaultCache: {
            defaultTTL: DEFAULT_TTL.FIVE_MINUTES,
            maxSize: CACHE_SIZE_LIMITS.DEFAULT,
            cleanupInterval: CLEANUP_INTERVALS.MINUTE,
            enableStats: true,
            enableLRU: true
        },
        featureCaches: {}
    };

    const finalConfig = { ...defaultConfig, ...config };

    // Return a mock implementation for now
    // In a real implementation, this would return an actual CacheServiceManager instance
    return /** @type {ICacheServiceManager} */ ({
        getCache: (featureName) => {
            const featureCaches = /** @type {Record<string, Object>} */ (finalConfig.featureCaches);
            return createCacheProvider(featureCaches[featureName]);
        },
        invalidateFeature: (featureName) => { },
        invalidatePattern: (pattern) => 0,
        getGlobalStats: () => ({}),
        dispose: () => { }
    });
}

/**
 * Creates a cache provider using dependency injection container.
 * 
 * @function createCacheProviderFromDI
 * @param {Container} container - DI container instance
 * @param {Object} [config] - Optional cache configuration
 * @param {CacheEvents} [events] - Optional cache event handlers
 * @returns {ICacheProvider} Cache provider from DI container
 * @description Creates cache provider using DI container with fallback
 */
export function createCacheProviderFromDI(container, config = {}, events = undefined) {
    // Try to get from DI container first
    try {
        // Note: CACHE_SERVICE token may not be registered, fallback to direct creation
        return container.getByToken(/** @type {any} */('CACHE_SERVICE'));
    } catch {
        // Fallback to direct creation
        return createCacheProvider(config, events);
    }
}

/**
 * Creates a cache service manager using dependency injection container.
 * 
 * @function createCacheServiceManagerFromDI
 * @param {Container} container - DI container instance
 * @param {Object} [config] - Optional cache service configuration
 * @returns {ICacheServiceManager} Cache service manager from DI container
 * @description Creates cache service manager using DI container with fallback
 */
export function createCacheServiceManagerFromDI(container, config = {}) {
    // Try to get from DI container first
    try {
        // Note: CACHE_SERVICE_MANAGER token may not be registered, fallback to direct creation
        return container.getByToken(/** @type {any} */('CACHE_SERVICE_MANAGER'));
    } catch {
        // Fallback to direct creation
        return createCacheServiceManager(config);
    }
}

/**
 * Default cache configuration for common use cases.
 */
export const DEFAULT_CACHE_CONFIG = {
    defaultTTL: 300000, // 5 minutes
    maxSize: 1000,
    cleanupInterval: 60000, // 1 minute
    enableStats: true,
    enableLRU: true
};

/**
 * Creates a cache provider with default configuration.
 * 
 * @function createDefaultCacheProvider
 * @param {CacheEvents} [events] - Optional cache event handlers
 * @returns {ICacheProvider} Cache provider with default configuration
 * @description Creates cache provider with default configuration
 */
export function createDefaultCacheProvider(events = undefined) {
    return createCacheProvider(DEFAULT_CACHE_CONFIG, events);
}

/**
 * Creates a cache service manager with default configuration.
 * 
 * @function createDefaultCacheServiceManager
 * @returns {ICacheServiceManager} Cache service manager with default configuration
 * @description Creates cache service manager with default configuration
 */
export function createDefaultCacheServiceManager() {
    return createCacheServiceManager({
        defaultCache: DEFAULT_CACHE_CONFIG
    });
}

/**
 * Creates a feature-specific cache provider
 * 
 * @function createFeatureCacheProvider
 * @param {string} feature - Feature name
 * @param {Object} [config] - Optional override configuration
 * @returns {ICacheProvider} Feature-specific cache provider
 * @description Creates cache provider configured for specific feature
 */
export function createFeatureCacheProvider(feature, config = {}) {
    // Use the imported FEATURE_CACHE_CONFIGS directly
    const configs = /** @type {Record<string, Object>} */ (FEATURE_CACHE_CONFIGS);
    const featureConfig = configs[feature.toUpperCase()];

    const finalConfig = { ...featureConfig, ...config };

    return createCacheProvider(finalConfig);
}

/**
 * Creates a memory-based cache provider
 * 
 * @function createMemoryCacheProvider
 * @param {Object} [config] - Optional cache configuration
 * @returns {ICacheProvider} Memory-based cache provider
 * @description Creates cache provider that stores data in memory
 */
export function createMemoryCacheProvider(config = {}) {
    const memoryConfig = {
        defaultTTL: DEFAULT_TTL.FIFTEEN_MINUTES,
        maxSize: CACHE_SIZE_LIMITS.DEFAULT,
        cleanupInterval: CLEANUP_INTERVALS.FIVE_MINUTES,
        enableStats: true,
        enableLRU: true,
        ...config
    };

    return createCacheProvider(memoryConfig);
}

/**
 * Creates a session-based cache provider
 * 
 * @function createSessionCacheProvider
 * @param {Object} [config] - Optional cache configuration
 * @returns {ICacheProvider} Session-based cache provider
 * @description Creates cache provider that stores data in session storage
 */
export function createSessionCacheProvider(config = {}) {
    const sessionConfig = {
        defaultTTL: DEFAULT_TTL.HOUR,
        maxSize: CACHE_SIZE_LIMITS.MIN,
        cleanupInterval: CLEANUP_INTERVALS.DISABLED,
        enableStats: false,
        enableLRU: false,
        ...config
    };

    return createCacheProvider(sessionConfig);
}

/**
 * Creates a high-performance cache provider for frequently accessed data
 * 
 * @function createHighPerformanceCacheProvider
 * @param {Object} [config] - Optional cache configuration
 * @returns {ICacheProvider} High-performance cache provider
 * @description Creates cache provider optimized for performance
 */
export function createHighPerformanceCacheProvider(config = {}) {
    const perfConfig = {
        defaultTTL: DEFAULT_TTL.MINUTE,
        maxSize: CACHE_SIZE_LIMITS.LARGE,
        cleanupInterval: CLEANUP_INTERVALS.MINUTE,
        enableStats: false, // Disable stats for performance
        enableLRU: true,
        ...config
    };

    return createCacheProvider(perfConfig);
}
