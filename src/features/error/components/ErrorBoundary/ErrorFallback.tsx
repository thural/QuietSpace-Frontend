/**
 * Error Fallback Component
 * 
 * User-friendly error display component for error boundaries.
 * Provides recovery options and error information display.
 */

import React, { PureComponent, ReactNode } from 'react';
import { IError, IErrorContext } from '../../../../core/modules/error/types';
import { ErrorSeverity, ErrorRecoveryStrategy } from '../../../../core/modules/error/types';

interface ErrorFallbackProps {
    error: IError;
    errorInfo: {
        componentStack: string;
    };
    resetErrorBoundary: () => void;
    isRecovering?: boolean;
    recoveryAttempts?: number;
    maxRecoveryAttempts?: number;
    onRetry?: () => void;
    errorHistory?: Array<{
        error: IError;
        timestamp: Date;
        componentStack: string;
    }>;
}

/**
 * Error Fallback Component
 */
class ErrorFallback extends PureComponent<ErrorFallbackProps> {
    /**
     * Get severity color
     */
    private getSeverityColor(severity: ErrorSeverity): string {
        switch (severity) {
            case ErrorSeverity.LOW:
                return '#3b82f6'; // blue
            case ErrorSeverity.MEDIUM:
                return '#f59e0b'; // amber
            case ErrorSeverity.HIGH:
                return '#ef4444'; // red
            case ErrorSeverity.CRITICAL:
                return '#dc2626'; // dark red
            default:
                return '#6b7280'; // gray
        }
    }

    /**
     * Get recovery strategy text
     */
    private getRecoveryStrategyText(strategy: ErrorRecoveryStrategy): string {
        switch (strategy) {
            case ErrorRecoveryStrategy.IMMEDIATE:
                return 'Can retry immediately';
            case ErrorRecoveryStrategy.DELAYED:
                return 'Will retry after delay';
            case ErrorRecoveryStrategy.MANUAL:
                return 'Manual action required';
            case ErrorRecoveryStrategy.AUTOMATIC:
                return 'Automatic recovery';
            case ErrorRecoveryStrategy.FALLBACK:
                return 'Using fallback';
            case ErrorRecoveryStrategy.NONE:
                return 'Recovery not possible';
            default:
                return 'Unknown recovery';
        }
    }

    /**
     * Format timestamp
     */
    private formatTimestamp(date: Date): string {
        return date.toLocaleTimeString();
    }

    /**
     * Get error icon based on category
     */
    private getErrorIcon(category: string): ReactNode {
        const icons = {
            network: '🌐',
            validation: '⚠️',
            authentication: '🔐',
            authorization: '🚫',
            runtime: '💥',
            dependency: '🔗',
            system: '⚙️',
            database: '🗄️',
            server: '🖥️',
            client: '💻',
            unknown: '❓'
        };

        return icons[category as keyof typeof icons] || icons.unknown;
    }

