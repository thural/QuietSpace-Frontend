/**
 * Cache System Interfaces
 * 
 * Centralized interface definitions for the cache system.
 * Provides clean type exports following Black Box pattern.
 */

// Core cache interfaces
/**
 * Cache provider interface
 * 
 * @interface ICacheProvider
 * @description Defines contract for cache providers
 */
export class ICacheProvider {
    /**
     * Get value from cache
     * 
     * @param {string} key - Cache key
     * @returns {Promise<any|null>} Cached value or null
     */
    async get(key) {
        throw new Error('Method get() must be implemented');
    }

    /**
     * Set value in cache
     * 
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} [ttl] - Time to live
     * @returns {Promise<void>}
     */
    async set(key, value, ttl) {
        throw new Error('Method set() must be implemented');
    }

    /**
     * Delete value from cache
     * 
     * @param {string} key - Cache key
     * @returns {Promise<void>}
     */
    async delete(key) {
        throw new Error('Method delete() must be implemented');
    }

    /**
     * Clear all entries
     * 
     * @returns {Promise<void>}
     */
    async clear() {
        throw new Error('Method clear() must be implemented');
    }

    /**
     * Check if key exists
     * 
     * @param {string} key - Cache key
     * @returns {Promise<boolean>} Whether key exists
     */
    async has(key) {
        throw new Error('Method has() must be implemented');
    }

    /**
     * Get cache statistics
     * 
     * @returns {CacheStats} Cache statistics
     */
    getStats() {
        throw new Error('Method getStats() must be implemented');
    }

    /**
     * Get all keys
     * 
     * @returns {Promise<string[]>} Array of keys
     */
    async getKeys() {
        throw new Error('Method getKeys() must be implemented');
    }

    /**
     * Get cache size
     * 
     * @returns {Promise<number>} Number of entries
     */
    async getSize() {
        throw new Error('Method getSize() must be implemented');
    }
}

/**
 * Cache service manager interface
 * 
 * @interface ICacheServiceManager
 * @extends {ICacheProvider}
 * @description Extended interface for cache service managers
 */
export class ICacheServiceManager extends ICacheProvider {
    /**
     * Create cache
     * 
     * @param {string} name - Cache name
     * @param {CacheConfig} [config] - Cache configuration
     * @returns {ICacheProvider} Cache provider
     */
    createCache(name, config) {
        throw new Error('Method createCache() must be implemented');
    }

    /**
     * Get cache by name
     * 
     * @param {string} name - Cache name
     * @returns {ICacheProvider|null} Cache provider or null
     */
    getCache(name) {
        throw new Error('Method getCache() must be implemented');
    }

    /**
     * Remove cache
     * 
     * @param {string} name - Cache name
     * @returns {void}
     */
    removeCache(name) {
        throw new Error('Method removeCache() must be implemented');
    }

    /**
     * Clear all caches
     * 
     * @returns {void}
     */
    clearAll() {
        throw new Error('Method clearAll() must be implemented');
    }

    /**
     * Get all statistics
     * 
     * @returns {Record<string, CacheStats>} Statistics for all caches
     */
    getAllStats() {
        throw new Error('Method getAllStats() must be implemented');
    }

    /**
     * List cache names
     * 
     * @returns {string[]} Array of cache names
     */
    listCaches() {
        throw new Error('Method listCaches() must be implemented');
    }

    /**
     * Get default cache
     * 
     * @returns {ICacheProvider} Default cache provider
     */
    getDefaultCache() {
        throw new Error('Method getDefaultCache() must be implemented');
    }
}

/**
 * Cache strategy interface
 * 
 * @interface ICacheStrategy
 * @description Defines contract for cache eviction strategies
 */
export class ICacheStrategy {
    /**
     * Get value from cache
     * 
     * @param {string} key - Cache key
     * @returns {Promise<any|null>} Cached value or null
     */
    async get(key) {
        throw new Error('Method get() must be implemented');
    }

    /**
     * Set value in cache
     * 
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} [ttl] - Time to live
     * @returns {Promise<void>}
     */
    async set(key, value, ttl) {
        throw new Error('Method set() must be implemented');
    }

    /**
     * Delete value from cache
     * 
     * @param {string} key - Cache key
     * @returns {Promise<void>}
     */
    async delete(key) {
        throw new Error('Method delete() must be implemented');
    }

