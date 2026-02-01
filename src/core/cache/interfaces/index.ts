/**
 * Cache System Interfaces
 * 
 * Centralized interface definitions for the cache system.
 * Provides clean type exports following Black Box pattern.
 */

// Core cache interfaces
export interface ICacheProvider {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    has(key: string): Promise<boolean>;
    getStats(): CacheStats;
    getKeys(): Promise<string[]>;
    getSize(): Promise<number>;
}

export interface ICacheServiceManager extends ICacheProvider {
    createCache(name: string, config?: CacheConfig): ICacheProvider;
    getCache(name: string): ICacheProvider | null;
    removeCache(name: string): void;
    clearAll(): void;
    getAllStats(): Record<string, CacheStats>;
    listCaches(): string[];
    getDefaultCache(): ICacheProvider;
}

export interface ICacheStrategy {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    evict(key: string): void;
    shouldEvict(key: string): boolean;
    getEvictionCandidates(): string[];
}

// Cache configuration interfaces
export interface CacheConfig {
    maxSize?: number;
    defaultTtl?: number;
    strategy?: CacheStrategy;
    enableMetrics?: boolean;
    enableCompression?: boolean;
    enableEncryption?: boolean;
    keyPrefix?: string;
    namespace?: string;
}

export interface CacheServiceConfig extends CacheConfig {
    caches?: Record<string, CacheConfig>;
    defaultCache?: string;
    globalMetrics?: boolean;
    enableHealthCheck?: boolean;
    healthCheckInterval?: number;
}

// Cache data interfaces
export interface CacheEntry<T = any> {
    key: string;
    value: T;
    timestamp: number;
    ttl?: number;
    expiresAt?: number;
    size: number;
    metadata?: Record<string, any>;
}

export interface CacheStats {
    size: number;
    hits: number;
    misses: number;
    hitRate: number;
    memoryUsage: number;
    evictions: number;
    sets: number;
    gets: number;
    deletes: number;
    lastAccess?: number;
    createdAt: number;
    updatedAt: number;
}

export interface CacheMetrics {
    totalHits: number;
    totalMisses: number;
    totalEvictions: number;
    totalSets: number;
    totalGets: number;
    totalDeletes: number;
    averageHitRate: number;
    averageResponseTime: number;
    memoryUsage: number;
    cacheCount: number;
    lastReset: number;
}

// Cache event interfaces
export interface CacheEvent {
    type: CacheEventType;
    key: string;
    cacheName?: string;
    timestamp: number;
    data?: any;
    metadata?: Record<string, any>;
}

export interface CacheEventHandler {
    (event: CacheEvent): void;
}

// Cache strategy interfaces
export interface ILRUCacheStrategy extends ICacheStrategy {
    getAccessOrder(): string[];
    updateAccessOrder(key: string): void;
}

export interface ILFUCacheStrategy extends ICacheStrategy {
    getFrequency(key: string): number;
    updateFrequency(key: string): void;
}

export interface IFIFOCacheStrategy extends ICacheStrategy {
    getInsertionOrder(): string[];
    updateInsertionOrder(key: string): void;
}

// Cache provider interfaces
export interface IMemoryCacheProvider extends ICacheProvider {
    setMaxSize(size: number): void;
    getMaxSize(): number;
    getMemoryUsage(): number;
    compact(): void;
}

export interface IRedisCacheProvider extends ICacheProvider {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    getConnectionInfo(): RedisConnectionInfo;
    ping(): Promise<number>;
}

export interface IDistributedCacheProvider extends ICacheProvider {
    sync(): Promise<void>;
    getSyncStatus(): SyncStatus;
    enableAutoSync(enabled: boolean): void;
    getNodes(): CacheNode[];
}

