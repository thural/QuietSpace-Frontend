/**
 * Mock Notification Repository.
 * 
 * Mock implementation of notification repository for testing and UI development.
 * Provides in-memory data storage and simulated API responses.
 */

import type { NotificationPage, NotificationResponse, NotificationType } from "../../../../api/schemas/inferred/notification";
import type { ResId, JwtToken } from "../../../../api/schemas/inferred/common";
import type { INotificationRepository, NotificationQuery, NotificationFilters } from "../../domain/entities/INotificationRepository";
import type { ReactionType } from "../../../../api/schemas/inferred/reaction";

/**
 * Mock Notification Repository implementation.
 */
export class MockNotificationRepository implements INotificationRepository {
    private token: JwtToken | null;
    private mockNotifications: Map<string, NotificationResponse[]> = new Map();
    private mockData: NotificationResponse[] = [];

    constructor(token: JwtToken | null = null) {
        this.token = token;
        this.initializeMockData();
    }

    /**
     * Initialize mock notification data.
     */
    private initializeMockData(): void {
        const mockNotifications: NotificationResponse[] = [
            {
                id: 1,
                version: 1,
                createDate: '2023-01-01T10:00:00Z',
                updateDate: '2023-01-01T10:00:00Z',
                actorId: 101,
                contentId: 1001,
                isSeen: false,
                type: 'FOLLOW_REQUEST'
            },
            {
                id: 2,
                version: 1,
                createDate: '2023-01-01T11:00:00Z',
                updateDate: '2023-01-01T11:00:00Z',
                actorId: 102,
                contentId: 1002,
                isSeen: true,
                type: 'LIKE'
            },
            {
                id: 3,
                version: 1,
                createDate: '2023-01-01T12:00:00Z',
                updateDate: '2023-01-01T12:00:00Z',
                actorId: 103,
                contentId: 1003,
                isSeen: false,
                type: 'COMMENT'
            },
            {
                id: 4,
                version: 1,
                createDate: '2023-01-01T13:00:00Z',
                updateDate: '2023-01-01T13:00:00Z',
                actorId: 104,
                contentId: 1004,
                isSeen: true,
                type: 'MENTION'
            },
            {
                id: 5,
                version: 1,
                createDate: '2023-01-01T14:00:00Z',
                updateDate: '2023-01-01T14:00:00Z',
                actorId: 105,
                contentId: 1005,
                isSeen: false,
                type: 'REPOST'
            }
        ];

        this.mockData = mockNotifications;
        this.mockNotifications.set('default', mockNotifications);
    }

    /**
     * Get notifications for a user with pagination and filtering.
     */
    async getNotifications(query: NotificationQuery, token: JwtToken): Promise<NotificationPage> {
        try {
            console.log('MockNotificationRepository: Getting notifications for user:', query.userId);
            
            let filteredNotifications = [...this.mockData];
            
            // Apply filters
            if (query.isSeen !== undefined) {
                filteredNotifications = filteredNotifications.filter(n => n.isSeen === query.isSeen);
            }
            
            if (query.type) {
                filteredNotifications = filteredNotifications.filter(n => n.type === query.type);
            }
            
            // Apply pagination
            const page = query.page || 0;
            const size = query.size || 9;
            const startIndex = page * size;
            const endIndex = startIndex + size;
            const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
            
            const response: NotificationPage = {
                content: paginatedNotifications,
                pageable: {
                    pageNumber: page,
                    pageSize: size,
                    sort: { sorted: false, unsorted: true, empty: false },
                    offset: startIndex,
                    paged: true,
                    unpaged: false
                },
                totalPages: Math.ceil(filteredNotifications.length / size),
                totalElements: filteredNotifications.length,
                last: endIndex >= filteredNotifications.length,
                first: page === 0,
                size: size,
                number: page,
                sort: { sorted: false, unsorted: true, empty: false },
                numberOfElements: paginatedNotifications.length,
                empty: paginatedNotifications.length === 0
            };
            
            console.log('MockNotificationRepository: Notifications retrieved successfully');
            return response;
        } catch (error) {
            console.error('MockNotificationRepository: Error getting notifications:', error);
            throw error;
        }
    }

    /**
     * Get notifications by specific type.
     */
    async getNotificationsByType(type: NotificationType, query: NotificationQuery, token: JwtToken): Promise<NotificationPage> {
        try {
            console.log('MockNotificationRepository: Getting notifications by type:', type);
            
            const filteredNotifications = this.mockData.filter(n => n.type === type);
            
            // Apply pagination
            const page = query.page || 0;
            const size = query.size || 9;
            const startIndex = page * size;
            const endIndex = startIndex + size;
            const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
            
            const response: NotificationPage = {
                content: paginatedNotifications,
                pageable: {
                    pageNumber: page,
                    pageSize: size,
                    sort: { sorted: false, unsorted: true, empty: false },
                    offset: startIndex,
                    paged: true,
                    unpaged: false
                },
                totalPages: Math.ceil(filteredNotifications.length / size),
                totalElements: filteredNotifications.length,
                last: endIndex >= filteredNotifications.length,
                first: page === 0,
                size: size,
                number: page,
                sort: { sorted: false, unsorted: true, empty: false },
                numberOfElements: paginatedNotifications.length,
                empty: paginatedNotifications.length === 0
            };
            
            console.log('MockNotificationRepository: Notifications by type retrieved successfully');
            return response;
        } catch (error) {
            console.error('MockNotificationRepository: Error getting notifications by type:', error);
            throw error;
        }
    }

