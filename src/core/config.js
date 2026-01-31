/**
 * Core System Configuration Types
 * 
 * Configuration interfaces and types for the core system.
 * Provides clean type exports following Black Box pattern.
 */

/**
 * Core configuration interface
 * 
 * @interface CoreConfig
 * @description Main configuration interface for the core system
 */
export class CoreConfig {
    /**
     * Cache configuration
     * 
     * @type {CacheConfig}
     */
    cache;

    /**
     * WebSocket configuration
     * 
     * @type {WebSocketConfig}
     */
    websocket;

    /**
     * Authentication configuration
     * 
     * @type {AuthConfig}
     */
    auth;

    /**
     * Theme configuration
     * 
     * @type {ThemeConfig}
     */
    theme;

    /**
     * Network configuration
     * 
     * @type {NetworkConfig}
     */
    network;

    /**
     * Services configuration
     * 
     * @type {ServiceConfig}
     */
    services;

    /**
     * Create core configuration
     * 
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        this.cache = options.cache || new CacheConfig();
        this.websocket = options.websocket || new WebSocketConfig();
        this.auth = options.auth || new AuthConfig();
        this.theme = options.theme || new ThemeConfig();
        this.network = options.network || new NetworkConfig();
        this.services = options.services || new ServiceConfig();
    }
}

/**
 * Cache configuration interface
 * 
 * @interface CacheConfig
 * @description Configuration for cache system
 */
export class CacheConfig {
    /**
     * Maximum cache size
     * 
     * @type {number}
     */
    maxSize;

    /**
     * Default time to live
     * 
     * @type {number}
     */
    defaultTtl;

    /**
     * Cache strategy
     * 
     * @type {string}
     */
    strategy;

    /**
     * Enable metrics
     * 
     * @type {boolean}
     */
    enableMetrics;

    /**
     * Create cache configuration
     * 
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        this.maxSize = options.maxSize || 1000;
        this.defaultTtl = options.defaultTtl || 3600000; // 1 hour
        this.strategy = options.strategy || 'lru';
        this.enableMetrics = options.enableMetrics !== false; // default true
    }
}

/**
 * WebSocket configuration interface
 * 
 * @interface WebSocketConfig
 * @description Configuration for WebSocket connections
 */
export class WebSocketConfig {
    /**
     * WebSocket URL
     * 
     * @type {string}
     */
    url;

    /**
     * Reconnect interval
     * 
     * @type {number}
     */
    reconnectInterval;

    /**
     * Maximum reconnect attempts
     * 
     * @type {number}
     */
    maxReconnectAttempts;

    /**
     * Connection timeout
     * 
     * @type {number}
     */
    timeout;

    /**
     * WebSocket protocols
     * 
     * @type {string[]}
     */
    protocols;

    /**
     * Create WebSocket configuration
     * 
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        this.url = options.url;
        this.reconnectInterval = options.reconnectInterval || 3000;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
        this.timeout = options.timeout || 10000;
        this.protocols = options.protocols || [];
    }
}

/**
 * Authentication configuration interface
 * 
 * @interface AuthConfig
 * @description Configuration for authentication system
 */
export class AuthConfig {
    /**
     * Token refresh interval
     * 
     * @type {number}
     */
    tokenRefreshInterval;

    /**
     * Session timeout
     * 
     * @type {number}
     */
    sessionTimeout;

    /**
     * Maximum login attempts
     * 
     * @type {number}
     */
    maxLoginAttempts;

    /**
     * Enable two-factor authentication
     * 
     * @type {boolean}
     */
    enableTwoFactorAuth;

    /**
     * Password minimum length
     * 
     * @type {number}
     */
    passwordMinLength;

    /**
     * Require email verification
     * 
     * @type {boolean}
     */
    requireEmailVerification;

    /**
     * Enable social login
     * 
     * @type {boolean}
     */
    enableSocialLogin;

    /**
     * Social providers
     * 
     * @type {string[]}
     */
    socialProviders;

