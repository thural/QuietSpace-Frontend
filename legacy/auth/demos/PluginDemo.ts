/**
 * Live demonstration of AuthModule plugin functionality with service integration
 *
 * This file demonstrates how the createWithPlugins method is now useful
 * with plugins that integrate with existing analytics and security services.
 */

import { AuthModuleFactory, AnalyticsPlugin, SecurityPlugin } from '../../AuthModule';
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

    // 2. Show plugin integration information
    console.log('2️⃣ Plugin integration information:');
    const pluginInfo = getPluginIntegrationInformation();
    console.log(pluginInfo);
    console.log('');

    // 3. Demonstrate authentication with plugins
    console.log('3️⃣ Demonstrating authentication with integrated plugins...');
    try {
        const result = await enhancedService.authenticate({
            username: 'demo-user',
            password: 'demo-password'
        });
        
        if (result.success) {
            console.log('✅ Authentication successful');
            console.log('📊 Analytics events were triggered');
            console.log('🔒 Security checks were performed');
        } else {
            console.log('❌ Authentication failed:', result.error?.message);
        }
    } catch (error) {
        console.log('❌ Authentication error:', error);
    }

    console.log('\n🎉 Demo completed!');
}

/**
 * Run the demo if this file is executed directly
 */
if (require.main === module) {
    runIntegratedPluginDemo().catch(console.error);
}
