/**
 * Authenticated API Service
 * 
 * Provides a singleton API client with automatic authentication management.
 * This service follows enterprise patterns and integrates with the DI container.
 */

import { Injectable, Inject } from '../../di/index.js';
import { createAutoAuthApiClient } from '../authenticatedFactory.js';
import { SimpleTokenProvider } from '../authenticatedFactory.js';
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
 * Token provider interface
 * @typedef {Object} ITokenProvider
 * @property {() => string|null} getToken - Get current token
 * @property {(token: string) => void} setToken - Set token
 * @property {() => void} clearToken - Clear token
 * @property {() => boolean} hasToken - Check if token exists
 * @property {(callback: Function) => Function} subscribe - Subscribe to token changes
 * @property {() => Promise<string|null>} refreshToken - Refresh token
 */

@Injectable({ lifetime: 'singleton' })
export class AuthenticatedApiService {
    constructor(tokenService) {
        this.tokenService = tokenService;
        // Create token provider
        this.tokenProvider = new SimpleTokenProvider();

        // Create auto-authenticating API client
        this.apiClient = createAutoAuthApiClient(this.tokenProvider);

        // Initialize with existing token if available
        this.initializeFromTokenService();
    }

    /**
     * Get the authenticated API client
     * @returns {IApiClient} The API client
     */
    getApiClient() {
        return this.apiClient;
    }

    /**
     * Get the token provider
     * @returns {ITokenProvider} The token provider
     */
    getTokenProvider() {
        return this.tokenProvider;
    }

    /**
     * Set authentication token
     * @param {string} token - Authentication token
     */
    setToken(token) {
        this.tokenProvider.setToken(token);

        // Update token service if available
        if (this.tokenService) {
            this.tokenService.setToken(token);
        }
    }

    /**
     * Clear authentication token
     */
    clearToken() {
        this.tokenProvider.clearToken();

        // Update token service if available
        if (this.tokenService) {
            this.tokenService.clearToken();
        }
    }

    /**
     * Check if authenticated
     * @returns {boolean} Whether authenticated
     */
    isAuthenticated() {
        return this.tokenProvider.hasToken();
    }

    /**
     * Get current token
     * @returns {string|null} Current token
     */
    getCurrentToken() {
        return this.tokenProvider.getToken();
    }

    /**
     * Initialize from token service if available
     * @private
     */
    initializeFromTokenService() {
        if (this.tokenService) {
            const existingToken = this.tokenService.getToken();
            if (existingToken) {
                this.setToken(existingToken);
            }

            // Subscribe to token service changes
            if (this.tokenService.subscribe) {
                this.tokenService.subscribe((token) => {
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
