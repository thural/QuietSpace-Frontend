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
     * Creates a cache entry
     * @param {any} data - The cached data
     * @param {number} timestamp - Timestamp when the entry was created (Unix timestamp)
     * @param {number} ttl - Time to live in milliseconds
     */
    constructor(data, timestamp, ttl) {
        this.data = data;
        this.timestamp = timestamp;
        this.ttl = ttl;
    }

    /**
     * The cached data
     * @type {any}
     */
    data;

    /**
     * Timestamp when the entry was created (Unix timestamp)
     * @type {number}
     */
    timestamp;

    /**
     * Time to live in milliseconds
     * @type {number}
     */
    ttl;

    /**
     * Checks if the entry has expired
     * @returns {boolean} Whether the entry has expired
     */
    isExpired() {
        return Date.now() - this.timestamp > this.ttl;
    }

    /**
     * Gets the age of the entry in milliseconds
     * @returns {number} Age in milliseconds
     */
    getAge() {
        return Date.now() - this.timestamp;
    }
}

/**
 * Cache provider interface
 * @typedef {Object} ICacheProvider
 * @property {(key: string, value: any, ttl?: number) => Promise<void>} set - Set cache value
 * @property {(key: string) => Promise<any>} get - Get cache value
 * @property {(key: string) => Promise<boolean>} has - Check if key exists
 * @property {(key: string) => Promise<void>} delete - Delete cache value
 * @property {() => Promise<void>} clear - Clear all cache
 * @property {() => Promise<number>} size - Get cache size
 * @property {() => Promise<CacheEntry[]>} entries - Get all entries
 * @property {(key: string) => Promise<CacheEntry|null>} getEntry - Get cache entry
 * @property {() => Promise<Object>} getStats - Get cache statistics
 */

/**
 * In-memory cache provider with TTL and size limits
 * @class MemoryCacheProvider
 * @description In-memory cache provider with TTL and size limits
 * @Injectable({ lifetime: 'singleton' })
 */
export class MemoryCacheProvider {
    /**
     * @type {Map<string, CacheEntry>}
     */
    cache = new Map();

    /**
     * @type {number}
     */
    maxSize;

    /**
     * @type {number}
     */
    defaultTtl;

    /**
     * @type {Object}
     */
    stats = {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        evictions: 0
    };

    /**
     * Creates a memory cache provider
     * @param {Object} [config] - Cache configuration
     */
    constructor(config = {}) {
        this.maxSize = config.maxSize || 1000;
        this.defaultTtl = config.defaultTtl || 300000; // 5 minutes
    }

    /**
     * Sets a value in cache
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} [ttl] - Time to live in milliseconds
     * @returns {Promise<void>} Promise that resolves when value is set
     */
    async set(key, value, ttl = this.defaultTtl) {
        const entry = new CacheEntry(value, Date.now(), ttl);

        // Enforce size limit
        if (this.cache.size >= this.maxSize) {
            this.#evictOldest();
        }

        this.cache.set(key, entry);
        this.stats.sets++;
    }

    /**
     * Gets a value from cache
     * @param {string} key - Cache key
     * @returns {Promise<any>} Promise that resolves to the cached value
     */
    async get(key) {
        const entry = this.cache.get(key);

        if (!entry) {
            this.stats.misses++;
            return undefined;
        }

        if (entry.isExpired()) {
            this.cache.delete(key);
            this.stats.misses++;
            return undefined;
        }

        this.stats.hits++;
        return entry.data;
    }

    /**
     * Checks if key exists in cache
     * @param {string} key - Cache key
     * @returns {Promise<boolean>} Promise that resolves to whether key exists
     */
    async has(key) {
        const entry = this.cache.get(key);
        return entry && !entry.isExpired();
    }

    /**
     * Deletes a value from cache
     * @param {string} key - Cache key
     * @returns {Promise<void>} Promise that resolves when value is deleted
     */
    async delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            this.stats.deletes++;
        }
    }

    /**
     * Clears all cache entries
     * @returns {Promise<void>} Promise that resolves when cache is cleared
     */
    async clear() {
        this.cache.clear();
        this.stats.hits = 0;
        this.stats.misses = 0;
        this.stats.sets = 0;
        this.stats.deletes = 0;
        this.stats.evictions = 0;
    }

    /**
     * Gets cache size
     * @returns {Promise<number>} Promise that resolves to cache size
     */
    async size() {
        return this.cache.size;
    }

    /**
     * Gets all cache entries
     * @returns {Promise<CacheEntry[]>} Promise that resolves to all entries
     */
    async entries() {
        return Array.from(this.cache.values());
    }

    /**
     * Gets a cache entry with metadata
     * @param {string} key - Cache key
     * @returns {Promise<CacheEntry|null>} Promise that resolves to cache entry
     */
    async getEntry(key) {
        const entry = this.cache.get(key);
        if (entry && !entry.isExpired()) {
            return entry;
        }
        return null;
    }

    /**
     * Gets cache statistics
     * @returns {Promise<Object>} Promise that resolves to cache statistics
     */
    async getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            hitRate: this.#calculateHitRate(),
            ...this.stats
        };
    }

    /**
     * Evicts oldest cache entries
     * @private
     */
    #evictOldest() {
        let oldestKey = null;
        let oldestTime = Date.now();

        for (const [key, entry] of this.cache) {
            if (entry.timestamp < oldestTime) {
                oldestTime = entry.timestamp;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.stats.evictions++;
        }
    }

    /**
     * Calculates cache hit rate
     * @returns {number} Hit rate as percentage
     * @private
     */
    #calculateHitRate() {
        const total = this.stats.hits + this.stats.misses;
        return total > 0 ? this.stats.hits / total : 0;
    }

    /**
     * Updates hit rate statistics
     * @private
     */
    updateHitRate() {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
    }

    /**
     * Cleans up expired entries
     * @returns {Promise<number>} Number of entries cleaned up
     */
    async cleanup() {
        let cleaned = 0;
        const now = Date.now();

        for (const [key, entry] of this.cache) {
            if (entry.isExpired()) {
                this.cache.delete(key);
                cleaned++;
            }
        }

        return cleaned;
    }

    /**
     * Gets cache keys
     * @returns {Promise<string[]>} Promise that resolves to cache keys
     */
    async keys() {
        return Array.from(this.cache.keys());
    }

    /**
     * Checks if cache is empty
     * @returns {Promise<boolean>} Promise that resolves to whether cache is empty
     */
    async isEmpty() {
        return this.cache.size === 0;
    }

    /**
     * Gets memory usage estimate
     * @returns {Promise<Object>} Promise that resolves to memory usage
     */
    async getMemoryUsage() {
        let totalSize = 0;

        for (const entry of this.cache.values()) {
            // Rough estimate of entry size
            totalSize += JSON.stringify(entry).length;
        }

        return {
            entries: this.cache.size,
            estimatedSizeBytes: totalSize,
            estimatedSizeKB: Math.round(totalSize / 1024 * 100) / 100
        };
    }
}
