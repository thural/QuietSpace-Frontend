import { useDIContainer } from '@/core/di';
import { TYPES } from '@/core/di/types';
import type { CacheProvider } from '@/core/cache';

/**
 * Migration utilities for React Query to Custom Query Hooks
 * 
 * This module provides helper functions to ease the migration from React Query
 * to our custom query implementation while maintaining backward compatibility.
 */

/**
 * React Query equivalent cache time mapping
 */
export const CACHE_TIME_MAPPINGS = {
  // Feed data - 2 minutes stale, 10 minutes cache
  FEED_STALE_TIME: 2 * 60 * 1000,
  FEED_CACHE_TIME: 10 * 60 * 1000,
  
  // Post data - 5 minutes stale, 15 minutes cache
  POST_STALE_TIME: 5 * 60 * 1000,
  POST_CACHE_TIME: 15 * 60 * 1000,
  
  // Comment data - 3 minutes stale, 10 minutes cache
  COMMENT_STALE_TIME: 3 * 60 * 1000,
  COMMENT_CACHE_TIME: 10 * 60 * 1000,
  
  // User data - 10 minutes stale, 30 minutes cache
  USER_STALE_TIME: 10 * 60 * 1000,
  USER_CACHE_TIME: 30 * 60 * 1000
} as const;

/**
 * React Query key to custom cache key converter
 */
export function convertQueryKeyToCacheKey(queryKey: any[]): string {
  return queryKey.join(':');
}

/**
 * Cache invalidation helper
 */
export class CacheInvalidationHelper {
  private cache: CacheProvider;

  constructor() {
    const container = useDIContainer();
    this.cache = container.getByToken<CacheProvider>(TYPES.CACHE_SERVICE);
  }

  /**
   * Invalidate all feed-related cache entries
   */
  invalidateFeed(): void {
    const patterns = [
      'feed:*',
      'posts:*',
      'posts',
      'posts:saved:*',
      'posts:replied:*'
    ];

    patterns.forEach(pattern => {
      this.cache.invalidatePattern(pattern);
    });
  }

  /**
   * Invalidate post-specific cache entries
   */
  invalidatePost(postId: string): void {
    const patterns = [
      `posts:*:${postId}`,
      `post:${postId}`,
      `posts:${postId}:comments:*`,
      `feed:*:*${postId}*`
    ];

    patterns.forEach(pattern => {
      this.cache.invalidatePattern(pattern);
    });
  }

  /**
   * Invalidate comment-specific cache entries
   */
  invalidateComment(commentId: string, postId: string): void {
    const patterns = [
      `posts:${postId}:comments:*`,
      `comment:${commentId}`,
      `comments:*:${commentId}`
    ];

    patterns.forEach(pattern => {
      this.cache.invalidatePattern(pattern);
    });
  }

  /**
   * Invalidate user-specific cache entries
   */
  invalidateUser(userId: string): void {
    const patterns = [
      `posts:${userId}:*`,
      `user:${userId}:*`,
      `profile:${userId}:*`
    ];

    patterns.forEach(pattern => {
      this.cache.invalidatePattern(pattern);
    });
  }

  /**
   * Clear all cache entries (use with caution)
   */
  clearAll(): void {
    this.cache.clear();
  }
}

/**
 * Hook to get cache invalidation helper
 */
export function useCacheInvalidation(): CacheInvalidationHelper {
  return new CacheInvalidationHelper();
}

/**
 * React Query to Custom Query options converter
 */
