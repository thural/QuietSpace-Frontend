/**
 * Cache Manager Interface
 *
 * Single responsibility: Cache operations and management
 */


export interface ICacheManager {
  /**
   * Get cached data
   */
  get<T>(key: string): T | undefined;

  /**
   * Set cached data with TTL
   */
  set<T>(key: string, data: T, ttl?: number): void;

  /**
   * Invalidate cache entry
   */
  invalidate(key: string): void;

  /**
   * Get cache entry with metadata
   */
  getEntry(key: string): { data: any; timestamp: number; ttl?: number } | undefined;

  /**
   * Check if data is stale
   */
  isStale(key: string, staleTime: number): boolean;

  /**
   * Get cache statistics
   */
  getStats(): any;

  /**
   * Generate cache key from parameters
   */
  generateKey(base: string, params?: Record<string, any>): string;
}
