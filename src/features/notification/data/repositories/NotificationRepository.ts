import type {AxiosInstance} from 'axios';
import {Inject, Injectable} from '@/core/di';
import {TYPES} from '@/core/di/types';
import {NOTIFICATION_PATH} from "@/core/shared/apiPath";
import {ResId, JwtToken} from "@/shared/api/models/common";
import {NotificationPage, NotificationResponse, NotificationType} from "@/features/notification/data/models/notification";
import {ReactionType} from "@/features/feed/data/models/reaction";
import { 
    INotificationRepository, 
    NotificationQuery, 
    NotificationFilters,
    NotificationSettings,
    NotificationPreferences,
    PushNotificationStatus,
    PushSubscription,
    DeviceToken,
    DeviceInfo,
    QuietHours,
    QuietHoursException
} from "@/features/notification/domain/entities/INotificationRepository";
import { IAuthService } from '@/core/auth/interfaces/authInterfaces';

/**
 * Notification Repository - Handles notification-related API operations
 * Enhanced with enterprise-grade features for push notifications and real-time updates
 */
@Injectable()
export class NotificationRepository implements INotificationRepository {
    constructor(
        @Inject(TYPES.API_CLIENT) private apiClient: AxiosInstance,
        @Inject(TYPES.AUTH_SERVICE) private authService: IAuthService
    ) {}

    /**
     * Helper method to get auth token from centralized service
     */
    private async getAuthToken(): Promise<string> {
        try {
            const session = await this.authService.getCurrentSession();
            if (!session || !session.token.accessToken) {
                throw new Error('No valid authentication session found');
            }
            return session.token.accessToken;
        } catch (error) {
            console.error('Error getting auth token from centralized service:', error);
            throw new Error('Authentication failed');
        }
    }

