/**
 * Authentication Validator Interface
 *
 * Defines contract for authentication validation and security operations.
 * This interface focuses solely on validation responsibilities
 * following the Single Responsibility Principle.
 */

import type { AuthCredentials, AuthResult, AuthEvent, AuthErrorType } from '../types/auth.domain.types';

/**
 * Validation rule composition types
 */
export interface ValidationRule {
    /** Rule name for identification */
    name: string;

    /** Rule priority for execution order */
    priority: number;

    /** Whether rule is enabled */
    enabled: boolean;

    /** Rule execution function */
    validate: (data: unknown, context?: SecurityContext) => Promise<ValidationResult>;

    /** Rule description */
    description?: string;

    /** Rule metadata */
    metadata?: Record<string, unknown>;
}

/**
 * Validation rule group for composition
 */
export interface ValidationRuleGroup {
    /** Group name */
    name: string;

    /** Group description */
    description?: string;

    /** Rules in this group */
    rules: ValidationRule[];

    /** Group execution mode */
    executionMode: 'all' | 'any' | 'first';

    /** Whether group is enabled */
    enabled: boolean;
}

/**
 * Async validation options
 */
export interface AsyncValidationOptions {
    /** Timeout for validation in milliseconds */
    timeout?: number;

    /** Whether to run validations in parallel */
    parallel?: boolean;

    /** Maximum concurrent validations */
    maxConcurrency?: number;

    /** Whether to fail fast on first error */
    failFast?: boolean;

    /** Retry attempts for failed validations */
    retryAttempts?: number;
}

/**
 * Security context for validation
 */
export interface SecurityContext {
    /** Client IP address */
    ipAddress?: string;

    /** User agent string */
    userAgent?: string;

    /** Request ID for tracing */
    requestId?: string;

    /** Session ID */
    sessionId?: string;

    /** Timestamp of request */
    timestamp: Date;

    /** Additional security metadata */
    metadata?: Record<string, unknown>;
}

/**
 * Enhanced validation result with detailed information
 */
export interface ValidationResult {
    /** Overall validation success */
    isValid: boolean;

    /** Validation errors if any */
    errors?: Array<{
        type: AuthErrorType;
        message: string;
        field?: string;
        code?: string;
        severity?: 'low' | 'medium' | 'high' | 'critical';
        rule?: string;
        timestamp?: Date;
        context?: Record<string, unknown>;
    }>;

    /** Security warnings */
    warnings?: Array<{
        type: string;
        message: string;
        severity: 'low' | 'medium' | 'high';
        rule?: string;
        timestamp?: Date;
    }>;

    /** Validation metadata */
    metadata?: {
        duration: number;
        rulesApplied: string[];
        timestamp: Date;
        async?: boolean;
        parallel?: boolean;
        retryCount?: number;
    };

    /** Validation suggestions for improvement */
    suggestions?: Array<{
        type: string;
        message: string;
        priority: 'low' | 'medium' | 'high';
        action?: string;
    }>;
}

/**
 * Authentication validator interface
 * 
 * Provides comprehensive validation for credentials, tokens,
 * and security contexts without authentication concerns.
 */
export interface IAuthValidator {
    /** Validator name for identification */
    readonly name: string;

    /** Validator version */
    readonly version: string;

    /** Validation rules configuration */
    readonly rules: Record<string, unknown>;

    /**
     * Validates user credentials asynchronously
     * 
     * @param credentials - User credentials to validate
     * @param context - Security context for validation
     * @param options - Async validation options
     * @returns Detailed validation result
     */
    validateCredentialsAsync(credentials: AuthCredentials, context?: SecurityContext, options?: AsyncValidationOptions): Promise<ValidationResult>;

    /**
     * Validates authentication token asynchronously
     * 
     * @param token - Token to validate
     * @param context - Security context for validation
     * @param options - Async validation options
     * @returns Detailed validation result
     */
    validateTokenAsync(token: string, context?: SecurityContext, options?: AsyncValidationOptions): Promise<ValidationResult>;

    /**
     * Validates user data asynchronously
     * 
     * @param user - User data to validate
     * @param context - Security context for validation
     * @param options - Async validation options
     * @returns Detailed validation result
     */
    validateUserAsync(user: unknown, context?: SecurityContext, options?: AsyncValidationOptions): Promise<ValidationResult>;

    /**
     * Validates multiple data items in batch
     * 
     * @param items - Array of items to validate with their types
     * @param context - Security context for validation
     * @param options - Async validation options
     * @returns Array of validation results
     */
    validateBatch(items: Array<{
        type: 'credentials' | 'token' | 'user' | 'event' | 'context';
        data: unknown;
    }>, context?: SecurityContext, options?: AsyncValidationOptions): Promise<ValidationResult[]>;

    /**
     * Validates user credentials
     * 
     * @param credentials - User credentials to validate
     * @param context - Security context for validation
     * @returns Detailed validation result
     */
    validateCredentials(credentials: AuthCredentials, context?: SecurityContext): ValidationResult;

