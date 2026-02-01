/**
 * Analytics Plugin for Authentication
 * 
 * Integrates with the existing AnalyticsService to track authentication events.
 * Bridges the auth plugin system with the comprehensive analytics infrastructure.
 */

import { IAuthPlugin, IAuthService } from '../interfaces/authInterfaces';
import { AnalyticsEventType, AnalyticsService } from '@analytics';

export class AnalyticsPlugin implements IAuthPlugin {
    readonly name = 'analytics';
    readonly version = '1.0.0';
    readonly dependencies: string[] = [];

    private authService: IAuthService | null = null;
    private analyticsService: AnalyticsService | null = null;

    /**
     * Initializes the analytics plugin with the existing AnalyticsService
     */
    async initialize(authService: IAuthService): Promise<void> {
        this.authService = authService;

        // Initialize the existing AnalyticsService through DI container
        try {
            // In a real implementation, this would use the DI container
            // For now, we'll create a simple instance
            this.analyticsService = new AnalyticsService({} as any);
            console.log(`[AnalyticsPlugin] Initialized with existing AnalyticsService`);
        } catch (error) {
            console.warn(`[AnalyticsPlugin] Could not initialize AnalyticsService:`, error);
            // Fallback to basic logging if AnalyticsService is unavailable
            this.analyticsService = null;
        }
    }

    /**
     * Executes plugin hooks for different authentication events
     */
    async execute(hook: string, ...args: any[]): Promise<any> {
        switch (hook) {
            case 'auth_success':
                await this.trackAuthEvent('user_login', {
                    provider: args[0],
                    userId: args[1]?.id,
                    sessionId: args[1]?.sessionId
                });
                break;

            case 'auth_failure':
                await this.trackAuthEvent('error_occurred', {
                    provider: args[0],
                    error: args[1]?.message,
                    errorType: 'authentication_failure'
                });
                break;

            case 'user_registered':
                await this.trackAuthEvent('user_register', {
                    provider: args[0],
                    userId: args[1]?.id,
                    sessionId: args[1]?.sessionId
                });
                break;

            case 'session_expired':
                await this.trackAuthEvent('user_logout', {
                    reason: 'session_expired',
                    userId: args[0]?.id
                });
                break;

            default:
                console.log(`[AnalyticsPlugin] Unknown hook: ${hook}`);
        }
    }

    /**
     * Tracks authentication events using the existing AnalyticsService
     */
    private async trackAuthEvent(eventType: AnalyticsEventType, data: Record<string, any>): Promise<void> {
        if (this.analyticsService) {
            try {
                // Enhance analytics data with current session information
                let enhancedData = { ...data };
                if (this.authService) {
                    try {
                        const currentSession = await this.authService.getCurrentSession();
                        if (currentSession) {
                            enhancedData.currentUserId = currentSession.user.id;
                            enhancedData.sessionActive = true;
                            enhancedData.sessionExpiresAt = currentSession.expiresAt;
                        }
                    } catch (sessionError) {
                        console.warn(`[AnalyticsPlugin] Could not get current session:`, sessionError);
                    }
                }

                // Use the existing AnalyticsService to track the event
                await this.analyticsService.trackEvent({
                    userId: enhancedData.userId || enhancedData.currentUserId,
                    eventType,
                    timestamp: new Date(),
                    sessionId: enhancedData.sessionId || 'unknown',
                    metadata: {
                        userAgent: navigator.userAgent,
                        platform: navigator.platform,
                        browser: this.getBrowserInfo(),
                        version: navigator.appVersion,
                        language: navigator.language,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        screenResolution: `${screen.width}x${screen.height}`,
                        deviceType: this.getDeviceType(),
                        ipAddress: 'unknown', // Would be filled by backend
                        referrer: document.referrer
                    },
                    properties: {
                        provider: enhancedData.provider,
                        error: enhancedData.error,
                        errorType: enhancedData.errorType,
                        reason: enhancedData.reason,
                        sessionActive: enhancedData.sessionActive || false,
                        sessionExpiresAt: enhancedData.sessionExpiresAt || null
                    },
                    source: 'web'
                });

                console.log(`[AnalyticsPlugin] Tracked ${eventType} via AnalyticsService`);
            } catch (error) {
                console.error(`[AnalyticsPlugin] Failed to track event:`, error);
                // Fallback to basic logging
                this.fallbackLog(eventType, data);
            }
        } else {
            // Fallback when AnalyticsService is not available
            this.fallbackLog(eventType, data);
        }
    }

    /**
     * Fallback logging when AnalyticsService is unavailable
     */
    private fallbackLog(eventType: string, data: Record<string, any>): void {
        console.log(`[AnalyticsPlugin] Fallback - ${eventType}:`, data);
    }

    /**
     * Gets browser information
     */
    private getBrowserInfo(): string {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    /**
     * Gets device type
     */
    private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
        const ua = navigator.userAgent;
        if (/Mobile|Android|iPhone|iPad/.test(ua)) {
            return /iPad|Tablet/.test(ua) ? 'tablet' : 'mobile';
        }
        return 'desktop';
    }

    /**
     * Cleans up plugin resources
     */
    async cleanup(): Promise<void> {
        this.analyticsService = null;
        this.authService = null;
        console.log(`[AnalyticsPlugin] Cleaned up analytics plugin`);
    }

    /**
     * Gets plugin metadata
     */
    getMetadata(): Record<string, any> {
        return {
            name: this.name,
            version: this.version,
            description: 'Integrates authentication events with existing AnalyticsService',
            analyticsServiceAvailable: this.analyticsService !== null,
            capabilities: ['event_tracking', 'user_behavior', 'security_monitoring', 'analytics_integration']
        };
    }
}
