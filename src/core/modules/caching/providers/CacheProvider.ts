
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

export class CacheProvider {
  private readonly storage: ICacheStorage;
  private readonly statistics: ICacheStatistics;
  private readonly evictionStrategy: IEvictionStrategy;
  private readonly cleanupManager: ICleanupManager;
  private config: CacheConfig;
  private readonly events: CacheEvents | undefined;

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

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      if (this.storage.size() >= this.config.maxSize) {
        await this.evictLRU();
      }

      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.config.defaultTTL,
        accessCount: 1,
        lastAccessed: Date.now()
      };

      this.storage.set(key, entry);
      this.evictionStrategy.onAccess(key);
    } catch (error) {
      this.events?.onError?.(error as Error, 'set', key);
    }
  }

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

  async delete(key: string): Promise<boolean> {
    // Alias for invalidate for backward compatibility
    return this.invalidate(key);
  }

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

  getStats(): CacheStats {
    const stats = this.statistics.getStats();
    return {
      ...stats,
      size: this.storage.size()
    };
  }

  getConfig(): CacheConfig {
    return { ...this.config };
  }

  async updateConfig(newConfig: Partial<CacheConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.cleanupInterval) {
      this.cleanupManager.stopCleanup();
      this.cleanupManager.startCleanup(this.config.cleanupInterval, () => this.cleanupExpired());
    }
  }

  async dispose(): Promise<void> {
    this.cleanupManager.stopCleanup();
    await this.clear();
  }

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

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }
}
