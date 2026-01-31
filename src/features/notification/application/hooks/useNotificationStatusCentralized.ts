/**
 * Enterprise Notification Status Hook
 * 
 * This hook provides centralized notification status management,
 * moved from navbar feature to maintain proper separation of concerns.
 * 
 * Follows enterprise hook pattern with DI container integration.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDIContainer } from "@/core/di";
import { TYPES } from "@/core/di/types";
import type { INotificationService } from "../services/NotificationService";
import type { NotificationResponse, NotificationType } from "../../domain/types/api";
import type { ResId } from "../../domain/types/api";

/**
 * Interface for notification status hook configuration
 */
export interface INotificationStatusConfig {
  /** Enable real-time updates */
  enableRealTime?: boolean;
  /** Auto-refresh interval in milliseconds */
  refreshInterval?: number;
  /** Enable caching */
  enableCache?: boolean;
  /** User ID for notifications */
  userId: string;
}

/**
 * Interface for notification status state
 */
export interface INotificationStatusState {
  /** Current notification status */
  hasUnreadNotifications: boolean;
  /** Unread count */
  unreadCount: number;
  /** Has pending notifications */
  hasPendingNotifications: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Last update timestamp */
  lastUpdated: Date | null;
  /** Recent notifications */
  recentNotifications: NotificationResponse[];
}

/**
 * Interface for notification status actions
 */
export interface INotificationStatusActions {
  /** Refresh notification status */
  refresh: () => Promise<void>;
  /** Mark all notifications as read */
  markAllAsRead: () => Promise<void>;
  /** Clear error state */
  clearError: () => void;
  /** Get unread count */
  getUnreadCount: () => Promise<number>;
}

/**
 * Enterprise notification status hook
 * 
 * Provides centralized notification management with proper DI integration
 * and follows the enterprise hook pattern.
 * 
 * @param config - Configuration for the hook
 * @returns Notification status state and actions
 */
export const useNotificationStatus = (
  config: INotificationStatusConfig
): INotificationStatusState & INotificationStatusActions => {
  const {
    enableRealTime = true,
    refreshInterval = 30000, // 30 seconds
    enableCache = true,
    userId
  } = config;

  // DI Container integration
  const diContainer = useDIContainer();
  const notificationService = diContainer.getByToken<INotificationService>(TYPES.NOTIFICATION_DATA_SERVICE);

  // State management
  const [state, setState] = useState<INotificationStatusState>({
    hasUnreadNotifications: false,
    unreadCount: 0,
    hasPendingNotifications: false,
    isLoading: false,
    error: null,
    lastUpdated: null,
    recentNotifications: []
  });

  // Fetch notification status
  const fetchNotificationStatus = useCallback(async (): Promise<void> => {
    if (!userId) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Get notifications and unread count
      const [notifications, unreadCount] = await Promise.all([
        notificationService.getNotifications(userId, { page: 0, size: 10 }),
        notificationService.getUnreadCount(userId)
      ]);
      
      const hasUnread = unreadCount > 0;
      const hasPending = notifications.content?.some((n: NotificationResponse) => !n.isSeen) || false;
      
      setState(prev => ({
        ...prev,
        hasUnreadNotifications: hasUnread,
        unreadCount,
        hasPendingNotifications: hasPending,
        recentNotifications: notifications.content || [],
        isLoading: false,
        lastUpdated: new Date()
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false
      }));
    }
  }, [notificationService, userId]);

  // Refresh action
  const refresh = useCallback(async (): Promise<void> => {
    await fetchNotificationStatus();
  }, [fetchNotificationStatus]);

  // Get unread count action
  const getUnreadCount = useCallback(async (): Promise<number> => {
    if (!userId) return 0;
    
    try {
      const count = await notificationService.getUnreadCount(userId);
      setState(prev => ({ ...prev, unreadCount: count }));
      return count;
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
      return 0;
    }
  }, [notificationService, userId]);

  // Mark all as read action
  const markAllAsRead = useCallback(async (): Promise<void> => {
    if (!state.recentNotifications.length) return;
    
    try {
      const unreadIds = state.recentNotifications
        .filter(n => !n.isSeen)
        .map(n => n.id);
      
      if (unreadIds.length > 0) {
        await notificationService.markMultipleAsRead(unreadIds);
        await fetchNotificationStatus();
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error
      }));
    }
  }, [notificationService, state.recentNotifications, fetchNotificationStatus]);

  // Clear error action
  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchNotificationStatus();
    }
  }, [fetchNotificationStatus, userId]);

  // Auto-refresh interval
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0 || !userId) return;

    const interval = setInterval(() => {
      fetchNotificationStatus();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchNotificationStatus, userId]);

  return {
    ...state,
    refresh,
    markAllAsRead,
    clearError,
    getUnreadCount
  };
};

/**
 * Hook for notification status with legacy compatibility
 * 
 * Provides backward compatibility for existing navbar usage
 * while maintaining the new enterprise pattern.
 * 
 * @param userId - User ID for notifications
 * @returns Notification status state and actions
 */
export const useNotificationData = (userId: string): INotificationStatusState & INotificationStatusActions => {
  return useNotificationStatus({
    userId,
    enableRealTime: true,
    refreshInterval: 30000,
    enableCache: true
  });
};

/**
 * Hook for notification status with enhanced features
 * 
 * Provides advanced notification management with real-time updates
 * and comprehensive notification handling.
 * 
 * @param config - Enhanced configuration for the hook
 * @returns Enhanced notification status state and actions
 */
export const useAdvancedNotificationStatus = (
  config: INotificationStatusConfig & {
    /** Enable sound notifications */
    enableSound?: boolean;
    /** Enable desktop notifications */
    enableDesktop?: boolean;
    /** Notification types to filter */
    notificationTypes?: NotificationType[];
  }
): INotificationStatusState & INotificationStatusActions => {
  const baseHook = useNotificationStatus(config);
  
  // Enhanced features can be added here
  // For now, return the base functionality
  
  return baseHook;
};

export default useNotificationStatus;
