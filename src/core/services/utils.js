/**
 * Logger Module Utilities
 * 
 * Utility functions for the logger system.
 * Provides helpers for log entry creation, formatting, and validation.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./types.js').LogLevel} LogLevel
 * @typedef {import('./interfaces/index.js').ILogEntry} ILogEntry
 * @typedef {import('./interfaces/index.js').ILoggerConfig} ILoggerConfig
 * @typedef {import('./interfaces/index.js').ILoggerTarget} ILoggerTarget
 * @typedef {import('./interfaces/index.js').ILoggerService} ILoggerService
 */

import { DEFAULT_LOGGER_CONFIG, LOG_LEVEL_NAMES, LOG_LEVEL_COLORS, CONSOLE_METHODS } from './constants.js';

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
 * Creates a standardized log entry
 * 
 * @function createLogEntry
 * @param {LogLevel} level - Log level
 * @param {string} message - Log message
 * @param {Object} [metadata] - Additional metadata
 * @param {Error} [error] - Error object if applicable
 * @param {string} [prefix] - Logger prefix
 * @returns {ILogEntry} Formatted log entry
 * @description Creates a standardized log entry
 */
export function createLogEntry(level, message, metadata, error, prefix) {
    return {
        ...DEFAULT_LOG_ENTRY,
        level,
        message,
        metadata,
        error,
        prefix,
        timestamp: new Date().toISOString()
    };
}

/**
 * Creates a debug log entry
 * 
 * @function createDebugEntry
 * @param {string} message - Log message
 * @param {Object} [metadata] - Additional metadata
 * @returns {ILogEntry} Debug log entry
 * @description Creates a debug log entry
 */
export function createDebugEntry(message, metadata) {
    return createLogEntry(LogLevel.DEBUG, message, metadata);
}

/**
 * Creates an info log entry
 * 
 * @function createInfoEntry
 * @param {string} message - Log message
 * @param {Object} [metadata] - Additional metadata
 * @returns {ILogEntry} Info log entry
 * @description Creates an info log entry
 */
export function createInfoEntry(message, metadata) {
    return createLogEntry(LogLevel.INFO, message, metadata);
}

/**
 * Creates a warning log entry
 * 
 * @function createWarnEntry
 * @param {string} message - Log message
 * @param {Object} [metadata] - Additional metadata
 * @returns {ILogEntry} Warning log entry
 * @description Creates a warning log entry
 */
export function createWarnEntry(message, metadata) {
    return createLogEntry(LogLevel.WARN, message, metadata);
}

/**
 * Creates an error log entry
 * 
 * @function createErrorEntry
 * @param {string} message - Log message
 * @param {Error} [error] - Error object
 * @param {Object} [metadata] - Additional metadata
 * @returns {ILogEntry} Error log entry
 * @description Creates an error log entry
 */
export function createErrorEntry(message, error, metadata) {
    return createLogEntry(LogLevel.ERROR, message, metadata, error);
}

/**
 * Creates a fatal log entry
 * 
 * @function createFatalEntry
 * @param {string} message - Log message
 * @param {Error} [error] - Error object
 * @param {Object} [metadata] - Additional metadata
 * @returns {ILogEntry} Fatal log entry
 * @description Creates a fatal log entry
 */
export function createFatalEntry(message, error, metadata) {
    return createLogEntry(LogLevel.FATAL, message, metadata, error);
}

/**
 * Formats a log entry for console output
 * 
 * @function formatLogEntryForConsole
 * @param {ILogEntry} entry - Log entry to format
 * @returns {string} Formatted log string
 * @description Formats a log entry for console output
 */
export function formatLogEntryForConsole(entry) {
    const { timestamp, level, message, prefix, metadata, error } = entry;
    const levelName = LOG_LEVEL_NAMES[level] || 'UNKNOWN';
    const colorCode = LOG_LEVEL_COLORS[level] || '#FFFFFF';
    
    let formattedMessage = `${timestamp} ${prefix} [${levelName}] ${message}`;
    
    if (metadata && Object.keys(metadata).length > 0) {
        formattedMessage += ` ${JSON.stringify(metadata)}`;
    }
    
    if (error) {
        formattedMessage += ` ${error.stack || error.message}`;
    }
    
    return formattedMessage;
}

/**
 * Formats a log entry for JSON output
 * 
 * @function formatLogEntryForJSON
 * @param {ILogEntry} entry - Log entry to format
 * @returns {Object} Formatted log object
 * @description Formats a log entry for JSON serialization
 */
