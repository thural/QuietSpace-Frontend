/**
 * Core System Constants
 * 
 * Centralized constants and enums for the core system.
 * Provides clean constant exports following Black Box pattern.
 */

// Core System Constants
/**
 * Core system constants
 * 
 * @type {Object}
 * @description Centralized constants for core system configuration
 */
export const CORE_CONSTANTS = Object.freeze({
    // Service initialization
    INITIALIZATION_TIMEOUT: 5000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,

    // Cache defaults
    DEFAULT_CACHE_SIZE: 1000,
    DEFAULT_CACHE_TTL: 3600000, // 1 hour
    DEFAULT_CACHE_STRATEGY: 'lru',

    // WebSocket defaults
    DEFAULT_RECONNECT_INTERVAL: 3000,
    DEFAULT_MAX_RECONNECT_ATTEMPTS: 5,
    DEFAULT_WEBSOCKET_TIMEOUT: 10000,

    // Authentication defaults
    DEFAULT_TOKEN_REFRESH_INTERVAL: 300000, // 5 minutes
    DEFAULT_SESSION_TIMEOUT: 3600000, // 1 hour
    DEFAULT_MAX_LOGIN_ATTEMPTS: 5,

    // Theme defaults
    DEFAULT_THEME_NAME: 'default',
    DEFAULT_THEME_VARIANT: 'light',

    // Network defaults
    DEFAULT_API_TIMEOUT: 30000,
    DEFAULT_RETRY_ATTEMPTS: 3,
    DEFAULT_RETRY_DELAY: 1000,

    // Logging defaults
    DEFAULT_LOG_LEVEL: 'info',
    DEFAULT_LOG_BUFFER_SIZE: 1000,
    DEFAULT_LOG_FLUSH_INTERVAL: 5000,

    // Service container defaults
    DEFAULT_SINGLETON_LIFETIME: 0, // Permanent
    DEFAULT_FACTORY_CACHE_SIZE: 100,
});

// Core System Status
/**
 * Core system status enum
 * 
 * @readonly
 * @enum {string}
 * @description Core system status values
 */
export const CORE_STATUS = Object.freeze({
    INITIALIZING: 'initializing',
    READY: 'ready',
    ERROR: 'error',
    SHUTTING_DOWN: 'shutting_down',
    SHUTDOWN: 'shutdown',
});

// Core Error Codes
/**
 * Core error codes enum
 * 
 * @readonly
 * @enum {string}
 * @description Core system error codes
 */
export const CORE_ERROR_CODES = Object.freeze({
    INITIALIZATION_FAILED: 'INITIALIZATION_FAILED',
    SERVICE_NOT_FOUND: 'SERVICE_NOT_FOUND',
    DEPENDENCY_INJECTION_FAILED: 'DEPENDENCY_INJECTION_FAILED',
    CACHE_ERROR: 'CACHE_ERROR',
    WEBSOCKET_ERROR: 'WEBSOCKET_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
});

// Core Error Messages
/**
 * Core error messages
 * 
 * @type {Object}
 * @description Core system error messages
 */
export const CORE_ERROR_MESSAGES = Object.freeze({
    [CORE_ERROR_CODES.INITIALIZATION_FAILED]: 'Core system initialization failed',
    [CORE_ERROR_CODES.SERVICE_NOT_FOUND]: 'Service not found in container',
    [CORE_ERROR_CODES.DEPENDENCY_INJECTION_FAILED]: 'Dependency injection failed',
    [CORE_ERROR_CODES.CACHE_ERROR]: 'Cache operation failed',
    [CORE_ERROR_CODES.WEBSOCKET_ERROR]: 'WebSocket connection failed',
    [CORE_ERROR_CODES.AUTHENTICATION_ERROR]: 'Authentication failed',
    [CORE_ERROR_CODES.NETWORK_ERROR]: 'Network request failed',
    [CORE_ERROR_CODES.VALIDATION_ERROR]: 'Input validation failed',
    [CORE_ERROR_CODES.TIMEOUT_ERROR]: 'Operation timed out',
    [CORE_ERROR_CODES.UNKNOWN_ERROR]: 'An unknown error occurred',
});

// Core Validation Rules
/**
 * Core validation rules
 * 
 * @type {Object}
 * @description Core system validation rules
 */
export const CORE_VALIDATION_RULES = Object.freeze({
    // Service name validation
    serviceName: {
        minLength: 1,
        maxLength: 100,
        pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
        forbiddenChars: [' ', '-', '_'],
    },
    
    // Cache key validation
    cacheKey: {
        minLength: 1,
        maxLength: 255,
        pattern: /^[a-zA-Z0-9_-]+$/,
        forbiddenChars: [' ', '\t', '\n', '\r'],
    },
    
    // API endpoint validation
    apiEndpoint: {
        minLength: 1,
        maxLength: 500,
        pattern: /^https?:\/\/.+/,
    },
    
    // Timeout validation
    timeout: {
        min: 100,
        max: 300000, // 5 minutes
    },
    
    // Retry count validation
    retryCount: {
        min: 0,
        max: 10,
    },
});

