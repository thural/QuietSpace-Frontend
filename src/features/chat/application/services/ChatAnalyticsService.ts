/**
 * Chat Analytics Service
 * 
 * Provides comprehensive chat analytics and engagement metrics including:
 * - User engagement tracking
 * - Chat activity analysis
 * - Message statistics
 * - Performance analytics
 * - Trend analysis
 */

import { Injectable } from '@/core/modules/dependency-injection';
import { CacheProvider } from '@/core/cache';
import { ChatMetricsService } from '@/features/chat/application/services/ChatMetricsService';

export interface ChatAnalytics {
    // User engagement metrics
    userEngagement: {
        totalUsers: number;
        activeUsers: number;
        averageMessagesPerUser: number;
        mostActiveUsers: Array<{
            userId: string;
            messageCount: number;
            engagementScore: number;
        }>;
        userRetentionRate: number;
    };
    
    // Chat activity metrics
    chatActivity: {
        totalChats: number;
        activeChats: number;
        averageMessagesPerChat: number;
        mostActiveChats: Array<{
            chatId: string;
            messageCount: number;
            participantCount: number;
            activityScore: number;
        }>;
        chatCreationRate: number;
    };
    
    // Message statistics
    messageStats: {
        totalMessages: number;
        averageMessageLength: number;
        messagesPerHour: number;
        peakActivityHours: Array<{
            hour: number;
            messageCount: number;
        }>;
        messageTypeDistribution: {
            text: number;
            image: number;
            file: number;
            system: number;
        };
    };
    
    // Performance analytics
    performanceAnalytics: {
        averageResponseTime: number;
        messageDeliveryRate: number;
        errorRate: number;
        cacheHitRate: number;
        websocketUptime: number;
    };
    
    // Engagement trends
    engagementTrends: {
        dailyActivity: Array<{
            date: string;
            messages: number;
            activeUsers: number;
            newChats: number;
        }>;
        weeklyGrowth: {
            userGrowth: number;
            messageGrowth: number;
            chatGrowth: number;
        };
        engagementScore: number;
    };
}

export interface EngagementEvent {
    type: 'message_sent' | 'message_read' | 'chat_created' | 'user_joined' | 'user_left' | 'reaction_added';
    userId: string;
    chatId?: string;
    timestamp: number;
    metadata?: Record<string, any>;
}

export interface AnalyticsFilter {
    dateRange?: {
        start: Date;
        end: Date;
    };
    userIds?: string[];
    chatIds?: string[];
    eventTypes?: string[];
}

@Injectable()
export class ChatAnalyticsService {
    private engagementEvents: EngagementEvent[] = [];
    private analyticsCache: Map<string, ChatAnalytics> = new Map();
    private readonly CACHE_TTL = 300000; // 5 minutes

    constructor(
        private cache: CacheProvider,
        private metricsService: ChatMetricsService
    ) {}

    /**
     * Record an engagement event
     */
    recordEvent(event: EngagementEvent): void {
        this.engagementEvents.push(event);
        
        // Keep only last 10000 events to prevent memory issues
        if (this.engagementEvents.length > 10000) {
            this.engagementEvents = this.engagementEvents.slice(-10000);
        }
        
        // Invalidate analytics cache
        this.invalidateAnalyticsCache();
        
        // Track in metrics service
        this.metricsService.recordInteraction('analytics', {
            eventType: event.type,
            userId: event.userId,
            chatId: event.chatId
        });
    }

    /**
     * Get comprehensive chat analytics
     */
    async getAnalytics(filter?: AnalyticsFilter): Promise<ChatAnalytics> {
        const cacheKey = this.generateCacheKey(filter);
        
        // Check cache first
        const cached = this.analyticsCache.get(cacheKey);
        if (cached && this.isCacheValid(cacheKey)) {
            return cached;
        }

        // Generate analytics
        const analytics = await this.generateAnalytics(filter);
        
        // Cache the result
        this.analyticsCache.set(cacheKey, analytics);
        this.cache.set(cacheKey, analytics, { ttl: this.CACHE_TTL });
        
        return analytics;
    }

