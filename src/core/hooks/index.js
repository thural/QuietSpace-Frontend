/**
 * Custom Query Hooks - Enterprise Edition
 * 
 * This module provides a comprehensive replacement for React Query
 * with enterprise-grade features including:
 * - Custom caching with ICacheProvider integration
 * - Dependency injection container support
 * - Global state management with Zustand
 * - Optimistic updates and rollback
 * - Retry logic with exponential backoff
 * - Background refetching and invalidation
 * - Type-safe interfaces throughout
 */

// Core query hooks
export { useCustomQuery } from './useCustomQuery.js';

/**
 * Query options interface
 * @typedef {Object} QueryOptions
 * @property {boolean} [enabled] - Whether the query should execute
 * @property {number} [staleTime] - Time in milliseconds that data remains fresh
 * @property {number} [cacheTime] - Time in milliseconds that data remains in cache
 * @property {number} [refetchInterval] - Interval for automatic refetching
 * @property {boolean} [refetchOnMount] - Whether to refetch on component mount
 * @property {boolean} [refetchOnWindowFocus] - Whether to refetch on window focus
 * @property {number} [retry] - Number of retry attempts on failure
 * @property {number} [retryDelay] - Delay between retry attempts
 * @property {Function} [onSuccess] - Callback on successful query
 * @property {Function} [onError] - Callback on query error
 * @property {Function} [onSettled] - Callback on query completion
 * @property {Function} [select] - Data transformation function
 */

/**
 * Query state interface
 * @typedef {Object} QueryState
 * @property {*} data - The query data
 * @property {boolean} isLoading - Whether the query is currently loading
 * @property {boolean} isFetching - Whether the query is currently fetching
 * @property {boolean} isError - Whether the query has an error
 * @property {boolean} isSuccess - Whether the query was successful
 * @property {Error|null} error - The query error if any
 * @property {boolean} isStale - Whether the data is stale
 * @property {number|null} lastUpdated - Timestamp of last update
 */

/**
 * Custom query result interface
 * @typedef {Object} CustomQueryResult
 * @property {*} data - The query data
 * @property {boolean} isLoading - Whether the query is currently loading
 * @property {boolean} isFetching - Whether the query is currently fetching
 * @property {boolean} isError - Whether the query has an error
 * @property {boolean} isSuccess - Whether the query was successful
 * @property {Error|null} error - The query error if any
 * @property {boolean} isStale - Whether the data is stale
 * @property {number|null} lastUpdated - Timestamp of last update
 * @property {Function} refetch - Function to refetch the query
 * @property {Function} invalidate - Function to invalidate the query cache
 * @property {Function} setData - Function to manually set query data
 */

export { useCustomMutation } from './useCustomMutation.js';

/**
 * Mutation options interface
 * @typedef {Object} MutationOptions
 * @property {boolean} [enabled] - Whether the mutation should be enabled
 * @property {*} [defaultData] - Default data for the mutation
 * @property {number} [retry] - Number of retry attempts on failure
 * @property {number} [retryDelay] - Delay between retry attempts
 * @property {Function} [onSuccess] - Callback on successful mutation
 * @property {Function} [onError] - Callback on mutation error
 * @property {Function} [onSettled] - Callback on mutation completion
 * @property {Function} [onMutate] - Callback before mutation execution
 * @property {Function} [rollback] - Function to rollback on error
 */

/**
 * Mutation state interface
 * @typedef {Object} MutationState
 * @property {*} data - The mutation data
 * @property {boolean} isLoading - Whether the mutation is currently loading
 * @property {boolean} isIdle - Whether the mutation is idle
 * @property {boolean} isError - Whether the mutation has an error
 * @property {boolean} isSuccess - Whether the mutation was successful
 * @property {Error|null} error - The mutation error if any
 * @property {number|null} lastUpdated - Timestamp of last update
 */

/**
 * Custom mutation result interface
 * @typedef {Object} CustomMutationResult
 * @property {*} data - The mutation data
 * @property {boolean} isLoading - Whether the mutation is currently loading
 * @property {boolean} isIdle - Whether the mutation is idle
 * @property {boolean} isError - Whether the mutation has an error
 * @property {boolean} isSuccess - Whether the mutation was successful
 * @property {Error|null} error - The mutation error if any
 * @property {number|null} lastUpdated - Timestamp of last update
 * @property {Function} mutate - Function to execute the mutation
 * @property {Function} mutateAsync - Async function to execute the mutation
 * @property {Function} reset - Function to reset the mutation state
 * @property {Function} rollback - Function to rollback the mutation
 */

export { useCustomInfiniteQuery } from './useCustomInfiniteQuery.js';

