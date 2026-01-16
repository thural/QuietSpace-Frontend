/**
 * Advanced Notification Hook.
 * 
 * Enhanced notification hook that combines all advanced state management features:
 * - Client-side state management with Zustand
 * - Real-time WebSocket updates
 * - Optimistic updates with rollback
 * - State synchronization and conflict resolution
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { NotificationPage, NotificationResponse, NotificationType } from '@api/schemas/inferred/notification';
import type { ResId } from '@api/schemas/inferred/common';
import type { NotificationQuery, NotificationFilters } from '../../domain/entities/NotificationEntities';
import { useNotificationDI } from '../../di/useNotificationDI';
import { 
    useNotificationUIStore, 
    type NotificationUIState, 
    type NotificationUIActions 
} from '../stores/notificationUIStore';
import { 
    useRealtimeNotifications,
    type ConnectionStatus 
} from '../services/RealtimeNotificationService';
import { 
    useOptimisticUpdates,
    optimisticUpdateManager 
} from '../services/OptimisticUpdateManager';
import { 
    useStateSynchronization,
    type SyncStrategy 
} from '../services/StateSynchronizationManager';

/**
 * Advanced notification state interface.
 */
export interface AdvancedNotificationState {
    // Data state
    notifications: NotificationPage | null;
    unreadCount: number | null;
    selectedNotification: NotificationResponse | null;
    
    // Loading states
    isLoading: boolean;
    isRefreshing: boolean;
    isLoadingMore: boolean;
    
    // Error state
    error: Error | null;
    
    // Real-time state
    isConnected: boolean;
    connectionStatus: ConnectionStatus;
    lastSyncTime: string | null;
    
    // UI state
    isPanelOpen: boolean;
    activeFilter: 'all' | 'unread' | 'read' | 'custom';
    searchQuery: string;
    currentPage: number;
    hasMore: boolean;
    
    // Optimistic updates state
    hasPendingOperations: boolean;
    hasOptimisticUpdates: boolean;
    
    // Synchronization state
    hasConflicts: boolean;
    pendingConflicts: any[];
}

/**
 * Advanced notification actions interface.
 */
export interface AdvancedNotificationActions {
    // Data operations
    refetch: () => void;
    loadMore: () => void;
    refresh: () => void;
    
    // Notification operations
    markAsRead: (notificationId: ResId) => Promise<void>;
    markMultipleAsRead: (notificationIds: ResId[]) => Promise<void>;
    deleteNotification: (notificationId: ResId) => Promise<void>;
    searchNotifications: (query: string) => Promise<void>;
    
    // UI operations
    openPanel: () => void;
    closePanel: () => void;
    togglePanel: () => void;
    selectNotification: (id: ResId) => void;
    clearSelection: () => void;
    
    // Filter operations
    setActiveFilter: (filter: 'all' | 'unread' | 'read' | 'custom') => void;
    setCustomFilters: (filters: NotificationFilters) => void;
    setSearchQuery: (query: string) => void;
    clearFilters: () => void;
    
    // Pagination operations
    nextPage: () => void;
    previousPage: () => void;
    goToPage: (page: number) => void;
    
    // Real-time operations
    enableRealTime: () => void;
    disableRealTime: () => void;
    
    // Synchronization operations
    forceSync: () => Promise<void>;
    resolveConflict: (conflictId: string, resolution: 'client_wins' | 'server_wins' | 'merge') => void;
    clearConflicts: () => void;
}

/**
 * Advanced notification hook return type.
 */
export type UseAdvancedNotifications = AdvancedNotificationState & AdvancedNotificationActions;

/**
 * Advanced Notification Hook.
 * 
 * Combines all advanced state management features for a complete notification experience.
 */
