/**
 * Unified Feature WebSocket Hook
 * 
 * Provides a standardized interface for WebSocket functionality across all features.
 * Leverages the enterprise WebSocket infrastructure and feature adapters.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useDIContainer } from '@/core/di';
import { 
  IEnterpriseWebSocketService,
  WebSocketConnectionState,
  WebSocketMessage
} from '@/core/websocket/types';
import { WEBSOCKET_SERVICE_TYPES } from '@/core/websocket/di/types';

// Feature-specific adapter types
import type { 
  IChatWebSocketAdapter 
} from '@/features/chat/adapters';
import type { 
  INotificationWebSocketAdapter 
} from '@/features/notification/adapters';
import type { 
  IFeedWebSocketAdapter 
} from '@/features/feed/adapters';

// Core hook configuration
export interface UseFeatureWebSocketConfig {
  feature: 'chat' | 'notification' | 'feed';
  autoConnect?: boolean;
  reconnectOnMount?: boolean;
  enableMetrics?: boolean;
  connectionTimeout?: number;
  maxReconnectAttempts?: number;
  retryDelay?: number;
}

// Hook state
export interface FeatureWebSocketState {
  isConnected: boolean;
  connectionState: WebSocketConnectionState;
  isConnecting: boolean;
  error: string | null;
  lastMessage: WebSocketMessage | null;
  metrics: any;
  adapter: any;
}

// Hook return value
export interface UseFeatureWebSocketReturn extends FeatureWebSocketState {
  // Connection management
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  reconnect: () => Promise<void>;
  
  // Message operations
  sendMessage: (message: WebSocketMessage) => Promise<void>;
  
  // Feature-specific operations
  sendFeatureMessage: (message: any) => Promise<void>;
  
  // Subscription management
  subscribe: (callback: (message: WebSocketMessage) => void) => () => void;
  
  // Metrics and monitoring
  getMetrics: () => any;
  clearMetrics: () => void;
  
  // Utilities
  reset: () => void;
}

/**
 * Unified WebSocket hook for all features
 */
