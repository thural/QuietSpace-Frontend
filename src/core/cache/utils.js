/**
 * Cache System Utilities
 * 
 * Utility functions for cache operations following Black Box pattern.
 * Provides clean utility functions for validation, initialization, and management.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./interfaces/index.js').ICacheProvider} ICacheProvider
 * @typedef {import('./interfaces/index.js').ICacheServiceManager} ICacheServiceManager
 * @typedef {import('./interfaces/index.js').CacheConfig} CacheConfig
 * @typedef {import('./CacheProvider.js').CacheEntry} CacheEntry
 * @typedef {import('./CacheProvider.js').CacheStats} CacheStats
 */

import { DEFAULT_CACHE_CONFIG } from './interfaces/index.js';

/**
 * Validates cache configuration
 * 
 * @function validateCacheConfig
 * @param {any} config - Configuration to validate
 * @returns {string[]} Array of validation errors
 * @description Validates cache configuration and returns errors
 */
export function validateCacheConfig(config) {
    const errors = [];

    if (!config || typeof config !== 'object') {
        errors.push('Configuration must be an object');
        return errors;
    }

    // Validate maxSize
    if (config.maxSize !== undefined) {
        if (typeof config.maxSize !== 'number' || config.maxSize < 1) {
            errors.push('maxSize must be a positive number');
        }
    }

    // Validate defaultTtl
    if (config.defaultTtl !== undefined) {
        if (typeof config.defaultTtl !== 'number' || config.defaultTtl < 1000) {
            errors.push('defaultTtl must be at least 1000ms (1 second)');
        }
    }

    // Validate strategy
    if (config.strategy !== undefined) {
        const validStrategies = ['lru', 'lfu', 'fifo', 'random', 'ttl'];
        if (!validStrategies.includes(config.strategy)) {
            errors.push(`strategy must be one of: ${validStrategies.join(', ')}`);
        }
    }

    // Validate boolean options
    const booleanOptions = ['enableMetrics', 'enableCompression', 'enableEncryption'];
    for (const option of booleanOptions) {
        if (config[option] !== undefined && typeof config[option] !== 'boolean') {
            errors.push(`${option} must be a boolean`);
        }
    }

    return errors;
}

/**
 * Creates a validated cache configuration
 * 
 * @function createCacheConfig
 * @param {any} config - Configuration to create
 * @returns {CacheConfig} Validated cache configuration
 * @description Creates and validates cache configuration
 */
export function createCacheConfig(config = {}) {
    const validatedConfig = { ...DEFAULT_CACHE_CONFIG, ...config };
    const errors = validateCacheConfig(validatedConfig);

    if (errors.length > 0) {
        throw new Error(`Invalid cache configuration: ${errors.join(', ')}`);
    }

    return validatedConfig;
}

/**
 * Generates cache key with namespace
 * 
 * @function generateCacheKey
 * @param {string} namespace - Cache namespace
 * @param {string} key - Cache key
 * @returns {string} Namespaced cache key
 * @description Generates a namespaced cache key
 */
export function generateCacheKey(namespace, key) {
    if (!namespace || !key) {
        throw new Error('Both namespace and key are required');
    }
    return `${namespace}:${key}`;
}

/**
 * Parses cache key to extract namespace and key
 * 
 * @function parseCacheKey
 * @param {string} namespacedKey - Namespaced cache key
 * @returns {Object} Object with namespace and key
 * @description Parses a namespaced cache key
 */
export function parseCacheKey(namespacedKey) {
    const separatorIndex = namespacedKey.indexOf(':');
    
    if (separatorIndex === -1) {
        return { namespace: '', key: namespacedKey };
    }

    return {
        namespace: namespacedKey.substring(0, separatorIndex),
        key: namespacedKey.substring(separatorIndex + 1)
    };
}

/**
 * Checks if cache entry is expired
 * 
 * @function isEntryExpired
 * @param {CacheEntry} entry - Cache entry to check
 * @returns {boolean} Whether entry is expired
 * @description Checks if a cache entry has expired
 */
export function isEntryExpired(entry) {
    if (!entry || !entry.timestamp) {
        return true;
    }

    const now = Date.now();
    const expiresAt = entry.timestamp + (entry.ttl || 0);
    return now > expiresAt;
}

/**
 * Calculates cache hit rate
 * 
 * @function calculateHitRate
 * @param {number} hits - Number of hits
 * @param {number} misses - Number of misses
 * @returns {number} Hit rate (0-1)
 * @description Calculates cache hit rate as percentage
 */
export function calculateHitRate(hits, misses) {
    const total = hits + misses;
    return total > 0 ? hits / total : 0;
}

/**
 * Formats cache size for display
 * 
 * @function formatCacheSize
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 * @description Formats cache size in human readable format
 */
export function formatCacheSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Creates cache statistics
 * 
 * @function createCacheStats
 * @param {Object} stats - Statistics data
 * @param {number} [stats.size] - Cache size
 * @param {number} [stats.hits] - Number of hits
 * @param {number} [stats.misses] - Number of misses
 * @param {number} [stats.memoryUsage] - Memory usage
 * @returns {CacheStats} Cache statistics object
 * @description Creates cache statistics object
 */
