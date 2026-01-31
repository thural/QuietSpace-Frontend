/**
 * Console authentication logger
 * 
 * Implements logging interface for authentication events
 * with structured console output and filtering capabilities.
 */

import { AuthErrorType } from '../types/auth.domain.types.js';

/**
 * Authentication event interface
 * @typedef {Object} AuthEvent
 * @property {string} type - Event type
 * @property {Date} [timestamp] - Event timestamp
 * @property {string} [userId] - User ID
 * @property {string} [providerType] - Provider type
 * @property {string} [error] - Error type
 * @property {Object} [details] - Event details
 */

/**
 * Authentication logger interface
 * @interface IAuthLogger
 * @description Defines contract for authentication logging
 */
export class IAuthLogger {
    /**
     * @param {AuthEvent} event - Authentication event
     * @returns {void}
     * @description Logs authentication event
     */
    log(event) {
        throw new Error('Method log() must be implemented');
    }

    /**
     * @param {Error} error - Error to log
     * @param {Object} [context] - Additional context
     * @returns {void}
     * @description Logs error with context
     */
    logError(error, context) {
        throw new Error('Method logError() must be implemented');
    }

    /**
     * @param {AuthEvent} event - Security event
     * @returns {void}
     * @description Logs security event
     */
    logSecurity(event) {
        throw new Error('Method logSecurity() must be implemented');
    }

    /**
     * @param {Partial<AuthEvent>} [filters] - Event filters
     * @returns {AuthEvent[]} Filtered events
     * @description Gets events with optional filtering
     */
    getEvents(filters) {
        throw new Error('Method getEvents() must be implemented');
    }

    /**
     * @returns {void}
     * @description Clears log buffer
     */
    clear() {
        throw new Error('Method clear() must be implemented');
    }

    /**
     * @param {string} level - Log level
     * @returns {void}
     * @description Sets log level
     */
    setLevel(level) {
        throw new Error('Method setLevel() must be implemented');
    }
}

/**
 * Console authentication logger implementation
 */
export class ConsoleAuthLogger extends IAuthLogger {
    /** @type {string} */
    name = 'ConsoleAuthLogger';

    /** @type {'debug'|'info'|'warn'|'error'|'security'} */
    _level = 'info';

    /** @type {AuthEvent[]} */
    logs = [];

    /**
     * @returns {'debug'|'info'|'warn'|'error'|'security'} Current log level
     */
    get level() {
        return this._level;
    }

    /**
     * Logs authentication event
     * @param {AuthEvent} event - Authentication event
     * @returns {void}
     */
    log(event) {
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
     * @param {Error} error - Error to map
     * @returns {string} Auth error type
     */
    mapErrorToAuthErrorType(error) {
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
     * @param {Error} error - Error to log
     * @param {Object} [context] - Additional context
     * @returns {void}
     */
    logError(error, context) {
        this.log({
            type: 'error',
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
     * @param {AuthEvent} event - Security event
     * @returns {void}
     */
    logSecurity(event) {
        this.log({
            type: 'security',
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
     * @param {Partial<AuthEvent>} [filters] - Event filters
     * @returns {AuthEvent[]} Filtered events
     */
    getEvents(filters) {
        if (!filters) {
            return [...this.logs];
        }

        return this.logs.filter(event => {
            return Object.entries(filters).every(([key, value]) =>
                event[key] === value
            );
        });
    }

    /**
     * Clears log buffer
     * @returns {void}
     */
    clear() {
        this.logs = [];
        console.log('[Auth] Log buffer cleared');
    }

    /**
     * Sets log level
     * @param {'debug'|'info'|'warn'|'error'|'security'} level - Log level
     * @returns {void}
     */
    setLevel(level) {
        this._level = level;
        console.log(`[Auth] Log level set to: ${level}`);
    }

    /**
     * Formats log message
     * @param {AuthEvent} event - Event to format
     * @returns {string} Formatted message
     */
    formatLogMessage(event) {
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
     * @param {string} eventType - Event type
     * @returns {'debug'|'info'|'warn'|'error'|'security'} Log level
     */
    getLogLevel(eventType) {
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
