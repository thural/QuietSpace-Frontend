import { LogLevel } from './types.js';
import { ILoggerService } from './interfaces/index.js';

/**
 * Legacy Logger Service Implementation
 * 
 * @deprecated Use createLogger() factory function instead
 * This class is maintained for backward compatibility only.
 */
export class LoggerService extends ILoggerService {
    /**
     * Logger prefix
     * 
     * @type {string}
     */
    _prefix;

    /**
     * Create legacy logger service
     * 
     * @param {string} [prefix] - Logger prefix
     * @description Creates a legacy logger service with optional prefix
     */
    constructor(prefix = '[LoggerService]') {
        super();
        this._prefix = prefix;
    }

    /**
     * Logs informational messages
     * 
     * @param {string} message - Message to log
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Logs an info message
     */
    info(message, ...args) {
        console.info(`${this._prefix} ${message}`, ...args);
    }

    /**
     * Logs debug messages
     * 
     * @param {string} message - Message to log
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Logs a debug message
     */
    debug(message, ...args) {
        console.debug(`${this._prefix} ${message}`, ...args);
    }

    /**
     * Logs error messages
     * 
     * @param {string} message - Message to log
     * @param {Error} [error] - Error object
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Logs an error message
     */
    error(message, error, ...args) {
        console.error(`${this._prefix} ${message}`, error, ...args);
    }

    /**
     * Logs warning messages
     * 
     * @param {string} message - Message to log
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Logs a warning message
     */
    warn(message, ...args) {
        console.warn(`${this._prefix} ${message}`, ...args);
    }

    /**
     * Logs fatal error messages
     * 
     * @param {string} message - Message to log
     * @param {Error} [error] - Error object
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Logs a fatal message
     */
    fatal(message, error, ...args) {
        console.error(`${this._prefix} FATAL: ${message}`, error, ...args);
    }

    /**
     * Logs message with custom level
     * 
     * @param {LogLevel} level - Log level
     * @param {string} message - Message to log
     * @param {...any} args - Additional arguments
     * @returns {void}
     * @description Logs a message with custom level
     */
    log(level, message, ...args) {
        const levelName = level.toUpperCase();
        console.log(`${this._prefix} [${levelName}] ${message}`, ...args);
    }

    /**
     * Set log level
     * 
     * @param {LogLevel} level - Log level to set
     * @returns {void}
     * @description Sets the logging level
     */
    setLevel(level) {
        // Legacy implementation - no-op
        console.warn('setLevel() is not supported in legacy LoggerService');
    }

    /**
     * Get current log level
     * 
     * @returns {LogLevel} Current log level
     * @description Gets the current logging level
     */
    getLevel() {
        // Legacy implementation - return default
        return LogLevel.INFO;
    }

    /**
     * Check if level is enabled
     * 
     * @param {LogLevel} level - Log level to check
     * @returns {boolean} Whether level is enabled
     * @description Checks if a log level is enabled
     */
    isLevelEnabled(level) {
        // Legacy implementation - always enabled
        return true;
    }

    /**
     * Create child logger
     * 
     * @param {string} name - Child logger name
     * @returns {ILoggerService} Child logger instance
     * @description Creates a child logger with specified name
     */
    createChildLogger(name) {
        const childPrefix = `${this._prefix}:${name}`;
        return new LoggerService(childPrefix);
    }

    /**
     * Add context to logger
     * 
     * @param {Object} context - Log context
     * @returns {ILoggerService} Logger with context
     * @description Creates a logger with additional context
     */
    withContext(context) {
        // Legacy implementation - return this
        console.warn('withContext() is not supported in legacy LoggerService');
        return this;
    }
}
