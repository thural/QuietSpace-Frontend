/**
 * WebSocket Hooks
 * 
 * Exports all WebSocket hooks for enterprise-grade real-time functionality.
 * Provides standardized interfaces for all features with migration support.
 */

// Core unified hook
export { useFeatureWebSocket } from './useFeatureWebSocket';
export type { 
  UseFeatureWebSocketConfig,
  UseFeatureWebSocketReturn,
  FeatureWebSocketState
} from './useFeatureWebSocket';

// Feature-specific hooks
export { useChatWebSocket } from './useFeatureWebSocket';
export { useNotificationWebSocket } from './useFeatureWebSocket';
export { useFeedWebSocket } from './useFeatureWebSocket';

// Advanced feature hooks
export { default as useChatWebSocketHook } from './useChatWebSocketHook';
export type { 
  UseChatWebSocketConfig,
  UseChatWebSocketReturn,
  ChatWebSocketState
} from './useChatWebSocketHook';

export { default as useNotificationWebSocketHook } from './useNotificationWebSocketHook';
export type { 
  UseNotificationWebSocketConfig,
  UseNotificationWebSocketReturn,
  NotificationWebSocketState
} from './useNotificationWebSocketHook';

export { default as useFeedWebSocketHook } from './useFeedWebSocketHook';
export type { 
  UseFeedWebSocketConfig,
  UseFeedWebSocketReturn,
  FeedWebSocketState
} from './useFeedWebSocketHook';

// Migration utilities
export { 
  useWebSocketMigration,
  useMultiFeatureMigration
} from './useWebSocketMigration';
export type { 
  WebSocketMigrationConfig,
  WebSocketMigrationState,
  MigrationEvent,
  MigrationReport,
  UseWebSocketMigrationReturn,
  LegacyWebSocket
} from './useWebSocketMigration';

// Monitoring hooks
export { 
  useWebSocketMonitor,
  useMultipleWebSockets
} from './useFeatureWebSocket';

// Re-export core types for convenience
export type {
  WebSocketConnectionState,
  WebSocketMessage
} from '@/core/websocket/types';

// Feature adapter types for convenience
export type {
  IChatWebSocketAdapter
} from '@/features/chat/adapters';

export type {
  INotificationWebSocketAdapter
} from '@/features/notification/adapters';

export type {
  IFeedWebSocketAdapter
} from '@/features/feed/adapters';

// Utility functions
export const WEBSOCKET_HOOKS = {
  // Core hooks
  FEATURE: 'useFeatureWebSocket',
  MONITOR: 'useWebSocketMonitor',
  MULTIPLE: 'useMultipleWebSockets',
  
  // Feature-specific hooks
  CHAT: 'useChatWebSocket',
  NOTIFICATION: 'useNotificationWebSocket',
  FEED: 'useFeedWebSocket',
  
  // Advanced hooks
  CHAT_ADVANCED: 'useChatWebSocketHook',
  NOTIFICATION_ADVANCED: 'useNotificationWebSocketHook',
  FEED_ADVANCED: 'useFeedWebSocketHook',
  
  // Migration hooks
  MIGRATION: 'useWebSocketMigration',
  MULTI_MIGRATION: 'useMultiFeatureMigration'
} as const;

// Default configurations
export const DEFAULT_WEBSOCKET_CONFIG = {
  autoConnect: true,
  reconnectOnMount: true,
  enableMetrics: true,
  connectionTimeout: 10000,
  maxReconnectAttempts: 5,
  retryDelay: 1000
} as const;

export const DEFAULT_CHAT_CONFIG = {
  autoConnect: true,
  enablePresence: true,
  enableTypingIndicators: true,
  enableReadReceipts: true,
  enableMessageHistory: true,
  maxHistorySize: 100,
  presenceUpdateInterval: 30000,
  typingTimeout: 3000
} as const;

export const DEFAULT_NOTIFICATION_CONFIG = {
  autoConnect: true,
  enablePushNotifications: true,
  enableBatchProcessing: true,
  enablePriorityFiltering: true,
  maxNotifications: 100,
  batchSize: 10,
  batchTimeout: 5000,
  retentionPeriod: 86400000 // 24 hours
} as const;

export const DEFAULT_FEED_CONFIG = {
  autoConnect: true,
  enableRealtimeUpdates: true,
  enableTrendingUpdates: true,
  enableBatchProcessing: true,
  enablePersonalization: true,
  maxPosts: 100,
  batchSize: 10,
  batchTimeout: 2000,
  trendingRefreshInterval: 30000,
  enableContentFiltering: true
} as const;

export const DEFAULT_MIGRATION_CONFIG = {
  useLegacyImplementation: false,
  enableFallback: true,
  migrationMode: 'hybrid' as const,
  logMigrationEvents: true,
  fallbackTimeout: 5000
} as const;

// Utility functions
export function createWebSocketConfig<T extends Record<string, any>>(
  defaults: T,
  overrides: Partial<T>
): T {
  return { ...defaults, ...overrides };
}

export function validateWebSocketConfig(config: any): boolean {
  return (
    config &&
    typeof config.feature === 'string' &&
    ['chat', 'notification', 'feed'].includes(config.feature)
  );
}

