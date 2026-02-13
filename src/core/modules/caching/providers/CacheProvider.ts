
/**
 * Cache Provider - Main cache implementation.
 * 
 * Orchestrates cache operations using injected components for storage,
 * statistics, eviction strategies, and cleanup management.
 * Follows dependency injection pattern for testability and flexibility.
 * Enhanced with advanced caching features including warming, predictive caching, and analytics.
 */

import type {
  CacheEntry,
  CacheConfig,
  CacheStats,
  CacheEvents
} from '../types/interfaces';
import type { ICacheStorage } from '../storage/CacheStorage';
import type { ICacheStatistics } from '../storage/CacheStatistics';
import type { IEvictionStrategy } from '../strategies/CacheEvictionStrategy';
import type { ICleanupManager } from '../strategies/CacheCleanupManager';
import {
  CacheWarmingManager,
  PredictiveCacheEngine,
  CacheDependencyGraph,
  CacheAnalyticsDashboard,
  type CacheWarmingConfig,
  type PredictiveCacheConfig,
  type CacheDependencyConfig,
  type CacheAnalyticsConfig,
  type ExtendedCacheStats
} from '../features/AdvancedCacheFeatures';
import {
  CacheMemoryManager,
  type IMemoryPoolConfig,
  type IMemoryUsageStats
} from '../optimization/MemoryManagement';

/**
 * Main cache provider implementation.
 * Coordinates storage, statistics, eviction, and cleanup components.
 * Enhanced with advanced caching features.
 */
export class CacheProvider {
  private readonly storage: ICacheStorage;
  private readonly statistics: ICacheStatistics;
  private readonly evictionStrategy: IEvictionStrategy;
  private readonly cleanupManager: ICleanupManager;
  private config: CacheConfig;
  private readonly events: CacheEvents | undefined;

  // Advanced features
  private warmingManager?: CacheWarmingManager;
  private predictiveEngine?: PredictiveCacheEngine;
  private dependencyGraph?: CacheDependencyGraph;
  private analyticsDashboard?: CacheAnalyticsDashboard;
  private memoryManager?: CacheMemoryManager;

  /**
   * Creates a new cache provider instance.
   * @param storage - Storage component for cache entries
   * @param statistics - Statistics tracking component
   * @param evictionStrategy - Eviction strategy component
   * @param cleanupManager - Cleanup management component
   * @param config - Optional cache configuration
   * @param events - Optional event handlers
   */
  constructor(
    storage: ICacheStorage,
    statistics: ICacheStatistics,
    evictionStrategy: IEvictionStrategy,
    cleanupManager: ICleanupManager,
    config: Partial<CacheConfig> = {},
    events?: CacheEvents
  ) {
    this.storage = storage;
    this.statistics = statistics;
    this.evictionStrategy = evictionStrategy;
    this.cleanupManager = cleanupManager;

    this.config = {
      defaultTTL: 300000,
      maxSize: 1000,
      cleanupInterval: 60000,
      enableStats: true,
      enableLRU: true,
      ...config
    };
    this.events = events;

    // Start cleanup timer
    this.cleanupManager.startCleanup(this.config.cleanupInterval, () => this.cleanupExpired());
  }

  /**
   * Retrieves cached data by key.
   * @param key - The cache key to retrieve
   * @returns Promise resolving to cached data or null if not found/expired
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const entry = this.storage.get<T>(key);

      if (!entry) {
        this.statistics.recordMiss();
        this.events?.onMiss?.(key);
        return null;
      }

      if (this.isExpired(entry)) {
        this.storage.delete(key);
        this.statistics.recordMiss();
        this.events?.onMiss?.(key);
        return null;
      }

      if (this.config.enableLRU) {
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        this.evictionStrategy.onAccess(key);
      }

      this.statistics.recordHit();
      this.events?.onHit?.(key, entry.data);
      return entry.data;
    } catch (error) {
      this.events?.onError?.(error as Error, 'get', key);
      return null;
    }
  }

  /**
   * Retrieves the full cache entry including metadata.
   * @param key - The cache key to retrieve
   * @returns Promise resolving to cache entry or null if not found/expired
   */
  async getEntry<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const entry = this.storage.get<T>(key);

      if (!entry) {
        return null;
      }

      if (this.isExpired(entry)) {
        this.storage.delete(key);
        return null;
      }

      if (this.config.enableLRU) {
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        this.evictionStrategy.onAccess(key);
      }

