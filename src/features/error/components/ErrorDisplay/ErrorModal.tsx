/**
 * Error Modal Component
 * 
 * Modal dialog for displaying detailed error information
 * with recovery options and reporting capabilities.
 */

import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { IError, IErrorContext } from '../../../../core/modules/error/types';
import { ErrorSeverity, ErrorRecoveryStrategy } from '../../../../core/modules/error/types';
import { errorHandler, errorLogger } from '../../../../core/modules/error/handlers';

interface ErrorModalProps {
    error: IError;
    context?: IErrorContext;
    isOpen?: boolean;
    onClose?: () => void;
    onRetry?: () => void;
    onReport?: () => void;
    showRetryButton?: boolean;
    showReportButton?: boolean;
    allowDismiss?: boolean;
    className?: string;
}

/**
 * Error Modal Component
 */
export const ErrorModal: React.FC<ErrorModalProps> = ({
    error,
    context,
    isOpen = false,
    onClose,
    onRetry,
    onReport,
    showRetryButton = true,
    showReportButton = true,
    allowDismiss = true
}) => {
    const [isReporting, setIsReporting] = useState(false);

    // Handle modal close
    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    // Handle retry
    const handleRetry = useCallback(() => {
        if (onRetry) {
            onRetry();
        }
    }, [onRetry]);

    // Handle report
    const handleReport = useCallback(async () => {
        setIsReporting(true);
        try {
            await errorHandler.report(error, context);
            if (onReport) {
                onReport();
            }
        } catch (reportError) {
            console.error('Failed to report error:', reportError);
        } finally {
            setIsReporting(false);
        }
    }, [error, context, onReport]);

    // Handle escape key press
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape' && allowDismiss) {
            handleClose();
        }
    }, [handleClose, allowDismiss]);

    // Get modal styles based on severity
    const getModalStyles = useCallback(() => {
        const baseStyles = {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
        };

        const severityStyles = {
            [ErrorSeverity.LOW]: {
                border: '1px solid #3b82f6',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)'
            },
            [ErrorSeverity.MEDIUM]: {
                border: '1px solid #f59e0b',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.15)'
            },
            [ErrorSeverity.HIGH]: {
                border: '1px solid #ef4444',
                boxShadow: '0 4px 20px rgba(239, 68, 68, 0.15)'
            },
            [ErrorSeverity.CRITICAL]: {
                border: '1px solid #dc2626',
                boxShadow: '0 4px 20px rgba(220, 38, 38, 0.15)'
            }
        };

        return {
            ...baseStyles,
            ...severityStyles[error.severity]
        };
    }, [error.severity]);

    // Get modal content styles
    const getModalContentStyles = useCallback(() => {
        return {
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            padding: '24px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        };
    }, []);

    // Get header styles
    const getHeaderStyles = useCallback(() => {
        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '16px',
            borderBottom: '1px solid #e9ecef'
        };
    }, []);

    // Get title styles
    const getTitleStyles = useCallback(() => {
        return {
            fontSize: '18px',
            fontWeight: '600',
            color: '#212529',
            margin: 0
        };
    }, []);

    // Get close button styles
    const getCloseButtonStyles = useCallback(() => {
        return {
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6c757d',
            padding: '0',
            lineHeight: '1',
            transition: 'color 0.2s'
        };
    }, []);

    // Get body styles
    const getBodyStyles = useCallback(() => {
        return {
            fontSize: '16px',
            color: '#495057',
            lineHeight: '1.5'
        };
    }, []);

    // Get footer styles
    const getFooterStyles = useCallback(() => {
        return {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #e9ecef'
        };
    }, []);

    // Get button styles
    const getButtonStyles = useCallback((variant: 'primary' | 'secondary' | 'danger') => {
        const baseStyles = {
            padding: '10px 20px',
            borderRadius: '6px',
            border: '1px solid',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out'
        };

        const variantStyles = {
            primary: {
                backgroundColor: '#007bff',
                borderColor: '#007bff',
                color: 'white'
            },
            secondary: {
                backgroundColor: '#6c757d',
                borderColor: '#6c757d',
                color: 'white'
            },
            danger: {
                backgroundColor: '#dc3545',
                borderColor: '#dc3545',
                color: 'white'
            }
        };

        return {
            ...baseStyles,
            ...variantStyles[variant]
        };
    }, []);

    // Get error icon based on category
    const getErrorIcon = useCallback(() => {
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

        return icons[error.category as keyof typeof icons] || icons.unknown;
    }, [error.category]);

    // Get severity color
    const getSeverityColor = useCallback(() => {
        switch (error.severity) {
            case ErrorSeverity.LOW:
                return '#3b82f6';
            case ErrorSeverity.MEDIUM:
                return '#f59e0b';
            case ErrorSeverity.HIGH:
                return '#ef4444';
            case ErrorSeverity.CRITICAL:
                return '#dc2626';
            default:
                return '#6b7280';
        }
    }, [error.severity]);

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div style={getModalStyles()} onKeyDown={handleKeyDown}>
            <div style={getModalContentStyles()}>
                {/* Header */}
                <div style={getHeaderStyles()}>
                    <h2 style={getTitleStyles()}>
                        <span style={{ marginRight: '12px' }}>
                            {getErrorIcon()}
                        </span>
                        Error Occurred
                    </h2>
                    <button
                        onClick={handleClose}
                        style={getCloseButtonStyles()}
                        aria-label="Close error modal"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div style={getBodyStyles()}>
                    {/* Error Message */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#212529' }}>
                            {error.userMessage}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6c757d' }}>
                            {error.message}
                        </div>
                    </div>

                    {/* Error Details */}
                    <details style={{ marginBottom: '16px' }}>
                        <summary style={{ 
                            cursor: 'pointer', 
                            fontWeight: 'bold', 
                            marginBottom: '8px',
                            color: '#495057' 
                        }}>
                            Error Details
                        </summary>
                        <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            <div><strong>Error ID:</strong> {error.id}</div>
                            <div><strong>Category:</strong> {error.category}</div>
                            <div><strong>Severity:</strong> {error.severity}</div>
                            <div><strong>Code:</strong> {error.code}</div>
                            <div><strong>Timestamp:</strong> {error.timestamp.toLocaleString()}</div>
                            <div><strong>Recoverable:</strong> {error.recoverable ? 'Yes' : 'No'}</div>
                            <div><strong>Strategy:</strong> {error.recoveryStrategy}</div>
                            {error.context && (
                                <div><strong>Component:</strong> {error.context.component || 'Unknown'}</div>
                            )}
                            {error.suggestedActions && error.suggestedActions.length > 0 && (
                                <div><strong>Suggested Actions:</strong></div>
                                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                                    {error.suggestedActions.map((action, index) => (
                                        <li key={index} style={{ marginBottom: '4px' }}>
                                            {action}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div>
                                <strong>Metadata:</strong>
                                <pre style={{ 
                                    fontSize: '10px', 
                                    backgroundColor: '#f8f9fa', 
                                    padding: '8px', 
                                    borderRadius: '4px', 
                                    overflow: 'auto', 
                                    maxHeight: '100px' 
                                }}>
                                    {JSON.stringify(error.metadata, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </details>
                </div>

                {/* Footer */}
                <div style={getFooterStyles()}>
                    {showRetryButton && error.recoverable && (
                        <button
                            onClick={handleRetry}
                            style={getButtonStyles('primary')}
                        >
                            Retry
                        </button>
                    )}
                    {showReportButton && (
                        <button
                            onClick={handleReport}
                            disabled={isReporting}
                            style={getButtonStyles('secondary')}
                        >
                            {isReporting ? 'Reporting...' : 'Report Error'}
                        </button>
                    )}
                    {allowDismiss && (
                        <button
                            onClick={handleClose}
                            style={getButtonStyles('secondary')}
                        >
                            Dismiss
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
