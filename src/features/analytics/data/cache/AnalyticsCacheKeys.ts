/**
 * Analytics Cache Keys
 * 
 * Centralized cache key factory functions for analytics-related data
 * with enterprise-grade TTL strategies for data-intensive analytics processing
 */

// Base cache key prefix
const ANALYTICS_BASE = 'analytics';

/**
 * Cache key factory functions for analytics
 */
export const ANALYTICS_CACHE_KEYS = {
  // Analytics events
  USER_EVENTS: (userId: string, page: number = 0, size: number = 100) => 
    `${ANALYTICS_BASE}:user:${userId}:events:${page}:${size}`,
  
  // Events by type
  EVENTS_BY_TYPE: (eventType: string, page: number = 0, size: number = 100) => 
    `${ANALYTICS_BASE}:events:type:${eventType}:${page}:${size}`,
  
  // Events by date range
  EVENTS_BY_DATE_RANGE: (startDate: string, endDate: string, page: number = 0, size: number = 100) => 
    `${ANALYTICS_BASE}:events:date:${startDate}:${endDate}:${page}:${size}`,
  
  // Individual event
  EVENT: (eventId: string) => 
    `${ANALYTICS_BASE}:event:${eventId}`,
  
  // Analytics metrics
  METRICS: (dateRange: string, filters?: string) => 
    `${ANALYTICS_BASE}:metrics:${dateRange}:${filters || 'default'}`,
  
  // Real-time metrics
  REAL_TIME_METRICS: (userId?: string) => 
    `${ANALYTICS_BASE}:metrics:realtime:${userId || 'global'}`,
  
  // Performance metrics
  PERFORMANCE_METRICS: (period: string = '24h') => 
    `${ANALYTICS_BASE}:performance:${period}`,
  
  // User engagement metrics
  ENGAGEMENT_METRICS: (userId: string, period: string = '7d') => 
    `${ANALYTICS_BASE}:engagement:${userId}:${period}`,
  
  // Conversion metrics
  CONVERSION_METRICS: (funnelId?: string, period: string = '30d') => 
    `${ANALYTICS_BASE}:conversion:${funnelId || 'all'}:${period}`,
  
  // Traffic metrics
  TRAFFIC_METRICS: (period: string = '24h') => 
    `${ANALYTICS_BASE}:traffic:${period}`,
  
  // Content performance metrics
  CONTENT_METRICS: (contentType?: string, period: string = '7d') => 
    `${ANALYTICS_BASE}:content:${contentType || 'all'}:${period}`,
  
  // User behavior metrics
  USER_BEHAVIOR: (userId: string, period: string = '30d') => 
    `${ANALYTICS_BASE}:behavior:${userId}:${period}`,
  
  // Error metrics
  ERROR_METRICS: (period: string = '24h') => 
    `${ANALYTICS_BASE}:errors:${period}`,
  
  // Dashboard data
  DASHBOARD: (dashboardId: string) => 
    `${ANALYTICS_BASE}:dashboard:${dashboardId}`,
  
  // User dashboards
  USER_DASHBOARDS: (userId: string) => 
    `${ANALYTICS_BASE}:dashboards:${userId}`,
  
  // Reports
  REPORT: (reportId: string) => 
    `${ANALYTICS_BASE}:report:${reportId}`,
  
  // User reports
  USER_REPORTS: (userId: string) => 
    `${ANALYTICS_BASE}:reports:${userId}`,
  
  // Insights
  INSIGHTS: (userId?: string, type?: string) => 
    `${ANALYTICS_BASE}:insights:${userId || 'global'}:${type || 'all'}`,
  
  // Funnels
  FUNNEL: (funnelId: string) => 
    `${ANALYTICS_BASE}:funnel:${funnelId}`,
  
  // User funnels
  USER_FUNNELS: (userId: string) => 
    `${ANALYTICS_BASE}:funnels:${userId}`,
  
  // Goals
  GOAL: (goalId: string) => 
    `${ANALYTICS_BASE}:goal:${goalId}`,
  
  // User goals
  USER_GOALS: (userId: string) => 
    `${ANALYTICS_BASE}:goals:${userId}`,
  
  // Aggregated data
  AGGREGATED_DATA: (aggregationType: string, dateRange: string, filters?: string) => 
    `${ANALYTICS_BASE}:aggregated:${aggregationType}:${dateRange}:${filters || 'default'}`,
  
  // Trend data
  TREND_DATA: (metric: string, period: string, granularity: string = 'daily') => 
    `${ANALYTICS_BASE}:trend:${metric}:${period}:${granularity}`,
  
  // Comparison data
  COMPARISON_DATA: (metric1: string, metric2: string, period: string) => 
    `${ANALYTICS_BASE}:comparison:${metric1}:${metric2}:${period}`,
  
  // Search analytics
  SEARCH_ANALYTICS: (period: string = '30d') => 
    `${ANALYTICS_BASE}:search:${period}`,
  
  // Media analytics
  MEDIA_ANALYTICS: (period: string = '30d') => 
    `${ANALYTICS_BASE}:media:${period}`,
  
  // Feature usage analytics
  FEATURE_USAGE: (featureName?: string, period: string = '30d') => 
    `${ANALYTICS_BASE}:feature:${featureName || 'all'}:${period}`,
  
  // A/B test analytics
  AB_TEST_ANALYTICS: (testId?: string, period: string = '30d') => 
    `${ANALYTICS_BASE}:ab_test:${testId || 'all'}:${period}`,
  
  // Custom reports
  CUSTOM_REPORT: (reportId: string) => 
    `${ANALYTICS_BASE}:custom_report:${reportId}`,
  
  // Data export
  DATA_EXPORT: (exportType: string, filters?: string) => 
    `${ANALYTICS_BASE}:export:${exportType}:${filters || 'default'}`,
  
  // Cache statistics
  CACHE_STATS: () => 
    `${ANALYTICS_BASE}:cache:stats`,
  
  // System health
  SYSTEM_HEALTH: () => 
    `${ANALYTICS_BASE}:system:health`,
  
  // Processing queue
  PROCESSING_QUEUE: () => 
    `${ANALYTICS_BASE}:processing:queue`
};

