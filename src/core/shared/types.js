/**
 * Core System Shared Types
 * 
 * Centralized type definitions for all core system interfaces.
 * Provides clean type exports following Black Box pattern.
 */

import { WebSocketState, LogLevel } from './enums.js';

// Basic Core Interfaces

/**
 * Cache service interface
 * @typedef {Object} ICacheService
 * @property {function} get - Get value from cache
 * @property {function} set - Set value in cache
 * @property {function} delete - Delete value from cache
 * @property {function} clear - Clear all cache
 * @property {function} has - Check if key exists
 * @property {function} getStats - Get cache statistics
 */

/**
 * Cache service manager interface
 * @typedef {Object} ICacheServiceManager
 * @property {function} get - Get value from cache
 * @property {function} set - Set value in cache
 * @property {function} delete - Delete value from cache
 * @property {function} clear - Clear all cache
 * @property {function} has - Check if key exists
 * @property {function} getStats - Get cache statistics
 * @property {function} createCache - Create new cache instance
 * @property {function} getCache - Get cache by name
 * @property {function} removeCache - Remove cache by name
 * @property {function} clearAll - Clear all caches
 * @property {function} getAllStats - Get all cache statistics
 */

/**
 * WebSocket service interface
 * @typedef {Object} IWebSocketService
 * @property {function} connect - Connect to WebSocket
 * @property {function} disconnect - Disconnect from WebSocket
 * @property {function} send - Send message
 * @property {function} subscribe - Subscribe to events
 * @property {function} isConnected - Check if connected
 * @property {function} getState - Get connection state
 */

/**
 * Authentication service interface
 * @typedef {Object} IAuthService
 * @property {function} authenticate - Authenticate user
 * @property {function} register - Register user
 * @property {function} logout - Logout user
 * @property {function} refreshToken - Refresh token
 * @property {function} validateToken - Validate token
 * @property {function} getCurrentUser - Get current user
 */

/**
 * Theme service interface
 * @typedef {Object} IThemeService
 * @property {function} getTheme - Get current theme
 * @property {function} setTheme - Set theme
 * @property {function} createTheme - Create theme
 * @property {function} getTokens - Get theme tokens
 * @property {function} switchTheme - Switch theme
 */

/**
 * Logger service interface
 * @typedef {Object} ILoggerService
 * @property {function} debug - Log debug message
 * @property {function} info - Log info message
 * @property {function} warn - Log warning message
 * @property {function} error - Log error message
 * @property {function} setLevel - Set log level
 * @property {function} getLevel - Get log level
 */

/**
 * Network service interface
 * @typedef {Object} INetworkService
 * @property {function} get - Make GET request
 * @property {function} post - Make POST request
 * @property {function} put - Make PUT request
 * @property {function} delete - Make DELETE request
 * @property {function} setAuth - Set authentication token
 * @property {function} clearAuth - Clear authentication token
 */

/**
 * Service container interface
 * @typedef {Object} IServiceContainer
 * @property {function} register - Register service
 * @property {function} get - Get service
 * @property {function} has - Check if service exists
 * @property {function} clear - Clear all services
 */

// Core System Composite Types

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

// Data Types

/**
 * Cache entry interface
 * @typedef {Object} CacheEntry
 * @property {string} key - Cache key
 * @property {*} value - Cache value
 * @property {number} timestamp - Creation timestamp
 * @property {number} ttl - Time to live
 * @property {number} expiresAt - Expiration timestamp
 * @property {number} size - Entry size
 */

/**
 * Cache statistics interface
 * @typedef {Object} CacheStats
 * @property {number} size - Cache size
 * @property {number} hits - Cache hits
 * @property {number} misses - Cache misses
 * @property {number} hitRate - Hit rate percentage
 * @property {number} memoryUsage - Memory usage
 * @property {number} evictions - Number of evictions
 * @property {number} sets - Number of sets
 * @property {number} gets - Number of gets
 * @property {number} deletes - Number of deletes
 * @property {number} createdAt - Creation timestamp
 * @property {number} updatedAt - Last update timestamp
 */

/**
 * Cache configuration interface
 * @typedef {Object} CacheConfig
 * @property {number} maxSize - Maximum cache size
 * @property {number} defaultTtl - Default time to live
 * @property {string} strategy - Cache strategy
 * @property {boolean} enableMetrics - Enable metrics collection
 */

/**
 * WebSocket message interface
 * @typedef {Object} WebSocketMessage
 * @property {string} type - Message type
 * @property {*} data - Message data
 * @property {number} timestamp - Message timestamp
 * @property {string} id - Message ID
 */

