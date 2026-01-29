/**
 * Performance Monitor Component
 * 
 * This component provides comprehensive performance monitoring with real-time metrics,
 * performance alerts, and optimization suggestions.
 */

import React, { useState, useEffect, useMemo } from 'react';
import BoxStyled from '@shared/BoxStyled';
import Typography from '@shared/Typography';
import { 
    FiActivity, 
    FiCpu, 
    FiHardDrive, 
    FiWifi, 
    FiClock,
    FiTrendingUp,
    FiTrendingDown,
    FiAlertTriangle,
    FiCheckCircle,
    FiBarChart2,
    FiZap,
    FiRefreshCw
} from 'react-icons/fi';
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
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export interface PerformanceMetrics {
    timestamp: string;
    cpu: {
        usage: number;
        temperature?: number;
        cores: number;
    };
    memory: {
        used: number;
        total: number;
        percentage: number;
        heapUsed: number;
        heapTotal: number;
    };
    network: {
        latency: number;
        bandwidth: {
            download: number;
            upload: number;
        };
        requests: number;
        errors: number;
    };
    cache: {
        hitRate: number;
        missRate: number;
        size: number;
        evictions: number;
    };
    rendering: {
        fps: number;
        frameTime: number;
        droppedFrames: number;
    };
    database: {
        connections: number;
        queryTime: number;
        slowQueries: number;
    };
}

export interface PerformanceAlert {
    id: string;
    type: 'cpu' | 'memory' | 'network' | 'cache' | 'rendering' | 'database';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    value: number;
    threshold: number;
    timestamp: string;
    resolved: boolean;
}

interface PerformanceMonitorProps {
    refreshInterval?: number;
    showAlerts?: boolean;
    showDetails?: boolean;
    autoOptimize?: boolean;
    thresholds?: {
        cpu: number;
        memory: number;
        network: number;
        cache: number;
        rendering: number;
    };
}

/**
 * Performance Monitor component with real-time metrics and alerts
 */
