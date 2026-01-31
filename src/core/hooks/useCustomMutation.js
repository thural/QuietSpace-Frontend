import { useState, useCallback, useRef } from 'react';
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
 * Enterprise-grade mutation options interface
 * @typedef {Object} MutationOptions
 * @property {Function} [onSuccess] - Callback on successful mutation
 * @property {Function} [onError] - Callback on mutation error
 * @property {Function} [onSettled] - Callback on mutation completion
 * @property {Function} [onMutate] - Callback before mutation execution
 * @property {number} [retry] - Number of retry attempts on failure
 * @property {number} [retryDelay] - Delay between retry attempts
 * @property {Array<string>} [invalidateQueries] - Queries to invalidate on success
 * @property {Function} [cacheUpdate] - Function to update cache on success
 * @property {Function} [optimisticUpdate] - Function for optimistic updates
 */

/**
 * Mutation state interface
 * @typedef {Object} MutationState
 * @property {*} data - The mutation data
 * @property {boolean} isLoading - Whether the mutation is currently loading
 * @property {boolean} isError - Whether the mutation has an error
 * @property {boolean} isSuccess - Whether the mutation was successful
 * @property {Error|null} error - The mutation error if any
 * @property {boolean} isIdle - Whether the mutation is idle
 */

/**
 * Custom mutation hook result interface
 * @typedef {Object} CustomMutationResult
 * @property {*} data - The mutation data
 * @property {boolean} isLoading - Whether the mutation is currently loading
 * @property {boolean} isError - Whether the mutation has an error
 * @property {boolean} isSuccess - Whether the mutation was successful
 * @property {Error|null} error - The mutation error if any
 * @property {boolean} isIdle - Whether the mutation is idle
 * @property {Function} mutate - Function to execute the mutation
 * @property {Function} mutateAsync - Async function to execute the mutation
 * @property {Function} reset - Function to reset the mutation state
 */

/**
 * Enterprise-grade custom mutation hook
 * 
 * Replaces React Query's useMutation with custom implementation
 * that integrates with our ICacheProvider and DI container
 * 
 * @param {Function} fetcher - Function to execute the mutation
 * @param {MutationOptions} options - Mutation options
 * @returns {CustomMutationResult} Mutation result
 */
export function useCustomMutation(fetcher, options = {}) {
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
  const cache = container.getByToken(TYPES.CACHE_SERVICE);

  const [state, setState] = useState({
    data: undefined,
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
    isIdle: true
  });

  const retryCountRef = useRef(0);
  const abortControllerRef = useRef(null);
  const rollbackRef = useRef(null);

  // Execute the mutation with retry logic
  const executeMutation = useCallback(async (
    variables,
    isAsync = false
  ) => {
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
      let context;
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
      const err = error instanceof Error ? error : new Error('Unknown error');

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
  const mutate = useCallback((variables) => {
    executeMutation(variables, false).catch(() => {
      // Errors are handled in the executeMutation function
    });
  }, [executeMutation]);

  // MutateAsync function (returns promise, caller handles errors)
  const mutateAsync = useCallback((variables) => {
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
