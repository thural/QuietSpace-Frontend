/**
 * Error Logger
 * 
 * Simple logging utility for error handling.
 */

import { IError, IErrorContext, IErrorLogEntry } from '../types';
import { ErrorSeverity } from '../types';

/**
 * Simple error logger implementation
 */
export class ErrorLogger {
    private logLevel: 'debug' | 'info' | 'warn' | 'error' = 'error';
    private logEntries: IErrorLogEntry[] = [];
    private maxLogEntries: number = 1000;

    /**
     * Log an error with context
     */
    public log(error: IError, context?: IErrorContext): void {
        const entry: IErrorLogEntry = {
            level: 'error',
            message: error.message,
            timestamp: new Date(),
            context,
            error
        };

        this.addLogEntry(entry);
        this.outputToConsole(entry);
    }

    /**
     * Log a warning
     */
    public warn(message: string, context?: IErrorContext): void {
        const entry: IErrorLogEntry = {
            level: 'warn',
            message,
            timestamp: new Date(),
            context
        };

        this.addLogEntry(entry);
        this.outputToConsole(entry);
    }

    /**
     * Log info
     */
    public info(message: string, context?: IErrorContext): void {
        const entry: IErrorLogEntry = {
            level: 'info',
            message,
            timestamp: new Date(),
            context
        };

        this.addLogEntry(entry);
        this.outputToConsole(entry);
    }

    /**
     * Set log level
     */
    public setLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
        this.logLevel = level;
    }

    /**
     * Get log entries
     */
    public getEntries(limit?: number): IErrorLogEntry[] {
        return limit ? this.logEntries.slice(-limit) : [...this.logEntries];
    }

    /**
     * Clear log entries
     */
    public clear(): void {
        this.logEntries = [];
    }

    /**
     * Add log entry to history
     */
    private addLogEntry(entry: IErrorLogEntry): void {
        this.logEntries.push(entry);
        
        // Maintain max size
        if (this.logEntries.length > this.maxLogEntries) {
            this.logEntries = this.logEntries.slice(-this.maxLogEntries);
        }
    }

    /**
     * Output to console
     */
    private outputToConsole(entry: IErrorLogEntry): void {
        const timestamp = entry.timestamp.toISOString();
        const contextInfo = entry.context ? ` [${entry.context.component || 'unknown'}]` : '';
        
        switch (entry.level) {
            case 'error':
                console.error(`[${timestamp}]${contextInfo} ERROR: ${entry.message}`, entry.error || entry.context);
                break;
            case 'warn':
                console.warn(`[${timestamp}]${contextInfo} WARN: ${entry.message}`, entry.context);
                break;
            case 'info':
                console.info(`[${timestamp}]${contextInfo} INFO: ${entry.message}`, entry.context);
                break;
            case 'debug':
                console.debug(`[${timestamp}]${contextInfo} DEBUG: ${entry.message}`, entry.context);
                break;
        }
    }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

// Export convenience functions
export const logError = (error: IError, context?: IErrorContext) => 
    errorLogger.log(error, context);

export const logWarning = (message: string, context?: IErrorContext) => 
    errorLogger.warn(message, context);

export const logInfo = (message: string, context?: IErrorContext) => 
    errorLogger.info(message, context);

export const setLogLevel = (level: 'debug' | 'info' | 'warn' | 'error') => 
    errorLogger.setLevel(level);

export const getLogEntries = (limit?: number) => 
    errorLogger.getEntries(limit);
