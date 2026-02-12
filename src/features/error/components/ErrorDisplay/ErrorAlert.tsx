/**
 * Error Alert Component
 * 
 * Alert-style error display component for showing error messages
 * with dismissible functionality.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { IError, IErrorContext } from '../../../../core/modules/error/types';
import { ErrorSeverity } from '../../../../core/modules/error/types';

interface ErrorAlertProps {
    error: IError;
    context?: IErrorContext;
    onDismiss?: () => void;
    autoDismiss?: boolean;
    autoDismissDelay?: number;
    showIcon?: boolean;
    variant?: 'default' | 'filled' | 'outlined';
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

/**
 * Error Alert Component
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
    error,
    context,
    onDismiss,
    autoDismiss = false,
    autoDismissDelay = 5000,
    showIcon = true,
    variant = 'default',
    size = 'medium',
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(true);

    // Auto-dismiss functionality
    useEffect(() => {
        if (autoDismiss && autoDismissDelay > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onDismiss) {
                    onDismiss();
                }
            }, autoDismissDelay);

            return () => clearTimeout(timer);
        }

        return () => {};
    }, [autoDismiss, autoDismissDelay, onDismiss]);

    // Handle dismiss
    const handleDismiss = useCallback(() => {
        setIsVisible(false);
        if (onDismiss) {
            onDismiss();
        }
    }, [onDismiss]);

    // Get alert styling based on severity
    const getAlertStyles = useCallback(() => {
        const baseStyles = {
            display: 'flex',
            alignItems: 'center',
            padding: size === 'small' ? '8px 12px' : size === 'large' ? '16px 20px' : '12px 16px',
            borderRadius: '6px',
            marginBottom: '8px',
            border: '1px solid',
            fontSize: size === 'small' ? '14px' : size === 'large' ? '16px' : '15px',
            fontWeight: '500',
            transition: 'all 0.2s ease-in-out',
            cursor: 'pointer',
            ...className
        };

        const severityStyles = {
            [ErrorSeverity.LOW]: {
                backgroundColor: variant === 'filled' ? '#e3f2fd' : '#dbeafe',
                borderColor: variant === 'filled' ? '#c5e1fc' : '#a5d6a7',
                color: '#1c7431'
            },
            [ErrorSeverity.MEDIUM]: {
                backgroundColor: variant === 'filled' ? '#fff3cd' : '#fff8dc',
                borderColor: variant === 'filled' ? '#ffeaa7' : '#ffc107',
                color: '#856404'
            },
            [ErrorSeverity.HIGH]: {
                backgroundColor: variant === 'filled' ? '#f8d7da' : '#f5c6cb',
                borderColor: variant === 'filled' ? '#f5c2c4' : '#ef4444',
                color: '#721c24'
            },
            [ErrorSeverity.CRITICAL]: {
                backgroundColor: variant === 'filled' ? '#f5c6cb' : '#ef4444',
                borderColor: variant === 'filled' ? '#ef4444' : '#dc2626',
                color: '#dc2626'
            }
        };

        return {
            ...baseStyles,
            ...severityStyles[error.severity]
        };
    }, [error.severity, variant, size, className]);

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
            '&:hover': {
                opacity: 1
            }
        };
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div style={getAlertStyles()}>
            {showIcon && (
                <span style={{ marginRight: '8px', fontSize: '18px' }}>
                    {getErrorIcon()}
                </span>
            )}
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                    {error.userMessage}
                </div>
                {error.suggestedActions.length > 0 && (
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                        {error.suggestedActions[0]}
                    </div>
                )}
            </div>
            {(onDismiss || autoDismiss) && (
                <button
                    onClick={handleDismiss}
                    style={getDismissButtonStyles()}
                    aria-label="Dismiss error"
                >
                    ×
                </button>
            )}
        </div>
    );
};

/**
 * Error Alert Hook
 * 
 * Custom hook for managing error alerts
 */
export const useErrorAlert = (
    error: IError,
    options?: {
        autoDismiss?: boolean;
        autoDismissDelay?: number;
        onDismiss?: () => void;
    }
) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isDismissing, setIsDismissing] = useState(false);

    const dismiss = useCallback(() => {
        setIsVisible(false);
        setIsDismissing(true);
        if (options?.onDismiss) {
            options.onDismiss();
        }
    }, [options?.onDismiss]);

    // Auto-dismiss functionality
    useEffect(() => {
        if (options?.autoDismiss && options.autoDismissDelay && options.autoDismissDelay > 0) {
            const timer = setTimeout(() => {
                dismiss();
            }, options.autoDismissDelay);

            return () => clearTimeout(timer);
        }

        return () => {};
    }, [error, options?.autoDismiss, options?.autoDismissDelay, dismiss]);

    const reset = useCallback(() => {
        setIsVisible(true);
        setIsDismissing(false);
    }, []);

    return {
        isVisible,
        isDismissing,
        dismiss,
        reset
    };
};

export default ErrorAlert;
