import { CACHE_TIME_MAPPINGS } from '@/core/hooks/migrationUtils';

/**
 * Shared pagination utilities for infinite queries
 * Eliminates DRY violations across feed hooks
 */

export interface PaginationOptions {
  limit?: number;
  staleTime?: number;
  cacheTime?: number;
}

/**
 * Creates standardized infinite query configuration
 */
export const createInfiniteQueryConfig = (options: PaginationOptions = {}) => {
  const { limit = 20, staleTime, cacheTime } = options;
  
  return {
    getNextPageParam: (lastPage: any[], allPages: any[]) => 
      lastPage.length === limit ? allPages.length + 1 : undefined,
    staleTime: staleTime || CACHE_TIME_MAPPINGS.FEED_STALE_TIME,
    cacheTime: cacheTime || CACHE_TIME_MAPPINGS.FEED_CACHE_TIME,
  };
};

/**
 * Creates standardized infinite query configuration for posts
 */
export const createPostInfiniteQueryConfig = (limit: number = 20) => 
  createInfiniteQueryConfig({
    limit,
    staleTime: CACHE_TIME_MAPPINGS.POST_STALE_TIME,
    cacheTime: CACHE_TIME_MAPPINGS.POST_CACHE_TIME,
  });

/**
 * Creates standardized infinite query configuration for comments
 */
export const createCommentInfiniteQueryConfig = (limit: number = 50) => 
  createInfiniteQueryConfig({
    limit,
    staleTime: CACHE_TIME_MAPPINGS.COMMENT_STALE_TIME,
    cacheTime: CACHE_TIME_MAPPINGS.COMMENT_CACHE_TIME,
  });

/**
 * Creates standardized infinite query configuration for search results
 */
export const createSearchInfiniteQueryConfig = (limit: number = 20) => 
  createInfiniteQueryConfig({
    limit,
    staleTime: 30 * 1000, // 30 seconds for search
    cacheTime: 2 * 60 * 1000, // 2 minutes for search
  });
