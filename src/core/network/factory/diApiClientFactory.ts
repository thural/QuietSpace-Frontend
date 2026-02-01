/**
 * DI-based API Client Factory
 *
 * Creates API clients with DI-based authentication instead of direct store access.
 * This follows the Black Box pattern and maintains proper separation of concerns.
 */

import { type Container } from '../../di/factory';
import { createApiClient } from '../factory';
import { TokenProvider } from '../providers/TokenProvider';

import type { IApiClient, IApiClientConfig, ITokenProvider } from '../interfaces';

// Interceptor interfaces for type safety
interface IInterceptors {
    request?: {
        use: (onFulfilled: (config: unknown) => unknown, onRejected: (error: unknown) => unknown) => void;
    };
    response?: {
        use: (onFulfilled: (response: unknown) => unknown, onRejected: (error: unknown) => unknown) => void;
    };
}

interface IApiClientWithInterceptors extends IApiClient {
    interceptors?: IInterceptors;
}

interface IErrorWithConfig {
    response?: { status: number };
    config: { _retry?: boolean; headers?: Record<string, string> } & (() => unknown);
}

/**
 * Creates an API client with DI-based authentication
 *
 * @param container - DI container instance
 * @param config - Optional API client configuration
 * @returns API client with DI-based authentication
 */
export function createDIAuthenticatedApiClient(
    container: Container,
    config?: Partial<IApiClientConfig>
): IApiClient {
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
    const originalRequest = client as IApiClientWithInterceptors;
    if (originalRequest.interceptors) {
        originalRequest.interceptors.response?.use(
            (response: unknown) => response,
            async (error: unknown) => {
                const originalRequest = (error as IErrorWithConfig).config;

                // Handle 401 Unauthorized - Token expired
                if ((error as IErrorWithConfig).response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        // Use token provider to refresh
                        const newToken = await tokenProvider.refreshToken();

                        if (newToken) {
                            // Retry the original request with new token
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            }
                            return originalRequest();
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
 * @param container - DI container instance
 * @param config - Optional API client configuration
 * @returns API client with automatic token management
 */
export function createAutoAuthApiClient(
    container: Container,
    config?: Partial<IApiClientConfig>
): IApiClient {
    // Create token provider from DI container
    const tokenProvider = new TokenProvider(container);

    // Create API client
    const client = createApiClient(config);

    // Set up request interceptor for automatic token injection
    const originalRequest = client as IApiClientWithInterceptors;
    if (originalRequest.interceptors) {
        originalRequest.interceptors.request?.use(
            (requestConfig: unknown) => {
                const config = requestConfig as { headers: Record<string, string> };
                const token = tokenProvider.getToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return requestConfig;
            },
            (error: unknown) => Promise.reject(error)
        );
    }

    return client;
}

/**
 * Creates a token provider from DI container
 *
 * @param container - DI container instance
 * @returns Token provider instance
 */
export function createTokenProvider(container: Container): ITokenProvider {
    return new TokenProvider(container);
}

/**
 * Creates an API client factory function that uses DI
 *
 * @param container - DI container instance
 * @returns Factory function for creating authenticated API clients
 */
export function createApiClientFactory(container: Container) {
    return {
        createAuthenticated: (config?: Partial<IApiClientConfig>) =>
            createDIAuthenticatedApiClient(container, config),
        createAutoAuth: (config?: Partial<IApiClientConfig>) =>
            createAutoAuthApiClient(container, config),
        createTokenProvider: () => createTokenProvider(container)
    };
}
