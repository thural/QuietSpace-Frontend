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
        const errors: string[] = [];

        // Validate required fields
        if (!this.config.provider) {
            errors.push('Provider is required');
        }

        const provider = this.config.provider;
        const allowedProviders = this.config.allowedProviders || [];

        if (!allowedProviders.includes(provider)) {
            errors.push(`Provider '${provider}' is not in allowed providers: ${allowedProviders.join(', ')}`);
        }

        // Validate token configuration
        const tokenConfig = this.config.token || {};
        if (tokenConfig.refreshInterval && tokenConfig.refreshInterval < 60000) {
            errors.push('Token refresh interval must be at least 60 seconds');
        }

        if (tokenConfig.expiration && tokenConfig.expiration < 300000) {
            errors.push('Token expiration must be at least 5 minutes');
        }

        // Validate session configuration
        const sessionConfig = this.config.session || {};
        if (sessionConfig.timeout && sessionConfig.timeout < 60000) {
            errors.push('Session timeout must be at least 60 seconds');
        }

        // Validate security configuration
        const securityConfig = this.config.security || {};
        if (securityConfig.maxLoginAttempts && securityConfig.maxLoginAttempts < 1) {
            errors.push('Max login attempts must be at least 1');
        }

        if (securityConfig.lockoutDuration && securityConfig.lockoutDuration < 60000) {
            errors.push('Lockout duration must be at least 60 seconds');
        }

        if (securityConfig.rateLimitWindow && securityConfig.rateLimitWindow < 60000) {
            errors.push('Rate limit window must be at least 60 seconds');
        }

        if (securityConfig.rateLimitMaxAttempts && securityConfig.rateLimitMaxAttempts < 1) {
            errors.push('Rate limit max attempts must be at least 1');
        }

        return {
            success: errors.length === 0,
            data: errors.length === 0,
            error: errors.length > 0 ? {
                type: 'validation_error',
                message: errors.join('; '),
                code: 'CONFIG_VALIDATION_FAILED'
            } : undefined
        };
    }

    reset(): void {
        this.config = {};
    }

    watch(key: string, callback: (value: unknown) => void): () => void {
        // Simple implementation - in real scenario would use proper watchers
        let lastValue = this.config[key];

        const interval = setInterval(() => {
            const currentValue = this.config[key];
            if (currentValue !== lastValue) {
                lastValue = currentValue;
                callback(currentValue);
            }
        }, 1000);

        return () => clearInterval(interval);
    }

    getSources(): string[] {
        return ['file'];
    }
}

/**
 * Main configuration loader function
 */
export async function loadAuthConfiguration(options?: ConfigLoaderOptions): Promise<IAuthConfig> {
    try {
        // Load base configuration
        const baseConfig: AuthConfigFile = {
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
                refreshInterval: 540000, // 9 minutes
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

        // Load environment-specific configuration
        let envConfig: Partial<AuthConfigFile> = {};
        if (options?.environment) {
            const envAuthConfig = new EnvironmentAuthConfig();
            envConfig = await envAuthConfig.load();
            envConfig = envAuthConfig.getConfiguration();

            envConfig = {
                environment: envConfig.environment,
                ...envConfig
            };
        }

        // Load file-based configuration
        let fileConfig: Partial<AuthConfigFile> = {};
        if (options?.configDir) {
            fileConfig = await loadConfigurationFile(options.configDir + '/auth.base.json');
            fileConfig = await loadConfigurationFile(options.configDir + '/auth.' + (envConfig.environment || 'development') + '.json');
        }

        // Merge configurations
        const mergedConfig = {
            ...baseConfig,
            ...envConfig,
            ...fileConfig
        };

        // Apply runtime overrides
        if (options?.customEnv) {
            Object.assign(mergedConfig, options.customEnv);
        }

        // Apply environment variable overrides if enabled
        if (options?.enableEnvOverrides !== false) {
            // Apply environment variables
            mergedConfig.provider = process.env.AUTH_PROVIDER || mergedConfig.provider;
            mergedConfig.defaultProvider = process.env.AUTH_DEFAULT_PROVIDER || mergedConfig.defaultProvider;

            // Apply other environment variables
            if (process.env.AUTH_DEBUG) {
                mergedConfig.environment = mergedConfig.environment || process.env.NODE_ENV;
                mergedConfig.debugMode = true;
            }
        }

        // Create and return configuration instance
        return new FileBasedAuthConfig(mergedConfig);

    } catch (error) {
        console.error('Failed to load authentication configuration:', error);

        // Return default configuration on error
        return new FileBasedAuthConfig(baseConfig);
    }
}

/**
 * Loads configuration from JSON file
 */
async function loadConfigurationFile(filePath: string): Promise<AuthConfigFile> {
    try {
        // In real implementation, this would use fs/promises
        // For now, return mock configuration based on environment
        const isProduction = process.env.NODE_ENV === 'production';

        if (filePath.includes('staging')) {
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
                    name: 'staging',
                    apiBaseUrl: 'https://api-staging.quietspace.com',
                    debugMode: true
                },
                logging: {
                    level: 'info',
                    retentionDays: 14
                }
            };
        }

        if (filePath.includes('production')) {
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
        }

        // Default mock configuration
        return {
            provider: 'jwt',
            defaultProvider: 'jwt',
            allowedProviders: ['jwt', 'oauth', 'saml', 'ldap', 'session']
        };

    } catch (error) {
        console.error(`Failed to load configuration from ${filePath}:`, error);
        throw error;
    }
}

// Type assertion to bypass TypeScript restriction
const meta = (globalThis as any).import?.meta;
if (meta?.env) {
    // ... rest of the code remains the same ...
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
