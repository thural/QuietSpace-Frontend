/**
 * Logger Module Factory Functions
 * 
 * Factory functions for creating logger services following Black Box pattern.
 * Provides clean service creation with dependency injection support.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./interfaces/index.js').ILoggerService} ILoggerService
 * @typedef {import('./interfaces/index.js').ILoggerConfig} ILoggerConfig
 * @typedef {import('./types.js').LogLevel} LogLevel
 */

import { DEFAULT_LOGGER_CONFIG } from './types.js';

/**
 * Enhanced Logger Service Implementation
 * 
 * @class LoggerService
 * @description Provides enterprise-grade logging with multiple targets, structured logging, and performance monitoring
 */
export class LoggerService {
    /**
     * Logger configuration
     * 
     * @type {ILoggerConfig}
     */
    config;

    /**
     * Logger metrics
     * 
     * @type {Object}
     */
    metrics;

    /**
     * Create logger service
     * 
     * @param {ILoggerConfig} [config] - Logger configuration
     * @description Creates a new logger service instance
     */
    constructor(config) {
        this.config = { ...DEFAULT_LOGGER_CONFIG, ...config };
        this.metrics = {
            totalLogs: 0,
            logsByLevel: {
                [LogLevel.DEBUG]: 0,
                [LogLevel.INFO]: 0,
                [LogLevel.WARN]: 0,
                [LogLevel.ERROR]: 0,
                [LogLevel.FATAL]: 0
            },
            startTime: new Date(),
            errorCount: 0
        };
    }

    /**
     * Log debug message
     * 
     * @param {string} message - Message to log
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Logs a debug message
     */
    debug(message, ...args) {
        this.log(LogLevel.DEBUG, message, ...args);
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
        this.log(LogLevel.INFO, message, ...args);
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
        this.log(LogLevel.WARN, message, ...args);
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
        this.log(LogLevel.ERROR, message, error, ...args);
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
        this.log(LogLevel.FATAL, message, error, ...args);
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
        this.log(LogLevel.DEBUG, message, ...args);
    }

    /**
     * Set log level
     * 
     * @param {LogLevel} level - Log level to set
     * @returns {void}
     * @description Sets the logging level
     */
    setLevel(level) {
        this.config.level = level;
    }

    /**
     * Get current log level
     * 
     * @returns {LogLevel} Current log level
     * @description Gets the current logging level
     */
    getLevel() {
        return this.config.level;
    }

    /**
     * Check if level is enabled
     * 
     * @param {LogLevel} level - Log level to check
     * @returns {boolean} Whether level is enabled
     * @description Checks if a log level is enabled
     */
    isLevelEnabled(level) {
        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL];
        const currentIndex = levels.indexOf(this.config.level);
        const checkIndex = levels.indexOf(level);
        return checkIndex >= currentIndex;
    }

    /**
     * Create child logger
     * 
     * @param {string} name - Child logger name
     * @returns {ILoggerService} Child logger instance
     * @description Creates a child logger with specified name
     */
    createChildLogger(name) {
        const childConfig = {
            ...this.config,
            loggerName: name
        };
        return new LoggerService(childConfig);
    }

    /**
     * Add context to logger
     * 
     * @param {Object} context - Log context
     * @returns {ILoggerService} Logger with context
     * @description Creates a logger with additional context
     */
    withContext(context) {
        const contextLogger = Object.create(this);
        contextLogger.context = { ...this.context, ...context };
        return contextLogger;
    }

    /**
     * Internal log method
     * 
     * @param {LogLevel} level - Log level
     * @param {string} message - Message to log
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Internal method for logging
     */
    log(level, message, ...args) {
        if (!this.isLevelEnabled(level)) {
            return;
        }

        // Update metrics
        this.metrics.totalLogs++;
        this.metrics.logsByLevel[level]++;
        this.metrics.lastLogTimestamp = new Date();

        if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
            this.metrics.errorCount++;
        }

        // Format and output log
        const logEntry = this.formatLogEntry(level, message, ...args);
        this.outputLog(logEntry);
    }

    /**
     * Format log entry
     * 
     * @param {LogLevel} level - Log level
     * @param {string} message - Message to log
     * @param {...any} args - Additional arguments
     * @returns {Object} Formatted log entry
     * @description Formats a log entry for output
     */
    formatLogEntry(level, message, ...args) {
        const timestamp = new Date().toISOString();
        const loggerName = this.config.loggerName || 'Logger';
        
        return {
            level,
            message,
            timestamp,
            loggerName,
            args,
            context: this.context || {}
        };
    }

    /**
     * Output log entry
     * 
     * @param {Object} logEntry - Log entry to output
     * @returns {void}
     * @description Outputs a log entry to configured targets
     */
    outputLog(logEntry) {
        // Console output
        if (this.config.enableConsole) {
            this.outputToConsole(logEntry);
        }

        // File output
        if (this.config.enableFile) {
            this.outputToFile(logEntry);
        }

        // Remote output
        if (this.config.enableRemote) {
            this.outputToRemote(logEntry);
        }
    }

    /**
     * Output to console
     * 
     * @param {Object} logEntry - Log entry to output
     * @returns {void}
     * @description Outputs log entry to console
     */
    outputToConsole(logEntry) {
        const { level, message, timestamp, loggerName } = logEntry;
        const consoleMethod = this.getConsoleMethod(level);
        
        const formattedMessage = `[${timestamp}] [${loggerName}] [${level.toUpperCase()}] ${message}`;
        
        if (logEntry.args && logEntry.args.length > 0) {
            console[consoleMethod](formattedMessage, ...logEntry.args);
        } else {
            console[consoleMethod](formattedMessage);
        }
    }

    /**
     * Output to file
     * 
     * @param {Object} logEntry - Log entry to output
     * @returns {void}
     * @description Outputs log entry to file (placeholder)
     */
    outputToFile(logEntry) {
        // Placeholder for file logging implementation
        // In a real implementation, this would write to a log file
        console.log('File logging not implemented:', logEntry);
    }

    /**
     * Output to remote service
     * 
     * @param {Object} logEntry - Log entry to output
     * @returns {void}
     * @description Outputs log entry to remote service (placeholder)
     */
    outputToRemote(logEntry) {
        // Placeholder for remote logging implementation
        // In a real implementation, this would send to a remote logging service
        console.log('Remote logging not implemented:', logEntry);
    }

    /**
     * Get console method for log level
     * 
     * @param {LogLevel} level - Log level
     * @returns {string} Console method name
     * @description Gets console method for log level
     */
    getConsoleMethod(level) {
        const methods = {
            [LogLevel.DEBUG]: 'debug',
            [LogLevel.INFO]: 'info',
            [LogLevel.WARN]: 'warn',
            [LogLevel.ERROR]: 'error',
            [LogLevel.FATAL]: 'error'
        };
        return methods[level] || 'log';
    }

    /**
     * Get logger metrics
     * 
     * @returns {Object} Logger metrics
     * @description Gets current logger metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            uptime: Date.now() - this.metrics.startTime.getTime(),
            errorRate: this.metrics.totalLogs > 0 ? this.metrics.errorCount / this.metrics.totalLogs : 0
        };
    }

    /**
     * Reset logger metrics
     * 
     * @returns {void}
     * @description Resets logger metrics
     */
    resetMetrics() {
        this.metrics.totalLogs = 0;
        this.metrics.logsByLevel = {
            [LogLevel.DEBUG]: 0,
            [LogLevel.INFO]: 0,
            [LogLevel.WARN]: 0,
            [LogLevel.ERROR]: 0,
            [LogLevel.FATAL]: 0
        };
        this.metrics.errorCount = 0;
        this.metrics.startTime = new Date();
    }
}

