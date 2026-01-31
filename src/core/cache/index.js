/**
 * Cache Module Index - Black Box Pattern
 * 
 * Exports only public interfaces and factory functions.
 * Internal implementation classes are completely hidden.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * Cache provider interface
 * @typedef {Object} ICacheProvider
 * @property {(key: string, value: any, options?: any): Promise<any>} set - Set cache value
 * @property {(key: string): Promise<any>} get - Get cache value
 * @property {(key: string): Promise<boolean>} has - Check if key exists
 * @property {(key: string): Promise<boolean>} delete - Delete cache value
 * @property {(pattern?: string): Promise<void>} clear - Clear cache
 * @property {(): Promise<CacheStats>} getStats - Get cache statistics
 * @property {(): void} cleanup - Cleanup resources
 */

/**
 * Cache service manager interface
 * @typedef {Object} ICacheServiceManager
 * @property {(provider: ICacheProvider): void} registerProvider - Register cache provider
 * @property {(name: string): ICacheProvider} getProvider - Get cache provider
 * @property {(key: string, value: any, options?: any): Promise<any>} set - Set cache value
 * @property {(key: string): Promise<any>} get - Get cache value
 * @property {(key: string): Promise<boolean>} has - Check if key exists
 * @property {(key: string): Promise<boolean>} delete - Delete cache value
 * @property {(pattern?: string): Promise<void>} clear - Clear cache
 * @property {(): Promise<CacheStats>} getStats - Get cache statistics
 * @property {(): void} cleanup - Cleanup resources
 */

/**
 * Cache entry interface
 * @typedef {Object} CacheEntry
 * @property {any} data - Cached data
 * @property {Date} timestamp - Entry timestamp
 * @property {number} [ttl] - Time to live in milliseconds
 * @property {number} [hits] - Number of hits
 * @property {Date} [expiresAt] - Expiration timestamp
 * @property {Object} [metadata] - Entry metadata
 */

/**
 * Cache configuration interface
 * @typedef {Object} CacheConfig
 * @property {string} [type] - Cache type (memory, redis, etc.)
 * @property {number} [ttl] - Default time to live in milliseconds
 * @property {number} [maxSize] - Maximum cache size
 * @property {boolean} [enableStats] - Enable statistics
 * @property {(key: string, value: any): boolean} [shouldCache] - Function to determine if should cache
 * @property {(key: string, value: any): number} [getTTL] - Function to get TTL for key/value
 */

/**
 * Cache statistics interface
 * @typedef {Object} CacheStats
 * @property {number} hits - Number of cache hits
 * @property {number} misses - Number of cache misses
 * @property {number} sets - Number of cache sets
 * @property {number} deletes - Number of cache deletes
 * @property {number} size - Current cache size
 * @property {number} maxSize - Maximum cache size
 * @property {number} hitRate - Cache hit rate percentage
 * @property {Date} [lastAccess] - Last access timestamp
 */

/**
 * Cache events interface
 * @typedef {Object} CacheEvents
 * @property {(event: string, data: any): void} on - Register event listener
 * @property {(event: string, listener: Function): void} off - Remove event listener
 * @property {(event: string, data: any): void} emit - Emit event
 * @property {() => void} removeAllListeners - Remove all listeners
 */

/**
 * Cache service configuration interface
 * @typedef {Object} CacheServiceConfig
 * @property {string} [defaultProvider] - Default cache provider
 * @property {Object} [providers] - Cache provider configurations
 * @property {CacheConfig} [defaultConfig] - Default cache configuration
 * @property {boolean} [enableMetrics] - Enable metrics collection
 * @property {boolean} [enableEvents] - Enable cache events
 */

/**
 * Feature cache service interface
 * @typedef {Object} FeatureCacheService
 * @property {(feature: string, key: string, value: any): Promise<void>} setFeatureCache - Set feature cache
 * @property {(feature: string, key: string): Promise<any>} getFeatureCache - Get feature cache
 * @property {(feature: string, pattern?: string): Promise<void>} clearFeatureCache - Clear feature cache
 * @property {(feature: string): Promise<CacheStats>} getFeatureStats - Get feature statistics
 * @property {(): void} cleanup - Cleanup resources
 */

// Factory functions - Clean service creation
export {
    createCacheProvider,
    createCacheServiceManager,
    createCacheProviderFromDI,
    createCacheServiceManagerFromDI,
    createDefaultCacheProvider,
    createDefaultCacheServiceManager,
    createFeatureCacheProvider,
    createMemoryCacheProvider,
    createSessionCacheProvider,
    createHighPerformanceCacheProvider,
    DEFAULT_CACHE_CONFIG
} from './factory.js';

// Constants - Cache configuration values
export {
    DEFAULT_TTL,
    CACHE_SIZE_LIMITS,
    CLEANUP_INTERVALS,
    CACHE_KEY_PREFIXES,
    CACHE_ERROR_CODES,
    CACHE_EVENTS,
    CACHE_STATS_KEYS,
    FEATURE_CACHE_CONFIGS,
    CACHE_VALIDATION,
    CACHE_PERFORMANCE_THRESHOLDS,
    CACHE_STORAGE_TYPES,
    CACHE_SERIALIZATION_FORMATS
} from './constants.js';
