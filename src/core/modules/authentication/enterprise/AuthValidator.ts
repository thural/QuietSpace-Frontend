/**
 * Authentication Validator Implementation
 *
 * Implements comprehensive validation for credentials, tokens,
 * and security contexts following Single Responsibility Principle.
 */

import { AuthErrorType } from '../types/auth.domain.types';

import type { IAuthValidator, SecurityContext, ValidationResult } from '../interfaces/IAuthValidator';
import type { IAuthSecurityService } from '../interfaces/authInterfaces';
import type { IAuthConfig } from '../interfaces/authInterfaces';
import type { IAuthLogger } from '../interfaces/authInterfaces';

/**
 * Authentication validator implementation
 * 
 * Provides comprehensive validation with rule-based system,
 * security context validation, and detailed error reporting.
 */
export class AuthValidator implements IAuthValidator {
    readonly name = 'AuthValidator';
    readonly version = '1.0.0';
    readonly rules: Record<string, unknown> = {};

    private readonly validationRules = new Map<string, {
        rule: (data: unknown, context?: SecurityContext) => ValidationResult;
        priority: number;
    }>();

    private statistics = {
        totalValidations: 0,
        successCount: 0,
        totalDuration: 0,
        ruleUsage: new Map<string, number>(),
        errorTypes: new Map<string, number>()
    };

    constructor(
        private readonly security: IAuthSecurityService,
        private readonly config: IAuthConfig,
        private readonly logger?: IAuthLogger
    ) {
        this.initializeDefaultRules();
    }

    /**
     * Validates user credentials
     */
    validateCredentials(credentials: unknown, context?: SecurityContext): ValidationResult {
        const startTime = Date.now();
        this.statistics.totalValidations++;

        try {
            const errors: Array<{ type: AuthErrorType; message: string; field?: string; code?: string }> = [];
            const warnings: Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' }> = [];
            const rulesApplied: string[] = [];

            // Type validation
            if (!credentials || typeof credentials !== 'object') {
                errors.push({
                    type: AuthErrorType.VALIDATION_ERROR,
                    message: 'Credentials must be an object',
                    code: 'INVALID_CREDENTIALS_TYPE'
                });
                return this.createValidationResult(false, errors, warnings, startTime, rulesApplied);
            }

            const creds = credentials as Record<string, unknown>;

            // Email validation
            if (creds.email) {
                const emailResult = this.validateEmail(creds.email as string);
                if (!emailResult.isValid) {
                    errors.push(...(emailResult.errors || []));
                }
                rulesApplied.push('email_validation');
            }

            // Password validation
            if (creds.password) {
                const passwordResult = this.validatePassword(creds.password as string);
                if (!passwordResult.isValid) {
                    errors.push(...(passwordResult.errors || []));
                }
                rulesApplied.push('password_validation');
            }

            // Token validation
            if (creds.token) {
                const tokenResult = this.validateToken(creds.token as string, context);
                if (!tokenResult.isValid) {
                    errors.push(...(tokenResult.errors || []));
                }
                rulesApplied.push('token_validation');
            }

            // Security context validation
            if (context) {
                const contextResult = this.validateSecurityContext(context);
                if (!contextResult.success) {
                    warnings.push({
                        type: 'security_context',
                        message: 'Security context validation failed',
                        severity: 'medium'
                    });
                }
                rulesApplied.push('security_context_validation');
            }

            // Rate limiting check
            if (context?.ipAddress) {
                const isRateLimited = !this.security.checkRateLimit(
                    creds.email as string || creds.username as string || 'anonymous',
                    1
                );

                if (isRateLimited) {
                    errors.push({
                        type: AuthErrorType.RATE_LIMITED,
                        message: 'Rate limit exceeded',
                        code: 'RATE_LIMIT_EXCEEDED'
                    });
                }
                rulesApplied.push('rate_limiting');
            }

            const isValid = errors.length === 0;

            if (isValid) {
                this.statistics.successCount++;
            } else {
                // Track error types
                for (const error of errors) {
                    const count = this.statistics.errorTypes.get(error.type) || 0;
                    this.statistics.errorTypes.set(error.type, count + 1);
                }
            }

            return this.createValidationResult(isValid, errors, warnings, startTime, rulesApplied);

        } catch (error) {
            this.logger?.logError(error as Error, { operation: 'validateCredentials' });

            return this.createValidationResult(false, [{
                type: AuthErrorType.SERVER_ERROR,
                message: 'Validation failed due to server error',
                code: 'VALIDATION_SERVER_ERROR'
            }], [], startTime, []);
        }
    }

