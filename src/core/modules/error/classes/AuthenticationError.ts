/**
 * Authentication Error Classes
 * 
 * Error classes for authentication and authorization related issues.
 */

import { BaseError } from './BaseError';
import { ErrorCategory, ErrorSeverity, ErrorRecoveryStrategy } from '../types/index';

/**
 * Base authentication error class
 */
export class AuthenticationError extends BaseError {
    public readonly authType?: string;
    public readonly authProvider?: string;
    public readonly userId?: string;
    public readonly sessionId?: string;

    constructor(
        message: string,
        code: string = 'AUTHENTICATION_ERROR',
        authType?: string,
        options: {
            severity?: ErrorSeverity;
            recoverable?: boolean;
            recoveryStrategy?: ErrorRecoveryStrategy;
            userMessage?: string;
            suggestedActions?: string[];
            metadata?: Record<string, any>;
            cause?: Error;
            context?: any;
            authProvider?: string;
            userId?: string;
            sessionId?: string;
        } = {}
    ) {
        const {
            severity = ErrorSeverity.HIGH,
            recoverable = true,
            recoveryStrategy = ErrorRecoveryStrategy.MANUAL,
            userMessage,
            suggestedActions = [],
            metadata = {},
            cause,
            context,
            authProvider,
            userId,
            sessionId
        } = options;

        super(
            message,
            code,
            ErrorCategory.AUTHENTICATION,
            severity,
            recoverable,
            recoveryStrategy,
            userMessage || 'Authentication failed',
            suggestedActions,
            { ...metadata, authType, authProvider, userId, sessionId },
            cause,
            context
        );

        this.authType = authType;
        this.authProvider = authProvider;
        this.userId = userId;
        this.sessionId = sessionId;
    }
}

/**
 * Invalid credentials error
 */
export class InvalidCredentialsError extends AuthenticationError {
    constructor(
        message: string = 'Invalid username or password',
        authType?: string,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            message,
            'INVALID_CREDENTIALS_ERROR',
            authType,
            {
                severity: ErrorSeverity.HIGH,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: 'Invalid login credentials. Please check your username and password.',
                suggestedActions: [
                    'Check your username and password',
                    'Ensure caps lock is off',
                    'Try resetting your password',
                    'Contact support if issue persists'
                ],
                cause,
                context
            }
        );
    }
}

/**
 * Token expired error
 */
export class TokenExpiredError extends AuthenticationError {
    public readonly tokenType?: string;
    public readonly expiresAt?: Date;

    constructor(
        message: string = 'Authentication token has expired',
        tokenType?: string,
        expiresAt?: Date,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            message,
            'TOKEN_EXPIRED_ERROR',
            tokenType,
            {
                severity: ErrorSeverity.HIGH,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: 'Your session has expired. Please log in again.',
                suggestedActions: [
                    'Log in again',
                    'Refresh the page',
                    'Check if you need to update your password'
                ],
                metadata: { tokenType, expiresAt },
                cause,
                context
            }
        );

        this.tokenType = tokenType;
        this.expiresAt = expiresAt;
    }
}

/**
 * Invalid token error
 */
export class InvalidTokenError extends AuthenticationError {
    public readonly tokenType?: string;
    public readonly tokenReason?: string;

    constructor(
        message: string = 'Invalid authentication token',
        tokenType?: string,
        tokenReason?: string,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            message,
            'INVALID_TOKEN_ERROR',
            tokenType,
            {
                severity: ErrorSeverity.HIGH,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: 'Invalid authentication token. Please log in again.',
                suggestedActions: [
                    'Log in again',
                    'Clear browser cache and cookies',
                    'Contact support if issue persists'
                ],
                metadata: { tokenType, tokenReason },
                cause,
                context
            }
        );

        this.tokenType = tokenType;
        this.tokenReason = tokenReason;
    }
}

/**
 * Account locked error
 */
