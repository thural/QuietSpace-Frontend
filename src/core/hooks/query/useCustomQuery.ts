import { useState, useEffect, useCallback, useRef } from 'react';

import type { ICacheProvider } from '@/core/cache';

import { useDIContainer } from '@/core/modules/dependency-injection';
import { TYPES } from '@/core/modules/dependency-injection/types';

/**
 * Enterprise-grade query options interface
 */
export interface QueryOptions<T = unknown> {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchInterval?: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: T | undefined, error: Error | null) => void;
  select?: (data: unknown) => T;
  initialData?: T;
  placeholderData?: T;
}

/**
 * Query state interface
 */
export interface QueryState<T = unknown> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
  isFetching: boolean;
  isRefetching: boolean;
  isStale: boolean;
  lastUpdated: number | null;
}

/**
 * Custom query hook result interface
 */
export interface CustomQueryResult<T = unknown> extends QueryState<T> {
  refetch: () => Promise<void>;
  invalidate: () => void;
  setData: (data: T | ((old: T | undefined) => T)) => void;
}

/**
 * Enterprise-grade custom query hook
 *
 * Replaces React Query's useQuery with custom implementation
 * that integrates with our ICacheProvider and DI container
 */
export function useCustomQuery<T>(
  key: string | string[],
  fetcher: () => Promise<T>,
  options: QueryOptions<T> = {}
): CustomQueryResult<T> {
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
  const cache = container.getByToken<ICacheProvider>(TYPES.CACHE_SERVICE);

  const cacheKey = Array.isArray(key) ? key.join(':') : key;

  const [state, setState] = useState<QueryState<T>>({
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const refetchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Execute the query with retry logic
  const executeQuery = useCallback(async (
    isRefetch = false,
    signal?: AbortSignal
  ): Promise<T> => {
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
          const data = select ? select(cachedEntry.data) : cachedEntry.data as T;
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
  const refetch = useCallback(async (): Promise<void> => {
    await executeQuery(true);
  }, [executeQuery]);

  // Invalidate cache and refetch
  const invalidate = useCallback(() => {
    cache.invalidate(cacheKey);
    return executeQuery(true);
  }, [cache, cacheKey, executeQuery]);

  // Set data manually
  const setData = useCallback((newData: T | ((old: T | undefined) => T)) => {
    const data = typeof newData === 'function'
      ? (newData as Function)(state.data)
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
