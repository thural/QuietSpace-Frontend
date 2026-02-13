/**
 * Security Filters
 * 
 * Provides configurable security filters for logging data protection.
 * Implements field-level filtering and conditional logging rules.
 */

import { ILoggingContext, ILogEntry } from '../types';
import { DataSanitizer } from './DataSanitizer';

/**
 * Security filter configuration
 */
export interface ISecurityFilter {
  /** Filter name */
  name: string;
  /** Filter priority */
  priority: number;
  /** Filter function */
  filter: (entry: ILogEntry) => ILogEntry | null;
  /** Whether filter is enabled */
  enabled: boolean;
}

/**
 * Security filters implementation
 */
export class SecurityFilters {
  private _filters: ISecurityFilter[] = [];
  private _sanitizer: DataSanitizer;
  private _enabled: boolean = true;

  constructor(sanitizer: DataSanitizer) {
    this._sanitizer = sanitizer;
    this.initializeDefaultFilters();
  }

  /**
   * Apply all security filters to log entry
   */
  applyFilters(entry: ILogEntry): ILogEntry | null {
    if (!this._enabled) {
      return entry;
    }

    let filteredEntry = entry;

    // Apply filters in priority order
    const sortedFilters = [...this._filters]
      .filter(filter => filter.enabled)
      .sort((a, b) => b.priority - a.priority);

    for (const filter of sortedFilters) {
      const result = filter.filter(filteredEntry);
      if (result === null) {
        // Filter out this entry completely
        return null;
      }
      filteredEntry = result;
    }

    return filteredEntry;
  }

  /**
   * Add security filter
   */
  addFilter(filter: ISecurityFilter): void {
    this._filters.push(filter);
  }

  /**
   * Remove filter by name
   */
  removeFilter(name: string): void {
    this._filters = this._filters.filter(filter => filter.name !== name);
  }

  /**
   * Get filter by name
   */
  getFilter(name: string): ISecurityFilter | undefined {
    return this._filters.find(filter => filter.name === name);
  }

  /**
   * Enable/disable filter
   */
  setFilterEnabled(name: string, enabled: boolean): void {
    const filter = this.getFilter(name);
    if (filter) {
      filter.enabled = enabled;
    }
  }

  /**
   * Get all filters
   */
  getFilters(): ISecurityFilter[] {
    return [...this._filters];
  }

  /**
   * Enable/disable all filters
   */
  setEnabled(enabled: boolean): void {
    this._enabled = enabled;
  }

  /**
   * Check if filters are enabled
   */
  isEnabled(): boolean {
    return this._enabled;
  }

  /**
   * Initialize default security filters
   */
  private initializeDefaultFilters(): void {
    // PII sanitization filter
    this.addFilter({
      name: 'pii-sanitization',
      priority: 100,
      enabled: true,
      filter: (entry) => this.sanitizePII(entry)
    });

    // High-security level filter
    this.addFilter({
      name: 'high-security-filter',
      priority: 90,
      enabled: true,
      filter: (entry) => this.filterHighSecurity(entry)
    });

    // User data protection filter
    this.addFilter({
      name: 'user-data-protection',
      priority: 80,
      enabled: true,
      filter: (entry) => this.protectUserData(entry)
    });

    // Sensitive operation filter
    this.addFilter({
      name: 'sensitive-operation-filter',
      priority: 70,
      enabled: true,
      filter: (entry) => this.filterSensitiveOperations(entry)
    });

    // Data volume filter
    this.addFilter({
      name: 'data-volume-filter',
      priority: 60,
      enabled: true,
      filter: (entry) => this.filterDataVolume(entry)
    });
  }

  /**
   * Sanitize PII in log entry
   */
  private sanitizePII(entry: ILogEntry): ILogEntry {
    const sanitizedEntry = { ...entry };

    // Sanitize message
    if (sanitizedEntry.message) {
      sanitizedEntry.message = this._sanitizer.sanitize(sanitizedEntry.message);
    }

    // Sanitize context
    if (sanitizedEntry.context) {
      sanitizedEntry.context = this._sanitizer.sanitize(sanitizedEntry.context);
    }

    // Sanitize metadata
    if (sanitizedEntry.metadata) {
      sanitizedEntry.metadata = this._sanitizer.sanitize(sanitizedEntry.metadata);
    }

    return sanitizedEntry;
  }

  /**
   * Filter high-security level logs
   */
  private filterHighSecurity(entry: ILogEntry): ILogEntry | null {
    if (entry.level === 'SECURITY' || entry.level === 'FATAL') {
      // For high-security levels, remove sensitive context
      const filteredEntry = { ...entry };
      
      if (filteredEntry.context) {
        filteredEntry.context = {
          component: filteredEntry.context.component,
          action: filteredEntry.context.action
        };
      }

      // Remove metadata for security logs
      delete filteredEntry.metadata;

      return filteredEntry;
    }

    return entry;
  }

