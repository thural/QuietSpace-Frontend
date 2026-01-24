/**
 * Enhanced Error Boundary Component
 * 
 * This component provides advanced error boundary functionality with
 * error classification, recovery mechanisms, and comprehensive error reporting.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import BoxStyled from '@shared/BoxStyled';
import Typography from '@shared/Typography';
import { 
    FiAlertTriangle, 
    FiRefreshCw, 
    FiX, 
    FiCopy, 
    FiSend,
    FiInfo,
    FiAlertCircle,
    FiCheckCircle
} from 'react-icons/fi';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    errorClassification: ErrorClassification | null;
    recoveryAttempts: number;
    isRecovering: boolean;
    lastRecoveryTime: Date | null;
    errorHistory: ErrorRecord[];
}

interface ErrorRecord {
    timestamp: Date;
    error: Error;
    errorInfo: ErrorInfo;
    classification: ErrorClassification;
    recovered: boolean;
}

interface ErrorClassification {
    type: 'network' | 'validation' | 'permission' | 'runtime' | 'dependency' | 'unknown';
    severity: 'low' | 'medium' | 'high' | 'critical';
    recoverable: boolean;
    userMessage: string;
    suggestedActions: string[];
    retryStrategy: 'immediate' | 'delayed' | 'manual' | 'none';
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo, classification: ErrorClassification) => void;
    onRecovery?: (success: boolean) => void;
    maxRetries?: number;
    retryDelay?: number;
    enableErrorReporting?: boolean;
    showErrorDetails?: boolean;
    customRecoveryActions?: Array<{
        label: string;
        action: () => Promise<boolean>;
        icon?: ReactNode;
    }>;
}

/**
 * Enhanced Error Boundary component with advanced error handling capabilities
 */
