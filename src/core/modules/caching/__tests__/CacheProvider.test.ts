/**
 * Cache Provider Tests
 * 
 * Tests the main CacheProvider implementation to ensure it properly
 * orchestrates storage, statistics, eviction, and cleanup components.
 */

import { CacheProvider } from '../providers/CacheProvider';
import { CacheStorage } from '../storage/CacheStorage';
import { CacheStatistics } from '../storage/CacheStatistics';
import { LRUEvictionStrategy } from '../strategies/CacheEvictionStrategy';
import { CacheCleanupManager } from '../strategies/CacheCleanupManager';
import type { CacheConfig, CacheEvents } from '../types/interfaces';

// Mock implementations for testing
class MockStorage {
    private storage = new Map<string, any>();

    async get<T>(key: string): Promise<T | null> {
        return this.storage.get(key) || null;
    }

    async set<T>(key: string, entry: T): Promise<void> {
        this.storage.set(key, entry);
    }

    async delete(key: string): Promise<boolean> {
        return this.storage.delete(key);
    }

    async clear(): Promise<void> {
        this.storage.clear();
    }

    async has(key: string): Promise<boolean> {
        return this.storage.has(key);
    }

    async size(): Promise<number> {
        return this.storage.size;
    }

    async keys(): Promise<string[]> {
        return Array.from(this.storage.keys());
    }
}

class MockStatistics {
    private stats = {
        hits: 0,
        misses: 0,
        evictions: 0,
        totalRequests: 0
    };

    recordHit(): void {
        this.stats.hits++;
        this.stats.totalRequests++;
    }

    recordMiss(): void {
        this.stats.misses++;
        this.stats.totalRequests++;
    }

    recordEviction(): void {
        this.stats.evictions++;
    }

    getStats() {
        return {
            ...this.stats,
            size: 0,
            hitRate: this.stats.totalRequests > 0 ? this.stats.hits / this.stats.totalRequests : 0
        };
    }

    reset(): void {
        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0,
            totalRequests: 0
        };
    }
}

class MockEvictionStrategy {
    shouldEvict(): boolean {
        return false;
    }

    selectEvictionCandidate(): string | null {
        return null;
    }

    onAccess(): void {
        // Mock implementation
    }

    onEviction(): void {
        // Mock implementation
    }
}

class MockCleanupManager {
    private cleanupInterval: NodeJS.Timeout | null = null;

    start(): void {
        // Mock implementation
    }

    stop(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }

    forceCleanup(): void {
        // Mock implementation
    }

    isRunning(): boolean {
        return this.cleanupInterval !== null;
    }
}

