/**
 * Logger Module Utilities
 * 
 * Utility functions for the logger system.
 * Provides helpers for log entry creation, formatting, and validation.
 */

import { LogLevel, DEFAULT_LOGGER_CONFIG, LOG_LEVEL_NAMES, LOG_LEVEL_COLORS, CONSOLE_METHODS, DEFAULT_LOG_ENTRY } from './interfaces';
import type { ILogEntry, ILoggerConfig, ILoggerTarget, ILoggerService } from './interfaces';

/**
 * Creates a standardized log entry
 * 
 * @param level - Log level
 * @param message - Log message
 * @param metadata - Additional metadata
 * @param error - Error object if applicable
 * @param prefix - Logger prefix
 * @returns Formatted log entry
 */
export function createLogEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>,
    error?: Error,
    prefix?: string
): ILogEntry {
    return {
        ...DEFAULT_LOG_ENTRY,
        level,
        message,
        metadata,
        error,
        prefix
    };
}

/**
 * Creates a debug log entry
 */
export function createDebugEntry(message: string, metadata?: Record<string, any>): ILogEntry {
    return createLogEntry(LogLevel.DEBUG, message, metadata);
}

/**
 * Creates an info log entry
 */
export function createInfoEntry(message: string, metadata?: Record<string, any>): ILogEntry {
    return createLogEntry(LogLevel.INFO, message, metadata);
}

/**
 * Creates a warning log entry
 */
export function createWarnEntry(message: string, metadata?: Record<string, any>): ILogEntry {
    return createLogEntry(LogLevel.WARN, message, metadata);
}

/**
 * Creates an error log entry
 */
export function createErrorEntry(message: string, error?: Error, metadata?: Record<string, any>): ILogEntry {
    return createLogEntry(LogLevel.ERROR, message, metadata, error);
}

/**
 * Creates a fatal error log entry
 */
export function createFatalEntry(message: string, error?: Error, metadata?: Record<string, any>): ILogEntry {
    return createLogEntry(LogLevel.FATAL, message, metadata, error);
}

/**
 * Formats log entry for console output
 * 
 * @param entry - Log entry to format
 * @param config - Logger configuration
 * @returns Formatted string
 */
export function formatLogEntry(entry: ILogEntry, config: ILoggerConfig = DEFAULT_LOGGER_CONFIG): string {
    const timestamp = entry.timestamp ? entry.timestamp.toISOString() : new Date().toISOString();
    const prefix = entry.prefix || config.prefix || '';
    const level = LOG_LEVEL_NAMES[entry.level] || 'UNKNOWN';

    let message = `${timestamp} ${prefix} [${level}] ${entry.message}`;

    // Add metadata if enabled
    if (config.format?.includeMetadata && entry.metadata && Object.keys(entry.metadata).length > 0) {
        message += ` ${JSON.stringify(entry.metadata)}`;
    }

    // Add error if available
    if (entry.error) {
        message += ` Error: ${entry.error.message}`;
        if (entry.error.stack) {
            message += `\nStack: ${entry.error.stack}`;
        }
    }

    return message;
}

/**
 * Formats log entry with colors for console output
 * 
 * @param entry - Log entry to format
 * @param config - Logger configuration
 * @returns Formatted string with colors
 */
export function formatLogEntryWithColors(entry: ILogEntry, config: ILoggerConfig = DEFAULT_LOGGER_CONFIG): string {
    const timestamp = entry.timestamp ? entry.timestamp.toISOString() : new Date().toISOString();
    const prefix = entry.prefix || config.prefix || '';
    const level = LOG_LEVEL_NAMES[entry.level] || 'UNKNOWN';
    const color = LOG_LEVEL_COLORS[entry.level] || '#ffffff';

    let message = `\x1b[90m${timestamp}\x1b[0m ${prefix} \x1b[${color}m[${level}]\x1b[0m ${entry.message}\x1b[0m`;

    // Add metadata if enabled
    if (config.format?.includeMetadata && entry.metadata && Object.keys(entry.metadata).length > 0) {
        message += ` \x1b[90m${JSON.stringify(entry.metadata)}\x1b[0m`;
    }

    // Add error if available
    if (entry.error) {
        message += ` \x1b[31mError: ${entry.error.message}\x1b[0m`;
        if (entry.error.stack) {
            message += `\n\x1b[31mStack: ${entry.error.stack}\x1b[0m`;
        }
    }

    return message;
}

