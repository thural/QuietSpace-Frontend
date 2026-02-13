/**
 * Base Layout Class
 * 
 * Abstract base class for all layout implementations.
 * Provides common functionality and enforces the ILayout interface.
 */

import { ILayout, ILogEntry, ILayoutConfig } from '../types';

/**
 * Abstract base layout implementation
 */
export abstract class BaseLayout implements ILayout {
  public readonly name: string;
  protected _config: ILayoutConfig;
  protected _includeColors: boolean;
  protected _dateFormat: string;
  protected _pattern?: string;
  protected _fields: Record<string, any> = {};

  constructor(name: string, config: ILayoutConfig) {
    this.name = name;
    this._config = config;
    this._includeColors = config.includeColors ?? false;
    this._dateFormat = config.dateFormat ?? 'ISO';
    this._pattern = config.pattern;
    this._fields = config.fields ?? {};
  }

  /**
   * Format log entry (to be implemented by subclasses)
   */
  abstract format(entry: ILogEntry): string;

  /**
   * Get content type
   */
  getContentType(): string {
    return 'text/plain';
  }

  /**
   * Configure layout
   */
  configure(config: ILayoutConfig): void {
    this._config = { ...this._config, ...config };
    
    if (config.includeColors !== undefined) {
      this._includeColors = config.includeColors;
    }
    
    if (config.dateFormat) {
      this._dateFormat = config.dateFormat;
    }
    
    if (config.pattern) {
      this._pattern = config.pattern;
    }
    
    if (config.fields) {
      this._fields = { ...this._fields, ...config.fields };
    }
  }

  /**
   * Format timestamp
   */
  protected formatTimestamp(timestamp: Date): string {
    switch (this._dateFormat) {
      case 'ISO':
        return timestamp.toISOString();
      case 'UNIX':
        return timestamp.getTime().toString();
      case 'LOCAL':
        return timestamp.toLocaleString();
      default:
        // Custom format - basic implementation
        return this.customDateFormat(timestamp, this._dateFormat);
    }
  }

  /**
   * Custom date format (basic implementation)
   */
  protected customDateFormat(date: Date, format: string): string {
    return format
      .replace('YYYY', date.getFullYear().toString())
      .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
      .replace('DD', date.getDate().toString().padStart(2, '0'))
      .replace('HH', date.getHours().toString().padStart(2, '0'))
      .replace('mm', date.getMinutes().toString().padStart(2, '0'))
      .replace('ss', date.getSeconds().toString().padStart(2, '0'));
  }

  /**
   * Format level with colors if enabled
   */
  protected formatLevel(level: string): string {
    if (!this._includeColors) {
      return level;
    }

    const colors = {
      TRACE: '\x1b[90m', // Gray
      DEBUG: '\x1b[36m', // Cyan
      INFO: '\x1b[32m',  // Green
      AUDIT: '\x1b[34m', // Blue
      WARN: '\x1b[33m',  // Yellow
      METRICS: '\x1b[35m', // Magenta
      ERROR: '\x1b[31m', // Red
      SECURITY: '\x1b[41m\x1b[37m', // Red background, white text
      FATAL: '\x1b[41m\x1b[97m'  // Red background, bright white text
    };

    const reset = '\x1b[0m';
    const color = colors[level as keyof typeof colors] || '';
    
    return `${color}${level}${reset}`;
  }

  /**
   * Format message with proper escaping
   */
  protected formatMessage(message: string): string {
    // Escape newlines for single-line formats
    return message.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
  }

  /**
   * Format context object
   */
  protected formatContext(context?: Record<string, any>): string {
    if (!context || Object.keys(context).length === 0) {
      return '';
    }

    try {
      return JSON.stringify(context);
    } catch (error) {
      return '[Circular]';
    }
  }

  /**
   * Format metadata object
   */
  protected formatMetadata(metadata?: Record<string, any>): string {
    if (!metadata || Object.keys(metadata).length === 0) {
      return '';
    }

    try {
      return JSON.stringify(metadata);
    } catch (error) {
      return '[Circular]';
    }
  }

  /**
   * Format stack trace
   */
  protected formatStackTrace(stackTrace?: string): string {
    if (!stackTrace) {
      return '';
    }

    // Limit stack trace length for performance
    const maxLines = 10;
    const lines = stackTrace.split('\n');
    
    if (lines.length <= maxLines) {
      return stackTrace;
    }

    return lines.slice(0, maxLines).join('\n') + '\n...';
  }

  /**
   * Replace placeholders in pattern
   */
  protected replacePattern(pattern: string, entry: ILogEntry): string {
    const replacements: Record<string, string> = {
      '%d': this.formatTimestamp(entry.timestamp),
      '%level': entry.level,
      '%category': entry.category,
      '%message': entry.message,
      '%thread': entry.thread || 'main',
      '%id': entry.id
    };

    let result = pattern;
    
    for (const [placeholder, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    }

    return result;
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
   * Get layout configuration
   */
  getConfig(): ILayoutConfig {
    return { ...this._config };
  }

  /**
   * Check if colors are enabled
   */
  isColorEnabled(): boolean {
    return this._includeColors;
  }

  /**
   * Enable/disable colors
   */
  setColorEnabled(enabled: boolean): void {
    this._includeColors = enabled;
  }

  /**
   * Get date format
   */
  getDateFormat(): string {
    return this._dateFormat;
  }

  /**
   * Set date format
   */
  setDateFormat(format: string): void {
    this._dateFormat = format;
  }

  /**
   * Get pattern
   */
  getPattern(): string | undefined {
    return this._pattern;
  }

  /**
   * Set pattern
   */
  setPattern(pattern: string): void {
    this._pattern = pattern;
  }

  /**
   * Get custom fields
   */
  getFields(): Record<string, any> {
    return { ...this._fields };
  }

  /**
   * Set custom fields
   */
  setFields(fields: Record<string, any>): void {
    this._fields = { ...fields };
  }

  /**
   * Add custom field
   */
  addField(name: string, value: any): void {
    this._fields[name] = value;
  }

  /**
   * Remove custom field
   */
  removeField(name: string): void {
    delete this._fields[name];
  }
}
