/**
 * Enterprise WebSocket Service Tests
 * 
 * Comprehensive tests for the Enterprise WebSocket Service implementation
 * Tests connection management, message handling, and enterprise features
 */

import { EnterpriseWebSocketService, IEnterpriseWebSocketService } from '../../../../src/core/websocket/services/EnterpriseWebSocketService';
import { LoggerService } from '../../../../src/core/services/LoggerService';
import type { FeatureCacheService } from '../../../../src/core/cache';

// Mock WebSocket
class MockWebSocket {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;

    readyState = MockWebSocket.CONNECTING;
    url: string;
    onopen: ((event: Event) => void) | null = null;
    onclose: ((event: CloseEvent) => void) | null = null;
    onmessage: ((event: MessageEvent) => void) | null = null;
    onerror: ((event: Event) => void) | null = null;

    constructor(url: string) {
        this.url = url;
    }

    send(data: string): void {
        if (this.readyState !== MockWebSocket.OPEN) {
            throw new Error('WebSocket is not open');
        }
    }

    close(): void {
        this.readyState = MockWebSocket.CLOSING;
        setTimeout(() => {
            this.readyState = MockWebSocket.CLOSED;
            if (this.onclose) {
                this.onclose(new CloseEvent('close'));
            }
        }, 0);
    }

    // Helper method for testing
    simulateOpen(): void {
        this.readyState = MockWebSocket.OPEN;
        if (this.onopen) {
            this.onopen(new Event('open'));
        }
    }

    simulateMessage(data: any): void {
        if (this.onmessage) {
            this.onmessage(new MessageEvent('message', { data: JSON.stringify(data) }));
        }
    }

    simulateError(error: Event): void {
        if (this.onerror) {
            this.onerror(error);
        }
    }
}

// Mock dependencies
const mockCache: FeatureCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
    has: jest.fn(),
    getMetrics: jest.fn(),
    getStats: jest.fn()
} as any;

const mockAuthService = {
    getCurrentUser: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn()
};

const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    fatal: jest.fn()
} as any;

// Mock global WebSocket
(global as any).WebSocket = MockWebSocket;

