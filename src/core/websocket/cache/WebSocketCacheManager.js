/**
 * WebSocket Cache Manager.
 * 
 * Integrates WebSocket communications with the enterprise cache system
 * for real-time cache invalidation and message persistence.
 */

import { LoggerService } from '../../services/LoggerService.js';
import { WebSocketMessage } from '../services/EnterpriseWebSocketService.js';

// Import types via JSDoc typedefs
/**
 * @typedef {import('../../cache/index.js').FeatureCacheService} FeatureCacheService
 */

/**
 * Cache invalidation strategy interface
 * 
 * @interface CacheInvalidationStrategy
 * @description Strategy for cache invalidation based on WebSocket messages
 */
export class CacheInvalidationStrategy {
    /**
     * Feature identifier
     * 
     * @type {string}
     */
    feature = '';

    /**
     * Cache invalidation patterns
     * 
     * @type {string[]}
     */
    patterns = [];

    /**
     * Condition function for invalidation
     * 
     * @type {Function}
     */
    conditions;

    /**
     * Strategy priority
     * 
     * @type {number}
     */
    priority = 0;

    /**
     * Creates cache invalidation strategy
     * 
     * @param {Object} options - Strategy options
     * @returns {CacheInvalidationStrategy} Strategy instance
     * @description Creates new cache invalidation strategy
     */
    static create(options = {}) {
        const strategy = new CacheInvalidationStrategy();
        Object.assign(strategy, options);
        return strategy;
    }

    /**
     * Checks if message matches invalidation criteria
     * 
     * @param {WebSocketMessage} message - WebSocket message
     * @returns {boolean} True if should invalidate
     * @description Checks if message should trigger cache invalidation
     */
    shouldInvalidate(message) {
        // Check feature match
        if (this.feature && message.feature !== this.feature) {
            return false;
        }

        // Check patterns
        const matchesPattern = this.patterns.some(pattern => {
            const regex = new RegExp(pattern);
            return regex.test(message.type) || regex.test(JSON.stringify(message.payload));
        });

        if (!matchesPattern) {
            return false;
        }

        // Check conditions
        if (this.conditions && typeof this.conditions === 'function') {
            return this.conditions(message);
        }

        return true;
    }
}

/**
 * Cache invalidation configuration interface
 * 
 * @interface CacheInvalidationConfig
 * @description Configuration for cache invalidation system
 */
export class CacheInvalidationConfig {
    /**
     * Enable automatic cache invalidation
     * 
     * @type {boolean}
     */
    enableAutoInvalidation = true;

    /**
     * Enable message persistence
     * 
     * @type {boolean}
     */
    enableMessagePersistence = false;

    /**
     * Enable metrics collection
     * 
     * @type {boolean}
     */
    enableMetrics = true;

    /**
     * Default TTL for cached items
     * 
     * @type {number}
     */
    defaultTTL = 300000; // 5 minutes

    /**
     * Maximum cache size
     * 
     * @type {number}
     */
    maxCacheSize = 1000;

    /**
     * Creates cache invalidation configuration
     * 
     * @param {Object} options - Configuration options
     * @returns {CacheInvalidationConfig} Configuration instance
     * @description Creates new cache invalidation configuration
     */
    static create(options = {}) {
        const config = new CacheInvalidationConfig();
        Object.assign(config, options);
        return config;
    }
}

/**
 * Cache metrics interface
 * 
 * @interface CacheMetrics
 * @description Metrics for cache performance
 */
export class CacheMetrics {
    /**
     * Number of cache invalidations
     * 
     * @type {number}
     */
    invalidations = 0;

    /**
     * Number of cache hits
     * 
     * @type {number}
     */
    hits = 0;

    /**
     * Number of cache misses
     * 
     * @type {number}
     */
    misses = 0;

    /**
     * Number of messages persisted
     * 
     * @type {number}
     */
    messagesPersisted = 0;

    /**
     * Average invalidation time in milliseconds
     * 
     * @type {number}
     */
    averageInvalidationTime = 0;

