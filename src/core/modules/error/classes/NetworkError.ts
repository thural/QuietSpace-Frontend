/**
 * Network Error Classes
 * 
 * Consolidated network error handling from the existing NetworkErrors.ts module.
 * Provides specific error types for network-related issues with enhanced functionality.
 */

import { BaseError } from './BaseError';
import { ErrorCategory, ErrorSeverity, ErrorRecoveryStrategy } from '../types/index';

/**
 * Base network error class
 */
export class NetworkError extends BaseError {
    public readonly statusCode?: number;
    public readonly endpoint?: string;
    public readonly timeout?: number;
    public readonly retryCount?: number;

    constructor(
        message: string,
        code: string = 'NETWORK_ERROR',
        statusCode?: number,
        endpoint?: string,
        timeout?: number,
        retryCount: number = 0,
        options: {
            severity?: ErrorSeverity;
            recoverable?: boolean;
            recoveryStrategy?: ErrorRecoveryStrategy;
            userMessage?: string;
            suggestedActions?: string[];
            metadata?: Record<string, any>;
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const {
            severity = ErrorSeverity.MEDIUM,
            recoverable = true,
            recoveryStrategy = ErrorRecoveryStrategy.DELAYED,
            userMessage,
            suggestedActions = [],
            metadata = {},
            cause,
            context
        } = options;

        super(
            message,
            code,
            ErrorCategory.NETWORK,
            severity,
            recoverable,
            recoveryStrategy,
            userMessage || 'Network connection issue detected',
            suggestedActions,
            { ...metadata, statusCode, endpoint, timeout, retryCount },
            cause,
            context
        );

        this.statusCode = statusCode;
        this.endpoint = endpoint;
        this.timeout = timeout;
        this.retryCount = retryCount;
    }

    /**
     * Check if error is a client error (4xx)
     */
    public isClientError(): boolean {
        return this.statusCode !== undefined && this.statusCode >= 400 && this.statusCode < 500;
    }

    /**
     * Check if error is a server error (5xx)
     */
    public isServerError(): boolean {
        return this.statusCode !== undefined && this.statusCode >= 500;
    }

    /**
     * Check if error is a timeout error
     */
    public isTimeoutError(): boolean {
        return this.code === 'NETWORK_TIMEOUT' || this.timeout !== undefined;
    }

    /**
     * Get retry delay based on error type and retry count
     */
    public getRetryDelay(): number {
        if (this.timeout) {
            return Math.min(this.timeout * 2, 30000);
        }

        if (this.statusCode === 429) {
            // Rate limiting - use exponential backoff
            return Math.min(1000 * Math.pow(2, this.retryCount), 60000);
        }

        // Default exponential backoff
        return Math.min(1000 * Math.pow(2, this.retryCount), 10000);
    }
}

/**
 * Token refresh error
 */
export class TokenRefreshError extends NetworkError {
    constructor(
        message: string = 'Failed to refresh authentication token',
        options: {
            statusCode?: number;
            endpoint?: string;
            originalError?: Error;
            context?: any;
        } = {}
    ) {
        const { statusCode = 401, endpoint, originalError, context } = options;

        super(
            message,
            'TOKEN_REFRESH_ERROR',
            statusCode,
            endpoint,
            undefined,
            0,
            {
                severity: ErrorSeverity.HIGH,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: 'Your session has expired. Please log in again.',
                suggestedActions: [
                    'Log in again',
                    'Check your internet connection',
                    'Contact support if issue persists'
                ],
                metadata: { originalError: originalError?.message },
                cause: originalError,
                context
            }
        );
    }
}

/**
 * Network timeout error
 */
export class NetworkTimeoutError extends NetworkError {
    constructor(
        message: string = 'Network request timed out',
        timeout: number = 30000,
        options: {
            endpoint?: string;
            retryCount?: number;
            context?: any;
        } = {}
    ) {
        const { endpoint, retryCount = 0, context } = options;

        super(
            message,
            'NETWORK_TIMEOUT',
            408,
            endpoint,
            timeout,
            retryCount,
            {
                severity: ErrorSeverity.MEDIUM,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.DELAYED,
                userMessage: 'Request timed out. Please check your connection and try again.',
                suggestedActions: [
                    'Check your internet connection',
                    'Try again',
                    'Contact support if issue persists'
                ],
                context
            }
        );
    }
}

/**
 * Network authentication error
 */
export class NetworkAuthenticationError extends NetworkError {
    public readonly authType?: string;

