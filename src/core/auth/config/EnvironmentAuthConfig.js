/**
 * Environment-based Authentication Configuration
 * 
 * Provides configuration values from environment variables with
 * type safety, validation, and sensible defaults.
 * 
 * Supports both Node.js (process.env) and browser (import.meta.env) environments.
 */

import { AuthProviderType } from '../types/auth.domain.types.js';

/**
 * Environment variable names for authentication configuration
 */
export const AUTH_ENV_VARS = Object.freeze({
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
});

/**
 * Environment-based authentication configuration
 */
export class EnvironmentAuthConfig {
    /** @type {string} */
    name = 'EnvironmentAuthConfig';

    /** @type {Record<string, any>} */
    #config;
    /** @type {Map} */
    #watchers = new Map();

    /**
     * @param {Record<string, string|undefined>} [customEnv] 
     */
    constructor(customEnv) {
        this.#config = this.#loadConfiguration(customEnv);
        this.#validateConfiguration();
    }

    /**
     * Gets configuration value by key
     * @template T
     * @param {string} key 
     * @returns {T} Configuration value
     */
    get(key) {
        return this.#config[key];
    }

    /**
     * Sets configuration value and notifies watchers
     * @template T
     * @param {string} key 
     * @param {T} value 
     * @returns {void}
     */
    set(key, value) {
        this.#config[key] = value;
        this.#notifyWatchers(key, value);
    }

    /**
     * Watches for configuration changes
     * @param {string} key 
     * @param {Function} callback 
     * @returns {Function} Unwatch function
     */
    watch(key, callback) {
        if (!this.#watchers.has(key)) {
            this.#watchers.set(key, []);
        }
        
        this.#watchers.get(key).push(callback);
        
        // Return unwatch function
        return () => {
            const callbacks = this.#watchers.get(key);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        };
    }

    /**
     * Gets all configuration values
     * @returns {Record<string, any>} All configuration
     */
    getAll() {
        return { ...this.#config };
    }

    /**
     * Loads configuration from environment
     * @param {Record<string, string|undefined>} [customEnv] 
     * @returns {Record<string, any>} Loaded configuration
     */
    loadFromEnvironment(customEnv) {
        this.#config = this.#loadConfiguration(customEnv);
        this.#validateConfiguration();
        return this.#config;
    }

    /**
     * Reloads configuration from environment
     * @returns {Record<string, any>} Reloaded configuration
     */
    reload() {
        return this.loadFromEnvironment();
    }

    /**
     * Gets provider configuration
     * @returns {Object} Provider configuration
     */
    getProviderConfig() {
        return {
            defaultProvider: this.get('defaultProvider'),
            allowedProviders: this.get('allowedProviders')
        };
    }

    /**
     * Gets feature flags
     * @returns {Object} Feature flags
     */
    getFeatureFlags() {
        return {
            mfaRequired: this.get('mfaRequired'),
            encryptionEnabled: this.get('encryptionEnabled'),
            auditEnabled: this.get('auditEnabled'),
            rateLimitingEnabled: this.get('rateLimitingEnabled')
        };
    }

    /**
     * Gets token configuration
     * @returns {Object} Token configuration
     */
    getTokenConfig() {
        return {
            refreshInterval: this.get('tokenRefreshInterval'),
            expiration: this.get('tokenExpiration'),
            maxRetries: this.get('maxRetries')
        };
    }

    /**
     * Gets session configuration
     * @returns {Object} Session configuration
     */
    getSessionConfig() {
        return {
            timeout: this.get('sessionTimeout'),
            maxConcurrentSessions: this.get('maxConcurrentSessions')
        };
    }

    /**
     * Gets security configuration
     * @returns {Object} Security configuration
     */
    getSecurityConfig() {
        return {
            maxLoginAttempts: this.get('maxLoginAttempts'),
            lockoutDuration: this.get('lockoutDuration'),
            rateLimitWindow: this.get('rateLimitWindow'),
            rateLimitMaxAttempts: this.get('rateLimitMaxAttempts')
        };
    }

    /**
     * Gets environment configuration
     * @returns {Object} Environment configuration
     */
    getEnvironmentConfig() {
        return {
            environment: this.get('environment'),
            apiBaseUrl: this.get('apiBaseUrl'),
            debugMode: this.get('debugMode')
        };
    }

    /**
     * Gets logging configuration
     * @returns {Object} Logging configuration
     */
    getLoggingConfig() {
        return {
            level: this.get('logLevel'),
            retentionDays: this.get('logRetentionDays')
        };
    }

    /**
     * Loads configuration from environment variables
     * @param {Record<string, string|undefined>} [customEnv] 
     * @returns {Record<string, any>} Loaded configuration
     * @private
     */
    #loadConfiguration(customEnv) {
        const env = this.#getEnvironment(customEnv);
        const config = {};

        // Provider configuration
        config.defaultProvider = this.#parseString(env[AUTH_ENV_VARS.DEFAULT_PROVIDER]) || 
            AuthProviderType.JWT;
        config.allowedProviders = this.#parseArray(env[AUTH_ENV_VARS.ALLOWED_PROVIDERS]) || 
            [AuthProviderType.JWT, AuthProviderType.OAUTH, AuthProviderType.SESSION];

        // Feature flags
        config.mfaRequired = this.#parseBoolean(env[AUTH_ENV_VARS.MFA_REQUIRED], false);
        config.encryptionEnabled = this.#parseBoolean(env[AUTH_ENV_VARS.ENCRYPTION_ENABLED], true);
        config.auditEnabled = this.#parseBoolean(env[AUTH_ENV_VARS.AUDIT_ENABLED], true);
        config.rateLimitingEnabled = this.#parseBoolean(env[AUTH_ENV_VARS.RATE_LIMITING_ENABLED], true);

        // Token configuration
        config.tokenRefreshInterval = this.#parseNumber(env[AUTH_ENV_VARS.TOKEN_REFRESH_INTERVAL], 300000);
        config.tokenExpiration = this.#parseNumber(env[AUTH_ENV_VARS.TOKEN_EXPIRATION], 3600000);
        config.maxRetries = this.#parseNumber(env[AUTH_ENV_VARS.MAX_RETRIES], 3);

        // Session configuration
        config.sessionTimeout = this.#parseNumber(env[AUTH_ENV_VARS.SESSION_TIMEOUT], 1800000);
        config.maxConcurrentSessions = this.#parseNumber(env[AUTH_ENV_VARS.MAX_CONCURRENT_SESSIONS], 5);

        // Security configuration
        config.maxLoginAttempts = this.#parseNumber(env[AUTH_ENV_VARS.MAX_LOGIN_ATTEMPTS], 5);
        config.lockoutDuration = this.#parseNumber(env[AUTH_ENV_VARS.LOCKOUT_DURATION], 900000);
        config.rateLimitWindow = this.#parseNumber(env[AUTH_ENV_VARS.RATE_LIMIT_WINDOW], 900000);
        config.rateLimitMaxAttempts = this.#parseNumber(env[AUTH_ENV_VARS.RATE_LIMIT_MAX_ATTEMPTS], 10);

        // Environment settings
        config.environment = env[AUTH_ENV_VARS.ENVIRONMENT] || 'development';
        config.apiBaseUrl = env[AUTH_ENV_VARS.API_BASE_URL] || 'http://localhost:3000';
        config.debugMode = this.#parseBoolean(env[AUTH_ENV_VARS.DEBUG_MODE], config.environment === 'development');

        // Logging configuration
        config.logLevel = env[AUTH_ENV_VARS.LOG_LEVEL] || 'info';
        config.logRetentionDays = this.#parseNumber(env[AUTH_ENV_VARS.LOG_RETENTION_DAYS], 30);

        return config;
    }

    /**
     * Gets environment variables
     * @param {Record<string, string|undefined>} [customEnv] 
     * @returns {Record<string, string|undefined>} Environment variables
     * @private
     */
    #getEnvironment(customEnv) {
        // Start with custom environment if provided
        let env = customEnv || {};

        // Add Node.js environment variables if available
        if (typeof process !== 'undefined' && process.env) {
            env = { ...env, ...process.env };
        }

        // Add browser environment variables if available
        if (typeof import.meta !== 'undefined' && import.meta.env) {
            env = { ...env, ...import.meta.env };
        }

        return env;
    }

