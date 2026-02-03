/**
 * Analytics Dashboard Hook
 * 
 * Enterprise-grade dashboard management with custom query system
 * and intelligent caching for dashboard operations
 */

import { useState, useCallback, useEffect } from 'react';
import { useCustomQuery, useCustomMutation } from '@/core/modules/hooks/useCustomQuery';
import { useCacheInvalidation } from '@/core/modules/hooks/migrationUtils';
import { useAnalyticsServices } from './useAnalyticsServices';
import { useFeatureAuth } from '@/core/modules/authentication';
import { AnalyticsDashboard, DashboardWidget, DateRange } from '@features/analytics/domain/entities/IAnalyticsRepository';
import { JwtToken } from '@/shared/api/models/common';
import { ANALYTICS_CACHE_TTL } from '../data/cache/AnalyticsCacheKeys';

/**
 * Analytics Dashboard State interface.
 */
export interface AnalyticsDashboardState {
    dashboards: AnalyticsDashboard[] | null;
    selectedDashboard: AnalyticsDashboard | null;
    widgetData: Record<string, any> | null;
    isLoading: boolean;
    error: Error | null;
    isCreating: boolean;
    isUpdating: Record<string, boolean>;
    isDeleting: Record<string, boolean>;
}

/**
 * Analytics Dashboard Actions interface.
 */
