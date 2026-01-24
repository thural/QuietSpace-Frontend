/**
 * Navbar Cache Keys
 * 
 * Centralized cache key management for navbar feature
 * following enterprise caching patterns with intelligent TTL strategies
 */

// Base cache key prefix
const NAVBAR_BASE = 'navbar';

/**
 * Cache key factory functions for navbar data
 */
export const NAVBAR_CACHE_KEYS = {
  // Navigation data
  NAVIGATION_ITEMS: (userId?: string) => 
    `${NAVBAR_BASE}:navigation:${userId || 'anonymous'}`,
  
  // Notification status
  NOTIFICATION_STATUS: (userId: string) => 
    `${NAVBAR_BASE}:notification:status:${userId}`,
  
  // Chat status
  CHAT_STATUS: (userId: string) => 
    `${NAVBAR_BASE}:chat:status:${userId}`,
  
  // User profile summary
  USER_PROFILE_SUMMARY: (userId: string) => 
    `${NAVBAR_BASE}:user:profile:${userId}`,
  
  // Active navigation state
  ACTIVE_NAVIGATION: (userId: string, path: string) => 
    `${NAVBAR_BASE}:active:${userId}:${path}`,
  
  // Quick actions
  QUICK_ACTIONS: (userId: string) => 
    `${NAVBAR_BASE}:quick:actions:${userId}`,
  
  // Search suggestions
  SEARCH_SUGGESTIONS: (query: string, userId?: string) => 
    `${NAVBAR_BASE}:search:suggestions:${query}:${userId || 'anonymous'}`,
  
  // Recent navigation
  RECENT_NAVIGATION: (userId: string) => 
    `${NAVBAR_BASE}:recent:${userId}`,
  
  // Preferences
  USER_PREFERENCES: (userId: string) => 
    `${NAVBAR_BASE}:preferences:${userId}`,
  
  // Theme configuration
  THEME_CONFIG: (userId?: string) => 
    `${NAVBAR_BASE}:theme:${userId || 'anonymous'}`,
  
  // Accessibility settings
  ACCESSIBILITY_SETTINGS: (userId: string) => 
    `${NAVBAR_BASE}:accessibility:${userId}`,
  
  // Mobile navigation state
  MOBILE_NAV_STATE: (userId: string) => 
    `${NAVBAR_BASE}:mobile:state:${userId}`,
  
  // Notification badges
  NOTIFICATION_BADGES: (userId: string) => 
    `${NAVBAR_BASE}:badges:${userId}`,
  
  // System status
  SYSTEM_STATUS: () => 
    `${NAVBAR_BASE}:system:status`,
  
  // Feature flags
  FEATURE_FLAGS: (userId?: string) => 
    `${NAVBAR_BASE}:features:${userId || 'anonymous'}`
};

/**
 * TTL configurations for navbar cache entries
 * Optimized for real-time user experience with appropriate refresh rates
 */
