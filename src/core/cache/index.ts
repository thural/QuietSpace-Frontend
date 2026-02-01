/**
 * Cache Module Index - Black Box Pattern
 *
 * Exports only public interfaces and factory functions.
 * Internal implementation classes are completely hidden.
 */

// Public interfaces - Clean API for consumers
export type {
    ICacheProvider,
    ICacheServiceManager,
    CacheEntry,
    CacheConfig,
    CacheStats,
    CacheEvents,
    CacheServiceConfig,
    FeatureCacheService
} from './interfaces';

// Factory functions - Clean service creation
export {
    createCacheProvider,
    createCacheServiceManager,
    createCacheProviderFromDI,
    createCacheServiceManagerFromDI,
    createDefaultCacheProvider,
    createDefaultCacheServiceManager,
    DEFAULT_CACHE_CONFIG
} from './factory';

// Legacy exports for backward compatibility (deprecated)
// These will be removed in a future major version
export { CacheProvider as _CacheProvider } from './CacheProvider';
export { CacheServiceManager as _CacheServiceManager } from './CacheServiceManager';
