/**
 * Cache Statistics Component
 * 
 * Handles statistics tracking for cache operations.
 * Follows Single Responsibility Principle by focusing only on metrics.
 */

import type { CacheStats } from '../types/interfaces';

/**
 * Interface for cache statistics tracking.
 * Provides methods to record and retrieve cache performance metrics.
 */
export interface ICacheStatistics {
    /**
     * Records a cache hit event.
     */
    recordHit(): void;

    /**
     * Records a cache miss event.
     */
    recordMiss(): void;

    /**
     * Records a cache eviction event.
     */
    recordEviction(): void;

    /**
     * Gets current cache statistics.
     * @returns Current cache statistics including hit rate, counts, etc.
     */
    getStats(): CacheStats;

    /**
     * Resets all statistics to zero.
     */
    reset(): void;
}

/**
 * Cache statistics implementation.
 * Tracks hit rates, misses, evictions, and calculates performance metrics.
 */
export class CacheStatistics implements ICacheStatistics {
    private hits = 0;
    private misses = 0;
    private evictions = 0;

    /**
     * Records a cache hit event.
     */
    recordHit(): void {
        this.hits++;
    }

    /**
     * Records a cache miss event.
     */
    recordMiss(): void {
        this.misses++;
    }

    /**
     * Records a cache eviction event.
     */
    recordEviction(): void {
        this.evictions++;
    }

    /**
     * Gets current cache statistics.
     * @returns Current cache statistics including hit rate, counts, etc.
     */
    getStats(): CacheStats {
        const total = this.hits + this.misses;
        return {
            size: 0, // Will be set by CacheProvider
            hits: this.hits,
            misses: this.misses,
            hitRate: total > 0 ? this.hits / total : 0,
            evictions: this.evictions,
            totalRequests: total
        };
    }

    /**
     * Resets all statistics to zero.
     */
    reset(): void {
        this.hits = 0;
        this.misses = 0;
        this.evictions = 0;
    }
}
