/**
 * Cache Eviction Strategy Component
 * 
 * Handles eviction logic for cache entries.
 * Follows Single Responsibility Principle by focusing only on eviction strategies.
 */

import type { CacheEntry } from '../types/interfaces';

/**
 * Interface for cache eviction strategies.
 * Determines which cache entries should be removed when the cache is full.
 */
export interface IEvictionStrategy {
    /**
     * Determines which key should be evicted from the cache.
     * @param cache - Current cache entries
     * @returns Key to evict or null if no eviction needed
     */
    shouldEvict(cache: Map<string, CacheEntry<unknown>>): string | null;

    /**
     * Called when a cache entry is accessed.
     * Used to update eviction strategy state.
     * @param key - The cache key that was accessed
     */
    onAccess(key: string): void;
}

/**
 * Least Recently Used (LRU) eviction strategy.
 * Evicts the cache entry that hasn't been accessed for the longest time.
 */
export class LRUEvictionStrategy implements IEvictionStrategy {
    private accessOrder = new Map<string, number>();
    private currentTime = 0;

    /**
     * Determines which key should be evicted based on LRU policy.
     * @param cache - Current cache entries
     * @returns Key to evict or null if no eviction needed
     */
    shouldEvict(cache: Map<string, CacheEntry<unknown>>): string | null {
        let lruKey = '';
        let oldestAccess = Date.now();

        for (const [key, entry] of cache) {
            if (entry.lastAccessed < oldestAccess) {
                oldestAccess = entry.lastAccessed;
                lruKey = key;
            }
        }

        return lruKey || null;
    }

    /**
     * Updates access order when a cache entry is accessed.
     * @param key - The cache key that was accessed
     */
    onAccess(key: string): void {
        this.accessOrder.set(key, ++this.currentTime);
    }

    /**
     * Gets the current access order for debugging purposes.
     * @returns Array of [key, timestamp] tuples sorted by access time
     */
    getAccessOrder(): Array<[string, number]> {
        return Array.from(this.accessOrder.entries()).sort((a, b) => a[1] - b[1]);
    }

    /**
     * Resets the access order (useful for testing).
     */
    reset(): void {
        this.accessOrder.clear();
        this.currentTime = 0;
    }
}

/**
 * First In, First Out (FIFO) eviction strategy.
 * Evicts the cache entry that was added first, regardless of access pattern.
 */
export class FIFOEvictionStrategy implements IEvictionStrategy {
    private insertionOrder = new Map<string, number>();
    private currentTime = 0;

    /**
     * Determines which key should be evicted based on FIFO policy.
     * @param cache - Current cache entries
     * @returns Key to evict or null if no eviction needed
     */
    shouldEvict(cache: Map<string, CacheEntry<unknown>>): string | null {
        const firstKey = this.insertionOrder.keys().next().value;

        // Ensure the key still exists in the cache before evicting
        if (firstKey && cache.has(firstKey)) {
            return firstKey;
        }

        // If first key is not in cache, clean up and try next
        if (firstKey) {
            this.insertionOrder.delete(firstKey);
        }

        return this.insertionOrder.keys().next().value || null;
    }

    /**
     * Tracks insertion order when a cache entry is first added.
     * @param key - The cache key that was accessed
     */
    onAccess(key: string): void {
        if (!this.insertionOrder.has(key)) {
            this.insertionOrder.set(key, ++this.currentTime);
        }
    }

    /**
     * Gets the current insertion order for debugging purposes.
     * @returns Array of [key, timestamp] tuples sorted by insertion time
     */
    getInsertionOrder(): Array<[string, number]> {
        return Array.from(this.insertionOrder.entries()).sort((a, b) => a[1] - b[1]);
    }

    /**
     * Resets the insertion order (useful for testing).
     */
    reset(): void {
        this.insertionOrder.clear();
        this.currentTime = 0;
    }
}