    /**
     * Create authentication configuration
     * 
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        this.tokenRefreshInterval = options.tokenRefreshInterval || 300000; // 5 minutes
        this.sessionTimeout = options.sessionTimeout || 3600000; // 1 hour
        this.maxLoginAttempts = options.maxLoginAttempts || 5;
        this.enableTwoFactorAuth = options.enableTwoFactorAuth || false;
        this.passwordMinLength = options.passwordMinLength || 8;
        this.requireEmailVerification = options.requireEmailVerification || false;
        this.enableSocialLogin = options.enableSocialLogin || false;
        this.socialProviders = options.socialProviders || [];
    }
}

/**
 * Theme configuration interface
 * 
 * @interface ThemeConfig
 * @description Configuration for theme system
 */
export class ThemeConfig {
    /**
     * Theme name
     * 
     * @type {string}
     */
    name;

    /**
     * Theme variant
     * 
     * @type {string}
     */
    variant;

    /**
     * Color palette
     * 
     * @type {Record<string, string>}
     */
    colors;

    /**
     * Typography settings
     * 
     * @type {Record<string, any>}
     */
    typography;

    /**
     * Spacing values
     * 
     * @type {Record<string, string>}
     */
    spacing;

    /**
     * Shadow definitions
     * 
     * @type {Record<string, string>}
     */
    shadows;

    /**
     * Create theme configuration
     * 
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        this.name = options.name || 'default';
        this.variant = options.variant || 'light';
        this.colors = options.colors || {};
        this.typography = options.typography || {};
        this.spacing = options.spacing || {};
        this.shadows = options.shadows || {};
    }
}

/**
 * Network configuration interface
 * 
 * @interface NetworkConfig
 * @description Configuration for network requests
 */
export class NetworkConfig {
    /**
     * API base URL
     * 
     * @type {string}
     */
    baseUrl;

    /**
     * Request timeout
     * 
     * @type {number}
     */
    timeout;

    /**
     * Retry attempts
     * 
     * @type {number}
     */
    retryAttempts;

    /**
     * Retry delay
     * 
     * @type {number}
     */
    retryDelay;

    /**
     * Request headers
     * 
     * @type {Record<string, string>}
     */
    headers;

    /**
     * Create network configuration
     * 
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        this.baseUrl = options.baseUrl;
        this.timeout = options.timeout || 30000;
        this.retryAttempts = options.retryAttempts || 3;
        this.retryDelay = options.retryDelay || 1000;
        this.headers = options.headers || {};
    }
}

/**
 * Services configuration interface
 * 
 * @interface ServiceConfig
 * @description Configuration for service container
 */
export class ServiceConfig {
    /**
     * Enable dependency injection
     * 
     * @type {boolean}
     */
    enableDI;

    /**
     * Enable service discovery
     * 
     * @type {boolean}
     */
    enableDiscovery;

    /**
     * Service registry URL
     * 
     * @type {string}
     */
    registryUrl;

    /**
     * Health check interval
     * 
     * @type {number}
     */
    healthCheckInterval;

    /**
     * Enable metrics
     * 
     * @type {boolean}
     */
    enableMetrics;

