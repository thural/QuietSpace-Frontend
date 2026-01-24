/**
 * Search Cache Keys - Enterprise Edition
 * 
 * Enterprise-grade cache key management for search feature
 * Provides intelligent caching strategies with TTL and invalidation patterns
 */

/**
 * Search cache base key
 */
const SEARCH_BASE = 'search';

/**
 * Search cache TTL configuration
 */
export const SEARCH_CACHE_TTL = {
  // Search results - Short TTL for fresh data
  USER_SEARCH: 2 * 60 * 1000,              // 2 minutes
  POST_SEARCH: 2 * 60 * 1000,              // 2 minutes
  COMBINED_SEARCH: 2 * 60 * 1000,          // 2 minutes
  
  // Suggestions - Very short TTL for real-time feel
  SUGGESTIONS: 30 * 1000,                   // 30 seconds
  AUTOCOMPLETE: 30 * 1000,                 // 30 seconds
  
  // History and trends - Medium TTL
  SEARCH_HISTORY: 30 * 60 * 1000,           // 30 minutes
  TRENDING_SEARCHES: 10 * 60 * 1000,       // 10 minutes
  POPULAR_SEARCHES: 10 * 60 * 1000,         // 10 minutes
  RECENT_SEARCHES: 15 * 60 * 1000,          // 15 minutes
  
  // Analytics and metrics - Longer TTL
  SEARCH_ANALYTICS: 15 * 60 * 1000,         // 15 minutes
  SEARCH_PERFORMANCE: 5 * 60 * 1000,        // 5 minutes
  SEARCH_STATS: 10 * 60 * 1000,             // 10 minutes
  
  // User preferences - Long TTL
  SEARCH_PREFERENCES: 60 * 60 * 1000,       // 1 hour
  SEARCH_FILTERS: 30 * 60 * 1000,          // 30 minutes
  SAVED_SEARCHES: 60 * 60 * 1000,          // 1 hour
  
  // System data - Medium TTL
  SEARCH_CONFIG: 30 * 60 * 1000,            // 30 minutes
  SEARCH_HEALTH: 5 * 60 * 1000,             // 5 minutes
  SEARCH_CACHE_STATS: 2 * 60 * 1000,        // 2 minutes
  
  // Rate limiting - Short TTL
  SEARCH_RATE_LIMITS: 60 * 1000,            // 1 minute
  SEARCH_QUOTAS: 5 * 60 * 1000,             // 5 minutes
  
  // External sources - Medium TTL
  EXTERNAL_SEARCH: 5 * 60 * 1000,          // 5 minutes
  
  // Faceted search - Short TTL
  SEARCH_FACETS: 2 * 60 * 1000,            // 2 minutes
  SEARCH_AGGREGATIONS: 5 * 60 * 1000,      // 5 minutes
  
  // User behavior - Medium TTL
  USER_BEHAVIOR: 15 * 60 * 1000,           // 15 minutes
  
  // Monitoring - Short TTL
  SEARCH_MONITORING: 2 * 60 * 1000,        // 2 minutes
  SEARCH_ERRORS: 5 * 60 * 1000,             // 5 minutes
  
  // Session data - Short TTL
  SEARCH_SESSION: 10 * 60 * 1000,           // 10 minutes
  SEARCH_CONTEXT: 5 * 60 * 1000,            // 5 minutes
  
  // Recommendations - Medium TTL
  RECOMMENDATIONS: 10 * 60 * 1000,         // 10 minutes
  
  // Advanced search - Short TTL
  ADVANCED_SEARCH: 2 * 60 * 1000,          // 2 minutes
  
  // Category/tag/location search - Short TTL
  CATEGORY_SEARCH: 2 * 60 * 1000,          // 2 minutes
  TAG_SEARCH: 2 * 60 * 1000,               // 2 minutes
  LOCATION_SEARCH: 2 * 60 * 1000,          // 2 minutes
  DATE_RANGE_SEARCH: 2 * 60 * 1000,       // 2 minutes
  
  // Bookmarks and favorites - Long TTL
  SEARCH_BOOKMARKS: 60 * 60 * 1000,        // 1 hour
  SEARCH_FAVORITES: 60 * 60 * 1000,        // 1 hour
  
  // Permissions and access - Medium TTL
  SEARCH_PERMISSIONS: 15 * 60 * 1000,      // 15 minutes
  
  // API status - Short TTL
  SEARCH_API_STATUS: 2 * 60 * 1000,        // 2 minutes
  
  // Index status - Medium TTL
  SEARCH_INDEX_STATUS: 5 * 60 * 1000,      // 5 minutes
  
  // Queue status - Short TTL
  SEARCH_QUEUE_STATUS: 1 * 60 * 1000,       // 1 minute
  
  // Maintenance - Long TTL
  SEARCH_MAINTENANCE: 30 * 60 * 1000,      // 30 minutes
  
  // Version - Long TTL
  SEARCH_VERSION: 60 * 60 * 1000,          // 1 hour
  
  // Uptime - Short TTL
  SEARCH_UPTIME: 2 * 60 * 1000,            // 2 minutes
  
  // Logs - Short TTL
  SEARCH_LOGS: 1 * 60 * 1000,              // 1 minute
  
  // Metrics - Short TTL
  SEARCH_METRICS: 2 * 60 * 1000,           // 2 minutes
  
  // Alerts - Short TTL
  SEARCH_ALERTS: 1 * 60 * 1000,            // 1 minute
  
  // Notifications - Short TTL
  SEARCH_NOTIFICATIONS: 1 * 60 * 1000,     // 1 minute
  
  // Feature flags - Medium TTL
  SEARCH_FEATURE_FLAGS: 15 * 60 * 1000,    // 15 minutes
} as const;

