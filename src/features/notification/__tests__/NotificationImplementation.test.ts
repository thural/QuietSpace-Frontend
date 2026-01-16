/**
 * Simple Notification Test.
 * 
 * Basic test to verify the notification implementation works.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { MockNotificationRepository } from '../data/repositories/MockNotificationRepository';
import type { INotificationRepository } from '../domain/entities/INotificationRepository';

describe('Notification Implementation Test', () => {
    let notificationRepository: INotificationRepository;

    beforeEach(() => {
        notificationRepository = new MockNotificationRepository('test-token');
    });

    it('should create mock repository successfully', () => {
        expect(notificationRepository).toBeDefined();
        expect(notificationRepository).toBeInstanceOf(MockNotificationRepository);
    });

    it('should get notifications successfully', async () => {
        const result = await notificationRepository.getNotifications({
            userId: 'test-user',
            page: 0,
            size: 9
        }, 'test-token');

        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(Array.isArray(result.content)).toBe(true);
        expect(result.totalElements).toBeGreaterThanOrEqual(0);
    });

    it('should get unread count successfully', async () => {
        const count = await notificationRepository.getPendingNotificationsCount('test-user', 'test-token');
        
        expect(typeof count).toBe('number');
        expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should mark notification as seen successfully', async () => {
        // First get notifications to find an ID
        const notifications = await notificationRepository.getNotifications({
            userId: 'test-user',
            page: 0,
            size: 1
        }, 'test-token');

        if (notifications.content.length > 0) {
            const notificationId = notifications.content[0].id;
            const result = await notificationRepository.markNotificationAsSeen(notificationId, 'test-token');
            
            expect(result).toBeDefined();
            expect(result.id).toBe(notificationId);
            expect(result.isSeen).toBe(true);
        }
    });
});
