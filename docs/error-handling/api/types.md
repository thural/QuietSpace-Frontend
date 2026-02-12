# Error Types API Reference

## Core Interfaces

### IError

The main error interface that all error objects must implement.

```typescript
interface IError {
  /** Unique error identifier */
  readonly id: string;
  
  /** Error message */
  readonly message: string;
  
  /** Error code for programmatic handling */
  readonly code: string;
  
  /** Error severity level */
  readonly severity: ErrorSeverity;
  
  /** Error category */
  readonly category: ErrorCategory;
  
  /** Whether the error is recoverable */
  readonly recoverable: boolean;
  
  /** Recommended recovery strategy */
  readonly recoveryStrategy: ErrorRecoveryStrategy;
  
  /** User-friendly error message */
  readonly userMessage: string;
  
  /** Suggested actions for recovery */
  readonly suggestedActions: string[];
  
  /** Error timestamp */
  readonly timestamp: Date;
  
  /** Additional error metadata */
  readonly metadata: Record<string, any>;
  
  /** Original error that caused this error */
  readonly cause?: Error | undefined;
  
  /** Error stack trace */
  readonly stack?: string;
  
  /** Error context information */
  readonly context?: IErrorContext | undefined;
  
  /**
   * Convert error to JSON representation
   * @returns JSON-serializable error object
   */
  toJSON(): Record<string, any>;
  
  /**
   * Create a copy of this error with optional modifications
   * @param modifications - Modifications to apply
   * @returns New error instance
   */
  copy(modifications?: Partial<{
    message: string;
    code: string;
    severity: ErrorSeverity;
    recoverable: boolean;
    recoveryStrategy: ErrorRecoveryStrategy;
    userMessage: string;
    suggestedActions: string[];
    metadata: Record<string, any>;
    context: IErrorContext;
  }>): IError;
}
```

### IErrorContext

Context information for errors.

```typescript
interface IErrorContext {
  /** Component where error occurred */
  component?: string;
  
  /** Action being performed */
  action?: string;
  
  /** User role (if applicable) */
  userRole?: string;
  
  /** Environment (development, production, etc.) */
  environment?: string;
  
  /** User identifier */
  userId?: string;
  
  /** Session identifier */
  sessionId?: string;
  
  /** Current URL */
  url?: string;
  
  /** User agent string */
  userAgent?: string;
  
  /** Additional context data */
  additionalData?: Record<string, any>;
}
```

### IErrorClassification

Error classification information.

```typescript
interface IErrorClassification {
  /** Error type */
  type: ErrorCategory;
  
  /** Error severity */
  severity: ErrorSeverity;
  
  /** Whether error is recoverable */
  recoverable: boolean;
  
  /** User-friendly message */
  userMessage: string;
  
  /** Suggested recovery actions */
  suggestedActions: string[];
  
  /** Recovery strategy */
  retryStrategy: ErrorRecoveryStrategy;
  
  /** Error category */
  category: string;
  
  /** Error tags */
  tags: string[];
  
  /** Additional metadata */
  metadata: Record<string, any>;
  
  /** Classification confidence (0-1) */
  confidence: number;
}
```

### IErrorHandler

Error handler interface.

```typescript
interface IErrorHandler {
  /**
   * Handle an error
   * @param error - Error to handle
   * @param context - Error context
   * @returns Standardized error
   */
  handle(error: Error, context?: IErrorContext): Promise<IError>;
  
  /**
   * Classify an error
   * @param error - Error to classify
   * @param context - Error context
   * @returns Error classification
   */
  classify(error: Error, context?: IErrorContext): IErrorClassification;
  
  /**
   * Report an error
   * @param error - Error to report
   * @param context - Error context
   */
  report(error: IError, context?: IErrorContext): Promise<void>;
  
  /**
   * Attempt error recovery
   * @param error - Error to recover from
   * @param options - Recovery options
   * @returns Whether recovery was successful
   */
  recover(error: IError, options?: {
    maxRetries?: number;
    retryDelay?: number;
    backoffMultiplier?: number;
    timeout?: number;
    customRecovery?: (error: IError) => Promise<boolean>;
    fallbackAction?: () => void;
  }): Promise<boolean>;
  
  /**
   * Get error statistics
   * @returns Error statistics
   */
  getStatistics(): IErrorStatistics;
  
  /**
   * Subscribe to error events
   * @param eventType - Event type
   * @param listener - Event listener
   * @returns Unsubscribe function
   */
  subscribe(eventType: ErrorEventType, listener: (event: IErrorEvent) => void): () => void;
  
  /**
   * Get error history
   * @param limit - Maximum number of entries
   * @returns Error history
   */
  getErrorHistory(limit?: number): IError[];
  
  /**
   * Clear error history
   */
  clearHistory(): void;
}
```

