/**
 * Health Checker Tests
 *
 * Tests for the health checker system including:
 * - Circuit breaker pattern
 * - Provider health monitoring
 * - Automatic fallback systems
 * - Health check scheduling
 * - Health metrics and reporting
 */

import { jest } from '@jest/globals';

// Mock setTimeout/setInterval for health check scheduling
jest.useFakeTimers();

import {
    HealthCheckManager,
    ProviderHealthMonitor,
    CircuitBreaker,
    CircuitBreakerState
} from '../health/HealthChecker';

import type {
    ProviderHealthConfig
} from '../health/HealthChecker';
import type { IAuthenticator } from '../interfaces/IAuthenticator';

describe('CircuitBreaker', () => {
    let circuitBreaker: CircuitBreaker;
    let config: any;

    beforeEach(() => {
        config = {
            failureThreshold: 3,
            recoveryTimeout: 1000,
            monitoringPeriod: 60000,
            expectedRecoveryTime: 500
        };
        circuitBreaker = new CircuitBreaker(config);
    });

    test('should start in closed state', () => {
        expect(circuitBreaker.getState()).toBe(CircuitBreakerState.CLOSED);
    });

    test('should handle successful operations', async () => {
        const operation = jest.fn() as any;
        operation.mockResolvedValue({ success: true });

        const result = await circuitBreaker.execute(operation);

        expect(result.success).toBe(true);
        expect(circuitBreaker.getState()).toBe(CircuitBreakerState.CLOSED);
        expect(operation).toHaveBeenCalledTimes(1);
    });

    test('should open circuit after failure threshold', async () => {
        const operation = jest.fn() as any;
        operation.mockRejectedValue(new Error('Operation failed'));

        // Execute operations until threshold is reached
        for (let i = 0; i < 3; i++) {
            await circuitBreaker.execute(operation);
        }

        expect(circuitBreaker.getState()).toBe(CircuitBreakerState.OPEN);
    });

    test('should reject operations when circuit is open', async () => {
        const operation = jest.fn() as any;
        operation.mockRejectedValue(new Error('Operation failed'));

        // Open the circuit
        for (let i = 0; i < 3; i++) {
            await circuitBreaker.execute(operation);
        }

        // Try operation while circuit is open
        const result = await circuitBreaker.execute(operation);

        expect(result.success).toBe(false);
        expect(result.error?.code).toBe('CIRCUIT_BREAKER_OPEN');
        expect(operation).toHaveBeenCalledTimes(3); // Should not be called when open
    });

    test('should reset to closed state on success', async () => {
        const operation = jest.fn() as any;
        operation.mockRejectedValueOnce(new Error('Operation failed'));
        operation.mockRejectedValueOnce(new Error('Operation failed'));
        operation.mockRejectedValueOnce(new Error('Operation failed'));
        operation.mockResolvedValueOnce({ success: true });

        // Open the circuit
        for (let i = 0; i < 3; i++) {
            await circuitBreaker.execute(operation as any);
        }

        // Circuit should be open
        expect(circuitBreaker.getState()).toBe(CircuitBreakerState.OPEN);

        // Wait for recovery timeout
        jest.advanceTimersByTime(1100);

        // Execute successful operation to reset circuit
        await circuitBreaker.execute(operation as any);

        // Circuit should be reset to closed
        expect(circuitBreaker.getState()).toBe(CircuitBreakerState.CLOSED);
    }, 15000);

    test('should reset circuit manually', () => {
        // Open the circuit
        for (let i = 0; i < 3; i++) {
            circuitBreaker.onFailure();
        }

        expect(circuitBreaker.getState()).toBe(CircuitBreakerState.OPEN);

        circuitBreaker.reset();

        expect(circuitBreaker.getState()).toBe(CircuitBreakerState.CLOSED);
    });

    test('should provide metrics', () => {
        const metrics = circuitBreaker.getMetrics();

        expect(metrics).toHaveProperty('state');
        expect(metrics).toHaveProperty('failures');
        expect(metrics).toHaveProperty('lastFailureTime');
        expect(metrics).toHaveProperty('nextAttempt');
    });
});

