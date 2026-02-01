/**
 * Live demonstration of AuthModule plugin functionality with service integration
 *
 * This file demonstrates how the createWithPlugins method is now useful
 * with plugins that integrate with existing analytics and security services.
 */

import { AuthModuleFactory, AnalyticsPlugin, SecurityPlugin } from '../AuthModule';
import { getPluginIntegrationInformation, createAuthWithIntegratedPlugins } from '../examples/PluginUsageExample';

/**
 * Demo function showing integrated plugin usage
 */
export async function runIntegratedPluginDemo() {
    console.log('🚀 Starting AuthModule Integrated Plugin Demo\n');

    // 1. Create enhanced authentication service with integrated plugins
    console.log('1️⃣ Creating enhanced authentication service with integrated plugins...');
    const enhancedService = createAuthWithIntegratedPlugins();
    console.log('✅ Enhanced service created with integrated plugins\n');

    // 2. Initialize the service (this initializes all plugins)
    console.log('2️⃣ Initializing enhanced service...');
    await enhancedService.initialize();
    console.log('✅ Service and plugins initialized\n');

    // 3. Demonstrate plugin functionality with integration
    console.log('3️⃣ Demonstrating integrated plugin functionality...');

    // Check integration status using the utility function
    console.log('\n📋 Plugin Integration Information:');
    getPluginIntegrationInformation(enhancedService);

    // Get plugin instances from the service
    const plugins = enhancedService['plugins'];
    const analyticsPlugin = plugins.get('analytics');
    const securityPlugin = plugins.get('security');

    const analyticsMetadata = analyticsPlugin.getMetadata();
    console.log(`   Service Available: ${analyticsMetadata.analyticsServiceAvailable}`);
    console.log(`   Capabilities: ${analyticsMetadata.capabilities.join(', ')}`);

    console.log('\n🔒 Security Plugin Integration:');
    const securityStats = securityPlugin.getSecurityStats();
    console.log(`   Integration Status: ${securityStats.integrationStatus}`);
    console.log(`   Enterprise Service Available: ${securityPlugin.getMetadata().enterpriseServiceAvailable}`);

    // Simulate authentication events
    console.log('\n🔄 Simulating Authentication Events:');

    // Test analytics integration
    await analyticsPlugin.execute('auth_success', 'jwt', { id: 'user123', email: 'user@example.com', sessionId: 'session123' });
    await analyticsPlugin.execute('user_registered', 'local', { id: 'user456', email: 'new@example.com', sessionId: 'session456' });

    // Test security integration
    await securityPlugin.execute('auth_failure', 'jwt', { email: 'test@example.com' }, { message: 'Invalid password' });
    await securityPlugin.execute('auth_failure', 'jwt', { email: 'test@example.com' }, { message: 'Invalid password' });

    console.log('✅ Events processed through integrated plugins');

    // 4. Show plugin metadata with integration information
    console.log('\n4️⃣ Plugin Integration Metadata:');
    console.log('📊 Analytics Plugin:', {
        ...analyticsMetadata,
        integrationWorking: analyticsMetadata.analyticsServiceAvailable || 'fallback_active'
    });
    console.log('🔒 Security Plugin:', {
        ...securityPlugin.getSecurityStats(),
        integrationWorking: securityStats.integrationStatus
    });

    console.log('\n🎉 Integrated Plugin Demo Complete!');
    console.log('\nThe createWithPlugins method now provides powerful integration with existing services!');

    return enhancedService;
}

/**
 * Example of how to use in a real application with integration
 */
export function exampleIntegratedUsageInApp() {
    // This is how you would use it in your application
    return createAuthWithIntegratedPlugins();
}

/**
 * Comparison showing the difference between basic and integrated approach
 */
export function compareBasicVsIntegrated() {
    console.log('\n📊 Comparison: Basic vs Integrated Approach');

    // Without plugins
    const basicService = AuthModuleFactory.createDefault();
    console.log('Basic Service Capabilities:', basicService.getCapabilities());

    // With integrated plugins
    const enhancedService = createAuthWithIntegratedPlugins();
    console.log('Enhanced Service Capabilities:', enhancedService.getCapabilities());

    console.log('\n🔗 Integration Benefits:');
    console.log('- ✅ AnalyticsPlugin leverages existing AnalyticsService');
    console.log('- ✅ SecurityPlugin leverages existing EnterpriseSecurityService');
    console.log('- ✅ Fallback behavior when services are unavailable');
    console.log('- ✅ No code duplication');
    console.log('- ✅ Consistent data models and interfaces');
}

/**
 * Demonstrate fallback behavior when services are unavailable
 */
export async function demonstrateFallbackBehavior() {
    console.log('\n🛡️ Demonstrating Fallback Behavior');

    const authService = createAuthWithIntegratedPlugins();

    await authService.initialize();

    const plugins = authService['plugins'];
    const analyticsPlugin = plugins.get('analytics');
    const securityPlugin = plugins.get('security');

    console.log('Fallback Status:');
    getPluginIntegrationInformation(authService);

    // Test that plugins still work even without underlying services
    await analyticsPlugin.execute('auth_success', 'jwt', { id: 'user123', sessionId: 'session123' });
    await securityPlugin.execute('auth_failure', 'jwt', { email: 'test@example.com' }, { message: 'Invalid password' });

    console.log('✅ Plugins continue to work with fallback behavior');
}

// Export for easy testing
export { AnalyticsPlugin, SecurityPlugin };