export function formatLogEntryForJSON(entry) {
    const { timestamp, level, message, prefix, metadata, error, loggerName } = entry;
    
    return {
        timestamp,
        level,
        message,
        prefix,
        loggerName,
        metadata,
        error: error ? {
            name: error.name,
            message: error.message,
            stack: error.stack
        } : null
    };
}

/**
 * Validates log level
 * 
 * @function validateLogLevel
 * @param {string} level - Log level to validate
 * @returns {boolean} Whether log level is valid
 * @description Validates if a log level is supported
 */
export function validateLogLevel(level) {
    return Object.values(LogLevel).includes(level);
}

/**
 * Gets log level priority
 * 
 * @function getLogLevelPriority
 * @param {LogLevel} level - Log level
 * @returns {number} Priority number
 * @description Gets numeric priority for log level
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
 * @param {LogLevel} currentLevel - Current log level
 * @param {LogLevel} messageLevel - Message log level
 * @returns {boolean} Whether message should be logged
 * @description Determines if a message should be logged based on levels
 */
export function shouldLog(currentLevel, messageLevel) {
    return getLogLevelPriority(messageLevel) >= getLogLevelPriority(currentLevel);
}

/**
 * Creates a logger configuration
 * 
 * @function createLoggerConfig
 * @param {Object} options - Configuration options
 * @param {string} [options.level] - Log level
 * @param {boolean} [options.enableConsole] - Enable console logging
 * @param {boolean} [options.enableFile] - Enable file logging
 * @param {boolean} [options.enableRemote] - Enable remote logging
 * @param {string} [options.prefix] - Logger prefix
 * @returns {ILoggerConfig} Logger configuration
 * @description Creates a logger configuration object
 */
export function createLoggerConfig(options = {}) {
    return {
        ...DEFAULT_LOGGER_CONFIG,
        ...options
    };
}

/**
 * Validates logger configuration
 * 
 * @function validateLoggerConfig
 * @param {ILoggerConfig} config - Configuration to validate
 * @returns {string[]} Array of validation errors
 * @description Validates logger configuration and returns errors
 */
export function validateLoggerConfig(config) {
    const errors = [];

    if (!config || typeof config !== 'object') {
        errors.push('Configuration must be an object');
        return errors;
    }

    // Validate log level
    if (config.level && !validateLogLevel(config.level)) {
        errors.push(`Invalid log level: ${config.level}`);
    }

    // Validate boolean options
    const booleanOptions = ['enableConsole', 'enableFile', 'enableRemote'];
    for (const option of booleanOptions) {
        if (config[option] !== undefined && typeof config[option] !== 'boolean') {
            errors.push(`${option} must be a boolean`);
        }
    }

    return errors;
}

/**
 * Creates a logger target
 * 
 * @function createLoggerTarget
 * @param {string} type - Target type
 * @param {Object} options - Target options
 * @returns {ILoggerTarget} Logger target
 * @description Creates a logger target for output
 */
export function createLoggerTarget(type, options = {}) {
    return {
        type,
        options,
        enabled: true,
        formatter: formatLogEntryForJSON
    };
}

/**
 * Creates a console logger target
 * 
 * @function createConsoleTarget
 * @param {Object} [options] - Console options
 * @param {boolean} [options.enableColors] - Enable colored output
 * @param {boolean} [options.enableTimestamps] - Enable timestamps
 * @returns {ILoggerTarget} Console logger target
 * @description Creates a console logger target
 */
export function createConsoleTarget(options = {}) {
    return createLoggerTarget('console', {
        enableColors: options.enableColors !== false,
        enableTimestamps: options.enableTimestamps !== false,
        ...options
    });
}

/**
 * Creates a file logger target
 * 
 * @function createFileTarget
 * @param {string} filePath - File path
 * @param {Object} [options] - File options
 * @param {number} [options.maxSize] - Maximum file size in bytes
 * @param {number} [options.maxFiles] - Maximum number of files
 * @returns {ILoggerTarget} File logger target
 * @description Creates a file logger target
 */
export function createFileTarget(filePath, options = {}) {
    return createLoggerTarget('file', {
        filePath,
        maxSize: options.maxSize || 10 * 1024 * 1024, // 10MB
        maxFiles: options.maxFiles || 5,
        ...options
    });
}

/**
 * Creates a remote logger target
 * 
 * @function createRemoteTarget
 * @param {string} endpoint - Remote endpoint URL
 * @param {Object} [options] - Remote options
 * @param {number} [options.batchSize] - Batch size for sending logs
 * @param {number} [options.flushInterval] - Flush interval in milliseconds
 * @returns {ILoggerTarget} Remote logger target
 * @description Creates a remote logger target
 */
