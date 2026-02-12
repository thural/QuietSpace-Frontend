/**
 * WebSocket Module Index.
 *
 * Main entry point for the WebSocket enterprise module.
 * Exports only public interfaces and types (Black Box Pattern).
 * Internal implementation is completely encapsulated.
 */

// Import types for factory function signatures
import { TYPES } from '../di/types';

import { WebSocketServiceFactory } from './di/WebSocketContainer';

import type { Container } from '../di';
import type {
  IWebSocketCacheManager,
  CacheInvalidationStrategy,
  CacheInvalidationConfig
} from './cache/WebSocketCacheManager';
import type {
  IConnectionManager,
  ConnectionPool,
  ConnectionHealth,
  ConnectionPoolConfig
} from './managers/ConnectionManager';
import type {
  IEnterpriseWebSocketService,
  WebSocketMessage,
  WebSocketConfig,
  WebSocketEventListener,
  ConnectionMetrics
} from './services/EnterpriseWebSocketService';
import type {
  IMessageRouter,
  MessageRoute,
  MessageHandler,
  MessageValidator,
  MessageTransformer,
  RoutingMetrics,
  FeatureMessageStats,
  MessageRouterConfig
} from './services/MessageRouter';






// Services - Public API Only (Black Box Pattern)
export type {
  IEnterpriseWebSocketService,
  WebSocketMessage,
  WebSocketConfig,
  WebSocketEventListener,
  ConnectionMetrics
} from './services/EnterpriseWebSocketService';

// Message Router - Public API Only (Black Box Pattern)
export type {
  IMessageRouter,
  MessageRoute,
  MessageHandler,
  MessageValidator,
  MessageTransformer,
  RoutingMetrics,
  FeatureMessageStats,
  MessageRouterConfig
} from './services/MessageRouter';

// Connection Management - Public API Only (Black Box Pattern)
export type {
  IConnectionManager,
  ConnectionPool,
  ConnectionHealth,
  ConnectionPoolConfig
} from './managers/ConnectionManager';

// Dependency Injection - Public API Factory Functions (Black Box Pattern)
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

// Factory Functions for Service Creation (Black Box Pattern)
// Note: These functions require a DI container instance to be passed in
// This maintains the black box pattern while providing clean factory methods

export function createWebSocketService(container: Container, config?: WebSocketConfig): IEnterpriseWebSocketService {
  return container.getByToken<IEnterpriseWebSocketService>(
    TYPES.ENTERPRISE_WEBSOCKET_SERVICE
  );
}

export function createMessageRouter(container: Container, config?: MessageRouterConfig): IMessageRouter {
  return container.getByToken<IMessageRouter>(
    TYPES.MESSAGE_ROUTER
  );
}

export function createConnectionManager(container: Container, config?: ConnectionPoolConfig): IConnectionManager {
  return container.getByToken<IConnectionManager>(
    TYPES.CONNECTION_MANAGER
  );
}

export function createCacheManager(container: Container, config?: CacheInvalidationConfig): IWebSocketCacheManager {
  // Note: Cache manager is handled differently - it uses CacheServiceManager directly
  // This is a placeholder for the cache management functionality
  // In practice, cache invalidation is handled through the CacheServiceManager
  return null as unknown; // TODO: Implement proper cache manager factory
}

// Cache Integration - Public API Only (Black Box Pattern)
export type {
  IWebSocketCacheManager,
  CacheInvalidationStrategy,
  CacheInvalidationConfig
} from './cache/WebSocketCacheManager';

// Internal Utilities - NOT EXPORTED (Black Box Pattern)
// WebSocketMessageBuilder, WebSocketMessageValidator, WebSocketConnectionMonitor
// are internal utilities and not part of the public API

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