    /**
     * Clear all entries
     * 
     * @returns {Promise<void>}
     */
    async clear() {
        throw new Error('Method clear() must be implemented');
    }

    /**
     * Evict entry
     * 
     * @param {string} key - Cache key
     * @returns {void}
     */
    evict(key) {
        throw new Error('Method evict() must be implemented');
    }

    /**
     * Check if entry should be evicted
     * 
     * @param {string} key - Cache key
     * @returns {boolean} Whether entry should be evicted
     */
    shouldEvict(key) {
        throw new Error('Method shouldEvict() must be implemented');
    }

    /**
     * Get eviction candidates
     * 
     * @returns {string[]} Array of keys to evict
     */
    getEvictionCandidates() {
        throw new Error('Method getEvictionCandidates() must be implemented');
    }
}

// Cache configuration interfaces
/**
 * Cache configuration interface
 * 
 * @interface CacheConfig
 * @description Configuration options for cache providers
 */
export class CacheConfig {
    /**
     * Maximum cache size
     * 
     * @type {number}
     */
    maxSize;

    /**
     * Default time to live
     * 
     * @type {number}
     */
    defaultTtl;

    /**
     * Cache strategy
     * 
     * @type {string}
     */
    strategy;

    /**
     * Enable metrics
     * 
     * @type {boolean}
     */
    enableMetrics;

    /**
     * Enable compression
     * 
     * @type {boolean}
     */
    enableCompression;

    /**
     * Enable encryption
     * 
     * @type {boolean}
     */
    enableEncryption;

    /**
     * Key prefix
     * 
     * @type {string}
     */
    keyPrefix;

    /**
     * Namespace
     * 
     * @type {string}
     */
    namespace;

    /**
     * Create cache configuration
     * 
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        this.maxSize = options.maxSize;
        this.defaultTtl = options.defaultTtl;
        this.strategy = options.strategy;
        this.enableMetrics = options.enableMetrics;
        this.enableCompression = options.enableCompression;
        this.enableEncryption = options.enableEncryption;
        this.keyPrefix = options.keyPrefix;
        this.namespace = options.namespace;
    }
}

// Supporting types
/**
 * Cache statistics interface
 * 
 * @interface CacheStats
 * @description Statistics about cache performance
 */
export class CacheStats {
    /**
     * Cache size
     * 
     * @type {number}
     */
    size;

    /**
     * Number of hits
     * 
     * @type {number}
     */
    hits;

    /**
     * Number of misses
     * 
     * @type {number}
     */
    misses;

    /**
     * Hit rate
     * 
     * @type {number}
     */
    hitRate;

    /**
     * Memory usage
     * 
     * @type {number}
     */
    memoryUsage;

    /**
     * Create cache statistics
     * 
     * @param {Object} stats - Statistics data
     */
    constructor(stats = {}) {
        this.size = stats.size || 0;
        this.hits = stats.hits || 0;
        this.misses = stats.misses || 0;
        this.hitRate = stats.hitRate || 0;
        this.memoryUsage = stats.memoryUsage || 0;
    }
}

// Cache configuration presets
/**
 * Default cache configuration
 * 
 * @type {CacheConfig}
 */
export const DEFAULT_CACHE_CONFIG = new CacheConfig({
    maxSize: 1000,
    defaultTtl: 3600000, // 1 hour
    strategy: 'lru',
    enableMetrics: true,
    enableCompression: false,
    enableEncryption: false
});

/**
 * Memory cache configuration
 * 
 * @type {CacheConfig}
 */
export const MEMORY_CACHE_CONFIG = new CacheConfig({
    ...DEFAULT_CACHE_CONFIG,
    maxSize: 500,
    enableCompression: true
});

/**
 * Redis cache configuration
 * 
 * @type {CacheConfig}
 */
export const REDIS_CACHE_CONFIG = new CacheConfig({
    ...DEFAULT_CACHE_CONFIG,
    maxSize: 10000,
    enableCompression: true,
    enableEncryption: true
});

/**
 * Distributed cache configuration
 * 
 * @type {CacheConfig}
 */
export const DISTRIBUTED_CACHE_CONFIG = new CacheConfig({
    ...DEFAULT_CACHE_CONFIG,
    maxSize: 5000,
    enableMetrics: true,
    enableCompression: true,
    enableEncryption: true
});
