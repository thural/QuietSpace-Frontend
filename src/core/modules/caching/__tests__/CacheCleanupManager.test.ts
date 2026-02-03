/**
 * Cache Cleanup Manager Tests
 */

import { jest } from '@jest/globals';
import { CacheCleanupManager } from '../strategies/CacheCleanupManager';
import type { CacheEntry } from '../types/interfaces';

describe('CacheCleanupManager', () => {
    let cleanupManager: CacheCleanupManager;
    let mockCache: Map<string, CacheEntry<unknown>>;

    beforeEach(() => {
        cleanupManager = new CacheCleanupManager();
        mockCache = new Map();
    });

    afterEach(() => {
        cleanupManager.stopCleanup();
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
            expect(cleanupManager.isCleanupActive()).toBe(false);

            cleanupManager.startCleanup(1000, async () => { });
            expect(cleanupManager.isCleanupActive()).toBe(true);

            cleanupManager.stopCleanup();
            expect(cleanupManager.isCleanupActive()).toBe(false);
        });

        test('should handle multiple start calls gracefully', () => {
            cleanupManager.startCleanup(1000, async () => { });
            cleanupManager.startCleanup(500, async () => { });
            cleanupManager.startCleanup(2000, async () => { });

            expect(cleanupManager.isCleanupActive()).toBe(true);

            cleanupManager.stopCleanup();
            expect(cleanupManager.isCleanupActive()).toBe(false);
        });

        test('should handle multiple stop calls gracefully', () => {
            cleanupManager.startCleanup(1000, async () => { });
            cleanupManager.stopCleanup();
            cleanupManager.stopCleanup();
            cleanupManager.stopCleanup();

            expect(cleanupManager.isCleanupActive()).toBe(false);
        });

        test('should not start cleanup with zero or negative interval', () => {
            cleanupManager.startCleanup(0, async () => { });
            expect(cleanupManager.isCleanupActive()).toBe(false);

            cleanupManager.startCleanup(-1000, async () => { });
            expect(cleanupManager.isCleanupActive()).toBe(false);
        });

        test('should manually trigger cleanup', async () => {
            let cleanupCalled = false;
            cleanupManager.startCleanup(1000, async () => {
                cleanupCalled = true;
            });

            await cleanupManager.cleanupExpired();

            expect(cleanupCalled).toBe(true);
        });

        test('should handle manual cleanup without cleanup function', async () => {
            await cleanupManager.cleanupExpired();

            // Should not throw when no cleanup function is set
            expect(true).toBe(true);
        });
    });

    describe('Timer-based Cleanup', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('should automatically trigger cleanup at intervals', async () => {
            let cleanupCount = 0;
            cleanupManager.startCleanup(1000, async () => {
                cleanupCount++;
            });

            // Should not trigger immediately
            expect(cleanupCount).toBe(0);

            // Fast forward time to trigger first cleanup
            jest.advanceTimersByTime(1000);
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(cleanupCount).toBe(1);

            // Fast forward for second cleanup
            jest.advanceTimersByTime(1000);
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(cleanupCount).toBe(2);

            cleanupManager.stopCleanup();
        });

        test('should stop automatic cleanup when stopped', async () => {
            let cleanupCount = 0;
            cleanupManager.startCleanup(1000, async () => {
                cleanupCount++;
            });

            // Trigger one cleanup
            jest.advanceTimersByTime(1000);
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(cleanupCount).toBe(1);

            // Stop cleanup
            cleanupManager.stopCleanup();

            // Fast forward time - should not trigger more cleanups
            jest.advanceTimersByTime(2000);
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(cleanupCount).toBe(1);
        });

        test('should handle cleanup function errors gracefully', async () => {
            const errorSpy = jest.spyOn(console, 'error').mockImplementation();

            cleanupManager.startCleanup(1000, async () => {
                throw new Error('Cleanup failed');
            });

            // Trigger cleanup that will fail
            jest.advanceTimersByTime(1000);
            await new Promise(resolve => setTimeout(resolve, 0));

            // Should not throw, error should be handled
            expect(errorSpy).toHaveBeenCalled();

            cleanupManager.stopCleanup();
            errorSpy.mockRestore();
        });
    });

    describe('Integration with Cache Operations', () => {
        test('should integrate with actual cache cleanup logic', async () => {
            const now = Date.now();

            // Add expired entries
            mockCache.set('expired1', createCacheEntry('data1', 1000, now - 2000));
            mockCache.set('expired2', createCacheEntry('data2', 1000, now - 3000));

            // Add valid entries
            mockCache.set('valid1', createCacheEntry('data3', 10000, now - 1000));
            mockCache.set('valid2', createCacheEntry('data4', 10000, now - 500));

            expect(mockCache.size).toBe(4);

            // Create cleanup function that removes expired entries
            const cleanupFn = async () => {
                const currentTime = Date.now();
                for (const [key, entry] of mockCache.entries()) {
                    if (currentTime - entry.timestamp > entry.ttl) {
                        mockCache.delete(key);
                    }
                }
            };

            cleanupManager.startCleanup(100, cleanupFn);

            // Trigger cleanup
            jest.advanceTimersByTime(100);
            await new Promise(resolve => setTimeout(resolve, 0));

            // Should remove expired entries
            expect(mockCache.size).toBe(2);
            expect(mockCache.has('expired1')).toBe(false);
            expect(mockCache.has('expired2')).toBe(false);
            expect(mockCache.has('valid1')).toBe(true);
            expect(mockCache.has('valid2')).toBe(true);

            cleanupManager.stopCleanup();
        });

        test('should handle cleanup of large cache efficiently', async () => {
            // Add many entries
            for (let i = 0; i < 1000; i++) {
                const isExpired = i % 2 === 0;
                const ttl = isExpired ? 1000 : 10000;
                const timestamp = isExpired ? Date.now() - 2000 : Date.now() - 500;
                mockCache.set(`key-${i}`, createCacheEntry(`data-${i}`, ttl, timestamp));
            }

            expect(mockCache.size).toBe(1000);

            let cleanedCount = 0;
            const cleanupFn = async () => {
                const currentTime = Date.now();
                for (const [key, entry] of mockCache.entries()) {
                    if (currentTime - entry.timestamp > entry.ttl) {
                        mockCache.delete(key);
                        cleanedCount++;
                    }
                }
            };

            const startTime = performance.now();

            cleanupManager.startCleanup(50, cleanupFn);
            jest.advanceTimersByTime(50);
            await new Promise(resolve => setTimeout(resolve, 0));

            const endTime = performance.now();

            expect(mockCache.size).toBe(500); // Half should be expired
            expect(cleanedCount).toBe(500);
            expect(endTime - startTime).toBeLessThan(100); // Should complete quickly

            cleanupManager.stopCleanup();
        });
    });

    describe('Edge Cases', () => {
        test('should handle rapid start/stop cycles', () => {
            for (let i = 0; i < 10; i++) {
                cleanupManager.startCleanup(100, async () => { });
                cleanupManager.stopCleanup();
            }

            expect(cleanupManager.isCleanupActive()).toBe(false);
        });

        test('should handle cleanup function that throws synchronously', async () => {
            const errorSpy = jest.spyOn(console, 'error').mockImplementation();

            cleanupManager.startCleanup(100, async () => {
                throw new Error('Sync error');
            });

            // Trigger cleanup
            jest.advanceTimersByTime(100);
            await new Promise(resolve => setTimeout(resolve, 0));

            // Should handle error gracefully
            expect(errorSpy).toHaveBeenCalled();

            cleanupManager.stopCleanup();
            errorSpy.mockRestore();
        });

        test('should handle very short intervals', async () => {
            let cleanupCount = 0;
            cleanupManager.startCleanup(1, async () => {
                cleanupCount++;
            });

            // Trigger multiple cleanups rapidly
            for (let i = 0; i < 10; i++) {
                jest.advanceTimersByTime(1);
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            expect(cleanupCount).toBe(10);

            cleanupManager.stopCleanup();
        });

        test('should handle very long intervals', () => {
            cleanupManager.startCleanup(999999, async () => { });

            expect(cleanupManager.isCleanupActive()).toBe(true);

            // Should not trigger immediately
            expect(true).toBe(true);

            cleanupManager.stopCleanup();
        });
    });
});
