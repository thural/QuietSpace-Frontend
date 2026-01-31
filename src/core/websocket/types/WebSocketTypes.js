/**
 * WebSocket Types.
 * 
 * JavaScript type definitions for WebSocket operations.
 */

// Import types via JSDoc typedefs
/**
 * @typedef {import('../services/EnterpriseWebSocketService.js').WebSocketMessage} WebSocketMessage
 * @typedef {import('../services/EnterpriseWebSocketService.js').WebSocketConfig} WebSocketConfig
 * @typedef {import('../services/EnterpriseWebSocketService.js').ConnectionMetrics} ConnectionMetrics
 * @typedef {import('../managers/ConnectionManager.js').ConnectionPool} ConnectionPool
 * @typedef {import('../managers/ConnectionManager.js').ConnectionHealth} ConnectionHealth
 * @typedef {import('../managers/ConnectionManager.js').ConnectionPoolConfig} ConnectionPoolConfig
 * @typedef {import('../services/MessageRouter.js').MessageRoute} MessageRoute
 * @typedef {import('../services/MessageRouter.js').RoutingMetrics} RoutingMetrics
 * @typedef {import('../services/MessageRouter.js').MessageRouterConfig} MessageRouterConfig
 * @typedef {import('../cache/WebSocketCacheManager.js').CacheInvalidationStrategy} CacheInvalidationStrategy
 * @typedef {import('../cache/WebSocketCacheManager.js').CacheInvalidationConfig} CacheInvalidationConfig
 */

// Feature Configuration Types
/**
 * WebSocket feature configuration interface
 * 
 * @interface WebSocketFeatureConfig
 * @description Configuration for individual WebSocket features
 */
export class WebSocketFeatureConfig {
    /**
     * Feature name
     * 
     * @type {string}
     */
    name = '';

    /**
     * Whether feature is enabled
     * 
     * @type {boolean}
     */
    enabled = true;

    /**
     * Feature priority (lower = higher priority)
     * 
     * @type {number}
     */
    priority = 0;

    /**
     * Maximum connections for this feature
     * 
     * @type {number}
     */
    maxConnections = 1;

    /**
     * Heartbeat interval in milliseconds
     * 
     * @type {number}
     */
    heartbeatInterval = 30000;

    /**
     * Number of reconnection attempts
     * 
     * @type {number}
     */
    reconnectAttempts = 3;

    /**
     * Whether to validate messages
     * 
     * @type {boolean}
     */
    messageValidation = true;

    /**
     * Whether to enable cache invalidation
     * 
     * @type {boolean}
     */
    cacheInvalidation = false;

    /**
     * Custom message routes
     * 
     * @type {MessageRoute[]}
     */
    customRoutes = [];
}

/**
 * WebSocket service configuration interface
 * 
 * @interface WebSocketServiceConfig
 * @description Global configuration for WebSocket service
 */
export class WebSocketServiceConfig {
    /**
     * WebSocket server URL
     * 
     * @type {string}
     */
    url = '';

    /**
     * Feature configurations
     * 
     * @type {WebSocketFeatureConfig[]}
     */
    features = [];

    /**
     * Global settings
     * 
     * @type {Object}
     */
    globalSettings = {
        /**
         * Enable metrics collection
         * 
         * @type {boolean}
         */
        enableMetrics: true,

        /**
         * Enable health checks
         * 
         * @type {boolean}
         */
        enableHealthChecks: true,

        /**
         * Enable cache integration
         * 
         * @type {boolean}
         */
        enableCacheIntegration: false,

        /**
         * Log level
         * 
         * @type {string}
         */
        logLevel: 'info'
    };
}

/**
 * WebSocket connection configuration interface
 * 
 * @interface WebSocketConnectionConfig
 * @description Configuration for individual WebSocket connections
 */
export class WebSocketConnectionConfig {
    /**
     * Authentication token
     * 
     * @type {string}
     */
    token = '';

    /**
     * Auto-connect on creation
     * 
     * @type {boolean}
     */
    autoConnect = true;

