/**
 * Logger Module Interfaces
 * 
 * Defines interfaces for the logger system following Black Box pattern.
 * Provides clean public API for logging operations.
 */

/**
 * Log levels for the logger system
 */
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4
}

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
 * Logger configuration interface
 */
export interface ILoggerConfig {
    /**
     * Minimum log level to output
     */
    level?: LogLevel;

    /**
     * Logger prefix for identification
     */
    prefix?: string;

    /**
     * Whether to enable timestamps
     */
    enableTimestamps?: boolean;

    /**
     * Whether to enable structured logging
     */
    enableStructuredLogging?: boolean;

    /**
     * Custom output targets
     */
    targets?: ILoggerTarget[];

    /**
     * Log formatting options
     */
    format?: LogFormat;
}

/**
 * Log entry interface for structured logging
 */
export interface ILogEntry {
    /**
     * Log level
     */
    level: LogLevel;

    /**
     * Log message
     */
    message: string;

    /**
     * Timestamp
     */
    timestamp?: Date;

    /**
     * Logger prefix
     */
    prefix?: string;

    /**
     * Additional metadata
     */
    metadata?: Record<string, any>;

    /**
     * Error details if applicable
     */
    error?: Error;
}

/**
 * Logger target interface for output destinations
 */
export interface ILoggerTarget {
    /**
     * Target name
     */
    name: string;

    /**
     * Target level
     */
    level: LogLevel;

    /**
     * Write log entry to target
     */
    write(entry: ILogEntry): void;
}

/**
 * Log formatting options
 */
export interface LogFormat {
    /**
     * Date format string
     */
    dateFormat?: string;

    /**
     * Whether to include colors
     */
    enableColors?: boolean;

    /**
     * Whether to include metadata
     */
    includeMetadata?: boolean;

    /**
     * Custom formatter function
     */
    formatter?: (entry: ILogEntry) => string;
}

/**
 * Logger metrics interface
 */
export interface ILoggerMetrics {
    /**
     * Total number of logs
     */
    totalLogs: number;

    /**
     * Logs by level
     */
    logsByLevel: Record<LogLevel, number>;

    /**
     * Average logs per minute
     */
    logsPerMinute: number;

    /**
     * Error count
     */
    errorCount: number;

    /**
     * Last log timestamp
     */
    lastLogTimestamp?: Date;
}

/**
 * Logger health status interface
 */
export interface ILoggerHealthStatus {
    /**
     * Health status
     */
    status: 'healthy' | 'degraded' | 'unhealthy';

    /**
     * Last health check
     */
    lastCheck: Date;

    /**
     * Number of targets
     */
    targetCount: number;

    /**
     * Active targets
     */
    activeTargets: string[];

    /**
     * Error rate percentage
     */
    errorRate: number;
}

/**
 * Main logger service interface
 */
export interface ILoggerService {
    /**
     * Log debug message
     */
    debug(message: string, ...args: any[]): void;

    /**
     * Log informational message
     */
    info(message: string, ...args: any[]): void;

    /**
     * Log warning message
     */
    warn(message: string, ...args: any[]): void;

    /**
     * Log error message
     */
    error(message: string, error?: Error, ...args: any[]): void;

    /**
     * Log fatal error message
     */
    fatal(message: string, error?: Error, ...args: any[]): void;

    /**
     * Log message with custom level
     */
    log(level: LogLevel, message: string, ...args: any[]): void;

    /**
     * Update logger configuration
     */
    updateConfig(config: Partial<ILoggerConfig>): void;

    /**
     * Get current configuration
     */
    getConfig(): ILoggerConfig;

    /**
     * Add logging target
     */
    addTarget(target: ILoggerTarget): void;

    /**
     * Remove logging target
     */
    removeTarget(name: string): void;

    /**
     * Get logger metrics
     */
    getMetrics(): ILoggerMetrics;

    /**
     * Get logger health status
     */
    getHealth(): ILoggerHealthStatus;

    /**
     * Create child logger with custom prefix
     */
    createChild(prefix: string, config?: Partial<ILoggerConfig>): ILoggerService;

    /**
     * Check if a log level is enabled
     */
    isLevelEnabled(level: LogLevel): boolean;

    /**
     * Set log level
     */
    setLevel(level: LogLevel): void;

    /**
     * Get current log level
     */
    getLevel(): LogLevel;
}

/**
 * Logger factory configuration interface
 */
export interface ILoggerFactoryConfig extends ILoggerConfig {
    /**
     * Whether to create singleton instance
     */
    singleton?: boolean;

    /**
     * DI container for dependency injection
     */
    container?: any;
}

/**
 * Logger context interface for contextual logging
 */
export interface ILoggerContext {
    /**
     * Context identifier
     */
    id: string;

    /**
     * Context metadata
     */
    metadata?: Record<string, any>;

    /**
     * Parent context
     */
    parent?: ILoggerContext;

    /**
     * Logger instance
     */
    logger: ILoggerService;
}
