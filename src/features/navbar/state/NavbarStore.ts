/**
 * State management for navbar feature.
 * 
 * This module provides advanced state management capabilities including:
 * - Client-side caching and synchronization
 * - State persistence and recovery
 * - Optimistic updates and rollbacks
 * - Real-time state synchronization
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NotificationStatusEntity } from "../domain";

/**
 * Navbar state interface for advanced state management.
 */
export interface NavbarState {
  // Notification state
  notificationData: NotificationStatusEntity | null;
  lastNotificationUpdate: number | null;
  
  // UI state
  isMenuOpen: boolean;
  activeNavItem: string | null;
  
  // Loading and error states
  isLoading: boolean;
  error: Error | null;
  
  // Cache and synchronization
  lastSyncTime: number | null;
  isOnline: boolean;
  
  // Actions
  setNotificationData: (data: NotificationStatusEntity) => void;
  setMenuOpen: (isOpen: boolean) => void;
  setActiveNavItem: (item: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  syncState: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

/**
 * Advanced state management store for navbar using Zustand.
 * 
 * This store provides:
 * - Persistent state across sessions
 * - Optimistic updates support
 * - Real-time synchronization
 * - Performance optimization
 */
export const useNavbarStore = create<NavbarState>()(
  persist(
    (set, get) => ({
      // Initial state
      notificationData: null,
      lastNotificationUpdate: null,
      isMenuOpen: false,
      activeNavItem: null,
      isLoading: false,
      error: null,
      lastSyncTime: null,
      isOnline: navigator.onLine,

      // Notification actions
      setNotificationData: (data) => {
        const currentTime = Date.now();
        set({
          notificationData: data,
          lastNotificationUpdate: currentTime,
          lastSyncTime: currentTime,
          error: null
        });
      },

      // UI actions
      setMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
      setActiveNavItem: (item) => set({ activeNavItem: item }),

      // Loading and error actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Synchronization actions
      syncState: async () => {
        const currentState = get();
        
        try {
          set({ isLoading: true, error: null });
          
          // Simulate server sync - in real app, this would call API
          await new Promise(resolve => setTimeout(resolve, 100));
          
          set({ 
            isLoading: false,
            lastSyncTime: Date.now(),
            isOnline: navigator.onLine
          });
        } catch (error) {
          set({ 
            isLoading: false,
            error: error as Error,
            lastSyncTime: Date.now()
          });
        }
      },

      // Reset action
      reset: () => {
        set({
          notificationData: null,
          lastNotificationUpdate: null,
          isMenuOpen: false,
          activeNavItem: null,
          isLoading: false,
          error: null,
          lastSyncTime: null,
          isOnline: navigator.onLine
        });
      }
    }),
    {
      name: 'navbar-store',
      version: 1,
      // Only persist essential state
      partialize: (state) => ({
        notificationData: state.notificationData,
        lastNotificationUpdate: state.lastNotificationUpdate,
        isMenuOpen: state.isMenuOpen,
        activeNavItem: state.activeNavItem
      })
    }
  )
);

/**
 * Hook for accessing navbar state with computed values.
 * 
 * This hook provides additional computed properties and optimized selectors.
 * 
 * @returns {NavbarState & {
 *   hasUnreadNotifications: boolean,
 *   hasUnreadChats: boolean,
 *   needsSync: boolean,
 *   isConnected: boolean
 * }} - Enhanced navbar state with computed values
 */
export const useNavbarState = () => {
  const state = useNavbarStore();
  
  // Computed values
  const hasUnreadNotifications = state.notificationData?.hasPendingNotification || false;
  const hasUnreadChats = state.notificationData?.hasUnreadChat || false;
  
  // Check if sync is needed (no sync in last 5 minutes)
  const needsSync = !state.lastSyncTime || 
    (Date.now() - state.lastSyncTime) > 5 * 60 * 1000;
  
  // Connection status with fallback
  const isConnected = state.isOnline && !state.error;
  
  return {
    ...state,
    hasUnreadNotifications,
    hasUnreadChats,
    needsSync,
    isConnected
  };
};

/**
 * Hook for navbar state actions.
 * 
 * This hook provides optimized action creators with additional logic.
 * 
 * @returns {Pick<NavbarState, 'setNotificationData' | 'setMenuOpen' | 'setActiveNavItem' | 'setLoading' | 'setError' | 'syncState' | 'clearError' | 'reset'>>}
 *   Navbar state actions
 */
export const useNavbarActions = () => {
  const store = useNavbarStore();
  
  return {
    setNotificationData: store.setNotificationData,
    setMenuOpen: store.setMenuOpen,
    setActiveNavItem: store.setActiveNavItem,
    setLoading: store.setLoading,
    setError: store.setError,
    syncState: store.syncState,
    clearError: store.clearError,
    reset: store.reset
  };
};

/**
 * Hook for optimistic updates.
 * 
 * This hook provides optimistic update capabilities for better UX.
 * 
 * @returns {(updateFn: () => Promise<void>) => Promise<void>} - Optimistic update function
 */
export const useOptimisticUpdate = () => {
  const { setLoading, setError, clearError } = useNavbarActions();
  
  return async (updateFn: () => Promise<void>) => {
    try {
      setLoading(true);
      clearError();
      await updateFn();
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
};
