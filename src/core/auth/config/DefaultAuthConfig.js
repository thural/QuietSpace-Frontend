/**
 * Default authentication configuration
 * 
 * Provides default configuration values for authentication
 * with environment-specific overrides.
 */

/**
 * Default authentication configuration
 */
export class DefaultAuthConfig {
    /** @type {string} */
    name = 'DefaultAuthConfig';

    /** @type {Record<string, any>} */
    #config = {
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

    /** @type {Map} */
    #watchers = new Map();

    /**
     * Gets configuration value
     * @template T
     * @param {string} key 
     * @returns {T} Configuration value
     */
    get(key) {
        return this.#config[key];
    }

    /**
     * Sets configuration value
     * @template T
     * @param {string} key 
     * @param {T} value 
     * @returns {void}
     */
    set(key, value) {
        this.#config[key] = value;

        // Notify watchers
        const keyWatchers = this.#watchers.get(key);
        if (keyWatchers) {
            keyWatchers.forEach(callback => callback(value));
        }
    }

    /**
     * Gets all configuration
     * @returns {Record<string, any>} All configuration
     */
    getAll() {
        return { ...this.#config };
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
     * Updates configuration with environment-specific overrides
     * @param {string} environment 
     * @returns {void}
     */
    updateForEnvironment(environment) {
        const envConfigs = {
            development: {
                debugMode: true,
                logLevel: 'debug',
                apiBaseUrl: 'http://localhost:3000'
            },
            production: {
                debugMode: false,
                logLevel: 'warn',
                apiBaseUrl: 'https://api.quietspace.com',
                mfaRequired: true,
                rateLimitMaxAttempts: 10
            },
            test: {
                debugMode: true,
                logLevel: 'error',
                apiBaseUrl: 'http://localhost:3001',
                tokenExpiration: 60000, // 1 minute for tests
                sessionTimeout: 300000 // 5 minutes for tests
            }
        };

        const envConfig = envConfigs[environment];
        if (envConfig) {
            Object.assign(this.#config, envConfig);
            this.#config.environment = environment;
        }
    }

    /**
     * Resets configuration to defaults
     * @returns {void}
     */
    reset() {
        this.#config = {
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
    }

    /**
     * Validates configuration
     * @returns {boolean} True if configuration is valid
     */
    validate() {
        try {
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

            // Validate arrays
            if (!Array.isArray(this.#config.allowedProviders)) {
                throw new Error('allowedProviders must be an array');
            }

            // Validate log level
            const validLogLevels = ['error', 'warn', 'info', 'debug'];
            if (!validLogLevels.includes(this.#config.logLevel)) {
                throw new Error(`Invalid log level: ${this.#config.logLevel}`);
            }

            return true;
        } catch (error) {
            console.error('Configuration validation failed:', error);
            return false;
        }
    }

    /**
     * Creates a copy of the configuration
     * @returns {DefaultAuthConfig} New configuration instance
     */
    clone() {
        const cloned = new DefaultAuthConfig();
        cloned.#config = { ...this.#config };
        return cloned;
    }

    /**
     * Merges configuration with another configuration
     * @param {Record<string, any>} otherConfig 
     * @returns {void}
     */
    merge(otherConfig) {
        Object.assign(this.#config, otherConfig);
    }

    /**
     * Gets configuration as JSON
     * @returns {string} JSON string
     */
    toJSON() {
        return JSON.stringify(this.#config, null, 2);
    }

    /**
     * Loads configuration from JSON
     * @param {string} jsonString 
     * @returns {boolean} True if loaded successfully
     */
    fromJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            Object.assign(this.#config, parsed);
            return this.validate();
        } catch (error) {
            console.error('Failed to load configuration from JSON:', error);
            return false;
        }
    }
}
