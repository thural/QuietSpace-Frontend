/**
 * Profile Cache Keys
 * 
 * Centralized cache key factory functions for profile-related data
 * with enterprise-grade TTL strategies for user profile management
 */

// Base cache key prefix
const PROFILE_BASE = 'profile';

/**
 * Cache key factory functions for profiles
 */
export const PROFILE_CACHE_KEYS = {
  // User profiles
  USER_PROFILE: (userId: string | number) => 
    `${PROFILE_BASE}:user:${userId}`,
  
  // Current user profile
  CURRENT_USER_PROFILE: () => 
    `${PROFILE_BASE}:current:user`,
  
  // User profile statistics
  USER_STATS: (userId: string | number) => 
    `${PROFILE_BASE}:stats:${userId}`,
  
  // User followers
  USER_FOLLOWERS: (userId: string | number, page: number = 0, size: number = 50) => 
    `${PROFILE_BASE}:followers:${userId}:${page}:${size}`,
  
  // User followings
  USER_FOLLOWINGS: (userId: string | number, page: number = 0, size: number = 50) => 
    `${PROFILE_BASE}:followings:${userId}:${page}:${size}`,
  
  // User connections (both followers and followings)
  USER_CONNECTIONS: (userId: string | number) => 
    `${PROFILE_BASE}:connections:${userId}`,
  
  // User search results
  USER_SEARCH: (query: string, page: number = 0, size: number = 20) => 
    `${PROFILE_BASE}:search:${encodeURIComponent(query)}:${page}:${size}`,
  
  // User suggestions
  USER_SUGGESTIONS: (userId: string | number, limit: number = 10) => 
    `${PROFILE_BASE}:suggestions:${userId}:${limit}`,
  
  // User activity
  USER_ACTIVITY: (userId: string | number, period: string = '7d', page: number = 0, size: number = 20) => 
    `${PROFILE_BASE}:activity:${userId}:${period}:${page}:${size}`,
  
  // User settings
  USER_SETTINGS: (userId: string | number) => 
    `${PROFILE_BASE}:settings:${userId}`,
  
  // User preferences
  USER_PREFERENCES: (userId: string | number) => 
    `${PROFILE_BASE}:preferences:${userId}`,
  
  // User privacy settings
  USER_PRIVACY: (userId: string | number) => 
    `${PROFILE_BASE}:privacy:${userId}`,
  
  // User notifications settings
  USER_NOTIFICATIONS_SETTINGS: (userId: string | number) => 
    `${PROFILE_BASE}:notifications:${userId}`,
  
  // User security settings
  USER_SECURITY: (userId: string | number) => 
    `${PROFILE_BASE}:security:${userId}`,
  
  // User achievements
  USER_ACHIEVEMENTS: (userId: string | number, page: number = 0, size: number = 20) => 
    `${PROFILE_BASE}:achievements:${userId}:${page}:${size}`,
  
  // User badges
  USER_BADGES: (userId: string | number) => 
    `${PROFILE_BASE}:badges:${userId}`,
  
  // User reputation
  USER_REPUTATION: (userId: string | number) => 
    `${PROFILE_BASE}:reputation:${userId}`,
  
  // User engagement metrics
  USER_ENGAGEMENT: (userId: string | number, period: string = '30d') => 
    `${PROFILE_BASE}:engagement:${userId}:${period}`,
  
  // User online status
  USER_ONLINE_STATUS: (userId: string | number) => 
    `${PROFILE_BASE}:online:${userId}`,
  
  // User last seen
  USER_LAST_SEEN: (userId: string | number) => 
    `${PROFILE_BASE}:lastseen:${userId}`,
  
  // User profile views
  PROFILE_VIEWS: (userId: string | number, period: string = '7d') => 
    `${PROFILE_BASE}:views:${userId}:${period}`,
  
  // User mutual connections
  USER_MUTUAL_CONNECTIONS: (userId1: string | number, userId2: string | number) => 
    `${PROFILE_BASE}:mutual:${userId1}:${userId2}`,
  
  // User blocked users
  USER_BLOCKED: (userId: string | number, page: number = 0, size: number = 50) => 
    `${PROFILE_BASE}:blocked:${userId}:${page}:${size}`,
  
  // User muted users
  USER_MUTED: (userId: string | number, page: number = 0, size: number = 50) => 
    `${PROFILE_BASE}:muted:${userId}:${page}:${size}`,
  
  // User profile completion
  PROFILE_COMPLETION: (userId: string | number) => 
    `${PROFILE_BASE}:completion:${userId}`,
  
  // User verification status
  USER_VERIFICATION: (userId: string | number) => 
    `${PROFILE_BASE}:verification:${userId}`,
  
  // User profile analytics
  PROFILE_ANALYTICS: (userId: string | number, period: string = '30d') => 
    `${PROFILE_BASE}:analytics:${userId}:${period}`,
  
  // User social links
  USER_SOCIAL_LINKS: (userId: string | number) => 
    `${PROFILE_BASE}:social:${userId}`,
  
  // User interests
  USER_INTERESTS: (userId: string | number) => 
    `${PROFILE_BASE}:interests:${userId}`,
  
  // User skills
  USER_SKILLS: (userId: string | number) => 
    `${PROFILE_BASE}:skills:${userId}`,
  
  // User education
  USER_EDUCATION: (userId: string | number) => 
    `${PROFILE_BASE}:education:${userId}`,
  
  // User work experience
  USER_WORK_EXPERIENCE: (userId: string | number) => 
    `${PROFILE_BASE}:work:${userId}`,
  
  // User portfolio
  USER_PORTFOLIO: (userId: string | number, page: number = 0, size: number = 20) => 
    `${PROFILE_BASE}:portfolio:${userId}:${page}:${size}`,
  
  // User testimonials
  USER_TESTIMONIALS: (userId: string | number, page: number = 0, size: number = 10) => 
    `${PROFILE_BASE}:testimonials:${userId}:${page}:${size}`,
  
  // User recommendations
  USER_RECOMMENDATIONS: (userId: string | number, page: number = 0, size: number = 10) => 
    `${PROFILE_BASE}:recommendations:${userId}:${page}:${size}`,
  
  // Cache statistics
  CACHE_STATS: () => 
    `${PROFILE_BASE}:cache:stats`,
  
  // System health
  SYSTEM_HEALTH: () => 
    `${PROFILE_BASE}:system:health`
};