/**
 * TTL (Time To Live) strategies for analytics cache
 * Optimized for data-intensive analytics processing with long-term storage
 */
export const ANALYTICS_CACHE_TTL = {
  // Real-time metrics - very short TTL for immediate updates
  REAL_TIME_METRICS: 30 * 1000, // 30 seconds
  PERFORMANCE_METRICS: 60 * 1000, // 1 minute
  
  // User engagement - medium TTL for balance
  ENGAGEMENT_METRICS: 5 * 60 * 1000, // 5 minutes
  USER_BEHAVIOR: 10 * 60 * 1000, // 10 minutes
  
  // Traffic and conversion - medium TTL
  TRAFFIC_METRICS: 2 * 60 * 1000, // 2 minutes
  CONVERSION_METRICS: 5 * 60 * 1000, // 5 minutes
  
  // Content metrics - longer TTL for stability
  CONTENT_METRICS: 15 * 60 * 1000, // 15 minutes
  MEDIA_ANALYTICS: 30 * 60 * 1000, // 30 minutes
  
  // Error metrics - short TTL for quick updates
  ERROR_METRICS: 60 * 1000, // 1 minute
  
  // Aggregated data - longer TTL for performance
  AGGREGATED_DATA: 30 * 60 * 1000, // 30 minutes
  TREND_DATA: 60 * 60 * 1000, // 1 hour
  COMPARISON_DATA: 60 * 60 * 1000, // 1 hour
  
  // Search analytics - medium TTL
  SEARCH_ANALYTICS: 10 * 60 * 1000, // 10 minutes
  
  // Feature usage - longer TTL
  FEATURE_USAGE: 24 * 60 * 60 * 1000, // 24 hours
  AB_TEST_ANALYTICS: 24 * 60 * 60 * 1000, // 24 hours
  
  // Dashboards - medium TTL for user experience
  DASHBOARD: 5 * 60 * 1000, // 5 minutes
  USER_DASHBOARDS: 10 * 60 * 1000, // 10 minutes
  
  // Reports - longer TTL for persistence
  REPORT: 60 * 60 * 1000, // 1 hour
  USER_REPORTS: 30 * 60 * 1000, // 30 minutes
  
  // Insights - medium TTL for relevance
  INSIGHTS: 15 * 60 * 1000, // 15 minutes
  
  // Funnels - longer TTL for stability
  FUNNEL: 24 * 60 * 60 * 1000, // 24 hours
  USER_FUNNELS: 12 * 60 * 60 * 1000, // 12 hours
  
  // Goals - medium TTL for progress tracking
  GOAL: 5 * 60 * 1000, // 5 minutes
  USER_GOALS: 10 * 60 * 1000, // 10 minutes
  
  // Events - short TTL for real-time processing
  USER_EVENTS: 2 * 60 * 1000, // 2 minutes
  EVENTS_BY_TYPE: 5 * 60 * 1000, // 5 minutes
  EVENTS_BY_DATE_RANGE: 15 * 60 * 1000, // 15 minutes
  
  // Custom reports - longer TTL for persistence
  CUSTOM_REPORT: 24 * 60 * 60 * 1000, // 24 hours
  
  // Data export - short TTL for temporary data
  DATA_EXPORT: 5 * 60 * 1000, // 5 minutes
  
  // System data - very short TTL for health monitoring
  CACHE_STATS: 30 * 1000, // 30 seconds
  SYSTEM_HEALTH: 60 * 1000, // 1 minute
  PROCESSING_QUEUE: 15 * 1000 // 15 seconds
};