/**
 * Search cache keys factory functions
 */
export const SEARCH_CACHE_KEYS = {
  // User search results
  USER_SEARCH: (query: string, page: number = 0, size: number = 20) => 
    `${SEARCH_BASE}:users:${encodeURIComponent(query)}:${page}:${size}`,
  
  // Post search results
  POST_SEARCH: (query: string, page: number = 0, size: number = 20) => 
    `${SEARCH_BASE}:posts:${encodeURIComponent(query)}:${page}:${size}`,
  
  // Combined search results
  COMBINED_SEARCH: (query: string, page: number = 0, size: number = 20) => 
    `${SEARCH_BASE}:combined:${encodeURIComponent(query)}:${page}:${size}`,
  
  // Search suggestions
  SUGGESTIONS: (partialQuery: string, limit: number = 10) => 
    `${SEARCH_BASE}:suggestions:${encodeURIComponent(partialQuery)}:${limit}`,
  
  // Search history
  SEARCH_HISTORY: (userId: string | number) => 
    `${SEARCH_BASE}:history:${userId}`,
  
  // Trending searches
  TRENDING_SEARCHES: (limit: number = 10) => 
    `${SEARCH_BASE}:trending:${limit}`,
  
  // Popular searches
  POPULAR_SEARCHES: (limit: number = 10) => 
    `${SEARCH_BASE}:popular:${limit}`,
  
  // Recent searches
  RECENT_SEARCHES: (userId: string | number, limit: number = 10) => 
    `${SEARCH_BASE}:recent:${userId}:${limit}`,
  
  // Search analytics
  SEARCH_ANALYTICS: (userId: string | number, period: string = '24h') => 
    `${SEARCH_BASE}:analytics:${userId}:${period}`,
  
  // Search performance metrics
  SEARCH_PERFORMANCE: (query: string, period: string = '24h') => 
    `${SEARCH_BASE}:performance:${encodeURIComponent(query)}:${period}`,
  
  // Search filters
  SEARCH_FILTERS: (userId: string | number) => 
    `${SEARCH_BASE}:filters:${userId}`,
  
  // Saved searches
  SAVED_SEARCHES: (userId: string | number) => 
    `${SEARCH_BASE}:saved:${userId}`,
  
  // Search preferences
  SEARCH_PREFERENCES: (userId: string | number) => 
    `${SEARCH_BASE}:preferences:${userId}`,
  
  // Search session
  SEARCH_SESSION: (sessionId: string) => 
    `${SEARCH_BASE}:session:${sessionId}`,
  
  // Search results by category
  CATEGORY_SEARCH: (category: string, query: string, page: number = 0, size: number = 20) => 
    `${SEARCH_BASE}:category:${category}:${encodeURIComponent(query)}:${page}:${size}`,
  
  // Search results by tags
  TAG_SEARCH: (tag: string, page: number = 0, size: number = 20) => 
    `${SEARCH_BASE}:tag:${encodeURIComponent(tag)}:${page}:${size}`,
  
  // Search results by location
  LOCATION_SEARCH: (location: string, page: number = 0, size: number = 20) => 
    `${SEARCH_BASE}:location:${encodeURIComponent(location)}:${page}:${size}`,
  
  // Search results by date range
  DATE_RANGE_SEARCH: (startDate: string, endDate: string, page: number = 0, size: number = 20) => 
    `${SEARCH_BASE}:date:${startDate}:${endDate}:${page}:${size}`,
  
  // Advanced search results
  ADVANCED_SEARCH: (queryId: string, page: number = 0, size: number = 20) => 
    `${SEARCH_BASE}:advanced:${queryId}:${page}:${size}`,
  
  // Search autocomplete
  AUTOCOMPLETE: (partialQuery: string, limit: number = 10) => 
    `${SEARCH_BASE}:autocomplete:${encodeURIComponent(partialQuery)}:${limit}`,
  
  // Search recommendations
  RECOMMENDATIONS: (userId: string | number, limit: number = 10) => 
    `${SEARCH_BASE}:recommendations:${userId}:${limit}`,
  
  // Search statistics
  SEARCH_STATS: (period: string = '24h') => 
    `${SEARCH_BASE}:stats:${period}`,
  
  // Search health metrics
  SEARCH_HEALTH: () => 
    `${SEARCH_BASE}:health`,
  
  // Search configuration
  SEARCH_CONFIG: () => 
    `${SEARCH_BASE}:config`,
  
  // Search index status
  SEARCH_INDEX_STATUS: () => 
    `${SEARCH_BASE}:index:status`,
  
  // Search queue status
  SEARCH_QUEUE_STATUS: () => 
    `${SEARCH_BASE}:queue:status`,
  
  // Search cache statistics
  SEARCH_CACHE_STATS: () => 
    `${SEARCH_BASE}:cache:stats`,
  
  // Search rate limits
  SEARCH_RATE_LIMITS: (userId: string | number) => 
    `${SEARCH_BASE}:ratelimit:${userId}`,
  
  // Search quotas
  SEARCH_QUOTAS: (userId: string | number) => 
    `${SEARCH_BASE}:quota:${userId}`,
  
  // Search API status
  SEARCH_API_STATUS: () => 
    `${SEARCH_BASE}:api:status`,
  
  // External sources
  EXTERNAL_SEARCH: (source: string, query: string, page: number = 0, size: number = 20) => 
    `${SEARCH_BASE}:external:${source}:${encodeURIComponent(query)}:${page}:${size}`,
  
  // Search aggregations
  SEARCH_AGGREGATIONS: (query: string) => 
    `${SEARCH_BASE}:aggregations:${encodeURIComponent(query)}`,
  
  // Search facets
  SEARCH_FACETS: (query: string) => 
    `${SEARCH_BASE}:facets:${encodeURIComponent(query)}`,
  
  // Search highlights
  SEARCH_HIGHLIGHTS: (query: string, resultId: string) => 
    `${SEARCH_BASE}:highlights:${encodeURIComponent(query)}:${resultId}`,
  
  // Search context
  SEARCH_CONTEXT: (sessionId: string) => 
    `${SEARCH_BASE}:context:${sessionId}`,
  
  // User behavior
  USER_BEHAVIOR: (userId: string | number, period: string = '24h') => 
    `${SEARCH_BASE}:behavior:${userId}:${period}`,
  
  // Feature flags
  SEARCH_FEATURE_FLAGS: () => 
    `${SEARCH_BASE}:features`,
  
  // Monitoring
  SEARCH_MONITORING: (metric: string, period: string = '1h') => 
    `${SEARCH_BASE}:monitor:${metric}:${period}`,
  
  // Alerts
  SEARCH_ALERTS: (userId: string | number) => 
    `${SEARCH_BASE}:alerts:${userId}`,
  
  // Notifications
  SEARCH_NOTIFICATIONS: (userId: string | number) => 
    `${SEARCH_BASE}:notifications:${userId}`,
  
  // Bookmarks
  SEARCH_BOOKMARKS: (userId: string | number) => 
    `${SEARCH_BASE}:bookmarks:${userId}`,
  
  // Favorites
  SEARCH_FAVORITES: (userId: string | number) => 
    `${SEARCH_BASE}:favorites:${userId}`,
  
  // Permissions
  SEARCH_PERMISSIONS: (userId: string | number) => 
    `${SEARCH_BASE}:permissions:${userId}`,
  
  // Version
  SEARCH_VERSION: () => 
    `${SEARCH_BASE}:version`,
  
  // Uptime
  SEARCH_UPTIME: () => 
    `${SEARCH_BASE}:uptime`,
  
  // Errors
  SEARCH_ERRORS: (period: string = '1h') => 
    `${SEARCH_BASE}:errors:${period}`,
  
  // Logs
  SEARCH_LOGS: (level: string, period: string = '1h') => 
    `${SEARCH_BASE}:logs:${level}:${period}`,
  
  // Metrics
  SEARCH_METRICS: (metric: string, period: string = '1h') => 
    `${SEARCH_BASE}:metrics:${metric}:${period}`,
  
  // Maintenance
  SEARCH_MAINTENANCE: () => 
    `${SEARCH_BASE}:maintenance`,
} as const;

