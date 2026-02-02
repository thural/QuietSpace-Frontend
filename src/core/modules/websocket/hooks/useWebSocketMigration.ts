/**
 * WebSocket Migration Hook
 *
 * Utility hook to help migrate from legacy WebSocket implementations
 * to the new standardized enterprise WebSocket hooks.
 * Provides backward compatibility and gradual migration capabilities.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

import { useEnterpriseWebSocket } from './useEnterpriseWebSocket';

// Migration configuration
export interface WebSocketMigrationConfig {
  feature: 'chat' | 'notification' | 'feed';
  useLegacyImplementation?: boolean;
  enableFallback?: boolean;
  migrationMode?: 'legacy' | 'hybrid' | 'enterprise';
  logMigrationEvents?: boolean;
  fallbackTimeout?: number;
}

// Migration state
export interface WebSocketMigrationState {
  mode: 'legacy' | 'hybrid' | 'enterprise';
  isUsingLegacy: boolean;
  isUsingEnterprise: boolean;
  fallbackTriggered: boolean;
  migrationEvents: MigrationEvent[];
  performance: {
    legacyLatency?: number;
    enterpriseLatency?: number;
    improvement?: number;
  };
}

// Migration event
export interface MigrationEvent {
  timestamp: number;
  type: 'mode_switch' | 'fallback_triggered' | 'performance_comparison' | 'error';
  data: unknown;
  message: string;
}

// Performance comparison data interface
interface PerformanceComparisonData {
  improvement: number;
  legacyLatency?: number;
  enterpriseLatency?: number;
}

// Type guard for performance comparison data
function isPerformanceComparisonData(data: unknown): data is PerformanceComparisonData {
  return typeof data === 'object' && data !== null && 'improvement' in data;
}

// Legacy WebSocket interface (for backward compatibility)
export interface LegacyWebSocket {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendMessage: (message: unknown) => Promise<void>;
  subscribe: (callback: (message: unknown) => void) => () => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

// Migration hook return value
export interface UseWebSocketMigrationReturn {
  // Current state
  state: WebSocketMigrationState;

  // WebSocket operations (unified interface)
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendMessage: (message: unknown) => Promise<void>;
  subscribe: (callback: (message: unknown) => void) => () => void;

  // State getters
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;

  // Migration controls
  switchToLegacy: () => void;
  switchToEnterprise: () => void;
  switchToHybrid: () => void;

  // Utilities
  addMigrationEvent: (type: MigrationEvent['type'], data: unknown, message: string) => void;
  clearMigrationEvents: () => void;
  getMigrationReport: () => MigrationReport;
}

// Migration report
export interface MigrationReport {
  feature: string;
  totalEvents: number;
  fallbackCount: number;
  performanceImprovement: number;
  recommendedMode: 'legacy' | 'hybrid' | 'enterprise';
  issues: string[];
}

/**
 * WebSocket migration hook
 */