/**
 * TTL (Time To Live) strategies for profile cache
 * Optimized for user profile management with appropriate caching durations
 */
export const PROFILE_CACHE_TTL = {
  // User profiles - medium TTL for profile data
  USER_PROFILE: 15 * 60 * 1000, // 15 minutes
  CURRENT_USER_PROFILE: 5 * 60 * 1000, // 5 minutes (more frequent for current user)
  
  // User statistics - medium TTL
  USER_STATS: 10 * 60 * 1000, // 10 minutes
  
  // User connections - longer TTL for follower/following data
  USER_FOLLOWERS: 30 * 60 * 1000, // 30 minutes
  USER_FOLLOWINGS: 30 * 60 * 1000, // 30 minutes
  USER_CONNECTIONS: 30 * 60 * 1000, // 30 minutes
  
  // Search results - short TTL for fresh results
  USER_SEARCH: 2 * 60 * 1000, // 2 minutes
  USER_SUGGESTIONS: 10 * 60 * 1000, // 10 minutes
  
  // User activity - short TTL for real-time data
  USER_ACTIVITY: 1 * 60 * 1000, // 1 minute
  
  // User settings - long TTL for settings data
  USER_SETTINGS: 60 * 60 * 1000, // 1 hour
  USER_PREFERENCES: 60 * 60 * 1000, // 1 hour
  USER_PRIVACY: 60 * 60 * 1000, // 1 hour
  USER_NOTIFICATIONS_SETTINGS: 60 * 60 * 1000, // 1 hour
  USER_SECURITY: 60 * 60 * 1000, // 1 hour
  
  // User achievements and badges - long TTL
  USER_ACHIEVEMENTS: 60 * 60 * 1000, // 1 hour
  USER_BADGES: 60 * 60 * 1000, // 1 hour
  USER_REPUTATION: 30 * 60 * 1000, // 30 minutes
  
  // User engagement - medium TTL
  USER_ENGAGEMENT: 15 * 60 * 1000, // 15 minutes
  
  // Online status - very short TTL for real-time data
  USER_ONLINE_STATUS: 30 * 1000, // 30 seconds
  USER_LAST_SEEN: 5 * 60 * 1000, // 5 minutes
  
  // Profile views - medium TTL
  PROFILE_VIEWS: 10 * 60 * 1000, // 10 minutes
  
  // Mutual connections - medium TTL
  USER_MUTUAL_CONNECTIONS: 20 * 60 * 1000, // 20 minutes
  
  // Blocked and muted users - medium TTL
  USER_BLOCKED: 30 * 60 * 1000, // 30 minutes
  USER_MUTED: 30 * 60 * 1000, // 30 minutes
  
  // Profile completion - medium TTL
  PROFILE_COMPLETION: 10 * 60 * 1000, // 10 minutes
  
  // Verification status - long TTL
  USER_VERIFICATION: 60 * 60 * 1000, // 1 hour
  
  // Profile analytics - medium TTL
  PROFILE_ANALYTICS: 15 * 60 * 1000, // 15 minutes
  
  // Social links and interests - long TTL
  USER_SOCIAL_LINKS: 60 * 60 * 1000, // 1 hour
  USER_INTERESTS: 60 * 60 * 1000, // 1 hour
  USER_SKILLS: 60 * 60 * 1000, // 1 hour
  
  // Education and work - long TTL
  USER_EDUCATION: 60 * 60 * 1000, // 1 hour
  USER_WORK_EXPERIENCE: 60 * 60 * 1000, // 1 hour
  
  // Portfolio and testimonials - medium TTL
  USER_PORTFOLIO: 30 * 60 * 1000, // 30 minutes
  USER_TESTIMONIALS: 60 * 60 * 1000, // 1 hour
  USER_RECOMMENDATIONS: 60 * 60 * 1000, // 1 hour
  
  // System monitoring
  CACHE_STATS: 5 * 60 * 1000, // 5 minutes
  SYSTEM_HEALTH: 1 * 60 * 1000 // 1 minute
};

