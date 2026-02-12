/**
 * Error Utilities
 * 
 * Utility functions for common error handling operations.
 */

import { IError, IErrorContext, ErrorSeverity, ErrorCategory, ErrorRecoveryStrategy } from '../types/index';

/**
 * Check if error is critical
 */
export function isCriticalError(error: IError): boolean {
    return error.severity === ErrorSeverity.CRITICAL;
}

/**
 * Check if error is recoverable
 */
export function isRecoverableError(error: IError): boolean {
    return error.recoverable && error.recoveryStrategy !== ErrorRecoveryStrategy.NONE;
}

/**
 * Check if error should be retried
 */
export function shouldRetryError(error: IError): boolean {
    return isRecoverableError(error) &&
        (error.recoveryStrategy === ErrorRecoveryStrategy.IMMEDIATE ||
            error.recoveryStrategy === ErrorRecoveryStrategy.DELAYED ||
            error.recoveryStrategy === ErrorRecoveryStrategy.AUTOMATIC);
}

/**
 * Check if error is network related
 */
export function isNetworkError(error: IError): boolean {
    return error.category === ErrorCategory.NETWORK;
}

/**
 * Check if error is validation related
 */
export function isValidationError(error: IError): boolean {
    return error.category === ErrorCategory.VALIDATION;
}

/**
 * Check if error is authentication related
 */
export function isAuthenticationError(error: IError): boolean {
    return error.category === ErrorCategory.AUTHENTICATION ||
        error.category === ErrorCategory.AUTHORIZATION;
}

/**
 * Check if error is system related
 */
export function isSystemError(error: IError): boolean {
    return error.category === ErrorCategory.SYSTEM;
}

/**
 * Get error severity level as number
 */
export function getSeverityLevel(severity: ErrorSeverity): number {
    switch (severity) {
        case ErrorSeverity.LOW: return 1;
        case ErrorSeverity.MEDIUM: return 2;
        case ErrorSeverity.HIGH: return 3;
        case ErrorSeverity.CRITICAL: return 4;
        default: return 0;
    }
}

/**
 * Compare error severity
 */
export function compareSeverity(error1: IError, error2: IError): number {
    return getSeverityLevel(error1.severity) - getSeverityLevel(error2.severity);
}

/**
 * Get more severe error
 */
export function getMoreSevereError(error1: IError, error2: IError): IError {
    return compareSeverity(error1, error2) > 0 ? error1 : error2;
}

/**
 * Check if error is stale (older than specified duration)
 */
export function isStaleError(error: IError, maxAge: number = 300000): boolean {
    // Default 5 minutes
    return Date.now() - error.timestamp.getTime() > maxAge;
}

/**
 * Get error age in milliseconds
 */
export function getErrorAge(error: IError): number {
    return Date.now() - error.timestamp.getTime();
}

/**
 * Format error age for display
 */
export function formatErrorAge(age: number): string {
    const seconds = Math.floor(age / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}

/**
 * Get error age as formatted string
 */
export function getFormattedErrorAge(error: IError): string {
    return formatErrorAge(getErrorAge(error));
}

/**
 * Check if error matches criteria
 */
export function errorMatches(error: IError, criteria: Partial<{
    category: ErrorCategory;
    severity: ErrorSeverity;
    code: string;
    recoverable: boolean;
    recoveryStrategy: ErrorRecoveryStrategy;
}>): boolean {
    if (criteria.category && error.category !== criteria.category) {
        return false;
    }

    if (criteria.severity && error.severity !== criteria.severity) {
        return false;
    }

    if (criteria.code && error.code !== criteria.code) {
        return false;
    }

    if (criteria.recoverable !== undefined && error.recoverable !== criteria.recoverable) {
        return false;
    }

    if (criteria.recoveryStrategy && error.recoveryStrategy !== criteria.recoveryStrategy) {
        return false;
    }

    return true;
}

/**
 * Filter errors by criteria
 */
export function filterErrors(errors: IError[], criteria: Partial<{
    category: ErrorCategory;
    severity: ErrorSeverity;
    code: string;
    recoverable: boolean;
    recoveryStrategy: ErrorRecoveryStrategy;
}>): IError[] {
    return errors.filter(error => errorMatches(error, criteria));
}

/**
 * Group errors by category
 */
export function groupErrorsByCategory(errors: IError[]): Record<ErrorCategory, IError[]> {
    return errors.reduce((groups, error) => {
        if (!groups[error.category]) {
            groups[error.category] = [];
        }
        groups[error.category].push(error);
        return groups;
    }, {} as Record<ErrorCategory, IError[]>);
}

/**
 * Group errors by severity
 */
export function groupErrorsBySeverity(errors: IError[]): Record<ErrorSeverity, IError[]> {
    return errors.reduce((groups, error) => {
        if (!groups[error.severity]) {
            groups[error.severity] = [];
        }
        groups[error.severity].push(error);
        return groups;
    }, {} as Record<ErrorSeverity, IError[]>);
}

/**
 * Get error statistics
 */
export function getErrorStatistics(errors: IError[]): {
    total: number;
    byCategory: Record<ErrorCategory, number>;
    bySeverity: Record<ErrorSeverity, number>;
    recoverable: number;
    nonRecoverable: number;
    averageAge: number;
    oldestError?: IError;
    newestError?: IError;
} {
    const byCategory = {} as Record<ErrorCategory, number>;
    const bySeverity = {} as Record<ErrorSeverity, number>;
    let recoverable = 0;
    let nonRecoverable = 0;
    let totalAge = 0;
    let oldestError: IError | undefined;
    let newestError: IError | undefined;

    errors.forEach(error => {
        // Count by category
        byCategory[error.category] = (byCategory[error.category] || 0) + 1;

        // Count by severity
        bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;

        // Count recoverable vs non-recoverable
        if (error.recoverable) {
            recoverable++;
        } else {
            nonRecoverable++;
        }

        // Calculate age
        const age = getErrorAge(error);
        totalAge += age;

        // Track oldest and newest
        if (!oldestError || error.timestamp < oldestError.timestamp) {
            oldestError = error;
        }
        if (!newestError || error.timestamp > newestError.timestamp) {
            newestError = error;
        }
    });

    return {
        total: errors.length,
        byCategory,
        bySeverity,
        recoverable,
        nonRecoverable,
        averageAge: errors.length > 0 ? totalAge / errors.length : 0,
        oldestError,
        newestError
    };
}

/**
 * Create error context
 */
export function createErrorContext(context: Partial<IErrorContext>): IErrorContext {
    return {
        component: context.component,
        action: context.action,
        userRole: context.userRole,
        environment: context.environment || (typeof window !== 'undefined' ? 'browser' : 'node'),
        userId: context.userId,
        sessionId: context.sessionId,
        url: context.url || (typeof window !== 'undefined' ? window.location.href : undefined),
        userAgent: context.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined),
        additionalData: context.additionalData
    };
}

