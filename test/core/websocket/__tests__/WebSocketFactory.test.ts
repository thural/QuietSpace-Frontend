/**
 * WebSocket Factory Tests
 * 
 * Basic tests for WebSocket factory functions
 * Tests service creation and basic functionality
 */

import {
    createDefaultWebSocketService,
    createWebSocketService,
    createMockWebSocketService,
    createWebSocketServiceForEnvironment
} from '../../../../src/core/websocket/factory';
import type { IWebSocketService, WebSocketConfig, WebSocketMessage } from '../../../../src/core/websocket/types';

describe('WebSocket Factory', () => {
    describe('createDefaultWebSocketService', () => {
        it('should create WebSocket service with default configuration', () => {
            const service = createDefaultWebSocketService();

            expect(service).toBeDefined();
            expect(typeof service.connect).toBe('function');
            expect(typeof service.disconnect).toBe('function');
            expect(typeof service.send).toBe('function');
            expect(typeof service.subscribe).toBe('function');
            expect(typeof service.isConnected).toBe('function');
            expect(typeof service.getState).toBe('function');
            expect(typeof service.getConnectionInfo).toBe('function');
            expect(typeof service.ping).toBe('function');
        });

        it('should create service in disconnected state', () => {
            const service = createDefaultWebSocketService();

            expect(service.isConnected()).toBe(false);
            expect(service.getState()).toBe('disconnected');
        });
    });

    describe('createWebSocketService', () => {
        it('should create WebSocket service with custom configuration', () => {
            const customConfig: WebSocketConfig = {
                url: 'ws://localhost:8080/ws',
                reconnectInterval: 5000,
                maxReconnectAttempts: 10,
                timeout: 15000
            };

            const service = createWebSocketService(customConfig);

            expect(service).toBeDefined();
            expect(typeof service.connect).toBe('function');
        });

        it('should handle empty configuration', () => {
            const emptyConfig = {} as WebSocketConfig;

            expect(() => {
                createWebSocketService(emptyConfig);
            }).not.toThrow();
        });

        it('should handle null configuration gracefully', () => {
            expect(() => {
                createWebSocketService(null as any);
            }).not.toThrow();
        });
    });

    describe('createMockWebSocketService', () => {
        it('should create mock WebSocket service', () => {
            const mockService = createMockWebSocketService();

            expect(mockService).toBeDefined();
            expect(typeof mockService.connect).toBe('function');
            expect(typeof mockService.disconnect).toBe('function');
            expect(typeof mockService.send).toBe('function');
        });

        it('should accept custom mock configuration', () => {
            const mockConfig: Partial<WebSocketConfig> = {
                url: 'ws://mock.example.com/ws',
                reconnectInterval: 1000
            };

            const mockService = createMockWebSocketService(mockConfig);

            expect(mockService).toBeDefined();
            expect(typeof mockService.connect).toBe('function');
        });

        it('should simulate connection states', async () => {
            const mockService = createMockWebSocketService();

            expect(mockService.isConnected()).toBe(false);

            await mockService.connect();
            expect(mockService.isConnected()).toBe(true);

            await mockService.disconnect();
            expect(mockService.isConnected()).toBe(false);
        });

        it('should simulate message sending', async () => {
            const mockService = createMockWebSocketService();

            await mockService.connect();

            const message: WebSocketMessage = {
                type: 'test',
                data: { message: 'Hello' },
                timestamp: Date.now()
            };

            expect(() => {
                mockService.send(message);
            }).not.toThrow();
        });

        it('should handle subscription management', () => {
            const mockService = createMockWebSocketService();
            const listener = jest.fn();

            const unsubscribe = mockService.subscribe('test', listener);

            expect(typeof unsubscribe).toBe('function');

            unsubscribe();
            expect(() => mockService.subscribe('test', listener)).not.toThrow();
        });
    });

    describe('createWebSocketServiceForEnvironment', () => {
        it('should create service for development environment', () => {
            const service = createWebSocketServiceForEnvironment('development');

            expect(service).toBeDefined();
            expect(typeof service.connect).toBe('function');
        });

        it('should create service for production environment', () => {
            const service = createWebSocketServiceForEnvironment('production');

            expect(service).toBeDefined();
            expect(typeof service.connect).toBe('function');
        });

        it('should create service for test environment', () => {
            const service = createWebSocketServiceForEnvironment('test');

            expect(service).toBeDefined();
            expect(typeof service.connect).toBe('function');
        });

        it('should create different services for different environments', () => {
            const devService = createWebSocketServiceForEnvironment('development');
            const prodService = createWebSocketServiceForEnvironment('production');
            const testService = createWebSocketServiceForEnvironment('test');

            expect(devService).toBeDefined();
            expect(prodService).toBeDefined();
            expect(testService).toBeDefined();

            // Each service should be different instances
            expect(devService).not.toBe(prodService);
            expect(prodService).not.toBe(testService);
            expect(testService).not.toBe(devService);
        });
    });

    describe('Service Interface Compliance', () => {
        it('should implement IWebSocketService interface', () => {
            const service = createDefaultWebSocketService();

            expect(typeof service.connect).toBe('function');
            expect(typeof service.disconnect).toBe('function');
            expect(typeof service.send).toBe('function');
            expect(typeof service.subscribe).toBe('function');
            expect(typeof service.isConnected).toBe('function');
            expect(typeof service.getState).toBe('function');
            expect(typeof service.getConnectionInfo).toBe('function');
            expect(typeof service.ping).toBe('function');
        });

        it('should return consistent interface across all factories', () => {
            const defaultService = createDefaultWebSocketService();
            const customService = createWebSocketService({ url: 'ws://test.com' });
            const mockService = createMockWebSocketService();
            const envService = createWebSocketServiceForEnvironment('development');

            const services = [defaultService, customService, mockService, envService];

            services.forEach(service => {
                expect(typeof service.connect).toBe('function');
                expect(typeof service.disconnect).toBe('function');
                expect(typeof service.send).toBe('function');
                expect(typeof service.subscribe).toBe('function');
                expect(typeof service.isConnected).toBe('function');
                expect(typeof service.getState).toBe('function');
                expect(typeof service.getConnectionInfo).toBe('function');
                expect(typeof service.ping).toBe('function');
            });
        });
    });

    describe('Performance', () => {
        it('should not cause memory leaks with service creation', () => {
            const initialMemory = process.memoryUsage().heapUsed;

            for (let i = 0; i < 1000; i++) {
                const service = createDefaultWebSocketService();
                // No disconnect needed for mock services
            }

            const finalMemory = process.memoryUsage().heapUsed;
            const memoryIncrease = finalMemory - initialMemory;

            // Memory increase should be minimal
            expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
        });
    });

    describe('Integration', () => {
        it('should work with complete service lifecycle', async () => {
            const service = createDefaultWebSocketService();

            // Initial state
            expect(service.isConnected()).toBe(false);
            expect(service.getState()).toBe('disconnected');

            // Connect (mock)
            await service.connect();
            expect(service.isConnected()).toBe(true);
            expect(service.getState()).toBe('connected');

            // Send message (mock)
            const message: WebSocketMessage = {
                type: 'test',
                data: { message: 'Hello' },
                timestamp: Date.now()
            };

            expect(() => {
                service.send(message);
            }).not.toThrow();

            // Subscribe
            const listener = jest.fn();
            const unsubscribe = service.subscribe('test', listener);
            expect(typeof unsubscribe).toBe('function');

            // Ping
            expect(typeof service.ping).toBe('function');

            // Get connection info
            const info = service.getConnectionInfo();
            expect(info).toBeDefined();
            expect(typeof info.state).toBe('string');

            // Disconnect
            await service.disconnect();
            expect(service.isConnected()).toBe(false);
            expect(service.getState()).toBe('disconnected');
        });

        it('should work with different factory combinations', () => {
            const defaultService = createDefaultWebSocketService();
            const customService = createWebSocketService({
                url: 'ws://custom.com',
                reconnectInterval: 5000
            });
            const mockService = createMockWebSocketService();

            expect(defaultService).toBeDefined();
            expect(customService).toBeDefined();
            expect(mockService).toBeDefined();

            // All should implement the same interface
            expect(typeof defaultService.connect).toBe('function');
            expect(typeof customService.connect).toBe('function');
            expect(typeof mockService.connect).toBe('function');
        });
    });
});
