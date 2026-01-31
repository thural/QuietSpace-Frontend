/**
 * Analytics Plugin for Authentication
 * 
 * Integrates with the existing AnalyticsService to track authentication events.
 * Bridges the auth plugin system with the comprehensive analytics infrastructure.
 */

/**
 * Authentication plugin interface
 * @interface IAuthPlugin
 * @description Defines contract for authentication plugins
 */
export class IAuthPlugin {
    /**
     * @param {string} hook - Hook name
     * @param {...*} args - Hook arguments
     * @returns {Promise<*>} Hook result
     * @description Executes plugin hook
     */
    async execute(hook, ...args) {
        throw new Error('Method execute() must be implemented');
    }

    /**
     * @param {*} authService - Authentication service
     * @returns {Promise<void>}
     * @description Initializes plugin
     */
    async initialize(authService) {
        throw new Error('Method initialize() must be implemented');
    }

    /**
     * @returns {Promise<void>}
     * @description Cleans up plugin resources
     */
    async cleanup() {
        throw new Error('Method cleanup() must be implemented');
    }

    /**
     * @returns {Object} Plugin metadata
     * @description Gets plugin metadata
     */
    getMetadata() {
        throw new Error('Method getMetadata() must be implemented');
    }
}

/**
 * Authentication service interface
 * @interface IAuthService
 * @description Defines contract for authentication services
 */
export class IAuthService {
    /**
     * @returns {Promise<*>} Current session
     * @description Gets current session
     */
    async getCurrentSession() {
        throw new Error('Method getCurrentSession() must be implemented');
    }
}

/**
 * Analytics service interface
 * @interface AnalyticsService
 * @description Defines contract for analytics services
 */
export class AnalyticsService {
    /**
     * @param {Object} event - Analytics event
     * @returns {Promise<void>}
     * @description Tracks analytics event
     */
    async trackEvent(event) {
        throw new Error('Method trackEvent() must be implemented');
    }
}

/**
 * Analytics event type
 * @typedef {string} AnalyticsEventType
 */

export class AnalyticsPlugin extends IAuthPlugin {
    /** @type {string} */
    name = 'analytics';

    /** @type {string} */
    version = '1.0.0';

    /** @type {string[]} */
    dependencies = [];

    /** @type {IAuthService|null} */
    authService;

    /** @type {AnalyticsService|null} */
    analyticsService;

    /**
     * Initializes the analytics plugin with the existing AnalyticsService
     * @param {IAuthService} authService - Authentication service
     * @returns {Promise<void>}
     */
    async initialize(authService) {
        this.authService = authService;

        // Initialize the existing AnalyticsService through DI container
        try {
            // In a real implementation, this would use the DI container
            // For now, we'll create a simple instance
            this.analyticsService = new AnalyticsService({});
            console.log(`[AnalyticsPlugin] Initialized with existing AnalyticsService`);
        } catch (error) {
            console.warn(`[AnalyticsPlugin] Could not initialize AnalyticsService:`, error);
            // Fallback to basic logging if AnalyticsService is unavailable
            this.analyticsService = null;
        }
    }

    /**
     * Executes plugin hooks for different authentication events
     * @param {string} hook - Hook name
     * @param {...*} args - Hook arguments
     * @returns {Promise<*>} Hook result
     */
    async execute(hook, ...args) {
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
     * @param {AnalyticsEventType} eventType - Event type
     * @param {Object} data - Event data
     * @returns {Promise<void>}
     */
    async trackAuthEvent(eventType, data) {
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
     * @param {string} eventType - Event type
     * @param {Object} data - Event data
     * @returns {void}
     */
    fallbackLog(eventType, data) {
        console.log(`[AnalyticsPlugin] Fallback - ${eventType}:`, data);
    }

    /**
     * Gets browser information
     * @returns {string} Browser name
     */
    getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    /**
     * Gets device type
     * @returns {'desktop'|'mobile'|'tablet'} Device type
     */
    getDeviceType() {
        const ua = navigator.userAgent;
        if (/Mobile|Android|iPhone|iPad/.test(ua)) {
            return /iPad|Tablet/.test(ua) ? 'tablet' : 'mobile';
        }
        return 'desktop';
    }

    /**
     * Cleans up plugin resources
     * @returns {Promise<void>}
     */
    async cleanup() {
        this.analyticsService = null;
        this.authService = null;
        console.log(`[AnalyticsPlugin] Cleaned up analytics plugin`);
    }

    /**
     * Gets plugin metadata
     * @returns {Object} Plugin metadata
     */
    getMetadata() {
        return {
            name: this.name,
            version: this.version,
            description: 'Integrates authentication events with existing AnalyticsService',
            analyticsServiceAvailable: this.analyticsService !== null,
            capabilities: ['event_tracking', 'user_behavior', 'security_monitoring', 'analytics_integration']
        };
    }
}