// Core Event Types
/**
 * Core event types
 * 
 * @readonly
 * @enum {string}
 * @description Core system event types
 */
export const CORE_EVENT_TYPES = Object.freeze({
    SYSTEM_INITIALIZED: 'system_initialized',
    SYSTEM_READY: 'system_ready',
    SYSTEM_ERROR: 'system_error',
    SYSTEM_SHUTDOWN: 'system_shutdown',
    
    SERVICE_REGISTERED: 'service_registered',
    SERVICE_UNREGISTERED: 'service_unregistered',
    SERVICE_RESOLVED: 'service_resolved',
    
    CACHE_HIT: 'cache_hit',
    CACHE_MISS: 'cache_miss',
    CACHE_EVICT: 'cache_evict',
    
    WEBSOCKET_CONNECTED: 'websocket_connected',
    WEBSOCKET_DISCONNECTED: 'websocket_disconnected',
    WEBSOCKET_ERROR: 'websocket_error',
    
    AUTH_LOGIN: 'auth_login',
    AUTH_LOGOUT: 'auth_logout',
    AUTH_TOKEN_REFRESH: 'auth_token_refresh',
    
    NETWORK_REQUEST: 'network_request',
    NETWORK_RESPONSE: 'network_response',
    NETWORK_ERROR: 'network_error',
});

// Core Log Levels
/**
 * Core log levels
 * 
 * @readonly
 * @enum {string}
 * @description Core system log levels
 */
export const CORE_LOG_LEVELS = Object.freeze({
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    FATAL: 'fatal',
});

// Core Service Lifetime
/**
 * Core service lifetime
 * 
 * @readonly
 * @enum {string}
 * @description Core system service lifetime values
 */
export const CORE_SERVICE_LIFETIME = Object.freeze({
    TRANSIENT: 'transient',
    SINGLETON: 'singleton',
    SCOPED: 'scoped',
});

// Core Platform Types
/**
 * Core platform types
 * 
 * @readonly
 * @enum {string}
 * @description Core system platform types
 */
export const CORE_PLATFORM_TYPES = Object.freeze({
    WEB: 'web',
    MOBILE: 'mobile',
    DESKTOP: 'desktop',
    SERVER: 'server',
});

// Core Environment Types
/**
 * Core environment types
 * 
 * @readonly
 * @enum {string}
 * @description Core system environment types
 */
export const CORE_ENVIRONMENT_TYPES = Object.freeze({
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production',
    TEST: 'test',
});

// Utility functions for constants
/**
 * Checks if a value is a valid core status
 * 
 * @function isValidCoreStatus
 * @param {string} status - Status to check
 * @returns {boolean} Whether status is valid
 * @description Validates core system status
 */
export function isValidCoreStatus(status) {
    return Object.values(CORE_STATUS).includes(status);
}

/**
 * Checks if a value is a valid core error code
 * 
 * @function isValidCoreErrorCode
 * @param {string} errorCode - Error code to check
 * @returns {boolean} Whether error code is valid
 * @description Validates core system error code
 */
export function isValidCoreErrorCode(errorCode) {
    return Object.values(CORE_ERROR_CODES).includes(errorCode);
}

/**
 * Gets error message for error code
 * 
 * @function getCoreErrorMessage
 * @param {string} errorCode - Error code
 * @returns {string} Error message
 * @description Gets error message for core error code
 */
export function getCoreErrorMessage(errorCode) {
    return CORE_ERROR_MESSAGES[errorCode] || CORE_ERROR_MESSAGES[CORE_ERROR_CODES.UNKNOWN_ERROR];
}

/**
 * Checks if a value is a valid core log level
 * 
 * @function isValidCoreLogLevel
 * @param {string} logLevel - Log level to check
 * @returns {boolean} Whether log level is valid
 * @description Validates core system log level
 */
export function isValidCoreLogLevel(logLevel) {
    return Object.values(CORE_LOG_LEVELS).includes(logLevel);
}

/**
 * Checks if a value is a valid service lifetime
 * 
 * @function isValidServiceLifetime
 * @param {string} lifetime - Service lifetime to check
 * @returns {boolean} Whether lifetime is valid
 * @description Validates service lifetime
 */
export function isValidServiceLifetime(lifetime) {
    return Object.values(CORE_SERVICE_LIFETIME).includes(lifetime);
}

/**
 * Checks if a value is a valid platform type
 * 
 * @function isValidPlatformType
 * @param {string} platform - Platform type to check
 * @returns {boolean} Whether platform type is valid
 * @description Validates platform type
 */
export function isValidPlatformType(platform) {
    return Object.values(CORE_PLATFORM_TYPES).includes(platform);
}

/**
 * Checks if a value is a valid environment type
 * 
 * @function isValidEnvironmentType
 * @param {string} environment - Environment type to check
 * @returns {boolean} Whether environment type is valid
 * @description Validates environment type
 */
export function isValidEnvironmentType(environment) {
    return Object.values(CORE_ENVIRONMENT_TYPES).includes(environment);
}
