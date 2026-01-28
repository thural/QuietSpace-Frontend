/**
 * Data Service Module - React Hooks
 * 
 * Provides React hooks for data fetching with automatic state management,
 * caching, error handling, and optimistic updates.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Configuration options for useQuery hook
 */
export interface UseQueryOptions<TData, TError> {
  /**
   * Whether to automatically refetch on window focus
   */
  refetchOnWindowFocus?: boolean;
  
  /**
   * Whether to automatically refetch on network reconnect
   */
  refetchOnReconnect?: boolean;
  
  /**
   * Whether to automatically refetch at intervals
   */
  refetchInterval?: number | false;
  
  /**
   * Number of retry attempts on failure
   */
  retry?: number | false;
  
  /**
   * Retry delay in milliseconds
   */
  retryDelay?: number;
  
  /**
   * Whether to enable request cancellation
   */
  enableRequestCancellation?: boolean;
  
  /**
   * Initial data to use before first fetch
   */
  initialData?: TData;
  
  /**
   * Stale time in milliseconds
   */
  staleTime?: number;
  
  /**
   * Cache time in milliseconds
   */
  cacheTime?: number;
}

/**
 * Return type for useQuery hook
 */
export interface UseQueryResult<TData, TError> {
  /**
   * Whether data is currently being loaded
   */
  isLoading: boolean;
  
  /**
   * Whether data is currently being fetched
   */
  isFetching: boolean;
  
  /**
   * Whether there was an error
   */
  isError: boolean;
  
  /**
   * Whether data was successfully loaded
   */
  isSuccess: boolean;
  
  /**
   * Error information
   */
  error: TError | null;
  
  /**
   * Timestamp of the last data update
   */
  lastUpdated: number | null;
  
  /**
   * Number of times the data has been refetched
   */
  refetchCount: number;
  
  /**
   * The fetched data
   */
  data: TData | null;
  
  /**
   * Function to manually refetch data
   */
  refetch: () => Promise<TData>;
  
  /**
   * Function to invalidate cache
   */
  invalidate: () => void;
}

/**
 * Configuration options for useMutation hook
 */
export interface UseMutationOptions<TData, TVariables, TError> {
  /**
   * Function called when mutation is successful
   */
  onSuccess?: (data: TData, variables: TVariables) => void;
  
  /**
   * Function called when mutation fails
   */
  onError?: (error: TError, variables: TVariables) => void;
  
  /**
   * Function called when mutation settles (success or error)
   */
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
  
  /**
   * Whether to retry on failure
   */
  retry?: number | false;
  
  /**
   * Retry delay in milliseconds
   */
  retryDelay?: number;
}

/**
 * Return type for useMutation hook
 */
export interface UseMutationResult<TData, TVariables, TError> {
  /**
   * Whether mutation is currently being loaded
   */
  isLoading: boolean;
  
  /**
   * Whether mutation is currently being executed
   */
  isFetching: boolean;
  
  /**
   * Whether there was an error
   */
  isError: boolean;
  
  /**
   * Whether mutation was successful
   */
  isSuccess: boolean;
  
  /**
   * Error information
   */
  error: TError | null;
  
  /**
   * Timestamp of the last mutation
   */
  lastUpdated: number | null;
  
  /**
   * Number of times the mutation was attempted
   */
  refetchCount: number;
  
  /**
   * The mutation result data
   */
  data: TData | null;
  
  /**
   * Function to trigger the mutation
   */
  mutate: (variables: TVariables) => Promise<TData>;
  
  /**
   * Function to reset the mutation state
   */
  reset: () => void;
}

/**
 * Return type for useInfiniteQuery hook
 */
export interface UseInfiniteQueryResult<TData, TError> {
  /**
   * Whether data is currently being loaded
   */
  isLoading: boolean;
  
  /**
   * Whether data is currently being fetched
   */
  isFetching: boolean;
  
  /**
   * Whether there was an error
   */
  isError: boolean;
  
  /**
   * Whether data was successfully loaded
   */
  isSuccess: boolean;
  
  /**
   * Error information
   */
  error: TError | null;
  
  /**
   * Timestamp of the last data update
   */
  lastUpdated: number | null;
  
  /**
   * Number of times the data has been refetched
   */
  refetchCount: number;
  
  /**
   * The fetched data array
   */
  data: TData[];
  
  /**
   * Whether there's more data to fetch
   */
  hasNextPage: boolean;
  
  /**
   * Whether currently fetching next page
   */
  isFetchingNextPage: boolean;
  
  /**
   * Function to fetch next page
   */
  fetchNextPage: () => Promise<void>;
  
  /**
   * Function to refetch all pages
   */
  refetch: () => Promise<void>;
}

/**
 * Internal state interface for hooks
 */
interface HookState<TData, TError> {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: TError | null;
  lastUpdated: number | null;
  refetchCount: number;
  data: TData | null;
  metadata: {
    source: 'network' | 'cache' | 'websocket';
    cacheHit: boolean;
    requestDuration: number;
    retryCount: number;
  };
}

/**
 * React hook for data fetching with automatic state management
 */
export function useQuery<TData, TError = Error>(
  key: string | string[],
  fetcher: () => Promise<TData>,
  options: UseQueryOptions<TData, TError> = {}
): UseQueryResult<TData, TError> {
  const [state, setState] = useState<HookState<TData, TError>>({
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

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refetchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const executeQuery = useCallback(async (isRefetch = false): Promise<TData> => {
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

    const attemptFetch = async (): Promise<TData> => {
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
          const errorObj = error as TError;
          
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
 */
export function useMutation<TData, TVariables = void, TError = Error>(
  mutator: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables, TError> = {}
): UseMutationResult<TData, TVariables, TError> {
  const [state, setState] = useState<HookState<TData, TError>>({
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

  const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
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

    const attemptMutation = async (): Promise<TData> => {
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
          const errorObj = error as TError;
          
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
 */
export function useInfiniteQuery<TData, TError = Error>(
  key: string | string[],
  fetcher: (pageParam: any) => Promise<{
    data: TData[];
    nextPage?: any;
    hasMore?: boolean;
  }>,
  options: UseQueryOptions<TData[], TError> = {}
): UseInfiniteQueryResult<TData, TError> {
  const [state, setState] = useState<HookState<TData[], TError>>({
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

  const [pageParam, setPageParam] = useState<any>(undefined);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const executeQuery = useCallback(async (isRefetch = false): Promise<void> => {
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
      const errorObj = error as TError;
      
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
