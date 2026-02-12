/**
 * Enhanced Error Boundary Component
 * 
 * Advanced React error boundary with classification, recovery, and reporting features.
 * Integrates with the centralized error handling system.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { IError, IErrorContext } from '../../../../core/modules/error/types';
import { ErrorSeverity, ErrorRecoveryStrategy } from '../../../../core/modules/error/types';
import { errorHandler, errorLogger } from '../../../../core/modules/error';
import ErrorFallback from './ErrorFallback';

interface ErrorBoundaryState {
    hasError: boolean;
    error: IError | null;
    errorInfo: ErrorInfo | null;
    isRecovering: boolean;
    recoveryAttempts: number;
    errorHistory: Array<{
        error: IError;
        timestamp: Date;
        componentStack: string;
    }>;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: React.ComponentType<{ error: IError; errorInfo: ErrorInfo; resetErrorBoundary: () => void; }>;
    onError?: (error: IError, errorInfo: ErrorInfo) => void;
    onRecovery?: (error: IError, success: boolean) => void;
    maxRecoveryAttempts?: number;
    enableReporting?: boolean;
    context?: Partial<IErrorContext>;
}

/**
 * Enhanced Error Boundary Component
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    private maxRecoveryAttempts: number;

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.maxRecoveryAttempts = props.maxRecoveryAttempts || 3;
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            isRecovering: false,
            recoveryAttempts: 0,
            errorHistory: []
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Create error context
        const context = this.createErrorContext(errorInfo);

        // Handle the error through centralized system
        const handledError = errorHandler.handle(error, context).then(standardizedError => {
            this.setState({
                error: standardizedError,
                errorInfo,
                hasError: true
            });

            // Add to error history
            this.addToErrorHistory(standardizedError, errorInfo);

            // Log the error
            errorLogger.log(standardizedError, context);

            // Call custom error handler
            if (this.props.onError) {
                this.props.onError(standardizedError, errorInfo);
            }

            // Report error if enabled
            if (this.props.enableReporting) {
                errorHandler.report(standardError, context);
            }
        }).catch(handleError => {
            // Fallback if error handling fails
            console.error('Error handling failed:', handleError);
            this.setState({
                error: this.createFallbackError(error),
                errorInfo,
                hasError: true
            });
        });
    }

    /**
     * Attempt error recovery
     */
    private attemptRecovery = async (): Promise<void> => {
        if (!this.state.error || this.state.recoveryAttempts >= this.maxRecoveryAttempts) {
            return;
        }

        this.setState({ isRecovering: true, recoveryAttempts: this.state.recoveryAttempts + 1 });

        try {
            const success = await errorHandler.recover(this.state.error, {
                maxRetries: this.maxRecoveryAttempts - this.state.recoveryAttempts,
                fallbackAction: () => {
                    this.setState({ isRecovering: false });
                }
            });

            if (success) {
                // Recovery successful
                this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null,
                    isRecovering: false,
                    recoveryAttempts: 0
                });

                if (this.props.onRecovery) {
                    this.props.onRecovery(this.state.error!, true);
                }
            } else {
                // Recovery failed
                this.setState({ isRecovering: false });

                if (this.props.onRecovery) {
                    this.props.onRecovery(this.state.error!, false);
                }
            }
        } catch (recoveryError) {
            console.error('Recovery attempt failed:', recoveryError);
            this.setState({ isRecovering: false });
        }
    };

    /**
     * Reset error boundary
     */
    private resetErrorBoundary = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            isRecovering: false,
            recoveryAttempts: 0
        });
    };

    /**
     * Create error context from ErrorInfo
     */
    private createErrorContext(errorInfo: ErrorInfo): IErrorContext {
        return {
            component: this.getComponentName(errorInfo),
            action: 'render',
            environment: typeof window !== 'undefined' ? 'browser' : 'node',
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            additionalData: {
                componentStack: errorInfo.componentStack,
                errorBoundary: true,
                errorBoundaryName: this.constructor.name
            },
            ...this.props.context
        };
    }

    /**
     * Get component name from ErrorInfo
     */
    private getComponentName(errorInfo: ErrorInfo): string {
        const stack = errorInfo.componentStack;
        if (!stack) return 'Unknown';

        // Extract component name from stack
        const lines = stack.split('\n');
        for (const line of lines) {
            if (line.includes('in') && line.includes('(')) {
                const match = line.match(/in (\w+)/);
                if (match) return match[1];
            }
        }

        return stack.split('\n')[0] || 'Unknown';
    }

    /**
     * Add error to history
     */
    private addToErrorHistory(error: IError, errorInfo: ErrorInfo): void {
        const historyEntry = {
            error,
            timestamp: new Date(),
            componentStack: errorInfo.componentStack || ''
        };

        this.setState(prevState => ({
            errorHistory: [...prevState.errorHistory.slice(-9), historyEntry] // Keep last 10 errors
        }));
    }

    /**
     * Create fallback error if error handling fails
     */
    private createFallbackError(error: Error): IError {
        return {
            id: `fallback_${Date.now()}`,
            message: error.message,
            code: 'FALLBACK_ERROR',
            category: 'unknown' as any,
            severity: 'medium' as any,
            recoverable: false,
            recoveryStrategy: 'manual' as any,
            userMessage: 'An unexpected error occurred',
            suggestedActions: ['Try refreshing the page', 'Contact support if issue persists'],
            timestamp: new Date(),
            metadata: {
                originalError: error.message,
                stack: error.stack
            },
            cause: error,
            context: this.createErrorContext({
                componentStack: '',
                errorBoundary: true,
                errorBoundaryName: this.constructor.name
            } as ErrorInfo),
            toJSON: () => ({
                id: `fallback_${Date.now()}`,
                message: error.message,
                code: 'FALLBACK_ERROR',
                category: 'unknown',
                severity: 'medium',
                recoverable: false,
                recoveryStrategy: 'manual',
                userMessage: 'An unexpected error occurred',
                suggestedActions: ['Try refreshing the page', 'Contact support if issue persists'],
                timestamp: new Date(),
                metadata: {
                    originalError: error.message,
                    stack: error.stack
                },
                cause: error,
                context: this.createErrorContext({
                    componentStack: '',
                    errorBoundary: true,
                    errorBoundaryName: this.constructor.name
                } as ErrorInfo),
                stack: error.stack
            }),
            copy: () => ({ ...this } as IError)
        };
    }

    render(): ReactNode {
        if (this.state.hasError && this.state.error) {
            const FallbackComponent = this.props.fallback || ErrorFallback;

            return (
                <FallbackComponent
                    error={this.state.error}
                    errorInfo={this.state.errorInfo!}
                    resetErrorBoundary={this.resetErrorBoundary}
                    isRecovering={this.state.isRecovering}
                    recoveryAttempts={this.state.recoveryAttempts}
                    maxRecoveryAttempts={this.maxRecoveryAttempts}
                    onRetry={this.attemptRecovery}
                    errorHistory={this.state.errorHistory}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
