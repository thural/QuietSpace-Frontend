# Logging System API Reference

This document provides detailed API reference for the centralized logging system.

## Table of Contents

- [Core Types](#core-types)
- [Logger Interface](#logger-interface)
- [Appender Interface](#appender-interface)
- [Layout Interface](#layout-interface)
- [Configuration Types](#configuration-types)
- [Security Types](#security-types)
- [React Hooks](#react-hooks)
- [Utility Functions](#utility-functions)
- [Constants](#constants)

## Core Types

### ILogEntry

```typescript
interface ILogEntry {
  /** Unique entry identifier */
  id: string;
  
  /** Timestamp when the log entry was created */
  timestamp: Date;
  
  /** Log level (TRACE, DEBUG, INFO, AUDIT, WARN, METRICS, ERROR, SECURITY, FATAL) */
  level: string;
  
  /** Logger category/name */
  category: string;
  
  /** Formatted log message */
  message: string;
  
  /** Original message template (before parameter replacement) */
  messageTemplate?: string;
  
  /** Arguments for parameterized logging */
  arguments?: any[];
  
  /** Logging context information */
  context?: ILoggingContext;
  
  /** Stack trace for errors */
  stackTrace?: string;
  
  /** Thread/async context identifier */
  thread?: string;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}
```

### ILoggingContext

```typescript
interface ILoggingContext {
  /** User identifier (anonymized for privacy) */
  userId?: string;
  
  /** Session identifier */
  sessionId?: string;
  
  /** Request identifier for distributed tracing */
  requestId?: string;
  
  /** Component name where logging occurred */
  component?: string;
  
  /** Action being performed */
  action?: string;
  
  /** Current route/path */
  route?: string;
  
  /** User agent string */
  userAgent?: string;
  
  /** Environment (development, staging, production) */
  environment?: string;
  
  /** Additional context data */
  additionalData?: Record<string, any>;
}
```

### ILogger

```typescript
interface ILogger {
  /** Logger category/name */
  readonly category: string;
  
  /** Current log level */
  readonly level: string;
  
  /** Check if a log level is enabled */
  isEnabled(level: string): boolean;
  
  /** Log at TRACE level */
  trace(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at DEBUG level */
  debug(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at INFO level */
  info(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at AUDIT level */
  audit(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at WARN level */
  warn(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at METRICS level */
  metrics(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at ERROR level */
  error(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at SECURITY level */
  security(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at FATAL level */
  fatal(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Generic log method */
  log(level: string, context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Set the log level */
  setLevel(level: string): void;
  
  /** Add an appender to this logger */
  addAppender(appender: IAppender): void;
  
  /** Remove an appender from this logger */
  removeAppender(appender: IAppender): void;
  
  /** Get all appenders for this logger */
  getAppenders(): IAppender[];
}
```

## Logger Interface

### Core Methods

#### Logging Methods

```typescript
// Standard logging methods
logger.trace(context?: ILoggingContext, message?: string, ...args: any[]): void;
logger.debug(context?: ILoggingContext, message?: string, ...args: any[]): void;
logger.info(context?: ILoggingContext, message?: string, ...args: any[]): void;
logger.warn(context?: ILoggingContext, message?: string, ...args: any[]): void;
logger.error(context?: ILoggingContext, message?: string, ...args: any[]): void;

// Specialized logging methods
logger.audit(context?: ILoggingContext, message?: string, ...args: any[]): void;
logger.metrics(context?: ILoggingContext, message?: string, ...args: any[]): void;
logger.security(context?: ILoggingContext, message?: string, ...args: any[]): void;
logger.fatal(context?: ILoggingContext, message?: string, ...args: any[]): void;
```

#### Configuration Methods

```typescript
// Level management
logger.setLevel('DEBUG');
logger.isEnabled('INFO'); // boolean

// Appender management
logger.addAppender(consoleAppender);
logger.removeAppender(remoteAppender);
logger.getAppenders(); // IAppender[]
```

#### Performance Methods

```typescript
// Performance monitoring wrappers
const result = logger.withPerformanceMonitoring(
  () => expensiveOperation(),
  'operation-name'
);

const asyncResult = await logger.withPerformanceMonitoringAsync(
  () => asyncOperation(),
  'async-operation'
);
```

### Usage Examples

```typescript
// Basic logging
logger.info('User logged in', { userId: 'user123' });

// Parameterized logging (performance optimized)
logger.info('User {} logged in from {}', userId, ipAddress);

// Performance monitoring
const result = logger.withPerformanceMonitoring(
  () => processLargeDataset(data),
  'data-processing'
);
```

## Appender Interface

### Core Methods

```typescript
interface IAppender {
  /** Appender name */
  readonly name: string;
  
  /** Layout used for formatting */
  readonly layout: ILayout;
  
  /** Whether appender is active */
  readonly active: boolean;
  
  /** Append a log entry */
  append(entry: ILogEntry): void;
  
  /** Start the appender */
  start(): Promise<void>;
  
  /** Stop the appender */
  stop(): Promise<void>;
  
  /** Configure the appender */
  configure(config: IAppenderConfig): void;
  
  /** Check if appender is ready */
  isReady(): boolean;
}
```

### Configuration

```typescript
interface IAppenderConfig {
  /** Appender name */
  name: string;
  
  /** Appender type (console, remote, memory, localStorage, etc.) */
  type: string;
  
  /** Whether appender is active */
  active: boolean;
  
  /** Layout configuration */
  layout?: ILayoutConfig;
  
  /** Appender-specific properties */
  properties?: Record<string, any>;
  
  /** Throttling configuration */
  throttling?: IThrottlingConfig;
  
  /** Retry configuration */
  retry?: IRetryConfig;
}
```

### Implementation Examples

#### Console Appender

```typescript
class ConsoleAppender extends BaseAppender {
  constructor(name: string, layout: ILayout, config: IAppenderConfig) {
    super(name, layout, config);
  }

  append(entry: ILogEntry): void {
    if (!this.isReady()) return;
    
    const formattedMessage = this.formatEntry(entry);
    this.writeToConsole(entry.level, formattedMessage);
  }

  private writeToConsole(level: string, message: string): void {
    switch (level) {
      case 'TRACE':
        console.trace(message);
        break;
      case 'DEBUG':
        console.debug(message);
        break;
      case 'INFO':
      case 'AUDIT':
        console.info(message);
        break;
      case 'WARN':
        console.warn(message);
        break;
      case 'ERROR':
      case 'SECURITY':
      case 'FATAL':
        console.error(message);
        break;
      default:
        console.log(message);
    }
  }
}
```

#### Remote Appender

```typescript
class RemoteAppender extends BaseAppender {
  private batch: ILogEntry[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private url: string;
  
  constructor(name: string, layout: ILayout, config: IRemoteAppenderConfig) {
    super(name, layout, config);
    this.url = config.url;
  }

  append(entry: ILogEntry): void {
    if (!this.isReady()) return;
    
    this.batch.push(entry);
    
    // Send batch when full or timer expires
    if (this.batch.length >= this.maxBatchSize || !this.batchTimer) {
      this.sendBatch();
    }
  }

  private async sendBatch(): Promise<void> {
    if (this.batch.length === 0) return;
    
    const batchToSend = [...this.batch];
    this.batch = [];
    
    try {
      await this.applyRetry(
        () => fetch(this.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            logs: batchToSend,
            timestamp: new Date().toISOString(),
            source: 'web-client'
          })
        }),
        'sendBatch'
      );
    } catch (error) {
      // Re-add failed entries to batch for retry
      this.batch.unshift(...batchToSend);
    }
  }
}
```

## Layout Interface

### Core Methods

```typescript
interface ILayout {
  /** Layout name */
  readonly name: string;
  
  /** Format a log entry to string */
  format(entry: ILogEntry): string;
  
  /** Configure the layout */
  configure(config: ILayoutConfig): void;
  
  /** Get content type */
  getContentType(): string;
}
```

### Configuration

```typescript
interface ILayoutConfig {
  /** Layout name */
  name: string;
  
  /** Layout type (json, pretty, grafana, custom) */
  type: string;
  
  /** Whether to include colors in output */
  includeColors?: boolean;
  
  /** Date format string */
  dateFormat?: string;
  
  /** Pattern/template for formatting */
  pattern?: string;
  
  /** Custom fields for formatting */
  fields?: Record<string, any>;
}
```

### Implementation Examples

#### JSON Layout

```typescript
class JsonLayout extends BaseLayout {
  format(entry: ILogEntry): string {
    const jsonEntry = {
      timestamp: entry.timestamp.toISOString(),
      level: entry.level,
      category: entry.category,
      message: entry.message,
      context: entry.context,
      metadata: entry.metadata
    };
    
    return JSON.stringify(jsonEntry);
  }
  
  getContentType(): string {
    return 'application/json';
  }
}
```

#### Pretty Layout

```typescript
class PrettyLayout extends BaseLayout {
  format(entry: ILogEntry): string {
    const timestamp = this.formatTimestamp(entry.timestamp);
    const level = this.formatLevel(entry.level);
    const category = this.formatCategory(entry.category);
    const message = entry.message;
    
    return `${timestamp} [${level}] ${category} - ${message}`;
  }
  
  private formatTimestamp(date: Date): string {
    return date.toTimeString();
  }
  
  private formatLevel(level: string): string {
    return level.padEnd(8);
  }
  
  private formatCategory(category: string): string {
    return category.padEnd(20);
  }
}
```

## Configuration Types

### ILoggingSystemConfig

```typescript
interface ILoggingSystemConfig {
  /** Default log level for the system */
  defaultLevel: string;
  
  /** Logger configurations by category */
  loggers: Record<string, ILoggerConfig>;
  
  /** Appender configurations by name */
  appenders: Record<string, IAppenderConfig>;
  
  /** Layout configurations by name */
  layouts: Record<string, ILayoutConfig>;
  
  /** Global properties available to all loggers */
  properties?: Record<string, any>;
  
  /** Security configuration */
  security?: ISecurityConfig;
  
  /** Performance configuration */
  performance?: IPerformanceConfig;
}
```

### ILoggerConfig

```typescript
interface ILoggerConfig {
  /** Logger category */
  category: string;
  
  /** Log level for this logger */
  level: string;
  
  /** Whether logger is additive (inherits from parent) */
  additive: boolean;
  
  /** Appender references for this logger */
  appenders: string[];
  
  /** Whether to include caller information */
  includeCaller: boolean;
  
  /** Custom properties for this logger */
  properties?: Record<string, any>;
}
```

### IAppenderConfig

```typescript
interface IAppenderConfig {
  /** Appender name */
  name: string;
  
  /** Appender type (console, remote, memory, localStorage, etc.) */
  type: string;
  
  /** Whether appender is active */
  active: boolean;
  
  /** Layout configuration */
  layout?: ILayoutConfig;
  
  /** Appender-specific properties */
  properties?: Record<string, any>;
  
  /** Throttling configuration */
  throttling?: IThrottlingConfig;
  
  /** Retry configuration */
  retry?: IRetryConfig;
}
```

### ILayoutConfig

```typescript
interface ILayoutConfig {
  /** Layout name */
  name: string;
  
  /** Layout type (json, pretty, grafana, custom) */
  type: string;
  
  /** Whether to include colors in output */
  includeColors?: boolean;
  
  /** Date format string */
  dateFormat?: string;
  
  /** Pattern/template for formatting */
  pattern?: string;
  
  /** Custom fields for formatting */
  fields?: Record<string, any>;
}
```

## Security Types

### ISecurityConfig

```typescript
interface ISecurityConfig {
  /** Whether to enable data sanitization */
  enableSanitization: boolean;
  
  /** Array of sensitive field names to mask */
  sensitiveFields: string[];
  
  /** Character to use for masking */
  maskChar: string;
  
  /** Whether to use partial masking (show first/last few characters) */
  partialMask: boolean;
  
  /** Custom sanitization rules */
  customRules?: ISanitizationRule[];
}
```

### ISanitizationRule

```typescript
interface ISanitizationRule {
  /** Rule name */
  name: string;
  
  /** Regular expression pattern to match */
  pattern: RegExp;
  
  /** Function to mask matched content */
  mask: (value: string) => string;
  
  /** Rule priority (higher priority = applied first) */
  priority: number;
}
```

### IComplianceConfig

```typescript
interface IComplianceConfig {
  /** Enable compliance features */
  enabled: boolean;
  
  /** Data retention period in days */
  dataRetentionDays: number;
  
  /** Require user consent for logging */
  requireConsent: boolean;
  
  /** Anonymize IP addresses */
  anonymizeIPs: boolean;
  
  /** Enable audit trail */
  enableAuditTrail: boolean;
  
  /** Restricted geographic regions */
  restrictedRegions: string[];
  
  /** Storage key for consent records */
  consentStorageKey: string;
}
```

### IConsentRecord

```typescript
interface IConsentRecord {
  /** User ID */
  userId: string;
  
  /** Whether consent is granted */
  granted: boolean;
  
  /** Consent timestamp */
  timestamp: Date;
  
  /** Consent version */
  version: string;
  
  /** IP address of consent */
  ipAddress?: string;
  
  /** User agent string */
  userAgent?: string;
}
```

### IAuditTrailEntry

```typescript
interface IAuditTrailEntry {
  /** Entry ID */
  id: string;
  
  /** Event timestamp */
  timestamp: Date;
  
  /** Action performed */
  action: string;
  
  /** User ID if applicable */
  userId?: string;
  
  /** Resource being accessed */
  resource?: string;
  
  /** Result of the action */
  result: 'success' | 'failure';
  
  /** Additional details */
  details?: Record<string, any>;
}
```

## React Hooks

### useLogger Hook

```typescript
interface UseLoggerOptions {
  /** Logger category */
  category: string;
  
  /** Default context to include with all log entries */
  defaultContext?: ILoggingContext;
  
  /** Enable performance monitoring */
  enablePerformanceMonitoring?: boolean;
  
  /** Auto-generate component context */
  autoComponentContext?: boolean;
}

interface UseLoggerResult {
  /** Logger instance */
  logger: ILogger;
  
  /** Logging methods with automatic context */
  trace: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  audit: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  metrics: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  security: (message: string, ...args: any[]) => void;
  fatal: (message: string, ...args: any[]) => void;
  
  /** Log with custom context */
  logWithContext: (level: string, context: ILoggingContext, message: string, ...args: any[]) => void;
  
  /** Performance monitoring wrapper */
  withPerformanceMonitoring: <T>(operation: () => T, operationName: string) => T;
  
  /** Async performance monitoring wrapper */
  withPerformanceMonitoringAsync: <T>(operation: () => Promise<T>, operationName: string) => Promise<T>;
}
```

### useLogRenders Hook

```typescript
interface UseLogRendersOptions {
  /** Component name for logging */
  componentName: string;
  
  /** Enable render time tracking */
  trackRenderTime?: boolean;
  
  /** Enable render count tracking */
  trackRenderCount?: boolean;
  
  /** Threshold for excessive renders per second */
  excessiveRenderThreshold?: number;
  
  /** Threshold for slow renders in ms */
  slowRenderThreshold?: number;
  
  /** Enable detailed logging */
  detailedLogging?: boolean;
}

interface RenderStats {
  /** Total render count */
  totalRenders: number;
  
  /** Renders in current second */
  rendersPerSecond: number;
  
  /** Average render time in ms */
  averageRenderTime: number;
  
  /** Last render time in ms */
  lastRenderTime: number;
  
  /** Maximum render time in ms */
  maxRenderTime: number;
  
  /** Whether excessive renders detected */
  excessiveRenders: boolean;
  
  /** Whether slow renders detected */
  slowRenders: boolean;
}
```

### Specialized Hooks

```typescript
// Component-specific logger
function useComponentLogger(componentName: string, additionalContext?: ILoggingContext): UseLoggerResult;

// Service-specific logger
function useServiceLogger(serviceName: string, additionalContext?: ILoggingContext): UseLoggerResult;

// API-specific logger
function useApiLogger(apiName: string, additionalContext?: ILoggingContext): UseLoggerResult;

// User action logger
function useUserActionLogger(userId?: string, sessionId?: string): UseLoggerResult;
```

## Utility Functions

### LoggingUtils

```typescript
class LoggingUtils {
  // Generate unique ID
  static generateId(): string;
  
  // Format timestamp
  static formatTimestamp(date: Date): string;
  
  // Format duration
  static formatDuration(milliseconds: number): string;
  
  // Format file size
  static formatFileSize(bytes: number): string;
  
  // Sanitize string
  static sanitizeString(str: string): string;
  
  // Deep clone object
  static deepClone<T>(obj: T): T;
  
  // Check if value is empty
  static isEmpty(obj: any): boolean;
  
  // Merge objects
  static merge<T extends Record<string, any>>(...objects: Partial<T>[]): T;
  
  // Pick specific properties
  static pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
  
  // Omit specific properties
  static omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
  
  // Extract error information
  static extractErrorInfo(error: Error): {
    message: string;
    stack?: string;
    name: string;
    code?: string;
  };
  
  // Create error context
  static createErrorContext(error: Error, additionalContext?: ILoggingContext): ILoggingContext;
  
  // Format error for logging
  static formatError(error: Error, includeStack?: boolean): string;
  
  // Get caller information
  static getCallerInfo(skipFrames?: number): {
    function?: string;
    file?: string;
    line?: number;
    column?: number;
  };
  
  // Create performance context
  static createPerformanceContext(operationName: string, duration: number): ILoggingContext;
  
  // Create user action context
  static createUserActionContext(action: string, userId?: string, additionalData?: Record<string, any>): ILoggingContext;
  
  // Create API request context
  static createApiContext(method: string, url: string, statusCode?: number, duration?: number): ILoggingContext;
}
```

### PerformanceUtils

```typescript
interface IPerformanceMeasurement {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface IPerformanceMetrics {
  totalMeasurements: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  totalDuration: number;
  measurementsPerSecond: number;
  memoryUsage?: IMemoryUsage;
}

class PerformanceUtils {
  // Start measurement
  static startMeasurement(name: string, metadata?: Record<string, any>): string;
  
  // End measurement
  static endMeasurement(id: string): IPerformanceMeasurement | null;
  
  // Measure async function
  static async measureAsync<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<{
    result: T;
    measurement: IPerformanceMeasurement;
  }>;
  
  // Measure synchronous function
  static measure<T>(name: string, fn: () => T, metadata?: Record<string, any>): {
    result: T;
    measurement: IPerformanceMeasurement;
  };
  
  // Get metrics
  static getMetrics(name: string): IPerformanceMetrics | null;
  
  // Get all metrics
  static getAllMetrics(): Record<string, IPerformanceMetrics>;
  
  // Clear measurements
  static clearMeasurements(name?: string): void;
  
  // Format duration
  static formatDuration(milliseconds: number): string;
  
  // Format bytes
  static formatBytes(bytes: number): string;
  
  // Create performance context
  static createPerformanceContext(name: string, duration: number): Record<string, any>;
  
  // Get performance summary
  static getPerformanceSummary(): {
    totalMeasurementNames: number;
    totalMeasurements: number;
    activeMeasurements: number;
    memoryUsage: IMemoryUsage | null;
    slowestOperations: Array<{ name: string; duration: number }>;
    fastestOperations: Array<{ name: string; duration: number }>;
  };
}
```

### FormatUtils

```typescript
interface IFormatOptions {
  dateFormat?: string;
  numberFormat?: Intl.NumberFormatOptions;
  currencyFormat?: Intl.NumberFormatOptions & { currency: string };
  customFormatters?: Record<string, (value: any) => string>;
}

class FormatUtils {
  // Format message with parameters
  static formatMessage(template: string, args: any[], options?: IFormatOptions): string;
  
  // Format individual value
  static formatValue(value: any, options?: IFormatOptions): string;
  
  // Format date
  static formatDate(date: Date, format?: string): string;
  
  // Format number
  static formatNumber(number: number, options?: Intl.NumberFormatOptions): string;
  
  // Format currency
  static formatCurrency(amount: number, currency: string, options?: Intl.NumberFormatOptions & { currency: string }): string;
  
  // Format percentage
  static formatPercentage(value: number, decimals?: number): string;
  
  // Format file size
  static formatFileSize(bytes: number): string;
  
  // Format duration
  static formatDuration(milliseconds: number): string;
  
  // Format template with variables
  static formatTemplate(template: string, variables: Record<string, any>): string;
  
  // Format error
  static formatError(error: Error, includeStack?: boolean): string;
  
  // Format stack trace
  static formatStackTrace(stack: string, maxLines?: number): string;
  
  // Format JSON
  static formatJson(obj: any, pretty?: boolean, maxDepth?: number): string;
  
  // Format array
  static formatArray(array: any[], maxItems?: number, maxItemLength?: number): string;
  
  // Truncate string
  static truncateString(str: string, maxLength: number, suffix?: string): string;
  
  // Pad string
  static padString(str: string, length: number, padChar?: string, padLeft?: boolean): string;
  
  // Format log level with padding
  static formatLogLevel(level: string, width?: number): string;
  
  // Format category with padding
  static formatCategory(category: string, width?: number): string;
}
```

### ValidationUtils

```typescript
interface IValidationOptions {
  strict?: boolean;
  maxStringLength?: number;
  maxObjectDepth?: number;
  maxArrayLength?: number;
  allowedCharacters?: RegExp;
  forbiddenPatterns?: RegExp[];
}

interface IValidationResult {
  valid: boolean;
  errors: IValidationError[];
  warnings: IValidationWarning[];
}

interface IValidationError {
  code: string;
  message: string;
  path: string;
  value?: any;
}

interface IValidationWarning {
  code: string;
  message: string;
  path: string;
  value?: any;
}

class ValidationUtils {
  // Validate log entry
  static validateLogEntry(entry: ILogEntry, options?: IValidationOptions): IValidationResult;
  
  // Validate context
  static validateContext(context: ILoggingContext, options?: IValidationOptions): IValidationResult;
  
  // Validate string
  static validateString(value: string, path: string, options?: IValidationOptions): IValidationResult;
  
  // Validate object
  static validateObject(obj: any, path: string, options?: IValidationOptions, depth?: number): IValidationResult;
  
  // Validate configuration
  static validateConfiguration(config: ILoggingSystemConfig): IValidationResult;
  
  // Check if log level is valid
  static isValidLogLevel(level: string): boolean;
  
  // Sanitize string
  static sanitizeString(str: string, options?: IValidationOptions): string;
  
  // Sanitize object
  static sanitizeObject(obj: any, options?: IValidationOptions, depth?: number): any;
  
  // Create custom validation rule
  static createValidationRule(
    name: string,
    description: string,
    validator: (value: any) => IValidationResult,
    priority: number
  ): IValidationRule;
  
  // Apply validation rules
  static applyValidationRules(value: any, rules: IValidationRule[]): IValidationResult;
  
  // Test sanitization
  static testSanitization(data: any): {
    original: any;
    sanitized: any;
    changed: boolean;
  };
}
```

## Constants

### Log Level Constants

```typescript
export const LOG_LEVEL_PRIORITIES = {
  TRACE: 0,
  DEBUG: 10,
  INFO: 20,
  AUDIT: 25,
  WARN: 30,
  METRICS: 35,
  ERROR: 40,
  SECURITY: 45,
  FATAL: 50
} as const;

export const LOG_LEVEL_NAMES = [
  'TRACE',
  'DEBUG',
  'INFO',
  'AUDIT',
  'WARN',
  'METRICS',
  'ERROR',
  'SECURITY',
  'FATAL'
] as const;
```

### Environment Configuration

```typescript
export const DEFAULT_LOG_LEVELS_BY_ENVIRONMENT = {
  development: 'DEBUG',
  test: 'ERROR',
  staging: 'INFO',
  production: 'WARN'
} as const;
```

### Error Messages

```typescript
export const GENERAL_ERROR_MESSAGES = {
  INVALID_CONFIGURATION: 'Invalid logging configuration',
  MISSING_REQUIRED_FIELD: 'Missing required field: {}',
  INVALID_VALUE: 'Invalid value for field {}: {}',
  OPERATION_FAILED: 'Operation failed: {}',
  INITIALIZATION_FAILED: 'Logging system initialization failed',
  SHUTDOWN_FAILED: 'Logging system shutdown failed',
  VALIDATION_FAILED: 'Validation failed: {}',
  PERMISSION_DENIED: 'Permission denied: {}',
  RESOURCE_NOT_FOUND: 'Resource not found: {}',
  TIMEOUT: 'Operation timed out after {}ms',
  NETWORK_ERROR: 'Network error: {}'
} as const;
```

---

## Usage Examples

### Basic Logger Usage

```typescript
import { getLogger } from '@/core/modules/logging';

const logger = getLogger('app.example');

// Basic logging
logger.info('Application started');
logger.warn('Using deprecated API');
logger.error('An error occurred', error);

// With context
logger.info(
  { userId: 'user123', action: 'login' },
  'User action completed'
);

// Parameterized logging
logger.info('User {} logged in from {}', userId, ipAddress);
```

### React Hook Usage

```typescript
import { useLogger } from '@/features/logging/hooks';

function MyComponent() {
  const logger = useLogger({
    category: 'app.components.MyComponent',
    enablePerformanceMonitoring: true
  });

  const handleClick = () => {
    logger.info('Button clicked', { buttonId: 'submit' });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### Performance Monitoring

```typescript
import { PerformanceUtils } from '@/core/modules/logging';

// Measure function performance
const { result, measurement } = PerformanceUtils.measure('data-processing', () => {
  return data.map(item => expensiveOperation(item));
});

// Async performance monitoring
const { result, measurement } = await PerformanceUtils.measureAsync('user-fetch', () => 
  fetch(`/api/users/${userId}`)
);
```

### Security Logging

```typescript
import { getLogger } from '@/core/modules/logging';

const securityLogger = getLogger('app.security');

securityLogger.security(
  { 
    userId: 'user123',
    ip: '192.168.1.100',
    action: 'login_attempt'
  },
  'Failed login attempt from IP {} for user {}',
  '192.168.1.100',
  'user123'
);
```

---

This API reference provides comprehensive documentation for all interfaces and types in the centralized logging system. For usage examples, see the examples directory.
