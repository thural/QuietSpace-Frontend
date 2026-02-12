/**
 * Error Messages Constants
 * 
 * Standardized error messages for consistent user experience.
 */

/**
 * Network error messages
 */
export const NETWORK_ERROR_MESSAGES = {
    // Base network errors
    NETWORK_ERROR: 'Network connection issue detected',
    NETWORK_CONNECTION_ERROR: 'Network connection failed. Please check your internet connection.',
    NETWORK_TIMEOUT: 'Request timed out. Please check your connection and try again.',
    
    // HTTP status based errors
    BAD_REQUEST_ERROR: 'Invalid request. Please check your input and try again.',
    UNAUTHORIZED_ERROR: 'Authentication required. Please log in.',
    FORBIDDEN_ERROR: 'Access denied. You do not have permission to perform this action.',
    NOT_FOUND_ERROR: 'The requested resource was not found.',
    METHOD_NOT_ALLOWED_ERROR: 'The request method is not allowed for this resource.',
    CONFLICT_ERROR: 'The request conflicts with the current state of the resource.',
    TOO_MANY_REQUESTS_ERROR: 'Too many requests. Please wait a moment and try again.',
    
    // Server errors
    INTERNAL_SERVER_ERROR: 'Server error occurred. Please try again later.',
    BAD_GATEWAY_ERROR: 'Server gateway error. Please try again later.',
    SERVICE_UNAVAILABLE_ERROR: 'Service is temporarily unavailable. Please try again later.',
    GATEWAY_TIMEOUT_ERROR: 'Server gateway timeout. Please try again later.',
    
    // Authentication errors
    TOKEN_REFRESH_ERROR: 'Your session has expired. Please log in again.',
    AUTHENTICATION_ERROR: 'Authentication failed. Please check your credentials.',
    INVALID_CREDENTIALS_ERROR: 'Invalid username or password.',
    TOKEN_EXPIRED_ERROR: 'Your authentication token has expired.',
    INVALID_TOKEN_ERROR: 'Invalid authentication token.',
    ACCOUNT_LOCKED_ERROR: 'Your account has been locked for security reasons.',
    PERMISSION_DENIED_ERROR: 'You do not have permission to perform this action.',
    SESSION_EXPIRED_ERROR: 'Your session has expired due to inactivity.',
    
    // CORS and security
    CORS_ERROR: 'Cross-origin request blocked.',
    CSRF_ERROR: 'Invalid security token.',
    SECURITY_ERROR: 'Security validation failed.'
} as const;

/**
 * Validation error messages
 */
export const VALIDATION_ERROR_MESSAGES = {
    VALIDATION_ERROR: 'Invalid data provided',
    REQUIRED_FIELD_ERROR: 'This field is required',
    INVALID_FORMAT_ERROR: 'Invalid format provided',
    RANGE_ERROR: 'Value is outside the allowed range',
    LENGTH_ERROR: 'Text length is not within the allowed limits',
    EMAIL_FORMAT_ERROR: 'Please enter a valid email address',
    PHONE_FORMAT_ERROR: 'Please enter a valid phone number',
    URL_FORMAT_ERROR: 'Please enter a valid URL',
    DATE_FORMAT_ERROR: 'Please enter a valid date',
    NUMERIC_FORMAT_ERROR: 'Please enter a valid number',
    PATTERN_MISMATCH_ERROR: 'Format does not match the required pattern'
} as const;

/**
 * System error messages
 */
export const SYSTEM_ERROR_MESSAGES = {
    SYSTEM_ERROR: 'System error occurred',
    MEMORY_ERROR: 'System is running low on memory',
    DISK_SPACE_ERROR: 'Not enough disk space available',
    CPU_ERROR: 'System is experiencing high CPU usage',
    DATABASE_ERROR: 'Database operation failed',
    FILE_SYSTEM_ERROR: 'File system operation failed',
    CONFIGURATION_ERROR: 'System configuration error',
    DEPENDENCY_ERROR: 'Required system component failed to load',
    QUOTA_EXCEEDED_ERROR: 'Resource quota exceeded',
    RESOURCE_LIMIT_ERROR: 'System resource limit reached',
    CONCURRENCY_ERROR: 'System concurrency error',
    TIMEOUT_ERROR: 'Operation timed out'
} as const;

/**
 * Application error messages
 */
export const APPLICATION_ERROR_MESSAGES = {
    APPLICATION_ERROR: 'Application error occurred',
    INITIALIZATION_ERROR: 'Failed to initialize application',
    CONFIGURATION_ERROR: 'Application configuration error',
    STATE_ERROR: 'Application state error',
    LIFECYCLE_ERROR: 'Application lifecycle error',
    ROUTING_ERROR: 'Navigation error occurred',
    NAVIGATION_ERROR: 'Failed to navigate to requested page',
    RENDER_ERROR: 'Failed to render component',
    COMPONENT_ERROR: 'Component error occurred',
    HOOK_ERROR: 'React hook error occurred',
    CONTEXT_ERROR: 'React context error occurred'
} as const;

/**
 * Data error messages
 */