### IErrorFactory

Error factory interface.

```typescript
interface IErrorFactory {
  /**
   * Create error from parameters
   * @param message - Error message
   * @param code - Error code
   * @param category - Error category
   * @param severity - Error severity
   * @param recoverable - Whether error is recoverable
   * @param recoveryStrategy - Recovery strategy
   * @param userMessage - User-friendly message
   * @param suggestedActions - Suggested actions
   * @param metadata - Additional metadata
   * @param cause - Original error
   * @param context - Error context
   * @returns Created error
   */
  create(
    message: string,
    code: string,
    category: ErrorCategory,
    severity: ErrorSeverity,
    recoverable: boolean,
    recoveryStrategy: ErrorRecoveryStrategy,
    userMessage: string,
    suggestedActions: string[],
    metadata: Record<string, any>,
    cause?: Error,
    context?: IErrorContext
  ): IError;
  
  /**
   * Create error from existing error
   * @param error - Original error
   * @param category - Error category
   * @param severity - Error severity
   * @param context - Error context
   * @returns Created error
   */
  fromError(
    error: Error,
    category?: ErrorCategory,
    severity?: ErrorSeverity,
    context?: IErrorContext
  ): IError;
  
  /**
   * Create network error
   * @param message - Error message
   * @param statusCode - HTTP status code
   * @param endpoint - API endpoint
   * @returns Network error
   */
  createNetworkError(
    message: string,
    statusCode?: number,
    endpoint?: string
  ): IError;
  
  /**
   * Create validation error
   * @param message - Error message
   * @param field - Field name
   * @param value - Field value
   * @returns Validation error
   */
  createValidationError(
    message: string,
    field?: string,
    value?: any
  ): IError;
  
  /**
   * Create authentication error
   * @param message - Error message
   * @param authType - Authentication type
   * @returns Authentication error
   */
  createAuthenticationError(
    message: string,
    authType?: string
  ): IError;
  
  /**
   * Create system error
   * @param message - Error message
   * @param component - Component name
   * @param operation - Operation name
   * @returns System error
   */
  createSystemError(
    message: string,
    component?: string,
    operation?: string
  ): IError;
}
```

### IErrorStatistics

Error statistics interface.

```typescript
interface IErrorStatistics {
  /** Total number of errors */
  totalErrors: number;
  
  /** Errors by category */
  byCategory: Record<ErrorCategory, number>;
  
  /** Errors by severity */
  bySeverity: Record<ErrorSeverity, number>;
  
  /** Recoverable errors count */
  recoverable: number;
  
  /** Non-recoverable errors count */
  nonRecoverable: number;
  
  /** Recovery success rate */
  recoverySuccessRate: number;
  
  /** Average recovery time */
  averageRecoveryTime: number;
  
  /** Most common errors */
  mostCommonErrors: Array<{
    code: string;
    message: string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    count: number;
  }>;
  
  /** Error trends over time */
  errorTrends: Array<{
    timestamp: Date;
    count: number;
    severity: ErrorSeverity;
  }>;
  
  /** Oldest error */
  oldestError?: IError;
  
  /** Newest error */
  newestError?: IError;
}
```

### IErrorEvent

Error event interface.

```typescript
interface IErrorEvent {
  /** Event type */
  type: ErrorEventType;
  
  /** Event timestamp */
  timestamp: Date;
  
  /** Error object */
  error: IError;
  
  /** Error context */
  context?: IErrorContext;
  
  /** Additional event data */
  data?: any;
}
```

### IErrorLogEntry

Error log entry interface.

```typescript
interface IErrorLogEntry {
  /** Log level */
  level: 'debug' | 'info' | 'warn' | 'error';
  
  /** Log message */
  message: string;
  
  /** Timestamp */
  timestamp: Date;
  
  /** Error context */
  context?: IErrorContext;
  
  /** Error object (if applicable) */
  error?: IError;
}
```

## Enums

### ErrorCategory

```typescript
enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  RUNTIME = 'runtime',
  DEPENDENCY = 'dependency',
  SYSTEM = 'system',
  DATABASE = 'database',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}
```

### ErrorSeverity

```typescript
enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}
```

### ErrorRecoveryStrategy

```typescript
enum ErrorRecoveryStrategy {
  IMMEDIATE = 'immediate',
  DELAYED = 'delayed',
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  FALLBACK = 'fallback',
  NONE = 'none'
}
```

### ErrorEventType

```typescript
enum ErrorEventType {
  ERROR_OCCURRED = 'error_occurred',
  ERROR_CLASSIFIED = 'error_classified',
  ERROR_REPORTED = 'error_reported',
  ERROR_RECOVERED = 'error_recovered',
  ERROR_RECOVERY_FAILED = 'error_recovery_failed'
}
```

## Type Guards

