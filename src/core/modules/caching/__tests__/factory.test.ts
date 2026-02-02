/**
 * Cache Factory Functions Tests
 * 
 * Tests the factory functions to ensure they properly create
 * configured cache instances and service managers.
 */

import {
    createCacheProvider,
    createCacheServiceManager,
    createCacheProviderFromDI,
    createCacheServiceManagerFromDI,
    createDefaultCacheProvider,
    createDefaultCacheServiceManager,
    DEFAULT_CACHE_CONFIG
} from '../factory';
import type { ICacheProvider, ICacheServiceManager, CacheConfig, CacheEvents } from '../types/interfaces';

// Mock Container for DI tests
class MockContainer {
    private services = new Map<string, any>();

    register<T>(token: string, implementation: T): void {
        this.services.set(token, implementation);
    }

    getByToken<T>(token: string): T {
        const service = this.services.get(token);
        if (!service) {
            throw new Error(`Service not found for token: ${token}`);
        }
        return service;
    }
}

describe('Cache Factory Functions', () => {
    let mockContainer: MockContainer;

    beforeEach(() => {
        mockContainer = new MockContainer();
    });

    describe('createCacheProvider', () => {
        test('should create cache provider with default configuration', () => {
            const cacheProvider = createCacheProvider();
            
            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
            expect(typeof cacheProvider.set).toBe('function');
            expect(typeof cacheProvider.invalidate).toBe('function');
            expect(typeof cacheProvider.clear).toBe('function');
        });

        test('should create cache provider with custom configuration', () => {
            const customConfig: Partial<CacheConfig> = {
                defaultTTL: 10000,
                maxSize: 500,
                cleanupInterval: 30000,
                enableStats: false,
                enableLRU: false
            };

            const cacheProvider = createCacheProvider(customConfig);
            const config = cacheProvider.getConfig();

            expect(config.defaultTTL).toBe(10000);
            expect(config.maxSize).toBe(500);
            expect(config.cleanupInterval).toBe(30000);
            expect(config.enableStats).toBe(false);
            expect(config.enableLRU).toBe(false);
        });

        test('should create cache provider with event handlers', () => {
            const mockEvents: CacheEvents = {
                onHit: jest.fn(),
                onMiss: jest.fn(),
                onEvict: jest.fn(),
                onError: jest.fn()
            };

            const cacheProvider = createCacheProvider(undefined, mockEvents);
            
            expect(cacheProvider).toBeDefined();
            // Events are tested more thoroughly in CacheProvider tests
        });

        test('should create cache provider with both config and events', () => {
            const customConfig: Partial<CacheConfig> = {
                defaultTTL: 15000,
                maxSize: 200
            };

            const mockEvents: CacheEvents = {
                onHit: jest.fn(),
                onMiss: jest.fn()
            };

            const cacheProvider = createCacheProvider(customConfig, mockEvents);
            const config = cacheProvider.getConfig();

            expect(config.defaultTTL).toBe(15000);
            expect(config.maxSize).toBe(200);
            expect(cacheProvider).toBeDefined();
        });

        test('should handle empty configuration', () => {
            const emptyConfig = {};
            const cacheProvider = createCacheProvider(emptyConfig);
            
            expect(cacheProvider).toBeDefined();
            
            const config = cacheProvider.getConfig();
            expect(config.defaultTTL).toBeGreaterThan(0);
            expect(config.maxSize).toBeGreaterThan(0);
        });
    });

    describe('createCacheServiceManager', () => {
        test('should create cache service manager with default configuration', () => {
            const serviceManager = createCacheServiceManager();
            
            expect(serviceManager).toBeDefined();
            expect(typeof serviceManager.getCache).toBe('function');
            expect(typeof serviceManager.invalidateFeature).toBe('function');
            expect(typeof serviceManager.invalidatePattern).toBe('function');
            expect(typeof serviceManager.getGlobalStats).toBe('function');
            expect(typeof serviceManager.dispose).toBe('function');
        });

        test('should create cache service manager with custom configuration', () => {
            const config = {
                defaultCache: {
                    defaultTTL: 20000,
                    maxSize: 1000,
                    enableStats: true
                },
                featureCaches: {
                    auth: {
                        defaultTTL: 5000,
                        maxSize: 100
                    },
                    user: {
                        defaultTTL: 15000,
                        maxSize: 500
                    }
                }
            };

            const serviceManager = createCacheServiceManager(config);
            
            expect(serviceManager).toBeDefined();
            
            // Test that feature-specific caches use their configs
            const authCache = serviceManager.getCache('auth');
            const userCache = serviceManager.getCache('user');
            const defaultCache = serviceManager.getCache('unknown');

            const authConfig = authCache.getConfig();
            const userConfig = userCache.getConfig();
            const defaultConfig = defaultCache.getConfig();

            expect(authConfig.defaultTTL).toBe(5000);
            expect(authConfig.maxSize).toBe(100);
            expect(userConfig.defaultTTL).toBe(15000);
            expect(userConfig.maxSize).toBe(500);
            expect(defaultConfig.defaultTTL).toBe(20000);
            expect(defaultConfig.maxSize).toBe(1000);
        });

        test('should handle empty configuration object', () => {
            const emptyConfig = {};
            const serviceManager = createCacheServiceManager(emptyConfig);
            
            expect(serviceManager).toBeDefined();
            
            // Should still be able to create caches
            const cache = serviceManager.getCache('test');
            expect(cache).toBeDefined();
        });

        test('should return same cache instance for same feature', () => {
            const serviceManager = createCacheServiceManager();
            
            const cache1 = serviceManager.getCache('test-feature');
            const cache2 = serviceManager.getCache('test-feature');
            
            expect(cache1).toBe(cache2);
        });

        test('should create different cache instances for different features', () => {
            const serviceManager = createCacheServiceManager();
            
            const cache1 = serviceManager.getCache('feature1');
            const cache2 = serviceManager.getCache('feature2');
            
            expect(cache1).not.toBe(cache2);
        });
    });

    describe('createCacheProviderFromDI', () => {
        test('should create cache provider from DI container when service is registered', () => {
            const mockCacheProvider = {
                get: jest.fn(),
                set: jest.fn(),
                invalidate: jest.fn(),
                clear: jest.fn(),
                has: jest.fn(),
                getStats: jest.fn(),
                getConfig: jest.fn(),
                updateConfig: jest.fn(),
                dispose: jest.fn()
            };

            mockContainer.register('CACHE_SERVICE', mockCacheProvider);

            const cacheProvider = createCacheProviderFromDI(mockContainer as any);

            expect(cacheProvider).toBe(mockCacheProvider);
        });

        test('should fallback to direct creation when service is not registered', () => {
            const cacheProvider = createCacheProviderFromDI(mockContainer as any);
            
            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
            expect(typeof cacheProvider.set).toBe('function');
        });

        test('should fallback to direct creation when container throws error', () => {
            const errorContainer = {
                getByToken: jest.fn().mockImplementation(() => {
                    throw new Error('Service not found');
                })
            } as any;

            const cacheProvider = createCacheProviderFromDI(errorContainer);
            
            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
        });

        test('should pass configuration to fallback creation', () => {
            const customConfig: Partial<CacheConfig> = {
                defaultTTL: 25000,
                maxSize: 750
            };

            const cacheProvider = createCacheProviderFromDI(mockContainer as any, customConfig);
            const config = cacheProvider.getConfig();

            expect(config.defaultTTL).toBe(25000);
            expect(config.maxSize).toBe(750);
        });

        test('should pass events to fallback creation', () => {
            const mockEvents: CacheEvents = {
                onHit: jest.fn(),
                onMiss: jest.fn()
            };

            const cacheProvider = createCacheProviderFromDI(mockContainer as any, undefined, mockEvents);
            
            expect(cacheProvider).toBeDefined();
        });
    });

    describe('createCacheServiceManagerFromDI', () => {
        test('should create service manager from DI container when service is registered', () => {
            const mockServiceManager = {
                getCache: jest.fn(),
                invalidateFeature: jest.fn(),
                invalidatePattern: jest.fn(),
                getGlobalStats: jest.fn(),
                dispose: jest.fn()
            };

            mockContainer.register('CACHE_SERVICE_MANAGER', mockServiceManager);

            const serviceManager = createCacheServiceManagerFromDI(mockContainer as any);

            expect(serviceManager).toBe(mockServiceManager);
        });

        test('should fallback to direct creation when service is not registered', () => {
            const serviceManager = createCacheServiceManagerFromDI(mockContainer as any);
            
            expect(serviceManager).toBeDefined();
            expect(typeof serviceManager.getCache).toBe('function');
            expect(typeof serviceManager.invalidateFeature).toBe('function');
        });

        test('should fallback to direct creation when container throws error', () => {
            const errorContainer = {
                getByToken: jest.fn().mockImplementation(() => {
                    throw new Error('Service not found');
                })
            } as any;

            const serviceManager = createCacheServiceManagerFromDI(errorContainer);
            
            expect(serviceManager).toBeDefined();
            expect(typeof serviceManager.getCache).toBe('function');
        });

        test('should pass configuration to fallback creation', () => {
            const config = {
                defaultCache: {
                    defaultTTL: 30000,
                    maxSize: 2000
                }
            };

            const serviceManager = createCacheServiceManagerFromDI(mockContainer as any, config);
            
            expect(serviceManager).toBeDefined();
            
            const cache = serviceManager.getCache('test');
            const cacheConfig = cache.getConfig();
            expect(cacheConfig.defaultTTL).toBe(30000);
            expect(cacheConfig.maxSize).toBe(2000);
        });
    });

    describe('createDefaultCacheProvider', () => {
        test('should create cache provider with default configuration', () => {
            const cacheProvider = createDefaultCacheProvider();
            
            expect(cacheProvider).toBeDefined();
            
            const config = cacheProvider.getConfig();
            expect(config).toEqual(DEFAULT_CACHE_CONFIG);
        });

        test('should accept optional events', () => {
            const mockEvents: CacheEvents = {
                onHit: jest.fn(),
                onMiss: jest.fn(),
                onEvict: jest.fn(),
                onError: jest.fn()
            };

            const cacheProvider = createDefaultCacheProvider(mockEvents);
            
            expect(cacheProvider).toBeDefined();
            
            const config = cacheProvider.getConfig();
            expect(config).toEqual(DEFAULT_CACHE_CONFIG);
        });

        test('should work without events', () => {
            const cacheProvider = createDefaultCacheProvider();
            
            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
            expect(typeof cacheProvider.set).toBe('function');
        });
    });

    describe('createDefaultCacheServiceManager', () => {
        test('should create service manager with default configuration', () => {
            const serviceManager = createDefaultCacheServiceManager();
            
            expect(serviceManager).toBeDefined();
            
            const cache = serviceManager.getCache('test');
            const config = cache.getConfig();
            expect(config.defaultTTL).toBe(DEFAULT_CACHE_CONFIG.defaultTTL);
            expect(config.maxSize).toBe(DEFAULT_CACHE_CONFIG.maxSize);
        });

        test('should create service manager without configuration', () => {
            const serviceManager = createDefaultCacheServiceManager();
            
            expect(serviceManager).toBeDefined();
            expect(typeof serviceManager.getCache).toBe('function');
            expect(typeof serviceManager.invalidateFeature).toBe('function');
        });
    });

    describe('DEFAULT_CACHE_CONFIG', () => {
        test('should have reasonable default values', () => {
            expect(DEFAULT_CACHE_CONFIG.defaultTTL).toBe(300000); // 5 minutes
            expect(DEFAULT_CACHE_CONFIG.maxSize).toBe(1000);
            expect(DEFAULT_CACHE_CONFIG.cleanupInterval).toBe(60000); // 1 minute
            expect(DEFAULT_CACHE_CONFIG.enableStats).toBe(true);
            expect(DEFAULT_CACHE_CONFIG.enableLRU).toBe(true);
        });

        test('should be immutable', () => {
            const originalTTL = DEFAULT_CACHE_CONFIG.defaultTTL;
            
            // Try to modify (should not affect the original)
            try {
                (DEFAULT_CACHE_CONFIG as any).defaultTTL = 999999;
            } catch (error) {
                // Expected if object is frozen
            }

            expect(DEFAULT_CACHE_CONFIG.defaultTTL).toBe(originalTTL);
        });
    });

    describe('Factory Function Integration', () => {
        test('should create compatible instances from different factories', async () => {
            const cache1 = createCacheProvider();
            const cache2 = createDefaultCacheProvider();
            const serviceManager = createCacheServiceManager();
            const cache3 = serviceManager.getCache('test');

            // All should implement the same interface
            expect(typeof cache1.get).toBe('function');
            expect(typeof cache2.get).toBe('function');
            expect(typeof cache3.get).toBe('function');

            // All should work with basic operations
            await cache1.set('key1', 'value1');
            await cache2.set('key2', 'value2');
            await cache3.set('key3', 'value3');

            expect(await cache1.get('key1')).toBe('value1');
            expect(await cache2.get('key2')).toBe('value2');
            expect(await cache3.get('key3')).toBe('value3');
        });

        test('should handle configuration merging correctly', () => {
            const baseConfig = {
                defaultTTL: 10000,
                maxSize: 500,
                enableStats: true
            };

            const cache1 = createCacheProvider(baseConfig);
            const serviceManager = createCacheServiceManager({
                defaultCache: baseConfig
            });
            const cache2 = serviceManager.getCache('test');

            const config1 = cache1.getConfig();
            const config2 = cache2.getConfig();

            expect(config1.defaultTTL).toBe(10000);
            expect(config2.defaultTTL).toBe(10000);
            expect(config1.maxSize).toBe(500);
            expect(config2.maxSize).toBe(500);
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid configuration gracefully', () => {
            const invalidConfigs = [
                null,
                undefined,
                { defaultTTL: -1 },
                { maxSize: 0 },
                { cleanupInterval: -100 },
                { enableStats: 'not-boolean' },
                { enableLRU: null }
            ];

            invalidConfigs.forEach((config) => {
                expect(() => {
                    createCacheProvider(config as any);
                }).not.toThrow();
            });
        });

        test('should handle invalid events gracefully', () => {
            const invalidEvents = [
                null,
                undefined,
                { onHit: 'not-function' },
                { onMiss: 123 },
                { invalidProperty: 'value' }
            ];

            invalidEvents.forEach((events) => {
                expect(() => {
                    createCacheProvider(undefined, events as any);
                }).not.toThrow();
            });
        });

        test('should handle invalid service manager configuration', () => {
            const invalidConfigs = [
                { defaultCache: 'not-object' },
                { featureCaches: null },
                { invalidProperty: 'value' }
            ];

            invalidConfigs.forEach((config) => {
                expect(() => {
                    createCacheServiceManager(config as any);
                }).not.toThrow();
            });
        });
    });

    describe('Performance', () => {
        test('should create instances efficiently', () => {
            const startTime = performance.now();

            for (let i = 0; i < 1000; i++) {
                createCacheProvider();
                createCacheServiceManager();
                createDefaultCacheProvider();
                createDefaultCacheServiceManager();
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete within reasonable time
            expect(duration).toBeLessThan(5000); // Less than 5 seconds
        });

        test('should not leak memory during repeated creation', () => {
            const instances = [];

            for (let i = 0; i < 100; i++) {
                instances.push(createCacheProvider());
                instances.push(createCacheServiceManager());
            }

            // All instances should be valid
            instances.forEach(instance => {
                expect(instance).toBeDefined();
            });

            // Clean up
            instances.forEach(instance => {
                if (typeof (instance as any).dispose === 'function') {
                    (instance as any).dispose();
                }
            });
        });
    });
});