export function convertReactQueryOptions<T = any>(
  reactQueryOptions: any
): {
  query?: import('./useCustomQuery').QueryOptions<T>;
  mutation?: import('./useCustomMutation').MutationOptions<T>;
  infiniteQuery?: import('./useCustomInfiniteQuery').InfiniteQueryOptions<T>;
} {
  const converted: any = {};

  // Common options
  if (reactQueryOptions.enabled !== undefined) {
    converted.enabled = reactQueryOptions.enabled;
  }

  if (reactQueryOptions.staleTime !== undefined) {
    converted.staleTime = reactQueryOptions.staleTime;
  }

  if (reactQueryOptions.cacheTime !== undefined || reactQueryOptions.gcTime !== undefined) {
    converted.cacheTime = reactQueryOptions.cacheTime || reactQueryOptions.gcTime;
  }

  if (reactQueryOptions.refetchInterval !== undefined) {
    converted.refetchInterval = reactQueryOptions.refetchInterval;
  }

  if (reactQueryOptions.refetchOnMount !== undefined) {
    converted.refetchOnMount = reactQueryOptions.refetchOnMount;
  }

  if (reactQueryOptions.refetchOnWindowFocus !== undefined) {
    converted.refetchOnWindowFocus = reactQueryOptions.refetchOnWindowFocus;
  }

  if (reactQueryOptions.retry !== undefined) {
    converted.retry = reactQueryOptions.retry;
  }

  if (reactQueryOptions.retryDelay !== undefined) {
    converted.retryDelay = reactQueryOptions.retryDelay;
  }

  // Query-specific options
  if (reactQueryOptions.onSuccess !== undefined) {
    converted.onSuccess = reactQueryOptions.onSuccess;
  }

  if (reactQueryOptions.onError !== undefined) {
    converted.onError = reactQueryOptions.onError;
  }

  if (reactQueryOptions.onSettled !== undefined) {
    converted.onSettled = reactQueryOptions.onSettled;
  }

  if (reactQueryOptions.select !== undefined) {
    converted.select = reactQueryOptions.select;
  }

  if (reactQueryOptions.initialData !== undefined) {
    converted.initialData = reactQueryOptions.initialData;
  }

  if (reactQueryOptions.placeholderData !== undefined) {
    converted.placeholderData = reactQueryOptions.placeholderData;
  }

  // Infinite query-specific options
  if (reactQueryOptions.initialPageParam !== undefined) {
    converted.initialPageParam = reactQueryOptions.initialPageParam;
  }

  if (reactQueryOptions.getNextPageParam !== undefined) {
    converted.getNextPageParam = reactQueryOptions.getNextPageParam;
  }

  if (reactQueryOptions.getPreviousPageParam !== undefined) {
    converted.getPreviousPageParam = reactQueryOptions.getPreviousPageParam;
  }

  // Mutation-specific options
  if (reactQueryOptions.onMutate !== undefined) {
    converted.onMutate = reactQueryOptions.onMutate;
  }

  if (reactQueryOptions.invalidateQueries !== undefined) {
    converted.invalidateQueries = reactQueryOptions.invalidateQueries;
  }

  return converted;
}

/**
 * Performance monitoring for query hooks
 */
export class QueryPerformanceMonitor {
  private static instance: QueryPerformanceMonitor;
  private metrics: Map<string, {
    fetchCount: number;
    cacheHits: number;
    cacheMisses: number;
    averageFetchTime: number;
    totalFetchTime: number;
  }> = new Map();

  static getInstance(): QueryPerformanceMonitor {
    if (!QueryPerformanceMonitor.instance) {
      QueryPerformanceMonitor.instance = new QueryPerformanceMonitor();
    }
    return QueryPerformanceMonitor.instance;
  }

  recordFetch(key: string, fetchTime: number, fromCache: boolean): void {
    const existing = this.metrics.get(key) || {
      fetchCount: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageFetchTime: 0,
      totalFetchTime: 0
    };

    existing.fetchCount++;
    existing.totalFetchTime += fetchTime;
    existing.averageFetchTime = existing.totalFetchTime / existing.fetchCount;

    if (fromCache) {
      existing.cacheHits++;
    } else {
      existing.cacheMisses++;
    }

    this.metrics.set(key, existing);
  }

  getMetrics(key: string) {
    return this.metrics.get(key);
  }

  getAllMetrics() {
    return Object.fromEntries(this.metrics);
  }

  reset(): void {
    this.metrics.clear();
  }
}

/**
 * Hook to get performance monitor
 */
export function useQueryPerformanceMonitor(): QueryPerformanceMonitor {
  return QueryPerformanceMonitor.getInstance();
}

/**
 * Migration status tracker
 */
export class MigrationTracker {
  private static instance: MigrationTracker;
  private migratedHooks: Set<string> = new Set();
  private pendingHooks: Set<string> = new Set();

  static getInstance(): MigrationTracker {
    if (!MigrationTracker.instance) {
      MigrationTracker.instance = new MigrationTracker();
    }
    return MigrationTracker.instance;
  }

  markMigrated(hookName: string): void {
    this.migratedHooks.add(hookName);
    this.pendingHooks.delete(hookName);
  }

  markPending(hookName: string): void {
    this.pendingHooks.add(hookName);
  }

  isMigrated(hookName: string): boolean {
    return this.migratedHooks.has(hookName);
  }

  isPending(hookName: string): boolean {
    return this.pendingHooks.has(hookName);
  }

  getMigratedHooks(): string[] {
    return Array.from(this.migratedHooks);
  }

  getPendingHooks(): string[] {
    return Array.from(this.pendingHooks);
  }

  getMigrationStatus(): {
    total: number;
    migrated: number;
    pending: number;
    percentage: number;
  } {
    const total = this.migratedHooks.size + this.pendingHooks.size;
    const migrated = this.migratedHooks.size;
    const pending = this.pendingHooks.size;
    const percentage = total > 0 ? (migrated / total) * 100 : 0;

    return { total, migrated, pending, percentage };
  }
}

/**
 * Hook to get migration tracker
 */
export function useMigrationTracker(): MigrationTracker {
  return MigrationTracker.getInstance();
}
