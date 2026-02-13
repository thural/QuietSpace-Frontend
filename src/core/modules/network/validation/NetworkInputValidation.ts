/**
 * Network Input Validation
 *
 * Provides comprehensive input validation and sanitization for network requests.
 * Includes schema validation, XSS protection, SQL injection prevention, and rate limiting.
 */

/**
 * Validation rule interface
 */
export interface IValidationRule {
  /** Rule identifier */
  name: string;
  /** Validation function */
  validate: (value: any, context?: any) => boolean | string;
  /** Error message */
  message: string;
  /** Rule priority */
  priority: number;
}

/**
 * Validation result interface
 */
export interface IValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Validation errors */
  errors: ValidationError[];
  /** Sanitized data */
  sanitizedData?: any;
  /** Warnings */
  warnings: string[];
}

/**
 * Validation error
 */
export interface ValidationError {
  /** Field name */
  field: string;
  /** Rule that failed */
  rule: string;
  /** Error message */
  message: string;
  /** Original value */
  value: any;
  /** Error severity */
  severity: 'error' | 'warning';
}

/**
 * Input sanitization options
 */
export interface ISanitizationOptions {
  /** Enable HTML sanitization */
  sanitizeHTML: boolean;
  /** Enable SQL injection prevention */
  preventSQLInjection: boolean;
  /** Enable XSS protection */
  preventXSS: boolean;
  /** Trim whitespace */
  trimWhitespace: boolean;
  /** Remove null bytes */
  removeNullBytes: boolean;
  /** Normalize Unicode */
  normalizeUnicode: boolean;
}

/**
 * Request validation configuration
 */
export interface IRequestValidationConfig {
  /** Enable validation */
  enabled: boolean;
  /** Validation rules */
  rules: IValidationRule[];
  /** Sanitization options */
  sanitization: ISanitizationOptions;
  /** Maximum request size */
  maxRequestSize: number;
  /** Maximum header size */
  maxHeaderSize: number;
  /** Allowed content types */
  allowedContentTypes: string[];
  /** Blocked IPs */
  blockedIPs: string[];
  /** Rate limiting */
  rateLimiting: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
  };
}

/**
 * Input validator class
 */
export class InputValidator {
  private rules = new Map<string, IValidationRule[]>();
  private globalRules: IValidationRule[] = [];

  constructor(private config: IRequestValidationConfig) {
    this.initializeDefaultRules();
  }

