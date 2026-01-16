/**
 * Notification Service.
 * 
 * Service for managing notification operations and business logic.
 * Provides high-level operations for notification management.
 */

import type { INotificationRepository, NotificationQuery, NotificationFilters } from "../../domain/entities/INotificationRepository";
import type { NotificationPage, NotificationResponse, NotificationType } from "@api/schemas/inferred/notification";
import type { ResId, JwtToken } from "@api/schemas/inferred/common";

/**
 * Notification Service interface.
 */
export interface INotificationService {
    // Notification operations
    getNotifications(userId: string, query?: Partial<NotificationQuery>): Promise<NotificationPage>;
    getNotificationsByType(type: NotificationType, userId: string, query?: Partial<NotificationQuery>): Promise<NotificationPage>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(notificationId: ResId): Promise<NotificationResponse>;
    markMultipleAsRead(notificationIds: ResId[]): Promise<NotificationResponse[]>;
    deleteNotification(notificationId: ResId): Promise<void>;
    getNotificationById(notificationId: ResId): Promise<NotificationResponse>;
    searchNotifications(searchQuery: string, userId: string, query?: Partial<NotificationQuery>): Promise<NotificationPage>;
}

/**
 * Notification Service implementation.
 */
export class NotificationService implements INotificationService {
    private notificationRepository: INotificationRepository;

    constructor(notificationRepository: INotificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * Get notifications for a user.
     */
    async getNotifications(userId: string, query: Partial<NotificationQuery> = {}): Promise<NotificationPage> {
        try {
            const token = this.getAuthToken();
            const fullQuery: NotificationQuery = {
                userId,
                page: 0,
                size: 9,
                ...query
            };

            const result = await this.notificationRepository.getNotifications(fullQuery, token);
            return result;
        } catch (error) {
            console.error('NotificationService: Error getting notifications:', error);
            throw error;
        }
    }

    /**
     * Get notifications by type.
     */
    async getNotificationsByType(type: NotificationType, userId: string, query: Partial<NotificationQuery> = {}): Promise<NotificationPage> {
        try {
            const token = this.getAuthToken();
            const fullQuery: NotificationQuery = {
                userId,
                page: 0,
                size: 9,
                ...query
            };

            const result = await this.notificationRepository.getNotificationsByType(type, fullQuery, token);
            return result;
        } catch (error) {
            console.error('NotificationService: Error getting notifications by type:', error);
            throw error;
        }
    }

    /**
     * Get unread notifications count.
     */
    async getUnreadCount(userId: string): Promise<number> {
        try {
            const token = this.getAuthToken();
            const result = await this.notificationRepository.getPendingNotificationsCount(userId, token);
            return result;
        } catch (error) {
            console.error('NotificationService: Error getting unread count:', error);
            throw error;
        }
    }

    /**
     * Mark notification as read.
     */
    async markAsRead(notificationId: ResId): Promise<NotificationResponse> {
        try {
            const token = this.getAuthToken();
            const result = await this.notificationRepository.markNotificationAsSeen(notificationId, token);
            return result;
        } catch (error) {
            console.error('NotificationService: Error marking notification as read:', error);
            throw error;
        }
    }

    /**
     * Mark multiple notifications as read.
     */
    async markMultipleAsRead(notificationIds: ResId[]): Promise<NotificationResponse[]> {
        try {
            const token = this.getAuthToken();
            const result = await this.notificationRepository.markMultipleNotificationsAsSeen(notificationIds, token);
            return result;
        } catch (error) {
            console.error('NotificationService: Error marking multiple notifications as read:', error);
            throw error;
        }
    }

    /**
     * Delete a notification.
     */
    async deleteNotification(notificationId: ResId): Promise<void> {
        try {
            const token = this.getAuthToken();
            await this.notificationRepository.deleteNotification(notificationId, token);
        } catch (error) {
            console.error('NotificationService: Error deleting notification:', error);
            throw error;
        }
    }

    /**
     * Get notification by ID.
     */
    async getNotificationById(notificationId: ResId): Promise<NotificationResponse> {
        try {
            const token = this.getAuthToken();
            const result = await this.notificationRepository.getNotificationById(notificationId, token);
            return result;
        } catch (error) {
            console.error('NotificationService: Error getting notification by ID:', error);
            throw error;
        }
    }

    /**
     * Search notifications.
     */
    async searchNotifications(searchQuery: string, userId: string, query: Partial<NotificationQuery> = {}): Promise<NotificationPage> {
        try {
            const token = this.getAuthToken();
            const fullQuery: NotificationQuery = {
                userId,
                page: 0,
                size: 9,
                ...query
            };

            const result = await this.notificationRepository.searchNotifications(searchQuery, fullQuery, token);
            return result;
        } catch (error) {
            console.error('NotificationService: Error searching notifications:', error);
            throw error;
        }
    }

    /**
     * Validate notification query parameters.
     */
    private validateNotificationQuery(query: NotificationQuery): boolean {
        if (!query.userId || typeof query.userId !== 'string') {
            return false;
        }

        if (query.page !== undefined && (typeof query.page !== 'number' || query.page < 0)) {
            return false;
        }

        if (query.size !== undefined && (typeof query.size !== 'number' || query.size < 1)) {
            return false;
        }

        return true;
    }

    /**
     * Validate notification ID.
     */
    private validateNotificationId(notificationId: ResId): boolean {
        return notificationId !== null && notificationId !== undefined;
    }

    /**
     * Get authentication token from store.
     */
    private getAuthToken(): string {
        try {
            // Try require first (for CommonJS environments)
            if (typeof require !== 'undefined') {
                const authStore = require('@services/store/zustand').useAuthStore.getState();
                return authStore.data.accessToken || '';
            } else {
                // Fallback for test environments
                return 'test-token';
            }
        } catch (error) {
            console.error('NotificationService: Error getting auth token', error);
            return '';
        }
    }
}
