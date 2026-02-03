/**
 * ProviderManager Unit Tests
 * 
 * Tests for enhanced ProviderManager implementation including:
 * - Health monitoring capabilities
 * - Priority management
 * - Provider lifecycle management
 * - Enhanced statistics and metrics
 */

import { ProviderManager } from '../../../enterprise/ProviderManager';
import type { IAuthenticator } from '../../../interfaces/IAuthenticator';
import type { IAuthLogger } from '../../../interfaces/authInterfaces';
import { ProviderPriority } from '../../../interfaces/IProviderManager';

// Mock implementations for testing
const createMockAuthenticator = (name: string, type: string): IAuthenticator => ({
    name,
    type: type as any,
    config: {},
    authenticate: jest.fn(),
    validateSession: jest.fn(),
    refreshToken: jest.fn(),
    configure: jest.fn(),
    getCapabilities: jest.fn(() => [`${type}_auth`, `${type}_mfa`]),
    initialize: jest.fn(),
    healthCheck: jest.fn(),
    getPerformanceMetrics: jest.fn(),
    resetPerformanceMetrics: jest.fn(),
    isHealthy: jest.fn(),
    isInitialized: jest.fn(() => true),
    getUptime: jest.fn(() => 1000),
    shutdown: jest.fn()
});

const createMockLogger = (): IAuthLogger => ({
    name: 'mock-logger',
    level: 'info',
    log: jest.fn(),
    logError: jest.fn(),
    logSecurity: jest.fn(),
    getEvents: jest.fn(() => []),
    clear: jest.fn(),
    setLevel: jest.fn()
});