export function useWebSocketMigration(config: WebSocketMigrationConfig): UseWebSocketMigrationReturn {
  const {
    feature,
    useLegacyImplementation = false,
    enableFallback = true,
    migrationMode = 'hybrid',
    logMigrationEvents = true,
    fallbackTimeout = 5000
  } = config;

  const [state, setState] = useState<WebSocketMigrationState>({
    mode: migrationMode,
    isUsingLegacy: migrationMode === 'legacy' || (migrationMode === 'hybrid' && useLegacyImplementation),
    isUsingEnterprise: migrationMode === 'enterprise' || (migrationMode === 'hybrid' && !useLegacyImplementation),
    fallbackTriggered: false,
    migrationEvents: [],
    performance: {}
  });

  // Refs for timing and state management
  const legacyStartTimeRef = useRef<number>(0);
  const enterpriseStartTimeRef = useRef<number>(0);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get appropriate hook based on feature
  const getEnterpriseHook = () => {
    // Use the unified enterprise WebSocket hook for all features
    return useEnterpriseWebSocket({ autoConnect: false });
  };

  // Get legacy implementation (mock for now - would be actual legacy hook)
  const getLegacyImplementation = (): LegacyWebSocket => {
    // This would be replaced with actual legacy WebSocket implementation
    return {
      connect: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
      },
      disconnect: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
      },
      sendMessage: async (message) => {
        await new Promise(resolve => setTimeout(resolve, 100));
      },
      subscribe: (callback) => {
        // Mock subscription
        const interval = setInterval(() => {
          callback({ type: 'mock_message', data: 'legacy_data' });
        }, 5000);
        return () => clearInterval(interval);
      },
      isConnected: false,
      isConnecting: false,
      error: null
    };
  };

  const enterpriseHook = getEnterpriseHook();
  const legacyImpl = getLegacyImplementation();

  // Add migration event
  const addMigrationEvent = useCallback((type: MigrationEvent['type'], data: unknown, message: string) => {
    if (!logMigrationEvents) return;

    const event: MigrationEvent = {
      timestamp: Date.now(),
      type,
      data,
      message
    };

    setState(prev => ({
      ...prev,
      migrationEvents: [event, ...prev.migrationEvents.slice(0, 99)] // Keep last 100 events
    }));
  }, [logMigrationEvents]);

  // Switch to legacy mode
  const switchToLegacy = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: 'legacy',
      isUsingLegacy: true,
      isUsingEnterprise: false
    }));

    addMigrationEvent('mode_switch', { newMode: 'legacy' }, 'Switched to legacy implementation');
  }, [addMigrationEvent]);

  // Switch to enterprise mode
  const switchToEnterprise = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: 'enterprise',
      isUsingLegacy: false,
      isUsingEnterprise: true
    }));

    addMigrationEvent('mode_switch', { newMode: 'enterprise' }, 'Switched to enterprise implementation');
  }, [addMigrationEvent]);

  // Switch to hybrid mode
  const switchToHybrid = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: 'hybrid',
      isUsingLegacy: useLegacyImplementation,
      isUsingEnterprise: !useLegacyImplementation
    }));

    addMigrationEvent('mode_switch', { newMode: 'hybrid' }, 'Switched to hybrid mode');
  }, [useLegacyImplementation, addMigrationEvent]);

  // Trigger fallback
  const triggerFallback = useCallback((reason: string) => {
    if (!enableFallback) return;

    setState(prev => ({
      ...prev,
      fallbackTriggered: true,
      isUsingLegacy: true,
      isUsingEnterprise: false
    }));

    addMigrationEvent('fallback_triggered', { reason }, `Fallback triggered: ${reason}`);
  }, [enableFallback, addMigrationEvent]);

  // Connect with performance measurement
  const connect = useCallback(async () => {
    const startTime = Date.now();

    try {
      if (state.isUsingEnterprise) {
        enterpriseStartTimeRef.current = Date.now();
        // Enterprise WebSocket requires a token - use mock token for migration
        await enterpriseHook.connect('mock-migration-token');

        const latency = Date.now() - enterpriseStartTimeRef.current;
        setState(prev => ({
          ...prev,
          performance: {
            ...prev.performance,
            enterpriseLatency: latency
          }
        }));

        addMigrationEvent('performance_comparison', {
          type: 'enterprise_connect',
          latency
        }, `Enterprise connect took ${latency}ms`);

      } else if (state.isUsingLegacy) {
        legacyStartTimeRef.current = Date.now();
        await legacyImpl.connect();

        const latency = Date.now() - legacyStartTimeRef.current;
        setState(prev => ({
          ...prev,
          performance: {
            ...prev.performance,
            legacyLatency: latency
          }
        }));

        addMigrationEvent('performance_comparison', {
          type: 'legacy_connect',
          latency
        }, `Legacy connect took ${latency}ms`);

      } else {
        // Hybrid mode - try enterprise first
        try {
          enterpriseStartTimeRef.current = Date.now();
          await enterpriseHook.connect('mock-migration-token');

          const enterpriseLatency = Date.now() - enterpriseStartTimeRef.current;

          // Set fallback timeout
          if (enableFallback) {
            fallbackTimeoutRef.current = setTimeout(() => {
              triggerFallback('Enterprise connection timeout');
            }, fallbackTimeout);
          }

          setState(prev => ({
            ...prev,
            performance: {
              ...prev.performance,
              enterpriseLatency
            }
          }));

        } catch (error) {
          if (enableFallback) {
            triggerFallback(`Enterprise connection failed: ${error}`);
            await legacyImpl.connect();
          } else {
            throw error;
          }
        }
      }

    } catch (error) {
      addMigrationEvent('error', { error }, `Connection failed: ${error}`);
      throw error;
    }

    // Calculate performance improvement
    if (state.performance.legacyLatency && state.performance.enterpriseLatency) {
      const improvement = ((state.performance.legacyLatency - state.performance.enterpriseLatency) / state.performance.legacyLatency) * 100;
      setState(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          improvement
        }
      }));
    }

  }, [state.isUsingEnterprise, state.isUsingLegacy, state.performance.legacyLatency, state.performance.enterpriseLatency, enterpriseHook, legacyImpl, enableFallback, fallbackTimeout, triggerFallback, addMigrationEvent]);

  // Disconnect
  const disconnect = useCallback(async () => {
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }

    try {
      if (state.isUsingEnterprise) {
        await enterpriseHook.disconnect();
      } else if (state.isUsingLegacy) {
        await legacyImpl.disconnect();
      }
    } catch (error) {
      addMigrationEvent('error', { error }, `Disconnection failed: ${error}`);
      throw error;
    }
  }, [state.isUsingEnterprise, state.isUsingLegacy, enterpriseHook, legacyImpl, addMigrationEvent]);

  // Send message - using unified enterprise WebSocket interface
  const sendMessage = useCallback(async (message: unknown) => {
    try {
      if (state.isUsingEnterprise) {
        // Enterprise WebSocket uses unified sendMessage with WebSocketMessage format
        // Convert feature-specific message to WebSocketMessage format
        let webSocketMessage: unknown;

        switch (feature) {
          case 'chat':
            // Convert chat message to WebSocketMessage
            if (typeof message === 'object' && message !== null && 'chatId' in message && 'content' in message) {
              webSocketMessage = {
                type: 'chat_message',
                feature: 'chat',
                data: {
                  chatId: message.chatId,
                  content: message.content,
                  type: (message as { type?: string }).type || 'text'
                }
              };
            } else {
              throw new Error('Chat sendMessage requires { chatId, content } object');
            }
            break;
          case 'notification':
            // Convert notification action to WebSocketMessage
            if (typeof message === 'object' && message !== null && 'action' in message) {
              webSocketMessage = {
                type: 'notification_action',
                feature: 'notification',
                data: message
              };
            } else {
              throw new Error('Notification sendMessage requires { action, ...data } object');
            }
            break;
          case 'feed':
            // Convert feed action to WebSocketMessage
            if (typeof message === 'object' && message !== null && 'action' in message) {
              webSocketMessage = {
                type: 'feed_action',
                feature: 'feed',
                data: message
              };
            } else {
              throw new Error('Feed sendMessage requires { action, ...data } object');
            }
            break;
          default:
            throw new Error(`Unknown feature: ${feature}`);
        }

        await enterpriseHook.sendMessage(webSocketMessage);
      } else if (state.isUsingLegacy) {
        await legacyImpl.sendMessage(message);
      }
    } catch (error) {
      addMigrationEvent('error', { error, message }, `Send message failed: ${error}`);
      throw error;
    }
  }, [state.isUsingEnterprise, state.isUsingLegacy, enterpriseHook, legacyImpl, addMigrationEvent, feature]);

  // Subscribe
  const subscribe = useCallback((callback: (message: unknown) => void) => {
    try {
      if (state.isUsingEnterprise) {
        // Enterprise WebSocket subscribe requires feature and listener
        return enterpriseHook.subscribe(feature, {
          onMessage: (message) => callback(message.payload),
          onConnect: () => { },
          onDisconnect: () => { },
          onError: () => { }
        });
      } else if (state.isUsingLegacy) {
        return legacyImpl.subscribe(callback);
      }
    } catch (error) {
      addMigrationEvent('error', { error }, `Subscription failed: ${error}`);
      throw error;
    }

    // Should never reach here, but TypeScript needs this
    return () => { };
  }, [state.isUsingEnterprise, state.isUsingLegacy, enterpriseHook, legacyImpl, addMigrationEvent, feature]);

  // Get connection state
  const isConnected = state.isUsingEnterprise ? enterpriseHook.isConnected : legacyImpl.isConnected;
  const isConnecting = state.isUsingEnterprise ? enterpriseHook.isConnecting : legacyImpl.isConnecting;
  const error = state.isUsingEnterprise
    ? (enterpriseHook.error ? enterpriseHook.error.message : null)
    : legacyImpl.error;

  // Clear migration events
  const clearMigrationEvents = useCallback(() => {
    setState(prev => ({ ...prev, migrationEvents: [] }));
  }, []);

  // Get migration report
  const getMigrationReport = useCallback((): MigrationReport => {
    const fallbackCount = state.migrationEvents.filter(e => e.type === 'fallback_triggered').length;
    const performanceEvents = state.migrationEvents.filter(e => e.type === 'performance_comparison');

    let recommendedMode: 'legacy' | 'hybrid' | 'enterprise' = 'enterprise';
    const issues: string[] = [];

    if (fallbackCount > 5) {
      recommendedMode = 'legacy';
      issues.push('High fallback count - enterprise implementation may be unstable');
    } else if (fallbackCount > 0) {
      recommendedMode = 'hybrid';
      issues.push('Some fallbacks occurred - consider hybrid approach');
    }

    // Analyze performance events for additional insights
    if (performanceEvents.length > 0) {
      const negativePerformanceEvents = performanceEvents.filter(e =>
        isPerformanceComparisonData(e.data) && e.data.improvement < 0
      ).length;

      if (negativePerformanceEvents > performanceEvents.length / 2) {
        recommendedMode = 'legacy';
        issues.push('Majority of performance comparisons show degradation');
      }
    }

    if (state.performance.improvement && state.performance.improvement < 0) {
      recommendedMode = 'legacy';
      issues.push('Enterprise implementation is slower than legacy');
    }

    return {
      feature,
      totalEvents: state.migrationEvents.length,
      fallbackCount,
      performanceImprovement: state.performance.improvement || 0,
      recommendedMode,
      issues
    };
  }, [state.migrationEvents, state.performance.improvement, feature]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
      }
    };
  }, []);

  return {
    state,
    connect,
    disconnect,
    sendMessage,
    subscribe,
    isConnected,
    isConnecting,
    error,
    switchToLegacy,
    switchToEnterprise,
    switchToHybrid,
    addMigrationEvent,
    clearMigrationEvents,
    getMigrationReport
  };
}

/**
 * Hook for managing multiple feature migrations
 */
export function useMultiFeatureMigration(features: ('chat' | 'notification' | 'feed')[]) {
  const migrations = features.map(feature =>
    useWebSocketMigration({ feature })
  );

  const connectAll = useCallback(async () => {
    await Promise.all(migrations.map(migration => migration.connect()));
  }, [migrations]);

  const disconnectAll = useCallback(async () => {
    await Promise.all(migrations.map(migration => migration.disconnect()));
  }, [migrations]);

  const switchAllToEnterprise = useCallback(() => {
    migrations.forEach(migration => migration.switchToEnterprise());
  }, [migrations]);

  const switchAllToLegacy = useCallback(() => {
    migrations.forEach(migration => migration.switchToLegacy());
  }, [migrations]);

  return {
    migrations,
    connectAll,
    disconnectAll,
    switchAllToEnterprise,
    switchAllToLegacy
  };
}

export default useWebSocketMigration;
