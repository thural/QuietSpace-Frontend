/**
 * Cache Module Interfaces
 * 
 * Defines public interfaces for the cache system following Black Box pattern.
 * Internal implementation details are hidden from consumers.
 */

/**
 * Cache provider interface
 * 
 * @interface ICacheProvider
 * @description Defines contract for cache providers with full CRUD operations
 */
export class ICacheProvider {
    /**
     * Creates a cache provider
     * 
     * @constructor
     * @description Creates a new cache provider instance
     */
    constructor() {
        // Initialize provider properties
    }

    /**
     * Gets cached data by key
     * 
     * @template T
     * @param {string} key - Cache key
     * @returns {T|null} Cached data or null if not found
     * @description Retrieves cached data by key
     */
    get(key) {
        throw new Error('Method get() must be implemented by subclass');
    }

    /**
     * Gets cache entry with metadata
     * 
     * @template T
     * @param {string} key - Cache key
     * @returns {CacheEntry<T>|null} Cache entry or null if not found
     * @description Retrieves cache entry with full metadata
     */
    getEntry(key) {
        throw new Error('Method getEntry() must be implemented by subclass');
    }

    /**
     * Sets cached data
     * 
     * @template T
     * @param {string} key - Cache key
     * @param {T} data - Data to cache
     * @param {number} [ttl] - Time to live in milliseconds
     * @returns {void}
     * @description Stores data in cache with optional TTL
     */
    set(key, data, ttl) {
        throw new Error('Method set() must be implemented by subclass');
    }

    /**
     * Invalidates cached data
     * 
     * @param {string} key - Cache key
     * @returns {boolean} Whether data was invalidated
     * @description Removes cached data by key
     */
    invalidate(key) {
        throw new Error('Method invalidate() must be implemented by subclass');
    }

    /**
     * Deletes cached data (alias for invalidate)
     * 
     * @param {string} key - Cache key
     * @returns {boolean} Whether data was deleted
     * @description Removes cached data by key (backward compatibility)
     */
    delete(key) {
        return this.invalidate(key);
    }

    /**
     * Invalidates cached data by pattern
     * 
     * @param {string|RegExp} pattern - Pattern to match keys
     * @returns {number} Number of items invalidated
     * @description Removes cached data matching pattern
     */
    invalidatePattern(pattern) {
        throw new Error('Method invalidatePattern() must be implemented by subclass');
    }

    /**
     * Clears all cached data
     * 
     * @returns {void}
     * @description Removes all cached data
     */
    clear() {
        throw new Error('Method clear() must be implemented by subclass');
    }

    /**
     * Checks if key exists in cache
     * 
     * @param {string} key - Cache key
     * @returns {boolean} Whether key exists
     * @description Checks if data is cached for key
     */
    has(key) {
        throw new Error('Method has() must be implemented by subclass');
    }

    /**
     * Gets cache statistics
     * 
     * @returns {CacheStats} Cache statistics
     * @description Returns current cache performance statistics
     */
    getStats() {
        throw new Error('Method getStats() must be implemented by subclass');
    }

    /**
     * Gets cache configuration
     * 
     * @returns {CacheConfig} Cache configuration
     * @description Returns current cache configuration
     */
    getConfig() {
        throw new Error('Method getConfig() must be implemented by subclass');
    }

    /**
     * Updates cache configuration
     * 
     * @param {Partial<CacheConfig>} newConfig - New configuration
     * @returns {void}
     * @description Updates cache configuration
     */
    updateConfig(newConfig) {
        throw new Error('Method updateConfig() must be implemented by subclass');
    }

    /**
     * Disposes cache provider
     * 
     * @returns {void}
     * @description Cleans up resources and stops operations
     */
    dispose() {
        throw new Error('Method dispose() must be implemented by subclass');
    }
}

/**
 * Cache service manager interface
 * 
 * @interface ICacheServiceManager
 * @description Manages multiple cache instances for different features
 */
export class ICacheServiceManager {
    /**
     * Creates a cache service manager
     * 
     * @constructor
     * @description Creates a new cache service manager instance
     */
    constructor() {
        // Initialize manager properties
    }

    /**
     * Gets cache for feature
     * 
     * @param {string} featureName - Feature name
     * @returns {ICacheProvider} Cache provider for feature
     * @description Retrieves cache provider for specific feature
     */
    getCache(featureName) {
        throw new Error('Method getCache() must be implemented by subclass');
    }

    /**
     * Invalidates feature cache
     * 
     * @param {string} featureName - Feature name
     * @returns {void}
     * @description Clears all cached data for feature
     */
    invalidateFeature(featureName) {
        throw new Error('Method invalidateFeature() must be implemented by subclass');
    }

