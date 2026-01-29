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
 * Represents user profile summary information.
 */
export interface UserProfileSummaryEntity {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  email?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

/**
 * Represents user preferences and settings.
 */
export interface UserPreferencesEntity {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  sounds: boolean;
  autoPlay: boolean;
}

/**
 * Represents theme configuration.
 */
export interface ThemeConfigEntity {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  mode: 'light' | 'dark';
  customCSS?: string;
}

/**
 * Represents search suggestions for autocomplete.
 */
export interface SearchSuggestionsEntity {
  id: string;
  text: string;
  type: 'user' | 'post' | 'tag' | 'location';
  metadata?: Record<string, any>;
}

/**
 * Represents quick actions available to the user.
 */
export interface QuickActionsEntity {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: string;
  shortcut?: string;
  enabled: boolean;
}

/**
 * Represents system status information.
 */
export interface SystemStatusEntity {
  status: 'online' | 'offline' | 'maintenance';
  message?: string;
  lastChecked: Date;
  services: {
    api: boolean;
    websocket: boolean;
    cache: boolean;
  };
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