export function createCacheStats(stats = {}) {
    const hits = stats.hits || 0;
    const misses = stats.misses || 0;
    
    return {
        size: stats.size || 0,
        hits,
        misses,
        hitRate: calculateHitRate(hits, misses),
        memoryUsage: stats.memoryUsage || 0
    };
}

/**
 * Serializes cache entry for storage
 * 
 * @function serializeEntry
 * @param {CacheEntry} entry - Cache entry to serialize
 * @returns {string} Serialized entry
 * @description Serializes cache entry to JSON string
 */
export function serializeEntry(entry) {
    return JSON.stringify({
        data: entry.data,
        timestamp: entry.timestamp,
        ttl: entry.ttl,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed
    });
}

/**
 * Deserializes cache entry from storage
 * 
 * @function deserializeEntry
 * @param {string} data - Serialized entry data
 * @returns {CacheEntry} Deserialized cache entry
 * @description Deserializes cache entry from JSON string
 */
export function deserializeEntry(data) {
    const parsed = JSON.parse(data);
    
    const entry = new CacheEntry(parsed.data, parsed.ttl);
    entry.timestamp = parsed.timestamp;
    entry.accessCount = parsed.accessCount || 0;
    entry.lastAccessed = parsed.lastAccessed || parsed.timestamp;
    
    return entry;
}

/**
 * Creates cache entry with metadata
 * 
 * @function createCacheEntry
 * @param {any} data - Data to cache
 * @param {number} [ttl] - Time to live
 * @returns {CacheEntry} Cache entry with metadata
 * @description Creates a new cache entry with metadata
 */
export function createCacheEntry(data, ttl) {
    return new CacheEntry(data, ttl);
}

/**
 * Updates cache entry access information
 * 
 * @function updateEntryAccess
 * @param {CacheEntry} entry - Cache entry to update
 * @returns {void}
 * @description Updates access count and last accessed time
 */
export function updateEntryAccess(entry) {
    entry.accessCount++;
    entry.lastAccessed = Date.now();
}

/**
 * Merges cache configurations
 * 
 * @function mergeCacheConfigs
 * @param {CacheConfig} base - Base configuration
 * @param {CacheConfig} override - Override configuration
 * @returns {CacheConfig} Merged configuration
 * @description Merges two cache configurations with override taking precedence
 */
export function mergeCacheConfigs(base, override) {
    return createCacheConfig({ ...base, ...override });
}

/**
 * Validates cache key
 * 
 * @function validateCacheKey
 * @param {string} key - Cache key to validate
 * @returns {boolean} Whether key is valid
 * @description Validates cache key format and characters
 */
export function validateCacheKey(key) {
    if (!key || typeof key !== 'string') {
        return false;
    }

    // Check length
    if (key.length < 1 || key.length > 255) {
        return false;
    }

    // Check for invalid characters
    const invalidChars = [' ', '\t', '\n', '\r'];
    for (const char of invalidChars) {
        if (key.includes(char)) {
            return false;
        }
    }

    // Check pattern (alphanumeric, underscore, hyphen)
    const pattern = /^[a-zA-Z0-9_-]+$/;
    return pattern.test(key);
}

/**
 * Sanitizes cache key
 * 
 * @function sanitizeCacheKey
 * @param {string} key - Cache key to sanitize
 * @returns {string} Sanitized cache key
 * @description Sanitizes cache key by removing invalid characters
 */
export function sanitizeCacheKey(key) {
    if (!key || typeof key !== 'string') {
        return '';
    }

    // Remove invalid characters and replace with underscore
    return key.replace(/[^a-zA-Z0-9_-]/g, '_');
}

/**
 * Gets cache expiration time
 * 
 * @function getExpirationTime
 * @param {CacheEntry} entry - Cache entry
 * @returns {number} Expiration timestamp
 * @description Gets the expiration timestamp for a cache entry
 */
export function getExpirationTime(entry) {
    if (!entry || !entry.timestamp) {
        return 0;
    }
    return entry.timestamp + (entry.ttl || 0);
}

/**
 * Checks if cache entry should be evicted based on policy
 * 
 * @function shouldEvictEntry
 * @param {CacheEntry} entry - Cache entry to check
 * @param {string} strategy - Eviction strategy
 * @returns {boolean} Whether entry should be evicted
 * @description Determines if entry should be evicted based on strategy
 */
export function shouldEvictEntry(entry, strategy = 'lru') {
    if (!entry) {
        return true;
    }

    // Always evict expired entries
    if (isEntryExpired(entry)) {
        return true;
    }

    switch (strategy) {
        case 'ttl':
            return false; // TTL strategy only evicts expired entries
        case 'random':
            return Math.random() < 0.1; // 10% chance to evict
        case 'fifo':
            return false; // FIFO strategy handled by implementation
        case 'lfu':
            return entry.accessCount < 2; // Evict least frequently used
        case 'lru':
        default:
            return false; // LRU strategy handled by implementation
    }
}