/**
 * Search cache invalidation patterns
 */
export const SEARCH_CACHE_INVALIDATION = {
  // Invalidate all search data for a user
  invalidateUserSearchData: (userId: string | number) => [
    `${SEARCH_BASE}:users:*`,
    `${SEARCH_BASE}:posts:*`,
    `${SEARCH_BASE}:combined:*`,
    `${SEARCH_BASE}:suggestions:*`,
    `${SEARCH_BASE}:autocomplete:*`,
    `${SEARCH_BASE}:history:${userId}`,
    `${SEARCH_BASE}:recent:${userId}:*`,
    `${SEARCH_BASE}:analytics:${userId}:*`,
    `${SEARCH_BASE}:behavior:${userId}:*`,
    `${SEARCH_BASE}:recommendations:${userId}:*`,
    `${SEARCH_BASE}:bookmarks:${userId}`,
    `${SEARCH_BASE}:favorites:${userId}`,
    `${SEARCH_BASE}:permissions:${userId}`,
    `${SEARCH_BASE}:alerts:${userId}`,
    `${SEARCH_BASE}:notifications:${userId}`
  ],
  
  // Invalidate search results for a specific query
  invalidateSearchQuery: (query: string) => [
    `${SEARCH_BASE}:users:${encodeURIComponent(query)}:*`,
    `${SEARCH_BASE}:posts:${encodeURIComponent(query)}:*`,
    `${SEARCH_BASE}:combined:${encodeURIComponent(query)}:*`,
    `${SEARCH_BASE}:aggregations:${encodeURIComponent(query)}`,
    `${SEARCH_BASE}:facets:${encodeURIComponent(query)}`,
    `${SEARCH_BASE}:highlights:${encodeURIComponent(query)}:*`,
    `${SEARCH_BASE}:performance:${encodeURIComponent(query)}:*`
  ],
  
  // Invalidate all search results
  invalidateAllSearchResults: () => [
    `${SEARCH_BASE}:users:*`,
    `${SEARCH_BASE}:posts:*`,
    `${SEARCH_BASE}:combined:*`,
    `${SEARCH_BASE}:category:*`,
    `${SEARCH_BASE}:tag:*`,
    `${SEARCH_BASE}:location:*`,
    `${SEARCH_BASE}:date:*`,
    `${SEARCH_BASE}:advanced:*`,
    `${SEARCH_BASE}:external:*`
  ],
  
  // Invalidate suggestions and autocomplete
  invalidateSuggestions: () => [
    `${SEARCH_BASE}:suggestions:*`,
    `${SEARCH_BASE}:autocomplete:*`
  ],
  
  // Invalidate trending and popular searches
  invalidateTrendingData: () => [
    `${SEARCH_BASE}:trending:*`,
    `${SEARCH_BASE}:popular:*`
  ],
  
  // Invalidate analytics and performance data
  invalidateAnalyticsData: () => [
    `${SEARCH_BASE}:analytics:*`,
    `${SEARCH_BASE}:performance:*`,
    `${SEARCH_BASE}:stats:*`,
    `${SEARCH_BASE}:behavior:*`,
    `${SEARCH_BASE}:monitor:*`,
    `${SEARCH_BASE}:metrics:*`
  ],
  
  // Invalidate system status data
  invalidateSystemStatus: () => [
    `${SEARCH_BASE}:health`,
    `${SEARCH_BASE}:config`,
    `${SEARCH_BASE}:index:status`,
    `${SEARCH_BASE}:queue:status`,
    `${SEARCH_BASE}:cache:stats`,
    `${SEARCH_BASE}:api:status`,
    `${SEARCH_BASE}:version`,
    `${SEARCH_BASE}:uptime`,
    `${SEARCH_BASE}:maintenance`,
    `${SEARCH_BASE}:features`
  ],
  
  // Invalidate error and log data
  invalidateErrorData: () => [
    `${SEARCH_BASE}:errors:*`,
    `${SEARCH_BASE}:logs:*`
  ],
  
  // Invalidate all search cache
  invalidateAllSearchCache: () => [
    `${SEARCH_BASE}:*`
  ]
} as const;