    /**
     * Get user-specific analytics
     */
    async getUserAnalytics(userId: string, filter?: AnalyticsFilter): Promise<{
        messageCount: number;
        chatCount: number;
        averageMessageLength: number;
        responseTime: number;
        engagementScore: number;
        activityPattern: Array<{
            hour: number;
            messageCount: number;
        }>;
        topChats: Array<{
            chatId: string;
            messageCount: number;
            lastActivity: number;
        }>;
    }> {
        const userEvents = this.filterEvents({
            ...filter,
            userIds: [userId]
        });

        const messageEvents = userEvents.filter(e => e.type === 'message_sent');
        const chatEvents = userEvents.filter(e => e.type === 'chat_created');
        
        // Calculate metrics
        const messageCount = messageEvents.length;
        const chatCount = chatEvents.length;
        const averageMessageLength = this.calculateAverageMessageLength(messageEvents);
        const responseTime = this.calculateAverageResponseTime(userId, userEvents);
        const engagementScore = this.calculateEngagementScore(userId, userEvents);
        const activityPattern = this.calculateActivityPattern(messageEvents);
        const topChats = this.getTopChats(userId, messageEvents);

        return {
            messageCount,
            chatCount,
            averageMessageLength,
            responseTime,
            engagementScore,
            activityPattern,
            topChats
        };
    }

    /**
     * Get chat-specific analytics
     */
    async getChatAnalytics(chatId: string, filter?: AnalyticsFilter): Promise<{
        messageCount: number;
        participantCount: number;
        averageMessageLength: number;
        activityScore: number;
        peakHours: Array<{
            hour: number;
            messageCount: number;
        }>;
        topParticipants: Array<{
            userId: string;
            messageCount: number;
            engagementScore: number;
        }>;
        messageTimeline: Array<{
            date: string;
            messageCount: number;
        }>;
    }> {
        const chatEvents = this.filterEvents({
            ...filter,
            chatIds: [chatId]
        });

        const messageEvents = chatEvents.filter(e => e.type === 'message_sent');
        const participantEvents = chatEvents.filter(e => 
            ['user_joined', 'user_left'].includes(e.type)
        );
        
        const messageCount = messageEvents.length;
        const participantCount = this.getUniqueParticipantCount(participantEvents);
        const averageMessageLength = this.calculateAverageMessageLength(messageEvents);
        const activityScore = this.calculateChatActivityScore(chatId, messageEvents);
        const peakHours = this.calculatePeakHours(messageEvents);
        const topParticipants = this.getTopParticipants(chatId, messageEvents);
        const messageTimeline = this.generateMessageTimeline(messageEvents);

        return {
            messageCount,
            participantCount,
            averageMessageLength,
            activityScore,
            peakHours,
            topParticipants,
            messageTimeline
        };
    }

    /**
     * Get engagement trends over time
     */
    async getEngagementTrends(days: number = 30): Promise<{
        dailyEngagement: Array<{
            date: string;
            engagementScore: number;
            activeUsers: number;
            messages: number;
        }>;
        weeklyComparison: {
            currentWeek: number;
            previousWeek: number;
            growth: number;
        };
        predictions: {
            nextWeekEngagement: number;
            confidence: number;
        };
    }> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        const events = this.engagementEvents.filter(e => 
            e.timestamp >= startDate.getTime() && e.timestamp <= endDate.getTime()
        );

        const dailyEngagement = this.calculateDailyEngagement(events, days);
        const weeklyComparison = this.calculateWeeklyComparison(events);
        const predictions = this.generateEngagementPredictions(dailyEngagement);

