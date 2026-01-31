/**
 * API Client Implementation
 * 
 * Internal implementation of the IApiClient interface.
 * This file is part of the internal implementation and should not be exported.
 */

import {
    HTTP_STATUS,
    ERROR_CODES,
    CONTENT_TYPES,
    DEFAULT_REQUEST_HEADERS
} from '../constants.js';
import {
    createApiError,
    createSuccessResponse,
    createErrorResponse,
    generateRequestId,
    mergeHeaders,
    isJsonContent,
    parseJsonResponse
} from '../utils.js';

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
 * API response interface
 * @typedef {Object} ApiResponse
 * @property {*} data - Response data
 * @property {number} status - HTTP status code
 * @property {Object} headers - Response headers
 * @property {Object} metadata - Response metadata
 */

/**
 * API config interface
 * @typedef {Object} ApiConfig
 * @property {string} [method] - HTTP method
 * @property {string} [url] - Request URL
 * @property {*} [data] - Request data
 * @property {Object} [headers] - Request headers
 * @property {AbortSignal} [signal] - Abort signal
 */

/**
 * API error interface
 * @typedef {Object} ApiError
 * @property {string} code - Error code
 * @property {string} message - Error message
 * @property {Object} [details] - Error details
 * @property {number} [status] - HTTP status code
 */

/**
 * API health status interface
 * @typedef {Object} ApiHealthStatus
 * @property {string} status - Health status
 * @property {number} lastCheck - Last check timestamp
 * @property {number} responseTime - Response time
 * @property {number} errorRate - Error rate
 * @property {number} uptime - Uptime
 */

/**
 * API metrics interface
 * @typedef {Object} ApiMetrics
 * @property {number} totalRequests - Total requests
 * @property {number} successfulRequests - Successful requests
 * @property {number} failedRequests - Failed requests
 * @property {number} averageResponseTime - Average response time
 * @property {number} cacheHitRate - Cache hit rate
 * @property {number} retryRate - Retry rate
 * @property {number} errorRate - Error rate
 * @property {Object} requestsByStatus - Requests by status
 */

/**
 * Internal API Client implementation
 */
export class ApiClient {
    constructor(config) {
        this.config = {
            baseURL: '',
            timeout: 10000,
            headers: { ...DEFAULT_REQUEST_HEADERS },
            retryConfig: {
                maxAttempts: 3,
                retryDelay: 1000,
                exponentialBackoff: true
            },
            cacheConfig: {
                enabled: true,
                ttl: 300000
            },
            ...config
        };

        this.interceptors = {
            request: [],
            response: [],
            error: []
        };
    }

    async get(url, config) {
        return this.request({ ...config, method: 'GET', url });
    }

    async post(url, data, config) {
        return this.request({ ...config, method: 'POST', url, data });
    }

    async put(url, data, config) {
        return this.request({ ...config, method: 'PUT', url, data });
    }

    async patch(url, data, config) {
        return this.request({ ...config, method: 'PATCH', url, data });
    }

    async delete(url, config) {
        return this.request({ ...config, method: 'DELETE', url });
    }

    setAuth(token) {
        this.config.auth = {
            type: 'bearer',
            token
        };
    }

    clearAuth() {
        this.config.auth = undefined;
    }

