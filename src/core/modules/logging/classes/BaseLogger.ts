/**
 * Base Logger Class
 * 
 * Abstract base class for all logger implementations.
 * Provides common functionality and enforces the ILogger interface.
 */

import { ILogger, IAppender, ILogEntry, ILoggingContext, ILoggerConfig } from '../types';
import { LogLevel, getLevelPriority } from '../types/LogLevelTypes';
import { LoggingContext } from '../types/LoggingContext';

/**
 * Abstract base logger implementation
 */
export abstract class BaseLogger implements ILogger {
  public readonly category: string;
  protected _level: string;
  protected _appenders: IAppender[] = [];
  protected _config: ILoggerConfig;
  protected _includeCaller: boolean;
  protected _properties: Record<string, any> = {};

  constructor(category: string, config: ILoggerConfig) {
    this.category = category;
    this._config = config;
    this._level = config.level;
    this._includeCaller = config.includeCaller ?? false;
    this._properties = config.properties || {};
  }

  get level(): string {
    return this._level;
  }

  isEnabled(level: string): boolean {
    return getLevelPriority(level) >= getLevelPriority(this._level);
  }

  trace(context?: ILoggingContext, message?: string, ...args: any[]): void {
    this.log('TRACE', context, message, ...args);
  }

  debug(context?: ILoggingContext, message?: string, ...args: any[]): void {
    this.log('DEBUG', context, message, ...args);
  }

  info(context?: ILoggingContext, message?: string, ...args: any[]): void {
    this.log('INFO', context, message, ...args);
  }

  audit(context?: ILoggingContext, message?: string, ...args: any[]): void {
    this.log('AUDIT', context, message, ...args);
  }

  warn(context?: ILoggingContext, message?: string, ...args: any[]): void {
    this.log('WARN', context, message, ...args);
  }

  metrics(context?: ILoggingContext, message?: string, ...args: any[]): void {
    this.log('METRICS', context, message, ...args);
  }

  error(context?: ILoggingContext, message?: string, ...args: any[]): void {
    this.log('ERROR', context, message, ...args);
  }

  security(context?: ILoggingContext, message?: string, ...args: any[]): void {
    this.log('SECURITY', context, message, ...args);
  }

  fatal(context?: ILoggingContext, message?: string, ...args: any[]): void {
    this.log('FATAL', context, message, ...args);
  }

  log(level: string, context?: ILoggingContext, message?: string, ...args: any[]): void {
    if (!this.isEnabled(level)) {
      return;
    }

    const logEntry = this.createLogEntry(level, context, message, args);
    this.processLogEntry(logEntry);
  }

  setLevel(level: string): void {
    this._level = level;
  }

  addAppender(appender: IAppender): void {
    if (!this._appenders.includes(appender)) {
      this._appenders.push(appender);
    }
  }

  removeAppender(appender: IAppender): void {
    const index = this._appenders.indexOf(appender);
    if (index > -1) {
      this._appenders.splice(index, 1);
    }
  }

  getAppenders(): IAppender[] {
    return [...this._appenders];
  }

  /**
   * Create log entry from parameters
   */
  protected createLogEntry(
    level: string,
    context?: ILoggingContext,
    message?: string,
    args?: any[]
  ): ILogEntry {
    const timestamp = new Date();
    const formattedMessage = this.formatMessage(message, args);
    
    // Merge context with logger properties
    const mergedContext = this.mergeContext(context);
    
    return {
      id: this.generateEntryId(),
      timestamp,
      level,
      category: this.category,
      message: formattedMessage,
      messageTemplate: message,
      arguments: args,
      context: mergedContext,
      stackTrace: this.getStackTrace(),
      thread: this.getCurrentThread(),
      metadata: this.createMetadata()
    };
  }

  /**
   * Process log entry (send to appenders)
   */
  protected processLogEntry(entry: ILogEntry): void {
    for (const appender of this._appenders) {
      if (appender.isReady()) {
        try {
          appender.append(entry);
        } catch (error) {
          // Handle appender errors gracefully
          this.handleAppenderError(appender, error, entry);
        }
      }
    }
  }

  /**
   * Format message with arguments (SLF4J-style parameterized logging)
   */
  protected formatMessage(message?: string, args?: any[]): string {
    if (!message) return '';
    if (!args || args.length === 0) return message;

    return message.replace(/\{\}/g, () => {
      const arg = args.shift();
      return arg !== undefined ? String(arg) : 'null';
    });
  }

  /**
   * Merge context with logger properties
   */
  protected mergeContext(context?: ILoggingContext): ILoggingContext {
    const baseContext = new LoggingContext({
      ...this._properties,
      component: this.category
    });

    if (context) {
      return baseContext.merge(context);
    }

    return baseContext;
  }

  /**
   * Generate unique entry ID
   */
  protected generateEntryId(): string {
    return `${this.category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get stack trace if caller info is enabled
   */
  protected getStackTrace(): string | undefined {
    if (!this._includeCaller) return undefined;

    const stack = new Error().stack;
    if (stack) {
      // Remove the first few lines to get the actual caller
      const lines = stack.split('\n');
      return lines.slice(4).join('\n');
    }
    return undefined;
  }

  /**
   * Get current thread/async context
   */
  protected getCurrentThread(): string {
    // In browser environment, use a simple thread identifier
    return 'main';
  }

  /**
   * Create metadata for log entry
   */
  protected createMetadata(): Record<string, any> {
    return {
      ...this._properties,
      loggerVersion: '1.0.0',
      timestamp: Date.now()
    };
  }

  /**
   * Handle appender errors
   */
  protected handleAppenderError(appender: IAppender, error: any, entry: ILogEntry): void {
    // Try to log the error to console as fallback
    console.error(`Appender error in ${appender.name}:`, error);
    console.error('Failed to log entry:', entry);
  }

  /**
   * Update logger configuration
   */
  updateConfig(config: Partial<ILoggerConfig>): void {
    this._config = { ...this._config, ...config };
    
    if (config.level) {
      this.setLevel(config.level);
    }
    
    if (config.includeCaller !== undefined) {
      this._includeCaller = config.includeCaller;
    }
    
    if (config.properties) {
      this._properties = { ...this._properties, ...config.properties };
    }
  }

  /**
   * Get logger configuration
   */
  getConfig(): ILoggerConfig {
    return { ...this._config };
  }

  /**
   * Check if logger has any appenders
   */
  hasAppenders(): boolean {
    return this._appenders.length > 0;
  }

  /**
   * Clear all appenders
   */
  clearAppenders(): void {
    this._appenders = [];
  }
}