const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
    refreshInterval = 5000,
    showAlerts = true,
    showDetails = true,
    autoOptimize = true,
    thresholds = {
        cpu: 80,
        memory: 85,
        network: 1000,
        cache: 70,
        rendering: 30
    }
}) => {
    const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
    const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics | null>(null);
    const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
    const [isMonitoring, setIsMonitoring] = useState(true);
    const [selectedTab, setSelectedTab] = useState<'overview' | 'cpu' | 'memory' | 'network' | 'cache' | 'rendering'>('overview');

    // Generate mock performance data
    const generateMetrics = (): PerformanceMetrics => {
        const now = new Date();
        
        return {
            timestamp: now.toISOString(),
            cpu: {
                usage: Math.random() * 40 + 30 + (Math.random() > 0.8 ? Math.random() * 30 : 0),
                temperature: Math.random() * 20 + 60,
                cores: 8
            },
            memory: {
                used: Math.random() * 2000 + 3000,
                total: 8192,
                percentage: (Math.random() * 30 + 50),
                heapUsed: Math.random() * 500 + 200,
                heapTotal: 1024
            },
            network: {
                latency: Math.random() * 100 + 20 + (Math.random() > 0.9 ? Math.random() * 500 : 0),
                bandwidth: {
                    download: Math.random() * 50 + 10,
                    upload: Math.random() * 20 + 5
                },
                requests: Math.floor(Math.random() * 100) + 50,
                errors: Math.floor(Math.random() * 5)
            },
            cache: {
                hitRate: Math.random() * 20 + 75,
                missRate: Math.random() * 10 + 10,
                size: Math.random() * 500 + 200,
                evictions: Math.floor(Math.random() * 10)
            },
            rendering: {
                fps: Math.random() * 10 + 50,
                frameTime: Math.random() * 10 + 10,
                droppedFrames: Math.floor(Math.random() * 5)
            },
            database: {
                connections: Math.floor(Math.random() * 20) + 5,
                queryTime: Math.random() * 100 + 50,
                slowQueries: Math.floor(Math.random() * 3)
            }
        };
    };

    // Check for performance alerts
    const checkAlerts = (metricsData: PerformanceMetrics): PerformanceAlert[] => {
        const newAlerts: PerformanceAlert[] = [];

        // CPU alerts
        if (metricsData.cpu.usage > thresholds.cpu) {
            newAlerts.push({
                id: `cpu_${Date.now()}`,
                type: 'cpu',
                severity: metricsData.cpu.usage > 95 ? 'critical' : 'high',
                message: `High CPU usage: ${metricsData.cpu.usage.toFixed(1)}%`,
                value: metricsData.cpu.usage,
                threshold: thresholds.cpu,
                timestamp: metricsData.timestamp,
                resolved: false
            });
        }

        // Memory alerts
        if (metricsData.memory.percentage > thresholds.memory) {
            newAlerts.push({
                id: `memory_${Date.now()}`,
                type: 'memory',
                severity: metricsData.memory.percentage > 95 ? 'critical' : 'high',
                message: `High memory usage: ${metricsData.memory.percentage.toFixed(1)}%`,
                value: metricsData.memory.percentage,
                threshold: thresholds.memory,
                timestamp: metricsData.timestamp,
                resolved: false
            });
        }

        // Network alerts
        if (metricsData.network.latency > thresholds.network) {
            newAlerts.push({
                id: `network_${Date.now()}`,
                type: 'network',
                severity: metricsData.network.latency > 2000 ? 'critical' : 'high',
                message: `High network latency: ${metricsData.network.latency.toFixed(0)}ms`,
                value: metricsData.network.latency,
                threshold: thresholds.network,
                timestamp: metricsData.timestamp,
                resolved: false
            });
        }

        // Cache alerts
        if (metricsData.cache.hitRate < thresholds.cache) {
            newAlerts.push({
                id: `cache_${Date.now()}`,
                type: 'cache',
                severity: metricsData.cache.hitRate < 50 ? 'critical' : 'medium',
                message: `Low cache hit rate: ${metricsData.cache.hitRate.toFixed(1)}%`,
                value: metricsData.cache.hitRate,
                threshold: thresholds.cache,
                timestamp: metricsData.timestamp,
                resolved: false
            });
        }

        // Rendering alerts
        if (metricsData.rendering.fps < thresholds.rendering) {
            newAlerts.push({
                id: `rendering_${Date.now()}`,
                type: 'rendering',
                severity: metricsData.rendering.fps < 20 ? 'critical' : 'high',
                message: `Low FPS: ${metricsData.rendering.fps.toFixed(1)}`,
                value: metricsData.rendering.fps,
                threshold: thresholds.rendering,
                timestamp: metricsData.timestamp,
                resolved: false
            });
        }

        return newAlerts;
    };

    // Update metrics
    useEffect(() => {
        if (!isMonitoring) return;

        const interval = setInterval(() => {
            const newMetrics = generateMetrics();
            setCurrentMetrics(newMetrics);
            setMetrics(prev => [...prev.slice(-50), newMetrics]); // Keep last 50 data points

            if (showAlerts) {
                const newAlerts = checkAlerts(newMetrics);
                if (newAlerts.length > 0) {
                    setAlerts(prev => [...prev, ...newAlerts].slice(-20)); // Keep last 20 alerts
                }
            }
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [isMonitoring, refreshInterval, showAlerts, thresholds]);

    // Calculate performance score
    const performanceScore = useMemo(() => {
        if (!currentMetrics) return 0;

        const cpuScore = Math.max(0, 100 - currentMetrics.cpu.usage);
        const memoryScore = Math.max(0, 100 - currentMetrics.memory.percentage);
        const networkScore = Math.max(0, 100 - (currentMetrics.network.latency / 20));
        const cacheScore = currentMetrics.cache.hitRate;
        const renderingScore = Math.min(100, (currentMetrics.rendering.fps / 60) * 100);

        return (cpuScore + memoryScore + networkScore + cacheScore + renderingScore) / 5;
    }, [currentMetrics]);

    // Get status color
    const getStatusColor = (value: number, type: string) => {
        const threshold = thresholds[type as keyof typeof thresholds] || 80;
        if (value > threshold * 1.2) return 'text-red-600 bg-red-50';
        if (value > threshold) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    };

    // Get performance status
    const getPerformanceStatus = () => {
        if (performanceScore >= 90) return { status: 'Excellent', color: 'text-green-600' };
        if (performanceScore >= 75) return { status: 'Good', color: 'text-blue-600' };
        if (performanceScore >= 60) return { status: 'Fair', color: 'text-yellow-600' };
        return { status: 'Poor', color: 'text-red-600' };
    };

    const performanceStatus = getPerformanceStatus();

    // Chart data preparation
    const chartData = useMemo(() => {
        return metrics.map(m => ({
            timestamp: new Date(m.timestamp).toLocaleTimeString(),
            cpu: m.cpu.usage,
            memory: m.memory.percentage,
            network: m.network.latency,
            cache: m.cache.hitRate,
            fps: m.rendering.fps
        }));
    }, [metrics]);

    // Active alerts count
    const activeAlertsCount = alerts.filter(alert => !alert.resolved).length;

    return (
        <BoxStyled className=\"p-6 bg-white rounded-lg shadow-lg\">
            {/* Header */}
            <div className=\"flex items-center justify-between mb-6\">
                <div className=\"flex items-center space-x-3\">
                    <FiActivity className=\"text-2xl text-blue-600\" />
                    <div>
                        <Typography type=\"h4\">Performance Monitor</Typography>
                        <Typography className=\"text-sm text-gray-500\">
                            Real-time system performance monitoring
                        </Typography>
                    </div>
                </div>
                
                <div className=\"flex items-center space-x-4\">
                    {/* Performance Score */}
                    <div className=\"text-right\">
                        <Typography className=\"text-sm text-gray-500\">Performance Score</Typography>
                        <Typography className={`text-2xl font-bold ${performanceStatus.color}`}>
                            {performanceScore.toFixed(0)}
                        </Typography>
                        <Typography className={`text-xs ${performanceStatus.color}`}>
                            {performanceStatus.status}
                        </Typography>
                    </div>
                    
                    {/* Alert Indicator */}
                    {showAlerts && (
                        <div className=\"relative\">
                            <FiAlertTriangle className={`text-xl ${activeAlertsCount > 0 ? 'text-red-600' : 'text-gray-400'}`} />
                            {activeAlertsCount > 0 && (
                                <span className=\"absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center\">
                                    {activeAlertsCount}
                                </span>
                            )}
                        </div>
                    )}
                    
                    {/* Control Buttons */}
                    <button
                        onClick={() => setIsMonitoring(!isMonitoring)}
                        className={`p-2 rounded-lg ${isMonitoring ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                        title={isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                    >
                        {isMonitoring ? <FiCheckCircle /> : <FiRefreshCw />}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className=\"flex space-x-1 mb-6 border-b border-gray-200\">
                {['overview', 'cpu', 'memory', 'network', 'cache', 'rendering'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab as any)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            selectedTab === tab
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {selectedTab === 'overview' && currentMetrics && (
                <div className=\"space-y-6\">
                    {/* Key Metrics Grid */}
                    <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">
                        <div className={`p-4 rounded-lg border ${getStatusColor(currentMetrics.cpu.usage, 'cpu')}`}>
                            <div className=\"flex items-center justify-between mb-2\">
                                <div className=\"flex items-center space-x-2\">
                                    <FiCpu />
                                    <Typography className=\"text-sm font-medium\">CPU Usage</Typography>
                                </div>
                                <Typography className=\"text-lg font-bold\">{currentMetrics.cpu.usage.toFixed(1)}%</Typography>
                            </div>
                            <div className=\"text-xs text-gray-600\">
                                {currentMetrics.cpu.cores} cores • {currentMetrics.cpu.temperature?.toFixed(0)}°C
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg border ${getStatusColor(currentMetrics.memory.percentage, 'memory')}`}>
                            <div className=\"flex items-center justify-between mb-2\">
                                <div className=\"flex items-center space-x-2\">
                                    <FiHardDrive />
                                    <Typography className=\"text-sm font-medium\">Memory</Typography>
                                </div>
                                <Typography className=\"text-lg font-bold\">{currentMetrics.memory.percentage.toFixed(1)}%</Typography>
                            </div>
                            <div className=\"text-xs text-gray-600\">
                                {(currentMetrics.memory.used / 1024).toFixed(1)}GB / {(currentMetrics.memory.total / 1024).toFixed(1)}GB
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg border ${getStatusColor(currentMetrics.network.latency, 'network')}`}>
                            <div className=\"flex items-center justify-between mb-2\">
                                <div className=\"flex items-center space-x-2\">
                                    <FiWifi />
                                    <Typography className=\"text-sm font-medium\">Network</Typography>
                                </div>
                                <Typography className=\"text-lg font-bold\">{currentMetrics.network.latency.toFixed(0)}ms</Typography>
                            </div>
                            <div className=\"text-xs text-gray-600\">
                                {currentMetrics.network.requests} requests • {currentMetrics.network.errors} errors
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg border ${getStatusColor(100 - currentMetrics.cache.hitRate, 'cache')}`}>
                            <div className=\"flex items-center justify-between mb-2\">
                                <div className=\"flex items-center space-x-2\">
                                    <FiZap />
                                    <Typography className=\"text-sm font-medium\">Cache</Typography>
                                </div>
                                <Typography className=\"text-lg font-bold\">{currentMetrics.cache.hitRate.toFixed(1)}%</Typography>
                            </div>
                            <div className=\"text-xs text-gray-600\">
                                {currentMetrics.cache.size}MB • {currentMetrics.cache.evictions} evictions
                            </div>
                        </div>
                    </div>

                    {/* Performance Chart */}
                    {chartData.length > 0 && (
                        <div className=\"bg-gray-50 p-4 rounded-lg\">
                            <Typography type=\"h5\" className=\"mb-4\">Performance Trends</Typography>
                            <ResponsiveContainer width=\"100%\" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray=\"3 3\" />
                                    <XAxis dataKey=\"timestamp\" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type=\"monotone\" dataKey=\"cpu\" stroke=\"#ef4444\" strokeWidth={2} />
                                    <Line type=\"monotone\" dataKey=\"memory\" stroke=\"#f59e0b\" strokeWidth={2} />
                                    <Line type=\"monotone\" dataKey=\"network\" stroke=\"#3b82f6\" strokeWidth={2} />
                                    <Line type=\"monotone\" dataKey=\"cache\" stroke=\"#10b981\" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Active Alerts */}
                    {showAlerts && activeAlertsCount > 0 && (
                        <div className=\"bg-red-50 border border-red-200 rounded-lg p-4\">
                            <Typography type=\"h5\" className=\"mb-3 text-red-900\">Active Alerts</Typography>
                            <div className=\"space-y-2\">
                                {alerts.filter(alert => !alert.resolved).slice(-5).map((alert) => (
                                    <div key={alert.id} className=\"flex items-center justify-between p-2 bg-white rounded border border-red-200\">
                                        <div className=\"flex items-center space-x-2\">
                                            <FiAlertTriangle className=\"text-red-600\" />
                                            <div>
                                                <Typography className=\"text-sm font-medium\">{alert.type.toUpperCase()}</Typography>
                                                <Typography className=\"text-xs text-gray-600\">{alert.message}</Typography>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                            alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Detailed Views for Other Tabs */}
            {selectedTab !== 'overview' && currentMetrics && (
                <div className=\"space-y-6\">
                    {/* CPU Details */}
                    {selectedTab === 'cpu' && (
                        <div className=\"bg-gray-50 p-4 rounded-lg\">
                            <Typography type=\"h5\" className=\"mb-4\">CPU Performance</Typography>
                            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                                <div>
                                    <Typography className=\"text-sm text-gray-600 mb-2\">Usage Over Time</Typography>
                                    <ResponsiveContainer width=\"100%\" height={200}>
                                        <AreaChart data={chartData}>
                                            <CartesianGrid strokeDasharray=\"3 3\" />
                                            <XAxis dataKey=\"timestamp\" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area type=\"monotone\" dataKey=\"cpu\" stroke=\"#ef4444\" fill=\"#fca5a5\" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className=\"space-y-3\">
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Current Usage</Typography>
                                        <Typography className=\"text-2xl font-bold\">{currentMetrics.cpu.usage.toFixed(1)}%</Typography>
                                    </div>
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Temperature</Typography>
                                        <Typography className=\"text-2xl font-bold\">{currentMetrics.cpu.temperature?.toFixed(0)}°C</Typography>
                                    </div>
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Cores</Typography>
                                        <Typography className=\"text-2xl font-bold\">{currentMetrics.cpu.cores}</Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Memory Details */}
                    {selectedTab === 'memory' && (
                        <div className=\"bg-gray-50 p-4 rounded-lg\">
                            <Typography type=\"h5\" className=\"mb-4\">Memory Usage</Typography>
                            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                                <div>
                                    <Typography className=\"text-sm text-gray-600 mb-2\">Memory Over Time</Typography>
                                    <ResponsiveContainer width=\"100%\" height={200}>
                                        <AreaChart data={chartData}>
                                            <CartesianGrid strokeDasharray=\"3 3\" />
                                            <XAxis dataKey=\"timestamp\" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area type=\"monotone\" dataKey=\"memory\" stroke=\"#f59e0b\" fill=\"#fcd34d\" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className=\"space-y-3\">
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Total Memory</Typography>
                                        <Typography className=\"text-2xl font-bold\">{(currentMetrics.memory.total / 1024).toFixed(1)}GB</Typography>
                                    </div>
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Used Memory</Typography>
                                        <Typography className=\"text-2xl font-bold\">{(currentMetrics.memory.used / 1024).toFixed(1)}GB</Typography>
                                    </div>
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Heap Used</Typography>
                                        <Typography className=\"text-2xl font-bold\">{currentMetrics.memory.heapUsed.toFixed(0)}MB</Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Network Details */}
                    {selectedTab === 'network' && (
                        <div className=\"bg-gray-50 p-4 rounded-lg\">
                            <Typography type=\"h5\" className=\"mb-4\">Network Performance</Typography>
                            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                                <div>
                                    <Typography className=\"text-sm text-gray-600 mb-2\">Latency Over Time</Typography>
                                    <ResponsiveContainer width=\"100%\" height={200}>
                                        <AreaChart data={chartData}>
                                            <CartesianGrid strokeDasharray=\"3 3\" />
                                            <XAxis dataKey=\"timestamp\" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area type=\"monotone\" dataKey=\"network\" stroke=\"#3b82f6\" fill=\"#93c5fd\" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className=\"space-y-3\">
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Latency</Typography>
                                        <Typography className=\"text-2xl font-bold\">{currentMetrics.network.latency.toFixed(0)}ms</Typography>
                                    </div>
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Requests</Typography>
                                        <Typography className=\"text-2xl font-bold\">{currentMetrics.network.requests}</Typography>
                                    </div>
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Errors</Typography>
                                        <Typography className=\"text-2xl font-bold\">{currentMetrics.network.errors}</Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cache Details */}
                    {selectedTab === 'cache' && (
                        <div className=\"bg-gray-50 p-4 rounded-lg\">
                            <Typography type=\"h5\" className=\"mb-4\">Cache Performance</Typography>
                            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                                <div>
                                    <Typography className=\"text-sm text-gray-600 mb-2\">Hit Rate Over Time</Typography>
                                    <ResponsiveContainer width=\"100%\" height={200}>
                                        <AreaChart data={chartData}>
                                            <CartesianGrid strokeDasharray=\"3 3\" />
                                            <XAxis dataKey=\"timestamp\" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area type=\"monotone\" dataKey=\"cache\" stroke=\"#10b981\" fill=\"#86efac\" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className=\"space-y-3\">
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Hit Rate</Typography>
                                        <Typography className=\"text-2xl font-bold\">{currentMetrics.cache.hitRate.toFixed(1)}%</Typography>
                                    </div>
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Miss Rate</Typography>
                                        <Typography className=\"text-2xl font-bold\">{currentMetrics.cache.missRate.toFixed(1)}%</Typography>
                                    </div>
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Size</Typography>
                                        <Typography className=\"text-2xl font-bold\">{currentMetrics.cache.size}MB</Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rendering Details */}
                    {selectedTab === 'rendering' && (
                        <div className=\"bg-gray-50 p-4 rounded-lg\">
                            <Typography type=\"h5\" className=\"mb-4\">Rendering Performance</Typography>
                            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                                <div>
                                    <Typography className=\"text-sm text-gray-600 mb-2\">FPS Over Time</Typography>
                                    <ResponsiveContainer width=\"100%\" height={200}>
                                        <AreaChart data={chartData}>
                                            <CartesianGrid strokeDasharray=\"3 3\" />
                                            <XAxis dataKey=\"timestamp\" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area type=\"monotone\" dataKey=\"fps\" stroke=\"#8b5cf6\" fill=\"#c4b5fd\" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className=\"space-y-3\">
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">FPS</Typography>
                                        <Typography className=\"text-2xl font-bold\">{currentMetrics.rendering.fps.toFixed(1)}</Typography>
                                    </div>
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Frame Time</Typography>
                                        <Typography className=\"text-2xl font-bold\">{currentMetrics.rendering.frameTime.toFixed(1)}ms</Typography>
                                    </div>
                                    <div className=\"p-3 bg-white rounded border\">
                                        <Typography className=\"text-sm text-gray-600\">Dropped Frames</Typography>
                                        <Typography className=\"text-2xl font-bold\">{currentMetrics.rendering.droppedFrames}</Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </BoxStyled>
    );
};

export default PerformanceMonitor;
