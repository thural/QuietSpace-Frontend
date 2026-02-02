/**
 * Cache Statistics Component
 * 
 * Handles statistics tracking for cache operations.
 * Follows Single Responsibility Principle by focusing only on metrics.
 */

import type { CacheStats } from '../types/interfaces';

export interface ICacheStatistics {
    recordHit(): void;
    recordMiss(): void;
    recordEviction(): void;
    getStats(): CacheStats;
    reset(): void;
}

export class CacheStatistics implements ICacheStatistics {
    private hits = 0;
    private misses = 0;
    private evictions = 0;

    recordHit(): void {
        this.hits++;
    }

    recordMiss(): void {
        this.misses++;
    }

    recordEviction(): void {
        this.evictions++;
    }

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

    reset(): void {
        this.hits = 0;
        this.misses = 0;
        this.evictions = 0;
    }
}
