/**
 * Core Error Types and Interfaces
 * 
 * Centralized type definitions for all error handling in the QuietSpace Frontend.
 * Provides a unified foundation for error classification, handling, and reporting.
 */

import { ErrorSeverity, ErrorCategory, ErrorRecoveryStrategy } from './ErrorEnums';

/**
 * Core error interface that all errors should implement
 */
export interface IError {
    /** Unique error identifier */
    readonly id: string;
    /** Error message */
    readonly message: string;
    /** Error code for programmatic handling */
    readonly code: string;
    /** Error severity level */
    readonly severity: ErrorSeverity;
    /** Error category */
    readonly category: ErrorCategory;
    /** Whether the error is recoverable */
    readonly recoverable: boolean;
    /** Recommended recovery strategy */
    readonly recoveryStrategy: ErrorRecoveryStrategy;
    /** User-friendly error message */
    readonly userMessage: string;
    /** Suggested actions for recovery */
    readonly suggestedActions: string[];
    /** Error timestamp */
    readonly timestamp: Date;
    /** Additional error metadata */
    readonly metadata: Record<string, any>;
    /** Original error that caused this error */
    readonly cause?: Error | undefined;
    /** Error stack trace */
    readonly stack?: string;
    /** Error context information */
    readonly context?: IErrorContext | undefined;

    /**
     * Convert error to JSON representation
     * 
     * @returns JSON-serializable error object
     */
    toJSON(): Record<string, any>;

    /**
     * Create a copy of this error with optional modifications
     * 
     * @param modifications - Modifications to apply
     * @returns New error instance
     */
    copy(modifications?: Partial<{
        message: string;
        code: string;
        severity: ErrorSeverity;
        recoverable: boolean;
        recoveryStrategy: ErrorRecoveryStrategy;
        userMessage: string;
        suggestedActions: string[];
        metadata: Record<string, any>;
        context: IErrorContext;
    }>): IError;
}

/**
 * Error context information
 */
export interface IErrorContext {
    /** Component where error occurred */
    component?: string;
    /** Action being performed */
    action?: string;
    /** User role when error occurred */
    userRole?: string;
    /** Application environment */
    environment?: string;
    /** Current user ID */
    userId?: string;
    /** Session identifier */
    sessionId?: string;
    /** Current URL/path */
    url?: string;
    /** User agent string */
    userAgent?: string;
    /** Additional context data */
    additionalData?: Record<string, any>;
}

/**
 * Error classification result
 */
export interface IErrorClassification {
    /** Error type */
    type: ErrorCategory;
    /** Error severity */
    severity: ErrorSeverity;
    /** Whether error is recoverable */
    recoverable: boolean;
    /** User-friendly message */
    userMessage: string;
    /** Suggested recovery actions */
    suggestedActions: string[];
    /** Recovery strategy */
    retryStrategy: ErrorRecoveryStrategy;
    /** Error sub-category */
    subCategory?: string;
    /** Error tags for filtering and analysis */
    tags: string[];
    /** Classification confidence score */
    confidence: number;
    /** Additional classification metadata */
    metadata: Record<string, any>;
}

/**
 * Error reporting data
 */
export interface IErrorReport {
    /** Error identifier */
    errorId: string;
    /** Classification data */
    classification: IErrorClassification;
    /** Error context */
    context: IErrorContext;
    /** Error stack trace */
    stackTrace?: string;
    /** Browser information */
    browserInfo: {
        userAgent: string;
        url: string;
        referrer?: string;
        screenSize: { width: number; height: number };
        language: string;
    };
    /** Application state */
    applicationState: {
        version: string;
        buildNumber?: string;
        environment: string;
        featureFlags: Record<string, boolean>;
    };
    /** User information */
    userInfo: {
        id?: string;
        role?: string;
        sessionId?: string;
    };
    /** Report timestamp */
    timestamp: Date;
}

/**
 * Error recovery options
 */
export interface IErrorRecoveryOptions {
    /** Maximum retry attempts */
    maxRetries?: number;
    /** Delay between retries (ms) */
    retryDelay?: number;
    /** Exponential backoff multiplier */
    backoffMultiplier?: number;
    /** Timeout for recovery attempts (ms) */
    timeout?: number;
    /** Custom recovery function */
    customRecovery?: (error: IError) => Promise<boolean>;
    /** Fallback action if recovery fails */
    fallbackAction?: () => void;
}

/**
 * Error handler configuration
 */
