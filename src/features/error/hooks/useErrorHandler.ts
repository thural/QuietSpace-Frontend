/**
 * Use Error Handler Hook
 * 
 * Custom hook for handling errors in React components
 * with centralized error management and recovery.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { IError, IErrorContext, ErrorSeverity } from '../../core/modules/error/types';
import { errorHandler, errorLogger } from '../../core/modules/error/handlers';

interface UseErrorHandlerOptions {
    component?: string;
    action?: string;
    enableLogging?: boolean;
    enableReporting?: boolean;
    onError?: (error: IError, context?: IErrorContext) => void;
    onRecovery?: (error: IError, success: boolean) => void;
    maxRecoveryAttempts?: number;
}

interface UseErrorHandlerReturn {
    error: IError | null;
    isError: boolean;
    isRecovering: boolean;
    recoveryAttempts: number;
    handleError: (error: Error | IError, context?: Partial<IErrorContext>) => Promise<IError>;
    clearError: () => void;
    retry: () => Promise<boolean>;
    getErrorContext: (additionalContext?: Partial<IErrorContext>) => IErrorContext;
}

/**
 * Custom hook for error handling
 */
export const useErrorHandler = (options: UseErrorHandlerOptions = {}): UseErrorHandlerReturn => {
    const [error, setError] = useState<IError | null>(null);
    const [isRecovering, setIsRecovering] = useState(false);
    const [recoveryAttempts, setRecoveryAttempts] = useState(0);
    const errorRef = useRef<IError | null>(null);

    const {
        component,
        action,
        enableLogging = true,
        enableReporting = false,
        onError,
        onRecovery,
        maxRecoveryAttempts = 3
    } = options;

    // Get current error context
    const getErrorContext = useCallback((additionalContext?: Partial<IErrorContext>): IErrorContext => {
        return {
            component: component || 'Unknown',
            action: action || 'render',
            environment: typeof window !== 'undefined' ? 'browser' : 'node',
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            ...additionalContext
        };
    }, [component, action]);

    // Handle error
    const handleError = useCallback(async (
        error: Error | IError,
        context?: Partial<IErrorContext>
    ): Promise<IError> => {
        const errorContext = getErrorContext(context);
        
        try {
            // Handle error through centralized system
            const handledError = await errorHandler.handle(error, errorContext);
            
            // Update state
            setError(handledError);
            errorRef.current = handledError;
            setRecoveryAttempts(0);

            // Log error if enabled
            if (enableLogging) {
                errorLogger.log(handledError, errorContext);
            }

            // Report error if enabled
            if (enableReporting) {
                errorHandler.report(handledError, errorContext);
            }

            // Call custom error handler
            if (onError) {
                onError(handledError, errorContext);
            }

            return handledError;
        } catch (handlingError) {
            console.error('Error handling failed:', handlingError);
            
            // Create fallback error
            const fallbackError: IError = {
                id: `fallback_${Date.now()}`,
                message: error.message,
                code: 'FALLBACK_ERROR',
                category: 'unknown' as any,
                severity: 'medium' as any,
                recoverable: false,
                recoveryStrategy: 'manual' as any,
                userMessage: 'An unexpected error occurred',
                suggestedActions: ['Try refreshing the page', 'Contact support'],
                timestamp: new Date(),
                metadata: {
                    originalError: error.message,
                    stack: error instanceof Error ? error.stack : undefined
                },
                cause: error instanceof Error ? error : undefined,
                context: errorContext,
                toJSON: () => ({
                    id: `fallback_${Date.now()}`,
                    message: error.message,
                    code: 'FALLBACK_ERROR',
                    category: 'unknown',
                    severity: 'medium',
                    recoverable: false,
                    recoveryStrategy: 'manual',
                    userMessage: 'An unexpected error occurred',
                    suggestedActions: ['Try refreshing the page', 'Contact support'],
                    timestamp: new Date(),
                    metadata: {
                        originalError: error.message,
                        stack: error instanceof Error ? error.stack : undefined
                    },
                    cause: error instanceof Error ? error : undefined,
                    context: errorContext,
                    stack: error instanceof Error ? error.stack : undefined
                }),
                copy: () => ({ ...fallbackError } as IError)
            };

            setError(fallbackError);
            errorRef.current = fallbackError;

            return fallbackError;
        }
    }, [getErrorContext, enableLogging, enableReporting, onError]);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
        errorRef.current = null;
        setRecoveryAttempts(0);
        setIsRecovering(false);
    }, []);

    // Retry error recovery
    const retry = useCallback(async (): Promise<boolean> => {
        if (!errorRef.current || recoveryAttempts >= maxRecoveryAttempts) {
            return false;
        }

        setIsRecovering(true);
        setRecoveryAttempts(prev => prev + 1);

        try {
            const success = await errorHandler.recover(errorRef.current, {
                maxRetries: maxRecoveryAttempts - recoveryAttempts,
                fallbackAction: () => {
                    setIsRecovering(false);
                }
            });

            if (success) {
                clearError();
                if (onRecovery) {
                    onRecovery(errorRef.current!, true);
                }
            } else {
                setIsRecovering(false);
                if (onRecovery) {
                    onRecovery(errorRef.current!, false);
                }
            }

            return success;
        } catch (recoveryError) {
            console.error('Recovery attempt failed:', recoveryError);
            setIsRecovering(false);
            return false;
        }
    }, [error, recoveryAttempts, maxRecoveryAttempts, clearError, onRecovery]);

    // Auto-retry for recoverable errors
    useEffect(() => {
        if (error && error.recoverable && recoveryAttempts === 0 && !isRecovering) {
            // Auto-retry for low severity errors
            if (error.severity === ErrorSeverity.LOW || error.severity === ErrorSeverity.MEDIUM) {
                const timer = setTimeout(() => {
                    retry();
                }, 1000);

                return () => clearTimeout(timer);
            }
        }
    }, [error, recoveryAttempts, isRecovering, retry]);

    return {
        error,
        isError: error !== null,
        isRecovering,
        recoveryAttempts,
        handleError,
        clearError,
        retry,
        getErrorContext
    };
};

/**
 * Use Async Error Handler Hook
 * 
 * Hook for handling async operations with error handling
 */
export const useAsyncErrorHandler = <T,>(
    asyncFn: () => Promise<T>,
    options: UseErrorHandlerOptions = {}
) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const errorHandler = useErrorHandler(options);

    const execute = useCallback(async (...args: any[]): Promise<T | null> => {
        setLoading(true);
        errorHandler.clearError();

        try {
            const result = await asyncFn(...args);
            setData(result);
            return result;
        } catch (error) {
            await errorHandler.handleError(error as Error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [asyncFn, errorHandler]);

    const reset = useCallback(() => {
        setData(null);
        setLoading(false);
        errorHandler.clearError();
    }, [errorHandler]);

    return {
        data,
        loading,
        execute,
        reset,
        ...errorHandler
    };
};

/**
 * Use Error Boundary Hook
 * 
 * Hook for integrating with error boundaries
 */
export const useErrorBoundary = () => {
    const [error, setError] = useState<Error | null>(null);
    const [errorInfo, setErrorInfo] = useState<any>(null);

    const reset = useCallback(() => {
        setError(null);
        setErrorInfo(null);
    }, []);

    const captureError = useCallback((error: Error, errorInfo: any) => {
        setError(error);
        setErrorInfo(errorInfo);
    }, []);

    return {
        error,
        errorInfo,
        hasError: error !== null,
        reset,
        captureError
    };
};

export default useErrorHandler;
