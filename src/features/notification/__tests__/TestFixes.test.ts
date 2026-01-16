/**
 * Simple Test to Verify Fixes
 */

import { describe, it, expect } from '@jest/globals';
import { NotificationPriority, NotificationChannel } from '../domain/entities/NotificationEntities';
import { NotificationType } from '@api/schemas/native/notification';

describe('Test Fixes Verification', () => {
    it('should import NotificationPriority enum correctly', () => {
        expect(NotificationPriority.LOW).toBe('low');
        expect(NotificationPriority.HIGH).toBe('high');
        expect(NotificationPriority.URGENT).toBe('urgent');
    });

    it('should import NotificationChannel enum correctly', () => {
        expect(NotificationChannel.IN_APP).toBe('in_app');
        expect(NotificationChannel.EMAIL).toBe('email');
        expect(NotificationChannel.PUSH).toBe('push');
        expect(NotificationChannel.SMS).toBe('sms');
    });

    it('should import NotificationType correctly', () => {
        expect(NotificationType.FOLLOW_REQUEST).toBe('FOLLOW_REQUEST');
        expect(NotificationType.MENTION).toBe('MENTION');
        expect(NotificationType.COMMENT).toBe('COMMENT');
        expect(NotificationType.REPOST).toBe('REPOST');
    });
});