export interface IErrorHandlerConfig {
    /** Enable error reporting */
    enableReporting?: boolean;
    /** Enable error classification */
    enableClassification?: boolean;
    /** Enable error recovery */
    enableRecovery?: boolean;
    /** Default recovery options */
    defaultRecoveryOptions?: IErrorRecoveryOptions;
    /** Error reporting endpoint */
    reportingEndpoint?: string;
    /** Classification patterns */
    classificationPatterns?: IErrorPattern[];
    /** Custom error transformers */
    errorTransformers?: Array<(error: Error) => IError>;
}

/**
 * Error pattern for classification
 */
export interface IErrorPattern {
    /** Regular expression pattern */
    pattern: RegExp;
    /** Classification result */
    classification: Partial<IErrorClassification>;
    /** Pattern confidence score */
    confidence: number;
    /** Pattern priority (higher = more important) */
    priority?: number;
}

/**
 * Error handler interface
 */
export interface IErrorHandler {
    /** Handle an error */
    handle(error: Error, context?: IErrorContext): Promise<IError>;
    /** Classify an error */
    classify(error: Error, context?: IErrorContext): IErrorClassification;
    /** Report an error */
    report(error: IError, context?: IErrorContext): Promise<void>;
    /** Attempt error recovery */
    recover(error: IError, options?: IErrorRecoveryOptions): Promise<boolean>;
    /** Get error statistics */
    getStatistics(): IErrorStatistics;
}

/**
 * Error statistics
 */
export interface IErrorStatistics {
    /** Total errors handled */
    totalErrors: number;
    /** Errors by category */
    errorsByCategory: Record<ErrorCategory, number>;
    /** Errors by severity */
    errorsBySeverity: Record<ErrorSeverity, number>;
    /** Recovery success rate */
    recoverySuccessRate: number;
    /** Average recovery time */
    averageRecoveryTime: number;
    /** Most common errors */
    mostCommonErrors: Array<{
        message: string;
        count: number;
        category: ErrorCategory;
    }>;
    /** Recent error trends */
    errorTrends: Array<{
        date: Date;
        count: number;
        category: ErrorCategory;
    }>;
}

/**
 * Error event types
 */
export type ErrorEventType =
    | 'error_occurred'
    | 'error_classified'
    | 'error_reported'
    | 'error_recovered'
    | 'error_recovery_failed'
    | 'error_statistics_updated';

/**
 * Error event data
 */
export interface IErrorEvent {
    /** Event type */
    type: ErrorEventType;
    /** Event timestamp */
    timestamp: Date;
    /** Associated error */
    error: IError;
    /** Event context */
    context?: IErrorContext;
    /** Additional event data */
    data?: Record<string, any>;
}

/**
 * Error listener callback
 */
export type ErrorEventListener = (event: IErrorEvent) => void;

/**
 * Error factory interface
 */
export interface IErrorFactory {
    /** Create error from parameters */
    create(
        message: string,
        code: string,
        category: ErrorCategory,
        severity: ErrorSeverity,
        options?: Partial<IError>
    ): IError;
    /** Create error from existing Error */
    fromError(
        error: Error,
        category?: ErrorCategory,
        severity?: ErrorSeverity,
        context?: IErrorContext
    ): IError;
    /** Create network error */
    createNetworkError(
        message: string,
        statusCode?: number,
        endpoint?: string
    ): IError;
    /** Create validation error */
    createValidationError(
        message: string,
        field?: string,
        value?: any
    ): IError;
    /** Create authentication error */
    createAuthenticationError(
        message: string,
        authType?: string
    ): IError;
    /** Create system error */
    createSystemError(
        message: string,
        component?: string,
        operation?: string
    ): IError;
}

/**
 * Error logger interface
 */
export interface IErrorLogger {
    /** Log error with context */
    log(error: IError, context?: IErrorContext): void;
    /** Log warning */
    warn(message: string, context?: IErrorContext): void;
    /** Log info */
    info(message: string, context?: IErrorContext): void;
    /** Set log level */
    setLevel(level: 'debug' | 'info' | 'warn' | 'error'): void;
    /** Get log entries */
    getEntries(limit?: number): IErrorLogEntry[];
}

/**
 * Error log entry
 */
export interface IErrorLogEntry {
    /** Log level */
    level: 'debug' | 'info' | 'warn' | 'error';
    /** Log message */
    message: string;
    /** Log timestamp */
    timestamp: Date;
    /** Error context */
    context?: IErrorContext;
    /** Associated error (if any) */
    error?: IError;
}
