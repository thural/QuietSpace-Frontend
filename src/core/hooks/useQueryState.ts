import { useState, useCallback } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

/**
 * Global query state interface
 */
export interface GlobalQueryState {
  queries: Record<string, {
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    lastUpdated: number | null;
  }>;
  mutations: Record<string, {
    isLoading: boolean;
    isIdle: boolean;
  }>;
  setQueryState: (key: string, state: Partial<{
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    lastUpdated: number | null;
  }>) => void;
  setMutationState: (key: string, state: Partial<{
    isLoading: boolean;
    isIdle: boolean;
  }>) => void;
  clearQueryState: (key: string) => void;
  clearMutationState: (key: string) => void;
  resetAll: () => void;
  getGlobalLoadingState: () => boolean;
  getQueryLoadingCount: () => number;
  getMutationLoadingCount: () => number;
}

/**
 * Global query state store using Zustand
 */
export const useQueryStateStore = create<GlobalQueryState>()(
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
 */
export const useQueryState = () => {
  const store = useQueryStateStore();

  return {
    // Query state management
    setQueryLoading: useCallback((key: string, isLoading: boolean) => {
      store.setQueryState(key, { isLoading, lastUpdated: isLoading ? Date.now() : null });
    }, [store]),

    setQueryFetching: useCallback((key: string, isFetching: boolean) => {
      store.setQueryState(key, { isFetching });
    }, [store]),

    setQueryError: useCallback((key: string, isError: boolean) => {
      store.setQueryState(key, { isError });
    }, [store]),

    clearQuery: useCallback((key: string) => {
      store.clearQueryState(key);
    }, [store]),

    // Mutation state management
    setMutationLoading: useCallback((key: string, isLoading: boolean) => {
      store.setMutationState(key, { isLoading, isIdle: !isLoading });
    }, [store]),

    setMutationIdle: useCallback((key: string, isIdle: boolean) => {
      store.setMutationState(key, { isIdle });
    }, [store]),

    clearMutation: useCallback((key: string) => {
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
 */
export const useIsFetching = () => {
  const loadingCount = useQueryStateStore(state => state.getQueryLoadingCount());
  return loadingCount;
};

/**
 * Hook to check if any mutations are currently loading
 */
export const useIsMutating = () => {
  const loadingCount = useQueryStateStore(state => state.getMutationLoadingCount());
  return loadingCount;
};

/**
 * Hook to get global loading state
 */
export const useGlobalLoading = () => {
  const isLoading = useQueryStateStore(state => state.getGlobalLoadingState());
  return isLoading;
};

/**
 * Hook to subscribe to specific query state changes
 */
export const useQuerySubscription = (key: string) => {
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
 */
export const useMutationSubscription = (key: string) => {
  const mutationState = useQueryStateStore(state => state.mutations[key]);
  
  return {
    isLoading: mutationState?.isLoading ?? false,
    isIdle: mutationState?.isIdle ?? true
  };
};