export const useAdvancedNotifications = (options: {
    userId?: string;
    enableRealTime?: boolean;
    syncStrategy?: SyncStrategy;
    autoRefresh?: boolean;
} = {}): UseAdvancedNotifications => {
    const {
        userId = 'current-user',
        enableRealTime = true,
        syncStrategy = 'server_first',
        autoRefresh = true
    } = options;

    // DI and repositories
    const { notificationRepository } = useNotificationDI();
    const queryClient = useQueryClient();

    // UI state management
    const uiState = useNotificationUIStore();
    const {
        isNotificationPanelOpen,
        activeFilter,
        searchQuery,
        currentPage,
        notificationsPerPage,
        autoRefreshEnabled,
        optimisticUpdates,
        pendingOperations,
        hasMoreNotifications,
        isLoadingMore,
        openNotificationPanel,
        closeNotificationPanel,
        toggleNotificationPanel,
        selectNotification,
        clearSelection,
        setActiveFilter,
        setCustomFilters,
        setSearchQuery,
        clearFilters,
        setCurrentPage,
        nextPage,
        previousPage,
        setHasMoreNotifications,
        setLoadingMore,
        addOptimisticUpdate,
        removeOptimisticUpdate,
        clearOptimisticUpdates,
        addPendingOperation,
        removePendingOperation,
        clearPendingOperations,
        updateLastSyncTime
    } = uiState;

    // Real-time notifications
    const { 
        isConnected, 
        connectionStatus, 
        service: realtimeService 
    } = useRealtimeNotifications(enableRealTime ? userId : null);

    // Optimistic updates
    const { 
        manager: optimisticManager,
        applyToPage,
        getNotification: getNotificationWithOptimisticUpdates,
        hasPendingOperations,
        hasOptimisticUpdates
    } = useOptimisticUpdates();

    // State synchronization
    const {
        manager: syncManager,
        synchronizeServerResponse,
        processRealtimeEvent,
        forceSync: forceSyncOperation,
        getPendingConflicts,
        clearResolvedConflicts,
        hasConflicts,
        updateLastSyncTime: updateSyncTimestamp
    } = useStateSynchronization();

    // Build query based on UI state
    const buildQuery = useCallback((): NotificationQuery => {
        const query: NotificationQuery = {
            userId,
            page: currentPage,
            size: notificationsPerPage,
            filters: {}
        };

        // Apply filters
        if (activeFilter === 'unread') {
            query.filters!.isSeen = false;
        } else if (activeFilter === 'read') {
            query.filters!.isSeen = true;
        }

        // Apply search
        if (searchQuery) {
            query.filters!.searchQuery = searchQuery;
        }

        return query;
    }, [userId, currentPage, notificationsPerPage, activeFilter, searchQuery]);

    // Main notifications query
    const {
        data: serverNotifications,
        isLoading,
        error,
        refetch,
        isFetching: isRefreshing
    } = useQuery({
        queryKey: ['notifications', userId, currentPage, activeFilter, searchQuery],
        queryFn: async () => {
            const query = buildQuery();
            return await notificationRepository.getNotifications(query, 'test-token');
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        refetchInterval: autoRefresh && autoRefreshEnabled ? 1000 * 60 * 5 : false, // 5 minutes
        enabled: !!userId && !!notificationRepository,
    });

    // Unread count query
    const {
        data: unreadCount,
        isLoading: isLoadingUnread
    } = useQuery({
        queryKey: ['notifications', 'unread-count', userId],
        queryFn: async () => {
            return await notificationRepository.getPendingNotificationsCount(userId, 'test-token');
        },
        staleTime: 1000 * 30, // 30 seconds
        refetchInterval: 1000 * 60 * 2, // 2 minutes
        enabled: !!userId && !!notificationRepository,
    });

    // Apply optimistic updates and synchronization
    const notifications = useMemo(() => {
        if (!serverNotifications) return null;

        let processedPage = synchronizeServerResponse(serverNotifications, null, syncStrategy);
        processedPage = applyToPage(processedPage);

        return processedPage;
    }, [serverNotifications, syncStrategy, synchronizeServerResponse, applyToPage]);

    // Mark as read mutation with optimistic updates
    const markAsReadMutation = useMutation({
        mutationFn: async (notificationId: ResId) => {
            const originalNotification = notifications?.content.find(n => n.id === notificationId);
            if (!originalNotification) {
                throw new Error('Notification not found');
            }

            // Create optimistic update
            const optimisticContext = optimisticManager.createMarkAsReadUpdate(notificationId, originalNotification);
            
            // Execute with optimistic updates
            return await optimisticManager.executeOptimisticUpdate(optimisticContext);
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
            updateLastSyncTime();
        },
        onError: (error) => {
            console.error('Failed to mark notification as read:', error);
        }
    });

    // Delete notification mutation with optimistic updates
    const deleteNotificationMutation = useMutation({
        mutationFn: async (notificationId: ResId) => {
            const originalNotification = notifications?.content.find(n => n.id === notificationId);
            if (!originalNotification) {
                throw new Error('Notification not found');
            }

            // Create optimistic update
            const optimisticContext = optimisticManager.createDeleteUpdate(notificationId, originalNotification);
            
            // Execute with optimistic updates
            return await optimisticManager.executeOptimisticUpdate(optimisticContext);
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
            updateLastSyncTime();
        },
        onError: (error) => {
            console.error('Failed to delete notification:', error);
        }
    });

    // Search notifications
    const searchNotifications = useCallback(async (query: string) => {
        setSearchQuery(query);
        // The query will automatically refetch due to the dependency on searchQuery
    }, [setSearchQuery]);

    // Load more notifications
    const loadMore = useCallback(async () => {
        if (!hasMoreNotifications || isLoadingMore) return;

        setLoadingMore(true);
        setCurrentPage(currentPage + 1);
        
        try {
            // The query will automatically load the next page
            await new Promise(resolve => setTimeout(resolve, 100));
        } finally {
            setLoadingMore(false);
        }
    }, [notifications, isLoadingMore, currentPage, setCurrentPage, setLoadingMore]);

    // Force synchronization
    const forceSync = useCallback(async () => {
        try {
            await forceSyncOperation(notificationRepository, buildQuery());
            clearOptimisticUpdates();
            clearPendingOperations();
            refetch();
        } catch (error) {
            console.error('Failed to force sync:', error);
        }
    }, [forceSyncOperation, notificationRepository, buildQuery, clearOptimisticUpdates, clearPendingOperations, refetch]);

    // Handle real-time events
    useEffect(() => {
        if (!notifications || !isConnected) return;

        // This would process real-time events and update state
        // For now, we'll just update the sync time
        updateSyncTimestamp();
    }, [notifications, isConnected, updateSyncTimestamp]);

    // Update hasMore based on current data
    useEffect(() => {
        // For now, we'll determine hasMore based on current page and total elements
        if (notifications) {
            const hasMore = (notifications.number + 1) * notifications.size < notifications.totalElements;
            setHasMoreNotifications(hasMore);
        }
    }, [notifications, setHasMoreNotifications]);

    // Computed state
    const state: AdvancedNotificationState = {
        notifications,
        unreadCount,
        selectedNotification: uiState.selectedNotificationId 
            ? notifications?.content.find(n => n.id === uiState.selectedNotificationId) || null 
            : null,
        isLoading: isLoading || isLoadingUnread,
        isRefreshing,
        isLoadingMore: uiState.isLoadingMore,
        error,
        isConnected,
        connectionStatus,
        lastSyncTime: uiState.lastSyncTime,
        isPanelOpen: isNotificationPanelOpen,
        activeFilter,
        searchQuery,
        currentPage,
        hasMore: hasMoreNotifications,
        hasPendingOperations,
        hasOptimisticUpdates,
        pendingConflicts: getPendingConflicts(),
        hasConflicts
    };

    const actions: AdvancedNotificationActions = {
        refetch,
        loadMore,
        refresh: () => refetch(),
        markAsRead: (notificationId: ResId) => markAsReadMutation.mutateAsync(notificationId),
        markMultipleAsRead: async (notificationIds: ResId[]) => {
            // Batch mark as read
            await Promise.all(notificationIds.map(id => markAsReadMutation.mutateAsync(id)));
        },
        deleteNotification: (notificationId: ResId) => deleteNotificationMutation.mutateAsync(notificationId),
        searchNotifications,
        openPanel: openNotificationPanel,
        closePanel: closeNotificationPanel,
        togglePanel: toggleNotificationPanel,
        selectNotification: (id: ResId) => selectNotification(id.toString()),
        clearSelection,
        setActiveFilter,
        setCustomFilters,
        setSearchQuery,
        clearFilters,
        nextPage,
        previousPage,
        goToPage: setCurrentPage,
        enableRealTime: () => uiState.setRealTimeEnabled(true),
        disableRealTime: () => uiState.setRealTimeEnabled(false),
        forceSync,
        resolveConflict: syncManager.resolveConflict.bind(syncManager),
        clearConflicts: clearResolvedConflicts
    };

    return { ...state, ...actions };
};