    /**
     * Validates authentication token
     * 
     * @param token - Token to validate
     * @param context - Security context for validation
     * @returns Detailed validation result
     */
    validateToken(token: string, context?: SecurityContext): ValidationResult;

    /**
     * Validates user data
     * 
     * @param user - User data to validate
     * @param context - Security context for validation
     * @returns Detailed validation result
     */
    validateUser(user: unknown, context?: SecurityContext): ValidationResult;

    /**
     * Validates security context
     * 
     * @param context - Security context to validate
     * @returns Validation result
     */
    validateSecurityContext(context: SecurityContext): AuthResult<boolean>;

    /**
     * Validates authentication event
     * 
     * @param event - Authentication event to validate
     * @returns Validation result
     */
    validateAuthEvent(event: AuthEvent): ValidationResult;

    /**
     * Adds custom validation rule with enhanced options
     * 
     * @param rule - Validation rule object with full configuration
     */
    addValidationRule(rule: ValidationRule): void;

    /**
     * Removes validation rule
     * 
     * @param name - Rule name
     * @returns True if rule was removed
     */
    removeRule(name: string): boolean;

    /**
     * Gets validation rule
     * 
     * @param name - Rule name
     * @returns Validation rule or undefined
     */
    getRule(name: string): ValidationRule | undefined;

    /**
     * Lists all validation rule names
     * 
     * @param enabledOnly - Whether to list only enabled rules
     * @returns Array of rule names
     */
    listRules(enabledOnly?: boolean): string[];

    /**
     * Creates validation rule group for composition
     * 
     * @param group - Rule group configuration
     */
    createRuleGroup(group: ValidationRuleGroup): void;

    /**
     * Removes validation rule group
     * 
     * @param name - Group name
     * @returns True if group was removed
     */
    removeRuleGroup(name: string): boolean;

    /**
     * Gets validation rule group
     * 
     * @param name - Group name
     * @returns Rule group or undefined
     */
    getRuleGroup(name: string): ValidationRuleGroup | undefined;

    /**
     * Lists all rule group names
     * 
     * @param enabledOnly - Whether to list only enabled groups
     * @returns Array of group names
     */
    listRuleGroups(enabledOnly?: boolean): string[];

    /**
     * Validates data using rule group
     * 
     * @param groupName - Rule group name
     * @param data - Data to validate
     * @param context - Security context
     * @param options - Async validation options
     * @returns Validation result
     */
    validateWithRuleGroup(groupName: string, data: unknown, context?: SecurityContext, options?: AsyncValidationOptions): Promise<ValidationResult>;

    /**
     * Validates data against specific rule
     * 
     * @param ruleName - Rule name
     * @param data - Data to validate
     * @param context - Security context
     * @param options - Async validation options
     * @returns Validation result
     */
    validateWithRule(ruleName: string, data: unknown, context?: SecurityContext, options?: AsyncValidationOptions): Promise<ValidationResult>;

    /**
     * Enables or disables validation rule
     * 
     * @param name - Rule name
     * @param enabled - Whether to enable the rule
     * @returns True if operation was successful
     */
    setRuleEnabled(name: string, enabled: boolean): boolean;

    /**
     * Checks if validation rule is enabled
     * 
     * @param name - Rule name
     * @returns True if rule is enabled
     */
    isRuleEnabled(name: string): boolean;

    /**
     * Sets validation rule priority
     * 
     * @param name - Rule name
     * @param priority - New priority level
     * @returns True if operation was successful
     */
    setRulePriority(name: string, priority: number): boolean;

    /**
     * Gets validation rule priority
     * 
     * @param name - Rule name
     * @returns Rule priority or undefined
     */
    getRulePriority(name: string): number | undefined;

    /**
     * Gets comprehensive validation statistics
     * 
     * @returns Enhanced validation performance metrics
     */
    getStatistics(): {
        totalValidations: number;
        successRate: number;
        averageDuration: number;
        ruleUsage: Record<string, number>;
        errorTypes: Record<string, number>;
        asyncValidations: number;
        batchValidations: number;
        ruleGroupUsage: Record<string, number>;
        performanceByRule: Record<string, {
            averageDuration: number;
            successRate: number;
            usageCount: number;
        }>;
    };

    /**
     * Resets validation statistics
     */
    resetStatistics(): void;

    /**
     * Validates security context with enhanced checks
     * 
     * @param context - Security context to validate
     * @param options - Async validation options
     * @returns Validation result
     */
    validateSecurityContextAsync(context: SecurityContext, options?: AsyncValidationOptions): Promise<ValidationResult>;

    /**
     * Validates authentication event with enhanced checks
     * 
     * @param event - Authentication event to validate
     * @param options - Async validation options
     * @returns Validation result
     */
    validateAuthEventAsync(event: AuthEvent, options?: AsyncValidationOptions): Promise<ValidationResult>;
}
