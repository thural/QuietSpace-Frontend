/**
 * Metrics Display Component
 * 
 * This component displays real-time metrics in a compact, visually appealing format
 * with trend indicators and performance status.
 */

import React, { useState, useEffect } from 'react';
import { useAnalytics } from './AnalyticsProvider';
import { Container } from "../../../../../shared/ui/components";
import Typography from '@shared/Typography';
import {
    FiTrendingUp,
    FiTrendingDown,
    FiActivity,
    FiZap,
    FiUsers,
    FiMessageCircle,
    FiClock,
    FiCheckCircle,
    FiAlertCircle,
    FiBarChart2
} from 'react-icons/fi';

interface MetricsDisplayProps {
    className?: string;
    showTrends?: boolean;
    compact?: boolean;
    refreshInterval?: number;
}

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    status?: 'good' | 'warning' | 'error';
    color?: string;
}

/**
 * Individual metric card component
 */
const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    icon,
    trend,
    status = 'good',
    color = 'blue'
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'good': return 'text-green-600 bg-green-100';
            case 'warning': return 'text-yellow-600 bg-yellow-100';
            case 'error': return 'text-red-600 bg-red-100';
            default: return `text-${color}-600 bg-${color}-100`;
        }
    };

    const getTrendIcon = (isPositive: boolean) => {
        return isPositive ? (
            <FiTrendingUp className=\"text-green-500\" />
        ) : (
    <FiTrendingDown className=\"text-red-500\" />
        );
    };

