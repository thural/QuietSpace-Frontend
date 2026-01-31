/**
 * Cache Manager Interface
 * 
 * Single responsibility: Cache operations and management
 */

/**
 * Cache Manager interface
 * @typedef {Object} ICacheManager
 * @property {function} get - Get cached data
 * @property {function} set - Set cached data with TTL
 * @property {function} invalidate - Invalidate cache entry
 * @property {function} getEntry - Get cache entry with metadata
 * @property {function} isStale - Check if data is stale
 * @property {function} getStats - Get cache statistics
 * @property {function} generateKey - Generate cache key from parameters
 */

// Export for JSDoc usage
export {};
