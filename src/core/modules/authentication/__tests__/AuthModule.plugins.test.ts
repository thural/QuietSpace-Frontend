/**
 * Tests for AuthModule plugin functionality with existing service integration
 */

import { AuthModuleFactory, AnalyticsPlugin, SecurityPlugin } from '../AuthModule';

describe('AuthModule with Integrated Plugins', () => {
    test('createWithPlugins should register plugins correctly', () => {
        const baseService = AuthModuleFactory.createDefault();
        const analyticsPlugin = new AnalyticsPlugin();
        const securityPlugin = new SecurityPlugin();

        const enhancedService = AuthModuleFactory.createWithPlugins(
            baseService,
            [analyticsPlugin, securityPlugin]
        );

        expect(enhancedService).toBeDefined();
        expect(enhancedService.getCapabilities()).toContain('plugins');
    });

    test('plugins should have correct metadata with integration status', () => {
        const analyticsPlugin = new AnalyticsPlugin();
        const securityPlugin = new SecurityPlugin();

        expect(analyticsPlugin.name).toBe('analytics');
        expect(analyticsPlugin.version).toBe('1.0.0');
        expect(analyticsPlugin.dependencies).toEqual([]);

        const analyticsMetadata = analyticsPlugin.getMetadata();
        expect(analyticsMetadata.capabilities).toContain('analytics_integration');

        expect(securityPlugin.name).toBe('security');
        expect(securityPlugin.version).toBe('1.0.0');
        expect(securityPlugin.dependencies).toEqual([]);

        const securityMetadata = securityPlugin.getMetadata();
        expect(securityMetadata.capabilities).toContain('enterprise_integration');
    });

    test('plugin initialization should work with fallback', async () => {
        const baseService = AuthModuleFactory.createDefault();
        const analyticsPlugin = new AnalyticsPlugin();

        const enhancedService = AuthModuleFactory.createWithPlugins(
            baseService,
            [analyticsPlugin]
        );

        await enhancedService.initialize();

        const metadata = analyticsPlugin.getMetadata();
        expect(metadata.name).toBe('analytics');
        expect(metadata.capabilities).toContain('event_tracking');

        // Should have fallback capability when AnalyticsService is not available
        expect(metadata.analyticsServiceAvailable).toBeDefined();
    });

    test('security plugin should integrate with enterprise service', () => {
        const securityPlugin = new SecurityPlugin();

        // Simulate failed authentication attempts
        securityPlugin.execute('auth_failure', 'jwt', { email: 'test@example.com' }, { message: 'Invalid password' });
        securityPlugin.execute('auth_failure', 'jwt', { email: 'test@example.com' }, { message: 'Invalid password' });

        const stats = securityPlugin.getSecurityStats();
        expect(stats.pluginStats.totalFailedAttempts).toBe(2);
        expect(stats.pluginStats.failedAttempts['test@example.com']).toBe(2);
        expect(stats.integrationStatus).toBeDefined();
    });

    test('analytics plugin should handle events with integration', async () => {
        const analyticsPlugin = new AnalyticsPlugin();

        // Simulate authentication success
        await analyticsPlugin.execute('auth_success', 'jwt', { id: 'user123', email: 'test@example.com', sessionId: 'session123' });

        const metadata = analyticsPlugin.getMetadata();
        expect(metadata.name).toBe('analytics');
        expect(metadata.capabilities).toContain('analytics_integration');

        // Should handle gracefully even when AnalyticsService is not available
        expect(metadata.analyticsServiceAvailable).toBeDefined();
    });

    test('plugins should provide proper cleanup', async () => {
        const analyticsPlugin = new AnalyticsPlugin();
        const securityPlugin = new SecurityPlugin();

        await analyticsPlugin.cleanup();
        await securityPlugin.cleanup();

        // Should not throw errors during cleanup
        expect(true).toBe(true);
    });

    test('security plugin pre-auth check should work', async () => {
        const securityPlugin = new SecurityPlugin();

        const result = await securityPlugin.execute('pre_authenticate', 'jwt', { email: 'test@example.com' });

        // Should allow authentication by default
        expect(result).toEqual({ allowed: true });
    });

    test('analytics plugin should handle different event types', async () => {
        const analyticsPlugin = new AnalyticsPlugin();

        // Test different event types
        await analyticsPlugin.execute('auth_success', 'jwt', { id: 'user123', sessionId: 'session123' });
        await analyticsPlugin.execute('auth_failure', 'jwt', { email: 'test@example.com' }, { message: 'Invalid password' });
        await analyticsPlugin.execute('user_registered', 'local', { id: 'user456', sessionId: 'session456' });
        await analyticsPlugin.execute('session_expired', null, { id: 'user789' });

        // Should handle all events without throwing
        const metadata = analyticsPlugin.getMetadata();
        expect(metadata.capabilities).toContain('event_tracking');
    });
});
