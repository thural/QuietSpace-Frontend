/**
 * CacheProvider Tests
 * 
 * Tests for the Black Box cache provider implementation
 */

import { createCacheProvider, createDefaultCacheProvider } from '../../../../src/core/cache/factory';
import type { ICacheProvider } from '../../../../src/core/cache/interfaces';

describe('CacheProvider', () => {
    let cacheProvider: ICacheProvider;

    beforeEach(() => {
        cacheProvider = createDefaultCacheProvider();
    });

    afterEach(() => {
        cacheProvider.clear();
    });

    describe('Basic Cache Operations', () => {
        it('should create cache provider using factory', () => {
            expect(cacheProvider).toBeDefined();
            expect(typeof cacheProvider.get).toBe('function');
            expect(typeof cacheProvider.set).toBe('function');
            expect(typeof cacheProvider.has).toBe('function');
            expect(typeof cacheProvider.delete).toBe('function');
            expect(typeof cacheProvider.clear).toBe('function');
        });

        it('should set and get values', () => {
            cacheProvider.set('test-key', 'test-value');
            const value = cacheProvider.get('test-key');
            expect(value).toBe('test-value');
        });

        it('should check if key exists', () => {
            cacheProvider.set('test-key', 'test-value');
            const hasKey = cacheProvider.has('test-key');
            expect(hasKey).toBe(true);

            const hasMissingKey = cacheProvider.has('missing-key');
            expect(hasMissingKey).toBe(false);
        });

        it('should delete values', () => {
            cacheProvider.set('test-key', 'test-value');
            cacheProvider.delete('test-key');
            const value = cacheProvider.get('test-key');
            expect(value).toBeUndefined();
        });

        it('should clear all values', () => {
            cacheProvider.set('key1', 'value1');
            cacheProvider.set('key2', 'value2');
            cacheProvider.clear();

            expect(cacheProvider.get('key1')).toBeUndefined();
            expect(cacheProvider.get('key2')).toBeUndefined();
        });
    });

    describe('Cache Configuration', () => {
        it('should create cache with custom configuration', () => {
            const customCache = createCacheProvider({
                maxSize: 100,
                defaultTTL: 60000, // 1 minute
                enableStats: true
            });

            expect(customCache).toBeDefined();
        });

        it('should handle TTL expiration', (done) => {
            const shortTtlCache = createCacheProvider({
                defaultTTL: 100 // 100ms
            });

            shortTtlCache.set('expire-key', 'expire-value');

            // Should be available immediately
            expect(shortTtlCache.get('expire-key')).toBe('expire-value');

            // Should expire after TTL
            setTimeout(() => {
                expect(shortTtlCache.get('expire-key')).toBeNull();
                done();
            }, 150);
        });
    });

    describe('Complex Data Types', () => {
        it('should handle objects', () => {
            const testObject = { id: 1, name: 'test' };
            cacheProvider.set('object-key', testObject);
            const retrieved = cacheProvider.get('object-key');
            expect(retrieved).toEqual(testObject);
        });

        it('should handle arrays', () => {
            const testArray = [1, 2, 3, 4, 5];
            cacheProvider.set('array-key', testArray);
            const retrieved = cacheProvider.get('array-key');
            expect(retrieved).toEqual(testArray);
        });

        it('should handle null and undefined', () => {
            cacheProvider.set('null-key', null);
            cacheProvider.set('undefined-key', undefined);

            expect(cacheProvider.get('null-key')).toBeNull();
            expect(cacheProvider.get('undefined-key')).toBeUndefined();
        });
    });

    describe('Performance', () => {
        it('should handle large number of operations efficiently', () => {
            const start = performance.now();

            // Set 1000 items
            for (let i = 0; i < 1000; i++) {
                cacheProvider.set(`key-${i}`, `value-${i}`);
            }

            // Get 1000 items
            for (let i = 0; i < 1000; i++) {
                cacheProvider.get(`key-${i}`);
            }

            const end = performance.now();

            // Should complete 2000 operations in under 100ms
            expect(end - start).toBeLessThan(100);
        });

        it('should respect max size limit', () => {
            const smallCache = createCacheProvider({
                maxSize: 5
            });

            // Add 10 items
            for (let i = 0; i < 10; i++) {
                smallCache.set(`key-${i}`, `value-${i}`);
            }

            // Should only keep 5 items (LRU eviction)
            let itemCount = 0;
            for (let i = 0; i < 10; i++) {
                if (smallCache.has(`key-${i}`)) {
                    itemCount++;
                }
            }

            expect(itemCount).toBeLessThanOrEqual(5);
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid keys gracefully', () => {
            expect(() => {
                cacheProvider.set('', 'value');
            }).not.toThrow();

            expect(() => {
                cacheProvider.get(null as any);
            }).not.toThrow();
        });

        it('should handle circular references', () => {
            const circular: any = { name: 'test' };
            circular.self = circular;

            expect(() => {
                cacheProvider.set('circular-key', circular);
            }).not.toThrow();
        });
    });

    describe('Black Box Pattern Compliance', () => {
        it('should hide implementation details behind factory functions', () => {
            // This test ensures we're using factory functions, not direct class instantiation
            expect(() => {
                const cache = createCacheProvider();
                expect(cache).toBeDefined();
            }).not.toThrow();
        });

        it('should provide type-safe interfaces', () => {
            interface ITestData {
                id: number;
                name: string;
            }

            const testData: ITestData = { id: 1, name: 'test' };
            cacheProvider.set('typed-key', testData);
            const retrieved = cacheProvider.get<ITestData>('typed-key');

            // TypeScript should enforce type safety
            expect(retrieved?.id).toBe(1);
            expect(retrieved?.name).toBe('test');
        });
    });
});