    /**
     * Creates cache metrics
     * 
     * @returns {CacheMetrics} Metrics instance
     * @description Creates new cache metrics
     */
    static create() {
        return new CacheMetrics();
    }

    /**
     * Updates average invalidation time
     * 
     * @param {number} invalidationTime - Invalidation time in milliseconds
     * @returns {void}
     * @description Updates running average invalidation time
     */
    updateAverageInvalidationTime(invalidationTime) {
        const totalInvalidations = this.invalidations;
        if (totalInvalidations === 0) {
            this.averageInvalidationTime = invalidationTime;
        } else {
            this.averageInvalidationTime = (this.averageInvalidationTime * (totalInvalidations - 1) + invalidationTime) / totalInvalidations;
        }
    }

    /**
     * Gets cache hit rate
     * 
     * @returns {number} Hit rate percentage
     * @description Calculates cache hit rate
     */
    getHitRate() {
        const totalRequests = this.hits + this.misses;
        return totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0;
    }
}

/**
 * WebSocket Cache Manager Interface
 * 
 * @interface IWebSocketCacheManager
 * @description Interface for WebSocket cache management
 */
export class IWebSocketCacheManager {
    /**
     * Registers cache invalidation strategy
     * 
     * @param {CacheInvalidationStrategy} strategy - Invalidation strategy
     * @returns {void}
     * @description Registers new cache invalidation strategy
     */
    registerInvalidationStrategy(strategy) {
        throw new Error('Method must be implemented');
    }

    /**
     * Invalidates cache based on message
     * 
     * @param {WebSocketMessage} message - WebSocket message
     * @returns {Promise} Invalidation promise
     * @description Invalidates cache entries based on message
     */
    async invalidateCache(message) {
        throw new Error('Method must be implemented');
    }

    /**
     * Persists message to cache
     * 
     * @param {WebSocketMessage} message - WebSocket message
     * @returns {Promise} Persistence promise
     * @description Persists message to cache storage
     */
    async persistMessage(message) {
        throw new Error('Method must be implemented');
    }

    /**
     * Gets message from cache
     * 
     * @param {string} messageId - Message identifier
     * @returns {Promise} Message or null
     * @description Retrieves persisted message from cache
     */
    async getMessage(messageId) {
        throw new Error('Method must be implemented');
    }

    /**
     * Gets messages for feature
     * 
     * @param {string} feature - Feature identifier
     * @param {number} [limit] - Message limit
     * @returns {Promise} Messages array
     * @description Gets persisted messages for feature
     */
    async getFeatureMessages(feature, limit = 100) {
        throw new Error('Method must be implemented');
    }

    /**
     * Gets cache metrics
     * 
     * @returns {CacheMetrics} Current metrics
     * @description Returns current cache metrics
     */
    getMetrics() {
        throw new Error('Method must be implemented');
    }

    /**
     * Clears metrics
     * 
     * @returns {void}
     * @description Resets all cache metrics
     */
    clearMetrics() {
        throw new Error('Method must be implemented');
    }

    /**
     * Sets cache value (backward compatibility)
     * 
     * @param {string} key - Cache key
     * @param {any} value - Cache value
     * @param {number} [ttl] - Time to live
     * @returns {Promise} Set promise
     * @description Sets value in cache
     */
    async set(key, value, ttl) {
        throw new Error('Method must be implemented');
    }

    /**
     * Gets cache value (backward compatibility)
     * 
     * @param {string} key - Cache key
     * @returns {Promise} Cache value or null
     * @description Gets value from cache
     */
    async get(key) {
        throw new Error('Method must be implemented');
    }

    /**
     * Removes cache value (backward compatibility)
     * 
     * @param {string} key - Cache key
     * @returns {Promise} Remove promise
     * @description Removes value from cache
     */
    async remove(key) {
        throw new Error('Method must be implemented');
    }

    /**
     * Clears cache (backward compatibility)
     * 
     * @returns {Promise} Clear promise
     * @description Clears all cache entries
     */
    async clear() {
        throw new Error('Method must be implemented');
    }
}

