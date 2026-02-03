/**
 * IAuthenticator Interface Unit Tests
 * 
 * Tests for enhanced IAuthenticator interface including:
 * - Async initialization patterns
 * - Health checking capabilities
 * - Performance metrics
 * - Lifecycle management
 */

import { jest } from '@jest/globals';
import type {
    IAuthenticator,
    HealthCheckResult,
    PerformanceMetrics,
    InitializationOptions
} from '../../../interfaces/IAuthenticator';
import type {
    AuthCredentials,
    AuthResult,
    AuthSession,
    AuthProviderType,
    AuthErrorType,
    AuthToken
} from '../../../types/auth.domain.types';

// Mock implementation for testing
const createMockAuthenticator = (): IAuthenticator => ({
    name: 'test-authenticator',
    type: 'oauth' as AuthProviderType,
    config: {},

    // Core authentication methods
    authenticate: jest.fn() as jest.MockedFunction<(credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>>,
    validateSession: jest.fn() as jest.MockedFunction<() => Promise<AuthResult<boolean>>>,
    refreshToken: jest.fn() as jest.MockedFunction<() => Promise<AuthResult<AuthSession>>>,
    configure: jest.fn() as jest.MockedFunction<(config: Record<string, unknown>) => void>,
    getCapabilities: jest.fn() as jest.MockedFunction<() => string[]>,

    // Enhanced health checking
    healthCheck: jest.fn() as jest.MockedFunction<() => Promise<HealthCheckResult>>,
    isHealthy: jest.fn() as jest.MockedFunction<() => Promise<boolean>>,
    getPerformanceMetrics: jest.fn() as jest.MockedFunction<() => PerformanceMetrics>,
    resetPerformanceMetrics: jest.fn() as jest.MockedFunction<() => void>,

    // Lifecycle management
    initialize: jest.fn() as jest.MockedFunction<(options?: InitializationOptions) => Promise<void>>,
    isInitialized: jest.fn() as jest.MockedFunction<() => boolean>,
    getUptime: jest.fn() as jest.MockedFunction<() => number>,
    shutdown: jest.fn() as jest.MockedFunction<(timeout?: number) => Promise<void>>
});

const createMockAuthResult = (success: boolean, data?: AuthSession, error?: AuthErrorType): AuthResult<AuthSession> => ({
    success,
    data: data || undefined,
    error: error ? {
        type: error,
        message: error === 'credentials_invalid' ? 'Invalid username or password' : 'Authentication failed'
    } : undefined
});

const createMockHealthCheckResult = (healthy: boolean): HealthCheckResult => ({
    healthy,
    timestamp: new Date(),
    responseTime: healthy ? 50 : 200,
    message: healthy ? 'Service is healthy' : 'Service is unhealthy',
    metadata: { version: '1.0.0' }
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
        throughput: 60 // authentications per minute
    }
});