  /**
   * Protect user data
   */
  private protectUserData(entry: ILogEntry): ILogEntry | null {
    if (entry.context?.userId) {
      // For logs with user data, apply stricter filtering
      const filteredEntry = { ...entry };

      // Remove potentially sensitive fields from context
      if (filteredEntry.context) {
        const { userId, sessionId, component, action } = filteredEntry.context;
        filteredEntry.context = { userId, sessionId, component, action };
      }

      // Limit message length for user data logs
      if (filteredEntry.message && filteredEntry.message.length > 500) {
        filteredEntry.message = filteredEntry.message.substring(0, 500) + '...';
      }

      return filteredEntry;
    }

    return entry;
  }

  /**
   * Filter sensitive operations
   */
  private filterSensitiveOperations(entry: ILogEntry): ILogEntry | null {
    const sensitiveActions = [
      'login', 'logout', 'password_change', 'auth',
      'payment', 'transaction', 'admin', 'delete'
    ];

    if (entry.context?.action) {
      const action = entry.context.action.toLowerCase();
      
      if (sensitiveActions.some(sensitive => action.includes(sensitive))) {
        // For sensitive operations, remove stack trace and limit data
        const filteredEntry = { ...entry };
        
        // Remove stack trace for security
        delete filteredEntry.stackTrace;
        
        // Limit metadata
        if (filteredEntry.metadata) {
          const { timestamp, ...sanitizedMetadata } = filteredEntry.metadata;
          filteredEntry.metadata = sanitizedMetadata;
        }

        return filteredEntry;
      }
    }

    return entry;
  }

  /**
   * Filter data volume
   */
  private filterDataVolume(entry: ILogEntry): ILogEntry | null {
    const maxMessageLength = 1000;
    const maxContextSize = 50; // number of keys

    let shouldFilter = false;
    const filteredEntry = { ...entry };

    // Check message length
    if (filteredEntry.message && filteredEntry.message.length > maxMessageLength) {
      filteredEntry.message = filteredEntry.message.substring(0, maxMessageLength) + '...';
      shouldFilter = true;
    }

    // Check context size
    if (filteredEntry.context) {
      const contextKeys = Object.keys(filteredEntry.context);
      if (contextKeys.length > maxContextSize) {
        // Keep only essential keys
        const essentialKeys = ['component', 'action', 'userId', 'sessionId'];
        filteredEntry.context = {};
        
        for (const key of essentialKeys) {
          if (filteredEntry.context[key as keyof typeof filteredEntry.context]) {
            filteredEntry.context[key as keyof typeof filteredEntry.context] = 
              filteredEntry.context[key as keyof typeof filteredEntry.context];
          }
        }
        shouldFilter = true;
      }
    }

    // Check metadata size
    if (filteredEntry.metadata) {
      const metadataString = JSON.stringify(filteredEntry.metadata);
      if (metadataString.length > maxMessageLength) {
        delete filteredEntry.metadata;
        shouldFilter = true;
      }
    }

    // Add metadata about filtering
    if (shouldFilter) {
      filteredEntry.metadata = {
        ...filteredEntry.metadata,
        securityFiltered: true,
        filterReason: 'data_volume'
      };
    }

    return filteredEntry;
  }

  /**
   * Get filter statistics
   */
  getStatistics(): {
    enabled: boolean;
    totalFilters: number;
    enabledFilters: number;
    filters: Array<{ name: string; enabled: boolean; priority: number }>;
  } {
    const enabledFilters = this._filters.filter(filter => filter.enabled).length;

    return {
      enabled: this._enabled,
      totalFilters: this._filters.length,
      enabledFilters,
      filters: this._filters.map(filter => ({
        name: filter.name,
        enabled: filter.enabled,
        priority: filter.priority
      }))
    };
  }

  /**
   * Test filters on sample entry
   */
  testFilters(entry: ILogEntry): {
    original: ILogEntry;
    filtered: ILogEntry | null;
    filteredOut: boolean;
    changes: string[];
  } {
    const original = { ...entry };
    const filtered = this.applyFilters(entry);
    const filteredOut = filtered === null;
    
    const changes: string[] = [];
    
    if (!filteredOut) {
      if (original.message !== filtered.message) {
        changes.push('message');
      }
      if (JSON.stringify(original.context) !== JSON.stringify(filtered.context)) {
        changes.push('context');
      }
      if (JSON.stringify(original.metadata) !== JSON.stringify(filtered.metadata)) {
        changes.push('metadata');
      }
    }

    return { original, filtered, filteredOut, changes };
  }
}
