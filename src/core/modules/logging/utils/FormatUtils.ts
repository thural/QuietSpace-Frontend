/**
 * Format Utilities
 * 
 * Message formatting and template utilities for logging.
 * Provides parameterized formatting and template processing.
 */

/**
 * Format options
 */
export interface IFormatOptions {
  /** Date format */
  dateFormat?: string;
  /** Number format */
  numberFormat?: Intl.NumberFormatOptions;
  /** Currency format */
  currencyFormat?: Intl.NumberFormatOptions & { currency: string };
  /** Custom formatters */
  customFormatters?: Record<string, (value: any) => string>;
}

/**
 * Template variables
 */
export interface ITemplateVariables {
  [key: string]: any;
}

/**
 * Format utilities class
 */
export class FormatUtils {
  private static defaultOptions: IFormatOptions = {
    dateFormat: 'ISO',
    numberFormat: { maximumFractionDigits: 2 },
    currencyFormat: { style: 'currency', currency: 'USD' }
  };

  /**
   * Format message with parameterized placeholders
   */
  static formatMessage(template: string, args: any[], options?: IFormatOptions): string {
    if (!template) return '';
    if (!args || args.length === 0) return template;

    const opts = { ...FormatUtils.defaultOptions, ...options };
    let result = template;
    let argIndex = 0;

    // Replace {} placeholders
    result = result.replace(/\{\}/g, () => {
      if (argIndex < args.length) {
        return FormatUtils.formatValue(args[argIndex++], opts);
      }
      return '{}';
    });

    // Replace numbered placeholders {0}, {1}, etc.
    result = result.replace(/\{(\d+)\}/g, (match, index) => {
      const idx = parseInt(index, 10);
      if (idx < args.length) {
        return FormatUtils.formatValue(args[idx], opts);
      }
      return match;
    });

    // Replace named placeholders {name}
    result = result.replace(/\{(\w+)\}/g, (match, name) => {
      if (opts.customFormatters && opts.customFormatters[name]) {
        return opts.customFormatters[name](args);
      }
      return match;
    });

    return result;
  }

  /**
   * Format individual value
   */
  static formatValue(value: any, options?: IFormatOptions): string {
    const opts = { ...FormatUtils.defaultOptions, ...options };

    if (value === null || value === undefined) {
      return 'null';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return FormatUtils.formatNumber(value, opts.numberFormat);
    }

    if (typeof value === 'boolean') {
      return value.toString();
    }

    if (value instanceof Date) {
      return FormatUtils.formatDate(value, opts.dateFormat);
    }

    if (Array.isArray(value)) {
      return `[${value.map(v => FormatUtils.formatValue(v, options)).join(', ')}]`;
    }

    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch (error) {
        return '[Object]';
      }
    }

