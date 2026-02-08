/**
 * AuthValidator Unit Tests
 *
 * Tests for the authentication validation system including
 * rule composition, security validation, and performance tracking.
 */

import { jest } from '@jest/globals';
import { AuthValidator } from '../../../enterprise/AuthValidator';

import type { 
    IAuthValidator, 
    ValidationRule, 
    ValidationRuleGroup, 
    ValidationResult, 
    SecurityContext,
    AsyncValidationOptions 
} from '../../../interfaces/IAuthValidator';
import type { IAuthLogger, IAuthMetrics, IAuthSecurityService } from '../../../interfaces/authInterfaces';
import type { AuthCredentials, AuthErrorType } from '../../../types/auth.domain.types';

// Mock implementations
class MockAuthLogger implements IAuthLogger {
    readonly name = 'MockAuthLogger';
    readonly level = 'info' as const;
    log(event: any): void {
        // Mock implementation
    }
    logError(error: Error, context?: any): void {
        // Mock implementation
    }
    logSecurity(event: any): void {
        // Mock implementation
    }
    getEvents(): any[] {
        return [];
    }
    clear(): void {
        // Mock implementation
    }
    setLevel(): void {
        // Mock implementation
    }
}

class MockAuthMetrics implements IAuthMetrics {
    readonly name = 'MockAuthMetrics';
    recordAttempt(type: string, duration: number): void {
        // Mock implementation
    }
    recordSuccess(type: string, duration: number): void {
        // Mock implementation
    }
    recordFailure(type: string, error: AuthErrorType, duration: number): void {
        // Mock implementation
    }
    getMetrics(timeRange?: { start: Date; end: Date }): any {
        return {
            totalAttempts: 0,
            successRate: 0,
            failureRate: 0,
            averageDuration: 0,
            errorsByType: {}
        };
    }
    reset(): void {
        // Mock implementation
    }
}

class MockSecurityService implements IAuthSecurityService {
    readonly name = 'MockSecurityService';
    detectSuspiciousActivity(): any[] {
        return [];
    }
    validateSecurityHeaders(): boolean {
        return true;
    }
    checkRateLimit(): boolean {
        return true;
    }
    encryptSensitiveData(data: string): string {
        return `encrypted_${data}`;
    }
    decryptSensitiveData(encryptedData: string): string {
        return encryptedData.replace('encrypted_', '');
    }
    getClientIP(): string {
        return '127.0.0.1';
    }
}

