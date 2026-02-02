/**
 * Enterprise WebSocket Hook.
 *
 * Provides generic WebSocket functionality using the enterprise WebSocket infrastructure.
 * Feature-specific functionality should be implemented in respective feature modules.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

import type {
  IEnterpriseWebSocketService,
  WebSocketMessage,
  WebSocketEventListener
} from '@/core/websocket';
import type {
  WebSocketConnectionState
} from '@/core/websocket/types/WebSocketTypes';

import { Container } from '@/core/di/container/Container';
import { TYPES } from '@/core/di/types';

export interface UseEnterpriseWebSocketOptions {
  autoConnect?: boolean;
  reconnectOnMount?: boolean;
  enableMetrics?: boolean;
  connectionTimeout?: number;
  maxReconnectAttempts?: number;
  retryDelay?: number;
}

export interface EnterpriseWebSocketState {
  isConnected: boolean;
  connectionState: WebSocketConnectionState;
  isConnecting: boolean;
  error: string | null;
  lastMessage: WebSocketMessage | null;
  metrics: unknown;
}

export const useEnterpriseWebSocket = (
  config?: UseEnterpriseWebSocketOptions
): EnterpriseWebSocketState & {
  sendMessage: (message: unknown) => Promise<void>;
  disconnect: () => Promise<void>;
  reconnect: () => Promise<void>;
} => {
  const {
    autoConnect = true,
    reconnectOnMount = true,
    enableMetrics = true,
    connectionTimeout = 10000,
    maxReconnectAttempts = 5,
    retryDelay = 1000
  } = config || {};

  const container = useDIContainer();
  const [state, setState] = useState<EnterpriseWebSocketState>({
    isConnected: false,
    connectionState: 'disconnected' as WebSocketConnectionState,
    isConnecting: false,
    error: null,
    lastMessage: null,
    metrics: null
  });

  const webSocketRef = useRef<IEnterpriseWebSocketService | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  // Get WebSocket service
  const getWebSocketService = useCallback(() => {
    try {
      return container.getByToken<IEnterpriseWebSocketService>(
        TYPES.ENTERPRISE_WEBSOCKET_SERVICE
      );
    } catch (error) {
      console.error('Failed to get WebSocket service:', error);
      return null;
    }
  }, [container]);

  // Initialize WebSocket
  const initializeWebSocket = useCallback(async () => {
    const webSocketService = getWebSocketService();
    if (!webSocketService) {
      setState(prev => ({
        ...prev,
        error: 'WebSocket service not available'
      }));
      return;
    }

    webSocketRef.current = webSocketService;
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      await webSocketService.connect('ws://localhost:8080');

      setState(prev => ({
        ...prev,
        isConnected: true,
        connectionState: 'connected' as WebSocketConnectionState,
        isConnecting: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        connectionState: 'error' as WebSocketConnectionState,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      }));
    }
  }, [getWebSocketService]);

  // Disconnect WebSocket
  const disconnectWebSocket = useCallback(async () => {
    if (webSocketRef.current) {
      try {
        await webSocketRef.current.disconnect();
        setState(prev => ({
          ...prev,
          isConnected: false,
          connectionState: 'disconnected' as WebSocketConnectionState,
          isConnecting: false,
          error: null
        }));
      } catch (error) {
        console.error('Error disconnecting WebSocket:', error);
      }
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (message: unknown) => {
    if (webSocketRef.current && state.isConnected) {
      try {
        await webSocketRef.current.sendMessage(message);
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to send message'
        }));
      }
    } else {
      setState(prev => ({
        ...prev,
        error: 'WebSocket not connected'
      }));
    }
  }, [state.isConnected]);

  // Set up event listeners
  useEffect(() => {
    const webSocketService = webSocketRef.current;
    if (!webSocketService) return;

    const listeners: WebSocketEventListener = {
      onConnect: () => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          connectionState: 'connected' as WebSocketConnectionState,
          isConnecting: false,
          error: null
        }));
        reconnectAttemptsRef.current = 0;
      },
      onDisconnect: (event) => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          connectionState: 'disconnected' as WebSocketConnectionState,
          isConnecting: false
        }));
      },
      onMessage: (message) => {
        setState(prev => ({
          ...prev,
          lastMessage: message
        }));
      },
      onError: (error) => {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'WebSocket error',
          connectionState: 'error' as WebSocketConnectionState,
          isConnecting: false
        }));
      }
    };

    // Note: Event listener methods need to be implemented in the service
    // For now, this is a placeholder for the event system
    console.log('WebSocket event listeners set up');

    return () => {
      console.log('WebSocket event listeners cleaned up');
    };
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (reconnectOnMount && autoConnect) {
      initializeWebSocket();
    }

    return () => {
      disconnectWebSocket();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [autoConnect, reconnectOnMount, initializeWebSocket, disconnectWebSocket]);

  return {
    ...state,
    sendMessage,
    disconnect: disconnectWebSocket,
    reconnect: initializeWebSocket
  };
};

// Legacy export for backward compatibility - deprecated
export const useFeatureWebSocket = useEnterpriseWebSocket;