/**
 * WebSocket Cache Manager Implementation
 * 
 * @class WebSocketCacheManager
 * @description Integrates WebSocket with enterprise cache system
 */
export class WebSocketCacheManager extends IWebSocketCacheManager {
    /**
     * Cache configuration
     * 
     * @type {CacheInvalidationConfig}
     */
    config;

    /**
     * Cache service instance
     * 
     * @type {FeatureCacheService}
     */
    cacheService;

    /**
     * Logger service
     * 
     * @type {LoggerService}
     */
    logger;

    /**
     * Registered invalidation strategies
     * 
     * @type {Array}
     */
    invalidationStrategies = [];

    /**
     * Cache metrics
     * 
     * @type {CacheMetrics}
     */
    metrics;

    /**
     * Creates WebSocket cache manager
     * 
     * @param {CacheInvalidationConfig} config - Cache configuration
     * @param {FeatureCacheService} cacheService - Cache service
     * @param {LoggerService} [logger] - Logger service
     * @description Initializes WebSocket cache manager
     */
    constructor(config, cacheService, logger) {
        this.config = CacheInvalidationConfig.create(config);
        this.cacheService = cacheService;
        this.logger = logger || new LoggerService();
        this.metrics = CacheMetrics.create();
    }

    /**
     * Registers cache invalidation strategy
     * 
     * @param {CacheInvalidationStrategy} strategy - Invalidation strategy
     * @returns {void}
     * @description Registers new cache invalidation strategy
     */
    registerInvalidationStrategy(strategy) {
        this.invalidationStrategies.push(strategy);
        this.invalidationStrategies.sort((a, b) => b.priority - a.priority);
        this.logger.info(`Registered invalidation strategy for feature: ${strategy.feature}`);
    }

    /**
     * Invalidates cache based on message
     * 
     * @param {WebSocketMessage} message - WebSocket message
     * @returns {Promise} Invalidation promise
     * @description Invalidates cache entries based on message
     */
    async invalidateCache(message) {
        if (!this.config.enableAutoInvalidation) {
            return;
        }

        const startTime = Date.now();
        let invalidatedCount = 0;

        try {
            for (const strategy of this.invalidationStrategies) {
                if (strategy.shouldInvalidate(message)) {
                    await this.performInvalidation(strategy, message);
                    invalidatedCount++;
                }
            }

            // Update metrics
            this.metrics.invalidations++;
            this.metrics.updateAverageInvalidationTime(Date.now() - startTime);

            this.logger.debug(`Cache invalidation completed: ${invalidatedCount} strategies, message: ${message.id}`);
            
        } catch (error) {
            this.logger.error(`Cache invalidation failed for message: ${message.id}`, error);
            throw error;
        }
    }

    /**
     * Persists message to cache
     * 
     * @param {WebSocketMessage} message - WebSocket message
     * @returns {Promise} Persistence promise
     * @description Persists message to cache storage
     */
    async persistMessage(message) {
        if (!this.config.enableMessagePersistence) {
            return;
        }

        try {
            const cacheKey = this.getMessageCacheKey(message.id);
            const ttl = this.config.defaultTTL;
            
            await this.cacheService.set(cacheKey, message.toJSON(), ttl);
            
            this.metrics.messagesPersisted++;
            this.logger.debug(`Message persisted: ${message.id}`);
            
        } catch (error) {
            this.logger.error(`Failed to persist message: ${message.id}`, error);
            throw error;
        }
    }

    /**
     * Gets message from cache
     * 
     * @param {string} messageId - Message identifier
     * @returns {Promise} Message or null
     * @description Retrieves persisted message from cache
     */
    async getMessage(messageId) {
        try {
            const cacheKey = this.getMessageCacheKey(messageId);
            const cachedData = await this.cacheService.get(cacheKey);
            
            if (cachedData) {
                this.metrics.hits++;
                return WebSocketMessage.fromJSON(cachedData);
            } else {
                this.metrics.misses++;
                return null;
            }
            
        } catch (error) {
            this.logger.error(`Failed to get message from cache: ${messageId}`, error);
            return null;
        }
    }

