/**
 * Error Communication Manager
 * 
 * This component provides better error communication to users with intelligent
 * error messaging, user guidance, and contextual error information.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
    FiAlertTriangle, 
    FiInfo, 
    FiCheckCircle, 
    FiX, 
    FiRefreshCw, 
    FiExternalLink,
    FiMessageSquare,
    FiHelpCircle,
    FiShield,
    FiZap,
    FiClock,
    FiUser,
    FiSettings,
    FiMail,
    FiPhone,
    FiChevronDown,
    FiChevronUp,
    FiCopy
} from 'react-icons/fi';

export interface ErrorCommunicationConfig {
    enableUserFriendlyMessages: boolean;
    enableContextualHelp: boolean;
    enableMultiLanguage: boolean;
    enableAccessibility: boolean;
    enableErrorEscalation: boolean;
    enableFeedbackCollection: boolean;
    enableNotificationPreferences: boolean;
    defaultMessageTimeout: number;
    maxVisibleErrors: number;
    enableErrorHistory: boolean;
    enableErrorSharing: boolean;
    enableLiveChat: boolean;
    enableAutoTranslation: boolean;
}

export interface ErrorMessage {
    id: string;
    type: 'error' | 'warning' | 'info' | 'success';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    technicalDetails?: string;
    userAction?: string;
    suggestedActions: ErrorAction[];
    contextualHelp?: ContextualHelp;
    timestamp: Date;
    acknowledged: boolean;
    dismissed: boolean;
    category: string;
    component?: string;
    userId?: string;
    sessionId?: string;
    metadata: Record<string, any>;
}

export interface ErrorAction {
    id: string;
    label: string;
    description: string;
    action: () => Promise<boolean> | boolean;
    type: 'primary' | 'secondary' | 'tertiary';
    icon?: React.ReactNode;
    timeout?: number;
    requiresConfirmation?: boolean;
    confirmationMessage?: string;
}

export interface ContextualHelp {
    title: string;
    description: string;
    steps?: string[];
    resources?: HelpResource[];
    faq?: FAQ[];
    videoTutorial?: string;
    documentation?: string;
    relatedErrors?: string[];
}

export interface HelpResource {
    title: string;
    url: string;
    type: 'documentation' | 'video' | 'tutorial' | 'faq' | 'forum' | 'support';
    description?: string;
}

export interface FAQ {
    question: string;
    answer: string;
    category?: string;
    helpful?: number;
}

export interface ErrorFeedback {
    errorId: string;
    userId?: string;
    rating: 1 | 2 | 3 | 4 | 5;
    helpful: boolean;
    comment?: string;
    contactSupport: boolean;
    contactInfo?: {
        email?: string;
        phone?: string;
        preferredContact: 'email' | 'phone';
    };
    timestamp: Date;
}

export interface UserPreferences {
    language: string;
    notificationLevel: 'all' | 'warnings' | 'errors' | 'critical';
    autoDismiss: boolean;
    autoDismissTime: number;
    showTechnicalDetails: boolean;
    enableSound: boolean;
    enableVibration: boolean;
    enableDesktopNotifications: boolean;
    theme: 'light' | 'dark' | 'auto';
}

export interface ErrorEscalation {
    errorId: string;
    level: 'support' | 'engineering' | 'management';
    reason: string;
    context: Record<string, any>;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    assignedTo?: string;
    estimatedResolution?: Date;
    communications: EscalationCommunication[];
}

export interface EscalationCommunication {
    timestamp: Date;
    from: string;
    to: string;
    message: string;
    type: 'update' | 'request' | 'resolution';
}

interface ErrorCommunicationContextType {
    config: ErrorCommunicationConfig;
    messages: ErrorMessage[];
    userPreferences: UserPreferences;
    feedback: ErrorFeedback[];
    escalations: ErrorEscalation[];
    isCommunicating: boolean;
    showError: (error: Omit<ErrorMessage, 'id' | 'timestamp' | 'acknowledged' | 'dismissed'>) => string;
    hideMessage: (messageId: string) => void;
    acknowledgeMessage: (messageId: string) => void;
    dismissMessage: (messageId: string) => void;
    executeAction: (messageId: string, actionId: string) => Promise<boolean>;
    submitFeedback: (feedback: Omit<ErrorFeedback, 'timestamp'>) => void;
    escalateError: (errorId: string, level: ErrorEscalation['level'], reason: string) => void;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
    getErrorHistory: (userId?: string) => ErrorMessage[];
    clearAllMessages: () => void;
    translateMessage: (messageId: string, language: string) => Promise<ErrorMessage>;
}

const ErrorCommunicationContext = createContext<ErrorCommunicationContextType | null>(null);

// Error Communication Provider
interface ErrorCommunicationProviderProps {
    children: React.ReactNode;
    config?: Partial<ErrorCommunicationConfig>;
}

export const ErrorCommunicationProvider: React.FC<ErrorCommunicationProviderProps> = ({ 
    children, 
    config: userConfig = {} 
}) => {
    const [config, setConfig] = useState<ErrorCommunicationConfig>({
        enableUserFriendlyMessages: true,
        enableContextualHelp: true,
        enableMultiLanguage: true,
        enableAccessibility: true,
        enableErrorEscalation: true,
        enableFeedbackCollection: true,
        enableNotificationPreferences: true,
        defaultMessageTimeout: 5000,
        maxVisibleErrors: 5,
        enableErrorHistory: true,
        enableErrorSharing: true,
        enableLiveChat: false,
        enableAutoTranslation: false,
        ...userConfig
    });

    const [messages, setMessages] = useState<ErrorMessage[]>([]);
    const [userPreferences, setUserPreferences] = useState<UserPreferences>({
        language: 'en',
        notificationLevel: 'warnings',
        autoDismiss: false,
        autoDismissTime: 5000,
        showTechnicalDetails: false,
        enableSound: true,
        enableVibration: false,
        enableDesktopNotifications: true,
        theme: 'auto'
    });

    const [feedback, setFeedback] = useState<ErrorFeedback[]>([]);
    const [escalations, setEscalations] = useState<ErrorEscalation[]>([]);
    const [isCommunicating, setIsCommunicating] = useState(false);

    const messageTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

    // Built-in contextual help
    const contextualHelpDatabase: Record<string, ContextualHelp> = {
        'network-error': {
            title: 'Network Connection Error',
            description: 'There seems to be a problem with your internet connection.',
            steps: [
                'Check your internet connection',
                'Try refreshing the page',
                'Contact your network administrator if the problem persists'
            ],
            resources: [
                {
                    title: 'Network Troubleshooting Guide',
                    url: '/help/network-troubleshooting',
                    type: 'documentation',
                    description: 'Step-by-step guide to resolve network issues'
                },
                {
                    title: 'Connection Status Video',
                    url: '/videos/network-status',
                    type: 'video',
                    description: 'Video tutorial on checking connection status'
                }
            ],
            faq: [
                {
                    question: 'Why am I seeing network errors?',
                    answer: 'Network errors occur when your device cannot communicate with our servers.'
                },
                {
                    question: 'How do I fix network errors?',
                    answer: 'Check your internet connection, refresh the page, or try a different network.'
                }
            ]
        },
        'authentication-error': {
            title: 'Authentication Error',
            description: 'There was a problem verifying your identity.',
            steps: [
                'Check your username and password',
                'Clear your browser cache and cookies',
                'Try logging in again',
                'Contact support if the problem continues'
            ],
            resources: [
                {
                    title: 'Login Troubleshooting',
                    url: '/help/login-issues',
                    type: 'documentation',
                    description: 'Common login problems and solutions'
                }
            ],
            faq: [
                {
                    question: 'Why can\'t I log in?',
                    answer: 'This could be due to incorrect credentials, expired session, or account issues.'
                }
            ]
        },
        'permission-error': {
            title: 'Permission Error',
            description: 'You don\'t have permission to perform this action.',
            steps: [
                'Check if you\'re logged in with the correct account',
                'Contact your administrator for access',
                'Request the necessary permissions'
            ],
            resources: [
                {
                    title: 'Permission Guide',
                    url: '/help/permissions',
                    type: 'documentation',
                    description: 'Understanding permissions and access levels'
                }
            ],
            faq: [
                {
                    question: 'How do I get permission?',
                    answer: 'Contact your administrator or request access through the proper channels.'
                }
            ]
        }
    };

    // Generate user-friendly error message
    const generateUserFriendlyMessage = useCallback((error: any): string => {
        if (!config.enableUserFriendlyMessages) {
            return error.message || 'An error occurred';
        }

        const errorType = error.type || error.name || 'unknown';
        const errorMessage = error.message || '';

        // Map common errors to user-friendly messages
        const errorMappings: Record<string, string> = {
            'network': 'We\'re having trouble connecting to our servers. Please check your internet connection.',
            'timeout': 'The request took too long to complete. Please try again.',
            'unauthorized': 'You need to log in to access this feature.',
            'forbidden': 'You don\'t have permission to perform this action.',
            'not-found': 'The requested resource was not found.',
            'server-error': 'Something went wrong on our end. We\'re working on it.',
            'validation': 'Please check your input and try again.',
            'rate-limit': 'You\'ve made too many requests. Please wait a moment and try again.',
            'maintenance': 'We\'re currently performing maintenance. Please try again later.'
        };

        // Check for specific error patterns
        if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('connection')) {
            return errorMappings['network'];
        }
        if (errorMessage.toLowerCase().includes('timeout')) {
            return errorMappings['timeout'];
        }
        if (errorType.toLowerCase().includes('unauthorized') || errorMessage.toLowerCase().includes('401')) {
            return errorMappings['unauthorized'];
        }
        if (errorType.toLowerCase().includes('forbidden') || errorMessage.toLowerCase().includes('403')) {
            return errorMappings['forbidden'];
        }
        if (errorType.toLowerCase().includes('not-found') || errorMessage.toLowerCase().includes('404')) {
            return errorMappings['not-found'];
        }
        if (errorType.toLowerCase().includes('server') || errorMessage.toLowerCase().includes('500')) {
            return errorMappings['server-error'];
        }
        if (errorType.toLowerCase().includes('validation') || errorMessage.toLowerCase().includes('400')) {
            return errorMappings['validation'];
        }
        if (errorMessage.toLowerCase().includes('rate limit') || errorMessage.toLowerCase().includes('429')) {
            return errorMappings['rate-limit'];
        }
        if (errorMessage.toLowerCase().includes('maintenance') || errorMessage.toLowerCase().includes('503')) {
            return errorMappings['maintenance'];
        }

        // Default message
        return 'Something unexpected happened. Please try again or contact support if the problem continues.';
    }, [config.enableUserFriendlyMessages]);

    // Get contextual help
    const getContextualHelp = useCallback((errorType: string, category: string): ContextualHelp | undefined => {
        if (!config.enableContextualHelp) return undefined;

        // Try to find help by error type
        let help = contextualHelpDatabase[errorType];
        
        // If not found, try by category
        if (!help) {
            help = contextualHelpDatabase[category];
        }

        return help;
    }, [config.enableContextualHelp]);

    // Show error message
    const showError = useCallback((error: Omit<ErrorMessage, 'id' | 'timestamp' | 'acknowledged' | 'dismissed'>): string => {
        const messageId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const userMessage = generateUserFriendlyMessage(error);
        const contextualHelp = getContextualHelp(error.type || 'unknown', error.category);

        const message: ErrorMessage = {
            id: messageId,
            ...error,
            message: userMessage,
            contextualHelp,
            timestamp: new Date(),
            acknowledged: false,
            dismissed: false
        };

        // Filter messages based on user preferences
        const shouldShow = shouldShowMessage(message);
        if (!shouldShow) return messageId;

        setMessages(prev => {
            const newMessages = [message, ...prev].slice(0, config.maxVisibleErrors);
            return newMessages;
        });

        // Auto-dismiss if enabled
        if (userPreferences.autoDismiss && message.severity !== 'critical') {
            const timeout = setTimeout(() => {
                dismissMessage(messageId);
            }, userPreferences.autoDismissTime);
            
            messageTimeoutsRef.current.set(messageId, timeout);
        }

        // Show desktop notification if enabled
        if (userPreferences.enableDesktopNotifications && 'Notification' in window) {
            showDesktopNotification(message);
        }

        // Play sound if enabled
        if (userPreferences.enableSound) {
            playNotificationSound(message.type);
        }

        // Vibrate if enabled
        if (userPreferences.enableVibration && 'vibrate' in navigator) {
            vibrateForNotification(message.type);
        }

        return messageId;
    }, [generateUserFriendlyMessage, getContextualHelp, config.maxVisibleErrors, userPreferences]);

    // Check if message should be shown based on preferences
    const shouldShowMessage = useCallback((message: ErrorMessage): boolean => {
        switch (userPreferences.notificationLevel) {
            case 'critical':
                return message.severity === 'critical';
            case 'errors':
                return message.severity === 'critical' || message.severity === 'high';
            case 'warnings':
                return message.severity === 'critical' || message.severity === 'high' || message.severity === 'medium';
            case 'all':
            default:
                return true;
        }
    }, [userPreferences.notificationLevel]);

    // Show desktop notification
    const showDesktopNotification = useCallback((message: ErrorMessage) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(message.title, {
                body: message.message,
                icon: '/notification-icon.png',
                tag: message.id,
                requireInteraction: message.severity === 'critical'
            });

            notification.onclick = () => {
                acknowledgeMessage(message.id);
                window.focus();
            };
        }
    }, []);

    // Play notification sound
    const playNotificationSound = useCallback((type: string) => {
        const audio = new Audio();
        
        const soundMap = {
            error: '/sounds/error-notification.mp3',
            warning: '/sounds/warning-notification.mp3',
            info: '/sounds/info-notification.mp3',
            success: '/sounds/success-notification.mp3'
        };

        const soundFile = soundMap[type as keyof typeof soundMap] || soundMap.info;
        
        audio.src = soundFile;
        audio.volume = 0.3;
        audio.play().catch(error => {
            console.warn('Failed to play notification sound:', error);
        });
    }, []);

    // Vibrate for notification
    const vibrateForNotification = useCallback((type: string) => {
        const vibrationPatterns = {
            error: [200, 100, 200],
            warning: [100, 50, 100],
            info: [50],
            success: [100]
        };

        const pattern = vibrationPatterns[type as keyof typeof vibrationPatterns] || [50];
        
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }, []);

    // Hide message
    const hideMessage = useCallback((messageId: string) => {
        setMessages(prev => prev.filter(m => m.id !== messageId));
        
        // Clear timeout
        if (messageTimeoutsRef.current.has(messageId)) {
            clearTimeout(messageTimeoutsRef.current.get(messageId));
            messageTimeoutsRef.current.delete(messageId);
        }
    }, []);

    // Acknowledge message
    const acknowledgeMessage = useCallback((messageId: string) => {
        setMessages(prev => prev.map(m => 
            m.id === messageId ? { ...m, acknowledged: true } : m
        ));
    }, []);

    // Dismiss message
    const dismissMessage = useCallback((messageId: string) => {
        setMessages(prev => prev.map(m => 
            m.id === messageId ? { ...m, dismissed: true } : m
        ));

        // Remove after animation
        setTimeout(() => {
            hideMessage(messageId);
        }, 300);
    }, [hideMessage]);

    // Execute action
    const executeAction = useCallback(async (messageId: string, actionId: string): Promise<boolean> => {
        const message = messages.find(m => m.id === messageId);
        if (!message) return false;

        const action = message.suggestedActions.find(a => a.id === actionId);
        if (!action) return false;

        try {
            const result = await action.action();
            
            if (result) {
                // Action successful, could show success message
                if (action.type === 'primary') {
                    dismissMessage(messageId);
                }
            }
            
            return result;
        } catch (error) {
            console.error(`Action ${actionId} failed:`, error);
            return false;
        }
    }, [messages, dismissMessage]);

    // Submit feedback
    const submitFeedback = useCallback((feedbackData: Omit<ErrorFeedback, 'timestamp'>) => {
        const feedbackRecord: ErrorFeedback = {
            ...feedbackData,
            timestamp: new Date()
        };

        setFeedback(prev => [feedbackRecord, ...prev].slice(0, 1000)); // Keep last 1000 feedback records

        // If user wants to contact support, create escalation
        if (feedbackData.contactSupport) {
            escalateError(feedbackData.errorId, 'support', 'User requested support contact');
        }
    }, []);

    // Escalate error
    const escalateError = useCallback((errorId: string, level: ErrorEscalation['level'], reason: string) => {
        if (!config.enableErrorEscalation) return;

        const escalation: ErrorEscalation = {
            errorId,
            level,
            reason,
            context: {
                timestamp: new Date(),
                userAgent: navigator.userAgent,
                url: window.location.href
            },
            status: 'pending',
            communications: []
        };

        setEscalations(prev => [escalation, ...prev].slice(0, 100)); // Keep last 100 escalations

        // Could send to support system here
        console.log('Error escalated:', escalation);
    }, [config.enableErrorEscalation]);

    // Update preferences
    const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
        setUserPreferences(prev => ({ ...prev, ...preferences }));
        
        // Save to localStorage
        try {
            localStorage.setItem('errorCommunicationPreferences', JSON.stringify({ ...userPreferences, ...preferences }));
        } catch (error) {
            console.warn('Failed to save preferences:', error);
        }
    }, [userPreferences]);

    // Get error history
    const getErrorHistory = useCallback((userId?: string): ErrorMessage[] => {
        // In a real implementation, this would fetch from a database
        return messages.filter(m => !userId || m.userId === userId);
    }, [messages]);

    // Clear all messages
    const clearAllMessages = useCallback(() => {
        setMessages([]);
        
        // Clear all timeouts
        messageTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        messageTimeoutsRef.current.clear();
    }, []);

    // Translate message
    const translateMessage = useCallback(async (messageId: string, language: string): Promise<ErrorMessage> => {
        const message = messages.find(m => m.id === messageId);
        if (!message) throw new Error('Message not found');

        // In a real implementation, this would call a translation service
        // For now, return the original message
        return Promise.resolve(message);
    }, [messages]);

    // Load preferences from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('errorCommunicationPreferences');
            if (saved) {
                const parsed = JSON.parse(saved);
                setUserPreferences(prev => ({ ...prev, ...parsed }));
            }
        } catch (error) {
            console.warn('Failed to load preferences:', error);
        }
    }, []);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            messageTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        };
    }, []);

    const value: ErrorCommunicationContextType = {
        config,
        messages,
        userPreferences,
        feedback,
        escalations,
        isCommunicating,
        showError,
        hideMessage,
        acknowledgeMessage,
        dismissMessage,
        executeAction,
        submitFeedback,
        escalateError,
        updatePreferences,
        getErrorHistory,
        clearAllMessages,
        translateMessage
    };

    return (
        <ErrorCommunicationContext.Provider value={value}>
            {children}
        </ErrorCommunicationContext.Provider>
    );
};

// Hook to use error communication
export const useErrorCommunication = () => {
    const context = useContext(ErrorCommunicationContext);
    if (!context) {
        throw new Error('useErrorCommunication must be used within ErrorCommunicationProvider');
    }
    return context;
};

// Error Message Component
interface ErrorMessageComponentProps {
    message: ErrorMessage;
    onDismiss?: () => void;
    onAcknowledge?: () => void;
    onAction?: (actionId: string) => void;
    className?: string;
}

export const ErrorMessageComponent: React.FC<ErrorMessageComponentProps> = ({ 
    message, 
    onDismiss, 
    onAcknowledge, 
    onAction,
    className = '' 
}) => {
    const { executeAction, dismissMessage, acknowledgeMessage } = useErrorCommunication();
    const [showDetails, setShowDetails] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    const getTypeIcon = () => {
        switch (message.type) {
            case 'error': return <FiAlertTriangle className=\"text-red-500\" />;
            case 'warning': return <FiAlertTriangle className=\"text-yellow-500\" />;
            case 'info': return <FiInfo className=\"text-blue-500\" />;
            case 'success': return <FiCheckCircle className=\"text-green-500\" />;
            default: return <FiInfo className=\"text-gray-500\" />;
        }
    };

    const getSeverityColor = () => {
        switch (message.severity) {
            case 'critical': return 'border-red-500 bg-red-50';
            case 'high': return 'border-orange-500 bg-orange-50';
            case 'medium': return 'border-yellow-500 bg-yellow-50';
            case 'low': return 'border-green-500 bg-green-50';
            default: return 'border-gray-500 bg-gray-50';
        }
    };

    const handleDismiss = () => {
        if (onDismiss) {
            onDismiss();
        } else {
            dismissMessage(message.id);
        }
    };

    const handleAcknowledge = () => {
        if (onAcknowledge) {
            onAcknowledge();
        } else {
            acknowledgeMessage(message.id);
        }
    };

    const handleAction = async (actionId: string) => {
        if (onAction) {
            onAction(actionId);
        } else {
            await executeAction(message.id, actionId);
        }
    };

    return (
        <div className={`p-4 rounded-lg border ${getSeverityColor()} ${className} ${message.dismissed ? 'opacity-0 transform translate-x-full transition-all duration-300' : ''}`}>
            <div className=\"flex items-start justify-between mb-2\">
                <div className=\"flex items-center space-x-2 flex-1\">
                    {getTypeIcon()}
                    <div className=\"flex-1 min-w-0\">
                        <h4 className=\"font-medium text-gray-900\">{message.title}</h4>
                        <p className=\"text-sm text-gray-600 mt-1\">{message.message}</p>
                        {message.userAction && (
                            <p className=\"text-sm text-blue-600 mt-1 font-medium\">{message.userAction}</p>
                        )}
                    </div>
                </div>
                
                <div className=\"flex items-center space-x-2 ml-4\">
                    {!message.acknowledged && (
                        <button
                            onClick={handleAcknowledge}
                            className=\"p-1 text-gray-400 hover:text-gray-600\"
                            title=\"Acknowledge\"
                        >
                            <FiCheckCircle />
                        </button>
                    )}
                    
                    <button
                        onClick={handleDismiss}
                        className=\"p-1 text-gray-400 hover:text-gray-600\"
                        title=\"Dismiss\"
                    >
                        <FiX />
                    </button>
                </div>
            </div>

            {/* Suggested Actions */}
            {message.suggestedActions.length > 0 && (
                <div className=\"flex flex-wrap gap-2 mt-3\">
                    {message.suggestedActions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => handleAction(action.id)}
                            className={`px-3 py-1 text-sm rounded font-medium transition-colors ${
                                action.type === 'primary'
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : action.type === 'secondary'
                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {action.icon && <span className=\"mr-1\">{action.icon}</span>}
                            {action.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Additional Options */}
            <div className=\"flex items-center space-x-4 mt-3 text-xs text-gray-500\">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className=\"flex items-center space-x-1 hover:text-gray-700\"
                >
                    {showDetails ? <FiChevronUp /> : <FiChevronDown />}
                    <span>Details</span>
                </button>

                {message.contextualHelp && (
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className=\"flex items-center space-x-1 hover:text-gray-700\"
                    >
                        <FiHelpCircle />
                        <span>Help</span>
                    </button>
                )}

                <button
                    onClick={() => navigator.clipboard.writeText(message.message)}
                    className=\"flex items-center space-x-1 hover:text-gray-700\"
                    title=\"Copy message\"
                >
                    <FiCopy />
                    <span>Copy</span>
                </button>

                <span>{message.timestamp.toLocaleTimeString()}</span>
            </div>

            {/* Technical Details */}
            {showDetails && message.technicalDetails && (
                <div className=\"mt-3 p-3 bg-gray-100 rounded text-sm font-mono text-gray-700\">
                    <p className=\"font-medium mb-1\">Technical Details:</p>
                    <p>{message.technicalDetails}</p>
                </div>
            )}

            {/* Contextual Help */}
            {showHelp && message.contextualHelp && (
                <div className=\"mt-3 p-3 bg-blue-50 rounded text-sm\">
                    <h5 className=\"font-medium text-blue-900 mb-2\">{message.contextualHelp.title}</h5>
                    <p className=\"text-blue-700 mb-2\">{message.contextualHelp.description}</p>
                    
                    {message.contextualHelp.steps && (
                        <div className=\"mb-2\">
                            <p className=\"font-medium text-blue-900\">Steps to resolve:</p>
                            <ol className=\"list-decimal list-inside text-blue-700 ml-4\">
                                {message.contextualHelp.steps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {message.contextualHelp.resources && message.contextualHelp.resources.length > 0 && (
                        <div className=\"mb-2\">
                            <p className=\"font-medium text-blue-900\">Helpful Resources:</p>
                            <ul className=\"space-y-1 ml-4\">
                                {message.contextualHelp.resources.map((resource, index) => (
                                    <li key={index}>
                                        <a
                                            href={resource.url}
                                            target=\"_blank\"
                                            rel=\"noopener noreferrer\"
                                            className=\"text-blue-600 hover:text-blue-800 flex items-center space-x-1\"
                                        >
                                            <FiExternalLink className=\"text-xs\" />
                                            <span>{resource.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {message.contextualHelp.faq && message.contextualHelp.faq.length > 0 && (
                        <div>
                            <p className=\"font-medium text-blue-900\">Frequently Asked Questions:</p>
                            <div className=\"space-y-2 mt-2\">
                                {message.contextualHelp.faq.slice(0, 2).map((faq, index) => (
                                    <details key={index} className=\"text-blue-700\">
                                        <summary className=\"cursor-pointer font-medium\">{faq.question}</summary>
                                        <p className=\"mt-1 ml-4\">{faq.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Error Container Component
interface ErrorContainerProps {
    className?: string;
    maxMessages?: number;
}

export const ErrorContainer: React.FC<ErrorContainerProps> = ({ 
    className = '', 
    maxMessages = 5 
}) => {
    const { messages, dismissMessage, acknowledgeMessage } = useErrorCommunication();
    const visibleMessages = messages.slice(0, maxMessages);

    if (visibleMessages.length === 0) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 space-y-2 max-w-md ${className}`}>
            {visibleMessages.map((message) => (
                <ErrorMessageComponent
                    key={message.id}
                    message={message}
                    onDismiss={() => dismissMessage(message.id)}
                    onAcknowledge={() => acknowledgeMessage(message.id)}
                />
            ))}
        </div>
    );
};

export default ErrorCommunicationProvider;
