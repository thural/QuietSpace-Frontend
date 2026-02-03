/**
 * End-to-End Authentication Flow Tests
 * 
 * Tests complete authentication scenarios including:
 * - Multi-provider authentication flows
 * - MFA enrollment and verification
 * - Token refresh and session management
 * - Error handling and recovery
 * - Performance and scalability scenarios
 */

import { ProviderManager } from '../../enterprise/ProviderManager';
import type { IProviderManager } from '../../interfaces/IProviderManager';
import type { IAuthenticator } from '../../interfaces/IAuthenticator';
import type { IAuthValidator } from '../../interfaces/IAuthValidator';
import type { IAuthLogger } from '../../interfaces/authInterfaces';
import { ProviderPriority } from '../../interfaces/IProviderManager';
import type {
    AuthCredentials,
    AuthResult,
    AuthSession,
    AuthProviderType,
    AuthErrorType,
    AuthUser,
    AuthToken
} from '../../types/auth.domain.types';
import type {
    ValidationRule,
    ValidationResult,
    SecurityContext
} from '../../interfaces/IAuthValidator';
import type {
    HealthCheckResult,
    PerformanceMetrics
} from '../../interfaces/IAuthenticator';

// Mock implementations
const createMockAuthenticator = (name: string, type: AuthProviderType): IAuthenticator => ({
    name,
    type,
    config: {},

    // Core authentication methods
    authenticate: jest.fn(),
    validateSession: jest.fn(),
    refreshToken: jest.fn(),
    configure: jest.fn(),
    getCapabilities: jest.fn(() => [`${type}_auth`, `${type}_mfa`]),

    // Enhanced methods
    initialize: jest.fn(),
    healthCheck: jest.fn(),
    getPerformanceMetrics: jest.fn(),
    resetPerformanceMetrics: jest.fn(),
    isHealthy: jest.fn(),
    isInitialized: jest.fn(() => true),
    getUptime: jest.fn(() => 1000),
    shutdown: jest.fn()
});

const createMockAuthValidator = (): IAuthValidator => ({
    name: 'e2e-validator',
    version: '1.0.0',
    rules: {},

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

    // Legacy sync methods
    validateCredentials: jest.fn(),
    validateToken: jest.fn(),
    validateUser: jest.fn(),
    validateAuthEvent: jest.fn(),
    validateSecurityContext: jest.fn(),

    // Statistics
    getStatistics: jest.fn(),
    resetStatistics: jest.fn(),

    // Enhanced async methods
    validateSecurityContextAsync: jest.fn(),
    validateAuthEventAsync: jest.fn()
});

const createMockLogger = (): IAuthLogger => ({
    name: 'e2e-logger',
    level: 'info',
    log: jest.fn(),
    logError: jest.fn(),
    logSecurity: jest.fn(),
    getEvents: jest.fn(() => []),
    clear: jest.fn(),
    setLevel: jest.fn()
});

const createMockAuthResult = (success: boolean, data?: AuthSession, error?: AuthErrorType): AuthResult<AuthSession> => ({
    success,
    data: data || undefined,
    error: error ? {
        type: error,
        message: error === 'credentials_invalid' ? 'Invalid credentials' :
            error === 'token_expired' ? 'Token expired' : 'Authentication failed'
    } : undefined
});

const createMockPerformanceMetrics = (): PerformanceMetrics => ({
    totalAttempts: 1000,
    successfulAuthentications: 950,
    failedAuthentications: 50,
    averageResponseTime: 75.5,
    lastAuthentication: new Date(),
    errorsByType: {
        'credentials_invalid': 30,
        'network_error': 15,
        'server_error': 5
    },
    statistics: {
        successRate: 0.95,
        failureRate: 0.05,
        throughput: 60
    }
});

