/**
 * Domain entities for the navbar feature.
 * These represent the core business concepts and are framework-agnostic.
 */

/**
 * Represents the navigation status and configuration for a single navigation item.
 */
export interface NavigationItemEntity {
  linkTo: string;
  pathName: string;
  icon: React.ReactNode;
  iconFill: React.ReactNode;
}

/**
 * Represents the notification and chat status for the navbar.
 */
export interface NotificationStatusEntity {
  hasPendingNotification: boolean;
  hasUnreadChat: boolean;
  isLoading: boolean;
}

/**
 * Represents a navigation menu item configuration.
 */
export interface NavigationMenuEntity {
  to: string;
  text: string;
  Component: React.ReactNode;
}

/**
 * Type for navigation items collection.
 */
export type NavigationItemsEntity = {
  mainItems: NavigationItemEntity[];
  chat: NavigationItemEntity;
  profile: NavigationItemEntity;
  notification: NavigationItemEntity;
};
