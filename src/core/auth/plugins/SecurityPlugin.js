/**
 * Security Plugin for Authentication
 * 
 * Integrates with the existing EnterpriseSecurityService to enhance security.
 * Bridges the auth plugin system with the comprehensive security infrastructure.
 */

/**
 * Authentication event interface
 * @typedef {Object} AuthEvent
 * @property {string} type - Event type
 * @property {Date} [timestamp] - Event timestamp
 * @property {string} [userId] - User ID
 * @property {string} [providerType] - Provider type
 * @property {string} [error] - Error type
 * @property {Object} [details] - Event details
 */

/**
 * Authentication plugin interface
 * @interface IAuthPlugin
 * @description Defines contract for authentication plugins
 */
class IAuthPlugin {
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
     * @returns {Promise<void>}
     * @description Initializes plugin
     */
    async initialize() {
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
class IAuthService {
    /**
     * @returns {Promise<*>} Current session
     * @description Gets current session
     */
    async getCurrentSession() {
        throw new Error('Method getCurrentSession() must be implemented');
    }

    /**
     * @returns {Promise<void>}
     * @description Global signout
     */
    async globalSignout() {
        throw new Error('Method globalSignout() must be implemented');
    }

    /**
     * @returns {string[]} Provider capabilities
     * @description Gets provider capabilities
     */
    getCapabilities() {
        throw new Error('Method getCapabilities() must be implemented');
    }
}

/**
 * Enterprise security service
 */
class EnterpriseSecurityService {
    /**
     * Detects suspicious activity
     * @param {AuthEvent[]} events - Security events
     * @returns {AuthEvent[]} Suspicious events
     */
    detectSuspiciousActivity(events) {
        // Implementation omitted
    }

    /**
     * Gets security monitoring data
     * @returns {Object} Security monitoring data
     */
    getSecurityMonitoringData() {
        // Implementation omitted
    }

    /**
     * Checks rate limit
     * @param {string} userId - User ID
     * @param {number} attempts - Number of attempts
     * @returns {boolean} Whether rate limit is exceeded
     */
    checkRateLimit(userId, attempts) {
        // Implementation omitted
    }
}

/**
 * Security plugin
 * @extends IAuthPlugin
 */
class SecurityPlugin extends IAuthPlugin {
    /** @type {string} */
    name = 'security';

    /** @type {string} */
    version = '1.0.0';

    /** @type {string[]} */
    dependencies = [];

    /** @type {IAuthService|null} */
    authService;

    /** @type {EnterpriseSecurityService|null} */
    enterpriseSecurityService;

    /** @type {Map<string, number>} */
    pluginFailedAttempts = new Map();

    /** @type {number} */
    PLUGIN_MAX_FAILED_ATTEMPTS = 3; // Separate from enterprise service


    /**
     * Initializes the security plugin with the existing EnterpriseSecurityService
     * @param {IAuthService} authService - Authentication service
     * @returns {Promise<void>}
     */
    async initialize(authService) {
        this.authService = authService;

        try {
            // Use the existing EnterpriseSecurityService
            this.enterpriseSecurityService = new EnterpriseSecurityService();
            console.log(`[SecurityPlugin] Initialized with existing EnterpriseSecurityService`);
        } catch (error) {
            console.warn(`[SecurityPlugin] Could not initialize EnterpriseSecurityService:`, error);
            this.enterpriseSecurityService = null;
        }
    }

    /**
     * Executes security hooks for authentication events
     * @param {string} hook - Hook name
     * @param {...*} args - Hook arguments
     * @returns {Promise<*>} Hook result
     */
    async execute(hook, ...args) {
        switch (hook) {
            case 'pre_authenticate':
                return this.preAuthenticateCheck(args[0], args[1]);

            case 'auth_failure':
                this.handleAuthFailure(args[0], args[1], args[2]);
                break;

            case 'auth_success':
                this.handleAuthSuccess(args[0], args[1]);
                break;

            case 'suspicious_activity':
                await this.handleSuspiciousActivity(args[0]);
                break;

            default:
                console.log(`[SecurityPlugin] Unknown hook: ${hook}`);
        }
    }

    /**
     * Pre-authentication security check using both plugin and enterprise service
     * @param {string} providerName - Provider name
     * @param {*} credentials - Authentication credentials
     * @returns {{allowed: boolean, reason?: string}} Pre-auth check result
     */
    preAuthenticateCheck(providerName, credentials) {
        const userId = credentials.email || credentials.username || 'anonymous';

        // Check plugin-level blocking first
        const pluginAttempts = this.pluginFailedAttempts.get(userId) || 0;
        if (pluginAttempts >= this.PLUGIN_MAX_FAILED_ATTEMPTS) {
            return {
                allowed: false,
                reason: 'User temporarily blocked by security plugin due to multiple failed attempts'
            };
        }

        // Check if user already has an active session (potential session hijacking)
        if (this.authService) {
            try {
                const currentSession = this.authService.getCurrentSession();
                if (currentSession) {
                    // Additional security check: if user has active session, verify it's the same user
                    currentSession.then(session => {
                        if (session && session.user.id !== userId) {
                            console.warn(`[SecurityPlugin] Potential session hijacking detected: session user ${session.user.id} vs auth user ${userId}`);
                        }
                    }).catch(() => {
                        // Ignore session check errors
                    });
                }
            } catch (error) {
                console.warn(`[SecurityPlugin] Failed to check current session:`, error);
            }
        }

        // Use enterprise security service if available
        if (this.enterpriseSecurityService) {
            try {
                // Create a mock event for the enterprise service to analyze
                const mockEvent = {
                    type: 'auth_attempt',
                    timestamp: new Date(),
                    userId,
                    details: {
                        provider: providerName,
                        ipAddress: 'unknown', // Would be filled by request context
                        userAgent: navigator.userAgent
                    }
                };

                const suspiciousEvents = this.enterpriseSecurityService.detectSuspiciousActivity([mockEvent]);
                if (suspiciousEvents.length > 0) {
                    return {
                        allowed: false,
                        reason: 'Suspicious activity detected by enterprise security service'
                    };
                }

                // Check rate limiting via enterprise service
                const isRateLimited = !this.enterpriseSecurityService.checkRateLimit(userId, pluginAttempts + 1);
                if (isRateLimited) {
                    return {
                        allowed: false,
                        reason: 'Rate limit exceeded'
                    };
                }
            } catch (error) {
                console.warn(`[SecurityPlugin] Enterprise security check failed:`, error);
                // Fall back to plugin-level checks only
            }
        }

        return { allowed: true };
    }

    /**
     * Handles authentication failure with both plugin and enterprise service
     * @param {string} providerName - Provider name
     * @param {*} credentials - Authentication credentials
     * @param {*} error - Error object
     * @returns {void}
     */
    handleAuthFailure(providerName, credentials, error) {
        const userId = credentials.email || credentials.username || 'anonymous';

        // Track plugin-level failures
        const currentAttempts = (this.pluginFailedAttempts.get(userId) || 0) + 1;
        this.pluginFailedAttempts.set(userId, currentAttempts);

        console.warn(`[SecurityPlugin] Auth failure for ${userId}: ${currentAttempts}/${this.PLUGIN_MAX_FAILED_ATTEMPTS} attempts`);

        // Trigger global signout if too many failed attempts across all providers
        if (this.authService && currentAttempts >= this.PLUGIN_MAX_FAILED_ATTEMPTS) {
            try {
                this.authService.globalSignout().then(() => {
                    console.log(`[SecurityPlugin] Global signout triggered for ${userId} due to multiple failed attempts`);
                }).catch(signoutError => {
                    console.warn(`[SecurityPlugin] Failed to trigger global signout:`, signoutError);
                });
            } catch (error) {
                console.warn(`[SecurityPlugin] Error triggering global signout:`, error);
            }
        }

        // Use enterprise security service if available
        if (this.enterpriseSecurityService) {
            try {
                // Create security event for enterprise service
                const securityEvent = {
                    type: 'auth_failure',
                    timestamp: new Date(),
                    userId,
                    details: {
                        provider: providerName,
                        error: error?.message,
                        ipAddress: 'unknown',
                        userAgent: navigator.userAgent,
                        attempts: currentAttempts
                    }
                };

                // Let enterprise service handle the security event
                this.enterpriseSecurityService.detectSuspiciousActivity([securityEvent]);
            } catch (error) {
                console.warn(`[SecurityPlugin] Failed to report to enterprise security:`, error);
            }
        }
    }

    /**
     * Handles successful authentication
     * @param {string} providerName - Provider name
     * @param {*} session - Session data
     * @returns {void}
     */
    handleAuthSuccess(providerName, session) {
        const userId = session.user?.id || session.email || 'anonymous';

        // Reset plugin-level counters
        this.pluginFailedAttempts.delete(userId);

        console.log(`[SecurityPlugin] Auth success for ${userId} via ${providerName} - reset failure count`);

        // Notify enterprise service of successful auth for risk scoring
        if (this.enterpriseSecurityService) {
            try {
                const successEvent = {
                    type: 'auth_success',
                    timestamp: new Date(),
                    userId,
                    details: {
                        provider: providerName,
                        ipAddress: 'unknown',
                        userAgent: navigator.userAgent
                    }
                };

                this.enterpriseSecurityService.detectSuspiciousActivity([successEvent]);
            } catch (error) {
                console.warn(`[SecurityPlugin] Failed to report auth success to enterprise security:`, error);
            }
        }
    }

    /**
     * Handles suspicious activity detection
     * @param {AuthEvent} event - Security event
     * @returns {Promise<void>}
     */
    async handleSuspiciousActivity(event) {
        console.error(`[SecurityPlugin] Suspicious activity detected:`, event);

        // Forward to enterprise security service if available
        if (this.enterpriseSecurityService) {
            try {
                this.enterpriseSecurityService.detectSuspiciousActivity([event]);
            } catch (error) {
                console.error(`[SecurityPlugin] Failed to report suspicious activity:`, error);
            }
        }

        // Additional plugin-specific handling could go here
        // For example: sending alerts, blocking IPs, etc.
    }

    /**
     * Gets security statistics from both plugin and enterprise service
     * @returns {Object} Security statistics
     */
    getSecurityStats() {
        const failedAttemptsRecord = {};
        this.pluginFailedAttempts.forEach((count, userId) => {
            failedAttemptsRecord[userId] = count;
        });

        const pluginStats = {
            failedAttempts: failedAttemptsRecord,
            totalFailedAttempts: Array.from(this.pluginFailedAttempts.values()).reduce((sum, count) => sum + count, 0)
        };

        let enterpriseStats;
        let integrationStatus = 'plugin_only';
        let authServiceCapabilities;

        if (this.enterpriseSecurityService) {
            try {
                enterpriseStats = this.enterpriseSecurityService.getSecurityMonitoringData();
                integrationStatus = 'full';
            } catch (error) {
                console.warn(`[SecurityPlugin] Could not get enterprise stats:`, error);
                integrationStatus = 'partial';
            }
        }

        // Get auth service capabilities for additional context
        if (this.authService) {
            try {
                authServiceCapabilities = this.authService.getCapabilities();
            } catch (error) {
                console.warn(`[SecurityPlugin] Could not get auth service capabilities:`, error);
            }
        }

        return {
            pluginStats,
            enterpriseStats,
            integrationStatus,
            authServiceCapabilities
        };
    }

    /**
     * Cleans up plugin resources
     * @returns {Promise<void>}
     */
    async cleanup() {
        this.pluginFailedAttempts.clear();
        this.enterpriseSecurityService = null;
        this.authService = null;
        console.log(`[SecurityPlugin] Cleaned up security plugin`);
    }

    /**
     * Gets plugin metadata
     * @returns {Object} Plugin metadata
     */
    getMetadata() {
        const stats = this.getSecurityStats();

        return {
            name: this.name,
            version: this.version,
            description: 'Integrates authentication security with existing EnterpriseSecurityService',
            integrationStatus: stats.integrationStatus,
            enterpriseServiceAvailable: this.enterpriseSecurityService !== null,
            authServiceAvailable: this.authService !== null,
            authServiceCapabilities: stats.authServiceCapabilities,
            ...stats.pluginStats,
            capabilities: ['rate_limiting', 'account_lockout', 'suspicious_activity_detection', 'enterprise_integration', 'session_management']
        };
    }
}
