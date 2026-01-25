/**
 * Performance Trends Component
 * 
 * This component displays performance metrics and trends over time,
 * including system health, response times, error rates, and performance scores.
 */

import React, { useState, useMemo } from 'react';
import { useAnalytics } from './AnalyticsProvider';
import { Container } from "../../../../../shared/ui/components";
import { Text, Title } from "../../../../../shared/ui/components";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';
import {
    FiActivity,
    FiZap,
    FiAlertCircle,
    FiTrendingUp,
    FiTrendingDown,
    FiClock,
    FiCpu,
    FiHardDrive,
    FiWifi
} from 'react-icons/fi';

interface PerformanceTrendsProps {
    className?: string;
    timeRange?: '1h' | '24h' | '7d' | '30d';
    showDetails?: boolean;
    refreshInterval?: number;
}

interface PerformanceData {
    timestamp: string;
    responseTime: number;
    errorRate: number;
    throughput: number;
    cpuUsage: number;
    memoryUsage: number;
    networkLatency: number;
    cacheHitRate: number;
    performanceScore: number;
}

interface PerformanceAlert {
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
    value: number;
    threshold: number;
}

/**
 * Performance Trends component that displays system performance metrics and trends
 */
const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({
    className = '',
    timeRange = '24h',
    showDetails = true,
    refreshInterval = 30000
}) => {
    const { state, getMetrics } = useAnalytics();
    const [selectedMetric, setSelectedMetric] = useState<string>('responseTime');

    const metrics = getMetrics();

    // Generate performance data
    const performanceData = useMemo<PerformanceData[]>(() => {
        const now = new Date();
        const dataPoints = timeRange === '1h' ? 60 : timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;

        return Array.from({ length: dataPoints }, (_, i) => {
            const timestamp = new Date(now.getTime() - (dataPoints - i) * (timeRange === '1h' ? 60000 : timeRange === '24h' ? 3600000 : 86400000));

            return {
                timestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                responseTime: Math.floor(Math.random() * 500) + 300 + (i % 3 === 0 ? Math.random() * 200 : 0),
                errorRate: Math.random() * 3 + (i % 10 === 0 ? Math.random() * 5 : 0),
                throughput: Math.floor(Math.random() * 100) + 50,
                cpuUsage: Math.random() * 40 + 30,
                memoryUsage: Math.random() * 30 + 60,
                networkLatency: Math.floor(Math.random() * 100) + 20,
                cacheHitRate: Math.random() * 20 + 75,
                performanceScore: Math.floor(Math.random() * 20) + 75
            };
        });
    }, [timeRange]);

    // Performance alerts
    const performanceAlerts = useMemo<PerformanceAlert[]>(() => {
        const alerts: PerformanceAlert[] = [];
        const latestData = performanceData[performanceData.length - 1];

        if (latestData.responseTime > 800) {
            alerts.push({
                type: 'warning',
                message: 'High response time detected',
                timestamp: latestData.timestamp,
                value: latestData.responseTime,
                threshold: 800
            });
        }

        if (latestData.errorRate > 5) {
            alerts.push({
                type: 'error',
                message: 'Error rate above threshold',
                timestamp: latestData.timestamp,
                value: latestData.errorRate,
                threshold: 5
            });
        }

        if (latestData.cacheHitRate < 70) {
            alerts.push({
                type: 'warning',
                message: 'Low cache hit rate',
                timestamp: latestData.timestamp,
                value: latestData.cacheHitRate,
                threshold: 70
            });
        }

        if (latestData.cpuUsage > 80) {
            alerts.push({
                type: 'error',
                message: 'High CPU usage',
                timestamp: latestData.timestamp,
                value: latestData.cpuUsage,
                threshold: 80
            });
        }

        return alerts;
    }, [performanceData]);

    // Metric configurations
    const metricConfigs = {
        responseTime: {
            label: 'Response Time',
            unit: 'ms',
            color: '#3b82f6',
            icon: <FiClock />,
            threshold: 800,
            good: '< 500ms',
            warning: '500-800ms',
            critical: '> 800ms'
        },
        errorRate: {
            label: 'Error Rate',
            unit: '%',
            color: '#ef4444',
            icon: <FiAlertCircle />,
            threshold: 5,
            good: '< 2%',
            warning: '2-5%',
            critical: '> 5%'
        },
        throughput: {
            label: 'Throughput',
            unit: 'req/s',
            color: '#10b981',
            icon: <FiActivity />,
            threshold: 100,
            good: '> 100 req/s',
            warning: '50-100 req/s',
            critical: '< 50 req/s'
        },
        cpuUsage: {
            label: 'CPU Usage',
            unit: '%',
            color: '#f59e0b',
            icon: <FiCpu />,
            threshold: 80,
            good: '< 60%',
            warning: '60-80%',
            critical: '> 80%'
        },
        memoryUsage: {
            label: 'Memory Usage',
            unit: '%',
            color: '#8b5cf6',
            icon: <FiHardDrive />,
            threshold: 85,
            good: '< 70%',
            warning: '70-85%',
            critical: '> 85%'
        },
        networkLatency: {
            label: 'Network Latency',
            unit: 'ms',
            color: '#06b6d4',
            icon: <FiWifi />,
            threshold: 150,
            good: '< 50ms',
            warning: '50-150ms',
            critical: '> 150ms'
        },
        cacheHitRate: {
            label: 'Cache Hit Rate',
            unit: '%',
            color: '#ec4899',
            icon: <FiZap />,
            threshold: 70,
            good: '> 90%',
            warning: '70-90%',
            critical: '< 70%'
        },
        performanceScore: {
            label: 'Performance Score',
            unit: '%',
            color: '#22c55e',
            icon: <FiTrendingUp />,
            threshold: 70,
            good: '> 90%',
            warning: '70-90%',
            critical: '< 70%'
        }
    };

    const currentMetric = metricConfigs[selectedMetric as keyof typeof metricConfigs];
    const latestValue = performanceData[performanceData.length - 1][selectedMetric as keyof PerformanceData];

    return (
        <Container className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
            {/* Header */}
            <div className=\"flex items-center justify-between mb-6\">
            <div className=\"flex items-center space-x-3\">
            <FiActivity className=\"text-2xl text-blue-600\" />
            <div>
                <Typography type=\"h4\">Performance Trends</Typography>
            <Typography className=\"text-sm text-gray-500\">
            System performance metrics and health monitoring
        </Typography>
                    </div >
                </div >

    <div className=\"flex items-center space-x-4\">
{/* Metric Selector */ }
<select
    value={selectedMetric}
    onChange={(e) => setSelectedMetric(e.target.value)}
    className=\"px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500\"
        >
    {
        Object.entries(metricConfigs).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
        ))
    }
                    </select >
                </div >
            </div >

    {/* Performance Alerts */ }
{
    performanceAlerts.length > 0 && (
        <div className=\"mb-6 space-y-2\">
    {
        performanceAlerts.map((alert, index) => (
            <div
                key={index}
                className={`p-3 rounded-lg border ${alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                        'bg-blue-50 border-blue-200 text-blue-800'
                    }`}
            >
                <div className=\"flex items-center justify-between\">
                <div className=\"flex items-center space-x-2\">
                {alert.type === 'error' ? <FiAlertCircle /> : <FiActivity />}
                <Typography className=\"font-medium\">{alert.message}</Typography>
                                </div >
            <div className=\"text-sm\">
        < span className =\"font-medium\">{alert.value}</span> / {alert.threshold}
                                </div >
                            </div >
            <Typography className=\"text-xs mt-1\">{alert.timestamp}</Typography>
                        </div >
                    ))
    }
                </div >
            )
}

