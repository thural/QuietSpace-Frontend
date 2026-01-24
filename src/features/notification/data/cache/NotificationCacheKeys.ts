/**
 * Notification Cache Keys
 * 
 * Centralized cache key factory functions for notification-related data
 * with enterprise-grade TTL strategies for real-time notifications and push updates
 */

// Base cache key prefix
const NOTIFICATION_BASE = 'notification';

/**
 * Cache key factory functions for notifications
 */
export const NOTIFICATION_CACHE_KEYS = {
  // User notification lists
  USER_NOTIFICATIONS: (userId: string, page: number = 0, size: number = 20) => 
    `${NOTIFICATION_BASE}:user:${userId}:notifications:${page}:${size}`,
  
  // Notification by type
  NOTIFICATIONS_BY_TYPE: (userId: string, type: string, page: number = 0, size: number = 20) => 
    `${NOTIFICATION_BASE}:user:${userId}:type:${type}:${page}:${size}`,
  
  // Unread notifications count
  UNREAD_COUNT: (userId: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:unread_count`,
  
  // Individual notification
  NOTIFICATION: (notificationId: string) => 
    `${NOTIFICATION_BASE}:item:${notificationId}`,
  
  // Notification settings
  SETTINGS: (userId: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:settings`,
  
  // Push notification status
  PUSH_STATUS: (userId: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:push_status`,
  
  // Push subscription
  PUSH_SUBSCRIPTION: (userId: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:push_subscription`,
  
  // Notification preferences
  PREFERENCES: (userId: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:preferences`,
  
  // Notification history
  HISTORY: (userId: string, period: string = '24h') => 
    `${NOTIFICATION_BASE}:user:${userId}:history:${period}`,
  
  // Real-time notification queue
  REALTIME_QUEUE: (userId: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:realtime_queue`,
  
  // Notification templates
  TEMPLATES: (type?: string) => 
    type ? `${NOTIFICATION_BASE}:templates:${type}` : `${NOTIFICATION_BASE}:templates`,
  
  // Notification statistics
  STATS: (userId: string, period: string = '24h') => 
    `${NOTIFICATION_BASE}:user:${userId}:stats:${period}`,
  
  // Notification delivery status
  DELIVERY_STATUS: (notificationId: string) => 
    `${NOTIFICATION_BASE}:delivery:${notificationId}`,
  
  // Failed notifications
  FAILED_NOTIFICATIONS: (userId: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:failed`,
  
  // Scheduled notifications
  SCHEDULED_NOTIFICATIONS: (userId: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:scheduled`,
  
  // Notification rate limiting
  RATE_LIMIT: (userId: string, action: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:rate_limit:${action}`,
  
  // Notification search results
  SEARCH_RESULTS: (userId: string, query: string, page: number = 0) => 
    `${NOTIFICATION_BASE}:user:${userId}:search:${encodeURIComponent(query)}:${page}`,
  
  // Notification filters
  FILTERED_NOTIFICATIONS: (userId: string, filterHash: string, page: number = 0) => 
    `${NOTIFICATION_BASE}:user:${userId}:filtered:${filterHash}:${page}`,
  
  // Notification batches (for bulk operations)
  BATCH: (batchId: string) => 
    `${NOTIFICATION_BASE}:batch:${batchId}`,
  
  // Notification metadata
  METADATA: (notificationId: string) => 
    `${NOTIFICATION_BASE}:metadata:${notificationId}`,
  
  // Notification analytics
  ANALYTICS: (userId: string, metric: string, period: string = '24h') => 
    `${NOTIFICATION_BASE}:user:${userId}:analytics:${metric}:${period}`,
  
  // Notification device tokens
  DEVICE_TOKENS: (userId: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:device_tokens`,
  
  // Notification quiet hours
  QUIET_HOURS: (userId: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:quiet_hours`,
  
  // Notification categories
  CATEGORIES: (userId: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:categories`,
  
  // Notification priority queue
  PRIORITY_QUEUE: (priority: string) => 
    `${NOTIFICATION_BASE}:priority:${priority}`,
  
  // Notification system status
  SYSTEM_STATUS: () => 
    `${NOTIFICATION_BASE}:system:status`,
  
  // Notification performance metrics
  PERFORMANCE_METRICS: (userId: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:performance`,
  
  // Notification A/B test variants
  AB_TEST_VARIANT: (userId: string, testId: string) => 
    `${NOTIFICATION_BASE}:user:${userId}:ab_test:${testId}`
};

/**
 * TTL (Time To Live) strategies for notification cache
 * Optimized for real-time notifications and push delivery
 */
export const NOTIFICATION_CACHE_TTL = {
  // Real-time data - very short TTL for immediate updates
  UNREAD_COUNT: 30 * 1000, // 30 seconds - real-time updates
  REALTIME_QUEUE: 10 * 1000, // 10 seconds - immediate processing
  PUSH_STATUS: 60 * 1000, // 1 minute - push status changes
  
  // User notifications - medium TTL for balance
  USER_NOTIFICATIONS: 2 * 60 * 1000, // 2 minutes - frequent updates
  NOTIFICATIONS_BY_TYPE: 2 * 60 * 1000, // 2 minutes - type-specific updates
  SEARCH_RESULTS: 60 * 1000, // 1 minute - search freshness
  
  // Individual notifications - longer TTL
  NOTIFICATION: 15 * 60 * 1000, // 15 minutes - stable data
  DELIVERY_STATUS: 5 * 60 * 1000, // 5 minutes - delivery tracking
  
  // Settings and preferences - longer TTL
  SETTINGS: 30 * 60 * 1000, // 30 minutes - user preferences
  PREFERENCES: 30 * 60 * 1000, // 30 minutes - notification preferences
  PUSH_SUBSCRIPTION: 60 * 60 * 1000, // 1 hour - subscription stability
  DEVICE_TOKENS: 60 * 60 * 1000, // 1 hour - device tokens
  
  // Analytics and statistics - longer TTL
  STATS: 10 * 60 * 1000, // 10 minutes - analytics data
  ANALYTICS: 10 * 60 * 1000, // 10 minutes - analytics metrics
  PERFORMANCE_METRICS: 5 * 60 * 1000, // 5 minutes - performance data
  
  // History and logs - longer TTL
  HISTORY: 60 * 60 * 1000, // 1 hour - historical data
  FAILED_NOTIFICATIONS: 30 * 60 * 1000, // 30 minutes - failure tracking
  
  // System data - longer TTL
  SYSTEM_STATUS: 2 * 60 * 1000, // 2 minutes - system monitoring
  TEMPLATES: 60 * 60 * 1000, // 1 hour - template stability
  CATEGORIES: 30 * 60 * 1000, // 30 minutes - category definitions
  
  // Rate limiting - short TTL for enforcement
  RATE_LIMIT: 60 * 1000, // 1 minute - rate limiting
  
  // Batch operations - medium TTL
  BATCH: 10 * 60 * 1000, // 10 minutes - batch processing
  SCHEDULED_NOTIFICATIONS: 5 * 60 * 1000, // 5 minutes - scheduled updates
  
  // A/B testing - longer TTL
  AB_TEST_VARIANT: 24 * 60 * 60 * 1000, // 24 hours - test consistency
  
  // Quiet hours - longer TTL
  QUIET_HOURS: 60 * 60 * 1000, // 1 hour - quiet hour settings
  
  // Metadata - longer TTL
  METADATA: 30 * 60 * 1000, // 30 minutes - metadata stability
  
  // Priority queue - very short TTL
  PRIORITY_QUEUE: 15 * 1000, // 15 seconds - priority processing
  
  // Filtered results - medium TTL
  FILTERED_NOTIFICATIONS: 90 * 1000 // 1.5 minutes - filtered data
};

/**
 * Cache invalidation patterns for notifications
 * Provides intelligent cache invalidation strategies
 */
export const NOTIFICATION_CACHE_INVALIDATION = {
  // Invalidate all user notification caches
  invalidateUserNotifications: (userId: string) => [
    `${NOTIFICATION_BASE}:user:${userId}:notifications:*`,
    `${NOTIFICATION_BASE}:user:${userId}:type:*`,
    `${NOTIFICATION_BASE}:user:${userId}:unread_count`,
    `${NOTIFICATION_BASE}:user:${userId}:search:*`,
    `${NOTIFICATION_BASE}:user:${userId}:filtered:*`
  ],
  
  // Invalidate notification-specific caches
  invalidateNotification: (notificationId: string) => [
    `${NOTIFICATION_BASE}:item:${notificationId}`,
    `${NOTIFICATION_BASE}:delivery:${notificationId}`,
    `${NOTIFICATION_BASE}:metadata:${notificationId}`
  ],
  
  // Invalidate user settings and preferences
  invalidateUserSettings: (userId: string) => [
    `${NOTIFICATION_BASE}:user:${userId}:settings`,
    `${NOTIFICATION_BASE}:user:${userId}:preferences`,
    `${NOTIFICATION_BASE}:user:${userId}:push_status`,
    `${NOTIFICATION_BASE}:user:${userId}:push_subscription`,
    `${NOTIFICATION_BASE}:user:${userId}:quiet_hours`,
    `${NOTIFICATION_BASE}:user:${userId}:device_tokens`
  ],
  
  // invalidate analytics and stats
  invalidateUserAnalytics: (userId: string) => [
    `${NOTIFICATION_BASE}:user:${userId}:stats:*`,
    `${NOTIFICATION_BASE}:user:${userId}:analytics:*`,
    `${NOTIFICATION_BASE}:user:${userId}:performance`,
    `${NOTIFICATION_BASE}:user:${userId}:history:*`
  ],
  
  // Invalidate real-time and push caches
  invalidateRealtimeCaches: (userId: string) => [
    `${NOTIFICATION_BASE}:user:${userId}:realtime_queue`,
    `${NOTIFICATION_BASE}:user:${userId}:push_status`,
    `${NOTIFICATION_BASE}:priority:*`
  ],
  
  // Invalidate all notification caches for user
  invalidateAllUserCaches: (userId: string) => [
    `${NOTIFICATION_BASE}:user:${userId}:*`
  ],
  
  // Invalidate system-wide caches
  invalidateSystemCaches: () => [
    `${NOTIFICATION_BASE}:system:*`,
    `${NOTIFICATION_BASE}:templates:*`,
    `${NOTIFICATION_BASE}:categories:*`
  ],
  
  // Invalidate batch operation caches
  invalidateBatchCaches: () => [
    `${NOTIFICATION_BASE}:batch:*`,
    `${NOTIFICATION_BASE}:scheduled:*`,
    `${NOTIFICATION_BASE}:failed:*`
  ],
  
  // Invalidate all notification caches (emergency)
  invalidateAllNotificationCaches: () => [
    `${NOTIFICATION_BASE}:*`
  ]
};

/**
 * Cache key utilities
 */
export const NotificationCacheUtils = {
  /**
   * Generate a filter hash for consistent cache keys
   */
  generateFilterHash(filters: Record<string, any>): string {
    const sortedKeys = Object.keys(filters).sort();
    const filterString = sortedKeys.map(key => `${key}:${filters[key]}`).join('|');
    return btoa(filterString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  },
  
  /**
   * Extract user ID from cache key
   */
  extractUserIdFromKey(cacheKey: string): string | null {
    const match = cacheKey.match(/notification:user:([^:]+):/);
    return match ? match[1] : null;
  },
  
  /**
   * Check if cache key is for real-time data
   */
  isRealtimeKey(cacheKey: string): boolean {
    return cacheKey.includes('realtime_queue') || 
           cacheKey.includes('push_status') || 
           cacheKey.includes('priority_queue');
  },
  
  /**
   * Get TTL for cache key
   */
  getTTLForKey(cacheKey: string): number {
    if (cacheKey.includes('unread_count')) return NOTIFICATION_CACHE_TTL.UNREAD_COUNT;
    if (cacheKey.includes('realtime_queue')) return NOTIFICATION_CACHE_TTL.REALTIME_QUEUE;
    if (cacheKey.includes('push_status')) return NOTIFICATION_CACHE_TTL.PUSH_STATUS;
    if (cacheKey.includes('notifications')) return NOTIFICATION_CACHE_TTL.USER_NOTIFICATIONS;
    if (cacheKey.includes('settings')) return NOTIFICATION_CACHE_TTL.SETTINGS;
    if (cacheKey.includes('stats')) return NOTIFICATION_CACHE_TTL.STATS;
    if (cacheKey.includes('analytics')) return NOTIFICATION_CACHE_TTL.ANALYTICS;
    if (cacheKey.includes('rate_limit')) return NOTIFICATION_CACHE_TTL.RATE_LIMIT;
    return NOTIFICATION_CACHE_TTL.USER_NOTIFICATIONS; // Default TTL
  }
};