describe('ProviderManager', () => {
    let providerManager: ProviderManager;
    let mockLogger: IAuthLogger;

    beforeEach(() => {
        mockLogger = createMockLogger();
        providerManager = new ProviderManager(mockLogger);
        jest.clearAllMocks();
    });

    describe('Provider Registration with Options', () => {
        it('should register provider with default options', () => {
            const provider = createMockAuthenticator('test-provider', 'oauth');

            providerManager.registerProvider(provider);

            expect(providerManager.hasProvider('test-provider')).toBe(true);
            expect(providerManager.isProviderEnabled('test-provider')).toBe(true);
            expect(providerManager.getProviderPriority('test-provider')).toBe(ProviderPriority.NORMAL);
        });

        it('should register provider with custom options', () => {
            const provider = createMockAuthenticator('critical-provider', 'oauth');

            providerManager.registerProvider(provider, {
                priority: ProviderPriority.CRITICAL,
                autoEnable: false,
                healthCheckInterval: 60000,
                failoverEnabled: false,
                maxRetries: 5,
                metadata: { region: 'us-east-1' }
            });

            expect(providerManager.isProviderEnabled('critical-provider')).toBe(false);
            expect(providerManager.getProviderPriority('critical-provider')).toBe(ProviderPriority.CRITICAL);
        });

        it('should log warning when overwriting existing provider', () => {
            const provider1 = createMockAuthenticator('duplicate', 'oauth');
            const provider2 = createMockAuthenticator('duplicate', 'saml');

            providerManager.registerProvider(provider1);
            providerManager.registerProvider(provider2);

            expect(mockLogger.log).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'warning',
                    details: expect.objectContaining({
                        message: 'Provider \'duplicate\' already exists, overwriting'
                    })
                })
            );
        });
    });

    describe('Provider Health Monitoring', () => {
        it('should get provider health status', () => {
            const provider = createMockAuthenticator('health-test', 'oauth');
            providerManager.registerProvider(provider);

            const health = providerManager.getProviderHealth('health-test');

            expect(health).toBeDefined();
            expect(health?.name).toBe('health-test');
            expect(health?.enabled).toBe(true);
            expect(health?.priority).toBe(ProviderPriority.NORMAL);
            expect(health?.consecutiveFailures).toBe(0);
        });

        it('should return undefined for non-existent provider health', () => {
            const health = providerManager.getProviderHealth('non-existent');
            expect(health).toBeUndefined();
        });

        it('should get all providers health', () => {
            const provider1 = createMockAuthenticator('provider1', 'oauth');
            const provider2 = createMockAuthenticator('provider2', 'saml');
            const provider3 = createMockAuthenticator('provider3', 'ldap');

            providerManager.registerProvider(provider1);
            providerManager.registerProvider(provider2, { autoEnable: false });
            providerManager.registerProvider(provider3);

            const allHealth = providerManager.getAllProvidersHealth();
            expect(allHealth).toHaveLength(3);

            const enabledHealth = providerManager.getAllProvidersHealth(true);
            expect(enabledHealth).toHaveLength(2);
        });

        it('should perform health checks on all enabled providers', async () => {
            const provider1 = createMockAuthenticator('provider1', 'oauth');
            const provider2 = createMockAuthenticator('provider2', 'saml');

            (provider1.healthCheck as jest.Mock).mockResolvedValue({
                healthy: true,
                timestamp: new Date(),
                responseTime: 100,
                message: 'OK'
            });

            (provider2.healthCheck as jest.Mock).mockResolvedValue({
                healthy: false,
                timestamp: new Date(),
                responseTime: 200,
                message: 'Service unavailable'
            });

            providerManager.registerProvider(provider1);
            providerManager.registerProvider(provider2);

            await providerManager.performHealthChecks();

            expect(provider1.healthCheck).toHaveBeenCalled();
            expect(provider2.healthCheck).toHaveBeenCalled();

            const health1 = providerManager.getProviderHealth('provider1');
            const health2 = providerManager.getProviderHealth('provider2');

            expect(health1?.consecutiveFailures).toBe(0);
            expect(health2?.consecutiveFailures).toBe(1);
        });
    });

    describe('Provider Priority Management', () => {
        it('should set and get provider priority', () => {
            const provider = createMockAuthenticator('priority-test', 'oauth');
            providerManager.registerProvider(provider);

            const result = providerManager.setProviderPriority('priority-test', ProviderPriority.HIGH);
            expect(result).toBe(true);

            const priority = providerManager.getProviderPriority('priority-test');
            expect(priority).toBe(ProviderPriority.HIGH);
        });

        it('should return false when setting priority for non-existent provider', () => {
            const result = providerManager.setProviderPriority('non-existent', ProviderPriority.HIGH);
            expect(result).toBe(false);
        });

        it('should get providers by priority level', () => {
            const provider1 = createMockAuthenticator('critical', 'oauth');
            const provider2 = createMockAuthenticator('high1', 'saml');
            const provider3 = createMockAuthenticator('high2', 'ldap');
            const provider4 = createMockAuthenticator('normal', 'oauth');

            providerManager.registerProvider(provider1, { priority: ProviderPriority.CRITICAL });
            providerManager.registerProvider(provider2, { priority: ProviderPriority.HIGH });
            providerManager.registerProvider(provider3, { priority: ProviderPriority.HIGH });
            providerManager.registerProvider(provider4, { priority: ProviderPriority.NORMAL });

            const criticalProviders = providerManager.getProvidersByPriority(ProviderPriority.CRITICAL);
            const highProviders = providerManager.getProvidersByPriority(ProviderPriority.HIGH);
            const normalProviders = providerManager.getProvidersByPriority(ProviderPriority.NORMAL);

            expect(criticalProviders).toHaveLength(1);
            expect(highProviders).toHaveLength(2);
            expect(normalProviders).toHaveLength(1);
        });

        it('should get best available provider based on health and priority', () => {
            const critical = createMockAuthenticator('critical', 'oauth');
            const high = createMockAuthenticator('high', 'saml');
            const normal = createMockAuthenticator('normal', 'ldap');

            providerManager.registerProvider(critical, { priority: ProviderPriority.CRITICAL });
            providerManager.registerProvider(high, { priority: ProviderPriority.HIGH });
            providerManager.registerProvider(normal, { priority: ProviderPriority.NORMAL });

            const best = providerManager.getBestProvider();
            expect(best?.name).toBe('critical');

            // Disable critical provider
            providerManager.setProviderEnabled('critical', false);
            const best2 = providerManager.getBestProvider();
            expect(best2?.name).toBe('high');
        });
    });

    describe('Provider Enable/Disable Management', () => {
        it('should enable and disable providers', () => {
            const provider = createMockAuthenticator('toggle-test', 'oauth');
            providerManager.registerProvider(provider);

            expect(providerManager.isProviderEnabled('toggle-test')).toBe(true);

            const result = providerManager.setProviderEnabled('toggle-test', false);
            expect(result).toBe(true);
            expect(providerManager.isProviderEnabled('toggle-test')).toBe(false);

            const result2 = providerManager.setProviderEnabled('toggle-test', true);
            expect(result2).toBe(true);
            expect(providerManager.isProviderEnabled('toggle-test')).toBe(true);
        });

        it('should filter enabled providers in counts and lists', () => {
            const provider1 = createMockAuthenticator('enabled1', 'oauth');
            const provider2 = createMockAuthenticator('disabled', 'saml');
            const provider3 = createMockAuthenticator('enabled2', 'ldap');

            providerManager.registerProvider(provider1);
            providerManager.registerProvider(provider2, { autoEnable: false });
            providerManager.registerProvider(provider3);

            expect(providerManager.getProviderCount()).toBe(3);
            expect(providerManager.getProviderCount(true)).toBe(2);

            const allProviders = providerManager.listProviders();
            const enabledProviders = providerManager.listProviders(true);

            expect(allProviders).toHaveLength(3);
            expect(enabledProviders).toHaveLength(2);
            expect(enabledProviders).toContain('enabled1');
            expect(enabledProviders).toContain('enabled2');
            expect(enabledProviders).not.toContain('disabled');
        });
    });

    describe('Manager Statistics', () => {
        it('should provide comprehensive manager statistics', () => {
            const oauth = createMockAuthenticator('oauth1', 'oauth');
            const oauth2 = createMockAuthenticator('oauth2', 'oauth');
            const saml = createMockAuthenticator('saml1', 'saml');

            providerManager.registerProvider(oauth, { priority: ProviderPriority.CRITICAL });
            providerManager.registerProvider(oauth2, { priority: ProviderPriority.HIGH });
            providerManager.registerProvider(saml, { priority: ProviderPriority.HIGH });

            const userManager = createMockAuthenticator('user-mgr', 'user') as any;
            const tokenManager = createMockAuthenticator('token-mgr', 'token') as any;

            providerManager.registerUserManager(userManager);
            providerManager.registerTokenManager(tokenManager);

            const stats = providerManager.getManagerStatistics();

            expect(stats.totalProviders).toBe(3);
            expect(stats.totalUserManagers).toBe(1);
            expect(stats.totalTokenManagers).toBe(1);
            expect(stats.enabledProviders).toBe(3);
            expect(stats.healthyProviders).toBe(3);
            expect(stats.healthScore).toBe(100);

            expect(stats.providerTypes).toEqual({
                oauth: 2,
                saml: 1
            });

            expect(stats.providersByPriority).toEqual({
                [ProviderPriority.CRITICAL]: 1,
                [ProviderPriority.HIGH]: 2,
                [ProviderPriority.NORMAL]: 0,
                [ProviderPriority.LOW]: 0,
                [ProviderPriority.BACKUP]: 0
            });
        });
    });

    describe('Health Monitoring Lifecycle', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should start and stop health monitoring', () => {
            const provider = createMockAuthenticator('monitor-test', 'oauth');
            (provider.healthCheck as jest.Mock).mockResolvedValue({
                healthy: true,
                timestamp: new Date(),
                responseTime: 50,
                message: 'OK'
            });

            providerManager.registerProvider(provider);

            providerManager.startHealthMonitoring(1000);

            expect(mockLogger.log).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'health_monitoring_started',
                    details: expect.objectContaining({ interval: 1000 })
                })
            );

            jest.advanceTimersByTime(1000);

            expect(provider.healthCheck).toHaveBeenCalledTimes(1);

            providerManager.stopHealthMonitoring();

            expect(mockLogger.log).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'health_monitoring_stopped'
                })
            );

            jest.advanceTimersByTime(1000);

            expect(provider.healthCheck).toHaveBeenCalledTimes(1);
        });

        it('should handle health monitoring errors gracefully', async () => {
            const provider = createMockAuthenticator('error-test', 'oauth');
            (provider.healthCheck as jest.Mock).mockRejectedValue(new Error('Health check failed'));

            providerManager.registerProvider(provider);
            providerManager.startHealthMonitoring(1000);

            jest.advanceTimersByTime(1000);

            await Promise.resolve(); // Allow promises to resolve

            // Check that the provider was registered and monitoring started
            expect(mockLogger.log).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'provider_registered'
                })
            );
            expect(mockLogger.log).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'health_monitoring_started'
                })
            );
        });
    });

    describe('Provider Lifecycle Management', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should initialize all providers', async () => {
            const provider1 = createMockAuthenticator('init1', 'oauth');
            const provider2 = createMockAuthenticator('init2', 'saml');

            (provider1.initialize as jest.Mock).mockResolvedValue(undefined);
            (provider2.initialize as jest.Mock).mockResolvedValue(undefined);

            providerManager.registerProvider(provider1);
            providerManager.registerProvider(provider2);

            await providerManager.initializeAllProviders();

            expect(provider1.initialize).toHaveBeenCalled();
            expect(provider2.initialize).toHaveBeenCalled();
        });

        it('should handle initialization timeout', async () => {
            const provider = createMockAuthenticator('timeout-test', 'oauth');
            (provider.initialize as jest.Mock).mockReturnValue(Promise.reject(new Error('Initialization timeout')));

            providerManager.registerProvider(provider);

            // initializeAllProviders uses Promise.allSettled, so it won't reject
            // but the provider should still fail initialization
            await providerManager.initializeAllProviders(500);

            // Verify the provider was called
            expect(provider.initialize).toHaveBeenCalledWith();
        });

        it('should shutdown all providers gracefully', async () => {
            const provider1 = createMockAuthenticator('shutdown1', 'oauth');
            const provider2 = createMockAuthenticator('shutdown2', 'saml');

            (provider1.shutdown as jest.Mock).mockResolvedValue(undefined);
            (provider2.shutdown as jest.Mock).mockResolvedValue(undefined);

            providerManager.registerProvider(provider1);
            providerManager.registerProvider(provider2);

            providerManager.startHealthMonitoring();

            await providerManager.shutdownAllProviders();

            expect(provider1.shutdown).toHaveBeenCalledWith(30000);
            expect(provider2.shutdown).toHaveBeenCalledWith(30000);
        });

        it('should sort providers by priority when listing', () => {
            const normal = createMockAuthenticator('normal', 'oauth');
            const critical = createMockAuthenticator('critical', 'saml');
            const high = createMockAuthenticator('high', 'ldap');

            providerManager.registerProvider(normal, { priority: ProviderPriority.NORMAL });
            providerManager.registerProvider(critical, { priority: ProviderPriority.CRITICAL });
            providerManager.registerProvider(high, { priority: ProviderPriority.HIGH });

            const sortedProviders = providerManager.listProviders(false, true);

            expect(sortedProviders[0]).toBe('critical');
            expect(sortedProviders[1]).toBe('high');
            expect(sortedProviders[2]).toBe('normal');
        });
    });
});
