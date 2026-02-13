/**
 * Standardized Error Messages
 *
 * Provides consistent error messages across all core modules.
 * Includes error templates, severity levels, and user-friendly messages.
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Error categories
 */
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  NETWORK = 'network',
  CACHE = 'cache',
  VALIDATION = 'validation',
  DEPENDENCY = 'dependency',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  SYSTEM = 'system',
  USER_INPUT = 'user_input',
  BUSINESS_LOGIC = 'business_logic',
  UI = 'ui'
}

/**
 * Error context information
 */
export interface ErrorContext {
  /** Component where error occurred */
  component?: string;
  /** Action being performed */
  action?: string;
  /** User role when error occurred */
  userRole?: string;
  /** Application environment */
  environment?: string;
  /** Current user ID */
  userId?: string;
  /** Session identifier */
  sessionId?: string;
  /** Current URL/path */
  url?: string;
  /** User agent string */
  userAgent?: string;
  /** Additional context data */
  additionalData?: Record<string, any>;
}

/**
 * Standardized error message template
 */
export interface ErrorMessageTemplate {
  /** Error code identifier */
  code: string;
  /** Error category */
  category: ErrorCategory;
  /** Error severity level */
  severity: ErrorSeverity;
  /** Technical error message */
  technicalMessage: string;
  /** User-friendly message */
  userMessage: string;
  /** Suggested actions */
  suggestedActions: string[];
  /** Error recovery options */
  recoveryOptions: string[];
}

/**
 * Error message generator
 */
export class ErrorMessageGenerator {
  private static readonly templates = new Map<string, ErrorMessageTemplate>();

  /**
   * Register a custom error message template
   */
  static registerTemplate(template: ErrorMessageTemplate): void {
    this.templates.set(template.code, template);
  }

  /**
   * Generate error message from template
   */
  static generate(
    code: string,
    context?: Partial<ErrorContext>,
    overrides?: Partial<ErrorMessageTemplate>
  ): {
    message: string;
    userMessage: string;
    severity: ErrorSeverity;
    category: ErrorCategory;
    suggestedActions: string[];
    recoveryOptions: string[];
  } {
    const template = this.templates.get(code);
    if (!template) {
      return this.generateGenericError(code, context);
    }

    const message = this.interpolate(template.technicalMessage, context);
    const userMessage = this.interpolate(template.userMessage, context);
    
    const severity = overrides?.severity || template.severity;
    const category = overrides?.category || template.category;
    const suggestedActions = overrides?.suggestedActions || template.suggestedActions;
    const recoveryOptions = overrides?.recoveryOptions || template.recoveryOptions;

    return {
      message,
      userMessage,
      severity,
      category,
      suggestedActions,
      recoveryOptions
    };
  }

  /**
   * Generate generic error message for unknown errors
   */
  private static generateGenericError(
    code: string,
    context?: Partial<ErrorContext>
  ): {
    message: string;
    userMessage: string;
    severity: ErrorSeverity;
    category: ErrorCategory;
    suggestedActions: string[];
    recoveryOptions: string[];
  } {
    const component = context?.component || 'Unknown';
    const action = context?.action || 'Unknown operation';
    
    return {
      message: `Error ${code} occurred in ${component} during ${action}`,
      userMessage: `An error occurred in ${component}. Please try again.`,
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.SYSTEM,
      suggestedActions: ['Check the error details and try again'],
      recoveryOptions: ['Retry the operation', 'Refresh the page', 'Contact support if the issue persists']
    };
  }

