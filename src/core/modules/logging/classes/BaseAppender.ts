/**
 * Base Appender Class
 * 
 * Abstract base class for all appender implementations.
 * Provides common functionality and enforces the IAppender interface.
 */

import { IAppender, ILayout, ILogEntry, IAppenderConfig, IThrottlingConfig, IRetryConfig } from '../types';

/**
 * Abstract base appender implementation
 */
export abstract class BaseAppender implements IAppender {
  public readonly name: string;
  protected _layout: ILayout;
  protected _active: boolean = false;
  protected _config: IAppenderConfig;
  protected _throttlingConfig?: IThrottlingConfig;
  protected _retryConfig?: IRetryConfig;
  protected _errorCount: number = 0;
  protected _lastError?: Error;

  constructor(name: string, layout: ILayout, config: IAppenderConfig) {
    this.name = name;
    this._layout = layout;
    this._config = config;
    this._throttlingConfig = config.throttling;
    this._retryConfig = config.retry;
  }

  get layout(): ILayout {
    return this._layout;
  }

  get active(): boolean {
    return this._active;
  }

  get config(): IAppenderConfig {
    return { ...this._config };
  }

  /**
   * Append log entry (to be implemented by subclasses)
   */
  abstract append(entry: ILogEntry): void;

  /**
   * Start appender (to be implemented by subclasses)
   */
  abstract start(): Promise<void>;

  /**
   * Stop appender (to be implemented by subclasses)
   */
  abstract stop(): Promise<void>;

  /**
   * Check if appender is ready
   */
  isReady(): boolean {
    return this._active && this._layout !== undefined;
  }

  /**
   * Configure appender
   */
  configure(config: IAppenderConfig): void {
    this._config = { ...this._config, ...config };
    
    if (config.layout) {
      this._layout.configure(config.layout);
    }
    
    this._throttlingConfig = config.throttling;
    this._retryConfig = config.retry;
    
    // Update active status
    this._active = config.active ?? true;
  }

  /**
   * Set layout
   */
  setLayout(layout: ILayout): void {
    this._layout = layout;
  }

  /**
   * Get error statistics
   */
  getErrorStats(): { count: number; lastError?: Error } {
    return {
      count: this._errorCount,
      lastError: this._lastError
    };
  }

  /**
   * Reset error statistics
   */
  resetErrorStats(): void {
    this._errorCount = 0;
    this._lastError = undefined;
  }

  /**
   * Handle appender error
   */
  protected handleError(error: Error, entry?: ILogEntry): void {
    this._errorCount++;
    this._lastError = error;
    
    // Log error to console as fallback
    console.error(`Appender ${this.name} error:`, error);
    if (entry) {
      console.error('Failed to process entry:', entry);
    }
  }

  /**
   * Check if throttling should be applied
   */
  protected shouldThrottle(): boolean {
    if (!this._throttlingConfig) return false;
    
    // Implementation depends on specific throttling strategy
    // This is a basic check - subclasses can override
    return false;
  }

  /**
   * Apply retry logic
   */
  protected async applyRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    if (!this._retryConfig) {
      return operation();
    }

    const maxAttempts = this._retryConfig.maxAttempts ?? 3;
    const initialDelay = this._retryConfig.initialDelay ?? 1000;
    const maxDelay = this._retryConfig.maxDelay ?? 10000;
    const exponentialBackoff = this._retryConfig.exponentialBackoff ?? true;

    let lastError: Error;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) {
          this.handleError(lastError);
          throw lastError;
        }

        // Wait before retry
        await this.delay(delay);
        
        // Calculate next delay
        if (exponentialBackoff) {
          delay = Math.min(delay * 2, maxDelay);
        } else {
          delay = Math.min(delay + initialDelay, maxDelay);
        }
      }
    }

    throw lastError!;
  }

  /**
   * Delay helper
   */
  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Format log entry using layout
   */
  protected formatEntry(entry: ILogEntry): string {
    try {
      return this._layout.format(entry);
    } catch (error) {
      this.handleError(error as Error, entry);
      // Fallback to simple JSON format
      return JSON.stringify(entry);
    }
  }

  /**
   * Validate log entry
   */
  protected validateEntry(entry: ILogEntry): boolean {
    return (
      entry &&
      typeof entry.id === 'string' &&
      entry.timestamp instanceof Date &&
      typeof entry.level === 'string' &&
      typeof entry.category === 'string' &&
      typeof entry.message === 'string'
    );
  }

  /**
   * Get appender status
   */
  getStatus(): {
    name: string;
    active: boolean;
    ready: boolean;
    errorCount: number;
    lastError?: Error;
    layout: string;
  } {
    return {
      name: this.name,
      active: this._active,
      ready: this.isReady(),
      errorCount: this._errorCount,
      lastError: this._lastError,
      layout: this._layout.name
    };
  }

  /**
   * Cleanup resources
   */
  protected cleanup(): void {
    this._active = false;
    this.resetErrorStats();
  }
}
