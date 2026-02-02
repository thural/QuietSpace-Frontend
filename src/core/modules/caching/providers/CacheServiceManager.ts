/**
 * Cache Service Manager - Multi-cache management.
 * 
 * Manages multiple cache instances for different features with
 * centralized configuration and statistics aggregation.
 */

import { CacheProvider } from './CacheProvider';
import { CacheStorage } from '../storage/CacheStorage';
import { CacheStatistics } from '../storage/CacheStatistics';
import { LRUEvictionStrategy } from '../strategies/CacheEvictionStrategy';
import { CacheCleanupManager } from '../strategies/CacheCleanupManager';
import type { CacheConfig, CacheEvents } from '../types/interfaces';

/**
 * Configuration for cache service manager.
 */
export interface CacheServiceConfig {
  /** Default configuration for all feature caches */
  defaultCache?: Partial<CacheConfig>;
  /** Feature-specific cache configurations */
  featureCaches?: Record<string, Partial<CacheConfig>>;
}

/**
 * Interface for feature cache service operations.
 */
export interface FeatureCacheService {
  /** Gets or creates a cache instance for a specific feature */
  getCache(featureName: string): CacheProvider;
  /** Invalidates all cache entries for a specific feature */
  invalidateFeature(featureName: string): void;
  /** Invalidates cache entries across all features matching pattern */
  invalidatePattern(pattern: string): Promise<number>;
  /** Gets aggregated statistics across all cache instances */
  getGlobalStats(): Record<string, unknown>;
  /** Disposes all cache instances managed by this service manager */
  dispose(): void;
}

/**
 * Cache service manager implementation.
 * Provides centralized management of feature-specific caches.
 */
export class CacheServiceManager implements FeatureCacheService {
  private readonly caches = new Map<string, CacheProvider>();
  private readonly globalConfig: CacheServiceConfig;

  /**
   * Creates a new cache service manager.
   * @param config - Optional configuration for cache service
   */
  constructor(config: CacheServiceConfig = {}) {
    this.globalConfig = config;
  }

  /**
   * Gets or creates a cache instance for a specific feature.
   * @param featureName - Name of the feature/cache instance
   * @returns Cache provider instance for the feature
   */
  getCache(featureName: string): CacheProvider {
    if (!this.caches.has(featureName)) {
      const config = {
        ...this.globalConfig.defaultCache,
        ...this.globalConfig.featureCaches?.[featureName]
      };

      const events: CacheEvents = {
        onHit: (key) => console.debug(`[${featureName}] Cache hit: ${key}`),
        onMiss: (key) => console.debug(`[${featureName}] Cache miss: ${key}`),
        onEvict: (key) => console.debug(`[${featureName}] Cache evict: ${key}`),
        onError: (error, operation, key) => console.error(`[${featureName}] Cache error: ${operation}`, error, key)
      };

      const cache = new CacheProvider(
        new CacheStorage(),
        new CacheStatistics(),
        new LRUEvictionStrategy(),
        new CacheCleanupManager(),
        config,
        events
      );
      this.caches.set(featureName, cache);
    }

    return this.caches.get(featureName)!;
  }

  /**
   * Invalidates all cache entries for a specific feature.
   * @param featureName - Name of the feature to invalidate
   */
  invalidateFeature(featureName: string): void {
    const cache = this.caches.get(featureName);
    if (cache) {
      cache.clear();
    }
  }

  /**
   * Invalidates cache entries across all features matching pattern.
   * @param pattern - Pattern to match keys against across all caches
   * @returns Promise resolving to total number of entries invalidated
   */
  async invalidatePattern(pattern: string): Promise<number> {
    let totalInvalidated = 0;
    for (const cache of this.caches.values()) {
      totalInvalidated += await cache.invalidatePattern(pattern);
    }
    return totalInvalidated;
  }

  /**
   * Gets aggregated statistics across all cache instances.
   * @returns Record mapping feature names to their statistics
   */
  getGlobalStats(): Record<string, unknown> {
    const stats: Record<string, unknown> = {
      totalCaches: this.caches.size,
      features: {}
    };

    for (const [featureName, cache] of this.caches) {
      (stats.features as Record<string, unknown>)[featureName] = cache.getStats();
    }

    return stats;
  }

  /**
   * Disposes all cache instances managed by this service manager.
   */
  dispose(): void {
    for (const cache of this.caches.values()) {
      cache.dispose();
    }
    this.caches.clear();
  }
}
