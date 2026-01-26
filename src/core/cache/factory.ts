/**
 * Cache Module Factory Functions
 * 
 * Provides factory functions for creating cache services following Black Box pattern.
 * Consumers use these factories to get configured cache instances.
 */

import { Container } from '@/core/di/container/Container';
import { TYPES } from '@/core/di/types';
import type {
    ICacheProvider,
    ICacheServiceManager,
    CacheConfig,
    CacheServiceConfig,
    CacheEvents
} from './interfaces';

// Import implementations (internal)
import { CacheProvider } from './CacheProvider';
import { CacheServiceManager } from './CacheServiceManager';

/**
 * Creates a cache provider with the specified configuration.
 * 
 * @param config - Cache configuration options
 * @param events - Optional cache event handlers
 * @returns Configured cache provider instance
 */
export function createCacheProvider(
    config?: Partial<CacheConfig>,
    events?: CacheEvents
): ICacheProvider {
    return new CacheProvider(config, events);
}

/**
 * Creates a cache service manager with the specified configuration.
 * 
 * @param config - Cache service configuration
 * @returns Configured cache service manager instance
 */
export function createCacheServiceManager(
    config?: CacheServiceConfig
): ICacheServiceManager {
    return new CacheServiceManager(config);
}

/**
 * Creates a cache provider using dependency injection container.
 * 
 * @param container - DI container instance
 * @param config - Optional cache configuration
 * @param events - Optional cache event handlers
 * @returns Cache provider from DI container
 */
export function createCacheProviderFromDI(
    container: Container,
    config?: Partial<CacheConfig>,
    events?: CacheEvents
): ICacheProvider {
    // Try to get from DI container first
    try {
        // Note: CACHE_SERVICE token may not be registered, fallback to direct creation
        return container.getByToken<ICacheProvider>(TYPES.CACHE_SERVICE);
    } catch {
        // Fallback to direct creation
        return createCacheProvider(config, events);
    }
}

/**
 * Creates a cache service manager using dependency injection container.
 * 
 * @param container - DI container instance
 * @param config - Optional cache service configuration
 * @returns Cache service manager from DI container
 */
export function createCacheServiceManagerFromDI(
    container: Container,
    config?: CacheServiceConfig
): ICacheServiceManager {
    // Try to get from DI container first
    try {
        // Note: CACHE_SERVICE_MANAGER token may not be registered, fallback to direct creation
        return container.getByToken<ICacheServiceManager>(TYPES.CACHE_SERVICE);
    } catch {
        // Fallback to direct creation
        return createCacheServiceManager(config);
    }
}

/**
 * Default cache configuration for common use cases.
 */
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
    defaultTTL: 300000, // 5 minutes
    maxSize: 1000,
    cleanupInterval: 60000, // 1 minute
    enableStats: true,
    enableLRU: true
};

/**
 * Creates a cache provider with default configuration.
 * 
 * @param events - Optional cache event handlers
 * @returns Cache provider with default configuration
 */
export function createDefaultCacheProvider(events?: CacheEvents): ICacheProvider {
    return createCacheProvider(DEFAULT_CACHE_CONFIG, events);
}

/**
 * Creates a cache service manager with default configuration.
 * 
 * @returns Cache service manager with default configuration
 */
export function createDefaultCacheServiceManager(): ICacheServiceManager {
    return createCacheServiceManager({
        defaultCache: DEFAULT_CACHE_CONFIG
    });
}
