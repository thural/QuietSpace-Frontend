/**
 * Authentication Configuration Loader
 * 
 * Loads and merges authentication configuration from multiple sources:
 * 1. Base configuration file
 * 2. Environment-specific configuration file
 * 3. Environment variables (highest priority)
 * 4. Runtime overrides
 */

import { AuthProviderType } from '../types/auth.domain.types.js';
import { EnvironmentAuthConfig, AUTH_ENV_VARS } from './EnvironmentAuthConfig.js';

/**
 * Configuration file structure
 */
export class AuthConfigFile {
    /** @type {string|undefined} */
    provider;
    /** @type {string|undefined} */
    defaultProvider;
    /** @type {string[]|undefined} */
    allowedProviders;

    /** @type {Object|undefined} */
    featureFlags;
    /** @type {Object|undefined} */
    token;
    /** @type {Object|undefined} */
    session;
    /** @type {Object|undefined} */
    security;
    /** @type {Object|undefined} */
    environment;
    /** @type {Object|undefined} */
    logging;

    /**
     * @param {Object} data 
     */
    constructor(data) {
        this.provider = data.provider;
        this.defaultProvider = data.defaultProvider;
        this.allowedProviders = data.allowedProviders;
        this.featureFlags = data.featureFlags;
        this.token = data.token;
        this.session = data.session;
        this.security = data.security;
        this.environment = data.environment;
        this.logging = data.logging;
    }
}

/**
 * Configuration loader options
 */
export class ConfigLoaderOptions {
    /** @type {string|undefined} */
    environment;
    /** @type {string|undefined} */
    configDir;
    /** @type {Object|undefined} */
    customEnv;
    /** @type {boolean|undefined} */
    enableEnvOverrides;
    /** @type {boolean|undefined} */
    enableWatching;

    /**
     * @param {Object} options 
     */
    constructor(options = {}) {
        this.environment = options.environment;
        this.configDir = options.configDir;
        this.customEnv = options.customEnv;
        this.enableEnvOverrides = options.enableEnvOverrides !== false;
        this.enableWatching = options.enableWatching || false;
    }
}

/**
 * File-based Authentication Configuration
 * 
 * Provides comprehensive configuration management with:
 * - Multi-source configuration merging
 * - Environment variable overrides
 * - Runtime configuration updates
 * - Configuration validation
 * - Hot reloading support
 */
export class AuthConfigLoader {
    /** @type {Object} */
    #options;
    /** @type {Object|null} */
    #config = null;
    /** @type {Object|null} */
    #watcher = null;
    /** @type {Map} */
    #configCache = new Map();
    /** @type {string} */
    #environment;

    constructor(options = {}) {
        this.#options = new ConfigLoaderOptions(options);
        this.#environment = this.#options.environment || this.#detectEnvironment();
    }

    /**
     * Loads authentication configuration
     * @returns {Promise<Object>} Loaded configuration
     */
    async loadConfig() {
        try {
            // Check cache first
            const cacheKey = this.#getCacheKey();
            if (this.#configCache.has(cacheKey)) {
                return this.#configCache.get(cacheKey);
            }

            // Load configuration from multiple sources
            const baseConfig = await this.#loadBaseConfig();
            const envConfig = await this.#loadEnvironmentConfig();
            const envVarConfig = this.#options.enableEnvOverrides ? 
                this.#loadEnvironmentVariables() : {};

            // Merge configurations in priority order
            const mergedConfig = this.#mergeConfigs(baseConfig, envConfig, envVarConfig);

            // Validate configuration
            this.#validateConfig(mergedConfig);

            // Cache the result
            this.#configCache.set(cacheKey, mergedConfig);
            this.#config = mergedConfig;

            return mergedConfig;
        } catch (error) {
            console.error('Failed to load authentication configuration:', error);
            throw new Error(`Configuration loading failed: ${error.message}`);
        }
    }

    /**
     * Gets current configuration
     * @returns {Object|null} Current configuration
     */
    getConfig() {
        return this.#config;
    }