    constructor(
        message: string = 'Authentication failed',
        authType?: string,
        options: {
            statusCode?: number;
            endpoint?: string;
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { statusCode = 401, endpoint, cause, context } = options;

        super(
            message,
            'AUTHENTICATION_ERROR',
            statusCode,
            endpoint,
            undefined,
            0,
            {
                severity: ErrorSeverity.HIGH,
                recoverable: false,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: 'Authentication failed. Please check your credentials.',
                suggestedActions: [
                    'Check your login credentials',
                    'Try logging in again',
                    'Contact support if issue persists'
                ],
                metadata: { authType },
                cause,
                context
            }
        );

        this.authType = authType;
    }
}

/**
 * Rate limiting error
 */
export class RateLimitError extends NetworkError {
    public readonly retryAfter?: number;

    constructor(
        message: string = 'Too many requests',
        retryAfter?: number,
        options: {
            endpoint?: string;
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { endpoint, cause, context } = options;

        super(
            message,
            'RATE_LIMIT_ERROR',
            429,
            endpoint,
            undefined,
            0,
            {
                severity: ErrorSeverity.MEDIUM,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.DELAYED,
                userMessage: 'Too many requests. Please wait a moment and try again.',
                suggestedActions: [
                    'Wait a moment before trying again',
                    'Reduce request frequency',
                    'Contact support if issue persists'
                ],
                metadata: { retryAfter },
                cause,
                context
            }
        );

        this.retryAfter = retryAfter;
    }

    /**
     * Get retry delay based on retry-after header
     */
    public getRetryDelay(): number {
        if (this.retryAfter) {
            return this.retryAfter * 1000;
        }
        return super.getRetryDelay();
    }
}

/**
 * Network connection error
 */
export class NetworkConnectionError extends NetworkError {
    constructor(
        message: string = 'Network connection failed',
        endpoint?: string,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            message,
            'NETWORK_CONNECTION_ERROR',
            undefined,
            endpoint,
            undefined,
            0,
            {
                severity: ErrorSeverity.MEDIUM,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.DELAYED,
                userMessage: 'Network connection failed. Please check your internet connection.',
                suggestedActions: [
                    'Check your internet connection',
                    'Try refreshing the page',
                    'Contact support if issue persists'
                ],
                cause,
                context
            }
        );
    }
}

/**
 * Bad request error (client error)
 */
export class BadRequestError extends NetworkError {
    public readonly validationErrors?: string[];

    constructor(
        message: string = 'Invalid request',
        validationErrors?: string[],
        options: {
            endpoint?: string;
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { endpoint, cause, context } = options;

        super(
            message,
            'BAD_REQUEST_ERROR',
            400,
            endpoint,
            undefined,
            0,
            {
                severity: ErrorSeverity.LOW,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: 'Invalid request. Please check your input and try again.',
                suggestedActions: [
                    'Check your input data',
                    'Ensure all required fields are filled',
                    'Follow the specified format'
                ],
                metadata: { validationErrors },
                cause,
                context
            }
        );

        this.validationErrors = validationErrors;
    }
}

/**
 * Server error (5xx)
 */
export class ServerError extends NetworkError {
    public readonly serverCode?: string;

    constructor(
        message: string = 'Server error occurred',
        serverCode?: string,
        options: {
            statusCode?: number;
            endpoint?: string;
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { statusCode = 500, endpoint, cause, context } = options;

        super(
            message,
            'SERVER_ERROR',
            statusCode,
            endpoint,
            undefined,
            0,
            {
                severity: ErrorSeverity.HIGH,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.DELAYED,
                userMessage: 'Server error occurred. Please try again later.',
                suggestedActions: [
                    'Try again later',
                    'Contact support if issue persists',
                    'Check server status'
                ],
                metadata: { serverCode },
                cause,
                context
            }
        );

        this.serverCode = serverCode;
    }
}