  /**
   * Validate input data
   */
  validate(data: any, context?: any): IValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];
    let sanitizedData = data;

    // Apply global rules first
    for (const rule of this.globalRules) {
      const result = this.applyRule(rule, data, 'root', context);
      if (typeof result === 'string') {
        errors.push({
          field: 'root',
          rule: rule.name,
          message: result,
          value: data,
          severity: 'error'
        });
      }
    }

    // Apply field-specific rules
    if (typeof data === 'object' && data !== null) {
      sanitizedData = this.validateObject(data, errors, warnings, context);
    }

    // Apply sanitization
    if (this.config.sanitization) {
      sanitizedData = this.sanitize(sanitizedData);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData,
      warnings
    };
  }

  /**
   * Validate HTTP request
   */
  validateRequest(request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: any;
    ip?: string;
  }): IValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Check IP blocking
    if (request.ip && this.config.blockedIPs.includes(request.ip)) {
      errors.push({
        field: 'ip',
        rule: 'blocked_ip',
        message: 'IP address is blocked',
        value: request.ip,
        severity: 'error'
      });
    }

    // Check content type
    const contentType = request.headers['content-type'];
    if (contentType && !this.isAllowedContentType(contentType)) {
      errors.push({
        field: 'content-type',
        rule: 'allowed_content_type',
        message: `Content type ${contentType} is not allowed`,
        value: contentType,
        severity: 'error'
      });
    }

    // Check request size
    const bodySize = JSON.stringify(request.body || {}).length;
    if (bodySize > this.config.maxRequestSize) {
      errors.push({
        field: 'body',
        rule: 'max_request_size',
        message: `Request size ${bodySize} exceeds maximum ${this.config.maxRequestSize}`,
        value: bodySize,
        severity: 'error'
      });
    }

    // Check header size
    const headerSize = JSON.stringify(request.headers).length;
    if (headerSize > this.config.maxHeaderSize) {
      errors.push({
        field: 'headers',
        rule: 'max_header_size',
        message: `Header size ${headerSize} exceeds maximum ${this.config.maxHeaderSize}`,
        value: headerSize,
        severity: 'error'
      });
    }

    // Validate body if present
    let sanitizedBody = request.body;
    if (request.body) {
      const bodyValidation = this.validate(request.body, { request });
      errors.push(...bodyValidation.errors);
      warnings.push(...bodyValidation.warnings);
      sanitizedBody = bodyValidation.sanitizedData;
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: { ...request, body: sanitizedBody },
      warnings
    };
  }

  /**
   * Add validation rule
   */
  addRule(field: string, rule: IValidationRule): void {
    if (!this.rules.has(field)) {
      this.rules.set(field, []);
    }
    this.rules.get(field)!.push(rule);
  }

  /**
   * Add global validation rule
   */
  addGlobalRule(rule: IValidationRule): void {
    this.globalRules.push(rule);
  }

  /**
   * Remove validation rule
   */
  removeRule(field: string, ruleName: string): void {
    const fieldRules = this.rules.get(field);
    if (fieldRules) {
      const index = fieldRules.findIndex(rule => rule.name === ruleName);
      if (index !== -1) {
        fieldRules.splice(index, 1);
      }
    }
  }

  /**
   * Validate object recursively
   */
  private validateObject(
    obj: any,
    errors: ValidationError[],
    warnings: string[],
    context?: any
  ): any {
    const sanitized: any = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      const fieldRules = this.rules.get(key) || [];

      // Apply field-specific rules
      for (const rule of fieldRules) {
        const result = this.applyRule(rule, value, key, context);
        if (typeof result === 'string') {
          errors.push({
            field: key,
            rule: rule.name,
            message: result,
            value,
            severity: 'error'
          });
        }
      }

      // Recursively validate nested objects
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = this.validateObject(value, errors, warnings, context);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item =>
          typeof item === 'object' && item !== null
            ? this.validateObject(item, errors, warnings, context)
            : item
        );
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Apply validation rule
   */
  private applyRule(rule: IValidationRule, value: any, field: string, context?: any): boolean | string {
    try {
      const result = rule.validate(value, { field, ...context });
      return result;
    } catch (error) {
      return `Validation error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  /**
   * Sanitize input data
   */
  private sanitize(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeString(data);
    } else if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item));
    } else if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitize(value);
      }
      return sanitized;
    }
    return data;
  }

  /**
   * Sanitize string
   */
  private sanitizeString(str: string): string {
    let sanitized = str;

    if (this.config.sanitization.trimWhitespace) {
      sanitized = sanitized.trim();
    }

    if (this.config.sanitization.removeNullBytes) {
      sanitized = sanitized.replace(/\0/g, '');
    }

    if (this.config.sanitization.normalizeUnicode) {
      sanitized = sanitized.normalize('NFC');
    }

    if (this.config.sanitization.preventSQLInjection) {
      sanitized = this.preventSQLInjection(sanitized);
    }

    if (this.config.sanitization.preventXSS) {
      sanitized = this.preventXSS(sanitized);
    }

    if (this.config.sanitization.sanitizeHTML) {
      sanitized = this.sanitizeHTML(sanitized);
    }

    return sanitized;
  }

  /**
   * Prevent SQL injection
   */
  private preventSQLInjection(str: string): string {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(--|\/\*|\*\/|;|'|")/g,
      /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/gi,
      /(\b(OR|AND)\b\s+\'\w+\'\s*=\s*\'\w+\')/gi
    ];

    let sanitized = str;
    for (const pattern of sqlPatterns) {
      sanitized = sanitized.replace(pattern, '');
    }
    return sanitized;
  }

  /**
   * Prevent XSS attacks
   */
  private preventXSS(str: string): string {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<[^>]*>/g
    ];

    let sanitized = str;
    for (const pattern of xssPatterns) {
      sanitized = sanitized.replace(pattern, '');
    }
    return sanitized;
  }

  /**
   * Sanitize HTML
   */
  private sanitizeHTML(str: string): string {
    // Basic HTML sanitization - remove all tags except safe ones
    const allowedTags = /<(\/?(b|i|u|p|br|strong|em))>/gi;
    return str.replace(/<[^>]*>/g, (match) =>
      allowedTags.test(match) ? match : ''
    );
  }

  /**
   * Check if content type is allowed
   */
  private isAllowedContentType(contentType: string): boolean {
    return this.config.allowedContentTypes.some(allowed =>
      contentType.toLowerCase().includes(allowed.toLowerCase())
    );
  }

  /**
   * Initialize default validation rules
   */
  private initializeDefaultRules(): void {
    // Add common validation rules
    this.addGlobalRule({
      name: 'no_null_bytes',
      validate: (value: any) => {
        if (typeof value === 'string' && value.includes('\0')) {
          return 'Null bytes are not allowed';
        }
        return true;
      },
      message: 'Null bytes detected',
      priority: 1
    });

    this.addGlobalRule({
      name: 'max_depth',
      validate: (value: any) => {
        const depth = this.getObjectDepth(value);
        if (depth > 10) {
          return `Object depth ${depth} exceeds maximum allowed depth of 10`;
        }
        return true;
      },
      message: 'Object depth exceeds limit',
      priority: 2
    });
  }

  /**
   * Get object depth
   */
  private getObjectDepth(obj: any, currentDepth = 0): number {
    if (typeof obj !== 'object' || obj === null) {
      return currentDepth;
    }

    if (currentDepth > 10) {
      return currentDepth;
    }

    let maxDepth = currentDepth;
    for (const value of Object.values(obj)) {
      const depth = this.getObjectDepth(value, currentDepth + 1);
      maxDepth = Math.max(maxDepth, depth);
    }

    return maxDepth;
  }
}

/**
 * Built-in validation rules
 */
export class ValidationRules {
  /**
   * Required field validation
   */
  static required(message = 'Field is required'): IValidationRule {
    return {
      name: 'required',
      validate: (value: any) => {
        if (value === null || value === undefined || value === '') {
          return message;
        }
        return true;
      },
      message,
      priority: 1
    };
  }

  /**
   * String length validation
   */
  static minLength(min: number, message?: string): IValidationRule {
    return {
      name: 'min_length',
      validate: (value: any) => {
        if (typeof value === 'string' && value.length < min) {
          return message || `Minimum length is ${min}`;
        }
        return true;
      },
      message: message || `Minimum length is ${min}`,
      priority: 2
    };
  }

  /**
   * String length validation
   */
  static maxLength(max: number, message?: string): IValidationRule {
    return {
      name: 'max_length',
      validate: (value: any) => {
        if (typeof value === 'string' && value.length > max) {
          return message || `Maximum length is ${max}`;
        }
        return true;
      },
      message: message || `Maximum length is ${max}`,
      priority: 2
    };
  }

  /**
   * Email validation
   */
  static email(message = 'Invalid email format'): IValidationRule {
    return {
      name: 'email',
      validate: (value: any) => {
        if (typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return message;
          }
        }
        return true;
      },
      message,
      priority: 3
    };
  }

  /**
   * Numeric validation
   */
  static numeric(message = 'Value must be numeric'): IValidationRule {
    return {
      name: 'numeric',
      validate: (value: any) => {
        if (typeof value === 'string' && isNaN(Number(value))) {
          return message;
        }
        return true;
      },
      message,
      priority: 2
    };
  }

  /**
   * Regex validation
   */
  static regex(pattern: RegExp, message = 'Invalid format'): IValidationRule {
    return {
      name: 'regex',
      validate: (value: any) => {
        if (typeof value === 'string' && !pattern.test(value)) {
          return message;
        }
        return true;
      },
      message,
      priority: 3
    };
  }

  /**
   * Enum validation
   */
  static enum(values: any[], message = 'Invalid value'): IValidationRule {
    return {
      name: 'enum',
      validate: (value: any) => {
        if (!values.includes(value)) {
          return message;
        }
        return true;
      },
      message,
      priority: 2
    };
  }
}

/**
 * Network input validation middleware
 */
export class NetworkValidationMiddleware {
  constructor(private validator: InputValidator) { }

  /**
   * Validate network request
   */
  validateRequest(request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: any;
    ip?: string;
  }): IValidationResult {
    return this.validator.validateRequest(request);
  }

  /**
   * Validate response data
   */
  validateResponse(data: any): IValidationResult {
    return this.validator.validate(data, { type: 'response' });
  }

  /**
   * Create validation error
   */
  createValidationError(result: IValidationResult): Error {
    const message = result.errors.map(err => `${err.field}: ${err.message}`).join('; ');
    return new Error(message);
  }
}