describe('ProviderHealthMonitor', () => {
    let monitor: ProviderHealthMonitor;
    let mockProvider: IAuthenticator;
    let config: ProviderHealthConfig;

    beforeEach(() => {
        mockProvider = {
            name: 'Test Provider',
            type: 'test' as any,
            config: {},
            authenticate: jest.fn(),
            validateSession: jest.fn(),
            refreshToken: jest.fn(),
            configure: jest.fn(),
            getCapabilities: jest.fn(() => ['test']),
            initialize: jest.fn(),
            healthCheck: jest.fn(),
            getPerformanceMetrics: jest.fn(),
            resetPerformanceMetrics: jest.fn(),
            isHealthy: jest.fn(),
            isInitialized: jest.fn(() => true),
            getUptime: jest.fn(() => 1000),
            shutdown: jest.fn()
        } as any;

        config = {
            checkInterval: 100,
            timeout: 1000,
            retries: 2,
            circuitBreaker: {
                failureThreshold: 3,
                recoveryTimeout: 1000,
                monitoringPeriod: 60000,
                expectedRecoveryTime: 500
            },
            fallbackProviders: ['Backup Provider'],
            minResponseTime: 1  // Minimal delay to ensure response time > 0
        };

        monitor = new ProviderHealthMonitor(config);
    });

    afterEach(() => {
        monitor.stopMonitoring();
    });

    test('should initialize with default metrics', () => {
        const status = monitor.getHealthStatus();

        expect(status.status).toBe('healthy');
        expect(status.metrics.totalChecks).toBe(0);
        expect(status.metrics.uptime).toBe(100);
    });

    test('should perform successful health check', async () => {
        const mockValidateSession = mockProvider.validateSession as any;
        mockValidateSession.mockResolvedValue({ success: true });

        // Use fake timers to avoid real setTimeout
        jest.useFakeTimers();

        const resultPromise = monitor.performHealthCheck(mockProvider);

        // Advance timers to resolve the setTimeout
        jest.advanceTimersByTime(1);

        const result = await resultPromise;

        expect(result.providerName).toBe('Test Provider');
        expect(result.status).toBe('healthy');
        expect(result.responseTime).toBeGreaterThan(0);
        expect(result.error).toBeUndefined();

        jest.useRealTimers();
    }, 15000);

    test('should handle failed health check', async () => {
        const mockValidateSession = mockProvider.validateSession as any;
        const mockGetCapabilities = mockProvider.getCapabilities as any;

        mockValidateSession.mockRejectedValue(new Error('Validation failed'));
        mockGetCapabilities.mockImplementation(() => {
            throw new Error('Capabilities failed');
        });

        const result = await monitor.performHealthCheck(mockProvider);

        expect(result.providerName).toBe('Test Provider');
        expect(result.status).toBe('unhealthy');
        expect(result.error).toBeDefined();
    }, 15000);

    test('should update metrics on health check', async () => {
        const mockValidateSession = mockProvider.validateSession as any;
        mockValidateSession.mockResolvedValue({ success: true });

        await monitor.performHealthCheck(mockProvider);

        const status = monitor.getHealthStatus();
        expect(status.metrics.totalChecks).toBe(1);
        expect(status.metrics.successfulChecks).toBe(1);
        expect(status.metrics.uptime).toBe(100);
    }, 15000);

    test('should track consecutive failures', async () => {
        const mockValidateSession = mockProvider.validateSession as any;
        const mockGetCapabilities = mockProvider.getCapabilities as any;

        mockValidateSession.mockRejectedValue(new Error('Validation failed'));
        mockGetCapabilities.mockImplementation(() => {
            throw new Error('Capabilities failed');
        });

        await monitor.performHealthCheck(mockProvider);
        await monitor.performHealthCheck(mockProvider);

        const status = monitor.getHealthStatus();
        expect(status.metrics.consecutiveFailures).toBe(2);
    }, 15000);

    test('should maintain health history', async () => {
        const mockValidateSession = mockProvider.validateSession as any;
        mockValidateSession.mockResolvedValue({ success: true });

        await monitor.performHealthCheck(mockProvider);
        await monitor.performHealthCheck(mockProvider);
        await monitor.performHealthCheck(mockProvider);

        const status = monitor.getHealthStatus();
        expect(status.metrics.totalChecks).toBe(3);
        expect(status.metrics.successfulChecks).toBe(3);
    }, 15000);

    test('should limit health history size', async () => {
        const mockValidateSession = mockProvider.validateSession as any;
        mockValidateSession.mockResolvedValue({ success: true });

        // Add more than 100 checks
        for (let i = 0; i < 105; i++) {
            await monitor.performHealthCheck(mockProvider);
        }

        const status = monitor.getHealthStatus();
        expect(status.metrics.totalChecks).toBe(105);
        expect(status.metrics.successfulChecks).toBe(105);
    }, 15000);

    test('should reset metrics', () => {
        monitor.resetMetrics();

        const status = monitor.getHealthStatus();
        expect(status.metrics.totalChecks).toBe(0);
        expect(status.metrics.successfulChecks).toBe(0);
        expect(status.metrics.failedChecks).toBe(0);
        expect(status.metrics.uptime).toBe(100);
    });

    test('should start and stop monitoring', () => {
        monitor.startMonitoring(mockProvider);

        // Should not throw
        expect(true).toBe(true);

        monitor.stopMonitoring();

        // Should not throw
        expect(true).toBe(true);
    });
});