/**
 * Infinite query options interface
 * @typedef {Object} InfiniteQueryOptions
 * @property {boolean} [enabled] - Whether the query should execute
 * @property {number} [staleTime] - Time in milliseconds that data remains fresh
 * @property {number} [cacheTime] - Time in milliseconds that data remains in cache
 * @property {number} [refetchInterval] - Interval for automatic refetching
 * @property {boolean} [refetchOnMount] - Whether to refetch on component mount
 * @property {boolean} [refetchOnWindowFocus] - Whether to refetch on window focus
 * @property {number} [retry] - Number of retry attempts on failure
 * @property {number} [retryDelay] - Delay between retry attempts
 * @property {Function} [onSuccess] - Callback on successful query
 * @property {Function} [onError] - Callback on query error
 * @property {Function} [onSettled] - Callback on query completion
 * @property {Function} [select] - Data transformation function
 * @property {number} [initialPageParam] - Initial page parameter
 * @property {Function} [getNextPageParam] - Function to get next page parameter
 * @property {Function} [getPreviousPageParam] - Function to get previous page parameter
 * @property {number} [maxPages] - Maximum number of pages to keep
 */

/**
 * Infinite query page interface
 * @typedef {Object} InfiniteQueryPage
 * @property {Array} data - The page data
 * @property {number} pageParam - The page parameter
 * @property {boolean} hasNextPage - Whether there is a next page
 * @property {boolean} hasPreviousPage - Whether there is a previous page
 * @property {boolean} isFetchingNextPage - Whether currently fetching next page
 * @property {boolean} isFetchingPreviousPage - Whether currently fetching previous page
 */

/**
 * Infinite query state interface
 * @typedef {Object} InfiniteQueryState
 * @property {Array} data - All flattened data from pages
 * @property {Array<InfiniteQueryPage>} pages - Array of pages
 * @property {boolean} isLoading - Whether the query is currently loading
 * @property {boolean} isError - Whether the query has an error
 * @property {boolean} isSuccess - Whether the query was successful
 * @property {Error|null} error - The query error if any
 * @property {boolean} isFetching - Whether the query is currently fetching
 * @property {boolean} isFetchingNextPage - Whether currently fetching next page
 * @property {boolean} isFetchingPreviousPage - Whether currently fetching previous page
 * @property {boolean} hasNextPage - Whether there is a next page
 * @property {boolean} hasPreviousPage - Whether there is a previous page
 * @property {boolean} isStale - Whether the data is stale
 * @property {number|null} lastUpdated - Timestamp of last update
 */

/**
 * Custom infinite query result interface
 * @typedef {Object} CustomInfiniteQueryResult
 * @property {Array} data - All flattened data from pages
 * @property {Array<InfiniteQueryPage>} pages - Array of pages
 * @property {boolean} isLoading - Whether the query is currently loading
 * @property {boolean} isError - Whether the query has an error
 * @property {boolean} isSuccess - Whether the query was successful
 * @property {Error|null} error - The query error if any
 * @property {boolean} isFetching - Whether the query is currently fetching
 * @property {boolean} isFetchingNextPage - Whether currently fetching next page
 * @property {boolean} isFetchingPreviousPage - Whether currently fetching previous page
 * @property {boolean} hasNextPage - Whether there is a next page
 * @property {boolean} hasPreviousPage - Whether there is a previous page
 * @property {boolean} isStale - Whether the data is stale
 * @property {number|null} lastUpdated - Timestamp of last update
 * @property {Function} refetch - Function to refetch the query
 * @property {Function} fetchNextPage - Function to fetch next page
 * @property {Function} fetchPreviousPage - Function to fetch previous page
 * @property {Function} invalidate - Function to invalidate the query cache
 * @property {Function} setData - Function to manually set query data
 */

// Global state management
export {
  useQueryState,
  useIsFetching,
  useIsMutating,
  useGlobalLoading,
  useQuerySubscription,
  useMutationSubscription,
  useQueryStateStore
} from './useQueryState.js';

/**
 * Global query state interface
 * @typedef {Object} GlobalQueryState
 * @property {Object} queries - Record of query states
 * @property {Object} mutations - Record of mutation states
 * @property {Function} setQueryState - Function to set query state
 * @property {Function} setMutationState - Function to set mutation state
 * @property {Function} clearQueryState - Function to clear query state
 * @property {Function} clearMutationState - Function to clear mutation state
 * @property {Function} resetAll - Function to reset all states
 * @property {Function} getGlobalLoadingState - Function to get global loading state
 * @property {Function} getQueryLoadingCount - Function to get query loading count
 * @property {Function} getMutationLoadingCount - Function to get mutation loading count
 */

// Re-export for convenience
export { ICacheProvider } from '../cache/index.js';

/**
 * Cache configuration interface
 * @typedef {Object} CacheConfig
 * @property {number} [defaultTTL] - Default time-to-live in milliseconds
 * @property {number} [maxSize] - Maximum cache size
 * @property {boolean} [enableMetrics] - Whether to enable metrics collection
 * @property {string} [storageType] - Type of storage to use
 */

/**
 * Cache statistics interface
 * @typedef {Object} CacheStats
 * @property {number} size - Current cache size
 * @property {number} maxSize - Maximum cache size
 * @property {number} hits - Number of cache hits
 * @property {number} misses - Number of cache misses
 * @property {number} hitRate - Cache hit rate as percentage
 * @property {number} evictions - Number of cache evictions
 * @property {number} totalRequests - Total number of requests
 */
