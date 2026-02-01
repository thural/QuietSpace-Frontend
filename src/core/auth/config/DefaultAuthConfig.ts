/**
 * Default authentication configuration
 *
 * Provides default configuration values for authentication
 * with environment-specific overrides.
 */

import type { IAuthConfig } from '../interfaces/authInterfaces';

/**
 * Default authentication configuration
 */
export class DefaultAuthConfig implements IAuthConfig {
    readonly name = 'DefaultAuthConfig';

    private config: Record<string, any> = {
        // Token configuration
        tokenRefreshInterval: 540000, // 9 minutes
        tokenExpiration: 3600000, // 1 hour
        maxRetries: 3,

        // Session configuration
        sessionTimeout: 1800000, // 30 minutes
        maxConcurrentSessions: 5,

        // Security configuration
        maxLoginAttempts: 5,
        lockoutDuration: 900000, // 15 minutes
        rateLimitWindow: 900000, // 15 minutes
        rateLimitMaxAttempts: 5,

        // Feature flags
        mfaRequired: false,
        encryptionEnabled: true,
        auditEnabled: true,
        rateLimitingEnabled: true,

        // Provider configuration
        defaultProvider: 'jwt',
        allowedProviders: ['jwt', 'oauth', 'saml'],

        // Logging configuration
        logLevel: 'info',
        logRetentionDays: 30,

        // Environment
        environment: 'development',
        apiBaseUrl: 'http://localhost:3000',
        debugMode: true
    };

    private readonly watchers: Map<string, ((value: any) => void)[]> = new Map();

    /**
     * Gets configuration value
     */
    get<T>(key: string): T {
        return this.config[key] as T;
    }

    /**
     * Sets configuration value
     */
    set<T>(key: string, value: T): void {
        this.config[key] = value;

        // Notify watchers
        const keyWatchers = this.watchers.get(key);
        if (keyWatchers) {
            keyWatchers.forEach(callback => callback(value));
        }
    }

    /**
     * Gets all configuration
     */
    getAll(): Record<string, any> {
        return { ...this.config };
    }

    /**
     * Validates configuration
     */
    validate(): { success: boolean; data?: boolean; error?: any } {
        const requiredKeys = [
            'tokenRefreshInterval',
            'tokenExpiration',
            'maxLoginAttempts',
            'sessionTimeout',
            'maxConcurrentSessions',
            'lockoutDuration',
            'rateLimitWindow',
            'rateLimitMaxAttempts'
        ];

        const missingKeys = requiredKeys.filter(key => !(key in this.config));

        if (missingKeys.length > 0) {
            return {
                success: false,
                error: {
                    type: 'validation_error',
                    message: `Missing required configuration: ${missingKeys.join(', ')}`,
                    details: { missingKeys }
                }
            };
        }

        return { success: true, data: true };
    }

    /**
     * Resets to defaults
     */
    reset(): void {
        this.config = {
            tokenRefreshInterval: 540000,
            tokenExpiration: 3600000,
            maxRetries: 3,
            sessionTimeout: 1800000,
            maxConcurrentSessions: 5,
            maxLoginAttempts: 5,
            lockoutDuration: 900000,
            rateLimitWindow: 900000,
            rateLimitMaxAttempts: 5,
            mfaRequired: false,
            encryptionEnabled: true,
            auditEnabled: true,
            rateLimitingEnabled: true,
            defaultProvider: 'jwt',
            allowedProviders: ['jwt', 'oauth', 'saml'],
            logLevel: 'info',
            logRetentionDays: 30,
            environment: 'development',
            apiBaseUrl: 'http://localhost:3000',
            debugMode: true
        };

        // Clear all watchers
        this.watchers.clear();
    }

    /**
     * Watches for configuration changes
     */
    watch(key: string, callback: (value: any) => void): () => void {
        if (!this.watchers.has(key)) {
            this.watchers.set(key, []);
        }

        const keyWatchers = this.watchers.get(key)!;
        keyWatchers.push(callback);

        // Return unsubscribe function
        return () => {
            const index = keyWatchers.indexOf(callback);
            if (index > -1) {
                keyWatchers.splice(index, 1);
            }
        };
    }
}