    // Core notification operations
    async getNotifications(query: NotificationQuery, token?: JwtToken): Promise<NotificationPage> {
        // Use centralized auth if no token provided, otherwise use provided token for backward compatibility
        const authToken = token || await this.getAuthToken();
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + this.buildQueryParams(query), {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        return data;
    }

    async getNotificationsByType(type: NotificationType, query: NotificationQuery, token?: JwtToken): Promise<NotificationPage> {
        const authToken = token || await this.getAuthToken();
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + `/type/${type}` + this.buildQueryParams(query), {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        return data;
    }

    async getNotificationById(notificationId: ResId, token?: JwtToken): Promise<NotificationResponse> {
        const authToken = token || await this.getAuthToken();
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + `/${notificationId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        return data;
    }

    async getPendingNotificationsCount(userId: string, token?: JwtToken): Promise<number> {
        const authToken = token || await this.getAuthToken();
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + "/count-pending", {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        return data;
    }

    async getUnreadNotificationsCount(userId: string, token?: JwtToken): Promise<number> {
        const authToken = token || await this.getAuthToken();
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + "/count-unread", {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        return data;
    }

    async markNotificationAsSeen(notificationId: ResId, token?: JwtToken): Promise<NotificationResponse> {
        const { data } = await this.apiClient.post(NOTIFICATION_PATH + `/seen/${notificationId}`, {}, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async markMultipleNotificationsAsSeen(notificationIds: ResId[], token?: JwtToken): Promise<NotificationResponse[]> {
        const { data } = await this.apiClient.post(NOTIFICATION_PATH + "/seen-batch", { notificationIds }, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async deleteNotification(notificationId: ResId, token?: JwtToken): Promise<void> {
        await this.apiClient.delete(NOTIFICATION_PATH + `/${notificationId}`, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
    }

    async deleteMultipleNotifications(notificationIds: ResId[], token?: JwtToken): Promise<void> {
        await this.apiClient.delete(NOTIFICATION_PATH + "/batch", {
            data: { notificationIds },
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
    }

    async archiveNotification(notificationId: ResId, token?: JwtToken): Promise<NotificationResponse> {
        const { data } = await this.apiClient.post(NOTIFICATION_PATH + `/archive/${notificationId}`, {}, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async searchNotifications(searchQuery: string, query: NotificationQuery, token?: JwtToken): Promise<NotificationPage> {
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + `/search?q=${encodeURIComponent(searchQuery)}` + this.buildQueryParams(query), {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async getFilteredNotifications(userId: string, filters: NotificationFilters, token?: JwtToken): Promise<NotificationPage> {
        const { data } = await this.apiClient.post(NOTIFICATION_PATH + `/filter/${userId}`, filters, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    // Notification settings and preferences
    async getNotificationSettings(userId: string, token?: JwtToken): Promise<NotificationSettings> {
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + `/settings/${userId}`, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>, token?: JwtToken): Promise<NotificationSettings> {
        const { data } = await this.apiClient.put(NOTIFICATION_PATH + `/settings/${userId}`, settings, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async getNotificationPreferences(userId: string, token?: JwtToken): Promise<NotificationPreferences> {
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + `/preferences/${userId}`, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreferences>, token?: JwtToken): Promise<NotificationPreferences> {
        const { data } = await this.apiClient.put(NOTIFICATION_PATH + `/preferences/${userId}`, preferences, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    // Push notification operations
    async getPushNotificationStatus(userId: string, token?: JwtToken): Promise<PushNotificationStatus> {
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + `/push/status/${userId}`, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async updatePushNotificationStatus(userId: string, status: Partial<PushNotificationStatus>, token?: JwtToken): Promise<PushNotificationStatus> {
        const { data } = await this.apiClient.put(NOTIFICATION_PATH + `/push/status/${userId}`, status, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async getPushSubscription(userId: string, token?: JwtToken): Promise<PushSubscription> {
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + `/push/subscription/${userId}`, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async updatePushSubscription(userId: string, subscription: PushSubscription, token?: JwtToken): Promise<PushSubscription> {
        const { data } = await this.apiClient.put(NOTIFICATION_PATH + `/push/subscription/${userId}`, subscription, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async removePushSubscription(userId: string, token?: JwtToken): Promise<void> {
        await this.apiClient.delete(NOTIFICATION_PATH + `/push/subscription/${userId}`, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
    }

    // Device management
    async getDeviceTokens(userId: string, token?: JwtToken): Promise<DeviceToken[]> {
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + `/devices/${userId}`, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async registerDeviceToken(userId: string, deviceToken: Omit<DeviceToken, 'id' | 'createdAt' | 'lastUsedAt'>, token?: JwtToken): Promise<DeviceToken> {
        const { data } = await this.apiClient.post(NOTIFICATION_PATH + `/devices/${userId}`, deviceToken, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async removeDeviceToken(userId: string, tokenId: string, token?: JwtToken): Promise<void> {
        await this.apiClient.delete(NOTIFICATION_PATH + `/devices/${userId}/${tokenId}`, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
    }

    // Quiet hours and do not disturb
    async getQuietHours(userId: string, token?: JwtToken): Promise<QuietHours> {
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + `/quiet-hours/${userId}`, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    async updateQuietHours(userId: string, quietHours: QuietHours, token?: JwtToken): Promise<QuietHours> {
        const { data } = await this.apiClient.put(NOTIFICATION_PATH + `/quiet-hours/${userId}`, quietHours, {
            headers: { Authorization: `Bearer ${token || await this.getAuthToken()}` }
        });
        return data;
    }

    // Helper method to build query parameters
    private buildQueryParams(query: NotificationQuery): string {
        const params = new URLSearchParams();
        
        if (query.userId) params.append('userId', query.userId);
        if (query.type) params.append('type', query.type);
        if (query.page !== undefined) params.append('page', query.page.toString());
        if (query.size !== undefined) params.append('size', query.size.toString());
        if (query.isSeen !== undefined) params.append('isSeen', query.isSeen.toString());
        if (query.priority) params.append('priority', query.priority);
        if (query.categories) params.append('categories', query.categories.join(','));
        
        const paramString = params.toString();
        return paramString ? `?${paramString}` : '';
    }
}
