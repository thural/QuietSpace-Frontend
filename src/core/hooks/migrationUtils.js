import { useDIContainer } from '../di/index.js';
import { TYPES } from '../di/types.js';

/**
 * Cache provider interface
 * @typedef {Object} ICacheProvider
 * @property {(key: string, value: any, ttl?: number) => Promise<void>} set - Set cache value
 * @property {(key: string) => Promise<any>} get - Get cache value
 * @property {(key: string) => Promise<void>} invalidate - Invalidate cache entry
 * @property {(key: string) => Object} getEntry - Get cache entry with metadata
 */

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
  USER_CACHE_TIME: 30 * 60 * 1000,

  // Chat data - 1 minute stale, 5 minutes cache
  CHAT_STALE_TIME: 1 * 60 * 1000,
  CHAT_CACHE_TIME: 5 * 60 * 1000,
  CHAT_REFETCH_INTERVAL: 30 * 1000, // 30 seconds for chat list updates
  MESSAGES_REFETCH_INTERVAL: 10 * 1000, // 10 seconds for message updates

  // Real-time data - 30 seconds stale, 2 minutes cache (for real-time features)
  REALTIME_STALE_TIME: 30 * 1000,
  REALTIME_CACHE_TIME: 2 * 60 * 1000,

  // Search data - 30 seconds stale, 2 minutes cache
  SEARCH_STALE_TIME: 30 * 1000,
  SEARCH_CACHE_TIME: 2 * 60 * 1000
};

/**
 * React Query key to custom cache key converter
 * 
 * @param {Array} queryKey - React Query key array
 * @returns {string} Custom cache key
 */
export function convertQueryKeyToCacheKey(queryKey) {
  return queryKey.join(':');
}

/**
 * Cache invalidation helper
 */
export class CacheInvalidationHelper {
  constructor() {
    const container = useDIContainer();
    this.cache = container.getByToken(TYPES.CACHE_SERVICE);
  }

  /**
   * Invalidate all feed-related cache entries
   */
  invalidateFeed() {
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
   * 
   * @param {string} postId - Post ID to invalidate
   */
  invalidatePost(postId) {
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
   * 
   * @param {string} commentId - Comment ID to invalidate
   * @param {string} postId - Post ID associated with the comment
   */
  invalidateComment(commentId, postId) {
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
   * 
   * @param {string} userId - User ID to invalidate
   */
  invalidateUser(userId) {
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
   * Invalidate chat-specific cache entries
   * 
   * @param {string} chatId - Chat ID to invalidate
   */
  invalidateChatData(chatId) {
    const patterns = [
      `chat:${chatId}:*`,
      `chat:message:*${chatId}*`,
      `chat:*:${chatId}:*`
    ];

    patterns.forEach(pattern => {
      this.cache.invalidatePattern(pattern);
    });
  }

  /**
   * Invalidate user-specific chat cache entries
   * 
   * @param {string} userId - User ID to invalidate
   */
  invalidateUserChatData(userId) {
    const patterns = [
      `chat:user:${userId}:*`,
      `chat:*:user:${userId}:*`
    ];

    patterns.forEach(pattern => {
      this.cache.invalidatePattern(pattern);
    });
  }

  /**
   * Clear all cache entries (use with caution)
   */
  clearAll() {
    this.cache.clear();
  }
}

/**
 * Hook to get cache invalidation helper
 * 
 * @returns {CacheInvalidationHelper} Cache invalidation helper instance
 */
export function useCacheInvalidation() {
  return new CacheInvalidationHelper();
}

/**
 * React Query to Custom Query options converter
 * 
 * @param {*} reactQueryOptions - React Query options
 * @returns {Object} Converted options for custom hooks
 */
export function convertReactQueryOptions(reactQueryOptions) {
  const converted = {};

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
  static instance = null;
  metrics = new Map();

  static getInstance() {
    if (!QueryPerformanceMonitor.instance) {
      QueryPerformanceMonitor.instance = new QueryPerformanceMonitor();
    }
    return QueryPerformanceMonitor.instance;
  }

  /**
   * Record fetch performance metrics
   * 
   * @param {string} key - Query key
   * @param {number} fetchTime - Fetch time in milliseconds
   * @param {boolean} fromCache - Whether data came from cache
   */
  recordFetch(key, fetchTime, fromCache) {
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

  /**
   * Get metrics for a specific query
   * 
   * @param {string} key - Query key
   * @returns {Object} Metrics object
   */
  getMetrics(key) {
    return this.metrics.get(key);
  }

  /**
   * Get all metrics
   * 
   * @returns {Object} All metrics
   */
  getAllMetrics() {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Reset all metrics
   */
  reset() {
    this.metrics.clear();
  }
}

/**
 * Hook to get performance monitor
 * 
 * @returns {QueryPerformanceMonitor} Performance monitor instance
 */
export function useQueryPerformanceMonitor() {
  return QueryPerformanceMonitor.getInstance();
}

/**
 * Migration status tracker
 */
export class MigrationTracker {
  static instance = null;
  migratedHooks = new Set();
  pendingHooks = new Set();

  static getInstance() {
    if (!MigrationTracker.instance) {
      MigrationTracker.instance = new MigrationTracker();
    }
    return MigrationTracker.instance;
  }

  /**
   * Mark a hook as migrated
   * 
   * @param {string} hookName - Hook name
   */
  markMigrated(hookName) {
    this.migratedHooks.add(hookName);
    this.pendingHooks.delete(hookName);
  }

  /**
   * Mark a hook as pending migration
   * 
   * @param {string} hookName - Hook name
   */
  markPending(hookName) {
    this.pendingHooks.add(hookName);
  }

  /**
   * Check if a hook is migrated
   * 
   * @param {string} hookName - Hook name
   * @returns {boolean} Whether the hook is migrated
   */
  isMigrated(hookName) {
    return this.migratedHooks.has(hookName);
  }

  /**
   * Check if a hook is pending migration
   * 
   * @param {string} hookName - Hook name
   * @returns {boolean} Whether the hook is pending
   */
  isPending(hookName) {
    return this.pendingHooks.has(hookName);
  }

  /**
   * Get list of migrated hooks
   * 
   * @returns {Array<string>} List of migrated hooks
   */
  getMigratedHooks() {
    return Array.from(this.migratedHooks);
  }

  /**
   * Get list of pending hooks
   * 
   * @returns {Array<string>} List of pending hooks
   */
  getPendingHooks() {
    return Array.from(this.pendingHooks);
  }

  /**
   * Get migration status
   * 
   * @returns {Object} Migration status object
   */
  getMigrationStatus() {
    const total = this.migratedHooks.size + this.pendingHooks.size;
    const migrated = this.migratedHooks.size;
    const pending = this.pendingHooks.size;
    const percentage = total > 0 ? (migrated / total) * 100 : 0;

    return { total, migrated, pending, percentage };
  }
}

/**
 * Hook to get migration tracker
 * 
 * @returns {MigrationTracker} Migration tracker instance
 */
export function useMigrationTracker() {
  return MigrationTracker.getInstance();
}
