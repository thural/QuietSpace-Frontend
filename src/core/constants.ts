/**
 * Core System Constants
 * 
 * Centralized constants and enums for the core system.
 * Provides clean constant exports following Black Box pattern.
 */

// Core System Constants
export const CORE_CONSTANTS = {
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
    DEFAULT_FACTORY_CACHE_SIZE: 100
} as const;

// Core System Status
export enum CORE_STATUS {
    UNINITIALIZED = 'uninitialized',
    INITIALIZING = 'initializing',
    INITIALIZED = 'initialized',
    ERROR = 'error',
    SHUTTING_DOWN = 'shutting_down',
    SHUTDOWN = 'shutdown'
}

// Core System Events
export enum CORE_EVENTS {
    SYSTEM_INITIALIZED = 'system:initialized',
    SYSTEM_ERROR = 'system:error',
    SYSTEM_SHUTDOWN = 'system:shutdown',
    SERVICE_CREATED = 'service:created',
    SERVICE_DESTROYED = 'service:destroyed',
    SERVICE_ERROR = 'service:error',
    CACHE_CLEARED = 'cache:cleared',
    WEBSOCKET_CONNECTED = 'websocket:connected',
    WEBSOCKET_DISCONNECTED = 'websocket:disconnected',
    AUTH_LOGIN = 'auth:login',
    AUTH_LOGOUT = 'auth:logout',
    THEME_CHANGED = 'theme:changed',
    NETWORK_REQUEST = 'network:request',
    NETWORK_RESPONSE = 'network:response',
    NETWORK_ERROR = 'network:error'
}

// Service Priority Levels
export enum SERVICE_PRIORITY {
    CRITICAL = 0,
    HIGH = 1,
    NORMAL = 2,
    LOW = 3,
    BACKGROUND = 4
}

// Error Codes
export enum CORE_ERROR_CODES {
    INITIALIZATION_FAILED = 'CORE_001',
    SERVICE_NOT_FOUND = 'CORE_002',
    DEPENDENCY_MISSING = 'CORE_003',
    CONFIGURATION_INVALID = 'CORE_004',
    TIMEOUT = 'CORE_005',
    PERMISSION_DENIED = 'CORE_006',
    AUTHENTICATION_FAILED = 'CORE_007',
    NETWORK_ERROR = 'CORE_008',
    CACHE_ERROR = 'CORE_009',
    WEBSOCKET_ERROR = 'CORE_010',
    THEME_ERROR = 'CORE_011',
    LOGGING_ERROR = 'CORE_012',
    CONTAINER_ERROR = 'CORE_013'
}

// Error Messages
export const CORE_ERROR_MESSAGES = {
    [CORE_ERROR_CODES.INITIALIZATION_FAILED]: 'Core system initialization failed',
    [CORE_ERROR_CODES.SERVICE_NOT_FOUND]: 'Service not found',
    [CORE_ERROR_CODES.DEPENDENCY_MISSING]: 'Required dependency is missing',
    [CORE_ERROR_CODES.CONFIGURATION_INVALID]: 'Configuration is invalid',
    [CORE_ERROR_CODES.TIMEOUT]: 'Operation timed out',
    [CORE_ERROR_CODES.PERMISSION_DENIED]: 'Permission denied',
    [CORE_ERROR_CODES.AUTHENTICATION_FAILED]: 'Authentication failed',
    [CORE_ERROR_CODES.NETWORK_ERROR]: 'Network error occurred',
    [CORE_ERROR_CODES.CACHE_ERROR]: 'Cache error occurred',
    [CORE_ERROR_CODES.WEBSOCKET_ERROR]: 'WebSocket error occurred',
    [CORE_ERROR_CODES.THEME_ERROR]: 'Theme error occurred',
    [CORE_ERROR_CODES.LOGGING_ERROR]: 'Logging error occurred',
    [CORE_ERROR_CODES.CONTAINER_ERROR]: 'Container error occurred'
} as const;

// Service Names
export const CORE_SERVICE_NAMES = {
    CACHE: 'cache',
    WEBSOCKET: 'websocket',
    AUTH: 'auth',
    THEME: 'theme',
    SERVICES: 'services',
    NETWORK: 'network',
    CONTAINER: 'container'
} as const;

