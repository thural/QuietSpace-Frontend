/**
 * IAuthValidator Interface Unit Tests
 * 
 * Tests for enhanced IAuthValidator interface including:
 * - Validation rule composition
 * - Async validation support
 * - Improved error reporting
 * - Validation metrics and statistics
 */

import type {
    IAuthValidator,
    ValidationRule,
    ValidationRuleGroup,
    ValidationResult,
    AsyncValidationOptions,
    SecurityContext
} from '../../../interfaces/IAuthValidator';
import type { AuthCredentials, AuthEvent, AuthErrorType } from '../../../types/auth.domain.types';

// Mock implementation for testing
const createMockAuthValidator = (): IAuthValidator => ({
    name: 'test-validator',
    version: '1.0.0',
    rules: {},

    // Legacy sync methods
    validateCredentials: jest.fn(),
    validateToken: jest.fn(),
    validateUser: jest.fn(),
    validateAuthEvent: jest.fn(),
    validateSecurityContext: jest.fn(),

    // Enhanced async methods
    validateCredentialsAsync: jest.fn(),
    validateTokenAsync: jest.fn(),
    validateUserAsync: jest.fn(),
    validateBatch: jest.fn(),
    validateWithRuleGroup: jest.fn(),
    validateWithRule: jest.fn(),

    // Rule management
    addValidationRule: jest.fn(),
    addRule: jest.fn(),
    removeRule: jest.fn(),
    getRule: jest.fn(),
    listRules: jest.fn(),
    createRuleGroup: jest.fn(),
    removeRuleGroup: jest.fn(),
    getRuleGroup: jest.fn(),
    listRuleGroups: jest.fn(),

    // Rule control
    setRuleEnabled: jest.fn(),
    isRuleEnabled: jest.fn(),
    setRulePriority: jest.fn(),
    getRulePriority: jest.fn(),

    // Enhanced statistics
    getStatistics: jest.fn(),
    resetStatistics: jest.fn(),

    // Enhanced async methods
    validateSecurityContextAsync: jest.fn(),
    validateAuthEventAsync: jest.fn()
});

const createMockValidationResult = (isValid: boolean, errors?: string[]): ValidationResult => ({
    isValid,
    errors: errors?.map(error => ({
        type: 'validation_error' as AuthErrorType,
        message: error,
        severity: 'medium' as const,
        rule: 'test-rule',
        timestamp: new Date()
    })) || [],
    warnings: [],
    metadata: {
        duration: 10,
        rulesApplied: ['test-rule'],
        timestamp: new Date(),
        async: false,
        parallel: false,
        retryCount: 0
    },
    suggestions: []
});

const createMockSecurityContext = (): SecurityContext => ({
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    requestId: 'req-123',
    sessionId: 'session-456',
    timestamp: new Date(),
    metadata: { source: 'web' }
});

