import { LogLevel, type ILoggerService, type ILoggerConfig, type ILoggerMetrics, type ILoggerHealthStatus } from './interfaces';

/**
 * Legacy Logger Service Implementation
 *
 * @deprecated Use createLogger() factory function instead
 * This class is maintained for backward compatibility only.
 */
export class LoggerService implements ILoggerService {
    private readonly _prefix = '[LoggerService]';

    /**
     * Logs informational messages
     */
    info(message: string, ...args: unknown[]): void {
        console.info(`${this._prefix} ${message}`, ...args);
    }

    /**
     * Logs debug messages
     */
    debug(message: string, ...args: unknown[]): void {
        console.debug(`${this._prefix} ${message}`, ...args);
    }

    /**
     * Logs error messages
     */
    error(message: string, error?: Error, ...args: unknown[]): void {
        console.error(`${this._prefix} ${message}`, error, ...args);
    }

    /**
     * Logs warning messages
     */
    warn(message: string, ...args: unknown[]): void {
        console.warn(`${this._prefix} ${message}`, ...args);
    }

    /**
     * Logs fatal error messages
     */
    fatal(message: string, error?: Error, ...args: unknown[]): void {
        console.error(`${this._prefix} FATAL: ${message}`, error, ...args);
    }

    /**
     * Logs message with custom level
     */
    log(level: LogLevel, message: string, ...args: unknown[]): void {
        console.log(`${this._prefix} [${level}] ${message}`, ...args);
    }

    /**
     * Update logger configuration
     */
    updateConfig(config: Partial<ILoggerConfig>): void {
        // Legacy implementation - no-op
    }

    /**
     * Get current configuration
     */
    getConfig(): ILoggerConfig {
        return { prefix: this._prefix };
    }

    /**
     * Add logging target
     */
    addTarget(_target: unknown): void {
        // Legacy implementation - no-op
    }

    /**
     * Add logging target
     */
    setTarget(target: unknown): void {
        // Legacy implementation - no-op
    }

    /**
     * Remove logging target
     */
    removeTarget(_name: string): void {
        // Legacy implementation - no-op
    }

    /**
     * Get logger metrics
     */
    getMetrics(): ILoggerMetrics {
        return {
            totalLogs: 0,
            logsByLevel: {
                [LogLevel.DEBUG]: 0,
                [LogLevel.INFO]: 0,
                [LogLevel.WARN]: 0,
                [LogLevel.ERROR]: 0,
                [LogLevel.FATAL]: 0
            },
            logsPerMinute: 0,
            errorCount: 0
        };
    }

    /**
     * Get logger health status
     */
    getHealth(): ILoggerHealthStatus {
        return {
            status: 'healthy',
            lastCheck: new Date(),
            targetCount: 0,
            activeTargets: [],
            errorRate: 0
        };
    }

    /**
     * Create child logger with custom prefix
     */
    createChild(prefix: string, _config?: Partial<ILoggerConfig>): ILoggerService {
        const child = new LoggerService();
        (child as { _prefix: string })._prefix = `${this._prefix}`;
        return child;
    }

    /**
     * Check if a log level is enabled
     */
    isLevelEnabled(_level: LogLevel): boolean {
        return true; // Legacy implementation - always enabled
    }

    /**
     * Set log level
     */
    setLevel(_level: LogLevel): void {
        // Legacy implementation - no-op
    }

    /**
     * Get current log level
     */
    getLevel(): LogLevel {
        return LogLevel.INFO; // Legacy implementation
    }
}

/**
 * Factory function to create logger service
 *
 * @deprecated Use createLogger() from the new logger module instead
 */
export function createLoggerService(): ILoggerService {
    return new LoggerService();
}
