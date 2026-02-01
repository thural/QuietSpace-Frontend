/**
 * Example usage of AuthModule with integrated plugins
 *
 * Demonstrates how to use the createWithPlugins method
 * to create an enhanced authentication service with plugins that integrate
 * with existing analytics and security services.
 */

import { AuthModuleFactory } from '../../AuthModule';
import { AnalyticsPlugin } from '../plugins/AnalyticsPlugin';
import { SecurityPlugin } from '../plugins/SecurityPlugin';

/**
 * Example: Creating authentication service with integrated plugins
 */
export function createAuthWithIntegratedPlugins() {
    return AuthModuleFactory.createWithPlugins([
        new AnalyticsPlugin({
            trackEvents: true,
            enableMetrics: true,
            logLevel: 'info'
        }),
        new SecurityPlugin({
            enableRateLimiting: true,
            maxAttempts: 5,
            lockoutDuration: 15 * 60 * 1000, // 15 minutes
            enableAuditLogging: true
        })
    ]);
}

/**
 * Example: Getting plugin integration information
 */
export function getPluginIntegrationInformation() {
    return {
        analytics: {
            description: 'Tracks authentication events and provides metrics',
            features: [
                'Event tracking',
                'Performance metrics',
                'User behavior analytics',
                'Security event logging'
            ]
        },
        security: {
            description: 'Enhances security with rate limiting and audit logging',
            features: [
                'Rate limiting',
                'Account lockout',
                'Audit logging',
                'Security monitoring'
            ]
        },
        integration: {
            description: 'Both plugins integrate seamlessly with existing services',
            benefits: [
                'Zero configuration required',
                'Automatic service discovery',
                'Shared logging infrastructure',
                'Unified error handling'
            ]
        }
    };
}
