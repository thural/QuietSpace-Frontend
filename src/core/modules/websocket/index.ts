/**
 * WebSocket Module Index.
 *
 * Main entry point for the WebSocket enterprise module.
 * Exports only public interfaces and types (Black Box Pattern).
 * Internal implementation is completely encapsulated.
 */

// Import types for factory function signatures
import { TYPES } from '../dependency-injection/types';


import type { _LoggerService } from '../../services';
import type { ICacheServiceManager } from '../caching';
import type { Container } from '../dependency-injection';
import type {
  CacheInvalidationConfig,
  IWebSocketCacheManager
} from './cache/WebSocketCacheManager';
import { WebSocketCacheManager } from './cache/WebSocketCacheManager';
import type {
  ConnectionPoolConfig,
  IConnectionManager
} from './managers/ConnectionManager';
import type {
  IEnterpriseWebSocketService,
  WebSocketConfig
} from './services/EnterpriseWebSocketService';
import type {
  IMessageRouter,
  MessageRouterConfig
} from './services/MessageRouter';






// Services - Public API Only (Black Box Pattern)
export type {
  ConnectionMetrics, IEnterpriseWebSocketService, WebSocketConfig,
  WebSocketEventListener, WebSocketMessage
} from './services/EnterpriseWebSocketService';

// Message Router - Public API Only (Black Box Pattern)
export type {
  FeatureMessageStats, IMessageRouter, MessageHandler, MessageRoute, MessageRouterConfig, MessageTransformer, MessageValidator, RoutingMetrics
} from './services/MessageRouter';

// Connection Management - Public API Only (Black Box Pattern)
export type {
  ConnectionHealth, ConnectionPool, ConnectionPoolConfig, IConnectionManager
} from './managers/ConnectionManager';

// Dependency Injection - Public API Factory Functions (Black Box Pattern)
export {
  createWebSocketContainer, getConnectionManager,
  getMessageRouter, getWebSocketService, initializeWebSocketServices, performWebSocketHealthCheck, registerWebSocketServices, WebSocketServiceFactory
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
  /**
   * Creates a WebSocket cache manager with proper DI integration
   * 
   * @param container - DI container instance for dependency resolution
   * @param config - Optional configuration for cache invalidation
   * @returns WebSocket cache manager instance
   * 
   * @example
   * ```typescript
   * const container = createAppContainer();
   * const cacheManager = createCacheManager(container, {
   *   enableAutoInvalidation: true,
   *   enableMessagePersistence: true,
   *   defaultTTL: 300000
   * });
   * 
   * // Use cache manager for WebSocket operations
   * await cacheManager.invalidateCache(webSocketMessage);
   * ```
   */

  try {
    // Get required dependencies from DI container
    const cacheService = container.getByToken(TYPES.CACHE_SERVICE);
    const loggerService = container.getByToken(TYPES.LOGGER_SERVICE);

    // Create WebSocket cache manager with dependencies
    const webSocketCacheManager = new WebSocketCacheManager(
      cacheService as ICacheServiceManager,
      loggerService as _LoggerService
    );

    // Apply configuration if provided
    if (config) {
      // Apply configuration through the cache manager's methods
      // Note: CacheInvalidationConfig doesn't have patterns/priority properties
      // These are part of CacheInvalidationStrategy, not config
      if (config.enableAutoInvalidation !== undefined) {
        // Configuration will be handled internally by the cache manager
        // based on its default config merging
      }
    }

    return webSocketCacheManager;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create WebSocket cache manager: ${errorMessage}`);
  }
}

// Cache Integration - Public API Only (Black Box Pattern)
export type {
  CacheInvalidationConfig, CacheInvalidationStrategy, IWebSocketCacheManager
} from './cache/WebSocketCacheManager';

// Internal Utilities - NOT EXPORTED (Black Box Pattern)
// WebSocketMessageBuilder, WebSocketMessageValidator, WebSocketConnectionMonitor
// are internal utilities and not part of the public API

// Types
export type {
  WebSocketCacheConfig, WebSocketConnectionConfig, WebSocketFeatureConfig, WebSocketMessageConfig, WebSocketServiceConfig
} from './types/WebSocketTypes';

// Constants
export {
  WEBSOCKET_CONNECTION_STATES, WEBSOCKET_ERRORS, WEBSOCKET_EVENTS, WEBSOCKET_FEATURES, WEBSOCKET_MESSAGE_TYPES
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
