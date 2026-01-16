/**
 * Feed UI State Management.
 * 
 * Zustand store for managing Feed-specific UI state.
 * Handles transient UI state like filters, pagination, and real-time indicators.
 * Complements server state managed by React Query.
 */

import { create } from 'zustand';
import type { PostQuery, PostFilters } from '../../domain/entities/IPostRepository';
import type { PostResponse } from '../../../../api/schemas/inferred/post';

/**
 * Feed UI state interface
 */
export interface FeedUIState {
    // UI State
    isCreatePostFormOpen: boolean;
    isFilterPanelOpen: boolean;
    activeFilter: string;
    searchQuery: string;
    selectedPostId: string | null;
    
    // Pagination State
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    
    // Real-time State
    isConnected: boolean;
    connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error';
    lastSyncTime: Date | null;
    
    // Loading States
    isLoading: boolean;
    isRefreshing: boolean;
    isLoadingMore: boolean;
    
    // Error State
    error: string | null;
    
    // Optimistic Updates State
    hasPendingOperations: boolean;
    optimisticUpdates: Array<{
        id: string;
        type: 'create' | 'update' | 'delete';
        timestamp: Date;
        data: any;
    }>;
}

/**
 * Feed UI actions interface
 */
export interface FeedUIActions {
    // UI Actions
    openCreatePostForm: () => void;
    closeCreatePostForm: () => void;
    toggleCreatePostForm: () => void;
    
    openFilterPanel: () => void;
    closeFilterPanel: () => void;
    toggleFilterPanel: () => void;
    
    setActiveFilter: (filter: string) => void;
    setSearchQuery: (query: string) => void;
    clearSearchQuery: () => void;
    
    selectPost: (postId: string) => void;
    clearSelectedPost: () => void;
    
    // Pagination Actions
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setHasNextPage: (hasNext: boolean) => void;
    setFetchingNextPage: (isFetching: boolean) => void;
    
    // Real-time Actions
    setConnectionStatus: (status: FeedUIState['connectionStatus']) => void;
    setLastSyncTime: (time: Date | null) => void;
    
    // Loading Actions
    setLoading: (loading: boolean) => void;
    setRefreshing: (refreshing: boolean) => void;
    setLoadingMore: (loading: boolean) => void;
    
    // Error Actions
    setError: (error: string | null) => void;
    clearError: () => void;
    
    // Optimistic Update Actions
    addOptimisticUpdate: (update: {
        id: string;
        type: 'create' | 'update' | 'delete';
        timestamp: Date;
        data: any;
    }) => void;
    removeOptimisticUpdate: (id: string) => void;
    clearOptimisticUpdates: () => void;
}

/**
 * Feed UI store using Zustand
 */
export const useFeedUIStore = create<FeedUIState>((set, get) => ({
    // Initial state
    isCreatePostFormOpen: false,
    isFilterPanelOpen: false,
    activeFilter: 'all',
    searchQuery: '',
    selectedPostId: null,
    
    // Pagination state
    currentPage: 0,
    pageSize: 10,
    hasNextPage: false,
    isFetchingNextPage: false,
    
    // Real-time state
    isConnected: false,
    connectionStatus: 'disconnected',
    lastSyncTime: null,
    
    // Loading states
    isLoading: false,
    isRefreshing: false,
    isLoadingMore: false,
    
    // Error state
    error: null,
    
    // Optimistic updates state
    hasPendingOperations: false,
    optimisticUpdates: []
}));

/**
 * Feed UI selectors for computed values
 */
export const useFeedUISelectors = () => {
    const {
        isCreatePostFormOpen,
        isFilterPanelOpen,
        activeFilter,
        searchQuery,
        selectedPostId,
        currentPage,
        pageSize,
        hasNextPage,
        isFetchingNextPage,
        isConnected,
        connectionStatus,
        lastSyncTime,
        isLoading,
        isRefreshing,
        isLoadingMore,
        error,
        hasPendingOperations,
        optimisticUpdates
    } = useFeedUIStore();

    return {
        // Computed selectors
        hasActiveFilters: activeFilter !== 'all' || searchQuery.trim() !== '',
        hasSelectedPost: selectedPostId !== null,
        isLoadMoreVisible: hasNextPage && !isFetchingNextPage,
        
        // Real-time selectors
        isRealTimeActive: isConnected && connectionStatus === 'connected',
        hasRecentSync: lastSyncTime && (Date.now() - lastSyncTime.getTime() < 5 * 60 * 1000),
        
        // Loading selectors
        isAnyLoading: isLoading || isRefreshing || isLoadingMore,
        
        // Optimistic update selectors
        hasCreateOptimisticUpdate: optimisticUpdates.some(update => update.type === 'create'),
        hasDeleteOptimisticUpdate: optimisticUpdates.some(update => update.type === 'delete')
    };
};
