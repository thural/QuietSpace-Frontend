/**
 * WebSocket Constants.
 * 
 * Centralized constants for WebSocket operations.
 */

/**
 * WebSocket message types
 * 
 * @readonly
 * @enum {string}
 */
export const WEBSOCKET_MESSAGE_TYPES = Object.freeze({
    // System messages
    HEARTBEAT: 'heartbeat',
    PING: 'ping',
    PONG: 'pong',
    ERROR: 'error',
    
    // Chat messages
    CHAT_MESSAGE: 'message',
    CHAT_TYPING: 'typing',
    CHAT_ONLINE_STATUS: 'online_status',
    CHAT_READ_RECEIPT: 'read_receipt',
    
    // Notification messages
    NOTIFICATION_PUSH: 'push',
    NOTIFICATION_SEEN: 'seen',
    NOTIFICATION_DISMISSED: 'dismissed',
    
    // Feed messages
    FEED_UPDATE: 'update',
    FEED_CREATE: 'create',
    FEED_DELETE: 'delete',
    FEED_LIKE: 'like',
    FEED_COMMENT: 'comment',
    
    // Search messages
    SEARCH_QUERY: 'query',
    SEARCH_RESULTS: 'results',
    SEARCH_SUGGESTIONS: 'suggestions',
    
    // User messages
    USER_ONLINE: 'user_online',
    USER_OFFLINE: 'user_offline',
    USER_STATUS_UPDATE: 'status_update',
    
    // System events
    SYSTEM_MAINTENANCE: 'maintenance',
    SYSTEM_SHUTDOWN: 'shutdown',
    SYSTEM_RESTART: 'restart'
});

/**
 * WebSocket connection states
 * 
 * @readonly
 * @enum {string}
 */
export const WEBSOCKET_CONNECTION_STATES = Object.freeze({
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    DISCONNECTING: 'disconnecting',
    DISCONNECTED: 'disconnected',
    RECONNECTING: 'reconnecting',
    ERROR: 'error'
});

/**
 * WebSocket event types
 * 
 * @readonly
 * @enum {string}
 */
export const WEBSOCKET_EVENT_TYPES = Object.freeze({
    CONNECTION_OPEN: 'connection:open',
    CONNECTION_CLOSE: 'connection:close',
    CONNECTION_ERROR: 'connection:error',
    MESSAGE_RECEIVED: 'message:received',
    MESSAGE_SENT: 'message:sent',
    MESSAGE_ERROR: 'message:error',
    HEARTBEAT: 'heartbeat',
    RECONNECT: 'reconnect',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
    METRICS: 'metrics',
    HEALTH_CHECK: 'health:check'
});

/**
 * WebSocket error codes
 * 
 * @readonly
 * @enum {string}
 */
export const WEBSOCKET_ERROR_CODES = Object.freeze({
    CONNECTION_FAILED: 'CONNECTION_FAILED',
    CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
    MESSAGE_TOO_LARGE: 'MESSAGE_TOO_LARGE',
    INVALID_MESSAGE: 'INVALID_MESSAGE',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    SERVER_ERROR: 'SERVER_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
});

/**
 * WebSocket configuration defaults
 * 
 * @readonly
 * @enum {number}
 */
export const WEBSOCKET_CONFIG_DEFAULTS = Object.freeze({
    // Connection settings
    CONNECTION_TIMEOUT: 10000,          // 10 seconds
    MAX_RECONNECT_ATTEMPTS: 3,
    RECONNECT_DELAY: 1000,               // 1 second
    RECONNECT_BACKOFF_MULTIPLIER: 2,
    MAX_RECONNECT_DELAY: 30000,          // 30 seconds
    
    // Heartbeat settings
    HEARTBEAT_INTERVAL: 30000,           // 30 seconds
    HEARTBEAT_TIMEOUT: 5000,             // 5 seconds
    HEARTBEAT_RETRY_ATTEMPTS: 3,
    
    // Message settings
    MAX_MESSAGE_SIZE: 1024 * 1024,       // 1MB
    MESSAGE_TIMEOUT: 30000,              // 30 seconds
    MAX_RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,                   // 1 second
    
    // Pool settings
    MAX_CONNECTIONS_PER_FEATURE: 5,
    MIN_CONNECTIONS_PER_FEATURE: 1,
    CONNECTION_POOL_CLEANUP_INTERVAL: 60000, // 1 minute
    
    // Metrics settings
    METRICS_COLLECTION_INTERVAL: 10000,  // 10 seconds
    METRICS_RETENTION_PERIOD: 3600000,   // 1 hour
    
    // Health check settings
    HEALTH_CHECK_INTERVAL: 60000,        // 1 minute
    HEALTH_CHECK_TIMEOUT: 5000,          // 5 seconds
    
    // Cache settings
    CACHE_INVALIDATION_DELAY: 1000,       // 1 second
    CACHE_SYNC_INTERVAL: 30000,           // 30 seconds
});

