/**
 * Example usage of AuthModule with integrated plugins
 *
 * Demonstrates how to use the createWithPlugins method
 * to create an enhanced authentication service with plugins that integrate
 * with existing analytics and security services.
 */

import { AuthModuleFactory } from '../AuthModule';
import { AnalyticsPlugin } from '../plugins/AnalyticsPlugin';
import { SecurityPlugin } from '../plugins/SecurityPlugin';

/**
 * Example: Creating authentication service with integrated plugins
 */
export function createAuthWithIntegratedPlugins() {
    // 1. Create base authentication service
    const baseAuthService = AuthModuleFactory.createDefault();

    // 2. Create plugin instances that integrate with existing services
    const analyticsPlugin = new AnalyticsPlugin(); // Integrates with AnalyticsService
    const securityPlugin = new SecurityPlugin(); // Integrates with EnterpriseSecurityService

    // 3. Create enhanced service with plugins
    return AuthModuleFactory.createWithPlugins(
        baseAuthService,
        [analyticsPlugin, securityPlugin]
    );
}


/**
 * Example: Getting integration information from plugins
 */
export function getPluginIntegrationInformation(authService: unknown) {
    const typedAuthService = authService as { plugins?: Map<string, unknown> };
    const plugins = typedAuthService.plugins;

    if (!plugins) {
        console.log('No plugins registered');
        return;
    }

    console.log('Registered plugins with integration status:');
    for (const [name, plugin] of plugins) {
        const typedPlugin = plugin as { getMetadata: () => unknown };
        const metadata = typedPlugin.getMetadata();
        const typedMetadata = metadata as Record<string, unknown>;
        console.log(`- ${name}:`, {
            description: typedMetadata.description,
            integrationStatus: typedMetadata.integrationStatus || typedMetadata.analyticsServiceAvailable,
            capabilities: typedMetadata.capabilities
        });
    }
}


// Export for use in other parts of the application
export { AnalyticsPlugin, SecurityPlugin };
