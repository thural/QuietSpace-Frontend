/**
 * Environment-based Authentication Configuration
 *
 * Provides configuration values from environment variables with
 * type safety, validation, and sensible defaults.
 *
 * Supports both Node.js (process.env) and browser (import.meta.env) environments.
 */

import { AuthProviderType, AuthErrorType } from '../types/auth.domain.types';

/**
 * Import meta interface for Vite environment
 */
interface ImportMeta {
    env?: Record<string, string | undefined>;
}

import type { IAuthConfig, AuthResult } from '../interfaces/authInterfaces';

/**
 * Environment variable names for authentication configuration
 */
export const AUTH_ENV_VARS = {
    // Provider configuration
    DEFAULT_PROVIDER: 'AUTH_DEFAULT_PROVIDER',
    ALLOWED_PROVIDERS: 'AUTH_ALLOWED_PROVIDERS',

    // Feature flags
    MFA_REQUIRED: 'AUTH_MFA_REQUIRED',
    ENCRYPTION_ENABLED: 'AUTH_ENCRYPTION_ENABLED',
    AUDIT_ENABLED: 'AUTH_AUDIT_ENABLED',
    RATE_LIMITING_ENABLED: 'AUTH_RATE_LIMITING_ENABLED',

    // Token configuration
    TOKEN_REFRESH_INTERVAL: 'AUTH_TOKEN_REFRESH_INTERVAL',
    TOKEN_EXPIRATION: 'AUTH_TOKEN_EXPIRATION',
    MAX_RETRIES: 'AUTH_MAX_RETRIES',

    // Session configuration
    SESSION_TIMEOUT: 'AUTH_SESSION_TIMEOUT',
    MAX_CONCURRENT_SESSIONS: 'AUTH_MAX_CONCURRENT_SESSIONS',

    // Security configuration
    MAX_LOGIN_ATTEMPTS: 'AUTH_MAX_LOGIN_ATTEMPTS',
    LOCKOUT_DURATION: 'AUTH_LOCKOUT_DURATION',
    RATE_LIMIT_WINDOW: 'AUTH_RATE_LIMIT_WINDOW',
    RATE_LIMIT_MAX_ATTEMPTS: 'AUTH_RATE_LIMIT_MAX_ATTEMPTS',

    // Environment settings
    ENVIRONMENT: 'NODE_ENV',
    API_BASE_URL: 'API_BASE_URL',
    DEBUG_MODE: 'AUTH_DEBUG_MODE',

    // Logging configuration
    LOG_LEVEL: 'AUTH_LOG_LEVEL',
    LOG_RETENTION_DAYS: 'AUTH_LOG_RETENTION_DAYS'
} as const;

/**
 * Environment-based authentication configuration
 */
// Internal configuration interface for type safety
interface EnvironmentConfig {
    provider: string;
    allowedProviders: string[];
    tokenRefreshInterval: number;
    [key: string]: unknown;
}

export class EnvironmentAuthConfig implements IAuthConfig {
    readonly name = 'EnvironmentAuthConfig';

    private config: EnvironmentConfig;
    private readonly watchers: Map<string, ((value: unknown) => void)[]> = new Map();

    constructor(customEnv?: Record<string, string | undefined>) {
        this.config = this.loadConfiguration(customEnv);
        this.validateConfiguration();
    }

    /**
     * Gets configuration value by key
     */
    get<T>(key: string): T {
        return this.config[key] as T;
    }

    /**
     * Sets configuration value and notifies watchers
     */
    set<T>(key: string, value: T): void {
        this.config[key] = value;
        this.notifyWatchers(key, value);
    }

    /**
     * Gets all configuration as object
     */
    getAll(): Record<string, unknown> {
        return { ...this.config };
    }

    /**
     * Validates configuration values
     */
    validate(): AuthResult<boolean> {
        return this.validateConfiguration();
    }

    /**
     * Resets configuration to environment defaults
     */
    reset(): void {
        this.config = this.loadConfiguration();
        this.notifyAllWatchers();
    }

