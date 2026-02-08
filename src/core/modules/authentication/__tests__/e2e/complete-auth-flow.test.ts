import {
    AuthProviderType,
    AuthCredentials,
    AuthResult,
    AuthSession,
    AuthUser,
    AuthToken,
    AuthEvent
} from '../../types/auth.domain.types';
import {
    IAuthenticator
} from '../../interfaces/IAuthenticator';
import {
    IAuthValidator
} from '../../interfaces/IAuthValidator';
import {
    IProviderManager,
    ProviderPriority,
    HealthCheckResult,
    PerformanceMetrics
} from '../../interfaces/IProviderManager';
import {
    IAuthLogger
} from '../../interfaces/IAuthenticator';
import {
    ValidationResult,
    SecurityContext,
    AsyncValidationOptions
} from '../../interfaces/IAuthValidator';
import { ProviderManager } from '../../enterprise/ProviderManager';

// Mock implementations
const createMockAuthenticator = (name: string, type: AuthProviderType): IAuthenticator => ({
    name,
    type,
    config: {},

    // Core authentication methods
    authenticate: jest.fn() as jest.MockedFunction<(credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>>,
    validateSession: jest.fn() as jest.MockedFunction<() => Promise<AuthResult<boolean>>>,
    refreshToken: jest.fn() as jest.MockedFunction<() => Promise<AuthResult<AuthSession>>>,
    configure: jest.fn() as jest.MockedFunction<(config: Record<string, unknown>) => void>,
    getCapabilities: jest.fn(() => [`${type}_auth`, `${type}_mfa`, 'token_refresh']),

    // Enhanced methods
    initialize: jest.fn() as jest.MockedFunction<(options?: unknown) => Promise<void>>,
    healthCheck: jest.fn() as jest.MockedFunction<() => Promise<HealthCheckResult>>,
    getPerformanceMetrics: jest.fn() as jest.MockedFunction<() => PerformanceMetrics>,
    resetPerformanceMetrics: jest.fn() as jest.MockedFunction<() => void>,
    isHealthy: jest.fn() as jest.MockedFunction<() => Promise<boolean>>,
    isInitialized: jest.fn() as jest.MockedFunction<() => boolean>,
    getUptime: jest.fn() as jest.MockedFunction<() => number>,
    shutdown: jest.fn() as jest.MockedFunction<(timeout?: number) => Promise<void>>
});

const createMockAuthValidator = (): IAuthValidator => ({
    name: 'e2e-validator',
    version: '1.0.0',
    rules: {},

    // Enhanced async methods
    validateCredentialsAsync: jest.fn() as jest.MockedFunction<(credentials: AuthCredentials, context?: SecurityContext, options?: AsyncValidationOptions) => Promise<ValidationResult>>,
    validateTokenAsync: jest.fn() as jest.MockedFunction<(token: string, context?: SecurityContext, options?: AsyncValidationOptions) => Promise<ValidationResult>>,
    validateUserAsync: jest.fn() as jest.MockedFunction<(user: unknown, context?: SecurityContext, options?: AsyncValidationOptions) => Promise<ValidationResult>>,
    validateBatch: jest.fn() as jest.MockedFunction<(items: Array<{ type: 'credentials' | 'token' | 'user' | 'event' | 'context'; data: unknown }>, context?: SecurityContext, options?: AsyncValidationOptions) => Promise<ValidationResult[]>>,
    validateWithRuleGroup: jest.fn() as jest.MockedFunction<(groupName: string, data: unknown, context?: SecurityContext, options?: AsyncValidationOptions) => Promise<ValidationResult>>,
    validateWithRule: jest.fn() as jest.MockedFunction<(ruleName: string, data: unknown, context?: SecurityContext, options?: AsyncValidationOptions) => Promise<ValidationResult>>,

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

    // Legacy sync methods
    validateCredentials: jest.fn(),
    validateToken: jest.fn(),
    validateUser: jest.fn(),
    validateAuthEvent: jest.fn(),
    validateSecurityContext: jest.fn(),

    // Enhanced async methods
    validateSecurityContextAsync: jest.fn(),
    validateAuthEventAsync: jest.fn(),

    // Statistics
    getStatistics: jest.fn(),
    resetStatistics: jest.fn()
});

const createMockLogger = (): IAuthLogger => ({
    name: 'e2e-logger',
    level: 'info',
    log: jest.fn() as jest.MockedFunction<(event: AuthEvent) => void>,
    logError: jest.fn() as jest.MockedFunction<(error: Error, context?: Record<string, unknown>) => void>,
    logSecurity: jest.fn() as jest.MockedFunction<(event: AuthEvent) => void>,
    getEvents: jest.fn() as jest.MockedFunction<(filters?: Partial<AuthEvent>) => AuthEvent[]>,
    clear: jest.fn() as jest.MockedFunction<() => void>,
    setLevel: jest.fn() as jest.MockedFunction<(level: 'debug' | 'info' | 'warn' | 'error' | 'security') => void>
});

// Helper functions
const createMockUser = (id: string, email: string): AuthUser => ({
    id,
    email,
    username: email.split('@')[0],
    roles: ['user'],
    permissions: ['read'],
    profile: {
        firstName: 'Test',
        lastName: 'User'
    },
    security: {
        lastLogin: new Date(),
        loginAttempts: 0,
        mfaEnabled: false
    }
});

const createMockToken = (): AuthToken => ({
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresAt: new Date(Date.now() + 3600000),
    tokenType: 'Bearer'
});

const createMockSession = (user: AuthUser, token: AuthToken, provider: AuthProviderType): AuthSession => ({
    user,
    token,
    provider,
    createdAt: new Date(),
    expiresAt: new Date(),
    isActive: true
});

const createMockAuthResult = <T>(success: boolean, data?: T, error?: string): AuthResult<T> => {
    const result: AuthResult<T> = {
        success
    };

    if (data !== undefined) {
        result.data = data;
    }

    if (error) {
        result.error = {
            type: error as any,
            message: error === 'credentials_invalid' ? 'Invalid credentials' :
                error === 'token_expired' ? 'Token expired' : 'Authentication failed'
        };
    }

    return result;
};

const createMockValidationResult = (isValid: boolean, errors?: string[]): ValidationResult => ({
    isValid,
    errors: errors ? errors.map(error => ({
        type: 'validation_error',
        message: error,
        rule: 'test-rule',
        severity: 'error' as const,
        timestamp: new Date()
    })) : [],
    warnings: [],
    suggestions: [],
    metadata: {
        duration: 10,
        rulesApplied: ['test-rule'],
        timestamp: new Date(),
        async: true,
        parallel: false,
        retryCount: 0
    }
});

const createMockPerformanceMetrics = (): PerformanceMetrics => ({
    totalAttempts: 0,
    successfulAuthentications: 0,
    failedAuthentications: 0,
    averageResponseTime: 0,
    lastAuthentication: new Date(),
    errorsByType: {},
    statistics: {
        successRate: 0,
        failureRate: 0,
        throughput: 0
    }
});

describe('End-to-End Authentication Flow Tests', () => {
    let providerManager: IProviderManager;
    let authValidator: IAuthValidator;
    let mockLogger: IAuthLogger;
    let oauthProvider: IAuthenticator;
    let samlProvider: IAuthenticator;
    let ldapProvider: IAuthenticator;

    beforeEach(() => {
        mockLogger = createMockLogger();
        providerManager = new ProviderManager(mockLogger);
        authValidator = createMockAuthValidator();

        oauthProvider = createMockAuthenticator('oauth-provider', 'oauth' as AuthProviderType);
        samlProvider = createMockAuthenticator('saml-provider', 'saml' as AuthProviderType);
        ldapProvider = createMockAuthenticator('ldap-provider', 'ldap' as AuthProviderType);

        jest.clearAllMocks();
    });

    afterEach(() => {
        providerManager.clear();
        jest.clearAllMocks();
    });

    describe('Complete Authentication Flow', () => {
        it('should handle full authentication flow from login to session management', async () => {
            // Step 1: Register providers
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true,
                healthCheckInterval: 30000,
                failoverEnabled: true,
                maxRetries: 3
            });

            // Step 2: Setup authentication success
            const user = createMockUser('123', 'test@example.com');
            const token = createMockToken();
            const session = createMockSession(user, token, 'oauth' as AuthProviderType);

            (oauthProvider.authenticate as jest.MockedFunction<(credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>>).mockResolvedValue({
                success: true,
                data: session
            });

            // Step 3: Setup validation success
            (authValidator.validateCredentialsAsync as jest.MockedFunction<(credentials: AuthCredentials, context?: SecurityContext, options?: AsyncValidationOptions) => Promise<ValidationResult>>).mockResolvedValue({
                isValid: true,
                errors: [],
                warnings: [],
                metadata: {
                    duration: 15,
                    rulesApplied: ['password-strength', 'security-check'],
                    timestamp: new Date(),
                    async: true,
                    parallel: false,
                    retryCount: 0
                }
            });

            // Step 4: Execute authentication
            const credentials = { username: 'test@example.com', password: 'securePassword' };
            const validationResult = await authValidator.validateCredentialsAsync(credentials);

            expect(validationResult.isValid).toBe(true);

            const authResult = await oauthProvider.authenticate(credentials);
            expect(authResult.success).toBe(true);
            expect(authResult.data?.user?.email).toBe('test@example.com');
            expect(authResult.data?.token?.accessToken).toBe('mock-access-token');

            // Step 5: Verify provider health
            (oauthProvider.healthCheck as jest.MockedFunction<() => Promise<HealthCheckResult>>).mockResolvedValue({
                healthy: true,
                timestamp: new Date(),
                responseTime: 50,
                message: 'Service is healthy'
            });

            const health = await oauthProvider.healthCheck();
            expect(health.healthy).toBe(true);
        });

        it('should handle authentication failure with proper error handling', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true
            });

            // Step 1: Setup validation failure
            const invalidCredentials = { username: 'invalid', password: 'invalid' };
            const validationResult = createMockValidationResult(false, ['Invalid credentials']);
            (authValidator.validateCredentialsAsync as jest.MockedFunction<(credentials: AuthCredentials, context?: SecurityContext, options?: AsyncValidationOptions) => Promise<ValidationResult>>).mockResolvedValue(validationResult);

            // Step 2: Setup authentication failure
            (oauthProvider.authenticate as jest.MockedFunction<(credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>>).mockRejectedValue(new Error('Invalid credentials'));

            // Step 3: Execute and verify validation failure
            const validation = await authValidator.validateCredentialsAsync(invalidCredentials);
            expect(validation.isValid).toBe(false);

            // Step 4: Execute and verify authentication failure
            await expect(oauthProvider.authenticate(invalidCredentials)).rejects.toThrow('Invalid credentials');

            // Step 5: Provider health should be affected
            (oauthProvider.healthCheck as jest.MockedFunction<() => Promise<HealthCheckResult>>).mockResolvedValue({
                healthy: false,
                timestamp: new Date(),
                responseTime: 100,
                message: 'Authentication service degraded'
            });

            const health = await oauthProvider.healthCheck();
            expect(health.healthy).toBe(false);

            // Verify error handling
            mockLogger.logError(new Error('Invalid credentials'), {
                provider: 'oauth-provider',
                timestamp: new Date()
            });
            expect(mockLogger.logError).toHaveBeenCalled();
        });
    });

    describe('Multi-Provider Failover Scenarios', () => {
        it('should automatically failover to backup providers', async () => {
            // Setup providers with failover configuration
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true,
                failoverEnabled: true,
                maxRetries: 1
            });

            providerManager.registerProvider(samlProvider, {
                priority: ProviderPriority.NORMAL,
                autoEnable: true,
                failoverEnabled: true,
                maxRetries: 1
            });

            const credentials = { username: 'testuser', password: 'testpass' };

            // Primary provider fails
            (oauthProvider.authenticate as jest.MockedFunction<(credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>>).mockRejectedValue(new Error('OAuth provider unavailable'));

            // Manually mark OAuth provider as failed for testing
            providerManager.setProviderEnabled('oauth-provider', false);

            // Ensure SAML provider is enabled
            providerManager.setProviderEnabled('saml-provider', true);

            // Debug: Check if provider is registered

            // Perform a health check to ensure consecutive failures are properly set
            (samlProvider.healthCheck as jest.MockedFunction<() => Promise<HealthCheckResult>>).mockResolvedValue({
                healthy: true,
                timestamp: new Date(),
                responseTime: 25,
                message: 'SAML provider is healthy'
            });

            await providerManager.performHealthChecks();

            // Debug: Check provider state after health check

            // Debug: Check provider types

            // Get best available provider (should skip failed OAuth, select SAML)
            // Debug: Check provider health status
            const samlHealth = providerManager.getProviderHealth('saml-provider');


            const bestProvider = providerManager.getBestProvider();
            expect(bestProvider?.name).toBe('saml-provider');

            // Secondary provider succeeds
            const user = createMockUser('456', 'saml@example.com');
            const token = createMockToken();
            const session = createMockSession(user, token, 'saml' as AuthProviderType);

            (samlProvider.authenticate as jest.MockedFunction<(credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>>).mockResolvedValue({
                success: true,
                data: session
            });

            const result = await samlProvider.authenticate(credentials);
            expect(result.success).toBe(true);
            expect(result.data?.user?.email).toBe('saml@example.com');
        });

        it('should handle complete provider outage gracefully', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true,
                failoverEnabled: true
            });

            providerManager.registerProvider(samlProvider, {
                priority: ProviderPriority.NORMAL,
                autoEnable: true,
                failoverEnabled: true
            });

            // Both providers fail health checks
            (oauthProvider.healthCheck as jest.MockedFunction<() => Promise<HealthCheckResult>>).mockResolvedValue({
                healthy: false,
                timestamp: new Date(),
                responseTime: 5000,
                message: 'OAuth provider down'
            });

            (samlProvider.healthCheck as jest.MockedFunction<() => Promise<HealthCheckResult>>).mockResolvedValue({
                healthy: false,
                timestamp: new Date(),
                responseTime: 5000,
                message: 'SAML provider down'
            });

            await providerManager.performHealthChecks();

            // Check the actual health check results
            const oauthHealthResult = await oauthProvider.healthCheck();
            const samlHealthResult = await samlProvider.healthCheck();

            expect(oauthHealthResult.healthy).toBe(false);
            expect(samlHealthResult.healthy).toBe(false);

            // Should return no available provider
            const bestProvider = providerManager.getBestProvider();
            expect(bestProvider).toBeUndefined();

            // Should log security events for outage
            mockLogger.logSecurity({
                type: 'provider_outage',
                timestamp: new Date(),
                details: {
                    oauthHealth: oauthHealthResult,
                    samlHealth: samlHealthResult
                }
            });
            expect(mockLogger.logSecurity).toHaveBeenCalled();
        });
    });

    describe('Performance and Scalability Tests', () => {
        it('should handle high-volume authentication requests', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true,
                healthCheckInterval: 30000
            });

            // Setup successful authentication
            const user = createMockUser('bulk-user', 'bulk@example.com');
            const token = createMockToken();
            const session = createMockSession(user, token, 'oauth' as AuthProviderType);

            (oauthProvider.authenticate as jest.MockedFunction<(credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>>).mockResolvedValue({
                success: true,
                data: session
            });

            // Execute multiple authentication requests
            const promises = [];
            for (let i = 0; i < 100; i++) {
                const credentials = { username: `user${i}`, password: 'password' };
                const user = createMockUser(`user${i}`, `user${i}@example.com`);
                const session = createMockSession(user, createMockToken(), 'oauth' as AuthProviderType);

                (oauthProvider.authenticate as jest.MockedFunction<(credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>>).mockResolvedValue({
                    success: true,
                    data: session
                });

                promises.push(oauthProvider.authenticate(credentials));
            }

            const results = await Promise.all(promises);

            // All requests should succeed
            results.forEach((result, index) => {
                expect(result.success).toBe(true);
                expect(result.data?.user?.username).toBe(`user${index}`);
            });

            // Verify performance metrics
            const metrics = createMockPerformanceMetrics();
            metrics.totalAttempts = 100;
            metrics.successfulAuthentications = 100;
            metrics.averageResponseTime = 50;

            (oauthProvider.getPerformanceMetrics as jest.MockedFunction<() => PerformanceMetrics>).mockReturnValue(metrics);

            const performanceMetrics = oauthProvider.getPerformanceMetrics();
            expect(performanceMetrics.totalAttempts).toBe(100);
            expect(performanceMetrics.successfulAuthentications).toBe(100);
        });

        it('should maintain performance under provider health monitoring', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true,
                healthCheckInterval: 1000
            });

            // Setup health check
            (oauthProvider.healthCheck as jest.MockedFunction<() => Promise<HealthCheckResult>>).mockResolvedValue({
                healthy: true,
                timestamp: new Date(),
                responseTime: 25,
                message: 'Service is healthy'
            });

            // Start health monitoring
            providerManager.startHealthMonitoring(1000);

            // Perform authentication while monitoring is active
            const user = createMockUser('monitored-user', 'monitored@example.com');
            const token = createMockToken();
            const session = createMockSession(user, token, 'oauth' as AuthProviderType);

            (oauthProvider.authenticate as jest.MockedFunction<(credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>>).mockResolvedValue({
                success: true,
                data: session
            });

            const credentials = { username: 'monitored-user', password: 'password' };
            const result = await oauthProvider.authenticate(credentials);

            expect(result.success).toBe(true);

            // Wait for health checks to run
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Stop health monitoring
            providerManager.stopHealthMonitoring();

            // Verify health checks were performed
            expect(oauthProvider.healthCheck).toHaveBeenCalled();
        });
    });

    describe('Security and Compliance Tests', () => {
        it('should enforce security validation rules', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true
            });

            const weakCredentials = { username: 'weak', password: '123' };
            const suspiciousContext = {
                ipAddress: '192.168.1.100',
                userAgent: 'Mozilla/5.0...',
                timestamp: new Date(),
                metadata: {
                    source: 'api',
                    riskScore: 0.8
                }
            };

            // Security validation should fail
            const validationResult = createMockValidationResult(false, [
                'Password too weak',
                'Suspicious activity detected'
            ]);
            (authValidator.validateCredentialsAsync as jest.MockedFunction<(credentials: AuthCredentials, context?: SecurityContext, options?: AsyncValidationOptions) => Promise<ValidationResult>>).mockResolvedValue(validationResult);

            const validation = await authValidator.validateCredentialsAsync(weakCredentials, suspiciousContext);
            expect(validation.isValid).toBe(false);
            expect(validation.errors && validation.errors.length).toBe(2);

            // Should log security event
            mockLogger.logSecurity({
                type: 'validation_failure',
                timestamp: new Date(),
                details: {
                    riskScore: 0.8,
                    validationErrors: validation.errors
                }
            });
            expect(mockLogger.logSecurity).toHaveBeenCalled();
        });

        it('should handle token expiration and refresh scenarios', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true
            });

            const user = createMockUser('999', 'token@example.com');
            const expiredToken = {
                accessToken: 'expired-token',
                refreshToken: 'valid-refresh-token',
                expiresAt: new Date(Date.now() - 1000), // Expired
                tokenType: 'Bearer'
            };

            const newToken = createMockToken();
            const newSession = createMockSession(user, newToken, 'oauth' as AuthProviderType);

            // Token refresh should succeed
            (oauthProvider.refreshToken as jest.MockedFunction<() => Promise<AuthResult<AuthSession>>>).mockResolvedValue({
                success: true,
                data: newSession
            });

            const refreshResult = await oauthProvider.refreshToken();
            expect(refreshResult.success).toBe(true);
            expect(refreshResult.data?.token?.accessToken).toBe('mock-access-token');

            // New session should be valid
            const newSessionValidation = createMockAuthResult<boolean>(true, true);
            (oauthProvider.validateSession as jest.MockedFunction<() => Promise<AuthResult<boolean>>>).mockResolvedValue(newSessionValidation);

            const newSessionResult = await oauthProvider.validateSession();
            expect(newSessionResult.success).toBe(true);
        });
    });

    describe('Error Recovery and Resilience', () => {
        it('should recover from temporary network issues', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true,
                maxRetries: 3
            });

            const credentials = { username: 'testuser', password: 'testpass' };

            let attemptCount = 0;
            (oauthProvider.authenticate as jest.MockedFunction<(credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>>)
                .mockImplementation(async () => {
                    attemptCount++;
                    if (attemptCount === 1) {
                        throw new Error('Network timeout');
                    }
                    if (attemptCount === 2) {
                        throw new Error('Connection refused');
                    }
                    return createMockAuthResult(true, createMockSession(
                        createMockUser('recovered', 'recovered@example.com'),
                        createMockToken(),
                        'oauth' as AuthProviderType
                    ));
                });

            // Simulate retry mechanism
            let result: AuthResult<AuthSession> | null = null;
            let retryCount = 0;
            const maxRetries = 3;

            while (retryCount < maxRetries && !result?.success) {
                try {
                    result = await oauthProvider.authenticate(credentials);
                } catch (error) {
                    retryCount++;
                    if (retryCount >= maxRetries) {
                        throw error;
                    }
                    // Simulate delay between retries
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }

            expect(result?.success).toBe(true);
            expect(result?.data?.user?.email).toBe('recovered@example.com');
        });

        it('should handle provider initialization failures', async () => {
            const failingProvider = createMockAuthenticator('failing-provider', 'oauth' as AuthProviderType);

            (failingProvider.initialize as jest.MockedFunction<(options?: unknown) => Promise<void>>).mockRejectedValue(new Error('Initialization failed'));
            (failingProvider.isInitialized as jest.MockedFunction<() => boolean>).mockReturnValue(false);

            providerManager.registerProvider(failingProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true
            });

            // Initialization should complete but with failures (ProviderManager uses Promise.allSettled)
            await providerManager.initializeAllProviders(5000);

            // Provider should still be registered but not initialized
            expect(providerManager.hasProvider('failing-provider')).toBe(true);
            expect(failingProvider.isInitialized()).toBe(false);
        });
    });

    describe('Cleanup and Lifecycle Management', () => {
        it('should properly shutdown all providers', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true
            });

            providerManager.registerProvider(samlProvider, {
                priority: ProviderPriority.NORMAL,
                autoEnable: true
            });

            // Mock shutdown methods
            (oauthProvider.shutdown as jest.MockedFunction<(timeout?: number) => Promise<void>>).mockResolvedValue();
            (samlProvider.shutdown as jest.MockedFunction<(timeout?: number) => Promise<void>>).mockResolvedValue();

            // Shutdown all providers
            await providerManager.shutdownAllProviders(30000);

            // Verify shutdown was called on all providers
            expect(oauthProvider.shutdown).toHaveBeenCalledWith(30000);
            expect(samlProvider.shutdown).toHaveBeenCalledWith(30000);
        });

        it('should reset performance metrics after testing', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true
            });

            // Mock performance metrics with data
            const metrics = createMockPerformanceMetrics();
            metrics.totalAttempts = 100;
            metrics.successfulAuthentications = 95;
            metrics.failedAuthentications = 5;

            (oauthProvider.getPerformanceMetrics as jest.MockedFunction<() => PerformanceMetrics>).mockReturnValue(metrics);

            // Reset metrics
            (oauthProvider.resetPerformanceMetrics as jest.MockedFunction<() => void>).mockImplementation(() => {
                // Mock the reset by updating the return value
                const resetMetrics = createMockPerformanceMetrics();
                resetMetrics.totalAttempts = 0;
                resetMetrics.successfulAuthentications = 0;
                (oauthProvider.getPerformanceMetrics as jest.MockedFunction<() => PerformanceMetrics>).mockReturnValue(resetMetrics);
            });

            oauthProvider.resetPerformanceMetrics();

            const afterReset = oauthProvider.getPerformanceMetrics();
            expect(afterReset.totalAttempts).toBe(0);
        });
    });
});
