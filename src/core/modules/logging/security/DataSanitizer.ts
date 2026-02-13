/**
 * Data Sanitizer
 * 
 * Provides automatic PII detection and masking for logging security.
 * Implements GDPR/CCPA compliance features for sensitive data protection.
 */

import { ISanitizationRule, ISecurityConfig } from '../types';

/**
 * Data sanitizer implementation
 */
export class DataSanitizer {
  private _config: ISecurityConfig;
  private _customRules: ISanitizationRule[] = [];
  private _sensitivePatterns: RegExp[] = [];

  constructor(config: ISecurityConfig) {
    this._config = config;
    this.initializePatterns();
    this.initializeCustomRules();
  }

  /**
   * Sanitize object recursively
   */
  sanitize(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item));
    }

    if (typeof data === 'object') {
      return this.sanitizeObject(data);
    }

    return data;
  }

  /**
   * Sanitize string value
   */
  private sanitizeString(value: string): string {
    if (!this._config.enableSanitization) {
      return value;
    }

    let result = value;

    // Apply custom rules first
    for (const rule of this._customRules) {
      result = result.replace(rule.pattern, rule.mask);
    }

    // Apply default sensitive patterns
    for (const pattern of this._sensitivePatterns) {
      result = result.replace(pattern, this.createMask);
    }

    return result;
  }

  /**
   * Sanitize object recursively
   */
  private sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (this.isSensitiveField(key)) {
        sanitized[key] = this.maskValue(value);
      } else {
        sanitized[key] = this.sanitize(value);
      }
    }

    return sanitized;
  }

  /**
   * Check if field name is sensitive
   */
  private isSensitiveField(fieldName: string): boolean {
    const lowerFieldName = fieldName.toLowerCase();
    
    return this._config.sensitiveFields.some(pattern => 
      lowerFieldName.includes(pattern.toLowerCase())
    );
  }

  /**
   * Mask value based on configuration
   */
  private maskValue(value: any): any {
    if (typeof value !== 'string') {
      return '***';
    }

    if (this._config.partialMask && value.length > 4) {
      const maskChar = this._config.maskChar || '*';
      const start = value.substring(0, 2);
      const end = value.substring(value.length - 2);
      const middle = maskChar.repeat(value.length - 4);
      return start + middle + end;
    }

    return this._config.maskChar || '***';
  }

  /**
   * Create mask function for regex replacement
   */
  private createMask = (match: string): string => {
    if (this._config.partialMask && match.length > 4) {
      const maskChar = this._config.maskChar || '*';
      const start = match.substring(0, 2);
      const end = match.substring(match.length - 2);
      const middle = maskChar.repeat(match.length - 4);
      return start + middle + end;
    }
    return this._config.maskChar || '***';
  };

  /**
   * Initialize sensitive data patterns
   */
  private initializePatterns(): void {
    this._sensitivePatterns = [
      // Email addresses
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      
      // Phone numbers (various formats)
      /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
      
      // Credit card numbers
      /\b(?:\d[ -]*?){13,16}\b/g,
      
      // Social Security Numbers
      /\b\d{3}-\d{2}-\d{4}\b/g,
      
      // API keys and tokens
      /\b[A-Za-z0-9]{32,}\b/g,
      
      // Passwords in JSON
      /"password"\s*:\s*"[^"]+"/gi,
      
      // Authorization headers
      /authorization\s*:\s*[^,\s]+/gi,
      
      // Bearer tokens
      /bearer\s+[A-Za-z0-9\-._~+\/]+=*/gi,
      
      // JWT tokens
      /\b[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
      
      // IP addresses (optional, based on config)
      /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g
    ];
  }

  /**
   * Initialize custom rules from config
   */
  private initializeCustomRules(): void {
    if (this._config.customRules) {
      this._customRules = [...this._config.customRules];
    }
  }

  /**
   * Add custom sanitization rule
   */
  addCustomRule(rule: ISanitizationRule): void {
    this._customRules.push(rule);
    // Sort by priority (higher priority first)
    this._customRules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Remove custom rule by name
   */
  removeCustomRule(name: string): void {
    this._customRules = this._customRules.filter(rule => rule.name !== name);
  }

  /**
   * Get all custom rules
   */
  getCustomRules(): ISanitizationRule[] {
    return [...this._customRules];
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ISecurityConfig>): void {
    this._config = { ...this._config, ...config };
    
    if (config.sensitiveFields) {
      // Re-initialize patterns if sensitive fields changed
      this.initializePatterns();
    }
    
    if (config.customRules) {
      this.initializeCustomRules();
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): ISecurityConfig {
    return { ...this._config };
  }

  /**
   * Test sanitization on sample data
   */
  testSanitization(data: any): {
    original: any;
    sanitized: any;
    changed: boolean;
  } {
    const original = JSON.parse(JSON.stringify(data));
    const sanitized = this.sanitize(data);
    const changed = JSON.stringify(original) !== JSON.stringify(sanitized);
    
    return { original, sanitized, changed };
  }

  /**
   * Check if sanitization is enabled
   */
  isEnabled(): boolean {
    return this._config.enableSanitization;
  }

  /**
   * Enable/disable sanitization
   */
  setEnabled(enabled: boolean): void {
    this._config.enableSanitization = enabled;
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    enabled: boolean;
    sensitiveFieldsCount: number;
    customRulesCount: number;
    patternsCount: number;
  } {
    return {
      enabled: this._config.enableSanitization,
      sensitiveFieldsCount: this._config.sensitiveFields.length,
      customRulesCount: this._customRules.length,
      patternsCount: this._sensitivePatterns.length
    };
  }
}
