/**
 * Cache Manager Implementation
 *
 * Implements cache operations with intelligent key management
 */

import type { ICacheManager } from './ICacheManager';
import type { ICacheProvider } from '@/core/cache';

export class CacheManager implements ICacheManager {
  constructor(private readonly cache: ICacheProvider) {}

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, data, ttl);
  }

  invalidate(key: string): void {
    this.cache.invalidate(key);
  }

  getEntry(key: string): { data: any; timestamp: number; ttl?: number } | undefined {
    return this.cache.getEntry(key);
  }

  isStale(key: string, staleTime: number): boolean {
    const entry = this.getEntry(key);
    if (!entry) return true;

    const cacheAge = Date.now() - entry.timestamp;
    return cacheAge > staleTime;
  }

  getStats(): any {
    return this.cache.getStats();
  }

  generateKey(base: string, params: Record<string, any> = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join(':');

    return sortedParams ? `${base}:${sortedParams}` : base;
  }
}
