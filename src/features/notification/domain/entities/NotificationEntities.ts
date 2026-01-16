/**
 * Notification Domain Entities.
 * 
 * Defines the core domain entities for notification functionality.
 * These are pure TypeScript interfaces with no external dependencies.
 */

import type { ResId } from "@/api/schemas/inferred/common";
import type { NotificationType, NotificationResponse } from "@/api/schemas/inferred/notification";

/**
 * Notification Query entity.
 */
export interface NotificationQuery {
    userId: string;
    type?: NotificationType;
    page?: number;
    size?: number;
    isSeen?: boolean;
    filters?: NotificationFilters;
}

/**
 * Notification Filters entity.
 */
export interface NotificationFilters {
    type?: NotificationType;
    isSeen?: boolean;
    dateRange?: {
        startDate?: string;
        endDate?: string;
    };
    searchQuery?: string;
}

/**
 * Notification Result entity.
 */
export interface NotificationResult {
    notifications: NotificationResponse[];
    totalCount: number;
    unreadCount: number;
    hasMore: boolean;
    nextPage?: number;
}

/**
 * Notification Message entity.
 */
export interface NotificationMessage {
    id: ResId;
    actorId: ResId;
    contentId: ResId;
    type: string;
    isSeen: boolean;
    createDate: string;
    updateDate: string;
    message?: string;
    metadata?: Record<string, any>;
}

/**
 * Notification Settings entity.
 */
export interface NotificationSettings {
    enableEmailNotifications: boolean;
    enablePushNotifications: boolean;
    enableInAppNotifications: boolean;
    notificationTypes: {
        [key in NotificationType]: boolean;
    };
    quietHours?: {
        enabled: boolean;
        startTime: string;
        endTime: string;
    };
}

/**
 * Notification Status entity.
 */
export interface NotificationStatus {
    total: number;
    unread: number;
    read: number;
    pending: number;
    lastUpdated: string;
}

/**
 * Notification Participant entity.
 */
export interface NotificationParticipant {
    id: ResId;
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastActive: string;
}

/**
 * Notification Typing Indicator entity.
 */
export interface NotificationTypingIndicator {
    userId: ResId;
    userName: string;
    isTyping: boolean;
    lastTyped: string;
}

/**
 * Notification Event entity.
 */
export interface NotificationEvent {
    id: ResId;
    type: NotificationType;
    actorId: ResId;
    recipientId: ResId;
    contentId: ResId;
    timestamp: string;
    data?: Record<string, any>;
}

/**
 * Notification Priority enum.
 */
export enum NotificationPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent'
}

/**
 * Notification Channel enum.
 */
export enum NotificationChannel {
    IN_APP = 'in_app',
    EMAIL = 'email',
    PUSH = 'push',
    SMS = 'sms'
}
