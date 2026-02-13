/**
 * Validation Utilities
 * 
 * Input validation and sanitization utilities for logging.
 * Provides validation for log entries, contexts, and configurations.
 */

import { ILogEntry, ILoggingContext, ILoggingSystemConfig, IValidationResult, IValidationError, IValidationWarning } from '../types';

/**
 * Validation rule interface
 */
export interface IValidationRule {
  /** Rule name */
  name: string;
  /** Rule description */
  description: string;
  /** Validation function */
  validate: (value: any) => IValidationResult;
  /** Rule priority */
  priority: number;
}

/**
 * Validation options
 */
export interface IValidationOptions {
  /** Enable strict validation */
  strict?: boolean;
  /** Maximum string length */
  maxStringLength?: number;
  /** Maximum object depth */
  maxObjectDepth?: number;
  /** Maximum array length */
  maxArrayLength?: number;
  /** Allowed characters in strings */
  allowedCharacters?: RegExp;
  /** Forbidden patterns */
  forbiddenPatterns?: RegExp[];
}

/**
 * Validation utilities class
 */
export class ValidationUtils {
  private static defaultOptions: IValidationOptions = {
    strict: false,
    maxStringLength: 10000,
    maxObjectDepth: 10,
    maxArrayLength: 1000,
    forbiddenPatterns: [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
      /javascript:/gi, // JavaScript URLs
      /data:text\/html/gi // Data URLs with HTML
    ]
  };

