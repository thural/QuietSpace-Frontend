/**
 * Authenticated API Client Factory
 *
 * Provides pre-configured API clients with authentication already set up.
 * This follows the Black Box pattern and eliminates manual auth management.
 */

import { createApiClient } from './factory';
import { createApiError, ERROR_CODES } from './utils';

import type { IApiClient, IApiClientConfig, ApiError } from './interfaces';

// DI Container interface for type safety
interface IDIContainer {
    getByToken<T>(token: string): T;
}

/**
 * Creates an authenticated API client with token already configured
 *
 * @param token - Authentication token
 * @param config - Optional additional configuration
 * @returns Pre-configured authenticated API client
 */
export function createAuthenticatedApiClient(
    token: string,
    config?: Partial<IApiClientConfig>
): IApiClient {
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
 * @param container - DI container instance
 * @param token - Authentication token
 * @param config - Optional additional configuration
 * @returns Pre-configured authenticated API client from DI
 */
export function createAuthenticatedApiClientFromDI(
    container: IDIContainer,
    token: string,
    config?: Partial<IApiClientConfig>
): IApiClient {
    try {
        // Try to get authenticated client from DI container
        const client = container.getByToken<IApiClient>('AUTHENTICATED_API_CLIENT');

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
 * @param container - DI container instance
 * @returns Token provider interface
 */
export function createTokenProvider(container: IDIContainer): ITokenProvider {
    try {
        return container.getByToken<ITokenProvider>('TOKEN_PROVIDER');
    } catch {
        // Fallback to simple token provider
        return new SimpleTokenProvider();
    }
}

/**
 * Token provider interface
 */
export interface ITokenProvider {
    getToken(): string | null;
    setToken(token: string): void;
    clearToken(): void;
    hasToken(): boolean;
    subscribe(callback: (token: string | null) => void): () => void;
}

/**
 * Simple token provider implementation
 */
export class SimpleTokenProvider implements ITokenProvider {
    private token: string | null = null;
    private readonly subscribers: Set<(token: string | null) => void> = new Set();

    getToken(): string | null {
        return this.token;
    }

    setToken(token: string): void {
        this.token = token;
        this.notifySubscribers();
    }

    clearToken(): void {
        this.token = null;
        this.notifySubscribers();
    }

    hasToken(): boolean {
        return !!this.token;
    }

    subscribe(callback: (token: string | null) => void): () => void {
        this.subscribers.add(callback);
        callback(this.token);

        return () => {
            this.subscribers.delete(callback);
        };
    }

    private notifySubscribers(): void {
        this.subscribers.forEach(callback => callback(this.token));
    }
}

/**
 * Creates an auto-authenticating API client
 *
 * @param tokenProvider - Token provider for automatic auth management
 * @param config - Optional additional configuration
 * @returns Auto-authenticating API client
 */
export function createAutoAuthApiClient(
    tokenProvider: ITokenProvider,
    config?: Partial<IApiClientConfig>
): IApiClient {
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
