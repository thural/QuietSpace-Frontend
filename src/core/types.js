/**
 * Core System Types
 * 
 * Centralized type definitions for all core system interfaces.
 * Provides clean type exports following Black Box pattern.
 */

/**
 * Cache service interface
 * @typedef {Object} ICacheService
 * @property {(key: string) => Promise<any>} get - Get value from cache
 * @property {(key: string, value: any, ttl?: number) => Promise<void>} set - Set value in cache
 * @property {(key: string) => Promise<void>} delete - Delete value from cache
 * @property {() => Promise<void>} clear - Clear all cache
 * @property {(key: string) => Promise<boolean>} has - Check if key exists
 * @property {() => CacheStats} getStats - Get cache statistics
 */

/**
 * Cache service manager interface
 * @typedef {Object} ICacheServiceManager
 * @property {(key: string) => Promise<any>} get - Get value from cache
 * @property {(key: string, value: any, ttl?: number) => Promise<void>} set - Set value in cache
 * @property {(key: string) => Promise<void>} delete - Delete value from cache
 * @property {() => Promise<void>} clear - Clear all cache
 * @property {(key: string) => Promise<boolean>} has - Check if key exists
 * @property {() => CacheStats} getStats - Get cache statistics
 * @property {(config?: CacheConfig) => ICacheService} createCache - Create new cache instance
 * @property {(name: string) => ICacheService|null} getCache - Get cache by name
 * @property {(name: string) => void} removeCache - Remove cache by name
 * @property {() => void} clearAll - Clear all caches
 * @property {() => Record<string, CacheStats>} getAllStats - Get all cache statistics
 */

/**
 * WebSocket service interface
 * @typedef {Object} IWebSocketService
 * @property {() => Promise<void>} connect - Connect to WebSocket
 * @property {() => Promise<void>} disconnect - Disconnect from WebSocket
 * @property {(message: WebSocketMessage) => Promise<void>} send - Send message
 * @property {(event: string, handler: Function) => Function} subscribe - Subscribe to events
 * @property {() => boolean} isConnected - Check connection status
 * @property {() => WebSocketState} getState - Get WebSocket state
 */

/**
 * Authentication service interface
 * @typedef {Object} IAuthService
 * @property {(credentials: AuthCredentials) => Promise<AuthResult>} authenticate - Authenticate user
 * @property {(userData: AuthCredentials) => Promise<AuthResult>} register - Register user
 * @property {() => Promise<AuthResult>} logout - Logout user
 * @property {(refreshToken: string) => Promise<AuthResult>} refreshToken - Refresh token
 * @property {(token: string) => Promise<AuthResult>} validateToken - Validate token
 * @property {() => Promise<AuthResult>} getCurrentUser - Get current user
 */

/**
 * Theme service interface
 * @typedef {Object} IThemeService
 * @property {() => EnhancedTheme} getTheme - Get current theme
 * @property {(theme: EnhancedTheme) => void} setTheme - Set theme
 * @property {(config: ThemeConfig) => EnhancedTheme} createTheme - Create theme
 * @property {() => ThemeTokens} getTokens - Get theme tokens
 * @property {(name: string) => void} switchTheme - Switch theme
 */

/**
 * Logger service interface
 * @typedef {Object} ILoggerService
 * @property {(message: string, ...any[]) => void} debug - Log debug message
 * @property {(message: string, ...any[]) => void} info - Log info message
 * @property {(message: string, ...any[]) => void} warn - Log warning message
 * @property {(message: string, error?: Error, ...any[]) => void} error - Log error message
 * @property {(level: LogLevel) => void} setLevel - Set log level
 * @property {() => LogLevel} getLevel - Get log level
 */

/**
 * Network service interface
 * @typedef {Object} INetworkService
 * @property {(url: string, config?: any) => Promise<ApiResponse>} get - Make GET request
 * @property {(url: string, data?: any, config?: any) => Promise<ApiResponse>} post - Make POST request
 * @property {(url: string, data?: any, config?: any) => Promise<ApiResponse>} put - Make PUT request
 * @property {(url: string, config?: any) => Promise<ApiResponse>} delete - Make DELETE request
 * @property {(token: string) => void} setAuth - Set auth token
 * @property {() => void} clearAuth - Clear auth token
 */

