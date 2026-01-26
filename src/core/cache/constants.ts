/**
 * Cache Module Constants
 * 
 * Centralized constants for the cache system including default values,
 * error codes, cache keys, and configuration limits.
 */

// Default TTL values (in milliseconds)
export const DEFAULT_TTL = {
    MINUTE: 60 * 1000,           // 1 minute
    FIVE_MINUTES: 5 * 60 * 1000, // 5 minutes
    FIFTEEN_MINUTES: 15 * 60 * 1000, // 15 minutes
    HOUR: 60 * 60 * 1000,        // 1 hour
    DAY: 24 * 60 * 60 * 1000,    // 24 hours
    WEEK: 7 * 24 * 60 * 60 * 1000, // 7 days
    MONTH: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const;

// Cache size limits
export const CACHE_SIZE_LIMITS = {
    MIN: 10,                     // Minimum cache entries
    DEFAULT: 1000,               // Default cache size
    MAX: 10000,                 // Maximum cache entries
    LARGE: 50000,               // Large cache for enterprise
} as const;

// Cleanup intervals (in milliseconds)
export const CLEANUP_INTERVALS = {
    MINUTE: 60 * 1000,           // Every minute
    FIVE_MINUTES: 5 * 60 * 1000, // Every 5 minutes
    FIFTEEN_MINUTES: 15 * 60 * 1000, // Every 15 minutes
    HOUR: 60 * 60 * 1000,        // Every hour
    DISABLED: 0,                 // No automatic cleanup
} as const;

// Cache key prefixes for different features
export const CACHE_KEY_PREFIXES = {
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
} as const;

// Cache error codes
export const CACHE_ERROR_CODES = {
    KEY_NOT_FOUND: 'CACHE_KEY_NOT_FOUND',
    INVALID_KEY: 'CACHE_INVALID_KEY',
    CACHE_FULL: 'CACHE_FULL',
    INVALID_TTL: 'CACHE_INVALID_TTL',
    SERIALIZATION_ERROR: 'CACHE_SERIALIZATION_ERROR',
    DESERIALIZATION_ERROR: 'CACHE_DESERIALIZATION_ERROR',
    STORAGE_ERROR: 'CACHE_STORAGE_ERROR',
    CONFIGURATION_ERROR: 'CACHE_CONFIGURATION_ERROR',
    DISPOSED: 'CACHE_DISPOSED',
} as const;

// Cache event names
export const CACHE_EVENTS = {
    HIT: 'cache:hit',
    MISS: 'cache:miss',
    SET: 'cache:set',
    DELETE: 'cache:delete',
    EVICT: 'cache:evict',
    CLEAR: 'cache:clear',
    ERROR: 'cache:error',
    DISPOSE: 'cache:dispose',
} as const;

// Cache statistics keys
export const CACHE_STATS_KEYS = {
    SIZE: 'size',
    HITS: 'hits',
    MISSES: 'misses',
    HIT_RATE: 'hitRate',
    EVICTIONS: 'evictions',
    TOTAL_REQUESTS: 'totalRequests',
    MEMORY_USAGE: 'memoryUsage',
    LAST_ACCESS: 'lastAccess',
} as const;

// Feature-specific cache configurations
export const FEATURE_CACHE_CONFIGS = {
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
} as const;

// Cache validation patterns
export const CACHE_VALIDATION = {
    KEY_PATTERN: /^[a-zA-Z0-9_:.-]+$/,
    MAX_KEY_LENGTH: 250,
    MIN_TTL: 1000, // 1 second minimum
    MAX_TTL: DEFAULT_TTL.MONTH,
} as const;

// Cache performance thresholds
export const CACHE_PERFORMANCE_THRESHOLDS = {
    MAX_HIT_RATE: 0.95,          // 95% hit rate is excellent
    MIN_HIT_RATE: 0.5,           // 50% hit rate is acceptable
    MAX_MEMORY_PERCENTAGE: 0.1,  // 10% of available memory
    MAX_EVICTION_RATE: 0.1,      // 10% eviction rate is acceptable
} as const;

// Cache storage types
export const CACHE_STORAGE_TYPES = {
    MEMORY: 'memory',
    LOCAL_STORAGE: 'localStorage',
    SESSION_STORAGE: 'sessionStorage',
    INDEXED_DB: 'indexedDB',
    REDIS: 'redis',
} as const;

// Cache serialization formats
export const CACHE_SERIALIZATION_FORMATS = {
    JSON: 'json',
    BINARY: 'binary',
    CUSTOM: 'custom',
} as const;
