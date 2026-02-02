/**
 * Cache Module Interfaces
 *
 * Defines public interfaces for the cache system following Black Box pattern.
 * Internal implementation details are hidden from consumers.
 */

/**
 * Main cache provider interface for cache operations.
 * Provides async methods for all cache operations with full TypeScript support.
 */
export interface ICacheProvider {
    /**
     * Retrieves cached data by key.
     * @param key - The cache key to retrieve
     * @returns Promise resolving to cached data or null if not found/expired
     */
    get<T>(key: string): Promise<T | null>;

    /**
     * Retrieves the full cache entry including metadata.
     * @param key - The cache key to retrieve
     * @returns Promise resolving to cache entry or null if not found/expired
     */
    getEntry<T>(key: string): Promise<CacheEntry<T> | null>;

    /**
     * Stores data in cache with optional TTL.
     * @param key - The cache key to store under
     * @param data - The data to cache
     * @param ttl - Optional time-to-live in milliseconds (uses default if not provided)
     */
    set<T>(key: string, data: T, ttl?: number): Promise<void>;

    /**
     * Removes a specific entry from cache.
     * @param key - The cache key to invalidate
     * @returns Promise resolving to true if entry was removed, false if not found
     */
    invalidate(key: string): Promise<boolean>;

    /**
     * Alias for invalidate for backward compatibility.
     * @param key - The cache key to delete
     * @returns Promise resolving to true if entry was removed, false if not found
     */
    delete(key: string): Promise<boolean>;

    /**
     * Removes all cache entries matching the given pattern.
     * @param pattern - String pattern or RegExp to match keys against
     * @returns Promise resolving to number of entries invalidated
     */
    invalidatePattern(pattern: string | RegExp): Promise<number>;

    /**
     * Clears all entries from the cache.
     */
    clear(): Promise<void>;

    /**
     * Checks if a key exists in cache and is not expired.
     * @param key - The cache key to check
     * @returns Promise resolving to true if key exists and is valid
     */
    has(key: string): Promise<boolean>;

    /**
     * Gets current cache statistics.
     * @returns Current cache statistics including hit rate, size, etc.
     */
    getStats(): CacheStats;

    /**
     * Gets current cache configuration.
     * @returns Current cache configuration settings
     */
    getConfig(): CacheConfig;

    /**
     * Updates cache configuration with new settings.
     * @param newConfig - Partial configuration to merge with current config
     */
    updateConfig(newConfig: Partial<CacheConfig>): Promise<void>;

    /**
     * Disposes the cache provider and cleans up resources.
     */
    dispose(): Promise<void>;
}

/**
 * Cache service manager interface for managing multiple cache instances.
 * Provides centralized management of feature-specific caches.
 */
export interface ICacheServiceManager {
    /**
     * Gets or creates a cache instance for a specific feature.
     * @param featureName - Name of the feature/cache instance
     * @returns Cache provider instance for the feature
     */
    getCache(featureName: string): ICacheProvider;

    /**
     * Invalidates all cache entries for a specific feature.
     * @param featureName - Name of the feature to invalidate
     */
    invalidateFeature(featureName: string): void;

    /**
     * Invalidates cache entries across all features matching pattern.
     * @param pattern - Pattern to match keys against across all caches
     * @returns Promise resolving to total number of entries invalidated
     */
    invalidatePattern(pattern: string | RegExp): Promise<number>;

    /**
     * Gets aggregated statistics across all cache instances.
     * @returns Record mapping feature names to their statistics
     */
    getGlobalStats(): Record<string, unknown>;

    /**
     * Disposes all cache instances managed by this service manager.
     */
    dispose(): void;
}

/**
 * Represents a single cache entry with metadata.
 * @template T - Type of cached data
 */
export interface CacheEntry<T> {
    /** The cached data */
    data: T;
    /** Timestamp when entry was created (milliseconds since epoch) */
    timestamp: number;
    /** Time-to-live in milliseconds */
    ttl: number;
    /** Number of times this entry has been accessed */
    accessCount: number;
    /** Timestamp of last access (milliseconds since epoch) */
    lastAccessed: number;
}

/**
 * Cache configuration options.
 */
export interface CacheConfig {
    /** Default time-to-live for cache entries in milliseconds */
    defaultTTL: number;
    /** Maximum number of entries allowed in cache */
    maxSize: number;
    /** Cleanup interval for expired entries in milliseconds */
    cleanupInterval: number;
    /** Whether to enable statistics tracking */
    enableStats: boolean;
    /** Whether to enable LRU eviction strategy */
    enableLRU: boolean;
}

/**
 * Cache statistics and performance metrics.
 */
export interface CacheStats {
    /** Current number of entries in cache */
    size: number;
    /** Total number of cache hits */
    hits: number;
    /** Total number of cache misses */
    misses: number;
    /** Hit rate as decimal (0-1) */
    hitRate: number;
    /** Total number of evictions */
    evictions: number;
    /** Total number of cache requests */
    totalRequests: number;
}

/**
 * Event handlers for cache operations.
 */
export interface CacheEvents {
    /** Called when cache entry is successfully retrieved */
    onHit?: (key: string, data: unknown) => void;
    /** Called when cache entry is not found or expired */
    onMiss?: (key: string) => void;
    /** Called when cache entry is evicted */
    onEvict?: (key: string, data: unknown) => void;
    /** Called when an error occurs during cache operation */
    onError?: (error: Error, operation: string, key?: string) => void;
}

/**
 * Configuration for cache service manager.
 */
export interface CacheServiceConfig {
    /** Default configuration for all feature caches */
    defaultCache?: Partial<CacheConfig>;
    /** Feature-specific cache configurations */
    featureCaches?: Record<string, Partial<CacheConfig>>;
}
