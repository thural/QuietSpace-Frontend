/**
 * Enterprise Infinite Query Types
 * 
 * These types replace React Query's InfiniteData with our enterprise implementation
 */

/**
 * Infinite data interface for paginated queries
 * 
 * @typedef {Object} InfiniteData
 * @property {Array} pages - Array of data pages
 * @property {Array} pageParams - Array of page parameters
 * @description Represents paginated data with pages and parameters
 */

/**
 * Infinite query observer result interface
 * 
 * @typedef {Object} InfiniteQueryObserverResult
 * @property {InfiniteData|undefined} data - Query data
 * @property {number} dataUpdatedAt - Last data update timestamp
 * @property {any|null} error - Query error
 * @property {number} errorUpdatedAt - Last error update timestamp
 * @property {number} failureCount - Number of failures
 * @property {any|null} failureReason - Reason for failure
 * @property {number} errorUpdateCount - Number of error updates
 * @property {boolean} isError - Whether there is an error
 * @property {boolean} isFetched - Whether data has been fetched
 * @property {boolean} isFetchedAfterMount - Whether data was fetched after mount
 * @property {boolean} isFetching - Whether currently fetching
 * @property {boolean} isFetchingNextPage - Whether fetching next page
 * @property {boolean} isFetchingPreviousPage - Whether fetching previous page
 * @property {boolean} isLoading - Whether currently loading
 * @property {boolean} isPending - Whether currently pending
 * @property {boolean} isPlaceholderData - Whether using placeholder data
 * @property {boolean} isRefetching - Whether currently refetching
 * @property {boolean} isRefetchingError - Whether there is a refetching error
 * @description Represents the complete state of an infinite query
 */

/**
 * Infinite query options interface
 * 
 * @typedef {Object} InfiniteQueryOptions
 * @property {Function} getNextPageParam - Function to get next page parameter
 * @property {Function} getPreviousPageParam - Function to get previous page parameter
 * @property {any} [initialPageParam] - Initial page parameter
 * @property {boolean} [enabled=true] - Whether query is enabled
 * @description Options for infinite query configuration
 */

/**
 * Infinite query fetch result interface
 * 
 * @typedef {Object} InfiniteQueryFetchResult
 * @property {InfiniteData} pages - Fetched pages
 * @property {any|null} pageParam - Current page parameter
 * @property {boolean} hasNextPage - Whether there is a next page
 * @property {boolean} hasPreviousPage - Whether there is a previous page
 * @description Result of infinite query fetch operation
 */