/**
 * Cache invalidation patterns for analytics
 * Provides intelligent cache invalidation strategies for data-intensive analytics
 */
export const ANALYTICS_CACHE_INVALIDATION = {
  // Invalidate all user-related analytics caches
  invalidateUserAnalytics: (userId: string) => [
    `${ANALYTICS_BASE}:user:${userId}:*`,
    `${ANALYTICS_BASE}:engagement:${userId}:*`,
    `${ANALYTICS_BASE}:behavior:${userId}:*`,
    `${ANYTICS_BASE}:goals:${userId}:*`,
    `${ANYTICS_BASE}:funnels:${userId}:*`
  ],
  
  // Invalidate metric caches
  invalidateMetrics: (dateRange?: string, filters?: string) => [
    `${ANALYTICS_BASE}:metrics:${dateRange || '*'}:${filters || 'default'}`,
    `${ANALYTICS_BASE}:realtime:*`,
    `${ANYTICS_BASE}:performance:*`
  ],
  
  // Invalidate dashboard caches
  invalidateDashboard: (dashboardId?: string) => [
    dashboardId 
      ? `${ANALYTICS_BASE}:dashboard:${dashboardId}`
      : `${ANALYTICS_BASE}:dashboard:*`
  ],
  
  // Invalidate report caches
  invalidateReports: (userId?: string) => [
    userId 
      ? `${ANalytics_BASE}:reports:${userId}:*`
      : `${ANALYTICS_BASE}:reports:*`
  ],
  
  // Invalidate insight caches
  invalidateInsights: (userId?: string, type?: string) => [
    userId 
      ? `${ANALYTICS_BASE}:insights:${userId}:${type || '*'}`
      : `${ANYTICS}:insights:*`
  ],
  
  // Invalidate funnel caches
  invalidateFunnels: (funnelId?: string) => [
    funnelId 
      ? `${ANALYTICS_BASE}:funnel:${funnelId}`
      : `${ANYTICS_BASE}:funnel:*`
  ],
  
  // Invalidate goal caches
  invalidateGoals: (userId?: string) => [
    userId 
      ? `${ANYTICS_BASE}:goals:${userId}:*`
      : `${ANYTICS_BASE}:goals:*`
  ],
  
  // Invalidate event caches
  invalidateEvents: (userId?: string, eventType?: string) => [
    userId 
      ? `${ANALYTICS_BASE}:user:${userId}:events:*`
      : `${ANYTICS_BASE}:events:*`,
    eventType 
      ? `${ANYTICS_BASE}:events:type:${eventType}:*`
      : null
  ].filter(Boolean),
    
    // Date range invalidation
    dateRange 
      ? `${ANYTICS_BASE}:events:date:*`
      : null
  ].filter(Boolean),
    
    // Type-specific invalidation
    eventType 
      ? `${ANYTICS_BASE}:events:type:${eventType}:*`
      : null
  ].filter(Boolean)
  ],
  
  // Invalidate aggregated data
  invalidateAggregatedData: (aggregationType?: string, dateRange?: string, filters?: string) => [
    `${ANALYTICS_BASE}:aggregated:${aggregationType || '*'}:${dateRange || '*'}:${filters || 'default'}`
  ],
  
  // Invalidate trend data
  invalidateTrendData: (metric?: string, period?: string) => [
    `${ANYTICS_BASE}:trend:${metric || '*'}:${period || '*'}`
  ],
  
  // Invalidate comparison data
  invalidateComparisonData: (metric1?: string, metric2?: string, period?: string) => [
    `${ANALYTICS_BASE}:comparison:${metric1 || '*'}:${metric2 || '*'}:${period || '*'}`
  ],
  
  // Invalidate search analytics
  invalidateSearchAnalytics: () => [
    `${ANALYTICS_BASE}:search:*`
  ],
  
  // Invalidate media analytics
  invalidateMediaAnalytics: () => [
    `${ANYTICS_BASE}:media:*`
  ],
  
  // Invalidate feature usage
  invalidateFeatureUsage: (featureName?: string) => [
    featureName 
      ? `${ANYTICS_BASE}:feature:${featureName}:*`
      : `${ANYTICS_BASE}:feature:*`
  ],
  
  // Invalidate A/B test analytics
  invalidateABTestAnalytics: (testId?: string) => [
    testId 
      ? `${ANYTICS_BASE}:ab_test:${testId}:*`
      : `${ANYTICS_BASE}:ab_test:*`
  ],
  
  // Invalidate custom reports
  invalidateCustomReports: (reportId?: string) => [
    reportId 
      ? `${ANYTICS_BASE}:custom_report:${reportId}`
      : `${ANYTICS_BASE}:custom_report:*`
  ],
  
  // Invalidate data export
  invalidateDataExport: () => [
    `${ANYTICS_BASE}:export:*`
  ],
  
  // Invalidate all analytics caches (emergency)
  invalidateAllAnalytics: () => [
    `${ANALYTICS_BASE}:*`
  ]
};

