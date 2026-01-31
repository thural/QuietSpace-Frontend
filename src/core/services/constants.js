/**
 * Services Module Constants
 * 
 * Centralized constants for core services including logger, theme service,
 * user service, and other shared service configurations.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./types.js').LogLevel} LogLevel
 */

// Logger service constants
/**
 * Logger service constants
 * 
 * @type {Object}
 * @description Constants for logger service configuration
 */
export const LOGGER_CONSTANTS = Object.freeze({
    // Log levels with numeric values for comparison
    LOG_LEVELS: {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        FATAL: 5,
        OFF: 6,
    },

    // Log level names
    LOG_LEVEL_NAMES: {
        0: 'TRACE',
        1: 'DEBUG',
        2: 'INFO',
        3: 'WARN',
        4: 'ERROR',
        5: 'FATAL',
        6: 'OFF',
    },

    // Log level colors for console output
    LOG_LEVEL_COLORS: {
        TRACE: '#9CA3AF',
        DEBUG: '#60A5FA',
        INFO: '#34D399',
        WARN: '#FBBF24',
        ERROR: '#F87171',
        FATAL: '#DC2626',
    },

    // Console methods for each log level
    CONSOLE_METHODS: {
        0: 'debug',
        1: 'debug',
        2: 'info',
        3: 'warn',
        4: 'error',
        5: 'error',
    },

    // Default log levels for different environments
    DEFAULT_LOG_LEVELS: {
        development: 'debug',
        test: 'warn',
        staging: 'info',
        production: 'error'
    },

    // File logging configuration
    FILE_LOGGING: {
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        MAX_FILES: 5,
        DATE_FORMAT: 'YYYY-MM-DD',
        TIME_FORMAT: 'HH:mm:ss.SSS'
    },

    // Remote logging configuration
    REMOTE_LOGGING: {
        BATCH_SIZE: 100,
        FLUSH_INTERVAL: 5000, // 5 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000,
        TIMEOUT: 10000
    },

    // Performance logging
    PERFORMANCE_LOGGING: {
        SLOW_QUERY_THRESHOLD: 1000, // 1 second
        SLOW_REQUEST_THRESHOLD: 5000, // 5 seconds
        MEMORY_WARNING_THRESHOLD: 0.8, // 80%
        CPU_WARNING_THRESHOLD: 0.8 // 80%
    }
});

// Theme service constants
/**
 * Theme service constants
 * 
 * @type {Object}
 * @description Constants for theme service configuration
 */
export const THEME_CONSTANTS = Object.freeze({
    // Default theme names
    DEFAULT_THEMES: {
        light: 'default-light',
        dark: 'default-dark',
        auto: 'auto'
    },

    // Theme storage keys
    STORAGE_KEYS: {
        THEME: 'app-theme',
        THEME_VARIANT: 'theme-variant',
        CUSTOM_COLORS: 'custom-theme-colors'
    },

    // Theme transition settings
    TRANSITIONS: {
        DURATION: 300, // milliseconds
        EASING: 'ease-in-out'
    },

    // Color palette defaults
    DEFAULT_COLORS: {
        primary: '#3B82F6',
        secondary: '#64748B',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#06B6D4'
    },

    // Typography defaults
    DEFAULT_TYPOGRAPHY: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem'
        }
    },

    // Spacing defaults
    DEFAULT_SPACING: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
    }
});

// User service constants
/**
 * User service constants
 * 
 * @type {Object}
 * @description Constants for user service configuration
 */
export const USER_CONSTANTS = Object.freeze({
    // User roles
    ROLES: {
        GUEST: 'guest',
        USER: 'user',
        MODERATOR: 'moderator',
        ADMIN: 'admin',
        SUPER_ADMIN: 'super_admin'
    },

    // User status
    STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        SUSPENDED: 'suspended',
        BANNED: 'banned'
    },

    // Authentication providers
    PROVIDERS: {
        LOCAL: 'local',
        GOOGLE: 'google',
        GITHUB: 'github',
        MICROSOFT: 'microsoft'
    },

    // Session configuration
    SESSION: {
        TIMEOUT: 3600000, // 1 hour
        REFRESH_THRESHOLD: 300000, // 5 minutes
        MAX_REFRESH_ATTEMPTS: 3
    },

    // Password requirements
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 128,
        REQUIRE_UPPERCASE: true,
        REQUIRE_LOWERCASE: true,
        REQUIRE_NUMBERS: true,
        REQUIRE_SPECIAL_CHARS: true
    }
});

