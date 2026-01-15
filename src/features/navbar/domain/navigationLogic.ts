/**
 * Pure business logic functions for navbar functionality.
 * These functions are framework-agnostic and contain core business rules.
 */

import { NotificationStatusEntity } from "./entities";

/**
 * Determines if a navigation item is active based on the current path.
 * 
 * @param {string} currentPath - The current pathname
 * @param {string} itemPath - The navigation item's path
 * @returns {boolean} - True if the item should be considered active
 */
export const isNavigationItemActive = (currentPath: string, itemPath: string): boolean => {
  return currentPath.includes(itemPath.slice(0, 5));
};

/**
 * Calculates if there are unread chat messages based on chat data and user ID.
 * 
 * @param {Array<any>} chats - Array of chat objects
 * @param {string} userId - Current user's ID
 * @returns {boolean} - True if there are unread messages
 */
export const hasUnreadMessages = (chats: any[] | undefined, userId: string): boolean => {
  if (!chats) return false;
  
  return chats.some(({ recentMessage }) => {
    return !recentMessage?.isSeen && recentMessage?.senderId !== userId;
  });
};

/**
 * Calculates if there are pending notifications based on notification data.
 * 
 * @param {Array<any>} notifications - Array of notification objects
 * @returns {boolean} - True if there are pending notifications
 */
export const hasPendingNotifications = (notifications: any[] | undefined): boolean => {
  if (!notifications) return false;
  
  return notifications.some(({ isSeen }) => !isSeen);
};

/**
 * Validates navigation item configuration.
 * 
 * @param {any} navigationItem - Navigation item to validate
 * @returns {boolean} - True if the navigation item is valid
 */
export const isValidNavigationItem = (navigationItem: any): boolean => {
  return (
    navigationItem &&
    typeof navigationItem.linkTo === 'string' &&
    typeof navigationItem.pathName === 'string' &&
    navigationItem.icon &&
    navigationItem.iconFill
  );
};

/**
 * Creates a notification status entity from raw data.
 * 
 * @param {boolean} hasPendingNotifications - Whether there are pending notifications
 * @param {boolean} hasUnreadChats - Whether there are unread chats
 * @param {boolean} isLoading - Whether data is currently loading
 * @returns {NotificationStatusEntity} - Formatted notification status
 */
export const createNotificationStatus = (
  hasPendingNotifications: boolean,
  hasUnreadChats: boolean,
  isLoading: boolean
): NotificationStatusEntity => ({
  hasPendingNotification: hasPendingNotifications,
  hasUnreadChat: hasUnreadChats,
  isLoading
});