    /**
     * Auto-reconnect on disconnection
     * 
     * @type {boolean}
     */
    autoReconnect = true;

    /**
     * Connection timeout in milliseconds
     * 
     * @type {number}
     */
    connectionTimeout = 10000;

    /**
     * Maximum reconnection attempts
     * 
     * @type {number}
     */
    maxReconnectAttempts = 3;

    /**
     * Delay between reconnection attempts
     * 
     * @type {number}
     */
    reconnectDelay = 1000;

    /**
     * Heartbeat interval in milliseconds
     * 
     * @type {number}
     */
    heartbeatInterval = 30000;

    /**
     * Enable metrics collection
     * 
     * @type {boolean}
     */
    enableMetrics = true;
}

/**
 * WebSocket message configuration interface
 * 
 * @interface WebSocketMessageConfig
 * @description Configuration for message handling
 */
export class WebSocketMessageConfig {
    /**
     * Enable message validation
     * 
     * @type {boolean}
     */
    enableValidation = true;

    /**
     * Enable message transformation
     * 
     * @type {boolean}
     */
    enableTransformation = false;

    /**
     * Maximum message size in bytes
     * 
     * @type {number}
     */
    maxMessageSize = 1024 * 1024; // 1MB

    /**
     * Message compression
     * 
     * @type {boolean}
     */
    enableCompression = false;

    /**
     * Message encryption
     * 
     * @type {boolean}
     */
    enableEncryption = false;

    /**
     * Message timeout in milliseconds
     * 
     * @type {number}
     */
    messageTimeout = 30000;

    /**
     * Retry failed messages
     * 
     * @type {boolean}
     */
    retryFailedMessages = true;

    /**
     * Maximum retry attempts
     * 
     * @type {number}
     */
    maxRetryAttempts = 3;
}

/**
 * WebSocket event types
 * 
 * @readonly
 * @enum {string}
 */
