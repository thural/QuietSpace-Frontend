import { Injectable } from '@/core/di';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  cleanupInterval: number;
  enableStats: boolean;
  enableLRU: boolean;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
  totalRequests: number;
}

export interface CacheEvents {
  onHit?: (key: string, data: any) => void;
  onMiss?: (key: string) => void;
  onEvict?: (key: string, data: any) => void;
  onError?: (error: Error, operation: string, key?: string) => void;
}

@Injectable()
export class CacheProvider {
  private cache = new Map<string, CacheEntry<any>>();
  private hits = 0;
  private misses = 0;
  private evictions = 0;
  private cleanupTimer?: NodeJS.Timeout;
  private config: CacheConfig;
  private events?: CacheEvents;

  constructor(config: Partial<CacheConfig> = {}, events?: CacheEvents) {
    this.config = {
      defaultTTL: 300000,
      maxSize: 1000,
      cleanupInterval: 60000,
      enableStats: true,
      enableLRU: true,
      ...config
    };
    this.events = events;
    this.startCleanupTimer();
  }

  get<T>(key: string): T | null {
    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.misses++;
        this.events?.onMiss?.(key);
        return null;
      }

      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.misses++;
        this.events?.onMiss?.(key);
        return null;
      }

      if (this.config.enableLRU) {
        entry.accessCount++;
        entry.lastAccessed = Date.now();
      }

      this.hits++;
      this.events?.onHit?.(key, entry.data);
      return entry.data;
    } catch (error) {
      this.events?.onError?.(error as Error, 'get', key);
      return null;
    }
  }

  getEntry<T>(key: string): CacheEntry<T> | null {
    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        return null;
      }

      if (this.isExpired(entry)) {
        this.cache.delete(key);
        return null;
      }

      if (this.config.enableLRU) {
        entry.accessCount++;
        entry.lastAccessed = Date.now();
      }

      return entry;
    } catch (error) {
      this.events?.onError?.(error as Error, 'getEntry', key);
      return null;
    }
  }

  set<T>(key: string, data: T, ttl?: number): void {
    try {
      if (this.cache.size >= this.config.maxSize) {
        this.evictLRU();
      }

      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.config.defaultTTL,
        accessCount: 1,
        lastAccessed: Date.now()
      };
      
      this.cache.set(key, entry);
    } catch (error) {
      this.events?.onError?.(error as Error, 'set', key);
    }
  }

  invalidate(key: string): boolean {
    try {
      const entry = this.cache.get(key);
      const deleted = this.cache.delete(key);
      
      if (deleted && entry) {
        this.events?.onEvict?.(key, entry.data);
      }
      
      return deleted;
    } catch (error) {
      this.events?.onError?.(error as Error, 'invalidate', key);
      return false;
    }
  }

  invalidatePattern(pattern: string | RegExp): number {
    try {
      let count = 0;
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      
      for (const [key] of this.cache) {
        if (regex.test(key)) {
          this.invalidate(key);
          count++;
        }
      }
      
      return count;
    } catch (error) {
      this.events?.onError?.(error as Error, 'invalidatePattern');
      return 0;
    }
  }

  clear(): void {
    try {
      if (this.events?.onEvict) {
        for (const [key, entry] of this.cache) {
          this.events.onEvict(key, entry.data);
        }
      }
      
      this.cache.clear();
      this.resetStats();
    } catch (error) {
      this.events?.onError?.(error as Error, 'clear');
    }
  }

  has(key: string): boolean {
    try {
      const entry = this.cache.get(key);
      if (!entry) return false;
      
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        return false;
      }
      
      return true;
    } catch (error) {
      this.events?.onError?.(error as Error, 'has', key);
      return false;
    }
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
      evictions: this.evictions,
      totalRequests: total
    };
  }

  getConfig(): CacheConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.cleanupInterval) {
      this.stopCleanupTimer();
      this.startCleanupTimer();
    }
  }

  dispose(): void {
    this.stopCleanupTimer();
    this.clear();
  }

  private evictLRU(): void {
    if (!this.config.enableLRU) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.invalidate(firstKey);
      }
      return;
    }

    let lruKey = '';
    let oldestAccess = Date.now();

    for (const [key, entry] of this.cache) {
      if (entry.lastAccessed < oldestAccess) {
        oldestAccess = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.invalidate(lruKey);
      this.evictions++;
    }
  }

  private cleanupExpired(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.invalidate(key));
  }

  private resetStats(): void {
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
  }

  private startCleanupTimer(): void {
    if (this.config.cleanupInterval > 0) {
      this.cleanupTimer = setInterval(() => {
        this.cleanupExpired();
      }, this.config.cleanupInterval);
    }
  }

  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }
}
