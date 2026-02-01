/**
 * Console authentication logger
 * 
 * Implements logging interface for authentication events
 * with structured console output and filtering capabilities.
 */

import { IAuthLogger } from '../interfaces/authInterfaces';
import { AuthEvent, AuthErrorType } from '../types/auth.domain.types';

/**
 * Console authentication logger implementation
 */
export class ConsoleAuthLogger implements IAuthLogger {
    readonly name = 'ConsoleAuthLogger';
    private _level: 'debug' | 'info' | 'warn' | 'error' | 'security' = 'info';
    private logs: AuthEvent[] = [];

    get level(): 'debug' | 'info' | 'warn' | 'error' | 'security' {
        return this._level;
    }

    /**
     * Logs authentication event
     */
    log(event: AuthEvent): void {
        this.logs.push(event);

        const logLevel = this.getLogLevel(event.type);
        const message = this.formatLogMessage(event);

        switch (logLevel) {
            case 'debug':
                console.debug(`[Auth] ${message}`, event);
                break;
            case 'info':
                console.info(`[Auth] ${message}`, event);
                break;
            case 'warn':
                console.warn(`[Auth] ${message}`, event);
                break;
            case 'error':
                console.error(`[Auth] ${message}`, event);
                break;
            case 'security':
                console.error(`[Auth] ${message}`, event);
                break;
        }
    }

    /**
     * Maps error messages to AuthErrorType enum values
     */
    private mapErrorToAuthErrorType(error: Error): AuthErrorType {
        const message = error.message.toLowerCase();

        if (message.includes('network') || message.includes('fetch')) {
            return AuthErrorType.NETWORK_ERROR;
        }
        if (message.includes('validation') || message.includes('invalid')) {
            return AuthErrorType.VALIDATION_ERROR;
        }
        if (message.includes('token') && message.includes('expired')) {
            return AuthErrorType.TOKEN_EXPIRED;
        }
        if (message.includes('token') && message.includes('invalid')) {
            return AuthErrorType.TOKEN_INVALID;
        }
        if (message.includes('credential') || message.includes('password') || message.includes('email')) {
            return AuthErrorType.CREDENTIALS_INVALID;
        }
        if (message.includes('locked') || message.includes('suspended')) {
            return AuthErrorType.ACCOUNT_LOCKED;
        }
        if (message.includes('rate') || message.includes('too many')) {
            return AuthErrorType.RATE_LIMITED;
        }
        if (message.includes('server') || message.includes('500')) {
            return AuthErrorType.SERVER_ERROR;
        }

        return AuthErrorType.UNKNOWN_ERROR;
    }

    /**
     * Logs error with context
     */
    logError(error: Error, context?: Record<string, any>): void {
        this.log({
            type: 'error' as any,
            timestamp: new Date(),
            error: this.mapErrorToAuthErrorType(error),
            details: {
                message: error.message,
                stack: error.stack,
                context,
                name: error.name
            }
        });
    }

    /**
     * Logs security event
     */
    logSecurity(event: AuthEvent): void {
        this.log({
            type: 'security' as any,
            timestamp: new Date(),
            error: event.error || AuthErrorType.UNKNOWN_ERROR,
            details: {
                severity: 'high',
                action: 'security_event',
                ...event.details
            }
        });
    }

    /**
     * Gets events with optional filtering
     */
    getEvents(filters?: Partial<AuthEvent>): AuthEvent[] {
        if (!filters) {
            return [...this.logs];
        }

        return this.logs.filter(event => {
            return Object.entries(filters).every(([key, value]) =>
                event[key as keyof AuthEvent] === value
            );
        });
    }

    /**
     * Clears log buffer
     */
    clear(): void {
        this.logs = [];
        console.log('[Auth] Log buffer cleared');
    }

    /**
     * Sets log level
     */
    setLevel(level: 'debug' | 'info' | 'warn' | 'error' | 'security'): void {
        this._level = level;
        console.log(`[Auth] Log level set to: ${level}`);
    }

    /**
     * Formats log message
     */
    private formatLogMessage(event: AuthEvent): string {
        const parts = [
            `${event.type.toUpperCase()}`,
            event.userId ? `User: ${event.userId}` : '',
            event.providerType ? `Provider: ${event.providerType}` : '',
            event.timestamp ? `Time: ${event.timestamp.toISOString()}` : ''
        ];

        if (event.error) {
            parts.push(`Error: ${event.error}`);
        }

        if (event.details && Object.keys(event.details).length > 0) {
            parts.push('Details:');
            Object.entries(event.details).forEach(([key, value]) => {
                parts.push(`  ${key}: ${value}`);
            });
        }

        return parts.join(' | ');
    }

    /**
     * Gets log level for event type
     */
    private getLogLevel(eventType: string): 'debug' | 'info' | 'warn' | 'error' | 'security' {
        switch (eventType) {
            case 'login_attempt':
            case 'register_attempt':
            case 'activate_attempt':
                return 'debug';
            case 'login_success':
            case 'register_success':
            case 'activate_success':
                return 'info';
            case 'login_failure':
            case 'register_failure':
            case 'activate_failure':
                return 'warn';
            case 'token_refresh':
            case 'token_refresh_success':
                return 'info';
            case 'token_refresh_failure':
                return 'warn';
            case 'logout_attempt':
            case 'logout_success':
                return 'info';
            case 'logout_failure':
                return 'warn';
            default:
                return 'error';
        }
    }
}
