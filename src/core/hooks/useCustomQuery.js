import { useState, useEffect, useCallback, useRef } from 'react';
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
 * Enterprise-grade query options interface
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
 * @property {*} [initialData] - Initial data to use while loading
 * @property {*} [placeholderData] - Placeholder data to use while loading
 */

/**
 * Query state interface
 * @typedef {Object} QueryState
 * @property {*} data - The query data
 * @property {boolean} isLoading - Whether the query is currently loading
 * @property {boolean} isError - Whether the query has an error
 * @property {boolean} isSuccess - Whether the query was successful
 * @property {Error|null} error - The query error if any
 * @property {boolean} isFetching - Whether the query is currently fetching
 * @property {boolean} isRefetching - Whether the query is currently refetching
 * @property {boolean} isStale - Whether the data is stale
 * @property {number|null} lastUpdated - Timestamp of last update
 */

/**
 * Custom query hook result interface
 * @typedef {Object} CustomQueryResult
 * @property {*} data - The query data
 * @property {boolean} isLoading - Whether the query is currently loading
 * @property {boolean} isError - Whether the query has an error
 * @property {boolean} isSuccess - Whether the query was successful
 * @property {Error|null} error - The query error if any
 * @property {boolean} isFetching - Whether the query is currently fetching
 * @property {boolean} isRefetching - Whether the query is currently refetching
 * @property {boolean} isStale - Whether the data is stale
 * @property {number|null} lastUpdated - Timestamp of last update
 * @property {Function} refetch - Function to refetch the query
 * @property {Function} invalidate - Function to invalidate the query cache
 * @property {Function} setData - Function to manually set query data
 */

/**
 * Enterprise-grade custom query hook
 * 
 * Replaces React Query's useQuery with custom implementation
 * that integrates with our ICacheProvider and DI container
 * 
 * @param {string|Array<string>} key - Query key or array of keys
 * @param {Function} fetcher - Function to fetch data
 * @param {QueryOptions} options - Query options
 * @returns {CustomQueryResult} Query result
 */
export function useCustomQuery(key, fetcher, options = {}) {
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
    initialData,
    placeholderData
  } = options;

  const container = useDIContainer();
  const cache = container.getByToken(TYPES.CACHE_SERVICE);

  const cacheKey = Array.isArray(key) ? key.join(':') : key;

  const [state, setState] = useState({
    data: initialData,
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
    isFetching: false,
    isRefetching: false,
    isStale: true,
    lastUpdated: null
  });

  const retryCountRef = useRef(0);
  const abortControllerRef = useRef(null);
  const refetchIntervalRef = useRef(null);

  // Execute the query with retry logic
  const executeQuery = useCallback(async (
    isRefetch = false,
    signal
  ) => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: !isRefetch,
        isFetching: true,
        isRefetching: isRefetch,
        error: null,
        isError: false
      }));

      // Check cache first
      const cachedEntry = cache.getEntry(cacheKey);
      if (cachedEntry && !isRefetch) {
        const cacheAge = Date.now() - cachedEntry.timestamp;
        if (cacheAge < staleTime) {
          const data = select ? select(cachedEntry.data) : cachedEntry.data;
          setState(prev => ({
            ...prev,
            data: data,
            isLoading: false,
            isFetching: false,
            isSuccess: true,
            isStale: false,
            lastUpdated: cachedEntry.timestamp
          }));
          onSuccess?.(data);
          return data;
        }
      }

      // Fetch new data
      const data = await fetcher();

      // Cache the result
      cache.set(cacheKey, data, cacheTime);

      const finalData = select ? select(data) : data;

      setState(prev => ({
        ...prev,
        data: finalData,
        isLoading: false,
        isFetching: false,
        isRefetching: false,
        isSuccess: true,
        isStale: false,
        lastUpdated: Date.now()
      }));

      retryCountRef.current = 0;
      onSuccess?.(finalData);
      onSettled?.(finalData, null);

      return finalData;

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');

      // Retry logic
      if (retryCountRef.current < retry && !signal?.aborted) {
        retryCountRef.current++;
        const delay = retryDelay * Math.pow(2, retryCountRef.current - 1); // Exponential backoff

        setTimeout(() => {
          if (!signal?.aborted) {
            executeQuery(isRefetch, signal);
          }
        }, delay);

        return Promise.reject(err);
      }

      setState(prev => ({
        ...prev,
        error: err,
        isError: true,
        isLoading: false,
        isFetching: false,
        isRefetching: false
      }));

      onError?.(err);
      onSettled?.(undefined, err);

      return Promise.reject(err);
    }
  }, [cache, cacheKey, fetcher, staleTime, cacheTime, select, retry, retryDelay, onSuccess, onError, onSettled]);

  // Initial fetch
  useEffect(() => {
    if (!enabled) return;

    abortControllerRef.current = new AbortController();
    executeQuery(false, abortControllerRef.current.signal);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, cacheKey, executeQuery]);

  // Refetch on mount
  useEffect(() => {
    if (enabled && refetchOnMount && state.data !== undefined) {
      executeQuery(true);
    }
  }, [enabled, refetchOnMount, executeQuery]);

  // Refetch on window focus
  useEffect(() => {
    if (!enabled || !refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (state.data !== undefined) {
        executeQuery(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [enabled, refetchOnWindowFocus, executeQuery]);

  // Refetch interval
  useEffect(() => {
    if (!enabled || !refetchInterval) return;

    refetchIntervalRef.current = setInterval(() => {
      executeQuery(true);
    }, refetchInterval);

    return () => {
      if (refetchIntervalRef.current) {
        clearInterval(refetchIntervalRef.current);
      }
    };
  }, [enabled, refetchInterval, executeQuery]);

  // Check if data is stale
  useEffect(() => {
    if (state.lastUpdated) {
      const age = Date.now() - state.lastUpdated;
      setState(prev => ({ ...prev, isStale: age > staleTime }));
    }
  }, [state.lastUpdated, staleTime]);

  // Refetch function
  const refetch = useCallback(async () => {
    await executeQuery(true);
  }, [executeQuery]);

  // Invalidate cache and refetch
  const invalidate = useCallback(() => {
    cache.invalidate(cacheKey);
    return executeQuery(true);
  }, [cache, cacheKey, executeQuery]);

  // Set data manually
  const setData = useCallback((newData) => {
    const data = typeof newData === 'function'
      ? newData(state.data)
      : newData;

    cache.set(cacheKey, data, cacheTime);

    setState(prev => ({
      ...prev,
      data,
      isSuccess: true,
      isStale: false,
      lastUpdated: Date.now()
    }));
  }, [cache, cacheKey, cacheTime, state.data]);

  // Return placeholder data if loading and placeholder provided
  const finalData = state.isLoading && placeholderData !== undefined
    ? placeholderData
    : state.data;

  return {
    data: finalData,
    isLoading: state.isLoading,
    isError: state.isError,
    isSuccess: state.isSuccess,
    error: state.error,
    isFetching: state.isFetching,
    isRefetching: state.isRefetching,
    isStale: state.isStale,
    lastUpdated: state.lastUpdated,
    refetch,
    invalidate,
    setData
  };
}
