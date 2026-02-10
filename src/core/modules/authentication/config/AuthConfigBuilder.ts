/**
 * Authentication Configuration Builder
 *
 * Provides a fluent builder pattern for creating authentication
 * configurations from multiple sources while maintaining type safety.
 */

import { AuthProviderType, AuthErrorType, AuthResult } from '../types/auth.domain.types';

import type { IAuthConfig } from '../interfaces/authInterfaces';

/**
 * Configuration source types
 */
export type ConfigSource = 'environment' | 'file' | 'runtime' | 'defaults';

/**
 * Configuration builder for authentication
 */
export class AuthConfigBuilder {
    private config: Map<string, any> = new Map();
    private sources: ConfigSource[] = [];

    /**
     * Creates a new configuration builder
     */
    static create(): AuthConfigBuilder {
        return new AuthConfigBuilder();
    }

    /**
     * Adds environment configuration
     */
    withEnvironment(env?: string): this {
        this.sources.push('environment');

        // Default environment settings
        const envConfig = {
            provider: process.env.AUTH_PROVIDER || 'jwt',
            environment: env || process.env.NODE_ENV || 'development',
            debug: process.env.AUTH_DEBUG === 'true',
            logLevel: process.env.AUTH_LOG_LEVEL || 'info'
        };

        this.mergeConfig(envConfig);
        return this;
    }

    /**
     * Adds configuration from file
     */
    withFile(path: string): this {
        this.sources.push('file');

        try {
            // In real implementation, this would load from file
            // For now, use default file config
            const fileConfig = {
                provider: 'jwt',
                defaultProvider: 'jwt',
                allowedProviders: ['jwt', 'oauth', 'saml', 'ldap', 'session'],
                featureFlags: {
                    mfaRequired: false,
                    encryptionEnabled: true,
                    auditEnabled: true,
                    rateLimitingEnabled: true
                },
                token: {
                    refreshInterval: 540000,
                    expiration: 3600000,
                    maxRetries: 3
                },
                session: {
                    timeout: 1800000,
                    maxConcurrentSessions: 3
                },
                security: {
                    maxLoginAttempts: 5,
                    lockoutDuration: 900000,
                    rateLimitWindow: 900000,
                    rateLimitMaxAttempts: 10
                }
            };

            this.mergeConfig(fileConfig);
        } catch (error) {
            console.warn(`Failed to load config from ${path}:`, error);
        }

        return this;
    }

    /**
     * Adds runtime configuration overrides
     */
    withRuntime(overrides: Record<string, any>): this {
        this.sources.push('runtime');
        this.mergeConfig(overrides);
        return this;
    }

    /**
     * Adds default configuration
     */
    withDefaults(): this {
        this.sources.push('defaults');

        const defaultConfig = {
            provider: 'jwt',
            environment: 'development',
            debug: false,
            logLevel: 'info',
            featureFlags: {
                mfaRequired: false,
                encryptionEnabled: true,
                auditEnabled: false,
                rateLimitingEnabled: true
            },
            token: {
                refreshInterval: 540000,
                expiration: 3600000,
                maxRetries: 3
            },
            session: {
                timeout: 1800000,
                maxConcurrentSessions: 1
            },
            security: {
                maxLoginAttempts: 5,
                lockoutDuration: 900000,
                rateLimitWindow: 900000,
                rateLimitMaxAttempts: 10
            }
        };

        this.mergeConfig(defaultConfig);
        return this;
    }

    /**
     * Sets provider configuration
     */
    withProvider(provider: AuthProviderType): this {
        this.config.set('provider', provider);
        return this;
    }

    /**
     * Sets feature flags
     */
    withFeatureFlags(flags: Record<string, boolean>): this {
        const currentFlags = this.config.get('featureFlags') || {};
        this.config.set('featureFlags', { ...currentFlags, ...flags });
        return this;
    }

    /**
     * Sets token configuration
     */
    withTokenConfig(tokenConfig: Record<string, any>): this {
        const currentToken = this.config.get('token') || {};
        this.config.set('token', { ...currentToken, ...tokenConfig });
        return this;
    }

    /**
     * Sets session configuration
     */
    withSessionConfig(sessionConfig: Record<string, any>): this {
        const currentSession = this.config.get('session') || {};
        this.config.set('session', { ...currentSession, ...sessionConfig });
        return this;
    }

    /**
     * Sets security configuration
     */
    withSecurityConfig(securityConfig: Record<string, any>): this {
        const currentSecurity = this.config.get('security') || {};
        this.config.set('security', { ...currentSecurity, ...securityConfig });
        return this;
    }

    /**
     * Adds custom configuration section
     */
    withSection(section: string, config: Record<string, any>): this {
        const current = this.config.get(section) || {};
        this.config.set(section, { ...current, ...config });
        return this;
    }

