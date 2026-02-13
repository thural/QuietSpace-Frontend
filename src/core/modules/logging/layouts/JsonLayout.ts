/**
 * JSON Layout
 * 
 * Layout that formats log entries as structured JSON.
 * Optimized for log aggregation systems like Grafana/Loki.
 */

import { ILayout, ILogEntry, ILayoutConfig } from '../types';
import { BaseLayout } from '../classes/BaseLayout';

/**
 * JSON layout implementation
 */
export class JsonLayout extends BaseLayout {
  private _includeStackTrace: boolean = true;
  private _includeContext: boolean = true;
  private _includeMetadata: boolean = true;
  private _prettyPrint: boolean = false;
  private _fieldOrder?: string[];

  constructor(name: string, config: ILayoutConfig) {
    super(name, config);
    this._includeStackTrace = config.properties?.includeStackTrace ?? true;
    this._includeContext = config.properties?.includeContext ?? true;
    this._includeMetadata = config.properties?.includeMetadata ?? true;
    this._prettyPrint = config.properties?.prettyPrint ?? false;
    this._fieldOrder = config.properties?.fieldOrder;
  }

  /**
   * Format log entry as JSON
   */
  format(entry: ILogEntry): string {
    if (!this.validateEntry(entry)) {
      return '';
    }

    const jsonEntry = this.buildJsonEntry(entry);
    
    try {
      return JSON.stringify(jsonEntry, null, this._prettyPrint ? 2 : 0);
    } catch (error) {
      // Fallback to simple JSON
      return JSON.stringify({
        timestamp: entry.timestamp.toISOString(),
        level: entry.level,
        category: entry.category,
        message: entry.message,
        error: 'Failed to serialize entry'
      });
    }
  }

  /**
   * Build JSON entry object
   */
  private buildJsonEntry(entry: ILogEntry): Record<string, any> {
    const jsonEntry: Record<string, any> = {};

    // Add fields in specified order or default order
    const fieldOrder = this._fieldOrder || [
      'timestamp',
      'level',
      'category',
      'message',
      'context',
      'metadata',
      'stackTrace',
      'thread',
      'id'
    ];

    for (const field of fieldOrder) {
      switch (field) {
        case 'timestamp':
          jsonEntry.timestamp = entry.timestamp.toISOString();
          break;
        case 'level':
          jsonEntry.level = entry.level;
          break;
        case 'category':
          jsonEntry.category = entry.category;
          break;
        case 'message':
          jsonEntry.message = entry.message;
          break;
        case 'context':
          if (this._includeContext && entry.context) {
            jsonEntry.context = entry.context;
          }
          break;
        case 'metadata':
          if (this._includeMetadata && entry.metadata) {
            jsonEntry.metadata = entry.metadata;
          }
          break;
        case 'stackTrace':
          if (this._includeStackTrace && entry.stackTrace) {
            jsonEntry.stackTrace = this.formatStackTrace(entry.stackTrace);
          }
          break;
        case 'thread':
          if (entry.thread) {
            jsonEntry.thread = entry.thread;
          }
          break;
        case 'id':
          jsonEntry.id = entry.id;
          break;
        default:
          // Add custom fields from metadata
          if (entry.metadata && entry.metadata[field]) {
            jsonEntry[field] = entry.metadata[field];
          }
      }
    }

    // Add custom fields
    if (this._fields) {
      Object.assign(jsonEntry, this._fields);
    }

    return jsonEntry;
  }

  /**
   * Format stack trace
   */
  private formatStackTrace(stackTrace: string): string {
    if (!this._prettyPrint) {
      return stackTrace;
    }

    // Pretty format stack trace
    return stackTrace
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  }

  /**
   * Get content type
   */
  getContentType(): string {
    return 'application/json';
  }

  /**
   * Configure layout
   */
  configure(config: ILayoutConfig): void {
    super.configure(config);
    
    if (config.properties) {
      this._includeStackTrace = config.properties.includeStackTrace ?? this._includeStackTrace;
      this._includeContext = config.properties.includeContext ?? this._includeContext;
      this._includeMetadata = config.properties.includeMetadata ?? this._includeMetadata;
      this._prettyPrint = config.properties.prettyPrint ?? this._prettyPrint;
      this._fieldOrder = config.properties.fieldOrder ?? this._fieldOrder;
    }
  }

  /**
   * Get JSON-specific configuration
   */
  getJsonConfig(): {
    includeStackTrace: boolean;
    includeContext: boolean;
    includeMetadata: boolean;
    prettyPrint: boolean;
    fieldOrder?: string[];
  } {
    return {
      includeStackTrace: this._includeStackTrace,
      includeContext: this._includeContext,
      includeMetadata: this._includeMetadata,
      prettyPrint: this._prettyPrint,
      fieldOrder: this._fieldOrder
    };
  }

  /**
   * Set stack trace inclusion
   */
  setIncludeStackTrace(enabled: boolean): void {
    this._includeStackTrace = enabled;
  }

  /**
   * Set context inclusion
   */
  setIncludeContext(enabled: boolean): void {
    this._includeContext = enabled;
  }

  /**
   * Set metadata inclusion
   */
  setIncludeMetadata(enabled: boolean): void {
    this._includeMetadata = enabled;
  }

  /**
   * Set pretty print
   */
  setPrettyPrint(enabled: boolean): void {
    this._prettyPrint = enabled;
  }

  /**
   * Set field order
   */
  setFieldOrder(order: string[]): void {
    this._fieldOrder = [...order];
  }

  /**
   * Check if stack trace is included
   */
  isStackTraceIncluded(): boolean {
    return this._includeStackTrace;
  }

  /**
   * Check if context is included
   */
  isContextIncluded(): boolean {
    return this._includeContext;
  }

  /**
   * Check if metadata is included
   */
  isMetadataIncluded(): boolean {
    return this._includeMetadata;
  }

  /**
   * Check if pretty print is enabled
   */
  isPrettyPrintEnabled(): boolean {
    return this._prettyPrint;
  }

  /**
   * Get field order
   */
  getFieldOrder(): string[] | undefined {
    return this._fieldOrder ? [...this._fieldOrder] : undefined;
  }
}
