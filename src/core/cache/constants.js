/**
 * Cache Module Constants
 * 
 * Centralized constants for the cache system including default values,
 * error codes, cache keys, and configuration limits.
 */

// Default TTL values (in milliseconds)
export const DEFAULT_TTL = Object.freeze({
    MINUTE: 60 * 1000,           // 1 minute
    FIVE_MINUTES: 5 * 60 * 1000, // 5 minutes
    FIFTEEN_MINUTES: 15 * 60 * 1000, // 15 minutes
    HOUR: 60 * 60 * 1000,        // 1 hour
    DAY: 24 * 60 * 60 * 1000,    // 24 hours
    WEEK: 7 * 24 * 60 * 60 * 1000, // 7 days
    MONTH: 30 * 24 * 60 * 60 * 1000, // 30 days
});

// Cache size limits
export const CACHE_SIZE_LIMITS = Object.freeze({
    MIN: 10,                     // Minimum cache entries
    DEFAULT: 1000,               // Default cache size
    MAX: 10000,                 // Maximum cache entries
    LARGE: 50000,               // Large cache for enterprise
});

// Cleanup intervals (in milliseconds)
export const CLEANUP_INTERVALS = Object.freeze({
    MINUTE: 60 * 1000,           // Every minute
    FIVE_MINUTES: 5 * 60 * 1000, // Every 5 minutes
    FIFTEEN_MINUTES: 15 * 60 * 1000, // Every 15 minutes
    HOUR: 60 * 60 * 1000,        // Every hour
    DISABLED: 0,                 // No automatic cleanup
});

// Cache key prefixes for different features
export const CACHE_KEY_PREFIXES = Object.freeze({
    AUTH: 'auth:',
    USER: 'user:',
    POST: 'post:',
    COMMENT: 'comment:',
    CHAT: 'chat:',
    NOTIFICATION: 'notification:',
    FEED: 'feed:',
    SEARCH: 'search:',
    ANALYTICS: 'analytics:',
    THEME: 'theme:',
    CONFIG: 'config:',
});

// Cache error codes
export const CACHE_ERROR_CODES = Object.freeze({
    KEY_NOT_FOUND: 'CACHE_KEY_NOT_FOUND',
    INVALID_KEY: 'CACHE_INVALID_KEY',
    CACHE_FULL: 'CACHE_FULL',
    INVALID_TTL: 'CACHE_INVALID_TTL',
    SERIALIZATION_ERROR: 'CACHE_SERIALIZATION_ERROR',
    DESERIALIZATION_ERROR: 'CACHE_DESERIALIZATION_ERROR',
    STORAGE_ERROR: 'CACHE_STORAGE_ERROR',
    CONFIGURATION_ERROR: 'CACHE_CONFIGURATION_ERROR',
    DISPOSED: 'CACHE_DISPOSED',
});

// Cache event names
export const CACHE_EVENTS = Object.freeze({
    HIT: 'cache:hit',
    MISS: 'cache:miss',
    SET: 'cache:set',
    DELETE: 'cache:delete',
    EVICT: 'cache:evict',
    CLEAR: 'cache:clear',
    ERROR: 'cache:error',
    DISPOSE: 'cache:dispose',
});

// Cache statistics keys
export const CACHE_STATS_KEYS = Object.freeze({
    SIZE: 'size',
    HITS: 'hits',
    MISSES: 'misses',
    HIT_RATE: 'hitRate',
    EVICTIONS: 'evictions',
    TOTAL_REQUESTS: 'totalRequests',
    MEMORY_USAGE: 'memoryUsage',
    LAST_ACCESS: 'lastAccess',
});

