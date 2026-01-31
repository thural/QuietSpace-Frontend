/**
 * Refactored Notification Data Hook
 * 
 * This hook now uses the centralized notification feature
 * instead of maintaining notification logic within the navbar feature.
 * 
 * Follows enterprise architecture principles with proper separation of concerns.
 */

import { useCallback } from "react";
import { useNotifications } from "@/features/notification/application/hooks/useNotifications";
import { useAuthStore } from "@core/store/zustand";

/**
 * Interface for notification data state
 */
export interface INotificationDataState {
  /** Has unread notifications */
  hasUnreadNotifications: boolean;
  /** Has unread chat messages */
  hasUnreadChat: boolean;
  /** Total unread count */
  unreadCount: number;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
}

/**
 * Refactored notification data hook
 * 
 * Delegates notification logic to the centralized notification feature
 * while maintaining backward compatibility for navbar components.
 * 
 * @returns Notification data state
 */
export const useNotificationDataRefactored = (): INotificationDataState => {
  // Get current user from auth store
  const user = useAuthStore(state => state.user);

  // Use centralized notification hook
  const {
    notifications,
    unreadCount,
    isLoading,
    error
  } = useNotifications();

  // Calculate notification status
  const hasUnreadNotifications = (unreadCount || 0) > 0;

  // For now, we'll simulate chat unread status
  // In a full refactoring, this would also come from the notification feature
  const hasUnreadChat = false; // This would be calculated from chat notifications

  return {
    hasUnreadNotifications,
    hasUnreadChat,
    unreadCount: unreadCount || 0,
    isLoading,
    error
  };
};

/**
 * Legacy notification data hook for backward compatibility
 * 
 * @deprecated Use useNotificationDataRefactored instead
 */
export const useNotificationDataLegacy = useNotificationDataRefactored;

export default useNotificationDataRefactored;
