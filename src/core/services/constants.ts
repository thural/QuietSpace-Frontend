/**
 * Services Module Constants
 * 
 * Centralized constants for core services including logger, theme service,
 * user service, and other shared service configurations.
 */

// Logger service constants
export const LOGGER_CONSTANTS = {
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

    // Default logger configuration
    DEFAULT_CONFIG: {
        level: 2, // INFO
        enableConsole: true,
        enableFile: false,
        enableRemote: false,
        enableColors: true,
        enableTimestamp: true,
        enableStackTrace: false,
        maxLogSize: 1000,
        bufferSize: 100,
        flushInterval: 5000,
        dateFormat: 'ISO',
        messageFormat: '{timestamp} [{level}] {message}',
        structuredFormat: false,
    },

    // Logger performance thresholds
    PERFORMANCE_THRESHOLDS: {
        MAX_LOG_ENTRY_SIZE: 10000, // 10KB
        MAX_BUFFER_SIZE: 1000,
        MAX_FLUSH_INTERVAL: 30000, // 30 seconds
        MIN_FLUSH_INTERVAL: 1000, // 1 second
    },

    // Logger error codes
    ERROR_CODES: {
        INVALID_LOG_LEVEL: 'LOGGER_INVALID_LOG_LEVEL',
        INVALID_CONFIG: 'LOGGER_INVALID_CONFIG',
        TARGET_CREATION_FAILED: 'LOGGER_TARGET_CREATION_FAILED',
        BUFFER_OVERFLOW: 'LOGGER_BUFFER_OVERFLOW',
        FLUSH_FAILED: 'LOGGER_FLUSH_FAILED',
        SERIALIZATION_FAILED: 'LOGGER_SERIALIZATION_FAILED',
    },
} as const;

// Theme service constants
export const THEME_SERVICE_CONSTANTS = {
    // Theme storage keys
    STORAGE_KEYS: {
        THEME: 'quietSpace_theme',
        THEME_VARIANT: 'quietSpace_themeVariant',
        CUSTOM_THEME: 'quietSpace_customTheme',
        THEME_PREFERENCES: 'quietSpace_themePreferences',
    },

    // Default theme configuration
    DEFAULT_CONFIG: {
        variant: 'light',
        enableAutoSwitch: true,
        enableSystemPreference: true,
        enableCustomThemes: true,
        enableAnimations: true,
        enableTransitions: true,
        storageType: 'localStorage',
        syncAcrossTabs: true,
        persistPreferences: true,
    },

    // Theme variants
    VARIANTS: {
        LIGHT: 'light',
        DARK: 'dark',
        AUTO: 'auto',
        CUSTOM: 'custom',
    },

    // Theme events
    EVENTS: {
        THEME_CHANGED: 'theme:changed',
        VARIANT_CHANGED: 'theme:variantChanged',
        CUSTOM_THEME_CREATED: 'theme:customCreated',
        CUSTOM_THEME_UPDATED: 'theme:customUpdated',
        CUSTOM_THEME_DELETED: 'theme:customDeleted',
        PREFERENCES_UPDATED: 'theme:preferencesUpdated',
    },

    // Theme validation
    VALIDATION: {
        MAX_CUSTOM_THEMES: 10,
        MAX_THEME_NAME_LENGTH: 50,
        MIN_THEME_NAME_LENGTH: 1,
        VALID_THEME_NAME_PATTERN: /^[a-zA-Z0-9_-]+$/,
    },
} as const;

// User service constants
export const USER_SERVICE_CONSTANTS = {
    // User storage keys
    STORAGE_KEYS: {
        USER_PROFILE: 'quietSpace_userProfile',
        USER_PREFERENCES: 'quietSpace_userPreferences',
        USER_SETTINGS: 'quietSpace_userSettings',
        USER_SESSION: 'quietSpace_userSession',
        USER_CACHE: 'quietSpace_userCache',
    },

    // Default user configuration
    DEFAULT_CONFIG: {
        enableProfileCaching: true,
        enablePreferencesSync: true,
        enableSessionPersistence: true,
        cacheTimeout: 300000, // 5 minutes
        sessionTimeout: 3600000, // 1 hour
        enableAutoRefresh: true,
        refreshInterval: 60000, // 1 minute
        enableOfflineMode: true,
    },

    // User events
    EVENTS: {
        PROFILE_UPDATED: 'user:profileUpdated',
        PREFERENCES_UPDATED: 'user:preferencesUpdated',
        SETTINGS_UPDATED: 'user:settingsUpdated',
        SESSION_EXPIRED: 'user:sessionExpired',
        OFFLINE_MODE_CHANGED: 'user:offlineModeChanged',
        CACHE_INVALIDATED: 'user:cacheInvalidated',
    },

    // User status
    STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        OFFLINE: 'offline',
        AWAY: 'away',
        BUSY: 'busy',
    },

    // User roles
    ROLES: {
        GUEST: 'guest',
        USER: 'user',
        MODERATOR: 'moderator',
        ADMIN: 'admin',
        SUPER_ADMIN: 'super_admin',
    },

    // User validation
    VALIDATION: {
        MIN_USERNAME_LENGTH: 3,
        MAX_USERNAME_LENGTH: 30,
        MIN_DISPLAY_NAME_LENGTH: 1,
        MAX_DISPLAY_NAME_LENGTH: 50,
        MAX_BIO_LENGTH: 500,
        VALID_USERNAME_PATTERN: /^[a-zA-Z0-9_-]+$/,
    },
} as const;