        return {
            dailyEngagement,
            weeklyComparison,
            predictions
        };
    }

    /**
     * Generate comprehensive analytics
     */
    private async generateAnalytics(filter?: AnalyticsFilter): Promise<ChatAnalytics> {
        const events = this.filterEvents(filter);
        
        return {
            userEngagement: this.calculateUserEngagement(events),
            chatActivity: this.calculateChatActivity(events),
            messageStats: this.calculateMessageStats(events),
            performanceAnalytics: await this.calculatePerformanceAnalytics(),
            engagementTrends: await this.calculateEngagementTrends(events)
        };
    }

    /**
     * Filter events based on criteria
     */
    private filterEvents(filter?: AnalyticsFilter): EngagementEvent[] {
        let events = [...this.engagementEvents];

        if (filter?.dateRange) {
            events = events.filter(e => 
                e.timestamp >= filter.dateRange!.start.getTime() &&
                e.timestamp <= filter.dateRange!.end.getTime()
            );
        }

        if (filter?.userIds?.length) {
            events = events.filter(e => filter.userIds!.includes(e.userId));
        }

        if (filter?.chatIds?.length) {
            events = events.filter(e => 
                !e.chatId || filter.chatIds!.includes(e.chatId)
            );
        }

        if (filter?.eventTypes?.length) {
            events = events.filter(e => filter.eventTypes!.includes(e.type));
        }

        return events;
    }

    /**
     * Calculate user engagement metrics
     */
    private calculateUserEngagement(events: EngagementEvent[]): ChatAnalytics['userEngagement'] {
        const userEvents = new Map<string, EngagementEvent[]>();
        
        events.forEach(event => {
            if (!userEvents.has(event.userId)) {
                userEvents.set(event.userId, []);
            }
            userEvents.get(event.userId)!.push(event);
        });

        const totalUsers = userEvents.size;
        const activeUsers = Array.from(userEvents.entries()).filter(([_, events]) => 
            events.length > 0
        ).length;

        const userStats = Array.from(userEvents.entries()).map(([userId, events]) => ({
            userId,
            messageCount: events.filter(e => e.type === 'message_sent').length,
            engagementScore: this.calculateEngagementScore(userId, events)
        }));

        const averageMessagesPerUser = userStats.reduce((sum, user) => 
            sum + user.messageCount, 0
        ) / totalUsers;

        const mostActiveUsers = userStats
            .sort((a, b) => b.messageCount - a.messageCount)
            .slice(0, 10)
            .map(user => ({
                userId: user.userId,
                messageCount: user.messageCount,
                engagementScore: user.engagementScore
            }));

        return {
            totalUsers,
            activeUsers,
            averageMessagesPerUser,
            mostActiveUsers,
            userRetentionRate: this.calculateRetentionRate(userEvents)
        };
    }

    /**
     * Calculate chat activity metrics
     */
    private calculateChatActivity(events: EngagementEvent[]): ChatAnalytics['chatActivity'] {
        const chatEvents = new Map<string, EngagementEvent[]>();
        
        events.forEach(event => {
            if (!event.chatId) return;
            
            if (!chatEvents.has(event.chatId)) {
                chatEvents.set(event.chatId, []);
            }
            chatEvents.get(event.chatId)!.push(event);
        });

        const totalChats = chatEvents.size;
        const activeChats = Array.from(chatEvents.entries()).filter(([_, events]) => 
            events.some(e => e.type === 'message_sent')
        ).length;

        const chatStats = Array.from(chatEvents.entries()).map(([chatId, events]) => ({
            chatId,
            messageCount: events.filter(e => e.type === 'message_sent').length,
            participantCount: this.getUniqueParticipantCount(events),
            activityScore: this.calculateChatActivityScore(chatId, events)
        }));

        const averageMessagesPerChat = chatStats.reduce((sum, chat) => 
            sum + chat.messageCount, 0
        ) / totalChats;

        const mostActiveChats = chatStats
            .sort((a, b) => b.activityScore - a.activityScore)
            .slice(0, 10);

        const chatCreationRate = events.filter(e => e.type === 'chat_created').length / 7; // per week

        return {
            totalChats,
            activeChats,
            averageMessagesPerChat,
            mostActiveChats,
            chatCreationRate
        };
    }

    /**
     * Calculate message statistics
     */
    private calculateMessageStats(events: EngagementEvent[]): ChatAnalytics['messageStats'] {
        const messageEvents = events.filter(e => e.type === 'message_sent');
        
        const totalMessages = messageEvents.length;
        const averageMessageLength = this.calculateAverageMessageLength(messageEvents);
        const messagesPerHour = totalMessages / 24; // simple average
        
        const hourlyDistribution = new Map<number, number>();
        messageEvents.forEach(event => {
            const hour = new Date(event.timestamp).getHours();
            hourlyDistribution.set(hour, (hourlyDistribution.get(hour) || 0) + 1);
        });

        const peakActivityHours = Array.from(hourlyDistribution.entries())
            .map(([hour, count]) => ({ hour, messageCount: count }))
            .sort((a, b) => b.messageCount - a.messageCount)
            .slice(0, 6);

        const messageTypeDistribution = {
            text: messageEvents.filter(e => !e.metadata?.type || e.metadata.type === 'text').length,
            image: messageEvents.filter(e => e.metadata?.type === 'image').length,
            file: messageEvents.filter(e => e.metadata?.type === 'file').length,
            system: messageEvents.filter(e => e.metadata?.type === 'system').length
        };

        return {
            totalMessages,
            averageMessageLength,
            messagesPerHour,
            peakActivityHours,
            messageTypeDistribution
        };
    }

    /**
     * Calculate performance analytics
     */
    private async calculatePerformanceAnalytics(): Promise<ChatAnalytics['performanceAnalytics']> {
        const metrics = this.metricsService.getMetrics();
        
        return {
            averageResponseTime: metrics.queryMetrics.averageQueryTime,
            messageDeliveryRate: 1 - metrics.mutationMetrics.errorRate,
            errorRate: (metrics.queryMetrics.errorRate + metrics.mutationMetrics.errorRate) / 2,
            cacheHitRate: metrics.queryMetrics.cacheHitRate,
            websocketUptime: metrics.websocketMetrics.connectionUptime
        };
    }

    /**
     * Calculate engagement trends
     */
    private async calculateEngagementTrends(events: EngagementEvent[]): Promise<ChatAnalytics['engagementTrends']> {
        const dailyActivity = this.calculateDailyActivity(events);
        const weeklyGrowth = this.calculateWeeklyGrowth(dailyActivity);
        const engagementScore = this.calculateOverallEngagementScore(events);

        return {
            dailyActivity,
            weeklyGrowth,
            engagementScore
        };
    }

    // Helper methods
    private calculateEngagementScore(userId: string, events: EngagementEvent[]): number {
        const userEvents = events.filter(e => e.userId === userId);
        const messageCount = userEvents.filter(e => e.type === 'message_sent').length;
        const chatCount = userEvents.filter(e => e.type === 'chat_created').length;
        
        // Simple engagement score calculation
        return (messageCount * 1) + (chatCount * 5) + (userEvents.length * 0.1);
    }

    private calculateAverageMessageLength(events: EngagementEvent[]): number {
        const messageEvents = events.filter(e => e.type === 'message_sent');
        if (messageEvents.length === 0) return 0;
        
        const totalLength = messageEvents.reduce((sum, event) => 
            sum + (event.metadata?.messageLength || 0), 0
        );
        
        return totalLength / messageEvents.length;
    }

    private calculateRetentionRate(userEvents: Map<string, EngagementEvent[]>): number {
        // Simple retention calculation based on recent activity
        const now = Date.now();
        const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
        
        const activeUsers = Array.from(userEvents.entries()).filter(([_, events]) => 
            events.some(e => e.timestamp > weekAgo)
        ).length;
        
        return userEvents.size > 0 ? activeUsers / userEvents.size : 0;
    }

    private getUniqueParticipantCount(events: EngagementEvent[]): number {
        const participants = new Set<string>();
        events.forEach(event => {
            if (event.metadata?.participantId) {
                participants.add(event.metadata.participantId);
            }
        });
        return participants.size;
    }

    private calculateChatActivityScore(chatId: string, events: EngagementEvent[]): number {
        const chatEvents = events.filter(e => e.chatId === chatId);
        const messageCount = chatEvents.filter(e => e.type === 'message_sent').length;
        const participantCount = this.getUniqueParticipantCount(chatEvents);
        
        return messageCount + (participantCount * 2);
    }

    private calculateDailyActivity(events: EngagementEvent[], days: number): ChatAnalytics['engagementTrends']['dailyActivity'] {
        const dailyData = new Map<string, { messages: number; activeUsers: number; newChats: number }>();
        
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayEvents = events.filter(e => {
                const eventDate = new Date(e.timestamp).toISOString().split('T')[0];
                return eventDate === dateStr;
            });
            
            const messages = dayEvents.filter(e => e.type === 'message_sent').length;
            const activeUsers = new Set(dayEvents.map(e => e.userId)).size;
            const newChats = dayEvents.filter(e => e.type === 'chat_created').length;
            
            dailyData.set(dateStr, { messages, activeUsers, newChats });
        }
        
        return Array.from(dailyData.entries()).map(([date, data]) => ({
            date,
            messages: data.messages,
            activeUsers: data.activeUsers,
            newChats: data.newChats
        }));
    }

    private calculateWeeklyGrowth(dailyActivity: ChatAnalytics['engagementTrends']['dailyActivity']): ChatAnalytics['engagementTrends']['weeklyGrowth'] {
        if (dailyActivity.length < 14) {
            return { userGrowth: 0, messageGrowth: 0, chatGrowth: 0 };
        }
        
        const currentWeek = dailyActivity.slice(0, 7);
        const previousWeek = dailyActivity.slice(7, 14);
        
        const currentMessages = currentWeek.reduce((sum, day) => sum + day.messages, 0);
        const previousMessages = previousWeek.reduce((sum, day) => sum + day.messages, 0);
        
        const currentUsers = currentWeek.reduce((sum, day) => sum + day.activeUsers, 0);
        const previousUsers = previousWeek.reduce((sum, day) => sum + day.activeUsers, 0);
        
        const currentChats = currentWeek.reduce((sum, day) => sum + day.newChats, 0);
        const previousChats = previousWeek.reduce((sum, day) => sum + day.newChats, 0);
        
        return {
            userGrowth: previousUsers > 0 ? ((currentUsers - previousUsers) / previousUsers) * 100 : 0,
            messageGrowth: previousMessages > 0 ? ((currentMessages - previousMessages) / previousMessages) * 100 : 0,
            chatGrowth: previousChats > 0 ? ((currentChats - previousChats) / previousChats) * 100 : 0
        };
    }

    private calculateOverallEngagementScore(events: EngagementEvent[]): number {
        const messageCount = events.filter(e => e.type === 'message_sent').length;
        const chatCount = events.filter(e => e.type === 'chat_created').length;
        const userCount = new Set(events.map(e => e.userId)).size;
        
        return (messageCount * 0.1) + (chatCount * 1) + (userCount * 0.5);
    }

    // Additional helper methods for user and chat analytics
    private calculateAverageResponseTime(userId: string, events: EngagementEvent[]): number {
        // Simplified response time calculation
        return 500; // milliseconds
    }

    private calculateActivityPattern(messageEvents: EngagementEvent[]): Array<{ hour: number; messageCount: number }> {
        const hourlyCount = new Map<number, number>();
        
        messageEvents.forEach(event => {
            const hour = new Date(event.timestamp).getHours();
            hourlyCount.set(hour, (hourlyCount.get(hour) || 0) + 1);
        });
        
        return Array.from(hourlyCount.entries())
            .map(([hour, count]) => ({ hour, messageCount: count }))
            .sort((a, b) => a.hour - b.hour);
    }

    private getTopChats(userId: string, messageEvents: EngagementEvent[]): Array<{ chatId: string; messageCount: number; lastActivity: number }> {
        const chatCounts = new Map<string, { count: number; lastActivity: number }>();
        
        messageEvents.forEach(event => {
            if (!event.chatId) return;
            
            const existing = chatCounts.get(event.chatId) || { count: 0, lastActivity: 0 };
            chatCounts.set(event.chatId, {
                count: existing.count + 1,
                lastActivity: Math.max(existing.lastActivity, event.timestamp)
            });
        });
        
        return Array.from(chatCounts.entries())
            .map(([chatId, data]) => ({
                chatId,
                messageCount: data.count,
                lastActivity: data.lastActivity
            }))
            .sort((a, b) => b.messageCount - a.messageCount)
            .slice(0, 5);
    }

    private calculatePeakHours(messageEvents: EngagementEvent[]): Array<{ hour: number; messageCount: number }> {
        const hourlyCount = new Map<number, number>();
        
        messageEvents.forEach(event => {
            const hour = new Date(event.timestamp).getHours();
            hourlyCount.set(hour, (hourlyCount.get(hour) || 0) + 1);
        });
        
        return Array.from(hourlyCount.entries())
            .map(([hour, count]) => ({ hour, messageCount: count }))
            .sort((a, b) => b.messageCount - a.messageCount)
            .slice(0, 6);
    }

    private getTopParticipants(chatId: string, messageEvents: EngagementEvent[]): Array<{ userId: string; messageCount: number; engagementScore: number }> {
        const userCounts = new Map<string, number>();
        
        messageEvents
            .filter(e => e.chatId === chatId)
            .forEach(event => {
                userCounts.set(event.userId, (userCounts.get(event.userId) || 0) + 1);
            });
        
        return Array.from(userCounts.entries())
            .map(([userId, count]) => ({
                userId,
                messageCount: count,
                engagementScore: count * 10 // Simple score calculation
            }))
            .sort((a, b) => b.messageCount - a.messageCount)
            .slice(0, 10);
    }

    private generateMessageTimeline(messageEvents: EngagementEvent[]): Array<{ date: string; messageCount: number }> {
        const dailyCount = new Map<string, number>();
        
        messageEvents.forEach(event => {
            const date = new Date(event.timestamp).toISOString().split('T')[0];
            dailyCount.set(date, (dailyCount.get(date) || 0) + 1);
        });
        
        return Array.from(dailyCount.entries())
            .map(([date, count]) => ({ date, messageCount: count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    private calculateDailyEngagement(events: EngagementEvent[], days: number): Array<{ date: string; engagementScore: number; activeUsers: number; messages: number }> {
        const dailyData = new Map<string, { engagementScore: number; activeUsers: number; messages: number }>();
        
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayEvents = events.filter(e => {
                const eventDate = new Date(e.timestamp).toISOString().split('T')[0];
                return eventDate === dateStr;
            });
            
            const messages = dayEvents.filter(e => e.type === 'message_sent').length;
            const activeUsers = new Set(dayEvents.map(e => e.userId)).size;
            const engagementScore = this.calculateOverallEngagementScore(dayEvents);
            
            dailyData.set(dateStr, { engagementScore, activeUsers, messages });
        }
        
        return Array.from(dailyData.entries())
            .map(([date, data]) => ({ date, ...data }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    private calculateWeeklyComparison(events: EngagementEvent[]): { currentWeek: number; previousWeek: number; growth: number } {
        const now = Date.now();
        const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = now - (14 * 24 * 60 * 60 * 1000);
        
        const currentWeekEvents = events.filter(e => e.timestamp >= weekAgo);
        const previousWeekEvents = events.filter(e => e.timestamp >= twoWeeksAgo && e.timestamp < weekAgo);
        
        const currentWeekScore = this.calculateOverallEngagementScore(currentWeekEvents);
        const previousWeekScore = this.calculateOverallEngagementScore(previousWeekEvents);
        
        const growth = previousWeekScore > 0 ? 
            ((currentWeekScore - previousWeekScore) / previousWeekScore) * 100 : 0;
        
        return {
            currentWeek: currentWeekScore,
            previousWeek: previousWeekScore,
            growth
        };
    }

    private generateEngagementPredictions(dailyEngagement: Array<{ date: string; engagementScore: number }>): { nextWeekEngagement: number; confidence: number } {
        if (dailyEngagement.length < 7) {
            return { nextWeekEngagement: 0, confidence: 0 };
        }
        
        // Simple linear regression for prediction
        const recentData = dailyEngagement.slice(-7);
        const averageEngagement = recentData.reduce((sum, day) => sum + day.engagementScore, 0) / recentData.length;
        
        return {
            nextWeekEngagement: averageEngagement * 7, // Predict next week's total
            confidence: Math.min(0.8, recentData.length / 30) // Confidence based on data amount
        };
    }

    private generateCacheKey(filter?: AnalyticsFilter): string {
        return JSON.stringify(filter || {});
    }

    private isCacheValid(cacheKey: string): boolean {
        return this.cache.has(cacheKey);
    }

    private invalidateAnalyticsCache(): void {
        this.analyticsCache.clear();
    }
}
