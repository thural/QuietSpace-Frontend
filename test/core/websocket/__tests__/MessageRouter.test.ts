/**
 * WebSocket Message Router Tests
 * 
 * Tests for the WebSocket Message Router service
 * Tests message routing, validation, transformation, and metrics
 */

import { MessageRouter } from '../../../../src/core/websocket/services/MessageRouter';
import type { MessageRoute, MessageHandler, MessageValidator, MessageTransformer } from '../../../../src/core/websocket/services/MessageRouter';
import type { WebSocketMessage } from '../../../../src/core/websocket/services/EnterpriseWebSocketService';

// Mock dependencies
const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    fatal: jest.fn()
} as any;

const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
    has: jest.fn(),
    getMetrics: jest.fn(),
    getStats: jest.fn()
} as any;

describe('MessageRouter', () => {
    let messageRouter: MessageRouter;

    beforeEach(() => {
        jest.clearAllMocks();
        messageRouter = new MessageRouter(mockCache, mockLogger);
    });

    describe('Basic Router Operations', () => {
        it('should create message router instance', () => {
            expect(messageRouter).toBeDefined();
            expect(typeof messageRouter.registerRoute).toBe('function');
            expect(typeof messageRouter.unregisterRoute).toBe('function');
            expect(typeof messageRouter.routeMessage).toBe('function');
            expect(typeof messageRouter.getMetrics).toBe('function');
            expect(typeof messageRouter.clearMetrics).toBe('function');
        });

        it('should start with initial metrics', () => {
            const metrics = messageRouter.getMetrics();
            expect(metrics).toBeDefined();
            expect(typeof metrics.totalMessages).toBe('number');
            expect(typeof metrics.messagesRouted).toBe('number');
            expect(typeof metrics.messagesDropped).toBe('number');
            expect(metrics.featureStats).toBeDefined();
        });
    });

    describe('Route Registration', () => {
        it('should register a new route', () => {
            const handler: MessageHandler = jest.fn();
            const route: MessageRoute = {
                feature: 'chat',
                messageType: 'message',
                handler,
                priority: 1,
                enabled: true
            };

            expect(() => {
                messageRouter.registerRoute(route);
            }).not.toThrow();
        });

        it('should register multiple routes', () => {
            const handler1: MessageHandler = jest.fn();
            const handler2: MessageHandler = jest.fn();

            expect(() => {
                messageRouter.registerRoute({
                    feature: 'chat',
                    messageType: 'message',
                    handler: handler1,
                    priority: 1,
                    enabled: true
                });

                messageRouter.registerRoute({
                    feature: 'notification',
                    messageType: 'push',
                    handler: handler2,
                    priority: 2,
                    enabled: true
                });
            }).not.toThrow();
        });

        it('should unregister a route', () => {
            const handler: MessageHandler = jest.fn();
            const route: MessageRoute = {
                feature: 'chat',
                messageType: 'message',
                handler,
                priority: 1,
                enabled: true
            };

            messageRouter.registerRoute(route);

            expect(() => {
                messageRouter.unregisterRoute('chat', 'message');
            }).not.toThrow();
        });
    });

    describe('Message Routing', () => {
        it('should route message successfully', async () => {
            const handler: MessageHandler = jest.fn();

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                priority: 1,
                enabled: true
            });

            const message: WebSocketMessage = {
                type: 'message',
                data: { text: 'Hello' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            await expect(messageRouter.routeMessage(message)).resolves.toBeUndefined();
        });

        it('should handle async handlers', async () => {
            const handler: MessageHandler = jest.fn().mockResolvedValue(undefined);

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                priority: 1,
                enabled: true
            });

            const message: WebSocketMessage = {
                type: 'message',
                data: { text: 'Hello' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            await expect(messageRouter.routeMessage(message)).resolves.toBeUndefined();
        });

        it('should handle messages without routes gracefully', async () => {
            const message: WebSocketMessage = {
                type: 'message',
                data: { text: 'Hello' },
                timestamp: Date.now(),
                feature: 'unknown'
            };

            await expect(messageRouter.routeMessage(message)).resolves.toBeUndefined();
        });
    });

    describe('Message Validation', () => {
        it('should validate messages when validator provided', async () => {
            const validator: MessageValidator = jest.fn().mockReturnValue(true);
            const handler: MessageHandler = jest.fn();

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                validator,
                priority: 1,
                enabled: true
            });

            const message: WebSocketMessage = {
                type: 'message',
                data: { text: 'Hello' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            await expect(messageRouter.routeMessage(message)).resolves.toBeUndefined();
        });

        it('should reject messages when validation fails', async () => {
            const validator: MessageValidator = jest.fn().mockReturnValue(false);
            const handler: MessageHandler = jest.fn();

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                validator,
                priority: 1,
                enabled: true
            });

            const message: WebSocketMessage = {
                type: 'message',
                data: { text: 'Hello' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            await expect(messageRouter.routeMessage(message)).resolves.toBeUndefined();
        });

        it('should handle async validation', async () => {
            const validator: MessageValidator = jest.fn().mockResolvedValue(true);
            const handler: MessageHandler = jest.fn();

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                validator,
                priority: 1,
                enabled: true
            });

            const message: WebSocketMessage = {
                type: 'message',
                data: { text: 'Hello' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            await expect(messageRouter.routeMessage(message)).resolves.toBeUndefined();
        });
    });

    describe('Message Transformation', () => {
        it('should transform messages when transformer provided', async () => {
            const transformedMessage: WebSocketMessage = {
                type: 'message',
                data: { text: 'Transformed' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            const transformer: MessageTransformer = jest.fn().mockReturnValue(transformedMessage);
            const handler: MessageHandler = jest.fn();

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                transformer,
                priority: 1,
                enabled: true
            });

            const originalMessage: WebSocketMessage = {
                type: 'message',
                data: { text: 'Original' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            await expect(messageRouter.routeMessage(originalMessage)).resolves.toBeUndefined();
        });

        it('should handle transformation errors gracefully', async () => {
            const transformer: MessageTransformer = jest.fn().mockImplementation(() => {
                throw new Error('Transformation failed');
            });
            const handler: MessageHandler = jest.fn();

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                transformer,
                priority: 1,
                enabled: true
            });

            const message: WebSocketMessage = {
                type: 'message',
                data: { text: 'Hello' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            await expect(messageRouter.routeMessage(message)).resolves.toBeUndefined();
        });

        it('should handle async transformation', async () => {
            const transformedMessage: WebSocketMessage = {
                type: 'message',
                data: { text: 'Transformed' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            const transformer: MessageTransformer = jest.fn().mockResolvedValue(transformedMessage);
            const handler: MessageHandler = jest.fn();

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                transformer,
                priority: 1,
                enabled: true
            });

            const originalMessage: WebSocketMessage = {
                type: 'message',
                data: { text: 'Original' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            await expect(messageRouter.routeMessage(originalMessage)).resolves.toBeUndefined();
        });
    });

    describe('Metrics', () => {
        it('should track routing metrics', async () => {
            const handler: MessageHandler = jest.fn();

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                priority: 1,
                enabled: true
            });

            const message: WebSocketMessage = {
                type: 'message',
                data: { text: 'Hello' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            await messageRouter.routeMessage(message);

            const metrics = messageRouter.getMetrics();
            expect(metrics).toBeDefined();
            expect(typeof metrics.totalMessages).toBe('number');
            expect(typeof metrics.messagesRouted).toBe('number');
            expect(typeof metrics.messagesDropped).toBe('number');
        });

        it('should clear metrics', () => {
            expect(() => {
                messageRouter.clearMetrics();
            }).not.toThrow();

            const metrics = messageRouter.getMetrics();
            expect(metrics).toBeDefined();
        });
    });

    describe('Error Handling', () => {
        it('should handle handler errors gracefully', async () => {
            const handler: MessageHandler = jest.fn().mockRejectedValue(new Error('Handler error'));

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                priority: 1,
                enabled: true
            });

            const message: WebSocketMessage = {
                type: 'message',
                data: { text: 'Hello' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            await expect(messageRouter.routeMessage(message)).resolves.toBeUndefined();
        });

        it('should handle malformed messages gracefully', async () => {
            const handler: MessageHandler = jest.fn();

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                priority: 1,
                enabled: true
            });

            const malformedMessage = {
                // Missing required fields
                type: 'message'
            } as any;

            await expect(messageRouter.routeMessage(malformedMessage)).resolves.toBeUndefined();
        });
    });

    describe('Performance', () => {
        it('should handle rapid message routing', async () => {
            const handler: MessageHandler = jest.fn();

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                priority: 1,
                enabled: true
            });

            const startTime = performance.now();

            const promises = [];
            for (let i = 0; i < 100; i++) {
                const message: WebSocketMessage = {
                    type: 'message',
                    data: { text: `Message ${i}` },
                    timestamp: Date.now(),
                    feature: 'chat'
                };
                promises.push(messageRouter.routeMessage(message));
            }

            await Promise.all(promises);

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete 100 messages in under 1 second
            expect(duration).toBeLessThan(1000);
        });
    });

    describe('Edge Cases', () => {
        it('should handle very large messages', async () => {
            const handler: MessageHandler = jest.fn();

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                priority: 1,
                enabled: true
            });

            const largeMessage: WebSocketMessage = {
                type: 'message',
                data: { text: 'x'.repeat(10000) }, // 10KB
                timestamp: Date.now(),
                feature: 'chat'
            };

            await expect(messageRouter.routeMessage(largeMessage)).resolves.toBeUndefined();
        });

        it('should handle special characters in messages', async () => {
            const handler: MessageHandler = jest.fn();

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                priority: 1,
                enabled: true
            });

            const specialMessage: WebSocketMessage = {
                type: 'message',
                data: { text: 'Special: !@#$%^&*()[]{}|\\:";\'<>?,./' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            await expect(messageRouter.routeMessage(specialMessage)).resolves.toBeUndefined();
        });
    });

    describe('Integration', () => {
        it('should work with complete routing workflow', async () => {
            const validator: MessageValidator = jest.fn().mockReturnValue(true);
            const transformer: MessageTransformer = jest.fn().mockImplementation((msg) => ({
                ...msg,
                data: { ...msg.data, processed: true }
            }));
            const handler: MessageHandler = jest.fn();

            messageRouter.registerRoute({
                feature: 'chat',
                messageType: 'message',
                handler,
                validator,
                transformer,
                priority: 1,
                enabled: true
            });

            const originalMessage: WebSocketMessage = {
                type: 'message',
                data: { text: 'Hello' },
                timestamp: Date.now(),
                feature: 'chat'
            };

            await expect(messageRouter.routeMessage(originalMessage)).resolves.toBeUndefined();

            const metrics = messageRouter.getMetrics();
            expect(metrics).toBeDefined();
            expect(typeof metrics.totalMessages).toBe('number');
        });
    });
});
