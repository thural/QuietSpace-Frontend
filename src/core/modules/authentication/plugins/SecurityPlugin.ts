/**
 * Security Plugin for Authentication
 *
 * Integrates with the existing EnterpriseSecurityService to enhance security.
 * Bridges the auth plugin system with the comprehensive security infrastructure.
 */

import { EnterpriseSecurityService } from '../security/EnterpriseSecurityService';

import type { AuthEvent, IAuthPlugin, IAuthService } from '../interfaces/authInterfaces';

export class SecurityPlugin implements IAuthPlugin {
    readonly name = 'security';
    readonly version = '1.0.0';
    readonly dependencies: string[] = [];

    private authService: IAuthService | null = null;
    private enterpriseSecurityService: EnterpriseSecurityService | null = null;
    private readonly pluginFailedAttempts = new Map<string, number>();
    private readonly PLUGIN_MAX_FAILED_ATTEMPTS = 3; // Separate from enterprise service

    /**
     * Initializes the security plugin with the existing EnterpriseSecurityService
     */
    async initialize(authService: IAuthService): Promise<void> {
        this.authService = authService;

        try {
            // Use the existing EnterpriseSecurityService
            this.enterpriseSecurityService = new EnterpriseSecurityService();
            console.log('[SecurityPlugin] Initialized with existing EnterpriseSecurityService');
        } catch (error) {
            console.warn('[SecurityPlugin] Could not initialize EnterpriseSecurityService:', error);
            this.enterpriseSecurityService = null;
        }
    }

    /**
     * Executes security hooks for authentication events
     */
    async execute(hook: string, ...args: unknown[]): Promise<unknown> {
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
     */
    private preAuthenticateCheck(providerName: string, credentials: unknown): { allowed: boolean; reason?: string } {
        const typedCredentials = credentials as Record<string, unknown>;
        const userId = typedCredentials.email || typedCredentials.username || 'anonymous';

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
                console.warn('[SecurityPlugin] Failed to check current session:', error);
            }
        }

        // Use enterprise security service if available
        if (this.enterpriseSecurityService) {
            try {
                // Create a mock event for the enterprise service to analyze
                const mockEvent = {
                    type: 'auth_attempt' as const,
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
                console.warn('[SecurityPlugin] Enterprise security check failed:', error);
                // Fall back to plugin-level checks only
            }
        }

        return { allowed: true };
    }

    /**
     * Handles authentication failure with both plugin and enterprise service
     */
    private handleAuthFailure(providerName: string, credentials: unknown, error: unknown): void {
        const typedCredentials = credentials as Record<string, unknown>;
        const userId = typedCredentials.email || typedCredentials.username || 'anonymous';

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
                    console.warn('[SecurityPlugin] Failed to trigger global signout:', signoutError);
                });
            } catch (error) {
                console.warn('[SecurityPlugin] Error triggering global signout:', error);
            }
        }

        // Use enterprise security service if available
        if (this.enterpriseSecurityService) {
            try {
                // Create security event for enterprise service
                const securityEvent = {
                    type: 'auth_failure' as const,
                    timestamp: new Date(),
                    userId,
                    details: {
                        provider: providerName,
                        error: error instanceof Error ? error.message : String(error),
                        ipAddress: 'unknown',
                        userAgent: navigator.userAgent,
                        attempts: currentAttempts
                    }
                };

                // Let enterprise service handle the security event
                this.enterpriseSecurityService.detectSuspiciousActivity([securityEvent]);
            } catch (error) {
                console.warn('[SecurityPlugin] Failed to report to enterprise security:', error);
            }
        }
    }

    /**
     * Handles successful authentication
     */
    private handleAuthSuccess(providerName: string, session: unknown): void {
        const typedSession = session as Record<string, unknown>;
        const userId = (typedSession.user as Record<string, unknown>)?.id || typedSession.email || 'anonymous';

        // Reset plugin-level counters
        this.pluginFailedAttempts.delete(userId);

        console.log(`[SecurityPlugin] Auth success for ${userId} via ${providerName} - reset failure count`);

        // Notify enterprise service of successful auth for risk scoring
        if (this.enterpriseSecurityService) {
            try {
                const successEvent = {
                    type: 'auth_success' as const,
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
                console.warn('[SecurityPlugin] Failed to report auth success to enterprise security:', error);
            }
        }
    }

    /**
     * Handles suspicious activity detection
     */
    private async handleSuspiciousActivity(event: AuthEvent): Promise<void> {
        console.error('[SecurityPlugin] Suspicious activity detected:', event);

        // Forward to enterprise security service if available
        if (this.enterpriseSecurityService) {
            try {
                this.enterpriseSecurityService.detectSuspiciousActivity([event]);
            } catch (error) {
                console.error('[SecurityPlugin] Failed to report suspicious activity:', error);
            }
        }

        // Additional plugin-specific handling could go here
        // For example: sending alerts, blocking IPs, etc.
    }

    /**
     * Gets security statistics from both plugin and enterprise service
     */
    getSecurityStats(): {
        pluginStats: {
            failedAttempts: Record<string, number>;
            totalFailedAttempts: number;
        };
        enterpriseStats?: {
            blockedIPs: string[];
            rateLimitEntries: number;
            totalBlockedIPs: number;
        };
        integrationStatus: 'full' | 'partial' | 'plugin_only';
        authServiceCapabilities?: string[];
    } {
        const failedAttemptsRecord: Record<string, number> = {};
        this.pluginFailedAttempts.forEach((count, userId) => {
            failedAttemptsRecord[userId] = count;
        });

        const pluginStats = {
            failedAttempts: failedAttemptsRecord,
            totalFailedAttempts: Array.from(this.pluginFailedAttempts.values()).reduce((sum, count) => sum + count, 0)
        };

        let enterpriseStats: {
            blockedIPs: string[];
            rateLimitEntries: number;
            totalBlockedIPs: number;
        } | undefined;
        let integrationStatus: 'full' | 'partial' | 'plugin_only' = 'plugin_only';
        let authServiceCapabilities: string[] | undefined;

        if (this.enterpriseSecurityService) {
            try {
                enterpriseStats = this.enterpriseSecurityService.getSecurityMonitoringData();
                integrationStatus = 'full';
            } catch (error) {
                console.warn('[SecurityPlugin] Could not get enterprise stats:', error);
                integrationStatus = 'partial';
            }
        }

        // Get auth service capabilities for additional context
        if (this.authService) {
            try {
                authServiceCapabilities = this.authService.getCapabilities();
            } catch (error) {
                console.warn('[SecurityPlugin] Could not get auth service capabilities:', error);
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
     */
    async cleanup(): Promise<void> {
        this.pluginFailedAttempts.clear();
        this.enterpriseSecurityService = null;
        this.authService = null;
        console.log('[SecurityPlugin] Cleaned up security plugin');
    }

    /**
     * Gets plugin metadata
     */
    getMetadata(): Record<string, unknown> {
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
