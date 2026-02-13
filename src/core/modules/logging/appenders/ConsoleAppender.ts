/**
 * Console Appender
 * 
 * Appender that outputs log entries to the browser console.
 * Supports both pretty and JSON output formats.
 */

import { IAppender, ILayout, ILogEntry, IAppenderConfig } from '../types';
import { BaseAppender } from '../classes/BaseAppender';

/**
 * Console appender implementation
 */
export class ConsoleAppender extends BaseAppender {
  private _useColors: boolean = true;
  private _usePrettyFormat: boolean = true;

  constructor(name: string, layout: ILayout, config: IAppenderConfig) {
    super(name, layout, config);
    this._useColors = config.properties?.useColors ?? true;
    this._usePrettyFormat = config.properties?.usePrettyFormat ?? true;
  }

  /**
   * Start appender
   */
  async start(): Promise<void> {
    this._active = true;
  }

  /**
   * Stop appender
   */
  async stop(): Promise<void> {
    this._active = false;
  }

  /**
   * Append log entry to console
   */
  append(entry: ILogEntry): void {
    if (!this.isReady() || this.shouldThrottle()) {
      return;
    }

    try {
      const formattedMessage = this.formatEntry(entry);
      this.writeToConsole(entry.level, formattedMessage);
    } catch (error) {
      this.handleError(error as Error, entry);
    }
  }

  /**
   * Write message to appropriate console method
   */
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
      case 'METRICS':
        console.info(message); // Use info for metrics
        break;
      default:
        console.log(message);
    }
  }

  /**
   * Check if throttling should be applied
   */
  protected shouldThrottle(): boolean {
    // Console appender typically doesn't need throttling
    return false;
  }

  /**
   * Get console-specific configuration
   */
  getConsoleConfig(): {
    useColors: boolean;
    usePrettyFormat: boolean;
  } {
    return {
      useColors: this._useColors,
      usePrettyFormat: this._usePrettyFormat
    };
  }

  /**
   * Set color usage
   */
  setUseColors(enabled: boolean): void {
    this._useColors = enabled;
    this._config.properties = {
      ...this._config.properties,
      useColors: enabled
    };
  }

  /**
   * Set pretty format usage
   */
  setUsePrettyFormat(enabled: boolean): void {
    this._usePrettyFormat = enabled;
    this._config.properties = {
      ...this._config.properties,
      usePrettyFormat: enabled
    };
  }

  /**
   * Check if colors are enabled
   */
  isUsingColors(): boolean {
    return this._useColors;
  }

  /**
   * Check if pretty format is enabled
   */
  isUsingPrettyFormat(): boolean {
    return this._usePrettyFormat;
  }
}
