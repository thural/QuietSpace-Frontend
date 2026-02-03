/**
 * Cache Eviction Strategy Tests
 * 
 * Tests the CacheEvictionStrategy implementation to ensure it properly
 * handles LRU (Least Recently Used) eviction logic.
 */

import { jest } from '@jest/globals';
import { LRUEvictionStrategy, FIFOEvictionStrategy } from '../strategies/CacheEvictionStrategy';
import type { CacheEntry } from '../types/interfaces';

describe('LRUEvictionStrategy', () => {
    let evictionStrategy: LRUEvictionStrategy;
    let mockCache: Map<string, CacheEntry<unknown>>;

    beforeEach(() => {
        evictionStrategy = new LRUEvictionStrategy();
        mockCache = new Map();
    });

    const createMockEntry = (lastAccessed?: number, accessCount?: number): CacheEntry<unknown> => ({
        data: { value: 'test-data' },
        timestamp: Date.now(),
        ttl: 300000,
        accessCount: accessCount || 1,
        lastAccessed: lastAccessed || Date.now()
    });

    describe('Basic LRU Logic', () => {
        test('should return null when cache is empty', () => {
            const result = evictionStrategy.shouldEvict(mockCache);
            expect(result).toBeNull();
        });

        test('should return null when cache has only one entry', () => {
            const entry = createMockEntry();
            mockCache.set('key-1', entry);
            evictionStrategy.onAccess('key-1');

            const result = evictionStrategy.shouldEvict(mockCache);
            expect(result).toBeNull();
        });

        test('should identify least recently used entry for eviction', () => {
            const now = Date.now();
            
            // Create entries with different access times
            const oldEntry = createMockEntry(now - 10000); // 10 seconds ago
            const recentEntry = createMockEntry(now - 1000); // 1 second ago
            
            mockCache.set('old-key', oldEntry);
            mockCache.set('recent-key', recentEntry);
            
            // Mark as accessed (this updates internal tracking but not the entry itself)
            evictionStrategy.onAccess('old-key');
            evictionStrategy.onAccess('recent-key');

            const result = evictionStrategy.shouldEvict(mockCache);
            expect(result).toBe('old-key');
        });

        test('should handle entries with same access time', () => {
            const sameTime = Date.now();
            
            const entry1 = createMockEntry(sameTime);
            const entry2 = createMockEntry(sameTime);
            
            mockCache.set('key-1', entry1);
            mockCache.set('key-2', entry2);
            
            evictionStrategy.onAccess('key-1');
            evictionStrategy.onAccess('key-2');

            const result = evictionStrategy.shouldEvict(mockCache);
            // When access times are the same, it should return one of them or null
            expect(result === null || ['key-1', 'key-2'].includes(result)).toBeTruthy();
        });
    });

    describe('Access Pattern Tracking', () => {
        test('should update access order when entry is accessed', () => {
            const entry = createMockEntry();
            mockCache.set('key-1', entry);
            
            // First access
            evictionStrategy.onAccess('key-1');
            
            // Multiple accesses
            for (let i = 0; i < 5; i++) {
                evictionStrategy.onAccess('key-1');
            }

            // Should still return the same key for eviction (only entry)
            const result = evictionStrategy.shouldEvict(mockCache);
            expect(result).toBeNull(); // Single entry, no eviction needed
        });

        test('should track multiple entries correctly', () => {
            const now = Date.now();
            const entries = ['key-1', 'key-2', 'key-3'];
            
            // Add entries with different access times
            entries.forEach((key, index) => {
                const entry = createMockEntry(now - (3 - index) * 1000); // key-1 is oldest
                mockCache.set(key, entry);
                evictionStrategy.onAccess(key);
            });

            // The eviction strategy looks at lastAccessed from the entry, not internal tracking
            // Since key-1 has the oldest lastAccessed, it should be evicted
            const result = evictionStrategy.shouldEvict(mockCache);
            expect(result).toBe('key-1'); // key-1 has oldest lastAccessed time
        });

        test('should handle access to non-existent keys gracefully', () => {
            // Should not throw when accessing non-existent key
            expect(() => {
                evictionStrategy.onAccess('non-existent-key');
            }).not.toThrow();

            const result = evictionStrategy.shouldEvict(mockCache);
            expect(result).toBeNull();
        });
    });

    describe('Edge Cases', () => {
        test('should handle cache with expired entries', () => {
            const now = Date.now();
            
            const expiredEntry = createMockEntry(now - 400000); // Expired (TTL: 300000)
            const validEntry = createMockEntry(now - 1000);
            
            mockCache.set('expired', expiredEntry);
            mockCache.set('valid', validEntry);
            
            evictionStrategy.onAccess('expired');
            evictionStrategy.onAccess('valid');

            const result = evictionStrategy.shouldEvict(mockCache);
            expect(result).toBe('expired'); // Expired entry has older access time
        });

        test('should handle cache with very old entries', () => {
            const veryOldTime = Date.now() - (365 * 24 * 60 * 60 * 1000); // 1 year ago
            
            const oldEntry = createMockEntry(veryOldTime);
            const newEntry = createMockEntry(Date.now());
            
            mockCache.set('very-old', oldEntry);
            mockCache.set('new', newEntry);
            
            evictionStrategy.onAccess('very-old');
            evictionStrategy.onAccess('new');

            const result = evictionStrategy.shouldEvict(mockCache);
            expect(result).toBe('very-old');
        });

        test('should handle empty cache after clear', () => {
            // Add some entries first
            for (let i = 0; i < 5; i++) {
                const entry = createMockEntry();
                mockCache.set(`key-${i}`, entry);
                evictionStrategy.onAccess(`key-${i}`);
            }

            // Clear the cache
            mockCache.clear();

            const result = evictionStrategy.shouldEvict(mockCache);
            expect(result).toBeNull();
        });

        test('should handle cache with null/undefined data', () => {
            const now = Date.now();
            
            const nullEntry = createMockEntry(now - 2000);
            nullEntry.data = null;
            
            const undefinedEntry = createMockEntry(now - 1000);
            undefinedEntry.data = undefined;
            
            mockCache.set('null-data', nullEntry);
            mockCache.set('undefined-data', undefinedEntry);
            
            evictionStrategy.onAccess('null-data');
            evictionStrategy.onAccess('undefined-data');

            const result = evictionStrategy.shouldEvict(mockCache);
            expect(result).toBe('null-data'); // null-entry has older access time
        });
    });

    describe('Performance Considerations', () => {
        test('should handle large cache efficiently', () => {
            const startTime = performance.now();
            
            // Create large cache
            for (let i = 0; i < 1000; i++) {
                const entry = createMockEntry(Date.now() - i * 10);
                mockCache.set(`key-${i}`, entry);
                evictionStrategy.onAccess(`key-${i}`);
            }

            const result = evictionStrategy.shouldEvict(mockCache);
            const endTime = performance.now();
            
            expect(result).toBeTruthy();
            expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
        });

        test('should handle rapid access patterns', () => {
            // Add entries
            for (let i = 0; i < 100; i++) {
                const entry = createMockEntry();
                mockCache.set(`key-${i}`, entry);
                evictionStrategy.onAccess(`key-${i}`);
            }

            const startTime = performance.now();
            
            // Simulate rapid access
            for (let i = 0; i < 1000; i++) {
                const randomKey = `key-${Math.floor(Math.random() * 100)}`;
                evictionStrategy.onAccess(randomKey);
            }

            const result = evictionStrategy.shouldEvict(mockCache);
            const endTime = performance.now();
            
            expect(result).toBeTruthy();
            expect(endTime - startTime).toBeLessThan(50); // Should complete in < 50ms
        });
    });

    describe('LRU Algorithm Correctness', () => {
        test('should correctly identify LRU entry in complex scenarios', () => {
            const now = Date.now();
            
            // Create entries with specific access pattern
            const entries = [
                { key: 'A', accessTime: now - 5000 }, // Least recent
                { key: 'B', accessTime: now - 4000 },
                { key: 'C', accessTime: now - 3000 },
                { key: 'D', accessTime: now - 2000 },
                { key: 'E', accessTime: now - 1000 }  // Most recent
            ];

            entries.forEach(({ key, accessTime }) => {
                const entry = createMockEntry(accessTime);
                mockCache.set(key, entry);
                evictionStrategy.onAccess(key);
            });

            // Access B and D to update their access time
            evictionStrategy.onAccess('B');
            evictionStrategy.onAccess('D');

            const result = evictionStrategy.shouldEvict(mockCache);
            expect(result).toBe('A'); // A should still be least recently used
        });

        test('should handle tie-breaking correctly', () => {
            const sameTime = Date.now();
            
            // Multiple entries with same access time
            for (let i = 0; i < 5; i++) {
                const entry = createMockEntry(sameTime);
                mockCache.set(`key-${i}`, entry);
                evictionStrategy.onAccess(`key-${i}`);
            }

            const result = evictionStrategy.shouldEvict(mockCache);
            // When all have same access time, it may return null or the first one found
            expect(result === null || (result && result.match(/^key-\d+$/))).toBeTruthy();
        });

        test('should provide access order for debugging', () => {
            const now = Date.now();
            const entries = ['key-1', 'key-2', 'key-3'];
            
            entries.forEach((key, index) => {
                const entry = createMockEntry(now - (3 - index) * 1000);
                mockCache.set(key, entry);
                evictionStrategy.onAccess(key);
            });

            const accessOrder = evictionStrategy.getAccessOrder();
            expect(accessOrder).toHaveLength(3);
            expect(accessOrder[0]![0]).toBe('key-1'); // Oldest first
            expect(accessOrder[2]![0]).toBe('key-3'); // Newest last
        });

        test('should reset access order state', () => {
            // Add some entries
            for (let i = 0; i < 3; i++) {
                const entry = createMockEntry();
                mockCache.set(`key-${i}`, entry);
                evictionStrategy.onAccess(`key-${i}`);
            }

            // Verify we have access order
            expect(evictionStrategy.getAccessOrder()).toHaveLength(3);

            // Reset
            evictionStrategy.reset();

            // Verify state is cleared
            expect(evictionStrategy.getAccessOrder()).toHaveLength(0);
        });
    });

    describe('FIFO Eviction Strategy', () => {
        let fifoStrategy: FIFOEvictionStrategy;

        beforeEach(() => {
            fifoStrategy = new FIFOEvictionStrategy();
        });

        test('should evict first inserted entry', () => {
            const entries = ['key-1', 'key-2', 'key-3'];
            
            entries.forEach(key => {
                const entry = createMockEntry();
                mockCache.set(key, entry);
                fifoStrategy.onAccess(key);
            });

            const result = fifoStrategy.shouldEvict(mockCache);
            expect(result).toBe('key-1'); // First inserted should be evicted
        });

        test('should handle cache with missing entries', () => {
            // Add entries to strategy
            ['key-1', 'key-2', 'key-3'].forEach(key => {
                const entry = createMockEntry();
                mockCache.set(key, entry);
                fifoStrategy.onAccess(key);
            });

            // Remove one from cache
            mockCache.delete('key-1');

            const result = fifoStrategy.shouldEvict(mockCache);
            expect(result).toBe('key-2'); // Should skip missing key-1
        });

        test('should return null for empty cache', () => {
            const result = fifoStrategy.shouldEvict(mockCache);
            expect(result).toBeNull();
        });

        test('should provide insertion order', () => {
            const entries = ['key-1', 'key-2', 'key-3'];
            
            entries.forEach(key => {
                const entry = createMockEntry();
                mockCache.set(key, entry);
                fifoStrategy.onAccess(key);
            });

            // Note: getAccessOrder is a private method for debugging
            // We'll test the behavior indirectly through shouldEvict
            const result = fifoStrategy.shouldEvict(mockCache);
            expect(result).toBe('key-1'); // First inserted should be evicted
        });

        test('should reset insertion order', () => {
            ['key-1', 'key-2'].forEach(key => {
                const entry = createMockEntry();
                mockCache.set(key, entry);
                fifoStrategy.onAccess(key);
            });

            // Verify first inserted is evicted
            const result1 = fifoStrategy.shouldEvict(mockCache);
            expect(result1).toBe('key-1');

            // Reset and test new behavior
            (fifoStrategy as any).reset();
            
            // Add new entries after reset
            ['key-3', 'key-4'].forEach(key => {
                const entry = createMockEntry();
                mockCache.set(key, entry);
                fifoStrategy.onAccess(key);
            });

            const result2 = fifoStrategy.shouldEvict(mockCache);
            expect(result2).toBe('key-3'); // First after reset should be evicted
        });
    });
});
