/**
 * Analytics Provider Context
 * 
 * This context provides analytics data and functionality to all chat components,
 * managing real-time analytics updates, caching, and data aggregation.
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useUnifiedChat } from '@features/chat/application/hooks/useUnifiedChat';

// Analytics data types
interface AnalyticsEvent {
    type: 'message_sent' | 'message_read' | 'user_typing' | 'chat_created' | 'chat_deleted' | 'user_joined' | 'user_left';
    userId: string;
    chatId?: string;
    timestamp: number;
    metadata?: Record<string, any>;
}

interface AnalyticsMetrics {
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

interface AnalyticsState {
    metrics: AnalyticsMetrics;
    events: AnalyticsEvent[];
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    refreshInterval: number;
    timeRange: '1h' | '24h' | '7d' | '30d';
}

interface AnalyticsContextType {
    state: AnalyticsState;
    dispatch: React.Dispatch<AnalyticsAction>;
    recordEvent: (event: Omit<AnalyticsEvent, 'timestamp'>) => void;
    refreshMetrics: () => Promise<void>;
    setTimeRange: (range: '1h' | '24h' | '7d' | '30d') => void;
    setRefreshInterval: (interval: number) => void;
    getMetrics: () => AnalyticsMetrics;
    getEvents: (type?: AnalyticsEvent['type']) => AnalyticsEvent[];
    exportData: () => string;
}

// Action types
type AnalyticsAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_METRICS'; payload: AnalyticsMetrics }
    | { type: 'ADD_EVENT'; payload: AnalyticsEvent }
    | { type: 'SET_TIME_RANGE'; payload: '1h' | '24h' | '7d' | '30d' }
    | { type: 'SET_REFRESH_INTERVAL'; payload: number }
    | { type: 'CLEAR_EVENTS' };

// Initial state
const initialState: AnalyticsState = {
    metrics: {
        totalMessages: 0,
        activeUsers: 0,
        averageResponseTime: 0,
        engagementRate: 0,
        performanceScore: 0,
        errorRate: 0,
        cacheHitRate: 0,
        messagesPerHour: [],
        userActivity: [],
        performanceMetrics: [],
        messageTypeDistribution: []
    },
    events: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
    refreshInterval: 30000,
    timeRange: '24h'
};

// Reducer
const analyticsReducer = (state: AnalyticsState, action: AnalyticsAction): AnalyticsState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        
        case 'SET_METRICS':
            return { 
                ...state, 
                metrics: action.payload, 
                isLoading: false, 
                error: null,
                lastUpdated: new Date()
            };
        
        case 'ADD_EVENT':
            return { 
                ...state, 
                events: [action.payload, ...state.events].slice(0, 1000) // Keep last 1000 events
            };
        
        case 'SET_TIME_RANGE':
            return { ...state, timeRange: action.payload };
        
        case 'SET_REFRESH_INTERVAL':
            return { ...state, refreshInterval: action.payload };
        
        case 'CLEAR_EVENTS':
            return { ...state, events: [] };
        
        default:
            return state;
    }
};

// Context
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// Provider props
interface AnalyticsProviderProps {
    children: ReactNode;
    userId: string;
    chatId?: string;
    autoRefresh?: boolean;
}

/**
 * AnalyticsProvider component that provides analytics context to children
 */