export const DATA_ERROR_MESSAGES = {
    DATA_ERROR: 'Data processing error',
    PARSE_ERROR: 'Failed to parse data',
    SERIALIZE_ERROR: 'Failed to serialize data',
    TRANSFORM_ERROR: 'Failed to transform data',
    VALIDATION_ERROR: 'Data validation failed',
    INTEGRITY_ERROR: 'Data integrity error',
    CONSISTENCY_ERROR: 'Data consistency error',
    CONFLICT_ERROR: 'Data conflict detected',
    DUPLICATE_ERROR: 'Duplicate data detected',
    NOT_FOUND_ERROR: 'Data not found',
    RELATIONSHIP_ERROR: 'Data relationship error'
} as const;

/**
 * Business logic error messages
 */
export const BUSINESS_ERROR_MESSAGES = {
    BUSINESS_ERROR: 'Business rule violation',
    WORKFLOW_ERROR: 'Workflow error occurred',
    POLICY_ERROR: 'Policy violation detected',
    CONSTRAINT_ERROR: 'Business constraint violation',
    RULE_VIOLATION_ERROR: 'Business rule violation',
    PERMISSION_ERROR: 'Business permission denied',
    AUTHORIZATION_ERROR: 'Business authorization failed',
    LIMIT_EXCEEDED_ERROR: 'Business limit exceeded',
    QUOTA_EXCEEDED_ERROR: 'Business quota exceeded',
    RATE_LIMIT_ERROR: 'Business rate limit exceeded',
    SUBSCRIPTION_ERROR: 'Subscription error occurred',
    LICENSE_ERROR: 'License validation failed'
} as const;

/**
 * External service error messages
 */
export const EXTERNAL_SERVICE_ERROR_MESSAGES = {
    EXTERNAL_SERVICE_ERROR: 'External service error',
    API_ERROR: 'API call failed',
    THIRD_PARTY_ERROR: 'Third-party service error',
    WEBHOOK_ERROR: 'Webhook delivery failed',
    INTEGRATION_ERROR: 'Service integration error',
    SERVICE_UNAVAILABLE_ERROR: 'External service unavailable',
    RATE_LIMIT_ERROR: 'External service rate limit exceeded',
    QUOTA_EXCEEDED_ERROR: 'External service quota exceeded',
    AUTHENTICATION_ERROR: 'External service authentication failed',
    AUTHORIZATION_ERROR: 'External service authorization failed',
    TIMEOUT_ERROR: 'External service timeout',
    CONFIGURATION_ERROR: 'External service configuration error'
} as const;

/**
 * All error messages combined
 */
export const ERROR_MESSAGES = {
    ...NETWORK_ERROR_MESSAGES,
    ...VALIDATION_ERROR_MESSAGES,
    ...SYSTEM_ERROR_MESSAGES,
    ...APPLICATION_ERROR_MESSAGES,
    ...DATA_ERROR_MESSAGES,
    ...BUSINESS_ERROR_MESSAGES,
    ...EXTERNAL_SERVICE_ERROR_MESSAGES
} as const;

/**
 * Error message categories
 */
export const ERROR_MESSAGE_CATEGORIES = {
    NETWORK: Object.values(NETWORK_ERROR_MESSAGES),
    VALIDATION: Object.values(VALIDATION_ERROR_MESSAGES),
    SYSTEM: Object.values(SYSTEM_ERROR_MESSAGES),
    APPLICATION: Object.values(APPLICATION_ERROR_MESSAGES),
    DATA: Object.values(DATA_ERROR_MESSAGES),
    BUSINESS: Object.values(BUSINESS_ERROR_MESSAGES),
    EXTERNAL_SERVICE: Object.values(EXTERNAL_SERVICE_ERROR_MESSAGES)
} as const;

/**
 * Get error message by code
 */
export function getErrorMessage(errorCode: string): string {
    return ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES] || 'An error occurred';
}

/**
 * Get user-friendly error message with context
 */
export function getUserFriendlyMessage(errorCode: string, context?: string): string {
    const baseMessage = getErrorMessage(errorCode);
    return context ? `${baseMessage}: ${context}` : baseMessage;
}

/**
 * Get suggested actions for error code
 */
export function getSuggestedActions(errorCode: string): string[] {
    // Common suggested actions by error category
    const commonActions: Record<string, string[]> = {
        NETWORK: [
            'Check your internet connection',
            'Try refreshing the page',
            'Contact support if issue persists'
        ],
        VALIDATION: [
            'Check your input data',
            'Ensure all required fields are filled',
            'Follow the specified format'
        ],
        SYSTEM: [
            'Try refreshing the page',
            'Restart your browser',
            'Contact support if issue persists'
        ],
        AUTHENTICATION: [
            'Log in again',
            'Check your credentials',
            'Contact support if issue persists'
        ]
    };

    // Return common actions based on error code patterns
    if (errorCode.includes('NETWORK') || errorCode.includes('TIMEOUT')) {
        return commonActions.NETWORK;
    }
    if (errorCode.includes('VALIDATION') || errorCode.includes('FORMAT')) {
        return commonActions.VALIDATION;
    }
    if (errorCode.includes('SYSTEM') || errorCode.includes('MEMORY') || errorCode.includes('CPU')) {
        return commonActions.SYSTEM;
    }
    if (errorCode.includes('AUTH') || errorCode.includes('TOKEN') || errorCode.includes('PERMISSION')) {
        return commonActions.AUTHENTICATION;
    }

    // Default actions
    return [
        'Try again',
        'Refresh the page',
        'Contact support if issue persists'
    ];
}

/**
 * Format error message with parameters
 */
export function formatErrorMessage(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return params[key]?.toString() || match;
    });
}
