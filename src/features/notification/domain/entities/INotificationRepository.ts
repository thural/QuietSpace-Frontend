/**
 * Notification Repository Interface.
 * 
 * Defines the contract for notification data operations.
 * Follows the repository pattern for clean separation of concerns.
 * Enhanced with enterprise-grade features for push notifications and real-time updates.
 */

import type { NotificationPage, NotificationResponse, NotificationType } from '../../data/models/notification';
import type { ResId, JwtToken } from '../../../../shared/api/models/common';

/**
 * Notification Query interface.
 */
export interface NotificationQuery {
    userId?: string;
    type?: NotificationType;
    page?: number;
    size?: number;
    isSeen?: boolean;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    categories?: string[];
}

/**
 * Notification Filters interface.
 */
export interface NotificationFilters {
    type?: NotificationType;
    isSeen?: boolean;
    dateRange?: {
        startDate?: string;
        endDate?: string;
    };
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    categories?: string[];
    tags?: string[];
}

/**
 * Notification Settings interface.
 */
export interface NotificationSettings {
    enableEmailNotifications: boolean;
    enablePushNotifications: boolean;
    enableInAppNotifications: boolean;
    enableSmsNotifications: boolean;
    quietHours?: QuietHours;
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
    maxDailyNotifications?: number;
}

/**
 * Notification Preferences interface.
 */
export interface NotificationPreferences {
    [key in NotificationType]: {
        enabled: boolean;
        push: boolean;
        email: boolean;
        sms: boolean;
        inApp: boolean;
        priority: 'low' | 'medium' | 'high' | 'urgent';
    };
}

/**
 * Push Notification Status interface.
 */
export interface PushNotificationStatus {
    enabled: boolean;
    subscribed: boolean;
    lastSyncAt?: Date;
    deviceCount: number;
    activeDevices: number;
}

/**
 * Push Subscription interface.
 */
export interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    deviceInfo: DeviceInfo;
    createdAt: Date;
    isActive: boolean;
}

/**
 * Device Token interface.
 */
export interface DeviceToken {
    id: string;
    token: string;
    platform: 'ios' | 'android' | 'web';
    deviceInfo: DeviceInfo;
    createdAt: Date;
    lastUsedAt: Date;
    isActive: boolean;
}

/**
 * Device Info interface.
 */
export interface DeviceInfo {
    userAgent: string;
    platform: string;
    version: string;
    model?: string;
    appVersion: string;
}

/**
 * Quiet Hours interface.
 */
export interface QuietHours {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string;   // HH:mm format
    timezone: string;
    exceptions: QuietHoursException[];
}

/**
 * Quiet Hours Exception interface.
 */
export interface QuietHoursException {
    date: string; // YYYY-MM-DD format
    enabled: boolean;
    startTime?: string;
    endTime?: string;
}

/**
 * Notification Repository interface.
 * 
 * Defines the contract for all notification data operations.
 * This interface is implemented by both real and mock repositories.
 * Enhanced with enterprise-grade features for push notifications and real-time updates.
 */
export interface INotificationRepository {
    /**
     * Get notifications for a user with pagination and filtering.
     */
    getNotifications(query: NotificationQuery, token: JwtToken): Promise<NotificationPage>;

    /**
     * Get notifications by specific type.
     */
    getNotificationsByType(type: NotificationType, query: NotificationQuery, token: JwtToken): Promise<NotificationPage>;

    /**
     * Get count of pending/unseen notifications.
     */
    getPendingNotificationsCount(userId: string, token: JwtToken): Promise<number>;

    /**
     * Get count of unread notifications.
     */
    getUnreadNotificationsCount(userId: string, token: JwtToken): Promise<number>;

    /**
     * Mark a notification as seen.
     */
    markNotificationAsSeen(notificationId: ResId, token: JwtToken): Promise<NotificationResponse>;

    /**
     * Mark multiple notifications as seen.
     */
    markMultipleNotificationsAsSeen(notificationIds: ResId[], token: JwtToken): Promise<NotificationResponse[]>;

    /**
     * Delete a notification.
     */
    deleteNotification(notificationId: ResId, token: JwtToken): Promise<void>;

    /**
     * Delete multiple notifications.
     */
    deleteMultipleNotifications(notificationIds: ResId[], token: JwtToken): Promise<void>;

    /**
     * Archive a notification.
     */
    archiveNotification(notificationId: ResId, token: JwtToken): Promise<NotificationResponse>;

    /**
     * Get notification details by ID.
     */
    getNotificationById(notificationId: ResId, token: JwtToken): Promise<NotificationResponse>;

    /**
     * Search notifications by content or actor.
     */
    searchNotifications(searchQuery: string, query: NotificationQuery, token: JwtToken): Promise<NotificationPage>;

    /**
     * Get filtered notifications based on complex filters.
     */
    getFilteredNotifications(userId: string, filters: NotificationFilters, token: JwtToken): Promise<NotificationPage>;

    // Notification settings and preferences
    /**
     * Get notification settings for a user.
     */
    getNotificationSettings(userId: string, token: JwtToken): Promise<NotificationSettings>;

    /**
     * Update notification settings for a user.
     */
    updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>, token: JwtToken): Promise<NotificationSettings>;

    /**
     * Get notification preferences for a user.
     */
    getNotificationPreferences(userId: string, token: JwtToken): Promise<NotificationPreferences>;

    /**
     * Update notification preferences for a user.
     */
    updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreferences>, token: JwtToken): Promise<NotificationPreferences>;

    // Push notification operations
    /**
     * Get push notification status for a user.
     */
    getPushNotificationStatus(userId: string, token: JwtToken): Promise<PushNotificationStatus>;

    /**
     * Update push notification status for a user.
     */
    updatePushNotificationStatus(userId: string, status: Partial<PushNotificationStatus>, token: JwtToken): Promise<PushNotificationStatus>;

    /**
     * Get push subscription for a user.
     */
    getPushSubscription(userId: string, token: JwtToken): Promise<PushSubscription>;

    /**
     * Update push subscription for a user.
     */
    updatePushSubscription(userId: string, subscription: PushSubscription, token: JwtToken): Promise<PushSubscription>;

    /**
     * Remove push subscription for a user.
     */
    removePushSubscription(userId: string, token: JwtToken): Promise<void>;

    // Device management
    /**
     * Get device tokens for a user.
     */
    getDeviceTokens(userId: string, token: JwtToken): Promise<DeviceToken[]>;

    /**
     * Register a device token for a user.
     */
    registerDeviceToken(userId: string, deviceToken: Omit<DeviceToken, 'id' | 'createdAt' | 'lastUsedAt'>, token: JwtToken): Promise<DeviceToken>;

    /**
     * Remove a device token for a user.
     */
    removeDeviceToken(userId: string, tokenId: string, token: JwtToken): Promise<void>;

    // Quiet hours and do not disturb
    /**
     * Get quiet hours settings for a user.
     */
    getQuietHours(userId: string, token: JwtToken): Promise<QuietHours>;

    /**
     * Update quiet hours settings for a user.
     */
    updateQuietHours(userId: string, quietHours: QuietHours, token: JwtToken): Promise<QuietHours>;
}