/**
 * Service container interface
 * @typedef {Object} IServiceContainer
 * @property {(identifier: ServiceIdentifier, factory: ServiceFactory) => void} register - Register service
 * @property {(identifier: ServiceIdentifier) => any} get - Get service
 * @property {(identifier: ServiceIdentifier) => boolean} has - Check if service exists
 * @property {() => void} clear - Clear all services
 */

/**
 * Core services interface
 * @typedef {Object} ICoreServices
 * @property {ICacheServiceManager} cache - Cache service manager
 * @property {IWebSocketService} websocket - WebSocket service
 * @property {IAuthService} auth - Authentication service
 * @property {IThemeService} theme - Theme service
 * @property {ILoggerService} services - Logger service
 * @property {INetworkService} network - Network service
 * @property {IServiceContainer} container - Service container
 */

/**
 * Cache entry interface
 * @typedef {Object} CacheEntry
 * @property {string} key - Cache key
 * @property {*} value - Cache value
 * @property {number} timestamp - Entry timestamp
 * @property {number} [ttl] - Time to live
 * @property {number} [expiresAt] - Expiration timestamp
 */

/**
 * Cache statistics interface
 * @typedef {Object} CacheStats
 * @property {number} size - Cache size
 * @property {number} hits - Cache hits
 * @property {number} misses - Cache misses
 * @property {number} hitRate - Hit rate percentage
 * @property {number} memoryUsage - Memory usage
 */

/**
 * Cache configuration interface
 * @typedef {Object} CacheConfig
 * @property {number} [maxSize] - Maximum cache size
 * @property {number} [defaultTtl] - Default time to live
 * @property {string} [strategy] - Cache strategy
 * @property {boolean} [enableMetrics] - Enable metrics
 */

/**
 * WebSocket message interface
 * @typedef {Object} WebSocketMessage
 * @property {string} type - Message type
 * @property {*} data - Message data
 * @property {number} timestamp - Message timestamp
 * @property {string} [id] - Message ID
 */

/**
 * WebSocket configuration interface
 * @typedef {Object} WebSocketConfig
 * @property {string} url - WebSocket URL
 * @property {number} [reconnectInterval] - Reconnect interval
 * @property {number} [maxReconnectAttempts] - Maximum reconnect attempts
 * @property {number} [timeout] - Connection timeout
 * @property {Array<string>} [protocols] - WebSocket protocols
 */

/**
 * WebSocket state enumeration
 * @readonly
 * @enum {string}
 */
export const WebSocketState = Object.freeze({
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    RECONNECTING: 'reconnecting',
    ERROR: 'error'
});

/**
 * Authentication credentials interface
 * @typedef {Object} AuthCredentials
 * @property {string} email - User email
 * @property {string} password - User password
 * @property {boolean} [rememberMe] - Remember me flag
 */

/**
 * Authentication user interface
 * @typedef {Object} AuthUser
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} username - User username
 * @property {Array<string>} roles - User roles
 * @property {Array<string>} permissions - User permissions
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Update date
 */

/**
 * Authentication token interface
 * @typedef {Object} AuthToken
 * @property {string} accessToken - Access token
 * @property {string} refreshToken - Refresh token
 * @property {Date} expiresAt - Expiration date
 * @property {string} tokenType - Token type
 */

/**
 * Authentication session interface
 * @typedef {Object} AuthSession
 * @property {AuthUser} user - User data
 * @property {AuthToken} token - Token data
 * @property {string} provider - Authentication provider
 * @property {Date} createdAt - Session creation date
 * @property {Date} expiresAt - Session expiration date
 * @property {boolean} isActive - Session active status
 */

/**
 * Authentication result interface
 * @typedef {Object} AuthResult
 * @property {boolean} success - Success flag
 * @property {*} [data] - Result data
 * @property {Object} [error] - Error information
 * @property {string} error.type - Error type
 * @property {string} error.message - Error message
 * @property {string} [error.code] - Error code
 * @property {Object} [error.details] - Error details
 */

/**
 * Theme configuration interface
 * @typedef {Object} ThemeConfig
 * @property {string} name - Theme name
 * @property {Object} [colors] - Theme colors
 * @property {Object} [typography] - Theme typography
 * @property {Object} [spacing] - Theme spacing
 * @property {Object} [shadows] - Theme shadows
 */

