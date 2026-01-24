/**
 * User Behavior Chart Component
 * 
 * This component displays user behavior analytics including activity patterns,
    engagement metrics, and user interaction insights.
 */

import React, { useState, useMemo } from 'react';
import { useAnalytics } from './AnalyticsProvider';
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
import { FiUsers, FiActivity, FiClock, FiMessageCircle, FiTrendingUp } from 'react-icons/fi';

interface UserBehaviorChartProps {
    className?: string;
    timeRange?: '1h' | '24h' | '7d' | '30d';
    showDetails?: boolean;
}

interface UserActivityData {
    userId: string;
    messages: number;
    lastActive: string;
    avgResponseTime: number;
    engagementScore: number;
    activityPattern: Array<{ hour: string; messages: number }>;
}

interface EngagementData {
    type: string;
    value: number;
    color: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

/**
 * User Behavior Chart component that displays user activity and engagement patterns
 */
const UserBehaviorChart: React.FC<UserBehaviorChartProps> = ({
    className = '',
    timeRange = '24h',
    showDetails = true
}) => {
    const { state, getMetrics, getEvents } = useAnalytics();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const metrics = getMetrics();
    const events = getEvents();

    // Process user activity data
    const userActivityData = useMemo<UserActivityData[]>(() => {
        // In production, this would come from actual analytics data
        const mockData: UserActivityData[] = [
            {
                userId: 'user_1',
                messages: 145,
                lastActive: '2 minutes ago',
                avgResponseTime: 850,
                engagementScore: 92,
                activityPattern: Array.from({ length: 24 }, (_, i) => ({
                    hour: `${i}:00`,
                    messages: Math.floor(Math.random() * 10) + 1
                }))
            },
            {
                userId: 'user_2',
                messages: 98,
                lastActive: '15 minutes ago',
                avgResponseTime: 1200,
                engagementScore: 78,
                activityPattern: Array.from({ length: 24 }, (_, i) => ({
                    hour: `${i}:00`,
                    messages: Math.floor(Math.random() * 8) + 1
                }))
            },
            {
                userId: 'user_3',
                messages: 76,
                lastActive: '1 hour ago',
                avgResponseTime: 650,
                engagementScore: 85,
                activityPattern: Array.from({ length: 24 }, (_, i) => ({
                    hour: `${i}:00`,
                    messages: Math.floor(Math.random() * 6) + 1
                }))
            },
            {
                userId: 'user_4',
                messages: 54,
                lastActive: '3 hours ago',
                avgResponseTime: 950,
                engagementScore: 71,
                activityPattern: Array.from({ length: 24 }, (_, i) => ({
                    hour: `${i}:00`,
                    messages: Math.floor(Math.random() * 5) + 1
                }))
            },
            {
                userId: 'user_5',
                messages: 32,
                lastActive: '5 hours ago',
                avgResponseTime: 1800,
                engagementScore: 65,
                activityPattern: Array.from({ length: 24 }, (_, i) => ({
                    hour: `${i}:00`,
                    messages: Math.floor(Math.random() * 3) + 1
                }))
            }
        ];

        return mockData.sort((a, b) => b.messages - a.messages);
    }, [metrics.userActivity]);

    // Engagement distribution data
    const engagementData = useMemo<EngagementData[]>(() => [
        { type: 'Highly Engaged', value: 35, color: '#10b981' },
        { type: 'Moderately Engaged', value: 45, color: '#3b82f6' },
        { type: 'Low Engagement', value: 20, color: '#f59e0b' }
    ], []);

    // Activity heatmap data
    const activityHeatmapData = useMemo(() => {
        return Array.from({ length: 7 }, (_, dayIndex) => ({
            day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex],
            ...Array.from({ length: 24 }, (_, hourIndex) => ({
                [`hour_${hourIndex}`]: Math.floor(Math.random() * 50) + 10
            })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
        }));
    }, []);

    // Selected user details
    const selectedUserData = userActivityData.find(user => user.userId === selectedUser);

    return (
        <BoxStyled className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
            {/* Header */}
            <div className=\"flex items-center justify-between mb-6\">
                <div className=\"flex items-center space-x-3\">
                    <FiUsers className=\"text-2xl text-blue-600\" />
                    <div>
                        <Typography type=\"h4\">User Behavior Analytics</Typography>
                        <Typography className=\"text-sm text-gray-500\">
                            Activity patterns and engagement insights
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Top Users Overview */}
            <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6\">
                {/* Top Active Users */}
                <div className=\"bg-gray-50 p-4 rounded-lg\">
                    <Typography type=\"h5\" className=\"mb-4 flex items-center space-x-2\">
                        <FiActivity className=\"text-blue-600\" />
                        <span>Most Active Users</span>
                    </Typography>
                    
                    <div className=\"space-y-3\">
                        {userActivityData.slice(0, 5).map((user, index) => (
                            <div
                                key={user.userId}
                                className={`p-3 bg-white rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                                    selectedUser === user.userId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                }`}
                                onClick={() => setSelectedUser(user.userId === selectedUser ? null : user.userId)}
                            >
                                <div className=\"flex items-center justify-between mb-2\">
                                    <div className=\"flex items-center space-x-3\">
                                        <div className=\"w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold\">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <Typography className=\"font-medium\">{user.userId}</Typography>
                                            <Typography className=\"text-xs text-gray-500\">{user.lastActive}</Typography>
                                        </div>
                                    </div>
                                    <div className=\"text-right\">
                                        <Typography className=\"font-bold\">{user.messages}</Typography>
                                        <Typography className=\"text-xs text-gray-500\">messages</Typography>
                                    </div>
                                </div>
                                
                                <div className=\"flex items-center justify-between text-xs\">
                                    <div className=\"flex items-center space-x-4\">
                                        <span className=\"text-gray-600\">Response: {user.avgResponseTime}ms</span>
                                        <span className=\"text-gray-600\">Engagement: {user.engagementScore}%</span>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${
                                        user.engagementScore >= 85 ? 'bg-green-500' :
                                        user.engagementScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Engagement Distribution */}
                <div className=\"bg-gray-50 p-4 rounded-lg\">
                    <Typography type=\"h5\" className=\"mb-4 flex items-center space-x-2\">
                        <FiTrendingUp className=\"text-green-600\" />
                        <span>Engagement Distribution</span>
                    </Typography>
                    
                    <ResponsiveContainer width=\"100%\" height={250}>
                        <PieChart>
                            <Pie
                                data={engagementData}
                                cx=\"50%\"
                                cy=\"50%\"
                                labelLine={false}
                                label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill=\"#8884d8\"
                                dataKey=\"value\"
                            >
                                {engagementData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Selected User Details */}
            {selectedUserData && showDetails && (
                <div className=\"bg-blue-50 p-4 rounded-lg mb-6\">
                    <Typography type=\"h5\" className=\"mb-4\">User Details: {selectedUserData.userId}</Typography>
                    
                    <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\">
                        <div className=\"bg-white p-3 rounded\">
                            <Typography className=\"text-sm text-gray-600\">Total Messages</Typography>
                            <Typography className=\"text-xl font-bold\">{selectedUserData.messages}</Typography>
                        </div>
                        <div className=\"bg-white p-3 rounded\">
                            <Typography className=\"text-sm text-gray-600\">Avg Response Time</Typography>
                            <Typography className=\"text-xl font-bold\">{selectedUserData.avgResponseTime}ms</Typography>
                        </div>
                        <div className=\"bg-white p-3 rounded\">
                            <Typography className=\"text-sm text-gray-600\">Engagement Score</Typography>
                            <Typography className=\"text-xl font-bold\">{selectedUserData.engagementScore}%</Typography>
                        </div>
                    </div>
                    
                    {/* User Activity Pattern */}
                    <div className=\"bg-white p-4 rounded\">
                        <Typography className=\"text-sm font-medium mb-3\">24-Hour Activity Pattern</Typography>
                        <ResponsiveContainer width=\"100%\" height={150}>
                            <AreaChart data={selectedUserData.activityPattern}>
                                <CartesianGrid strokeDasharray=\"3 3\" />
                                <XAxis dataKey=\"hour\" />
                                <YAxis />
                                <Tooltip />
                                <Area type=\"monotone\" dataKey=\"messages\" stroke=\"#3b82f6\" fill=\"#93bbfc\" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Activity Heatmap */}
            <div className=\"bg-gray-50 p-4 rounded-lg\">
                <Typography type=\"h5\" className=\"mb-4 flex items-center space-x-2\">
                    <FiClock className=\"text-purple-600\" />
                    <span>Weekly Activity Heatmap</span>
                </Typography>
                
                <div className=\"grid grid-cols-7 gap-2\">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
                        <div key={day} className=\"text-center\">
                            <Typography className=\"text-xs font-medium mb-2\">{day}</Typography>
                            <div className=\"grid grid-cols-4 gap-1\">
                                {Array.from({ length: 24 }, (_, hourIndex) => {
                                    const intensity = Math.random();
                                    return (
                                        <div
                                            key={hourIndex}
                                            className={`w-2 h-2 rounded-full ${
                                                intensity > 0.8 ? 'bg-blue-600' :
                                                intensity > 0.6 ? 'bg-blue-500' :
                                                intensity > 0.4 ? 'bg-blue-400' :
                                                intensity > 0.2 ? 'bg-blue-300' : 'bg-gray-200'
                                            }`}
                                            title={`${hourIndex}:00 - ${Math.floor(intensity * 100)}% activity`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className=\"flex items-center justify-center space-x-4 mt-4 text-xs text-gray-600\">
                    <div className=\"flex items-center space-x-2\">
                        <div className=\"w-3 h-3 rounded-full bg-gray-200\" />
                        <span>Low</span>
                    </div>
                    <div className=\"flex items-center space-x-2\">
                        <div className=\"w-3 h-3 rounded-full bg-blue-300\" />
                        <span>Medium</span>
                    </div>
                    <div className=\"flex items-center space-x-2\">
                        <div className=\"w-3 h-3 rounded-full bg-blue-600\" />
                        <span>High</span>
                    </div>
                </div>
            </div>

            {/* Key Insights */}
            <div className=\"mt-6 p-4 bg-blue-50 rounded-lg\">
                <Typography type=\"h5\" className=\"mb-3\">Key Insights</Typography>
                <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-sm\">
                    <div className=\"flex items-start space-x-2\">
                        <FiMessageCircle className=\"text-blue-600 mt-1\" />
                        <div>
                            <Typography className=\"font-medium\">Peak Activity</Typography>
                            <Typography className=\"text-gray-600\">Most users are active between 2-4 PM</Typography>
                        </div>
                    </div>
                    <div className=\"flex items-start space-x-2\">
                        <FiUsers className=\"text-green-600 mt-1\" />
                        <div>
                            <Typography className=\"font-medium\">Top Performers</Typography>
                            <Typography className=\"text-gray-600\">Top 20% of users generate 60% of messages</Typography>
                        </div>
                    </div>
                    <div className=\"flex items-start space-x-2\">
                        <FiClock className=\"text-purple-600 mt-1\" />
                        <div>
                            <Typography className=\"font-medium\">Response Times</Typography>
                            <Typography className=\"text-gray-600\">Average response time is 850ms</Typography>
                        </div>
                    </div>
                    <div className=\"flex items-start space-x-2\">
                        <FiTrendingUp className=\"text-orange-600 mt-1\" />
                        <div>
                            <Typography className=\"font-medium\">Engagement Trend</Typography>
                            <Typography className=\"text-gray-600\">35% of users are highly engaged</Typography>
                        </div>
                    </div>
                </div>
            </div>
        </BoxStyled>
    );
};

export default UserBehaviorChart;
