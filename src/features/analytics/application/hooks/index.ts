/**
 * Analytics Hooks Barrel Export.
 * 
 * Exports all hooks with enterprise-grade architecture.
 */

// Enterprise Hooks
export { useAnalytics } from './useAnalytics';
export { useAnalyticsServices } from './useAnalyticsServices';
export { useRealtimeAnalytics } from './useRealtimeAnalytics';
export { useAnalyticsDashboard } from './useAnalyticsDashboard';

// Legacy Hooks (for backward compatibility)
export { useAnalyticsDI } from '../services/AnalyticsServiceDI';