export interface AnalyticsDashboardActions {
    // Dashboard operations
    fetchDashboards: (userId: string) => Promise<void>;
    createDashboard: (dashboard: Omit<AnalyticsDashboard, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AnalyticsDashboard>;
    updateDashboard: (dashboardId: string, updates: Partial<AnalyticsDashboard>) => Promise<AnalyticsDashboard>;
    deleteDashboard: (dashboardId: string) => Promise<void>;
    getDashboard: (dashboardId: string) => Promise<AnalyticsDashboard | null>;

    // Widget operations
    addWidget: (dashboardId: string, widget: Omit<DashboardWidget, 'id'>) => Promise<DashboardWidget>;
    updateWidget: (dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>) => Promise<DashboardWidget>;
    removeWidget: (dashboardId: string, widgetId: string) => Promise<void>;
    getWidgetData: (widget: DashboardWidget, dateRange: DateRange) => Promise<any>;

    // State management
    setSelectedDashboard: (dashboard: AnalyticsDashboard | null) => void;
    clearWidgetData: (widgetId?: string) => void;
    clearError: () => void;
    refresh: () => void;

    // Batch operations
    refreshWidgetData: (dashboardId: string, widgets: DashboardWidget[], dateRange: DateRange) => Promise<Record<string, any>>;
}

/**
 * Analytics Dashboard Hook - Enterprise Edition
 * 
 * Hook that provides dashboard management functionality with enterprise-grade architecture.
 * Integrates with custom query system, intelligent caching, and widget data processing.
 */
export const useAnalyticsDashboard = (config?: { userId?: string, autoRefresh?: boolean }): AnalyticsDashboardState & AnalyticsDashboardActions => {
    const { analyticsDataService } = useAnalyticsServices();
    const invalidateCache = useCacheInvalidation();
    const { token, userId } = useFeatureAuth();

    // State
    const [selectedDashboard, setSelectedDashboard] = useState<AnalyticsDashboard | null>(null);
    const [widgetData, setWidgetData] = useState<Record<string, any> | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
    const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
    const [dateRange, setDateRange] = useState<DateRange>({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
        preset: 'last_7_days'
    });

    // Get current user ID and token
    const currentUserId = config?.userId || userId || 'current-user';
    const getAuthToken = useCallback((): string => {
        return token || '';
    }, [token]);

    // Auto-refresh configuration
    const autoRefresh = config?.autoRefresh !== false;

    // Custom query for dashboards
    const dashboardsQuery = useCustomQuery(
        ['analytics', 'dashboards', currentUserId],
        () => currentUserId ? analyticsDataService.getDashboardsByUser(currentUserId, getAuthToken()) : [],
        {
            staleTime: ANALYTICS_CACHE_TTL.USER_DASHBOARDS,
            cacheTime: ANALYTICS_CACHE_TTL.USER_DASHBOARDS,
            enabled: !!currentUserId,
            refetchInterval: autoRefresh ? ANALYTICS_CACHE_TTL.USER_DASHBOARDS : undefined,
            onSuccess: (data) => {
                console.log('Analytics dashboards loaded:', { count: data.length, userId: currentUserId });
            },
            onError: (error) => {
                setError(error);
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

    // Custom query for selected dashboard
    const selectedDashboardQuery = useCustomQuery(
        ['analytics', 'dashboard', selectedDashboard?.id],
        () => selectedDashboard ? analyticsDataService.getDashboardById(selectedDashboard.id, getAuthToken()) : null,
        {
            staleTime: ANALYTICS_CACHE_TTL.DASHBOARD,
            cacheTime: ANALYTICS_CACHE_TTL.DASHBOARD,
            enabled: !!selectedDashboard?.id,
            onSuccess: (data) => {
                if (data) {
                    setSelectedDashboard(data);
                    console.log('Dashboard loaded:', { dashboardId: data.id, name: data.name });
                }
            },
            onError: (error) => {
                console.error('Error fetching dashboard:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom mutation for creating dashboards
    const createDashboardMutation = useCustomMutation(
        (dashboard: Omit<AnalyticsDashboard, 'id' | 'createdAt' | 'updatedAt'>) => analyticsDataService.createDashboard(dashboard, getAuthToken()),
        {
            onSuccess: (result) => {
                console.log('Dashboard created:', { dashboardId: result.id, name: result.name });

                // Invalidate dashboards cache
                dashboardsQuery.refetch();

                // Set as selected dashboard
                setSelectedDashboard(result);
                setIsCreating(false);
            },
            onError: (error) => {
                setError(error);
                setIsCreating(false);
                console.error('Error creating dashboard:', error);
                throw error;
            },
            onMutate: () => setIsCreating(true),
            onSettled: () => setIsCreating(false)
        }
    );

    // Custom mutation for updating dashboards
    const updateDashboardMutation = useCustomMutation(
        ({ dashboardId, updates }: { dashboardId: string; updates: Partial<AnalyticsDashboard> }) =>
            analyticsDataService.updateDashboard(dashboardId, updates, getAuthToken()),
        {
            onSuccess: (result) => {
                console.log('Dashboard updated:', { dashboardId: result.id, name: result.name });

                // Invalidate caches
                invalidateCache.invalidateDashboard(dashboardId);
                dashboardsQuery.refetch();

                // Update selected dashboard if it's the one being updated
                if (selectedDashboard && selectedDashboard.id === dashboardId) {
                    setSelectedDashboard(result);
                }

                setIsUpdating(prev => ({ ...prev, [dashboardId]: false }));
            },
            onError: (error) => {
                setError(error);
                setIsUpdating(prev => ({ ...prev, [dashboardId]: false }));
                console.error('Error updating dashboard:', error);
                throw error;
            },
            onMutate: () => setIsUpdating(prev => ({ ...prev, [dashboardId]: true })),
            onSettled: () => setIsUpdating(prev => ({ ...prev, [dashboardId]: false }))
        }
    );

    // Custom mutation for deleting dashboards
    const deleteDashboardMutation = useCustomMutation(
        (dashboardId: string) => analyticsDataService.deleteDashboard(dashboardId, getAuthToken()),
        {
            onSuccess: (_, dashboardId) => {
                console.log('Dashboard deleted:', { dashboardId });

                // Invalidate caches
                invalidateCache.invalidateDashboard(dashboardId);
                dashboardsQuery.refetch();

                // Clear selected dashboard if it was the one being deleted
                if (selectedDashboard && selectedDashboard.id === dashboardId) {
                    setSelectedDashboard(null);
                    clearWidgetData();
                }

                setIsDeleting(prev => ({ ...prev, [dashboardId]: false }));
            },
            onError: (error) => {
                setError(error);
                setIsDeleting(prev => ({ ...prev, [dashboardId]: false }));
                console.error('Error deleting dashboard:', error);
                throw error;
            },
            onMutate: () => setIsDeleting(prev => ({ ...prev, [dashboardId]: true })),
            onSettled: () => setIsDeleting(prev => ({ ...prev, [dashboardId]: false }))
        }
    );

    // Action implementations
    const fetchDashboards = useCallback(async (userId: string) => {
        try {
            setError(null);
            // The query will automatically refetch when userId changes
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching analytics dashboards:', err);
        }
    }, [dashboardsQuery]);

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
            return result;
        } catch (err) {
            setError(err as Error);
            console.error('Error getting dashboard:', err);
            return null;
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

            // Clear widget data for the removed widget
            if (widgetData && widgetData[widgetId]) {
                setWidgetData(prev => {
                    const newData = { ...prev };
                    delete newData[widgetId];
                    return newData;
                });
            }
        } catch (err) {
            setError(err as Error);
            console.error('Error removing widget from dashboard:', err);
            throw err;
        }
    }, [analyticsDataService, invalidateCache, selectedDashboard, getDashboard, widgetData, setWidgetData]);

    const getWidgetData = useCallback(async (widget: DashboardWidget, widgetDateRange: DateRange) => {
        try {
            setError(null);
            const data = await analyticsDataService.getWidgetData(widget, widgetDateRange);

            // Cache widget data
            if (widgetData) {
                setWidgetData(prev => ({
                    ...prev,
                    [widget.id]: data
                }));
            }

            return data;
        } catch (err) {
            setError(err as Error);
            console.error('Error getting widget data:', err);
            throw err;
        }
    }, [analyticsDataService, widgetData, setWidgetData]);

    const refreshWidgetData = useCallback(async (dashboardId: string, widgets: DashboardWidget[], dateRange: DateRange) => {
        try {
            setError(null);

            // Clear existing widget data
            setWidgetData({});

            // Fetch data for all widgets in parallel
            const widgetDataPromises = widgets.map(widget =>
                getWidgetData(widget, dateRange).catch(err => {
                    console.error(`Error fetching data for widget ${widget.id}:`, err);
                    return null;
                })
            );

            const widgetDataResults = await Promise.all(widgetDataPromises);

            // Cache widget data
            const newWidgetData: Record<string, any> = {};
            widgets.forEach((widget, index) => {
                if (widgetDataResults[index]) {
                    newWidgetData[widget.id] = widgetDataResults[index];
                }
            });

            setWidgetData(newWidgetData);

            return newWidgetData;
        } catch (err) {
            setError(err as Error);
            console.error('Error refreshing widget data:', err);
            throw err;
        }
    }, [getWidgetData, setWidgetData]);

    const clearWidgetData = useCallback((widgetId?: string) => {
        if (widgetId) {
            setWidgetData(prev => {
                const newData = { ...prev };
                delete newData[widgetId];
                return newData;
            });
        } else {
            setWidgetData({});
        }
    }, [setWidgetData]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const refresh = useCallback(() => {
        dashboardsQuery.refetch();
        if (selectedDashboard) {
            selectedDashboardQuery.refetch();
        }
    }, [dashboardsQuery, selectedDashboardQuery]);

    // Auto-refresh selected dashboard
    useEffect(() => {
        if (selectedDashboard && autoRefresh) {
            const interval = setInterval(() => {
                refreshWidgetData(selectedDashboard.id, selectedDashboard.widgets, dateRange);
            }, 60000); // Refresh every minute

            return () => clearInterval(interval);
        }
    }, [selectedDashboard, autoRefresh, refreshWidgetData, dateRange]);

    return {
        // State
        dashboards: dashboardsQuery.data,
        selectedDashboard,
        widgetData,
        isLoading: dashboardsQuery.isLoading || selectedDashboardQuery.isLoading,
        error: error || dashboardsQuery.error || selectedDashboardQuery.error,
        isCreating,
        isUpdating,
        isDeleting,

        // Actions
        fetchDashboards,
        createDashboard,
        updateDashboard,
        deleteDashboard,
        getDashboard,
        addWidget,
        updateWidget,
        removeWidget,
        getWidgetData,
        refreshWidgetData,
        setSelectedDashboard,
        clearWidgetData,
        clearError,
        refresh
    };
};
