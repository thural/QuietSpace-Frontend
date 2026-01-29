import { LogLevel, type ILoggerService } from './interfaces';

/**
 * Legacy Logger Service Implementation
 * 
 * @deprecated Use createLogger() factory function instead
 * This class is maintained for backward compatibility only.
 */
export class LoggerService implements ILoggerService {
    private _prefix = '[LoggerService]';

    /**
     * Logs informational messages
     */
    info(message: string, ...args: any[]): void {
        console.info(`${this._prefix} ${message}`, ...args);
    }

    /**
     * Logs debug messages
     */
    debug(message: string, ...args: any[]): void {
        console.debug(`${this._prefix} ${message}`, ...args);
    }

    /**
     * Logs error messages
     */
    error(message: string, ...args: any[]): void {
        console.error(`${this._prefix} ${message}`, ...args);
    }

    /**
     * Logs warning messages
     */
    warn(message: string, ...args: any[]): void {
        console.warn(`${this._prefix} ${message}`, ...args);
    }

    /**
     * Logs fatal error messages
     */
    fatal(message: string, ...args: any[]): void {
        console.error(`${this._prefix} FATAL: ${message}`, ...args);
    }

    /**
     * Logs message with custom level
     */
    log(level: LogLevel, message: string, ...args: any[]): void {
        console.log(`${this._prefix} [${level}] ${message}`, ...args);
    }

    /**
     * Update logger configuration
     */
    updateConfig(config: any): void {
        // Legacy implementation - no-op
    }

    /**
     * Get current configuration
     */
    getConfig(): any {
        return { prefix: this._prefix };
    }

    /**
     * Add logging target
     */
    addTarget(target: any): void {
        // Legacy implementation - no-op
    }

    /**
     * Remove logging target
     */
    removeTarget(name: string): void {
        // Legacy implementation - no-op
    }

    /**
     * Get logger metrics
     */
    getMetrics(): any {
        return {
            totalLogs: 0,
            logsByLevel: {},
            logsPerMinute: 0,
            errorCount: 0
        };
    }

    /**
     * Get logger health status
     */
    getHealth(): any {
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
    createChild(prefix: string, config?: any): ILoggerService {
        const child = new LoggerService();
        (child as any)._prefix = `${this._prefix} ${prefix}`;
        return child;
    }

    /**
     * Check if a log level is enabled
     */
    isLevelEnabled(level: LogLevel): boolean {
        return true; // Legacy implementation - always enabled
    }

    /**
     * Set log level
     */
    setLevel(level: LogLevel): void {
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