/**
 * WebSocket protocol versions
 * 
 * @readonly
 * @enum {string}
 */
export const WEBSOCKET_PROTOCOL_VERSIONS = Object.freeze({
    V1: 'v1',
    V2: 'v2',
    LATEST: 'v2'
});

/**
 * WebSocket subprotocols
 * 
 * @readonly
 * @enum {string}
 */
export const WEBSOCKET_SUBPROTOCOLS = Object.freeze({
    CHAT: 'chat-v1',
    NOTIFICATIONS: 'notifications-v1',
    FEED: 'feed-v1',
    SEARCH: 'search-v1',
    SYSTEM: 'system-v1'
});

/**
 * WebSocket compression options
 * 
 * @readonly
 * @enum {string}
 */
export const WEBSOCKET_COMPRESSION_OPTIONS = Object.freeze({
    NONE: 'none',
    DEFLATE: 'deflate',
    GZIP: 'gzip'
});

/**
 * WebSocket authentication methods
 * 
 * @readonly
 * @enum {string}
 */
export const WEBSOCKET_AUTH_METHODS = Object.freeze({
    TOKEN: 'token',
    BEARER: 'bearer',
    BASIC: 'basic',
    COOKIE: 'cookie',
    CUSTOM: 'custom'
});

/**
 * WebSocket message priorities
 * 
 * @readonly
 * @enum {number}
 */
export const WEBSOCKET_MESSAGE_PRIORITIES = Object.freeze({
    LOW: 1,
    NORMAL: 2,
    HIGH: 3,
    CRITICAL: 4,
    URGENT: 5
});

/**
 * WebSocket connection quality levels
 * 
 * @readonly
 * @enum {string}
 */
export const WEBSOCKET_CONNECTION_QUALITY = Object.freeze({
    EXCELLENT: 'excellent',
    GOOD: 'good',
    FAIR: 'fair',
    POOR: 'poor',
    DISCONNECTED: 'disconnected'
});

/**
 * WebSocket feature flags
 * 
 * @readonly
 * @enum {boolean}
 */
export const WEBSOCKET_FEATURE_FLAGS = Object.freeze({
    ENABLE_METRICS: true,
    ENABLE_HEALTH_CHECKS: true,
    ENABLE_CACHE_INTEGRATION: false,
    ENABLE_MESSAGE_COMPRESSION: false,
    ENABLE_MESSAGE_ENCRYPTION: false,
    ENABLE_AUTO_RECONNECT: true,
    ENABLE_HEARTBEAT: true,
    ENABLE_RETRY_LOGIC: true,
    ENABLE_RATE_LIMITING: false,
    ENABLE_MESSAGE_VALIDATION: true
});

/**
 * WebSocket log levels
 * 
 * @readonly
 * @enum {string}
 */
export const WEBSOCKET_LOG_LEVELS = Object.freeze({
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
});

/**
 * Validates WebSocket message type
 * 
 * @param {string} messageType - Message type to validate
 * @returns {boolean} True if message type is valid
 * @description Validates if message type is recognized
 */
export function isValidWebSocketMessageType(messageType) {
    return Object.values(WEBSOCKET_MESSAGE_TYPES).includes(messageType);
}

/**
 * Validates WebSocket connection state
 * 
 * @param {string} state - Connection state to validate
 * @returns {boolean} True if connection state is valid
 * @description Validates if connection state is recognized
 */
export function isValidWebSocketConnectionState(state) {
    return Object.values(WEBSOCKET_CONNECTION_STATES).includes(state);
}

/**
 * Validates WebSocket event type
 * 
 * @param {string} eventType - Event type to validate
 * @returns {boolean} True if event type is valid
 * @description Validates if event type is recognized
 */
export function isValidWebSocketEventType(eventType) {
    return Object.values(WEBSOCKET_EVENT_TYPES).includes(eventType);
}

/**
 * Validates WebSocket error code
 * 
 * @param {string} errorCode - Error code to validate
 * @returns {boolean} True if error code is valid
 * @description Validates if error code is recognized
 */
export function isValidWebSocketErrorCode(errorCode) {
    return Object.values(WEBSOCKET_ERROR_CODES).includes(errorCode);
}

/**
 * Gets WebSocket message priority
 * 
 * @param {string} messageType - Message type
 * @returns {number} Message priority
 * @description Gets priority level for message type
 */
