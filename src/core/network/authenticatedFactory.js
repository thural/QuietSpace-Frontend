/**
 * Authenticated API Client Factory
 * 
 * Provides pre-configured API clients with authentication already set up.
 * This follows the Black Box pattern and eliminates manual auth management.
 */

import { createApiClient } from './factory.js';
import { createApiError, ERROR_CODES } from './utils.js';

/**
 * API client interface
 * @typedef {Object} IApiClient
 * @property {(url: string, config?: Object) => Promise<Object>} get - GET request
 * @property {(url: string, data?: any, config?: Object) => Promise<Object>} post - POST request
 * @property {(url: string, data?: any, config?: Object) => Promise<Object>} put - PUT request
 * @property {(url: string, config?: Object) => Promise<Object>} patch - PATCH request
 * @property {(url: string, config?: Object) => Promise<Object>} delete - DELETE request
 * @property {(token: string) => void} setAuth - Set authentication token
 * @property {() => void} clearAuth - Clear authentication
 * @property {() => string|null} getAuth - Get authentication token
 * @property {(config: Object) => void} updateConfig - Update configuration
 * @property {() => Object} getConfig - Get configuration
 * @property {() => Object} getHealth - Get health status
 * @property {() => Object} getMetrics - Get metrics
 */

/**
 * API client configuration interface
 * @typedef {Object} IApiClientConfig
 * @property {string} [baseURL] - Base URL
 * @property {number} [timeout] - Request timeout
 * @property {Object} [headers] - Default headers
 * @property {Object} [auth] - Authentication configuration
 * @property {Object} [retry] - Retry configuration
 * @property {Object} [cache] - Cache configuration
 * @property {boolean} [enableMetrics] - Enable metrics
 * @property {boolean} [enableLogging] - Enable logging
 * @property {Function} [transformRequest] - Request transformer
 * @property {Function} [transformResponse] - Response transformer
 * @property {Function} [validateStatus] - Status validator
 */

/**
 * Token provider interface
 * @typedef {Object} ITokenProvider
 * @property {() => string|null} getToken - Get current token
 * @property {(token: string) => void} setToken - Set token
 * @property {() => void} clearToken - Clear token
 * @property {() => boolean} hasToken - Check if token exists
 * @property {(callback: Function) => Function} subscribe - Subscribe to token changes
 */

/**
 * Creates an authenticated API client with token already configured
 * 
 * @param {string} token - Authentication token
 * @param {Partial<IApiClientConfig>} [config] - Optional additional configuration
 * @returns {IApiClient} Pre-configured authenticated API client
 */
export function createAuthenticatedApiClient(
    token,
    config
) {
    if (!token) {
        throw createApiError(
            ERROR_CODES.AUTHENTICATION_ERROR,
            'Authentication token is required'
        );
    }

    const client = createApiClient(config);
    client.setAuth(token);

    return client;
}

/**
 * Creates an authenticated API client using DI container
 * 
 * @param {*} container - DI container instance
 * @param {string} token - Authentication token
 * @param {Partial<IApiClientConfig>} [config] - Optional additional configuration
 * @returns {IApiClient} Pre-configured authenticated API client from DI
 */
export function createAuthenticatedApiClientFromDI(
    container,
    token,
    config
) {
    try {
        // Try to get authenticated client from DI container
        const client = container.getByToken('AUTHENTICATED_API_CLIENT');

        // Update the token if different
        if (token) {
            client.setAuth(token);
        }

        return client;
    } catch {
        // Fallback to direct creation
        console.warn('Authenticated API client not found in DI container, using fallback creation');
        return createAuthenticatedApiClient(token, config);
    }
}

/**
 * Creates a token provider for automatic authentication management
 * 
 * @param {*} container - DI container instance
 * @returns {ITokenProvider} Token provider interface
 */
export function createTokenProvider(container) {
    try {
        return container.getByToken('TOKEN_PROVIDER');
    } catch {
        // Fallback to simple token provider
        return new SimpleTokenProvider();
    }
}

/**
 * Simple token provider implementation
 */
export class SimpleTokenProvider {
    constructor() {
        this.token = null;
        this.subscribers = new Set();
    }

    /**
     * Get current token
     * 
     * @returns {string|null} Current authentication token
     */
    getToken() {
        return this.token;
    }

    /**
     * Set authentication token
     * 
     * @param {string} token - Authentication token
     */
    setToken(token) {
        this.token = token;
        this.notifySubscribers();
    }

    /**
     * Clear authentication token
     */
    clearToken() {
        this.token = null;
        this.notifySubscribers();
    }

    /**
     * Check if token exists
     * 
     * @returns {boolean} Whether token exists
     */
    hasToken() {
        return !!this.token;
    }

    /**
     * Subscribe to token changes
     * 
     * @param {(token: string|null) => void} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.subscribers.add(callback);
        callback(this.token);

        return () => {
            this.subscribers.delete(callback);
        };
    }

    /**
     * Notify all subscribers of token changes
     */
    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.token));
    }
}

/**
 * Creates an auto-authenticating API client
 * 
 * @param {ITokenProvider} tokenProvider - Token provider for automatic auth management
 * @param {Partial<IApiClientConfig>} [config] - Optional additional configuration
 * @returns {IApiClient} Auto-authenticating API client
 */
export function createAutoAuthApiClient(
    tokenProvider,
    config
) {
    const client = createApiClient(config);

    // Set initial token if available
    const initialToken = tokenProvider.getToken();
    if (initialToken) {
        client.setAuth(initialToken);
    }

    // Subscribe to token changes
    tokenProvider.subscribe((token) => {
        if (token) {
            client.setAuth(token);
        } else {
            client.clearAuth();
        }
    });

    return client;
}
