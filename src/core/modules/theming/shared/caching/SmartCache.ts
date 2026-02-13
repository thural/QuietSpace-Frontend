/**
 * Smart Caching System
 *
 * Provides intelligent caching with TTL and performance monitoring.
 * Uses dependency injection for better testability and flexibility.
 */

import type { ComposedTheme } from '../../internal/types';

/**
 * Cache Entry Interface
 */
export interface CacheEntry<T> {
    value: T;
    timestamp: number;
    ttl: number;
    hits: number;
    lastAccessed: number;
}

/**
 * Cache Configuration Interface
 */
export interface CacheConfig {
    maxSize: number;
    defaultTtl: number;
    cleanupInterval: number;
    enableMetrics: boolean;
}

/**
 * Cache Metrics Interface
 */
export interface CacheMetrics {
    hits: number;
    misses: number;
    evictions: number;
    currentSize: number;
    hitRate: number;
    averageAccessTime: number;
    memoryUsage: number;
}

/**
 * Smart Cache Interface
 */
export interface ISmartCache<T> {
    get(key: string): T | undefined;
    set(key: string, value: T, ttl?: number): void;
    has(key: string): boolean;
    delete(key: string): boolean;
    clear(): void;
    getMetrics(): CacheMetrics;
    cleanup(): void;
    generateKey(variant: string, overrides?: unknown): string;
}

/**
 * Smart Cache Implementation
 * 
 * Single Responsibility: Intelligent caching with TTL and metrics
 * Open/Closed: Extensible through interface
 * Liskov Substitution: Can be substituted with mock implementations
 * Interface Segregation: Focused interface for cache operations
 * Dependency Inversion: Depends on abstractions, not concretions
 */
export class SmartCache<T> implements ISmartCache<T> {
    private readonly cache = new Map<string, CacheEntry<T>>();
    private readonly config: CacheConfig;
    private metrics: CacheMetrics;
    private cleanupTimer?: NodeJS.Timeout;

    constructor(config: Partial<CacheConfig> = {}) {
        this.config = {
            maxSize: 100,
            defaultTtl: 5 * 60 * 1000, // 5 minutes
            cleanupInterval: 60 * 1000, // 1 minute
            enableMetrics: true,
            ...config
        };

        this.metrics = {
            hits: 0,
            misses: 0,
            evictions: 0,
            currentSize: 0,
            hitRate: 0,
            averageAccessTime: 0,
            memoryUsage: 0
        };

        // Start cleanup timer
        this.startCleanupTimer();
    }

    /**
     * Get value from cache
     */
    public get(key: string): T | undefined {
        const startTime = performance.now();

        const entry = this.cache.get(key);

        if (!entry) {
            this.metrics.misses++;
            this.updateMetrics();
            return undefined;
        }

        // Check TTL
        if (this.isExpired(entry)) {
            this.cache.delete(key);
            this.metrics.misses++;
            this.updateMetrics();
            return undefined;
        }

        // Update access metrics
        entry.hits++;
        entry.lastAccessed = Date.now();

        this.metrics.hits++;
        this.updateAccessTime(performance.now() - startTime);
        this.updateMetrics();

        return entry.value;
    }

    /**
     * Set value in cache
     */
    public set(key: string, value: T, ttl?: number): void {
        // Check if we need to evict
        if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
            this.evictLeastRecentlyUsed();
        }

        const entry: CacheEntry<T> = {
            value,
            timestamp: Date.now(),
            ttl: ttl || this.config.defaultTtl,
            hits: 0,
            lastAccessed: Date.now()
        };

