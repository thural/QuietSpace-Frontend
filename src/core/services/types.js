/**
 * Logger Module Types and Constants
 * 
 * Defines types, enums, and constants for the logger system.
 * Provides standardized values for logging operations.
 */

// Import types using JSDoc for JavaScript compatibility
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
 * Log level enum
 * 
 * @readonly
 * @enum {string}
 * @description Log levels for the logger system
 */
export const LogLevel = Object.freeze({
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    FATAL: 'fatal'
});

/**
 * Service identifier type
 * 
 * @typedef {string|symbol} ServiceIdentifier
 * @description Type for service identifiers
 */

/**
 * Service factory type
 * 
 * @callback ServiceFactory
 * @param {ServiceIdentifier} identifier - Service identifier
 * @returns {any} Service instance
 * @description Factory function for creating services
 */

/**
 * Log context type
 * 
 * @typedef {Object} LogContext
 * @property {string} [userId] - User ID
 * @property {string} [sessionId] - Session ID
 * @property {string} [requestId] - Request ID
 * @property {string} [correlationId] - Correlation ID
 * @property {Object} [metadata] - Additional metadata
 * @description Context information for log entries
 */

/**
 * Default logger configuration
 * 
 * @type {ILoggerConfig}
 * @description Default configuration for logger services
 */
export const DEFAULT_LOGGER_CONFIG = new ILoggerConfig({
    level: LogLevel.INFO,
    enableConsole: true,
    enableFile: false,
    enableRemote: false,
    filePath: './logs',
    fileName: 'app.log',
    fileMaxSize: 10485760, // 10MB
    fileMaxFiles: 5,
    remoteEndpoint: null
});

/**
 * Log level names for display
 * 
 * @type {Object}
 * @description Human-readable names for log levels
 */
export const LOG_LEVEL_NAMES = Object.freeze({
    [LogLevel.DEBUG]: 'DEBUG',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.WARN]: 'WARN',
    [LogLevel.ERROR]: 'ERROR',
    [LogLevel.FATAL]: 'FATAL'
});

/**
 * Log level colors for console output
 * 
 * @type {Object}
 * @description Color codes for console log levels
 */
export const LOG_LEVEL_COLORS = Object.freeze({
    [LogLevel.DEBUG]: '#6c757d', // gray
    [LogLevel.INFO]: '#2196f3',  // blue
    [LogLevel.WARN]: '#ff9800',  // orange
    [LogLevel.ERROR]: '#f44336', // red
    [LogLevel.FATAL]: '#d32f2f'  // purple
});

/**
 * Console method mapping
 * 
 * @type {Object}
 * @description Maps log levels to console methods
 */
export const CONSOLE_METHODS = Object.freeze({
    [LogLevel.DEBUG]: 'debug',
    [LogLevel.INFO]: 'info',
    [LogLevel.WARN]: 'warn',
    [LogLevel.ERROR]: 'error',
    [LogLevel.FATAL]: 'error'
});

/**
 * Log format options
 * 
 * @type {Object}
 * @description Formatting options for log output
 */
export const LOG_FORMAT_OPTIONS = Object.freeze({
    DATE_FORMAT: 'yyyy-MM-dd HH:mm:ss',
    ISO_DATE_FORMAT: 'ISO',
    JSON_FORMAT: 'json',
    SIMPLE_FORMAT: 'simple'
});

/**
 * Logger target types
 * 
 * @readonly
 * @enum {string}
 * @description Types of logger targets
 */
export const LoggerTargetType = Object.freeze({
    CONSOLE: 'console',
    FILE: 'file',
    REMOTE: 'remote',
    CUSTOM: 'custom'
});

/**
 * Service lifecycle states
 * 
 * @readonly
 * @enum {string}
 * @description Service lifecycle states
 */
export const ServiceLifecycleState = Object.freeze({
    UNINITIALIZED: 'uninitialized',
    INITIALIZING: 'initializing',
    INITIALIZED: 'initialized',
    STARTING: 'starting',
    RUNNING: 'running',
    STOPPING: 'stopping',
    STOPPED: 'stopped',
    DISPOSING: 'disposing',
    DISPOSED: 'disposed',
    ERROR: 'error'
});

/**
 * Health check status
 * 
 * @readonly
 * @enum {string}
 * @description Health check status values
 */
export const HealthCheckStatus = Object.freeze({
    HEALTHY: 'healthy',
    UNHEALTHY: 'unhealthy',
    DEGRADED: 'degraded',
    UNKNOWN: 'unknown'
});

/**
 * Service registration options
 * 
 * @typedef {Object} ServiceRegistrationOptions
 * @property {string} [lifetime] - Service lifetime ('singleton', 'transient', 'scoped')
 * @property {string[]} [tags] - Service tags for categorization
 * @property {Object} [metadata] - Service metadata
 * @description Options for service registration
 */

/**
 * Log entry metadata
 * 
 * @typedef {Object} LogEntryMetadata
 * @property {string} [source] - Log source
 * @property {string} [module] - Module name
 * @property {string} [function] - Function name
 * @property {number} [line] - Line number
 * @property {string} [file] - File name
 * @description Metadata for log entries
 */

