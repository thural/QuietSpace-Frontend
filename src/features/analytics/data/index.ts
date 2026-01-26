// Data layer exports
export { AnalyticsRepository } from './AnalyticsRepository';

// Data services (Enterprise)
export { AnalyticsDataService } from './services/AnalyticsDataService';

// Cache exports (Enterprise)
export { ANALYTICS_CACHE_KEYS, ANALYTICS_CACHE_TTL, ANALYTICS_CACHE_INVALIDATION, AnalyticsCacheUtils } from './cache/AnalyticsCacheKeys';

// Types and interfaces (Enterprise)
export type {
  IAnalyticsRepository
} from '../domain/entities/IAnalyticsRepository';

// Export types from AnalyticsEntity
export type {
  AnalyticsEntity,
  AnalyticsEventType,
  AnalyticsMetadata,
  AnalyticsProperties,
  AnalyticsSource,
  AnalyticsMetrics,
  AnalyticsDashboard,
  DashboardWidget,
  DateRange
} from '../domain/AnalyticsEntity';

// Legacy exports (for backward compatibility)
export type { AnalyticsEntity as AnalyticsEntityLegacy } from '../domain/AnalyticsEntity';