describe('CacheProvider', () => {
    let cacheProvider: CacheProvider;
    let mockStorage: MockStorage;
    let mockStatistics: MockStatistics;
    let mockEvictionStrategy: MockEvictionStrategy;
    let mockCleanupManager: MockCleanupManager;
    let mockEvents: CacheEvents;

    beforeEach(() => {
        mockStorage = new MockStorage();
        mockStatistics = new MockStatistics();
        mockEvictionStrategy = new MockEvictionStrategy();
        mockCleanupManager = new MockCleanupManager();
        
        mockEvents = {
            onHit: jest.fn(),
            onMiss: jest.fn(),
            onEvict: jest.fn(),
            onError: jest.fn()
        };

        cacheProvider = new CacheProvider(
            mockStorage as any,
            mockStatistics as any,
            mockEvictionStrategy as any,
            mockCleanupManager as any,
            {
                defaultTTL: 5000,
                maxSize: 100,
                cleanupInterval: 1000,
                enableStats: true,
                enableLRU: true
            },
            mockEvents
        );
    });

    afterEach(async () => {
        await cacheProvider.dispose();
    });

    describe('Basic Cache Operations', () => {
        test('should store and retrieve data', async () => {
            const key = 'test-key';
            const data = { value: 'test-data' };

            await cacheProvider.set(key, data);
            const result = await cacheProvider.get(key);

            expect(result).toEqual(data);
            expect(mockEvents.onHit).not.toHaveBeenCalled();
            expect(mockEvents.onMiss).toHaveBeenCalled();
        });

        test('should return null for non-existent key', async () => {
            const result = await cacheProvider.get('non-existent-key');
            expect(result).toBeNull();
            expect(mockEvents.onMiss).toHaveBeenCalled();
        });

        test('should delete specific key', async () => {
            const key = 'test-key';
            const data = { value: 'test-data' };

            await cacheProvider.set(key, data);
            const deleteResult = await cacheProvider.delete(key);
            const getResult = await cacheProvider.get(key);

            expect(deleteResult).toBe(true);
            expect(getResult).toBeNull();
        });

        test('should return false when deleting non-existent key', async () => {
            const result = await cacheProvider.delete('non-existent-key');
            expect(result).toBe(false);
        });

        test('should clear all cache entries', async () => {
            await cacheProvider.set('key1', 'value1');
            await cacheProvider.set('key2', 'value2');
            await cacheProvider.set('key3', 'value3');

            await cacheProvider.clear();

            const result1 = await cacheProvider.get('key1');
            const result2 = await cacheProvider.get('key2');
            const result3 = await cacheProvider.get('key3');

            expect(result1).toBeNull();
            expect(result2).toBeNull();
            expect(result3).toBeNull();
        });

        test('should check if key exists', async () => {
            const key = 'test-key';
            const data = { value: 'test-data' };

            const existsBefore = await cacheProvider.has(key);
            await cacheProvider.set(key, data);
            const existsAfter = await cacheProvider.has(key);

            expect(existsBefore).toBe(false);
            expect(existsAfter).toBe(true);
        });
    });

    describe('TTL (Time-To-Live) Functionality', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('should respect TTL and expire entries', async () => {
            const key = 'test-key';
            const data = { value: 'test-data' };
            const ttl = 1000; // 1 second

            await cacheProvider.set(key, data, ttl);
            
            // Should be available immediately
            const result1 = await cacheProvider.get(key);
            expect(result1).toEqual(data);

            // Fast forward past TTL
            jest.advanceTimersByTime(ttl + 100);

            // Should be expired
            const result2 = await cacheProvider.get(key);
            expect(result2).toBeNull();
        });

        test('should use default TTL when not specified', async () => {
            const key = 'test-key';
            const data = { value: 'test-data' };

            await cacheProvider.set(key, data);
            
            // Should be available immediately
            const result1 = await cacheProvider.get(key);
            expect(result1).toEqual(data);

            // Fast forward past default TTL (5 seconds from config)
            jest.advanceTimersByTime(5100);

            // Should be expired
            const result2 = await cacheProvider.get(key);
            expect(result2).toBeNull();
        });
    });

    describe('Pattern Invalidation', () => {
        test('should invalidate entries matching string pattern', async () => {
            await cacheProvider.set('user:1', { id: 1, name: 'User 1' });
            await cacheProvider.set('user:2', { id: 2, name: 'User 2' });
            await cacheProvider.set('post:1', { id: 1, title: 'Post 1' });

            const invalidatedCount = await cacheProvider.invalidatePattern('user:');

            expect(invalidatedCount).toBe(2);
            
            const user1 = await cacheProvider.get('user:1');
            const user2 = await cacheProvider.get('user:2');
            const post1 = await cacheProvider.get('post:1');

            expect(user1).toBeNull();
            expect(user2).toBeNull();
            expect(post1).not.toBeNull();
        });

        test('should invalidate entries matching regex pattern', async () => {
            await cacheProvider.set('user:1', { id: 1, name: 'User 1' });
            await cacheProvider.set('user:2', { id: 2, name: 'User 2' });
            await cacheProvider.set('post:1', { id: 1, title: 'Post 1' });

            const pattern = /^user:/;
            const invalidatedCount = await cacheProvider.invalidatePattern(pattern);

            expect(invalidatedCount).toBe(2);
            
            const user1 = await cacheProvider.get('user:1');
            const user2 = await cacheProvider.get('user:2');
            const post1 = await cacheProvider.get('post:1');

            expect(user1).toBeNull();
            expect(user2).toBeNull();
            expect(post1).not.toBeNull();
        });
    });

    describe('Statistics Tracking', () => {
        test('should track cache hits and misses', async () => {
            const key = 'test-key';
            const data = { value: 'test-data' };

            // Initial miss
            await cacheProvider.get(key);
            let stats = cacheProvider.getStats();
            expect(stats.hits).toBe(0);
            expect(stats.misses).toBe(1);
            expect(stats.hitRate).toBe(0);

            // Store data
            await cacheProvider.set(key, data);

            // Hit
            await cacheProvider.get(key);
            stats = cacheProvider.getStats();
            expect(stats.hits).toBe(1);
            expect(stats.misses).toBe(1);
            expect(stats.hitRate).toBe(0.5);

            // Another hit
            await cacheProvider.get(key);
            stats = cacheProvider.getStats();
            expect(stats.hits).toBe(2);
            expect(stats.misses).toBe(1);
            expect(stats.hitRate).toBe(2/3);
        });

        test('should track total requests correctly', async () => {
            await cacheProvider.get('key1'); // miss
            await cacheProvider.get('key2'); // miss
            await cacheProvider.get('key3'); // miss

            let stats = cacheProvider.getStats();
            expect(stats.totalRequests).toBe(3);

            await cacheProvider.set('key1', 'value1');
            await cacheProvider.get('key1'); // hit

            stats = cacheProvider.getStats();
            expect(stats.totalRequests).toBe(4);
        });
    });

    describe('Configuration Management', () => {
        test('should return current configuration', () => {
            const config = cacheProvider.getConfig();
            
            expect(config.defaultTTL).toBe(5000);
            expect(config.maxSize).toBe(100);
            expect(config.cleanupInterval).toBe(1000);
            expect(config.enableStats).toBe(true);
            expect(config.enableLRU).toBe(true);
        });

        test('should update configuration', async () => {
            const newConfig = {
                defaultTTL: 10000,
                maxSize: 200
            };

            await cacheProvider.updateConfig(newConfig);
            
            const config = cacheProvider.getConfig();
            expect(config.defaultTTL).toBe(10000);
            expect(config.maxSize).toBe(200);
            // Other values should remain unchanged
            expect(config.cleanupInterval).toBe(1000);
            expect(config.enableStats).toBe(true);
        });
    });

    describe('Event Handling', () => {
        test('should trigger onHit event on cache hit', async () => {
            const key = 'test-key';
            const data = { value: 'test-data' };

            await cacheProvider.set(key, data);
            await cacheProvider.get(key);

            expect(mockEvents.onHit).toHaveBeenCalledWith(key, data);
            expect(mockEvents.onMiss).not.toHaveBeenCalled();
        });

        test('should trigger onMiss event on cache miss', async () => {
            const key = 'non-existent-key';
            
            await cacheProvider.get(key);

            expect(mockEvents.onMiss).toHaveBeenCalledWith(key);
            expect(mockEvents.onHit).not.toHaveBeenCalled();
        });

        test('should trigger onError event on error', async () => {
            // Mock storage to throw an error
            mockStorage.get = jest.fn().mockRejectedValue(new Error('Storage error'));
            
            await cacheProvider.get('test-key');

            expect(mockEvents.onError).toHaveBeenCalledWith(
                expect.any(Error),
                'get',
                'test-key'
            );
        });
    });

    describe('Cache Entry Metadata', () => {
        test('should return cache entry with metadata', async () => {
            const key = 'test-key';
            const data = { value: 'test-data' };

            await cacheProvider.set(key, data);
            const entry = await cacheProvider.getEntry(key);

            expect(entry).not.toBeNull();
            expect(entry!.data).toEqual(data);
            expect(typeof entry!.timestamp).toBe('number');
            expect(typeof entry!.ttl).toBe('number');
            expect(typeof entry!.accessCount).toBe('number');
            expect(typeof entry!.lastAccessed).toBe('number');
        });

        test('should return null for non-existent entry', async () => {
            const entry = await cacheProvider.getEntry('non-existent-key');
            expect(entry).toBeNull();
        });
    });

    describe('Error Handling', () => {
        test('should handle storage errors gracefully', async () => {
            const error = new Error('Storage failure');
            mockStorage.get = jest.fn().mockRejectedValue(error);

            await expect(cacheProvider.get('test-key')).rejects.toThrow('Storage failure');
            expect(mockEvents.onError).toHaveBeenCalledWith(error, 'get', 'test-key');
        });

        test('should handle set operation errors', async () => {
            const error = new Error('Set failure');
            mockStorage.set = jest.fn().mockRejectedValue(error);

            await expect(cacheProvider.set('test-key', 'value')).rejects.toThrow('Set failure');
            expect(mockEvents.onError).toHaveBeenCalledWith(error, 'set', 'test-key');
        });
    });

    describe('Resource Cleanup', () => {
        test('should dispose properly', async () => {
            const stopSpy = jest.spyOn(mockCleanupManager, 'stop');
            
            await cacheProvider.dispose();
            
            expect(stopSpy).toHaveBeenCalled();
        });
    });
});