// Default Configuration
export const DEFAULT_CORE_CONFIG = {
    cache: {
        maxSize: CORE_CONSTANTS.DEFAULT_CACHE_SIZE,
        defaultTtl: CORE_CONSTANTS.DEFAULT_CACHE_TTL,
        strategy: CORE_CONSTANTS.DEFAULT_CACHE_STRATEGY,
        enableMetrics: true
    },
    websocket: {
        reconnectInterval: CORE_CONSTANTS.DEFAULT_RECONNECT_INTERVAL,
        maxReconnectAttempts: CORE_CONSTANTS.DEFAULT_MAX_RECONNECT_ATTEMPTS,
        timeout: CORE_CONSTANTS.DEFAULT_WEBSOCKET_TIMEOUT
    },
    auth: {
        tokenRefreshInterval: CORE_CONSTANTS.DEFAULT_TOKEN_REFRESH_INTERVAL,
        sessionTimeout: CORE_CONSTANTS.DEFAULT_SESSION_TIMEOUT,
        maxLoginAttempts: CORE_CONSTANTS.DEFAULT_MAX_LOGIN_ATTEMPTS
    },
    theme: {
        name: CORE_CONSTANTS.DEFAULT_THEME_NAME,
        variant: CORE_CONSTANTS.DEFAULT_THEME_VARIANT
    },
    network: {
        timeout: CORE_CONSTANTS.DEFAULT_API_TIMEOUT,
        retryAttempts: CORE_CONSTANTS.DEFAULT_RETRY_ATTEMPTS,
        retryDelay: CORE_CONSTANTS.DEFAULT_RETRY_DELAY
    },
    services: {
        level: CORE_CONSTANTS.DEFAULT_LOG_LEVEL,
        enableConsole: true,
        enableFile: false,
        enableRemote: false
    }
} as const;

// Validation Rules
export const CORE_VALIDATION_RULES = {
    cache: {
        maxSize: { min: 1, max: 10000 },
        defaultTtl: { min: 1000, max: 86400000 }, // 1 second to 24 hours
        strategy: ['lru', 'fifo', 'lfu']
    },
    websocket: {
        reconnectInterval: { min: 1000, max: 30000 },
        maxReconnectAttempts: { min: 1, max: 10 },
        timeout: { min: 1000, max: 60000 }
    },
    auth: {
        tokenRefreshInterval: { min: 60000, max: 3600000 }, // 1 minute to 1 hour
        sessionTimeout: { min: 300000, max: 86400000 }, // 5 minutes to 24 hours
        maxLoginAttempts: { min: 1, max: 10 }
    },
    network: {
        timeout: { min: 1000, max: 120000 }, // 1 second to 2 minutes
        retryAttempts: { min: 0, max: 5 },
        retryDelay: { min: 100, max: 10000 }
    }
} as const;

// Performance Metrics
export const CORE_PERFORMANCE_METRICS = {
    CACHE_HIT_RATE_TARGET: 0.8,
    WEBSOCKET_CONNECTION_TIME_TARGET: 5000, // 5 seconds
    AUTH_LOGIN_TIME_TARGET: 3000, // 3 seconds
    NETWORK_REQUEST_TIME_TARGET: 5000, // 5 seconds
    THEME_SWITCH_TIME_TARGET: 1000, // 1 second
    LOG_BUFFER_SIZE: 1000,
    SERVICE_CREATION_TIME_TARGET: 100 // 100ms
} as const;

// Environment Variables
export const CORE_ENVIRONMENT_VARIABLES = {
    NODE_ENV: 'NODE_ENV',
    CORE_LOG_LEVEL: 'CORE_LOG_LEVEL',
    CORE_CACHE_SIZE: 'CORE_CACHE_SIZE',
    CORE_WEBSOCKET_URL: 'CORE_WEBSOCKET_URL',
    CORE_API_BASE_URL: 'CORE_API_BASE_URL',
    CORE_AUTH_SECRET: 'CORE_AUTH_SECRET',
    CORE_THEME_DEFAULT: 'CORE_THEME_DEFAULT'
} as const;

// Feature Flags
export const CORE_FEATURE_FLAGS = {
    ENABLE_METRICS: true,
    ENABLE_PERFORMANCE_MONITORING: true,
    ENABLE_ERROR_REPORTING: true,
    ENABLE_DEBUG_MODE: false,
    ENABLE_MOCK_SERVICES: false,
    ENABLE_HEALTH_CHECKS: true,
    ENABLE_AUTO_RECOVERY: true
} as const;

// Health Check Status
export enum HEALTH_CHECK_STATUS {
    HEALTHY = 'healthy',
    UNHEALTHY = 'unhealthy',
    DEGRADED = 'degraded',
    UNKNOWN = 'unknown'
}
