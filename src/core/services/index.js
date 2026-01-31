/**
 * Services Module Black Box Index
 * 
 * Provides clean public API for the services system following Black Box pattern.
 * Only interfaces and factory functions are exported - implementation details are hidden.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * Logger service interface
 * @typedef {Object} ILoggerService
 * @property {(level: string, message: string, data?: any): void} log - Log message at specified level
 * @property {(message: string, data?: any): void} debug - Log debug message
 * @property {(message: string, data?: any): void} info - Log info message
 * @property {(message: string, data?: any): void} warn - Log warning message
 * @property {(message: string, data?: any): void} error - Log error message
 * @property {(message: string, data?: any): void} fatal - Log fatal message
 * @property {(config: ILoggerConfig): void} configure - Configure logger
 * @property {(target: ILoggerTarget): void} addTarget - Add logging target
 * @property {(target: string): void} removeTarget - Remove logging target
 * @property {(): void} cleanup - Cleanup resources
 * @property {(): boolean} isConfigured - Check if logger is configured
 * @property {(): LogLevel} getLevel - Get current log level
 * @property {(level: LogLevel): void} setLevel - Set log level
 */

/**
 * Logger configuration interface
 * @typedef {Object} ILoggerConfig
 * @property {string} [level] - Default log level
 * @property {boolean} [enableConsole] - Enable console logging
 * @property {boolean} [enableFile] - Enable file logging
 * @property {string} [filePath] - Log file path
 * @property {boolean} [enableColors] - Enable colored output
 * @property {boolean} [enableTimestamp] - Enable timestamp in logs
 * @property {string} [dateFormat] - Date format for logs
 * @property {(level: string): boolean} [shouldLog] - Function to determine if should log
 */

/**
 * Log entry interface
 * @typedef {Object} ILogEntry
 * @property {string} level - Log level
 * @property {string} message - Log message
 * @property {Date} timestamp - Entry timestamp
 * @property {string} [loggerName] - Logger name
 * @property {Object} [metadata] - Additional metadata
 * @property {string} [stack] - Stack trace for errors
 * @property {string} [source] - Source file
 * @property {number} [line] - Line number
 */

/**
 * Logger target interface
 * @typedef {Object} ILoggerTarget
 * @property {string} name - Target name
 * @property {string} type - Target type (console, file, etc.)
 * @property {Object} [config] - Target configuration
 * @property {(level: string, message: string, data?: any): void} write - Write log message
 * @property {(): void} cleanup - Cleanup target resources
 * @property {boolean} [enabled] - Whether target is enabled
 */

/**
 * Logger factory interface
 * @typedef {Object} ILoggerFactory
 * @property {(config?: ILoggerConfig): ILoggerService} create - Create logger instance
 * @property {(name: string, config?: ILoggerConfig): ILoggerService} createNamedLogger - Create named logger
 * @property {(config: ILoggerConfig): boolean} validateConfig - Validate logger configuration
 * @property {(): Object} getDefaultConfig - Get default configuration
 */

/**
 * @typedef {import('./types.js').LogLevel} LogLevel
 */

// Import factory functions
import {
    createLoggerService,
    createDefaultLoggerService,
    createDevelopmentLoggerService,
    createProductionLoggerService,
    createTestLoggerService,
    createChildLogger,
    validateLoggerConfig
} from './factory.js';

// Import service implementations
import { LoggerService } from './LoggerService.js';
import { ThemeService } from './ThemeService.js';
import { UserService } from './UserService.js';

// Import interfaces and types
import {
    LogLevel,
    DEFAULT_LOGGER_CONFIG,
    LOG_LEVEL_NAMES,
    LOG_LEVEL_COLORS,
    CONSOLE_METHODS,
    DEFAULT_LOG_ENTRY,
    ILoggerConfig,
    ILogEntry,
    ILoggerTarget,
    ILoggerFactory
} from './interfaces.js';

