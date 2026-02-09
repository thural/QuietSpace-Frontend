/**
 * Analytics Plugin for Authentication
 *
 * Provides basic analytics tracking for authentication events.
 * Bridges to auth plugin system with analytics infrastructure.
 */

import type { IAuthPlugin, IAuthService } from '../interfaces/authInterfaces';

export class AnalyticsPlugin implements IAuthPlugin {
    readonly name = 'analytics';
    readonly version = '1.0.0';
    readonly dependencies: string[] = [];

    private authService: IAuthService | null = null;

    /**
     * Initializes analytics plugin
     */
    async initialize(authService: IAuthService): Promise<void> {
        this.authService = authService;
        console.log('Analytics plugin initialized');
    }

    /**
     * Executes analytics plugin hook
     */
    async execute(hook: string, ...args: unknown[]): Promise<unknown> {
        if (!this.authService) {
            return { error: 'Analytics service not initialized' };
        }

        switch (hook) {
            case 'auth:success':
                const session = args[0] as any;
                if (session?.user?.id) {
                    console.log('Analytics: Authentication success tracked', {
                        userId: session.user.id,
                        timestamp: new Date(),
                        event: 'auth_success'
                    });
                }
                break;

            case 'auth:failure':
                const error = args[0] as any;
                console.log('Analytics: Authentication failure tracked', {
                    error: error?.message || 'Unknown error',
                    timestamp: new Date(),
                    event: 'auth_failure'
                });
                break;

            default:
                console.log(`Analytics: Unknown hook ${hook}`);
        }

        return { success: true };
    }

    /**
     * Cleans up analytics plugin
     */
    async cleanup(): Promise<void> {
        this.authService = null;
        console.log('Analytics plugin cleaned up');
    }

    /**
     * Gets plugin metadata
     */
    getMetadata(): Record<string, unknown> {
        return {
            description: 'Analytics plugin for authentication events',
            version: this.version,
            hooks: ['auth:success', 'auth:failure']
        };
    }
}
