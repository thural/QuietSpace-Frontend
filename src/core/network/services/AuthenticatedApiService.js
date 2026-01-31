/**
 * Authenticated API Service
 * 
 * Provides a singleton API client with automatic authentication management.
 * This service follows enterprise patterns and integrates with the DI container.
 */

import { createAutoAuthApiClient, SimpleTokenProvider } from '../authenticatedFactory.js';

/**
 * API client interface
 * @typedef {Object} IApiClient
 * @property {(url: string, config?: Object) => Promise<Object>} get - GET request
 * @property {(url: string, data?: any, config?: Object) => Promise<Object>} post - POST request
 * @property {(url: string, data?: any, config?: Object) => Promise<Object>} put - PUT request
 * @property {(url: string, data?: any, config?: Object) => Promise<Object>} patch - PATCH request
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
 * Authenticated API Service Implementation
 * @class AuthenticatedApiService
 * @description Singleton API client with automatic authentication management
 * @Injectable({ lifetime: 'singleton' })
 */
export class AuthenticatedApiService {
    /**
     * @type {IApiClient}
     */
    apiClient;

    /**
     * @type {SimpleTokenProvider}
     */
    tokenProvider;

    /**
     * @type {Object}
     */
    config;

    /**
     * Creates an authenticated API service
     * @param {Object} tokenService - Token service from DI container
     */
    constructor(tokenService) {
        this.tokenProvider = new SimpleTokenProvider();
        this.config = {
            baseURL: process.env.API_BASE_URL || 'https://api.example.com',
            timeout: 10000,
            retries: 3,
            retryDelay: 1000
        };

        // Initialize API client with authentication
        this.apiClient = createAutoAuthApiClient({
            baseURL: this.config.baseURL,
            timeout: this.config.timeout,
            tokenProvider: this.tokenProvider
        });

        // Set up token service integration
        if (tokenService && tokenService.getToken) {
            this.tokenProvider.setToken(tokenService.getToken());
        }
    }

    /**
     * Makes a GET request
     * @param {string} url - Request URL
     * @param {Object} [config] - Request configuration
     * @returns {Promise<Object>} Response data
     */
    async get(url, config = {}) {
        return this.apiClient.get(url, config);
    }

    /**
     * Makes a POST request
     * @param {string} url - Request URL
     * @param {any} [data] - Request data
     * @param {Object} [config] - Request configuration
     * @returns {Promise<Object>} Response data
     */
    async post(url, data, config = {}) {
        return this.apiClient.post(url, data, config);
    }

    /**
     * Makes a PUT request
     * @param {string} url - Request URL
     * @param {any} [data] - Request data
     * @param {Object} [config] - Request configuration
     * @returns {Promise<Object>} Response data
     */
    async put(url, data, config = {}) {
        return this.apiClient.put(url, data, config);
    }

    /**
     * Makes a PATCH request
     * @param {string} url - Request URL
     * @param {any} [data] - Request data
     * @param {Object} [config] - Request configuration
     * @returns {Promise<Object>} Response data
     */
    async patch(url, data, config = {}) {
        return this.apiClient.patch(url, data, config);
    }

    /**
     * Makes a DELETE request
     * @param {string} url - Request URL
     * @param {Object} [config] - Request configuration
     * @returns {Promise<Object>} Response data
     */
    async delete(url, config = {}) {
        return this.apiClient.delete(url, config);
    }

    /**
     * Sets authentication token
     * @param {string} token - Authentication token
     * @returns {void}
     */
    setAuth(token) {
        this.tokenProvider.setToken(token);
    }

    /**
     * Clears authentication
     * @returns {void}
     */
    clearAuth() {
        this.tokenProvider.clearToken();
    }

    /**
     * Gets current authentication token
     * @returns {string|null} Authentication token
     */
    getAuth() {
        return this.tokenProvider.getToken();
    }

    /**
     * Updates service configuration
     * @param {Object} newConfig - New configuration
     * @returns {void}
     */
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        this.apiClient.updateConfig(this.config);
    }

    /**
     * Gets current configuration
     * @returns {Object} Current configuration
     */
    getConfig() {
        return { ...this.config };
    }

    /**
     * Gets service health status
     * @returns {Object} Health status
     */
    getHealth() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            apiClient: this.apiClient.getHealth(),
            tokenProvider: {
                hasToken: !!this.tokenProvider.getToken(),
                tokenLength: this.tokenProvider.getToken()?.length || 0
            }
        };
    }

    /**
     * Gets service metrics
     * @returns {Object} Service metrics
     */
    getMetrics() {
        return {
            ...this.apiClient.getMetrics(),
            tokenProvider: this.tokenProvider.getMetrics()
        };
    }

    /**
     * Uploads a file
     * @param {string} url - Upload URL
     * @param {File|Blob} file - File to upload
     * @param {Object} [config] - Upload configuration
     * @returns {Promise<Object>} Upload response
     */
    async upload(url, file, config = {}) {
        const formData = new FormData();
        formData.append('file', file);

        return this.apiClient.post(url, formData, {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config.headers
            }
        });
    }

    /**
     * Downloads a file
     * @param {string} url - Download URL
     * @param {Object} [config] - Download configuration
     * @returns {Promise<Blob>} File data
     */
    async download(url, config = {}) {
        const response = await this.apiClient.get(url, {
            ...config,
            responseType: 'blob'
        });
        return response.data;
    }

    /**
     * Makes a batch request
     * @param {Array<Object>} requests - Array of request objects
     * @returns {Promise<Array<Object>>} Array of responses
     */
    async batch(requests) {
        const promises = requests.map(request => {
            const { method, url, data, config } = request;
            switch (method.toLowerCase()) {
                case 'get':
                    return this.get(url, config);
                case 'post':
                    return this.post(url, data, config);
                case 'put':
                    return this.put(url, data, config);
                case 'patch':
                    return this.patch(url, data, config);
                case 'delete':
                    return this.delete(url, config);
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }
        });

        return Promise.all(promises);
    }

    /**
     * Refreshes authentication token
     * @returns {Promise<boolean>} Whether refresh was successful
     */
    async refreshToken() {
        try {
            // In a real implementation, this would call a refresh endpoint
            // For now, simulate token refresh
            const currentToken = this.tokenProvider.getToken();
            if (currentToken) {
                // Simulate token refresh
                const newToken = currentToken + '_refreshed';
                this.tokenProvider.setToken(newToken);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    /**
     * Checks if the service is authenticated
     * @returns {boolean} Whether service is authenticated
     */
    isAuthenticated() {
        return !!this.tokenProvider.getToken();
    }

    /**
     * Gets authentication headers
     * @returns {Object} Authentication headers
     */
    getAuthHeaders() {
        const token = this.tokenProvider.getToken();
        return token ? {
            'Authorization': `Bearer ${token}`
        } : {};
    }

    /**
     * Sets up automatic token refresh
     * @param {number} interval - Refresh interval in milliseconds
     * @returns {NodeJS.Timeout} Timer reference
     */
    setupAutoRefresh(interval = 300000) { // 5 minutes default
        return setInterval(async () => {
            if (this.isAuthenticated()) {
                await this.refreshToken();
            }
        }, interval);
    }

    /**
     * Clears all resources
     * @returns {void}
     */
    cleanup() {
        this.clearAuth();
        if (this.apiClient.cleanup) {
            this.apiClient.cleanup();
        }
    }
}