// Cache validation interfaces
export interface ICacheValidator {
    validateKey(key: string): ValidationResult;
    validateValue<T>(value: T): ValidationResult;
    validateTtl(ttl: number): ValidationResult;
    validateConfig(config: CacheConfig): ValidationResult;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

// Cache monitoring interfaces
export interface ICacheMonitor {
    startMonitoring(): void;
    stopMonitoring(): void;
    getMetrics(): CacheMetrics;
    getHealthStatus(): CacheHealthStatus;
    enableMetrics(enabled: boolean): void;
    setMetricsInterval(interval: number): void;
}

export interface CacheHealthStatus {
    status: 'healthy' | 'warning' | 'error' | 'unknown';
    issues: string[];
    recommendations: string[];
    lastCheck: number;
}

// Cache serialization interfaces
export interface ICacheSerializer {
    serialize<T>(value: T): string;
    deserialize<T>(data: string): T;
    canSerialize(value: any): boolean;
    getFormat(): string;
}

export interface ICacheCompression {
    compress(data: string): string;
    decompress(data: string): string;
    canCompress(data: string): boolean;
    getAlgorithm(): string;
}

export interface ICacheEncryption {
    encrypt(data: string): string;
    decrypt(data: string): string;
    canEncrypt(data: string): boolean;
    getAlgorithm(): string;
}

// Cache persistence interfaces
export interface ICachePersistence {
    save(cache: Map<string, CacheEntry>): Promise<void>;
    load(): Promise<Map<string, CacheEntry>>;
    clear(): Promise<void>;
    exists(): Promise<boolean>;
    getSize(): Promise<number>;
    getLastModified(): Promise<number>;
}

// Cache factory interfaces
export interface ICacheFactory {
    createProvider(config?: CacheConfig): ICacheProvider;
    createManager(config?: CacheServiceConfig): ICacheServiceManager;
    createStrategy(strategy: CacheStrategy): ICacheStrategy;
    createValidator(): ICacheValidator;
    createMonitor(): ICacheMonitor;
}

// Cache plugin interfaces
export interface ICachePlugin {
    name: string;
    version: string;
    install(cache: ICacheProvider): void;
    uninstall(cache: ICacheProvider): void;
    isCompatible(version: string): boolean;
}

// Cache middleware interfaces
export interface ICacheMiddleware {
    name: string;
    priority: number;
    execute(context: CacheContext, next: () => Promise<any>): Promise<any>;
}

export interface CacheContext {
    operation: 'get' | 'set' | 'delete' | 'clear';
    key: string;
    value?: any;
    ttl?: number;
    metadata?: Record<string, any>;
    cache: ICacheProvider;
}

// Supporting types
export type CacheStrategy = 'lru' | 'lfu' | 'fifo' | 'random' | 'ttl';
export type CacheEventType = 'get' | 'set' | 'delete' | 'clear' | 'evict' | 'expire' | 'error';

export interface RedisConnectionInfo {
    host: string;
    port: number;
    database: number;
    connected: boolean;
    lastPing: number;
    version: string;
}

export interface SyncStatus {
    status: 'syncing' | 'synced' | 'error' | 'unknown';
    lastSync: number;
    nodesSynced: number;
    totalNodes: number;
    errors: string[];
}

export interface CacheNode {
    id: string;
    host: string;
    port: number;
    status: 'online' | 'offline' | 'unknown';
    lastSeen: number;
    latency?: number;
}

// Cache configuration presets
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
    maxSize: 1000,
    defaultTtl: 3600000, // 1 hour
    strategy: 'lru',
    enableMetrics: true,
    enableCompression: false,
    enableEncryption: false
};

export const MEMORY_CACHE_CONFIG: CacheConfig = {
    ...DEFAULT_CACHE_CONFIG,
    maxSize: 500,
    enableCompression: true
};

export const REDIS_CACHE_CONFIG: CacheConfig = {
    ...DEFAULT_CACHE_CONFIG,
    maxSize: 10000,
    enableCompression: true,
    enableEncryption: true
};

export const DISTRIBUTED_CACHE_CONFIG: CacheConfig = {
    ...DEFAULT_CACHE_CONFIG,
    maxSize: 5000,
    enableMetrics: true,
    enableCompression: true,
    enableEncryption: true
};

// Cache validation rules
export const CACHE_VALIDATION_RULES = {
    key: {
        minLength: 1,
        maxLength: 255,
        pattern: /^[a-zA-Z0-9_-]+$/,
        forbiddenChars: [' ', '\t', '\n', '\r']
    },
    value: {
        maxSize: 1024 * 1024, // 1MB
        allowedTypes: ['string', 'number', 'boolean', 'object', 'array']
    },
    ttl: {
        min: 1000, // 1 second
        max: 86400000 // 24 hours
    },
    maxSize: {
        min: 1,
        max: 100000
    }
};

// Cache error types
export enum CacheErrorType {
    KEY_NOT_FOUND = 'KEY_NOT_FOUND',
    VALUE_TOO_LARGE = 'VALUE_TOO_LARGE',
    INVALID_KEY = 'INVALID_KEY',
    INVALID_VALUE = 'INVALID_VALUE',
    INVALID_TTL = 'INVALID_TTL',
    CACHE_FULL = 'CACHE_FULL',
    SERIALIZATION_ERROR = 'SERIALIZATION_ERROR',
    COMPRESSION_ERROR = 'COMPRESSION_ERROR',
    ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    PERMISSION_DENIED = 'PERMISSION_DENIED'
}

export interface CacheError extends Error {
    type: CacheErrorType;
    key?: string;
    cacheName?: string;
    timestamp: number;
    metadata?: Record<string, any>;
}
