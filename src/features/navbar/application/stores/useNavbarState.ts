/**
 * State management hooks for navbar with repository pattern integration.
 * 
 * This module provides hooks that combine advanced state management
 * with the repository pattern for optimal performance and maintainability.
 */

import { useEffect, useCallback } from "react";
import { useNavbarState, useNavbarActions, useOptimisticUpdate } from "./NavbarStore";
import { useNotificationDataEnhanced } from "../data";
import type { NotificationStatusEntity } from "../domain";

/**
 * Hook that combines repository pattern with advanced state management.
 * 
 * This hook provides:
 * - Repository pattern benefits (clean architecture, testability)
 * - Advanced state management (caching, persistence, sync)
 * - Optimistic updates and error handling
 * - Performance optimization
 * 
 * @param {Object} config - Configuration for state management
 * @returns {{
 *   notificationData: NotificationStatusEntity | null,
 *   hasUnreadNotifications: boolean,
 *   hasUnreadChats: boolean,
 *   isLoading: boolean,
 *   error: Error | null,
 *   isConnected: boolean,
 *   needsSync: boolean,
 *   actions: Object
 * }} - Complete navbar state with actions
 */
export const useNavbarWithState = (config: {
  useRepositoryPattern?: boolean;
  repositoryConfig?: {
    useMockRepositories?: boolean;
    mockConfig?: {
      hasPendingNotifications?: boolean;
      hasUnreadChats?: boolean;
      simulateLoading?: boolean;
      simulateError?: boolean;
    };
  };
  enablePersistence?: boolean;
  syncInterval?: number;
} = {}) => {
  const { 
    useRepositoryPattern = true, 
    repositoryConfig, 
    enablePersistence = true,
    syncInterval = 5 * 60 * 1000 // 5 minutes
  } = config;

  // Get repository data
  const { notificationData: repoData, error: repoError, repository } = useNotificationDataEnhanced(repositoryConfig);
  
  // Get state management
  const state = useNavbarState();
  const actions = useNavbarActions();
  const optimisticUpdate = useOptimisticUpdate();

  // Sync repository data with state management
  useEffect(() => {
    if (repoData && (!state.notificationData || 
        JSON.stringify(repoData) !== JSON.stringify(state.notificationData))) {
      actions.setNotificationData(repoData);
    }
  }, [repoData, state.notificationData, actions]);

  // Sync errors
  useEffect(() => {
    if (repoError !== state.error) {
      actions.setError(repoError);
    }
  }, [repoError, state.error, actions]);

  // Auto-sync functionality
  useEffect(() => {
    if (!enablePersistence || !useRepositoryPattern) return;

    const interval = setInterval(() => {
      if (state.needsSync && state.isConnected) {
        actions.syncState();
      }
    }, syncInterval);

    return () => clearInterval(interval);
  }, [enablePersistence, useRepositoryPattern, syncInterval, state.needsSync, state.isConnected, actions]);

  // Optimistic update wrapper
  const updateNotificationData = useCallback(async (updateFn: () => Promise<NotificationStatusEntity>) => {
    return optimisticUpdate(async () => {
      const newData = await updateFn();
      actions.setNotificationData(newData);
    });
  }, [optimisticUpdate, actions]);

  return {
    // Data from state (preferred over repository for consistency)
    notificationData: state.notificationData,
    hasUnreadNotifications: state.hasUnreadNotifications,
    hasUnreadChats: state.hasUnreadChats,
    
    // Loading and error states
    isLoading: state.isLoading || repoData?.isLoading || false,
    error: state.error || repoError,
    
    // Connection and sync status
    isConnected: state.isConnected,
    needsSync: state.needsSync,
    
    // Actions
    actions: {
      ...actions,
      updateNotificationData,
      // Repository access for advanced usage
      repository
    }
  };
};

/**
 * Hook for real-time notification updates.
 * 
 * This hook provides real-time synchronization capabilities
 * for notification data across multiple tabs/windows.
 * 
 * @returns {{
 *   isRealTimeEnabled: boolean,
 *   lastUpdate: number | null,
 *   forceUpdate: () => void
 * }} - Real-time update capabilities
 */
export const useRealTimeNotifications = () => {
  const state = useNavbarState();
  const actions = useNavbarActions();

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'navbar-store' && event.newValue) {
        try {
          const parsedState = JSON.parse(event.newValue);
          if (parsedState.state?.notificationData) {
            actions.setNotificationData(parsedState.state.notificationData);
          }
        } catch (error) {
          console.warn('Failed to parse navbar store from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [actions]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      if (state.needsSync) {
        actions.syncState();
      }
    };

    const handleOffline = () => {
      // Could show offline indicator
      console.log('App is offline - notification updates may be delayed');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [state.needsSync, actions]);

  // Force update function
  const forceUpdate = useCallback(() => {
    actions.syncState();
  }, [actions]);

  return {
    isRealTimeEnabled: typeof Storage !== 'undefined',
    lastUpdate: state.lastNotificationUpdate,
    forceUpdate
  };
};

/**
 * Hook for notification analytics and insights.
 * 
 * This hook provides analytics capabilities for notification
 * patterns and user behavior.
 * 
 * @returns {{
 *   totalUpdates: number,
 *   averageResponseTime: number,
 *   peakUsageHours: number[],
 *   markNotificationRead: () => void
 * }} - Notification analytics
 */
export const useNotificationAnalytics = () => {
  const state = useNavbarState();
  const actions = useNavbarActions();

  // Calculate analytics (simplified version)
  const totalUpdates = state.lastNotificationUpdate ? 
    Math.floor((Date.now() - state.lastNotificationUpdate) / (1000 * 60 * 60)) : 0;

  const averageResponseTime = 150; // Mock value - would be calculated

  const peakUsageHours = [9, 10, 14, 15, 20, 21]; // Mock data

  // Mark notification as read
  const markNotificationRead = useCallback(() => {
    if (state.notificationData?.hasPendingNotification) {
      const updatedData: NotificationStatusEntity = {
        ...state.notificationData,
        hasPendingNotification: false
      };
      actions.setNotificationData(updatedData);
    }
  }, [state.notificationData, actions]);

  return {
    totalUpdates,
    averageResponseTime,
    peakUsageHours,
    markNotificationRead
  };
};