export function getFeatureHook(feature: 'chat' | 'notification' | 'feed') {
  switch (feature) {
    case 'chat':
      return useChatWebSocket;
    case 'notification':
      return useNotificationWebSocket;
    case 'feed':
      return useFeedWebSocket;
    default:
      throw new Error(`Unknown feature: ${feature}`);
  }
}

export function getAdvancedFeatureHook(feature: 'chat' | 'notification' | 'feed') {
  switch (feature) {
    case 'chat':
      return useChatWebSocketHook;
    case 'notification':
      return useNotificationWebSocketHook;
    case 'feed':
      return useFeedWebSocketHook;
    default:
      throw new Error(`Unknown feature: ${feature}`);
  }
}

// Performance monitoring utilities
export function measureWebSocketPerformance(hook: any) {
  const startTime = performance.now();
  
  return {
    ...hook,
    getPerformanceMetrics: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      return {
        connectionTime: duration,
        messageLatency: hook.metrics?.averageUpdateLatency || 0,
        cacheHitRate: hook.metrics?.cacheHitRate || 0,
        errorRate: hook.metrics?.errorRate || 0
      };
    }
  };
}

// Migration utilities
export function createMigrationStrategy(
  features: Array<'chat' | 'notification' | 'feed'>,
  strategy: 'gradual' | 'immediate' | 'monitored'
) {
  return {
    features,
    strategy,
    getConfig: (feature: string) => {
      switch (strategy) {
        case 'gradual':
          return { feature, migrationMode: 'hybrid' as const };
        case 'immediate':
          return { feature, migrationMode: 'enterprise' as const };
        case 'monitored':
          return { 
            feature, 
            migrationMode: 'hybrid' as const,
            logMigrationEvents: true,
            enableFallback: true
          };
        default:
          return { feature, migrationMode: 'legacy' as const };
      }
    }
  };
}

// Error handling utilities
export function handleWebSocketError(error: any, context: string) {
  console.error(`WebSocket error in ${context}:`, error);
  
  // You could integrate with error reporting services here
  if (error.code === 'ECONNREFUSED') {
    console.warn('Connection refused - check WebSocket server status');
  } else if (error.code === 'ETIMEDOUT') {
    console.warn('Connection timeout - check network connectivity');
  } else if (error.message?.includes('401')) {
    console.warn('Authentication failed - check token validity');
  }
  
  return {
    handled: true,
    context,
    timestamp: Date.now(),
    error: error.message || 'Unknown WebSocket error'
  };
}

// Connection health utilities
export function checkConnectionHealth(hook: any) {
  const metrics = hook.getMetrics?.();
  
  if (!metrics) {
    return { healthy: false, reason: 'No metrics available' };
  }
  
  const issues = [];
  
  if (metrics.connectionUptime < 60000) { // Less than 1 minute
    issues.push('Connection recently established');
  }
  
  if (metrics.errorRate > 0.1) { // More than 10% error rate
    issues.push('High error rate detected');
  }
  
  if (metrics.averageUpdateLatency > 1000) { // More than 1 second latency
    issues.push('High latency detected');
  }
  
  return {
    healthy: issues.length === 0,
    issues,
    metrics
  };
}

// Development utilities
export function enableWebSocketDebugging() {
  if (process.env.NODE_ENV === 'development') {
    // Enable detailed logging
    console.log('WebSocket debugging enabled');
    
    // You could integrate with React DevTools here
    return true;
  }
  
  return false;
}

// Testing utilities
export function createMockWebSocketHook(feature: string) {
  return {
    isConnected: false,
    isConnecting: false,
    error: null,
    connect: async () => console.log(`Mock connect for ${feature}`),
    disconnect: async () => console.log(`Mock disconnect for ${feature}`),
    sendMessage: async (message: any) => console.log(`Mock send message for ${feature}:`, message),
    subscribe: (callback: Function) => {
      console.log(`Mock subscribe for ${feature}`);
      return () => console.log(`Mock unsubscribe for ${feature}`);
    },
    getMetrics: () => ({
      connectionUptime: 0,
      totalMessages: 0,
      errorRate: 0,
      averageUpdateLatency: 0
    })
  };
}

// Export all hooks as a single object for convenience
export const WebSocketHooks = {
  // Core
  useFeatureWebSocket,
  useWebSocketMonitor,
  useMultipleWebSockets,
  
  // Feature-specific
  useChatWebSocket,
  useNotificationWebSocket,
  useFeedWebSocket,
  
  // Advanced
  useChatWebSocketHook,
  useNotificationWebSocketHook,
  useFeedWebSocketHook,
  
  // Migration
  useWebSocketMigration,
  useMultiFeatureMigration,
  
  // Utilities
  createWebSocketConfig,
  validateWebSocketConfig,
  getFeatureHook,
  getAdvancedFeatureHook,
  measureWebSocketPerformance,
  createMigrationStrategy,
  handleWebSocketError,
  checkConnectionHealth,
  enableWebSocketDebugging,
  createMockWebSocketHook
};

export default WebSocketHooks;
