/**
 * Error Factory
 * 
 * Centralized factory for creating error instances with proper classification
 * and consistent configuration.
 */

import { IError, IErrorContext, IErrorFactory } from '../types/index';
import { ErrorCategory, ErrorSeverity, ErrorRecoveryStrategy } from '../types/index';

// Import all error classes
import {
    BaseError,
    GenericError
} from '../classes/index';
import {
    NetworkError,
    TokenRefreshError,
    NetworkTimeoutError,
    NetworkAuthenticationError,
    RateLimitError,
    NetworkConnectionError,
    BadRequestError,
    ServerError
} from '../classes/index';
import {
    ValidationError,
    RequiredFieldError,
    InvalidFormatError,
    RangeError,
    LengthError
} from '../classes/index';
import {
    AuthenticationError,
    InvalidCredentialsError,
    TokenExpiredError,
    InvalidTokenError,
    AccountLockedError,
    PermissionDeniedError,
    SessionExpiredError
} from '../classes/index';
import {
    SystemError,
    MemoryError,
    DiskSpaceError,
    CPUError,
    DatabaseError,
    FileSystemError,
    ConfigurationError,
    DependencyError
} from '../classes/index';

/**
 * Error Factory implementation
 */
export class ErrorFactory implements IErrorFactory {
    /**
     * Create error from parameters
     */
    public create(
        message: string,
        code: string,
        category: ErrorCategory,
        severity: ErrorSeverity,
        options: Partial<IError> = {}
    ): IError {
        return new GenericError(
            message,
            code,
            category,
            severity,
            options.recoverable ?? true,
            options.recoveryStrategy ?? ErrorRecoveryStrategy.MANUAL,
            options.userMessage,
            options.suggestedActions,
            options.metadata,
            options.cause,
            options.context
        );
    }

    /**
     * Create error from existing Error
     */
    public fromError(
        error: Error,
        category?: ErrorCategory,
        severity?: ErrorSeverity,
        context?: IErrorContext
    ): IError {
        return BaseError.fromError(error, category, severity, context);
    }

    /**
     * Create network error
     */
    public createNetworkError(
        message: string,
        statusCode?: number,
        endpoint?: string
    ): IError {
        return new NetworkError(message, 'NETWORK_ERROR', statusCode, endpoint);
    }

    /**
     * Create validation error
     */
    public createValidationError(
        message: string,
        field?: string,
        value?: any
    ): IError {
        return new ValidationError(message, 'VALIDATION_ERROR', field, value);
    }

    /**
     * Create authentication error
     */
    public createAuthenticationError(
        message: string,
        authType?: string
    ): IError {
        return new AuthenticationError(message, 'AUTHENTICATION_ERROR', authType);
    }

    /**
     * Create system error
     */
    public createSystemError(
        message: string,
        component?: string,
        operation?: string
    ): IError {
        return new SystemError(message, 'SYSTEM_ERROR', component, operation);
    }

    /**
     * Create token refresh error
     */
    public createTokenRefreshError(
        message?: string,
        originalError?: Error
    ): IError {
        return new TokenRefreshError(message, { originalError });
    }

    /**
     * Create network timeout error
     */
    public createNetworkTimeoutError(
        message?: string,
        timeout?: number,
        endpoint?: string
    ): IError {
        return new NetworkTimeoutError(message, timeout, { endpoint });
    }

    /**
     * Create rate limit error
     */
    public createRateLimitError(
        message?: string,
        retryAfter?: number,
        endpoint?: string
    ): IError {
        return new RateLimitError(message, retryAfter, { endpoint });
    }

    /**
     * Create required field error
     */
    public createRequiredFieldError(
        field: string,
        value?: any
    ): IError {
        return new RequiredFieldError(field, value);
    }

    /**
     * Create invalid format error
     */
    public createInvalidFormatError(
        field: string,
        value: any,
        expectedFormat: string,
        actualFormat?: string
    ): IError {
        return new InvalidFormatError(field, value, expectedFormat, actualFormat);
    }

    /**
     * Create invalid credentials error
     */
    public createInvalidCredentialsError(
        message?: string,
        authType?: string
    ): IError {
        return new InvalidCredentialsError(message, authType);
    }

    /**
     * Create token expired error
     */
    public createTokenExpiredError(
        message?: string,
        tokenType?: string,
        expiresAt?: Date
    ): IError {
        return new TokenExpiredError(message, tokenType, expiresAt);
    }

    /**
     * Create permission denied error
     */
    public createPermissionDeniedError(
        message?: string,
        requiredPermission?: string,
        userPermissions?: string[],
        resource?: string
    ): IError {
        return new PermissionDeniedError(message, requiredPermission, userPermissions, resource);
    }

