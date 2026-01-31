/**
 * Network Module Factory Functions
 * 
 * Provides factory functions for creating API clients following Black Box pattern.
 * Internal implementation classes are completely hidden from consumers.
 */

import { DEFAULT_API_CONFIG, ENVIRONMENT_CONFIG } from './constants.js';
import { createApiError, ERROR_CODES } from './utils.js';

// Import implementations (internal)
import { ApiClient } from './api/ApiClient.js';
import { RestClient } from './rest/RestClient.js';
import { Container } from '../di/container/Container.js';
import { TYPES } from '../di/types.js';

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
 * Creates an API client with the specified configuration.
 * 
 * @param {Partial<IApiClientConfig>} [config] - Optional configuration for the API client
 * @returns {IApiClient} Configured API client instance
 */
export function createApiClient(config) {
    // Merge with default configuration
    const finalConfig = {
        ...DEFAULT_API_CONFIG,
        ...config,
        headers: {
            ...DEFAULT_API_CONFIG.headers,
            ...config?.headers
        },
        retryConfig: {
            ...DEFAULT_API_CONFIG.retryConfig,
            ...config?.retryConfig
        },
        cacheConfig: {
            ...DEFAULT_API_CONFIG.cacheConfig,
            ...config?.cacheConfig
        }
    };

    try {
        // Create API client instance
        return new ApiClient(finalConfig);
    } catch (error) {
        throw createApiError(
            ERROR_CODES.CONFIGURATION_ERROR,
            'Failed to create API client',
            { originalError: error }
        );
    }
}

/**
 * Creates an API client using dependency injection container.
 * 
 * @param {Container} container - DI container instance
 * @param {Partial<IApiClientConfig>} [config] - Optional configuration for the API client
 * @returns {IApiClient} API client from DI container or fallback
 */
export function createApiClientFromDI(
    container,
    config
) {
    try {
        // Try to get from DI container first
        return container.getByToken(TYPES.API_CLIENT);
    } catch (error) {
        // Fallback to direct creation
        console.warn('API client not found in DI container, using fallback creation');
        return createApiClient(config);
    }
}

/**
 * Creates a REST client with the specified configuration.
 * 
 * @param {Partial<IApiClientConfig>} [config] - Optional configuration for the REST client
 * @returns {IApiClient} Configured REST client instance
 */
export function createRestClient(config) {
    // Merge with default configuration
    const finalConfig = {
        ...DEFAULT_API_CONFIG,
        ...config,
        headers: {
            ...DEFAULT_API_CONFIG.headers,
            ...config?.headers
        }
    };

    try {
        // Create REST client instance
        return new RestClient(finalConfig);
    } catch (error) {
        throw createApiError(
            ERROR_CODES.CONFIGURATION_ERROR,
            'Failed to create REST client',
            { originalError: error }
        );
    }
}

/**
 * Creates a REST client using dependency injection container.
 * 
 * @param {Container} container - DI container instance
 * @param {Partial<IApiClientConfig>} [config] - Optional configuration for the REST client
 * @returns {IApiClient} REST client from DI container or fallback
 */
export function createRestClientFromDI(
    container,
    config
) {
    try {
        // Try to get from DI container first
        return container.getByToken(TYPES.REST_CLIENT);
    } catch (error) {
        // Fallback to direct creation
        console.warn('REST client not found in DI container, using fallback creation');
        return createRestClient(config);
    }
}

/**
 * Creates an API client for a specific environment.
 * 
 * @param {string} environment - Target environment (development, staging, production)
 * @param {Partial<IApiClientConfig>} [config] - Optional additional configuration
 * @returns {IApiClient} Environment-specific API client
 */