/**
 * Cache invalidation patterns for profile data
 * Provides intelligent cache invalidation strategies
 */
export const PROFILE_CACHE_INVALIDATION = {
  // Invalidate user profile data
  invalidateUser: (userId: string | number) => [
    `${PROFILE_BASE}:user:${userId}`,
    `${PROFILE_BASE}:stats:${userId}`,
    `${PROFILE_BASE}:connections:${userId}`,
    `${PROFILE_BASE}:activity:${userId}`,
    `${PROFILE_BASE}:engagement:${userId}`,
    `${PROFILE_BASE}:views:${userId}`,
    `${PROFILE_BASE}:completion:${userId}`,
    `${PROFILE_BASE}:analytics:${userId}`,
    `${PROFILE_BASE}:online:${userId}`,
    `${PROFILE_BASE}:lastseen:${userId}`
  ],
  
  // Invalidate user connections
  invalidateConnections: (userId: string | number) => [
    `${PROFILE_BASE}:followers:${userId}:*`,
    `${PROFILE_BASE}:followings:${userId}:*`,
    `${PROFILE_BASE}:connections:${userId}`,
    `${PROFILE_BASE}:mutual:${userId}:*`,
    `${PROFILE_BASE}:blocked:${userId}:*`,
    `${PROFILE_BASE}:muted:${userId}:*`
  ],
  
  // Invalidate user settings
  invalidateSettings: (userId: string | number) => [
    `${PROFILE_BASE}:settings:${userId}`,
    `${PROFILE_BASE}:preferences:${userId}`,
    `${PROFILE_BASE}:privacy:${userId}`,
    `${PROFILE_BASE}:notifications:${userId}`,
    `${PROFILE_BASE}:security:${userId}`
  ],
  
  // Invalidate user achievements and badges
  invalidateAchievements: (userId: string | number) => [
    `${PROFILE_BASE}:achievements:${userId}:*`,
    `${PROFILE_BASE}:badges:${userId}`,
    `${PROFILE_BASE}:reputation:${userId}`,
    `${PROFILE_BASE}:verification:${userId}`
  ],
  
  // Invalidate user profile data
  invalidateProfileData: (userId: string | number) => [
    `${PROFILE_BASE}:social:${userId}`,
    `${PROFILE_BASE}:interests:${userId}`,
    `${PROFILE_BASE}:skills:${userId}`,
    `${PROFILE_BASE}:education:${userId}`,
    `${PROFILE_BASE}:work:${userId}`,
    `${PROFILE_BASE}:portfolio:${userId}:*`,
    `${PROFILE_BASE}:testimonials:${userId}:*`,
    `${PROFILE_BASE}:recommendations:${userId}:*`
  ],
  
  // Invalidate current user data
  invalidateCurrentUser: () => [
    `${PROFILE_BASE}:current:user`,
    `${PROFILE_BASE}:suggestions:*`,
    `${PROFILE_BASE}:search:*`
  ],
  
  // Invalidate all user data
  invalidateAllUserData: (userId: string | number) => [
    `${PROFILE_BASE}:user:${userId}`,
    `${PROFILE_BASE}:stats:${userId}`,
    `${PROFILE_BASE}:followers:${userId}:*`,
    `${PROFILE_BASE}:followings:${userId}:*`,
    `${PROFILE_BASE}:connections:${userId}`,
    `${PROFILE_BASE}:activity:${userId}:*`,
    `${PROFILE_BASE}:engagement:${userId}:*`,
    `${PROFILE_BASE}:views:${userId}:*`,
    `${PROFILE_BASE}:completion:${userId}`,
    `${PROFILE_BASE}:analytics:${userId}:*`,
    `${PROFILE_BASE}:online:${userId}`,
    `${PROFILE_BASE}:lastseen:${userId}`,
    `${PROFILE_BASE}:blocked:${userId}:*`,
    `${PROFILE_BASE}:muted:${userId}:*`,
    `${PROFILE_BASE}:settings:${userId}`,
    `${PROFILE_BASE}:preferences:${userId}`,
    `${PROFILE_BASE}:privacy:${userId}`,
    `${PROFILE_BASE}:notifications:${userId}`,
    `${PROFILE_BASE}:security:${userId}`,
    `${PROFILE_BASE}:achievements:${userId}:*`,
    `${PROFILE_BASE}:badges:${userId}`,
    `${PROFILE_BASE}:reputation:${userId}`,
    `${PROFILE_BASE}:verification:${userId}`,
    `${PROFILE_BASE}:social:${userId}`,
    `${PROFILE_BASE}:interests:${userId}`,
    `${PROFILE_BASE}:skills:${userId}`,
    `${PROFILE_BASE}:education:${userId}`,
    `${PROFILE_BASE}:work:${userId}`,
    `${PROFILE_BASE}:portfolio:${userId}:*`,
    `${PROFILE_BASE}:testimonials:${userId}:*`,
    `${PROFILE_BASE}:recommendations:${userId}:*`,
    `${PROFILE_BASE}:mutual:${userId}:*`
  ],
  
  // Invalidate search and suggestions
  invalidateSearchData: () => [
    `${PROFILE_BASE}:search:*`,
    `${PROFILE_BASE}:suggestions:*`
  ]
};