/**
 * WebSocket configuration interface
 * @typedef {Object} WebSocketConfig
 * @property {string} url - WebSocket URL
 * @property {number} reconnectInterval - Reconnect interval
 * @property {number} maxReconnectAttempts - Max reconnect attempts
 * @property {number} timeout - Connection timeout
 * @property {string[]} protocols - WebSocket protocols
 */

/**
 * Authentication credentials interface
 * @typedef {Object} AuthCredentials
 * @property {string} email - User email
 * @property {string} password - User password
 * @property {boolean} rememberMe - Remember me flag
 */

/**
 * Authentication user interface
 * @typedef {Object} AuthUser
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} username - Username
 * @property {string[]} roles - User roles
 * @property {string[]} permissions - User permissions
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
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
 * @property {AuthUser} user - User information
 * @property {AuthToken} token - Token information
 * @property {string} provider - Authentication provider
 * @property {Date} createdAt - Session creation date
 * @property {Date} expiresAt - Session expiration date
 * @property {boolean} isActive - Session active status
 */

/**
 * Authentication result interface
 * @typedef {Object} AuthResult
 * @property {boolean} success - Success flag
 * @property {*} data - Result data
 * @property {Object} error - Error information
 * @property {string} error.type - Error type
 * @property {string} error.message - Error message
 * @property {string} error.code - Error code
 * @property {Object} error.details - Error details
 */

/**
 * Theme configuration interface
 * @typedef {Object} ThemeConfig
 * @property {string} name - Theme name
 * @property {Object} colors - Theme colors
 * @property {Object} typography - Theme typography
 * @property {Object} spacing - Theme spacing
 * @property {Object} shadows - Theme shadows
 */

/**
 * Theme tokens interface
 * @typedef {Object} ThemeTokens
 * @property {Object} colors - Color tokens
 * @property {Object} typography - Typography tokens
 * @property {Object} spacing - Spacing tokens
 * @property {Object} shadows - Shadow tokens
 * @property {Object} breakpoints - Breakpoint tokens
 * @property {Object} radius - Border radius tokens
 */

/**
 * Enhanced theme interface
 * @typedef {Object} EnhancedTheme
 * @property {Object} colors - Color tokens
 * @property {Object} typography - Typography tokens
 * @property {Object} spacing - Spacing tokens
 * @property {Object} shadows - Shadow tokens
 * @property {Object} breakpoints - Breakpoint tokens
 * @property {Object} radius - Border radius tokens
 * @property {function} getSpacing - Get spacing value
 * @property {function} getColor - Get color value
 * @property {function} getTypography - Get typography value
 */

/**
 * API response interface
 * @typedef {Object} ApiResponse
 * @property {*} data - Response data
 * @property {boolean} success - Success flag
 * @property {string} message - Response message
 * @property {string} error - Error message
 * @property {number} status - HTTP status
 * @property {Object} headers - Response headers
 */

/**
 * API error interface
 * @typedef {Object} ApiError
 * @property {string} message - Error message
 * @property {number} status - HTTP status
 * @property {string} code - Error code
 * @property {Object} details - Error details
 */

/**
 * Service configuration interface
 * @typedef {Object} IServiceConfig
 * @property {LogLevel} level - Log level
 * @property {boolean} enableConsole - Enable console logging
 * @property {boolean} enableFile - Enable file logging
 * @property {boolean} enableRemote - Enable remote logging
 */

// DI Types

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
 * @property {boolean} singleton - Singleton flag
 * @property {ServiceIdentifier[]} dependencies - Service dependencies
 */

// Core System Configuration

/**
 * Core configuration interface
 * @typedef {Object} CoreConfig
 * @property {CacheConfig} cache - Cache configuration
 * @property {WebSocketConfig} websocket - WebSocket configuration
 * @property {ThemeConfig} theme - Theme configuration
 * @property {*} network - Network configuration
 * @property {IServiceConfig} services - Services configuration
 */

// Core System Events

/**
 * Core system event interface
 * @typedef {Object} CoreSystemEvent
 * @property {string} type - Event type
 * @property {*} payload - Event payload
 * @property {Date} timestamp - Event timestamp
 */

// Core System Status

/**
 * Core system status interface
 * @typedef {Object} CoreSystemStatus
 * @property {boolean} initialized - Initialization status
 * @property {Object} services - Service status
 * @property {string[]} errors - Error list
 * @property {Date} lastUpdated - Last update timestamp
 */

// Export all types for use - available via JSDoc typedefs