export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
    children,
    userId,
    chatId,
    autoRefresh = true
}) => {
    const [state, dispatch] = useReducer(analyticsReducer, initialState);
    
    // Use unified chat for analytics
    const chat = useUnifiedChat(userId, chatId, {
        enableRealTime: true,
        enableOptimisticUpdates: true,
        cacheStrategy: 'moderate'
    });

    const { getAnalytics, recordAnalyticsEvent } = chat;

    // Record analytics event
    const recordEvent = (event: Omit<AnalyticsEvent, 'timestamp'>) => {
        const fullEvent: AnalyticsEvent = {
            ...event,
            timestamp: Date.now()
        };
        
        dispatch({ type: 'ADD_EVENT', payload: fullEvent });
        
        // Also record with the chat service if available
        recordAnalyticsEvent?.(fullEvent);
    };

    // Refresh metrics
    const refreshMetrics = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            // Get analytics from chat service
            const analyticsData = getAnalytics?.();
            
            if (analyticsData) {
                dispatch({ type: 'SET_METRICS', payload: analyticsData });
            } else {
                // Generate mock data if no analytics available
                const mockMetrics: AnalyticsMetrics = generateMockMetrics();
                dispatch({ type: 'SET_METRICS', payload: mockMetrics });
            }
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch analytics' });
        }
    };

    // Generate mock metrics (for development)
    const generateMockMetrics = (): AnalyticsMetrics => {
        const now = new Date();
        const messagesPerHour = Array.from({ length: 24 }, (_, i) => ({
            hour: `${i}:00`,
            count: Math.floor(Math.random() * 50) + 10
        }));

        const userActivity = Array.from({ length: 5 }, (_, i) => ({
            userId: `user_${i + 1}`,
            messages: Math.floor(Math.random() * 100) + 20,
            lastActive: new Date(now.getTime() - Math.random() * 3600000).toLocaleTimeString()
        }));

        const performanceMetrics = Array.from({ length: 12 }, (_, i) => ({
            time: `${i * 2}:00`,
            score: Math.floor(Math.random() * 30) + 70,
            errors: Math.floor(Math.random() * 5)
        }));

        const messageTypeDistribution = [
            { type: 'Text', count: 450, color: '#3b82f6' },
            { type: 'Image', count: 120, color: '#10b981' },
            { type: 'File', count: 80, color: '#f59e0b' },
            { type: 'Link', count: 60, color: '#ef4444' },
            { type: 'System', count: 30, color: '#8b5cf6' }
        ];

        return {
            totalMessages: Math.floor(Math.random() * 1000) + 500,
            activeUsers: Math.floor(Math.random() * 50) + 10,
            averageResponseTime: Math.floor(Math.random() * 2000) + 500,
            engagementRate: Math.floor(Math.random() * 40) + 60,
            performanceScore: Math.floor(Math.random() * 30) + 70,
            errorRate: Math.floor(Math.random() * 5) + 1,
            cacheHitRate: Math.floor(Math.random() * 20) + 75,
            messagesPerHour,
            userActivity,
            performanceMetrics,
            messageTypeDistribution
        };
    };

    // Set time range
    const setTimeRange = (range: '1h' | '24h' | '7d' | '30d') => {
        dispatch({ type: 'SET_TIME_RANGE', payload: range });
        refreshMetrics(); // Refresh metrics when time range changes
    };

    // Set refresh interval
    const setRefreshInterval = (interval: number) => {
        dispatch({ type: 'SET_REFRESH_INTERVAL', payload: interval });
    };

    // Get metrics
    const getMetrics = (): AnalyticsMetrics => state.metrics;

    // Get events
    const getEvents = (type?: AnalyticsEvent['type']): AnalyticsEvent[] => {
        if (type) {
            return state.events.filter(event => event.type === type);
        }
        return state.events;
    };

    // Export data
    const exportData = (): string => {
        const exportData = {
            metrics: state.metrics,
            events: state.events,
            timestamp: new Date().toISOString(),
            timeRange: state.timeRange
        };
        
        return JSON.stringify(exportData, null, 2);
    };

    // Auto-refresh effect
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            refreshMetrics();
        }, state.refreshInterval);

        return () => clearInterval(interval);
    }, [autoRefresh, state.refreshInterval]);

    // Initial load
    useEffect(() => {
        refreshMetrics();
    }, [userId, chatId]);

    // Context value
    const contextValue: AnalyticsContextType = {
        state,
        dispatch,
        recordEvent,
        refreshMetrics,
        setTimeRange,
        setRefreshInterval,
        getMetrics,
        getEvents,
        exportData
    };

    return (
        <AnalyticsContext.Provider value={contextValue}>
            {children}
        </AnalyticsContext.Provider>
    );
};

/**
 * Hook to use analytics context
 */
export const useAnalytics = (): AnalyticsContextType => {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};

/**
 * Hook to record analytics events
 */
export const useAnalyticsEvents = () => {
    const { recordEvent } = useAnalytics();
    
    return {
        recordMessageSent: (userId: string, chatId: string, metadata?: any) => {
            recordEvent({
                type: 'message_sent',
                userId,
                chatId,
                metadata
            });
        },
        
        recordMessageRead: (userId: string, chatId: string, metadata?: any) => {
            recordEvent({
                type: 'message_read',
                userId,
                chatId,
                metadata
            });
        },
        
        recordUserTyping: (userId: string, chatId: string, metadata?: any) => {
            recordEvent({
                type: 'user_typing',
                userId,
                chatId,
                metadata
            });
        },
        
        recordChatCreated: (userId: string, chatId: string, metadata?: any) => {
            recordEvent({
                type: 'chat_created',
                userId,
                chatId,
                metadata
            });
        },
        
        recordChatDeleted: (userId: string, chatId: string, metadata?: any) => {
            recordEvent({
                type: 'chat_deleted',
                userId,
                chatId,
                metadata
            });
        },
        
        recordUserJoined: (userId: string, chatId: string, metadata?: any) => {
            recordEvent({
                type: 'user_joined',
                userId,
                chatId,
                metadata
            });
        },
        
        recordUserLeft: (userId: string, chatId: string, metadata?: any) => {
            recordEvent({
                type: 'user_left',
                userId,
                chatId,
                metadata
            });
        }
    };
};

export default AnalyticsProvider;