/**
 * Get current error context
 */
export function getCurrentErrorContext(additionalContext: Partial<IErrorContext> = {}): IErrorContext {
    const baseContext = {
        environment: (typeof window !== 'undefined' ? 'browser' : 'node'),
        url: (typeof window !== 'undefined' ? window.location.href : undefined),
        userAgent: (typeof navigator !== 'undefined' ? navigator.userAgent : undefined)
    };

    return createErrorContext({ ...baseContext, ...additionalContext });
}

/**
 * Serialize error for transport
 */
export function serializeError(error: IError): string {
    return JSON.stringify(error.toJSON());
}

/**
 * Deserialize error from transport
 */
export function deserializeError(serializedError: string): IError | null {
    try {
        const parsed = JSON.parse(serializedError);

        // Validate that it looks like an error
        if (parsed && typeof parsed === 'object' &&
            typeof parsed.id === 'string' &&
            typeof parsed.message === 'string' &&
            typeof parsed.code === 'string' &&
            typeof parsed.category === 'string' &&
            typeof parsed.severity === 'string') {

            // Convert timestamp back to Date
            if (parsed.timestamp && typeof parsed.timestamp === 'string') {
                parsed.timestamp = new Date(parsed.timestamp);
            }

            return parsed as IError;
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Clone error
 */
export function cloneError(error: IError): IError {
    const serialized = serializeError(error);
    const deserialized = deserializeError(serialized);

    if (!deserialized) {
        throw new Error('Failed to clone error');
    }

    return deserialized;
}

/**
 * Merge errors (combines information from multiple errors)
 */
export function mergeErrors(errors: IError[]): IError {
    if (errors.length === 0) {
        throw new Error('Cannot merge empty error list');
    }

    if (errors.length === 1) {
        return errors[0];
    }

    const primaryError = errors[0];
    const otherErrors = errors.slice(1);

    // Find the most severe error
    const mostSevereError = errors.reduce((most, current) =>
        compareSeverity(current, most) > 0 ? current : most
    );

    // Combine metadata
    const combinedMetadata = {
        ...primaryError.metadata,
        mergedErrors: otherErrors.map(e => ({
            id: e.id,
            code: e.code,
            message: e.message,
            category: e.category,
            severity: e.severity
        }))
    };

    // Combine suggested actions
    const combinedActions = Array.from(new Set([
        ...primaryError.suggestedActions,
        ...otherErrors.flatMap(e => e.suggestedActions)
    ]));

    return {
        ...primaryError,
        severity: mostSevereError.severity,
        userMessage: mostSevereError.userMessage,
        suggestedActions: combinedActions,
        metadata: combinedMetadata
    };
}

/**
 * Check if error should be reported
 */
export function shouldReportError(error: IError, options: {
    minSeverity?: ErrorSeverity;
    excludeCategories?: ErrorCategory[];
    excludeCodes?: string[];
} = {}): boolean {
    const {
        minSeverity = ErrorSeverity.MEDIUM,
        excludeCategories = [],
        excludeCodes = []
    } = options;

    // Check severity
    if (getSeverityLevel(error.severity) < getSeverityLevel(minSeverity)) {
        return false;
    }

    // Check excluded categories
    if (excludeCategories.includes(error.category)) {
        return false;
    }

    // Check excluded codes
    if (excludeCodes.includes(error.code)) {
        return false;
    }

    return true;
}

/**
 * Create error summary
 */
export function createErrorSummary(error: IError): string {
    return `[${error.category.toUpperCase()}] ${error.code}: ${error.userMessage}`;
}

/**
 * Create detailed error summary
 */
export function createDetailedErrorSummary(error: IError): string {
    const lines = [
        `Error: ${createErrorSummary(error)}`,
        `ID: ${error.id}`,
        `Timestamp: ${error.timestamp.toISOString()}`,
        `Severity: ${error.severity}`,
        `Recoverable: ${error.recoverable}`,
        `Recovery Strategy: ${error.recoveryStrategy}`
    ];

    if (error.suggestedActions.length > 0) {
        lines.push(`Suggested Actions: ${error.suggestedActions.join(', ')}`);
    }

    if (error.context) {
        lines.push(`Context: ${JSON.stringify(error.context, null, 2)}`);
    }

    return lines.join('\n');
}
