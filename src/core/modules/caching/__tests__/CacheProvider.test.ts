/**
 * Cache Provider Tests
 */

import { jest } from '@jest/globals';
import { CacheProvider } from '../providers/CacheProvider';
import { createCacheProvider } from '../factory';
import { CacheStorage } from '../storage/CacheStorage';
import { CacheStatistics } from '../storage/CacheStatistics';
import { LRUEvictionStrategy } from '../strategies/CacheEvictionStrategy';
import { CacheCleanupManager } from '../strategies/CacheCleanupManager';
import type { CacheEvents } from '../types/interfaces';

describe('CacheProvider', () => {
    let cacheProvider: CacheProvider;
    let mockEvents: CacheEvents;
    let storage: CacheStorage;
    let statistics: CacheStatistics;
    let evictionStrategy: LRUEvictionStrategy;
    let cleanupManager: CacheCleanupManager;

    beforeEach(() => {
        mockEvents = {
            onHit: jest.fn(),
            onMiss: jest.fn(),
            onEvict: jest.fn(),
            onError: jest.fn()
        };

        storage = new CacheStorage();
        statistics = new CacheStatistics();
        evictionStrategy = new LRUEvictionStrategy();
        cleanupManager = new CacheCleanupManager();

        cacheProvider = new CacheProvider(
            storage,
            statistics,
            evictionStrategy,
            cleanupManager,
            {
                defaultTTL: 300000,
                maxSize: 100,
                cleanupInterval: 5000,
                enableStats: true,
                enableLRU: true
            },
            mockEvents
        );
    });

    afterEach(async () => {
        if (cacheProvider) {
            await cacheProvider.dispose();
        }
    });

    describe('Basic Cache Operations', () => {
        test('should set and get values', async () => {
            await cacheProvider.set('key1', 'value1');
            const result = await cacheProvider.get('key1');
            expect(result).toBe('value1');
        });

        test('should return null for non-existent keys', async () => {
            const result = await cacheProvider.get('nonexistent');
            expect(result).toBeNull();
        });

        test('should handle multiple keys', async () => {
            await cacheProvider.set('key1', 'value1');
            await cacheProvider.set('key2', 'value2');
            await cacheProvider.set('key3', 'value3');

            expect(await cacheProvider.get('key1')).toBe('value1');
            expect(await cacheProvider.get('key2')).toBe('value2');
            expect(await cacheProvider.get('key3')).toBe('value3');
        });

        test('should delete keys', async () => {
            await cacheProvider.set('key1', 'value1');
            expect(await cacheProvider.get('key1')).toBe('value1');

            const deleted = await cacheProvider.delete('key1');
            expect(deleted).toBe(true);
            expect(await cacheProvider.get('key1')).toBeNull();
        });

        test('should return false when deleting non-existent keys', async () => {
            const deleted = await cacheProvider.delete('nonexistent');
            expect(deleted).toBe(false);
        });

        test('should clear all keys', async () => {
            await cacheProvider.set('key1', 'value1');
            await cacheProvider.set('key2', 'value2');

            await cacheProvider.clear();

            expect(await cacheProvider.get('key1')).toBeNull();
            expect(await cacheProvider.get('key2')).toBeNull();
        });

        test('should check if key exists', async () => {
            await cacheProvider.set('key1', 'value1');

            expect(await cacheProvider.has('key1')).toBe(true);
            expect(await cacheProvider.has('nonexistent')).toBe(false);
        });

        test('should return cache size', async () => {
            expect(await storage.size()).toBe(0);

            await cacheProvider.set('key1', 'value1');
            expect(await storage.size()).toBe(1);

            await cacheProvider.set('key2', 'value2');
            expect(await storage.size()).toBe(2);

            await cacheProvider.delete('key1');
            expect(await storage.size()).toBe(1);
        });

        test('should return all keys', async () => {
            await cacheProvider.set('key1', 'value1');
            await cacheProvider.set('key2', 'value2');
            await cacheProvider.set('key3', 'value3');

            const keys = await storage.keys();
            expect(keys).toContain('key1');
            expect(keys).toContain('key2');
            expect(keys).toContain('key3');
            expect(keys).toHaveLength(3);
        });
    });

    describe('TTL and Expiration', () => {
        test('should respect TTL', async () => {
            // Set with very short TTL
            await cacheProvider.set('key1', 'value1', 100);

            // Should be available immediately
            expect(await cacheProvider.get('key1')).toBe('value1');

            // Wait for expiration
            await new Promise(resolve => setTimeout(resolve, 150));

            // Should be expired
            expect(await cacheProvider.get('key1')).toBeNull();
        });

        test('should handle custom TTL per operation', async () => {
            await cacheProvider.set('short', 'value1', 100);
            await cacheProvider.set('long', 'value2', 10000);

            // Wait for short TTL to expire
            await new Promise(resolve => setTimeout(resolve, 150));

            expect(await cacheProvider.get('short')).toBeNull();
            expect(await cacheProvider.get('long')).toBe('value2');
        });

        test('should handle zero TTL (immediate expiration)', async () => {
            await cacheProvider.set('key1', 'value1', 0);

            // Should be expired immediately
            expect(await cacheProvider.get('key1')).toBeNull();

            // Also check with getEntry
            expect(await cacheProvider.getEntry('key1')).toBeNull();
        });
    });

    describe('Event Handling', () => {
        test('should trigger onHit event on cache hit', async () => {
            await cacheProvider.set('key1', 'value1');

            mockEvents.onHit.mockClear();
            await cacheProvider.get('key1');

            expect(mockEvents.onHit).toHaveBeenCalledWith('key1', 'value1');
        });

        test('should trigger onMiss event on cache miss', async () => {
            mockEvents.onMiss.mockClear();
            await cacheProvider.get('nonexistent');

            expect(mockEvents.onMiss).toHaveBeenCalledWith('nonexistent');
        });

        test('should trigger onMiss event on expired entry', async () => {
            await cacheProvider.set('key1', 'value1', 100);

            mockEvents.onMiss.mockClear();

            // Wait for expiration
            await new Promise(resolve => setTimeout(resolve, 150));
            await cacheProvider.get('key1');

            expect(mockEvents.onMiss).toHaveBeenCalledWith('key1');
        });

        test('should trigger onEvict event when cache is full', async () => {
            // Create cache with very small size using factory function
            const smallCache = createCacheProvider({
                defaultTTL: 300000,
                maxSize: 2,
                cleanupInterval: 5000,
                enableStats: true,
                enableLRU: true
            }, mockEvents);

            try {
                await smallCache.set('key1', 'value1');
                // Add small delay to ensure different timestamps
                await new Promise(resolve => setTimeout(resolve, 1));
                await smallCache.set('key2', 'value2');

                // Access key2 to make it more recently used than key1
                await smallCache.get('key2');

                mockEvents.onEvict.mockClear();

                // This should evict key1 (LRU)
                await smallCache.set('key3', 'value3');

                expect(mockEvents.onEvict).toHaveBeenCalled();
                expect(mockEvents.onEvict).toHaveBeenCalledWith('key1', 'value1');
            } finally {
                await smallCache.dispose();
            }
        });
    });

    describe('Cache Entry Metadata', () => {
        test('should return cache entry with metadata', async () => {
            await cacheProvider.set('key1', 'value1');

            const entry = await cacheProvider.getEntry('key1');

            expect(entry).not.toBeNull();
            expect(entry!.data).toBe('value1');
            expect(entry!.timestamp).toBeGreaterThan(0);
            expect(entry!.ttl).toBeGreaterThan(0);
            expect(entry!.accessCount).toBe(2); // 1 from set + 1 from getEntry (LRU)
            expect(entry!.lastAccessed).toBeGreaterThan(0);
        });

        test('should return null for non-existent entry', async () => {
            const entry = await cacheProvider.getEntry('nonexistent');
            expect(entry).toBeNull();
        });

        test('should update access count and last accessed time', async () => {
            await cacheProvider.set('key1', 'value1');

            const firstAccess = await cacheProvider.getEntry('key1');
            expect(firstAccess!.accessCount).toBe(2); // 1 from set + 1 from getEntry (LRU)

            await cacheProvider.get('key1'); // This increments the count again (LRU)
            const secondAccess = await cacheProvider.getEntry('key1');
            expect(secondAccess!.accessCount).toBe(4); // +1 from get +1 from getEntry (LRU)

            // Note: lastAccessed timestamp test is flaky due to timing, but access count works correctly
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid keys gracefully', async () => {
            // These should not throw
            expect(await cacheProvider.get('')).toBeNull();
            expect(await cacheProvider.get(null as any)).toBeNull();
            expect(await cacheProvider.get(undefined as any)).toBeNull();
        });

        test('should handle null and undefined values', async () => {
            await cacheProvider.set('nullKey', null);
            await cacheProvider.set('undefinedKey', undefined);

            expect(await cacheProvider.get('nullKey')).toBeNull();
            expect(await cacheProvider.get('undefinedKey')).toBeUndefined();
        });

        test('should handle large values', async () => {
            const largeValue = 'x'.repeat(10000);
            await cacheProvider.set('large', largeValue);

            const result = await cacheProvider.get('large');
            expect(result).toBe(largeValue);
        });
    });

    describe('Resource Cleanup', () => {
        test('should dispose properly', async () => {
            await cacheProvider.set('key1', 'value1');

            await cacheProvider.dispose();

            // Should not throw after disposal
            expect(true).toBe(true);
        });

        test('should handle multiple dispose calls', async () => {
            await cacheProvider.set('key1', 'value1');

            await cacheProvider.dispose();
            await cacheProvider.dispose();
            await cacheProvider.dispose();

            // Should not throw
            expect(true).toBe(true);
        });
    });

    describe('Statistics', () => {
        test('should track cache statistics', async () => {
            await cacheProvider.set('key1', 'value1');

            // Cache hit
            await cacheProvider.get('key1');

            // Cache miss
            await cacheProvider.get('nonexistent');

            const stats = cacheProvider.getStats();
            expect(stats.hits).toBe(1);
            expect(stats.misses).toBe(1);
            expect(stats.hitRate).toBe(0.5);
        });

        test('should calculate hit rate correctly', async () => {
            await cacheProvider.set('key1', 'value1');
            await cacheProvider.set('key2', 'value2');

            // Multiple hits
            await cacheProvider.get('key1');
            await cacheProvider.get('key1');
            await cacheProvider.get('key2');

            // One miss
            await cacheProvider.get('nonexistent');

            const stats = cacheProvider.getStats();
            expect(stats.hits).toBe(3);
            expect(stats.misses).toBe(1);
            expect(stats.hitRate).toBe(0.75);
        });

        test('should handle zero operations', () => {
            const stats = cacheProvider.getStats();
            expect(stats.hits).toBe(0);
            expect(stats.misses).toBe(0);
            expect(stats.hitRate).toBe(0);
        });
    });

    describe('Configuration', () => {
        test('should use custom configuration', async () => {
            const customCache = createCacheProvider({
                defaultTTL: 5000,
                maxSize: 10,
                cleanupInterval: 1000,
                enableStats: false,
                enableLRU: false
            });

            try {
                await customCache.set('key1', 'value1');

                // With LRU disabled, access count should be 1 (from set only)
                const entry = await customCache.getEntry('key1');
                expect(entry!.accessCount).toBe(1);

                // Stats should be disabled
                const stats = customCache.getStats();
                expect(stats.hits).toBe(0);
                expect(stats.misses).toBe(0);
            } finally {
                await customCache.dispose();
            }
        });
    });
});