describe('AuthValidator', () => {
    let authValidator: AuthValidator;
    let logger: IAuthLogger;
    let metrics: IAuthMetrics;
    let security: IAuthSecurityService;

    beforeEach(() => {
        logger = new MockAuthLogger();
        metrics = new MockAuthMetrics();
        security = new MockSecurityService();
        
        authValidator = new AuthValidator(logger, metrics, security);
    });

    describe('Basic Validation', () => {
        it('should validate credentials successfully', async () => {
            const credentials: AuthCredentials = {
                username: 'testuser',
                password: 'SecurePass123!'
            };

            const result = await authValidator.validateCredentials(credentials);

            expect(result.success).toBe(true);
            expect(result.data).toBe(true);
        });

        it('should reject invalid credentials', async () => {
            const credentials: AuthCredentials = {
                username: '',
                password: 'weak'
            };

            const result = await authValidator.validateCredentials(credentials);

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.error?.type).toBe('VALIDATION_ERROR');
        });

        it('should validate tokens successfully', async () => {
            const token = 'valid.jwt.token';

            const result = await authValidator.validateToken(token);

            expect(result.success).toBe(true);
            expect(result.data).toBe(true);
        });

        it('should reject invalid tokens', async () => {
            const token = 'invalid-token';

            const result = await authValidator.validateToken(token);

            expect(result.success).toBe(false);
            expect(result.error?.type).toBe('INVALID_TOKEN');
        });
    });

    describe('Rule Composition', () => {
        it('should create and execute validation rules', async () => {
            const rule: ValidationRule = {
                name: 'username-rule',
                priority: 1,
                enabled: true,
                validate: async (data: any) => {
                    const username = (data as any)?.username;
                    return {
                        success: username && username.length >= 3,
                        data: username,
                        errors: username && username.length >= 3 ? [] : ['Username too short']
                    };
                }
            };

            authValidator.addRule(rule);

            const credentials = { username: 'test', password: 'pass' };
            const result = await authValidator.validateWithRules(credentials);

            expect(result.success).toBe(true);
        });

        it('should handle rule groups', async () => {
            const usernameRule: ValidationRule = {
                name: 'username-rule',
                priority: 1,
                enabled: true,
                validate: async (data: any) => ({
                    success: (data as any)?.username?.length >= 3,
                    data: (data as any)?.username,
                    errors: (data as any)?.username?.length >= 3 ? [] : ['Username too short']
                })
            };

            const passwordRule: ValidationRule = {
                name: 'password-rule',
                priority: 2,
                enabled: true,
                validate: async (data: any) => ({
                    success: (data as any)?.password?.length >= 8,
                    data: (data as any)?.password,
                    errors: (data as any)?.password?.length >= 8 ? [] : ['Password too short']
                })
            };

            const ruleGroup: ValidationRuleGroup = {
                name: 'credentials-group',
                description: 'Validate username and password',
                rules: [usernameRule, passwordRule],
                executionMode: 'all',
                enabled: true
            };

            authValidator.addRuleGroup(ruleGroup);

            const credentials = { username: 'test', password: 'strongpassword' };
            const result = await authValidator.validateWithRuleGroup('credentials-group', credentials);

            expect(result.success).toBe(true);
        });

        it('should execute rules in priority order', async () => {
            const executionOrder: string[] = [];

            const highPriorityRule: ValidationRule = {
                name: 'high-priority',
                priority: 1,
                enabled: true,
                validate: async (data: any) => {
                    executionOrder.push('high-priority');
                    return { success: true, data: data, errors: [] };
                }
            };

            const lowPriorityRule: ValidationRule = {
                name: 'low-priority',
                priority: 10,
                enabled: true,
                validate: async (data: any) => {
                    executionOrder.push('low-priority');
                    return { success: true, data: data, errors: [] };
                }
            };

            authValidator.addRule(highPriorityRule);
            authValidator.addRule(lowPriorityRule);

            await authValidator.validateWithRules({});

            expect(executionOrder).toEqual(['high-priority', 'low-priority']);
        });
    });

    describe('Async Validation', () => {
        it('should support async validation options', async () => {
            const options: AsyncValidationOptions = {
                timeout: 1000,
                parallel: true,
                failFast: false
            };

            const slowRule: ValidationRule = {
                name: 'slow-rule',
                priority: 1,
                enabled: true,
                validate: async (data: any) => {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    return { success: true, data: data, errors: [] };
                }
            };

            authValidator.addRule(slowRule);

            const startTime = Date.now();
            const result = await authValidator.validateWithRules({}, options);
            const endTime = Date.now();

            expect(result.success).toBe(true);
            expect(endTime - startTime).toBeLessThan(500); // Should complete quickly
        });

        it('should handle validation timeout', async () => {
            const options: AsyncValidationOptions = {
                timeout: 100,
                parallel: false,
                failFast: true
            };

            const slowRule: ValidationRule = {
                name: 'slow-rule',
                priority: 1,
                enabled: true,
                validate: async (data: any) => {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    return { success: true, data: data, errors: [] };
                }
            };

            authValidator.addRule(slowRule);

            const startTime = Date.now();
            const result = await authValidator.validateWithRules({}, options);
            const endTime = Date.now();

            expect(result.success).toBe(false);
            expect(endTime - startTime).toBeLessThan(200); // Should timeout
        });
    });

    describe('Security Context', () => {
        it('should validate with security context', async () => {
            const context: SecurityContext = {
                ipAddress: '127.0.0.1',
                userAgent: 'test-agent',
                requestId: 'req-123',
                timestamp: new Date()
            };

            const credentials: AuthCredentials = {
                username: 'testuser',
                password: 'SecurePass123!'
            };

            const result = await authValidator.validateCredentials(credentials, context);

            expect(result.success).toBe(true);
        });

        it('should detect suspicious activity', async () => {
            const suspiciousContext: SecurityContext = {
                ipAddress: '192.168.1.100',
                userAgent: 'bot-agent',
                requestId: 'req-456',
                timestamp: new Date()
            };

            jest.spyOn(security, 'detectSuspiciousActivity').mockReturnValue([
                { type: 'SUSPICIOUS_IP', details: { ip: '192.168.1.100' } }
            ]);

            const credentials: AuthCredentials = {
                username: 'testuser',
                password: 'SecurePass123!'
            };

            const result = await authValidator.validateCredentials(credentials, suspiciousContext);

            expect(result.success).toBe(false);
            expect(result.error?.type).toBe('SECURITY_RISK');
        });
    });

    describe('Performance Tracking', () => {
        it('should track validation performance', async () => {
            const recordSuccessSpy = jest.spyOn(metrics, 'recordSuccess');
            const recordAttemptSpy = jest.spyOn(metrics, 'recordAttempt');

            const credentials: AuthCredentials = {
                username: 'testuser',
                password: 'SecurePass123!'
            };

            await authValidator.validateCredentials(credentials);

            expect(recordAttemptSpy).toHaveBeenCalled();
            expect(recordSuccessSpy).toHaveBeenCalled();
        });

        it('should track validation failures', async () => {
            const recordFailureSpy = jest.spyOn(metrics, 'recordFailure');
            const recordAttemptSpy = jest.spyOn(metrics, 'recordAttempt');

            const credentials: AuthCredentials = {
                username: '',
                password: 'weak'
            };

            await authValidator.validateCredentials(credentials);

            expect(recordAttemptSpy).toHaveBeenCalled();
            expect(recordFailureSpy).toHaveBeenCalled();
        });

        it('should provide validation statistics', () => {
            const stats = authValidator.getStatistics();

            expect(stats).toBeDefined();
            expect(typeof stats.totalValidations).toBe('number');
            expect(typeof stats.successfulValidations).toBe('number');
            expect(typeof stats.failedValidations).toBe('number');
        });

        it('should reset validation statistics', () => {
            expect(() => {
                authValidator.resetStatistics();
            }).not.toThrow();
        });
    });

    describe('Rule Management', () => {
        it('should enable and disable rules', () => {
            const rule: ValidationRule = {
                name: 'test-rule',
                priority: 1,
                enabled: true,
                validate: async (data: any) => ({ success: true, data: data, errors: [] })
            };

            authValidator.addRule(rule);
            authValidator.disableRule('test-rule');
            
            const disabledRule = authValidator.getRule('test-rule');
            expect(disabledRule?.enabled).toBe(false);

            authValidator.enableRule('test-rule');
            
            const enabledRule = authValidator.getRule('test-rule');
            expect(enabledRule?.enabled).toBe(true);
        });

        it('should remove rules', () => {
            const rule: ValidationRule = {
                name: 'test-rule',
                priority: 1,
                enabled: true,
                validate: async (data: any) => ({ success: true, data: data, errors: [] })
            };

            authValidator.addRule(rule);
            authValidator.removeRule('test-rule');
            
            const removedRule = authValidator.getRule('test-rule');
            expect(removedRule).toBeUndefined();
        });

        it('should list all rules', () => {
            const rule1: ValidationRule = {
                name: 'rule1',
                priority: 1,
                enabled: true,
                validate: async (data: any) => ({ success: true, data: data, errors: [] })
            };

            const rule2: ValidationRule = {
                name: 'rule2',
                priority: 2,
                enabled: true,
                validate: async (data: any) => ({ success: true, data: data, errors: [] })
            };

            authValidator.addRule(rule1);
            authValidator.addRule(rule2);

            const rules = authValidator.getRules();
            expect(rules).toHaveLength(2);
            expect(rules.map(r => r.name)).toContain('rule1');
            expect(rules.map(r => r.name)).toContain('rule2');
        });
    });

    describe('Error Handling', () => {
        it('should handle rule execution errors gracefully', async () => {
            const errorRule: ValidationRule = {
                name: 'error-rule',
                priority: 1,
                enabled: true,
                validate: async (data: any) => {
                    throw new Error('Rule execution failed');
                }
            };

            authValidator.addRule(errorRule);

            const result = await authValidator.validateWithRules({});

            expect(result.success).toBe(false);
            expect(result.error?.type).toBe('VALIDATION_ERROR');
        });

        it('should handle security service errors', async () => {
            jest.spyOn(security, 'detectSuspiciousActivity').mockImplementation(() => {
                throw new Error('Security service error');
            });

            const credentials: AuthCredentials = {
                username: 'testuser',
                password: 'SecurePass123!'
            };

            const result = await authValidator.validateCredentials(credentials);

            expect(result.success).toBe(false);
        });
    });

    describe('Integration', () => {
        it('should work with complex validation scenarios', async () => {
            // Add multiple rules with different priorities
            const usernameRule: ValidationRule = {
                name: 'username-rule',
                priority: 1,
                enabled: true,
                validate: async (data: any) => ({
                    success: (data as any)?.username?.length >= 3,
                    data: (data as any)?.username,
                    errors: (data as any)?.username?.length >= 3 ? [] : ['Username too short']
                })
            };

            const passwordRule: ValidationRule = {
                name: 'password-rule',
                priority: 2,
                enabled: true,
                validate: async (data: any) => ({
                    success: (data as any)?.password?.length >= 8,
                    data: (data as any)?.password,
                    errors: (data as any)?.password?.length >= 8 ? [] : ['Password too short']
                })
            };

            const securityRule: ValidationRule = {
                name: 'security-rule',
                priority: 3,
                enabled: true,
                validate: async (data: any, context?: SecurityContext) => ({
                    success: !context?.ipAddress?.startsWith('192.168'),
                    data: data,
                    errors: context?.ipAddress?.startsWith('192.168') ? ['Private IP not allowed'] : []
                })
            };

            authValidator.addRule(usernameRule);
            authValidator.addRule(passwordRule);
            authValidator.addRule(securityRule);

            const credentials = {
                username: 'testuser',
                password: 'strongpassword'
            };

            const context: SecurityContext = {
                ipAddress: '203.0.113.1',
                userAgent: 'test-agent',
                requestId: 'req-789',
                timestamp: new Date()
            };

            const result = await authValidator.validateWithRules(credentials, { context });

            expect(result.success).toBe(true);
        });
    });
});
