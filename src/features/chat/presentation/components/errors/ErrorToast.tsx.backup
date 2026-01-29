/**
 * Error Toast Component
 * 
 * This component provides user-friendly error notifications with
 * different severity levels, actions, and auto-dismiss functionality.
 */

import React, { useState, useEffect } from 'react';
import BoxStyled from '@shared/BoxStyled';
import Typography from '@shared/Typography';
import { 
    FiX, 
    FiAlertTriangle, 
    FiInfo, 
    FiCheckCircle, 
    FiAlertCircle,
    FiRefreshCw,
    FiCopy,
    FiExternalLink
} from 'react-icons/fi';

export interface ErrorToastProps {
    id: string;
    title: string;
    message?: string;
    type: 'error' | 'warning' | 'info' | 'success';
    duration?: number;
    persistent?: boolean;
    actions?: Array<{
        label: string;
        action: () => void;
        icon?: React.ReactNode;
        primary?: boolean;
    }>;
    details?: {
        error?: Error;
        context?: any;
        classification?: any;
    };
    onDismiss?: (id: string) => void;
    onAction?: (id: string, action: string) => void;
    showProgress?: boolean;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

interface ErrorToastState {
    isVisible: boolean;
    isLeaving: boolean;
    progress: number;
    hover: boolean;
}

/**
 * Error Toast component with rich functionality
 */
const ErrorToast: React.FC<ErrorToastProps> = ({
    id,
    title,
    message,
    type,
    duration = 5000,
    persistent = false,
    actions = [],
    details,
    onDismiss,
    onAction,
    showProgress = true,
    position = 'top-right'
}) => {
    const [state, setState] = useState<ErrorToastState>({
        isVisible: false,
        isLeaving: false,
        progress: 100,
        hover: false
    });

    // Auto-dismiss timer
    useEffect(() => {
        if (persistent || state.hover) return;

        setState(prev => ({ ...prev, isVisible: true }));

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.max(0, 100 - (elapsed / duration) * 100);
            
            setState(prev => ({ ...prev, progress }));

            if (progress <= 0) {
                clearInterval(interval);
                handleDismiss();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [duration, persistent, state.hover]);

    const handleDismiss = () => {
        setState(prev => ({ ...prev, isLeaving: true }));
        
        setTimeout(() => {
            onDismiss?.(id);
        }, 300);
    };

    const handleAction = (action: () => void, label: string) => {
        action();
        onAction?.(id, label);
        
        // Auto-dismiss on action unless persistent
        if (!persistent) {
            handleDismiss();
        }
    };

    const copyDetails = () => {
        if (details) {
            const detailsText = JSON.stringify(details, null, 2);
            navigator.clipboard.writeText(detailsText);
        }
    };

    const getTypeConfig = () => {
        switch (type) {
            case 'error':
                return {
                    icon: <FiAlertCircle />,
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-900',
                    iconColor: 'text-red-600',
                    progressColor: 'bg-red-500'
                };
            case 'warning':
                return {
                    icon: <FiAlertTriangle />,
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-900',
                    iconColor: 'text-yellow-600',
                    progressColor: 'bg-yellow-500'
                };
            case 'success':
                return {
                    icon: <FiCheckCircle />,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-900',
                    iconColor: 'text-green-600',
                    progressColor: 'bg-green-500'
                };
            case 'info':
            default:
                return {
                    icon: <FiInfo />,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-900',
                    iconColor: 'text-blue-600',
                    progressColor: 'bg-blue-500'
                };
        }
    };

    const getPositionClasses = () => {
        switch (position) {
            case 'top-right':
                return 'top-4 right-4';
            case 'top-left':
                return 'top-4 left-4';
            case 'bottom-right':
                return 'bottom-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            case 'top-center':
                return 'top-4 left-1/2 transform -translate-x-1/2';
            case 'bottom-center':
                return 'bottom-4 left-1/2 transform -translate-x-1/2';
            default:
                return 'top-4 right-4';
        }
    };

    const typeConfig = getTypeConfig();

    if (!state.isVisible && !state.isLeaving) {
        return null;
    }

    return (
        <BoxStyled
            className={`
                fixed z-50 max-w-md w-full shadow-lg rounded-lg border
                ${typeConfig.bgColor} ${typeConfig.borderColor}
                ${getPositionClasses()}
                transition-all duration-300 ease-in-out
                ${state.isLeaving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                ${state.hover ? 'shadow-xl' : ''}
            `}
            onMouseEnter={() => setState(prev => ({ ...prev, hover: true }))}
            onMouseLeave={() => setState(prev => ({ ...prev, hover: false }))}
        >
            {/* Progress Bar */}
            {showProgress && !persistent && !state.hover && (
                <div className=\"absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-lg overflow-hidden\">
                    <div
                        className={`h-full transition-all duration-100 ease-linear ${typeConfig.progressColor}`}
                        style={{ width: `${state.progress}%` }}
                    />
                </div>
            )}

            <div className=\"p-4\">
                {/* Header */}
                <div className=\"flex items-start justify-between mb-2\">
                    <div className=\"flex items-start space-x-3 flex-1\">
                        <div className={`p-1 rounded-full ${typeConfig.iconColor}`}>
                            {typeConfig.icon}
                        </div>
                        <div className=\"flex-1 min-w-0\">
                            <Typography className={`font-medium ${typeConfig.textColor} truncate`}>
                                {title}
                            </Typography>
                            {message && (
                                <Typography className={`text-sm mt-1 ${typeConfig.textColor} opacity-90`}>
                                    {message}
                                </Typography>
                            )}
                        </div>
                    </div>
                    
                    <div className=\"flex items-center space-x-1 ml-2\">
                        {details && (
                            <button
                                onClick={copyDetails}
                                className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${typeConfig.iconColor}`}
                                title=\"Copy error details\"
                            >
                                <FiCopy className=\"text-sm\" />
                            </button>
                        )}
                        
                        <button
                            onClick={handleDismiss}
                            className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${typeConfig.iconColor}`}
                            title=\"Dismiss\"
                        >
                            <FiX className=\"text-sm\" />
                        </button>
                    </div>
                </div>

                {/* Actions */}
                {actions.length > 0 && (
                    <div className=\"flex flex-wrap gap-2 mt-3\">
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => handleAction(action.action, action.label)}
                                className={`
                                    flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium
                                    transition-colors duration-200
                                    ${action.primary
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : `${typeConfig.bgColor} ${typeConfig.textColor} border ${typeConfig.borderColor} hover:opacity-80`
                                    }
                                `}
                            >
                                {action.icon && <span className=\"text-sm\">{action.icon}</span>}
                                <span>{action.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Details Preview */}
                {details && details.error && (
                    <div className=\"mt-3 pt-3 border-t border-gray-200\">
                        <details className=\"group\">
                            <summary className=\"cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800\">
                                Error Details
                            </summary>
                            <div className=\"mt-2 p-2 bg-gray-100 rounded text-xs font-mono text-gray-700 max-h-32 overflow-y-auto\">
                                <div className=\"font-semibold\">{details.error.name}</div>
                                <div className=\"mt-1\">{details.error.message}</div>
                                {details.error.stack && (
                                    <div className=\"mt-2 text-gray-600\">
                                        {details.error.stack.split('\n').slice(0, 3).join('\n')}
                                        {details.error.stack.split('\n').length > 3 && (
                                            <div className=\"text-gray-500 italic\">...and more</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </BoxStyled>
    );
};

export default ErrorToast;
