/**
 * Cache Manager Implementation
 * 
 * Implements cache operations with intelligent key management
 */

/**
 * Cache Manager implementation class
 */
export class CacheManager {
  /** @type {Object} */
  #cache;

  constructor(cache) {
    this.#cache = cache;
  }

  /**
   * Get cached data
   * @param {string} key - Cache key
   * @returns {*} Cached data or undefined
   */
  get(key) {
    return this.#cache.get(key);
  }

  /**
   * Set cached data with TTL
   * @param {string} key - Cache key
   * @param {*} data - Data to cache
   * @param {number} [ttl] - Time to live
   */
  set(key, data, ttl) {
    this.#cache.set(key, data, ttl);
  }

  /**
   * Invalidate cache entry
   * @param {string} key - Cache key to invalidate
   */
  invalidate(key) {
    this.#cache.invalidate(key);
  }

  /**
   * Get cache entry with metadata
   * @param {string} key - Cache key
   * @returns {Object|undefined} Cache entry with metadata
   */
  getEntry(key) {
    return this.#cache.getEntry(key);
  }

  /**
   * Check if data is stale
   * @param {string} key - Cache key
   * @param {number} staleTime - Stale time threshold
   * @returns {boolean} Whether data is stale
   */
  isStale(key, staleTime) {
    const entry = this.getEntry(key);
    if (!entry) return true;

    const cacheAge = Date.now() - entry.timestamp;
    return cacheAge > staleTime;
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    return this.#cache.getStats();
  }

  /**
   * Generate cache key from parameters
   * @param {string} base - Base key
   * @param {Object} [params] - Parameters to include in key
   * @returns {string} Generated cache key
   */
  generateKey(base, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join(':');

    return sortedParams ? `${base}:${sortedParams}` : base;
  }

  /**
   * Clean up resources
   */
  destroy() {
    // Cache provider cleanup handled by the cache itself
  }
}
