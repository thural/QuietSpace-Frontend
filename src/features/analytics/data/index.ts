// Data layer exports
export { AnalyticsRepository } from './repositories/AnalyticsRepository';

// Data services (Enterprise)
export { AnalyticsDataService } from './services/AnalyticsDataService';

// Cache exports (Enterprise)
export { ANALYTICS_CACHE_KEYS, ANALYTICS_CACHE_TTL, ANALYTICS_CACHE_INVALIDATION, AnalyticsCacheUtils } from './cache/AnalyticsCacheKeys';

// Types and interfaces (Enterprise)
export type { 
  IAnalyticsRepository,
  AnalyticsEntity,
  AnalyticsMetrics,
  AnalyticsDashboard,
  DashboardWidget,
  AnalyticsReport,
  AnalyticsInsight,
  AnalyticsFunnel,
  AnalyticsGoal,
  DateRange,
  AnalyticsEventType,
  RealtimeAnalyticsMetrics,
  PerformanceAnalyticsMetrics,
  EngagementAnalyticsMetrics,
  ConversionAnalyticsMetrics,
  TrafficanalyticsMetrics,
  ContentAnalyticsMetrics,
  BehaviorAnalyticsMetrics,
  ErrorAnalyticsMetrics,
  AggregatedAnalyticsData,
  TrendAnalyticsData,
  ComparisonAnalyticsData,
  SearchAnalyticsData,
  MediaAnalyticsData,
  FeatureUsageAnalyticsData,
  ABTestAnalyticsData,
  CustomReportData,
  ExportAnalyticsData,
  SystemHealthData,
  ProcessingQueueStatus,
  CacheStats
} from '../domain/entities/IAnalyticsRepository';

// Legacy exports (for backward compatibility)
export { AnalyticsEntity as AnalyticsEntityLegacy } from '../domain/AnalyticsEntity';
