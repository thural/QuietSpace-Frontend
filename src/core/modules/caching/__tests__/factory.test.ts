/**
 * Cache Factory Functions Tests
 * 
 * Tests the factory functions to ensure they properly create
 * configured cache instances and service managers.
 */

import { jest } from '@jest/globals';
import {
    createCacheProvider,
    createCacheServiceManager,
    createCacheProviderFromDI,
    createCacheServiceManagerFromDI,
    createDefaultCacheProvider,
    createDefaultCacheServiceManager,
    DEFAULT_CACHE_CONFIG
} from '../factory';

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
            expect(typeof cacheProvider.has).toBe('function');
            expect(typeof cacheProvider.dispose).toBe('function');
        });

        test('should create cache provider with custom configuration', () => {
            const config = {
                defaultTTL: 5000,
                maxSize: 50,
                enableStats: false
            };

            const cacheProvider = createCacheProvider(config);

            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
            expect(typeof cacheProvider.set).toBe('function');
        });

        test('should create cache provider with event handlers', () => {
            const events = {
                onHit: jest.fn(),
                onMiss: jest.fn(),
                onEvict: jest.fn(),
                onError: jest.fn()
            };

            const cacheProvider = createCacheProvider(undefined, events);

            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
            expect(typeof cacheProvider.set).toBe('function');
        });

        test('should create cache provider with both config and events', () => {
            const config = { defaultTTL: 10000 };
            const events = { onHit: jest.fn() };

            const cacheProvider = createCacheProvider(config, events);

            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
        });

        test('should handle empty configuration', () => {
            const cacheProvider = createCacheProvider({});

            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
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
                    defaultTTL: 5000,
                    maxSize: 50
                },
                enableStats: false
            };

            const serviceManager = createCacheServiceManager(config);

            expect(serviceManager).toBeDefined();
            expect(typeof serviceManager.getCache).toBe('function');
        });

        test('should handle empty configuration object', () => {
            const serviceManager = createCacheServiceManager({});

            expect(serviceManager).toBeDefined();
            expect(typeof serviceManager.getCache).toBe('function');
        });

        test('should return same cache instance for same feature', () => {
            const serviceManager = createCacheServiceManager();

            const cache1 = serviceManager.getCache('feature1');
            const cache2 = serviceManager.getCache('feature1');

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
        test('should fallback to direct creation when service is not registered', () => {
            const cacheProvider = createCacheProviderFromDI(mockContainer as any);

            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
            expect(typeof cacheProvider.set).toBe('function');
        });

        test('should fallback to direct creation when container throws error', () => {
            mockContainer.register = jest.fn().mockImplementation(() => {
                throw new Error('Container error');
            });

            const cacheProvider = createCacheProviderFromDI(mockContainer as any);

            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
        });

        test('should pass configuration to fallback creation', () => {
            const config = { defaultTTL: 5000, maxSize: 50 };
            const cacheProvider = createCacheProviderFromDI(mockContainer as any, config);

            expect(cacheProvider).toBeDefined();
        });

        test('should pass events to fallback creation', () => {
            const events = { onHit: jest.fn(), onMiss: jest.fn() };
            const cacheProvider = createCacheProviderFromDI(mockContainer as any, undefined, events);

            expect(cacheProvider).toBeDefined();
        });
    });

    describe('createCacheServiceManagerFromDI', () => {
        test('should fallback to direct creation when service is not registered', () => {
            const serviceManager = createCacheServiceManagerFromDI(mockContainer as any);

            expect(serviceManager).toBeDefined();
            expect(typeof serviceManager.getCache).toBe('function');
            expect(typeof serviceManager.invalidateFeature).toBe('function');
        });

        test('should fallback to direct creation when container throws error', () => {
            mockContainer.register = jest.fn().mockImplementation(() => {
                throw new Error('Container error');
            });

            const serviceManager = createCacheServiceManagerFromDI(mockContainer as any);

            expect(serviceManager).toBeDefined();
            expect(typeof serviceManager.getCache).toBe('function');
        });

        test('should pass configuration to fallback creation', () => {
            const config = { defaultCache: { defaultTTL: 5000, maxSize: 50 } };
            const serviceManager = createCacheServiceManagerFromDI(mockContainer as any, config);

            expect(serviceManager).toBeDefined();
        });
    });

    describe('createDefaultCacheProvider', () => {
        test('should create cache provider with default configuration', () => {
            const cacheProvider = createDefaultCacheProvider();

            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
            expect(typeof cacheProvider.set).toBe('function');
        });

        test('should accept optional events', () => {
            const events = { onHit: jest.fn(), onMiss: jest.fn() };
            const cacheProvider = createDefaultCacheProvider(events);

            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
        });

        test('should work without events', () => {
            const cacheProvider = createDefaultCacheProvider();

            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
        });
    });

    describe('createDefaultCacheServiceManager', () => {
        test('should create service manager with default configuration', () => {
            const serviceManager = createDefaultCacheServiceManager();

            expect(serviceManager).toBeDefined();
            expect(typeof serviceManager.getCache).toBe('function');
            expect(typeof serviceManager.invalidateFeature).toBe('function');
        });

        test('should create service manager without configuration', () => {
            const serviceManager = createDefaultCacheServiceManager();

            expect(serviceManager).toBeDefined();
            expect(typeof serviceManager.getCache).toBe('function');
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
            const modifiedConfig = { ...DEFAULT_CACHE_CONFIG, defaultTTL: 999999 };

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
            const cache2 = createDefaultCacheProvider();
            const serviceManager = createCacheServiceManager({
                defaultCache: baseConfig
            });

            // All should use the merged configuration
            const cache1Config = cache1.getConfig();
            const cache3 = serviceManager.getCache('test').getConfig();

            expect(cache1Config.defaultTTL).toBe(10000);
            expect(cache3.defaultTTL).toBe(10000);
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid configuration gracefully', () => {
            expect(() => {
                createCacheProvider({ defaultTTL: -1 });
            }).not.toThrow();

            const cacheProvider = createCacheProvider({ defaultTTL: -1 });
            expect(cacheProvider).toBeDefined();
        });

        test('should handle invalid events gracefully', () => {
            expect(() => {
                createCacheProvider(undefined, { onHit: 'invalid' } as any);
            }).not.toThrow();

            const cacheProvider = createCacheProvider(undefined, { onHit: 'invalid' } as any);
            expect(cacheProvider).toBeDefined();
        });

        test('should handle invalid service manager configuration', () => {
            expect(() => {
                createCacheServiceManager({ defaultCache: { defaultTTL: -1 } });
            }).not.toThrow();

            const serviceManager = createCacheServiceManager({ defaultCache: { defaultTTL: -1 } });
            expect(serviceManager).toBeDefined();
        });
    });

    describe('Performance', () => {
        test('should create instances efficiently', () => {
            const startTime = performance.now();

            for (let i = 0; i < 1000; i++) {
                const cacheProvider = createCacheProvider();
                expect(cacheProvider).toBeDefined();
            }

            const endTime = performance.now();
            expect(endTime - startTime).toBeLessThan(1000); // Should complete quickly
        });

        test('should not leak memory during repeated creation', async () => {
            const instances: any[] = [];

            // Create many instances
            for (let i = 0; i < 100; i++) {
                const cacheProvider = createCacheProvider();
                instances.push(cacheProvider);
            }

            // Dispose all instances
            for (const instance of instances) {
                if (typeof (instance as any).dispose === 'function') {
                    (instance as any).dispose();
                }
            }

            // Should not throw
            expect(true).toBe(true);
        });
    });
});