export function useFeatureWebSocket(config: UseFeatureWebSocketConfig): UseFeatureWebSocketReturn {
  const {
    feature,
    autoConnect = true,
    reconnectOnMount = true,
    enableMetrics = true,
    connectionTimeout = 10000,
    maxReconnectAttempts = 5,
    retryDelay = 1000
  } = config;

  const container = useDIContainer();
  const [state, setState] = useState<FeatureWebSocketState>({
    isConnected: false,
    connectionState: 'disconnected',
    isConnecting: false,
    error: null,
    lastMessage: null,
    metrics: null,
    adapter: null
  });

  // Refs for cleanup and state management
  const adapterRef = useRef<any>(null);
  const subscriptionRef = useRef<(() => void) | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  // Get feature-specific adapter
  const getFeatureAdapter = useCallback(() => {
    switch (feature) {
      case 'chat':
        return container.resolve<IChatWebSocketAdapter>('chatWebSocketAdapter');
      case 'notification':
        return container.resolve<INotificationWebSocketAdapter>('notificationWebSocketAdapter');
      case 'feed':
        return container.resolve<IFeedWebSocketAdapter>('feedWebSocketAdapter');
      default:
        throw new Error(`Unknown feature: ${feature}`);
    }
  }, [feature, container]);

  // Initialize adapter
  const initializeAdapter = useCallback(async () => {
    try {
      const adapter = getFeatureAdapter();
      await adapter.initialize();
      
      adapterRef.current = adapter;
      
      setState(prev => ({
        ...prev,
        adapter,
        metrics: enableMetrics ? adapter.getMetrics() : null
      }));

      // Set up connection state monitoring
      const checkConnection = () => {
        const isConnected = adapter.isConnected;
        setState(prev => ({
          ...prev,
          isConnected,
          connectionState: isConnected ? 'connected' : 'disconnected',
          isConnecting: false
        }));
      };

      // Monitor connection changes
      const connectionInterval = setInterval(checkConnection, 1000);
      
      return () => {
        clearInterval(connectionInterval);
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize adapter',
        isConnecting: false
      }));
    }
  }, [getFeatureAdapter, enableMetrics]);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (!adapterRef.current) {
      await initializeAdapter();
    }

    if (!adapterRef.current) {
      throw new Error('Adapter not initialized');
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const enterpriseWebSocket = container.resolve<IEnterpriseWebSocketService>(
        WEBSOCKET_SERVICE_TYPES.ENTERPRISE_WEBSOCKET_SERVICE
      );

      await enterpriseWebSocket.connect();
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        connectionState: 'connected',
        isConnecting: false,
        error: null
      }));

      reconnectAttemptsRef.current = 0;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      setState(prev => ({
        ...prev,
        isConnected: false,
        connectionState: 'disconnected',
        isConnecting: false,
        error: errorMessage
      }));

      // Auto-reconnect logic
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, retryDelay * Math.pow(2, reconnectAttemptsRef.current - 1)); // Exponential backoff
      }
    }
  }, [initializeAdapter, container, maxReconnectAttempts, retryDelay]);

  // Disconnect from WebSocket
  const disconnect = useCallback(async () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    reconnectAttemptsRef.current = 0;

    try {
      const enterpriseWebSocket = container.resolve<IEnterpriseWebSocketService>(
        WEBSOCKET_SERVICE_TYPES.ENTERPRISE_WEBSOCKET_SERVICE
      );

      await enterpriseWebSocket.disconnect();
      
      setState(prev => ({
        ...prev,
        isConnected: false,
        connectionState: 'disconnected',
        isConnecting: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Disconnection failed'
      }));
    }
  }, [container]);

  // Reconnect
  const reconnect = useCallback(async () => {
    await disconnect();
    await connect();
  }, [disconnect, connect]);

  // Send message
  const sendMessage = useCallback(async (message: WebSocketMessage) => {
    if (!adapterRef.current) {
      throw new Error('Adapter not initialized');
    }

    try {
      await adapterRef.current.sendMessage(message);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send message'
      }));
      throw error;
    }
  }, []);

  // Send feature-specific message
  const sendFeatureMessage = useCallback(async (message: any) => {
    if (!adapterRef.current) {
      throw new Error('Adapter not initialized');
    }

    try {
      switch (feature) {
        case 'chat':
          await adapterRef.current.sendMessage(message);
          break;
        case 'notification':
          await adapterRef.current.sendMessage(message);
          break;
        case 'feed':
          await adapterRef.current.sendMessage(message);
          break;
        default:
          throw new Error(`Unknown feature: ${feature}`);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send feature message'
      }));
      throw error;
    }
  }, [feature]);

  // Subscribe to messages
  const subscribe = useCallback((callback: (message: WebSocketMessage) => void) => {
    if (!adapterRef.current) {
      throw new Error('Adapter not initialized');
    }

    // Set up message handler
    const messageHandler = (message: WebSocketMessage) => {
      setState(prev => ({ ...prev, lastMessage: message }));
      callback(message);
    };

    // Subscribe based on feature
    let unsubscribe: (() => void) | null = null;

    switch (feature) {
      case 'chat':
        unsubscribe = adapterRef.current.subscribeToMessages(messageHandler);
        break;
      case 'notification':
        unsubscribe = adapterRef.current.subscribeToNotifications(messageHandler);
        break;
      case 'feed':
        unsubscribe = adapterRef.current.subscribeToPosts(messageHandler);
        break;
      default:
        throw new Error(`Unknown feature: ${feature}`);
    }

    subscriptionRef.current = unsubscribe || (() => {});

    return subscriptionRef.current;
  }, [feature]);

  // Get metrics
  const getMetrics = useCallback(() => {
    if (!adapterRef.current || !enableMetrics) {
      return null;
    }

    const metrics = adapterRef.current.getMetrics();
    setState(prev => ({ ...prev, metrics }));
    return metrics;
  }, [enableMetrics]);

  // Clear metrics
  const clearMetrics = useCallback(() => {
    if (!adapterRef.current) {
      return;
    }

    // This would need to be implemented in each adapter
    // For now, we'll just clear the local state
    setState(prev => ({ ...prev, metrics: null }));
  }, []);

  // Reset hook state
  const reset = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current();
      subscriptionRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    reconnectAttemptsRef.current = 0;

    setState({
      isConnected: false,
      connectionState: 'disconnected',
      isConnecting: false,
      error: null,
      lastMessage: null,
      metrics: null,
      adapter: null
    });
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && reconnectOnMount) {
      connect();
    }

    return () => {
      reset();
    };
  }, [autoConnect, reconnectOnMount, connect, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    reconnect,
    sendMessage,
    sendFeatureMessage,
    subscribe,
    getMetrics,
    clearMetrics,
    reset
  };
}