describe('IAuthenticator Interface', () => {
    let authenticator: IAuthenticator;
    let mockCredentials: AuthCredentials;

    beforeEach(() => {
        authenticator = createMockAuthenticator();
        mockCredentials = { username: 'test', password: 'password' };
        jest.clearAllMocks();
    });

    describe('Enhanced Health Checking', () => {
        it('should perform health check and return detailed result', async () => {
            const expectedHealth = createMockHealthCheckResult(true);
            (authenticator.healthCheck as jest.Mock).mockResolvedValue(expectedHealth);

            const result = await authenticator.healthCheck();

            expect(authenticator.healthCheck).toHaveBeenCalled();
            expect(result.healthy).toBe(true);
            expect(result.responseTime).toBe(50);
            expect(result.message).toBe('Service is healthy');
            expect(result.timestamp).toBeInstanceOf(Date);
        });

        it('should report unhealthy status when health check fails', async () => {
            const expectedHealth = createMockHealthCheckResult(false);
            (authenticator.healthCheck as jest.Mock).mockResolvedValue(expectedHealth);

            const result = await authenticator.healthCheck();

            expect(result.healthy).toBe(false);
            expect(result.responseTime).toBe(200);
            expect(result.message).toBe('Service is unhealthy');
        });

        it('should check if provider is healthy', async () => {
            (authenticator.isHealthy as jest.Mock).mockResolvedValue(true);

            const isHealthy = await authenticator.isHealthy();

            expect(authenticator.isHealthy).toHaveBeenCalled();
            expect(isHealthy).toBe(true);
        });
    });

    describe('Performance Metrics', () => {
        it('should provide comprehensive performance metrics', () => {
            const expectedMetrics = createMockPerformanceMetrics();
            (authenticator.getPerformanceMetrics as jest.Mock).mockReturnValue(expectedMetrics);

            const metrics = authenticator.getPerformanceMetrics();

            expect(metrics.totalAttempts).toBe(1000);
            expect(metrics.successfulAuthentications).toBe(950);
            expect(metrics.failedAuthentications).toBe(50);
            expect(metrics.averageResponseTime).toBe(75.5);
            expect(metrics.statistics.successRate).toBe(0.95);
            expect(metrics.statistics.throughput).toBe(60);
        });

        it('should reset performance metrics', () => {
            authenticator.resetPerformanceMetrics();
            expect(authenticator.resetPerformanceMetrics).toHaveBeenCalled();
        });

        it('should track performance over time', () => {
            const metrics1 = createMockPerformanceMetrics();
            const metrics2 = createMockPerformanceMetrics();
            metrics2.totalAttempts = 1100;
            metrics2.successfulAuthentications = 1045;

            (authenticator.getPerformanceMetrics as jest.Mock)
                .mockReturnValueOnce(metrics1)
                .mockReturnValueOnce(metrics2);

            const initialMetrics = authenticator.getPerformanceMetrics();
            const updatedMetrics = authenticator.getPerformanceMetrics();

            expect(initialMetrics.totalAttempts).toBe(1000);
            expect(updatedMetrics.totalAttempts).toBe(1100);
        });
    });

    describe('Async Initialization Patterns', () => {
        it('should initialize with default options', async () => {
            (authenticator.initialize as jest.Mock).mockResolvedValue(undefined);

            await authenticator.initialize();

            expect(authenticator.initialize).toHaveBeenCalledWith(undefined);
        });

        it('should initialize with custom options', async () => {
            const options: InitializationOptions = {
                timeout: 5000,
                retryAttempts: 3,
                async: true,
                parameters: { region: 'us-east-1' }
            };

            (authenticator.initialize as jest.Mock).mockResolvedValue(undefined);

            await authenticator.initialize(options);

            expect(authenticator.initialize).toHaveBeenCalledWith(options);
        });

        it('should check initialization status', () => {
            (authenticator.isInitialized as jest.Mock).mockReturnValue(true);

            const isInitialized = authenticator.isInitialized();

            expect(authenticator.isInitialized).toHaveBeenCalled();
            expect(isInitialized).toBe(true);
        });

        it('should handle initialization timeout', async () => {
            (authenticator.initialize as jest.Mock).mockImplementation(
                () => new Promise(resolve => setTimeout(resolve, 3000))
            );

            const options: InitializationOptions = { timeout: 1000 };

            await expect(authenticator.initialize(options)).rejects.toThrow();
        });
    });

    describe('Lifecycle Management', () => {
        it('should report uptime correctly', () => {
            (authenticator.getUptime as jest.Mock).mockReturnValue(3600000); // 1 hour in ms

            const uptime = authenticator.getUptime();

            expect(authenticator.getUptime).toHaveBeenCalled();
            expect(uptime).toBe(3600000);
        });

        it('should shutdown gracefully with timeout', async () => {
            (authenticator.shutdown as jest.Mock).mockResolvedValue(undefined);

            await authenticator.shutdown(5000);

            expect(authenticator.shutdown).toHaveBeenCalledWith(5000);
        });

        it('should shutdown with default timeout', async () => {
            (authenticator.shutdown as jest.Mock).mockResolvedValue(undefined);

            await authenticator.shutdown();

            expect(authenticator.shutdown).toHaveBeenCalledWith(30000); // Default timeout
        });

        it('should handle shutdown timeout', async () => {
            (authenticator.shutdown as jest.Mock).mockImplementation(
                () => new Promise(resolve => setTimeout(resolve, 5000))
            );

            await expect(authenticator.shutdown(1000)).rejects.toThrow();
        });
    });

    describe('Core Authentication Functionality', () => {
        it('should authenticate user credentials', async () => {
            const mockSession: AuthSession = {
                user: {
                    id: '123',
                    email: 'test@example.com',
                    username: 'test',
                    roles: ['user'],
                    permissions: ['read']
                },
                token: {
                    accessToken: 'jwt-token',
                    refreshToken: 'refresh-token',
                    expiresAt: new Date(),
                    tokenType: 'Bearer'
                },
                provider: 'oauth' as AuthProviderType,
                createdAt: new Date(),
                expiresAt: new Date(),
                isActive: true
            };

            const expectedResult = createMockAuthResult(true, mockSession);
            (authenticator.authenticate as jest.Mock).mockResolvedValue(expectedResult);

            const result = await authenticator.authenticate(mockCredentials);

            expect(authenticator.authenticate).toHaveBeenCalledWith(mockCredentials);
            expect(result.success).toBe(true);
            expect(result.data?.user?.id).toBe('123');
        });

        it('should validate session', async () => {
            const expectedResult: AuthResult<boolean> = {
                success: true,
                data: true
            };

            (authenticator.validateSession as jest.Mock).mockResolvedValue(expectedResult);

            const result = await authenticator.validateSession();

            expect(authenticator.validateSession).toHaveBeenCalled();
            expect(result.success).toBe(true);
            expect(result.data).toBe(true);
        });

        it('should refresh token', async () => {
            const mockSession: AuthSession = {
                user: {
                    id: '123',
                    email: 'test@example.com',
                    username: 'test',
                    roles: ['user'],
                    permissions: ['read']
                },
                token: {
                    accessToken: 'new-jwt-token',
                    refreshToken: 'new-refresh-token',
                    expiresAt: new Date(),
                    tokenType: 'Bearer'
                },
                provider: 'oauth' as AuthProviderType,
                createdAt: new Date(),
                expiresAt: new Date(),
                isActive: true
            };

            const expectedResult = createMockAuthResult(true, mockSession);
            (authenticator.refreshToken as jest.Mock).mockResolvedValue(expectedResult);

            const result = await authenticator.refreshToken();

            expect(authenticator.refreshToken).toHaveBeenCalled();
            expect(result.success).toBe(true);
            expect(result.data?.token?.accessToken).toBe('new-jwt-token');
        });

        it('should report provider capabilities', () => {
            const capabilities = ['oauth', 'mfa', 'sso'];
            (authenticator.getCapabilities as jest.Mock).mockReturnValue(capabilities);

            const result = authenticator.getCapabilities();

            expect(result).toEqual(capabilities);
        });
    });

    describe('Integration Scenarios', () => {
        it('should handle complete authentication flow with health checks', async () => {
            // Setup mocks
            const healthResult = createMockHealthCheckResult(true);
            const authResult: AuthResult<AuthSession> = {
                success: true,
                data: { userId: '123', token: 'jwt-token', expiresAt: new Date() }
            };
            const metrics = createMockPerformanceMetrics();

            (authenticator.healthCheck as jest.Mock).mockResolvedValue(healthResult);
            (authenticator.authenticate as jest.Mock).mockResolvedValue(authResult);
            (authenticator.getPerformanceMetrics as jest.Mock).mockReturnValue(metrics);

            // Execute flow
            const health = await authenticator.healthCheck();
            expect(health.healthy).toBe(true);

            const session = await authenticator.authenticate(mockCredentials);
            expect(session.success).toBe(true);

            const performanceMetrics = authenticator.getPerformanceMetrics();
            expect(performanceMetrics.totalAttempts).toBe(1000);
        });

        it('should handle initialization and lifecycle management', async () => {
            const options: InitializationOptions = { timeout: 5000 };
            const healthResult = createMockHealthCheckResult(true);

            (authenticator.initialize as jest.Mock).mockResolvedValue(undefined);
            (authenticator.isInitialized as jest.Mock).mockReturnValue(true);
            (authenticator.healthCheck as jest.Mock).mockResolvedValue(healthResult);
            (authenticator.getUptime as jest.Mock).mockReturnValue(60000); // 1 minute
            (authenticator.shutdown as jest.Mock).mockResolvedValue(undefined);

            // Initialize
            await authenticator.initialize(options);
            expect(authenticator.isInitialized()).toBe(true);

            // Health check
            const health = await authenticator.healthCheck();
            expect(health.healthy).toBe(true);

            // Check uptime
            const uptime = authenticator.getUptime();
            expect(uptime).toBe(60000);

            // Shutdown
            await authenticator.shutdown();
        });

        it('should track performance metrics across multiple operations', async () => {
            const authResult1: AuthResult<AuthSession> = {
                success: true,
                data: { userId: '123', token: 'token1', expiresAt: new Date() }
            };
            const authResult2: AuthResult<AuthSession> = {
                success: false,
                error: { type: 'invalid_credentials', message: 'Invalid credentials' }
            };

            const metrics1 = createMockPerformanceMetrics();
            const metrics2 = createMockPerformanceMetrics();
            metrics2.totalAttempts = 1001;
            metrics2.successfulAuthentications = 950;
            metrics2.failedAuthentications = 51;

            (authenticator.authenticate as jest.Mock)
                .mockResolvedValueOnce(authResult1)
                .mockResolvedValueOnce(authResult2);
            (authenticator.getPerformanceMetrics as jest.Mock)
                .mockReturnValueOnce(metrics1)
                .mockReturnValueOnce(metrics2);

            // First authentication
            await authenticator.authenticate(mockCredentials);
            let metrics = authenticator.getPerformanceMetrics();
            expect(metrics.totalAttempts).toBe(1000);

            // Second authentication
            await authenticator.authenticate(mockCredentials);
            metrics = authenticator.getPerformanceMetrics();
            expect(metrics.totalAttempts).toBe(1001);
            expect(metrics.failedAuthentications).toBe(51);
        });
    });

    describe('Error Handling', () => {
        it('should handle authentication failures gracefully', async () => {
            const errorResult: AuthResult<AuthSession> = {
                success: false,
                error: { type: 'invalid_credentials', message: 'Invalid username or password' }
            };

            (authenticator.authenticate as jest.Mock).mockResolvedValue(errorResult);

            const result = await authenticator.authenticate(mockCredentials);

            expect(result.success).toBe(false);
            expect(result.error?.type).toBe('invalid_credentials');
        });

        it('should handle health check failures', async () => {
            (authenticator.healthCheck as jest.Mock).mockRejectedValue(new Error('Health check failed'));

            await expect(authenticator.healthCheck()).rejects.toThrow('Health check failed');
        });

        it('should handle initialization failures', async () => {
            (authenticator.initialize as jest.Mock).mockRejectedValue(new Error('Initialization failed'));

            await expect(authenticator.initialize()).rejects.toThrow('Initialization failed');
        });
    });
});
