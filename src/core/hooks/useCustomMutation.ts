import { useState, useCallback, useRef } from 'react';
import { useDIContainer } from '@/core/di';
import { TYPES } from '@/core/di/types';
import type { ICacheProvider } from '@/core/cache';

/**
 * Enterprise-grade mutation options interface
 */
export interface MutationOptions<TData = any, TError = Error, TVariables = any> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
  onMutate?: (variables: TVariables) => Promise<any> | any;
  retry?: number;
  retryDelay?: number;
  invalidateQueries?: string[];
  cacheUpdate?: (cache: ICacheProvider, data: TData, variables: TVariables) => void;
  optimisticUpdate?: (cache: ICacheProvider, variables: TVariables) => (() => void) | void;
}

/**
 * Mutation state interface
 */
export interface MutationState<TData = any, TError = Error> {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: TError | null;
  isIdle: boolean;
}

/**
 * Custom mutation hook result interface
 */
export interface CustomMutationResult<TData = any, TError = Error, TVariables = any> extends MutationState<TData, TError> {
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

/**
 * Enterprise-grade custom mutation hook
 * 
 * Replaces React Query's useMutation with custom implementation
 * that integrates with our ICacheProvider and DI container
 */
export function useCustomMutation<TData = any, TError = Error, TVariables = any>(
  fetcher: (variables: TVariables) => Promise<TData>,
  options: MutationOptions<TData, TError, TVariables> = {}
): CustomMutationResult<TData, TError, TVariables> {
  const {
    onSuccess,
    onError,
    onSettled,
    onMutate,
    retry = 1,
    retryDelay = 1000,
    invalidateQueries = [],
    cacheUpdate,
    optimisticUpdate
  } = options;

  const container = useDIContainer();
  const cache = container.getByToken<ICacheProvider>(TYPES.CACHE_SERVICE);

  const [state, setState] = useState<MutationState<TData, TError>>({
    data: undefined,
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
    isIdle: true
  });

  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const rollbackRef = useRef<(() => void) | null>(null);

  // Execute the mutation with retry logic
  const executeMutation = useCallback(async (
    variables: TVariables,
    isAsync = false
  ): Promise<TData> => {
    try {
      // Cancel previous mutation if running
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      retryCountRef.current = 0;

      setState(prev => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
        isIdle: false
      }));

      // Run onMutate if provided
      let context: any;
      if (onMutate) {
        context = await onMutate(variables);
      }

      // Optimistic update if provided
      if (optimisticUpdate) {
        const rollback = optimisticUpdate(cache, variables);
        if (rollback) {
          rollbackRef.current = rollback;
        }
      }

      // Execute the mutation
      const data = await fetcher(variables);

      // Update cache if cacheUpdate provided
      if (cacheUpdate) {
        cacheUpdate(cache, data, variables);
      }

      // Invalidate specified queries
      invalidateQueries.forEach(queryKey => {
        cache.invalidate(queryKey);
      });

      setState(prev => ({
        ...prev,
        data,
        isLoading: false,
        isSuccess: true
      }));

      retryCountRef.current = 0;
      onSuccess?.(data, variables);
      onSettled?.(data, null, variables);

      return data;

    } catch (error) {
      const err = error instanceof Error ? error as TError : new Error('Unknown error') as TError;

      // Rollback optimistic update if it failed
      if (rollbackRef.current) {
        rollbackRef.current();
        rollbackRef.current = null;
      }

      // Retry logic
      if (retryCountRef.current < retry && !abortControllerRef.current?.signal.aborted) {
        retryCountRef.current++;
        const delay = retryDelay * Math.pow(2, retryCountRef.current - 1); // Exponential backoff

        if (!isAsync) {
          setTimeout(() => {
            executeMutation(variables, isAsync);
          }, delay);
        }

        return Promise.reject(err);
      }

      setState(prev => ({
        ...prev,
        error: err,
        isError: true,
        isLoading: false
      }));

      onError?.(err, variables);
      onSettled?.(undefined, err, variables);

      return Promise.reject(err);
    }
  }, [fetcher, cache, retry, retryDelay, invalidateQueries, cacheUpdate, optimisticUpdate, onMutate, onSuccess, onError, onSettled]);

  // Mutate function (void return, handles errors internally)
  const mutate = useCallback((variables: TVariables) => {
    executeMutation(variables, false).catch(() => {
      // Errors are handled in the executeMutation function
    });
  }, [executeMutation]);

  // MutateAsync function (returns promise, caller handles errors)
  const mutateAsync = useCallback((variables: TVariables): Promise<TData> => {
    return executeMutation(variables, true);
  }, [executeMutation]);

  // Reset function
  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (rollbackRef.current) {
      rollbackRef.current();
      rollbackRef.current = null;
    }
    retryCountRef.current = 0;

    setState({
      data: undefined,
      isLoading: false,
      isError: false,
      isSuccess: false,
      error: null,
      isIdle: true
    });
  }, []);

  return {
    data: state.data,
    isLoading: state.isLoading,
    isError: state.isError,
    isSuccess: state.isSuccess,
    error: state.error,
    isIdle: state.isIdle,
    mutate,
    mutateAsync,
    reset
  };
}
