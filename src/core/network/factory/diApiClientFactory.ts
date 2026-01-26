/**
 * DI-based API Client Factory
 * 
 * Creates API clients with DI-based authentication instead of direct store access.
 * This follows the Black Box pattern and maintains proper separation of concerns.
 */

import type { IApiClient, IApiClientConfig, ITokenProvider } from '../interfaces';
import { createApiClient } from '../factory';
import { TokenProvider } from '../providers/TokenProvider';
import { createContainer, type Container } from '../../di/factory';
import { TYPES } from '../../di/types';

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
    const originalRequest = client as any;
    if (originalRequest.interceptors) {
        originalRequest.interceptors.response.use(
            (response: any) => response,
            async (error: any) => {
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
    const originalRequest = client as any;
    if (originalRequest.interceptors) {
        originalRequest.interceptors.request.use(
            (requestConfig: any) => {
                const token = tokenProvider.getToken();
                if (token) {
                    requestConfig.headers.Authorization = `Bearer ${token}`;
                }
                return requestConfig;
            },
            (error: any) => Promise.reject(error)
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
