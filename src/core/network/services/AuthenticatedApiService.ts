/**
 * Authenticated API Service
 *
 * Provides a singleton API client with automatic authentication management.
 * This service follows enterprise patterns and integrates with the DI container.
 */

import { Injectable, Inject } from '../../di';
import { TYPES } from '../../di/types';
import { createAutoAuthApiClient } from '../authenticatedFactory';
import { SimpleTokenProvider } from '../authenticatedFactory';
import { type ITokenProvider } from '../authenticatedFactory';

import type { IApiClient } from '../interfaces';

@Injectable({ lifetime: 'singleton' })
export class AuthenticatedApiService {
    private readonly apiClient: IApiClient;
    private readonly tokenProvider: ITokenProvider;

    constructor(@Inject(TYPES.TOKEN_SERVICE) private readonly tokenService?: any) {
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
            this.tokenService.setToken(token);
        }
    }

    /**
     * Clear authentication token
     */
    clearToken(): void {
        this.tokenProvider.clearToken();

        // Update token service if available
        if (this.tokenService) {
            this.tokenService.clearToken();
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
            const existingToken = this.tokenService.getToken();
            if (existingToken) {
                this.setToken(existingToken);
            }

            // Subscribe to token service changes
            if (this.tokenService.subscribe) {
                this.tokenService.subscribe((token: string | null) => {
                    if (token) {
                        this.tokenProvider.setToken(token);
                    } else {
                        this.tokenProvider.clearToken();
                    }
                });
            }
        }
    }
}
