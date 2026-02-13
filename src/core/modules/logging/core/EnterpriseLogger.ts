/**
 * Enterprise Logger
 * 
 * Main logger implementation with SLF4J-style parameterized logging
 * and performance optimization features.
 */

import { ILogger, IAppender, ILogEntry, ILoggingContext, ILoggerConfig } from '../types';
import { BaseLogger } from '../classes/BaseLogger';
import { getLevelPriority } from '../types/LogLevelTypes';
import { LoggingContext, ContextUtils } from '../types/LoggingContext';

/**
 * Enterprise logger implementation with advanced features
 */
export class EnterpriseLogger extends BaseLogger {
  private _performanceMode: boolean = false;
  private _sanitizationEnabled: boolean = false;
  private _maxMessageLength?: number;
  private _lazyEvaluation: boolean = true;

  constructor(category: string, config: ILoggerConfig) {
    super(category, config);
    this._performanceMode = config.properties?.performanceMode ?? false;
    this._sanitizationEnabled = config.properties?.sanitizationEnabled ?? false;
    this._maxMessageLength = config.properties?.maxMessageLength;
    this._lazyEvaluation = config.properties?.lazyEvaluation ?? true;
  }

  /**
   * Enhanced log method with performance optimization and sanitization
   */
  log(level: string, context?: ILoggingContext, message?: string, ...args: any[]): void {
    // Early exit if level is disabled (performance optimization)
    if (!this.isEnabled(level)) {
      return;
    }

    // Lazy evaluation - only create log entry if needed
    if (this._lazyEvaluation) {
      this.logWithLazyEvaluation(level, context, message, args);
    } else {
      super.log(level, context, message, ...args);
    }
  }

  /**
   * Performance-optimized logging with lazy evaluation
   */
  private logWithLazyEvaluation(
    level: string,
    context?: ILoggingContext,
    message?: string,
    args?: any[]
  ): void {
    try {
      // Create log entry only when needed
      const logEntry = this.createOptimizedLogEntry(level, context, message, args);
      this.processLogEntry(logEntry);
    } catch (error) {
      // Handle logging errors gracefully
      this.handleLoggingError(error, level, message);
    }
  }

  /**
   * Create optimized log entry
   */
  private createOptimizedLogEntry(
    level: string,
    context?: ILoggingContext,
    message?: string,
    args?: any[]
  ): ILogEntry {
    const timestamp = new Date();
    
    // Format message with performance optimization
    const formattedMessage = this.formatMessageOptimized(message, args);
    
    // Apply message length limit
    const truncatedMessage = this.truncateMessage(formattedMessage);
    
    // Sanitize context if enabled
    const sanitizedContext = this._sanitizationEnabled 
      ? ContextUtils.sanitize(context || {})
      : context;
    
    // Merge context with logger properties
    const mergedContext = this.mergeContext(sanitizedContext);
    
    return {
      id: this.generateEntryId(),
      timestamp,
      level,
      category: this.category,
      message: truncatedMessage,
      messageTemplate: message,
      arguments: args,
      context: mergedContext,
      stackTrace: this.getStackTrace(),
      thread: this.getCurrentThread(),
      metadata: this.createOptimizedMetadata()
    };
  }

  /**
   * Optimized message formatting
   */
  private formatMessageOptimized(message?: string, args?: any[]): string {
    if (!message) return '';
    if (!args || args.length === 0) return message;

    // Use simple string replacement for performance
    let result = message;
    let argIndex = 0;
    
    const placeholderRegex = /\{\}/g;
    let match;
    
    while ((match = placeholderRegex.exec(result)) !== null && argIndex < args.length) {
      const arg = args[argIndex++];
      const replacement = arg !== undefined ? String(arg) : 'null';
      result = result.replace(match[0], replacement);
      // Reset regex lastIndex to handle overlapping matches
      placeholderRegex.lastIndex = 0;
    }
    
    return result;
  }

  /**
   * Truncate message if it exceeds maximum length
   */
  private truncateMessage(message: string): string {
    if (!this._maxMessageLength || message.length <= this._maxMessageLength) {
      return message;
    }
    
    return message.substring(0, this._maxMessageLength - 3) + '...';
  }