// Feature-specific cache configurations
export const FEATURE_CACHE_CONFIGS = Object.freeze({
    AUTH: {
        defaultTTL: DEFAULT_TTL.HOUR,
        maxSize: CACHE_SIZE_LIMITS.DEFAULT,
        cleanupInterval: CLEANUP_INTERVALS.FIFTEEN_MINUTES,
    },
    USER: {
        defaultTTL: DEFAULT_TTL.FIFTEEN_MINUTES,
        maxSize: CACHE_SIZE_LIMITS.DEFAULT,
        cleanupInterval: CLEANUP_INTERVALS.FIFTEEN_MINUTES,
    },
    POST: {
        defaultTTL: DEFAULT_TTL.FIVE_MINUTES,
        maxSize: CACHE_SIZE_LIMITS.LARGE,
        cleanupInterval: CLEANUP_INTERVALS.FIVE_MINUTES,
    },
    COMMENT: {
        defaultTTL: DEFAULT_TTL.FIVE_MINUTES,
        maxSize: CACHE_SIZE_LIMITS.LARGE,
        cleanupInterval: CLEANUP_INTERVALS.FIVE_MINUTES,
    },
    CHAT: {
        defaultTTL: DEFAULT_TTL.MINUTE,
        maxSize: CACHE_SIZE_LIMITS.LARGE,
        cleanupInterval: CLEANUP_INTERVALS.MINUTE,
    },
    NOTIFICATION: {
        defaultTTL: DEFAULT_TTL.MINUTE,
        maxSize: CACHE_SIZE_LIMITS.DEFAULT,
        cleanupInterval: CLEANUP_INTERVALS.MINUTE,
    },
    FEED: {
        defaultTTL: DEFAULT_TTL.MINUTE,
        maxSize: CACHE_SIZE_LIMITS.LARGE,
        cleanupInterval: CLEANUP_INTERVALS.MINUTE,
    },
    SEARCH: {
        defaultTTL: DEFAULT_TTL.FIFTEEN_MINUTES,
        maxSize: CACHE_SIZE_LIMITS.DEFAULT,
        cleanupInterval: CLEANUP_INTERVALS.FIFTEEN_MINUTES,
    },
    ANALYTICS: {
        defaultTTL: DEFAULT_TTL.HOUR,
        maxSize: CACHE_SIZE_LIMITS.DEFAULT,
        cleanupInterval: CLEANUP_INTERVALS.HOUR,
    },
    THEME: {
        defaultTTL: DEFAULT_TTL.WEEK,
        maxSize: CACHE_SIZE_LIMITS.MIN,
        cleanupInterval: CLEANUP_INTERVALS.DISABLED,
    },
});

// Cache validation patterns
export const CACHE_VALIDATION = Object.freeze({
    KEY_PATTERN: /^[a-zA-Z0-9_:.-]+$/,
    MAX_KEY_LENGTH: 250,
    MIN_TTL: 1000, // 1 second minimum
    MAX_TTL: DEFAULT_TTL.MONTH,
});

// Cache performance thresholds
export const CACHE_PERFORMANCE_THRESHOLDS = Object.freeze({
    MAX_HIT_RATE: 0.95,          // 95% hit rate is excellent
    MIN_HIT_RATE: 0.5,           // 50% hit rate is acceptable
    MAX_MEMORY_PERCENTAGE: 0.1,  // 10% of available memory
    MAX_EVICTION_RATE: 0.1,      // 10% eviction rate is acceptable
});

// Cache storage types
export const CACHE_STORAGE_TYPES = Object.freeze({
    MEMORY: 'memory',
    LOCAL_STORAGE: 'localStorage',
    SESSION_STORAGE: 'sessionStorage',
    INDEXED_DB: 'indexedDB',
    REDIS: 'redis',
});

// Cache serialization formats
export const CACHE_SERIALIZATION_FORMATS = Object.freeze({
    JSON: 'json',
    BINARY: 'binary',
    CUSTOM: 'custom',
});

/**
 * Validates cache key format
 * 
 * @function isValidCacheKey
 * @param {string} key - Cache key to validate
 * @returns {boolean} Whether key is valid
 * @description Validates cache key against allowed pattern
 */