    /**
     * Gets messages for feature
     * 
     * @param {string} feature - Feature identifier
     * @param {number} [limit] - Message limit
     * @returns {Promise} Messages array
     * @description Gets persisted messages for feature
     */
    async getFeatureMessages(feature, limit = 100) {
        try {
            const pattern = `websocket:message:${feature}:*`;
            const keys = await this.cacheService.getKeys(pattern);
            
            const messages = [];
            for (const key of keys.slice(0, limit)) {
                const cachedData = await this.cacheService.get(key);
                if (cachedData) {
                    messages.push(WebSocketMessage.fromJSON(cachedData));
                }
            }
            
            // Sort by timestamp (newest first)
            messages.sort((a, b) => b.timestamp - a.timestamp);
            
            return messages;
            
        } catch (error) {
            this.logger.error(`Failed to get feature messages: ${feature}`, error);
            return [];
        }
    }

    /**
     * Gets cache metrics
     * 
     * @returns {CacheMetrics} Current metrics
     * @description Returns current cache metrics
     */
    getMetrics() {
        return this.metrics;
    }

    /**
     * Clears metrics
     * 
     * @returns {void}
     * @description Resets all cache metrics
     */
    clearMetrics() {
        this.metrics = CacheMetrics.create();
        this.logger.info('Cache metrics cleared');
    }

    /**
     * Sets cache value (backward compatibility)
     * 
     * @param {string} key - Cache key
     * @param {any} value - Cache value
     * @param {number} [ttl] - Time to live
     * @returns {Promise} Set promise
     * @description Sets value in cache
     */
    async set(key, value, ttl) {
        try {
            await this.cacheService.set(key, value, ttl || this.config.defaultTTL);
            this.logger.debug(`Cache set: ${key}`);
        } catch (error) {
            this.logger.error(`Failed to set cache: ${key}`, error);
            throw error;
        }
    }

    /**
     * Gets cache value (backward compatibility)
     * 
     * @param {string} key - Cache key
     * @returns {Promise} Cache value or null
     * @description Gets value from cache
     */
    async get(key) {
        try {
            const value = await this.cacheService.get(key);
            if (value) {
                this.metrics.hits++;
            } else {
                this.metrics.misses++;
            }
            return value;
        } catch (error) {
            this.logger.error(`Failed to get cache: ${key}`, error);
            return null;
        }
    }

    /**
     * Removes cache value (backward compatibility)
     * 
     * @param {string} key - Cache key
     * @returns {Promise} Remove promise
     * @description Removes value from cache
     */
    async remove(key) {
        try {
            await this.cacheService.remove(key);
            this.logger.debug(`Cache remove: ${key}`);
        } catch (error) {
            this.logger.error(`Failed to remove cache: ${key}`, error);
            throw error;
        }
    }

    /**
     * Clears cache (backward compatibility)
     * 
     * @returns {Promise} Clear promise
     * @description Clears all cache entries
     */
    async clear() {
        try {
            await this.cacheService.clear();
            this.logger.info('Cache cleared');
        } catch (error) {
            this.logger.error('Failed to clear cache', error);
            throw error;
        }
    }

    /**
     * Performs cache invalidation
     * 
     * @private
     * @param {CacheInvalidationStrategy} strategy - Invalidation strategy
     * @param {WebSocketMessage} message - WebSocket message
     * @returns {Promise} Invalidation promise
     * @description Performs actual cache invalidation
     */
    async performInvalidation(strategy, message) {
        const patterns = strategy.patterns.map(pattern => {
            // Convert pattern to cache key pattern
            return pattern.replace(/\*/g, '.*');
        });

        for (const pattern of patterns) {
            const regex = new RegExp(pattern);
            const keys = await this.cacheService.getKeys(regex);
            
            for (const key of keys) {
                await this.cacheService.remove(key);
            }
        }
    }

    /**
     * Gets message cache key
     * 
     * @private
     * @param {string} messageId - Message identifier
     * @returns {string} Cache key
     * @description Generates cache key for message
     */
    getMessageCacheKey(messageId) {
        return `websocket:message:${messageId}`;
    }
}