/**
 * Logger transport configuration
 * 
 * @typedef {Object} LoggerTransportConfig
 * @property {string} type - Transport type
 * @property {Object} options - Transport-specific options
 * @property {boolean} enabled - Whether transport is enabled
 * @property {string[]} [levels] - Log levels to transport
 * @description Configuration for logger transports
 */

/**
 * Service factory registry
 * 
 * @typedef {Map<ServiceIdentifier, ServiceFactory>} ServiceFactoryRegistry
 * @description Registry of service factories
 */

/**
 * Service instance registry
 * 
 * @typedef {Map<ServiceIdentifier, any>} ServiceInstanceRegistry
 * @description Registry of service instances
 */

/**
 * Service scope context
 * 
 * @typedef {Object} ServiceScopeContext
 * @property {ServiceInstanceRegistry} instances - Service instances in scope
 * @property {ServiceFactoryRegistry} factories - Service factories in scope
 * @property {Object} [metadata] - Scope metadata
 * @description Context for service scopes
 */

// Utility functions for types
/**
 * Checks if a value is a valid log level
 * 
 * @function isValidLogLevel
 * @param {string} level - Log level to check
 * @returns {boolean} Whether level is valid
 * @description Validates if a string is a valid log level
 */
export function isValidLogLevel(level) {
    return Object.values(LogLevel).includes(level);
}

/**
 * Checks if a value is a valid service lifecycle state
 * 
 * @function isValidServiceLifecycleState
 * @param {string} state - State to check
 * @returns {boolean} Whether state is valid
 * @description Validates if a string is a valid service lifecycle state
 */
export function isValidServiceLifecycleState(state) {
    return Object.values(ServiceLifecycleState).includes(state);
}

/**
 * Checks if a value is a valid health check status
 * 
 * @function isValidHealthCheckStatus
 * @param {string} status - Status to check
 * @returns {boolean} Whether status is valid
 * @description Validates if a string is a valid health check status
 */
export function isValidHealthCheckStatus(status) {
    return Object.values(HealthCheckStatus).includes(status);
}

/**
 * Gets log level priority number
 * 
 * @function getLogLevelPriority
 * @param {string} level - Log level
 * @returns {number} Priority number (higher = more severe)
 * @description Gets numeric priority for log level comparison
 */
export function getLogLevelPriority(level) {
    const priorities = {
        [LogLevel.DEBUG]: 0,
        [LogLevel.INFO]: 1,
        [LogLevel.WARN]: 2,
        [LogLevel.ERROR]: 3,
        [LogLevel.FATAL]: 4
    };
    return priorities[level] || 0;
}

/**
 * Checks if log level should be logged
 * 
 * @function shouldLog
 * @param {string} currentLevel - Current log level
 * @param {string} messageLevel - Message log level
 * @returns {boolean} Whether message should be logged
 * @description Determines if a message should be logged based on levels
 */
export function shouldLog(currentLevel, messageLevel) {
    return getLogLevelPriority(messageLevel) >= getLogLevelPriority(currentLevel);
}

/**
 * Creates service identifier
 * 
 * @function createServiceIdentifier
 * @param {string} name - Service name
 * @param {string} [namespace] - Service namespace
 * @returns {string} Service identifier
 * @description Creates a standardized service identifier
 */
export function createServiceIdentifier(name, namespace = 'default') {
    return `${namespace}:${name}`;
}

/**
 * Parses service identifier
 * 
 * @function parseServiceIdentifier
 * @param {string} identifier - Service identifier
 * @returns {Object} Parsed identifier components
 * @description Parses a service identifier into components
 */
export function parseServiceIdentifier(identifier) {
    const [namespace, name] = identifier.split(':', 2);
    return {
        namespace: namespace || 'default',
        name: name || identifier
    };
}

/**
 * Creates log context with timestamp
 * 
 * @function createLogContext
 * @param {Object} context - Base context
 * @returns {LogContext} Context with timestamp
 * @description Creates a log context with timestamp added
 */
export function createLogContext(context = {}) {
    return {
        timestamp: Date.now(),
        ...context
    };
}

/**
 * Formats log entry for JSON output
 * 
 * @function formatLogEntryForJSON
 * @param {ILogEntry} entry - Log entry to format
 * @returns {Object} Formatted log entry
 * @description Formats a log entry for JSON serialization
 */
export function formatLogEntryForJSON(entry) {
    return {
        level: entry.level,
        message: entry.message,
        timestamp: entry.timestamp,
        loggerName: entry.loggerName,
        context: entry.context,
        error: entry.error ? {
            name: entry.error.name,
            message: entry.error.message,
            stack: entry.error.stack
        } : null,
        data: entry.data
    };
}

/**
 * Creates service registration options
 * 
 * @function createServiceRegistrationOptions
 * @param {Object} options - Registration options
 * @returns {ServiceRegistrationOptions} Service registration options
 * @description Creates standardized service registration options
 */
export function createServiceRegistrationOptions(options = {}) {
    return {
        lifetime: options.lifetime || 'singleton',
        tags: options.tags || [],
        metadata: options.metadata || {}
    };
}