    /**
     * Create services configuration
     * 
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        this.enableDI = options.enableDI !== false; // default true
        this.enableDiscovery = options.enableDiscovery || false;
        this.registryUrl = options.registryUrl;
        this.healthCheckInterval = options.healthCheckInterval || 60000; // 1 minute
        this.enableMetrics = options.enableMetrics !== false; // default true
    }
}

// Default configurations
/**
 * Default core configuration
 * 
 * @type {CoreConfig}
 * @description Default configuration for the core system
 */
export const DEFAULT_CORE_CONFIG = new CoreConfig();

/**
 * Default cache configuration
 * 
 * @type {CacheConfig}
 * @description Default configuration for cache system
 */
export const DEFAULT_CACHE_CONFIG = new CacheConfig();

/**
 * Default WebSocket configuration
 * 
 * @type {WebSocketConfig}
 * @description Default configuration for WebSocket connections
 */
export const DEFAULT_WEBSOCKET_CONFIG = new WebSocketConfig();

/**
 * Default authentication configuration
 * 
 * @type {AuthConfig}
 * @description Default configuration for authentication system
 */
export const DEFAULT_AUTH_CONFIG = new AuthConfig();

/**
 * Default theme configuration
 * 
 * @type {ThemeConfig}
 * @description Default configuration for theme system
 */
export const DEFAULT_THEME_CONFIG = new ThemeConfig();

/**
 * Default network configuration
 * 
 * @type {NetworkConfig}
 * @description Default configuration for network requests
 */
export const DEFAULT_NETWORK_CONFIG = new NetworkConfig();

/**
 * Default services configuration
 * 
 * @type {ServiceConfig}
 * @description Default configuration for service container
 */
export const DEFAULT_SERVICES_CONFIG = new ServiceConfig();

// Configuration validation functions
/**
 * Validates core configuration
 * 
 * @function validateCoreConfig
 * @param {CoreConfig} config - Configuration to validate
 * @returns {string[]} Array of validation errors
 * @description Validates core configuration and returns errors
 */
export function validateCoreConfig(config) {
    const errors = [];

    if (!config || typeof config !== 'object') {
        errors.push('Configuration must be an object');
        return errors;
    }

    // Validate cache config
    if (config.cache) {
        const cacheErrors = validateCacheConfig(config.cache);
        errors.push(...cacheErrors.map(err => `Cache: ${err}`));
    }

    // Validate WebSocket config
    if (config.websocket) {
        const wsErrors = validateWebSocketConfig(config.websocket);
        errors.push(...wsErrors.map(err => `WebSocket: ${err}`));
    }

    // Validate auth config
    if (config.auth) {
        const authErrors = validateAuthConfig(config.auth);
        errors.push(...authErrors.map(err => `Auth: ${err}`));
    }

    return errors;
}

/**
 * Validates cache configuration
 * 
 * @function validateCacheConfig
 * @param {CacheConfig} config - Configuration to validate
 * @returns {string[]} Array of validation errors
 * @description Validates cache configuration and returns errors
 */
export function validateCacheConfig(config) {
    const errors = [];

    if (config.maxSize !== undefined && (typeof config.maxSize !== 'number' || config.maxSize < 1)) {
        errors.push('maxSize must be a positive number');
    }

    if (config.defaultTtl !== undefined && (typeof config.defaultTtl !== 'number' || config.defaultTtl < 1000)) {
        errors.push('defaultTtl must be at least 1000ms');
    }

    if (config.strategy !== undefined) {
        const validStrategies = ['lru', 'fifo', 'lfu'];
        if (!validStrategies.includes(config.strategy)) {
            errors.push(`strategy must be one of: ${validStrategies.join(', ')}`);
        }
    }

    return errors;
}

/**
 * Validates WebSocket configuration
 * 
 * @function validateWebSocketConfig
 * @param {WebSocketConfig} config - Configuration to validate
 * @returns {string[]} Array of validation errors
 * @description Validates WebSocket configuration and returns errors
 */
export function validateWebSocketConfig(config) {
    const errors = [];

    if (config.url !== undefined && typeof config.url !== 'string') {
        errors.push('url must be a string');
    }

    if (config.reconnectInterval !== undefined && (typeof config.reconnectInterval !== 'number' || config.reconnectInterval < 1000)) {
        errors.push('reconnectInterval must be at least 1000ms');
    }

    return errors;
}

/**
 * Validates authentication configuration
 * 
 * @function validateAuthConfig
 * @param {AuthConfig} config - Configuration to validate
 * @returns {string[]} Array of validation errors
 * @description Validates authentication configuration and returns errors
 */
export function validateAuthConfig(config) {
    const errors = [];

    if (config.tokenRefreshInterval !== undefined && (typeof config.tokenRefreshInterval !== 'number' || config.tokenRefreshInterval < 60000)) {
        errors.push('tokenRefreshInterval must be at least 60000ms (1 minute)');
    }

    if (config.sessionTimeout !== undefined && (typeof config.sessionTimeout !== 'number' || config.sessionTimeout < 300000)) {
        errors.push('sessionTimeout must be at least 300000ms (5 minutes)');
    }

    if (config.maxLoginAttempts !== undefined && (typeof config.maxLoginAttempts !== 'number' || config.maxLoginAttempts < 1 || config.maxLoginAttempts > 10)) {
        errors.push('maxLoginAttempts must be between 1 and 10');
    }

    return errors;
}
