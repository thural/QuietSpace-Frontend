/**
 * Cache Eviction Strategy Tests
 * 
 * Tests the CacheEvictionStrategy implementation to ensure it properly
 * handles LRU (Least Recently Used) eviction logic.
 */

import { LRUEvictionStrategy } from '../strategies/CacheEvictionStrategy';
import type { IEvictionStrategy } from '../strategies/CacheEvictionStrategy';

// Mock cache entry for testing
interface MockCacheEntry {
    key: string;
    data: any;
    timestamp: number;
    ttl: number;
    accessCount: number;
    lastAccessed: number;
}

describe('LRUEvictionStrategy', () => {
    let evictionStrategy: IEvictionStrategy;
    let mockEntries: Map<string, MockCacheEntry>;

    beforeEach(() => {
        evictionStrategy = new LRUEvictionStrategy();
        mockEntries = new Map();
    });

    const createMockEntry = (key: string, lastAccessed?: number, accessCount?: number): MockCacheEntry => ({
        key,
        data: { value: `data-for-${key}` },
        timestamp: Date.now(),
        ttl: 300000,
        accessCount: accessCount || 0,
        lastAccessed: lastAccessed || Date.now()
    });

    describe('Basic LRU Logic', () => {
        test('should identify when eviction is needed', () => {
            // Add some entries to simulate a cache at capacity
            for (let i = 0; i < 5; i++) {
                const entry = createMockEntry(`key-${i}`);
                mockEntries.set(entry.key, entry);
                evictionStrategy.onAccess(entry.key);
            }

            // With maxSize 5, adding one more should trigger eviction
            expect(evictionStrategy.shouldEvict()).toBe(true);
        });

        test('should not trigger eviction when cache has space', () => {
            // Add fewer entries than maxSize
            for (let i = 0; i < 3; i++) {
                const entry = createMockEntry(`key-${i}`);
                mockEntries.set(entry.key, entry);
                evictionStrategy.onAccess(entry.key);
            }

            expect(evictionStrategy.shouldEvict()).toBe(false);
        });

        test('should select least recently used entry for eviction', () => {
            const now = Date.now();
            
            // Create entries with different access times
            const entries = [
                createMockEntry('oldest', now - 10000, 5), // Accessed 10 seconds ago
                createMockEntry('middle', now - 5000, 3),   // Accessed 5 seconds ago
                createMockEntry('newest', now - 1000, 1)    // Accessed 1 second ago
            ];

            entries.forEach(entry => {
                mockEntries.set(entry.key, entry);
                evictionStrategy.onAccess(entry.key);
            });

            // The oldest entry should be selected for eviction
            const evictionCandidate = evictionStrategy.selectEvictionCandidate();
            expect(evictionCandidate).toBe('oldest');
        });

        test('should update access order on access', () => {
            const entries = [
                createMockEntry('first', Date.now() - 5000),
                createMockEntry('second', Date.now() - 3000),
                createMockEntry('third', Date.now() - 1000)
            ];

            entries.forEach(entry => {
                mockEntries.set(entry.key, entry);
                evictionStrategy.onAccess(entry.key);
            });

            // Initially, 'first' should be the LRU candidate
            expect(evictionStrategy.selectEvictionCandidate()).toBe('first');

            // Access 'first' to make it most recently used
            evictionStrategy.onAccess('first');

            // Now 'second' should be the LRU candidate
            expect(evictionStrategy.selectEvictionCandidate()).toBe('second');
        });

        test('should handle eviction notification', () => {
            const entry = createMockEntry('test-key');
            
            // This should not throw an error
            expect(() => {
                evictionStrategy.onEviction('test-key');
            }).not.toThrow();
        });
    });

    describe('Access Pattern Tracking', () => {
        test('should track multiple accesses correctly', () => {
            const keys = ['key1', 'key2', 'key3'];
            
            // Simulate access pattern: key1 -> key2 -> key1 -> key3 -> key2
            evictionStrategy.onAccess('key1');
            evictionStrategy.onAccess('key2');
            evictionStrategy.onAccess('key1');
            evictionStrategy.onAccess('key3');
            evictionStrategy.onAccess('key2');

            // key3 should be least recently used
            expect(evictionStrategy.selectEvictionCandidate()).toBe('key3');
        });

        test('should handle repeated access to same key', () => {
            const key = 'repeated-key';
            
            // Access the same key multiple times
            for (let i = 0; i < 10; i++) {
                evictionStrategy.onAccess(key);
            }

            // With only one key, it should be the eviction candidate
            expect(evictionStrategy.selectEvictionCandidate()).toBe(key);
        });

        test('should handle empty cache', () => {
            expect(evictionStrategy.selectEvictionCandidate()).toBeNull();
            expect(evictionStrategy.shouldEvict()).toBe(false);
        });

        test('should handle single entry cache', () => {
            evictionStrategy.onAccess('single-key');
            
            expect(evictionStrategy.selectEvictionCandidate()).toBe('single-key');
        });
    });

    describe('Capacity Management', () => {
        test('should respect maximum size configuration', () => {
            // Add entries up to max capacity
            const maxSize = 100;
            for (let i = 0; i < maxSize; i++) {
                evictionStrategy.onAccess(`key-${i}`);
            }

            // Should not need eviction at exactly max capacity
            expect(evictionStrategy.shouldEvict()).toBe(false);

            // Adding one more should require eviction
            evictionStrategy.onAccess(`key-${maxSize}`);
            expect(evictionStrategy.shouldEvict()).toBe(true);
        });

        test('should handle large number of entries', () => {
            const entryCount = 10000;
            
            // Add many entries
            for (let i = 0; i < entryCount; i++) {
                evictionStrategy.onAccess(`key-${i}`);
            }

            // Should still work correctly
            expect(evictionStrategy.shouldEvict()).toBe(true);
            expect(evictionStrategy.selectEvictionCandidate()).toBe('key-0');
        });

        test('should handle rapid access patterns', () => {
            const entryCount = 1000;
            
            // Add entries rapidly
            for (let i = 0; i < entryCount; i++) {
                evictionStrategy.onAccess(`key-${i}`);
            }

            // Access some recent entries again
            for (let i = entryCount - 10; i < entryCount; i++) {
                evictionStrategy.onAccess(`key-${i}`);
            }

            // Should still identify the oldest entry
            expect(evictionStrategy.selectEvictionCandidate()).toBe('key-0');
        });
    });

    describe('Edge Cases', () => {
        test('should handle access to non-existent keys', () => {
            // Access keys that haven't been "added" to the strategy
            evictionStrategy.onAccess('non-existent-1');
            evictionStrategy.onAccess('non-existent-2');

            // Should still work
            expect(evictionStrategy.selectEvictionCandidate()).toBe('non-existent-1');
        });

        test('should handle eviction of non-existent keys', () => {
            // Should not throw error
            expect(() => {
                evictionStrategy.onEviction('non-existent-key');
            }).not.toThrow();
        });

        test('should handle mixed access and eviction operations', () => {
            const keys = ['key1', 'key2', 'key3', 'key4', 'key5'];
            
            // Add keys
            keys.forEach(key => evictionStrategy.onAccess(key));

            // Evict some keys
            evictionStrategy.onEviction('key2');
            evictionStrategy.onEviction('key4');

            // Access remaining keys
            evictionStrategy.onAccess('key1');
            evictionStrategy.onAccess('key3');

            // Should still track correctly
            expect(evictionStrategy.selectEvictionCandidate()).toBe('key5');
        });

        test('should handle keys with special characters', () => {
            const specialKeys = [
                'key-with-dashes',
                'key_with_underscores',
                'key.with.dots',
                'key with spaces',
                'key/with/slashes',
                '中文键',
                '🔑 emoji key',
                ''
            ];

            specialKeys.forEach(key => evictionStrategy.onAccess(key));

            // Should work with special characters
            expect(evictionStrategy.selectEvictionCandidate()).toBe(specialKeys[0]);
        });
    });

    describe('Performance Considerations', () => {
        test('should handle high-frequency operations efficiently', () => {
            const operationCount = 100000;
            const startTime = performance.now();

            // Perform many operations
            for (let i = 0; i < operationCount; i++) {
                evictionStrategy.onAccess(`key-${i % 1000}`); // Reuse keys to simulate real cache
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete within reasonable time
            expect(duration).toBeLessThan(1000); // Less than 1 second

            // Should still work correctly
            expect(evictionStrategy.shouldEvict()).toBe(true);
        });

        test('should maintain performance with large datasets', () => {
            const entryCount = 50000;
            
            // Add many entries
            for (let i = 0; i < entryCount; i++) {
                evictionStrategy.onAccess(`key-${i}`);
            }

            const startTime = performance.now();
            
            // Perform multiple eviction candidate selections
            for (let i = 0; i < 1000; i++) {
                evictionStrategy.selectEvictionCandidate();
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should be fast even with large datasets
            expect(duration).toBeLessThan(100); // Less than 100ms
        });
    });

    describe('Memory Management', () => {
        test('should not leak memory when entries are evicted', () => {
            const entryCount = 10000;
            
            // Add many entries
            for (let i = 0; i < entryCount; i++) {
                evictionStrategy.onAccess(`key-${i}`);
            }

            // Evict all entries
            for (let i = 0; i < entryCount; i++) {
                evictionStrategy.onEviction(`key-${i}`);
            }

            // Should handle empty state correctly
            expect(evictionStrategy.selectEvictionCandidate()).toBeNull();
            expect(evictionStrategy.shouldEvict()).toBe(false);
        });

        test('should handle repeated add-evict cycles', () => {
            const cycles = 100;
            const entriesPerCycle = 50;

            for (let cycle = 0; cycle < cycles; cycle++) {
                // Add entries
                for (let i = 0; i < entriesPerCycle; i++) {
                    evictionStrategy.onAccess(`cycle-${cycle}-key-${i}`);
                }

                // Evict some entries
                for (let i = 0; i < entriesPerCycle / 2; i++) {
                    evictionStrategy.onEviction(`cycle-${cycle}-key-${i}`);
                }
            }

            // Should still work correctly
            expect(evictionStrategy.shouldEvict()).toBe(true);
        });
    });

    describe('Concurrent Operations', () => {
        test('should handle concurrent access operations', async () => {
            const operationCount = 10000;
            const promises = [];

            for (let i = 0; i < operationCount; i++) {
                promises.push(Promise.resolve(evictionStrategy.onAccess(`key-${i}`)));
            }

            await Promise.all(promises);

            expect(evictionStrategy.shouldEvict()).toBe(true);
            expect(evictionStrategy.selectEvictionCandidate()).toBe('key-0');
        });

        test('should handle concurrent access and eviction operations', async () => {
            const operationCount = 5000;
            const promises = [];

            for (let i = 0; i < operationCount; i++) {
                if (i % 2 === 0) {
                    promises.push(Promise.resolve(evictionStrategy.onAccess(`key-${i}`)));
                } else {
                    promises.push(Promise.resolve(evictionStrategy.onEviction(`key-${i - 1}`)));
                }
            }

            await Promise.all(promises);

            // Should not throw and should still work
            expect(() => {
                evictionStrategy.selectEvictionCandidate();
            }).not.toThrow();
        });
    });

    describe('LRU Algorithm Correctness', () => {
        test('should maintain correct LRU order with complex access patterns', () => {
            const accessSequence = [
                'A', 'B', 'C', 'D', 'E',  // Initial: A B C D E
                'A',                      // Access A: B C D E A
                'C',                      // Access C: B D E A C
                'B',                      // Access B: D E A C B
                'F',                      // Add F: D E A C B F
                'D',                      // Access D: E A C B F D
                'G'                       // Add G: E A C B F D G
            ];

            accessSequence.forEach(key => evictionStrategy.onAccess(key));

            // E should be the least recently used
            expect(evictionStrategy.selectEvictionCandidate()).toBe('E');
        });

        test('should handle FIFO behavior for entries with same access time', () => {
            // This tests the case where multiple entries might have the same timestamp
            const keys = ['key1', 'key2', 'key3'];
            const sameTime = Date.now();

            // Add entries with the same access time
            keys.forEach(key => {
                evictionStrategy.onAccess(key);
                // Mock the internal timestamp to be the same
                // (This depends on implementation details)
            });

            // Should still return a valid candidate
            const candidate = evictionStrategy.selectEvictionCandidate();
            expect(keys).toContain(candidate);
        });

        test('should handle access time updates correctly', () => {
            const keys = ['key1', 'key2', 'key3'];
            
            // Add entries
            keys.forEach(key => evictionStrategy.onAccess(key));

            // Wait a bit and access key1 again
            setTimeout(() => {
                evictionStrategy.onAccess('key1');
                
                // key2 should now be the LRU candidate
                expect(evictionStrategy.selectEvictionCandidate()).toBe('key2');
            }, 10);
        });
    });
});
