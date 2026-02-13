/**
 * Logging Utilities
 * 
 * Common utility functions for logging operations.
 * Provides helper methods for formatting, validation, and manipulation.
 */

import { ILogEntry, ILoggingContext, LogLevel } from '../types';

/**
 * Utility class for logging operations
 */
export class LoggingUtils {
  /**
   * Generate unique ID for log entries
   */
  static generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `${timestamp}-${random}`;
  }

  /**
   * Format timestamp to ISO string
   */
  static formatTimestamp(date: Date): string {
    return date.toISOString();
  }

  /**
   * Format duration in human readable format
   */
  static formatDuration(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds.toFixed(2)}ms`;
    } else if (milliseconds < 60000) {
      return `${(milliseconds / 1000).toFixed(2)}s`;
    } else {
      const minutes = Math.floor(milliseconds / 60000);
      const seconds = ((milliseconds % 60000) / 1000).toFixed(2);
      return `${minutes}m ${seconds}s`;
    }
  }

  /**
   * Format file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Sanitize string for logging
   */
  static sanitizeString(str: string): string {
    return str
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'");
  }

  /**
   * Truncate string to specified length
   */
  static truncateString(str: string, maxLength: number, suffix: string = '...'): string {
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Deep clone object
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => LoggingUtils.deepClone(item)) as unknown as T;
    }

    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = LoggingUtils.deepClone(obj[key]);
      }
    }

    return cloned;
  }

  /**
   * Check if object is empty
   */
  static isEmpty(obj: any): boolean {
    if (obj == null) {
      return true;
    }

    if (Array.isArray(obj)) {
      return obj.length === 0;
    }

    if (typeof obj === 'object') {
      return Object.keys(obj).length === 0;
    }

    return false;
  }

  /**
   * Get object size (number of properties)
   */
  static getObjectSize(obj: any): number {
    if (obj == null) {
      return 0;
    }

    if (Array.isArray(obj)) {
      return obj.length;
    }

    if (typeof obj === 'object') {
      return Object.keys(obj).length;
    }

    return 1;
  }

  /**
   * Merge multiple objects
   */
  static merge<T extends Record<string, any>>(...objects: Partial<T>[]): T {
    return objects.reduce((result, obj) => {
      return { ...result, ...obj };
    }, {} as T);
  }

  /**
   * Pick specific properties from object
   */
  static pick<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  /**
   * Omit specific properties from object
   */
  static omit<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> {
    const result = { ...obj };
    for (const key of keys) {
      delete result[key];
    }
    return result as Omit<T, K>;
  }

  /**
   * Validate log entry
   */
  static validateLogEntry(entry: ILogEntry): boolean {
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
   * Validate logging context
   */
  static validateContext(context: any): boolean {
    if (context == null) {
      return true;
    }

    if (typeof context !== 'object') {
      return false;
    }

    return true;
  }

  /**
   * Extract error information
   */
  static extractErrorInfo(error: Error): {
    message: string;
    stack?: string;
    name: string;
    code?: string;
  } {
    const info = {
      message: error.message,
      name: error.name,
      stack: error.stack
    };

    // Extract error code if available
    if ('code' in error) {
      info.code = (error as any).code;
    }

    return info;
  }

  /**
   * Create error context
   */
  static createErrorContext(error: Error, additionalContext?: ILoggingContext): ILoggingContext {
    const errorInfo = LoggingUtils.extractErrorInfo(error);
    
    return {
      ...additionalContext,
      errorName: errorInfo.name,
      errorMessage: errorInfo.message,
      errorCode: errorInfo.code,
      hasStackTrace: !!errorInfo.stack
    };
  }

  /**
   * Format error for logging
   */
  static formatError(error: Error): string {
    const info = LoggingUtils.extractErrorInfo(error);
    let formatted = `${info.name}: ${info.message}`;
    
    if (info.code) {
      formatted += ` (Code: ${info.code})`;
    }
    
    if (info.stack) {
      formatted += `\nStack: ${info.stack}`;
    }
    
    return formatted;
  }

  /**
   * Get caller information
   */
  static getCallerInfo(skipFrames: number = 2): {
    function?: string;
    file?: string;
    line?: number;
    column?: number;
  } {
    const stack = new Error().stack;
    if (!stack) {
      return {};
    }

    const lines = stack.split('\n');
    const callerLine = lines[skipFrames + 1];
    
    if (!callerLine) {
      return {};
    }

    // Parse caller line format: "at functionName (file:line:column)"
    const match = callerLine.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
    
    if (match) {
      return {
        function: match[1] !== 'anonymous' ? match[1] : undefined,
        file: match[2],
        line: parseInt(match[3], 10),
        column: parseInt(match[4], 10)
      };
    }
    
    // Alternative format: "at file:line:column"
    const altMatch = callerLine.match(/at\s+(.+?):(\d+):(\d+)/);
    if (altMatch) {
      return {
        file: altMatch[1],
        line: parseInt(altMatch[2], 10),
        column: parseInt(altMatch[3], 10)
      };
    }
    
    return {};
  }

  /**
   * Create performance context
   */
  static createPerformanceContext(operationName: string, duration: number): ILoggingContext {
    return {
      action: 'performance',
      operation: operationName,
      duration,
      durationFormatted: LoggingUtils.formatDuration(duration)
    };
  }

  /**
   * Create user action context
   */
  static createUserActionContext(action: string, userId?: string, additionalData?: Record<string, any>): ILoggingContext {
    return {
      action: 'user_action',
      userAction: action,
      userId,
      timestamp: new Date().toISOString(),
      ...additionalData
    };
  }

  /**
   * Create API request context
   */
  static createApiContext(method: string, url: string, statusCode?: number, duration?: number): ILoggingContext {
    return {
      action: 'api_request',
      httpMethod: method,
      url,
      statusCode,
      duration,
      durationFormatted: duration ? LoggingUtils.formatDuration(duration) : undefined
    };
  }

  /**
   * Compare log levels
   */
  static compareLevels(level1: string, level2: string): number {
    const priorities: Record<string, number> = {
      TRACE: 0,
      DEBUG: 10,
      INFO: 20,
      AUDIT: 25,
      WARN: 30,
      METRICS: 35,
      ERROR: 40,
      SECURITY: 45,
      FATAL: 50
    };

    const priority1 = priorities[level1] ?? Number.MAX_SAFE_INTEGER;
    const priority2 = priorities[level2] ?? Number.MAX_SAFE_INTEGER;

    if (priority1 < priority2) return -1;
    if (priority1 > priority2) return 1;
    return 0;
  }

  /**
   * Check if level is enabled for threshold
   */
  static isLevelEnabled(level: string, threshold: string): boolean {
    return LoggingUtils.compareLevels(level, threshold) >= 0;
  }

  /**
   * Get level color for console output
   */
  static getLevelColor(level: string): string {
    const colors: Record<string, string> = {
      TRACE: '#6b7280', // Gray
      DEBUG: '#06b6d4', // Cyan
      INFO: '#10b981',  // Green
      AUDIT: '#3b82f6', // Blue
      WARN: '#f59e0b',  // Yellow
      METRICS: '#8b5cf6', // Purple
      ERROR: '#ef4444', // Red
      SECURITY: '#dc2626', // Dark Red
      FATAL: '#991b1b'   // Darker Red
    };

    return colors[level] || '#000000';
  }

  /**
   * Get level icon
   */
  static getLevelIcon(level: string): string {
    const icons: Record<string, string> = {
      TRACE: '🔍',
      DEBUG: '🐛',
      INFO: 'ℹ️',
      AUDIT: '📋',
      WARN: '⚠️',
      METRICS: '📊',
      ERROR: '❌',
      SECURITY: '🔒',
      FATAL: '💀'
    };

    return icons[level] || '📝';
  }

  /**
   * Create hash from string
   */
  static hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Debounce function
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttle function
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Retry function with exponential backoff
   */
  static async retry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
}
