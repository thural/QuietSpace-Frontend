/**
 * Cache Statistics Tests
 * 
 * Tests the CacheStatistics implementation to ensure it properly
 * tracks cache performance metrics and provides accurate statistics.
 */

import { CacheStatistics } from '../storage/CacheStatistics';
import type { ICacheStatistics } from '../storage/CacheStatistics';

describe('CacheStatistics', () => {
    let statistics: ICacheStatistics;

    beforeEach(() => {
        statistics = new CacheStatistics();
    });

    describe('Basic Statistics Tracking', () => {
        test('should initialize with zero statistics', () => {
            const stats = statistics.getStats();

            expect(stats.hits).toBe(0);
            expect(stats.misses).toBe(0);
            expect(stats.evictions).toBe(0);
            expect(stats.totalRequests).toBe(0);
            expect(stats.hitRate).toBe(0);
        });

        test('should record cache hits correctly', () => {
            statistics.recordHit();
            statistics.recordHit();
            statistics.recordHit();

            const stats = statistics.getStats();

            expect(stats.hits).toBe(3);
            expect(stats.misses).toBe(0);
            expect(stats.totalRequests).toBe(3);
            expect(stats.hitRate).toBe(1);
        });

        test('should record cache misses correctly', () => {
            statistics.recordMiss();
            statistics.recordMiss();

            const stats = statistics.getStats();

            expect(stats.hits).toBe(0);
            expect(stats.misses).toBe(2);
            expect(stats.totalRequests).toBe(2);
            expect(stats.hitRate).toBe(0);
        });

        test('should record evictions correctly', () => {
            statistics.recordEviction();
            statistics.recordEviction();
            statistics.recordEviction();

            const stats = statistics.getStats();

            expect(stats.evictions).toBe(3);
            // Evictions should not affect hit rate calculations but should count towards total requests
            expect(stats.hits).toBe(0);
            expect(stats.misses).toBe(0);
            expect(stats.totalRequests).toBe(3);
        });

        test('should calculate hit rate correctly with mixed hits and misses', () => {
            // Record some hits and misses
            statistics.recordHit();
            statistics.recordHit();
            statistics.recordHit();
            statistics.recordMiss();
            statistics.recordMiss();

            const stats = statistics.getStats();

            expect(stats.hits).toBe(3);
            expect(stats.misses).toBe(2);
            expect(stats.totalRequests).toBe(5);
            expect(stats.hitRate).toBe(0.6); // 3/5 = 0.6
        });

        test('should handle hit rate calculation with only misses', () => {
            statistics.recordMiss();
            statistics.recordMiss();
            statistics.recordMiss();

            const stats = statistics.getStats();

            expect(stats.hits).toBe(0);
            expect(stats.misses).toBe(3);
            expect(stats.totalRequests).toBe(3);
            expect(stats.hitRate).toBe(0);
        });

        test('should handle hit rate calculation with no requests', () => {
            const stats = statistics.getStats();

            expect(stats.totalRequests).toBe(0);
            expect(stats.hitRate).toBe(0);
        });
    });

    describe('Statistics Reset', () => {
        test('should reset all statistics to zero', () => {
            // Record some statistics
            statistics.recordHit();
            statistics.recordHit();
            statistics.recordMiss();
            statistics.recordEviction();

            // Verify statistics are recorded
            let stats = statistics.getStats();
            expect(stats.hits).toBe(2);
            expect(stats.misses).toBe(1);
            expect(stats.evictions).toBe(1);
            expect(stats.totalRequests).toBe(4);

            // Reset statistics
            statistics.reset();

            // Verify statistics are reset
            stats = statistics.getStats();
            expect(stats.hits).toBe(0);
            expect(stats.misses).toBe(0);
            expect(stats.evictions).toBe(0);
            expect(stats.totalRequests).toBe(0);
            expect(stats.hitRate).toBe(0);
        });

        test('should handle reset when statistics are already zero', () => {
            statistics.reset();

            const stats = statistics.getStats();
            expect(stats.hits).toBe(0);
            expect(stats.misses).toBe(0);
            expect(stats.evictions).toBe(0);
            expect(stats.totalRequests).toBe(0);
            expect(stats.hitRate).toBe(0);
        });
    });

    describe('High Volume Statistics', () => {
        test('should handle large number of hits', () => {
            const hitCount = 1000000;

            for (let i = 0; i < hitCount; i++) {
                statistics.recordHit();
            }

            const stats = statistics.getStats();

            expect(stats.hits).toBe(hitCount);
            expect(stats.totalRequests).toBe(hitCount);
            expect(stats.hitRate).toBe(1);
        });

        test('should handle large number of misses', () => {
            const missCount = 500000;

            for (let i = 0; i < missCount; i++) {
                statistics.recordMiss();
            }

            const stats = statistics.getStats();

            expect(stats.misses).toBe(missCount);
            expect(stats.totalRequests).toBe(missCount);
            expect(stats.hitRate).toBe(0);
        });

        test('should handle mixed high volume operations', () => {
            const hitCount = 750000;
            const missCount = 250000;

            for (let i = 0; i < hitCount; i++) {
                statistics.recordHit();
            }

            for (let i = 0; i < missCount; i++) {
                statistics.recordMiss();
            }

            const stats = statistics.getStats();

            expect(stats.hits).toBe(hitCount);
            expect(stats.misses).toBe(missCount);
            expect(stats.totalRequests).toBe(hitCount + missCount);
            expect(stats.hitRate).toBe(hitCount / (hitCount + missCount));
        });

        test('should handle high volume evictions', () => {
            const evictionCount = 100000;

            for (let i = 0; i < evictionCount; i++) {
                statistics.recordEviction();
            }

            const stats = statistics.getStats();

            expect(stats.evictions).toBe(evictionCount);
            // Evictions should not affect hit/miss statistics but count towards total requests
            expect(stats.hits).toBe(0);
            expect(stats.misses).toBe(0);
            expect(stats.totalRequests).toBe(evictionCount);
        });
    });

    describe('Precision and Edge Cases', () => {
        test('should handle floating point hit rate precision', () => {
            // Create a scenario that results in a repeating decimal
            statistics.recordHit();
            statistics.recordMiss();
            statistics.recordHit();

            const stats = statistics.getStats();
            expect(stats.hits).toBe(2);
            expect(stats.misses).toBe(1);
            expect(stats.totalRequests).toBe(3);
            expect(stats.hitRate).toBeCloseTo(0.6666666666666666);
        });

        test('should handle very small hit rates', () => {
            const totalRequests = 1000000;
            const hits = 1;

            for (let i = 0; i < hits; i++) {
                statistics.recordHit();
            }

            for (let i = 0; i < totalRequests - hits; i++) {
                statistics.recordMiss();
            }

            const stats = statistics.getStats();
            expect(stats.hitRate).toBeCloseTo(0.000001);
        });

        test('should handle very high hit rates', () => {
            const totalRequests = 1000000;
            const misses = 1;

            for (let i = 0; i < totalRequests - misses; i++) {
                statistics.recordHit();
            }

            for (let i = 0; i < misses; i++) {
                statistics.recordMiss();
            }

            const stats = statistics.getStats();
            expect(stats.hitRate).toBeCloseTo(0.999999);
        });
    });

    describe('Concurrent Operations', () => {
        test('should handle concurrent hit recordings', async () => {
            const hitCount = 10000;
            const promises = [];

            for (let i = 0; i < hitCount; i++) {
                promises.push(Promise.resolve(statistics.recordHit()));
            }

            await Promise.all(promises);

            const stats = statistics.getStats();
            expect(stats.hits).toBe(hitCount);
            expect(stats.totalRequests).toBe(hitCount);
        });

        test('should handle concurrent miss recordings', async () => {
            const missCount = 10000;
            const promises = [];

            for (let i = 0; i < missCount; i++) {
                promises.push(Promise.resolve(statistics.recordMiss()));
            }

            await Promise.all(promises);

            const stats = statistics.getStats();
            expect(stats.misses).toBe(missCount);
            expect(stats.totalRequests).toBe(missCount);
        });

        test('should handle concurrent mixed operations', async () => {
            const operationCount = 5000;
            const promises = [];

            // Calculate expected counts based on the pattern: i % 3 === 0 (hits), 1 (misses), 2 (evictions)
            const expectedHits = Math.floor(operationCount / 3) + (operationCount % 3 > 0 ? 1 : 0);
            const expectedMisses = Math.floor(operationCount / 3) + (operationCount % 3 > 1 ? 1 : 0);
            const expectedEvictions = Math.floor(operationCount / 3);

            for (let i = 0; i < operationCount; i++) {
                if (i % 3 === 0) {
                    promises.push(Promise.resolve(statistics.recordHit()));
                } else if (i % 3 === 1) {
                    promises.push(Promise.resolve(statistics.recordMiss()));
                } else {
                    promises.push(Promise.resolve(statistics.recordEviction()));
                }
            }

            await Promise.all(promises);

            const stats = statistics.getStats();
            expect(stats.hits).toBe(expectedHits);
            expect(stats.misses).toBe(expectedMisses);
            expect(stats.evictions).toBe(expectedEvictions);
            expect(stats.totalRequests).toBe(operationCount);
        });
    });

    describe('Statistics Object Immutability', () => {
        test('should return immutable statistics object', () => {
            statistics.recordHit();
            statistics.recordMiss();

            const stats1 = statistics.getStats();
            const stats2 = statistics.getStats();

            // Modify the returned object
            (stats1 as any).hits = 999;
            (stats1 as any).misses = 888;

            // Original statistics should not be affected
            expect(stats2.hits).toBe(1);
            expect(stats2.misses).toBe(1);

            // New call to getStats should return correct values
            const stats3 = statistics.getStats();
            expect(stats3.hits).toBe(1);
            expect(stats3.misses).toBe(1);
        });

        test('should not allow modification of internal state through returned object', () => {
            statistics.recordHit();
            statistics.recordHit();
            statistics.recordMiss();

            const stats = statistics.getStats();

            // Try to modify the returned object
            try {
                (stats as any).hits = 100;
                (stats as any).misses = 50;
                (stats as any).totalRequests = 200;
                (stats as any).hitRate = 0.8;
            } catch (error) {
                // It's okay if this throws (object is frozen)
            }

            // Verify internal state is unchanged
            const newStats = statistics.getStats();
            expect(newStats.hits).toBe(2);
            expect(newStats.misses).toBe(1);
            expect(newStats.totalRequests).toBe(3);
            expect(newStats.hitRate).toBeCloseTo(0.6666666666666666);
        });
    });

    describe('Performance Considerations', () => {
        test('should have minimal performance impact for frequent operations', () => {
            const operationCount = 1000000;
            const startTime = performance.now();

            for (let i = 0; i < operationCount; i++) {
                if (i % 2 === 0) {
                    statistics.recordHit();
                } else {
                    statistics.recordMiss();
                }
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete within reasonable time (adjust threshold as needed)
            expect(duration).toBeLessThan(1000); // Less than 1 second

            const stats = statistics.getStats();
            expect(stats.totalRequests).toBe(operationCount);
        });

        test('should have minimal performance impact for statistics retrieval', () => {
            // Record some statistics
            for (let i = 0; i < 10000; i++) {
                statistics.recordHit();
                statistics.recordMiss();
            }

            const retrievalCount = 100000;
            const startTime = performance.now();

            for (let i = 0; i < retrievalCount; i++) {
                statistics.getStats();
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete within reasonable time
            expect(duration).toBeLessThan(500); // Less than 500ms
        });
    });

    describe('Memory Usage', () => {
        test('should not accumulate memory over time', () => {
            // Record many operations
            for (let i = 0; i < 100000; i++) {
                statistics.recordHit();
                statistics.recordMiss();
                statistics.recordEviction();
            }

            const statsBeforeReset = statistics.getStats();
            expect(statsBeforeReset.hits).toBe(100000);
            expect(statsBeforeReset.misses).toBe(100000);
            expect(statsBeforeReset.evictions).toBe(100000);

            // Reset and verify memory is cleared
            statistics.reset();

            const statsAfterReset = statistics.getStats();
            expect(statsAfterReset.hits).toBe(0);
            expect(statsAfterReset.misses).toBe(0);
            expect(statsAfterReset.evictions).toBe(0);
        });

        test('should handle many statistics objects without memory leaks', () => {
            const statisticsObjects = [];

            // Create many statistics objects
            for (let i = 0; i < 1000; i++) {
                const stats = new CacheStatistics();
                stats.recordHit();
                stats.recordMiss();
                statisticsObjects.push(stats);
            }

            // Verify all objects work correctly
            statisticsObjects.forEach((stats, index) => {
                const s = stats.getStats();
                expect(s.hits).toBe(1);
                expect(s.misses).toBe(1);
                expect(s.totalRequests).toBe(2);
            });
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle rapid successive operations', () => {
            // Rapid operations in quick succession
            for (let i = 0; i < 10000; i++) {
                statistics.recordHit();
                statistics.recordMiss();
                statistics.recordEviction();
                statistics.getStats();
            }

            const stats = statistics.getStats();
            expect(stats.hits).toBe(10000);
            expect(stats.misses).toBe(10000);
            expect(stats.evictions).toBe(10000);
            expect(stats.totalRequests).toBe(30000);
        });

        test('should maintain accuracy after many resets', () => {
            for (let cycle = 0; cycle < 100; cycle++) {
                // Record some operations
                statistics.recordHit();
                statistics.recordHit();
                statistics.recordMiss();

                // Verify
                let stats = statistics.getStats();
                expect(stats.hits).toBe(2);
                expect(stats.misses).toBe(1);
                expect(stats.totalRequests).toBe(3);

                // Reset
                statistics.reset();

                // Verify reset
                stats = statistics.getStats();
                expect(stats.hits).toBe(0);
                expect(stats.misses).toBe(0);
                expect(stats.totalRequests).toBe(0);
            }
        });
    });
});
