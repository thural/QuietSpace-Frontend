/**
 * WebSocket Module Index.
 * 
 * Main entry point for the WebSocket enterprise module.
 * Exports all WebSocket services, managers, and utilities.
 */

// Services
export {
  EnterpriseWebSocketService,
  IEnterpriseWebSocketService,
  type WebSocketMessage,
  type WebSocketConfig,
  type WebSocketEventListener,
  type ConnectionMetrics
} from './services/EnterpriseWebSocketService';

export {
  MessageRouter,
  IMessageRouter,
  type MessageRoute,
  type MessageHandler,
  type MessageValidator,
  type MessageTransformer,
  type RoutingMetrics,
  type FeatureMessageStats,
  type MessageRouterConfig
} from './services/MessageRouter';

// Managers
export {
  ConnectionManager,
  IConnectionManager,
  type ConnectionPool,
  type ConnectionHealth,
  type ConnectionPoolConfig
} from './managers/ConnectionManager';

// Dependency Injection
export {
  createWebSocketContainer,
  registerWebSocketServices,
  initializeWebSocketServices,
  getWebSocketService,
  getConnectionManager,
  getMessageRouter,
  WebSocketServiceFactory,
  performWebSocketHealthCheck
} from './di/WebSocketContainer';

// Cache Integration
export {
  WebSocketCacheManager,
  IWebSocketCacheManager,
  type CacheInvalidationStrategy,
  type CacheInvalidationConfig
} from './cache/WebSocketCacheManager';

// Hooks (React integration)
export {
  useEnterpriseWebSocket,
  useFeatureWebSocket,
  useWebSocketConnection,
  useWebSocketMetrics,
  type UseEnterpriseWebSocketOptions,
  type UseFeatureWebSocketOptions,
  type WebSocketConnectionState
} from './hooks/useEnterpriseWebSocket';

// Utilities
export {
  WebSocketMessageBuilder,
  WebSocketMessageValidator,
  WebSocketConnectionMonitor,
  type MessageBuilderOptions,
  type ValidationRule,
  type ConnectionMonitorConfig
} from './utils/WebSocketUtils';

// Types
export type {
  WebSocketFeatureConfig,
  WebSocketServiceConfig,
  WebSocketConnectionConfig,
  WebSocketMessageConfig,
  WebSocketCacheConfig
} from './types/WebSocketTypes';

// Constants
export {
  WEBSOCKET_MESSAGE_TYPES,
  WEBSOCKET_CONNECTION_STATES,
  WEBSOCKET_FEATURES,
  WEBSOCKET_EVENTS,
  WEBSOCKET_ERRORS
} from './constants/WebSocketConstants';

/**
 * WebSocket Module Version
 */
export const WEBSOCKET_MODULE_VERSION = '1.0.0';

/**
 * WebSocket Module Info
 */
export const WEBSOCKET_MODULE_INFO = {
  name: 'Enterprise WebSocket Module',
  version: WEBSOCKET_MODULE_VERSION,
  description: 'Centralized WebSocket management with enterprise patterns',
  features: [
    'Connection pooling and management',
    'Message routing and validation',
    'Health monitoring and metrics',
    'Cache integration',
    'Dependency injection support',
    'React hooks integration',
    'Type safety throughout'
  ],
  dependencies: [
    '@core/di',
    '@core/cache',
    '@core/services'
  ]
};