// Service container constants
/**
 * Service container constants
 * 
 * @type {Object}
 * @description Constants for service container configuration
 */
export const SERVICE_CONTAINER_CONSTANTS = Object.freeze({
    // Service lifetimes
    LIFETIMES: {
        TRANSIENT: 'transient',
        SINGLETON: 'singleton',
        SCOPED: 'scoped'
    },

    // Container states
    STATES: {
        UNINITIALIZED: 'uninitialized',
        INITIALIZING: 'initializing',
        READY: 'ready',
        DISPOSING: 'disposing',
        DISPOSED: 'disposed'
    },

    // Registration options
    REGISTRATION: {
        DEFAULT_LIFETIME: 'singleton',
        AUTO_REGISTER: true,
        VALIDATE_DEPENDENCIES: true
    },

    // Health check configuration
    HEALTH_CHECK: {
        INTERVAL: 60000, // 1 minute
        TIMEOUT: 5000, // 5 seconds
        RETRY_ATTEMPTS: 3
    }
});

// Network service constants
/**
 * Network service constants
 * 
 * @type {Object}
 * @description Constants for network service configuration
 */
export const NETWORK_CONSTANTS = Object.freeze({
    // HTTP methods
    HTTP_METHODS: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
        PATCH: 'PATCH',
        HEAD: 'HEAD',
        OPTIONS: 'OPTIONS'
    },

    // HTTP status codes
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503
    },

    // Request configuration
    REQUEST: {
        TIMEOUT: 30000, // 30 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000,
        RETRY_BACKOFF_FACTOR: 2
    },

    // Content types
    CONTENT_TYPES: {
        JSON: 'application/json',
        FORM_DATA: 'multipart/form-data',
        URL_ENCODED: 'application/x-www-form-urlencoded',
        TEXT: 'text/plain',
        HTML: 'text/html'
    },

    // Cache configuration
    CACHE: {
        DEFAULT_TTL: 300000, // 5 minutes
        MAX_SIZE: 100, // maximum cache entries
        STRATEGY: 'lru' // least recently used
    }
});

// WebSocket service constants
/**
 * WebSocket service constants
 * 
 * @type {Object}
 * @description Constants for WebSocket service configuration
 */
export const WEBSOCKET_CONSTANTS = Object.freeze({
    // Connection states
    CONNECTION_STATES: {
        CONNECTING: 0,
        OPEN: 1,
        CLOSING: 2,
        CLOSED: 3,
        RECONNECTING: 4,
        ERROR: 5
    },

    // Connection configuration
    CONNECTION: {
        RECONNECT_INTERVAL: 3000, // 3 seconds
        MAX_RECONNECT_ATTEMPTS: 5,
        RECONNECT_BACKOFF_FACTOR: 1.5,
        PING_INTERVAL: 30000, // 30 seconds
        PONG_TIMEOUT: 5000 // 5 seconds
    },

    // Message types
    MESSAGE_TYPES: {
        CONNECT: 'connect',
        DISCONNECT: 'disconnect',
        PING: 'ping',
        PONG: 'pong',
        ERROR: 'error',
        DATA: 'data',
        EVENT: 'event'
    },

    // Event names
    EVENTS: {
        CONNECTED: 'connected',
        DISCONNECTED: 'disconnected',
        ERROR: 'error',
        MESSAGE: 'message',
        RECONNECTING: 'reconnecting'
    }
});

// Utility functions for constants
/**
 * Gets log level by numeric value
 * 
 * @function getLogLevelByValue
 * @param {number} value - Numeric log level value
 * @returns {string} Log level name
 * @description Gets log level name by numeric value
 */
