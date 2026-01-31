/**
 * WebSocket Module Index.
 * 
 * Main entry point for the WebSocket enterprise module.
 * Exports only public interfaces and types (Black Box Pattern).
 * Internal implementation is completely encapsulated.
 */

// Export types via JSDoc typedefs
/**
 * @typedef {import('./services/EnterpriseWebSocketService.js').IEnterpriseWebSocketService} IEnterpriseWebSocketService
 * @typedef {import('./services/EnterpriseWebSocketService.js').WebSocketMessage} WebSocketMessage
 * @typedef {import('./services/EnterpriseWebSocketService.js').WebSocketConfig} WebSocketConfig
 * @typedef {import('./services/EnterpriseWebSocketService.js').WebSocketEventListener} WebSocketEventListener
 * @typedef {import('./services/EnterpriseWebSocketService.js').ConnectionMetrics} ConnectionMetrics
 * @typedef {import('./services/MessageRouter.js').IMessageRouter} IMessageRouter
 * @typedef {import('./services/MessageRouter.js').MessageRoute} MessageRoute
 * @typedef {import('./services/MessageRouter.js').MessageHandler} MessageHandler
 * @typedef {import('./services/MessageRouter.js').MessageValidator} MessageValidator
 * @typedef {import('./services/MessageRouter.js').MessageTransformer} MessageTransformer
 * @typedef {import('./services/MessageRouter.js').RoutingMetrics} RoutingMetrics
 * @typedef {import('./services/MessageRouter.js').FeatureMessageStats} FeatureMessageStats
 * @typedef {import('./services/MessageRouter.js').MessageRouterConfig} MessageRouterConfig
 * @typedef {import('./managers/ConnectionManager.js').IConnectionManager} IConnectionManager
 * @typedef {import('./managers/ConnectionManager.js').ConnectionPool} ConnectionPool
 * @typedef {import('./managers/ConnectionManager.js').ConnectionHealth} ConnectionHealth
 * @typedef {import('./managers/ConnectionManager.js').ConnectionPoolConfig} ConnectionPoolConfig
 * @typedef {import('./cache/WebSocketCacheManager.js').IWebSocketCacheManager} IWebSocketCacheManager
 * @typedef {import('./cache/WebSocketCacheManager.js').CacheInvalidationStrategy} CacheInvalidationStrategy
 * @typedef {import('./cache/WebSocketCacheManager.js').CacheInvalidationConfig} CacheInvalidationConfig
 */

// Import factory functions
import {
    createDefaultWebSocketService,
    createWebSocketService,
    createWebSocketServiceFromDI,
    createWebSocketFactory,
    createWebSocketServiceForFeature
} from './factory.js';

// Import constants
import {
    WEBSOCKET_MESSAGE_TYPES,
    WEBSOCKET_CONNECTION_STATES,
    WEBSOCKET_EVENT_TYPES,
    WEBSOCKET_ERROR_CODES,
    WEBSOCKET_CONFIG_DEFAULTS,
    WEBSOCKET_PROTOCOL_VERSIONS,
    WEBSOCKET_SUBPROTOCOLS,
    WEBSOCKET_COMPRESSION_OPTIONS,
    WEBSOCKET_AUTH_METHODS,
    WEBSOCKET_MESSAGE_PRIORITIES,
    WEBSOCKET_CONNECTION_QUALITY,
    WEBSOCKET_FEATURE_FLAGS,
    WEBSOCKET_LOG_LEVELS
} from './constants/WebSocketConstants.js';

// Import types
import {
    WebSocketFeatureConfig,
    WebSocketServiceConfig,
    WebSocketConnectionConfig,
    WebSocketMessageConfig,
    WebSocketMetrics,
    WebSocketHealthStatus,
    validateWebSocketFeatureConfig,
    validateWebSocketServiceConfig,
    validateWebSocketConnectionConfig,
    createDefaultWebSocketFeatureConfig,
    createDefaultWebSocketServiceConfig,
    createDefaultWebSocketConnectionConfig
} from './types/WebSocketTypes.js';

// Import utilities
import {
    WebSocketMessageBuilder,
    WebSocketMessageValidator,
    WebSocketConnectionMonitor,
    createWebSocketMessageBuilder,
    createWebSocketMessageValidator,
    createWebSocketConnectionMonitor,
    isValidWebSocketUrl,
    createWebSocketError
} from './utils/WebSocketUtils.js';

// Export factory functions - Clean API for service creation
export {
    createDefaultWebSocketService,
    createWebSocketService,
    createWebSocketServiceFromDI,
    createWebSocketFactory,
    createWebSocketServiceForFeature
};

// Export constants
export {
    WEBSOCKET_MESSAGE_TYPES,
    WEBSOCKET_CONNECTION_STATES,
    WEBSOCKET_EVENT_TYPES,
    WEBSOCKET_ERROR_CODES,
    WEBSOCKET_CONFIG_DEFAULTS,
    WEBSOCKET_PROTOCOL_VERSIONS,
    WEBSOCKET_SUBPROTOCOLS,
    WEBSOCKET_COMPRESSION_OPTIONS,
    WEBSOCKET_AUTH_METHODS,
    WEBSOCKET_MESSAGE_PRIORITIES,
    WEBSOCKET_CONNECTION_QUALITY,
    WEBSOCKET_FEATURE_FLAGS,
    WEBSOCKET_LOG_LEVELS
};

// Export types
export {
    WebSocketFeatureConfig,
    WebSocketServiceConfig,
    WebSocketConnectionConfig,
    WebSocketMessageConfig,
    WebSocketMetrics,
    WebSocketHealthStatus,
    validateWebSocketFeatureConfig,
    validateWebSocketServiceConfig,
    validateWebSocketConnectionConfig,
    createDefaultWebSocketFeatureConfig,
    createDefaultWebSocketServiceConfig,
    createDefaultWebSocketConnectionConfig
};

// Export utilities
export {
    WebSocketMessageBuilder,
    WebSocketMessageValidator,
    WebSocketConnectionMonitor,
    createWebSocketMessageBuilder,
    createWebSocketMessageValidator,
    createWebSocketConnectionMonitor,
    isValidWebSocketUrl,
    createWebSocketError
};

// Default export for convenience
export default {
    // Factory functions
    createDefaultWebSocketService,
    createWebSocketService,
    createWebSocketServiceFromDI,
    createWebSocketFactory,
    createWebSocketServiceForFeature,
    
    // Constants
    WEBSOCKET_MESSAGE_TYPES,
    WEBSOCKET_CONNECTION_STATES,
    WEBSOCKET_EVENT_TYPES,
    WEBSOCKET_ERROR_CODES,
    WEBSOCKET_CONFIG_DEFAULTS,
    
    // Types
    WebSocketFeatureConfig,
    WebSocketServiceConfig,
    WebSocketConnectionConfig,
    WebSocketMessageConfig,
    WebSocketMetrics,
    WebSocketHealthStatus,
    
    // Utilities
    WebSocketMessageBuilder,
    WebSocketMessageValidator,
    WebSocketConnectionMonitor,
    createWebSocketMessageBuilder,
    createWebSocketMessageValidator,
    createWebSocketConnectionMonitor,
    isValidWebSocketUrl,
    createWebSocketError
};