export function isValidCacheKey(key) {
    return typeof key === 'string' &&
        key.length > 0 &&
        key.length <= CACHE_VALIDATION.MAX_KEY_LENGTH &&
        CACHE_VALIDATION.KEY_PATTERN.test(key);
}

/**
 * Validates TTL value
 * 
 * @function isValidTTL
 * @param {number} ttl - TTL value in milliseconds
 * @returns {boolean} Whether TTL is valid
 * @description Validates TTL against minimum and maximum limits
 */
export function isValidTTL(ttl) {
    return typeof ttl === 'number' &&
        ttl >= CACHE_VALIDATION.MIN_TTL &&
        ttl <= CACHE_VALIDATION.MAX_TTL;
}

/**
 * Validates cache size
 * 
 * @function isValidCacheSize
 * @param {number} size - Cache size
 * @returns {boolean} Whether size is valid
 * @description Validates cache size against limits
 */
export function isValidCacheSize(size) {
    return typeof size === 'number' &&
        size >= CACHE_SIZE_LIMITS.MIN &&
        size <= CACHE_SIZE_LIMITS.MAX;
}

/**
 * Creates cache key with prefix
 * 
 * @function createCacheKey
 * @param {string} prefix - Key prefix
 * @param {string} key - Base key
 * @returns {string} Full cache key
 * @description Creates a cache key with feature prefix
 */
export function createCacheKey(prefix, key) {
    return `${prefix}${key}`;
}

/**
 * Parses cache key to extract prefix and base key
 * 
 * @function parseCacheKey
 * @param {string} fullKey - Full cache key
 * @returns {Object} Parsed key components
 * @property {string} prefix - Key prefix
 * @property {string} key - Base key
 * @description Parses cache key to extract components
 */
export function parseCacheKey(fullKey) {
    const colonIndex = fullKey.indexOf(':');
    if (colonIndex === -1) {
        return { prefix: '', key: fullKey };
    }

    const prefix = fullKey.substring(0, colonIndex + 1);
    const key = fullKey.substring(colonIndex + 1);

    return { prefix, key };
}

/**
 * Gets feature cache configuration
 * 
 * @function getFeatureCacheConfig
 * @param {string} feature - Feature name
 * @returns {Object|null} Feature cache configuration
 * @description Retrieves cache configuration for specific feature
 */
export function getFeatureCacheConfig(feature) {
    const configs = /** @type {Record<string, Object>} */ (FEATURE_CACHE_CONFIGS);
    return configs[feature.toUpperCase()] || null;
}

/**
 * Checks if cache performance is acceptable
 * 
 * @function isCachePerformanceAcceptable
 * @param {number} hitRate - Cache hit rate (0-1)
 * @param {number} evictionRate - Cache eviction rate (0-1)
 * @returns {boolean} Whether performance is acceptable
 * @description Checks if cache performance meets thresholds
 */
export function isCachePerformanceAcceptable(hitRate, evictionRate) {
    return hitRate >= CACHE_PERFORMANCE_THRESHOLDS.MIN_HIT_RATE &&
        evictionRate <= CACHE_PERFORMANCE_THRESHOLDS.MAX_EVICTION_RATE;
}

/**
 * Checks if cache performance is excellent
 * 
 * @function isCachePerformanceExcellent
 * @param {number} hitRate - Cache hit rate (0-1)
 * @param {number} evictionRate - Cache eviction rate (0-1)
 * @returns {boolean} Whether performance is excellent
 * @description Checks if cache performance exceeds thresholds
 */
export function isCachePerformanceExcellent(hitRate, evictionRate) {
    return hitRate >= CACHE_PERFORMANCE_THRESHOLDS.MAX_HIT_RATE &&
        evictionRate <= CACHE_PERFORMANCE_THRESHOLDS.MAX_EVICTION_RATE;
}
