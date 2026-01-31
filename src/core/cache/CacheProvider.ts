import { Injectable } from '../di';

/**
 * Cache entry interface for storing cached data with metadata
 * 
 * @interface CacheEntry
 * @description Represents a single cache entry with data and metadata
 * @template T - The type of data being cached
 */
export interface CacheEntry<T> {
  /**
   * The cached data
   * 
   * @type {T}
   */
  data: T;

  /**
   * Timestamp when the entry was created (Unix timestamp)
   * 
   * @type {number}
   */
  timestamp: number;

  /**
   * Time to live in milliseconds
   * 
   * @type {number}
   */
  ttl: number;

  /**
   * Number of times this entry has been accessed
   * 
   * @type {number}
   */
  accessCount: number;

  /**
   * Timestamp of last access (Unix timestamp)
   * 
   * @type {number}
   */
  lastAccessed: number;
}

/**
 * Cache configuration interface
 * 
 * @interface CacheConfig
 * @description Configuration options for cache behavior
 */
export interface CacheConfig {
  /**
   * Default time to live for cache entries in milliseconds
   * 
   * @type {number}
   */
  defaultTTL: number;

  /**
   * Maximum number of entries the cache can hold
   * 
   * @type {number}
   */
  maxSize: number;

  /**
   * Cleanup interval in milliseconds for expired entries
   * 
   * @type {number}
   */
  cleanupInterval: number;

  /**
   * Whether to enable cache statistics collection
   * 
   * @type {boolean}
   */
  enableStats: boolean;

  /**
   * Whether to enable Least Recently Used (LRU) eviction
   * 
   * @type {boolean}
   */
  enableLRU: boolean;
}

/**
 * Cache statistics interface
 * 
 * @interface CacheStats
 * @description Performance and usage statistics for the cache
 */
export interface CacheStats {
  /**
   * Current number of entries in the cache
   * 
   * @type {number}
   */
  size: number;

  /**
   * Number of cache hits
   * 
   * @type {number}
   */
  hits: number;

  /**
   * Number of cache misses
   * 
   * @type {number}
   */
  misses: number;

  /**
   * Cache hit rate as percentage (0-100)
   * 
   * @type {number}
   */
  hitRate: number;

  /**
   * Number of entries evicted from cache
   * 
   * @type {number}
   */
  evictions: number;

  /**
   * Total number of cache requests
   * 
   * @type {number}
   */
  totalRequests: number;
}

/**
 * Cache event handlers interface
 * 
 * @interface CacheEvents
 * @description Event handlers for cache operations
 */
export interface CacheEvents {
  /**
   * Called when cache hit occurs
   * 
   * @param {string} key - The cache key
   * @param {any} data - The cached data
   * @returns {void}
   */
  onHit?: (key: string, data: any) => void;

  /**
   * Called when cache miss occurs
   * 
   * @param {string} key - The cache key
   * @returns {void}
   */
  onMiss?: (key: string) => void;

  /**
   * Called when entry is evicted from cache
   * 
   * @param {string} key - The cache key
   * @param {any} data - The evicted data
   * @returns {void}
   */
  onEvict?: (key: string, data: any) => void;

  /**
   * Called when an error occurs during cache operations
   * 
   * @param {Error} error - The error that occurred
   * @param {string} operation - The operation being performed
   * @param {string} [key] - The cache key (optional)
   * @returns {void}
   */
  onError?: (error: Error, operation: string, key?: string) => void;
}

/**
 * Cache provider class for managing in-memory caching
 * 
 * @class CacheProvider
 * @description Provides caching functionality with TTL, LRU eviction, and statistics
 */
@Injectable()
export class CacheProvider {
  /**
   * Internal cache storage
   * 
   * @private
   * @type {Map<string, CacheEntry<any>>}
   */
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Cache hit counter
   * 
   * @private
   * @type {number}
   */
  private hits = 0;

  /**
   * Cache miss counter
   * 
   * @private
   * @type {number}
   */
  private misses = 0;

  /**
   * Cache eviction counter
   * 
   * @private
   * @type {number}
   */
  private evictions = 0;

  /**
   * Cleanup timer for expired entries
   * 
   * @private
   * @type {NodeJS.Timeout}
   */
  private cleanupTimer?: NodeJS.Timeout;

  /**
   * Cache configuration
   * 
   * @private
   * @type {CacheConfig}
   */
  private config: CacheConfig;

  /**
   * Cache event handlers
   * 
   * @private
   * @type {CacheEvents}
   */
  private events?: CacheEvents;

  /**
   * Creates a new CacheProvider instance
   * 
   * @constructor
   * @param {Partial<CacheConfig>} [config={}] - Optional cache configuration
   * @param {CacheEvents} [events] - Optional event handlers
   * @description Initializes cache with default configuration and starts cleanup timer
   */
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

  /**
   * Retrieves a value from the cache
   * 
   * @template T - The type of the cached value
   * @param {string} key - The cache key
   * @returns {T | null} The cached value or null if not found/expired
   * @description Gets a value from cache, updating access statistics and triggering events
   */
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

  /**
   * Retrieves a cache entry with metadata
   * 
   * @template T - The type of the cached value
   * @param {string} key - The cache key
   * @returns {CacheEntry<T> | null} The cache entry with metadata or null if not found/expired
   * @description Gets the full cache entry including metadata without updating access statistics
   */
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

  delete(key: string): boolean {
    // Alias for invalidate for backward compatibility
    return this.invalidate(key);
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
