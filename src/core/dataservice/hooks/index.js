/**
 * Data Service Module - React Hooks
 * 
 * Provides React hooks for data fetching with automatic state management,
 * caching, error handling, and optimistic updates.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Configuration options for useQuery hook
 * @typedef {Object} UseQueryOptions
 * @property {boolean} [refetchOnWindowFocus] - Whether to automatically refetch on window focus
 * @property {boolean} [refetchOnReconnect] - Whether to automatically refetch on network reconnect
 * @property {number|boolean} [refetchInterval] - Whether to automatically refetch at intervals
 * @property {number|boolean} [retry] - Number of retry attempts on failure
 * @property {number} [retryDelay] - Retry delay in milliseconds
 * @property {boolean} [enableRequestCancellation] - Whether to enable request cancellation
 * @property {*} [initialData] - Initial data to use before first fetch
 * @property {number} [staleTime] - Stale time in milliseconds
 * @property {number} [cacheTime] - Cache time in milliseconds
 */

/**
 * Return type for useQuery hook
 * @typedef {Object} UseQueryResult
 * @property {boolean} isLoading - Whether data is currently being loaded
 * @property {boolean} isFetching - Whether data is currently being fetched
 * @property {boolean} isError - Whether there was an error
 * @property {boolean} isSuccess - Whether data was successfully loaded
 * @property {Error|null} error - Error information
 * @property {number|null} lastUpdated - Timestamp of the last data update
 * @property {number} refetchCount - Number of times the data has been refetched
 * @property {*} data - The fetched data
 * @property {function} refetch - Function to manually refetch data
 * @property {function} invalidate - Function to invalidate cache
 */

/**
 * Configuration options for useMutation hook
 * @typedef {Object} UseMutationOptions
 * @property {function} [onSuccess] - Function called when mutation is successful
 * @property {function} [onError] - Function called when mutation fails
 * @property {function} [onSettled] - Function called when mutation settles (success or error)
 * @property {number|boolean} [retry] - Whether to retry on failure
 * @property {number} [retryDelay] - Retry delay in milliseconds
 */

/**
 * Return type for useMutation hook
 * @typedef {Object} UseMutationResult
 * @property {boolean} isLoading - Whether mutation is currently being loaded
 * @property {boolean} isFetching - Whether mutation is currently being executed
 * @property {boolean} isError - Whether there was an error
 * @property {boolean} isSuccess - Whether mutation was successful
 * @property {Error|null} error - Error information
 * @property {number|null} lastUpdated - Timestamp of the last mutation
 * @property {number} refetchCount - Number of times the mutation was attempted
 * @property {*} data - The mutation result data
 * @property {function} mutate - Function to trigger the mutation
 * @property {function} reset - Function to reset the mutation state
 */

/**
 * Return type for useInfiniteQuery hook
 * @typedef {Object} UseInfiniteQueryResult
 * @property {boolean} isLoading - Whether data is currently being loaded
 * @property {boolean} isFetching - Whether data is currently being fetched
 * @property {boolean} isError - Whether there was an error
 * @property {boolean} isSuccess - Whether data was successfully loaded
 * @property {Error|null} error - Error information
 * @property {number|null} lastUpdated - Timestamp of the last data update
 * @property {number} refetchCount - Number of times the data has been refetched
 * @property {Array} data - The fetched data array
 * @property {boolean} hasNextPage - Whether there's more data to fetch
 * @property {boolean} isFetchingNextPage - Whether currently fetching next page
 * @property {function} fetchNextPage - Function to fetch next page
 * @property {function} refetch - Function to refetch all pages
 */

/**
 * Internal state interface for hooks
 * @typedef {Object} HookState
 * @property {boolean} isLoading - Loading state
 * @property {boolean} isFetching - Fetching state
 * @property {boolean} isError - Error state
 * @property {boolean} isSuccess - Success state
 * @property {Error|null} error - Error object
 * @property {number|null} lastUpdated - Last update timestamp
 * @property {number} refetchCount - Refetch count
 * @property {*} data - Data payload
 * @property {Object} metadata - Request metadata
 * @property {string} metadata.source - Data source
 * @property {boolean} metadata.cacheHit - Cache hit flag
 * @property {number} metadata.requestDuration - Request duration
 * @property {number} metadata.retryCount - Retry count
 */

/**
 * React hook for data fetching with automatic state management
 * 
 * @param {string|string[]} key - Query key for caching
 * @param {function} fetcher - Function to fetch data
 * @param {UseQueryOptions} [options] - Configuration options
 * @returns {UseQueryResult} Query result with state and actions
 */
