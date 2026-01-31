/**
 * Logger Module Interfaces
 * 
 * Defines interfaces for the logger system following Black Box pattern.
 * Provides clean public API for logging operations.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./types.js').LogLevel} LogLevel
 */

/**
 * Log levels for the logger system
 * 
 * @readonly
 * @enum {number}
 * @description Log levels for the logger system
 */
export const LogLevel = Object.freeze({
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4
});

/**
 * Logger configuration interface
 * 
 * @interface ILoggerConfig
 * @description Configuration interface for logger services
 */
export class ILoggerConfig {
    /**
     * Log level
     * 
     * @type {LogLevel}
     */
    level;

    /**
     * Logger prefix
     * 
     * @type {string}
     */
    prefix;

    /**
     * Enable timestamps
     * 
     * @type {boolean}
     */
    enableTimestamps;

    /**
     * Enable structured logging
     * 
     * @type {boolean}
     */
    enableStructuredLogging;

    /**
     * Logger targets
     * 
     * @type {Array}
     */
    targets;

    /**
     * Format configuration
     * 
     * @type {Object}
     */
    format;

    /**
     * Enable console logging
     * 
     * @type {boolean}
     */
    enableConsole;

    /**
     * Enable file logging
     * 
     * @type {boolean}
     */
    enableFile;

    /**
     * Enable remote logging
     * 
     * @type {boolean}
     */
    enableRemote;

    /**
     * File path for logs
     * 
     * @type {string}
     */
    filePath;

    /**
     * File name for logs
     * 
     * @type {string}
     */
    fileName;

    /**
     * Maximum file size
     * 
     * @type {number}
     */
    fileMaxSize;

    /**
     * Maximum number of files
     * 
     * @type {number}
     */
    fileMaxFiles;

    /**
     * Remote logging endpoint
     * 
     * @type {string}
     */
    remoteEndpoint;

    /**
     * Create logger configuration
     * 
     * @param {Object} options - Configuration options
     * @description Creates a new logger configuration
     */
    constructor(options = {}) {
        this.level = options.level || LogLevel.INFO;
        this.prefix = options.prefix || '[Logger]';
        this.enableTimestamps = options.enableTimestamps !== false;
        this.enableStructuredLogging = options.enableStructuredLogging !== false;
        this.targets = options.targets || [];
        this.format = {
            dateFormat: 'yyyy-MM-dd HH:mm:ss',
            enableColors: true,
            includeMetadata: false,
            ...options.format
        };
        this.enableConsole = options.enableConsole !== false;
        this.enableFile = options.enableFile || false;
        this.enableRemote = options.enableRemote || false;
        this.filePath = options.filePath;
        this.fileName = options.fileName;
        this.fileMaxSize = options.fileMaxSize || 10485760; // 10MB
        this.fileMaxFiles = options.fileMaxFiles || 5;
        this.remoteEndpoint = options.remoteEndpoint;
    }
}

/**
 * Default logger configuration
 * 
 * @type {ILoggerConfig}
 * @description Default configuration for logger services
 */