return (
    <Container className={`p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow`}>
        <div className=\"flex items-center justify-between mb-2\">
        <div className=\"flex items-center space-x-2\">
        <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
            {icon}
        </div>
        <Typography className=\"text-sm text-gray-600\">{title}</Typography>
                </div >

    { trend && (
        <div className=\"flex items-center space-x-1\">
{ getTrendIcon(trend.isPositive) }
<Typography className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'
    }`}>
    {trend.isPositive ? '+' : ''}{trend.value}%
</Typography>
                    </div >
                )}
            </div >

    <Typography className=\"text-2xl font-bold text-gray-900\">{value}</Typography>
        </Container >
    );
};

/**
 * Metrics Display component that shows real-time chat metrics
 */
const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
    className = '',
    showTrends = true,
    compact = false,
    refreshInterval = 30000
}) => {
    const { state, getMetrics } = useAnalytics();
    const [previousMetrics, setPreviousMetrics] = useState<any>(null);
    const [trends, setTrends] = useState<Record<string, any>>({});

    // Calculate trends
    useEffect(() => {
        const currentMetrics = getMetrics();

        if (previousMetrics) {
            const newTrends: Record<string, any> = {};

            // Calculate percentage changes
            Object.keys(currentMetrics).forEach(key => {
                const currentValue = currentMetrics[key as keyof typeof currentMetrics];
                const previousValue = previousMetrics[key];

                if (typeof currentValue === 'number' && typeof previousValue === 'number' && previousValue > 0) {
                    const change = ((currentValue - previousValue) / previousValue) * 100;
                    newTrends[key] = {
                        value: Math.abs(Math.round(change * 10) / 10),
                        isPositive: change >= 0
                    };
                }
            });

            setTrends(newTrends);
        }

        setPreviousMetrics(currentMetrics);
    }, [state.metrics]);

    const metrics = getMetrics();

    // Determine status based on values
    const getPerformanceStatus = (score: number) => {
        if (score >= 90) return 'good';
        if (score >= 75) return 'warning';
        return 'error';
    };

    const getErrorStatus = (rate: number) => {
        if (rate <= 2) return 'good';
        if (rate <= 5) return 'warning';
        return 'error';
    };

    const getCacheStatus = (rate: number) => {
        if (rate >= 90) return 'good';
        if (rate >= 75) return 'warning';
        return 'error';
    };

    if (compact) {
        return (
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
                <div className=\"flex items-center space-x-2 p-3 bg-blue-50 rounded-lg\">
                <FiMessageCircle className=\"text-blue-600\" />
                <div>
                    <Typography className=\"text-xs text-gray-600\">Messages</Typography>
                <Typography className=\"text-sm font-bold\">{metrics.totalMessages.toLocaleString()}</Typography>
                    </div >
                </div >

    <div className=\"flex items-center space-x-2 p-3 bg-green-50 rounded-lg\">
        < FiUsers className =\"text-green-600\" />
            < div >
            <Typography className=\"text-xs text-gray-600\">Active</Typography>
                < Typography className =\"text-sm font-bold\">{metrics.activeUsers}</Typography>
                    </div >
                </div >

    <div className=\"flex items-center space-x-2 p-3 bg-purple-50 rounded-lg\">
        < FiActivity className =\"text-purple-600\" />
            < div >
            <Typography className=\"text-xs text-gray-600\">Performance</Typography>
                < Typography className =\"text-sm font-bold\">{metrics.performanceScore}%</Typography>
                    </div >
                </div >

    <div className=\"flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg\">
        < FiZap className =\"text-yellow-600\" />
            < div >
            <Typography className=\"text-xs text-gray-600\">Cache</Typography>
                < Typography className =\"text-sm font-bold\">{metrics.cacheHitRate}%</Typography>
                    </div >
                </div >
            </div >
        );
    }

return (
    <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className=\"flex items-center justify-between\">
        <div className=\"flex items-center space-x-3\">
        <FiBarChart2 className=\"text-2xl text-gray-600\" />
        <div>
            <Typography type=\"h4\">Real-time Metrics</Typography>
        <Typography className=\"text-sm text-gray-500\">
        Last updated: {state.lastUpdated?.toLocaleTimeString() || 'Never'}
    </Typography>
                    </div >
                </div >

{
    state.isLoading && (
        <div className=\"flex items-center space-x-2 text-blue-600\">
        <FiActivity className =\"animate-spin\" />
        <Typography className =\"text-sm\">Updating...</Typography>
                    </div>
                )}
            </div >

    {/* Primary Metrics */ }
    < div className =\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">
        < MetricCard
title =\"Total Messages\"
value = { metrics.totalMessages.toLocaleString() }
icon = {< FiMessageCircle />}
trend = { showTrends? trends.totalMessages : undefined }
color =\"blue\"
    />

    <MetricCard
        title=\"Active Users\"
value = { metrics.activeUsers }
icon = {< FiUsers />}
trend = { showTrends? trends.activeUsers : undefined }
color =\"green\"
    />

    <MetricCard
        title=\"Engagement Rate\"
value = {`${metrics.engagementRate}%`}
icon = {< FiTrendingUp />}
trend = { showTrends? trends.engagementRate : undefined }
color =\"purple\"
    />

    <MetricCard
        title=\"Performance Score\"
value = {`${metrics.performanceScore}%`}
icon = {< FiActivity />}
trend = { showTrends? trends.performanceScore : undefined }
status = { getPerformanceStatus(metrics.performanceScore) }
    />
            </div >

    {/* Secondary Metrics */ }
    < div className =\"grid grid-cols-1 md:grid-cols-3 gap-4\">
        < MetricCard
title =\"Avg Response Time\"
value = {`${metrics.averageResponseTime}ms`}
icon = {< FiClock />}
trend = { showTrends? trends.averageResponseTime : undefined }
color =\"yellow\"
    />

    <MetricCard
        title=\"Cache Hit Rate\"
value = {`${metrics.cacheHitRate}%`}
icon = {< FiZap />}
trend = { showTrends? trends.cacheHitRate : undefined }
status = { getCacheStatus(metrics.cacheHitRate) }
    />

    <MetricCard
        title=\"Error Rate\"
value = {`${metrics.errorRate}%`}
icon = {< FiAlertCircle />}
trend = { showTrends? trends.errorRate : undefined }
status = { getErrorStatus(metrics.errorRate) }
    />
            </div >

    {/* Status Summary */ }
    < div className =\"bg-gray-50 p-4 rounded-lg\">
        < Typography type =\"h5\" className=\"mb-3\">System Status</Typography>
            < div className =\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                < div className =\"flex items-center space-x-3\">
                    < div className = {`w-3 h-3 rounded-full ${metrics.performanceScore >= 90 ? 'bg-green-500' :
                            metrics.performanceScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                            < Typography className =\"text-sm\">
Performance: {
    metrics.performanceScore >= 90 ? 'Excellent' :
    metrics.performanceScore >= 75 ? 'Good' : 'Needs Attention'
}
                        </Typography >
                    </div >

    <div className=\"flex items-center space-x-3\">
        < div className = {`w-3 h-3 rounded-full ${metrics.cacheHitRate >= 90 ? 'bg-green-500' :
                metrics.cacheHitRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
                < Typography className =\"text-sm\">
Cache: {
    metrics.cacheHitRate >= 90 ? 'Optimal' :
    metrics.cacheHitRate >= 75 ? 'Good' : 'Needs Optimization'
}
                        </Typography >
                    </div >

    <div className=\"flex items-center space-x-3\">
        < div className = {`w-3 h-3 rounded-full ${metrics.errorRate <= 2 ? 'bg-green-500' :
                metrics.errorRate <= 5 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
                < Typography className =\"text-sm\">
Errors: {
    metrics.errorRate <= 2 ? 'Minimal' :
    metrics.errorRate <= 5 ? 'Acceptable' : 'High'
}
                        </Typography >
                    </div >

    <div className=\"flex items-center space-x-3\">
        < div className =\"w-3 h-3 rounded-full bg-green-500\" />
            < Typography className =\"text-sm\">
System: Operational
                        </Typography >
                    </div >
                </div >
            </div >
        </div >
    );
};

export default MetricsDisplay;
