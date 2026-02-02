/**
 * Cache Eviction Strategy Component
 * 
 * Handles eviction logic for cache entries.
 * Follows Single Responsibility Principle by focusing only on eviction strategies.
 */

import type { CacheEntry } from '../types/interfaces';

export interface IEvictionStrategy {
    shouldEvict(cache: Map<string, CacheEntry<unknown>>): string | null;
    onAccess(key: string): void;
}

export class LRUEvictionStrategy implements IEvictionStrategy {
    private accessOrder = new Map<string, number>();
    private currentTime = 0;

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

    onAccess(key: string): void {
        this.accessOrder.set(key, ++this.currentTime);
    }

    /**
     * Get the current access order for debugging purposes
     */
    getAccessOrder(): Array<[string, number]> {
        return Array.from(this.accessOrder.entries()).sort((a, b) => a[1] - b[1]);
    }

    /**
     * Reset the access order (useful for testing)
     */
    reset(): void {
        this.accessOrder.clear();
        this.currentTime = 0;
    }
}

export class FIFOEvictionStrategy implements IEvictionStrategy {
    private insertionOrder = new Map<string, number>();
    private currentTime = 0;

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

    onAccess(key: string): void {
        if (!this.insertionOrder.has(key)) {
            this.insertionOrder.set(key, ++this.currentTime);
        }
    }

    /**
     * Get the current insertion order for debugging purposes
     */
    getInsertionOrder(): Array<[string, number]> {
        return Array.from(this.insertionOrder.entries()).sort((a, b) => a[1] - b[1]);
    }

    /**
     * Reset the insertion order (useful for testing)
     */
    reset(): void {
        this.insertionOrder.clear();
        this.currentTime = 0;
    }
}