/**
 * Creates a logger service
 * 
 * @function createLoggerService
 * @param {ILoggerConfig} [config] - Logger configuration
 * @returns {ILoggerService} Logger service instance
 * @description Creates a new logger service with specified configuration
 */
export function createLoggerService(config) {
    return new LoggerService(config);
}

/**
 * Creates a logger service with default configuration
 * 
 * @function createDefaultLoggerService
 * @returns {ILoggerService} Logger service instance
 * @description Creates a logger service with default configuration
 */
export function createDefaultLoggerService() {
    return new LoggerService(DEFAULT_LOGGER_CONFIG);
}

/**
 * Creates a logger service for development
 * 
 * @function createDevelopmentLoggerService
 * @returns {ILoggerService} Logger service instance
 * @description Creates a logger service optimized for development
 */
export function createDevelopmentLoggerService() {
    const config = {
        ...DEFAULT_LOGGER_CONFIG,
        level: LogLevel.DEBUG,
        enableConsole: true,
        enableFile: false,
        enableRemote: false
    };
    return new LoggerService(config);
}

/**
 * Creates a logger service for production
 * 
 * @function createProductionLoggerService
 * @returns {ILoggerService} Logger service instance
 * @description Creates a logger service optimized for production
 */
export function createProductionLoggerService() {
    const config = {
        ...DEFAULT_LOGGER_CONFIG,
        level: LogLevel.ERROR,
        enableConsole: false,
        enableFile: true,
        enableRemote: true,
        filePath: './logs',
        fileName: 'app.log'
    };
    return new LoggerService(config);
}

/**
 * Creates a logger service for testing
 * 
 * @function createTestLoggerService
 * @returns {ILoggerService} Logger service instance
 * @description Creates a logger service optimized for testing
 */
export function createTestLoggerService() {
    const config = {
        ...DEFAULT_LOGGER_CONFIG,
        level: LogLevel.WARN,
        enableConsole: false,
        enableFile: false,
        enableRemote: false
    };
    return new LoggerService(config);
}

/**
 * Creates a child logger with context
 * 
 * @function createChildLogger
 * @param {ILoggerService} parentLogger - Parent logger
 * @param {string} name - Child logger name
 * @param {Object} [context] - Additional context
 * @returns {ILoggerService} Child logger
 * @description Creates a child logger with name and context
 */
export function createChildLogger(parentLogger, name, context) {
    const childLogger = parentLogger.createChildLogger(name);
    if (context) {
        return childLogger.withContext(context);
    }
    return childLogger;
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
    if (config.level && !Object.values(LogLevel).includes(config.level)) {
        errors.push(`Invalid log level: ${config.level}. Must be one of: ${Object.values(LogLevel).join(', ')}`);
    }

    // Validate file configuration
    if (config.enableFile && config.filePath && typeof config.filePath !== 'string') {
        errors.push('File path must be a string when file logging is enabled');
    }

    if (config.enableFile && config.fileMaxSize && (typeof config.fileMaxSize !== 'number' || config.fileMaxSize < 1024)) {
        errors.push('File max size must be at least 1024 bytes');
    }

    // Validate remote configuration
    if (config.enableRemote && config.remoteEndpoint && typeof config.remoteEndpoint !== 'string') {
        errors.push('Remote endpoint must be a string when remote logging is enabled');
    }

    return errors;
}