export const WebSocketEventTypes = Object.freeze({
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
 * WebSocket connection states
 * 
 * @readonly
 * @enum {string}
 */
export const WebSocketConnectionStates = Object.freeze({
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    DISCONNECTING: 'disconnecting',
    DISCONNECTED: 'disconnected',
    RECONNECTING: 'reconnecting',
    ERROR: 'error'
});

/**
 * WebSocket message types
 * 
 * @readonly
 * @enum {string}
 */
export const WebSocketMessageTypes = Object.freeze({
    TEXT: 'text',
    BINARY: 'binary',
    JSON: 'json',
    HEARTBEAT: 'heartbeat',
    ERROR: 'error',
    ACKNOWLEDGMENT: 'ack',
    NOTIFICATION: 'notification',
    COMMAND: 'command',
    RESPONSE: 'response'
});

/**
 * WebSocket error codes
 * 
 * @readonly
 * @enum {string}
 */
export const WebSocketErrorCodes = Object.freeze({
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
 * WebSocket metrics interface
 * 
 * @interface WebSocketMetrics
 * @description Metrics collected for WebSocket operations
 */
export class WebSocketMetrics {
    /**
     * Total connections
     * 
     * @type {number}
     */
    totalConnections = 0;

    /**
     * Active connections
     * 
     * @type {number}
     */
    activeConnections = 0;

    /**
     * Total messages sent
     * 
     * @type {number}
     */
    totalMessagesSent = 0;

    /**
     * Total messages received
     * 
     * @type {number}
     */
    totalMessagesReceived = 0;

    /**
     * Total errors
     * 
     * @type {number}
     */
    totalErrors = 0;

    /**
     * Average response time
     * 
     * @type {number}
     */
    averageResponseTime = 0;

    /**
     * Last activity timestamp
     * 
     * @type {Date}
     */
    lastActivity = new Date();

    /**
     * Uptime in milliseconds
     * 
     * @type {number}
     */
    uptime = 0;

    /**
     * Connection success rate
     * 
     * @type {number}
     */
    connectionSuccessRate = 0;

    /**
     * Message success rate
     * 
     * @type {number}
     */
    messageSuccessRate = 0;
}

/**
 * WebSocket health status interface
 * 
 * @interface WebSocketHealthStatus
 * @description Health status of WebSocket service
 */
export class WebSocketHealthStatus {
    /**
     * Overall health status
     * 
     * @type {string}
     */
    status = 'healthy';

    /**
     * Number of active connections
     * 
     * @type {number}
     */
    activeConnections = 0;

    /**
     * Number of failed connections
     * 
     * @type {number}
     */
    failedConnections = 0;

    /**
     * Last health check timestamp
     * 
     * @type {Date}
     */
    lastHealthCheck = new Date();

    /**
     * Health check duration in milliseconds
     * 
     * @type {number}
     */
    healthCheckDuration = 0;

    /**
     * Health issues
     * 
     * @type {Array}
     */
    issues = [];

    /**
     * Additional health details
     * 
     * @type {Object}
     */
    details = {};
}

/**
 * Validates WebSocket feature configuration
 * 
 * @param {WebSocketFeatureConfig} config - Configuration to validate
 * @returns {boolean} True if configuration is valid
 * @description Validates WebSocket feature configuration
 */
export function validateWebSocketFeatureConfig(config) {
    if (!config || typeof config !== 'object') {
        return false;
    }

    if (!config.name || typeof config.name !== 'string') {
        return false;
    }

    if (typeof config.enabled !== 'boolean') {
        return false;
    }

    if (typeof config.priority !== 'number' || config.priority < 0) {
        return false;
    }

    if (typeof config.maxConnections !== 'number' || config.maxConnections <= 0) {
        return false;
    }

    return true;
}

/**
 * Validates WebSocket service configuration
 * 
 * @param {WebSocketServiceConfig} config - Configuration to validate
 * @returns {boolean} True if configuration is valid
 * @description Validates WebSocket service configuration
 */
export function validateWebSocketServiceConfig(config) {
    if (!config || typeof config !== 'object') {
        return false;
    }

    if (!config.url || typeof config.url !== 'string') {
        return false;
    }

    if (!Array.isArray(config.features)) {
        return false;
    }

    // Validate each feature configuration
    for (const feature of config.features) {
        if (!validateWebSocketFeatureConfig(feature)) {
            return false;
        }
    }

    return true;
}

/**
 * Validates WebSocket connection configuration
 * 
 * @param {WebSocketConnectionConfig} config - Configuration to validate
 * @returns {boolean} True if configuration is valid
 * @description Validates WebSocket connection configuration
 */
export function validateWebSocketConnectionConfig(config) {
    if (!config || typeof config !== 'object') {
        return false;
    }

    if (typeof config.autoConnect !== 'boolean') {
        return false;
    }

    if (typeof config.connectionTimeout !== 'number' || config.connectionTimeout <= 0) {
        return false;
    }

    if (typeof config.maxReconnectAttempts !== 'number' || config.maxReconnectAttempts < 0) {
        return false;
    }

    return true;
}

/**
 * Creates default WebSocket feature configuration
 * 
 * @param {string} name - Feature name
 * @returns {WebSocketFeatureConfig} Default configuration
 * @description Creates default WebSocket feature configuration
 */
export function createDefaultWebSocketFeatureConfig(name) {
    return new WebSocketFeatureConfig();
}

/**
 * Creates default WebSocket service configuration
 * 
 * @param {string} url - WebSocket server URL
 * @returns {WebSocketServiceConfig} Default configuration
 * @description Creates default WebSocket service configuration
 */
export function createDefaultWebSocketServiceConfig(url) {
    const config = new WebSocketServiceConfig();
    config.url = url;
    return config;
}

/**
 * Creates default WebSocket connection configuration
 * 
 * @param {string} token - Authentication token
 * @returns {WebSocketConnectionConfig} Default configuration
 * @description Creates default WebSocket connection configuration
 */
export function createDefaultWebSocketConnectionConfig(token) {
    const config = new WebSocketConnectionConfig();
    config.token = token;
    return config;
}