  /**
   * Interpolate template string with context values
   */
  private static interpolate(template: string, context?: Partial<ErrorContext>): string {
    if (!context) return template;

    return template.replace(/\{\{(\w+)\}/g, (match, key) => {
      const value = context[key as keyof ErrorContext];
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Get all registered templates
   */
  static getTemplates(): ErrorMessageTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template by code
   */
  static getTemplate(code: string): ErrorMessageTemplate | undefined {
    return this.templates.get(code);
  }
}

/**
 * Standardized error messages for core modules
 */
export const StandardErrorMessages: Record<string, ErrorMessageTemplate> = {
  // Authentication errors
  'AUTH_001': {
    code: 'AUTH_001',
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.HIGH,
    technicalMessage: 'Authentication failed: Invalid credentials provided',
    userMessage: 'Your login information is incorrect. Please check your email and password.',
    suggestedActions: [
      'Verify your email and password',
      'Check for typos',
      'Reset your password if needed'
    ],
    recoveryOptions: [
      'Try again',
      'Reset password',
      'Contact support'
    ]
  },
  'AUTH_002': {
    code: 'AUTH_002',
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    technicalMessage: 'Authentication failed: Account is locked',
    userMessage: 'Your account has been temporarily locked for security reasons.',
    suggestedActions: [
      'Wait 15 minutes and try again',
      'Check your email for unlock instructions',
      'Contact support if issue persists'
    ],
    recoveryOptions: [
      'Wait and retry',
      'Check email for unlock instructions',
      'Contact support'
    ]
  },
  'AUTH_003': {
    code: 'AUTH_003',
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    technicalMessage: 'Authentication failed: MFA required',
    userMessage: 'Multi-factor authentication is required for your account.',
    suggestedActions: [
      'Open your authenticator app',
      'Enter the verification code',
      'Ensure device time is correct'
    ],
    recoveryOptions: [
      'Enter MFA code',
      'Try again',
      'Use backup codes'
    ]
  },

  // Network errors
  'NET_001': {
    code: 'NET_001',
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    technicalMessage: 'Network request failed: Connection timeout',
    userMessage: 'Unable to connect to the server. Please check your internet connection.',
    suggestedActions: [
      'Check your internet connection',
      'Try refreshing the page',
      'Contact support if the issue persists'
    ],
    recoveryOptions: [
      'Retry request',
      'Refresh page',
      'Check connection'
    ]
  },
  'NET_002': {
    code: 'NET_002',
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    technicalMessage: 'Network request failed: Rate limit exceeded',
    userMessage: 'Too many requests. Please wait before trying again.',
    suggestedActions: [
      'Wait a few minutes',
      'Reduce request frequency',
      'Upgrade your plan for higher limits'
    ],
    recoveryOptions: [
      'Wait and retry',
      'Reduce frequency',
      'Upgrade plan'
    ]
  },
  'NET_003': {
    code: 'NET_003',
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    technicalMessage: 'Network request failed: Server error',
    userMessage: 'The server is experiencing issues. Please try again later.',
    suggestedActions: [
      'Try again later',
      'Check server status',
      'Contact support if issue persists'
    ],
    recoveryOptions: [
      'Retry request',
      'Check server status',
      'Contact support'
    ]
  },

  // Cache errors
  'CACHE_001': {
    code: 'CACHE_001',
    category: ErrorCategory.CACHE,
    severity: ErrorSeverity.MEDIUM,
    technicalMessage: 'Cache operation failed: Data not found',
    userMessage: 'The requested information is not available at the moment.',
    suggestedActions: [
      'Refresh the page',
      'Try searching again',
      'Check your internet connection'
    ],
    recoveryOptions: [
      'Refresh page',
      'Try again',
      'Check connection'
    ]
  },
  'CACHE_002': {
    code: 'CACHE_002',
    category: ErrorCategory.CACHE,
    severity: ErrorSeverity.LOW,
    technicalMessage: 'Cache operation failed: Storage quota exceeded',
    userMessage: 'Storage space is full. Some features may be limited.',
    suggestedActions: [
      'Clear cache data',
      'Upgrade storage plan',
      'Contact support'
    ],
    recoveryOptions: [
      'Clear cache',
      'Upgrade plan',
      'Contact support'
    ]
  },

  // Validation errors
  'VAL_001': {
    code: 'VAL_001',
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.MEDIUM,
    technicalMessage: 'Validation failed: Invalid input format',
    userMessage: 'The information you entered is not in the correct format.',
    suggestedActions: [
      'Check input requirements',
      'Follow the format examples',
      'Try again with correct format'
    ],
    recoveryOptions: [
      'Try again',
      'Check format',
      'View examples'
    ]
  },
  'VAL_002': {
    code: 'VAL_002',
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    technicalMessage: 'Validation failed: Required field missing',
    userMessage: 'Please fill in all required fields.',
    suggestedActions: [
      'Complete all required fields',
      'Check for missing fields',
      'Try again'
    ],
    recoveryOptions: [
      'Fill required fields',
      'Check missing fields',
      'Try again'
    ]
  },

  // Dependency errors
  'DEP_001': {
    code: 'DEP_001',
    category: ErrorCategory.DEPENDENCY,
    severity: ErrorSeverity.HIGH,
    technicalMessage: 'Dependency injection failed: Service not registered',
    userMessage: 'A required service is not available. Please restart the application.',
    suggestedActions: [
      'Restart the application',
      'Check service configuration',
      'Contact support'
    ],
    recoveryOptions: [
      'Restart app',
      'Check configuration',
      'Contact support'
    ]
  },
  'DEP_002': {
    code: 'DEP_002',
    category: ErrorCategory.DEPENDENCY,
    severity: ErrorSeverity.HIGH,
    technicalMessage: 'Dependency injection failed: Circular dependency detected',
    userMessage: 'A configuration error occurred. Please restart the application.',
    suggestedActions: [
      'Restart the application',
      'Check dependency configuration',
      'Contact support'
    ],
    recoveryOptions: [
      'Restart app',
      'Check configuration',
      'Contact support'
    ]
  },

  // Performance errors
  'PERF_001': {
    code: 'PERF_001',
    category: ErrorCategory.PERFORMANCE,
    severity: ErrorSeverity.MEDIUM,
    technicalMessage: 'Performance issue: Memory usage exceeded',
    userMessage: 'The application is using too much memory. Some features may be limited.',
    suggestedActions: [
      'Close unused tabs',
      'Refresh the page',
      'Restart the application'
    ],
    recoveryOptions: [
      'Close tabs',
      'Refresh page',
      'Restart app'
    ]
  },
  'PERF_002': {
    code: 'PERF_002',
    category: ErrorCategory.PERFORMANCE,
    severity: ErrorSeverity.LOW,
    technicalMessage: 'Performance issue: Slow response time',
    userMessage: 'The application is running slowly. Please be patient.',
    suggestedActions: [
      'Wait for completion',
      'Reduce concurrent operations',
      'Refresh the page'
    ],
    recoveryOptions: [
      'Wait for completion',
      'Reduce operations',
      'Refresh page'
    ]
  },

  // Security errors
  'SEC_001': {
    code: 'SEC_001',
    category: ErrorCategory.SECURITY,
    severity: ErrorSeverity.CRITICAL,
    technicalMessage: 'Security violation: Suspicious activity detected',
    userMessage: 'Security alert: Suspicious activity detected. Your session has been terminated.',
    suggestedActions: [
      'Contact support immediately',
      'Check security settings',
      'Review recent activity'
    ],
    recoveryOptions: [
      'Contact support',
      'Check security',
      'Review activity'
    ]
  },
  'SEC_002': {
    code: 'SEC_002',
    category: ErrorCategory.SECURITY,
    severity: ErrorSeverity.HIGH,
    technicalMessage: 'Security violation: Invalid access attempt',
    userMessage: 'Access denied. You do not have permission for this action.',
    suggestedActions: [
      'Check permissions',
      'Contact administrator',
      'Review access levels'
    ],
    recoveryOptions: [
      'Check permissions',
      'Contact admin',
      'Review access'
    ]
  },

  // System errors
  'SYS_001': {
    code: 'SYS_001',
    category: ErrorCategory.SYSTEM,
    severity: ErrorSeverity.CRITICAL,
    technicalMessage: 'System error: Application crash detected',
    userMessage: 'The application has encountered an error and needs to restart.',
    suggestedActions: [
      'Restart the application',
      'Save your work',
      'Contact support'
    ],
    recoveryOptions: [
      'Restart app',
      'Save work',
      'Contact support'
    ]
  },
  'SYS_002': {
    code: 'SYS_002',
    category: ErrorCategory.SYSTEM,
    severity: ErrorSeverity.HIGH,
    technicalMessage: 'System error: Configuration error',
    userMessage: 'A configuration error occurred. Please restart the application.',
    suggestedActions: [
      'Restart the application',
      'Check configuration',
      'Contact support'
    ],
    recoveryOptions: [
      'Restart app',
      'Check configuration',
      'Contact support'
    ]
  },

  // User input errors
  'USER_001': {
    code: 'USER_001',
    category: ErrorCategory.USER_INPUT,
    severity: ErrorSeverity.LOW,
    technicalMessage: 'User input error: Invalid format',
    userMessage: 'The information you entered is not in the expected format.',
    suggestedActions: [
      'Check format requirements',
      'Follow examples',
      'Try again'
    ],
    recoveryOptions: [
      'Check format',
      'Follow examples',
      'Try again'
    ]
  },
  'USER_002': {
    code: 'USER_002',
    category: ErrorCategory.USER_INPUT,
    severity: ErrorSeverity.LOW,
    technicalMessage: 'User input error: Invalid characters detected',
    userMessage: 'Invalid characters detected in your input.',
    suggestedActions: [
      'Remove invalid characters',
      'Use valid characters only',
      'Try again'
    ],
    recoveryOptions: [
      'Remove invalid characters',
      'Use valid characters',
      'Try again'
    ]
  },

  // Business logic errors
  'BIZ_001': {
    code: 'BIZ_001',
    category: ErrorCategory.BUSINESS_LOGIC,
    severity: ErrorSeverity.MEDIUM,
    technicalMessage: 'Business logic error: Operation not permitted',
    userMessage: 'This operation is not allowed in current context.',
    suggestedActions: [
      'Check permissions',
      'Review business rules',
      'Contact administrator'
    ],
    recoveryOptions: [
      'Check permissions',
      'Review rules',
      'Contact admin'
    ]
  },

  // UI errors
  'UI_001': {
    code: 'UI_001',
    category: ErrorCategory.UI,
    severity: ErrorSeverity.LOW,
    technicalMessage: 'UI error: Component render failed',
    userMessage: 'A display error occurred. Please refresh the page.',
    suggestedActions: [
      'Refresh the page',
      'Check browser compatibility',
      'Try a different browser'
    ],
    recoveryOptions: [
      'Refresh page',
      'Check compatibility',
      'Try different browser'
    ]
  }
};

/**
 * Initialize standard error messages
 */
export function initializeStandardErrorMessages(): void {
  for (const [code, template] of Object.entries(StandardErrorMessages)) {
    ErrorMessageGenerator.registerTemplate(template);
  }
}

/**
 * Get error message by code
 */
export function getErrorMessage(code: string): ErrorMessageTemplate | undefined {
  return ErrorMessageGenerator.getTemplate(code);
}

/**
 * Generate error message with context
 */
export function generateErrorMessage(
  code: string,
  context?: Partial<ErrorContext>,
  overrides?: Partial<ErrorMessageTemplate>
): {
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  suggestedActions: string[];
  recoveryOptions: string[];
} {
  return ErrorMessageGenerator.generate(code, context, overrides);
}

/**
 * Create standardized error
 */
export function createStandardError(
  code: string,
  context?: Partial<ErrorContext>,
  cause?: Error
): Error {
  const errorInfo = generateErrorMessage(code, context);
  const error = new Error(errorInfo.message);
  
  // Add error metadata
  (error as any).code = code;
  (error as any).severity = errorInfo.severity;
  (error as any).category = errorInfo.category;
  (error as any).userMessage = errorInfo.userMessage;
  (error as any).suggestedActions = errorInfo.suggestedActions;
  (error as any).recoveryOptions = errorInfo.recoveryOptions;
  (error as any).context = context;
  
  if (cause) {
    (error as any).cause = cause;
  }
  
  return error;
}
