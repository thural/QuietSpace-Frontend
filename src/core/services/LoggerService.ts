import 'reflect-metadata';
import { Injectable } from '../di';

/**
 * Logger Service Interface
 */
export interface ILoggerService {
    info(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
}

/**
 * Console Logger Service Implementation
 * 
 * Provides logging functionality with different log levels
 * and structured console output for enterprise applications.
 */
@Injectable({ lifetime: 'singleton' })
export class LoggerService implements ILoggerService {
    private readonly prefix = '[LoggerService]';

    /**
     * Logs informational messages
     */
    info(message: string, ...args: any[]): void {
        console.info(`${this.prefix} ${message}`, ...args);
    }

    /**
     * Logs debug messages
     */
    debug(message: string, ...args: any[]): void {
        console.debug(`${this.prefix} ${message}`, ...args);
    }

    /**
     * Logs error messages
     */
    error(message: string, ...args: any[]): void {
        console.error(`${this.prefix} ${message}`, ...args);
    }

    /**
     * Logs warning messages
     */
    warn(message: string, ...args: any[]): void {
        console.warn(`${this.prefix} ${message}`, ...args);
    }
}

/**
 * Factory function to create logger service
 */
export function createLoggerService(): ILoggerService {
    return new LoggerService();
}