/**
 * Gets console method for log level
 * 
 * @param level - Log level
 * @returns Console method name
 */
export function getConsoleMethod(level: LogLevel): 'debug' | 'info' | 'warn' | 'error' | 'log' {
    const method = CONSOLE_METHODS[level];
    return method as 'debug' | 'info' | 'warn' | 'error' | 'log';
}

/**
 * Converts log level to string
 * 
 * @param level - Log level
 * @returns Log level string
 */
export function logLevelToString(level: LogLevel): string {
    return LOG_LEVEL_NAMES[level] || 'UNKNOWN';
}

/**
 * Converts string to log level
 * 
 * @param level - Log level string
 * @returns Log level enum value
 */
export function stringToLogLevel(level: string): LogLevel {
    const upperLevel = level.toUpperCase();
    const logLevels = Object.values(LogLevel) as LogLevel[];
    return logLevels.find(l => LOG_LEVEL_NAMES[l] === upperLevel) || LogLevel.INFO;
}

/**
 * Checks if a log level should be processed
 * 
 * @param currentLevel - Current logger level
 * @param targetLevel - Target log level
 * @returns Whether to process the log
 */
export function shouldLog(currentLevel: LogLevel, targetLevel: LogLevel): boolean {
    return currentLevel >= targetLevel;
}

/**
 * Checks if a value is a valid LogLevel
 * 
 * @param value - Value to check
 * @returns Whether the value is a LogLevel
 */
export function isLogLevel(value: any): value is LogLevel {
    return typeof value === 'number' &&
        value >= LogLevel.DEBUG &&
        value <= LogLevel.FATAL &&
        Number.isInteger(value);
}

/**
 * Checks if a value is a valid LogEntry
 * 
 * @param value - Value to check
 * @returns Whether the value is a LogEntry
 */
export function isLogEntry(value: any): value is ILogEntry {
    return value &&
        typeof value === 'object' &&
        'level' in value &&
        'message' in value &&
        isLogLevel(value.level);
}

/**
 * Checks if a value is a valid LoggerTarget
 * 
 * @param value - Value to check
 * @returns Whether the value is a LoggerTarget
 */
export function isLoggerTarget(value: any): value is ILoggerTarget {
    return value &&
        typeof value === 'object' &&
        'name' in value &&
        'level' in value &&
        'write' in value &&
        typeof value.write === 'function';
}

/**
 * Merges logger configurations
 * 
 * @param base - Base configuration
 * @param configs - Additional configurations to merge
 * @returns Merged configuration
 */
export function mergeLoggerConfig(
    base: ILoggerConfig,
    ...configs: Partial<ILoggerConfig>[]
): ILoggerConfig {
    return configs.reduce((merged, config) => ({
        ...merged,
        ...config,
        // Merge nested objects
        targets: [...(merged.targets || []), ...(config.targets || [])],
        format: { ...merged.format, ...config.format }
    }), base);
}

/**
 * Validates logger configuration
 * 
 * @param config - Configuration to validate
 * @returns Array of validation errors
 */
export function validateLoggerConfig(config: ILoggerConfig): string[] {
    const errors: string[] = [];

    // Validate log level
    if (config.level !== undefined && !isLogLevel(config.level)) {
        errors.push(`Invalid log level: ${config.level}`);
    }

    // Validate targets
    if (config.targets) {
        config.targets.forEach((target, index) => {
            if (!isLoggerTarget(target)) {
                errors.push(`Invalid target at index ${index}`);
            }
        });
    }

    return errors;
}

/**
 * Creates a console logger target
 * 
 * @param name - Target name
 * @param level - Minimum log level
 * @returns Console logger target
 */
export function createConsoleTarget(name: string, level: LogLevel = LogLevel.DEBUG): ILoggerTarget {
    return {
        name,
        level,
        write: (entry: ILogEntry) => {
            const method = getConsoleMethod(entry.level);
            const message = formatLogEntryWithColors(entry);
            console[method](message);
        }
    };
}