    /**
     * Validates authentication token
     */
    validateToken(token: string, context?: SecurityContext): ValidationResult {
        const startTime = Date.now();
        this.statistics.totalValidations++;

        try {
            const errors: Array<{ type: AuthErrorType; message: string; field?: string; code?: string }> = [];
            const warnings: Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' }> = [];
            const rulesApplied: string[] = [];

            // Token format validation
            if (!token || typeof token !== 'string') {
                errors.push({
                    type: AuthErrorType.VALIDATION_ERROR,
                    message: 'Token must be a non-empty string',
                    code: 'INVALID_TOKEN_FORMAT'
                });
                return this.createValidationResult(false, errors, warnings, startTime, rulesApplied);
            }

            // Token structure validation (JWT format)
            const parts = token.split('.');
            if (parts.length !== 3) {
                errors.push({
                    type: AuthErrorType.TOKEN_INVALID,
                    message: 'Token must have 3 parts (header.payload.signature)',
                    code: 'INVALID_JWT_STRUCTURE'
                });
                rulesApplied.push('jwt_structure_validation');
            }

            // Token size validation
            if (token.length > 2048) {
                errors.push({
                    type: AuthErrorType.VALIDATION_ERROR,
                    message: 'Token size exceeds maximum allowed length',
                    code: 'TOKEN_TOO_LARGE'
                });
                rulesApplied.push('token_size_validation');
            }

            // Token expiration check (if we can decode it)
            try {
                if (parts[1]) {
                    const payload = JSON.parse(atob(parts[1]));
                    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
                        errors.push({
                            type: AuthErrorType.TOKEN_EXPIRED,
                            message: 'Token has expired',
                            code: 'TOKEN_EXPIRED'
                        });
                        rulesApplied.push('token_expiration_validation');
                    }
                }
            } catch (decodeError) {
                warnings.push({
                    type: 'token_decode',
                    message: 'Could not decode token payload for validation',
                    severity: 'low'
                });
            }

            const isValid = errors.length === 0;

            if (isValid) {
                this.statistics.successCount++;
            }

            return this.createValidationResult(isValid, errors, warnings, startTime, rulesApplied);

        } catch (error) {
            this.logger?.logError(error as Error, { operation: 'validateToken' });

            return this.createValidationResult(false, [{
                type: AuthErrorType.SERVER_ERROR,
                message: 'Token validation failed due to server error',
                code: 'TOKEN_VALIDATION_SERVER_ERROR'
            }], [], startTime, []);
        }
    }

    /**
     * Validates user data
     */
    validateUser(user: unknown, context?: SecurityContext): ValidationResult {
        const startTime = Date.now();
        this.statistics.totalValidations++;

        try {
            const errors: Array<{ type: AuthErrorType; message: string; field?: string; code?: string }> = [];
            const warnings: Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' }> = [];
            const rulesApplied: string[] = [];

            // Type validation
            if (!user || typeof user !== 'object') {
                errors.push({
                    type: AuthErrorType.VALIDATION_ERROR,
                    message: 'User data must be an object',
                    code: 'INVALID_USER_TYPE'
                });
                return this.createValidationResult(false, errors, warnings, startTime, rulesApplied);
            }

            const userData = user as Record<string, unknown>;

            // Required fields validation
            const requiredFields = ['id', 'email'];
            for (const field of requiredFields) {
                if (!userData[field]) {
                    errors.push({
                        type: AuthErrorType.VALIDATION_ERROR,
                        message: `Required field '${field}' is missing`,
                        field,
                        code: 'MISSING_REQUIRED_FIELD'
                    });
                }
                rulesApplied.push('required_fields_validation');
            }

            // Email format validation
            if (userData.email) {
                const emailResult = this.validateEmail(userData.email as string);
                if (!emailResult.isValid) {
                    errors.push(...(emailResult.errors || []));
                }
                rulesApplied.push('email_validation');
            }

            const isValid = errors.length === 0;

            if (isValid) {
                this.statistics.successCount++;
            }

            return this.createValidationResult(isValid, errors, warnings, startTime, rulesApplied);

        } catch (error) {
            this.logger?.logError(error as Error, { operation: 'validateUser' });

            return this.createValidationResult(false, [{
                type: AuthErrorType.SERVER_ERROR,
                message: 'User validation failed due to server error',
                code: 'USER_VALIDATION_SERVER_ERROR'
            }], [], startTime, []);
        }
    }

    /**
     * Validates security context
     */
    validateSecurityContext(context: SecurityContext): { success: boolean; error?: { type: AuthErrorType; message: string } } {
        try {
            // Required fields validation
            if (!context.timestamp) {
                return {
                    success: false,
                    error: {
                        type: AuthErrorType.VALIDATION_ERROR,
                        message: 'Security context timestamp is required'
                    }
                };
            }

            // Timestamp validation (not too old)
            const maxAge = 5 * 60 * 1000; // 5 minutes
            if (Date.now() - context.timestamp.getTime() > maxAge) {
                return {
                    success: false,
                    error: {
                        type: AuthErrorType.VALIDATION_ERROR,
                        message: 'Security context timestamp is too old'
                    }
                };
            }

            return { success: true };

        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: 'Security context validation failed'
                }
            };
        }
    }

    /**
     * Validates authentication event
     */
    validateAuthEvent(event: unknown): ValidationResult {
        const startTime = Date.now();
        this.statistics.totalValidations++;

        try {
            const errors: Array<{ type: AuthErrorType; message: string; field?: string; code?: string }> = [];
            const rulesApplied: string[] = [];

            // Type validation
            if (!event || typeof event !== 'object') {
                errors.push({
                    type: AuthErrorType.VALIDATION_ERROR,
                    message: 'Auth event must be an object',
                    code: 'INVALID_EVENT_TYPE'
                });
                return this.createValidationResult(false, errors, [], startTime, rulesApplied);
            }

            const eventData = event as Record<string, unknown>;

            // Required fields validation
            if (!eventData.type) {
                errors.push({
                    type: AuthErrorType.VALIDATION_ERROR,
                    message: 'Event type is required',
                    field: 'type',
                    code: 'MISSING_EVENT_TYPE'
                });
            }

            if (!eventData.timestamp) {
                errors.push({
                    type: AuthErrorType.VALIDATION_ERROR,
                    message: 'Event timestamp is required',
                    field: 'timestamp',
                    code: 'MISSING_EVENT_TIMESTAMP'
                });
            }

            rulesApplied.push('event_structure_validation');

            const isValid = errors.length === 0;

            if (isValid) {
                this.statistics.successCount++;
            }

            return this.createValidationResult(isValid, errors, [], startTime, rulesApplied);

        } catch (error) {
            this.logger?.logError(error as Error, { operation: 'validateAuthEvent' });

            return this.createValidationResult(false, [{
                type: AuthErrorType.SERVER_ERROR,
                message: 'Event validation failed due to server error',
                code: 'EVENT_VALIDATION_SERVER_ERROR'
            }], [], startTime, []);
        }
    }

    /**
     * Adds custom validation rule
     */
    addRule(name: string, rule: (data: unknown, context?: SecurityContext) => ValidationResult, priority: number = 0): void {
        this.validationRules.set(name, { rule, priority });
        this.rules[name] = { priority };

        this.logger?.log({
            type: 'validation_rule_added' as any,
            timestamp: new Date(),
            details: { ruleName: name, priority }
        });
    }

    /**
     * Removes validation rule
     */
    removeRule(name: string): boolean {
        const removed = this.validationRules.delete(name);
        if (removed) {
            delete this.rules[name];

            this.logger?.log({
                type: 'validation_rule_removed' as any,
                timestamp: new Date(),
                details: { ruleName: name }
            });
        }
        return removed;
    }

    /**
     * Gets validation rule
     */
    getRule(name: string): ((data: unknown, context?: SecurityContext) => ValidationResult) | undefined {
        return this.validationRules.get(name)?.rule;
    }

    /**
     * Lists all validation rule names
     */
    listRules(): string[] {
        return Array.from(this.validationRules.keys());
    }

    /**
     * Validates data against specific rule
     */
    validateWithRule(ruleName: string, data: unknown, context?: SecurityContext): ValidationResult {
        const rule = this.validationRules.get(ruleName);
        if (!rule) {
            return this.createValidationResult(false, [{
                type: AuthErrorType.VALIDATION_ERROR,
                message: `Validation rule '${ruleName}' not found`,
                code: 'RULE_NOT_FOUND'
            }], [], Date.now(), []);
        }

        // Update rule usage statistics
        const count = this.statistics.ruleUsage.get(ruleName) || 0;
        this.statistics.ruleUsage.set(ruleName, count + 1);

        return rule.rule(data, context);
    }

    /**
     * Configures validator with settings
     */
    configure(config: Record<string, unknown>): void {
        Object.assign(this.rules, config);

        this.logger?.log({
            type: 'validator_configured' as any,
            timestamp: new Date(),
            details: { configKeys: Object.keys(config) }
        });
    }

    /**
     * Gets validator capabilities
     */
    getCapabilities(): string[] {
        return [
            'credential_validation',
            'token_validation',
            'user_validation',
            'security_context_validation',
            'event_validation',
            'custom_rules',
            'rate_limiting',
            'statistics'
        ];
    }

    /**
     * Gets validation statistics
     */
    getStatistics(): {
        totalValidations: number;
        successRate: number;
        averageDuration: number;
        ruleUsage: Record<string, number>;
        errorTypes: Record<string, number>;
    } {
        const successRate = this.statistics.totalValidations > 0
            ? this.statistics.successCount / this.statistics.totalValidations
            : 0;

        const averageDuration = this.statistics.totalValidations > 0
            ? this.statistics.totalDuration / this.statistics.totalValidations
            : 0;

        return {
            totalValidations: this.statistics.totalValidations,
            successRate,
            averageDuration,
            ruleUsage: Object.fromEntries(this.statistics.ruleUsage),
            errorTypes: Object.fromEntries(this.statistics.errorTypes)
        };
    }

    /**
     * Resets validation statistics
     */
    resetStatistics(): void {
        this.statistics = {
            totalValidations: 0,
            successCount: 0,
            totalDuration: 0,
            ruleUsage: new Map<string, number>(),
            errorTypes: new Map<string, number>()
        };
    }

    /**
     * Initializes default validation rules
     */
    private initializeDefaultRules(): void {
        // Email validation rule
        this.addRule('email_format', (data: unknown) => {
            if (typeof data === 'string') {
                return this.validateEmail(data);
            }
            return this.createValidationResult(false, [{
                type: AuthErrorType.VALIDATION_ERROR,
                message: 'Email must be a string',
                code: 'INVALID_EMAIL_TYPE'
            }], [], Date.now(), ['email_format']);
        }, 10);

        // Password strength rule
        this.addRule('password_strength', (data: unknown) => {
            if (typeof data === 'string') {
                return this.validatePassword(data);
            }
            return this.createValidationResult(false, [{
                type: AuthErrorType.VALIDATION_ERROR,
                message: 'Password must be a string',
                code: 'INVALID_PASSWORD_TYPE'
            }], [], Date.now(), ['password_strength']);
        }, 20);
    }

    /**
     * Validates email format
     */
    private validateEmail(email: string): ValidationResult {
        const errors: Array<{ type: AuthErrorType; message: string; field?: string; code?: string }> = [];

        if (!email || typeof email !== 'string') {
            errors.push({
                type: AuthErrorType.VALIDATION_ERROR,
                message: 'Email is required and must be a string',
                field: 'email',
                code: 'INVALID_EMAIL_TYPE'
            });
            return this.createValidationResult(false, errors, [], Date.now(), []);
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push({
                type: AuthErrorType.VALIDATION_ERROR,
                message: 'Invalid email format',
                field: 'email',
                code: 'INVALID_EMAIL_FORMAT'
            });
        }

        // Length validation
        if (email.length > 254) {
            errors.push({
                type: AuthErrorType.VALIDATION_ERROR,
                message: 'Email address is too long',
                field: 'email',
                code: 'EMAIL_TOO_LONG'
            });
        }

        return this.createValidationResult(errors.length === 0, errors, [], Date.now(), ['email_format']);
    }

    /**
     * Validates password strength
     */
    private validatePassword(password: string): ValidationResult {
        const errors: Array<{ type: AuthErrorType; message: string; field?: string; code?: string }> = [];
        const warnings: Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' }> = [];

        if (!password || typeof password !== 'string') {
            errors.push({
                type: AuthErrorType.VALIDATION_ERROR,
                message: 'Password is required and must be a string',
                field: 'password',
                code: 'INVALID_PASSWORD_TYPE'
            });
            return this.createValidationResult(false, errors, warnings, Date.now(), []);
        }

        // Length validation
        if (password.length < 8) {
            errors.push({
                type: AuthErrorType.VALIDATION_ERROR,
                message: 'Password must be at least 8 characters long',
                field: 'password',
                code: 'PASSWORD_TOO_SHORT'
            });
        }

        // Strength validation (warnings only)
        if (!/[A-Z]/.test(password)) {
            warnings.push({
                type: 'password_strength',
                message: 'Password should contain at least one uppercase letter',
                severity: 'medium'
            });
        }

        if (!/[a-z]/.test(password)) {
            warnings.push({
                type: 'password_strength',
                message: 'Password should contain at least one lowercase letter',
                severity: 'medium'
            });
        }

        if (!/[0-9]/.test(password)) {
            warnings.push({
                type: 'password_strength',
                message: 'Password should contain at least one number',
                severity: 'medium'
            });
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            warnings.push({
                type: 'password_strength',
                message: 'Password should contain at least one special character',
                severity: 'low'
            });
        }

        return this.createValidationResult(errors.length === 0, errors, warnings, Date.now(), ['password_strength']);
    }

    /**
     * Creates validation result with metadata
     */
    private createValidationResult(
        isValid: boolean,
        errors: Array<{ type: AuthErrorType; message: string; field?: string; code?: string }>,
        warnings: Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' }>,
        startTime: number,
        rulesApplied: string[]
    ): ValidationResult {
        const duration = Date.now() - startTime;
        this.statistics.totalDuration += duration;

        const result: ValidationResult = {
            isValid,
            metadata: {
                duration,
                rulesApplied,
                timestamp: new Date()
            }
        };

        if (errors.length > 0) {
            result.errors = errors;
        }

        if (warnings.length > 0) {
            result.warnings = warnings;
        }

        return result;
    }
}
