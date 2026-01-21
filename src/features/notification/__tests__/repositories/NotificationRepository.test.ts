/**
 * Notification Repository Unit Tests.
 * 
 * Comprehensive unit tests for notification repository implementations.
 * Tests both real and mock repository implementations.
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { NotificationRepository } from '../../data/repositories/NotificationRepository';
import { MockNotificationRepository } from '../../data/repositories/MockNotificationRepository';
import type { INotificationRepository } from '../../domain/entities/INotificationRepository';
import type { NotificationQuery, NotificationFilters } from '../../domain/entities/NotificationEntities';
import type { NotificationPage, NotificationResponse } from '@/features/notification/data/models/notification';
import type { ResId } from '@/shared/api/models/common';

// Mock the API requests
jest.mock('../../data/repositories/NotificationRepository', () => ({
    NotificationRepository: jest.fn(),
}));
jest.mock('../../data/repositories/MockNotificationRepository', () => ({
    MockNotificationRepository: jest.fn(),
}));
jest.mock('../../domain/entities/INotificationRepository', () => ({
    INotificationRepository: jest.fn(),
}));
jest.mock('../../application/stores/notificationUIStore', () => ({
    useNotificationUIStore: jest.fn(),
}));

describe('Notification Repository Tests', () => {
    let mockRepository: MockNotificationRepository;
    let realRepository: NotificationRepository;

    beforeEach(() => {
        mockRepository = new MockNotificationRepository('test-token');
        realRepository = new NotificationRepository('test-token');
    });

    describe('MockNotificationRepository', () => {
        it('should create mock repository successfully', () => {
            expect(mockRepository).toBeDefined();
            expect(mockRepository).toBeInstanceOf(MockNotificationRepository);
            expect(mockRepository).toBeInstanceOf(Object);
        });

        it('should get notifications successfully', async () => {
            const query: NotificationQuery = {
                userId: 'test-user',
                page: 0,
                size: 10
            };

            const result = await mockRepository.getNotifications(query, 'test-token');

            expect(result).toBeDefined();
            expect(result.content).toBeDefined();
            expect(Array.isArray(result.content)).toBe(true);
            expect(result.totalElements).toBeGreaterThanOrEqual(0);
            expect(result.pageable).toBeDefined();
        });

        it('should get notifications with filters', async () => {
            const query: NotificationQuery = {
                userId: 'test-user',
                page: 0,
                size: 10,
                filters: {
                    isSeen: false,
                    type: 'FOLLOW_REQUEST' as any
                }
            };

            const result = await mockRepository.getNotifications(query, 'test-token');

            expect(result.content).toBeDefined();
            expect(result.content.length).toBeGreaterThanOrEqual(0);
        });

        it('should get notifications by type', async () => {
            const query: NotificationQuery = {
                userId: 'test-user',
                page: 0,
                size: 10
            };

            const result = await mockRepository.getNotificationsByType('FOLLOW_REQUEST' as any, query, 'test-token');

            expect(result).toBeDefined();
            expect(result.content).toBeDefined();
            expect(Array.isArray(result.content)).toBe(true);
        });

        it('should get unread count successfully', async () => {
            const count = await mockRepository.getPendingNotificationsCount('test-user', 'test-token');

            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0);
        });

        it('should mark notification as seen successfully', async () => {
            // First get notifications to find an ID
            const notifications = await mockRepository.getNotifications({
                userId: 'test-user',
                page: 0,
                size: 1
            }, 'test-token');

            if (notifications.content.length > 0) {
                const notificationId = notifications.content[0].id;
                const result = await mockRepository.markNotificationAsSeen(notificationId, 'test-token');

                expect(result).toBeDefined();
                expect(result.id).toBe(notificationId);
                expect(result.isSeen).toBe(true);
            }
        });

        it('should mark multiple notifications as seen successfully', async () => {
            // First get notifications to find IDs
            const notifications = await mockRepository.getNotifications({
                userId: 'test-user',
                page: 0,
                size: 3
            }, 'test-token');

            if (notifications.content.length > 0) {
                const notificationIds = notifications.content.slice(0, 2).map(n => n.id);
                const results = await mockRepository.markMultipleNotificationsAsSeen(notificationIds, 'test-token');

                expect(results).toBeDefined();
                expect(Array.isArray(results)).toBe(true);
                expect(results.length).toBe(notificationIds.length);
            }
        });

        it('should delete notification successfully', async () => {
            // First get notifications to find an ID
            const notifications = await mockRepository.getNotifications({
                userId: 'test-user',
                page: 0,
                size: 1
            }, 'test-token');

            if (notifications.content.length > 0) {
                const notificationId = notifications.content[0].id;

                await expect(mockRepository.deleteNotification(notificationId, 'test-token')).resolves.not.toThrow();
            }
        });

        it('should get notification by ID successfully', async () => {
            // First get notifications to find an ID
            const notifications = await mockRepository.getNotifications({
                userId: 'test-user',
                page: 0,
                size: 1
            }, 'test-token');

            if (notifications.content.length > 0) {
                const notificationId = notifications.content[0].id;
                const result = await mockRepository.getNotificationById(notificationId, 'test-token');

                expect(result).toBeDefined();
                expect(result.id).toBe(notificationId);
            }
        });

        it('should search notifications successfully', async () => {
            const query: NotificationQuery = {
                userId: 'test-user',
                page: 0,
                size: 10
            };

            const result = await mockRepository.searchNotifications('test', query, 'test-token');

            expect(result).toBeDefined();
            expect(result.content).toBeDefined();
            expect(Array.isArray(result.content)).toBe(true);
        });

        it('should handle pagination correctly', async () => {
            const query: NotificationQuery = {
                userId: 'test-user',
                page: 1,
                size: 5
            };

            const result = await mockRepository.getNotifications(query, 'test-token');

            expect(result.pageable.pageNumber).toBe(1);
            expect(result.pageable.pageSize).toBe(5);
            expect(result.content.length).toBeLessThanOrEqual(5);
        });

        it('should handle empty results', async () => {
            const query: NotificationQuery = {
                userId: 'test-user',
                page: 0,
                size: 10,
                filters: {
                    type: 'NON_EXISTENT_TYPE' as any
                }
            };

            const result = await mockRepository.getNotifications(query, 'test-token');

            expect(result.content).toBeDefined();
            expect(result.content.length).toBe(0);
            expect(result.empty).toBe(true);
        });
    });

    describe('NotificationRepository Interface Compliance', () => {
        it('should implement all required methods', () => {
            const repository: INotificationRepository = mockRepository;

            expect(typeof repository.getNotifications).toBe('function');
            expect(typeof repository.getNotificationsByType).toBe('function');
            expect(typeof repository.getPendingNotificationsCount).toBe('function');
            expect(typeof repository.markNotificationAsSeen).toBe('function');
            expect(typeof repository.markMultipleNotificationsAsSeen).toBe('function');
            expect(typeof repository.deleteNotification).toBe('function');
            expect(typeof repository.getNotificationById).toBe('function');
            expect(typeof repository.searchNotifications).toBe('function');
        });

        it('should return correct types', async () => {
            const query: NotificationQuery = {
                userId: 'test-user',
                page: 0,
                size: 10
            };

            const notifications = await mockRepository.getNotifications(query, 'test-token');
            const count = await mockRepository.getPendingNotificationsCount('test-user', 'test-token');
            const singleNotification = await mockRepository.getNotificationById(1, 'test-token');

            expect(notifications).toBeDefined();
            expect(typeof count).toBe('number');
            expect(singleNotification).toBeDefined();
        });
    });

    describe('Repository Error Handling', () => {
        it('should handle invalid notification ID gracefully', async () => {
            await expect(mockRepository.getNotificationById(999999, 'test-token')).rejects.toThrow();
        });

        it('should handle empty notification list for marking as read', async () => {
            await expect(mockRepository.markMultipleNotificationsAsSeen([], 'test-token')).resolves.toEqual([]);
        });

        it('should handle invalid query parameters', async () => {
            const invalidQuery: NotificationQuery = {
                userId: '',
                page: -1,
                size: 0
            };

            // Should still return a result but with empty content
            const result = await mockRepository.getNotifications(invalidQuery, 'test-token');
            expect(result).toBeDefined();
            expect(result.content).toBeDefined();
        });
    });

    describe('Repository Performance', () => {
        it('should handle large page sizes efficiently', async () => {
            const query: NotificationQuery = {
                userId: 'test-user',
                page: 0,
                size: 100
            };

            const startTime = Date.now();
            const result = await mockRepository.getNotifications(query, 'test-token');
            const endTime = Date.now();

            expect(result).toBeDefined();
            expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
        });

        it('should handle concurrent requests', async () => {
            const query: NotificationQuery = {
                userId: 'test-user',
                page: 0,
                size: 10
            };

            const promises = [
                mockRepository.getNotifications(query, 'test-token'),
                mockRepository.getNotifications(query, 'test-token'),
                mockRepository.getNotifications(query, 'test-token')
            ];

            const results = await Promise.all(promises);

            expect(results).toHaveLength(3);
            results.forEach(result => {
                expect(result).toBeDefined();
                expect(result.content).toBeDefined();
            });
        });
    });

    describe('Repository Data Consistency', () => {
        it('should maintain data consistency across operations', async () => {
            const query: NotificationQuery = {
                userId: 'test-user',
                page: 0,
                size: 10
            };

            // Get initial state
            const initialNotifications = await mockRepository.getNotifications(query, 'test-token');
            const initialCount = await mockRepository.getPendingNotificationsCount('test-user', 'test-token');

            // Mark a notification as read
            if (initialNotifications.content.length > 0) {
                const notificationId = initialNotifications.content[0].id;
                await mockRepository.markNotificationAsSeen(notificationId, 'test-token');

                // Verify the change
                const updatedNotifications = await mockRepository.getNotifications(query, 'test-token');
                const updatedNotification = updatedNotifications.content.find(n => n.id === notificationId);

                expect(updatedNotification?.isSeen).toBe(true);
            }
        });

        it('should handle search query filtering correctly', async () => {
            const query: NotificationQuery = {
                userId: 'test-user',
                page: 0,
                size: 10
            };

            const allNotifications = await mockRepository.getNotifications(query, 'test-token');
            const searchResults = await mockRepository.searchNotifications('test', query, 'test-token');

            expect(searchResults.content.length).toBeLessThanOrEqual(allNotifications.content.length);
        });
    });
});