/**
 * Creates a file logger target
 * 
 * @param name - Target name
 * @param filePath - File path
 * @param level - Minimum log level
 * @returns File logger target
 */
export function createFileTarget(name: string, filePath: string, level: LogLevel = LogLevel.DEBUG): ILoggerTarget {
    const fs = require('fs');
    const path = require('path');

    return {
        name,
        level,
        write: (entry: ILogEntry) => {
            try {
                const message = formatLogEntry(entry);
                const logDir = path.dirname(filePath);

                // Ensure directory exists
                if (!fs.existsSync(logDir)) {
                    fs.mkdirSync(logDir, { recursive: true });
                }

                // Append to file
                fs.appendFileSync(filePath, message + '\n');
            } catch (error) {
                console.error(`Failed to write to file ${filePath}:`, error);
            }
        }
    };
}

/**
 * Creates a remote logger target
 * 
 * @param name - Target name
 * @param endpoint - Remote endpoint
 * @param level - Minimum log level
 * @returns Remote logger target
 */
export function createRemoteTarget(name: string, endpoint: string, level: LogLevel = LogLevel.INFO): ILoggerTarget {
    return {
        name,
        level,
        write: async (entry: ILogEntry) => {
            try {
                const message = formatLogEntry(entry);
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entry)
                });

                if (!response.ok) {
                    throw new Error(`Remote logging failed: ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Failed to send log to remote endpoint ${endpoint}:`, error);
            }
        }
    };
}

/**
 * Creates a custom logger target
 * 
 * @param name - Target name
 * @param writeFunction - Custom write function
 * @param level - Minimum log level
 * @returns Custom logger target
 */
export function createCustomTarget(
    name: string,
    writeFunction: (entry: ILogEntry) => void,
    level: LogLevel = LogLevel.DEBUG
): ILoggerTarget {
    return {
        name,
        level,
        write: writeFunction
    };
}

/**
 * Extracts error information from an Error object
 * 
 * @param error - Error object
 * @returns Error information object
 */
export function extractErrorInfo(error: Error): Record<string, any> {
    const info: Record<string, any> = {
        name: error.name,
        message: error.message
    };

    if (error.stack) {
        info.stack = error.stack;
    }

    return info;
}

/**
 * Sanitizes log message for security
 * 
 * @param message - Original message
 * @returns Sanitized message
 */
export function sanitizeMessage(message: string): string {
    // Remove potentially sensitive information
    return message
        .replace(/password[=:][^\s]+/gi, 'password=***')
        .replace(/token[=:][^\s]+/gi, 'token=***')
        .replace(/key[=:][^\s]+/gi, 'key=***')
        .replace(/secret[=:][^\s]+/gi, 'secret=***')
        .replace(/auth[=:][^\s]+/gi, 'auth=***');
}

/**
 * Formats duration for logging
 * 
 * @param startTime - Start timestamp
 * @param endTime - End timestamp
 * @returns Formatted duration string
 */
export function formatDuration(startTime: Date, endTime: Date): string {
    const duration = endTime.getTime() - startTime.getTime();

    if (duration < 1000) {
        return `${duration}ms`;
    } else if (duration < 60000) {
        return `${Math.round(duration / 1000)}s`;
    } else {
        return `${Math.round(duration / 60000)}m`;
    }
}

/**
 * Creates a performance timer
 * 
 * @param message - Timer message
 * @returns Timer function
 */
export function createTimer(message: string): () => void {
    const startTime = new Date();

    return () => {
        const endTime = new Date();
        const duration = formatDuration(startTime, endTime);
        console.log(`${message}: ${duration}`);
    };
}

/**
 * Creates a performance timer with logging
 * 
 * @param logger - Logger instance
 * @param message - Timer message
 * @param metadata - Additional metadata
 * @returns Timer function
 */
export function createLoggerTimer(
    logger: ILoggerService,
    message: string,
    metadata?: Record<string, any>
): () => void {
    const startTime = new Date();

    return () => {
        const endTime = new Date();
        const duration = formatDuration(startTime, endTime);

        logger.info(`${message}: ${duration}`, {
            ...metadata,
            duration,
            startTime,
            endTime
        });
    };
}