export function getLogLevelByValue(value) {
    return LOGGER_CONSTANTS.LOG_LEVEL_NAMES[value] || 'UNKNOWN';
}

/**
 * Gets log level color
 * 
 * @function getLogLevelColor
 * @param {string|number} level - Log level
 * @returns {string} Color code
 * @description Gets color code for log level
 */
export function getLogLevelColor(level) {
    const numericLevel = typeof level === 'string' ? LOGGER_CONSTANTS.LOG_LEVELS[level.toUpperCase()] : level;
    return LOGGER_CONSTANTS.LOG_LEVEL_COLORS[numericLevel] || '#FFFFFF';
}

/**
 * Gets console method for log level
 * 
 * @function getConsoleMethod
 * @param {string|number} level - Log level
 * @returns {string} Console method name
 * @description Gets console method for log level
 */
export function getConsoleMethod(level) {
    const numericLevel = typeof level === 'string' ? LOGGER_CONSTANTS.LOG_LEVELS[level.toUpperCase()] : level;
    return LOGGER_CONSTANTS.CONSOLE_METHODS[numericLevel] || 'log';
}

/**
 * Checks if user role is admin
 * 
 * @function isAdminRole
 * @param {string} role - User role
 * @returns {boolean} Whether role is admin
 * @description Checks if user role has admin privileges
 */
export function isAdminRole(role) {
    return [USER_CONSTANTS.ROLES.ADMIN, USER_CONSTANTS.ROLES.SUPER_ADMIN].includes(role);
}

/**
 * Checks if user status is active
 * 
 * @function isActiveUser
 * @param {string} status - User status
 * @returns {boolean} Whether user is active
 * @description Checks if user status is active
 */
export function isActiveUser(status) {
    return status === USER_CONSTANTS.STATUS.ACTIVE;
}

/**
 * Gets HTTP status description
 * 
 * @function getHttpStatusDescription
 * @param {number} code - HTTP status code
 * @returns {string} Status description
 * @description Gets description for HTTP status code
 */
export function getHttpStatusDescription(code) {
    const descriptions = {
        [NETWORK_CONSTANTS.HTTP_STATUS.OK]: 'OK',
        [NETWORK_CONSTANTS.HTTP_STATUS.CREATED]: 'Created',
        [NETWORK_CONSTANTS.HTTP_STATUS.NO_CONTENT]: 'No Content',
        [NETWORK_CONSTANTS.HTTP_STATUS.BAD_REQUEST]: 'Bad Request',
        [NETWORK_CONSTANTS.HTTP_STATUS.UNAUTHORIZED]: 'Unauthorized',
        [NETWORK_CONSTANTS.HTTP_STATUS.FORBIDDEN]: 'Forbidden',
        [NETWORK_CONSTANTS.HTTP_STATUS.NOT_FOUND]: 'Not Found',
        [NETWORK_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
        [NETWORK_CONSTANTS.HTTP_STATUS.BAD_GATEWAY]: 'Bad Gateway',
        [NETWORK_CONSTANTS.HTTP_STATUS.SERVICE_UNAVAILABLE]: 'Service Unavailable'
    };
    return descriptions[code] || 'Unknown Status';
}

/**
 * Gets WebSocket state name
 * 
 * @function getWebSocketStateName
 * @param {number} state - WebSocket state
 * @returns {string} State name
 * @description Gets name for WebSocket connection state
 */
export function getWebSocketStateName(state) {
    const stateNames = {
        [WEBSOCKET_CONSTANTS.CONNECTION_STATES.CONNECTING]: 'Connecting',
        [WEBSOCKET_CONSTANTS.CONNECTION_STATES.OPEN]: 'Open',
        [WEBSOCKET_CONSTANTS.CONNECTION_STATES.CLOSING]: 'Closing',
        [WEBSOCKET_CONSTANTS.CONNECTION_STATES.CLOSED]: 'Closed',
        [WEBSOCKET_CONSTANTS.CONNECTION_STATES.RECONNECTING]: 'Reconnecting',
        [WEBSOCKET_CONSTANTS.CONNECTION_STATES.ERROR]: 'Error'
    };
    return stateNames[state] || 'Unknown';
}
