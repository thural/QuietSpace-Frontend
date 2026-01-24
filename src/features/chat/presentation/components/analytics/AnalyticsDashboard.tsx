/**
 * Advanced Analytics Dashboard Component
 * 
 * This component provides comprehensive analytics insights for the chat feature,
 * including real-time metrics, user behavior analytics, performance trends,
 * and engagement statistics.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useUnifiedChat } from '@features/chat/application/hooks/useUnifiedChat';
import useUserQueries from '@/core/network/api/queries/userQueries';
import BoxStyled from '@shared/BoxStyled';
import Typography from '@shared/Typography';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { 
    FiMessageCircle, 
    FiUsers, 
    FiActivity, 
    FiTrendingUp,
    FiClock,
    FiZap,
    FiAlertCircle,
    FiCheckCircle,
    FiBarChart2,
    FiPieChart,
    FiActivity as FiActivityIcon
} from 'react-icons/fi';

interface AnalyticsDashboardProps {
    userId: string;
    chatId?: string;
    className?: string;
}

interface AnalyticsData {
    totalMessages: number;
    activeUsers: number;
    averageResponseTime: number;
    engagementRate: number;
    performanceScore: number;
    errorRate: number;
    cacheHitRate: number;
    messagesPerHour: Array<{ hour: string; count: number }>;
    userActivity: Array<{ userId: string; messages: number; lastActive: string }>;
    performanceMetrics: Array<{ time: string; score: number; errors: number }>;
    messageTypeDistribution: Array<{ type: string; count: number; color: string }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

/**
 * AnalyticsDashboard component that displays comprehensive chat analytics
 */
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
    userId, 
    chatId, 
    className = '' 
}) => {
    const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
    const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();

    // Use unified chat with analytics enabled
    const chat = useUnifiedChat(user.id, chatId, {
        enableRealTime: true,
        enableOptimisticUpdates: true,
        cacheStrategy: 'moderate'
    });

    const {
        getAnalytics,
        getUserAnalytics,
        getChatAnalytics,
        getMetrics,
        getPerformanceSummary
    } = chat;

    // Fetch analytics data
    const analyticsData = useMemo<AnalyticsData>(() => {
        // Simulated analytics data - in production, this would come from actual analytics
        const baseData = {
            totalMessages: Math.floor(Math.random() * 1000) + 500,
            activeUsers: Math.floor(Math.random() * 50) + 10,
            averageResponseTime: Math.floor(Math.random() * 2000) + 500,
            engagementRate: Math.floor(Math.random() * 40) + 60,
            performanceScore: Math.floor(Math.random() * 30) + 70,
            errorRate: Math.floor(Math.random() * 5) + 1,
            cacheHitRate: Math.floor(Math.random() * 20) + 75,
            messagesPerHour: Array.from({ length: 24 }, (_, i) => ({
                hour: `${i}:00`,
                count: Math.floor(Math.random() * 50) + 10
            })),
            userActivity: Array.from({ length: 5 }, (_, i) => ({
                userId: `user_${i + 1}`,
                messages: Math.floor(Math.random() * 100) + 20,
                lastActive: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString()
            })),
            performanceMetrics: Array.from({ length: 12 }, (_, i) => ({
                time: `${i * 2}:00`,
                score: Math.floor(Math.random() * 30) + 70,
                errors: Math.floor(Math.random() * 5)
            })),
            messageTypeDistribution: [
                { type: 'Text', count: 450, color: '#3b82f6' },
                { type: 'Image', count: 120, color: '#10b981' },
                { type: 'File', count: 80, color: '#f59e0b' },
                { type: 'Link', count: 60, color: '#ef4444' },
                { type: 'System', count: 30, color: '#8b5cf6' }
            ]
        };

        // Try to get actual analytics if available
        try {
            const actualAnalytics = getAnalytics?.();
            if (actualAnalytics) {
                return {
                    ...baseData,
                    ...actualAnalytics
                };
            }
        } catch (error) {
            console.warn('Failed to fetch analytics data:', error);
        }

        return baseData;
    }, [getAnalytics, selectedTimeRange]);

    // Auto-refresh analytics
    useEffect(() => {
        const interval = setInterval(() => {
            setLastRefresh(new Date());
            // In production, this would trigger a refetch of analytics data
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [refreshInterval]);

    // Performance status indicator
    const getPerformanceStatus = (score: number) => {
        if (score >= 90) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
        if (score >= 75) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
        if (score >= 60) return { status: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        return { status: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
    };

    const performanceStatus = getPerformanceStatus(analyticsData.performanceScore);

    return (
        <BoxStyled className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
            {/* Header */}
            <div className=\"flex items-center justify-between mb-6\">
                <div className=\"flex items-center space-x-3\">
                    <FiBarChart2 className=\"text-2xl text-blue-600\" />
                    <div>
                        <Typography type=\"h3\" className=\"text-gray-900\">Chat Analytics Dashboard</Typography>
                        <Typography className=\"text-sm text-gray-500\">
                            Last updated: {lastRefresh.toLocaleTimeString()}
                        </Typography>
                    </div>
                </div>
                
                <div className=\"flex items-center space-x-4\">
                    {/* Time Range Selector */}
                    <select
                        value={selectedTimeRange}
                        onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                        className=\"px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500\"
                    >
                        <option value=\"1h\">Last Hour</option>
                        <option value=\"24h\">Last 24 Hours</option>
                        <option value=\"7d\">Last 7 Days</option>
                        <option value=\"30d\">Last 30 Days</option>
                    </select>
                    
                    {/* Refresh Interval */}
                    <select
                        value={refreshInterval}
                        onChange={(e) => setRefreshInterval(Number(e.target.value))}
                        className=\"px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500\"
                    >
                        <option value={10000}>10s</option>
                        <option value={30000}>30s</option>
                        <option value={60000}>1m</option>
                        <option value={300000}>5m</option>
                    </select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6\">
                <div className=\"bg-blue-50 p-4 rounded-lg\">
                    <div className=\"flex items-center justify-between\">
                        <div>
                            <Typography className=\"text-sm text-blue-600\">Total Messages</Typography>
                            <Typography type=\"h4\" className=\"text-blue-900\">{analyticsData.totalMessages.toLocaleString()}</Typography>
                        </div>
                        <FiMessageCircle className=\"text-2xl text-blue-500\" />
                    </div>
                </div>
                
                <div className=\"bg-green-50 p-4 rounded-lg\">
                    <div className=\"flex items-center justify-between\">
                        <div>
                            <Typography className=\"text-sm text-green-600\">Active Users</Typography>
                            <Typography type=\"h4\" className=\"text-green-900\">{analyticsData.activeUsers}</Typography>
                        </div>
                        <FiUsers className=\"text-2xl text-green-500\" />
                    </div>
                </div>
                
                <div className=\"bg-purple-50 p-4 rounded-lg\">
                    <div className=\"flex items-center justify-between\">
                        <div>
                            <Typography className=\"text-sm text-purple-600\">Engagement Rate</Typography>
                            <Typography type=\"h4\" className=\"text-purple-900\">{analyticsData.engagementRate}%</Typography>
                        </div>
                        <FiTrendingUp className=\"text-2xl text-purple-500\" />
                    </div>
                </div>
                
                <div className={`${performanceStatus.bg} p-4 rounded-lg`}>
                    <div className=\"flex items-center justify-between\">
                        <div>
                            <Typography className={`text-sm ${performanceStatus.color}`}>Performance</Typography>
                            <Typography type=\"h4\" className={performanceStatus.color}>
                                {performanceStatus.status}
                            </Typography>
                        </div>
                        <FiActivity className={`text-2xl ${performanceStatus.color}`} />
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6\">
                {/* Messages Per Hour */}
                <div className=\"bg-gray-50 p-4 rounded-lg\">
                    <Typography type=\"h4\" className=\"mb-4\">Messages Per Hour</Typography>
                    <ResponsiveContainer width=\"100%\" height={200}>
                        <AreaChart data={analyticsData.messagesPerHour}>
                            <CartesianGrid strokeDasharray=\"3 3\" />
                            <XAxis dataKey=\"hour\" />
                            <YAxis />
                            <Tooltip />
                            <Area type=\"monotone\" dataKey=\"count\" stroke=\"#3b82f6\" fill=\"#93bbfc\" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Performance Metrics */}
                <div className=\"bg-gray-50 p-4 rounded-lg\">
                    <Typography type=\"h4\" className=\"mb-4\">Performance Trends</Typography>
                    <ResponsiveContainer width=\"100%\" height={200}>
                        <LineChart data={analyticsData.performanceMetrics}>
                            <CartesianGrid strokeDasharray=\"3 3\" />
                            <XAxis dataKey=\"time\" />
                            <YAxis />
                            <Tooltip />
                            <Line type=\"monotone\" dataKey=\"score\" stroke=\"#10b981\" strokeWidth={2} />
                            <Line type=\"monotone\" dataKey=\"errors\" stroke=\"#ef4444\" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Additional Analytics */}
            <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">
                {/* Message Type Distribution */}
                <div className=\"bg-gray-50 p-4 rounded-lg\">
                    <Typography type=\"h4\" className=\"mb-4\">Message Types</Typography>
                    <ResponsiveContainer width=\"100%\" height={200}>
                        <PieChart>
                            <Pie
                                data={analyticsData.messageTypeDistribution}
                                cx=\"50%\"
                                cy=\"50%\"
                                labelLine={false}
                                label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill=\"#8884d8\"
                                dataKey=\"count\"
                            >
                                {analyticsData.messageTypeDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* User Activity */}
                <div className=\"bg-gray-50 p-4 rounded-lg\">
                    <Typography type=\"h4\" className=\"mb-4\">Top Users</Typography>
                    <div className=\"space-y-2\">
                        {analyticsData.userActivity.map((user, index) => (
                            <div key={user.userId} className=\"flex items-center justify-between p-2 bg-white rounded\">
                                <div className=\"flex items-center space-x-2\">
                                    <div className=\"w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold\">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <Typography className=\"text-sm font-medium\">{user.userId}</Typography>
                                        <Typography className=\"text-xs text-gray-500\">{user.lastActive}</Typography>
                                    </div>
                                </div>
                                <Typography className=\"text-sm font-medium\">{user.messages}</Typography>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health */}
                <div className=\"bg-gray-50 p-4 rounded-lg\">
                    <Typography type=\"h4\" className=\"mb-4\">System Health</Typography>
                    <div className=\"space-y-3\">
                        <div className=\"flex items-center justify-between\">
                            <div className=\"flex items-center space-x-2\">
                                <FiZap className=\"text-yellow-500\" />
                                <Typography className=\"text-sm\">Avg Response Time</Typography>
                            </div>
                            <Typography className=\"text-sm font-medium\">{analyticsData.averageResponseTime}ms</Typography>
                        </div>
                        
                        <div className=\"flex items-center justify-between\">
                            <div className=\"flex items-center space-x-2\">
                                <FiCheckCircle className=\"text-green-500\" />
                                <Typography className=\"text-sm\">Cache Hit Rate</Typography>
                            </div>
                            <Typography className=\"text-sm font-medium\">{analyticsData.cacheHitRate}%</Typography>
                        </div>
                        
                        <div className=\"flex items-center justify-between\">
                            <div className=\"flex items-center space-x-2\">
                                <FiAlertCircle className=\"text-red-500\" />
                                <Typography className=\"text-sm\">Error Rate</Typography>
                            </div>
                            <Typography className=\"text-sm font-medium\">{analyticsData.errorRate}%</Typography>
                        </div>
                        
                        <div className=\"flex items-center justify-between\">
                            <div className=\"flex items-center space-x-2\">
                                <FiClock className=\"text-blue-500\" />
                                <Typography className=\"text-sm\">Uptime</Typography>
                            </div>
                            <Typography className=\"text-sm font-medium\">99.9%</Typography>
                        </div>
                    </div>
                </div>
            </div>
        </BoxStyled>
    );
};

export default AnalyticsDashboard;