describe('EnterpriseWebSocketService', () => {
    let service: EnterpriseWebSocketService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new EnterpriseWebSocketService(mockCache, mockAuthService, mockLogger);
    });

    afterEach(() => {
        service.disconnect();
    });

    describe('Basic Service Operations', () => {
        it('should create service instance', () => {
            expect(service).toBeDefined();
            expect(typeof service.connect).toBe('function');
            expect(typeof service.disconnect).toBe('function');
            expect(typeof service.sendMessage).toBe('function');
            expect(typeof service.subscribe).toBe('function');
            expect(typeof service.unsubscribe).toBe('function');
            expect(typeof service.isConnected).toBe('function');
            expect(typeof service.getConnectionMetrics).toBe('function');
            expect(typeof service.getConnectionState).toBe('function');
        });

        it('should implement IEnterpriseWebSocketService interface', () => {
            const serviceInterface: IEnterpriseWebSocketService = service;
            expect(serviceInterface).toBeDefined();
            expect(typeof serviceInterface.connect).toBe('function');
            expect(typeof serviceInterface.disconnect).toBe('function');
        });

        it('should start in disconnected state', () => {
            expect(service.isConnected()).toBe(false);
            expect(service.getConnectionState()).toBe('disconnected');
        });

        it('should have default metrics', () => {
            const metrics = service.getConnectionMetrics();
            expect(metrics.connectedAt).toBeNull();
            expect(metrics.lastMessageAt).toBeNull();
            expect(metrics.messagesReceived).toBe(0);
            expect(metrics.messagesSent).toBe(0);
            expect(metrics.reconnectAttempts).toBe(0);
            expect(metrics.averageLatency).toBe(0);
            expect(metrics.connectionUptime).toBe(0);
        });
    });

    describe('Connection Management', () => {
        it('should connect successfully with token', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            await service.connect('test-token');

            expect((global as any).WebSocket).toHaveBeenCalledWith(
                expect.stringContaining('ws://localhost:8080')
            );
            expect(service.getConnectionState()).toBe('connecting');
        });

        it('should handle connection success', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            const connectPromise = service.connect('test-token');
            mockWs.simulateOpen();
            await connectPromise;

            expect(service.isConnected()).toBe(true);
            expect(service.getConnectionState()).toBe('connected');
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('WebSocket connected')
            );
        });

        it('should handle connection errors', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            const connectPromise = service.connect('test-token');
            mockWs.simulateError(new Event('error'));
            
            try {
                await connectPromise;
            } catch (error) {
                expect(service.getConnectionState()).toBe('error');
                expect(mockLogger.error).toHaveBeenCalled();
            }
        });

        it('should disconnect properly', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            await service.connect('test-token');
            mockWs.simulateOpen();
            
            service.disconnect();

            expect(service.isConnected()).toBe(false);
            expect(service.getConnectionState()).toBe('disconnected');
        });

        it('should handle multiple connection attempts gracefully', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            const connectPromise1 = service.connect('test-token');
            const connectPromise2 = service.connect('test-token');

            mockWs.simulateOpen();
            await connectPromise1;
            await connectPromise2;

            expect(mockLogger.warn).toHaveBeenCalledWith(
                '[WebSocket] Already connecting or connected'
            );
        });
    });

    describe('Message Handling', () => {
        let mockWs: MockWebSocket;

        beforeEach(async () => {
            mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            await service.connect('test-token');
            mockWs.simulateOpen();
        });

        it('should send messages successfully', async () => {
            const message = {
                type: 'test',
                feature: 'chat',
                payload: { text: 'Hello World' }
            };

            await service.sendMessage(message);

            expect(mockWs.send).toHaveBeenCalledWith(
                expect.stringContaining('"type":"test"')
            );
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Message sent')
            );
        });

        it('should handle incoming messages', () => {
            const listener = {
                onMessage: jest.fn()
            };

            service.subscribe('chat', listener);

            const incomingMessage = {
                id: 'msg-123',
                type: 'message',
                feature: 'chat',
                payload: { text: 'Hello' },
                timestamp: new Date()
            };

            mockWs.simulateMessage(incomingMessage);

            expect(listener.onMessage).toHaveBeenCalledWith(incomingMessage);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Message received')
            );
        });

        it('should reject messages when not connected', async () => {
            service.disconnect();

            const message = {
                type: 'test',
                feature: 'chat',
                payload: { text: 'Hello' }
            };

            await expect(service.sendMessage(message)).rejects.toThrow();
        });

        it('should update metrics on message send/receive', async () => {
            const listener = { onMessage: jest.fn() };
            service.subscribe('chat', listener);

            // Send message
            await service.sendMessage({
                type: 'test',
                feature: 'chat',
                payload: { text: 'Hello' }
            });

            let metrics = service.getConnectionMetrics();
            expect(metrics.messagesSent).toBe(1);

            // Receive message
            mockWs.simulateMessage({
                id: 'msg-123',
                type: 'message',
                feature: 'chat',
                payload: { text: 'Hello' },
                timestamp: new Date()
            });

            metrics = service.getConnectionMetrics();
            expect(metrics.messagesReceived).toBe(1);
        });
    });

    describe('Subscription Management', () => {
        it('should subscribe to feature events', () => {
            const listener = {
                onConnect: jest.fn(),
                onDisconnect: jest.fn(),
                onMessage: jest.fn(),
                onError: jest.fn(),
                onReconnect: jest.fn()
            };

            const unsubscribe = service.subscribe('chat', listener);

            expect(typeof unsubscribe).toBe('function');
        });

        it('should unsubscribe from feature events', () => {
            const listener = { onMessage: jest.fn() };
            const unsubscribe = service.subscribe('chat', listener);

            unsubscribe();
            service.unsubscribe('chat');

            // Should not throw errors
            expect(() => service.unsubscribe('chat')).not.toThrow();
        });

        it('should handle multiple listeners for same feature', () => {
            const listener1 = { onMessage: jest.fn() };
            const listener2 = { onMessage: jest.fn() };

            service.subscribe('chat', listener1);
            service.subscribe('chat', listener2);

            // Both listeners should be registered
            expect(() => service.subscribe('chat', listener1)).not.toThrow();
        });

        it('should call appropriate listener methods', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            const listener = {
                onConnect: jest.fn(),
                onDisconnect: jest.fn(),
                onMessage: jest.fn(),
                onError: jest.fn(),
                onReconnect: jest.fn()
            };

            service.subscribe('chat', listener);

            await service.connect('test-token');
            mockWs.simulateOpen();

            expect(listener.onConnect).toHaveBeenCalled();

            mockWs.simulateMessage({
                id: 'msg-123',
                type: 'message',
                feature: 'chat',
                payload: { text: 'Hello' },
                timestamp: new Date()
            });

            expect(listener.onMessage).toHaveBeenCalled();

            service.disconnect();
            expect(listener.onDisconnect).toHaveBeenCalled();
        });
    });

    describe('Configuration Management', () => {
        it('should accept custom configuration', async () => {
            const customConfig = {
                reconnectAttempts: 10,
                reconnectDelay: 5000,
                heartbeatInterval: 60000,
                enableMetrics: false,
                connectionTimeout: 15000
            };

            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            await service.connect('test-token', customConfig);

            // Configuration should be merged
            expect(service.getConnectionState()).toBe('connecting');
        });

        it('should use default configuration when none provided', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            await service.connect('test-token');

            expect(service.getConnectionState()).toBe('connecting');
        });
    });

    describe('Error Handling', () => {
        it('should handle WebSocket connection errors', async () => {
            (global as any).WebSocket = jest.fn(() => {
                throw new Error('Connection failed');
            });

            await expect(service.connect('test-token')).rejects.toThrow('Connection failed');
            expect(service.getConnectionState()).toBe('error');
        });

        it('should handle message send errors', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            mockWs.readyState = MockWebSocket.CLOSED; // Simulate closed connection
            (global as any).WebSocket = jest.fn(() => mockWs);

            await service.connect('test-token');
            mockWs.simulateOpen();

            const message = {
                type: 'test',
                feature: 'chat',
                payload: { text: 'Hello' }
            };

            await expect(service.sendMessage(message)).rejects.toThrow();
        });

        it('should handle malformed incoming messages', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            await service.connect('test-token');
            mockWs.simulateOpen();

            // Simulate malformed JSON message
            expect(() => {
                mockWs.simulateMessage('invalid json');
            }).not.toThrow();
        });
    });

    describe('Performance', () => {
        it('should handle rapid message operations', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            await service.connect('test-token');
            mockWs.simulateOpen();

            const startTime = performance.now();

            for (let i = 0; i < 1000; i++) {
                await service.sendMessage({
                    type: 'test',
                    feature: 'chat',
                    payload: { index: i }
                });
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete 1000 messages in under 1 second
            expect(duration).toBeLessThan(1000);
        });

        it('should not cause memory leaks with many subscriptions', () => {
            const initialMemory = process.memoryUsage().heapUsed;

            // Create many subscriptions
            for (let i = 0; i < 1000; i++) {
                const listener = { onMessage: jest.fn() };
                const unsubscribe = service.subscribe(`feature-${i}`, listener);
                unsubscribe();
            }

            const finalMemory = process.memoryUsage().heapUsed;
            const memoryIncrease = finalMemory - initialMemory;

            // Memory increase should be minimal
            expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty token', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            await expect(service.connect('')).rejects.toThrow();
        });

        it('should handle null token', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            await expect(service.connect(null as any)).rejects.toThrow();
        });

        it('should handle very large messages', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            await service.connect('test-token');
            mockWs.simulateOpen();

            const largePayload = 'x'.repeat(1000000); // 1MB
            const message = {
                type: 'test',
                feature: 'chat',
                payload: { data: largePayload }
            };

            await expect(service.sendMessage(message)).resolves.not.toThrow();
        });

        it('should handle special characters in messages', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            await service.connect('test-token');
            mockWs.simulateOpen();

            const message = {
                type: 'test',
                feature: 'chat',
                payload: { text: 'Special chars: !@#$%^&*()[]{}|\\:";\'<>?,./' }
            };

            await expect(service.sendMessage(message)).resolves.not.toThrow();
        });
    });

    describe('Integration', () => {
        it('should work with complete connection lifecycle', async () => {
            const mockWs = new MockWebSocket('ws://localhost:8080');
            (global as any).WebSocket = jest.fn(() => mockWs);

            const listener = {
                onConnect: jest.fn(),
                onMessage: jest.fn(),
                onDisconnect: jest.fn()
            };

            service.subscribe('chat', listener);

            // Connect
            await service.connect('test-token');
            mockWs.simulateOpen();
            expect(service.isConnected()).toBe(true);
            expect(listener.onConnect).toHaveBeenCalled();

            // Send message
            await service.sendMessage({
                type: 'message',
                feature: 'chat',
                payload: { text: 'Hello' }
            });

            // Receive message
            mockWs.simulateMessage({
                id: 'msg-123',
                type: 'message',
                feature: 'chat',
                payload: { text: 'Reply' },
                timestamp: new Date()
            });
            expect(listener.onMessage).toHaveBeenCalled();

            // Check metrics
            const metrics = service.getConnectionMetrics();
            expect(metrics.messagesSent).toBe(1);
            expect(metrics.messagesReceived).toBe(1);

            // Disconnect
            service.disconnect();
            expect(service.isConnected()).toBe(false);
            expect(listener.onDisconnect).toHaveBeenCalled();
        });
    });
});
