/**
 * DI-based API Client Factory
 * 
 * Creates API clients with DI-based authentication instead of direct store access.
 * This follows the Black Box pattern and maintains proper separation of concerns.
 */

import { createApiClient } from '../factory.js';
import { TokenProvider } from '../providers/TokenProvider.js';
import { createContainer } from '../../di/factory.js';
import { TYPES } from '../../di/types.js';

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
 * @property {Object} [retryConfig] - Retry configuration
 * @property {Object} [cacheConfig] - Cache configuration
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
 * @property {() => Promise<string|null>} refreshToken - Refresh token
 */

/**
 * Container interface
 * @typedef {Object} Container
 * @property {(token: string) => any} getByToken - Get service by token
 */

/**
 * Creates an API client with DI-based authentication
 * 
 * @param {Container} container - DI container instance
 * @param {Partial<IApiClientConfig>} [config] - Optional API client configuration
 * @returns {IApiClient} API client with DI-based authentication
 */
export function createDIAuthenticatedApiClient(
    container,
    config
) {
    // Create token provider from DI container
    const tokenProvider = new TokenProvider(container);

    // Create API client
    const client = createApiClient(config);

    // Set up authentication using token provider
    const token = tokenProvider.getToken();
    if (token) {
        client.setAuth(token);
    }

    // Set up token refresh interceptor
    const originalRequest = client;
    if (originalRequest.interceptors) {
        originalRequest.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Handle 401 Unauthorized - Token expired
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        // Use token provider to refresh
                        const newToken = await tokenProvider.refreshToken();

                        if (newToken) {
                            // Retry the original request with new token
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return originalRequest(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        tokenProvider.clearToken();
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    return client;
}

/**
 * Creates an API client with automatic DI-based token injection
 * 
 * @param {Container} container - DI container instance
 * @param {Partial<IApiClientConfig>} [config] - Optional API client configuration
 * @returns {IApiClient} API client with automatic token management
 */
export function createAutoAuthApiClient(
    container,
    config
) {
    // Create token provider from DI container
    const tokenProvider = new TokenProvider(container);

    // Create API client
    const client = createApiClient(config);

    // Set up request interceptor for automatic token injection
    const originalRequest = client;
    if (originalRequest.interceptors) {
        originalRequest.interceptors.request.use(
            (requestConfig) => {
                const token = tokenProvider.getToken();
                if (token) {
                    requestConfig.headers.Authorization = `Bearer ${token}`;
                }
                return requestConfig;
            },
            (error) => Promise.reject(error)
        );
    }

    return client;
}

/**
 * Creates a token provider from DI container
 * 
 * @param {Container} container - DI container instance
 * @returns {ITokenProvider} Token provider instance
 */
export function createTokenProvider(container) {
    return new TokenProvider(container);
}

/**
 * Creates an API client factory function that uses DI
 * 
 * @param {Container} container - DI container instance
 * @returns {Object} Factory function for creating authenticated API clients
 */
export function createApiClientFactory(container) {
    return {
        createAuthenticated: (config) =>
            createDIAuthenticatedApiClient(container, config),
        createAutoAuth: (config) =>
            createAutoAuthApiClient(container, config),
        createTokenProvider: () => createTokenProvider(container)
    };
}