    /**
     * Watches for configuration changes
     */
    watch(key: string, callback: (value: unknown) => void): () => void {
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

    /**
     * Loads configuration from environment variables
     */
    private loadConfiguration(customEnv?: Record<string, string | undefined>): EnvironmentConfig {
        const env = customEnv || this.getEnvironmentVariables();

        return {
            // Provider configuration
            provider: this.parseAuthProvider(env[AUTH_ENV_VARS.DEFAULT_PROVIDER] || 'jwt'),
            defaultProvider: env[AUTH_ENV_VARS.DEFAULT_PROVIDER] || 'jwt',
            allowedProviders: this.parseAllowedProviders(env[AUTH_ENV_VARS.ALLOWED_PROVIDERS] || 'jwt,oauth,saml'),

            // Feature flags
            mfaRequired: this.parseBoolean(env[AUTH_ENV_VARS.MFA_REQUIRED], false),
            encryptionEnabled: this.parseBoolean(env[AUTH_ENV_VARS.ENCRYPTION_ENABLED], true),
            auditEnabled: this.parseBoolean(env[AUTH_ENV_VARS.AUDIT_ENABLED], true),
            rateLimitingEnabled: this.parseBoolean(env[AUTH_ENV_VARS.RATE_LIMITING_ENABLED], true),

            // Token configuration
            tokenRefreshInterval: this.parseNumber(env[AUTH_ENV_VARS.TOKEN_REFRESH_INTERVAL], 540000),
            tokenExpiration: this.parseNumber(env[AUTH_ENV_VARS.TOKEN_EXPIRATION], 3600000),
            maxRetries: this.parseNumber(env[AUTH_ENV_VARS.MAX_RETRIES], 3),

            // Session configuration
            sessionTimeout: this.parseNumber(env[AUTH_ENV_VARS.SESSION_TIMEOUT], 1800000),
            maxConcurrentSessions: this.parseNumber(env[AUTH_ENV_VARS.MAX_CONCURRENT_SESSIONS], 5),

            // Security configuration
            maxLoginAttempts: this.parseNumber(env[AUTH_ENV_VARS.MAX_LOGIN_ATTEMPTS], 5),
            lockoutDuration: this.parseNumber(env[AUTH_ENV_VARS.LOCKOUT_DURATION], 900000),
            rateLimitWindow: this.parseNumber(env[AUTH_ENV_VARS.RATE_LIMIT_WINDOW], 900000),
            rateLimitMaxAttempts: this.parseNumber(env[AUTH_ENV_VARS.RATE_LIMIT_MAX_ATTEMPTS], 5),

            // Environment settings
            environment: env[AUTH_ENV_VARS.ENVIRONMENT] || 'development',
            apiBaseUrl: env[AUTH_ENV_VARS.API_BASE_URL] || 'http://localhost:3000',
            debugMode: this.parseBoolean(env[AUTH_ENV_VARS.DEBUG_MODE], true),

            // Logging configuration
            logLevel: env[AUTH_ENV_VARS.LOG_LEVEL] || 'info',
            logRetentionDays: this.parseNumber(env[AUTH_ENV_VARS.LOG_RETENTION_DAYS], 30)
        };
    }

    /**
     * Gets environment variables (Node.js or browser)
     */
    private getEnvironmentVariables(): Record<string, string | undefined> {
        // Check if we're in Node.js environment
        if (typeof process !== 'undefined' && process.env) {
            return process.env;
        }

        // Check if we're in browser environment with Vite
        if (typeof import.meta !== 'undefined' && import.meta.env) {
            return import.meta.env as Record<string, string | undefined>;
        }

        // Fallback for Jest/test environment
        if (typeof global !== 'undefined' && (global as any).import && (global as any).import.meta) {
            return (global as any).import.meta.env || {};
        }

        // Fallback to empty object
        return {};
    }

    /**
     * Parses authentication provider type
     */
    private parseAuthProvider(provider: string): AuthProviderType {
        const normalizedProvider = provider.toLowerCase();

        switch (normalizedProvider) {
            case 'jwt':
                return AuthProviderType.JWT;
            case 'oauth':
                return AuthProviderType.OAUTH;
            case 'saml':
                return AuthProviderType.SAML;
            case 'ldap':
                return AuthProviderType.LDAP;
            case 'api_key':
                return AuthProviderType.API_KEY;
            default:
                console.warn(`Unknown auth provider: ${provider}, falling back to JWT`);
                return AuthProviderType.JWT;
        }
    }

    /**
     * Parses allowed providers from comma-separated string
     */
    private parseAllowedProviders(providers: string): AuthProviderType[] {
        return providers
            .split(',')
            .map(p => p.trim().toLowerCase())
            .filter(p => p.length > 0)
            .map(p => this.parseAuthProvider(p));
    }

    /**
     * Parses boolean value from string
     */
    private parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
        if (value === undefined) return defaultValue;
        return value.toLowerCase() === 'true';
    }