export function createRemoteTarget(endpoint, options = {}) {
    return createLoggerTarget('remote', {
        endpoint,
        batchSize: options.batchSize || 100,
        flushInterval: options.flushInterval || 5000,
        ...options
    });
}

/**
 * Merges multiple logger configurations
 * 
 * @function mergeLoggerConfigs
 * @param {...ILoggerConfig} configs - Configurations to merge
 * @returns {ILoggerConfig} Merged configuration
 * @description Merges multiple logger configurations
 */
export function mergeLoggerConfigs(...configs) {
    return configs.reduce((merged, config) => {
        return {
            ...merged,
            ...config
        };
    }, {});
}

/**
 * Creates a child logger configuration
 * 
 * @function createChildLoggerConfig
 * @param {ILoggerConfig} parentConfig - Parent configuration
 * @param {string} childName - Child logger name
 * @param {Object} [overrides] - Configuration overrides
 * @returns {ILoggerConfig} Child logger configuration
 * @description Creates a child logger configuration
 */
export function createChildLoggerConfig(parentConfig, childName, overrides = {}) {
    return {
        ...parentConfig,
        loggerName: childName,
        prefix: `${parentConfig.prefix}:${childName}`,
        ...overrides
    };
}

/**
 * Gets console method for log level
 * 
 * @function getConsoleMethod
 * @param {LogLevel} level - Log level
 * @returns {string} Console method name
 * @description Gets the appropriate console method for a log level
 */
export function getConsoleMethod(level) {
    return CONSOLE_METHODS[level] || 'log';
}

/**
 * Checks if console method exists
 * 
 * @function hasConsoleMethod
 * @param {string} method - Console method name
 * @returns {boolean} Whether method exists
 * @description Checks if a console method exists in the current environment
 */
export function hasConsoleMethod(method) {
    return typeof console !== 'undefined' && typeof console[method] === 'function';
}

/**
 * Safely calls console method
 * 
 * @function safeConsoleLog
 * @param {string} method - Console method name
 * @param {...any} args - Arguments to pass to console method
 * @returns {void}
 * @description Safely calls a console method if it exists
 */
export function safeConsoleLog(method, ...args) {
    if (hasConsoleMethod(method)) {
        console[method](...args);
    }
}

/**
 * Creates a performance timer
 * 
 * @function createTimer
 * @param {string} label - Timer label
 * @returns {Function} Function to end timer
 * @description Creates a performance timer for measuring execution time
 */
export function createTimer(label) {
    const startTime = Date.now();
    
    return function endTimer() {
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`${label}: ${duration}ms`);
        return duration;
    };
}

/**
 * Measures function execution time
 * 
 * @function measureFunction
 * @param {Function} fn - Function to measure
 * @param {string} [label] - Measurement label
 * @returns {Function} Wrapped function
 * @description Wraps a function to measure its execution time
 */
export function measureFunction(fn, label) {
    return function (...args) {
        const timer = createTimer(label || fn.name);
        const result = fn.apply(this, args);
        timer();
        return result;
    };
}

/**
 * Creates a rate limiter for logging
 * 
 * @function createRateLimiter
 * @param {number} maxCalls - Maximum calls per interval
 * @param {number} interval - Interval in milliseconds
 * @returns {Function} Rate limiter function
 * @description Creates a rate limiter to prevent log flooding
 */
export function createRateLimiter(maxCalls, interval) {
    let calls = 0;
    let lastReset = Date.now();
    
    return function shouldLog() {
        const now = Date.now();
        
        if (now - lastReset >= interval) {
            calls = 0;
            lastReset = now;
        }
        
        calls++;
        return calls <= maxCalls;
    };
}

/**
 * Creates a log buffer for batching
 * 
 * @function createLogBuffer
 * @param {number} maxSize - Maximum buffer size
 * @param {number} flushInterval - Flush interval in milliseconds
 * @returns {Object} Log buffer object
 * @description Creates a buffer for batching log entries
 */
export function createLogBuffer(maxSize, flushInterval) {
    const buffer = [];
    let lastFlush = Date.now();
    
    return {
        add(entry) {
            buffer.push(entry);
            
            if (buffer.length >= maxSize || Date.now() - lastFlush >= flushInterval) {
                const entries = buffer.splice(0);
                lastFlush = Date.now();
                return entries;
            }
            
            return null;
        },
        
        flush() {
            if (buffer.length > 0) {
                const entries = buffer.splice(0);
                return entries;
            }
            return null;
        },
        
        size() {
            return buffer.length;
        }
    };
}
