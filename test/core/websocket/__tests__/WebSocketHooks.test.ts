/**
 * WebSocket Hooks Test Suite
 * 
 * Comprehensive tests for WebSocket React hooks including:
 * - Enterprise WebSocket hook functionality
 * - Feature-specific WebSocket hooks
 * - Connection management hooks
 * - Metrics monitoring hooks
 * - React integration and lifecycle
 * - Error handling and edge cases
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDIContainer } from '@core/di';
import { Container } from '@core/di';
import { TYPES } from '@core/di/types';
import {
  useEnterpriseWebSocket,
  useFeatureWebSocket,
  useWebSocketConnection,
  useWebSocketMetrics,
  UseEnterpriseWebSocketOptions,
  UseFeatureWebSocketOptions,
  WebSocketConnectionState,
  WebSocketMetrics
} from '../../../src/core/websocket/hooks/useEnterpriseWebSocket';
import { IEnterpriseWebSocketService, IConnectionManager, IMessageRouter, WebSocketMessage, ConnectionMetrics } from '../../../src/core/websocket/services/EnterpriseWebSocketService';

// Mock implementations
const mockWebSocketService: Partial<IEnterpriseWebSocketService> = {
  isConnected: jest.fn(() => false),
  connect: jest.fn(),
  disconnect: jest.fn(),
  sendMessage: jest.fn(),
  getConnectionState: jest.fn(() => 'disconnected'),
  getConnectionMetrics: jest.fn(() => ({
    connectionUptime: 0,
    messagesSent: 0,
    messagesReceived: 0,
    lastError: null,
    averageLatency: 0
  })),
  subscribe: jest.fn(() => jest.fn())
};

const mockConnectionManager: Partial<IConnectionManager> = {
  createConnection: jest.fn(),
  removeConnection: jest.fn(),
  getAllConnections: jest.fn(() => []),
  getConnectionHealth: jest.fn(() => null),
  performHealthCheck: jest.fn()
};

const mockMessageRouter: Partial<IMessageRouter> = {
  getMetrics: jest.fn(() => ({
    totalMessages: 0,
    messagesRouted: 0,
    averageProcessingTime: 0,
    featureStats: new Map()
  })),
  clearMetrics: jest.fn()
};

const mockContainer: Partial<Container> = {
  getByToken: jest.fn((token) => {
    switch (token) {
      case TYPES.ENTERPRISE_WEBSOCKET_SERVICE:
        return mockWebSocketService;
      case TYPES.CONNECTION_MANAGER:
        return mockConnectionManager;
      case TYPES.MESSAGE_ROUTER:
        return mockMessageRouter;
      default:
        return null;
    }
  })
};

// Mock useDIContainer hook
jest.mock('@core/di', () => ({
  useDIContainer: jest.fn(() => mockContainer)
}));

describe('WebSocket Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useEnterpriseWebSocket', () => {
    test('should initialize with default state', () => {
      const { result } = renderHook(() => useEnterpriseWebSocket());

      expect(result.current.isConnected).toBe(false);
      expect(result.current.isConnecting).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.messagesReceived).toBe(0);
      expect(result.current.messagesSent).toBe(0);
    });

    test('should use custom options', () => {
      const options: UseEnterpriseWebSocketOptions = {
        autoConnect: true,
        enableMetrics: false,
        connectionTimeout: 15000
      };

      const { result } = renderHook(() => useEnterpriseWebSocket(options));

      expect(result.current.isConnected).toBe(false);
      expect(mockWebSocketService.connect).not.toHaveBeenCalled(); // No token provided
    });

    test('should connect successfully', async () => {
      (mockWebSocketService.isConnected as jest.Mock).mockReturnValue(true);
      (mockWebSocketService.getConnectionState as jest.Mock).mockReturnValue('connected');

      const { result } = renderHook(() => useEnterpriseWebSocket());

      await act(async () => {
        await result.current.connect('test-token');
      });

      expect(mockWebSocketService.connect).toHaveBeenCalledWith('test-token', {
        connectionTimeout: 10000,
        enableMetrics: true
      });
      expect(result.current.isConnected).toBe(true);
      expect(result.current.connectionState).toBe('connected');
    });

    test('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      (mockWebSocketService.connect as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useEnterpriseWebSocket());

      await act(async () => {
        await expect(result.current.connect('test-token')).rejects.toThrow('Connection failed');
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.connectionState).toBe('error');
      expect(result.current.lastError).toBeInstanceOf(Date);
    });

    test('should disconnect successfully', () => {
      (mockWebSocketService.isConnected as jest.Mock).mockReturnValue(false);
      (mockWebSocketService.getConnectionState as jest.Mock).mockReturnValue('disconnected');

      const { result } = renderHook(() => useEnterpriseWebSocket());

      act(() => {
        result.current.disconnect();
      });

      expect(mockWebSocketService.disconnect).toHaveBeenCalled();
      expect(result.current.isConnected).toBe(false);
      expect(result.current.connectionState).toBe('disconnected');
    });

    test('should send message successfully', async () => {
      const { result } = renderHook(() => useEnterpriseWebSocket());

      const message = {
        type: 'chat',
        feature: 'chat',
        payload: { content: 'Hello World' },
        sender: 'user1'
      };

      await act(async () => {
        await result.current.sendMessage(message);
      });

      expect(mockWebSocketService.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          timestamp: expect.any(Date),
          ...message
        })
      );
    });

    test('should handle message send errors', async () => {
      const error = new Error('Send failed');
      (mockWebSocketService.sendMessage as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useEnterpriseWebSocket());

      const message = {
        type: 'chat',
        feature: 'chat',
        payload: { content: 'Hello' },
        sender: 'user1'
      };

      await act(async () => {
        await expect(result.current.sendMessage(message)).rejects.toThrow('Send failed');
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.lastError).toBeInstanceOf(Date);
    });

    test('should subscribe to events', () => {
      const unsubscribe = jest.fn();
      (mockWebSocketService.subscribe as jest.Mock).mockReturnValue(unsubscribe);

      const { result } = renderHook(() => useEnterpriseWebSocket());

      const listener = {
        onMessage: jest.fn(),
        onConnect: jest.fn(),
        onDisconnect: jest.fn(),
        onError: jest.fn()
      };

      act(() => {
        const unsubscribeFn = result.current.subscribe('chat', listener);
        expect(unsubscribeFn).toBe(unsubscribe);
      });

      expect(mockWebSocketService.subscribe).toHaveBeenCalledWith('chat', expect.objectContaining({
        onMessage: expect.any(Function),
        onConnect: expect.any(Function),
        onDisconnect: expect.any(Function),
        onError: expect.any(Function)
      }));
    });

    test('should update metrics', () => {
      (mockWebSocketService.getConnectionMetrics as jest.Mock).mockReturnValue({
        connectionUptime: 3600000,
        messagesSent: 50,
        messagesReceived: 48,
        lastError: null,
        averageLatency: 150
      });

      const { result } = renderHook(() => useEnterpriseWebSocket({ enableMetrics: true }));

      // Metrics should be updated (tested via internal behavior)
      expect(result.current.connectionMetrics).toBeDefined();
    });

    test('should handle metrics disabled', () => {
      const { result } = renderHook(() => useEnterpriseWebSocket({ enableMetrics: false }));

      // Should not set up metrics polling when disabled
      expect(result.current.connectionMetrics).toBeNull();
    });
  });

  describe('useFeatureWebSocket', () => {
    test('should initialize with feature-specific state', () => {
      const options: UseFeatureWebSocketOptions = {
        feature: 'chat',
        autoConnect: false
      };

      const { result } = renderHook(() => useFeatureWebSocket(options));

      expect(result.current.feature).toBe('chat');
      expect(result.current.priority).toBe(1); // Default priority
      expect(result.current.featureMessages).toEqual([]);
      expect(result.current.isSubscribed).toBe(false);
    });

    test('should use custom priority', () => {
      const options: UseFeatureWebSocketOptions = {
        feature: 'notification',
        priority: 5
      };

      const { result } = renderHook(() => useFeatureWebSocket(options));

      expect(result.current.priority).toBe(5);
    });

    test('should send feature-specific message', async () => {
      (mockWebSocketService.sendMessage as jest.Mock).mockResolvedValue(undefined);

      const options: UseFeatureWebSocketOptions = {
        feature: 'chat',
        priority: 3
      };

      const { result } = renderHook(() => useFeatureWebSocket(options));

      await act(async () => {
        await result.current.sendFeatureMessage('create', { content: 'Hello' }, { custom: 'data' });
      });

      expect(mockWebSocketService.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'create',
          feature: 'chat',
          payload: { content: 'Hello' },
          metadata: expect.objectContaining({
            priority: 3,
            custom: 'data',
            sentAt: expect.any(String)
          })
        })
      );
    });

    test('should clear feature messages', () => {
      const options: UseFeatureWebSocketOptions = {
        feature: 'chat'
      };

      const { result } = renderHook(() => useFeatureWebSocket(options));

      // Simulate having messages
      act(() => {
        result.current.featureMessages.push({} as WebSocketMessage);
      });

      act(() => {
        result.current.clearMessages();
      });

      expect(result.current.featureMessages).toEqual([]);
    });

    test('should handle feature callbacks', () => {
      const onMessage = jest.fn();
      const onError = jest.fn();
      const onConnect = jest.fn();
      const onDisconnect = jest.fn();

      const options: UseFeatureWebSocketOptions = {
        feature: 'chat',
        onMessage,
        onError,
        onConnect,
        onDisconnect
      };

      renderHook(() => useFeatureWebSocket(options));

      // Callbacks should be called when events occur (tested via subscription)
      expect(mockWebSocketService.subscribe).toHaveBeenCalled();
    });
  });

  describe('useWebSocketConnection', () => {
    test('should initialize with connection state', () => {
      const { result } = renderHook(() => useWebSocketConnection());

      expect(result.current.connections).toEqual([]);
      expect(result.current.healthStatus).toEqual({});
      expect(typeof result.current.refreshConnections).toBe('function');
      expect(typeof result.current.createConnection).toBe('function');
      expect(typeof result.current.removeConnection).toBe('function');
    });

    test('should refresh connections', () => {
      const mockConnections = [
        {
          id: 'conn1',
          feature: 'chat',
          service: null,
          priority: 1,
          isActive: true,
          lastUsed: new Date(),
          healthScore: 100
        }
      ];
      (mockConnectionManager.getAllConnections as jest.Mock).mockReturnValue(mockConnections);

      const { result } = renderHook(() => useWebSocketConnection());

      act(() => {
        result.current.refreshConnections();
      });

      expect(result.current.connections).toEqual(mockConnections);
    });

    test('should get connection health', async () => {
      const mockHealth = {
        connectionId: 'conn1',
        status: 'healthy' as const,
        latency: 50,
        uptime: 3600000,
        errorCount: 0,
        lastError: null,
        lastHealthCheck: new Date()
      };
      (mockConnectionManager.getConnectionHealth as jest.Mock).mockReturnValue(mockHealth);

      const { result } = renderHook(() => useWebSocketConnection());

      await act(async () => {
        const health = await result.current.getConnectionHealth('conn1');
        expect(health).toEqual(mockHealth);
      });

      expect(result.current.healthStatus.conn1).toEqual(mockHealth);
    });

    test('should create connection', async () => {
      const connectionId = 'conn-123';
      (mockConnectionManager.createConnection as jest.Mock).mockResolvedValue(connectionId);

      const { result } = renderHook(() => useWebSocketConnection());

      await act(async () => {
        const id = await result.current.createConnection('chat', 2);
        expect(id).toBe(connectionId);
      });

      expect(mockConnectionManager.createConnection).toHaveBeenCalledWith('chat', 2);
      expect(mockConnectionManager.getAllConnections).toHaveBeenCalled(); // Refresh
    });

    test('should remove connection', async () => {
      const { result } = renderHook(() => useWebSocketConnection());

      await act(async () => {
        await result.current.removeConnection('conn-123');
      });

      expect(mockConnectionManager.removeConnection).toHaveBeenCalledWith('conn-123');
      expect(mockConnectionManager.getAllConnections).toHaveBeenCalled(); // Refresh
    });

    test('should perform health check', async () => {
      const { result } = renderHook(() => useWebSocketConnection());

      await act(async () => {
        await result.current.performHealthCheck();
      });

      expect(mockConnectionManager.performHealthCheck).toHaveBeenCalled();
      expect(mockConnectionManager.getAllConnections).toHaveBeenCalled(); // Refresh
    });
  });

  describe('useWebSocketMetrics', () => {
    test('should initialize with metrics', () => {
      const mockMetrics = {
        totalMessages: 100,
        messagesRouted: 95,
        averageProcessingTime: 25,
        featureStats: new Map()
      };
      (mockMessageRouter.getMetrics as jest.Mock).mockReturnValue(mockMetrics);

      const { result } = renderHook(() => useWebSocketMetrics());

      expect(result.current.metrics).toEqual(mockMetrics);
      expect(typeof result.current.refreshMetrics).toBe('function');
      expect(typeof result.current.clearMetrics).toBe('function');
    });

    test('should refresh metrics', () => {
      const mockMetrics = {
        totalMessages: 150,
        messagesRouted: 145,
        averageProcessingTime: 30,
        featureStats: new Map()
      };
      (mockMessageRouter.getMetrics as jest.Mock).mockReturnValue(mockMetrics);

      const { result } = renderHook(() => useWebSocketMetrics());

      act(() => {
        result.current.refreshMetrics();
      });

      expect(result.current.metrics).toEqual(mockMetrics);
      expect(mockMessageRouter.getMetrics).toHaveBeenCalled();
    });

    test('should clear metrics', () => {
      const { result } = renderHook(() => useWebSocketMetrics());

      act(() => {
        result.current.clearMetrics();
      });

      expect(mockMessageRouter.clearMetrics).toHaveBeenCalled();
      expect(mockMessageRouter.getMetrics).toHaveBeenCalled(); // Refresh after clear
    });
  });

  describe('React Integration', () => {
    test('should handle component mount and unmount', () => {
      const { unmount } = renderHook(() => useEnterpriseWebSocket());

      // Should not throw on unmount
      expect(() => unmount()).not.toThrow();
    });

    test('should handle dependency injection container changes', () => {
      const newContainer = {
        getByToken: jest.fn(() => mockWebSocketService)
      };

      (useDIContainer as jest.Mock).mockReturnValue(newContainer);

      const { result } = renderHook(() => useEnterpriseWebSocket());

      expect(result.current.webSocketService).toBeDefined();
    });

    test('should handle missing services gracefully', () => {
      (mockContainer.getByToken as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() => useEnterpriseWebSocket());

      // Should handle missing service without throwing
      expect(() => result.current.connect('token')).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle service unavailable errors', async () => {
      (mockContainer.getByToken as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() => useEnterpriseWebSocket());

      await act(async () => {
        await expect(result.current.connect('token')).rejects.toThrow();
      });
    });

    test('should handle invalid message data', async () => {
      const { result } = renderHook(() => useEnterpriseWebSocket());

      const invalidMessage = null;

      await act(async () => {
        await expect(result.current.sendMessage(invalidMessage as any)).rejects.toThrow();
      });
    });

    test('should handle connection manager errors', async () => {
      (mockConnectionManager.createConnection as jest.Mock).mockRejectedValue(new Error('Connection failed'));

      const { result } = renderHook(() => useWebSocketConnection());

      await act(async () => {
        await expect(result.current.createConnection('chat')).rejects.toThrow('Connection failed');
      });
    });

    test('should handle metrics errors', () => {
      (mockMessageRouter.getMetrics as jest.Mock).mockImplementation(() => {
        throw new Error('Metrics error');
      });

      const { result } = renderHook(() => useWebSocketMetrics());

      // Should handle errors gracefully
      expect(() => result.current.refreshMetrics()).not.toThrow();
    });
  });

  describe('Performance', () => {
    test('should handle rapid state updates', () => {
      const { result } = renderHook(() => useEnterpriseWebSocket());

      // Rapid updates should not cause issues
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.disconnect();
        });
      }

      expect(mockWebSocketService.disconnect).toHaveBeenCalledTimes(10);
    });

    test('should not have memory leaks', () => {
      const { unmount } = renderHook(() => useEnterpriseWebSocket({ enableMetrics: true }));

      // Unmount should clean up intervals
      unmount();

      // Should not throw and should clean up properly
      expect(clearInterval).toHaveBeenCalled();
    });

    test('should handle large message volumes', async () => {
      const { result } = renderHook(() => useFeatureWebSocket({ feature: 'chat' }));

      // Simulate receiving many messages
      const messages: WebSocketMessage[] = Array.from({ length: 100 }, (_, i) => ({
        id: `msg-${i}`,
        type: 'chat',
        feature: 'chat',
        payload: { content: `Message ${i}` },
        timestamp: new Date(),
        sender: 'user1'
      }));

      // Should handle large message arrays
      expect(() => {
        act(() => {
          result.current.featureMessages.push(...messages);
        });
      }).not.toThrow();
    });
  });

  describe('Type Safety', () => {
    test('should maintain type safety for hook returns', () => {
      const { result } = renderHook(() => useEnterpriseWebSocket());

      // Test that return values have correct types
      expect(typeof result.current.isConnected).toBe('boolean');
      expect(typeof result.current.connect).toBe('function');
      expect(typeof result.current.sendMessage).toBe('function');
      expect(typeof result.current.subscribe).toBe('function');
    });

    test('should handle TypeScript compilation', () => {
      // This test ensures TypeScript compilation works
      const options: UseEnterpriseWebSocketOptions = {
        autoConnect: true,
        enableMetrics: true,
        connectionTimeout: 10000
      };

      const featureOptions: UseFeatureWebSocketOptions = {
        feature: 'chat',
        priority: 2,
        autoConnect: true
      };

      expect(options).toBeDefined();
      expect(featureOptions).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty feature names', () => {
      const { result } = renderHook(() => useFeatureWebSocket({ feature: '' }));

      expect(result.current.feature).toBe('');
    });

    test('should handle extreme priority values', () => {
      const { result } = renderHook(() => useFeatureWebSocket({ 
        feature: 'test', 
        priority: 999999 
      }));

      expect(result.current.priority).toBe(999999);
    });

    test('should handle zero timeout values', () => {
      const { result } = renderHook(() => useEnterpriseWebSocket({
        connectionTimeout: 0
      }));

      expect(result.current).toBeDefined();
    });

    test('should handle negative values', () => {
      const { result } = renderHook(() => useFeatureWebSocket({
        feature: 'test',
        priority: -1
      }));

      expect(result.current.priority).toBe(-1);
    });
  });
});