        this.cache.set(key, entry);
        this.metrics.currentSize = this.cache.size;
        this.updateMetrics();
    }

    /**
     * Check if key exists in cache
     */
    public has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;

        if (this.isExpired(entry)) {
            this.cache.delete(key);
            this.metrics.currentSize = this.cache.size;
            return false;
        }

        return true;
    }

    /**
     * Delete key from cache
     */
    public delete(key: string): boolean {
        const deleted = this.cache.delete(key);
        if (deleted) {
            this.metrics.currentSize = this.cache.size;
            this.updateMetrics();
        }
        return deleted;
    }

    /**
     * Clear all cache entries
     */
    public clear(): void {
        this.cache.clear();
        this.metrics.currentSize = 0;
        this.metrics.evictions += this.cache.size;
        this.updateMetrics();
    }

    /**
     * Get cache metrics
     */
    public getMetrics(): CacheMetrics {
        return { ...this.metrics };
    }

    /**
     * Cleanup expired entries
     */
    public cleanup(): void {
        const now = Date.now();
        let evicted = 0;

        for (const [key, entry] of Array.from(this.cache.entries())) {
            if (this.isExpired(entry)) {
                this.cache.delete(key);
                evicted++;
            }
        }

        this.metrics.evictions += evicted;
        this.metrics.currentSize = this.cache.size;
        this.updateMetrics();
    }

    /**
     * Destroy cache and cleanup timer
     */
    public destroy(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = undefined;
        }
        this.clear();
    }

    /**
     * Generate cache key from parameters
     */
    public generateKey(variant: string, overrides?: unknown): string {
        const overrideHash = overrides ? this.hashObject(overrides) : '';
        return `${variant}:${overrideHash}`;
    }

    /**
     * Check if cache entry is expired
     */
    private isExpired(entry: CacheEntry<T>): boolean {
        return Date.now() - entry.timestamp > entry.ttl;
    }

    /**
     * Evict least recently used entry
     */
    private evictLeastRecentlyUsed(): void {
        let oldestKey: string | undefined;
        let oldestTime = Date.now();

        for (const [key, entry] of Array.from(this.cache.entries())) {
            if (entry.lastAccessed < oldestTime) {
                oldestTime = entry.lastAccessed;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.metrics.evictions++;
        }
    }

    /**
     * Update cache metrics
     */
    private updateMetrics(): void {
        const total = this.metrics.hits + this.metrics.misses;
        this.metrics.hitRate = total > 0 ? this.metrics.hits / total : 0;
        this.metrics.memoryUsage = this.estimateMemoryUsage();
    }

    /**
     * Update average access time
     */
    private updateAccessTime(accessTime: number): void {
        const current = this.metrics.averageAccessTime;
        const count = this.metrics.hits + this.metrics.misses;
        this.metrics.averageAccessTime = (current * (count - 1) + accessTime) / count;
    }

    /**
     * Estimate memory usage
     */
    private estimateMemoryUsage(): number {
        let size = 0;
        for (const [key, entry] of Array.from(this.cache.entries())) {
            size += key.length * 2; // String size
            size += JSON.stringify(entry.value).length * 2; // Value size
            size += 64; // Entry overhead
        }
        return size;
    }

    /**
     * Hash object for cache key generation
     */
    private hashObject(obj: unknown): string {
        const str = JSON.stringify(obj, Object.keys(obj || {}).sort());
        let hash = 0;

        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        return Math.abs(hash).toString(36);
    }

    /**
     * Start cleanup timer
     */
    private startCleanupTimer(): void {
        if (this.config.cleanupInterval > 0) {
            this.cleanupTimer = setInterval(() => {
                this.cleanup();
            }, this.config.cleanupInterval);
        }
    }
}

/**
 * Theme-specific cache implementation
 */
export class ThemeCache extends SmartCache<ComposedTheme> {
    constructor(config?: Partial<CacheConfig>) {
        super({
            maxSize: 50, // Fewer entries for theme objects
            defaultTtl: 10 * 60 * 1000, // 10 minutes for themes
            cleanupInterval: 2 * 60 * 1000, // 2 minutes cleanup
            enableMetrics: true,
            ...config
        });
    }

    /**
     * Get theme with performance monitoring
     */
    public getTheme(key: string): ComposedTheme | undefined {
        const startTime = performance.now();
        const theme = this.get(key);
        const duration = performance.now() - startTime;

        // Log performance warnings
        if (duration > 10) { // 10ms threshold
            console.warn(`Slow cache access: ${duration.toFixed(2)}ms for key: ${key}`);
        }

        return theme;
    }

    /**
     * Set theme with performance monitoring
     */
    public setTheme(key: string, theme: ComposedTheme, ttl?: number): void {
        const startTime = performance.now();
        this.set(key, theme, ttl);
        const duration = performance.now() - startTime;

        // Log performance warnings
        if (duration > 5) { // 5ms threshold
            console.warn(`Slow cache set: ${duration.toFixed(2)}ms for key: ${key}`);
        }
    }
}

/**
 * Export singleton instances for convenience
 */
export const themeCache = new ThemeCache();
export const smartCache = SmartCache;