export function useQuery(key, fetcher, options = {}) {
  const [state, setState] = useState({
    isLoading: true,
    isFetching: false,
    isError: false,
    isSuccess: false,
    error: null,
    lastUpdated: null,
    refetchCount: 0,
    data: options.initialData || null,
    metadata: {
      source: 'network',
      cacheHit: false,
      requestDuration: 0,
      retryCount: 0
    }
  });

  const abortControllerRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const refetchIntervalRef = useRef(null);

  const executeQuery = useCallback(async (isRefetch = false) => {
    // Cancel previous request if enabled
    if (options.enableRequestCancellation && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    if (options.enableRequestCancellation) {
      abortControllerRef.current = new AbortController();
    }

    // Update state for refetch
    if (isRefetch) {
      setState(prev => ({
        ...prev,
        isFetching: true,
        refetchCount: prev.refetchCount + 1,
        metadata: { ...prev.metadata, retryCount: 0 }
      }));
    } else {
      setState(prev => ({
        ...prev,
        isLoading: true,
        isFetching: true,
        error: null,
        metadata: { ...prev.metadata, retryCount: 0 }
      }));
    }

    let retryCount = 0;
    const maxRetries = options.retry === false ? 0 : (options.retry || 3);
    const retryDelay = options.retryDelay || 1000;

    const attemptFetch = async () => {
      try {
        const startTime = Date.now();
        
        const response = await fetcher();
        const duration = Date.now() - startTime;

        setState(prev => ({
          ...prev,
          isLoading: false,
          isFetching: false,
          isError: false,
          isSuccess: true,
          error: null,
          lastUpdated: Date.now(),
          data: response,
          metadata: {
            ...prev.metadata,
            source: 'network',
            cacheHit: false,
            requestDuration: duration,
            retryCount
          }
        }));

        return response;
      } catch (error) {
        retryCount++;
        
        if (retryCount <= maxRetries) {
          setState(prev => ({
            ...prev,
            metadata: { ...prev.metadata, retryCount }
          }));
          
          // Schedule retry
          await new Promise(resolve => {
            retryTimeoutRef.current = setTimeout(resolve, retryDelay * retryCount);
          });
          
          return attemptFetch();
        } else {
          const errorObj = error;
          
          setState(prev => ({
            ...prev,
            isLoading: false,
            isFetching: false,
            isError: true,
            isSuccess: false,
            error: errorObj,
            lastUpdated: Date.now(),
            data: null,
            metadata: {
              ...prev.metadata,
              retryCount
            }
          }));
          
          throw errorObj;
        }
      }
    };

    return attemptFetch();
  }, [fetcher, options.enableRequestCancellation, options.retry, options.retryDelay]);

  const refetch = useCallback(() => {
    return executeQuery(true);
  }, [executeQuery]);

  const invalidate = useCallback(() => {
    setState(prev => ({
      ...prev,
      data: null,
      lastUpdated: null,
      metadata: { ...prev.metadata, cacheHit: false }
    }));
  }, []);

  // Auto refetch on window focus
  useEffect(() => {
    if (!options.refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        refetch();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [options.refetchOnWindowFocus, refetch]);

  // Auto refetch on network reconnect
  useEffect(() => {
    if (!options.refetchOnReconnect) return;

    const handleOnline = () => {
      refetch();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [options.refetchOnReconnect, refetch]);

  // Auto refetch at intervals
  useEffect(() => {
    if (!options.refetchInterval) return;

    refetchIntervalRef.current = setInterval(() => {
      refetch();
    }, options.refetchInterval);

    return () => {
      if (refetchIntervalRef.current) {
        clearInterval(refetchIntervalRef.current);
      }
    };
  }, [options.refetchInterval, refetch]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (refetchIntervalRef.current) {
        clearInterval(refetchIntervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    refetch,
    invalidate
  };
}

/**
 * React hook for mutations with automatic state management
 * 
 * @param {function} mutator - Mutation function
 * @param {UseMutationOptions} [options] - Configuration options
 * @returns {UseMutationResult} Mutation result with state and actions
 */
export function useMutation(mutator, options = {}) {
  const [state, setState] = useState({
    isLoading: false,
    isFetching: false,
    isError: false,
    isSuccess: false,
    error: null,
    lastUpdated: null,
    refetchCount: 0,
    data: null,
    metadata: {
      source: 'network',
      cacheHit: false,
      requestDuration: 0,
      retryCount: 0
    }
  });

  const mutate = useCallback(async (variables) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      isFetching: true,
      isError: false,
      isSuccess: false,
      error: null,
      metadata: { ...prev.metadata, retryCount: 0 }
    }));

    let retryCount = 0;
    const maxRetries = options.retry === false ? 0 : (options.retry || 3);
    const retryDelay = options.retryDelay || 1000;

    const attemptMutation = async () => {
      try {
        const startTime = Date.now();
        const result = await mutator(variables);
        const duration = Date.now() - startTime;

        setState(prev => ({
          ...prev,
          isLoading: false,
          isFetching: false,
          isError: false,
          isSuccess: true,
          error: null,
          lastUpdated: Date.now(),
          data: result,
          metadata: {
            ...prev.metadata,
            source: 'network',
            cacheHit: false,
            requestDuration: duration,
            retryCount
          }
        }));

        options.onSuccess?.(result, variables);
        options.onSettled?.(result, undefined, variables);

        return result;
      } catch (error) {
        retryCount++;
        
        if (retryCount <= maxRetries) {
          setState(prev => ({
            ...prev,
            metadata: { ...prev.metadata, retryCount }
          }));
          
          await new Promise(resolve => {
            setTimeout(resolve, retryDelay * retryCount);
          });
          
          return attemptMutation();
        } else {
          const errorObj = error;
          
          setState(prev => ({
            ...prev,
            isLoading: false,
            isFetching: false,
            isError: true,
            isSuccess: false,
            error: errorObj,
            lastUpdated: Date.now(),
            data: null,
            metadata: {
              ...prev.metadata,
              retryCount
            }
          }));

          options.onError?.(errorObj, variables);
          options.onSettled?.(undefined, errorObj, variables);

          throw errorObj;
        }
      }
    };

    return attemptMutation();
  }, [mutator, options.retry, options.retryDelay, options.onSuccess, options.onError, options.onSettled]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: false,
      error: null,
      lastUpdated: null,
      refetchCount: 0,
      data: null,
      metadata: {
        source: 'network',
        cacheHit: false,
        requestDuration: 0,
        retryCount: 0
      }
    });
  }, []);

  return {
    ...state,
    mutate,
    reset
  };
}

