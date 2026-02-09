/**
 * Authentication Configuration Loader
 *
 * Loads and merges authentication configuration from multiple sources:
 * 1. Base configuration file
 * 2. Environment-specific configuration file
 * 3. Environment variables (highest priority)
 * 4. Runtime overrides
 */

import { AuthProviderType, AuthResult } from '../types/auth.domain.types';

import { EnvironmentAuthConfig, AUTH_ENV_VARS } from './EnvironmentAuthConfig';

import type { IAuthConfig } from '../interfaces/authInterfaces';

/**
 * Configuration file structure
 */
export interface AuthConfigFile {
    provider?: string;
    defaultProvider?: string;
    allowedProviders?: string[];

    featureFlags?: {
        mfaRequired?: boolean;
        encryptionEnabled?: boolean;
        auditEnabled?: boolean;
        rateLimitingEnabled?: boolean;
    };

    token?: {
        refreshInterval?: number;
        expiration?: number;
        maxRetries?: number;
    };

    session?: {
        timeout?: number;
        maxConcurrentSessions?: number;
    };

    security?: {
        maxLoginAttempts?: number;
        lockoutDuration?: number;
        rateLimitWindow?: number;
        rateLimitMaxAttempts?: number;
    };

    environment?: {
        name?: string;
        apiBaseUrl?: string;
        debugMode?: boolean;
    };

    logging?: {
        level?: string;
        retentionDays?: number;
    };

    [key: string]: unknown; // Allow for environment-specific sections
}

/**
 * Configuration loader options
 */
export interface ConfigLoaderOptions {
    /** Custom environment (overrides NODE_ENV) */
    environment?: string;

    /** Configuration directory path */
    configDir?: string;

    /** Custom environment variables */
    customEnv?: Record<string, string | undefined>;

    /** Enable environment variable overrides */
    enableEnvOverrides?: boolean;
}

/**
 * File-based authentication configuration
 */
class FileBasedAuthConfig implements IAuthConfig {
    readonly name = 'FileBasedAuthConfig';

    private config: AuthConfigFile;

    constructor(config: AuthConfigFile) {
        this.config = config;
    }

    get<T>(key: string): T {
        return this.config[key] as T;
    }

    set<T>(key: string, value: T): void {
        (this.config as any)[key] = value;
    }

    getAll(): Record<string, unknown> {
        return { ...this.config };
    }

    validate(): AuthResult<boolean> {
        return { success: true, data: true };
    }

    reset(): void {
        // No-op for file-based config
    }

    watch(_key: string, _callback: (value: unknown) => void): () => void {
        // No-op for file-based config
        return () => { };
    }

    updateConfig(newConfig: Partial<AuthConfigFile>): void {
        this.config = { ...this.config, ...newConfig };
    }
}

/**
 * Authentication configuration loader
 */
export class AuthConfigLoader {
    private readonly configDir: string;
    private readonly environment: string;
    private readonly customEnv: Record<string, string | undefined>;
    private readonly enableEnvOverrides: boolean;
    private readonly cachedConfigs: Map<string, AuthConfigFile> = new Map();

    constructor(options: ConfigLoaderOptions = {}) {
        this.configDir = options.configDir || '/config/auth';
        this.environment = options.environment || this.detectEnvironment();
        this.customEnv = options.customEnv ?? {};
        this.enableEnvOverrides = options.enableEnvOverrides !== false;
    }