  /**
   * Create optimized metadata
   */
  private createOptimizedMetadata(): Record<string, any> {
    const baseMetadata = super.createMetadata();
    
    return {
      ...baseMetadata,
      performanceMode: this._performanceMode,
      sanitizationEnabled: this._sanitizationEnabled,
      lazyEvaluation: this._lazyEvaluation
    };
  }

  /**
   * Handle logging errors
   */
  private handleLoggingError(error: any, level: string, message?: string): void {
    // Try to log error to console as fallback
    console.error(`Logger ${this.category} error at ${level} level:`, error);
    if (message) {
      console.error('Original message:', message);
    }
  }

  /**
   * Performance monitoring wrapper
   */
  withPerformanceMonitoring<T>(
    operation: () => T,
    operationName: string
  ): T {
    if (!this._performanceMode) {
      return operation();
    }

    const startTime = performance.now();
    try {
      const result = operation();
      const duration = performance.now() - startTime;
      
      // Log performance metrics
      this.metrics(
        { component: this.category, action: 'performance' },
        'Operation {} completed in {}ms',
        operationName,
        duration.toFixed(2)
      );
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      // Log performance metrics with error
      this.error(
        { component: this.category, action: 'performance' },
        'Operation {} failed in {}ms: {}',
        operationName,
        duration.toFixed(2),
        error
      );
      
      throw error;
    }
  }

  /**
   * Async performance monitoring wrapper
   */
  async withPerformanceMonitoringAsync<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    if (!this._performanceMode) {
      return operation();
    }

    const startTime = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      // Log performance metrics
      this.metrics(
        { component: this.category, action: 'performance' },
        'Async operation {} completed in {}ms',
        operationName,
        duration.toFixed(2)
      );
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      // Log performance metrics with error
      this.error(
        { component: this.category, action: 'performance' },
        'Async operation {} failed in {}ms: {}',
        operationName,
        duration.toFixed(2),
        error
      );
      
      throw error;
    }
  }

  /**
   * Enable/disable performance mode
   */
  setPerformanceMode(enabled: boolean): void {
    this._performanceMode = enabled;
    this._properties.performanceMode = enabled;
  }

  /**
   * Enable/disable sanitization
   */
  setSanitizationEnabled(enabled: boolean): void {
    this._sanitizationEnabled = enabled;
    this._properties.sanitizationEnabled = enabled;
  }

  /**
   * Set maximum message length
   */
  setMaxMessageLength(length?: number): void {
    this._maxMessageLength = length;
    this._properties.maxMessageLength = length;
  }

  /**
   * Enable/disable lazy evaluation
   */
  setLazyEvaluation(enabled: boolean): void {
    this._lazyEvaluation = enabled;
    this._properties.lazyEvaluation = enabled;
  }

  /**
   * Get logger statistics
   */
  getStatistics(): {
    category: string;
    level: string;
    appenderCount: number;
    performanceMode: boolean;
    sanitizationEnabled: boolean;
    lazyEvaluation: boolean;
    maxMessageLength?: number;
  } {
    return {
      category: this.category,
      level: this._level,
      appenderCount: this._appenders.length,
      performanceMode: this._performanceMode,
      sanitizationEnabled: this._sanitizationEnabled,
      lazyEvaluation: this._lazyEvaluation,
      maxMessageLength: this._maxMessageLength
    };
  }

  /**
   * Create child logger with additional context
   */
  createChild(childCategory: string, additionalContext?: ILoggingContext): EnterpriseLogger {
    const childConfig: ILoggerConfig = {
      ...this._config,
      category: childCategory,
      properties: {
        ...this._properties,
        ...additionalContext,
        parentCategory: this.category
      }
    };

    const childLogger = new EnterpriseLogger(childCategory, childConfig);
    
    // Copy appenders from parent
    for (const appender of this._appenders) {
      childLogger.addAppender(appender);
    }
    
    return childLogger;
  }

  /**
   * Check if logger is in performance mode
   */
  isPerformanceMode(): boolean {
    return this._performanceMode;
  }

  /**
   * Check if sanitization is enabled
   */
  isSanitizationEnabled(): boolean {
    return this._sanitizationEnabled;
  }

  /**
   * Get maximum message length
   */
  getMaxMessageLength(): number | undefined {
    return this._maxMessageLength;
  }

  /**
   * Check if lazy evaluation is enabled
   */
  isLazyEvaluationEnabled(): boolean {
    return this._lazyEvaluation;
  }
}
