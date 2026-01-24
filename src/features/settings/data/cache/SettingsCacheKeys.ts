/**
 * Settings Cache Keys.
 * 
 * Centralized cache key management for settings feature
 * following enterprise caching patterns.
 */

export const SETTINGS_CACHE_KEYS = {
  // Profile settings
  PROFILE_SETTINGS: (userId: string) => `settings:profile:${userId}`,
  PROFILE_PHOTO: (userId: string) => `settings:profile:photo:${userId}`,
  
  // Privacy settings
  PRIVACY_SETTINGS: (userId: string) => `settings:privacy:${userId}`,
  
  // Notification settings
  NOTIFICATION_SETTINGS: (userId: string) => `settings:notifications:${userId}`,
  
  // Sharing settings
  SHARING_SETTINGS: (userId: string) => `settings:sharing:${userId}`,
  
  // Mentions settings
  MENTIONS_SETTINGS: (userId: string) => `settings:mentions:${userId}`,
  
  // Replies settings
  REPLIES_SETTINGS: (userId: string) => `settings:replies:${userId}`,
  
  // Blocking settings
  BLOCKING_SETTINGS: (userId: string) => `settings:blocking:${userId}`,
  
  // Combined settings
  ALL_SETTINGS: (userId: string) => `settings:all:${userId}`,
  USER_SETTINGS_SUMMARY: (userId: string) => `settings:summary:${userId}`,
  
  // Pattern invalidation keys
  USER_SETTINGS_PATTERN: (userId: string) => `settings:*:${userId}`,
  ALL_SETTINGS_PATTERN: 'settings:*'
};

export const SETTINGS_CACHE_TTL = {
  PROFILE_SETTINGS: 10 * 60 * 1000,      // 10 minutes
  PRIVACY_SETTINGS: 15 * 60 * 1000,     // 15 minutes
  NOTIFICATION_SETTINGS: 10 * 60 * 1000, // 10 minutes
  SHARING_SETTINGS: 20 * 60 * 1000,      // 20 minutes
  MENTIONS_SETTINGS: 15 * 60 * 1000,     // 15 minutes
  REPLIES_SETTINGS: 15 * 60 * 1000,      // 15 minutes
  BLOCKING_SETTINGS: 5 * 60 * 1000,      // 5 minutes
  ALL_SETTINGS: 5 * 60 * 1000,           // 5 minutes
  DEFAULT: 10 * 60 * 1000                 // 10 minutes default
};

export const SETTINGS_CACHE_INVALIDATION = {
  // Invalidate all user settings when profile changes
  PROFILE_UPDATE: (userId: string) => [
    SETTINGS_CACHE_KEYS.PROFILE_SETTINGS(userId),
    SETTINGS_CACHE_KEYS.ALL_SETTINGS(userId),
    SETTINGS_CACHE_KEYS.USER_SETTINGS_SUMMARY(userId)
  ],
  
  // Invalidate privacy-related settings
  PRIVACY_UPDATE: (userId: string) => [
    SETTINGS_CACHE_KEYS.PRIVACY_SETTINGS(userId),
    SETTINGS_CACHE_KEYS.ALL_SETTINGS(userId),
    SETTINGS_CACHE_KEYS.USER_SETTINGS_SUMMARY(userId)
  ],
  
  // Invalidate notification-related settings
  NOTIFICATION_UPDATE: (userId: string) => [
    SETTINGS_CACHE_KEYS.NOTIFICATION_SETTINGS(userId),
    SETTINGS_CACHE_KEYS.ALL_SETTINGS(userId),
    SETTINGS_CACHE_KEYS.USER_SETTINGS_SUMMARY(userId)
  ],
  
  // Invalidate all settings for user
  ALL_USER_SETTINGS: (userId: string) => [
    SETTINGS_CACHE_KEYS.USER_SETTINGS_PATTERN(userId)
  ]
};
