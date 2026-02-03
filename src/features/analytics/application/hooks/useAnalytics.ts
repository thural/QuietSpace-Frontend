/**
 * Analytics Hook - Enterprise Edition
 * 
 * Hook for managing analytics functionality with enterprise-grade architecture.
 * Uses custom query system, intelligent caching, and advanced data processing.
 */

import { useState, useCallback, useEffect } from 'react';
import { useCustomQuery } from '@/core/modules/hooks/useCustomQuery';
import { useCustomMutation } from '@/core/modules/hooks/useCustomMutation';
import { useCacheInvalidation } from '@/core/modules/hooks/migrationUtils';
import { useAnalyticsServices } from './useAnalyticsServices';
import { useFeatureAuth } from '@/core/modules/authentication';
import { AnalyticsEntity, AnalyticsMetrics, AnalyticsDashboard, DashboardWidget, AnalyticsReport, AnalyticsInsight, AnalyticsFunnel, AnalyticsGoal, DateRange, AnalyticsEventType } from '@features/analytics/domain/entities/IAnalyticsRepository';
import { JwtToken } from '@/shared/api/models/common';
import { ANALYTICS_CACHE_TTL } from '../data/cache/AnalyticsCacheKeys';

/**
 * Analytics State interface.
 */
export interface AnalyticsState {
    metrics: AnalyticsMetrics | null;
    dashboards: AnalyticsDashboard[] | null;
    reports: AnalyticsReport[] | null;
    insights: AnalyticsInsight[] | null;
    selectedDashboard: AnalyticsDashboard | null;
    selectedReport: AnalyticsReport | null;
    isLoading: boolean;
    error: Error | null;
    dateRange: DateRange;
    filters: Record<string, any>;
}

/**
 * Analytics Actions interface.
 */
export interface AnalyticsActions {
    // Data fetching
    fetchMetrics: (dateRange?: DateRange, filters?: Record<string, any>) => Promise<void>;
    fetchDashboards: (userId: string) => Promise<void>;
    fetchReports: (userId: string) => Promise<void>;
    fetchInsights: (dateRange?: DateRange) => Promise<void>;

    // Event tracking
    trackEvent: (event: Omit<AnalyticsEntity, 'id'>) => Promise<AnalyticsEntity>;
    trackPageView: (userId: string, sessionId: string, metadata: any) => Promise<AnalyticsEntity>;
    trackContentView: (userId: string, contentId: string, sessionId: string, metadata: any) => Promise<AnalyticsEntity>;
    trackUserAction: (userId: string, action: AnalyticsEventType, properties: any, sessionId: string, metadata: any) => Promise<AnalyticsEntity>;
    trackBatchEvents: (events: Array<Omit<AnalyticsEntity, 'id'>>) => Promise<AnalyticsEntity[]>;

    // Dashboard management
    createDashboard: (dashboard: Omit<AnalyticsDashboard, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AnalyticsDashboard>;
    updateDashboard: (dashboardId: string, updates: Partial<AnalyticsDashboard>) => Promise<AnalyticsDashboard>;
    deleteDashboard: (dashboardId: string) => Promise<void>;
    getDashboard: (dashboardId: string) => Promise<AnalyticsDashboard | null>;

    // Widget management
    addWidget: (dashboardId: string, widget: Omit<DashboardWidget, 'id'>) => Promise<DashboardWidget>;
    updateWidget: (dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>) => Promise<DashboardWidget>;
    removeWidget: (dashboardId: string, widgetId: string) => Promise<void>;
    getWidgetData: (widget: DashboardWidget, dateRange: DateRange) => Promise<any>;

    // Report management
    createReport: (report: Omit<AnalyticsReport, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AnalyticsReport>;
    generateReportData: (report: AnalyticsReport) => Promise<any>;
    getReport: (reportId: string) => Promise<AnalyticsReport | null>;

    // State management
    setSelectedDashboard: (dashboard: AnalyticsDashboard | null) => void;
    setSelectedReport: (report: AnalyticsReport | null) => void;
    setDateRange: (dateRange: DateRange) => void;
    setFilters: (filters: Record<string, any>) => void;
    clearError: () => void;
    refresh: () => void;
}

/**
 * Analytics Hook - Enterprise Edition
 * 
 * Hook that provides analytics functionality with enterprise-grade architecture.
 * Integrates with custom query system, intelligent caching, and advanced data processing.
 */
export const useAnalytics = (config?: { userId?: string }): AnalyticsState & AnalyticsActions => {
    const { analyticsFeatureService, analyticsDataService } = useAnalyticsServices();
    const invalidateCache = useCacheInvalidation();
    const { userId, token } = useFeatureAuth();

    // State
    const [selectedDashboard, setSelectedDashboard] = useState<AnalyticsDashboard | null>(null);
    const [selectedReport, setSelectedReport] = useState<AnalyticsReport | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
        preset: 'last_7_days'
    });
    const [filters, setFilters] = useState<Record<string, any>>({});

