/**
 * Logger Module Types and Constants
 * 
 * Defines types, enums, and constants for the logger system.
 * Provides standardized values for logging operations.
 */

import { LogLevel, ILoggerConfig, ILogEntry, ILoggerTarget } from './interfaces';

/**
 * Default logger configuration
 */
export const DEFAULT_LOGGER_CONFIG: ILoggerConfig = {
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
};

/**
 * Log level names for display
 */
export const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: 'DEBUG',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.WARN]: 'WARN',
    [LogLevel.ERROR]: 'ERROR',
    [LogLevel.FATAL]: 'FATAL'
};

/**
 * Log level colors for console output
 */
export const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: '#6c757d', // gray
    [LogLevel.INFO]: '#2196f3',  // blue
    [LogLevel.WARN]: '#ff9800',  // orange
    [LogLevel.ERROR]: '#f44336', // red
    [LogLevel.FATAL]: '#d32f2f'  // purple
};

/**
 * Console method mapping
 */
export const CONSOLE_METHODS: Record<LogLevel, keyof Console> = {
    [LogLevel.DEBUG]: 'debug',
    [LogLevel.INFO]: 'info',
    [LogLevel.WARN]: 'warn',
    [LogLevel.ERROR]: 'error',
    [LogLevel.FATAL]: 'error'
};

/**
 * Default log entry template
 */
export const DEFAULT_LOG_ENTRY: Partial<ILogEntry> = {
    timestamp: new Date(),
    metadata: {}
};

/**
 * Logger target types
 */
export const LOGGER_TARGET_TYPES = {
    CONSOLE: 'console',
    FILE: 'file',
    REMOTE: 'remote',
    DATABASE: 'database',
    CUSTOM: 'custom'
} as const;

/**
 * Common log metadata keys
 */
export const LOG_METADATA_KEYS = {
    USER_ID: 'userId',
    SESSION_ID: 'sessionId',
    REQUEST_ID: 'requestId',
    CORRELATION_ID: 'correlationId',
    COMPONENT: 'component',
    ACTION: 'action',
    DURATION: 'duration',
    STATUS: 'status',
    ERROR_CODE: 'errorCode'
} as const;

/**
 * Logger health status thresholds
 */
export const LOGGER_HEALTH_THRESHOLDS = {
    ERROR_RATE_WARNING: 0.1,  // 10%
    ERROR_RATE_CRITICAL: 0.25, // 25%
    LOGS_PER_MINUTE_WARNING: 100,
    LOGS_PER_MINUTE_CRITICAL: 500
} as const;

/**
 * Type guards for logger types
 */

/**
 * Check if a value is a valid LogLevel
 */
export function isLogLevel(value: any): value is LogLevel {
    return typeof value === 'number' &&
        value >= LogLevel.DEBUG &&
        value <= LogLevel.FATAL &&
        Number.isInteger(value);
}

/**
 * Check if a value is a valid LogEntry
 */
export function isLogEntry(value: any): value is ILogEntry {
    return value &&
        typeof value === 'object' &&
        'level' in value &&
        'message' in value &&
        isLogLevel(value.level);
}

/**
 * Check if a value is a valid LoggerTarget
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
 * Check if a log level should be processed
 */
export function shouldLog(currentLevel: LogLevel, targetLevel: LogLevel): boolean {
    return currentLevel >= targetLevel;
}

/**
 * Convert log level to string
 */
export function logLevelToString(level: LogLevel): string {
    return LOG_LEVEL_NAMES[level] || 'UNKNOWN';
}

/**
 * Convert string to log level
 */
export function stringToLogLevel(level: string): LogLevel {
    const upperLevel = level.toUpperCase();
    return (Object.values(LogLevel) as LogLevel[]).find(l =>
        LOG_LEVEL_NAMES[l] === upperLevel
    ) || LogLevel.INFO;
}

/**
 * Get console method for log level
 */
export function getConsoleMethod(level: LogLevel): keyof Console {
    return CONSOLE_METHODS[level] || 'log';
}

/**
 * Format log entry for console output
 */
export function formatLogEntry(entry: ILogEntry): string {
    const timestamp = entry.timestamp ? entry.timestamp.toISOString() : new Date().toISOString();
    const prefix = entry.prefix ? `[${entry.prefix}]` : '';
    const level = LOG_LEVEL_NAMES[entry.level] || 'UNKNOWN';

    let message = `${timestamp} ${prefix} [${level}] ${entry.message}`;

    // Add metadata if available
    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
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
 * Create structured log entry
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
 * Merge logger configurations
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
 * Validate logger configuration
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
