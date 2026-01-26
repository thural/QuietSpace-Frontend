/**
 * Cache Module Interfaces
 * 
 * Defines public interfaces for the cache system following Black Box pattern.
 * Internal implementation details are hidden from consumers.
 */

export interface ICacheProvider {
    get<T>(key: string): T | null;
    getEntry<T>(key: string): CacheEntry<T> | null;
    set<T>(key: string, data: T, ttl?: number): void;
    invalidate(key: string): boolean;
    invalidatePattern(pattern: string | RegExp): number;
    clear(): void;
    has(key: string): boolean;
    getStats(): CacheStats;
    getConfig(): CacheConfig;
    updateConfig(newConfig: Partial<CacheConfig>): void;
    dispose(): void;
}

export interface ICacheServiceManager {
    getCache(featureName: string): ICacheProvider;
    invalidateFeature(featureName: string): void;
    invalidatePattern(pattern: string): number;
    getGlobalStats(): Record<string, any>;
    dispose(): void;
}

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

export interface CacheServiceConfig {
    defaultCache?: Partial<CacheConfig>;
    featureCaches?: Record<string, Partial<CacheConfig>>;
}

export interface FeatureCacheService extends ICacheServiceManager {
    // Alias for backward compatibility
}