    // Get current user ID and token
    const currentUserId = config?.userId || userId || 'current-user';
    const getAuthToken = useCallback((): string => {
        return token || '';
    }, [token]);

    // Custom query for metrics with enterprise caching
    const metricsQuery = useCustomQuery(
        ['analytics', 'metrics', dateRange, filters],
        () => analyticsFeatureService.getMetrics(dateRange, filters, getAuthToken()),
        {
            staleTime: ANALYTICS_CACHE_TTL.METRICS,
            cacheTime: ANALYTICS_CACHE_TTL.METRICS,
            refetchInterval: ANALYTICS_CACHE_TTL.METRICS / 2, // Refresh at half TTL
            onSuccess: (data) => {
                console.log('Analytics metrics loaded:', {
                    totalEvents: data.totalEvents,
                    uniqueUsers: data.uniqueUsers,
                    dateRange: `${dateRange.start.toISOString()} - ${dateRange.end.toISOString()}`
                });
            },
            onError: (error) => {
                setError(error);
                console.error('Error fetching analytics metrics:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for dashboards
    const dashboardsQuery = useCustomQuery(
        ['analytics', 'dashboards', currentUserId],
        () => currentUserId ? analyticsDataService.getDashboardsByUser(currentUserId, getAuthToken()) : [],
        {
            staleTime: ANALYTICS_CACHE_TTL.USER_DASHBOARDS,
            cacheTime: ANALYTICS_CACHE_TTL.USER_DASHBOARDS,
            enabled: !!currentUserId,
            onSuccess: (data) => {
                console.log('Analytics dashboards loaded:', { count: data.length, userId: currentUserId });
            },
            onError: (error) => {
                console.error('Error fetching analytics dashboards:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for reports
    const reportsQuery = useCustomQuery(
        ['analytics', 'reports', currentUserId],
        () => currentUserId ? analyticsDataService.getReportsByUser(currentUserId, getAuthToken()) : [],
        {
            staleTime: ANALYTICS_CACHE_TTL.USER_REPORTS,
            cacheTime: ANALYTICS_CACHE_TTL.USER_REPORTS,
            enabled: !!currentUserId,
            onSuccess: (data) => {
                console.log('Analytics reports loaded:', { count: data.length, userId: currentUserId });
            },
            onError: (error) => {
                console.error('Error fetching analytics reports:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for insights
    const insightsQuery = useCustomQuery(
        ['analytics', 'insights', dateRange],
        () => analyticsDataService.getAggregatedData('insights', dateRange, filters, getAuthToken()),
        {
            staleTime: ANALYTICS_CACHE_TTL.INSIGHTS,
            cacheTime: ANALYTICS_CACHE_TTL.INSIGHTS,
            onSuccess: (data) => {
                console.log('Analytics insights loaded:', { count: data.data?.length || 0 });
            },
            onError: (error) => {
                console.error('Error fetching analytics insights:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom mutation for tracking events
    const trackEventMutation = useCustomMutation(
        (event: Omit<AnalyticsEntity, 'id'>) => analyticsFeatureService.trackEvent(event, getAuthToken()),
        {
            onSuccess: (result) => {
                console.log('Analytics event tracked:', {
                    eventId: result.id,
                    eventType: result.eventType,
                    userId: result.userId
                });

                // Invalidate relevant caches
                invalidateCache.invalidateEvents(result.userId);
                invalidateCache.invalidateMetrics();
            },
            onError: (error) => {
                setError(error);
                console.error('Error tracking analytics event:', error);
                throw error;
            }
        }
    );

    // Custom mutation for batch events
    const trackBatchEventsMutation = useCustomMutation(
        (events: Array<Omit<AnalyticsEntity, 'id'>>) => analyticsFeatureService.trackBatchEvents(events, getAuthToken()),
        {
            onSuccess: (results) => {
                console.log('Batch analytics events tracked:', { count: results.length });

                // Invalidate relevant caches
                const userIds = [...new Set(results.map(e => e.userId).filter(Boolean))];
                userIds.forEach(userId => invalidateCache.invalidateEvents(userId));
                invalidateCache.invalidateMetrics();
            },
            onError: (error) => {
                setError(error);
                console.error('Error tracking batch analytics events:', error);
                throw error;
            }
        }
    );

    // Custom mutation for creating dashboards
    const createDashboardMutation = useCustomMutation(
        (dashboard: Omit<AnalyticsDashboard, 'id' | 'createdAt' | 'updatedAt'>) => analyticsFeatureService.createDashboard(dashboard, getAuthToken()),
        {
            onSuccess: (result) => {
                console.log('Analytics dashboard created:', {
                    dashboardId: result.id,
                    name: result.name,
                    userId: result.userId
                });

                // Invalidate dashboards cache
                if (currentUserId) {
                    dashboardsQuery.refetch();
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error creating analytics dashboard:', error);
                throw error;
            }
        }
    );

    // Custom mutation for updating dashboards
    const updateDashboardMutation = useCustomMutation(
        ({ dashboardId, updates }: { dashboardId: string; updates: Partial<AnalyticsDashboard> }) =>
            analyticsFeatureService.updateDashboard(dashboardId, updates, getAuthToken()),
        {
            onSuccess: (result) => {
                console.log('Analytics dashboard updated:', {
                    dashboardId: result.id,
                    name: result.name
                });

                // Invalidate caches
                invalidateCache.invalidateDashboard(dashboardId);
                if (currentUserId) {
                    dashboardsQuery.refetch();
                }

                // Update selected dashboard if it's the one being updated
                if (selectedDashboard && selectedDashboard.id === dashboardId) {
                    setSelectedDashboard(result);
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error updating analytics dashboard:', error);
                throw error;
            }
        }
    );

    // Custom mutation for deleting dashboards
    const deleteDashboardMutation = useCustomMutation(
        (dashboardId: string) => analyticsFeatureService.deleteDashboard(dashboardId, getAuthToken()),
        {
            onSuccess: (_, dashboardId) => {
                console.log('Analytics dashboard deleted:', { dashboardId });

                // Invalidate caches
                invalidateCache.invalidateDashboard(dashboardId);
                if (currentUserId) {
                    dashboardsQuery.refetch();
                }

                // Clear selected dashboard if it was the one being deleted
                if (selectedDashboard && selectedDashboard.id === dashboardId) {
                    setSelectedDashboard(null);
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error deleting analytics dashboard:', error);
                throw error;
            }
        }
    );

    // Custom mutation for creating reports
    const createReportMutation = useCustomMutation(
        (report: Omit<AnalyticsReport, 'id' | 'createdAt' | 'updatedAt'>) => analyticsFeatureService.createReport(report, getAuthToken()),
        {
            onSuccess: (result) => {
                console.log('Analytics report created:', {
                    reportId: result.id,
                    name: result.name,
                    userId: result.userId
                });

                // Invalidate reports cache
                if (currentUserId) {
                    reportsQuery.refetch();
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error creating analytics report:', error);
                throw error;
            }
        }
    );

    // Action implementations
    const fetchMetrics = useCallback(async (dateRange?: DateRange, filters?: Record<string, any>) => {
        try {
            setError(null);

            if (dateRange) {
                setDateRange(dateRange);
            }
            if (filters) {
                setFilters(filters);
            }

            metricsQuery.refetch();
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching analytics metrics:', err);
        }
    }, [metricsQuery, setDateRange, setFilters]);

    const fetchDashboards = useCallback(async (userId: string) => {
        try {
            setError(null);
            // The query will automatically refetch when userId changes
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching analytics dashboards:', err);
        }
    }, [dashboardsQuery]);

    const fetchReports = useCallback(async (userId: string) => {
        try {
            setError(null);
            // The query will automatically refetch when userId changes
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching analytics reports:', err);
        }
    }, [reportsQuery]);

    const fetchInsights = useCallback(async (dateRange?: DateRange) => {
        try {
            setError(null);

            if (dateRange) {
                setDateRange(dateRange);
            }

            insightsQuery.refetch();
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching analytics insights:', err);
        }
    }, [insightsQuery, setDateRange]);

    const trackEvent = useCallback(async (event: Omit<AnalyticsEntity, 'id'>) => {
        await trackEventMutation.mutateAsync(event);
    }, [trackEventMutation]);

    const trackPageView = useCallback(async (userId: string, sessionId: string, metadata: any) => {
        const pageViewEvent: Omit<AnalyticsEntity, 'id'> = {
            userId,
            eventType: 'page_view',
            timestamp: new Date(),
            sessionId,
            metadata,
            properties: {
                url: metadata.url,
                title: metadata.title,
                referrer: metadata.referrer
            },
            source: 'web'
        };

        await trackEvent(pageViewEvent);
    }, [trackEventMutation]);

    const trackContentView = useCallback(async (userId: string, contentId: string, sessionId: string, metadata: any) => {
        const contentViewEvent: Omit<AnalyticsEntity, 'id'> = {
            userId,
            contentId,
            eventType: 'content_view',
            timestamp: new Date(),
            sessionId,
            metadata,
            properties: {
                contentType: metadata.contentType,
                contentCategory: metadata.contentCategory
            },
            source: 'web'
        };

        await trackEvent(contentViewEvent);
    }, [trackEventMutation]);

    const trackUserAction = useCallback(async (userId: string, action: AnalyticsEventType, properties: any, sessionId: string, metadata: any) => {
        const userActionEvent: Omit<AnalyticsEntity, 'id'> = {
            userId,
            eventType: action,
            timestamp: new Date(),
            sessionId,
            metadata,
            properties,
            source: 'web'
        };

        await trackEvent(userActionEvent);
    }, [trackEventMutation]);

    const trackBatchEvents = useCallback(async (events: Array<Omit<AnalyticsEntity, 'id'>>) => {
        await trackBatchEventsMutation.mutateAsync(events);
    }, [trackBatchEventsMutation]);

    const createDashboard = useCallback(async (dashboard: Omit<AnalyticsDashboard, 'id' | 'createdAt' | 'updatedAt'>) => {
        await createDashboardMutation.mutateAsync(dashboard);
    }, [createDashboardMutation]);

    const updateDashboard = useCallback(async (dashboardId: string, updates: Partial<AnalyticsDashboard>) => {
        await updateDashboardMutation.mutateAsync({ dashboardId, updates });
    }, [updateDashboardMutation]);

    const deleteDashboard = useCallback(async (dashboardId: string) => {
        await deleteDashboardMutation.mutateAsync(dashboardId);
    }, [deleteDashboardMutation]);

    const getDashboard = useCallback(async (dashboardId: string) => {
        try {
            setError(null);
            const result = await analyticsDataService.getDashboardById(dashboardId, getAuthToken());
            setSelectedDashboard(result);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting analytics dashboard:', err);
        }
    }, [analyticsDataService, getAuthToken, setSelectedDashboard]);

    const addWidget = useCallback(async (dashboardId: string, widget: Omit<DashboardWidget, 'id'>) => {
        try {
            setError(null);
            const result = await analyticsDataService.addWidgetToDashboard(dashboardId, widget, getAuthToken());

            // Invalidate dashboard cache
            invalidateCache.invalidateDashboard(dashboardId);
            if (selectedDashboard && selectedDashboard.id === dashboardId) {
                // Refresh the selected dashboard
                getDashboard(dashboardId);
            }

            return result;
        } catch (err) {
            setError(err as Error);
            console.error('Error adding widget to dashboard:', err);
            throw err;
        }
    }, [analyticsDataService, invalidateCache, selectedDashboard, getDashboard]);

    const updateWidget = useCallback(async (dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>) => {
        try {
            setError(null);
            const result = await analyticsDataService.updateWidgetInDashboard(dashboardId, widgetId, updates, getAuthToken());

            // Invalidate dashboard cache
            invalidateCache.invalidateDashboard(dashboardId);
            if (selectedDashboard && selectedDashboard.id === dashboardId) {
                // Refresh the selected dashboard
                getDashboard(dashboardId);
            }

            return result;
        } catch (err) {
            setError(err as Error);
            console.error('Error updating widget in dashboard:', err);
            throw err;
        }
    }, [analyticsDataService, invalidateCache, selectedDashboard, getDashboard]);

    const removeWidget = useCallback(async (dashboardId: string, widgetId: string) => {
        try {
            setError(null);
            await analyticsDataService.removeWidgetFromDashboard(dashboardId, widgetId, getAuthToken());

            // Invalidate dashboard cache
            invalidateCache.invalidateDashboard(dashboardId);
            if (selectedDashboard && selectedDashboard.id === dashboardId) {
                // Refresh the selected dashboard
                getDashboard(dashboardId);
            }
        } catch (err) {
            setError(err as Error);
            console.error('Error removing widget from dashboard:', err);
            throw err;
        }
    }, [analyticsDataService, invalidateCache, selectedDashboard, getDashboard]);

    const getWidgetData = useCallback(async (widget: DashboardWidget, widgetDateRange: DateRange) => {
        try {
            setError(null);
            return await analyticsDataService.getWidgetData(widget, widgetDateRange);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting widget data:', err);
            throw err;
        }
    }, [analyticsDataService]);

    const createReport = useCallback(async (report: Omit<AnalyticsReport, 'id' | 'createdAt' | 'updatedAt'>) => {
        await createReportMutation.mutateAsync(report);
    }, [createReportMutation]);

    const generateReportData = useCallback(async (report: AnalyticsReport) => {
        try {
            setError(null);
            return await analyticsFeatureService.generateCustomReport(report.id, getAuthToken());
        } catch (err) {
            setError(err as Error);
            console.error('Error generating report data:', err);
            throw err;
        }
    }, [analyticsFeatureService, getAuthToken]);

    const getReport = useCallback(async (reportId: string) => {
        try {
            setError(null);
            const result = await analyticsDataService.getReportById(reportId, getAuthToken());
            setSelectedReport(result);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting analytics report:', err);
        }
    }, [analyticsDataService, getAuthToken, setSelectedReport]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const refresh = useCallback(() => {
        metricsQuery.refetch();
        if (currentUserId) {
            dashboardsQuery.refetch();
            reportsQuery.refetch();
        }
        insightsQuery.refetch();
    }, [metricsQuery, dashboardsQuery, reportsQuery, insightsQuery, currentUserId]);

    // Auto-refresh metrics on mount
    useEffect(() => {
        metricsQuery.refetch();
    }, [metricsQuery]);

    return {
        // State
        metrics: metricsQuery.data,
        dashboards: dashboardsQuery.data,
        reports: reportsQuery.data,
        insights: insightsQuery.data,
        selectedDashboard,
        selectedReport,
        isLoading: metricsQuery.isLoading || dashboardsQuery.isLoading || reportsQuery.isLoading || insightsQuery.isLoading,
        error: error || metricsQuery.error || dashboardsQuery.error || reportsQuery.error || insightsQuery.error,
        dateRange,
        filters,

        // Actions
        fetchMetrics,
        fetchDashboards,
        fetchReports,
        fetchInsights,
        trackEvent,
        trackPageView,
        trackContentView,
        trackUserAction,
        trackBatchEvents,
        createDashboard,
        updateDashboard,
        deleteDashboard,
        getDashboard,
        addWidget,
        updateWidget,
        removeWidget,
        getWidgetData,
        createReport,
        generateReportData,
        getReport,
        setSelectedDashboard,
        setSelectedReport,
        setDateRange,
        setFilters,
        clearError,
        refresh,
    };
};