class ErrorBoundaryEnhanced extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    private retryTimeouts: NodeJS.Timeout[] = [];

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorClassification: null,
            recoveryAttempts: 0,
            isRecovering: false,
            lastRecoveryTime: null,
            errorHistory: []
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const classification = this.classifyError(error, errorInfo);
        
        this.setState({
            errorInfo,
            errorClassification: classification,
            errorHistory: [
                ...this.state.errorHistory,
                {
                    timestamp: new Date(),
                    error,
                    errorInfo,
                    classification,
                    recovered: false
                }
            ].slice(-10) // Keep last 10 errors
        });

        // Report error if enabled
        if (this.props.enableErrorReporting) {
            this.reportError(error, errorInfo, classification);
        }

        // Call error callback
        this.props.onError?.(error, errorInfo, classification);
    }

    /**
     * Classify the error based on its characteristics
     */
    private classifyError(error: Error, errorInfo: ErrorInfo): ErrorClassification {
        const errorMessage = error.message.toLowerCase();
        const errorStack = error.stack?.toLowerCase() || '';

        // Network errors
        if (errorMessage.includes('network') || errorMessage.includes('fetch') || 
            errorMessage.includes('connection') || errorMessage.includes('timeout')) {
            return {
                type: 'network',
                severity: 'medium',
                recoverable: true,
                userMessage: 'Network connection issue detected',
                suggestedActions: ['Check your internet connection', 'Try refreshing the page', 'Contact support if issue persists'],
                retryStrategy: 'delayed'
            };
        }

        // Validation errors
        if (errorMessage.includes('validation') || errorMessage.includes('invalid') || 
            errorMessage.includes('required') || errorMessage.includes('format')) {
            return {
                type: 'validation',
                severity: 'low',
                recoverable: true,
                userMessage: 'Invalid data provided',
                suggestedActions: ['Check your input data', 'Ensure all required fields are filled', 'Follow the specified format'],
                retryStrategy: 'manual'
            };
        }

        // Permission errors
        if (errorMessage.includes('permission') || errorMessage.includes('unauthorized') || 
            errorMessage.includes('forbidden') || errorMessage.includes('access denied')) {
            return {
                type: 'permission',
                severity: 'high',
                recoverable: false,
                userMessage: 'Permission denied',
                suggestedActions: ['Check your user permissions', 'Contact your administrator', 'Try logging in again'],
                retryStrategy: 'none'
            };
        }

        // Dependency errors
        if (errorStack.includes('chunkloaderror') || errorStack.includes('loading chunk') || 
            errorMessage.includes('module not found') || errorMessage.includes('cannot read property')) {
            return {
                type: 'dependency',
                severity: 'high',
                recoverable: true,
                userMessage: 'Application component failed to load',
                suggestedActions: ['Refresh the page', 'Clear browser cache', 'Check for updates'],
                retryStrategy: 'immediate'
            };
        }

        // Runtime errors
        if (errorInfo.componentStack || errorMessage.includes('react') || 
            errorMessage.includes('render') || errorMessage.includes('component')) {
            return {
                type: 'runtime',
                severity: 'medium',
                recoverable: true,
                userMessage: 'Application encountered an unexpected error',
                suggestedActions: ['Refresh the page', 'Try the action again', 'Report this issue if it persists'],
                retryStrategy: 'delayed'
            };
        }

        // Unknown errors
        return {
            type: 'unknown',
            severity: 'medium',
            recoverable: true,
            userMessage: 'An unexpected error occurred',
            suggestedActions: ['Refresh the page', 'Try again later', 'Contact support if issue persists'],
            retryStrategy: 'manual'
        };
    }

    /**
     * Report error to monitoring service
     */
    private reportError = async (error: Error, errorInfo: ErrorInfo, classification: ErrorClassification) => {
        try {
            const errorReport = {
                timestamp: new Date().toISOString(),
                error: {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                },
                errorInfo: {
                    componentStack: errorInfo.componentStack
                },
                classification,
                userAgent: navigator.userAgent,
                url: window.location.href,
                userId: this.getUserId()
            };

            // Send to error reporting service
            await fetch('/api/errors/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(errorReport)
            });
        } catch (reportingError) {
            console.warn('Failed to report error:', reportingError);
        }
    };

    /**
     * Get current user ID for error reporting
     */
    private getUserId = (): string => {
        // Try to get user ID from various sources
        return (window as any).currentUser?.id || 
               localStorage.getItem('userId') || 
               'anonymous';
    };

    /**
     * Attempt to recover from the error
     */
    private attemptRecovery = async (strategy: 'immediate' | 'delayed' | 'manual' = 'manual') => {
        const { maxRetries = 3, retryDelay = 1000 } = this.props;
        const { recoveryAttempts } = this.state;

        if (recoveryAttempts >= maxRetries) {
            this.setState({ isRecovering: false });
            return;
        }

        this.setState({ isRecovering: true });

        try {
            if (strategy === 'delayed') {
                await new Promise(resolve => {
                    const timeout = setTimeout(resolve, retryDelay * Math.pow(2, recoveryAttempts));
                    this.retryTimeouts.push(timeout);
                });
            }

            // Clear error state
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
                errorClassification: null,
                recoveryAttempts: recoveryAttempts + 1,
                isRecovering: false,
                lastRecoveryTime: new Date()
            });

            // Mark last error as recovered
            const updatedHistory = [...this.state.errorHistory];
            if (updatedHistory.length > 0) {
                updatedHistory[updatedHistory.length - 1].recovered = true;
                this.setState({ errorHistory: updatedHistory });
            }

            this.props.onRecovery?.(true);

        } catch (recoveryError) {
            this.setState({
                isRecovering: false,
                recoveryAttempts: recoveryAttempts + 1
            });
            this.props.onRecovery?.(false);
        }
    };

    /**
     * Copy error details to clipboard
     */
    private copyErrorDetails = () => {
        const { error, errorInfo, errorClassification } = this.state;
        
        const errorDetails = {
            timestamp: new Date().toISOString(),
            error: {
                message: error?.message,
                stack: error?.stack,
                name: error?.name
            },
            errorInfo: {
                componentStack: errorInfo?.componentStack
            },
            classification: errorClassification,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
    };

    /**
     * Send error report manually
     */
    private sendErrorReport = async () => {
        const { error, errorInfo, errorClassification } = this.state;
        
        if (error && errorInfo && errorClassification) {
            await this.reportError(error, errorInfo, errorClassification);
            alert('Error report sent successfully');
        }
    };

    /**
     * Execute custom recovery action
     */
    private executeCustomRecovery = async (action: () => Promise<boolean>) => {
        this.setState({ isRecovering: true });
        
        try {
            const success = await action();
            if (success) {
                this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null,
                    errorClassification: null,
                    isRecovering: false
                });
                this.props.onRecovery?.(true);
            } else {
                this.setState({ isRecovering: false });
            }
        } catch (error) {
            this.setState({ isRecovering: false });
        }
    };

    componentWillUnmount() {
        // Clear any pending retry timeouts
        this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    }

    render() {
        const { children, fallback, customRecoveryActions = [] } = this.props;
        const { 
            hasError, 
            error, 
            errorInfo, 
            errorClassification, 
            recoveryAttempts, 
            isRecovering,
            lastRecoveryTime,
            errorHistory
        } = this.state;

        if (!hasError) {
            return children;
        }

        // Use custom fallback if provided
        if (fallback) {
            return fallback;
        }

        const getSeverityColor = (severity: string) => {
            switch (severity) {
                case 'low': return 'text-blue-600 bg-blue-50';
                case 'medium': return 'text-yellow-600 bg-yellow-50';
                case 'high': return 'text-orange-600 bg-orange-50';
                case 'critical': return 'text-red-600 bg-red-50';
                default: return 'text-gray-600 bg-gray-50';
            }
        };

        const getTypeIcon = (type: string) => {
            switch (type) {
                case 'network': return <FiAlertCircle />;
                case 'validation': return <FiInfo />;
                case 'permission': return <FiAlertTriangle />;
                case 'dependency': return <FiAlertCircle />;
                case 'runtime': return <FiAlertTriangle />;
                default: return <FiAlertCircle />;
            }
        };

        return (
            <BoxStyled className=\"min-h-screen bg-gray-50 p-4\">
                <div className=\"max-w-4xl mx-auto\">
                    {/* Error Header */}
                    <div className=\"bg-white rounded-lg shadow-lg p-6 mb-6\">
                        <div className=\"flex items-center justify-between mb-4\">
                            <div className=\"flex items-center space-x-3\">
                                <div className={`p-3 rounded-full ${getSeverityColor(errorClassification?.severity || 'medium')}`}>
                                    {errorClassification && getTypeIcon(errorClassification.type)}
                                </div>
                                <div>
                                    <Typography type=\"h3\" className=\"text-gray-900\">
                                        Something went wrong
                                    </Typography>
                                    <Typography className=\"text-gray-600\">
                                        {errorClassification?.userMessage || 'An unexpected error occurred'}
                                    </Typography>
                                </div>
                            </div>
                            
                            <div className=\"flex items-center space-x-2\">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(errorClassification?.severity || 'medium')}`}>
                                    {errorClassification?.severity.toUpperCase()}
                                </span>
                                <span className=\"px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700\">
                                    {errorClassification?.type.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Error Details */}
                        {error && (
                            <div className=\"bg-gray-50 rounded-lg p-4 mb-4\">
                                <Typography className=\"font-medium text-gray-900 mb-2\">Error Details:</Typography>
                                <Typography className=\"text-sm text-gray-600 font-mono bg-white p-2 rounded border\">
                                    {error.message}
                                </Typography>
                                {errorClassification?.recoverable && (
                                    <div className=\"mt-3 flex items-center space-x-2 text-green-600\">
                                        <FiCheckCircle />
                                        <Typography className=\"text-sm\">This error is recoverable</Typography>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Suggested Actions */}
                        {errorClassification?.suggestedActions && (
                            <div className=\"mb-4\">
                                <Typography className=\"font-medium text-gray-900 mb-2\">Suggested Actions:</Typography>
                                <ul className=\"list-disc list-inside space-y-1 text-sm text-gray-600\">
                                    {errorClassification.suggestedActions.map((action, index) => (
                                        <li key={index}>{action}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Recovery Actions */}
                        <div className=\"flex flex-wrap gap-3 mb-4\">
                            {errorClassification?.recoverable && (
                                <button
                                    onClick={() => this.attemptRecovery(errorClassification?.retryStrategy)}
                                    disabled={isRecovering || recoveryAttempts >= (this.props.maxRetries || 3)}
                                    className=\"flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed\"
                                >
                                    <FiRefreshCw className={isRecovering ? 'animate-spin' : ''} />
                                    <span>
                                        {isRecovering ? 'Recovering...' : 'Try Recovery'}
                                    </span>
                                </button>
                            )}

                            {customRecoveryActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => this.executeCustomRecovery(action.action)}
                                    disabled={isRecovering}
                                    className=\"flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed\"
                                >
                                    {action.icon}
                                    <span>{action.label}</span>
                                </button>
                            ))}

                            <button
                                onClick={this.copyErrorDetails}
                                className=\"flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700\"
                            >
                                <FiCopy />
                                <span>Copy Details</span>
                            </button>

                            {this.props.enableErrorReporting && (
                                <button
                                    onClick={this.sendErrorReport}
                                    className=\"flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700\"
                                >
                                    <FiSend />
                                    <span>Report Issue</span>
                                </button>
                            )}
                        </div>

                        {/* Recovery Status */}
                        {(recoveryAttempts > 0 || lastRecoveryTime) && (
                            <div className=\"bg-blue-50 rounded-lg p-3 text-sm\">
                                <div className=\"flex items-center justify-between\">
                                    <span className=\"text-blue-800\">
                                        Recovery attempts: {recoveryAttempts}/{this.props.maxRetries || 3}
                                    </span>
                                    {lastRecoveryTime && (
                                        <span className=\"text-blue-600\">
                                            Last attempt: {lastRecoveryTime.toLocaleTimeString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error History */}
                    {errorHistory.length > 1 && (
                        <div className=\"bg-white rounded-lg shadow-lg p-6\">
                            <Typography type=\"h4\" className=\"mb-4\">Recent Errors</Typography>
                            <div className=\"space-y-3\">
                                {errorHistory.slice(-5).reverse().map((record, index) => (
                                    <div key={index} className=\"flex items-center justify-between p-3 bg-gray-50 rounded-lg\">
                                        <div className=\"flex items-center space-x-3\">
                                            <div className={`w-2 h-2 rounded-full ${
                                                record.recovered ? 'bg-green-500' : 'bg-red-500'
                                            }`} />
                                            <div>
                                                <Typography className=\"text-sm font-medium\">
                                                    {record.classification.type.toUpperCase()}
                                                </Typography>
                                                <Typography className=\"text-xs text-gray-500\">
                                                    {record.timestamp.toLocaleString()}
                                                </Typography>
                                            </div>
                                        </div>
                                        <div className=\"flex items-center space-x-2\">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                record.recovered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {record.recovered ? 'Recovered' : 'Failed'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </BoxStyled>
        );
    }
}

export default ErrorBoundaryEnhanced;