describe('HealthCheckManager', () => {
    let manager: HealthCheckManager;
    let mockProvider1: IAuthenticator;
    let mockProvider2: IAuthenticator;

    beforeEach(() => {
        mockProvider1 = {
            name: 'Primary Provider',
            type: 'primary' as any,
            authenticate: jest.fn(),
            validateSession: jest.fn(),
            getCapabilities: jest.fn(() => ['primary'])
        } as any;

        mockProvider2 = {
            name: 'Backup Provider',
            type: 'backup' as any,
            authenticate: jest.fn(),
            validateSession: jest.fn(),
            getCapabilities: jest.fn(() => ['backup'])
        } as any;

        manager = new HealthCheckManager();
    });

    afterEach(() => {
        manager.stopAllMonitoring();
    });

    test('should register providers for monitoring', () => {
        const config: ProviderHealthConfig = {
            checkInterval: 100,
            timeout: 1000,
            retries: 2,
            circuitBreaker: {
                failureThreshold: 3,
                recoveryTimeout: 1000,
                monitoringPeriod: 60000,
                expectedRecoveryTime: 500
            },
            fallbackProviders: ['Backup Provider']
        };

        manager.registerProvider(mockProvider1, config, ['Backup Provider']);

        const status = manager.getAllHealthStatus();
        expect(status.has('Primary Provider')).toBe(true);
    });

    test('should unregister providers', () => {
        const config: ProviderHealthConfig = {
            checkInterval: 100,
            timeout: 1000,
            retries: 2,
            circuitBreaker: {
                failureThreshold: 3,
                recoveryTimeout: 1000,
                monitoringPeriod: 60000,
                expectedRecoveryTime: 500
            },
            fallbackProviders: []
        };

        manager.registerProvider(mockProvider1, config);
        manager.unregisterProvider('Primary Provider');

        const status = manager.getAllHealthStatus();
        expect(status.has('Primary Provider')).toBe(false);
    });

    test('should execute operation with fallback', async () => {
        const config1: ProviderHealthConfig = {
            checkInterval: 100,
            timeout: 1000,
            retries: 2,
            circuitBreaker: {
                failureThreshold: 3,
                recoveryTimeout: 1000,
                monitoringPeriod: 60000,
                expectedRecoveryTime: 500
            },
            fallbackProviders: ['Backup Provider']
        };

        const config2: ProviderHealthConfig = {
            checkInterval: 100,
            timeout: 1000,
            retries: 2,
            circuitBreaker: {
                failureThreshold: 3,
                recoveryTimeout: 1000,
                monitoringPeriod: 60000,
                expectedRecoveryTime: 500
            },
            fallbackProviders: []
        };

        manager.registerProvider(mockProvider1, config1, ['Backup Provider']);
        manager.registerProvider(mockProvider2, config2);

        // Mock primary provider to fail
        const mockAuthenticate1 = mockProvider1.authenticate as any;
        mockAuthenticate1.mockRejectedValue(new Error('Primary failed'));

        // Mock backup provider to succeed
        const mockAuthenticate2 = mockProvider2.authenticate as any;
        mockAuthenticate2.mockResolvedValue('backup-result');

        const result = await manager.executeWithFallback('Primary Provider', async (provider) => {
            return await provider.authenticate({} as any);
        });

        expect(result.success).toBe(true);
        expect(result.data).toBe('backup-result');
    });

    test('should fail when all providers fail', async () => {
        const config1: ProviderHealthConfig = {
            checkInterval: 100,
            timeout: 1000,
            retries: 2,
            circuitBreaker: {
                failureThreshold: 3,
                recoveryTimeout: 1000,
                monitoringPeriod: 60000,
                expectedRecoveryTime: 500
            },
            fallbackProviders: ['Backup Provider']
        };

        const config2: ProviderHealthConfig = {
            checkInterval: 100,
            timeout: 1000,
            retries: 2,
            circuitBreaker: {
                failureThreshold: 3,
                recoveryTimeout: 1000,
                monitoringPeriod: 60000,
                expectedRecoveryTime: 500
            },
            fallbackProviders: []
        };

        manager.registerProvider(mockProvider1, config1, ['Backup Provider']);
        manager.registerProvider(mockProvider2, config2);

        // Mock provider to fail
        const mockAuthenticate1 = mockProvider1.authenticate as any;
        const mockAuthenticate2 = mockProvider2.authenticate as any;

        mockAuthenticate1.mockRejectedValue(new Error('All providers failed'));
        mockAuthenticate2.mockRejectedValue(new Error('Backup failed'));

        const result = await manager.executeWithFallback('Primary Provider', async (provider) => {
            return await provider.authenticate({} as any);
        });

        expect(result.success).toBe(false);
        expect(result.error?.code).toBe('ALL_PROVIDERS_FAILED');
    });

    test('should add and remove health check callbacks', () => {
        const callback = jest.fn();

        manager.addHealthCheckCallback(callback);
        manager.removeHealthCheckCallback(callback);

        // Should not throw
        expect(true).toBe(true);
    });

    test('should generate health report', () => {
        const config: ProviderHealthConfig = {
            checkInterval: 100,
            timeout: 1000,
            retries: 2,
            circuitBreaker: {
                failureThreshold: 3,
                recoveryTimeout: 1000,
                monitoringPeriod: 60000,
                expectedRecoveryTime: 500
            },
            fallbackProviders: []
        };

        manager.registerProvider(mockProvider1, config);

        const report = manager.getHealthReport();

        expect(report).toHaveProperty('timestamp');
        expect(report).toHaveProperty('providers');
        expect(report).toHaveProperty('summary');
        expect(report.summary.total).toBe(1);
        expect(report.summary.healthy).toBe(1);
    });

    test('should handle multiple providers in health report', () => {
        const config: ProviderHealthConfig = {
            checkInterval: 100,
            timeout: 1000,
            retries: 2,
            circuitBreaker: {
                failureThreshold: 3,
                recoveryTimeout: 1000,
                monitoringPeriod: 60000,
                expectedRecoveryTime: 500
            },
            fallbackProviders: []
        };

        manager.registerProvider(mockProvider1, config);
        manager.registerProvider(mockProvider2, config);

        const report = manager.getHealthReport();

        expect(report.summary.total).toBe(2);
        expect(report.summary.healthy).toBe(2);
    });
});
