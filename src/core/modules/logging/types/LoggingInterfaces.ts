/**
 * Logging Interfaces
 * 
 * Core interfaces for the logging system following SLF4J and Log4j patterns.
 */

import { LogLevel } from './LogLevelTypes';

/**
 * Core logger interface (SLF4J-style facade)
 */
export interface ILogger {
  /** Logger category/name */
  readonly category: string;
  
  /** Current log level */
  readonly level: string;
  
  /** Check if level is enabled */
  isEnabled(level: string): boolean;
  
  /** Log at trace level */
  trace(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at debug level */
  debug(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at info level */
  info(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at audit level */
  audit(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at warn level */
  warn(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at metrics level */
  metrics(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at error level */
  error(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at security level */
  security(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Log at fatal level */
  fatal(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Generic log method */
  log(level: string, context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  /** Set log level */
  setLevel(level: string): void;
  
  /** Add appender */
  addAppender(appender: IAppender): void;
  
  /** Remove appender */
  removeAppender(appender: IAppender): void;
  
  /** Get all appenders */
  getAppenders(): IAppender[];
}

/**
 * Appender interface for log output destinations
 */
export interface IAppender {
  /** Appender name */
  readonly name: string;
  
  /** Layout for message formatting */
  readonly layout: ILayout;
  
  /** Whether appender is active */
  readonly active: boolean;
  
  /** Append log entry */
  append(entry: ILogEntry): void;
  
  /** Start appender */
  start(): Promise<void>;
  
  /** Stop appender */
  stop(): Promise<void>;
  
  /** Configure appender */
  configure(config: IAppenderConfig): void;
  
  /** Check if appender is ready */
  isReady(): boolean;
}

/**
 * Layout interface for message formatting
 */
export interface ILayout {
  /** Layout name */
  readonly name: string;
  
  /** Format log entry to string */
  format(entry: ILogEntry): string;
  
  /** Configure layout */
  configure(config: ILayoutConfig): void;
  
  /** Get content type */
  getContentType(): string;
}

/**
 * Log entry interface
 */
export interface ILogEntry {
  /** Unique entry ID */
  id: string;
  
  /** Timestamp */
  timestamp: Date;
  
  /** Log level */
  level: string;
  
  /** Logger category */
  category: string;
  
  /** Formatted message */
  message: string;
  
  /** Original message template */
  messageTemplate?: string;
  
  /** Message arguments */
  arguments?: any[];
  
  /** Logging context */
  context?: ILoggingContext;
  
  /** Stack trace for errors */
  stackTrace?: string;
  
  /** Thread/async context */
  thread?: string;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Logging context interface
 */
export interface ILoggingContext {
  /** User ID (anonymized) */
  userId?: string;
  
  /** Session ID */
  sessionId?: string;
  
  /** Request ID */
  requestId?: string;
  
  /** Component name */
  component?: string;
  
  /** Action being performed */
  action?: string;
  
  /** Route/path */
  route?: string;
  
  /** User agent */
  userAgent?: string;
  
  /** Environment */
  environment?: string;
  
  /** Additional context data */
  additionalData?: Record<string, any>;
}

/**
 * Logger configuration interface
 */
export interface ILoggerConfig {
  /** Logger category */
  category: string;
  
  /** Log level */
  level: string;
  
  /** Whether logger is additive */
  additive: boolean;
  
  /** Appender references */
  appenders: string[];
  
  /** Whether to include caller info */
  includeCaller: boolean;
  
  /** Custom properties */
  properties?: Record<string, any>;
}

/**
 * Appender configuration interface
 */
export interface IAppenderConfig {
  /** Appender name */
  name: string;
  
  /** Appender type */
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

/**
 * Layout configuration interface
 */
export interface ILayoutConfig {
  /** Layout name */
  name: string;
  
  /** Layout type */
  type: string;
  
  /** Pattern/template */
  pattern?: string;
  
  /** Whether to include colors */
  includeColors?: boolean;
  
  /** Date format */
  dateFormat?: string;
  
  /** Custom fields */
  fields?: Record<string, any>;
}

/**
 * Throttling configuration
 */
export interface IThrottlingConfig {
  /** Maximum entries per batch */
  maxBatchSize?: number;
  
  /** Maximum time between batches (ms) */
  maxInterval?: number;
  
  /** Maximum entries per second */
  maxPerSecond?: number;
  
  /** Whether to drop excess entries */
  dropExcess?: boolean;
}

/**
 * Retry configuration
 */
export interface IRetryConfig {
  /** Maximum retry attempts */
  maxAttempts?: number;
  
  /** Initial delay (ms) */
  initialDelay?: number;
  
  /** Backoff multiplier */
  backoffMultiplier?: number;
  
  /** Maximum delay (ms) */
  maxDelay?: number;
  
  /** Whether to use exponential backoff */
  exponentialBackoff?: boolean;
}

/**
 * Logging manager interface
 */
export interface ILoggingManager {
  /** Get logger by category */
  getLogger(category: string): ILogger;
  
  /** Register logger */
  registerLogger(logger: ILogger): void;
  
  /** Unregister logger */
  unregisterLogger(category: string): void;
  
  /** Get all loggers */
  getAllLoggers(): ILogger[];
  
  /** Configure logging system */
  configure(config: ILoggingSystemConfig): void;
  
  /** Get current configuration */
  getConfiguration(): ILoggingSystemConfig;
  
  /** Shutdown logging system */
  shutdown(): Promise<void>;
}

/**
 * Logging system configuration
 */
export interface ILoggingSystemConfig {
  /** Default log level */
  defaultLevel: string;
  
  /** Logger configurations */
  loggers: Record<string, ILoggerConfig>;
  
  /** Appender configurations */
  appenders: Record<string, IAppenderConfig>;
  
  /** Layout configurations */
  layouts: Record<string, ILayoutConfig>;
  
  /** Global properties */
  properties?: Record<string, any>;
  
  /** Security configuration */
  security?: ISecurityConfig;
  
  /** Performance configuration */
  performance?: IPerformanceConfig;
}

/**
 * Security configuration
 */
export interface ISecurityConfig {
  /** Whether to enable sanitization */
  enableSanitization: boolean;
  
  /** Sensitive field patterns */
  sensitiveFields: string[];
  
  /** Mask character */
  maskChar: string;
  
  /** Whether to mask partial values */
  partialMask: boolean;
  
  /** Custom sanitization rules */
  customRules?: ISanitizationRule[];
}

/**
 * Sanitization rule
 */
export interface ISanitizationRule {
  /** Rule name */
  name: string;
  
  /** Field pattern (regex) */
  pattern: RegExp;
  
  /** Mask function */
  mask: (value: string) => string;
  
  /** Rule priority */
  priority: number;
}

/**
 * Performance configuration
 */
export interface IPerformanceConfig {
  /** Whether to enable lazy evaluation */
  enableLazyEvaluation: boolean;
  
  /** Maximum message length */
  maxMessageLength?: number;
  
  /** Whether to enable batching */
  enableBatching: boolean;
  
  /** Performance monitoring */
  monitoring?: {
    /** Whether to track performance metrics */
    enabled: boolean;
    /** Sampling rate (0-1) */
    sampleRate: number;
  };
}

/**
 * Logger factory interface
 */
export interface ILoggerFactory {
  /** Create logger instance */
  createLogger(category: string, config?: ILoggerConfig): ILogger;
  
  /** Create appender instance */
  createAppender(config: IAppenderConfig): IAppender;
  
  /** Create layout instance */
  createLayout(config: ILayoutConfig): ILayout;
  
  /** Register custom appender type */
  registerAppenderType(type: string, factory: (config: IAppenderConfig) => IAppender): void;
  
  /** Register custom layout type */
  registerLayoutType(type: string, factory: (config: ILayoutConfig) => ILayout): void;
}

/**
 * Log event interface
 */
export interface ILogEvent {
  /** Event type */
  type: 'log_created' | 'log_processed' | 'appender_error' | 'configuration_changed';
  
  /** Event timestamp */
  timestamp: Date;
  
  /** Event data */
  data: any;
  
  /** Source component */
  source: string;
}