    /**
     * Create memory error
     */
    public createMemoryError(
        message?: string,
        memoryUsage?: number,
        memoryLimit?: number
    ): IError {
        return new MemoryError(message, memoryUsage, memoryLimit);
    }

    /**
     * Create database error
     */
    public createDatabaseError(
        message?: string,
        database?: string,
        query?: string,
        connectionId?: string
    ): IError {
        return new DatabaseError(message, database, query, connectionId);
    }

    /**
     * Create dependency error
     */
    public createDependencyError(
        message?: string,
        dependency?: string,
        version?: string,
        requiredVersion?: string
    ): IError {
        return new DependencyError(message, dependency, version, requiredVersion);
    }

    /**
     * Create error from HTTP response
     */
    public fromHttpResponse(
        message: string,
        statusCode: number,
        originalError?: Error
    ): IError {
        switch (statusCode) {
            case 400:
                return new BadRequestError(message, undefined, { cause: originalError });
            case 401:
                return new NetworkAuthenticationError(message, undefined, { statusCode: 401, cause: originalError });
            case 403:
                return new PermissionDeniedError(message, 'access_denied', undefined, undefined, { cause: originalError });
            case 408:
                return new NetworkTimeoutError(message, undefined, { cause: originalError });
            case 429:
                return new RateLimitError(message, undefined, { cause: originalError });
            case 500:
            case 502:
            case 503:
            case 504:
                return new ServerError(message, undefined, { statusCode, cause: originalError });
            default:
                if (statusCode >= 400 && statusCode < 500) {
                    return new NetworkError(message, 'CLIENT_ERROR', statusCode, undefined, undefined, 0, {
                        severity: ErrorSeverity.MEDIUM,
                        recoverable: false,
                        recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                        cause: originalError
                    });
                } else if (statusCode >= 500) {
                    return new NetworkError(message, 'SERVER_ERROR', statusCode, undefined, undefined, 0, {
                        severity: ErrorSeverity.HIGH,
                        recoverable: true,
                        recoveryStrategy: ErrorRecoveryStrategy.DELAYED,
                        cause: originalError
                    });
                }
                return new NetworkError(message, 'UNKNOWN_ERROR', statusCode, undefined, undefined, 0, {
                    severity: ErrorSeverity.MEDIUM,
                    recoverable: true,
                    recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                    cause: originalError
                });
        }
    }

    /**
     * Create error from network exception
     */
    public fromNetworkException(
        error: Error,
        endpoint?: string
    ): IError {
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
            return new NetworkTimeoutError(error.message, undefined, { endpoint, cause: error });
        }

        if (errorMessage.includes('connection refused') ||
            errorMessage.includes('enotfound') ||
            errorMessage.includes('network unreachable')) {
            return new NetworkConnectionError(error.message, endpoint, { cause: error });
        }

        if (errorMessage.includes('cors') || errorMessage.includes('cross-origin')) {
            return new NetworkError(
                error.message,
                'CLIENT_ERROR',
                undefined,
                endpoint,
                undefined,
                0,
                {
                    severity: ErrorSeverity.MEDIUM,
                    recoverable: false,
                    recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                    metadata: { originalError: error?.message }
                }
            );
        }

        return new NetworkConnectionError(error.message, endpoint, { cause: error });
    }

    /**
     * Create error with context
     */
    public createWithContext(
        error: IError,
        context: IErrorContext
    ): IError {
        return error.copy({ context });
    }

    /**
     * Create error with custom recovery options
     */
    public createWithRecovery(
        error: IError,
        recoveryStrategy: ErrorRecoveryStrategy,
        suggestedActions: string[]
    ): IError {
        return error.copy({
            recoveryStrategy,
            suggestedActions
        });
    }

    /**
     * Create error with severity override
     */
    public createWithSeverity(
        error: IError,
        severity: ErrorSeverity
    ): IError {
        return error.copy({ severity });
    }
}

// Export singleton instance
export const errorFactory = new ErrorFactory();

// Export convenience functions
export const createError = (message: string, code: string, category: ErrorCategory, severity: ErrorSeverity, options?: Partial<IError>) =>
    errorFactory.create(message, code, category, severity, options);

export const createErrorFrom = (error: Error, category?: ErrorCategory, severity?: ErrorSeverity, context?: IErrorContext) =>
    errorFactory.fromError(error, category, severity, context);

export const createNetworkError = (message: string, statusCode?: number, endpoint?: string) =>
    errorFactory.createNetworkError(message, statusCode, endpoint);

export const createValidationError = (message: string, field?: string, value?: any) =>
    errorFactory.createValidationError(message, field, value);

export const createAuthenticationError = (message: string, authType?: string) =>
    errorFactory.createAuthenticationError(message, authType);

export const createSystemError = (message: string, component?: string, operation?: string) =>
    errorFactory.createSystemError(message, component, operation);