export const DEFAULT_LOGGER_CONFIG = new ILoggerConfig({
    level: LogLevel.INFO,
    prefix: '[Logger]',
    enableTimestamps: true,
    enableStructuredLogging: true,
    targets: [],
    format: {
        dateFormat: 'yyyy-MM-dd HH:mm:ss',
        enableColors: true,
        includeMetadata: false
    }
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
 * Console methods for each log level
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
 * Default log entry template
 * 
 * @type {Object}
 * @description Default template for log entries
 */
export const DEFAULT_LOG_ENTRY = Object.freeze({
    timestamp: null,
    level: LogLevel.INFO,
    message: '',
    metadata: null,
    error: null,
    prefix: '[Logger]',
    loggerName: 'default'
});

/**
 * Log entry interface
 * 
 * @interface ILogEntry
 * @description Represents a log entry
 */
export class ILogEntry {
    /**
     * Timestamp
     * 
     * @type {string}
     */
    timestamp;

    /**
     * Log level
     * 
     * @type {LogLevel}
     */
    level;

    /**
     * Log message
     * 
     * @type {string}
     */
    message;

    /**
     * Metadata
     * 
     * @type {Object}
     */
    metadata;

    /**
     * Error object
     * 
     * @type {Error}
     */
    error;

    /**
     * Logger prefix
     * 
     * @type {string}
     */
    prefix;

    /**
     * Logger name
     * 
     * @type {string}
     */
    loggerName;

    /**
     * Create log entry
     * 
     * @param {Object} options - Entry options
     * @description Creates a new log entry
     */
    constructor(options = {}) {
        this.timestamp = options.timestamp || new Date().toISOString();
        this.level = options.level || LogLevel.INFO;
        this.message = options.message || '';
        this.metadata = options.metadata || null;
        this.error = options.error || null;
        this.prefix = options.prefix || '[Logger]';
        this.loggerName = options.loggerName || 'default';
    }
}

/**
 * Logger target interface
 * 
 * @interface ILoggerTarget
 * @description Represents a logging target
 */
export class ILoggerTarget {
    /**
     * Target type
     * 
     * @type {string}
     */
    type;

    /**
     * Target options
     * 
     * @type {Object}
     */
    options;

    /**
     * Whether target is enabled
     * 
     * @type {boolean}
     */
    enabled;

    /**
     * Formatter function
     * 
     * @type {Function}
     */
    formatter;

    /**
     * Create logger target
     * 
     * @param {Object} options - Target options
     * @description Creates a new logger target
     */
    constructor(options = {}) {
        this.type = options.type || 'console';
        this.options = options.options || {};
        this.enabled = options.enabled !== false;
        this.formatter = options.formatter || null;
    }
}

/**
 * Logger service interface
 * 
 * @interface ILoggerService
 * @description Defines contract for logger services
 */
export class ILoggerService {
    /**
     * Log debug message
     * 
     * @param {string} message - Message to log
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Logs a debug message
     */
    debug(message, ...args) {
        throw new Error('Method debug() must be implemented');
    }

    /**
     * Log info message
     * 
     * @param {string} message - Message to log
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Logs an info message
     */
    info(message, ...args) {
        throw new Error('Method info() must be implemented');
    }

    /**
     * Log warning message
     * 
     * @param {string} message - Message to log
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Logs a warning message
     */
    warn(message, ...args) {
        throw new Error('Method warn() must be implemented');
    }

    /**
     * Log error message
     * 
     * @param {string} message - Message to log
     * @param {Error} [error] - Error object
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Logs an error message
     */
    error(message, error, ...args) {
        throw new Error('Method error() must be implemented');
    }

    /**
     * Log fatal message
     * 
     * @param {string} message - Message to log
     * @param {Error} [error] - Error object
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Logs a fatal message
     */
    fatal(message, error, ...args) {
        throw new Error('Method fatal() must be implemented');
    }

    /**
     * Log trace message
     * 
     * @param {string} message - Message to log
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Logs a trace message
     */
    trace(message, ...args) {
        throw new Error('Method trace() must be implemented');
    }

    /**
     * Set log level
     * 
     * @param {LogLevel} level - Log level to set
     * @returns {void}
     * @description Sets the logging level
     */
    setLevel(level) {
        throw new Error('Method setLevel() must be implemented');
    }

    /**
     * Get current log level
     * 
     * @returns {LogLevel} Current log level
     * @description Gets the current logging level
     */
    getLevel() {
        throw new Error('Method getLevel() must be implemented');
    }

    /**
     * Check if level is enabled
     * 
     * @param {LogLevel} level - Log level to check
     * @returns {boolean} Whether level is enabled
     * @description Checks if a log level is enabled
     */
    isLevelEnabled(level) {
        throw new Error('Method isLevelEnabled() must be implemented');
    }

    /**
     * Create child logger
     * 
     * @param {string} name - Child logger name
     * @returns {ILoggerService} Child logger instance
     * @description Creates a child logger with specified name
     */
    createChildLogger(name) {
        throw new Error('Method createChildLogger() must be implemented');
    }

    /**
     * Add context to logger
     * 
     * @param {Object} context - Log context
     * @returns {ILoggerService} Logger with context
     * @description Creates a logger with additional context
     */
    withContext(context) {
        throw new Error('Method withContext() must be implemented');
    }
}

/**
 * Logger factory interface
 * 
 * @interface ILoggerFactory
 * @description Defines contract for logger factory
 */
export class ILoggerFactory {
    /**
     * Create logger
     * 
     * @param {string} name - Logger name
     * @param {ILoggerConfig} [config] - Logger configuration
     * @returns {ILoggerService} Logger service instance
     * @description Creates a logger service instance
     */
    create(name, config) {
        throw new Error('Method create() must be implemented');
    }

    /**
     * Create default logger
     * 
     * @returns {ILoggerService} Default logger instance
     * @description Creates a default logger service instance
     */
    createDefault() {
        throw new Error('Method createDefault() must be implemented');
    }

    /**
     * Get logger by name
     * 
     * @param {string} name - Logger name
     * @returns {ILoggerService|null} Logger service or null
     * @description Gets a logger service by name
     */
    getLogger(name) {
        throw new Error('Method getLogger() must be implemented');
    }

    /**
     * Get all loggers
     * 
     * @returns {Map<string, ILoggerService>} Map of all loggers
     * @description Gets all registered loggers
     */
    getAllLoggers() {
        throw new Error('Method getAllLoggers() must be implemented');
    }

    /**
     * Remove logger
     * 
     * @param {string} name - Logger name
     * @returns {boolean} Whether logger was removed
     * @description Removes a logger by name
     */
    removeLogger(name) {
        throw new Error('Method removeLogger() must be implemented');
    }

    /**
     * Clear all loggers
     * 
     * @returns {void}
     * @description Clears all registered loggers
     */
    clearAll() {
        throw new Error('Method clearAll() must be implemented');
    }
}