    /**
     * Invalidates cache by pattern across all features
     * 
     * @param {string} pattern - Pattern to match keys
     * @returns {number} Number of items invalidated
     * @description Removes cached data matching pattern across all features
     */
    invalidatePattern(pattern) {
        throw new Error('Method invalidatePattern() must be implemented by subclass');
    }

    /**
     * Gets global statistics
     * 
     * @returns {Record<string, any>} Global cache statistics
     * @description Returns statistics for all managed caches
     */
    getGlobalStats() {
        throw new Error('Method getGlobalStats() must be implemented by subclass');
    }

    /**
     * Disposes service manager
     * 
     * @returns {void}
     * @description Cleans up all managed caches
     */
    dispose() {
        throw new Error('Method dispose() must be implemented by subclass');
    }
}

/**
 * Cache entry interface
 * 
 * @interface CacheEntry
 * @template T
 * @description Represents a cached data entry with metadata
 */
export class CacheEntry {
    /**
     * Cached data
     * 
     * @type {T}
     */
    data;

    /**
     * Creation timestamp
     * 
     * @type {number}
     */
    timestamp;

    /**
     * Time to live in milliseconds
     * 
     * @type {number}
     */
    ttl;

    /**
     * Number of times accessed
     * 
     * @type {number}
     */
    accessCount;

    /**
     * Last access timestamp
     * 
     * @type {number}
     */
    lastAccessed;

    /**
     * Creates a cache entry
     * 
     * @constructor
     * @param {T} data - Cached data
     * @param {number} timestamp - Creation timestamp
     * @param {number} ttl - Time to live
     * @param {number} [accessCount=0] - Access count
     * @param {number} [lastAccessed] - Last access timestamp
     * @description Creates a new cache entry
     */
    constructor(data, timestamp, ttl, accessCount = 0, lastAccessed = Date.now()) {
        this.data = data;
        this.timestamp = timestamp;
        this.ttl = ttl;
        this.accessCount = accessCount;
        this.lastAccessed = lastAccessed;
    }
}

/**
 * Cache configuration interface
 * 
 * @interface CacheConfig
 * @description Configuration options for cache behavior
 */
export class CacheConfig {
    /**
     * Default time to live in milliseconds
     * 
     * @type {number}
     */
    defaultTTL;

    /**
     * Maximum cache size
     * 
     * @type {number}
     */
    maxSize;

    /**
     * Cleanup interval in milliseconds
     * 
     * @type {number}
     */
    cleanupInterval;

    /**
     * Enable statistics collection
     * 
     * @type {boolean}
     */
    enableStats;

    /**
     * Enable LRU eviction
     * 
     * @type {boolean}
     */
    enableLRU;

    /**
     * Creates cache configuration
     * 
     * @constructor
     * @param {number} defaultTTL - Default TTL
     * @param {number} maxSize - Maximum size
     * @param {number} cleanupInterval - Cleanup interval
     * @param {boolean} [enableStats=true] - Enable statistics
     * @param {boolean} [enableLRU=true] - Enable LRU
     * @description Creates new cache configuration
     */
    constructor(defaultTTL, maxSize, cleanupInterval, enableStats = true, enableLRU = true) {
        this.defaultTTL = defaultTTL;
        this.maxSize = maxSize;
        this.cleanupInterval = cleanupInterval;
        this.enableStats = enableStats;
        this.enableLRU = enableLRU;
    }
}

/**
 * Cache statistics interface
 * 
 * @interface CacheStats
 * @description Cache performance statistics
 */
export class CacheStats {
    /**
     * Current cache size
     * 
     * @type {number}
     */
    size;

    /**
     * Number of cache hits
     * 
     * @type {number}
     */
    hits;

    /**
     * Number of cache misses
     * 
     * @type {number}
     */
    misses;

    /**
     * Cache hit rate (0-1)
     * 
     * @type {number}
     */
    hitRate;

    /**
     * Number of evictions
     * 
     * @type {number}
     */
    evictions;

    /**
     * Total number of requests
     * 
     * @type {number}
     */
    totalRequests;

    /**
     * Creates cache statistics
     * 
     * @constructor
     * @param {number} size - Cache size
     * @param {number} hits - Hit count
     * @param {number} misses - Miss count
     * @param {number} evictions - Eviction count
     * @param {number} totalRequests - Total requests
     * @description Creates new cache statistics
     */
    constructor(size, hits, misses, evictions, totalRequests) {
        this.size = size;
        this.hits = hits;
        this.misses = misses;
        this.evictions = evictions;
        this.totalRequests = totalRequests;
        this.hitRate = totalRequests > 0 ? hits / totalRequests : 0;
    }
}

/**
 * Cache events interface
 * 
 * @interface CacheEvents
 * @description Event handlers for cache operations
 */