    /**
     * Parses number value from string
     */
    private parseNumber(value: string | undefined, defaultValue: number): number {
        if (value === undefined) return defaultValue;
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    /**
     * Validates configuration values
     */
    private validateConfiguration(): AuthResult<boolean> {
        const requiredKeys = [
            'provider',
            'defaultProvider',
            'allowedProviders',
            'tokenRefreshInterval',
            'tokenExpiration',
            'sessionTimeout',
            'maxLoginAttempts',
            'lockoutDuration',
            'rateLimitWindow',
            'rateLimitMaxAttempts'
        ];

        const missingKeys = requiredKeys.filter(key => !(key in this.config));

        if (missingKeys.length > 0) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.VALIDATION_ERROR,
                    message: `Missing required configuration: ${missingKeys.join(', ')}`,
                    details: { missingKeys: missingKeys as unknown }
                } as const
            };
        }

        // Validate provider is in allowed providers
        if (!this.config.allowedProviders || !Array.isArray(this.config.allowedProviders)) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.VALIDATION_ERROR,
                    message: 'allowedProviders must be an array',
                    details: { allowedProviders: this.config.allowedProviders as unknown }
                } as const
            };
        }

        // Validate provider is in allowed providers
        if (!this.config.allowedProviders.includes(this.config.provider)) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.VALIDATION_ERROR,
                    message: `Provider ${this.config.provider} is not in allowed providers: ${this.config.allowedProviders.join(', ')}`,
                    details: {
                        provider: this.config.provider as unknown,
                        allowedProviders: this.config.allowedProviders as unknown
                    }
                } as const
            };
        }

        // Validate numeric ranges
        if (this.config.tokenRefreshInterval && this.config.tokenRefreshInterval <= 0) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.VALIDATION_ERROR,
                    message: 'tokenRefreshInterval must be greater than 0',
                    details: { tokenRefreshInterval: this.config.tokenRefreshInterval as unknown }
                } as const
            };
        }

        return { success: true, data: true };
    }

    /**
     * Notifies watchers of configuration changes
     */
    private notifyWatchers(key: string, value: unknown): void {
        const keyWatchers = this.watchers.get(key);
        if (keyWatchers) {
            keyWatchers.forEach(callback => callback(value));
        }
    }

    /**
     * Notifies all watchers of all configuration changes
     */
    private notifyAllWatchers(): void {
        Object.entries(this.config).forEach(([key, value]) => {
            this.notifyWatchers(key, value);
        });
    }
}

/**
 * Factory function to create environment-based auth configuration
 */
export function createEnvironmentAuthConfig(customEnv?: Record<string, string | undefined>): EnvironmentAuthConfig {
    return new EnvironmentAuthConfig(customEnv);
}

/**
 * Safely access import.meta.env properties
 */
function getImportMetaEnvProperty(property: string): string | undefined {
    if (typeof import.meta !== 'undefined' && (import.meta as unknown as Record<string, unknown>).env) {
        const env = (import.meta as unknown as Record<string, unknown>).env;
        if (env && typeof env === 'object' && env !== null && property in env) {
            return String((env as Record<string, unknown>)[property]);
        }
        return undefined;
    }

    // Fallback for Jest/test environment
    if (typeof global !== 'undefined' && (global as any).import && (global as any).import.meta) {
        const env = (global as any).import.meta.env;
        if (env && typeof env === 'object' && env !== null && property in env) {
            return String(env[property]);
        }
        return undefined;
    }

    return undefined;
}

/**
 * Utility function to get current environment
 */
export function getCurrentEnvironment(): string {
    const env = typeof process !== 'undefined' && process.env
        ? process.env.NODE_ENV || 'development'
        : getImportMetaEnvProperty('MODE') || 'development';

    return env;
}
