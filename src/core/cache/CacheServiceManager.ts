import { CacheProvider, type CacheConfig, type CacheEvents } from './CacheProvider';

export interface CacheServiceConfig {
  defaultCache?: Partial<CacheConfig>;
  featureCaches?: Record<string, Partial<CacheConfig>>;
}

export interface FeatureCacheService {
  getCache(featureName: string): CacheProvider;
  invalidateFeature(featureName: string): void;
  invalidatePattern(pattern: string): number;
  getGlobalStats(): Record<string, unknown>;
  dispose(): void;
}

export class CacheServiceManager implements FeatureCacheService {
  private readonly caches = new Map<string, CacheProvider>();
  private readonly globalConfig: CacheServiceConfig;

  constructor(config: CacheServiceConfig = {}) {
    this.globalConfig = config;
  }

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

      const cache = new CacheProvider(config, events);
      this.caches.set(featureName, cache);
    }

    return this.caches.get(featureName)!;
  }

  invalidateFeature(featureName: string): void {
    const cache = this.caches.get(featureName);
    if (cache) {
      cache.clear();
    }
  }

  invalidatePattern(pattern: string): number {
    let totalInvalidated = 0;
    for (const cache of this.caches.values()) {
      totalInvalidated += cache.invalidatePattern(pattern);
    }
    return totalInvalidated;
  }

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

  dispose(): void {
    for (const cache of this.caches.values()) {
      cache.dispose();
    }
    this.caches.clear();
  }
}
