/**
 * Network Module Factory Functions
 *
 * Provides factory functions for creating API clients following Black Box pattern.
 * Internal implementation classes are completely hidden from consumers.
 */

import { TYPES } from '../dependency-injection/types';

import { ApiClient } from './api/ApiClient';
import { RestClient } from './rest/RestClient';
import { DEFAULT_API_CONFIG, ENVIRONMENT_CONFIG } from './constants';

// Import centralized error handling
import { createNetworkError } from '../error';

// Import implementations (internal)

import type { IApiClient, IApiClientConfig } from './interfaces';
import type { Container } from '../dependency-injection/container/Container';


/**
 * Creates an API client with the specified configuration.
 *
 * @param config - Optional configuration for the API client
 * @returns Configured API client instance
 */
export function createApiClient(config?: Partial<IApiClientConfig>): IApiClient {
    // Merge with default configuration
    const finalConfig: IApiClientConfig = {
        ...DEFAULT_API_CONFIG,
        ...config,
        headers: {
            ...DEFAULT_API_CONFIG.headers,
            ...config?.headers
        },
        retryConfig: {
            maxAttempts: DEFAULT_API_CONFIG.retryConfig?.maxAttempts ?? 3,
            retryDelay: DEFAULT_API_CONFIG.retryConfig?.retryDelay ?? 1000,
            retryCondition: DEFAULT_API_CONFIG.retryConfig?.retryCondition || (() => true),
            exponentialBackoff: DEFAULT_API_CONFIG.retryConfig?.exponentialBackoff ?? true,
            ...config?.retryConfig
        },
        cacheConfig: {
            enabled: DEFAULT_API_CONFIG.cacheConfig?.enabled ?? true,
            ttl: DEFAULT_API_CONFIG.cacheConfig?.ttl ?? 300000,
            maxSize: DEFAULT_API_CONFIG.cacheConfig?.maxSize ?? 1000,
            keyGenerator: DEFAULT_API_CONFIG.cacheConfig?.keyGenerator || ((url: string) => url),
            ...config?.cacheConfig
        }
    };

    try {
        // Create API client instance
        return new ApiClient(finalConfig);
    } catch (error) {
        const networkError = createNetworkError(
            'Failed to create API client',
            undefined,
            undefined
        );
        throw networkError;
    }
}

/**
 * Creates an API client using dependency injection container.
 *
 * @param container - DI container instance
 * @param config - Optional configuration for the API client
 * @returns API client from DI container or fallback
 */
export function createApiClientFromDI(
    container: Container,
    config?: Partial<IApiClientConfig>
): IApiClient {
    try {
        // Try to get from DI container first
        return container.getByToken<IApiClient>(TYPES.API_CLIENT);
    } catch (error) {
        // Fallback to direct creation
        console.warn('API client not found in DI container, using fallback creation');
        return createApiClient(config);
    }
}

/**
 * Creates a REST client with the specified configuration.
 *
 * @param config - Optional configuration for the REST client
 * @returns Configured REST client instance
 */
export function createRestClient(config?: Partial<IApiClientConfig>): IApiClient {
    // Merge with default configuration
    const finalConfig: IApiClientConfig = {
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
        const networkError = createNetworkError(
            'Failed to create REST client',
            undefined,
            undefined
        );
        throw networkError;
    }
}

/**
 * Creates a REST client using dependency injection container.
 *
 * @param container - DI container instance
 * @param config - Optional configuration for the REST client
 * @returns REST client from DI container or fallback
 */
export function createRestClientFromDI(
    container: Container,
    config?: Partial<IApiClientConfig>
): IApiClient {
    try {
        // Try to get from DI container first
        return container.getByToken<IApiClient>(TYPES.REST_CLIENT);
    } catch (error) {
        // Fallback to direct creation
        console.warn('REST client not found in DI container, using fallback creation');
        return createRestClient(config);
    }
}

/**
 * Creates an API client for a specific environment.
 *
 * @param environment - Target environment (development, staging, production)
 * @param config - Optional additional configuration
 * @returns Environment-specific API client
 */
export function createApiClientForEnvironment(
    environment: 'development' | 'staging' | 'production',
    config?: Partial<IApiClientConfig>
): IApiClient {
    const envConfig = ENVIRONMENT_CONFIG[environment];

    if (!envConfig) {
        const networkError = createNetworkError(
            `Unknown environment: ${environment}`,
            undefined,
            undefined
        );
        throw networkError;
    }

    // Merge environment config with provided config
    const finalConfig: IApiClientConfig = {
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
 * @param token - Authentication token
 * @param config - Optional additional configuration
 * @returns Authenticated API client
 */
export function createAuthenticatedApiClient(
    token: string,
    config?: Partial<IApiClientConfig>
): IApiClient {
    const authConfig = {
        ...config,
        auth: {
            type: 'bearer' as const,
            token
        }
    };

    return createApiClient(authConfig);
}

/**
 * Creates an authenticated API client using dependency injection.
 *
 * @param container - DI container instance
 * @param token - Authentication token
 * @param config - Optional additional configuration
 * @returns Authenticated API client from DI container or fallback
 */
export function createAuthenticatedApiClientFromDI(
    container: Container,
    token: string,
    config?: Partial<IApiClientConfig>
): IApiClient {
    const authConfig = {
        ...config,
        auth: {
            type: 'bearer' as const,
            token
        }
    };

    return createApiClientFromDI(container, authConfig);
}

/**
 * Creates a mock API client for testing.
 *
 * @param config - Optional configuration for the mock client
 * @returns Mock API client instance
 */
export function createMockApiClient(config?: Partial<IApiClientConfig>): IApiClient {
    // This would typically use a mock implementation
    // For now, we'll create a real client with test configuration
    const mockConfig: IApiClientConfig = {
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
    private readonly factories = new Map<string, (config?: Partial<IApiClientConfig>) => IApiClient>();

    /**
     * Registers a custom factory function.
     */
    register(name: string, factory: (config?: Partial<IApiClientConfig>) => IApiClient): void {
        this.factories.set(name, factory);
    }

    /**
     * Creates a client using a registered factory.
     */
    create(name: string, config?: Partial<IApiClientConfig>): IApiClient {
        const factory = this.factories.get(name);
        if (!factory) {
            const networkError = createNetworkError(
                `Unknown factory: ${name}`,
                undefined,
                undefined
            );
            throw networkError;
        }
        return factory(config);
    }

    /**
     * Lists all registered factories.
     */
    list(): string[] {
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
 * @param factoryName - Name of the registered factory
 * @param config - Optional configuration
 * @returns API client from the specified factory
 */
export function createApiClientWithFactory(
    factoryName: string,
    config?: Partial<IApiClientConfig>
): IApiClient {
    return apiClientFactoryRegistry.create(factoryName, config);
}