export class AccountLockedError extends AuthenticationError {
    public readonly lockReason?: string;
    public readonly lockUntil?: Date;
    public readonly remainingAttempts?: number;

    constructor(
        message: string = 'Account has been locked',
        lockReason?: string,
        lockUntil?: Date,
        remainingAttempts?: number,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            message,
            'ACCOUNT_LOCKED_ERROR',
            undefined,
            {
                severity: ErrorSeverity.HIGH,
                recoverable: false,
                recoveryStrategy: ErrorRecoveryStrategy.NONE,
                userMessage: 'Your account has been locked for security reasons.',
                suggestedActions: [
                    'Wait for the lock to expire',
                    'Contact support',
                    'Follow password reset instructions if available'
                ],
                metadata: { lockReason, lockUntil, remainingAttempts },
                cause,
                context
            }
        );

        this.lockReason = lockReason;
        this.lockUntil = lockUntil;
        this.remainingAttempts = remainingAttempts;
    }

    /**
     * Check if account is still locked
     */
    public isLocked(): boolean {
        if (!this.lockUntil) return true;
        return new Date() < this.lockUntil;
    }

    /**
     * Get remaining lock time in milliseconds
     */
    public getRemainingLockTime(): number {
        if (!this.lockUntil) return 0;
        const remaining = this.lockUntil.getTime() - Date.now();
        return Math.max(0, remaining);
    }
}

/**
 * Permission denied error
 */
export class PermissionDeniedError extends AuthenticationError {
    public readonly requiredPermission?: string;
    public readonly userPermissions?: string[];
    public readonly resource?: string;

    constructor(
        message: string = 'Permission denied',
        requiredPermission?: string,
        userPermissions?: string[],
        resource?: string,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            message,
            'PERMISSION_DENIED_ERROR',
            undefined,
            {
                severity: ErrorSeverity.HIGH,
                recoverable: false,
                recoveryStrategy: ErrorRecoveryStrategy.NONE,
                userMessage: 'You do not have permission to perform this action.',
                suggestedActions: [
                    'Contact your administrator',
                    'Request necessary permissions',
                    'Check if you are logged in with the correct account'
                ],
                metadata: { requiredPermission, userPermissions, resource },
                cause,
                context
            }
        );

        this.requiredPermission = requiredPermission;
        this.userPermissions = userPermissions;
        this.resource = resource;
    }

    /**
     * Check if user has specific permission
     */
    public hasPermission(permission: string): boolean {
        return this.userPermissions?.includes(permission) || false;
    }

    /**
     * Get missing permissions
     */
    public getMissingPermissions(): string[] {
        if (!this.requiredPermission) return [];

        const missing = [this.requiredPermission];
        if (this.userPermissions) {
            return missing.filter(perm => !this.userPermissions!.includes(perm));
        }
        return missing;
    }
}

/**
 * Session expired error
 */
export class SessionExpiredError extends AuthenticationError {
    public readonly sessionType?: string;
    public readonly lastActivity?: Date;
    public readonly maxInactivity?: number;

    constructor(
        message: string = 'Session has expired',
        sessionType?: string,
        lastActivity?: Date,
        maxInactivity?: number,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            message,
            'SESSION_EXPIRED_ERROR',
            sessionType,
            {
                severity: ErrorSeverity.MEDIUM,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: 'Your session has expired due to inactivity.',
                suggestedActions: [
                    'Log in again',
                    'Refresh the page',
                    'Continue your work after logging in'
                ],
                metadata: { sessionType, lastActivity, maxInactivity },
                cause,
                context
            }
        );

        this.sessionType = sessionType;
        this.lastActivity = lastActivity;
        this.maxInactivity = maxInactivity;
    }

    /**
     * Get session age in milliseconds
     */
    public getSessionAge(): number {
        if (!this.lastActivity) return 0;
        return Date.now() - this.lastActivity.getTime();
    }
}
