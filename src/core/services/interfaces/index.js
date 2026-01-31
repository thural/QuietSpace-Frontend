/**
 * Services System Interfaces
 * 
 * Centralized interface definitions for the services system.
 * Provides clean type exports following Black Box pattern.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./types.js').LogLevel} LogLevel
 * @typedef {import('./types.js').ServiceIdentifier} ServiceIdentifier
 * @typedef {import('./types.js').ServiceFactory} ServiceFactory
 * @typedef {import('./types.js').LogContext} LogContext
 */

// Core service interfaces
/**
 * Logger service interface
 * 
 * @interface ILoggerService
 * @description Defines contract for logging services
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
     * @param {LogContext} context - Log context
     * @returns {ILoggerService} Logger with context
     * @description Creates a logger with additional context
     */
    withContext(context) {
        throw new Error('Method withContext() must be implemented');
    }
}

/**
 * Service container interface
 * 
 * @interface IServiceContainer
 * @description Defines contract for service containers
 */
export class IServiceContainer {
    /**
     * Register service
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @param {ServiceFactory} factory - Service factory
     * @returns {void}
     * @description Registers a service with the container
     */
    register(identifier, factory) {
        throw new Error('Method register() must be implemented');
    }

    /**
     * Register singleton service
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @param {ServiceFactory} factory - Service factory
     * @returns {void}
     * @description Registers a singleton service with the container
     */
    registerSingleton(identifier, factory) {
        throw new Error('Method registerSingleton() must be implemented');
    }

    /**
     * Get service
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {any} Service instance
     * @description Gets a service from the container
     */
    get(identifier) {
        throw new Error('Method get() must be implemented');
    }

    /**
     * Get optional service
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {any|null} Service instance or null
     * @description Gets an optional service from the container
     */
    getOptional(identifier) {
        throw new Error('Method getOptional() must be implemented');
    }

    /**
     * Check if service exists
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {boolean} Whether service exists
     * @description Checks if a service is registered
     */
    has(identifier) {
        throw new Error('Method has() must be implemented');
    }

    /**
     * Clear all services
     * 
     * @returns {void}
     * @description Clears all services from the container
     */
    clear() {
        throw new Error('Method clear() must be implemented');
    }

    /**
     * Create scoped container
     * 
     * @returns {IServiceContainer} Scoped container
     * @description Creates a scoped service container
     */
    createScope() {
        throw new Error('Method createScope() must be implemented');
    }

    /**
     * Dispose container
     * 
     * @returns {void}
     * @description Disposes the container and all services
     */
    dispose() {
        throw new Error('Method dispose() must be implemented');
    }
}

/**
 * Service factory interface
 * 
 * @interface IServiceFactory
 * @description Defines contract for service factories
 */
export class IServiceFactory {
    /**
     * Create service
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {any} Service instance
     * @description Creates a service instance
     */
    create(identifier) {
        throw new Error('Method create() must be implemented');
    }

    /**
     * Create multiple services
     * 
     * @param {ServiceIdentifier[]} identifiers - Service identifiers
     * @returns {Record<string, any>} Service instances
     * @description Creates multiple service instances
     */
    createAll(identifiers) {
        throw new Error('Method createAll() must be implemented');
    }

    /**
     * Dispose factory
     * 
     * @returns {void}
     * @description Disposes the factory and all created services
     */
    dispose() {
        throw new Error('Method dispose() must be implemented');
    }
}

// Logger configuration interfaces
/**
 * Logger configuration interface
 * 
 * @interface ILoggerConfig
 * @description Configuration for logger services
 */
export class ILoggerConfig {
    /**
     * Log level
     * 
     * @type {LogLevel}
     */
    level;

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
        this.level = options.level || 'info';
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
 * Log entry interface
 * 
 * @interface ILogEntry
 * @description Represents a log entry
 */
export class ILogEntry {
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
     * Timestamp
     * 
     * @type {number}
     */
    timestamp;

    /**
     * Logger name
     * 
     * @type {string}
     */
    loggerName;

    /**
     * Log context
     * 
     * @type {LogContext}
     */
    context;

    /**
     * Error object
     * 
     * @type {Error}
     */
    error;

    /**
     * Additional data
     * 
     * @type {any}
     */
    data;

    /**
     * Create log entry
     * 
     * @param {LogLevel} level - Log level
     * @param {string} message - Log message
     * @param {Object} [options] - Additional options
     * @description Creates a new log entry
     */
    constructor(level, message, options = {}) {
        this.level = level;
        this.message = message;
        this.timestamp = Date.now();
        this.loggerName = options.loggerName || 'default';
        this.context = options.context || {};
        this.error = options.error;
        this.data = options.data;
    }
}

/**
 * Log formatter interface
 * 
 * @interface ILogFormatter
 * @description Defines contract for log formatters
 */
export class ILogFormatter {
    /**
     * Format log entry
     * 
     * @param {ILogEntry} entry - Log entry to format
     * @returns {string} Formatted log string
     * @description Formats a log entry for output
     */
    format(entry) {
        throw new Error('Method format() must be implemented');
    }
}

/**
 * Log transport interface
 * 
 * @interface ILogTransport
 * @description Defines contract for log transports
 */
export class ILogTransport {
    /**
     * Log entry
     * 
     * @param {ILogEntry} entry - Log entry to transport
     * @returns {Promise<void>}
     * @description Transports a log entry to its destination
     */
    async log(entry) {
        throw new Error('Method log() must be implemented');
    }

    /**
     * Check if transport is ready
     * 
     * @returns {boolean} Whether transport is ready
     * @description Checks if the transport is ready to accept logs
     */
    isReady() {
        throw new Error('Method isReady() must be implemented');
    }

    /**
     * Dispose transport
     * 
     * @returns {Promise<void>}
     * @description Disposes the transport resources
     */
    async dispose() {
        throw new Error('Method dispose() must be implemented');
    }
}

/**
 * Service lifecycle interface
 * 
 * @interface IServiceLifecycle
 * @description Defines contract for service lifecycle management
 */
export class IServiceLifecycle {
    /**
     * Initialize service
     * 
     * @returns {Promise<void>}
     * @description Initializes the service
     */
    async initialize() {
        throw new Error('Method initialize() must be implemented');
    }

    /**
     * Start service
     * 
     * @returns {Promise<void>}
     * @description Starts the service
     */
    async start() {
        throw new Error('Method start() must be implemented');
    }

    /**
     * Stop service
     * 
     * @returns {Promise<void>}
     * @description Stops the service
     */
    async stop() {
        throw new Error('Method stop() must be implemented');
    }

    /**
     * Dispose service
     * 
     * @returns {Promise<void>}
     * @description Disposes the service resources
     */
    async dispose() {
        throw new Error('Method dispose() must be implemented');
    }

    /**
     * Get service status
     * 
     * @returns {string} Service status
     * @description Gets the current service status
     */
    getStatus() {
        throw new Error('Method getStatus() must be implemented');
    }
}

/**
 * Service health check interface
 * 
 * @interface IServiceHealthCheck
 * @description Defines contract for service health checks
 */
export class IServiceHealthCheck {
    /**
     * Check service health
     * 
     * @returns {Promise<Object>} Health check result
     * @description Performs a health check on the service
     */
    async checkHealth() {
        throw new Error('Method checkHealth() must be implemented');
    }

    /**
     * Get health status
     * 
     * @returns {string} Health status
     * @description Gets the current health status
     */
    getHealthStatus() {
        throw new Error('Method getHealthStatus() must be implemented');
    }
}