export function createApiClientForEnvironment(
    environment,
    config
) {
    const envConfig = ENVIRONMENT_CONFIG[environment];

    if (!envConfig) {
        throw createApiError(
            ERROR_CODES.CONFIGURATION_ERROR,
            `Unknown environment: ${environment}`,
            { availableEnvironments: Object.keys(ENVIRONMENT_CONFIG) }
        );
    }

    // Merge environment config with provided config
    const finalConfig = {
        ...envConfig,
        ...config,
        headers: {
            ...envConfig.headers,
            ...config?.headers
        },
        retryConfig: {
            ...envConfig.retryConfig,
            ...config?.retryConfig
        }
    };

    return createApiClient(finalConfig);
}

/**
 * Creates an authenticated API client.
 * 
 * @param {string} token - Authentication token
 * @param {Partial<IApiClientConfig>} [config] - Optional additional configuration
 * @returns {IApiClient} Authenticated API client
 */
export function createAuthenticatedApiClient(
    token,
    config
) {
    const authConfig = {
        ...config,
        auth: {
            type: 'bearer',
            token
        }
    };

    return createApiClient(authConfig);
}

/**
 * Creates an authenticated API client using dependency injection.
 * 
 * @param {Container} container - DI container instance
 * @param {string} token - Authentication token
 * @param {Partial<IApiClientConfig>} [config] - Optional additional configuration
 * @returns {IApiClient} Authenticated API client from DI container or fallback
 */
export function createAuthenticatedApiClientFromDI(
    container,
    token,
    config
) {
    const authConfig = {
        ...config,
        auth: {
            type: 'bearer',
            token
        }
    };

    return createApiClientFromDI(container, authConfig);
}

/**
 * Creates a mock API client for testing.
 * 
 * @param {Partial<IApiClientConfig>} [config] - Optional configuration for the mock client
 * @returns {IApiClient} Mock API client instance
 */
export function createMockApiClient(config) {
    // This would typically use a mock implementation
    // For now, we'll create a real client with test configuration
    const mockConfig = {
        ...DEFAULT_API_CONFIG,
        baseURL: 'http://localhost:3001/mock-api',
        timeout: 1000,
        ...config
    };

    return createApiClient(mockConfig);
}

/**
 * Default API client instance for common usage.
 * Created with default configuration.
 */
export const defaultApiClient = createApiClient();

/**
 * Factory function registry for extensibility.
 * Allows registration of custom factory functions.
 */
class ApiClientFactoryRegistry {
    constructor() {
        this.factories = new Map();
    }

    /**
     * Registers a custom factory function.
     * 
     * @param {string} name - Factory name
     * @param {Function} factory - Factory function
     */
    register(name, factory) {
        this.factories.set(name, factory);
    }

    /**
     * Creates a client using a registered factory.
     * 
     * @param {string} name - Factory name
     * @param {Partial<IApiClientConfig>} [config] - Optional configuration
     * @returns {IApiClient} API client from factory
     */
    create(name, config) {
        const factory = this.factories.get(name);
        if (!factory) {
            throw createApiError(
                ERROR_CODES.CONFIGURATION_ERROR,
                `Unknown factory: ${name}`,
                { availableFactories: Array.from(this.factories.keys()) }
            );
        }
        return factory(config);
    }

    /**
     * Lists all registered factories.
     * 
     * @returns {Array<string>} List of factory names
     */
    list() {
        return Array.from(this.factories.keys());
    }
}

// Global factory registry instance
export const apiClientFactoryRegistry = new ApiClientFactoryRegistry();

// Register default factories
apiClientFactoryRegistry.register('default', createApiClient);
apiClientFactoryRegistry.register('rest', createRestClient);
apiClientFactoryRegistry.register('mock', createMockApiClient);

/**
 * Creates an API client using a registered factory.
 * 
 * @param {string} factoryName - Name of the registered factory
 * @param {Partial<IApiClientConfig>} [config] - Optional configuration
 * @returns {IApiClient} API client from the specified factory
 */
export function createApiClientWithFactory(
    factoryName,
    config
) {
    return apiClientFactoryRegistry.create(factoryName, config);
}