    /**
     * Validates configuration
     */
    validate(): AuthResult<boolean> {
        const errors: string[] = [];

        // Validate required fields
        if (!this.config.get('provider')) {
            errors.push('Provider is required');
        }

        const provider = this.config.get('provider');
        const allowedProviders = this.config.get('allowedProviders') || ['jwt'];

        if (!allowedProviders.includes(provider)) {
            errors.push(`Provider '${provider}' is not in allowed providers: ${allowedProviders.join(', ')}`);
        }

        // Validate token configuration
        const tokenConfig = this.config.get('token') || {};
        if (tokenConfig.refreshInterval && tokenConfig.refreshInterval < 60000) {
            errors.push('Token refresh interval must be at least 60 seconds');
        }

        if (tokenConfig.expiration && tokenConfig.expiration < 300000) {
            errors.push('Token expiration must be at least 5 minutes');
        }

        // Validate session configuration
        const sessionConfig = this.config.get('session') || {};
        if (sessionConfig.timeout && sessionConfig.timeout < 60000) {
            errors.push('Session timeout must be at least 60 seconds');
        }

        // Validate security configuration
        const securityConfig = this.config.get('security') || {};
        if (securityConfig.maxLoginAttempts && securityConfig.maxLoginAttempts < 1) {
            errors.push('Max login attempts must be at least 1');
        }

        if (securityConfig.lockoutDuration && securityConfig.lockoutDuration < 60000) {
            errors.push('Lockout duration must be at least 60 seconds');
        }

        return {
            success: errors.length === 0,
            data: errors.length === 0,
            error: errors.length > 0 ? {
                type: 'validation_error' as AuthErrorType,
                message: errors.join('; '),
                code: 'CONFIG_VALIDATION_FAILED' as const
            } : undefined
        };
    }

    /**
     * Builds the final configuration
     */
    build(): IAuthConfig {
        const validation = this.validate();

        if (!validation.success) {
            throw new Error(`Configuration validation failed: ${validation.error?.message}`);
        }

        return new AuthConfigImpl(this.config, this.sources);
    }

    /**
     * Gets current configuration (for debugging)
     */
    getCurrent(): Record<string, any> {
        const result: Record<string, any> = {};
        this.config.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }

    /**
     * Gets configuration sources used
     */
    getSources(): ConfigSource[] {
        return [...this.sources];
    }

    /**
     * Merges configuration object
     */
    private mergeConfig(config: Record<string, any>): void {
        Object.entries(config).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                const current = this.config.get(key) || {};
                this.config.set(key, { ...current, ...value });
            } else {
                this.config.set(key, value);
            }
        });
    }
}

/**
 * Authentication configuration implementation
 */
class AuthConfigImpl implements IAuthConfig {
    private config: Map<string, any>;
    private sources: ConfigSource[];

    constructor(config: Map<string, any>, sources: ConfigSource[]) {
        this.config = new Map(config);
        this.sources = sources;
    }

    get<T>(key: string): T {
        return this.config.get(key) as T;
    }

    set<T>(key: string, value: T): void {
        this.config.set(key, value);
    }

    getAll(): Record<string, unknown> {
        const result: Record<string, unknown> = {};
        this.config.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }

    validate(): AuthResult<boolean> {
        const errors: string[] = [];

        // Basic validation
        if (!this.config.has('provider')) {
            errors.push('Provider is required');
        }

        return {
            success: errors.length === 0,
            data: errors.length === 0,
            error: errors.length > 0 ? {
                type: 'validation_error' as AuthErrorType,
                message: errors.join('; '),
                code: 'CONFIG_VALIDATION_FAILED' as const
            } : undefined
        };
    }

    reset(): void {
        this.config.clear();
    }

    watch(key: string, callback: (value: unknown) => void): () => void {
        // Simple implementation - in real scenario would use proper watchers
        let lastValue = this.config.get(key);

        const interval = setInterval(() => {
            const currentValue = this.config.get(key);
            if (currentValue !== lastValue) {
                lastValue = currentValue;
                callback(currentValue);
            }
        }, 1000);

        return () => clearInterval(interval);
    }

    getSources(): ConfigSource[] {
        return [...this.sources];
    }
}

/**
 * Convenience function for creating configuration with common defaults
 */
export function createDefaultAuthConfig(): IAuthConfig {
    return AuthConfigBuilder.create()
        .withDefaults()
        .withEnvironment()
        .build();
}

/**
 * Convenience function for creating environment-specific configuration
 */
export function createEnvironmentAuthConfig(env?: string): IAuthConfig {
    return AuthConfigBuilder.create()
        .withDefaults()
        .withEnvironment(env)
        .build();
}

/**
 * Convenience function for creating configuration from file
 */
export function createFileAuthConfig(path: string): IAuthConfig {
    return AuthConfigBuilder.create()
        .withDefaults()
        .withFile(path)
        .withEnvironment()
        .build();
}