/**
 * Search cache utilities
 */
export class SearchCacheUtils {
  /**
   * Generate a cache key for user search
   */
  static generateUserSearchKey(query: string, page: number = 0, size: number = 20): string {
    return SEARCH_CACHE_KEYS.USER_SEARCH(query, page, size);
  }
  
  /**
   * Generate a cache key for post search
   */
  static generatePostSearchKey(query: string, page: number = 0, size: number = 20): string {
    return SEARCH_CACHE_KEYS.POST_SEARCH(query, page, size);
  }
  
  /**
   * Generate a cache key for combined search
   */
  static generateCombinedSearchKey(query: string, page: number = 0, size: number = 20): string {
    return SEARCH_CACHE_KEYS.COMBINED_SEARCH(query, page, size);
  }
  
  /**
   * Generate a cache key for suggestions
   */
  static generateSuggestionsKey(partialQuery: string, limit: number = 10): string {
    return SEARCH_CACHE_KEYS.SUGGESTIONS(partialQuery, limit);
  }
  
  /**
   * Parse cache key to extract components
   */
  static parseCacheKey(key: string): { type: string; params: Record<string, string> } | null {
    const parts = key.split(':');
    if (parts[0] !== SEARCH_BASE) return null;
    
    const type = parts[1];
    const params: Record<string, string> = {};
    
    switch (type) {
      case 'users':
      case 'posts':
      case 'combined':
        if (parts.length >= 5) {
          params.query = decodeURIComponent(parts[2]);
          params.page = parts[3];
          params.size = parts[4];
        }
        break;
      case 'suggestions':
      case 'autocomplete':
        if (parts.length >= 4) {
          params.partialQuery = decodeURIComponent(parts[2]);
          params.limit = parts[3];
        }
        break;
      case 'history':
      case 'preferences':
      case 'filters':
      case 'saved':
      case 'bookmarks':
      case 'favorites':
      case 'permissions':
      case 'alerts':
      case 'notifications':
        if (parts.length >= 3) {
          params.userId = parts[2];
        }
        break;
      case 'analytics':
      case 'behavior':
        if (parts.length >= 4) {
          params.userId = parts[2];
          params.period = parts[3];
        }
        break;
      case 'trending':
      case 'popular':
        if (parts.length >= 3) {
          params.limit = parts[2];
        }
        break;
      case 'recent':
        if (parts.length >= 4) {
          params.userId = parts[2];
          params.limit = parts[3];
        }
        break;
    }
    
    return { type, params };
  }
  
