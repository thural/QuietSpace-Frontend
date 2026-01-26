/**
 * Enterprise WebSocket React Hooks.
 * 
 * React hooks for integrating with the enterprise WebSocket system.
 * Provides type-safe WebSocket functionality for React components.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDIContainer } from '@core/di';
import { TYPES } from '@core/di/types';
import {
  IEnterpriseWebSocketService,
  IConnectionManager,
  IMessageRouter,
  WebSocketMessage,
  WebSocketEventListener,
  ConnectionMetrics
} from '@/core/websocket';

export interface UseEnterpriseWebSocketOptions {
  autoConnect?: boolean;
  reconnectOnMount?: boolean;
  enableMetrics?: boolean;
  connectionTimeout?: number;
}

export interface UseFeatureWebSocketOptions {
  feature: string;
  autoConnect?: boolean;
  priority?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export interface WebSocketConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  lastError: Date | null;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';
}

export interface WebSocketMetrics {
  connectionMetrics: ConnectionMetrics | null;
  messagesReceived: number;
  messagesSent: number;
  averageLatency: number;
  connectionUptime: number;
}

/**
 * Enterprise WebSocket Hook
 * 
 * Main hook for accessing the enterprise WebSocket service.
 */
export function useEnterpriseWebSocket(options: UseEnterpriseWebSocketOptions = {}) {
  const {
    autoConnect = false,
    reconnectOnMount = false,
    enableMetrics = true,
    connectionTimeout = 10000
  } = options;

  const container = useDIContainer();
  const webSocketService = container.getByToken<IEnterpriseWebSocketService>(
    TYPES.ENTERPRISE_WEBSOCKET_SERVICE
  );

  const [connectionState, setConnectionState] = useState<WebSocketConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastError: null,
    connectionState: 'disconnected'
  });

  const [metrics, setMetrics] = useState<WebSocketMetrics>({
    connectionMetrics: null,
    messagesReceived: 0,
    messagesSent: 0,
    averageLatency: 0,
    connectionUptime: 0
  });

  const metricsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update connection state
  const updateConnectionState = useCallback(() => {
    const isConnected = webSocketService.isConnected();
    const state = webSocketService.getConnectionState();

    setConnectionState(prev => ({
      ...prev,
      isConnected,
      connectionState: state,
      isConnecting: state === 'connecting',
      error: state === 'error' ? new Error('WebSocket connection error') : null,
      lastError: state === 'error' ? new Date() : prev.lastError
    }));
  }, [webSocketService]);

  // Update metrics
  const updateMetrics = useCallback(() => {
    if (!enableMetrics) return;

    const connectionMetrics = webSocketService.getConnectionMetrics();

    setMetrics(prev => ({
      connectionMetrics,
      messagesReceived: connectionMetrics.messagesReceived,
      messagesSent: connectionMetrics.messagesSent,
      averageLatency: connectionMetrics.averageLatency,
      connectionUptime: connectionMetrics.connectionUptime
    }));
  }, [webSocketService, enableMetrics]);

  // Connect to WebSocket
  const connect = useCallback(async (token: string) => {
    try {
      setConnectionState(prev => ({ ...prev, isConnecting: true, error: null }));

      await webSocketService.connect(token, {
        connectionTimeout,
        enableMetrics
      });

      updateConnectionState();

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Connection failed');
      setConnectionState(prev => ({
        ...prev,
        isConnecting: false,
        error: err,
        lastError: new Date(),
        connectionState: 'error'
      }));
      throw err;
    }
  }, [webSocketService, connectionTimeout, enableMetrics, updateConnectionState]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    updateConnectionState();
  }, [webSocketService, updateConnectionState]);

  // Send message
  const sendMessage = useCallback(async (message: Omit<WebSocketMessage, 'id' | 'timestamp'>) => {
    try {
      await webSocketService.sendMessage(message);
      updateMetrics();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to send message');
      setConnectionState(prev => ({
        ...prev,
        error: err,
        lastError: new Date()
      }));
      throw err;
    }
  }, [webSocketService, updateMetrics]);

  // Subscribe to WebSocket events
  const subscribe = useCallback((feature: string, listener: WebSocketEventListener) => {
    return webSocketService.subscribe(feature, {
      ...listener,
      onMessage: (message) => {
        updateMetrics();
        listener.onMessage?.(message);
      },
      onConnect: () => {
        updateConnectionState();
        listener.onConnect?.();
      },
      onDisconnect: () => {
        updateConnectionState();
        listener.onDisconnect?.();
      },
      onError: (error) => {
        updateConnectionState();
        listener.onError?.(error);
      }
    });
  }, [webSocketService, updateConnectionState, updateMetrics]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect || reconnectOnMount) {
      // In a real implementation, you would get the token from auth store
      // const token = getAuthToken();
      // if (token) {
      //   connect(token).catch(console.error);
      // }
    }
  }, [autoConnect, reconnectOnMount, connect]);

  // Set up metrics polling
  useEffect(() => {
    if (enableMetrics) {
      metricsIntervalRef.current = setInterval(() => {
        updateConnectionState();
        updateMetrics();
      }, 1000); // Update every second
    }

    return () => {
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
        metricsIntervalRef.current = null;
      }
    };
  }, [enableMetrics, updateConnectionState, updateMetrics]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
    };
  }, []);

  return {
    // Connection state
    ...connectionState,

    // Metrics
    ...metrics,

    // Actions
    connect,
    disconnect,
    sendMessage,
    subscribe,

    // Raw service access
    webSocketService
  };
}

