/**
 * Authentication Validator Interface
 *
 * Defines contract for authentication validation and security operations.
 * This interface focuses solely on validation responsibilities
 * following the Single Responsibility Principle.
 */

import type { AuthCredentials, AuthResult, AuthEvent, AuthErrorType } from '../types/auth.domain.types';

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
 * Validation result with detailed information
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
    }>;
    
    /** Security warnings */
    warnings?: Array<{
        type: string;
        message: string;
        severity: 'low' | 'medium' | 'high';
    }>;
    
    /** Validation metadata */
    metadata?: {
        duration: number;
        rulesApplied: string[];
        timestamp: Date;
    };
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
     * Adds custom validation rule
     * 
     * @param name - Rule name
     * @param rule - Validation function
     * @param priority - Rule priority (higher = earlier execution)
     */
    addRule(name: string, rule: (data: unknown, context?: SecurityContext) => ValidationResult, priority?: number): void;

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
    getRule(name: string): ((data: unknown, context?: SecurityContext) => ValidationResult) | undefined;

    /**
     * Lists all validation rule names
     * 
     * @returns Array of rule names
     */
    listRules(): string[];

    /**
     * Validates data against specific rule
     * 
     * @param ruleName - Rule name
     * @param data - Data to validate
     * @param context - Security context
     * @returns Validation result
     */
    validateWithRule(ruleName: string, data: unknown, context?: SecurityContext): ValidationResult;

    /**
     * Configures validator with settings
     * 
     * @param config - Configuration settings
     */
    configure(config: Record<string, unknown>): void;

    /**
     * Gets validator capabilities
     * 
     * @returns Array of capability identifiers
     */
    getCapabilities(): string[];

    /**
     * Initializes validator (optional)
     * 
     * @returns Promise when initialization is complete
     */
    initialize?(): Promise<void>;

    /**
     * Gets validation statistics
     * 
     * @returns Validation performance metrics
     */
    getStatistics(): {
        totalValidations: number;
        successRate: number;
        averageDuration: number;
        ruleUsage: Record<string, number>;
        errorTypes: Record<string, number>;
    };

    /**
     * Resets validation statistics
     */
    resetStatistics(): void;
}
