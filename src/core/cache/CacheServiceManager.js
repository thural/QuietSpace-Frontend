import { CacheProvider, CacheConfig } from './CacheProvider.js';

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
     * @type {Object}
     */
    defaultCache;

    /**
     * Feature-specific cache configurations
     * 
     * @type {Record<string, Object>}
     */
    featureCaches;

    /**
     * Create cache service configuration
     * 
     * @param {Object} options - Configuration options
     * @param {Object} [options.defaultCache] - Default cache config
     * @param {Record<string, Object>} [options.featureCaches] - Feature configs
     */
    constructor(options = {}) {
        this.defaultCache = options.defaultCache || {};
        this.featureCaches = options.featureCaches || {};
    }
}

/**
 * Feature cache service interface
 * 
 * @interface FeatureCacheService
 * @description Defines contract for feature cache services
 */
export class FeatureCacheService {
    /**
     * Get cache for feature
     * 
     * @param {string} featureName - Feature name
     * @returns {CacheProvider} Cache provider
     */
    getCache(featureName) {
        throw new Error('Method getCache() must be implemented');
    }

    /**
     * Invalidate feature cache
     * 
     * @param {string} featureName - Feature name
     * @returns {void}
     */
    invalidateFeature(featureName) {
        throw new Error('Method invalidateFeature() must be implemented');
    }

    /**
     * Invalidate cache entries matching pattern
     * 
     * @param {string} pattern - Pattern to match
     * @returns {number} Number of invalidated entries
     */
    invalidatePattern(pattern) {
        throw new Error('Method invalidatePattern() must be implemented');
    }

    /**
     * Get global statistics
     * 
     * @returns {Record<string, any>} Global statistics
     */
    getGlobalStats() {
        throw new Error('Method getGlobalStats() must be implemented');
    }

    /**
     * Dispose of all caches
     * 
     * @returns {void}
     */
    dispose() {
        throw new Error('Method dispose() must be implemented');
    }
}

/**
 * Cache service manager implementation
 * 
 * @class CacheServiceManager
 * @implements {FeatureCacheService}
 * @description Manages multiple cache instances for different features
 */
export class CacheServiceManager extends FeatureCacheService {
    /**
     * Create cache service manager
     * 
     * @param {CacheServiceConfig} [config] - Service configuration
     */
    constructor(config = new CacheServiceConfig()) {
        super();
        this.caches = new Map();
        this.globalConfig = config;
    }

    /**
     * Get cache for feature
     * 
     * @param {string} featureName - Feature name
     * @returns {CacheProvider} Cache provider
     */
    getCache(featureName) {
        if (!this.caches.has(featureName)) {
            const config = {
                ...this.globalConfig.defaultCache,
                ...this.globalConfig.featureCaches?.[featureName]
            };

            const events = {
                onHit: (key, data) => console.debug(`[${featureName}] Cache hit: ${key}`),
                onMiss: (key) => console.debug(`[${featureName}] Cache miss: ${key}`),
                onEvict: (key, data) => console.debug(`[${featureName}] Cache evict: ${key}`),
                onError: (error, operation, key) => console.error(`[${featureName}] Cache error: ${operation}`, error, key)
            };

            const cache = new CacheProvider(config, events);
            this.caches.set(featureName, cache);
        }

        return this.caches.get(featureName);
    }

    /**
     * Invalidate feature cache
     * 
     * @param {string} featureName - Feature name
     * @returns {void}
     */
    invalidateFeature(featureName) {
        const cache = this.caches.get(featureName);
        if (cache) {
            cache.clear();
        }
    }

    /**
     * Invalidate cache entries matching pattern
     * 
     * @param {string} pattern - Pattern to match
     * @returns {number} Number of invalidated entries
     */
    invalidatePattern(pattern) {
        let invalidatedCount = 0;
        const regex = new RegExp(pattern);

        for (const [featureName, cache] of this.caches.entries()) {
            const stats = cache.getStats();
            
            // This is a simplified implementation
            // In a real scenario, you'd need to iterate through cache entries
            if (regex.test(featureName)) {
                cache.clear();
                invalidatedCount += stats.totalEntries;
            }
        }

        return invalidatedCount;
    }

    /**
     * Get global statistics
     * 
     * @returns {Record<string, any>} Global statistics
     */
    getGlobalStats() {
        const globalStats = {
            totalCaches: this.caches.size,
            totalEntries: 0,
            totalHits: 0,
            totalMisses: 0,
            averageHitRate: 0,
            caches: {}
        };

        let totalHitRate = 0;

        for (const [featureName, cache] of this.caches.entries()) {
            const stats = cache.getStats();
            globalStats.totalEntries += stats.totalEntries;
            globalStats.totalHits += stats.hits;
            globalStats.totalMisses += stats.misses;
            totalHitRate += stats.hitRate;
            
            globalStats.caches[featureName] = {
                entries: stats.totalEntries,
                hits: stats.hits,
                misses: stats.misses,
                hitRate: stats.hitRate
            };
        }

        globalStats.averageHitRate = this.caches.size > 0 ? totalHitRate / this.caches.size : 0;

        return globalStats;
    }

    /**
     * Dispose of all caches
     * 
     * @returns {void}
     */
    dispose() {
        for (const cache of this.caches.values()) {
            cache.clear();
        }
        this.caches.clear();
    }
}
