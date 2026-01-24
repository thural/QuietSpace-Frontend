/**
 * Analytics Application Barrel Export.
 * 
 * Exports all application layer components with enterprise-grade architecture.
 */

// Enterprise Hooks
export { useAnalytics } from './hooks/useAnalytics';
export { useAnalyticsServices } from './hooks/useAnalyticsServices';
export { useRealtimeAnalytics } from './hooks/useRealtimeAnalytics';
export { useAnalyticsDashboard } from './hooks/useAnalyticsDashboard';

// Enterprise Services
export { AnalyticsFeatureService } from './services/index';

// Legacy Services (for backward compatibility)
export { AnalyticsService, useAnalyticsDI } from './services/AnalyticsServiceDI';
