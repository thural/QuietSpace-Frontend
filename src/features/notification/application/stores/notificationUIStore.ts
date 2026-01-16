/**
 * Notification UI State Store.
 * 
 * Zustand store for managing client-side notification UI state.
 * Handles transient UI state that doesn't need to be persisted.
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { NotificationFilters, NotificationStatus } from "../../domain/entities/NotificationEntities";

/**
 * Notification UI State interface.
 */
export interface NotificationUIState {
    // Panel/Modal state
    isNotificationPanelOpen: boolean;
    isNotificationSettingsOpen: boolean;
    
    // UI state
    selectedNotificationId: string | null;
    activeFilter: 'all' | 'unread' | 'read' | 'custom';
    customFilters: NotificationFilters;
    searchQuery: string;
    
    // Real-time state
    isRealTimeEnabled: boolean;
    connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
    lastSyncTime: string | null;
    
    // Pagination state
    currentPage: number;
    hasMoreNotifications: boolean;
    isLoadingMore: boolean;
    
    // UI preferences
    notificationsPerPage: number;
    autoRefreshEnabled: boolean;
    soundEnabled: boolean;
    desktopNotificationsEnabled: boolean;
    
    // Temporary state
    optimisticUpdates: Map<string, any>;
    pendingOperations: Set<string>;
    
    // Status
    status: NotificationStatus | null;
}

/**
 * Notification UI Actions interface.
 */
export interface NotificationUIActions {
    // Panel/Modal actions
    openNotificationPanel: () => void;
    closeNotificationPanel: () => void;
    toggleNotificationPanel: () => void;
    openNotificationSettings: () => void;
    closeNotificationSettings: () => void;
    
    // Selection actions
    selectNotification: (id: string) => void;
    clearSelection: () => void;
    
    // Filter actions
    setActiveFilter: (filter: 'all' | 'unread' | 'read' | 'custom') => void;
    setCustomFilters: (filters: NotificationFilters) => void;
    updateCustomFilter: (key: keyof NotificationFilters, value: any) => void;
    clearFilters: () => void;
    
    // Search actions
    setSearchQuery: (query: string) => void;
    clearSearch: () => void;
    
    // Real-time actions
    setRealTimeEnabled: (enabled: boolean) => void;
    setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting' | 'error') => void;
    updateLastSyncTime: () => void;
    
