/**
 * Base Error Class
 * 
 * Foundation class for all error types in the QuietSpace Frontend.
 * Implements the IError interface and provides common error functionality.
 */

import { IError, IErrorContext } from '../types/index';
import { ErrorSeverity, ErrorCategory, ErrorRecoveryStrategy } from '../types/index';

/**
 * Simple UUID generator for error IDs
 */
function generateErrorId(): string {
    return 'error_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Base error class that implements the IError interface
 * 
 * This class serves as the foundation for all specific error types
 * and provides common functionality for error handling, classification,
 * and reporting.
 */
export abstract class BaseError extends Error implements IError {
    /** Unique error identifier */
    public readonly id: string;

    /** Error code for programmatic handling */
    public readonly code: string;

    /** Error severity level */
    public readonly severity: ErrorSeverity;

    /** Error category */
    public readonly category: ErrorCategory;

    /** Whether the error is recoverable */
    public readonly recoverable: boolean;

    /** Recommended recovery strategy */
    public readonly recoveryStrategy: ErrorRecoveryStrategy;

    /** User-friendly error message */
    public readonly userMessage: string;

    /** Suggested actions for recovery */
    public readonly suggestedActions: string[];

    /** Error timestamp */
    public readonly timestamp: Date;

    /** Additional error metadata */
    public readonly metadata: Record<string, any>;

    /** Original error that caused this error */
    public readonly cause?: Error;

    /** Error context information */
    public readonly context?: IErrorContext;

    /**
     * Create a new BaseError
     * 
     * @param message - Error message
     * @param code - Error code
     * @param category - Error category
     * @param severity - Error severity
     * @param recoverable - Whether error is recoverable
     * @param recoveryStrategy - Recovery strategy
     * @param userMessage - User-friendly message
     * @param suggestedActions - Suggested recovery actions
     * @param metadata - Additional metadata
     * @param cause - Original error
     * @param context - Error context
     */
    constructor(
        message: string,
        code: string,
        category: ErrorCategory,
        severity: ErrorSeverity,
        recoverable: boolean,
        recoveryStrategy: ErrorRecoveryStrategy,
        userMessage?: string,
        suggestedActions: string[] = [],
        metadata: Record<string, any> = {},
        cause?: Error,
        context?: IErrorContext
    ) {
        super(message);

        this.id = generateErrorId();
        this.code = code;
        this.category = category;
        this.severity = severity;
        this.recoverable = recoverable;
        this.recoveryStrategy = recoveryStrategy;
        this.userMessage = userMessage || message;
        this.suggestedActions = suggestedActions;
        this.timestamp = new Date();
        this.metadata = { ...metadata };

        // Only assign cause if it exists
        if (cause) {
            (this as any).cause = cause;
        }

        // Only assign context if it exists
        if (context) {
            (this as any).context = context;
        }

        // Ensure the error name is set correctly
        this.name = this.constructor.name;

        // Maintain proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    /**
     * Convert error to JSON representation
     * 
     * @returns JSON-serializable error object
     */
    public toJSON(): Record<string, any> {
        return {
            id: this.id,
            name: this.name,
            message: this.message,
            code: this.code,
            category: this.category,
            severity: this.severity,
            recoverable: this.recoverable,
            recoveryStrategy: this.recoveryStrategy,
            userMessage: this.userMessage,
            suggestedActions: this.suggestedActions,
            timestamp: this.timestamp.toISOString(),
            metadata: this.metadata,
            cause: this.cause ? {
                name: this.cause.name,
                message: this.cause.message,
                stack: this.cause.stack
            } : undefined,
            context: this.context,
            stack: this.stack
        };
    }

    /**
     * Get a summary of the error
     * 
     * @returns Error summary string
     */
    public getSummary(): string {
        return `[${this.category.toUpperCase()}] ${this.code}: ${this.userMessage}`;
    }

    /**
     * Check if error matches specific criteria
     * 
     * @param criteria - Criteria to match
     * @returns True if error matches criteria
     */
    public matches(criteria: Partial<{
        category: ErrorCategory;
        severity: ErrorSeverity;
        code: string;
        recoverable: boolean;
        recoveryStrategy: ErrorRecoveryStrategy;
    }>): boolean {
        if (criteria.category && this.category !== criteria.category) {
            return false;
        }

        if (criteria.severity && this.severity !== criteria.severity) {
            return false;
        }

        if (criteria.code && this.code !== criteria.code) {
            return false;
        }

        if (criteria.recoverable !== undefined && this.recoverable !== criteria.recoverable) {
            return false;
        }

        if (criteria.recoveryStrategy && this.recoveryStrategy !== criteria.recoveryStrategy) {
            return false;
        }

        return true;
    }

    /**
     * Update error metadata
     * 
     * @param metadata - New metadata to merge
     */
    public updateMetadata(metadata: Record<string, any>): void {
        Object.assign(this.metadata, metadata);
    }

    /**
     * Add suggested action
     * 
     * @param action - Action to add
     */
    public addSuggestedAction(action: string): void {
        if (!this.suggestedActions.includes(action)) {
            this.suggestedActions.push(action);
        }
    }

    /**
     * Remove suggested action
     * 
     * @param action - Action to remove
     */
    public removeSuggestedAction(action: string): void {
        const index = this.suggestedActions.indexOf(action);
        if (index > -1) {
            this.suggestedActions.splice(index, 1);
        }
    }

    /**
     * Get error age in milliseconds
     * 
     * @returns Age in milliseconds
     */
    public getAge(): number {
        return Date.now() - this.timestamp.getTime();
    }

    /**
     * Check if error is stale (older than specified duration)
     * 
     * @param maxAge - Maximum age in milliseconds
     * @returns True if error is stale
     */
    public isStale(maxAge: number): boolean {
        return this.getAge() > maxAge;
    }

    /**
     * Create a copy of this error with optional modifications
     * 
     * @param modifications - Modifications to apply
     * @returns New error instance
     */
    public copy(modifications?: Partial<{
        message: string;
        code: string;
        severity: ErrorSeverity;
        recoverable: boolean;
        recoveryStrategy: ErrorRecoveryStrategy;
        userMessage: string;
        suggestedActions: string[];
        metadata: Record<string, any>;
        context: IErrorContext;
    }>): this {
        const ErrorClass = this.constructor as new (...args: any[]) => this;

        return new ErrorClass(
            modifications?.message || this.message,
            modifications?.code || this.code,
            this.category,
            modifications?.severity || this.severity,
            modifications?.recoverable !== undefined ? modifications.recoverable : this.recoverable,
            modifications?.recoveryStrategy || this.recoveryStrategy,
            modifications?.userMessage || this.userMessage,
            modifications?.suggestedActions || this.suggestedActions,
            modifications?.metadata || { ...this.metadata },
            this.cause,
            modifications?.context || this.context
        ) as this;
    }

    /**
     * Static method to create error from plain Error object
     * 
     * @param error - Plain Error object
     * @param category - Error category
     * @param severity - Error severity
     * @param context - Error context
     * @returns BaseError instance
     */
    public static fromError(
        error: Error,
        category: ErrorCategory = ErrorCategory.UNKNOWN,
        severity: ErrorSeverity = ErrorSeverity.MEDIUM,
        context?: IErrorContext
    ): BaseError {
        return new GenericError(error.message, 'GENERIC_ERROR', category, severity, true, ErrorRecoveryStrategy.MANUAL, error.message, [], {}, error, context);
    }

    /**
     * Static method to validate error object
     * 
     * @param error - Error to validate
     * @returns True if valid error object
     */
    public static isValidError(error: any): error is IError {
        return error &&
            typeof error === 'object' &&
            typeof error.id === 'string' &&
            typeof error.message === 'string' &&
            typeof error.code === 'string' &&
            typeof error.category === 'string' &&
            typeof error.severity === 'string' &&
            typeof error.recoverable === 'boolean' &&
            typeof error.recoveryStrategy === 'string' &&
            typeof error.userMessage === 'string' &&
            Array.isArray(error.suggestedActions) &&
            error.timestamp instanceof Date &&
            typeof error.metadata === 'object';
    }
}

/**
 * Generic error class for uncategorized errors
 */
export class GenericError extends BaseError {
    constructor(
        message: string,
        code: string = 'GENERIC_ERROR',
        category: ErrorCategory = ErrorCategory.UNKNOWN,
        severity: ErrorSeverity = ErrorSeverity.MEDIUM,
        recoverable: boolean = true,
        recoveryStrategy: ErrorRecoveryStrategy = ErrorRecoveryStrategy.MANUAL,
        userMessage?: string,
        suggestedActions: string[] = [],
        metadata: Record<string, any> = {},
        cause?: Error,
        context?: IErrorContext
    ) {
        super(
            message,
            code,
            category,
            severity,
            recoverable,
            recoveryStrategy,
            userMessage,
            suggestedActions,
            metadata,
            cause,
            context
        );
    }
}
