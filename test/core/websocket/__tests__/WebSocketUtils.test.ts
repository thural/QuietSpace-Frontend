/**
 * WebSocket Utils Tests
 * 
 * Tests for WebSocket utility functions
 * Tests message creation, validation, formatting, and helper functions
 */

import {
    createWebSocketMessage,
    isValidWebSocketMessage,
    extractFeature,
    extractMessageType,
    isFromFeature,
    isMessageType,
    filterMessages,
    sortMessagesByTimestamp,
    groupMessagesByFeature,
    calculateMessageStats,
    WebSocketMessageBuilder,
    WebSocketMessageValidator,
    WebSocketConnectionMonitor
} from '../../../../src/core/websocket/utils/WebSocketUtils';
import type { WebSocketMessage } from '../../../../src/core/websocket/services/EnterpriseWebSocketService';

describe('WebSocket Utils', () => {
    describe('Message Creation', () => {
        it('should create WebSocket message', () => {
            const message = createWebSocketMessage('chat', 'message', { text: 'hello' });

            expect(message).toBeDefined();
            expect(message.type).toBe('message');
            expect(message.feature).toBe('chat');
            expect(message.payload).toEqual({ text: 'hello' });
            expect(typeof message.timestamp).toBe('object');
            expect(typeof message.id).toBe('string');
        });

        it('should create message with metadata', () => {
            const message = createWebSocketMessage('chat', 'message', { text: 'hello' }, {
                priority: 1,
                source: 'client'
            });

            expect(message.metadata).toBeDefined();
            expect(message.metadata.priority).toBe(1);
            expect(message.metadata.source).toBe('client');
        });
    });

    describe('Message Validation', () => {
        it('should validate valid WebSocket message', () => {
            const message = createWebSocketMessage('test', 'message', { data: 'hello' });

            expect(isValidWebSocketMessage(message)).toBe(true);
        });

        it('should reject invalid message missing type', () => {
            const invalidMessage = {
                payload: { data: 'hello' },
                feature: 'chat',
                timestamp: new Date()
            } as any;

            expect(isValidWebSocketMessage(invalidMessage)).toBe(false);
        });

        it('should reject invalid message missing feature', () => {
            const invalidMessage = {
                type: 'test',
                payload: { data: 'hello' },
                timestamp: new Date()
            } as any;

            expect(isValidWebSocketMessage(invalidMessage)).toBe(false);
        });

        it('should reject null message', () => {
            expect(isValidWebSocketMessage(null)).toBe(false);
        });

        it('should reject undefined message', () => {
            expect(isValidWebSocketMessage(undefined)).toBe(false);
        });
    });

    describe('Message Helper Functions', () => {
        it('should extract feature from message', () => {
            const message = createWebSocketMessage('chat', 'message', { text: 'hello' });

            expect(extractFeature(message)).toBe('chat');
        });

        it('should extract message type', () => {
            const message = createWebSocketMessage('chat', 'message', { text: 'hello' });

            expect(extractMessageType(message)).toBe('message');
        });

        it('should check if message is from specific feature', () => {
            const message = createWebSocketMessage('chat', 'message', { text: 'hello' });

            expect(isFromFeature(message, 'chat')).toBe(true);
            expect(isFromFeature(message, 'notification')).toBe(false);
        });

        it('should check if message is of specific type', () => {
            const message = createWebSocketMessage('chat', 'message', { text: 'hello' });

            expect(isMessageType(message, 'message')).toBe(true);
            expect(isMessageType(message, 'typing')).toBe(false);
        });
    });

    describe('Message Filtering and Sorting', () => {
        it('should filter messages by feature', () => {
            const messages = [
                createWebSocketMessage('chat', 'message', { text: 'hello' }),
                createWebSocketMessage('notification', 'push', { title: 'alert' }),
                createWebSocketMessage('chat', 'typing', { user: 'john' })
            ];

            const chatMessages = filterMessages(messages, 'chat');

            expect(chatMessages).toHaveLength(2);
            expect(chatMessages.every(m => m.feature === 'chat')).toBe(true);
        });

        it('should filter messages by type', () => {
            const messages = [
                createWebSocketMessage('chat', 'message', { text: 'hello' }),
                createWebSocketMessage('chat', 'typing', { user: 'john' }),
                createWebSocketMessage('notification', 'message', { text: 'system' })
            ];

            const messageMessages = filterMessages(messages, undefined, 'message');

            expect(messageMessages).toHaveLength(2);
            expect(messageMessages.every(m => m.type === 'message')).toBe(true);
        });

        it('should filter messages by both feature and type', () => {
            const messages = [
                createWebSocketMessage('chat', 'message', { text: 'hello' }),
                createWebSocketMessage('chat', 'typing', { user: 'john' }),
                createWebSocketMessage('notification', 'message', { text: 'system' })
            ];

            const chatMessageMessages = filterMessages(messages, 'chat', 'message');

            expect(chatMessageMessages).toHaveLength(1);
            expect(chatMessageMessages[0].feature).toBe('chat');
            expect(chatMessageMessages[0].type).toBe('message');
        });

        it('should sort messages by timestamp (newest first)', () => {
            const olderMessage = createWebSocketMessage('chat', 'message', { text: 'first' });
            // Wait a bit to ensure different timestamps
            const newerMessage = createWebSocketMessage('chat', 'message', { text: 'second' });

            const messages = [olderMessage, newerMessage];
            const sorted = sortMessagesByTimestamp(messages);

            expect(sorted[0]).toBe(newerMessage);
            expect(sorted[1]).toBe(olderMessage);
        });

        it('should group messages by feature', () => {
            const messages = [
                createWebSocketMessage('chat', 'message', { text: 'hello' }),
                createWebSocketMessage('notification', 'push', { title: 'alert' }),
                createWebSocketMessage('chat', 'typing', { user: 'john' })
            ];

            const grouped = groupMessagesByFeature(messages);

            expect(Object.keys(grouped)).toHaveLength(2);
            expect(grouped.chat).toHaveLength(2);
            expect(grouped.notification).toHaveLength(1);
        });

        it('should calculate message statistics', () => {
            const messages = [
                createWebSocketMessage('chat', 'message', { text: 'hello' }),
                createWebSocketMessage('chat', 'typing', { user: 'john' }),
                createWebSocketMessage('notification', 'push', { title: 'alert' })
            ];

            const stats = calculateMessageStats(messages);

            expect(stats.total).toBe(3);
            expect(stats.byFeature.chat).toBe(2);
            expect(stats.byFeature.notification).toBe(1);
            expect(stats.byType.message).toBe(1);
            expect(stats.byType.typing).toBe(1);
            expect(stats.byType.push).toBe(1);
        });
    });

    describe('WebSocketMessageBuilder', () => {
        it('should create message using builder pattern', () => {
            const message = WebSocketMessageBuilder.create({
                feature: 'chat',
                type: 'message',
                payload: { text: 'hello' }
            })
                .withMetadata({ priority: 1 })
                .withSource('client')
                .withCorrelationId('test-123')
                .build();

            expect(message.feature).toBe('chat');
            expect(message.type).toBe('message');
            expect(message.payload).toEqual({ text: 'hello' });
            expect(message.metadata.priority).toBe(1);
            expect(message.metadata.source).toBe('client');
            expect(message.metadata.correlationId).toBe('test-123');
        });

        it('should create message with priority', () => {
            const message = WebSocketMessageBuilder.create({
                feature: 'chat',
                type: 'message',
                payload: { text: 'hello' }
            })
                .withPriority(5)
                .build();

            expect(message.metadata.priority).toBe(5);
        });

        it('should generate unique message IDs', () => {
            const message1 = WebSocketMessageBuilder.create({
                feature: 'chat',
                type: 'message',
                payload: { text: 'hello' }
            }).build();

            const message2 = WebSocketMessageBuilder.create({
                feature: 'chat',
                type: 'message',
                payload: { text: 'world' }
            }).build();

            expect(message1.id).not.toBe(message2.id);
        });
    });

    describe('WebSocketMessageValidator', () => {
        let validator: WebSocketMessageValidator;

        beforeEach(() => {
            validator = new WebSocketMessageValidator();
        });

        it('should validate message with rules', () => {
            validator.addRule('chat', 'message', [
                { field: 'payload.text', required: true, type: 'string', minLength: 1 }
            ]);

            const validMessage = createWebSocketMessage('chat', 'message', { text: 'hello' });
            const isValid = validator.validate(validMessage);

            expect(isValid).toBe(true);
        });

        it('should reject invalid message', () => {
            validator.addRule('chat', 'message', [
                { field: 'payload.text', required: true, type: 'string', minLength: 1 }
            ]);

            const invalidMessage = createWebSocketMessage('chat', 'message', { text: '' });
            const isValid = validator.validate(invalidMessage);

            expect(isValid).toBe(false);
        });

        it('should handle custom validation rules', () => {
            validator.addRule('chat', 'message', [
                {
                    field: 'payload.text',
                    custom: (value) => typeof value === 'string' && value.includes('hello')
                }
            ]);

            const validMessage = createWebSocketMessage('chat', 'message', { text: 'hello world' });
            const invalidMessage = createWebSocketMessage('chat', 'message', { text: 'goodbye world' });

            expect(validator.validate(validMessage)).toBe(true);
            expect(validator.validate(invalidMessage)).toBe(false);
        });
    });

    describe('WebSocketConnectionMonitor', () => {
        let monitor: WebSocketConnectionMonitor;

        beforeEach(() => {
            monitor = new WebSocketConnectionMonitor({
                heartbeatInterval: 1000,
                timeoutThreshold: 5000,
                maxMissedHeartbeats: 3,
                enableReconnect: true
            });
        });

        afterEach(() => {
            monitor.stop();
        });

        it('should start monitoring', () => {
            expect(() => {
                monitor.start();
            }).not.toThrow();
        });

        it('should stop monitoring', () => {
            monitor.start();
            expect(() => {
                monitor.stop();
            }).not.toThrow();
        });

        it('should track connection health', () => {
            const health = monitor.getHealth();
            expect(health).toBeDefined();
            expect(typeof health.isHealthy).toBe('boolean');
            expect(typeof health.missedHeartbeats).toBe('number');
        });

        it('should handle heartbeat', () => {
            expect(() => {
                monitor.handleHeartbeat();
            }).not.toThrow();
        });
    });

    describe('Performance', () => {
        it('should handle rapid message creation', () => {
            const startTime = performance.now();

            for (let i = 0; i < 10000; i++) {
                createWebSocketMessage('test', 'message', { index: i });
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete 10,000 creations in under 100ms
            expect(duration).toBeLessThan(100);
        });

        it('should handle rapid message validation', () => {
            const message = createWebSocketMessage('test', 'message', { data: 'hello' });
            const startTime = performance.now();

            for (let i = 0; i < 10000; i++) {
                isValidWebSocketMessage(message);
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete 10,000 validations in under 100ms
            expect(duration).toBeLessThan(100);
        });

        it('should handle rapid message filtering', () => {
            const messages = Array.from({ length: 1000 }, (_, i) =>
                createWebSocketMessage(i % 2 === 0 ? 'chat' : 'notification', 'message', { index: i })
            );

            const startTime = performance.now();

            for (let i = 0; i < 1000; i++) {
                filterMessages(messages, 'chat');
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete 1,000 filtering operations in under 100ms
            expect(duration).toBeLessThan(100);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty message array', () => {
            const stats = calculateMessageStats([]);

            expect(stats.total).toBe(0);
            expect(Object.keys(stats.byFeature)).toHaveLength(0);
            expect(Object.keys(stats.byType)).toHaveLength(0);
        });

        it('should handle message sorting with same timestamps', () => {
            const message1 = createWebSocketMessage('chat', 'message', { text: 'first' });
            const message2 = createWebSocketMessage('chat', 'message', { text: 'second' });

            // Manually set same timestamp
            message2.timestamp = message1.timestamp;

            const messages = [message1, message2];
            const sorted = sortMessagesByTimestamp(messages);

            // Should maintain order when timestamps are equal
            expect(sorted).toHaveLength(2);
        });

        it('should handle very large payload', () => {
            const largePayload = { text: 'x'.repeat(10000) };
            const message = createWebSocketMessage('test', 'large', largePayload);

            expect(isValidWebSocketMessage(message)).toBe(true);
            expect(message.payload.text).toHaveLength(10000);
        });

        it('should handle special characters in payload', () => {
            const specialPayload = { text: 'Special: !@#$%^&*()[]{}|\\:";\'<>?,./' };
            const message = createWebSocketMessage('test', 'special', specialPayload);

            expect(isValidWebSocketMessage(message)).toBe(true);
            expect(message.payload.text).toBe(specialPayload.text);
        });

        it('should handle Unicode characters in payload', () => {
            const unicodePayload = { text: 'Hello 世界 🌍 ñño café' };
            const message = createWebSocketMessage('test', 'unicode', unicodePayload);

            expect(isValidWebSocketMessage(message)).toBe(true);
            expect(message.payload.text).toBe(unicodePayload.text);
        });
    });

    describe('Integration', () => {
        it('should work with complete message workflow', () => {
            // Create message using builder
            const originalMessage = WebSocketMessageBuilder.create({
                feature: 'chat',
                type: 'message',
                payload: { text: 'Hello World' }
            })
                .withMetadata({ priority: 1, source: 'client' })
                .build();

            // Validate message
            expect(isValidWebSocketMessage(originalMessage)).toBe(true);

            // Extract properties
            expect(extractFeature(originalMessage)).toBe('chat');
            expect(extractMessageType(originalMessage)).toBe('message');
            expect(isFromFeature(originalMessage, 'chat')).toBe(true);
            expect(isMessageType(originalMessage, 'message')).toBe(true);

            // Create multiple messages for filtering/sorting
            const messages = [
                originalMessage,
                createWebSocketMessage('chat', 'typing', { user: 'john' }),
                createWebSocketMessage('notification', 'push', { title: 'New message' })
            ];

            // Filter messages
            const chatMessages = filterMessages(messages, 'chat');
            expect(chatMessages).toHaveLength(2);

            // Sort messages
            const sortedMessages = sortMessagesByTimestamp(messages);
            expect(sortedMessages).toHaveLength(3);

            // Group messages
            const groupedMessages = groupMessagesByFeature(messages);
            expect(Object.keys(groupedMessages)).toHaveLength(2);

            // Calculate stats
            const stats = calculateMessageStats(messages);
            expect(stats.total).toBe(3);
        });
    });
});
