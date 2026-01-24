/**
 * Real-time Analytics Hook
 * 
 * Enterprise-grade real-time analytics monitoring with custom query system
 * and intelligent caching for immediate updates
 */

import { useState, useCallback, useEffect } from 'react';
import { useCustomQuery } from '@/core/hooks/useCustomQuery';
import { useAnalyticsServices } from './useAnalyticsServices';
import { useAuthStore } from '@services/store/zustand';
import { ANALYTICS_CACHE_TTL } from '../data/cache/AnalyticsCacheKeys';

/**
 * Real-time Analytics State interface.
 */
export interface RealtimeAnalyticsState {
    metrics: any | null;
    systemHealth: any | null;
    queueStatus: any | null;
    isLoading: boolean;
    error: Error | null;
    lastUpdated: Date | null;
}

/**
 * Real-time Analytics Actions interface.
 */
export interface RealtimeAnalyticsActions {
    refresh: () => void;
    clearError: () => void;
    subscribeToUpdates: (callback: (data: any) => void) => () => void;
}

/**
 * Real-time Analytics Hook
 * 
 * Hook that provides real-time analytics functionality with enterprise-grade architecture.
 * Integrates with custom query system and intelligent caching for immediate updates.
 */
export const useRealtimeAnalytics = (config?: { userId?: string, refreshInterval?: number }): RealtimeAnalyticsState & RealtimeAnalyticsActions => {
    const { analyticsDataService } = useAnalyticsServices();
    const { data: authData } = useAuthStore();

    // State
    const [metrics, setMetrics] = useState<any | null>(null);
    const [systemHealth, setSystemHealth] = useState<any | null>(null);
    const [queueStatus, setQueueStatus] = useState<any | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [subscribers, setSubscribers] = useState<Array<(data: any) => void>>([]);

    // Get current user ID and token
    const currentUserId = config?.userId || authData?.userId || 'global';
    const refreshInterval = config?.refreshInterval || 30000; // 30 seconds default
    const getAuthToken = useCallback((): string => {
        try {
            const authStore = useAuthStore.getState();
            return authStore.data.accessToken || '';
        } catch (err) {
            console.error('useRealtimeAnalytics: Error getting auth token', err);
            return '';
        }
    }, []);

    // Custom query for real-time metrics
    const realtimeMetricsQuery = useCustomQuery(
        ['analytics', 'realtime', 'metrics', currentUserId],
        () => analyticsDataService.getRealtimeMetrics(currentUserId, getAuthToken()),
        {
            staleTime: ANALYTICS_CACHE_TTL.REAL_TIME_METRICS,
            cacheTime: ANALYTICS_CACHE_TTL.REAL_TIME_METRICS,
            refetchInterval: ANALYTICS_CACHE_TTL.REAL_TIME_METRICS / 3, // Refresh at 1/3 TTL
            onSuccess: (data) => {
                setMetrics(data);
                setLastUpdated(new Date());
                
                // Notify subscribers
                subscribers.forEach(callback => {
                    try {
                        callback(data);
                    } catch (err) {
                        console.error('Error notifying subscriber:', err);
                    }
                });
                
                console.log('Real-time metrics updated:', { 
                    activeUsers: data.activeUsers,
                    currentSessions: data.currentSessions,
                    eventsPerSecond: data.eventsPerSecond,
                    userId: currentUserId 
                });
            },
            onError: (error) => {
                setError(error);
                console.error('Error fetching real-time metrics:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 3; // More retries for real-time data
            }
        }
    );

    // Custom query for system health
    const systemHealthQuery = useCustomQuery(
        ['analytics', 'system', 'health'],
        () => analyticsDataService.getSystemHealth(getAuthToken()),
        {
            staleTime: ANALYTICS_CACHE_TTL.SYSTEM_HEALTH,
            cacheTime: ANALYTICS_CACHE_TTL.SYSTEM_HEALTH,
            refetchInterval: ANALYTICS_CACHE_TTL.SYSTEM_HEALTH / 2, // Refresh at 1/2 TTL
            onSuccess: (data) => {
                setSystemHealth(data);
                
                // Notify subscribers
                subscribers.forEach(callback => {
                    try {
                        callback({ type: 'systemHealth', data });
                    } catch (err) {
                        console.error('Error notifying subscriber:', err);
                    }
                });
                
                console.log('System health updated:', { 
                    status: data.status,
                    uptime: data.uptime,
                    responseTime: data.responseTime 
                });
            },
            onError: (error) => {
                console.error('Error fetching system health:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for processing queue status
    const queueStatusQuery = useCustomQuery(
        ['analytics', 'queue', 'status'],
        () => analyticsDataService.getProcessingQueueStatus(getAuthToken()),
        {
            staleTime: ANALYTICS_CACHE_TTL.PROCESSING_QUEUE,
            cacheTime: ANALYTICS_CACHE_TTL.PROCESSING_QUEUE,
            refetchInterval: ANALYTICS_CACHE_TTL.PROCESSING_QUEUE / 2, // Refresh at 1/2 TTL
            onSuccess: (data) => {
                setQueueStatus(data);
                
                // Notify subscribers
                subscribers.forEach(callback => {
                    try {
                        callback({ type: 'queueStatus', data });
                    } catch (err) {
                        console.error('Error notifying subscriber:', err);
                    }
                });
                
                console.log('Queue status updated:', { 
                    queueSize: data.queueSize,
                    processingRate: data.processingRate,
                    failedJobs: data.failedJobs 
                });
            },
            onError: (error) => {
                console.error('Error fetching queue status:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Subscribe to updates
    const subscribeToUpdates = useCallback((callback: (data: any) => void) => {
        setSubscribers(prev => [...prev, callback]);
        
        // Return unsubscribe function
        return () => {
            setSubscribers(prev => prev.filter(sub => sub !== callback));
        };
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Refresh all real-time data
    const refresh = useCallback(() => {
        realtimeMetricsQuery.refetch();
        systemHealthQuery.refetch();
        queueStatusQuery.refetch();
    }, [realtimeMetricsQuery, systemHealthQuery, queueStatusQuery]);

    // Auto-refresh based on interval
    useEffect(() => {
        const interval = setInterval(() => {
            refresh();
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [refresh, refreshInterval]);

    // Cleanup subscribers on unmount
    useEffect(() => {
        return () => {
            setSubscribers([]);
        };
    }, []);

    return {
        // State
        metrics,
        systemHealth,
        queueStatus,
        isLoading: realtimeMetricsQuery.isLoading || systemHealthQuery.isLoading || queueStatusQuery.isLoading,
        error: error || realtimeMetricsQuery.error || systemHealthQuery.error || queueStatusQuery.error,
        lastUpdated,

        // Actions
        refresh,
        clearError,
        subscribeToUpdates
    };
};

export default useRealtimeAnalytics;