export const NAVBAR_CACHE_TTL = {
  // Navigation items - cached for 30 minutes (rarely changes)
  NAVIGATION_ITEMS: 30 * 60 * 1000, // 30 minutes
  
  // Notification status - cached for 2 minutes (real-time updates)
  NOTIFICATION_STATUS: 2 * 60 * 1000, // 2 minutes
  
  // Chat status - cached for 1 minute (real-time updates)
  CHAT_STATUS: 1 * 60 * 1000, // 1 minute
  
  // User profile summary - cached for 15 minutes
  USER_PROFILE_SUMMARY: 15 * 60 * 1000, // 15 minutes
  
  // Active navigation - cached for 5 minutes
  ACTIVE_NAVIGATION: 5 * 60 * 1000, // 5 minutes
  
  // Quick actions - cached for 10 minutes
  QUICK_ACTIONS: 10 * 60 * 1000, // 10 minutes
  
  // Search suggestions - cached for 30 seconds (user-specific)
  SEARCH_SUGGESTIONS: 30 * 1000, // 30 seconds
  
  // Recent navigation - cached for 1 hour
  RECENT_NAVIGATION: 60 * 60 * 1000, // 1 hour
  
  // User preferences - cached for 1 hour
  USER_PREFERENCES: 60 * 60 * 1000, // 1 hour
  
  // Theme configuration - cached for 24 hours
  THEME_CONFIG: 24 * 60 * 60 * 1000, // 24 hours
  
  // Accessibility settings - cached for 1 hour
  ACCESSIBILITY_SETTINGS: 60 * 60 * 1000, // 1 hour
  
  // Mobile navigation state - cached for 30 minutes
  MOBILE_NAV_STATE: 30 * 60 * 1000, // 30 minutes
  
  // Notification badges - cached for 2 minutes
  NOTIFICATION_BADGES: 2 * 60 * 1000, // 2 minutes
  
  // System status - cached for 5 minutes
  SYSTEM_STATUS: 5 * 60 * 1000, // 5 minutes
  
  // Feature flags - cached for 15 minutes
  FEATURE_FLAGS: 15 * 60 * 1000, // 15 minutes
};

/**
 * Cache invalidation patterns for navbar data
 * Provides intelligent cache invalidation based on user actions and system events
 */
export const NAVBAR_CACHE_INVALIDATION = {
  // Invalidate all navbar data for a user
  invalidateUserNavbar: (userId: string) => [
    NAVBAR_CACHE_KEYS.NAVIGATION_ITEMS(userId),
    NAVBAR_CACHE_KEYS.NOTIFICATION_STATUS(userId),
    NAVBAR_CACHE_KEYS.CHAT_STATUS(userId),
    NAVBAR_CACHE_KEYS.USER_PROFILE_SUMMARY(userId),
    NAVBAR_CACHE_KEYS.QUICK_ACTIONS(userId),
    NAVBAR_CACHE_KEYS.RECENT_NAVIGATION(userId),
    NAVBAR_CACHE_KEYS.USER_PREFERENCES(userId),
    NAVBAR_CACHE_KEYS.ACCESSIBILITY_SETTINGS(userId),
    NAVBAR_CACHE_KEYS.MOBILE_NAV_STATE(userId),
    NAVBAR_CACHE_KEYS.NOTIFICATION_BADGES(userId),
    NAVBAR_CACHE_KEYS.FEATURE_FLAGS(userId)
  ],
  
  // Invalidate notification-related data
  invalidateNotifications: (userId: string) => [
    NAVBAR_CACHE_KEYS.NOTIFICATION_STATUS(userId),
    NAVBAR_CACHE_KEYS.NOTIFICATION_BADGES(userId),
    NAVBAR_CACHE_KEYS.QUICK_ACTIONS(userId)
  ],
  
  // Invalidate chat-related data
  invalidateChat: (userId: string) => [
    NAVBAR_CACHE_KEYS.CHAT_STATUS(userId),
    NAVBAR_CACHE_KEYS.NOTIFICATION_BADGES(userId),
    NAVBAR_CACHE_KEYS.QUICK_ACTIONS(userId)
  ],
  
  // Invalidate user profile data
  invalidateUserProfile: (userId: string) => [
    NAVBAR_CACHE_KEYS.USER_PROFILE_SUMMARY(userId),
    NAVBAR_CACHE_KEYS.USER_PREFERENCES(userId),
    NAVBAR_CACHE_KEYS.THEME_CONFIG(userId),
    NAVBAR_CACHE_KEYS.ACCESSIBILITY_SETTINGS(userId)
  ],
  
  // Invalidate navigation data
  invalidateNavigation: (userId?: string) => [
    NAVBAR_CACHE_KEYS.NAVIGATION_ITEMS(userId),
    NAVBAR_CACHE_KEYS.ACTIVE_NAVIGATION(userId || 'anonymous', '*'),
    NAVBAR_CACHE_KEYS.RECENT_NAVIGATION(userId || 'anonymous')
  ],
  
  // Invalidate search data
  invalidateSearch: (userId?: string) => [
    NAVBAR_CACHE_KEYS.SEARCH_SUGGESTIONS('*', userId)
  ],
  
  // Invalidate theme and preferences
  invalidatePreferences: (userId: string) => [
    NAVBAR_CACHE_KEYS.USER_PREFERENCES(userId),
    NAVBAR_CACHE_KEYS.THEME_CONFIG(userId),
    NAVBAR_CACHE_KEYS.ACCESSIBILITY_SETTINGS(userId),
    NAVBAR_CACHE_KEYS.MOBILE_NAV_STATE(userId)
  ],
  
  // Invalidate all system-level data
  invalidateSystemData: () => [
    NAVBAR_CACHE_KEYS.SYSTEM_STATUS(),
    NAVBAR_CACHE_KEYS.FEATURE_FLAGS()
  ]
};

