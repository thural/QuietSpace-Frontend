/**
 * Analytics Hooks Barrel Export.
 * 
 * Exports all hooks from the application layer.
 */

// Legacy Analytics Hooks (for backward compatibility)
export { default as useAnalytics } from './useAnalytics';
export { default as useRealtimeAnalytics } from './useRealtimeAnalytics';
export { default as useAnalyticsDashboard } from './useAnalyticsDashboard';
export { default as useAnalyticsDI } from '../services/AnalyticsServiceDI';

// Enterprise Analytics Hooks (new - recommended for use)
export { useEnterpriseAnalytics } from './useEnterpriseAnalytics';

// Migration Hook (for gradual transition)
export { useAnalyticsMigration, AnalyticsMigrationUtils } from './useAnalyticsMigration';

// Enterprise Services Hook
export { useAnalyticsServices } from './useAnalyticsServices';

// Re-export commonly used types and utilities
export type { 
  AnalyticsEntity, 
  AnalyticsMetrics, 
  AnalyticsDashboard,
  DashboardWidget,
  AnalyticsReport,
  AnalyticsInsight,
  AnalyticsFunnel,
  AnalyticsGoal,
  DateRange,
  AnalyticsEventType 
} from '@features/analytics/domain/entities/IAnalyticsRepository';
export type { JwtToken } from '@/shared/api/models/common';
