/**
 * Analytics Components Index
 * 
 * This file exports all analytics-related components for easy importing
 * throughout the chat feature.
 */

// Main Analytics Components
export { default as AnalyticsDashboard } from './AnalyticsDashboard';
export { default as AnalyticsProvider, useAnalytics, useAnalyticsEvents } from './AnalyticsProvider';
export { default as MetricsDisplay } from './MetricsDisplay';
export { default as UserBehaviorChart } from './UserBehaviorChart';
export { default as PerformanceTrends } from './PerformanceTrends';

// Types and Interfaces
export type { AnalyticsEvent, AnalyticsMetrics, AnalyticsState } from './AnalyticsProvider';

// Re-export for convenience
export {
    // Analytics Provider
    AnalyticsProvider as ChatAnalyticsProvider,
    useAnalytics as useChatAnalytics,
    useAnalyticsEvents as useChatAnalyticsEvents,
    
    // Dashboard Components
    AnalyticsDashboard as ChatAnalyticsDashboard,
    MetricsDisplay as ChatMetricsDisplay,
    UserBehaviorChart as ChatUserBehaviorChart,
    PerformanceTrends as ChatPerformanceTrends
} from './AnalyticsProvider';