    getAuth() {
        return this.config.auth?.token || null;
    }

    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }

    getConfig() {
        return { ...this.config };
    }

    getHealth() {
        return {
            status: 'healthy',
            lastCheck: Date.now(),
            responseTime: 0,
            errorRate: 0,
            uptime: 0
        };
    }

    getMetrics() {
        return {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            cacheHitRate: 0,
            retryRate: 0,
            errorRate: 0,
            requestsByStatus: {}
        };
    }

    async request(config) {
        const requestId = generateRequestId();
        const startTime = Date.now();

        try {
            // Apply request interceptors
            let finalConfig = await this.applyRequestInterceptors(config);

            // Build final request
            const request = this.buildRequest(finalConfig);

            // Execute request
            const response = await this.executeRequest(request);

            // Apply response interceptors
            const finalResponse = await this.applyResponseInterceptors(response);

            // Calculate duration
            const duration = Date.now() - startTime;

            return {
                ...finalResponse,
                metadata: {
                    duration,
                    cached: false,
                    retryCount: 0,
                    requestId
                }
            };

        } catch (error) {
            // Apply error interceptors
            const apiError = await this.applyErrorInterceptors(error, requestId);

            return createErrorResponse(apiError);
        }
    }

    async applyRequestInterceptors(config) {
        let finalConfig = { ...config };

        for (const interceptor of this.interceptors.request) {
            finalConfig = interceptor(finalConfig);
        }

        return finalConfig;
    }

    async applyResponseInterceptors(response) {
        let finalResponse = { ...response };

        for (const interceptor of this.interceptors.response) {
            finalResponse = interceptor(finalResponse);
        }

        return finalResponse;
    }

    async applyErrorInterceptors(error, requestId) {
        let apiError = this.normalizeError(error);

        for (const interceptor of this.interceptors.error) {
            apiError = await interceptor(apiError);
        }

        return apiError;
    }

    buildRequest(config) {
        const url = this.buildUrl(config.url);
        const headers = this.buildHeaders(config);
        const body = this.buildBody(config.data, headers);

        return {
            method: config.method || 'GET',
            headers,
            body,
            signal: config.signal
        };
    }

    buildUrl(path) {
        const baseURL = this.config.baseURL || '';
        const url = path.startsWith('http') ? path : `${baseURL}${path}`;
        return url;
    }

    buildHeaders(config) {
        let headers = mergeHeaders(
            this.config.headers || {},
            config.headers || {}
        );

        // Add auth header
        if (this.config.auth) {
            if (this.config.auth.type === 'bearer' && this.config.auth.token) {
                headers['Authorization'] = `Bearer ${this.config.auth.token}`;
            }
        }

        return headers;
    }

    buildBody(data, headers) {
        if (!data) return undefined;

        const contentType = headers['Content-Type'] || headers['content-type'];

        if (contentType?.includes('application/json')) {
            return JSON.stringify(data);
        }

        if (data instanceof FormData) {
            return data;
        }

        return String(data);
    }

    async executeRequest(request) {
        const { method, headers, body, signal } = request;
        const url = request.url || '';

        try {
            // Create AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout || 10000);

            // Combine signals if provided
            if (signal) {
                signal.addEventListener('abort', () => {
                    clearTimeout(timeoutId);
                    controller.abort();
                });
            }

            // Execute fetch request
            const response = await fetch(url, {
                method,
                headers,
                body,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Parse response
            let data = null;
            const contentType = response.headers.get('content-type') || '';

            if (contentType.includes('application/json')) {
                const text = await response.text();
                data = text ? JSON.parse(text) : null;
            } else if (contentType.includes('text/')) {
                data = await response.text();
            } else {
                data = await response.blob();
            }

            // Convert headers to object
            const headersObj = {};
            response.headers.forEach((value, key) => {
                headersObj[key] = value;
            });

            // Create success response
            return createSuccessResponse(data, response.status);

        } catch (error) {
            // Handle different error types
            if (error.name === 'AbortError') {
                throw createApiError(
                    ERROR_CODES.TIMEOUT_ERROR,
                    'Request timeout',
                    { timeout: this.config.timeout }
                );
            }

            if (error instanceof TypeError) {
                throw createApiError(
                    ERROR_CODES.NETWORK_ERROR,
                    'Network error occurred',
                    { originalError: error }
                );
            }

            throw createApiError(
                ERROR_CODES.UNKNOWN_ERROR,
                error.message || 'Unknown error occurred',
                { originalError: error }
            );
        }
    }

    normalizeError(error) {
        if (error && typeof error === 'object' && 'code' in error) {
            return error;
        }

        if (error instanceof Error) {
            return createApiError(
                ERROR_CODES.UNKNOWN_ERROR,
                error.message,
                { originalError: error }
            );
        }

        return createApiError(
            ERROR_CODES.UNKNOWN_ERROR,
            'Unknown error occurred',
            { originalError: error }
        );
    }
}