/**
 * Theme tokens interface
 * @typedef {Object} ThemeTokens
 * @property {Object} colors - Color tokens
 * @property {Object} typography - Typography tokens
 * @property {Object} spacing - Spacing tokens
 * @property {Object} shadows - Shadow tokens
 * @property {Object} breakpoints - Breakpoint tokens
 * @property {Object} radius - Radius tokens
 */

/**
 * Enhanced theme interface
 * @typedef {Object} EnhancedTheme
 * @property {Object} colors - Color tokens
 * @property {Object} typography - Typography tokens
 * @property {Object} spacing - Spacing tokens
 * @property {Object} shadows - Shadow tokens
 * @property {Object} breakpoints - Breakpoint tokens
 * @property {Object} radius - Radius tokens
 * @property {(key: string) => string} getSpacing - Get spacing value
 * @property {(path: string) => string} getColor - Get color value
 * @property {(key: string) => any} getTypography - Get typography value
 */

/**
 * API response interface
 * @typedef {Object} ApiResponse
 * @property {*} [data] - Response data
 * @property {boolean} success - Success flag
 * @property {string} [message] - Response message
 * @property {string} [error] - Error message
 * @property {number} [status] - HTTP status
 * @property {Object} [headers] - Response headers
 */

/**
 * API error interface
 * @typedef {Object} ApiError
 * @property {string} message - Error message
 * @property {number} [status] - HTTP status
 * @property {string} [code] - Error code
 * @property {Object} [details] - Error details
 */

/**
 * Log level enumeration
 * @readonly
 * @enum {string}
 */
export const LogLevel = Object.freeze({
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
});

/**
 * Service configuration interface
 * @typedef {Object} IServiceConfig
 * @property {LogLevel} [level] - Log level
 * @property {boolean} [enableConsole] - Enable console logging
 * @property {boolean} [enableFile] - Enable file logging
 * @property {boolean} [enableRemote] - Enable remote logging
 */

/**
 * Service identifier type
 * @typedef {string|symbol|Function} ServiceIdentifier
 */

/**
 * Service factory type
 * @typedef {Function} ServiceFactory
 */

/**
 * Service descriptor interface
 * @typedef {Object} ServiceDescriptor
 * @property {ServiceIdentifier} identifier - Service identifier
 * @property {ServiceFactory} factory - Service factory
 * @property {boolean} [singleton] - Singleton flag
 * @property {Array<ServiceIdentifier>} [dependencies] - Service dependencies
 */

/**
 * Core configuration interface
 * @typedef {Object} CoreConfig
 * @property {CacheConfig} [cache] - Cache configuration
 * @property {WebSocketConfig} [websocket] - WebSocket configuration
 * @property {ThemeConfig} [theme] - Theme configuration
 * @property {*} [network] - Network configuration
 * @property {IServiceConfig} [services] - Services configuration
 */

/**
 * Core system event interface
 * @typedef {Object} CoreSystemEvent
 * @property {string} type - Event type
 * @property {*} payload - Event payload
 * @property {Date} timestamp - Event timestamp
 */

/**
 * Core system status interface
 * @typedef {Object} CoreSystemStatus
 * @property {boolean} initialized - Initialization status
 * @property {Object} services - Service status
 * @property {Array<string>} errors - System errors
 * @property {Date} lastUpdated - Last update timestamp
 */

// Export all interfaces for external use
export {
    ICacheService,
    ICacheServiceManager,
    IWebSocketService,
    IAuthService,
    IThemeService,
    ILoggerService,
    INetworkService,
    IServiceContainer,
    ICoreServices,
    CacheEntry,
    CacheStats,
    CacheConfig,
    WebSocketMessage,
    WebSocketConfig,
    AuthCredentials,
    AuthUser,
    AuthToken,
    AuthSession,
    AuthResult,
    ThemeConfig,
    ThemeTokens,
    EnhancedTheme,
    ApiResponse,
    ApiError,
    LogLevel,
    IServiceConfig,
    ServiceIdentifier,
    ServiceFactory,
    ServiceDescriptor,
    CoreConfig,
    CoreSystemEvent,
    CoreSystemStatus
};
