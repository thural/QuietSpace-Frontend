import { useState, useCallback } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

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

/**
 * Query state interface
 * @typedef {Object} QueryState
 * @property {boolean} isLoading - Whether the query is currently loading
 * @property {boolean} isFetching - Whether the query is currently fetching
 * @property {boolean} isError - Whether the query has an error
 * @property {number|null} lastUpdated - Timestamp of last update
 */

/**
 * Mutation state interface
 * @typedef {Object} MutationState
 * @property {boolean} isLoading - Whether the mutation is currently loading
 * @property {boolean} isIdle - Whether the mutation is idle
 */

/**
 * Global query state store using Zustand
 */
export const useQueryStateStore = create()(
  subscribeWithSelector((set, get) => ({
    queries: {},
    mutations: {},

    setQueryState: (key, newState) => {
      set((state) => ({
        queries: {
          ...state.queries,
          [key]: {
            ...state.queries[key],
            ...newState
          }
        }
      }));
    },

    setMutationState: (key, newState) => {
      set((state) => ({
        mutations: {
          ...state.mutations,
          [key]: {
            ...state.mutations[key],
            ...newState
          }
        }
      }));
    },

    clearQueryState: (key) => {
      set((state) => {
        const newQueries = { ...state.queries };
        delete newQueries[key];
        return { queries: newQueries };
      });
    },

    clearMutationState: (key) => {
      set((state) => {
        const newMutations = { ...state.mutations };
        delete newMutations[key];
        return { mutations: newMutations };
      });
    },

    resetAll: () => {
      set({ queries: {}, mutations: {} });
    },

    getGlobalLoadingState: () => {
      const { queries, mutations } = get();
      const hasLoadingQueries = Object.values(queries).some(q => q.isLoading || q.isFetching);
      const hasLoadingMutations = Object.values(mutations).some(m => m.isLoading);
      return hasLoadingQueries || hasLoadingMutations;
    },

    getQueryLoadingCount: () => {
      const { queries } = get();
      return Object.values(queries).filter(q => q.isLoading || q.isFetching).length;
    },

    getMutationLoadingCount: () => {
      const { mutations } = get();
      return Object.values(mutations).filter(m => m.isLoading).length;
    }
  }))
);

/**
 * Hook to access global query state
 * 
 * @returns {Object} Query state management functions and state
 */
export const useQueryState = () => {
  const store = useQueryStateStore();

  return {
    // Query state management
    setQueryLoading: useCallback((key, isLoading) => {
      store.setQueryState(key, { isLoading, lastUpdated: isLoading ? Date.now() : null });
    }, [store]),

    setQueryFetching: useCallback((key, isFetching) => {
      store.setQueryState(key, { isFetching });
    }, [store]),

    setQueryError: useCallback((key, isError) => {
      store.setQueryState(key, { isError });
    }, [store]),

    clearQuery: useCallback((key) => {
      store.clearQueryState(key);
    }, [store]),

    // Mutation state management
    setMutationLoading: useCallback((key, isLoading) => {
      store.setMutationState(key, { isLoading, isIdle: !isLoading });
    }, [store]),

    setMutationIdle: useCallback((key, isIdle) => {
      store.setMutationState(key, { isIdle });
    }, [store]),

    clearMutation: useCallback((key) => {
      store.clearMutationState(key);
    }, [store]),

    // Global state getters
    isAnyLoading: store.getGlobalLoadingState,
    getLoadingQueriesCount: store.getQueryLoadingCount,
    getLoadingMutationsCount: store.getMutationLoadingCount,

    // Reset all
    resetAll: store.resetAll,

    // Raw state access
    queries: store.queries,
    mutations: store.mutations
  };
};

/**
 * Hook to check if any queries are currently loading
 * Replaces React Query's useIsFetching
 * 
 * @returns {number} Number of loading queries
 */
export const useIsFetching = () => {
  const loadingCount = useQueryStateStore(state => state.getQueryLoadingCount());
  return loadingCount;
};

/**
 * Hook to check if any mutations are currently loading
 * 
 * @returns {number} Number of loading mutations
 */
export const useIsMutating = () => {
  const loadingCount = useQueryStateStore(state => state.getMutationLoadingCount());
  return loadingCount;
};

/**
 * Hook to get global loading state
 * 
 * @returns {boolean} Whether any queries or mutations are loading
 */
export const useGlobalLoading = () => {
  const isLoading = useQueryStateStore(state => state.getGlobalLoadingState());
  return isLoading;
};

/**
 * Hook to subscribe to specific query state changes
 * 
 * @param {string} key - Query key to subscribe to
 * @returns {Object} Query state for the specified key
 */
export const useQuerySubscription = (key) => {
  const queryState = useQueryStateStore(state => state.queries[key]);

  return {
    isLoading: queryState?.isLoading ?? false,
    isFetching: queryState?.isFetching ?? false,
    isError: queryState?.isError ?? false,
    lastUpdated: queryState?.lastUpdated ?? null
  };
};

/**
 * Hook to subscribe to specific mutation state changes
 * 
 * @param {string} key - Mutation key to subscribe to
 * @returns {Object} Mutation state for the specified key
 */
export const useMutationSubscription = (key) => {
  const mutationState = useQueryStateStore(state => state.mutations[key]);

  return {
    isLoading: mutationState?.isLoading ?? false,
    isIdle: mutationState?.isIdle ?? true
  };
};