/**
 * Feature WebSocket Hook
 * 
 * Hook for feature-specific WebSocket functionality.
 */
export function useFeatureWebSocket(options: UseFeatureWebSocketOptions) {
  const {
    feature,
    autoConnect = false,
    priority = 1,
    onMessage,
    onError,
    onConnect,
    onDisconnect
  } = options;

  const container = useDIContainer();
  const connectionManager = container.getByToken<IConnectionManager>(
    TYPES.CONNECTION_MANAGER
  );

  const webSocket = useEnterpriseWebSocket({
    autoConnect,
    enableMetrics: true
  });

  const [featureMessages, setFeatureMessages] = useState<WebSocketMessage[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Subscribe to feature messages
  useEffect(() => {
    if (webSocket.isConnected && !isSubscribed) {
      const unsubscribe = webSocket.subscribe(feature, {
        onMessage: (message) => {
          setFeatureMessages(prev => [message, ...prev.slice(0, 99)]); // Keep last 100 messages
          onMessage?.(message);
        },
        onError: (error) => {
          onError?.(error instanceof Error ? error : new Error('WebSocket error'));
        },
        onConnect: () => {
          setIsSubscribed(true);
          onConnect?.();
        },
        onDisconnect: () => {
          setIsSubscribed(false);
          onDisconnect?.();
        }
      });

      return () => {
        unsubscribe();
        setIsSubscribed(false);
      };
    }
  }, [webSocket.isConnected, feature, isSubscribed, onMessage, onError, onConnect, onDisconnect]);

  // Send feature-specific message
  const sendFeatureMessage = useCallback(async (type: string, payload: any, metadata?: any) => {
    return webSocket.sendMessage({
      type,
      feature,
      payload,
      metadata: {
        ...metadata,
        priority,
        sentAt: new Date().toISOString()
      }
    });
  }, [webSocket, feature, priority]);

  // Clear feature messages
  const clearMessages = useCallback(() => {
    setFeatureMessages([]);
  }, []);

  return {
    // Connection state from main hook
    ...webSocket,

    // Feature-specific state
    featureMessages,
    isSubscribed,

    // Feature-specific actions
    sendFeatureMessage,
    clearMessages,

    // Feature info
    feature,
    priority
  };
}

/**
 * WebSocket Connection Hook
 * 
 * Hook focused on connection management and monitoring.
 */
export function useWebSocketConnection() {
  const container = useDIContainer();
  const connectionManager = container.getByToken<IConnectionManager>(
    TYPES.CONNECTION_MANAGER
  );

  const [connections, setConnections] = useState(connectionManager.getAllConnections());
  const [healthStatus, setHealthStatus] = useState<Record<string, any>>({});

  // Refresh connections
  const refreshConnections = useCallback(() => {
    setConnections(connectionManager.getAllConnections());
  }, [connectionManager]);

  // Get connection health
  const getConnectionHealth = useCallback(async (connectionId: string) => {
    const health = connectionManager.getConnectionHealth(connectionId);
    setHealthStatus(prev => ({
      ...prev,
      [connectionId]: health
    }));
    return health;
  }, [connectionManager]);

  // Create new connection
  const createConnection = useCallback(async (feature: string, priority?: number) => {
    const connectionId = await connectionManager.createConnection(feature, priority);
    refreshConnections();
    return connectionId;
  }, [connectionManager, refreshConnections]);

  // Remove connection
  const removeConnection = useCallback(async (connectionId: string) => {
    await connectionManager.removeConnection(connectionId);
    refreshConnections();
  }, [connectionManager, refreshConnections]);

  // Perform health check
  const performHealthCheck = useCallback(async () => {
    await connectionManager.performHealthCheck();
    refreshConnections();
  }, [connectionManager, refreshConnections]);

  // Auto-refresh connections
  useEffect(() => {
    const interval = setInterval(() => {
      refreshConnections();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [refreshConnections]);

  return {
    connections,
    healthStatus,
    refreshConnections,
    getConnectionHealth,
    createConnection,
    removeConnection,
    performHealthCheck,
    connectionManager
  };
}

/**
 * WebSocket Metrics Hook
 * 
 * Hook for WebSocket performance metrics and monitoring.
 */
export function useWebSocketMetrics() {
  const container = useDIContainer();
  const messageRouter = container.getByToken<IMessageRouter>(
    TYPES.MESSAGE_ROUTER
  );

  const [metrics, setMetrics] = useState(messageRouter.getMetrics());

  // Refresh metrics
  const refreshMetrics = useCallback(() => {
    setMetrics(messageRouter.getMetrics());
  }, [messageRouter]);

  // Clear metrics
  const clearMetrics = useCallback(() => {
    messageRouter.clearMetrics();
    setMetrics(messageRouter.getMetrics());
  }, [messageRouter]);

  // Auto-refresh metrics
  useEffect(() => {
    const interval = setInterval(() => {
      refreshMetrics();
    }, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, [refreshMetrics]);

  return {
    metrics,
    refreshMetrics,
    clearMetrics,
    messageRouter
  };
}