    // Pagination actions
    setCurrentPage: (page: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    setHasMoreNotifications: (hasMore: boolean) => void;
    setLoadingMore: (loading: boolean) => void;
    
    // Preference actions
    setNotificationsPerPage: (count: number) => void;
    toggleAutoRefresh: () => void;
    toggleSound: () => void;
    toggleDesktopNotifications: () => void;
    
    // Optimistic update actions
    addOptimisticUpdate: (id: string, data: any) => void;
    removeOptimisticUpdate: (id: string) => void;
    clearOptimisticUpdates: () => void;
    
    // Pending operations actions
    addPendingOperation: (id: string) => void;
    removePendingOperation: (id: string) => void;
    clearPendingOperations: () => void;
    
    // Status actions
    setStatus: (status: NotificationStatus) => void;
    updateStatus: (updates: Partial<NotificationStatus>) => void;
    
    // Reset actions
    resetUIState: () => void;
    resetFilters: () => void;
}

/**
 * Notification UI Store type.
 */
export type NotificationUIStore = NotificationUIState & NotificationUIActions;

/**
 * Initial state for notification UI store.
 */
const initialState: NotificationUIState = {
    // Panel/Modal state
    isNotificationPanelOpen: false,
    isNotificationSettingsOpen: false,
    
    // UI state
    selectedNotificationId: null,
    activeFilter: 'all',
    customFilters: {},
    searchQuery: '',
    
    // Real-time state
    isRealTimeEnabled: true,
    connectionStatus: 'disconnected',
    lastSyncTime: null,
    
    // Pagination state
    currentPage: 0,
    hasMoreNotifications: true,
    isLoadingMore: false,
    
    // UI preferences
    notificationsPerPage: 20,
    autoRefreshEnabled: true,
    soundEnabled: true,
    desktopNotificationsEnabled: true,
    
    // Temporary state
    optimisticUpdates: new Map(),
    pendingOperations: new Set(),
    
    // Status
    status: null,
};

/**
 * Create notification UI store.
 */
export const createNotificationUIStore = () => {
    return create<NotificationUIStore>()(
        devtools(
            subscribeWithSelector((set, get) => ({
                ...initialState,

                // Panel/Modal actions
                openNotificationPanel: () => set({ isNotificationPanelOpen: true }),
                closeNotificationPanel: () => set({ isNotificationPanelOpen: false }),
                toggleNotificationPanel: () => set((state) => ({ 
                    isNotificationPanelOpen: !state.isNotificationPanelOpen 
                })),
                openNotificationSettings: () => set({ isNotificationSettingsOpen: true }),
                closeNotificationSettings: () => set({ isNotificationSettingsOpen: false }),

                // Selection actions
                selectNotification: (id: string) => set({ selectedNotificationId: id }),
                clearSelection: () => set({ selectedNotificationId: null }),

                // Filter actions
                setActiveFilter: (filter: 'all' | 'unread' | 'read' | 'custom') => 
                    set({ activeFilter: filter }),
                setCustomFilters: (filters: NotificationFilters) => 
                    set({ customFilters: filters }),
                updateCustomFilter: (key: keyof NotificationFilters, value: any) =>
                    set((state) => ({
                        customFilters: { ...state.customFilters, [key]: value }
                    })),
                clearFilters: () => set({ 
                    activeFilter: 'all', 
                    customFilters: {}, 
                    searchQuery: '' 
                }),

                // Search actions
                setSearchQuery: (query: string) => set({ searchQuery: query }),
                clearSearch: () => set({ searchQuery: '' }),

                // Real-time actions
                setRealTimeEnabled: (enabled: boolean) => set({ isRealTimeEnabled: enabled }),
                setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting' | 'error') => 
                    set({ connectionStatus: status }),
                updateLastSyncTime: () => set({ lastSyncTime: new Date().toISOString() }),

                // Pagination actions
                setCurrentPage: (page: number) => set({ currentPage: page }),
                nextPage: () => set((state) => ({ 
                    currentPage: state.currentPage + 1 
                })),
                previousPage: () => set((state) => ({ 
                    currentPage: Math.max(0, state.currentPage - 1) 
                })),
                setHasMoreNotifications: (hasMore: boolean) => set({ hasMoreNotifications: hasMore }),
                setLoadingMore: (loading: boolean) => set({ isLoadingMore: loading }),

                // Preference actions
                setNotificationsPerPage: (count: number) => set({ notificationsPerPage: count }),
                toggleAutoRefresh: () => set((state) => ({ 
                    autoRefreshEnabled: !state.autoRefreshEnabled 
                })),
                toggleSound: () => set((state) => ({ 
                    soundEnabled: !state.soundEnabled 
                })),
                toggleDesktopNotifications: () => set((state) => ({ 
                    desktopNotificationsEnabled: !state.desktopNotificationsEnabled 
                })),

                // Optimistic update actions
                addOptimisticUpdate: (id: string, data: any) =>
                    set((state) => {
                        const newUpdates = new Map(state.optimisticUpdates);
                        newUpdates.set(id, data);
                        return { optimisticUpdates: newUpdates };
                    }),
                removeOptimisticUpdate: (id: string) =>
                    set((state) => {
                        const newUpdates = new Map(state.optimisticUpdates);
                        newUpdates.delete(id);
                        return { optimisticUpdates: newUpdates };
                    }),
                clearOptimisticUpdates: () => set({ optimisticUpdates: new Map() }),

                // Pending operations actions
                addPendingOperation: (id: string) =>
                    set((state) => {
                        const newPending = new Set(state.pendingOperations);
                        newPending.add(id);
                        return { pendingOperations: newPending };
                    }),
                removePendingOperation: (id: string) =>
                    set((state) => {
                        const newPending = new Set(state.pendingOperations);
                        newPending.delete(id);
                        return { pendingOperations: newPending };
                    }),
                clearPendingOperations: () => set({ pendingOperations: new Set() }),

                // Status actions
                setStatus: (status: NotificationStatus) => set({ status }),
                updateStatus: (updates: Partial<NotificationStatus>) =>
                    set((state) => ({
                        status: state.status ? { ...state.status, ...updates } : null
                    })),

                // Reset actions
                resetUIState: () => set(initialState),
                resetFilters: () => set({ 
                    activeFilter: 'all', 
                    customFilters: {}, 
                    searchQuery: '',
                    currentPage: 0 
                }),
            })),
            {
                name: 'notification-ui-store',
            }
        )
    );
};

/**
 * Notification UI store instance.
 */
export const useNotificationUIStore = createNotificationUIStore();