    async loadConfiguration(): Promise<IAuthConfig> {
        try {
            const baseConfig = await this.loadConfigFile('auth.base.json');
            const envConfig = await this.loadConfigFile(`auth.${this.environment}.json`);
            const mergedConfig = this.mergeConfigurations(baseConfig, envConfig);

            if (this.enableEnvOverrides) {
                const envOverrides = this.loadEnvironmentOverrides();
                const finalConfig = this.applyEnvironmentOverrides(mergedConfig, envOverrides);
                return new FileBasedAuthConfig(finalConfig);
            }

            return new FileBasedAuthConfig(mergedConfig);
        } catch (error) {
            console.error('Failed to load authentication configuration:', error);

            if (this.enableEnvOverrides) {
                return new EnvironmentAuthConfig(this.customEnv);
            }

            throw new Error(`Authentication configuration loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private async loadConfigFile(filename: string): Promise<AuthConfigFile> {
        const cacheKey = filename;

        if (this.cachedConfigs.has(cacheKey)) {
            return this.cachedConfigs.get(cacheKey)!;
        }

        try {
            const config = await this.simulateFileLoad(filename);
            this.cachedConfigs.set(cacheKey, config);
            return config;
        } catch (error) {
            console.warn(`Configuration file ${filename} not found, using defaults`);
            return {};
        }
    }

    private async simulateFileLoad(filename: string): Promise<AuthConfigFile> {
        switch (filename) {
            case 'auth.base.json':
                return {
                    provider: 'jwt',
                    defaultProvider: 'jwt',
                    allowedProviders: ['jwt'],
                    featureFlags: {
                        mfaRequired: false,
                        encryptionEnabled: true,
                        auditEnabled: true,
                        rateLimitingEnabled: false
                    },
                    token: {
                        refreshInterval: 540000,
                        expiration: 3600000,
                        maxRetries: 3
                    },
                    session: {
                        timeout: 1800000,
                        maxConcurrentSessions: 5
                    },
                    security: {
                        maxLoginAttempts: 10,
                        lockoutDuration: 300000,
                        rateLimitWindow: 300000,
                        rateLimitMaxAttempts: 10
                    },
                    environment: {
                        name: 'development',
                        apiBaseUrl: 'http://localhost:3000',
                        debugMode: true
                    },
                    logging: {
                        level: 'debug',
                        retentionDays: 7
                    }
                };

            case 'auth.development.json':
                return {
                    provider: 'jwt',
                    defaultProvider: 'jwt',
                    allowedProviders: ['jwt', 'oauth'],
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
                        rateLimitMaxAttempts: 5
                    },
                    environment: {
                        name: 'development',
                        apiBaseUrl: 'http://localhost:3000',
                        debugMode: true
                    },
                    logging: {
                        level: 'info',
                        retentionDays: 30
                    }
                };

            case 'auth.staging.json':
                return {
                    provider: 'oauth',
                    defaultProvider: 'oauth',
                    allowedProviders: ['oauth', 'saml', 'jwt'],
                    featureFlags: {
                        mfaRequired: true,
                        encryptionEnabled: true,
                        auditEnabled: true,
                        rateLimitingEnabled: true
                    },
                    token: {
                        refreshInterval: 300000,
                        expiration: 1800000,
                        maxRetries: 2
                    },
                    session: {
                        timeout: 900000,
                        maxConcurrentSessions: 2
                    },
                    security: {
                        maxLoginAttempts: 3,
                        lockoutDuration: 1800000,
                        rateLimitWindow: 600000,
                        rateLimitMaxAttempts: 3
                    },
                    environment: {
                        name: 'staging',
                        apiBaseUrl: 'https://api-staging.quietspace.com',
                        debugMode: true
                    },
                    logging: {
                        level: 'info',
                        retentionDays: 14
                    }
                };

            case 'auth.production.json':
                return {
                    provider: 'saml',
                    defaultProvider: 'saml',
                    allowedProviders: ['saml', 'oauth', 'ldap'],
                    featureFlags: {
                        mfaRequired: true,
                        encryptionEnabled: true,
                        auditEnabled: true,
                        rateLimitingEnabled: true
                    },
                    token: {
                        refreshInterval: 240000,
                        expiration: 900000,
                        maxRetries: 1
                    },
                    session: {
                        timeout: 600000,
                        maxConcurrentSessions: 1
                    },
                    security: {
                        maxLoginAttempts: 3,
                        lockoutDuration: 3600000,
                        rateLimitWindow: 300000,
                        rateLimitMaxAttempts: 2
                    },
                    environment: {
                        name: 'production',
                        apiBaseUrl: 'https://api.quietspace.com',
                        debugMode: false
                    },
                    logging: {
                        level: 'warn',
                        retentionDays: 90
                    }
                };

            default:
                return {};
        }
    }

    private mergeConfigurations(...configs: AuthConfigFile[]): AuthConfigFile {
        return configs.reduce((merged: AuthConfigFile, config: AuthConfigFile): AuthConfigFile => {
            return this.deepMerge(merged, config) as AuthConfigFile;
        }, {} as AuthConfigFile);
    }

    private deepMerge(target: unknown, source: unknown): unknown {
        // Ensure target is an object for spread operation
        const targetObj = (target && typeof target === 'object' && !Array.isArray(target))
            ? target as Record<string, unknown>
            : {};

        // Ensure source is an object for iteration
        const sourceObj = (source && typeof source === 'object' && !Array.isArray(source))
            ? source as Record<string, unknown>
            : {};

        const result = { ...targetObj };

        for (const key in sourceObj) {
            if (sourceObj[key] && typeof sourceObj[key] === 'object' && !Array.isArray(sourceObj[key])) {
                result[key] = this.deepMerge(result[key] || {}, sourceObj[key]);
            } else {
                result[key] = sourceObj[key];
            }
        }

        return result;
    }

    private loadEnvironmentOverrides(): Record<string, unknown> {
        const env = this.customEnv || this.getEnvironmentVariables();

        return {
            provider: env[AUTH_ENV_VARS.DEFAULT_PROVIDER],
            defaultProvider: env[AUTH_ENV_VARS.DEFAULT_PROVIDER],
            allowedProviders: env[AUTH_ENV_VARS.ALLOWED_PROVIDERS]?.split(','),

            featureFlags: {
                mfaRequired: this.parseBoolean(env[AUTH_ENV_VARS.MFA_REQUIRED]),
                encryptionEnabled: this.parseBoolean(env[AUTH_ENV_VARS.ENCRYPTION_ENABLED]),
                auditEnabled: this.parseBoolean(env[AUTH_ENV_VARS.AUDIT_ENABLED]),
                rateLimitingEnabled: this.parseBoolean(env[AUTH_ENV_VARS.RATE_LIMITING_ENABLED])
            },

            token: {
                refreshInterval: this.parseNumber(env[AUTH_ENV_VARS.TOKEN_REFRESH_INTERVAL]),
                expiration: this.parseNumber(env[AUTH_ENV_VARS.TOKEN_EXPIRATION]),
                maxRetries: this.parseNumber(env[AUTH_ENV_VARS.MAX_RETRIES])
            },

            session: {
                timeout: this.parseNumber(env[AUTH_ENV_VARS.SESSION_TIMEOUT]),
                maxConcurrentSessions: this.parseNumber(env[AUTH_ENV_VARS.MAX_CONCURRENT_SESSIONS])
            },

            security: {
                maxLoginAttempts: this.parseNumber(env[AUTH_ENV_VARS.MAX_LOGIN_ATTEMPTS]),
                lockoutDuration: this.parseNumber(env[AUTH_ENV_VARS.LOCKOUT_DURATION]),
                rateLimitWindow: this.parseNumber(env[AUTH_ENV_VARS.RATE_LIMIT_WINDOW]),
                rateLimitMaxAttempts: this.parseNumber(env[AUTH_ENV_VARS.RATE_LIMIT_MAX_ATTEMPTS])
            },

            environment: {
                name: env[AUTH_ENV_VARS.ENVIRONMENT],
                apiBaseUrl: env[AUTH_ENV_VARS.API_BASE_URL],
                debugMode: this.parseBoolean(env[AUTH_ENV_VARS.DEBUG_MODE])
            },

            logging: {
                level: env[AUTH_ENV_VARS.LOG_LEVEL],
                retentionDays: this.parseNumber(env[AUTH_ENV_VARS.LOG_RETENTION_DAYS])
            }
        };
    }

    private applyEnvironmentOverrides(config: AuthConfigFile, overrides: Record<string, unknown>): AuthConfigFile {
        return this.deepMerge(config, overrides) as AuthConfigFile;
    }

    private detectEnvironment(): string {
        const env = this.getEnvironmentVariables();
        return env[AUTH_ENV_VARS.ENVIRONMENT] || env.NODE_ENV || 'development';
    }

    private getEnvironmentVariables(): Record<string, string | undefined> {
        if (typeof process !== 'undefined' && process.env) {
            return process.env;
        }

        // Type assertion to bypass TypeScript restriction
        const meta = (globalThis as any).import?.meta;
        if (meta?.env) {
            return meta.env as Record<string, string | undefined>;
        }

        return {};
    }

    private parseBoolean(value: string | undefined): boolean | undefined {
        if (value === undefined) {
            return undefined;
        }
        return value.toLowerCase() === 'true';
    }

    private parseNumber(value: string | undefined): number | undefined {
        if (value === undefined) {
            return undefined;
        }
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? undefined : parsed;
    }

    clearCache(): void {
        this.cachedConfigs.clear();
    }

    getEnvironment(): string {
        return this.environment;
    }
}

/**
 * Factory function to create auth configuration loader
 */
export function createAuthConfigLoader(options?: ConfigLoaderOptions): AuthConfigLoader {
    return new AuthConfigLoader(options);
}

/**
 * Utility function to load configuration with default options
 */
export async function loadAuthConfiguration(environment?: string): Promise<IAuthConfig> {
    const options: ConfigLoaderOptions = {};
    if (environment !== undefined) {
        options.environment = environment;
    }
    const loader = createAuthConfigLoader(options);
    return loader.loadConfiguration();
}

// Export FileBasedAuthConfig for external use
export { FileBasedAuthConfig };
