/**
 * WebSocket Types Index.
 * 
 * Exports all WebSocket type definitions and interfaces.
 */

// Export all types
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
} from './WebSocketTypes.js';

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
    WEBSOCKET_LOG_LEVELS,
    isValidWebSocketMessageType,
    isValidWebSocketConnectionState,
    isValidWebSocketEventType,
    isValidWebSocketErrorCode,
    getWebSocketMessagePriority,
    requiresWebSocketAcknowledgment,
    getWebSocketMessageTimeout,
    createWebSocketError
} from './WebSocketConstants.js';

// Export utility types
export {
    MessageBuilderOptions,
    ValidationRule,
    ConnectionMonitorConfig,
    WebSocketMessageBuilder,
    WebSocketMessageValidator,
    WebSocketConnectionMonitor,
    createWebSocketMessageBuilder,
    createWebSocketMessageValidator,
    createWebSocketConnectionMonitor,
    isValidWebSocketUrl,
    createWebSocketError
} from './WebSocketUtils.js';
