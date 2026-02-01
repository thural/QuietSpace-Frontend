/**
 * Authenticated API Service
 *
 * Provides a singleton API client with automatic authentication management.
 * This service follows enterprise patterns and integrates with the DI container.
 */

import { createAutoAuthApiClient } from '../authenticatedFactory';
import { SimpleTokenProvider } from '../authenticatedFactory';
import { type ITokenProvider } from '../authenticatedFactory';

import type { IApiClient } from '../interfaces';

// Token service interface for type safety
interface ITokenService {
    setToken(token: string): void;
    clearToken(): void;
    getToken(): string | undefined;
    subscribe(callback: (token: string | null) => void): () => void;
}

export class AuthenticatedApiService {
    private readonly apiClient: IApiClient;
    private readonly tokenProvider: ITokenProvider;

    constructor(private readonly tokenService?: unknown) {
        // Create token provider
        this.tokenProvider = new SimpleTokenProvider();

        // Create auto-authenticating API client
        this.apiClient = createAutoAuthApiClient(this.tokenProvider);

        // Initialize with existing token if available
        this.initializeFromTokenService();
    }

    /**
     * Get the authenticated API client
     */
    getApiClient(): IApiClient {
        return this.apiClient;
    }

    /**
     * Get the token provider
     */
    getTokenProvider(): ITokenProvider {
        return this.tokenProvider;
    }

    /**
     * Set authentication token
     */
    setToken(token: string): void {
        this.tokenProvider.setToken(token);

        // Update token service if available
        if (this.tokenService) {
            (this.tokenService as ITokenService).setToken(token);
        }
    }

    /**
     * Clear authentication token
     */
    clearToken(): void {
        this.tokenProvider.clearToken();

        // Update token service if available
        if (this.tokenService) {
            (this.tokenService as ITokenService).clearToken();
        }
    }

    /**
     * Check if authenticated
     */
    isAuthenticated(): boolean {
        return this.tokenProvider.hasToken();
    }

    /**
     * Get current token
     */
    getCurrentToken(): string | null {
        return this.tokenProvider.getToken();
    }

    /**
     * Initialize from token service if available
     */
    private initializeFromTokenService(): void {
        if (this.tokenService) {
            const existingToken = (this.tokenService as ITokenService).getToken();
            if (existingToken) {
                this.setToken(existingToken);
            }

            // Subscribe to token service changes
            const _unsubscribe = (this.tokenService as ITokenService).subscribe((token: string | null) => {
                if (token) {
                    this.tokenProvider.setToken(token);
                } else {
                    this.tokenProvider.clearToken();
                }
            });
        }
    }
}