  /**
   * Check if cache key is valid
   */
  static isValidCacheKey(key: string): boolean {
    return this.parseCacheKey(key) !== null;
  }
  
  /**
   * Get TTL for cache key type
   */
  static getTTLForKey(key: string): number {
    const parsed = this.parseCacheKey(key);
    if (!parsed) return 5 * 60 * 1000; // Default 5 minutes
    
    const ttlMap: Record<string, number> = {
      'users': SEARCH_CACHE_TTL.USER_SEARCH,
      'posts': SEARCH_CACHE_TTL.POST_SEARCH,
      'combined': SEARCH_CACHE_TTL.COMBINED_SEARCH,
      'suggestions': SEARCH_CACHE_TTL.SUGGESTIONS,
      'autocomplete': SEARCH_CACHE_TTL.AUTOCOMPLETE,
      'history': SEARCH_CACHE_TTL.SEARCH_HISTORY,
      'trending': SEARCH_CACHE_TTL.TRENDING_SEARCHES,
      'popular': SEARCH_CACHE_TTL.POPULAR_SEARCHES,
      'recent': SEARCH_CACHE_TTL.RECENT_SEARCHES,
      'analytics': SEARCH_CACHE_TTL.SEARCH_ANALYTICS,
      'performance': SEARCH_CACHE_TTL.SEARCH_PERFORMANCE,
      'stats': SEARCH_CACHE_TTL.SEARCH_STATS,
      'preferences': SEARCH_CACHE_TTL.SEARCH_PREFERENCES,
      'filters': SEARCH_CACHE_TTL.SEARCH_FILTERS,
      'saved': SEARCH_CACHE_TTL.SAVED_SEARCHES,
      'recommendations': SEARCH_CACHE_TTL.RECOMMENDATIONS,
      'health': SEARCH_CACHE_TTL.SEARCH_HEALTH,
      'config': SEARCH_CACHE_TTL.SEARCH_CONFIG,
      'version': SEARCH_CACHE_TTL.SEARCH_VERSION,
      'uptime': SEARCH_CACHE_TTL.SEARCH_UPTIME,
      'errors': SEARCH_CACHE_TTL.SEARCH_ERRORS,
      'logs': SEARCH_CACHE_TTL.SEARCH_LOGS,
      'metrics': SEARCH_CACHE_TTL.SEARCH_METRICS,
      'monitor': SEARCH_CACHE_TTL.SEARCH_MONITORING,
      'alerts': SEARCH_CACHE_TTL.SEARCH_ALERTS,
      'notifications': SEARCH_CACHE_TTL.SEARCH_NOTIFICATIONS,
      'bookmarks': SEARCH_CACHE_TTL.SEARCH_BOOKMARKS,
      'favorites': SEARCH_CACHE_TTL.SEARCH_FAVORITES,
      'permissions': SEARCH_CACHE_TTL.SEARCH_PERMISSIONS,
      'behavior': SEARCH_CACHE_TTL.USER_BEHAVIOR,
      'session': SEARCH_CACHE_TTL.SEARCH_SESSION,
      'context': SEARCH_CACHE_TTL.SEARCH_CONTEXT,
      'category': SEARCH_CACHE_TTL.CATEGORY_SEARCH,
      'tag': SEARCH_CACHE_TTL.TAG_SEARCH,
      'location': SEARCH_CACHE_TTL.LOCATION_SEARCH,
      'date': SEARCH_CACHE_TTL.DATE_RANGE_SEARCH,
      'advanced': SEARCH_CACHE_TTL.ADVANCED_SEARCH,
      'external': SEARCH_CACHE_TTL.EXTERNAL_SEARCH,
      'aggregations': SEARCH_CACHE_TTL.SEARCH_AGGREGATIONS,
      'facets': SEARCH_CACHE_TTL.SEARCH_FACETS,
      'highlights': SEARCH_CACHE_TTL.SEARCH_HIGHLIGHTS,
      'maintenance': SEARCH_CACHE_TTL.SEARCH_MAINTENANCE,
      'features': SEARCH_CACHE_TTL.SEARCH_FEATURE_FLAGS,
      'ratelimit': SEARCH_CACHE_TTL.SEARCH_RATE_LIMITS,
      'quota': SEARCH_CACHE_TTL.SEARCH_QUOTAS,
      'api': SEARCH_CACHE_TTL.SEARCH_API_STATUS,
      'index': SEARCH_CACHE_TTL.SEARCH_INDEX_STATUS,
      'queue': SEARCH_CACHE_TTL.SEARCH_QUEUE_STATUS,
      'cache': SEARCH_CACHE_TTL.SEARCH_CACHE_STATS
    };
    
    return ttlMap[parsed.type] || 5 * 60 * 1000; // Default 5 minutes
  }
  
  /**
   * Generate cache invalidation patterns
   */
  static generateInvalidationPatterns(type: string, params: Record<string, string>): string[] {
    switch (type) {
      case 'users':
      case 'posts':
      case 'combined':
        if (params.query) {
          return SEARCH_CACHE_INVALIDATION.invalidateSearchQuery(params.query);
        }
        break;
      case 'history':
      case 'recent':
      case 'analytics':
      case 'behavior':
      case 'recommendations':
      case 'bookmarks':
      case 'favorites':
      case 'permissions':
      case 'alerts':
      case 'notifications':
        if (params.userId) {
          return SEARCH_CACHE_INVALIDATION.invalidateUserSearchData(params.userId);
        }
        break;
    }
    
    return [];
  }
}
