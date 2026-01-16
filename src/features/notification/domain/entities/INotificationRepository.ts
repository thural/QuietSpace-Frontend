/**
 * Notification Repository Interface.
 * 
 * Defines the contract for notification data operations.
 * Follows the repository pattern for clean separation of concerns.
 */

import type { NotificationPage, NotificationResponse, NotificationType } from "@api/schemas/inferred/notification";
import type { ResId, JwtToken } from "@api/schemas/inferred/common";

/**
 * Notification Query interface.
 */
export interface NotificationQuery {
    userId?: string;
    type?: NotificationType;
    page?: number;
    size?: number;
    isSeen?: boolean;
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
}

/**
 * Notification Repository interface.
 * 
 * Defines the contract for all notification data operations.
 * This interface is implemented by both real and mock repositories.
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
     * Get notification details by ID.
     */
    getNotificationById(notificationId: ResId, token: JwtToken): Promise<NotificationResponse>;

    /**
     * Search notifications by content or actor.
     */
    searchNotifications(searchQuery: string, query: NotificationQuery, token: JwtToken): Promise<NotificationPage>;
}
