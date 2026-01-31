import { useState, useEffect, useCallback, useRef } from 'react';
import { Container } from '../di/container/Container.js';
import { TYPES } from '../di/types.js';
import { useDIContainer } from '../di/index.js';

/**
 * Cache provider interface
 * @typedef {Object} ICacheProvider
 * @property {(key: string, value: any, ttl?: number) => Promise<void>} set - Set cache value
 * @property {(key: string) => Promise<any>} get - Get cache value
 * @property {(key: string) => Promise<void>} invalidate - Invalidate cache entry
 * @property {(key: string) => Object} getEntry - Get cache entry with metadata
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
 * Enterprise-grade infinite query options interface
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
 * Custom infinite query hook result interface
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

/**
 * Enterprise-grade custom infinite query hook
 * 
 * Replaces React Query's useInfiniteQuery with custom implementation
 * that integrates with our ICacheProvider and DI container
 * 
 * @param {string|Array<string>} key - Query key or array of keys
 * @param {Function} fetcher - Function to fetch data for a given page parameter
 * @param {InfiniteQueryOptions} options - Query options
 * @returns {CustomInfiniteQueryResult} Infinite query result
 */
export function useCustomInfiniteQuery(key, fetcher, options = {}) {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes default
    cacheTime = 10 * 60 * 1000, // 10 minutes default
    refetchInterval,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    retry = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    onSettled,
    select,
    initialPageParam = 0,
    getNextPageParam,
    getPreviousPageParam,
    maxPages = 100
  } = options;

  const container = useDIContainer();
  const cache = container.getByToken(TYPES.CACHE_SERVICE);

  const cacheKey = Array.isArray(key) ? key.join(':') : key;

  const [state, setState] = useState({
    data: [],
    pages: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
    isFetching: false,
    isFetchingNextPage: false,
    isFetchingPreviousPage: false,
    hasNextPage: false,
    hasPreviousPage: false,
    isStale: true,
    lastUpdated: null
  });

  const retryCountRef = useRef(0);
  const abortControllerRef = useRef(null);
  const refetchIntervalRef = useRef(null);

  // Execute query for a specific page
  const executeQuery = useCallback(async (
    pageParam,
    isRefetch = false,
    isFetchingNext = false,
    isFetchingPrevious = false
  ) => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: !isRefetch && prev.pages.length === 0,
        isFetching: true,
        isFetchingNextPage: isFetchingNext,
        isFetchingPreviousPage: isFetchingPrevious,
        error: null,
        isError: false
      }));

      // Check cache first
      const pageCacheKey = `${cacheKey}:page:${pageParam}`;
      const cachedEntry = cache.getEntry(pageCacheKey);

      if (cachedEntry && !isRefetch) {
        const cacheAge = Date.now() - cachedEntry.timestamp;
        if (cacheAge < staleTime) {
          const pageData = cachedEntry.data;

          setState(prev => {
            let newPages;

            if (isFetchingNext) {
              newPages = [...prev.pages, pageData];
            } else if (isFetchingPrevious) {
              newPages = [pageData, ...prev.pages];
            } else {
              newPages = [pageData];
            }

            const allData = newPages.flatMap(page => page.data);
            const hasNext = getNextPageParam ?
              getNextPageParam(pageData, newPages) !== undefined :
              pageData.hasNextPage;
            const hasPrevious = getPreviousPageParam ?
              getPreviousPageParam(pageData, newPages) !== undefined :
              (pageData.hasPreviousPage ?? false);

            return {
              ...prev,
              pages: newPages,
              data: allData,
              isLoading: false,
              isFetching: false,
              isFetchingNextPage: false,
              isFetchingPreviousPage: false,
              isSuccess: true,
              isStale: false,
              hasNextPage: hasNext,
              hasPreviousPage: hasPrevious,
              lastUpdated: cachedEntry.timestamp
            };
          });

          onSuccess?.(state.data, state.pages);
          return;
        }
      }

      // Fetch new data
      const result = await fetcher(pageParam);

      const pageData = {
        data: result.data.map(item => select ? select(item) : item),
        pageParam,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage ?? false,
        isFetchingNextPage: false,
        isFetchingPreviousPage: false
      };

      // Cache the page
      cache.set(pageCacheKey, pageData, cacheTime);

      setState(prev => {
        let newPages;

        if (isFetchingNext) {
          newPages = [...prev.pages, pageData];
        } else if (isFetchingPrevious) {
          newPages = [pageData, ...prev.pages];
        } else {
          newPages = [pageData];
        }

        // Limit pages to maxPages
        if (newPages.length > maxPages) {
          if (isFetchingNext) {
            newPages = newPages.slice(-maxPages);
          } else {
            newPages = newPages.slice(0, maxPages);
          }
        }

        const allData = newPages.flatMap(page => page.data);
        const hasNext = getNextPageParam ?
          getNextPageParam(pageData, newPages) !== undefined :
          pageData.hasNextPage;
        const hasPrevious = getPreviousPageParam ?
          getPreviousPageParam(pageData, newPages) !== undefined :
          pageData.hasPreviousPage;

        return {
          ...prev,
          pages: newPages,
          data: allData,
          isLoading: false,
          isFetching: false,
          isFetchingNextPage: false,
          isFetchingPreviousPage: false,
          isSuccess: true,
          isStale: false,
          hasNextPage: hasNext,
          hasPreviousPage: hasPrevious,
          lastUpdated: Date.now()
        };
      });

      retryCountRef.current = 0;
      onSuccess?.(state.data, state.pages);
      onSettled?.(state.data, null);

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');

      // Retry logic
      if (retryCountRef.current < retry && !abortControllerRef.current?.signal.aborted) {
        retryCountRef.current++;
        const delay = retryDelay * Math.pow(2, retryCountRef.current - 1); // Exponential backoff

        setTimeout(() => {
          if (!abortControllerRef.current?.signal.aborted) {
            executeQuery(pageParam, isRefetch, isFetchingNext, isFetchingPrevious);
          }
        }, delay);

        return;
      }

      setState(prev => ({
        ...prev,
        error: err,
        isError: true,
        isLoading: false,
        isFetching: false,
        isFetchingNextPage: false,
        isFetchingPreviousPage: false
      }));

      onError?.(err);
      onSettled?.(undefined, err);
    }
  }, [cache, cacheKey, fetcher, staleTime, cacheTime, select, getNextPageParam, getPreviousPageParam, maxPages, retry, retryDelay, onSuccess, onError, onSettled]);

  // Initial fetch
  useEffect(() => {
    if (!enabled) return;

    abortControllerRef.current = new AbortController();
    executeQuery(initialPageParam, false, false, false);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, cacheKey, initialPageParam, executeQuery]);

  // Refetch on mount
  useEffect(() => {
    if (enabled && refetchOnMount && state.pages.length > 0) {
      executeQuery(initialPageParam, true);
    }
  }, [enabled, refetchOnMount, initialPageParam, executeQuery]);

  // Refetch on window focus
  useEffect(() => {
    if (!enabled || !refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (state.pages.length > 0) {
        executeQuery(initialPageParam, true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [enabled, refetchOnWindowFocus, initialPageParam, executeQuery]);

  // Refetch interval
  useEffect(() => {
    if (!enabled || !refetchInterval) return;

    refetchIntervalRef.current = setInterval(() => {
      executeQuery(initialPageParam, true);
    }, refetchInterval);

    return () => {
      if (refetchIntervalRef.current) {
        clearInterval(refetchIntervalRef.current);
      }
    };
  }, [enabled, refetchInterval, initialPageParam, executeQuery]);

  // Check if data is stale
  useEffect(() => {
    if (state.lastUpdated) {
      const age = Date.now() - state.lastUpdated;
      setState(prev => ({ ...prev, isStale: age > staleTime }));
    }
  }, [state.lastUpdated, staleTime]);

  // Refetch function
  const refetch = useCallback(async () => {
    if (state.pages.length > 0) {
      await executeQuery(initialPageParam, true);
    }
  }, [initialPageParam, executeQuery]);

  // Fetch next page
  const fetchNextPage = useCallback(async () => {
    if (state.hasNextPage && !state.isFetchingNextPage) {
      const lastPage = state.pages[state.pages.length - 1];
      const nextPageParam = getNextPageParam ?
        getNextPageParam(lastPage, state.pages) :
        lastPage.pageParam + 1;

      if (nextPageParam !== undefined) {
        await executeQuery(nextPageParam, false, true, false);
      }
    }
  }, [state.hasNextPage, state.isFetchingNextPage, state.pages, getNextPageParam, executeQuery]);

  // Fetch previous page
  const fetchPreviousPage = useCallback(async () => {
    if (state.hasPreviousPage && !state.isFetchingPreviousPage) {
      const firstPage = state.pages[0];
      const prevPageParam = getPreviousPageParam ?
        getPreviousPageParam(firstPage, state.pages) :
        firstPage.pageParam - 1;

      if (prevPageParam !== undefined) {
        await executeQuery(prevPageParam, false, false, true);
      }
    }
  }, [state.hasPreviousPage, state.isFetchingPreviousPage, state.pages, getPreviousPageParam, executeQuery]);

  // Invalidate cache and refetch
  const invalidate = useCallback(() => {
    // Clear all page caches
    for (let i = 0; i < state.pages.length; i++) {
      cache.invalidate(`${cacheKey}:page:${state.pages[i].pageParam}`);
    }
    return executeQuery(initialPageParam, true);
  }, [cache, cacheKey, state.pages, initialPageParam, executeQuery]);

  // Set data manually
  const setData = useCallback((newData, pageIndex) => {
    if (pageIndex !== undefined && pageIndex < state.pages.length) {
      const updatedPages = [...state.pages];
      updatedPages[pageIndex] = {
        ...updatedPages[pageIndex],
        data: newData
      };

      const allData = updatedPages.flatMap(page => page.data);

      setState(prev => ({
        ...prev,
        pages: updatedPages,
        data: allData,
        lastUpdated: Date.now()
      }));
    } else {
      // Replace all data
      const newPage = {
        data: newData,
        pageParam: initialPageParam,
        hasNextPage: false,
        hasPreviousPage: false,
        isFetchingNextPage: false,
        isFetchingPreviousPage: false
      };

      cache.set(`${cacheKey}:page:${initialPageParam}`, newPage, cacheTime);

      setState(prev => ({
        ...prev,
        pages: [newPage],
        data: newData,
        isSuccess: true,
        isStale: false,
        lastUpdated: Date.now()
      }));
    }
  }, [cache, cacheKey, state.pages, initialPageParam, cacheTime]);

  return {
    data: state.data,
    pages: state.pages,
    isLoading: state.isLoading,
    isError: state.isError,
    isSuccess: state.isSuccess,
    error: state.error,
    isFetching: state.isFetching,
    isFetchingNextPage: state.isFetchingNextPage,
    isFetchingPreviousPage: state.isFetchingPreviousPage,
    hasNextPage: state.hasNextPage,
    hasPreviousPage: state.hasPreviousPage,
    isStale: state.isStale,
    lastUpdated: state.lastUpdated,
    refetch,
    fetchNextPage,
    fetchPreviousPage,
    invalidate,
    setData
  };
}
