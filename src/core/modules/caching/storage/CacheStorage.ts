/**
 * Cache Storage Component
 * 
 * Handles pure storage operations for cache entries.
 * Follows Single Responsibility Principle by focusing only on storage.
 */

import type { CacheEntry } from '../types/interfaces';

/**
 * Interface for cache storage operations.
 * Provides pure storage functionality without business logic.
 */
export interface ICacheStorage {
    /**
     * Retrieves a cache entry by key.
     * @param key - The cache key to retrieve
     * @returns Cache entry or null if not found
     */
    get<T>(key: string): CacheEntry<T> | null;

    /**
     * Stores a cache entry.
     * @param key - The cache key to store under
     * @param entry - The cache entry to store
     */
    set<T>(key: string, entry: CacheEntry<T>): void;

    /**
     * Removes a cache entry.
     * @param key - The cache key to remove
     * @returns True if entry was removed, false if not found
     */
    delete(key: string): boolean;

    /**
     * Clears all cache entries.
     */
    clear(): void;

    /**
     * Checks if a cache entry exists.
     * @param key - The cache key to check
     * @returns True if entry exists
     */
    has(key: string): boolean;

    /**
     * Gets the number of cache entries.
     * @returns Current cache size
     */
    size(): number;

    /**
     * Gets all cache keys.
     * @returns Array of all cache keys
     */
    keys(): string[];

    /**
     * Gets all cache entries as key-value pairs.
     * @returns Array of [key, entry] tuples
     */
    entries(): Array<[string, CacheEntry<unknown>]>;
}

/**
 * In-memory cache storage implementation using Map.
 * Provides thread-safe storage operations for cache entries.
 */
export class CacheStorage implements ICacheStorage {
    private readonly cache = new Map<string, CacheEntry<unknown>>();

    /**
     * Retrieves a cache entry by key.
     * @param key - The cache key to retrieve
     * @returns Cache entry or null if not found
     */
    get<T>(key: string): CacheEntry<T> | null {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }

        // Don't update access statistics here - let CacheProvider handle it
        // to avoid double-counting

        // Safe type assertion since we control the storage
        return entry as CacheEntry<T>;
    }

    /**
     * Stores a cache entry.
     * @param key - The cache key to store under
     * @param entry - The cache entry to store
     */
    set<T>(key: string, entry: CacheEntry<T>): void {
        this.cache.set(key, entry as CacheEntry<unknown>);
    }

    /**
     * Removes a cache entry.
     * @param key - The cache key to remove
     * @returns True if entry was removed, false if not found
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Clears all cache entries.
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Checks if a cache entry exists.
     * @param key - The cache key to check
     * @returns True if entry exists
     */
    has(key: string): boolean {
        return this.cache.has(key);
    }

    /**
     * Gets the number of cache entries.
     * @returns Current cache size
     */
    size(): number {
        return this.cache.size;
    }

    /**
     * Gets all cache keys.
     * @returns Array of all cache keys
     */
    keys(): string[] {
        return Array.from(this.cache.keys());
    }

    /**
     * Gets all cache entries as key-value pairs.
     * @returns Array of [key, entry] tuples
     */
    entries(): Array<[string, CacheEntry<unknown>]> {
        return Array.from(this.cache.entries());
    }
}