  /**
   * Validate log entry
   */
  static validateLogEntry(entry: ILogEntry, options?: IValidationOptions): IValidationResult {
    const opts = { ...ValidationUtils.defaultOptions, ...options };
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    // Validate required fields
    if (!entry.id) {
      errors.push({
        code: 'MISSING_ID',
        message: 'Log entry ID is required',
        path: 'id'
      });
    }

    if (!entry.timestamp) {
      errors.push({
        code: 'MISSING_TIMESTAMP',
        message: 'Log entry timestamp is required',
        path: 'timestamp'
      });
    } else if (!(entry.timestamp instanceof Date)) {
      errors.push({
        code: 'INVALID_TIMESTAMP',
        message: 'Timestamp must be a Date object',
        path: 'timestamp'
      });
    }

    if (!entry.level) {
      errors.push({
        code: 'MISSING_LEVEL',
        message: 'Log level is required',
        path: 'level'
      });
    } else if (!ValidationUtils.isValidLogLevel(entry.level)) {
      errors.push({
        code: 'INVALID_LEVEL',
        message: 'Invalid log level',
        path: 'level'
      });
    }

    if (!entry.category) {
      errors.push({
        code: 'MISSING_CATEGORY',
        message: 'Log category is required',
        path: 'category'
      });
    }

    if (!entry.message) {
      errors.push({
        code: 'MISSING_MESSAGE',
        message: 'Log message is required',
        path: 'message'
      });
    } else {
      const messageValidation = ValidationUtils.validateString(entry.message, 'message', opts);
      errors.push(...messageValidation.errors);
      warnings.push(...messageValidation.warnings);
    }

    // Validate optional fields
    if (entry.context) {
      const contextValidation = ValidationUtils.validateContext(entry.context, opts);
      errors.push(...contextValidation.errors);
      warnings.push(...contextValidation.warnings);
    }

    if (entry.metadata) {
      const metadataValidation = ValidationUtils.validateObject(entry.metadata, 'metadata', opts);
      errors.push(...metadataValidation.errors);
      warnings.push(...metadataValidation.warnings);
    }

    if (entry.stackTrace) {
      const stackValidation = ValidationUtils.validateString(entry.stackTrace, 'stackTrace', opts);
      errors.push(...stackValidation.errors);
      warnings.push(...stackValidation.warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate logging context
   */
  static validateContext(context: ILoggingContext, options?: IValidationOptions): IValidationResult {
    const opts = { ...ValidationUtils.defaultOptions, ...options };
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    if (typeof context !== 'object' || context === null) {
      errors.push({
        code: 'INVALID_CONTEXT',
        message: 'Context must be an object',
        path: 'context'
      });
      return { valid: false, errors, warnings };
    }

    // Validate context fields
    for (const [key, value] of Object.entries(context)) {
      const fieldPath = `context.${key}`;
      
      if (typeof value === 'string') {
        const stringValidation = ValidationUtils.validateString(value, fieldPath, opts);
        errors.push(...stringValidation.errors);
        warnings.push(...stringValidation.warnings);
      } else if (typeof value === 'object' && value !== null) {
        const objectValidation = ValidationUtils.validateObject(value, fieldPath, opts);
        errors.push(...objectValidation.errors);
        warnings.push(...objectValidation.warnings);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate string value
   */
  static validateString(value: string, path: string, options?: IValidationOptions): IValidationResult {
    const opts = { ...ValidationUtils.defaultOptions, ...options };
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    if (opts.maxStringLength && value.length > opts.maxStringLength) {
      warnings.push({
        code: 'STRING_TOO_LONG',
        message: `String exceeds maximum length of ${opts.maxStringLength}`,
        path
      });
    }

    if (opts.forbiddenPatterns) {
      for (const pattern of opts.forbiddenPatterns) {
        if (pattern.test(value)) {
          errors.push({
            code: 'FORBIDDEN_PATTERN',
            message: `String contains forbidden pattern: ${pattern.source}`,
            path
          });
        }
      }
    }

    if (opts.allowedCharacters && !opts.allowedCharacters.test(value)) {
      warnings.push({
        code: 'INVALID_CHARACTERS',
        message: 'String contains invalid characters',
        path
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate object value
   */
  static validateObject(obj: any, path: string, options?: IValidationOptions, depth: number = 0): IValidationResult {
    const opts = { ...ValidationUtils.defaultOptions, ...options };
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    if (depth > (opts.maxObjectDepth || 10)) {
      errors.push({
        code: 'MAX_DEPTH_EXCEEDED',
        message: `Object depth exceeds maximum of ${opts.maxObjectDepth}`,
        path
      });
      return { valid: false, errors, warnings };
    }

    if (Array.isArray(obj)) {
      if (opts.maxArrayLength && obj.length > opts.maxArrayLength) {
        warnings.push({
          code: 'ARRAY_TOO_LONG',
          message: `Array length exceeds maximum of ${opts.maxArrayLength}`,
          path
        });
      }

      // Validate array items
      for (let i = 0; i < Math.min(obj.length, 100); i++) {
        const itemValidation = ValidationUtils.validateValue(obj[i], `${path}[${i}]`, opts, depth + 1);
        errors.push(...itemValidation.errors);
        warnings.push(...itemValidation.warnings);
      }
    } else if (typeof obj === 'object' && obj !== null) {
      // Validate object properties
      const keys = Object.keys(obj);
      if (keys.length > 100) {
        warnings.push({
          code: 'TOO_MANY_PROPERTIES',
          message: 'Object has too many properties',
          path
        });
      }

      for (const key of keys.slice(0, 100)) {
        const valueValidation = ValidationUtils.validateValue(obj[key], `${path}.${key}`, opts, depth + 1);
        errors.push(...valueValidation.errors);
        warnings.push(...valueValidation.warnings);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate any value
   */
  static validateValue(value: any, path: string, options?: IValidationOptions, depth: number = 0): IValidationResult {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    if (value === null || value === undefined) {
      return { valid: true, errors, warnings };
    }

    if (typeof value === 'string') {
      const stringValidation = ValidationUtils.validateString(value, path, options);
      errors.push(...stringValidation.errors);
      warnings.push(...stringValidation.warnings);
    } else if (typeof value === 'object') {
      const objectValidation = ValidationUtils.validateObject(value, path, options, depth);
      errors.push(...objectValidation.errors);
      warnings.push(...objectValidation.warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate logging configuration
   */
  static validateConfiguration(config: ILoggingSystemConfig): IValidationResult {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    // Validate default level
    if (!config.defaultLevel) {
      errors.push({
        code: 'MISSING_DEFAULT_LEVEL',
        message: 'Default log level is required',
        path: 'defaultLevel'
      });
    } else if (!ValidationUtils.isValidLogLevel(config.defaultLevel)) {
      errors.push({
        code: 'INVALID_DEFAULT_LEVEL',
        message: 'Invalid default log level',
        path: 'defaultLevel'
      });
    }

    // Validate loggers
    if (config.loggers) {
      for (const [name, logger] of Object.entries(config.loggers)) {
        const loggerValidation = ValidationUtils.validateLoggerConfig(logger, `loggers.${name}`);
        errors.push(...loggerValidation.errors);
        warnings.push(...loggerValidation.warnings);
      }
    }

    // Validate appenders
    if (config.appenders) {
      for (const [name, appender] of Object.entries(config.appenders)) {
        const appenderValidation = ValidationUtils.validateAppenderConfig(appender, `appenders.${name}`);
        errors.push(...appenderValidation.errors);
        warnings.push(...appenderValidation.warnings);
      }
    }

    // Validate layouts
    if (config.layouts) {
      for (const [name, layout] of Object.entries(config.layouts)) {
        const layoutValidation = ValidationUtils.validateLayoutConfig(layout, `layouts.${name}`);
        errors.push(...layoutValidation.errors);
        warnings.push(...layoutValidation.warnings);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate logger configuration
   */
  static validateLoggerConfig(config: any, path: string): IValidationResult {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    if (!config.category) {
      errors.push({
        code: 'MISSING_CATEGORY',
        message: 'Logger category is required',
        path: `${path}.category`
      });
    }

    if (!config.level) {
      errors.push({
        code: 'MISSING_LEVEL',
        message: 'Logger level is required',
        path: `${path}.level`
      });
    } else if (!ValidationUtils.isValidLogLevel(config.level)) {
      errors.push({
        code: 'INVALID_LEVEL',
        message: 'Invalid logger level',
        path: `${path}.level`
      });
    }

    if (!config.appenders || config.appenders.length === 0) {
      warnings.push({
        code: 'NO_APPENDERS',
        message: 'Logger has no appenders configured',
        path: `${path}.appenders`
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate appender configuration
   */
  static validateAppenderConfig(config: any, path: string): IValidationResult {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    if (!config.name) {
      errors.push({
        code: 'MISSING_NAME',
        message: 'Appender name is required',
        path: `${path}.name`
      });
    }

    if (!config.type) {
      errors.push({
        code: 'MISSING_TYPE',
        message: 'Appender type is required',
        path: `${path}.type`
      });
    }

    if (config.type === 'remote' && !config.url) {
      errors.push({
        code: 'MISSING_URL',
        message: 'Remote appender requires URL',
        path: `${path}.url`
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate layout configuration
   */
  static validateLayoutConfig(config: any, path: string): IValidationResult {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    if (!config.name) {
      errors.push({
        code: 'MISSING_NAME',
        message: 'Layout name is required',
        path: `${path}.name`
      });
    }

    if (!config.type) {
      errors.push({
        code: 'MISSING_TYPE',
        message: 'Layout type is required',
        path: `${path}.type`
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check if log level is valid
   */
  static isValidLogLevel(level: string): boolean {
    const validLevels = ['TRACE', 'DEBUG', 'INFO', 'AUDIT', 'WARN', 'METRICS', 'ERROR', 'SECURITY', 'FATAL'];
    return validLevels.includes(level.toUpperCase());
  }

  /**
   * Sanitize string for logging
   */
  static sanitizeString(str: string, options?: IValidationOptions): string {
    const opts = { ...ValidationUtils.defaultOptions, ...options };
    let sanitized = str;

    // Remove or replace forbidden patterns
    if (opts.forbiddenPatterns) {
      for (const pattern of opts.forbiddenPatterns) {
        sanitized = sanitized.replace(pattern, '[REDACTED]');
      }
    }

    // Truncate if too long
    if (opts.maxStringLength && sanitized.length > opts.maxStringLength) {
      sanitized = sanitized.substring(0, opts.maxStringLength - 3) + '...';
    }

    return sanitized;
  }

  /**
   * Sanitize object for logging
   */
  static sanitizeObject(obj: any, options?: IValidationOptions, depth: number = 0): any {
    const opts = { ...ValidationUtils.defaultOptions, ...options };

    if (depth > (opts.maxObjectDepth || 10)) {
      return '[MAX_DEPTH_REACHED]';
    }

    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return ValidationUtils.sanitizeString(obj, opts);
    }

    if (Array.isArray(obj)) {
      const maxLength = opts.maxArrayLength || 1000;
      if (obj.length > maxLength) {
        return obj.slice(0, maxLength).map(item => ValidationUtils.sanitizeObject(item, opts, depth + 1))
          .concat(`... and ${obj.length - maxLength} more items`);
      }
      return obj.map(item => ValidationUtils.sanitizeObject(item, opts, depth + 1));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};
      const keys = Object.keys(obj);
      const maxKeys = 100;

      for (const key of keys.slice(0, maxKeys)) {
        sanitized[key] = ValidationUtils.sanitizeObject(obj[key], opts, depth + 1);
      }

      if (keys.length > maxKeys) {
        sanitized['...'] = `${keys.length - maxKeys} more properties`;
      }

      return sanitized;
    }

    return obj;
  }

  /**
   * Create custom validation rule
   */
  static createValidationRule(
    name: string,
    description: string,
    validator: (value: any) => IValidationResult,
    priority: number = 0
  ): IValidationRule {
    return {
      name,
      description,
      validate: validator,
      priority
    };
  }

  /**
   * Apply validation rules to value
   */
  static applyValidationRules(value: any, rules: IValidationRule[]): IValidationResult {
    const allErrors: IValidationError[] = [];
    const allWarnings: IValidationWarning[] = [];

    // Sort rules by priority (higher first)
    const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

    for (const rule of sortedRules) {
      const result = rule.validate(value);
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };
  }
}
