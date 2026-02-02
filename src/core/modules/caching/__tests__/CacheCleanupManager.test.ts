/**
 * Cache Cleanup Manager Tests
 * 
 * Tests the CacheCleanupManager implementation to ensure it properly
 * handles expired entry cleanup and periodic maintenance.
 */

import { CacheCleanupManager } from '../strategies/CacheCleanupManager';
import type { ICleanupManager } from '../strategies/CacheCleanupManager';
import type { CacheEntry } from '../types/interfaces';

describe('CacheCleanupManager', () => {
    let cleanupManager: ICleanupManager;
    let mockCache: Map<string, CacheEntry<unknown>>;

    beforeEach(() => {
        cleanupManager = new CacheCleanupManager();
        mockCache = new Map();
    });

    afterEach(() => {
        cleanupManager.stop();
    });

    const createCacheEntry = (data: unknown, ttl: number, timestamp?: number): CacheEntry<unknown> => ({
        data,
        timestamp: timestamp || Date.now(),
        ttl,
        accessCount: 0,
        lastAccessed: Date.now()
    });

    describe('Basic Cleanup Operations', () => {
        test('should start and stop cleanup process', () => {
            expect(cleanupManager.isRunning()).toBe(false);
            
            cleanupManager.start(mockCache);
            expect(cleanupManager.isRunning()).toBe(true);
            
            cleanupManager.stop();
            expect(cleanupManager.isRunning()).toBe(false);
        });

        test('should handle multiple start calls gracefully', () => {
            cleanupManager.start(mockCache);
            cleanupManager.start(mockCache);
            cleanupManager.start(mockCache);
            
            expect(cleanupManager.isRunning()).toBe(true);
            
            cleanupManager.stop();
            expect(cleanupManager.isRunning()).toBe(false);
        });

        test('should handle multiple stop calls gracefully', () => {
            cleanupManager.start(mockCache);
            cleanupManager.stop();
            cleanupManager.stop();
            cleanupManager.stop();
            
            expect(cleanupManager.isRunning()).toBe(false);
        });

        test('should force cleanup on demand', () => {
            const now = Date.now();
            
            // Add expired entries
            mockCache.set('expired1', createCacheEntry('data1', 1000, now - 2000));
            mockCache.set('expired2', createCacheEntry('data2', 1000, now - 3000));
            
            // Add valid entries
            mockCache.set('valid1', createCacheEntry('data3', 10000, now - 1000));
            mockCache.set('valid2', createCacheEntry('data4', 10000, now - 500));

            expect(mockCache.size).toBe(4);

            cleanupManager.forceCleanup(mockCache);

            // Should remove expired entries
            expect(mockCache.size).toBe(2);
            expect(mockCache.has('expired1')).toBe(false);
            expect(mockCache.has('expired2')).toBe(false);
            expect(mockCache.has('valid1')).toBe(true);
            expect(mockCache.has('valid2')).toBe(true);
        });

        test('should handle empty cache during force cleanup', () => {
            expect(() => {
                cleanupManager.forceCleanup(mockCache);
            }).not.toThrow();

            expect(mockCache.size).toBe(0);
        });
    });

    describe('Automatic Cleanup', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('should automatically clean up expired entries', () => {
            const now = Date.now();
            
            // Add expired entries
            mockCache.set('expired1', createCacheEntry('data1', 1000, now - 2000));
            mockCache.set('expired2', createCacheEntry('data2', 1000, now - 3000));
            
            // Add valid entries
            mockCache.set('valid1', createCacheEntry('data3', 10000, now - 1000));
            mockCache.set('valid2', createCacheEntry('data4', 10000, now - 500));

            cleanupManager.start(mockCache);
            
            // Fast forward time to trigger cleanup
            jest.advanceTimersByTime(60000); // Default cleanup interval

            // Should have cleaned up expired entries
            expect(mockCache.size).toBe(2);
            expect(mockCache.has('expired1')).toBe(false);
            expect(mockCache.has('expired2')).toBe(false);
            expect(mockCache.has('valid1')).toBe(true);
            expect(mockCache.has('valid2')).toBe(true);
        });

        test('should perform periodic cleanup', () => {
            const now = Date.now();
            
            // Add entries that will expire at different times
            mockCache.set('expire-soon', createCacheEntry('data1', 2000, now - 1000));
            mockCache.set('expire-later', createCacheEntry('data2', 5000, now - 1000));

            cleanupManager.start(mockCache);

            // First cleanup - should remove expire-soon
            jest.advanceTimersByTime(60000);
            expect(mockCache.has('expire-soon')).toBe(false);
            expect(mockCache.has('expire-later')).toBe(true);

            // Add more time and wait for next cleanup
            jest.advanceTimersByTime(60000);
            expect(mockCache.has('expire-later')).toBe(false);
        });

        test('should stop automatic cleanup when stopped', () => {
            const now = Date.now();
            
            mockCache.set('expired1', createCacheEntry('data1', 1000, now - 2000));
            mockCache.set('valid1', createCacheEntry('data2', 10000, now - 1000));

            cleanupManager.start(mockCache);
            
            // Stop before cleanup runs
            cleanupManager.stop();
            
            // Fast forward time
            jest.advanceTimersByTime(60000);

            // Should not have cleaned up since stopped
            expect(mockCache.size).toBe(2);
            expect(mockCache.has('expired1')).toBe(true);
            expect(mockCache.has('valid1')).toBe(true);
        });
    });

    describe('Expiration Logic', () => {
        test('should correctly identify expired entries', () => {
            const now = Date.now();
            
            // Entry that expired exactly now
            mockCache.set('just-expired', createCacheEntry('data1', 1000, now - 1000));
            
            // Entry that expired long ago
            mockCache.set('long-expired', createCacheEntry('data2', 1000, now - 5000));
            
            // Entry that will expire soon
            mockCache.set('will-expire-soon', createCacheEntry('data3', 2000, now - 1500));
            
            // Entry with plenty of time left
            mockCache.set('plenty-time', createCacheEntry('data4', 10000, now - 1000));

            cleanupManager.forceCleanup(mockCache);

            expect(mockCache.has('just-expired')).toBe(false);
            expect(mockCache.has('long-expired')).toBe(false);
            expect(mockCache.has('will-expire-soon')).toBe(true);
            expect(mockCache.has('plenty-time')).toBe(true);
        });

        test('should handle zero TTL entries', () => {
            const now = Date.now();
            
            // Zero TTL should expire immediately
            mockCache.set('zero-ttl', createCacheEntry('data1', 0, now));
            
            cleanupManager.forceCleanup(mockCache);

            expect(mockCache.has('zero-ttl')).toBe(false);
        });

        test('should handle negative TTL entries', () => {
            const now = Date.now();
            
            // Negative TTL should be treated as expired
            mockCache.set('negative-ttl', createCacheEntry('data1', -1000, now));
            
            cleanupManager.forceCleanup(mockCache);

            expect(mockCache.has('negative-ttl')).toBe(false);
        });

        test('should handle very large TTL entries', () => {
            const now = Date.now();
            
            // Very large TTL (essentially never expires)
            mockCache.set('large-ttl', createCacheEntry('data1', Number.MAX_SAFE_INTEGER, now));
            
            cleanupManager.forceCleanup(mockCache);

            expect(mockCache.has('large-ttl')).toBe(true);
        });
    });

    describe('Performance and Scalability', () => {
        test('should handle large number of entries efficiently', () => {
            const now = Date.now();
            const entryCount = 10000;
            
            // Add many entries, half expired
            for (let i = 0; i < entryCount; i++) {
                const isExpired = i % 2 === 0;
                const timestamp = isExpired ? now - 2000 : now - 1000;
                const ttl = isExpired ? 1000 : 5000;
                
                mockCache.set(`key-${i}`, createCacheEntry(`data-${i}`, ttl, timestamp));
            }

            expect(mockCache.size).toBe(entryCount);

            const startTime = performance.now();
            cleanupManager.forceCleanup(mockCache);
            const endTime = performance.now();

            // Should remove half the entries
            expect(mockCache.size).toBe(entryCount / 2);
            
            // Should complete in reasonable time
            expect(endTime - startTime).toBeLessThan(1000); // Less than 1 second
        });

        test('should handle cleanup with many valid entries', () => {
            const now = Date.now();
            const entryCount = 5000;
            
            // Add many valid entries (no cleanup needed)
            for (let i = 0; i < entryCount; i++) {
                mockCache.set(`key-${i}`, createCacheEntry(`data-${i}`, 10000, now - 1000));
            }

            const startTime = performance.now();
            cleanupManager.forceCleanup(mockCache);
            const endTime = performance.now();

            // Should not remove any entries
            expect(mockCache.size).toBe(entryCount);
            
            // Should still be fast even when no cleanup is needed
            expect(endTime - startTime).toBeLessThan(500); // Less than 500ms
        });
    });

    describe('Edge Cases', () => {
        test('should handle entries with invalid timestamps', () => {
            // Entry with future timestamp
            mockCache.set('future-timestamp', createCacheEntry('data1', 1000, Date.now() + 10000));
            
            // Entry with very old timestamp
            mockCache.set('ancient-timestamp', createCacheEntry('data2', 10000, 0));
            
            // Entry with negative timestamp
            mockCache.set('negative-timestamp', createCacheEntry('data3', 1000, -1000));

            cleanupManager.forceCleanup(mockCache);

            // Future timestamp should not be expired
            expect(mockCache.has('future-timestamp')).toBe(true);
            
            // Ancient and negative timestamps should be expired
            expect(mockCache.has('ancient-timestamp')).toBe(false);
            expect(mockCache.has('negative-timestamp')).toBe(false);
        });

        test('should handle cleanup during cache modifications', () => {
            const now = Date.now();
            
            // Add initial entries
            mockCache.set('initial1', createCacheEntry('data1', 1000, now - 2000));
            mockCache.set('initial2', createCacheEntry('data2', 10000, now - 1000));

            // Start cleanup in background
            cleanupManager.start(mockCache);

            // Modify cache while cleanup is running
            mockCache.set('new-expired', createCacheEntry('data3', 1000, now - 2000));
            mockCache.set('new-valid', createCacheEntry('data4', 10000, now - 1000));

            // Force cleanup
            cleanupManager.forceCleanup(mockCache);

            // Should handle modifications gracefully
            expect(mockCache.has('initial1')).toBe(false);
            expect(mockCache.has('initial2')).toBe(true);
            expect(mockCache.has('new-expired')).toBe(false);
            expect(mockCache.has('new-valid')).toBe(true);
        });

        test('should handle cleanup with null/undefined data', () => {
            const now = Date.now();
            
            mockCache.set('null-data', createCacheEntry(null, 1000, now - 2000));
            mockCache.set('undefined-data', createCacheEntry(undefined, 10000, now - 1000));

            cleanupManager.forceCleanup(mockCache);

            expect(mockCache.has('null-data')).toBe(false);
            expect(mockCache.has('undefined-data')).toBe(true);
        });
    });

    describe('Concurrent Operations', () => {
        test('should handle concurrent cleanup operations', async () => {
            const now = Date.now();
            const entryCount = 1000;
            
            // Add entries
            for (let i = 0; i < entryCount; i++) {
                const isExpired = i % 2 === 0;
                const timestamp = isExpired ? now - 2000 : now - 1000;
                const ttl = isExpired ? 1000 : 5000;
                
                mockCache.set(`key-${i}`, createCacheEntry(`data-${i}`, ttl, timestamp));
            }

            // Run multiple cleanup operations concurrently
            const cleanupPromises = [
                Promise.resolve(cleanupManager.forceCleanup(mockCache)),
                Promise.resolve(cleanupManager.forceCleanup(mockCache)),
                Promise.resolve(cleanupManager.forceCleanup(mockCache))
            ];

            await Promise.all(cleanupPromises);

            // Should still work correctly
            expect(mockCache.size).toBe(entryCount / 2);
        });

        test('should handle cache modifications during automatic cleanup', async () => {
            const now = Date.now();
            
            // Add initial expired entries
            for (let i = 0; i < 100; i++) {
                mockCache.set(`initial-${i}`, createCacheEntry(`data-${i}`, 1000, now - 2000));
            }

            cleanupManager.start(mockCache);

            // Add more entries while cleanup is running
            const addPromises = [];
            for (let i = 100; i < 200; i++) {
                addPromises.push(
                    Promise.resolve(mockCache.set(`new-${i}`, createCacheEntry(`data-${i}`, 1000, now - 2000)))
                );
            }

            await Promise.all(addPromises);

            // Force cleanup to ensure all expired entries are removed
            cleanupManager.forceCleanup(mockCache);

            // All entries should be expired
            expect(mockCache.size).toBe(0);
        });
    });

    describe('Resource Management', () => {
        test('should clean up timers when stopped', () => {
            const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
            
            cleanupManager.start(mockCache);
            cleanupManager.stop();

            expect(clearIntervalSpy).toHaveBeenCalled();
            
            clearIntervalSpy.mockRestore();
        });

        test('should not leak memory with repeated start/stop cycles', () => {
            for (let i = 0; i < 100; i++) {
                cleanupManager.start(mockCache);
                cleanupManager.stop();
            }

            expect(cleanupManager.isRunning()).toBe(false);
        });

        test('should handle cleanup after disposal', () => {
            cleanupManager.start(mockCache);
            cleanupManager.stop();

            // Should handle operations after disposal gracefully
            expect(() => {
                cleanupManager.forceCleanup(mockCache);
            }).not.toThrow();
        });
    });

    describe('Configuration and Customization', () => {
        test('should work with different cleanup intervals', () => {
            jest.useFakeTimers();
            
            const now = Date.now();
            mockCache.set('expired', createCacheEntry('data', 1000, now - 2000));

            cleanupManager.start(mockCache);

            // Test with custom interval (implementation dependent)
            jest.advanceTimersByTime(60000);

            expect(mockCache.has('expired')).toBe(false);

            jest.useRealTimers();
        });

        test('should handle cleanup with custom cache implementations', () => {
            // Test with a Map-like object that has the required methods
            const customCache = new Map<string, CacheEntry<unknown>>();
            
            const now = Date.now();
            customCache.set('expired', createCacheEntry('data', 1000, now - 2000));

            cleanupManager.forceCleanup(customCache);

            expect(customCache.has('expired')).toBe(false);
        });
    });
});
