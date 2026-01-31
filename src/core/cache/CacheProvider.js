import { Injectable } from '../di/index.js';

/**
 * Cache entry interface for storing cached data with metadata
 * 
 * @interface CacheEntry
 * @description Represents a single cache entry with data and metadata
 * @template T - The type of data being cached
 */
export class CacheEntry {
    /**
     * The cached data
     * 
     * @type {any}
     */
    data;

    /**
     * Timestamp when the entry was created (Unix timestamp)
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
     * Number of times this entry has been accessed
     * 
     * @type {number}
     */
    accessCount;

    /**
     * Timestamp of last access (Unix timestamp)
     * 
     * @type {number}
     */
    lastAccessed;

    /**
     * Create cache entry
     * 
     * @param {any} data - Data to cache
     * @param {number} ttl - Time to live in milliseconds
     */
    constructor(data, ttl) {
        this.data = data;
        this.timestamp = Date.now();
        this.ttl = ttl;
        this.accessCount = 0;
        this.lastAccessed = this.timestamp;
    }

    /**
     * Check if entry is expired
     * 
     * @returns {boolean} Whether entry is expired
     */
    isExpired() {
        return Date.now() > (this.timestamp + this.ttl);
    }

    /**
     * Update access information
     */
    updateAccess() {
        this.accessCount++;
        this.lastAccessed = Date.now();
    }
}

/**
 * Cache configuration interface
 * 
 * @interface CacheConfig
 * @description Configuration options for cache providers
 */
export class CacheConfig {
    /**
     * Default time to live in milliseconds
     * 
     * @type {number}
     */
    defaultTtl;

    /**
     * Maximum number of entries in cache
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
     * Whether to enable compression
     * 
     * @type {boolean}
     */
    enableCompression;

    /**
     * Create cache configuration
     * 
     * @param {Object} options - Configuration options
     * @param {number} [options.defaultTtl=300000] - Default TTL (5 minutes)
     * @param {number} [options.maxSize=1000] - Maximum size
     * @param {number} [options.cleanupInterval=60000] - Cleanup interval (1 minute)
     * @param {boolean} [options.enableCompression=false] - Enable compression
     */
    constructor(options = {}) {
        this.defaultTtl = options.defaultTtl || 300000; // 5 minutes
        this.maxSize = options.maxSize || 1000;
        this.cleanupInterval = options.cleanupInterval || 60000; // 1 minute
        this.enableCompression = options.enableCompression || false;
    }
}

/**
 * Cache statistics interface
 * 
 * @interface CacheStats
 * @description Statistics about cache performance
 */
export class CacheStats {
    /**
     * Total number of entries
     * 
     * @type {number}
     */
    totalEntries;

    /**
     * Number of expired entries
     * 
     * @type {number}
     */
    expiredEntries;

    /**
     * Cache hit rate (0-1)
     * 
     * @type {number}
     */
    hitRate;

    /**
     * Total number of hits
     * 
     * @type {number}
     */
    hits;

    /**
     * Total number of misses
     * 
     * @type {number}
     */
    misses;

    /**
     * Create cache statistics
     * 
     * @param {Object} stats - Statistics data
     */
    constructor(stats = {}) {
        this.totalEntries = stats.totalEntries || 0;
        this.expiredEntries = stats.expiredEntries || 0;
        this.hitRate = stats.hitRate || 0;
        this.hits = stats.hits || 0;
        this.misses = stats.misses || 0;
    }
}

/**
 * Memory cache provider implementation
 * 
 * @class MemoryCacheProvider
 * @description In-memory cache provider with TTL and size limits
 */
@Injectable({ lifetime: 'singleton' })
export class MemoryCacheProvider {
    /**
     * Create memory cache provider
     * 
     * @param {CacheConfig} [config] - Cache configuration
     */
    constructor(config = new CacheConfig()) {
        this.config = config;
        this.cache = new Map();
        this.stats = new CacheStats();
        this.setupCleanup();
    }

    /**
     * Get value from cache
     * 
     * @param {string} key - Cache key
     * @returns {any|null} Cached value or null if not found/expired
     */
    get(key) {
        const entry = this.cache.get(key);
        
        if (!entry) {
            this.stats.misses++;
            this.updateHitRate();
            return null;
        }

        if (entry.isExpired()) {
            this.cache.delete(key);
            this.stats.misses++;
            this.updateHitRate();
            return null;
        }

        entry.updateAccess();
        this.stats.hits++;
        this.updateHitRate();
        return entry.data;
    }

    /**
     * Set value in cache
     * 
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} [ttl] - Time to live (uses default if not provided)
     * @returns {void}
     */
    set(key, value, ttl) {
        const entryTtl = ttl || this.config.defaultTtl;
        const entry = new CacheEntry(value, entryTtl);
        
        // Enforce size limit
        if (this.cache.size >= this.config.maxSize) {
            this.evictLeastRecentlyUsed();
        }
        
        this.cache.set(key, entry);
    }

    /**
     * Remove value from cache
     * 
     * @param {string} key - Cache key
     * @returns {boolean} Whether key was removed
     */
    delete(key) {
        return this.cache.delete(key);
    }

    /**
     * Clear all entries from cache
     * 
     * @returns {void}
     */
    clear() {
        this.cache.clear();
        this.stats = new CacheStats();
    }

    /**
     * Check if key exists in cache
     * 
     * @param {string} key - Cache key
     * @returns {boolean} Whether key exists
     */
    has(key) {
        const entry = this.cache.get(key);
        return entry && !entry.isExpired();
    }

    /**
     * Get cache statistics
     * 
     * @returns {CacheStats} Current cache statistics
     */
    getStats() {
        this.stats.totalEntries = this.cache.size;
        return this.stats;
    }

    /**
     * Setup periodic cleanup
     * 
     * @private
     * @returns {void}
     */
    setupCleanup() {
        setInterval(() => {
            this.cleanup();
        }, this.config.cleanupInterval);
    }

    /**
     * Remove expired entries
     * 
     * @private
     * @returns {void}
     */
    cleanup() {
        let expiredCount = 0;
        
        for (const [key, entry] of this.cache.entries()) {
            if (entry.isExpired()) {
                this.cache.delete(key);
                expiredCount++;
            }
        }
        
        this.stats.expiredEntries = expiredCount;
    }

    /**
     * Evict least recently used entry
     * 
     * @private
     * @returns {void}
     */
    evictLeastRecentlyUsed() {
        let lruKey = null;
        let lruTime = Date.now();
        
        for (const [key, entry] of this.cache.entries()) {
            if (entry.lastAccessed < lruTime) {
                lruTime = entry.lastAccessed;
                lruKey = key;
            }
        }
        
        if (lruKey) {
            this.cache.delete(lruKey);
        }
    }

    /**
     * Update hit rate
     * 
     * @private
     * @returns {void}
     */
    updateHitRate() {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
    }
}