describe('IAuthValidator Interface', () => {
    let validator: IAuthValidator;
    let mockCredentials: AuthCredentials;
    let mockContext: SecurityContext;
    let mockEvent: AuthEvent;

    beforeEach(() => {
        validator = createMockAuthValidator();
        mockCredentials = { username: 'test', password: 'password' };
        mockContext = createMockSecurityContext();
        mockEvent = {
            type: 'login_attempt',
            timestamp: new Date(),
            details: { provider: 'oauth' }
        } as AuthEvent;
        jest.clearAllMocks();
    });

    describe('Enhanced Async Validation Methods', () => {
        it('should validate credentials asynchronously with options', async () => {
            const expectedResult = createMockValidationResult(true);
            (validator.validateCredentialsAsync as jest.Mock).mockResolvedValue(expectedResult);

            const options: AsyncValidationOptions = {
                timeout: 5000,
                parallel: true,
                maxConcurrency: 3,
                failFast: false,
                retryAttempts: 2
            };

            const result = await validator.validateCredentialsAsync(mockCredentials, mockContext, options);

            expect(validator.validateCredentialsAsync).toHaveBeenCalledWith(mockCredentials, mockContext, options);
            expect(result).toEqual(expectedResult);
        });

        it('should validate token asynchronously', async () => {
            const expectedResult = createMockValidationResult(false, ['Token expired']);
            (validator.validateTokenAsync as jest.Mock).mockResolvedValue(expectedResult);

            const result = await validator.validateTokenAsync('invalid-token', mockContext);

            expect(validator.validateTokenAsync).toHaveBeenCalledWith('invalid-token', mockContext, undefined);
            expect(result.isValid).toBe(false);
            expect(result.errors).toHaveLength(1);
        });

        it('should validate user data asynchronously', async () => {
            const userData = { email: 'test@example.com', name: 'Test User' };
            const expectedResult = createMockValidationResult(true);
            (validator.validateUserAsync as jest.Mock).mockResolvedValue(expectedResult);

            const result = await validator.validateUserAsync(userData, mockContext);

            expect(validator.validateUserAsync).toHaveBeenCalledWith(userData, mockContext, undefined);
            expect(result.isValid).toBe(true);
        });

        it('should validate multiple items in batch', async () => {
            const batchItems = [
                { type: 'credentials' as const, data: mockCredentials },
                { type: 'token' as const, data: 'test-token' },
                { type: 'user' as const, data: { id: 1, name: 'Test' } }
            ];

            const expectedResults = [
                createMockValidationResult(true),
                createMockValidationResult(true),
                createMockValidationResult(false, ['Invalid user data'])
            ];

            (validator.validateBatch as jest.Mock).mockResolvedValue(expectedResults);

            const results = await validator.validateBatch(batchItems, mockContext);

            expect(validator.validateBatch).toHaveBeenCalledWith(batchItems, mockContext, undefined);
            expect(results).toHaveLength(3);
            expect(results[2].isValid).toBe(false);
        });

        it('should handle async validation with timeout', async () => {
            const options: AsyncValidationOptions = { timeout: 100 };
            (validator.validateCredentialsAsync as jest.Mock).mockImplementation(
                () => new Promise(resolve => setTimeout(resolve, 200))
            );

            await expect(validator.validateCredentialsAsync(mockCredentials, mockContext, options))
                .rejects.toThrow();
        });
    });

    describe('Validation Rule Composition', () => {
        it('should add validation rule with full configuration', () => {
            const rule: ValidationRule = {
                name: 'custom-rule',
                priority: 5,
                enabled: true,
                validate: jest.fn().mockResolvedValue(createMockValidationResult(true)),
                description: 'Custom validation rule',
                metadata: { category: 'security' }
            };

            validator.addValidationRule(rule);

            expect(validator.addValidationRule).toHaveBeenCalledWith(rule);
        });

        it('should create and manage rule groups', () => {
            const ruleGroup: ValidationRuleGroup = {
                name: 'security-rules',
                description: 'Security validation rules',
                rules: [
                    {
                        name: 'password-strength',
                        priority: 1,
                        enabled: true,
                        validate: jest.fn()
                    },
                    {
                        name: 'email-format',
                        priority: 2,
                        enabled: true,
                        validate: jest.fn()
                    }
                ],
                executionMode: 'all',
                enabled: true
            };

            validator.createRuleGroup(ruleGroup);
            expect(validator.createRuleGroup).toHaveBeenCalledWith(ruleGroup);

            validator.removeRuleGroup('security-rules');
            expect(validator.removeRuleGroup).toHaveBeenCalledWith('security-rules');
        });

        it('should validate using rule group', async () => {
            const expectedResult = createMockValidationResult(true);
            (validator.validateWithRuleGroup as jest.Mock).mockResolvedValue(expectedResult);

            const options: AsyncValidationOptions = { timeout: 5000 };
            const result = await validator.validateWithRuleGroup('security-rules', mockCredentials, mockContext, options);

            expect(validator.validateWithRuleGroup).toHaveBeenCalledWith('security-rules', mockCredentials, mockContext, options);
            expect(result).toEqual(expectedResult);
        });

        it('should validate using specific rule', async () => {
            const expectedResult = createMockValidationResult(false, ['Rule validation failed']);
            (validator.validateWithRule as jest.Mock).mockResolvedValue(expectedResult);

            const options: AsyncValidationOptions = { retryAttempts: 3 };
            const result = await validator.validateWithRule('password-strength', mockCredentials, mockContext, options);

            expect(validator.validateWithRule).toHaveBeenCalledWith('password-strength', mockCredentials, mockContext, options);
            expect(result.isValid).toBe(false);
        });
    });

    describe('Rule Management and Control', () => {
        it('should enable and disable validation rules', () => {
            (validator.isRuleEnabled as jest.Mock).mockReturnValue(false);
            (validator.setRuleEnabled as jest.Mock).mockReturnValue(true);

            expect(validator.isRuleEnabled('test-rule')).toBe(false);

            const result = validator.setRuleEnabled('test-rule', true);
            expect(result).toBe(true);
            expect(validator.setRuleEnabled).toHaveBeenCalledWith('test-rule', true);
        });

        it('should manage rule priorities', () => {
            (validator.getRulePriority as jest.Mock).mockReturnValue(5);
            (validator.setRulePriority as jest.Mock).mockReturnValue(true);

            expect(validator.getRulePriority('test-rule')).toBe(5);

            const result = validator.setRulePriority('test-rule', 10);
            expect(result).toBe(true);
            expect(validator.setRulePriority).toHaveBeenCalledWith('test-rule', 10);
        });

        it('should list rules with filtering', () => {
            const enabledRules = ['rule1', 'rule2'];
            const allRules = ['rule1', 'rule2', 'rule3'];

            (validator.listRules as jest.Mock).mockImplementation((enabledOnly) =>
                enabledOnly ? enabledRules : allRules
            );

            expect(validator.listRules()).toEqual(allRules);
            expect(validator.listRules(true)).toEqual(enabledRules);
        });
    });

    describe('Enhanced Error Reporting', () => {
        it('should provide detailed validation results with suggestions', async () => {
            const enhancedResult: ValidationResult = {
                isValid: false,
                errors: [
                    {
                        type: 'weak_password' as AuthErrorType,
                        message: 'Password is too weak',
                        field: 'password',
                        code: 'PW001',
                        severity: 'high',
                        rule: 'password-strength',
                        timestamp: new Date(),
                        context: { minLength: 8 }
                    }
                ],
                warnings: [
                    {
                        type: 'password_reuse',
                        message: 'Password may have been used before',
                        severity: 'medium',
                        rule: 'password-history',
                        timestamp: new Date()
                    }
                ],
                metadata: {
                    duration: 25,
                    rulesApplied: ['password-strength', 'password-history'],
                    timestamp: new Date(),
                    async: true,
                    parallel: false,
                    retryCount: 1
                },
                suggestions: [
                    {
                        type: 'password_improvement',
                        message: 'Use a mix of letters, numbers, and symbols',
                        priority: 'high',
                        action: 'regenerate_password'
                    }
                ]
            };

            (validator.validateCredentialsAsync as jest.Mock).mockResolvedValue(enhancedResult);

            const result = await validator.validateCredentialsAsync(mockCredentials, mockContext);

            expect(result.isValid).toBe(false);
            expect(result.errors && result.errors.length).toBe(1);
            expect(result.errors && result.errors[0].severity).toBe('high');
            expect(result.warnings && result.warnings.length).toBe(1);
            expect(result.suggestions && result.suggestions.length).toBe(1);
            expect(result.metadata?.async).toBe(true);
        });
    });

    describe('Validation Statistics and Metrics', () => {
        it('should provide comprehensive validation statistics', () => {
            const expectedStats = {
                totalValidations: 1000,
                successRate: 0.95,
                averageDuration: 15.5,
                ruleUsage: {
                    'password-strength': 800,
                    'email-format': 950,
                    'security-check': 600
                },
                errorTypes: {
                    'weak_password': 30,
                    'invalid_email': 15,
                    'security_violation': 5
                },
                asyncValidations: 200,
                batchValidations: 50,
                ruleGroupUsage: {
                    'security-rules': 400,
                    'business-rules': 300
                },
                performanceByRule: {
                    'password-strength': {
                        averageDuration: 20,
                        successRate: 0.92,
                        usageCount: 800
                    },
                    'email-format': {
                        averageDuration: 5,
                        successRate: 0.98,
                        usageCount: 950
                    }
                }
            };

            (validator.getStatistics as jest.Mock).mockReturnValue(expectedStats);

            const stats = validator.getStatistics();

            expect(stats.totalValidations).toBe(1000);
            expect(stats.successRate).toBe(0.95);
            expect(stats.asyncValidations).toBe(200);
            expect(stats.performanceByRule['password-strength'].averageDuration).toBe(20);
        });

        it('should reset validation statistics', () => {
            validator.resetStatistics();
            expect(validator.resetStatistics).toHaveBeenCalled();
        });
    });

    describe('Enhanced Security Context Validation', () => {
        it('should validate security context asynchronously', async () => {
            const expectedResult = createMockValidationResult(true);
            (validator.validateSecurityContextAsync as jest.Mock).mockResolvedValue(expectedResult);

            const options: AsyncValidationOptions = { timeout: 3000 };
            const result = await validator.validateSecurityContextAsync(mockContext, options);

            expect(validator.validateSecurityContextAsync).toHaveBeenCalledWith(mockContext, options);
            expect(result.isValid).toBe(true);
        });

        it('should validate authentication events asynchronously', async () => {
            const expectedResult = createMockValidationResult(false, ['Suspicious activity detected']);
            (validator.validateAuthEventAsync as jest.Mock).mockResolvedValue(expectedResult);

            const options: AsyncValidationOptions = { failFast: true };
            const result = await validator.validateAuthEventAsync(mockEvent, options);

            expect(validator.validateAuthEventAsync).toHaveBeenCalledWith(mockEvent, options);
            expect(result.isValid).toBe(false);
            expect(result.errors).toHaveLength(1);
        });
    });

    describe('Backward Compatibility', () => {
        it('should support legacy sync validation methods', () => {
            const expectedResult = createMockValidationResult(true);
            (validator.validateCredentials as jest.Mock).mockReturnValue(expectedResult);
            (validator.validateToken as jest.Mock).mockReturnValue(expectedResult);
            (validator.validateUser as jest.Mock).mockReturnValue(expectedResult);

            const credResult = validator.validateCredentials(mockCredentials, mockContext);
            const tokenResult = validator.validateToken('test-token', mockContext);
            const userResult = validator.validateUser({ id: 1 }, mockContext);

            expect(credResult).toEqual(expectedResult);
            expect(tokenResult).toEqual(expectedResult);
            expect(userResult).toEqual(expectedResult);
        });

        it('should support legacy rule management', () => {
            const legacyRule = jest.fn().mockReturnValue(createMockValidationResult(true));

            validator.addRule('legacy-rule', legacyRule, 3);
            expect(validator.addRule).toHaveBeenCalledWith('legacy-rule', legacyRule, 3);

            const rule = validator.getRule('legacy-rule');
            expect(validator.getRule).toHaveBeenCalledWith('legacy-rule');
        });
    });
});
