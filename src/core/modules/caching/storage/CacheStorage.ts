/**
 * Cache Storage Component
 * 
 * Handles pure storage operations for cache entries.
 * Follows Single Responsibility Principle by focusing only on storage.
 */

import type { CacheEntry } from '../types/interfaces';

export interface ICacheStorage {
    get<T>(key: string): CacheEntry<T> | null;
    set<T>(key: string, entry: CacheEntry<T>): void;
    delete(key: string): boolean;
    clear(): void;
    has(key: string): boolean;
    size(): number;
    keys(): string[];
    entries(): Array<[string, CacheEntry<unknown>]>;
}

export class CacheStorage implements ICacheStorage {
    private readonly cache = new Map<string, CacheEntry<unknown>>();

    get<T>(key: string): CacheEntry<T> | null {
        const entry = this.cache.get(key);
        return entry as CacheEntry<T> | null;
    }

    set<T>(key: string, entry: CacheEntry<T>): void {
        this.cache.set(key, entry as CacheEntry<unknown>);
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    size(): number {
        return this.cache.size;
    }

    keys(): string[] {
        return Array.from(this.cache.keys());
    }

    entries(): Array<[string, CacheEntry<unknown>]> {
        return Array.from(this.cache.entries());
    }
}
