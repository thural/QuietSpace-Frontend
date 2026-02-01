/**
 * WebSocket Hooks Index.
 *
 * Exports enterprise WebSocket hooks for React components.
 * Feature-specific hooks have been moved to their respective features.
 */

// Core enterprise hooks
export {
  useEnterpriseWebSocket,
  useFeatureWebSocket // Legacy export - deprecated
} from './useFeatureWebSocket';

export type {
  UseEnterpriseWebSocketOptions,
  EnterpriseWebSocketState
} from './useFeatureWebSocket';

// Enterprise WebSocket hook
export { useEnterpriseWebSocket as useWebSocketConnection } from './useFeatureWebSocket';

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

// Re-export core types for convenience
export type {
  WebSocketConnectionState
} from '@/core/websocket/types/WebSocketTypes';

export type {
  WebSocketMessage
} from '@/core/websocket';

// Feature adapter types moved to respective features
// Chat: @features/chat/adapters
// Feed: @features/feed/adapters
// Notification: @features/notification/adapters

// Utility functions
export const WEBSOCKET_HOOKS = {
  // Core hooks
  ENTERPRISE: 'useEnterpriseWebSocket',
  FEATURE: 'useFeatureWebSocket', // Legacy

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
    typeof config.autoConnect === 'boolean' &&
    typeof config.connectionTimeout === 'number'
  );
}

// Feature hook locations (for reference)
export const FEATURE_HOOK_LOCATIONS = {
  chat: '@features/chat/hooks/useChatWebSocket',
  feed: '@features/feed/hooks/useFeedWebSocket',
  notification: '@features/notification/hooks/useNotificationWebSocket'
} as const;