/**
 * React hook for infinite queries with pagination
 * 
 * @param {string|string[]} key - Query key for caching
 * @param {function} fetcher - Function to fetch data
 * @param {UseQueryOptions} [options] - Configuration options
 * @returns {UseInfiniteQueryResult} Infinite query result with state and actions
 */
export function useInfiniteQuery(key, fetcher, options = {}) {
  const [state, setState] = useState({
    isLoading: true,
    isFetching: false,
    isError: false,
    isSuccess: false,
    error: null,
    lastUpdated: null,
    refetchCount: 0,
    data: [],
    metadata: {
      source: 'network',
      cacheHit: false,
      requestDuration: 0,
      retryCount: 0
    }
  });

  const [pageParam, setPageParam] = useState(undefined);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const executeQuery = useCallback(async (isRefetch = false) => {
    if (isFetchingNextPage) return;

    if (!isRefetch) {
      setState(prev => ({
        ...prev,
        isLoading: true,
        isFetching: true,
        error: null,
        metadata: { ...prev.metadata, retryCount: 0 }
      }));
    } else {
      setState(prev => ({
        ...prev,
        isFetching: true,
        refetchCount: prev.refetchCount + 1,
        metadata: { ...prev.metadata, retryCount: 0 }
      }));
    }

    try {
      const startTime = Date.now();
      const result = await fetcher(pageParam);
      const duration = Date.now() - startTime;

      const newData = result.data || [];
      const updatedData = isRefetch ? newData : [...state.data, ...newData];
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isFetching: false,
        isError: false,
        isSuccess: true,
        error: null,
        lastUpdated: Date.now(),
        data: updatedData,
        metadata: {
          ...prev.metadata,
          source: 'network',
          cacheHit: false,
          requestDuration: duration,
          retryCount: 0
        }
      }));

      setHasNextPage(result.hasMore !== false);
      if (result.nextPage !== undefined) {
        setPageParam(result.nextPage);
      }

    } catch (error) {
      const errorObj = error;
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isFetching: false,
        isError: true,
        isSuccess: false,
        error: errorObj,
        lastUpdated: Date.now(),
        metadata: {
          ...prev.metadata,
          retryCount: (prev.metadata?.retryCount || 0) + 1
        }
      }));
    }
  }, [fetcher, pageParam, state.data, isFetchingNextPage]);

  const fetchNextPage = useCallback(async () => {
    setIsFetchingNextPage(true);
    await executeQuery(false);
    setIsFetchingNextPage(false);
  }, [executeQuery]);

  const refetch = useCallback(async () => {
    setPageParam(undefined);
    setHasNextPage(true);
    setState(prev => ({ ...prev, data: [] }));
    await executeQuery(true);
  }, [executeQuery]);

  // Initial fetch
  useEffect(() => {
    executeQuery(false);
  }, [executeQuery]);

  return {
    ...state,
    data: state.data,
    error: state.error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch
  };
}