{/* Current Metric Overview */ }
<div className=\"grid grid-cols-1 md:grid-cols-4 gap-4 mb-6\">
{
    Object.entries(metricConfigs).slice(0, 4).map(([key, config]) => {
        const value = performanceData[performanceData.length - 1][key as keyof PerformanceData];
        const isGood = config.good.includes('<') ?
            value < parseInt(config.good.match(/\d+/)![0]) :
            value > parseInt(config.good.match(/\d+/)![0]);

        return (
            <div
                key={key}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedMetric === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                onClick={() => setSelectedMetric(key)}
            >
                <div className=\"flex items-center justify-between mb-2\">
                <div className=\"flex items-center space-x-2 text-gray-600\">
                {config.icon}
                <Typography className=\"text-sm\">{config.label}</Typography>
                                </div >
            <div className={`w-2 h-2 rounded-full ${isGood ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                            </div >
            <div className=\"flex items-baseline space-x-1\">
                < Typography className =\"text-xl font-bold\">{value}</Typography>
                    < Typography className =\"text-sm text-gray-500\">{config.unit}</Typography>
                            </div >
            <Typography className=\"text-xs text-gray-600 mt-1\">{config.good}</Typography>
                        </div >
                    );
})}
            </div >

    {/* Main Performance Chart */ }
    < div className =\"bg-gray-50 p-4 rounded-lg mb-6\">
        < div className =\"flex items-center justify-between mb-4\">
            < Typography type =\"h5\" className=\"flex items-center space-x-2\">
{ currentMetric.icon }
<span>{currentMetric.label} Trend</span>
                    </Typography >
    <div className=\"flex items-center space-x-4 text-sm text-gray-600\">
        < span > Current: { latestValue } { currentMetric.unit }</span >
            <span>Threshold: {currentMetric.threshold}{currentMetric.unit}</span>
                    </div >
                </div >

    <ResponsiveContainer width=\"100%\" height={300}>
        < LineChart data = { performanceData } >
            <CartesianGrid strokeDasharray=\"3 3\" />
                < XAxis dataKey =\"timestamp\" />
                    < YAxis />
                        <Tooltip />
                        <Line
                            type=\"monotone\"
dataKey = { selectedMetric }
stroke = { currentMetric.color }
strokeWidth = { 2}
dot = { false}
    />
    {/* Threshold line */ }
    < Line
type =\"monotone\"
dataKey = {() => currentMetric.threshold}
stroke =\"#ef4444\"
strokeWidth = { 1}
strokeDasharray =\"5 5\"
dot = { false}
    />
                    </LineChart >
                </ResponsiveContainer >
            </div >

    {/* System Resources */ }
{
    showDetails && (
        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
    {/* Resource Usage */ }
    <div className=\"bg-gray-50 p-4 rounded-lg\">
        < Typography type =\"h5\" className=\"mb-4\">System Resources</Typography>

            < div className =\"space-y-3\">
                < div >
                <div className=\"flex items-center justify-between mb-1\">
                    < div className =\"flex items-center space-x-2\">
                        < FiCpu className =\"text-orange-600\" />
                            < Typography className =\"text-sm\">CPU Usage</Typography>
                                    </div >
        <Typography className=\"text-sm font-medium\">
    { performanceData[performanceData.length - 1].cpuUsage }%
                                    </Typography >
                                </div >
        <div className=\"w-full bg-gray-200 rounded-full h-2\">
            < div
    className =\"bg-orange-500 h-2 rounded-full\"
    style = {{ width: `${performanceData[performanceData.length - 1].cpuUsage}%` }
}
                                    />
                                </div >
                            </div >

    <div>
        <div className=\"flex items-center justify-between mb-1\">
        <div className=\"flex items-center space-x-2\">
        <FiHardDrive className=\"text-purple-600\" />
        <Typography className=\"text-sm\">Memory Usage</Typography>
                                    </div >
    <Typography className=\"text-sm font-medium\">
{ performanceData[performanceData.length - 1].memoryUsage }%
                                    </Typography >
                                </div >
    <div className=\"w-full bg-gray-200 rounded-full h-2\">
        < div
className =\"bg-purple-500 h-2 rounded-full\"
style = {{ width: `${performanceData[performanceData.length - 1].memoryUsage}%` }}
                                    />
                                </div >
                            </div >

    <div>
        <div className=\"flex items-center justify-between mb-1\">
        <div className=\"flex items-center space-x-2\">
        <FiWifi className=\"text-cyan-600\" />
        <Typography className=\"text-sm\">Network Latency</Typography>
                                    </div >
    <Typography className=\"text-sm font-medium\">
{ performanceData[performanceData.length - 1].networkLatency } ms
                                    </Typography >
                                </div >
    <div className=\"w-full bg-gray-200 rounded-full h-2\">
        < div
className =\"bg-cyan-500 h-2 rounded-full\"
style = {{ width: `${Math.min((performanceData[performanceData.length - 1].networkLatency / 200) * 100, 100)}%` }}
                                    />
                                </div >
                            </div >
                        </div >
                    </div >

    {/* Performance Summary */ }
    < div className =\"bg-gray-50 p-4 rounded-lg\">
        < Typography type =\"h5\" className=\"mb-4\">Performance Summary</Typography>

            < div className =\"space-y-3\">
                < div className =\"flex items-center justify-between p-3 bg-white rounded\">
                    < div className =\"flex items-center space-x-2\">
                        < FiZap className =\"text-pink-600\" />
                            < Typography className =\"text-sm\">Cache Hit Rate</Typography>
                                </div >
    <Typography className=\"font-medium\">
{ performanceData[performanceData.length - 1].cacheHitRate }%
                                </Typography >
                            </div >

    <div className=\"flex items-center justify-between p-3 bg-white rounded\">
        < div className =\"flex items-center space-x-2\">
            < FiActivity className =\"text-green-600\" />
                < Typography className =\"text-sm\">Throughput</Typography>
                                </div >
    <Typography className=\"font-medium\">
{ performanceData[performanceData.length - 1].throughput } req / s
                                </Typography >
                            </div >

    <div className=\"flex items-center justify-between p-3 bg-white rounded\">
        < div className =\"flex items-center space-x-2\">
            < FiTrendingUp className =\"text-green-600\" />
                < Typography className =\"text-sm\">Performance Score</Typography>
                                </div >
    <Typography className=\"font-medium\">
{ performanceData[performanceData.length - 1].performanceScore }%
                                </Typography >
                            </div >
                        </div >
                    </div >
                </div >
            )}

{/* Performance Recommendations */ }
<div className=\"mt-6 p-4 bg-blue-50 rounded-lg\">
    < Typography type =\"h5\" className=\"mb-3\">Performance Recommendations</Typography>
        < div className =\"grid grid-cols-1 md:grid-cols-2 gap-4 text-sm\">
            < div className =\"flex items-start space-x-2\">
                < FiZap className =\"text-blue-600 mt-1\" />
                    < div >
                    <Typography className=\"font-medium\">Optimize Cache</Typography>
                        < Typography className =\"text-gray-600\">Consider increasing cache TTL for frequently accessed data</Typography>
                        </div >
                    </div >
    <div className=\"flex items-start space-x-2\">
        < FiCpu className =\"text-orange-600 mt-1\" />
            < div >
            <Typography className=\"font-medium\">Monitor CPU Usage</Typography>
                < Typography className =\"text-gray-600\">CPU usage is approaching threshold levels</Typography>
                        </div >
                    </div >
    <div className=\"flex items-start space-x-2\">
        < FiClock className =\"text-cyan-600 mt-1\" />
            < div >
            <Typography className=\"font-medium\">Response Time</Typography>
                < Typography className =\"text-gray-600\">Some requests are taking longer than expected</Typography>
                        </div >
                    </div >
    <div className=\"flex items-start space-x-2\">
        < FiActivity className =\"text-green-600 mt-1\" />
            < div >
            <Typography className=\"font-medium\">Scale Resources</Typography>
                < Typography className =\"text-gray-600\">Consider scaling up during peak hours</Typography>
                        </div >
                    </div >
                </div >
            </div >
        </Container >
    );
};

export default PerformanceTrends;