export function getWebSocketMessagePriority(messageType) {
    const priorityMap = {
        [WEBSOCKET_MESSAGE_TYPES.ERROR]: WEBSOCKET_MESSAGE_PRIORITIES.URGENT,
        [WEBSOCKET_MESSAGE_TYPES.SYSTEM_MAINTENANCE]: WEBSOCKET_MESSAGE_PRIORITIES.CRITICAL,
        [WEBSOCKET_MESSAGE_TYPES.SYSTEM_SHUTDOWN]: WEBSOCKET_MESSAGE_PRIORITIES.CRITICAL,
        [WEBSOCKET_MESSAGE_TYPES.SYSTEM_RESTART]: WEBSOCKET_MESSAGE_PRIORITIES.CRITICAL,
        [WEBSOCKET_MESSAGE_TYPES.HEARTBEAT]: WEBSOCKET_MESSAGE_PRIORITIES.LOW,
        [WEBSOCKET_MESSAGE_TYPES.PING]: WEBSOCKET_MESSAGE_PRIORITIES.LOW,
        [WEBSOCKET_MESSAGE_TYPES.PONG]: WEBSOCKET_MESSAGE_PRIORITIES.LOW,
        [WEBSOCKET_MESSAGE_TYPES.CHAT_MESSAGE]: WEBSOCKET_MESSAGE_PRIORITIES.NORMAL,
        [WEBSOCKET_MESSAGE_TYPES.NOTIFICATION_PUSH]: WEBSOCKET_MESSAGE_PRIORITIES.HIGH,
        [WEBSOCKET_MESSAGE_TYPES.FEED_CREATE]: WEBSOCKET_MESSAGE_PRIORITIES.NORMAL,
        [WEBSOCKET_MESSAGE_TYPES.FEED_UPDATE]: WEBSOCKET_MESSAGE_PRIORITIES.NORMAL,
        [WEBSOCKET_MESSAGE_TYPES.FEED_DELETE]: WEBSOCKET_MESSAGE_PRIORITIES.NORMAL,
        [WEBSOCKET_MESSAGE_TYPES.SEARCH_QUERY]: WEBSOCKET_MESSAGE_PRIORITIES.NORMAL,
        [WEBSOCKET_MESSAGE_TYPES.SEARCH_RESULTS]: WEBSOCKET_MESSAGE_PRIORITIES.NORMAL,
        [WEBSOCKET_MESSAGE_TYPES.USER_ONLINE]: WEBSOCKET_MESSAGE_PRIORITIES.NORMAL,
        [WEBSOCKET_MESSAGE_TYPES.USER_OFFLINE]: WEBSOCKET_MESSAGE_PRIORITIES.NORMAL
    };

    return priorityMap[messageType] || WEBSOCKET_MESSAGE_PRIORITIES.NORMAL;
}

/**
 * Checks if WebSocket message type requires acknowledgment
 * 
 * @param {string} messageType - Message type
 * @returns {boolean} True if acknowledgment is required
 * @description Checks if message type requires acknowledgment
 */
export function requiresWebSocketAcknowledgment(messageType) {
    const ackRequiredTypes = [
        WEBSOCKET_MESSAGE_TYPES.CHAT_MESSAGE,
        WEBSOCKET_MESSAGE_TYPES.FEED_CREATE,
        WEBSOCKET_MESSAGE_TYPES.FEED_UPDATE,
        WEBSOCKET_MESSAGE_TYPES.FEED_DELETE,
        WEBSOCKET_MESSAGE_TYPES.FEED_LIKE,
        WEBSOCKET_MESSAGE_TYPES.FEED_COMMENT,
        WEBSOCKET_MESSAGE_TYPES.SEARCH_QUERY,
        WEBSOCKET_MESSAGE_TYPES.NOTIFICATION_SEEN,
        WEBSOCKET_MESSAGE_TYPES.NOTIFICATION_DISMISSED
    ];

    return ackRequiredTypes.includes(messageType);
}

/**
 * Gets WebSocket message timeout
 * 
 * @param {string} messageType - Message type
 * @param {number} [defaultTimeout] - Default timeout
 * @returns {number} Message timeout in milliseconds
 * @description Gets timeout for specific message type
 */
export function getWebSocketMessageTimeout(messageType, defaultTimeout = WEBSOCKET_CONFIG_DEFAULTS.MESSAGE_TIMEOUT) {
    const timeoutMap = {
        [WEBSOCKET_MESSAGE_TYPES.HEARTBEAT]: WEBSOCKET_CONFIG_DEFAULTS.HEARTBEAT_TIMEOUT,
        [WEBSOCKET_MESSAGE_TYPES.PING]: WEBSOCKET_CONFIG_DEFAULTS.HEARTBEAT_TIMEOUT,
        [WEBSOCKET_MESSAGE_TYPES.PONG]: WEBSOCKET_CONFIG_DEFAULTS.HEARTBEAT_TIMEOUT,
        [WEBSOCKET_MESSAGE_TYPES.SEARCH_QUERY]: 60000, // 1 minute for search
        [WEBSOCKET_MESSAGE_TYPES.SEARCH_RESULTS]: 30000 // 30 seconds for results
    };

    return timeoutMap[messageType] || defaultTimeout;
}

/**
 * Creates WebSocket error object
 * 
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {any} [details] - Error details
 * @returns {Object} WebSocket error object
 * @description Creates standardized WebSocket error
 */
export function createWebSocketError(code, message, details) {
    return {
        code,
        message,
        details,
        timestamp: new Date(),
        type: 'websocket_error'
    };
}