/**
 * Cache warming strategies for navbar
 * Preloads frequently accessed data for optimal user experience
 */
export const NAVBAR_CACHE_WARMING = {
  // Warm essential navbar data for user
  warmEssentialData: (userId: string) => [
    NAVBAR_CACHE_KEYS.NAVIGATION_ITEMS(userId),
    NAVBAR_CACHE_KEYS.NOTIFICATION_STATUS(userId),
    NAVBAR_CACHE_KEYS.CHAT_STATUS(userId),
    NAVBAR_CACHE_KEYS.USER_PROFILE_SUMMARY(userId),
    NAVBAR_CACHE_KEYS.NOTIFICATION_BADGES(userId)
  ],
  
  // Warm navigation and preferences
  warmNavigationData: (userId: string) => [
    NAVBAR_CACHE_KEYS.NAVIGATION_ITEMS(userId),
    NAVBAR_CACHE_KEYS.USER_PREFERENCES(userId),
    NAVBAR_CACHE_KEYS.THEME_CONFIG(userId),
    NAVBAR_CACHE_KEYS.ACCESSIBILITY_SETTINGS(userId)
  ],
  
  // Warm real-time data
  warmRealTimeData: (userId: string) => [
    NAVBAR_CACHE_KEYS.NOTIFICATION_STATUS(userId),
    NAVBAR_CACHE_KEYS.CHAT_STATUS(userId),
    NAVBAR_CACHE_KEYS.NOTIFICATION_BADGES(userId),
    NAVBAR_CACHE_KEYS.SYSTEM_STATUS()
  ],
  
  // Warm search suggestions for common queries
  warmSearchSuggestions: (userId: string) => [
    NAVBAR_CACHE_KEYS.SEARCH_SUGGESTIONS('home', userId),
    NAVBAR_CACHE_KEYS.SEARCH_SUGGESTIONS('profile', userId),
    NAVBAR_CACHE_KEYS.SEARCH_SUGGESTIONS('settings', userId),
    NAVBAR_CACHE_KEYS.SEARCH_SUGGESTIONS('notifications', userId)
  ]
};

/**
 * Cache monitoring and analytics configuration
 */
export const NAVBAR_CACHE_MONITORING = {
  // Track cache hit rates for critical navbar data
  criticalKeys: [
    'NAVIGATION_ITEMS',
    'NOTIFICATION_STATUS',
    'CHAT_STATUS',
    'USER_PROFILE_SUMMARY'
  ],
  
  // Monitor cache performance metrics
  performanceMetrics: {
    hitRateThreshold: 0.8, // 80% hit rate expected
    responseTimeThreshold: 50, // 50ms max response time
    memoryUsageThreshold: 0.7 // 70% memory usage threshold
  },
  
  // Analytics events to track
  analyticsEvents: [
    'navbar_cache_hit',
    'navbar_cache_miss',
    'navbar_cache_invalidation',
    'navbar_cache_warming',
    'navbar_cache_error'
  ]
};