// Import constants
import {
    LOGGER_CONSTANTS,
    THEME_CONSTANTS,
    USER_CONSTANTS,
    SERVICE_CONTAINER_CONSTANTS,
    NETWORK_CONSTANTS,
    WEBSOCKET_CONSTANTS,
    getLogLevelByValue,
    getLogLevelColor,
    getConsoleMethod,
    isAdminRole,
    isActiveUser,
    getHttpStatusDescription,
    getWebSocketStateName
} from './constants.js';

// Import utilities
import {
    createLogEntry,
    createDebugEntry,
    createInfoEntry,
    createWarnEntry,
    createErrorEntry,
    createFatalEntry,
    formatLogEntryForConsole,
    formatLogEntryForJSON,
    validateLogLevel,
    getLogLevelPriority,
    shouldLog,
    createLoggerConfig,
    createLoggerTarget,
    createConsoleTarget,
    createFileTarget,
    createRemoteTarget,
    mergeLoggerConfigs,
    createChildLoggerConfig,
    getConsoleMethod as getConsoleMethodUtil,
    hasConsoleMethod,
    safeConsoleLog,
    createTimer,
    measureFunction,
    createRateLimiter,
    createLogBuffer
} from './utils.js';

// Import interfaces from interfaces module
import {
    ILoggerService,
    ILogFormatter,
    ILogFilter,
    ITransport,
    ICacheService,
    IThemeService,
    INetworkService,
    IWebSocketService,
    IAuthService,
    IUserService
} from './interfaces/index.js';

// Export interfaces (using JSDoc for JavaScript compatibility)
// Note: In JavaScript, we export the classes directly as they serve as interfaces
export {
    ILoggerService,
    ILoggerFactory,
    LogLevel
};

// Export constants
export {
    LOGGER_CONSTANTS,
    THEME_CONSTANTS,
    USER_CONSTANTS,
    SERVICE_CONTAINER_CONSTANTS,
    NETWORK_CONSTANTS,
    WEBSOCKET_CONSTANTS,
    DEFAULT_LOGGER_CONFIG,
    LOG_LEVEL_NAMES,
    LOG_LEVEL_COLORS,
    CONSOLE_METHODS,
    DEFAULT_LOG_ENTRY
};

// Export factory functions
export {
    createLoggerService as createLogger,
    createDefaultLoggerService,
    createDevelopmentLoggerService,
    createProductionLoggerService,
    createTestLoggerService,
    createChildLogger,
    validateLoggerConfig
};

// Export service implementations
export {
    LoggerService,
    ThemeService,
    UserService
};

// Export utility functions
export {
    createLogEntry,
    createDebugEntry,
    createInfoEntry,
    createWarnEntry,
    createErrorEntry,
    createFatalEntry,
    formatLogEntryForConsole,
    formatLogEntryForJSON,
    validateLogLevel,
    getLogLevelPriority,
    shouldLog,
    createLoggerConfig,
    createLoggerTarget,
    createConsoleTarget,
    createFileTarget,
    createRemoteTarget,
    mergeLoggerConfigs,
    createChildLoggerConfig,
    getConsoleMethodUtil as getConsoleMethod,
    hasConsoleMethod,
    safeConsoleLog,
    createTimer,
    measureFunction,
    createRateLimiter,
    createLogBuffer
};

// Export helper functions
export {
    getLogLevelByValue,
    getLogLevelColor,
    isAdminRole,
    isActiveUser,
    getHttpStatusDescription,
    getWebSocketStateName
};

// Export legacy exports with underscore prefix for deprecation
export {
    LoggerService as _LegacyLoggerService,
    ThemeService as _LegacyThemeService,
    UserService as _LegacyUserService
};

// Default export for convenience
export default {
    // Factory functions
    createLogger: createLoggerService,
    createDefaultLogger: createDefaultLoggerService,
    createDevelopmentLogger: createDevelopmentLoggerService,
    createProductionLogger: createProductionLoggerService,
    createTestLogger: createTestLoggerService,

    // Service implementations
    LoggerService,
    ThemeService,
    UserService,

    // Constants
    LogLevel,
    LOGGER_CONSTANTS,
    THEME_CONSTANTS,
    USER_CONSTANTS,

    // Utilities
    createLogEntry,
    createLoggerConfig
};