/**
 * Cache key utilities
 */
export const AnalyticsCacheUtils = {
  /**
   * Generate a date range hash for consistent cache keys
   */
  generateDateRangeHash: (startDate: Date, endDate: Date): string => {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    return btoa(`${start}_${end}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  },
  
  /**
   * Generate a filters hash for consistent cache keys
   */
  generateFiltersHash: (filters: Record<string, any>): string => {
    const sortedKeys = Object.keys(filters).sort();
    const filterString = sortedKeys.map(key => `${key}:${filters[key]}`).join('|');
    return btoa(filterString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  },
  
  /**
   * Extract user ID from cache key
   */
  extractUserIdFromKey: (cacheKey: string): string | null => {
    const match = cacheKey.match(/analytics:user:([^:]+):/);
    return match ? match[1] : null;
  },
  
  /**
   * Check if cache key is for real-time data
   */
  isRealtimeKey: (cacheKey: string): boolean => {
    return cacheKey.includes('realtime') || 
           cacheKey.includes('performance') ||
           cacheKey.includes('processing');
  },
  
  /**
   * Check if cache key is for aggregated data
   */
  isAggregatedKey: (cacheKey: string): boolean => {
    return cacheKey.includes('aggregated') || 
           cacheKey.includes('trend') || 
           cacheKey.includes('comparison');
  },
  
  /**
   * Get TTL for cache key
   */
  getTTLForKey: (cacheKey: string): number => {
    if (cacheKey.includes('realtime')) return ANALYTICS_CACHE_TTL.REAL_TIME_METRICS;
    if (cacheKey.includes('performance')) return ANALYTICS_CACHE_TTL.PERFORMANCE_METRICS;
    if (cacheKey.includes('engagement')) return ANALYTICS_CACHE_TTL.ENGAGEMENT_METRICS;
    if (cacheKey.includes('behavior')) return ANALYTICS_CACHE_TTL.USER_BEHAVIOR;
    if (cacheKey.includes('traffic')) return ANALYTICS_CACHE_TTL.TRAFFIC_METRICS;
    if (cacheKey.includes('conversion')) return ANALYTICS_CACHE_TTL.CONVERSION_METRICS;
    if (cacheKey.includes('content')) return ANALYTICS_CACHE_TTL.CONTENT_METRICS;
    if (cacheKey.includes('media')) return ANALYTICS_CACHE_TTL.MEDIA_ANALYTICS;
    if (cacheKey.includes('error')) return ANALYTICS_CACHE_TTL.ERROR_METRICS;
    if (cacheKey.includes('feature')) return ANALYTICS_CACHE_TTL.FEATURE_USAGE;
    if (cacheKey.includes('ab_test')) return ANALYTICS_CACHE_TTL.AB_TEST_ANALYTICS;
    if (cacheKey.includes('dashboard')) return ANALYTICS_CACHE_TTL.DASHBOARD;
    if (cacheKey.includes('report')) return ANALYTICS_CACHE_TTL.REPORT;
    if (cacheKey.includes('insight')) return ANALYTICS_CACHE_TTL.INSIGHTS;
    if (cacheKey.includes('funnel')) return ANALYTICS_CACHE_TTL.FUNNEL;
    if (cacheKey.includes('goal')) return ANALYTICS_CACHE_TTL.GOAL;
    if (cacheKey.includes('events')) return ANALYTICS_CACHE_TTL.USER_EVENTS;
    if (cacheKey.includes('metrics')) return ANALYTICS_CACHE_TTL.METRICS;
    
    // Default TTL
    return ANALYTICS_CACHE_TTL.AGGREGATED_DATA;
  },
  
  /**
   * Get cache key for analytics events with pagination
   */
  getEventsKey: (userId: string, page: number = 0, size: number = 100, eventType?: string): string => {
    if (eventType) {
      return ANALYTICS_CACHE_KEYS.EVENTS_BY_TYPE(eventType, page, size);
    }
    return ANALYTICS_CACHE_KEYS.USER_EVENTS(userId, page, size);
  },
  
  /**
   * Get cache key for metrics with filters
   */
  getMetricsKey: (dateRange?: string, filters?: string): string => {
    return ANALYTICS_CACHE_KEYS.METRICS(dateRange || 'default', filters);
  },
  
  /**
   * Get cache key for trend data
   */
  getTrendKey: (metric: string, period: string, granularity: string = 'daily'): string => {
    return ANALYTICS_CACHE_KEYS.TREND_DATA(metric, period, granularity);
  },
  
  /**
   * Get cache key for comparison data
   */
  getComparisonKey: (metric1: string, metric2: string, period: string): string => {
    return ANALYTICS_CACHE_KEYS.COMPARISON_DATA(metric1, metric2, period);
  }
};