    /**
     * Render error header
     */
    private renderErrorHeader(): ReactNode {
        const { error } = this.props;
        const severityColor = this.getSeverityColor(error.severity);

        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: severityColor,
                color: 'white',
                borderRadius: '8px 8px 0 0',
                fontSize: '18px',
                fontWeight: 'bold'
            }}>
                <div style={{ marginRight: '12px', fontSize: '24px' }}>
                    {this.getErrorIcon(error.category)}
                </div>
                <div>
                    <div>Error Occurred</div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        {error.category.toUpperCase()} - {error.severity.toUpperCase()}
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Render error message
     */
    private renderErrorMessage(): ReactNode {
        const { error } = this.props;

        return (
            <div style={{
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#495057'
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    {error.userMessage}
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                    {error.message}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '8px' }}>
                    Code: {error.code}
                </div>
            </div>
        );
    }

    /**
     * Render suggested actions
     */
    private renderSuggestedActions(): ReactNode {
        const { error } = this.props;

        if (!error.suggestedActions || error.suggestedActions.length === 0) {
            return null;
        }

        return (
            <div style={{
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: '#e7f3ff',
                border: '1px solid #b3d9ff',
                borderRadius: '8px'
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#0056b3' }}>
                    Suggested Actions:
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#004085' }}>
                    {error.suggestedActions.map((action, index) => (
                        <li key={index} style={{ marginBottom: '4px' }}>
                            {action}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    /**
     * Render recovery information
     */
    private renderRecoveryInfo(): ReactNode {
        const { error, isRecovering, recoveryAttempts, maxRecoveryAttempts } = this.props;

        return (
            <div style={{
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px'
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#856404' }}>
                    Recovery Information:
                </div>
                <div style={{ fontSize: '14px', color: '#856404' }}>
                    <div>Strategy: {this.getRecoveryStrategyText(error.recoveryStrategy)}</div>
                    <div>Recoverable: {error.recoverable ? 'Yes' : 'No'}</div>
                    {isRecovering && (
                        <div style={{ color: '#d63384' }}>
                            Attempting recovery... (Attempt {recoveryAttempts} of {maxRecoveryAttempts})
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /**
     * Render error details
     */
    private renderErrorDetails(): ReactNode {
        const { error, errorInfo } = this.props;

        return (
            <details style={{
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px'
            }}>
                <summary style={{ fontWeight: 'bold', cursor: 'pointer', marginBottom: '8px', color: '#495057' }}>
                    Error Details
                </summary>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                    <div><strong>Error ID:</strong> {error.id}</div>
                    <div><strong>Timestamp:</strong> {this.formatTimestamp(error.timestamp)}</div>
                    <div><strong>Category:</strong> {error.category}</div>
                    <div><strong>Severity:</strong> {error.severity}</div>
                    <div><strong>Code:</strong> {error.code}</div>
                    {error.context && (
                        <div><strong>Component:</strong> {error.context.component || 'Unknown'}</div>
                    )}
                    {errorInfo.componentStack && (
                        <div>
                            <strong>Component Stack:</strong>
                            <pre style={{
                                fontSize: '10px',
                                backgroundColor: '#f8f9fa',
                                padding: '8px',
                                borderRadius: '4px',
                                overflow: 'auto',
                                maxHeight: '100px'
                            }}>
                                {errorInfo.componentStack}
                            </pre>
                        </div>
                    )}
                </div>
            </details>
        );
    }

    /**
     * Render error history
     */
    private renderErrorHistory(): ReactNode {
        const { errorHistory } = this.props;

        if (!errorHistory || errorHistory.length === 0) {
            return null;
        }

        return (
            <details style={{
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px'
            }}>
                <summary style={{ fontWeight: bold, cursor: 'pointer', marginBottom: '8px', color: '#495057' }}>
                    Error History ({errorHistory.length} errors)
                </summary>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                    {errorHistory.map((entry, index) => (
                        <div key={index} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #e9ecef' }}>
                            <div><strong>{this.formatTimestamp(entry.timestamp)}</strong></div>
                            <div><strong>{entry.error.category}</strong> - {entry.error.userMessage}</div>
                            <div style={{ fontSize: '11px', color: '#856404' }}>
                                {entry.error.code}
                            </div>
                        </div>
                    ))}
                </div>
            </details>
        );
    }

    /**
     * Render action buttons
     */
    private renderActionButtons(): ReactNode {
        const { 
            error, 
            isRecovering, 
            recoveryAttempts, 
            maxRecoveryAttempts,
            onRetry,
            resetErrorBoundary 
        } = this.props;

        const canRetry = error.recoverable && !isRecovering && recoveryAttempts < maxRecoveryAttempts;

        return (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                {canRetry && (
                    <button
                        onClick={onRetry}
                        disabled={isRecovering}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: isRecovering ? 'not-allowed' : 'pointer',
                            opacity: isRecovering ? 0.6 : 1
                        }}
                    >
                        {isRecovering ? 'Retrying...' : 'Retry'}
                    </button>
                )}
                <button
                    onClick={resetErrorBoundary}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    Reset
                </button>
            </div>
        );
    }

    /**
     * Render component
     */
    render(): ReactNode {
        return (
            <div style={{
                padding: '20px',
                maxWidth: '600px',
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                {this.renderErrorHeader()}
                {this.renderErrorMessage()}
                {this.renderSuggestedActions()}
                {this.renderRecoveryInfo()}
                {this.renderErrorDetails()}
                {this.renderErrorHistory()}
                {this.renderActionButtons()}
            </div>
        );
    }
}

export default ErrorFallback;