      return entry;
    } catch (error) {
      this.events?.onError?.(error as Error, 'getEntry', key);
      return null;
    }
  }

  /**
   * Stores data in cache with optional TTL.
   * @param key - The cache key to store under
   * @param data - The data to cache
   * @param ttl - Optional time-to-live in milliseconds (uses default if not provided)
   */
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      if (this.storage.size() >= this.config.maxSize) {
        await this.evictLRU();
      }

      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl !== undefined ? ttl : this.config.defaultTTL,
        accessCount: 1,
        lastAccessed: Date.now()
      };

      this.storage.set(key, entry);
      this.evictionStrategy.onAccess(key);
    } catch (error) {
      this.events?.onError?.(error as Error, 'set', key);
    }
  }

  /**
   * Removes a specific entry from cache.
   * @param key - The cache key to invalidate
   * @returns Promise resolving to true if entry was removed, false if not found
   */
  async invalidate(key: string): Promise<boolean> {
    try {
      const entry = this.storage.get(key);
      const deleted = this.storage.delete(key);

      if (deleted && entry) {
        this.events?.onEvict?.(key, entry.data);
      }

      return deleted;
    } catch (error) {
      this.events?.onError?.(error as Error, 'invalidate', key);
      return false;
    }
  }

  /**
   * Alias for invalidate for backward compatibility.
   * @param key - The cache key to delete
   * @returns Promise resolving to true if entry was removed, false if not found
   */
  async delete(key: string): Promise<boolean> {
    // Alias for invalidate for backward compatibility
    return this.invalidate(key);
  }

  /**
   * Removes all cache entries matching the given pattern.
   * @param pattern - String pattern or RegExp to match keys against
   * @returns Promise resolving to number of entries invalidated
   */
  async invalidatePattern(pattern: string | RegExp): Promise<number> {
    try {
      let count = 0;
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

      for (const key of this.storage.keys()) {
        if (regex.test(key)) {
          await this.invalidate(key);
          count++;
        }
      }

      return count;
    } catch (error) {
      this.events?.onError?.(error as Error, 'invalidatePattern');
      return 0;
    }
  }

  /**
   * Clears all entries from the cache.
   */
  async clear(): Promise<void> {
    try {
      if (this.events?.onEvict) {
        for (const [key, entry] of this.storage.entries()) {
          this.events.onEvict(key, entry.data);
        }
      }

      this.storage.clear();
      this.statistics.reset();
    } catch (error) {
      this.events?.onError?.(error as Error, 'clear');
    }
  }

  /**
   * Checks if a key exists in cache and is not expired.
   * @param key - The cache key to check
   * @returns Promise resolving to true if key exists and is valid
   */
  async has(key: string): Promise<boolean> {
    try {
      const entry = this.storage.get(key);
      if (!entry) return false;

      if (this.isExpired(entry)) {
        this.storage.delete(key);
        return false;
      }

      return true;
    } catch (error) {
      this.events?.onError?.(error as Error, 'has', key);
      return false;
    }
  }

  /**
   * Gets current cache statistics.
   * @returns Current cache statistics including hit rate, size, etc.
   */
  getStats(): CacheStats {
    const stats = this.statistics.getStats();
    return {
      ...stats,
      size: this.storage.size()
    };
  }

  /**
   * Gets current cache configuration.
   * @returns Current cache configuration settings
   */
  getConfig(): CacheConfig {
    return { ...this.config };
  }

  /**
   * Updates cache configuration with new settings.
   * @param newConfig - Partial configuration to merge with current config
   */
  async updateConfig(newConfig: Partial<CacheConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.cleanupInterval) {
      this.cleanupManager.stopCleanup();
      this.cleanupManager.startCleanup(this.config.cleanupInterval, () => this.cleanupExpired());
    }
  }

  /**
   * Disposes the cache provider and cleans up resources.
   */
  async dispose(): Promise<void> {
    this.cleanupManager.stopCleanup();
    await this.clear();
  }

  /**
   * Evicts the least recently used entry from cache.
   */
  private async evictLRU(): Promise<void> {
    if (!this.config.enableLRU) {
      const keys = this.storage.keys();
      const firstKey = keys[0];
      if (firstKey) {
        await this.invalidate(firstKey);
      }
      return;
    }

    const evictKey = this.evictionStrategy.shouldEvict(this.storage.entries().reduce((map, [key, entry]) => {
      map.set(key, entry);
      return map;
    }, new Map<string, CacheEntry<unknown>>()));

    if (evictKey) {
      await this.invalidate(evictKey);
      this.statistics.recordEviction();
    }
  }

  /**
   * Cleans up expired cache entries.
   */
  private async cleanupExpired(): Promise<void> {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.storage.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      await this.invalidate(key);
    }
  }

  /**
   * Checks if a cache entry has expired.
   * @param entry - Cache entry to check
   * @returns True if entry has expired
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    // TTL of 0 means immediate expiration
    if (entry.ttl <= 0) {
      return true;
    }
    return Date.now() - entry.timestamp > entry.ttl;
  }
}