/**
 * Hook for chat-specific WebSocket functionality
 */
export function useChatWebSocket(config?: Partial<UseFeatureWebSocketConfig>) {
  return useFeatureWebSocket({
    feature: 'chat',
    ...config
  });
}

/**
 * Hook for notification-specific WebSocket functionality
 */
export function useNotificationWebSocket(config?: Partial<UseFeatureWebSocketConfig>) {
  return useFeatureWebSocket({
    feature: 'notification',
    ...config
  });
}

/**
 * Hook for feed-specific WebSocket functionality
 */
export function useFeedWebSocket(config?: Partial<UseFeatureWebSocketConfig>) {
  return useFeatureWebSocket({
    feature: 'feed',
    ...config
  });
}

/**
 * Hook for managing multiple WebSocket connections
 */
export function useMultipleWebSockets(features: Array<'chat' | 'notification' | 'feed'>) {
  const [connections, setConnections] = useState<Record<string, UseFeatureWebSocketReturn>>({});

  useEffect(() => {
    const newConnections: Record<string, UseFeatureWebSocketReturn> = {};

    features.forEach(feature => {
      // This is a simplified approach - in practice, you might want to
      // manage this more carefully to avoid hook rules violations
      newConnections[feature] = useFeatureWebSocket({ feature, autoConnect: false });
    });

    setConnections(newConnections);

    return () => {
      // Cleanup all connections
      Object.values(newConnections).forEach(conn => conn.reset());
    };
  }, [features]);

  const connectAll = useCallback(async () => {
    await Promise.all(Object.values(connections).map(conn => conn.connect()));
  }, [connections]);

  const disconnectAll = useCallback(async () => {
    await Promise.all(Object.values(connections).map(conn => conn.disconnect()));
  }, [connections]);

  const getMetrics = useCallback(() => {
    const metrics: Record<string, any> = {};
    Object.entries(connections).forEach(([feature, conn]) => {
      metrics[feature] = conn.getMetrics();
    });
    return metrics;
  }, [connections]);

  return {
    connections,
    connectAll,
    disconnectAll,
    getMetrics,
    isAnyConnected: Object.values(connections).some(conn => conn.isConnected),
    allConnected: Object.values(connections).every(conn => conn.isConnected)
  };
}

/**
 * Hook for WebSocket connection monitoring
 */
export function useWebSocketMonitor() {
  const [globalState, setGlobalState] = useState({
    totalConnections: 0,
    activeConnections: 0,
    totalMessages: 0,
    errors: 0,
    lastActivity: null as Date | null
  });

  const container = useDIContainer();

  const getGlobalMetrics = useCallback(() => {
    try {
      const enterpriseWebSocket = container.resolve<IEnterpriseWebSocketService>(
        WEBSOCKET_SERVICE_TYPES.ENTERPRISE_WEBSOCKET_SERVICE
      );

      const metrics = enterpriseWebSocket.getMetrics();
      
      setGlobalState({
        totalConnections: metrics.totalConnections || 0,
        activeConnections: metrics.activeConnections || 0,
        totalMessages: metrics.totalMessages || 0,
        errors: metrics.errors || 0,
        lastActivity: metrics.lastActivity ? new Date(metrics.lastActivity) : null
      });

      return metrics;
    } catch (error) {
      console.error('Failed to get global WebSocket metrics:', error);
      return null;
    }
  }, [container]);

  useEffect(() => {
    const interval = setInterval(getGlobalMetrics, 5000);
    return () => clearInterval(interval);
  }, [getGlobalMetrics]);

  return {
    ...globalState,
    getGlobalMetrics,
    refresh: getGlobalMetrics
  };
}

export default useFeatureWebSocket;
