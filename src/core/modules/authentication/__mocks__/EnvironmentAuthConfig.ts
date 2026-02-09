/**
 * Mock for EnvironmentAuthConfig to avoid import.meta issues in Jest
 */


export const EnvironmentAuthConfig = class {
    private customEnv: Record<string, string | undefined>;

    constructor(customEnv?: Record<string, string | undefined>) {
        this.customEnv = customEnv || {};
    }

    getAll() {
        const baseConfig = {
            environment: 'test',
            debug: true,
            providers: ['jwt', 'oauth', 'saml'],
            defaultProvider: 'jwt',
            allowedProviders: 'jwt,oauth,saml',

            // Feature flags
            mfaRequired: false,
            encryptionEnabled: true,
            auditEnabled: true,
            rateLimitingEnabled: true,

            // Token configuration
            tokenRefreshInterval: 540000,
            tokenExpiration: 3600000,
            maxRetries: 3,

            // Session configuration
            sessionTimeout: 1800000,
            maxConcurrentSessions: 5,

            // Security configuration
            bcryptRounds: 12,
            jwtSecret: 'test-jwt-secret',
            encryptionKey: 'test-encryption-key',

            // Logging configuration
            logLevel: 'info',
            enableMetrics: true,

            // API configuration
            apiTimeout: 5000,
            retryAttempts: 3,
            retryDelay: 1000,
        };

        // Override with custom environment values if provided
        if (this.customEnv) {
            return {
                ...baseConfig,
                environment: this.customEnv.AUTH_ENVIRONMENT || baseConfig.environment,
                debug: this.customEnv.AUTH_DEBUG === 'true' || baseConfig.debug,
                providers: this.customEnv.AUTH_PROVIDERS?.split(',') || baseConfig.providers,
                defaultProvider: this.customEnv.AUTH_DEFAULT_PROVIDER || baseConfig.defaultProvider,
                allowedProviders: this.customEnv.AUTH_ALLOWED_PROVIDERS || baseConfig.allowedProviders,
                mfaRequired: this.customEnv.AUTH_MFA_REQUIRED === 'true' || baseConfig.mfaRequired,
                encryptionEnabled: this.customEnv.AUTH_ENCRYPTION_ENABLED !== 'false' && baseConfig.encryptionEnabled,
                auditEnabled: this.customEnv.AUTH_AUDIT_ENABLED !== 'false' && baseConfig.auditEnabled,
                rateLimitingEnabled: this.customEnv.AUTH_RATE_LIMITING_ENABLED !== 'false' && baseConfig.rateLimitingEnabled,
                tokenRefreshInterval: parseInt(this.customEnv.AUTH_TOKEN_REFRESH_INTERVAL || '') || baseConfig.tokenRefreshInterval,
                tokenExpiration: parseInt(this.customEnv.AUTH_TOKEN_EXPIRATION || '') || baseConfig.tokenExpiration,
                maxRetries: parseInt(this.customEnv.AUTH_MAX_RETRIES || '') || baseConfig.maxRetries,
                sessionTimeout: parseInt(this.customEnv.AUTH_SESSION_TIMEOUT || '') || baseConfig.sessionTimeout,
                maxConcurrentSessions: parseInt(this.customEnv.AUTH_MAX_CONCURRENT_SESSIONS || '') || baseConfig.maxConcurrentSessions,
                bcryptRounds: parseInt(this.customEnv.AUTH_BCRYPT_ROUNDS || '') || baseConfig.bcryptRounds,
                jwtSecret: this.customEnv.AUTH_JWT_SECRET || baseConfig.jwtSecret,
                encryptionKey: this.customEnv.AUTH_ENCRYPTION_KEY || baseConfig.encryptionKey,
                logLevel: this.customEnv.AUTH_LOG_LEVEL || baseConfig.logLevel,
                enableMetrics: this.customEnv.AUTH_ENABLE_METRICS !== 'false' && baseConfig.enableMetrics,
                apiTimeout: parseInt(this.customEnv.AUTH_API_TIMEOUT || '') || baseConfig.apiTimeout,
                retryAttempts: parseInt(this.customEnv.AUTH_RETRY_ATTEMPTS || '') || baseConfig.retryAttempts,
                retryDelay: parseInt(this.customEnv.AUTH_RETRY_DELAY || '') || baseConfig.retryDelay,
            };
        }

        return baseConfig;
    }

    get(key: string) {
        const config = this.getAll();
        return config[key as keyof typeof config];
    }
};

export const createEnvironmentAuthConfig = (customEnv?: Record<string, string | undefined>) => {
    return new EnvironmentAuthConfig(customEnv);
};

export const AUTH_ENV_VARS = {
    ENVIRONMENT: 'AUTH_ENVIRONMENT',
    DEBUG: 'AUTH_DEBUG',
    PROVIDERS: 'AUTH_PROVIDERS',
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
    BCRYPT_ROUNDS: 'AUTH_BCRYPT_ROUNDS',
    JWT_SECRET: 'AUTH_JWT_SECRET',
    ENCRYPTION_KEY: 'AUTH_ENCRYPTION_KEY',

    // Logging configuration
    LOG_LEVEL: 'AUTH_LOG_LEVEL',
    ENABLE_METRICS: 'AUTH_ENABLE_METRICS',

    // API configuration
    API_TIMEOUT: 'AUTH_API_TIMEOUT',
    RETRY_ATTEMPTS: 'AUTH_RETRY_ATTEMPTS',
    RETRY_DELAY: 'AUTH_RETRY_DELAY',
};