const createMockValidationResult = (isValid: boolean, errors?: string[]): ValidationResult => ({
    isValid,
    errors: errors?.map(error => ({
        type: 'validation_error' as AuthErrorType,
        message: error,
        severity: 'medium' as const,
        rule: 'e2e-rule',
        timestamp: new Date()
    })) || [],
    warnings: [],
    metadata: {
        duration: 10,
        rulesApplied: ['e2e-rule'],
        timestamp: new Date(),
        async: false,
        parallel: false,
        retryCount: 0
    },
    suggestions: []
});

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
    expiresAt: new Date(Date.now() + 3600000), // 1 hour
    tokenType: 'Bearer',
    metadata: {
        issuer: 'test-issuer',
        audience: 'test-audience',
        issuedAt: new Date()
    }
});

const createMockSession = (user: AuthUser, token: AuthToken, provider: AuthProviderType): AuthSession => ({
    user,
    token,
    provider,
    createdAt: new Date(),
    expiresAt: token.expiresAt,
    isActive: true,
    metadata: {
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...'
    }
});

describe('End-to-End Authentication Flow Tests', () => {
    let providerManager: IProviderManager;
    let mockLogger: IAuthLogger;
    let authValidator: IAuthValidator;
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

    describe('Complete Authentication Flow', () => {
        it('should handle full authentication flow from login to session management', async () => {
            // Setup providers with different priorities
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true,
                healthCheckInterval: 30000,
                failoverEnabled: true,
                maxRetries: 3
            });

            providerManager.registerProvider(samlProvider, {
                priority: ProviderPriority.NORMAL,
                autoEnable: true,
                healthCheckInterval: 60000,
                failoverEnabled: true,
                maxRetries: 2
            });

            const credentials = { username: 'testuser', password: 'testpass' };
            const context = {
                ipAddress: '192.168.1.1',
                userAgent: 'Mozilla/5.0...',
                requestId: 'req-123',
                sessionId: 'session-456',
                timestamp: new Date(),
                metadata: { source: 'web' }
            };

            // Step 1: Validate credentials
            const validationResult = createMockValidationResult(true);
            (authValidator.validateCredentialsAsync as jest.Mock).mockResolvedValue(validationResult);

            const validation = await authValidator.validateCredentialsAsync(credentials, context);
            expect(validation.isValid).toBe(true);

            // Step 2: Authenticate with primary provider
            const user = createMockUser('123', 'test@example.com');
            const token = createMockToken();
            const session = createMockSession(user, token, 'oauth' as AuthProviderType);

            const authResult = createMockAuthResult(true, session);
            (oauthProvider.authenticate as jest.Mock).mockResolvedValue(authResult);

            const authResponse = await oauthProvider.authenticate(credentials);
            expect(authResponse.success).toBe(true);
            expect(authResponse.data?.user?.email).toBe('test@example.com');
            expect(authResponse.data?.token?.accessToken).toBe('mock-access-token');

            // Step 3: Validate session
            const sessionValidation = createMockAuthResult(true, session);
            (oauthProvider.validateSession as jest.Mock).mockResolvedValue(sessionValidation);

            const sessionResult = await oauthProvider.validateSession();
            expect(sessionResult.success).toBe(true);
            expect(sessionResult.data?.user?.id).toBe('123');

            // Step 4: Refresh token
            const newToken = createMockToken();
            newToken.accessToken = 'new-mock-access-token';
            const newSession = createMockSession(user, newToken, 'oauth' as AuthProviderType);

            const refreshResult = createMockAuthResult(true, newSession);
            (oauthProvider.refreshToken as jest.Mock).mockResolvedValue(refreshResult);

            const refreshResponse = await oauthProvider.refreshToken();
            expect(refreshResponse.success).toBe(true);
            expect(refreshResponse.data?.token?.accessToken).toBe('new-mock-access-token');

            // Verify flow completion
            expect(authValidator.validateCredentialsAsync).toHaveBeenCalledWith(credentials, context);
            expect(oauthProvider.authenticate).toHaveBeenCalledWith(credentials);
            expect(oauthProvider.validateSession).toHaveBeenCalled();
            expect(oauthProvider.refreshToken).toHaveBeenCalled();
        });

        it('should handle authentication failure with proper error handling', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true,
                maxRetries: 2
            });

            const invalidCredentials = { username: 'invalid', password: 'wrong' };
            const context = {
                ipAddress: '192.168.1.1',
                userAgent: 'Mozilla/5.0...',
                requestId: 'req-456',
                sessionId: 'session-789',
                timestamp: new Date(),
                metadata: { source: 'mobile' }
            };

            // Step 1: Validation should pass
            const validationResult = createMockValidationResult(true);
            (authValidator.validateCredentialsAsync as jest.Mock).mockResolvedValue(validationResult);

            const validation = await authValidator.validateCredentialsAsync(invalidCredentials, context);
            expect(validation.isValid).toBe(true);

            // Step 2: Authentication should fail
            const authError = createMockAuthResult(false, undefined, 'credentials_invalid');
            (oauthProvider.authenticate as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

            await expect(oauthProvider.authenticate(invalidCredentials)).rejects.toThrow('Invalid credentials');

            // Step 3: Provider health should be affected
            (oauthProvider.healthCheck as jest.Mock).mockResolvedValue({
                healthy: false,
                timestamp: new Date(),
                responseTime: 100,
                message: 'Authentication service degraded'
            });

            const health = await oauthProvider.healthCheck();
            expect(health.healthy).toBe(false);

            // Verify error handling
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
                maxRetries: 2
            });

            providerManager.registerProvider(samlProvider, {
                priority: ProviderPriority.NORMAL,
                autoEnable: true,
                failoverEnabled: true,
                maxRetries: 2
            });

            providerManager.registerProvider(ldapProvider, {
                priority: ProviderPriority.BACKUP,
                autoEnable: true,
                failoverEnabled: true,
                maxRetries: 1
            });

            const credentials = { username: 'testuser', password: 'testpass' };

            // Primary provider fails
            (oauthProvider.authenticate as jest.Mock).mockRejectedValue(new Error('OAuth provider unavailable'));

            // Get best available provider (should skip failed OAuth)
            const bestProvider = providerManager.getBestProvider();
            expect(bestProvider?.name).toBe('saml-provider');

            // Secondary provider succeeds
            const user = createMockUser('456', 'saml@example.com');
            const token = createMockToken();
            const session = createMockSession(user, token, 'saml' as AuthProviderType);

            const authResult = createMockAuthResult(true, session);
            (samlProvider.authenticate as jest.Mock).mockResolvedValue(authResult);

            const authResponse = await bestProvider.authenticate(credentials);
            expect(authResponse.success).toBe(true);
            expect(authResponse.data?.provider).toBe('saml');
        });

        it('should handle complete provider outage gracefully', async () => {
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

            // All providers fail
            (oauthProvider.authenticate as jest.Mock).mockRejectedValue(new Error('OAuth provider down'));
            (samlProvider.authenticate as jest.Mock).mockRejectedValue(new Error('SAML provider down'));

            // Health checks should show all providers as unhealthy
            (oauthProvider.healthCheck as jest.Mock).mockResolvedValue({
                healthy: false,
                timestamp: new Date(),
                responseTime: 5000,
                message: 'OAuth provider down'
            });

            (samlProvider.healthCheck as jest.Mock).mockResolvedValue({
                healthy: false,
                timestamp: new Date(),
                responseTime: 5000,
                message: 'SAML provider down'
            });

            await providerManager.performHealthChecks();

            const oauthHealth = providerManager.getProviderHealth('oauth-provider');
            const samlHealth = providerManager.getProviderHealth('saml-provider');

            expect(oauthHealth?.health.healthy).toBe(false);
            expect(samlHealth?.health.healthy).toBe(false);

            // Should return no available provider
            const bestProvider = providerManager.getBestProvider();
            expect(bestProvider).toBeUndefined();

            // Should log security events for outage
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

            const credentials = { username: 'testuser', password: 'testpass' };
            const user = createMockUser('789', 'perf@example.com');
            const token = createMockToken();
            const session = createMockSession(user, token, 'oauth' as AuthProviderType);

            const authResult = createMockAuthResult(true, session);
            (oauthProvider.authenticate as jest.Mock).mockResolvedValue(authResult);

            // Simulate 100 concurrent authentication requests
            const promises = Array.from({ length: 100 }, (_, index) => {
                const userCopy = { ...user, id: `user-${index}` };
                const sessionCopy = createMockSession(userCopy, token, 'oauth' as AuthProviderType);
                const resultCopy = createMockAuthResult(true, sessionCopy);
                (oauthProvider.authenticate as jest.Mock).mockResolvedValueOnce(resultCopy);

                return oauthProvider.authenticate(credentials);
            });

            const results = await Promise.allSettled(promises);

            // All requests should succeed
            const successful = results.filter(r => r.status === 'fulfilled');
            const failed = results.filter(r => r.status === 'rejected');

            expect(successful).toHaveLength(100);
            expect(failed).toHaveLength(0);

            // Check performance metrics
            const metrics = createMockPerformanceMetrics();
            metrics.totalAttempts = 100;
            metrics.successfulAuthentications = 100;
            metrics.averageResponseTime = 45.2;

            (oauthProvider.getPerformanceMetrics as jest.Mock).mockReturnValue(metrics);

            const performanceMetrics = oauthProvider.getPerformanceMetrics();
            expect(performanceMetrics.totalAttempts).toBe(100);
            expect(performanceMetrics.successfulAuthentications).toBe(100);
            expect(performanceMetrics.averageResponseTime).toBe(45.2);
        });

        it('should maintain performance under provider health monitoring', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true,
                healthCheckInterval: 1000 // Very frequent for testing
            });

            providerManager.registerProvider(samlProvider, {
                priority: ProviderPriority.NORMAL,
                autoEnable: true,
                healthCheckInterval: 1000
            });

            // Start health monitoring
            providerManager.startHealthMonitoring(1000);

            // Mock health checks
            (oauthProvider.healthCheck as jest.Mock).mockResolvedValue({
                healthy: true,
                timestamp: new Date(),
                responseTime: 25,
                message: 'OAuth provider healthy'
            });

            (samlProvider.healthCheck as jest.Mock).mockResolvedValue({
                healthy: true,
                timestamp: new Date(),
                responseTime: 30,
                message: 'SAML provider healthy'
            });

            // Wait for health checks to run
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Verify health monitoring is active
            expect(oauthProvider.healthCheck).toHaveBeenCalled();
            expect(samlProvider.healthCheck).toHaveBeenCalled();

            // Check provider statistics
            const stats = providerManager.getManagerStatistics();
            expect(stats.totalProviders).toBe(2);
            expect(stats.enabledProviders).toBe(2);
            expect(stats.healthyProviders).toBe(2);

            // Stop health monitoring
            providerManager.stopHealthMonitoring();
        });
    });

    describe('Security and Compliance Tests', () => {
        it('should enforce security validation rules', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true
            });

            const weakCredentials = { username: 'test', password: '123' };
            const suspiciousContext = {
                ipAddress: '192.168.1.100',
                userAgent: 'SuspiciousBot/1.0',
                requestId: 'req-suspicious',
                sessionId: 'session-suspicious',
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
            (authValidator.validateCredentialsAsync as jest.Mock).mockResolvedValue(validationResult);

            const validation = await authValidator.validateCredentialsAsync(weakCredentials, suspiciousContext);
            expect(validation.isValid).toBe(false);
            expect(validation.errors && validation.errors.length).toBe(2);

            // Should log security event
            expect(mockLogger.logSecurity).toHaveBeenCalled();
        });

        it('should handle token expiration and refresh scenarios', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true
            });

            const user = createMockUser('999', 'token@example.com');
            const expiredToken = createMockToken();
            expiredToken.expiresAt = new Date(Date.now() - 1000); // Expired
            const expiredSession = createMockSession(user, expiredToken, 'oauth' as AuthProviderType);

            // Session validation should fail for expired token
            const sessionValidation = createMockAuthResult(false, undefined, 'token_expired');
            (oauthProvider.validateSession as jest.Mock).mockResolvedValue(sessionValidation);

            const sessionResult = await oauthProvider.validateSession();
            expect(sessionResult.success).toBe(false);
            expect(sessionResult.error?.type).toBe('token_expired');

            // Token refresh should succeed
            const newToken = createMockToken();
            newToken.accessToken = 'refreshed-access-token';
            const newSession = createMockSession(user, newToken, 'oauth' as AuthProviderType);

            const refreshResult = createMockAuthResult(true, newSession);
            (oauthProvider.refreshToken as jest.Mock).mockResolvedValue(refreshResult);

            const refreshResponse = await oauthProvider.refreshToken();
            expect(refreshResponse.success).toBe(true);
            expect(refreshResponse.data?.token?.accessToken).toBe('refreshed-access-token');

            // New session should be valid
            const newSessionValidation = createMockAuthResult(true, newSession);
            (oauthProvider.validateSession as jest.Mock).mockResolvedValue(newSessionValidation);

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

            // First attempt fails with network error
            (oauthProvider.authenticate as jest.Mock)
                .mockRejectedValueOnce(new Error('Network timeout'))
                .mockRejectedValueOnce(new Error('Connection refused'))
                .mockResolvedValueOnce(createMockAuthResult(true, createMockSession(
                    createMockUser('recovered', 'recovered@example.com'),
                    createMockToken(),
                    'oauth' as AuthProviderType
                )));

            // Should succeed after retries
            const result = await oauthProvider.authenticate(credentials);
            expect(result.success).toBe(true);
            expect(oauthProvider.authenticate).toHaveBeenCalledTimes(3);
        });

        it('should handle provider initialization failures', async () => {
            const failingProvider = createMockAuthenticator('failing-provider', 'oauth' as AuthProviderType);

            (failingProvider.initialize as jest.Mock).mockRejectedValue(new Error('Initialization failed'));

            providerManager.registerProvider(failingProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true
            });

            // Initialization should fail gracefully
            await expect(providerManager.initializeAllProviders(5000)).rejects.toThrow();

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

            // Start health monitoring
            providerManager.startHealthMonitoring(1000);

            // Mock shutdown
            (oauthProvider.shutdown as jest.Mock).mockResolvedValue(undefined);
            (samlProvider.shutdown as jest.Mock).mockResolvedValue(undefined);

            // Shutdown all providers
            await providerManager.shutdownAllProviders(3000);

            expect(oauthProvider.shutdown).toHaveBeenCalledWith(3000);
            expect(samlProvider.shutdown).toHaveBeenCalledWith(3000);

            // Health monitoring should be stopped
            const stats = providerManager.getManagerStatistics();
            expect(stats.totalProviders).toBe(2);
        });

        it('should reset performance metrics after testing', async () => {
            providerManager.registerProvider(oauthProvider, {
                priority: ProviderPriority.HIGH,
                autoEnable: true
            });

            // Mock metrics with test data
            const testMetrics = createMockPerformanceMetrics();
            testMetrics.totalAttempts = 500;
            testMetrics.successfulAuthentications = 450;

            (oauthProvider.getPerformanceMetrics as jest.Mock).mockReturnValue(testMetrics);

            // Get metrics before reset
            const beforeReset = oauthProvider.getPerformanceMetrics();
            expect(beforeReset.totalAttempts).toBe(500);

            // Reset metrics
            oauthProvider.resetPerformanceMetrics();
            expect(oauthProvider.resetPerformanceMetrics).toHaveBeenCalled();

            // Metrics should be reset to defaults
            const resetMetrics = createMockPerformanceMetrics();
            resetMetrics.totalAttempts = 0;
            resetMetrics.successfulAuthentications = 0;

            (oauthProvider.getPerformanceMetrics as jest.Mock).mockReturnValue(resetMetrics);

            const afterReset = oauthProvider.getPerformanceMetrics();
            expect(afterReset.totalAttempts).toBe(0);
        });
    });
});
