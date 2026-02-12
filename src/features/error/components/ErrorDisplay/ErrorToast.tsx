/**
 * Error Toast Component
 * 
 * Toast notification component for displaying error messages
 * with auto-dismiss and positioning options.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { IError, IErrorContext } from '../../../../core/modules/error/types';
import { ErrorSeverity } from '../../../../core/modules/error/types';

interface ErrorToastProps {
    error: IError;
    context?: IErrorContext;
    onDismiss?: () => void;
    autoDismiss?: boolean;
    autoDismissDelay?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    showIcon?: boolean;
    showProgress?: boolean;
    className?: string;
}

/**
 * Error Toast Component
 */
export const ErrorToast: React.FC<ErrorToastProps> = ({
    error,
    context,
    onDismiss,
    autoDismiss = true,
    autoDismissDelay = 5000,
    position = 'top-right',
    showIcon = true,
    showProgress = true,
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(100);

    // Animation and auto-dismiss logic
    useEffect(() => {
        // Enter animation
        const enterTimer = setTimeout(() => {
            setIsVisible(true);
        }, 50);

        // Auto-dismiss logic
        let dismissTimer: NodeJS.Timeout;
        let progressTimer: NodeJS.Timeout;

        if (autoDismiss && autoDismissDelay > 0) {
            const startTime = Date.now();
            
            // Update progress bar
            progressTimer = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, autoDismissDelay - elapsed);
                const progressPercent = (remaining / autoDismissDelay) * 100;
                setProgress(progressPercent);

                if (progressPercent <= 0) {
                    clearInterval(progressTimer);
                }
            }, 50);

            // Auto-dismiss
            dismissTimer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    if (onDismiss) {
                        onDismiss();
                    }
                }, 300); // Wait for exit animation
            }, autoDismissDelay);
        }

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(dismissTimer);
            clearInterval(progressTimer);
        };
    }, [autoDismiss, autoDismissDelay, onDismiss]);

    // Handle dismiss
    const handleDismiss = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => {
            if (onDismiss) {
                onDismiss();
            }
        }, 300);
    }, [onDismiss]);

    // Get toast positioning styles
    const getPositionStyles = useCallback(() => {
        const baseStyles = {
            position: 'fixed',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            pointerEvents: 'none'
        };

        const positionStyles = {
            'top-right': {
                top: '20px',
                right: '20px'
            },
            'top-left': {
                top: '20px',
                left: '20px'
            },
            'bottom-right': {
                bottom: '20px',
                right: '20px'
            },
            'bottom-left': {
                bottom: '20px',
                left: '20px'
            },
            'top-center': {
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)'
            },
            'bottom-center': {
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)'
            }
        };

        return {
            ...baseStyles,
            ...positionStyles[position]
        };
    }, [position]);

    // Get toast item styles
    const getToastItemStyles = useCallback(() => {
        const baseStyles = {
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '400px',
            pointerEvents: 'auto',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            opacity: isVisible ? 1 : 0,
            marginBottom: '8px'
        };

        const severityStyles = {
            [ErrorSeverity.LOW]: {
                backgroundColor: '#e3f2fd',
                border: '1px solid #c5e1fc',
                color: '#1c7431'
            },
            [ErrorSeverity.MEDIUM]: {
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                color: '#856404'
            },
            [ErrorSeverity.HIGH]: {
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c2c4',
                color: '#721c24'
            },
            [ErrorSeverity.CRITICAL]: {
                backgroundColor: '#f5c6cb',
                border: '1px solid #ef4444',
                color: '#dc2626'
            }
        };

        return {
            ...baseStyles,
            ...severityStyles[error.severity]
        };
    }, [error.severity, isVisible]);

    // Get icon based on error category
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

    // Get progress bar styles
    const getProgressBarStyles = useCallback(() => {
        return {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '0 0 8px 8px',
            overflow: 'hidden'
        };
    }, []);

    // Get progress fill styles
    const getProgressFillStyles = useCallback(() => {
        return {
            height: '100%',
            backgroundColor: error.severity === ErrorSeverity.CRITICAL ? '#dc2626' : 
                           error.severity === ErrorSeverity.HIGH ? '#ef4444' :
                           error.severity === ErrorSeverity.MEDIUM ? '#f59e0b' : '#3b82f6',
            transition: 'width 0.05s linear',
            width: `${progress}%`
        };
    }, [error.severity, progress]);

    // Get dismiss button styles
    const getDismissButtonStyles = useCallback(() => {
        return {
            marginLeft: '8px',
            padding: '2px 6px',
            borderRadius: '4px',
            border: 'none',
            background: 'transparent',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: '1',
            opacity: 0.7,
            transition: 'opacity 0.2s'
        };
    }, []);

    return createPortal(
        <div style={getPositionStyles()}>
            <div style={getToastItemStyles()} onClick={handleDismiss}>
                {showIcon && (
                    <span style={{ marginRight: '8px', fontSize: '16px' }}>
                        {getErrorIcon()}
                    </span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                        {error.userMessage}
                    </div>
                    {error.suggestedActions.length > 0 && (
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            {error.suggestedActions[0]}
                        </div>
                    )}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss();
                    }}
                    style={getDismissButtonStyles()}
                    aria-label="Dismiss toast"
                >
                    ×
                </button>
                {showProgress && autoDismiss && (
                    <div style={getProgressBarStyles()}>
                        <div style={getProgressFillStyles()} />
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

/**
 * Error Toast Container Hook
 * 
 * Hook for managing multiple error toasts
 */
export const useErrorToastContainer = () => {
    const [toasts, setToasts] = useState<Array<{
        id: string;
        error: IError;
        context?: IErrorContext;
        timestamp: Date;
    }>>([]);

    const addToast = useCallback((error: IError, context?: IErrorContext) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const toast = {
            id,
            error,
            context,
            timestamp: new Date()
        };

        setToasts(prev => [...prev, toast]);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            removeToast(id);
        }, 10000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    return {
        toasts,
        addToast,
        removeToast,
        clearAllToasts
    };
};

/**
 * Error Toast Container Component
 */
export const ErrorToastContainer: React.FC<{
    toasts: Array<{
        id: string;
        error: IError;
        context?: IErrorContext;
        timestamp: Date;
    }>;
    onRemoveToast: (id: string) => void;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}> = ({ toasts, onRemoveToast, position = 'top-right' }) => {
    const getPositionStyles = useCallback(() => {
        const baseStyles = {
            position: 'fixed',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            pointerEvents: 'none'
        };

        const positionStyles = {
            'top-right': {
                top: '20px',
                right: '20px'
            },
            'top-left': {
                top: '20px',
                left: '20px'
            },
            'bottom-right': {
                bottom: '20px',
                right: '20px'
            },
            'bottom-left': {
                bottom: '20px',
                left: '20px'
            },
            'top-center': {
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)'
            },
            'bottom-center': {
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)'
            }
        };

        return {
            ...baseStyles,
            ...positionStyles[position]
        };
    }, [position]);

    return createPortal(
        <div style={getPositionStyles()}>
            {toasts.map(toast => (
                <ErrorToast
                    key={toast.id}
                    error={toast.error}
                    context={toast.context}
                    onDismiss={() => onRemoveToast(toast.id)}
                    position={position}
                />
            ))}
        </div>,
        document.body
    );
};

export default ErrorToast;