// Service factory constants
export const SERVICE_FACTORY_CONSTANTS = {
    // Service lifecycle states
    LIFECYCLE_STATES: {
        INITIALIZING: 'initializing',
        READY: 'ready',
        ERROR: 'error',
        DISPOSED: 'disposed',
    },

    // Service dependency injection tokens
    DI_TOKENS: {
        LOGGER_SERVICE: 'LoggerService',
        THEME_SERVICE: 'ThemeService',
        USER_SERVICE: 'UserService',
        CACHE_SERVICE: 'CacheService',
        WEBSOCKET_SERVICE: 'WebSocketService',
        AUTH_SERVICE: 'AuthService',
        NETWORK_SERVICE: 'NetworkService',
    },

    // Service configuration defaults
    DEFAULT_CONFIG: {
        enableSingleton: true,
        enableLazyInitialization: true,
        enableDependencyInjection: true,
        enableHealthChecks: true,
        enableMetrics: true,
        enableErrorHandling: true,
        enableRetry: true,
        maxRetries: 3,
        retryDelay: 1000,
    },

    // Service health check intervals
    HEALTH_CHECK_INTERVALS: {
        FAST: 10000,    // 10 seconds
        NORMAL: 30000,  // 30 seconds
        SLOW: 60000,    // 1 minute
        CRITICAL: 5000, // 5 seconds
    },
} as const;

// Service error codes
export const SERVICE_ERROR_CODES = {
    // Common service errors
    SERVICE_NOT_FOUND: 'SERVICE_NOT_FOUND',
    SERVICE_INITIALIZATION_FAILED: 'SERVICE_INITIALIZATION_FAILED',
    SERVICE_DISPOSED: 'SERVICE_DISPOSED',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

    // Configuration errors
    INVALID_CONFIGURATION: 'INVALID_CONFIGURATION',
    MISSING_DEPENDENCY: 'MISSING_DEPENDENCY',
    CIRCULAR_DEPENDENCY: 'CIRCULAR_DEPENDENCY',

    // Runtime errors
    SERVICE_TIMEOUT: 'SERVICE_TIMEOUT',
    SERVICE_OVERLOAD: 'SERVICE_OVERLOAD',
    SERVICE_CRASHED: 'SERVICE_CRASHED',

    // State errors
    INVALID_STATE: 'INVALID_STATE',
    OPERATION_NOT_SUPPORTED: 'OPERATION_NOT_SUPPORTED',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
} as const;

// Service performance constants
export const SERVICE_PERFORMANCE_CONSTANTS = {
    // Performance thresholds
    THRESHOLDS: {
        INITIALIZATION_TIME: 5000,      // 5 seconds
        RESPONSE_TIME: 1000,             // 1 second
        MEMORY_USAGE: 50 * 1024 * 1024, // 50MB
        CPU_USAGE: 0.8,                 // 80%
        ERROR_RATE: 0.05,                // 5%
    },

    // Metrics collection intervals
    METRICS_INTERVALS: {
        REAL_TIME: 1000,      // 1 second
        FREQUENT: 5000,        // 5 seconds
        NORMAL: 30000,         // 30 seconds
        INFREQUENT: 300000,    // 5 minutes
    },

    // Performance optimization settings
    OPTIMIZATION: {
        ENABLE_CACHING: true,
        ENABLE_LAZY_LOADING: true,
        ENABLE_BATCHING: true,
        ENABLE_COMPRESSION: true,
        MAX_BATCH_SIZE: 100,
        CACHE_TTL: 300000, // 5 minutes
    },
} as const;

// Service storage constants
export const SERVICE_STORAGE_CONSTANTS = {
    // Storage types
    TYPES: {
        LOCAL_STORAGE: 'localStorage',
        SESSION_STORAGE: 'sessionStorage',
        MEMORY: 'memory',
        INDEXED_DB: 'indexedDB',
        CUSTOM: 'custom',
    },

    // Storage keys prefixes
    KEY_PREFIXES: {
        SERVICE: 'qs_service_',
        CACHE: 'qs_cache_',
        CONFIG: 'qs_config_',
        METRICS: 'qs_metrics_',
        TEMP: 'qs_temp_',
    },

    // Storage limits
    LIMITS: {
        LOCAL_STORAGE_QUOTA: 5 * 1024 * 1024,    // 5MB
        SESSION_STORAGE_QUOTA: 5 * 1024 * 1024,  // 5MB
        INDEXED_DB_QUOTA: 50 * 1024 * 1024,      // 50MB
        MAX_KEY_LENGTH: 255,
        MAX_VALUE_SIZE: 1024 * 1024,             // 1MB
    },

    // Storage cleanup intervals
    CLEANUP_INTERVALS: {
        FREQUENT: 60000,      // 1 minute
        NORMAL: 300000,       // 5 minutes
        INFREQUENT: 1800000,  // 30 minutes
    },
} as const;

// Service communication constants
export const SERVICE_COMMUNICATION_CONSTANTS = {
    // Message types
    MESSAGE_TYPES: {
        REQUEST: 'request',
        RESPONSE: 'response',
        EVENT: 'event',
        ERROR: 'error',
        HEARTBEAT: 'heartbeat',
    },

    // Communication channels
    CHANNELS: {
        SERVICE_BUS: 'serviceBus',
        EVENT_BUS: 'eventBus',
        COMMAND_BUS: 'commandBus',
        QUERY_BUS: 'queryBus',
    },

    // Message priorities
    PRIORITIES: {
        CRITICAL: 10,
        HIGH: 5,
        NORMAL: 1,
        LOW: 0,
    },

    // Timeouts
    TIMEOUTS: {
        REQUEST_TIMEOUT: 10000,      // 10 seconds
        RESPONSE_TIMEOUT: 15000,      // 15 seconds
        HEARTBEAT_INTERVAL: 30000,     // 30 seconds
        CONNECTION_TIMEOUT: 5000,      // 5 seconds
    },
} as const;
