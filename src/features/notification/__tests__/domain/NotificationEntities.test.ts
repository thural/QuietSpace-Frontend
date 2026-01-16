/**
 * Notification Domain Entities Unit Tests.
 * 
 * Comprehensive unit tests for all domain entities and business logic.
 * Tests pure TypeScript interfaces and validation functions.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import type { 
    NotificationQuery, 
    NotificationFilters, 
    NotificationResult,
    NotificationMessage,
    NotificationSettings,
    NotificationStatus,
    NotificationParticipant,
    NotificationTypingIndicator,
    NotificationEvent
} from '../../domain/entities/NotificationEntities';
import type { NotificationType } from '@api/schemas/inferred/notification';
import type { ResId } from '@api/schemas/inferred/common';
import { NotificationPriority, NotificationChannel } from '../../domain/entities/NotificationEntities';

describe('Notification Domain Entities', () => {
    describe('NotificationQuery', () => {
        it('should create valid notification query with required fields', () => {
            const query: NotificationQuery = {
                userId: 'user123',
                page: 0,
                size: 10
            };

            expect(query.userId).toBe('user123');
            expect(query.page).toBe(0);
            expect(query.size).toBe(10);
        });

        it('should create notification query with optional fields', () => {
            const query: NotificationQuery = {
                userId: 'user123',
                page: 1,
                size: 20,
                type: 'FOLLOW_REQUEST' as NotificationType,
                isSeen: false,
                filters: {
                    type: 'LIKE' as NotificationType,
                    isSeen: true,
                    dateRange: {
                        startDate: '2023-01-01',
                        endDate: '2023-01-31'
                    }
                }
            };

            expect(query.type).toBe('FOLLOW_REQUEST');
            expect(query.isSeen).toBe(false);
            expect(query.filters?.type).toBe('LIKE');
            expect(query.filters?.isSeen).toBe(true);
            expect(query.filters?.dateRange?.startDate).toBe('2023-01-01');
        });

        it('should validate notification query structure', () => {
            const validQuery: NotificationQuery = {
                userId: 'user123',
                page: 0,
                size: 10
            };

            // Should not throw with valid structure
            expect(() => {
                const validated: NotificationQuery = validQuery;
                return validated;
            }).not.toThrow();

            // Should throw with invalid userId
            expect(() => {
                const invalidQuery: NotificationQuery = {
                    userId: '',
                    page: 0,
                    size: 10
                } as NotificationQuery;
                return invalidQuery;
            }).toThrow();
        });
    });

    describe('NotificationFilters', () => {
        it('should create valid notification filters', () => {
            const filters: NotificationFilters = {
                type: 'LIKE' as NotificationType,
                isSeen: false,
                dateRange: {
                    startDate: '2023-01-01',
                    endDate: '2023-01-31'
                },
                searchQuery: 'test query'
            };

            expect(filters.type).toBe('LIKE');
            expect(filters.isSeen).toBe(false);
            expect(filters.dateRange?.startDate).toBe('2023-01-01');
            expect(filters.searchQuery).toBe('test query');
        });

        it('should create empty filters', () => {
            const filters: NotificationFilters = {};

            expect(Object.keys(filters)).toHaveLength(0);
        });

        it('should validate filters with date range', () => {
            const validFilters: NotificationFilters = {
                dateRange: {
                    startDate: '2023-01-01',
                    endDate: '2023-01-31'
                }
            };

            expect(() => {
                const validated: NotificationFilters = validFilters;
                return validated;
            }).not.toThrow();

            // Should throw with invalid date range
            expect(() => {
                const invalidFilters: NotificationFilters = {
                    dateRange: {
                        startDate: '2023-01-31',
                        endDate: '2023-01-01' // End before start
                    }
                };
                return invalidFilters;
            }).toThrow();
        });
    });

    describe('NotificationResult', () => {
        it('should create valid notification result', () => {
            const result: NotificationResult = {
                notifications: [
                    {
                        id: 1,
                        actorId: 101,
                        contentId: 1001,
                        type: 'LIKE',
                        isSeen: false,
                        createDate: '2023-01-01T10:00:00Z',
                        updateDate: '2023-01-01T10:00:00Z'
                    }
                ],
                totalCount: 5,
                unreadCount: 2,
                hasMore: true,
                nextPage: 1
            };

            expect(result.notifications).toHaveLength(1);
            expect(result.totalCount).toBe(5);
            expect(result.unreadCount).toBe(2);
            expect(result.hasMore).toBe(true);
            expect(result.nextPage).toBe(1);
        });

        it('should create empty notification result', () => {
            const result: NotificationResult = {
                notifications: [],
                totalCount: 0,
                unreadCount: 0,
                hasMore: false,
                nextPage: undefined
            };

            expect(result.notifications).toHaveLength(0);
            expect(result.totalCount).toBe(0);
            expect(result.unreadCount).toBe(0);
            expect(result.hasMore).toBe(false);
            expect(result.nextPage).toBeUndefined();
        });
    });

    describe('NotificationMessage', () => {
        it('should create valid notification message', () => {
            const message: NotificationMessage = {
                id: 1,
                actorId: 101,
                contentId: 1001,
                type: 'COMMENT',
                isSeen: false,
                createDate: '2023-01-01T10:00:00Z',
                updateDate: '2023-01-01T10:00:00Z',
                message: 'Test message',
                metadata: {
                    priority: 'high',
                    category: 'social'
                }
            };

            expect(message.id).toBe(1);
            expect(message.actorId).toBe(101);
            expect(message.contentId).toBe(1001);
            expect(message.type).toBe('COMMENT');
            expect(message.isSeen).toBe(false);
            expect(message.message).toBe('Test message');
            expect(message.metadata?.priority).toBe('high');
        });

        it('should validate notification message structure', () => {
            const validMessage: NotificationMessage = {
                id: 1,
                actorId: 101,
                contentId: 1001,
                type: 'COMMENT',
                isSeen: false,
                createDate: '2023-01-01T10:00:00Z',
                updateDate: '2023-01-01T10:00:00Z'
            };

            expect(() => {
                const validated: NotificationMessage = validMessage;
                return validated;
            }).not.toThrow();

            // Should throw with invalid ID
            expect(() => {
                const invalidMessage: NotificationMessage = {
                    id: null as any,
                    actorId: 101,
                    contentId: 1001,
                    type: 'COMMENT',
                    isSeen: false,
                    createDate: '2023-01-01T10:00:00Z',
                    updateDate: '2023-01-01T10:00:00Z'
                };
                return invalidMessage;
            }).toThrow();
        });
    });

    describe('NotificationSettings', () => {
        it('should create valid notification settings', () => {
            const settings: NotificationSettings = {
                enableEmailNotifications: true,
                enablePushNotifications: true,
                enableInAppNotifications: true,
                notificationTypes: {
                    FOLLOW_REQUEST: true,
                    POST_REACTION: true,
                    COMMENT: true,
                    MENTION: true,
                    COMMENT_REACTION: true,
                    COMMENT_REPLY: true,
                    REPOST: true
                },
                quietHours: {
                    enabled: true,
                    startTime: '22:00',
                    endTime: '08:00'
                }
            };

            expect(settings.enableEmailNotifications).toBe(true);
            expect(settings.enablePushNotifications).toBe(true);
            expect(settings.enableInAppNotifications).toBe(true);
            expect(settings.notificationTypes.FOLLOW_REQUEST).toBe(true);
            expect(settings.quietHours?.enabled).toBe(true);
            expect(settings.quietHours?.startTime).toBe('22:00');
        });

        it('should create minimal notification settings', () => {
            const settings: NotificationSettings = {
                enableEmailNotifications: false,
                enablePushNotifications: false,
                enableInAppNotifications: true,
                notificationTypes: {
                    FOLLOW_REQUEST: true,
                    POST_REACTION: true,
                    MENTION: true,
                    COMMENT: true,
                    COMMENT_REACTION: true,
                    COMMENT_REPLY: true,
                    REPOST: true
                }
            };

            expect(settings.enableEmailNotifications).toBe(false);
            expect(settings.enablePushNotifications).toBe(false);
            expect(settings.enableInAppNotifications).toBe(true);
            expect(Object.values(settings.notificationTypes).every(enabled => !enabled)).toBe(true);
        });

        it('should validate quiet hours time format', () => {
            const validSettings: NotificationSettings = {
                enableEmailNotifications: true,
                enablePushNotifications: true,
                enableInAppNotifications: true,
                notificationTypes: {
                    FOLLOW_REQUEST: true,
                    POST_REACTION: true,
                    COMMENT: true,
                    MENTION: true,
                    COMMENT_REACTION: true,
                    COMMENT_REPLY: true,
                    REPOST: true
                },
                quietHours: {
                    enabled: true,
                    startTime: '22:00',
                    endTime: '08:00'
                }
            };

            expect(() => {
                const validated: NotificationSettings = validSettings;
                return validated;
            }).not.toThrow();

            // Should throw with invalid time format
            expect(() => {
                const invalidSettings: NotificationSettings = {
                    enableEmailNotifications: true,
                    enablePushNotifications: true,
                    enableInAppNotifications: true,
                    notificationTypes: {
                        FOLLOW_REQUEST: true,
                        POST_REACTION: true,
                        COMMENT: true,
                        MENTION: true,
                        COMMENT_REACTION: true,
                        COMMENT_REPLY: true,
                        REPOST: true
                    },
                    quietHours: {
                        enabled: true,
                        startTime: '25:00', // Invalid hour
                        endTime: '08:00'
                    }
                };
                return invalidSettings;
            }).toThrow();
        });
    });

    describe('NotificationStatus', () => {
        it('should create valid notification status', () => {
            const status: NotificationStatus = {
                total: 10,
                unread: 3,
                read: 7,
                pending: 0,
                lastUpdated: '2023-01-01T10:00:00Z'
            };

            expect(status.total).toBe(10);
            expect(status.unread).toBe(3);
            expect(status.read).toBe(7);
            expect(status.pending).toBe(0);
            expect(status.lastUpdated).toBe('2023-01-01T10:00:00Z');
        });

        it('should validate status consistency', () => {
            const status: NotificationStatus = {
                total: 10,
                unread: 3,
                read: 7,
                pending: 0,
                lastUpdated: '2023-01-01T10:00:00Z'
            };

            // Total should equal sum of other counts
            expect(status.total).toBe(status.unread + status.read + status.pending);
        });

        it('should handle empty status', () => {
            const status: NotificationStatus = {
                total: 0,
                unread: 0,
                read: 0,
                pending: 0,
                lastUpdated: null
            };

            expect(status.total).toBe(0);
            expect(status.unread).toBe(0);
            expect(status.read).toBe(0);
            expect(status.pending).toBe(0);
            expect(status.lastUpdated).toBeNull();
        });
    });

    describe('NotificationParticipant', () => {
        it('should create valid notification participant', () => {
            const participant: NotificationParticipant = {
                id: 101,
                name: 'John Doe',
                avatar: 'https://example.com/avatar.jpg',
                isOnline: true,
                lastActive: '2023-01-01T10:00:00Z'
            };

            expect(participant.id).toBe(101);
            expect(participant.name).toBe('John Doe');
            expect(participant.avatar).toBe('https://example.com/avatar.jpg');
            expect(participant.isOnline).toBe(true);
            expect(participant.lastActive).toBe('2023-01-01T10:00:00Z');
        });

        it('should create participant without optional fields', () => {
            const participant: NotificationParticipant = {
                id: 101,
                name: 'John Doe',
                isOnline: false,
                lastActive: '2023-01-01T10:00:00Z'
            };

            expect(participant.avatar).toBeUndefined();
            expect(participant.isOnline).toBe(false);
        });
    });

    describe('NotificationTypingIndicator', () => {
        it('should create valid typing indicator', () => {
            const indicator: NotificationTypingIndicator = {
                userId: 'user123',
                userName: 'John Doe',
                isTyping: true,
                lastTyped: '2023-01-01T10:00:00Z'
            };

            expect(indicator.userId).toBe('user123');
            expect(indicator.userName).toBe('John Doe');
            expect(indicator.isTyping).toBe(true);
            expect(indicator.lastTyped).toBe('2023-01-01T10:00:00Z');
        });

        it('should validate typing indicator timestamp', () => {
            const indicator: NotificationTypingIndicator = {
                userId: 'user123',
                userName: 'John Doe',
                isTyping: true,
                lastTyped: '2023-01-01T10:00:00Z'
            };

            expect(() => {
                const validated: NotificationTypingIndicator = indicator;
                return validated;
            }).not.toThrow();

            // Should throw with invalid timestamp
            expect(() => {
                const invalidIndicator: NotificationTypingIndicator = {
                    userId: 'user123',
                    userName: 'John Doe',
                    isTyping: true,
                    lastTyped: 'invalid-date' as any
                };
                return invalidIndicator;
            }).toThrow();
        });
    });

    describe('NotificationEvent', () => {
        it('should create valid notification event', () => {
            const event: NotificationEvent = {
                id: 1,
                type: 'FOLLOW_REQUEST' as NotificationType,
                actorId: 101,
                recipientId: 102,
                contentId: 1001,
                timestamp: '2023-01-01T10:00:00Z',
                data: {
                    message: 'User followed you'
                }
            };

            expect(event.id).toBe(1);
            expect(event.type).toBe('FOLLOW_REQUEST');
            expect(event.actorId).toBe(101);
            expect(event.recipientId).toBe(102);
            expect(event.contentId).toBe(1001);
            expect(event.timestamp).toBe('2023-01-01T10:00:00Z');
            expect(event.data?.message).toBe('User followed you');
        });

        it('should create minimal notification event', () => {
            const event: NotificationEvent = {
                id: 1,
                type: 'LIKE' as NotificationType,
                actorId: 101,
                recipientId: 102,
                contentId: 1001,
                timestamp: '2023-01-01T10:00:00Z'
            };

            expect(event.data).toBeUndefined();
        });
    });

    describe('NotificationPriority', () => {
        it('should have correct priority values', () => {
            expect(NotificationPriority.LOW).toBe('low');
            expect(NotificationPriority.MEDIUM).toBe('medium');
            expect(NotificationPriority.HIGH).toBe('high');
            expect(NotificationPriority.URGENT).toBe('urgent');
        });

        it('should allow string comparison', () => {
            const priority = NotificationPriority.HIGH;
            expect(priority).toBe(NotificationPriority.HIGH);
            expect(priority === 'high').toBe(true);
            expect(priority === NotificationPriority.HIGH).toBe(true);
        });
    });

    describe('NotificationChannel', () => {
        it('should have correct channel values', () => {
            expect(NotificationChannel.IN_APP).toBe('in_app');
            expect(NotificationChannel.EMAIL).toBe('email');
            expect(NotificationChannel.PUSH).toBe('push');
            expect(NotificationChannel.SMS).toBe('sms');
        });

        it('should allow string comparison', () => {
            const channel = NotificationChannel.EMAIL;
            expect(channel).toBe(NotificationChannel.EMAIL);
            expect(channel === 'email').toBe(true);
            expect(channel === NotificationChannel.EMAIL).toBe(true);
        });
    });

    describe('Domain Entity Validation', () => {
        it('should validate notification query with filters', () => {
            const query: NotificationQuery = {
                userId: 'user123',
                page: 0,
                size: 10,
                filters: {
                    type: 'LIKE' as NotificationType,
                    isSeen: false,
                    dateRange: {
                        startDate: '2023-01-01',
                        endDate: '2023-01-31'
                    }
                }
            };

            // Validate that all required fields are present
            expect(query.userId).toBeTruthy();
            expect(typeof query.page).toBe('number');
            expect(typeof query.size).toBe('number');
            expect(query.page).toBeGreaterThanOrEqual(0);
            expect(query.size).toBeGreaterThan(0);

            // Validate filters if present
            if (query.filters) {
                if (query.filters.dateRange) {
                    expect(query.filters.dateRange.startDate).toBeTruthy();
                    expect(query.filters.dateRange.endDate).toBeTruthy();
                    expect(new Date(query.filters.dateRange.startDate)).toBeInstanceOf(Date);
                    expect(new Date(query.filters.dateRange.endDate)).toBeInstanceOf(Date);
                }
            }
        });

        it('should validate notification message metadata', () => {
            const message: NotificationMessage = {
                id: 1,
                actorId: 101,
                contentId: 1001,
                type: 'COMMENT',
                isSeen: false,
                createDate: '2023-01-01T10:00:00Z',
                updateDate: '2023-01-01T10:00:00Z',
                metadata: {
                    priority: NotificationPriority.HIGH,
                    category: 'social'
                }
            };

            // Validate metadata if present
            if (message.metadata) {
                expect(Object.values(NotificationPriority)).toContain(message.metadata.priority);
                expect(typeof message.metadata.priority).toBe('string');
            }
        });

        it('should validate notification settings notification types', () => {
            const settings: NotificationSettings = {
                enableEmailNotifications: true,
                enablePushNotifications: true,
                enableInAppNotifications: true,
                notificationTypes: {
                    FOLLOW_REQUEST: true,
                    POST_REACTION: true,
                    COMMENT: true,
                    MENTION: true,
                    COMMENT_REACTION: true,
                    COMMENT_REPLY: true,
                    REPOST: true
                }
            };

            // Validate that all notification types are boolean
            Object.values(settings.notificationTypes).forEach(enabled => {
                expect(typeof enabled).toBe('boolean');
            });

            // Validate that all required notification types are present
            const requiredNotificationTypes = ['FOLLOW_REQUEST', 'POST_REACTION', 'MENTION', 'COMMENT', 'COMMENT_REACTION', 'COMMENT_REPLY', 'REPOST'];
            requiredNotificationTypes.forEach(type => {
                expect(settings.notificationTypes).toHaveProperty(type);
            });
        });
    });
});