    /**
     * Updates configuration at runtime
     * @param {Object} updates 
     * @returns {Object} Updated configuration
     */
    updateConfig(updates) {
        try {
            if (!this.#config) {
                throw new Error('No configuration loaded. Call loadConfig() first.');
            }

            // Apply updates
            const updatedConfig = this.#mergeConfigs(this.#config, updates);

            // Validate updated configuration
            this.#validateConfig(updatedConfig);

            // Update cached configuration
            this.#config = updatedConfig;
            this.#configCache.clear(); // Clear cache to force reload

            return updatedConfig;
        } catch (error) {
            console.error('Failed to update configuration:', error);
            throw new Error(`Configuration update failed: ${error.message}`);
        }
    }

    /**
     * Reloads configuration from sources
     * @returns {Promise<Object>} Reloaded configuration
     */
    async reloadConfig() {
        this.#configCache.clear();
        return await this.loadConfig();
    }

    /**
     * Starts watching for configuration changes
     * @returns {void}
     */
    startWatching() {
        if (!this.#options.enableWatching) {
            console.warn('Configuration watching is disabled');
            return;
        }

        if (this.#watcher) {
            console.warn('Configuration watcher is already active');
            return;
        }

        // In a real implementation, this would watch for file changes
        // For demo purposes, we'll just log that watching is active
        console.log('Configuration watching started');
        this.#watcher = { active: true };
    }

    /**
     * Stops watching for configuration changes
     * @returns {void}
     */
    stopWatching() {
        if (!this.#watcher) {
            console.warn('Configuration watcher is not active');
            return;
        }

        // In a real implementation, this would stop file watching
        console.log('Configuration watching stopped');
        this.#watcher = null;
    }

    /**
     * Gets configuration value by path
     * @param {string} path 
     * @returns {*} Configuration value
     */
    getValue(path) {
        if (!this.#config) {
            return undefined;
        }

        return this.#getNestedValue(this.#config, path);
    }

    /**
     * Checks if a configuration value exists
     * @param {string} path 
     * @returns {boolean} True if value exists
     */
    hasValue(path) {
        return this.getValue(path) !== undefined;
    }

    /**
     * Detects current environment
     * @returns {string} Environment name
     * @private
     */
    #detectEnvironment() {
        // Check for custom environment first
        if (this.#options.customEnv?.NODE_ENV) {
            return this.#options.customEnv.NODE_ENV;
        }

        // Check standard environment variables
        const nodeEnv = typeof process !== 'undefined' && process.env?.NODE_ENV;
        if (nodeEnv) {
            return nodeEnv;
        }