### isIError

Type guard for IError objects.

```typescript
function isIError(obj: any): obj is IError {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.message === 'string' &&
    typeof obj.code === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.severity === 'string' &&
    typeof obj.recoverable === 'boolean' &&
    typeof obj.recoveryStrategy === 'string' &&
    typeof obj.userMessage === 'string' &&
    Array.isArray(obj.suggestedActions) &&
    obj.timestamp instanceof Date &&
    typeof obj.metadata === 'object' &&
    typeof obj.toJSON === 'function' &&
    typeof obj.copy === 'function';
}
```

### isErrorCategory

Type guard for ErrorCategory.

```typescript
function isErrorCategory(value: string): value is ErrorCategory {
  return Object.values(ErrorCategory).includes(value as ErrorCategory);
}
```

### isErrorSeverity

Type guard for ErrorSeverity.

```typescript
function isErrorSeverity(value: string): value is ErrorSeverity {
  return Object.values(ErrorSeverity).includes(value as ErrorSeverity);
}
```

## Utility Types

### ErrorOptions

Options for error creation.

```typescript
type ErrorOptions = {
  message: string;
  code?: string;
  category?: ErrorCategory;
  severity?: ErrorSeverity;
  recoverable?: boolean;
  recoveryStrategy?: ErrorRecoveryStrategy;
  userMessage?: string;
  suggestedActions?: string[];
  metadata?: Record<string, any>;
  cause?: Error;
  context?: IErrorContext;
};
```

### RecoveryOptions

Options for error recovery.

```typescript
type RecoveryOptions = {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
  timeout?: number;
  customRecovery?: (error: IError) => Promise<boolean>;
  fallbackAction?: () => void;
};
```

### ErrorHandlerOptions

Options for error handler configuration.

```typescript
type ErrorHandlerOptions = {
  maxHistorySize?: number;
  classificationService?: IErrorClassificationService;
  enableReporting?: boolean;
  enableLogging?: boolean;
};
```

## Examples

### Creating Custom Errors

```typescript
import { IError, ErrorCategory, ErrorSeverity } from '@/core/modules/error';

class CustomError extends Error implements IError {
  readonly id: string;
  readonly code: string;
  readonly category: ErrorCategory;
  readonly severity: ErrorSeverity;
  readonly recoverable: boolean;
  readonly recoveryStrategy: ErrorRecoveryStrategy;
  readonly userMessage: string;
  readonly suggestedActions: string[];
  readonly timestamp: Date;
  readonly metadata: Record<string, any>;
  readonly cause?: Error;
  readonly context?: IErrorContext;

  constructor(message: string, options: Partial<ErrorOptions> = {}) {
    super(message);
    this.id = generateId();
    this.code = options.code || 'CUSTOM_ERROR';
    this.category = options.category || ErrorCategory.UNKNOWN;
    this.severity = options.severity || ErrorSeverity.MEDIUM;
    this.recoverable = options.recoverable ?? true;
    this.recoveryStrategy = options.recoveryStrategy || ErrorRecoveryStrategy.MANUAL;
    this.userMessage = options.userMessage || message;
    this.suggestedActions = options.suggestedActions || ['Contact support'];
    this.timestamp = new Date();
    this.metadata = options.metadata || {};
    this.cause = options.cause;
    this.context = options.context;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      message: this.message,
      code: this.code,
      category: this.category,
      severity: this.severity,
      recoverable: this.recoverable,
      recoveryStrategy: this.recoveryStrategy,
      userMessage: this.userMessage,
      suggestedActions: this.suggestedActions,
      timestamp: this.timestamp,
      metadata: this.metadata,
      cause: this.cause,
      context: this.context,
      stack: this.stack
    };
  }

  copy(modifications?: Partial<ErrorOptions>): IError {
    return new CustomError(
      modifications?.message || this.message,
      { ...this, ...modifications }
    );
  }
}
```

### Extending Error Context

```typescript
interface ExtendedErrorContext extends IErrorContext {
  /** Request ID */
  requestId?: string;
  
  /** API version */
  apiVersion?: string;
  
  /** Client version */
  clientVersion?: string;
  
  /** Session data */
  sessionData?: Record<string, any>;
  
  /** Performance metrics */
  metrics?: {
    duration?: number;
    memoryUsage?: number;
    cpuUsage?: number;
  };
}
```

### Type-Safe Error Handling

```typescript
function handleError<T extends IError>(
  error: T,
  handler: (error: T) => void
): void {
  if (isIError(error)) {
    handler(error);
  } else {
    // Handle generic Error
    const standardError = errorHandler.handle(error);
    handler(standardError);
  }
}

// Usage
handleError(error, (err) => {
  if (err.category === ErrorCategory.NETWORK) {
    // Handle network error
  }
});
```