    /**
     * Validates configuration
     * @private
     */
    #validateConfiguration() {
        // Validate provider
        if (!Object.values(AuthProviderType).includes(this.#config.defaultProvider)) {
            throw new Error(`Invalid default provider: ${this.#config.defaultProvider}`);
        }

        if (!Array.isArray(this.#config.allowedProviders)) {
            throw new Error('allowedProviders must be an array');
        }

        for (const provider of this.#config.allowedProviders) {
            if (!Object.values(AuthProviderType).includes(provider)) {
                throw new Error(`Invalid allowed provider: ${provider}`);
            }
        }

        // Validate numeric values
        if (this.#config.tokenRefreshInterval < 0) {
            throw new Error('tokenRefreshInterval must be positive');
        }

        if (this.#config.tokenExpiration < 0) {
            throw new Error('tokenExpiration must be positive');
        }

        if (this.#config.sessionTimeout < 0) {
            throw new Error('sessionTimeout must be positive');
        }

        // Validate log level
        const validLogLevels = ['error', 'warn', 'info', 'debug'];
        if (!validLogLevels.includes(this.#config.logLevel)) {
            throw new Error(`Invalid log level: ${this.#config.logLevel}`);
        }
    }

    /**
     * Notifies watchers of configuration changes
     * @param {string} key 
     * @param {*} value 
     * @private
     */
    #notifyWatchers(key, value) {
        const callbacks = this.#watchers.get(key);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(value);
                } catch (error) {
                    console.error('Error in configuration watcher:', error);
                }
            });
        }
    }

    /**
     * Parses string value
     * @param {string|undefined} value 
     * @returns {string|undefined} Parsed string
     * @private
     */
    #parseString(value) {
        return value ? String(value).trim() : undefined;
    }

    /**
     * Parses boolean value
     * @param {string|undefined} value 
     * @param {boolean} defaultValue 
     * @returns {boolean} Parsed boolean
     * @private
     */
    #parseBoolean(value, defaultValue = false) {
        if (value === undefined) return defaultValue;
        
        const str = String(value).toLowerCase();
        return str === 'true' || str === '1' || str === 'yes';
    }

    /**
     * Parses number value
     * @param {string|undefined} value 
     * @param {number} defaultValue 
     * @returns {number} Parsed number
     * @private
     */
    #parseNumber(value, defaultValue = 0) {
        if (value === undefined) return defaultValue;
        
        const parsed = Number(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    /**
     * Parses array value
     * @param {string|undefined} value 
     * @returns {string[]} Parsed array
     * @private
     */
    #parseArray(value) {
        if (!value) return [];
        
        try {
            return JSON.parse(value);
        } catch {
            // Fallback to comma-separated values
            return value.split(',').map(item => item.trim()).filter(item => item);
        }
    }
}