        // Default to development
        return 'development';
    }

    /**
     * Loads base configuration
     * @returns {Promise<Object>} Base configuration
     * @private
     */
    async #loadBaseConfig() {
        try {
            // In a real implementation, this would load from a file
            // For demo purposes, return default base config
            return {
                defaultProvider: AuthProviderType.JWT,
                allowedProviders: [
                    AuthProviderType.JWT,
                    AuthProviderType.OAUTH,
                    AuthProviderType.SESSION
                ],
                featureFlags: {
                    mfaRequired: false,
                    encryptionEnabled: true,
                    auditEnabled: true,
                    rateLimitingEnabled: true
                },
                token: {
                    refreshInterval: 300000, // 5 minutes
                    expiration: 3600000, // 1 hour
                    maxRetries: 3
                },
                session: {
                    timeout: 1800000, // 30 minutes
                    maxConcurrentSessions: 5
                },
                security: {
                    maxLoginAttempts: 5,
                    lockoutDuration: 900000, // 15 minutes
                    rateLimitWindow: 900000, // 15 minutes
                    rateLimitMaxAttempts: 10
                },
                environment: {
                    name: this.#environment,
                    debugMode: this.#environment === 'development'
                },
                logging: {
                    level: 'info',
                    retentionDays: 30
                }
            };
        } catch (error) {
            console.warn('Failed to load base configuration:', error);
            return {};
        }
    }

    /**
     * Loads environment-specific configuration
     * @returns {Promise<Object>} Environment configuration
     * @private
     */
    async #loadEnvironmentConfig() {
        try {
            // In a real implementation, this would load from environment-specific file
            // For demo purposes, return environment-specific overrides
            const envConfigs = {
                development: {
                    environment: {
                        debugMode: true,
                        apiBaseUrl: 'http://localhost:3000'
                    },
                    logging: {
                        level: 'debug'
                    }
                },
                production: {
                    environment: {
                        debugMode: false,
                        apiBaseUrl: 'https://api.quietspace.com'
                    },
                    logging: {
                        level: 'warn'
                    },
                    featureFlags: {
                        mfaRequired: true
                    }
                },
                test: {
                    environment: {
                        debugMode: true,
                        apiBaseUrl: 'http://localhost:3001'
                    },
                    logging: {
                        level: 'error'
                    },
                    token: {
                        expiration: 60000 // 1 minute for tests
                    }
                }
            };

            return envConfigs[this.#environment] || {};
        } catch (error) {
            console.warn('Failed to load environment configuration:', error);
            return {};
        }
    }

    /**
     * Loads configuration from environment variables
     * @returns {Object} Environment variable configuration
     * @private
     */
    #loadEnvironmentVariables() {
        const config = {};

        try {
            // Use EnvironmentAuthConfig to load environment variables
            const envConfig = new EnvironmentAuthConfig();
            const loadedConfig = envConfig.loadFromEnvironment();

            // Map environment variables to config structure
            if (loadedConfig.provider) {
                config.provider = loadedConfig.provider;
            }

            if (loadedConfig.defaultProvider) {
                config.defaultProvider = loadedConfig.defaultProvider;
            }

            if (loadedConfig.allowedProviders) {
                config.allowedProviders = loadedConfig.allowedProviders;
            }

            if (loadedConfig.apiBaseUrl) {
                config.environment = config.environment || {};
                config.environment.apiBaseUrl = loadedConfig.apiBaseUrl;
            }

            if (loadedConfig.debugMode !== undefined) {
                config.environment = config.environment || {};
                config.environment.debugMode = loadedConfig.debugMode;
            }

            return config;
        } catch (error) {
            console.warn('Failed to load environment variables:', error);
            return {};
        }
    }

    /**
     * Merges multiple configuration objects
     * @param {...Object} configs 
     * @returns {Object} Merged configuration
     * @private
     */
    #mergeConfigs(...configs) {
        const result = {};

        for (const config of configs) {
            if (!config || typeof config !== 'object') {
                continue;
            }

            this.#deepMerge(result, config);
        }

        return result;
    }

    /**
     * Deep merges objects
     * @param {Object} target 
     * @param {Object} source 
     * @private
     */
    #deepMerge(target, source) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (this.#isObject(source[key]) && this.#isObject(target[key])) {
                    this.#deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
    }

    /**
     * Checks if value is an object
     * @param {*} value 
     * @returns {boolean} True if object
     * @private
     */
    #isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    /**
     * Gets nested value from object
     * @param {Object} obj 
     * @param {string} path 
     * @returns {*} Nested value
     * @private
     */
    #getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && typeof current === 'object' ? current[key] : undefined;
        }, obj);
    }

    /**
     * Validates configuration
     * @param {Object} config 
     * @private
     */
    #validateConfig(config) {
        // Validate required fields
        if (!config.defaultProvider) {
            throw new Error('defaultProvider is required');
        }

        if (!config.allowedProviders || !Array.isArray(config.allowedProviders)) {
            throw new Error('allowedProviders must be an array');
        }

        // Validate provider types
        const validProviders = Object.values(AuthProviderType);
        for (const provider of config.allowedProviders) {
            if (!validProviders.includes(provider)) {
                throw new Error(`Invalid provider: ${provider}`);
            }
        }

        // Validate numeric values
        if (config.token?.refreshInterval && config.token.refreshInterval < 0) {
            throw new Error('token.refreshInterval must be positive');
        }

        if (config.session?.timeout && config.session.timeout < 0) {
            throw new Error('session.timeout must be positive');
        }

        // Validate feature flags
        if (config.featureFlags) {
            for (const [key, value] of Object.entries(config.featureFlags)) {
                if (typeof value !== 'boolean') {
                    throw new Error(`featureFlags.${key} must be a boolean`);
                }
            }
        }
    }

    /**
     * Gets cache key
     * @returns {string} Cache key
     * @private
     */
    #getCacheKey() {
        return `auth-config-${this.#environment}-${JSON.stringify(this.#options.customEnv || {})}`;
    }
}