    /**
     * Get count of pending/unseen notifications.
     */
    async getPendingNotificationsCount(userId: string, token: JwtToken): Promise<number> {
        try {
            console.log('MockNotificationRepository: Getting pending notifications count for user:', userId);
            
            const count = this.mockData.filter(n => !n.isSeen).length;
            
            console.log('MockNotificationRepository: Pending notifications count retrieved successfully:', count);
            return count;
        } catch (error) {
            console.error('MockNotificationRepository: Error getting pending notifications count:', error);
            throw error;
        }
    }

    /**
     * Mark a notification as seen.
     */
    async markNotificationAsSeen(notificationId: ResId, token: JwtToken): Promise<NotificationResponse> {
        try {
            console.log('MockNotificationRepository: Marking notification as seen:', notificationId);
            
            const notification = this.mockData.find(n => n.id === notificationId);
            if (notification) {
                notification.isSeen = true;
                notification.updateDate = new Date().toISOString();
            }
            
            if (!notification) {
                throw new Error('Notification not found');
            }
            
            console.log('MockNotificationRepository: Notification marked as seen successfully');
            return notification;
        } catch (error) {
            console.error('MockNotificationRepository: Error marking notification as seen:', error);
            throw error;
        }
    }

    /**
     * Mark multiple notifications as seen.
     */
    async markMultipleNotificationsAsSeen(notificationIds: ResId[], token: JwtToken): Promise<NotificationResponse[]> {
        try {
            console.log('MockNotificationRepository: Marking multiple notifications as seen:', notificationIds.length);
            
            const results: NotificationResponse[] = [];
            for (const notificationId of notificationIds) {
                const result = await this.markNotificationAsSeen(notificationId, token);
                results.push(result);
            }
            
            console.log('MockNotificationRepository: Multiple notifications marked as seen successfully');
            return results;
        } catch (error) {
            console.error('MockNotificationRepository: Error marking multiple notifications as seen:', error);
            throw error;
        }
    }

    /**
     * Delete a notification.
     */
    async deleteNotification(notificationId: ResId, token: JwtToken): Promise<void> {
        try {
            console.log('MockNotificationRepository: Deleting notification:', notificationId);
            
            const index = this.mockData.findIndex(n => n.id === notificationId);
            if (index !== -1) {
                this.mockData.splice(index, 1);
            }
            
            console.log('MockNotificationRepository: Notification deleted successfully');
        } catch (error) {
            console.error('MockNotificationRepository: Error deleting notification:', error);
            throw error;
        }
    }

    /**
     * Get notification details by ID.
     */
    async getNotificationById(notificationId: ResId, token: JwtToken): Promise<NotificationResponse> {
        try {
            console.log('MockNotificationRepository: Getting notification by ID:', notificationId);
            
            const notification = this.mockData.find(n => n.id === notificationId);
            if (!notification) {
                throw new Error('Notification not found');
            }
            
            console.log('MockNotificationRepository: Notification details retrieved successfully');
            return notification;
        } catch (error) {
            console.error('MockNotificationRepository: Error getting notification by ID:', error);
            throw error;
        }
    }

    /**
     * Search notifications by content or actor.
     */
    async searchNotifications(searchQuery: string, query: NotificationQuery, token: JwtToken): Promise<NotificationPage> {
        try {
            console.log('MockNotificationRepository: Searching notifications with query:', searchQuery);
            
            let filteredNotifications = [...this.mockData];
            
            // Apply search filter
            if (searchQuery) {
                filteredNotifications = filteredNotifications.filter(notification => 
                    notification.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    notification.id.toString().includes(searchQuery)
                );
            }
            
            // Apply additional filters
            if (query.isSeen !== undefined) {
                filteredNotifications = filteredNotifications.filter(n => n.isSeen === query.isSeen);
            }
            
            // Apply pagination
            const page = query.page || 0;
            const size = query.size || 9;
            const startIndex = page * size;
            const endIndex = startIndex + size;
            const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
            
            const response: NotificationPage = {
                content: paginatedNotifications,
                pageable: {
                    pageNumber: page,
                    pageSize: size,
                    sort: { sorted: false, unsorted: true, empty: false },
                    offset: startIndex,
                    paged: true,
                    unpaged: false
                },
                totalPages: Math.ceil(filteredNotifications.length / size),
                totalElements: filteredNotifications.length,
                last: endIndex >= filteredNotifications.length,
                first: page === 0,
                size: size,
                number: page,
                sort: { sorted: false, unsorted: true, empty: false },
                numberOfElements: paginatedNotifications.length,
                empty: paginatedNotifications.length === 0
            };
            
            console.log('MockNotificationRepository: Notification search completed successfully');
            return response;
        } catch (error) {
            console.error('MockNotificationRepository: Error searching notifications:', error);
            throw error;
        }
    }
}