export class CacheEvents {
    /**
     * Cache hit event handler
     * 
     * @type {Function|null|undefined}
     */
    onHit;

    /**
     * Cache miss event handler
     * 
     * @type {Function|null|undefined}
     */
    onMiss;

    /**
     * Cache eviction event handler
     * 
     * @type {Function|null|undefined}
     */
    onEvict;

    /**
     * Error event handler
     * 
     * @type {Function|null|undefined}
     */
    onError;

    /**
     * Creates cache events
     * 
     * @constructor
     * @param {Function} [onHit] - Hit handler
     * @param {Function} [onMiss] - Miss handler
     * @param {Function} [onEvict] - Eviction handler
     * @param {Function} [onError] - Error handler
     * @description Creates new cache events configuration
     */
    constructor(onHit = undefined, onMiss = undefined, onEvict = undefined, onError = undefined) {
        this.onHit = onHit;
        this.onMiss = onMiss;
        this.onEvict = onEvict;
        this.onError = onError;
    }
}

/**
 * Cache service configuration interface
 * 
 * @interface CacheServiceConfig
 * @description Configuration for cache service manager
 */
export class CacheServiceConfig {
    /**
     * Default cache configuration
     * 
     * @type {Partial<CacheConfig>|null|undefined}
     */
    defaultCache;

    /**
     * Feature-specific cache configurations
     * 
     * @type {Record<string, Partial<CacheConfig>>|null|undefined}
     */
    featureCaches;

    /**
     * Creates cache service configuration
     * 
     * @constructor
     * @param {Partial<CacheConfig>} [defaultCache] - Default configuration
     * @param {Record<string, Partial<CacheConfig>>} [featureCaches] - Feature configurations
     * @description Creates new cache service configuration
     */
    constructor(defaultCache = undefined, featureCaches = undefined) {
        this.defaultCache = defaultCache;
        this.featureCaches = featureCaches;
    }
}

/**
 * Feature cache service interface
 * 
 * @interface FeatureCacheService
 * @description Extended cache service for feature-specific caching
 */
export class FeatureCacheService extends ICacheServiceManager {
    /**
     * Creates feature cache service
     * 
     * @constructor
     * @description Creates new feature cache service (alias for backward compatibility)
     */
    constructor() {
        super();
    }
}

/**
 * Creates a cache provider
 * 
 * @function createCacheProvider
 * @param {Partial<CacheConfig>} [config] - Cache configuration
 * @returns {ICacheProvider} Cache provider instance
 * @description Creates a new cache provider with optional configuration
 */
export function createCacheProvider(config) {
    return new ICacheProvider();
}

/**
 * Creates a cache service manager
 * 
 * @function createCacheServiceManager
 * @param {Partial<CacheServiceConfig>} [config] - Service configuration
 * @returns {ICacheServiceManager} Cache service manager instance
 * @description Creates a new cache service manager with optional configuration
 */
export function createCacheServiceManager(config) {
    return new ICacheServiceManager();
}

/**
 * Creates cache configuration
 * 
 * @function createCacheConfig
 * @param {number} defaultTTL - Default TTL
 * @param {number} maxSize - Maximum size
 * @param {number} cleanupInterval - Cleanup interval
 * @param {boolean} [enableStats=true] - Enable statistics
 * @param {boolean} [enableLRU=true] - Enable LRU
 * @returns {CacheConfig} Cache configuration instance
 * @description Creates new cache configuration
 */
export function createCacheConfig(defaultTTL, maxSize, cleanupInterval, enableStats = true, enableLRU = true) {
    return new CacheConfig(defaultTTL, maxSize, cleanupInterval, enableStats, enableLRU);
}

/**
 * Creates cache statistics
 * 
 * @function createCacheStats
 * @param {number} size - Cache size
 * @param {number} hits - Hit count
 * @param {number} misses - Miss count
 * @param {number} evictions - Eviction count
 * @param {number} totalRequests - Total requests
 * @returns {CacheStats} Cache statistics instance
 * @description Creates new cache statistics
 */
export function createCacheStats(size, hits, misses, evictions, totalRequests) {
    return new CacheStats(size, hits, misses, evictions, totalRequests);
}

/**
 * Creates cache events
 * 
 * @function createCacheEvents
 * @param {Function} [onHit] - Hit handler
 * @param {Function} [onMiss] - Miss handler
 * @param {Function} [onEvict] - Eviction handler
 * @param {Function} [onError] - Error handler
 * @returns {CacheEvents} Cache events instance
 * @description Creates new cache events configuration
 */
export function createCacheEvents(onHit = undefined, onMiss = undefined, onEvict = undefined, onError = undefined) {
    return new CacheEvents(onHit, onMiss, onEvict, onError);
}
