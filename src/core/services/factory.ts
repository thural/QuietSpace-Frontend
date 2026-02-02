/**
 * Logger Module Factory Functions
 *
 * Factory functions for creating logger services following Black Box pattern.
 * Provides clean service creation with dependency injection support.
 */

import { DEFAULT_LOGGER_CONFIG, LogLevel } from './interfaces';

import type { ILoggerConfig, ILoggerService } from './interfaces';

/**
 * Enhanced Logger Service Implementation
 *
 * Provides enterprise-grade logging with multiple targets,
 * structured logging, and performance monitoring.
 */
export class LoggerService implements ILoggerService {
    private config: ILoggerConfig;
    private readonly metrics: {
        totalLogs: number;
        logsByLevel: Record<LogLevel, number>;
        startTime: Date;
        lastLogTimestamp?: Date;
        errorCount: number;
    };

    constructor(config?: ILoggerConfig) {
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

    debug(message: string, ...args: unknown[]): void {
        this.log(LogLevel.DEBUG, message, ...args);
    }

    info(message: string, ...args: unknown[]): void {
        this.log(LogLevel.INFO, message, ...args);
    }

    warn(message: string, ...args: unknown[]): void {
        this.log(LogLevel.WARN, message, ...args);
    }

    error(message: string, error?: Error, ...args: unknown[]): void {
        this.log(LogLevel.ERROR, message, error, ...args);
    }

    fatal(message: string, error?: Error, ...args: unknown[]): void {
        this.log(LogLevel.FATAL, message, error, ...args);
    }

    log(level: LogLevel, message: string, ...args: unknown[]): void {
        if (!this.isLevelEnabled(level)) {
            return;
        }

        // Update metrics
        this.metrics.totalLogs++;
        this.metrics.logsByLevel[level]++;
        this.metrics.lastLogTimestamp = new Date();

        if (level >= LogLevel.ERROR) {
            this.metrics.errorCount++;
        }

        // Format and output log
        const timestamp = this.config.enableTimestamps ? new Date().toISOString() : '';
        const prefix = this.config.prefix || '';
        const levelName = this.getLevelName(level);
        const metadata = args.length > 0 ? args[0] : undefined;
        const error = args.find(arg => arg instanceof Error);

        let logMessage = '';
        if (timestamp) logMessage += `${timestamp} `;
        if (prefix) logMessage += `${prefix} `;
        logMessage += `[${levelName}] ${message}`;

        // Add metadata
        if (metadata && typeof metadata === 'object') {
            logMessage += ` ${JSON.stringify(metadata)}`;
        }

        // Add error details
        if (error) {
            logMessage += ` Error: ${error.message}`;
            if (error.stack) {
                logMessage += `\nStack: ${error.stack}`;
            }
        }

        // Output to console
        this.writeToConsole(level, logMessage);

        // Output to targets
        if (this.config.targets) {
            this.config.targets.forEach(target => {
                if (level >= target.level) {
                    target.write({
                        level,
                        message,
                        timestamp: this.config.enableTimestamps ? new Date() : undefined,
                        prefix,
                        metadata,
                        error
                    });
                }
            });
        }
    }

    updateConfig(config: Partial<ILoggerConfig>): void {
        this.config = { ...this.config, ...config };
    }

    getConfig(): ILoggerConfig {
        return { ...this.config };
    }

    addTarget(target: unknown): void {
        if (!this.config.targets) {
            this.config.targets = [];
        }
        this.config.targets.push(target);
    }

    removeTarget(name: string): void {
        if (this.config.targets) {
            this.config.targets = this.config.targets.filter(target => target.name !== name);
        }
    }

    getMetrics() {
        const now = new Date();
        const elapsedMinutes = (now.getTime() - this.metrics.startTime.getTime()) / (1000 * 60);
        const logsPerMinute = elapsedMinutes > 0 ? this.metrics.totalLogs / elapsedMinutes : 0;

        return {
            totalLogs: this.metrics.totalLogs,
            logsByLevel: { ...this.metrics.logsByLevel },
            logsPerMinute: Math.round(logsPerMinute * 100) / 100,
            errorCount: this.metrics.errorCount,
            lastLogTimestamp: this.metrics.lastLogTimestamp
        };
    }

    getHealth() {
        const metrics = this.getMetrics();
        const errorRate = metrics.totalLogs > 0 ? metrics.errorCount / metrics.totalLogs : 0;

        let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
        if (errorRate > 0.25) {
            status = 'unhealthy';
        } else if (errorRate > 0.1) {
            status = 'degraded';
        }

        return {
            status,
            lastCheck: new Date(),
            targetCount: this.config.targets?.length || 0,
            activeTargets: this.config.targets?.map(target => target.name) || [],
            errorRate: Math.round(errorRate * 10000) / 100
        };
    }

    createChild(prefix: string, config?: Partial<ILoggerConfig>): ILoggerService {
        const childConfig = { ...this.config, ...config, prefix: `${this.config.prefix} ${prefix}` };
        return new LoggerService(childConfig);
    }

    isLevelEnabled(level: LogLevel): boolean {
        return level >= (this.config.level || LogLevel.INFO);
    }

    setLevel(level: LogLevel): void {
        this.config.level = level;
    }

    getLevel(): LogLevel {
        return this.config.level || LogLevel.INFO;
    }

    private getLevelName(level: LogLevel): string {
        switch (level) {
            case LogLevel.DEBUG: return 'DEBUG';
            case LogLevel.INFO: return 'INFO';
            case LogLevel.WARN: return 'WARN';
            case LogLevel.ERROR: return 'ERROR';
            case LogLevel.FATAL: return 'FATAL';
            default: return 'UNKNOWN';
        }
    }

    private writeToConsole(level: LogLevel, message: string): void {
        switch (level) {
            case LogLevel.DEBUG:
                console.debug(message);
                break;
            case LogLevel.INFO:
                console.info(message);
                break;
            case LogLevel.WARN:
                console.warn(message);
                break;
            case LogLevel.ERROR:
            case LogLevel.FATAL:
                console.error(message);
                break;
            default:
                console.log(message);
        }
    }
}

/**
 * Creates a logger service instance
 *
 * @param config - Logger configuration
 * @returns Logger service instance
 */
export function createLogger(config?: ILoggerConfig): ILoggerService {
    return new LoggerService(config);
}

/**
 * Creates a logger service with default configuration
 *
 * @returns Logger service instance with default config
 */
export function createDefaultLogger(): ILoggerService {
    return new LoggerService(DEFAULT_LOGGER_CONFIG);
}

/**
 * Creates a logger service for a specific component
 *
 * @param component - Component name
 * @param config - Additional configuration
 * @returns Logger service instance
 */
export function createComponentLogger(component: string, config?: Partial<ILoggerConfig>): ILoggerService {
    return new LoggerService({
        ...config,
        prefix: `[${component}]`
    });
}

/**
 * Creates a logger service with custom level
 *
 * @param level - Minimum log level
 * @param config - Additional configuration
 * @returns Logger service instance
 */
export function createLoggerWithLevel(level: LogLevel, config?: Partial<ILoggerConfig>): ILoggerService {
    return new LoggerService({
        ...config,
        level
    });
}

/**
 * Creates a logger service with structured logging enabled
 *
 * @param config - Logger configuration
 * @returns Logger service instance with structured logging
 */
export function createStructuredLogger(config?: Partial<ILoggerConfig>): ILoggerService {
    return new LoggerService({
        ...config,
        enableStructuredLogging: true,
        enableTimestamps: true
    });
}

/**
 * Creates a logger service from DI container
 *
 * @param container - DI container instance
 * @param config - Logger configuration
 * @returns Logger service instance from DI
 */
export function createLoggerFromDI(container: unknown, config?: ILoggerConfig): ILoggerService {
    try {
        // Try to get logger service from DI container
        const loggerService = container.getByToken('LOGGER_SERVICE') as ILoggerService;

        // Update configuration if provided
        if (config) {
            loggerService.updateConfig(config);
        }

        return loggerService;
    } catch {
        // Fallback to direct creation
        console.warn('Logger service not found in DI container, using fallback creation');
        return new LoggerService(config);
    }
}

/**
 * Creates a singleton logger service
 *
 * @param config - Logger configuration
 * @returns Singleton logger service instance
 */
export function createSingletonLogger(config?: ILoggerConfig): ILoggerService {
    // In a real implementation, this would use a singleton pattern
    // For now, return a new instance (DI container handles singleton behavior)
    return new LoggerService(config);
}

/**
 * Logger factory registry for extensible logger creation
 */
export const loggerFactoryRegistry = {
    /**
     * Register a custom logger factory
     */
    register(name: string, factory: (config?: ILoggerConfig) => ILoggerService): void {
        // In a real implementation, this would store the factory
        console.log(`Registered logger factory: ${name}`);
    },

    /**
     * Get a registered logger factory
     */
    get(name: string): ((config?: ILoggerConfig) => ILoggerService) | undefined {
        // In a real implementation, this would return the registered factory
        console.log(`Getting logger factory: ${name}`);
        return undefined;
    },

    /**
     * List all registered factories
     */
    list(): string[] {
        // In a real implementation, this would return all registered names
        return [];
    }
};

/**
 * Creates a mock logger service for testing
 *
 * @param config - Logger configuration
 * @returns Mock logger service instance
 */
export function createMockLogger(config?: ILoggerConfig): ILoggerService {
    const logs: { level: LogLevel; message: string; timestamp: Date }[] = [];

    return {
        debug: (message: string, ...args: unknown[]) => {
            logs.push({ level: LogLevel.DEBUG, message, timestamp: new Date() });
        },
        info: (message: string, ...args: unknown[]) => {
            logs.push({ level: LogLevel.INFO, message, timestamp: new Date() });
        },
        warn: (message: string, ...args: unknown[]) => {
            logs.push({ level: LogLevel.WARN, message, timestamp: new Date() });
        },
        error: (message: string, error?: Error, ...args: unknown[]) => {
            logs.push({ level: LogLevel.ERROR, message, timestamp: new Date() });
        },
        fatal: (message: string, error?: Error, ...args: unknown[]) => {
            logs.push({ level: LogLevel.FATAL, message, timestamp: new Date() });
        },
        log: (level: LogLevel, message: string, ...args: unknown[]) => {
            logs.push({ level, message, timestamp: new Date() });
        },
        updateConfig: (config: Partial<ILoggerConfig>) => {
            // Mock implementation
        },
        getConfig: () => ({ ...DEFAULT_LOGGER_CONFIG, ...config }),
        addTarget: (target: unknown) => {
            // Mock implementation
        },
        removeTarget: (name: string) => {
            // Mock implementation
        },
        getMetrics: () => ({
            totalLogs: logs.length,
            logsByLevel: {
                [LogLevel.DEBUG]: logs.filter(l => l.level === LogLevel.DEBUG).length,
                [LogLevel.INFO]: logs.filter(l => l.level === LogLevel.INFO).length,
                [LogLevel.WARN]: logs.filter(l => l.level === LogLevel.WARN).length,
                [LogLevel.ERROR]: logs.filter(l => l.level === LogLevel.ERROR).length,
                [LogLevel.FATAL]: logs.filter(l => l.level === LogLevel.FATAL).length
            },
            logsPerMinute: 0,
            errorCount: logs.filter(l => l.level >= LogLevel.ERROR).length,
            lastLogTimestamp: logs[logs.length - 1]?.timestamp
        }),
        getHealth: () => ({
            status: 'healthy' as const,
            lastCheck: new Date(),
            targetCount: 0,
            activeTargets: [],
            errorRate: 0
        }),
        createChild: (prefix: string, config?: Partial<ILoggerConfig>) => createMockLogger(config),
        isLevelEnabled: (level: LogLevel) => true,
        setLevel: (level: LogLevel) => {
            // Mock implementation
        },
        getLevel: () => LogLevel.INFO,
        getLogs: () => logs // Helper method for testing
    } as ILoggerService & { getLogs: () => typeof logs };
}