/**
 * Cache utilities for profile management
 */
export const ProfileCacheUtils = {
  /**
   * Generate a cache key for user profile with context
   */
  generateProfileKey: (userId: string | number, context?: string) => 
    context ? `${PROFILE_BASE}:user:${userId}:${context}` : `${PROFILE_BASE}:user:${userId}`,
  
  /**
   * Generate a cache key for user stats with period
   */
  generateStatsKey: (userId: string | number, period?: string) => 
    period ? `${PROFILE_BASE}:stats:${userId}:${period}` : `${PROFILE_BASE}:stats:${userId}`,
  
  /**
   * Generate a cache key for paginated data
   */
  generatePaginatedKey: (base: string, userId: string | number, page: number, size: number) => 
    `${base}:${userId}:${page}:${size}`,
  
  /**
   * Generate a cache key for time-based data
   */
  generateTimeBasedKey: (base: string, userId: string | number, period: string) => 
    `${base}:${userId}:${period}`,
  
  /**
   * Extract user ID from cache key
   */
  extractUserId: (key: string): string | null => {
    const match = key.match(new RegExp(`${PROFILE_BASE}:(?:user|stats|followers|followings|connections|activity|engagement|views|completion|analytics|online|lastseen|blocked|muted|settings|preferences|privacy|notifications|security|achievements|badges|reputation|verification|social|interests|skills|education|work|portfolio|testimonials|recommendations|mutual):([^:]+)`));
    return match ? match[1] : null;
  },
  
  /**
   * Check if key is for current user
   */
  isCurrentUserKey: (key: string): boolean => 
    key.includes(`${PROFILE_BASE}:current:user`),
  
  /**
   * Check if key is for search data
   */
  isSearchKey: (key: string): boolean => 
    key.includes(`${PROFILE_BASE}:search:`),
  
  /**
   * Check if key is for suggestions
   */
  isSuggestionsKey: (key: string): boolean => 
    key.includes(`${PROFILE_BASE}:suggestions:`),
  
  /**
   * Check if key is for paginated data
   */
  isPaginatedKey: (key: string): boolean => {
    const parts = key.split(':');
    return parts.length >= 5 && !isNaN(parseInt(parts[parts.length - 2])) && !isNaN(parseInt(parts[parts.length - 1]));
  },
  
  /**
   * Get TTL for cache key
   */
  getTTLForKey: (key: string): number => {
    if (key.includes('current:user')) return PROFILE_CACHE_TTL.CURRENT_USER_PROFILE;
    if (key.includes('user:') && !key.includes(':followers') && !key.includes(':followings')) return PROFILE_CACHE_TTL.USER_PROFILE;
    if (key.includes('stats:')) return PROFILE_CACHE_TTL.USER_STATS;
    if (key.includes('followers:') || key.includes('followings:')) return PROFILE_CACHE_TTL.USER_FOLLOWERS;
    if (key.includes('connections:')) return PROFILE_CACHE_TTL.USER_CONNECTIONS;
    if (key.includes('search:')) return PROFILE_CACHE_TTL.USER_SEARCH;
    if (key.includes('suggestions:')) return PROFILE_CACHE_TTL.USER_SUGGESTIONS;
    if (key.includes('activity:')) return PROFILE_CACHE_TTL.USER_ACTIVITY;
    if (key.includes('settings:') || key.includes('preferences:') || key.includes('privacy:') || key.includes('notifications:') || key.includes('security:')) return PROFILE_CACHE_TTL.USER_SETTINGS;
    if (key.includes('achievements:')) return PROFILE_CACHE_TTL.USER_ACHIEVEMENTS;
    if (key.includes('badges:')) return PROFILE_CACHE_TTL.USER_BADGES;
    if (key.includes('reputation:')) return PROFILE_CACHE_TTL.USER_REPUTATION;
    if (key.includes('engagement:')) return PROFILE_CACHE_TTL.USER_ENGAGEMENT;
    if (key.includes('online:')) return PROFILE_CACHE_TTL.USER_ONLINE_STATUS;
    if (key.includes('lastseen:')) return PROFILE_CACHE_TTL.USER_LAST_SEEN;
    if (key.includes('views:')) return PROFILE_CACHE_TTL.PROFILE_VIEWS;
    if (key.includes('mutual:')) return PROFILE_CACHE_TTL.USER_MUTUAL_CONNECTIONS;
    if (key.includes('blocked:') || key.includes('muted:')) return PROFILE_CACHE_TTL.USER_BLOCKED;
    if (key.includes('completion:')) return PROFILE_CACHE_TTL.PROFILE_COMPLETION;
    if (key.includes('verification:')) return PROFILE_CACHE_TTL.USER_VERIFICATION;
    if (key.includes('analytics:')) return PROFILE_CACHE_TTL.PROFILE_ANALYTICS;
    if (key.includes('social:') || key.includes('interests:') || key.includes('skills:') || key.includes('education:') || key.includes('work:')) return PROFILE_CACHE_TTL.USER_SOCIAL_LINKS;
    if (key.includes('portfolio:') || key.includes('testimonials:') || key.includes('recommendations:')) return PROFILE_CACHE_TTL.USER_PORTFOLIO;
    if (key.includes('cache:stats:')) return PROFILE_CACHE_TTL.CACHE_STATS;
    if (key.includes('system:health:')) return PROFILE_CACHE_TTL.SYSTEM_HEALTH;
    return 10 * 60 * 1000; // Default 10 minutes
  }
};
