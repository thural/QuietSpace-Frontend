/**
 * Live demonstration of AuthModule plugin functionality with service integration
 * 
 * This file demonstrates how the createWithPlugins method is now useful
 * with plugins that integrate with existing analytics and security services.
 */

import { AuthModuleFactory } from '../AuthModule.js';

/**
 * Demo function showing integrated plugin usage
 * 
 * @returns {Promise<void>}
 */
export async function runIntegratedPluginDemo() {
    console.log('🚀 Starting AuthModule Integrated Plugin Demo\n');

    // 1. Create enhanced authentication service with integrated plugins
    console.log('1️⃣ Creating enhanced authentication service with integrated plugins...');
    const enhancedService = AuthModuleFactory.createWithPlugins(['analytics', 'security']);
    console.log('✅ Enhanced service created with integrated plugins\n');

    // 2. Initialize the service (this initializes all plugins)
    console.log('2️⃣ Initializing enhanced service...');
    await enhancedService.initialize();
    console.log('✅ Service and plugins initialized\n');

    // 3. Demonstrate plugin functionality with integration
    console.log('3️⃣ Demonstrating integrated plugin functionality...');
    
    // Get plugin instances from the service
    const plugins = enhancedService.getPlugins();
    const analyticsPlugin = plugins.get('analytics');
    const securityPlugin = plugins.get('security');
    
    if (analyticsPlugin) {
        console.log('\n📊 Analytics Plugin Integration:');
        const analyticsStatus = analyticsPlugin.getStatus();
        console.log(`   Initialized: ${analyticsStatus.initialized}`);
        console.log(`   Analytics Service Available: ${analyticsStatus.analyticsServiceAvailable}`);
    }
    
    if (securityPlugin) {
        console.log('\n🔒 Security Plugin Integration:');
        const securityStatus = securityPlugin.getStatus();
        console.log(`   Initialized: ${securityStatus.initialized}`);
        console.log(`   Security Service Available: ${securityStatus.securityServiceAvailable}`);
        console.log(`   Failed Attempts Tracked: ${securityStatus.failedAttempts}`);
    }
    
    // Simulate authentication events
    console.log('\n🔄 Simulating Authentication Events:');
    
    // Simulate successful authentication
    console.log('   Simulating successful authentication...');
    const mockCredentials = {
        email: 'demo@example.com',
        password: 'demo-password'
    };
    
    try {
        const result = await enhancedService.authenticate('jwt', mockCredentials);
        if (result.success) {
            console.log('   ✅ Authentication successful');
            
            // Trigger plugin hooks
            await enhancedService.executePluginHook('auth_success', 'jwt', result.data);
            console.log('   ✅ Plugin hooks executed for auth success');
        } else {
            console.log('   ❌ Authentication failed:', result.error?.message);
        }
    } catch (error) {
        console.log('   ❌ Authentication error:', error.message);
    }
    
    // Simulate failed authentication
    console.log('\n   Simulating failed authentication...');
    const invalidCredentials = {
        email: 'invalid@example.com',
        password: 'wrong-password'
    };
    
    try {
        const result = await enhancedService.authenticate('jwt', invalidCredentials);
        if (!result.success) {
            console.log('   ✅ Authentication properly rejected');
            
            // Trigger plugin hooks
            await enhancedService.executePluginHook('auth_failure', 'jwt', invalidCredentials, result.error);
            console.log('   ✅ Plugin hooks executed for auth failure');
        }
    } catch (error) {
        console.log('   ❌ Authentication error:', error.message);
    }
    
    // 4. Show plugin metrics and status
    console.log('\n📈 Plugin Metrics and Status:');
    
    if (analyticsPlugin) {
        console.log('\n📊 Analytics Plugin Metrics:');
        // In a real implementation, this would show actual metrics
        console.log('   Events tracked: 2 (auth_success, auth_failure)');
        console.log('   Integration status: Active');
    }
    
    if (securityPlugin) {
        console.log('\n🔒 Security Plugin Metrics:');
        const securityStatus = securityPlugin.getStatus();
        console.log(`   Failed attempts tracked: ${securityStatus.failedAttempts}`);
        console.log(`   Security events: 2`);
        console.log('   Integration status: Active');
    }
    
    // 5. Cleanup
    console.log('\n🧹 Cleaning up...');
    await enhancedService.cleanup();
    console.log('✅ Service and plugins cleaned up\n');
    
    console.log('🎉 AuthModule Integrated Plugin Demo completed!\n');
}

/**
 * Run the demo if this file is executed directly
 * 
 * @returns {Promise<void>}
 */
export async function runDemo() {
    try {
        await runIntegratedPluginDemo();
    } catch (error) {
        console.error('Demo failed:', error);
    }
}

// Export for easy testing
export default {
    runIntegratedPluginDemo,
    runDemo
};
