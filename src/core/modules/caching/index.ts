/**
 * Cache Module Index - Black Box Pattern
 *
 * Exports only public interfaces and factory functions.
 * Internal implementation details are completely hidden.
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
} from './types/interfaces';

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

// Constants - Public configuration values
export {
    DEFAULT_TTL,
    CACHE_SIZE_LIMITS,
    CLEANUP_INTERVALS,
    CACHE_KEY_PREFIXES,
    CACHE_ERROR_CODES,
    CACHE_EVENTS,
    FEATURE_CACHE_CONFIGS
} from './types/constants';

// Legacy exports for backward compatibility (deprecated)
// These will be removed in a future major version
export { CacheProvider as _CacheProvider } from './providers/CacheProvider';
export { CacheServiceManager as _CacheServiceManager } from './providers/CacheServiceManager';

// Backward compatibility layer for migration
export {
    LegacyCacheAdapter,
    LegacyCacheServiceManagerAdapter,
    CacheMigrationHelper
} from './utils/compatibility';
