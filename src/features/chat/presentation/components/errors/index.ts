/**
 * Advanced Error Handling Components Index
 * 
 * This file exports all advanced error handling components and utilities for easy importing
 * throughout the chat feature.
 */

// Main Error Components
export { default as ErrorBoundaryEnhanced } from './ErrorBoundaryEnhanced';
export { default as ErrorRecovery } from './ErrorRecovery';

// Advanced Error Handling Components
export { default as AdvancedErrorRecoveryProvider } from './AdvancedErrorRecovery';
export { default as ErrorAnalyticsProvider } from './ErrorAnalyticsManager';
export { default as ErrorPreventionProvider } from './ErrorPreventionManager';
export { default as ErrorCommunicationProvider } from './ErrorCommunicationManager';

// Error Classification and Reporting
export { 
    ErrorClassificationService,
    errorClassifier,
    classifyError,
    learnFromError,
    getErrorInsights,
    type ErrorClassification,
    type ErrorContext,
    type ErrorPattern
} from './ErrorClassification';

export { 
    ErrorReportingService,
    errorReporter,
    reportError,
    addUserFeedback,
    getErrorStatistics,
    type ErrorReport,
    type ErrorReportingConfig,
    type ErrorAlert
} from './ErrorReporting';

// Advanced Components
export { RecoveryStatus } from './AdvancedErrorRecovery';
export { AnalyticsDashboard } from './ErrorAnalyticsManager';
export { SystemHealthMonitor } from './ErrorPreventionManager';
export { ErrorMessageComponent, ErrorContainer } from './ErrorCommunicationManager';

// Types and Interfaces
export type { 
    AdvancedErrorRecoveryConfig, 
    RecoveryStrategy, 
    RecoveryAction, 
    RecoveryContext, 
    RecoveryAnalytics 
} from './AdvancedErrorRecovery';

export type { 
    ErrorAnalyticsConfig, 
    ErrorAnalytics, 
    ErrorPattern, 
    ErrorAlert, 
    ErrorPrediction 
} from './ErrorAnalyticsManager';

export type { 
    ErrorPreventionConfig, 
    PreventionStrategy, 
    SystemHealth, 
    PreventionAnalytics 
} from './ErrorPreventionManager';

export type { 
    ErrorCommunicationConfig, 
    ErrorMessage, 
    ErrorAction, 
    ContextualHelp, 
    UserPreferences 
} from './ErrorCommunicationManager';

// Hooks
export { useAdvancedErrorRecovery } from './AdvancedErrorRecovery';
export { useErrorAnalytics } from './ErrorAnalyticsManager';
export { useErrorPrevention } from './ErrorPreventionManager';
export { useErrorCommunication } from './ErrorCommunicationManager';

// Utilities
export const ErrorHandlingUtils = {
    // Error classification utilities
    classifyError: (error: Error) => {
        if (error.name === 'NetworkError' || error.message.includes('network')) {
            return { type: 'network', severity: 'high', recoverable: true };
        }
        if (error.name === 'ValidationError') {
            return { type: 'validation', severity: 'medium', recoverable: true };
        }
        if (error.name === 'PermissionError') {
            return { type: 'permission', severity: 'high', recoverable: false };
        }
        return { type: 'unknown', severity: 'medium', recoverable: true };
    },
    
    // Recovery strategy utilities
    getRecoveryStrategy: (errorType: string) => {
        const strategies = {
            network: 'retry-with-backoff',
            validation: 'show-validation-errors',
            permission: 'request-permission',
            unknown: 'generic-recovery'
        };
        return strategies[errorType as keyof typeof strategies] || strategies.unknown;
    },
    
    // Error message formatting
    formatErrorMessage: (error: Error, includeTechnical: boolean = false) => {
        const userMessage = error.message || 'An unexpected error occurred';
        if (includeTechnical) {
            return `${userMessage}\n\nTechnical details:\n${error.stack || 'No stack trace available'}`;
        }
        return userMessage;
    },
    
    // Error severity assessment
    assessSeverity: (error: Error, context?: any) => {
        if (error.name === 'CriticalError' || (context && context.impact === 'high')) {
            return 'critical';
        }
        if (error.name === 'NetworkError' || error.name === 'TimeoutError') {
            return 'high';
        }
        if (error.name === 'ValidationError') {
            return 'medium';
        }
        return 'low';
    },
    
    // Error recovery time estimation
    estimateRecoveryTime: (errorType: string) => {
        const recoveryTimes = {
            network: 5000, // 5 seconds
            validation: 2000, // 2 seconds
            permission: 10000, // 10 seconds
            unknown: 3000 // 3 seconds
        };
        return recoveryTimes[errorType as keyof typeof recoveryTimes] || recoveryTimes.unknown;
    },
    
    // Error impact assessment
    assessImpact: (error: Error, userContext?: any) => {
        return {
            usersAffected: userContext ? 1 : 0,
            functionalityAffected: ['chat', 'messaging'],
            dataLoss: false,
            recoveryRequired: true
        };
    },
    
    // Error prevention suggestions
    getPreventionSuggestions: (errorPattern: string) => {
        const suggestions = {
            'network-timeout': [
                'Implement retry logic with exponential backoff',
                'Add connection health monitoring',
                'Provide offline functionality'
            ],
            'validation-failure': [
                'Add client-side validation',
                'Provide real-time validation feedback',
                'Implement input sanitization'
            ],
            'permission-denied': [
                'Implement proper permission checking',
                'Provide clear permission requests',
                'Add role-based access control'
            ]
        };
        return suggestions[errorPattern as keyof typeof suggestions] || ['Implement general error handling'];
    }
};

export default ErrorHandlingUtils;
export { default as ErrorToast } from './ErrorToast';

// Re-export for convenience
export {
    // Error Boundary
    ErrorBoundaryEnhanced as ChatErrorBoundary,
    
    // Error Recovery
    ErrorRecovery as ChatErrorRecovery,
    
    // Error Classification
    ErrorClassificationService as ChatErrorClassificationService,
    errorClassifier as chatErrorClassifier,
    classifyError as classifyChatError,
    learnFromError as learnFromChatError,
    getErrorInsights as getChatErrorInsights,
    
    // Error Reporting
    ErrorReportingService as ChatErrorReportingService,
    errorReporter as chatErrorReporter,
    reportError as reportChatError,
    addUserFeedback as addChatErrorFeedback,
    getErrorStatistics as getChatErrorStatistics,
    
    // Error Toast
    ErrorToast as ChatErrorToast
} from './ErrorClassification';