    return String(value);
  }

  /**
   * Format date
   */
  static formatDate(date: Date, format?: string): string {
    if (!format || format === 'ISO') {
      return date.toISOString();
    }

    if (format === 'locale') {
      return date.toLocaleString();
    }

    if (format === 'locale-date') {
      return date.toLocaleDateString();
    }

    if (format === 'locale-time') {
      return date.toLocaleTimeString();
    }

    // Custom format
    return format
      .replace('YYYY', date.getFullYear().toString())
      .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
      .replace('DD', date.getDate().toString().padStart(2, '0'))
      .replace('HH', date.getHours().toString().padStart(2, '0'))
      .replace('mm', date.getMinutes().toString().padStart(2, '0'))
      .replace('ss', date.getSeconds().toString().padStart(2, '0'))
      .replace('SSS', date.getMilliseconds().toString().padStart(3, '0'));
  }

  /**
   * Format number
   */
  static formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    if (!options) {
      return number.toString();
    }

    try {
      return new Intl.NumberFormat(undefined, options).format(number);
    } catch (error) {
      return number.toString();
    }
  }

  /**
   * Format currency
   */
  static formatCurrency(amount: number, currency: string, options?: Intl.NumberFormatOptions): string {
    const currencyOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency,
      ...options
    };

    try {
      return new Intl.NumberFormat(undefined, currencyOptions).format(amount);
    } catch (error) {
      return `${currency} ${amount}`;
    }
  }

  /**
   * Format percentage
   */
  static formatPercentage(value: number, decimals: number = 2): string {
    return `${(value * 100).toFixed(decimals)}%`;
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Format duration
   */
  static formatDuration(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds.toFixed(2)}ms`;
    } else if (milliseconds < 60000) {
      return `${(milliseconds / 1000).toFixed(2)}s`;
    } else {
      const hours = Math.floor(milliseconds / 3600000);
      const minutes = Math.floor((milliseconds % 3600000) / 60000);
      const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
      
      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else {
        return `${minutes}m ${seconds}s`;
      }
    }
  }

  /**
   * Format template with variables
   */
  static formatTemplate(template: string, variables: ITemplateVariables): string {
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`\\$\\{${key}\\}`, 'g');
      result = result.replace(placeholder, String(value));
    }

    return result;
  }

  /**
   * Create template formatter
   */
  static createTemplateFormatter(defaultVariables: ITemplateVariables = {}) {
    return (template: string, variables: ITemplateVariables = {}) => {
      return FormatUtils.formatTemplate(template, { ...defaultVariables, ...variables });
    };
  }

  /**
   * Format error message
   */
  static formatError(error: Error, includeStack: boolean = false): string {
    let message = `${error.name}: ${error.message}`;

    if ('code' in error) {
      message += ` (Code: ${(error as any).code})`;
    }

    if (includeStack && error.stack) {
      message += `\n${error.stack}`;
    }

    return message;
  }

  /**
   * Format stack trace
   */
  static formatStackTrace(stack: string, maxLines: number = 10): string {
    const lines = stack.split('\n');
    
    if (lines.length <= maxLines) {
      return stack;
    }

    return lines.slice(0, maxLines).join('\n') + `\n... and ${lines.length - maxLines} more lines`;
  }

  /**
   * Format JSON for logging
   */
  static formatJson(obj: any, pretty: boolean = false, maxDepth: number = 5): string {
    try {
      if (pretty) {
        return JSON.stringify(obj, null, 2);
      } else {
        return JSON.stringify(obj);
      }
    } catch (error) {
      return '[Circular or unserializable object]';
    }
  }

  /**
   * Format array for logging
   */
  static formatArray(array: any[], maxItems: number = 10, maxItemLength: number = 100): string {
    if (array.length <= maxItems) {
      return `[${array.map(item => FormatUtils.truncateString(String(item), maxItemLength)).join(', ')}]`;
    }

    const displayed = array.slice(0, maxItems);
    const remaining = array.length - maxItems;
    
    return `[${displayed.map(item => FormatUtils.truncateString(String(item), maxItemLength)).join(', ')}, ... and ${remaining} more items]`;
  }

  /**
   * Truncate string
   */
  static truncateString(str: string, maxLength: number, suffix: string = '...'): string {
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Pad string to specified length
   */
  static padString(str: string, length: number, padChar: string = ' ', padLeft: boolean = true): string {
    if (str.length >= length) {
      return str;
    }

    const padLength = length - str.length;
    const padding = padChar.repeat(padLength);

    return padLeft ? padding + str : str + padding;
  }

  /**
   * Format log level with padding
   */
  static formatLogLevel(level: string, width: number = 8): string {
    return FormatUtils.padString(level.toUpperCase(), width, ' ', true);
  }

  /**
   * Format category with padding
   */
  static formatCategory(category: string, width: number = 20): string {
    return FormatUtils.padString(category, width, ' ', false);
  }

  /**
   * Create custom formatter
   */
  static createCustomFormatter(formatters: Record<string, (value: any) => string>) {
    return (template: string, args: any[]) => {
      return FormatUtils.formatMessage(template, args, { customFormatters: formatters });
    };
  }

  /**
   * Format SQL query (basic formatting)
   */
  static formatSql(sql: string, params?: any[]): string {
    let formatted = sql;

    if (params && params.length > 0) {
      // Replace ? placeholders with actual values
      let paramIndex = 0;
      formatted = formatted.replace(/\?/g, () => {
        if (paramIndex < params.length) {
          const value = params[paramIndex++];
          return typeof value === 'string' ? `'${value}'` : String(value);
        }
        return '?';
      });
    }

    return formatted;
  }

  /**
   * Format HTTP request/response
   */
  static formatHttp(
    method: string,
    url: string,
    statusCode?: number,
    duration?: number,
    responseSize?: number
  ): string {
    let result = `${method} ${url}`;

    if (statusCode) {
      result += ` -> ${statusCode}`;
    }

    if (duration) {
      result += ` (${FormatUtils.formatDuration(duration)})`;
    }

    if (responseSize) {
      result += ` [${FormatUtils.formatFileSize(responseSize)}]`;
    }

    return result;
  }

  /**
   * Format user agent string
   */
  static formatUserAgent(userAgent: string): string {
    // Basic user agent parsing
    const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/[\d.]+/);
    const osMatch = userAgent.match(/\(([^)]+)\)/);

    const browser = browserMatch ? browserMatch[1] : 'Unknown';
    const os = osMatch ? osMatch[1] : 'Unknown OS';

    return `${browser} on ${os}`;
  }

  /**
   * Format IP address with optional anonymization
   */
  static formatIpAddress(ip: string, anonymize: boolean = false): string {
    if (!anonymize) {
      return ip;
    }

    // Simple IP anonymization - replace last octet with 0
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = '0';
      return parts.join('.');
    }

    return ip;
  }
}
