/**
 * API Client Implementation
 * 
 * Internal implementation of the IApiClient interface.
 * This file is part of the internal implementation and should not be exported.
 */

import type {
    IApiClient,
    IApiClientConfig,
    ApiResponse,
    ApiConfig,
    ApiError,
    ApiHealthStatus,
    ApiMetrics
} from '../interfaces';
import {
    HTTP_STATUS,
    ERROR_CODES,
    CONTENT_TYPES,
    DEFAULT_REQUEST_HEADERS
} from '../constants';
import {
    createApiError,
    createSuccessResponse,
    createErrorResponse,
    generateRequestId,
    mergeHeaders,
    isJsonContent,
    parseJsonResponse
} from '../utils';

/**
 * Internal API Client implementation
 */
export class ApiClient implements IApiClient {
    private config: IApiClientConfig;
    private interceptors: {
        request: Array<(config: ApiConfig) => ApiConfig>;
        response: Array<(response: ApiResponse<any>) => ApiResponse<any>>;
        error: Array<(error: ApiError) => ApiError | Promise<ApiError>>;
    };

    constructor(config: IApiClientConfig) {
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

    async get<T>(url: string, config?: ApiConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'GET', url });
    }

    async post<T>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'POST', url, data });
    }

    async put<T>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'PUT', url, data });
    }

    async patch<T>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'PATCH', url, data });
    }

    async delete<T>(url: string, config?: ApiConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'DELETE', url });
    }

    setAuth(token: string): void {
        this.config.auth = {
            type: 'bearer',
            token
        };
    }

    clearAuth(): void {
        this.config.auth = undefined;
    }

    getAuth(): string | null {
        return this.config.auth?.token || null;
    }

    updateConfig(config: Partial<IApiClientConfig>): void {
        this.config = { ...this.config, ...config };
    }

    getConfig(): IApiClientConfig {
        return { ...this.config };
    }

    getHealth(): ApiHealthStatus {
        return {
            status: 'healthy',
            lastCheck: Date.now(),
            responseTime: 0,
            errorRate: 0,
            uptime: 0
        };
    }

    getMetrics(): ApiMetrics {
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

    private async request<T>(config: ApiConfig): Promise<ApiResponse<T>> {
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

            return createErrorResponse<T>(apiError);
        }
    }

    private async applyRequestInterceptors(config: ApiConfig): Promise<ApiConfig> {
        let finalConfig = { ...config };

        for (const interceptor of this.interceptors.request) {
            finalConfig = interceptor(finalConfig);
        }

        return finalConfig;
    }

    private async applyResponseInterceptors<T>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
        let finalResponse = { ...response };

        for (const interceptor of this.interceptors.response) {
            finalResponse = interceptor(finalResponse);
        }

        return finalResponse;
    }

    private async applyErrorInterceptors(error: any, requestId: string): Promise<ApiError> {
        let apiError = this.normalizeError(error);

        for (const interceptor of this.interceptors.error) {
            apiError = await interceptor(apiError);
        }

        return apiError;
    }

    private buildRequest(config: ApiConfig): RequestInit {
        const url = this.buildUrl(config.url!);
        const headers = this.buildHeaders(config);
        const body = this.buildBody(config.data, headers);

        return {
            method: config.method || 'GET',
            headers,
            body,
            signal: config.signal
        };
    }

    private buildUrl(path: string): string {
        const baseURL = this.config.baseURL || '';
        const url = path.startsWith('http') ? path : `${baseURL}${path}`;
        return url;
    }

    private buildHeaders(config: ApiConfig): Record<string, string> {
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

    private buildBody(data: any, headers: Record<string, string>): string | undefined {
        if (!data) return undefined;

        const contentType = headers['Content-Type'] || headers['content-type'];

        if (contentType?.includes('application/json')) {
            return JSON.stringify(data);
        }

        if (data instanceof FormData) {
            return data as any;
        }

        return String(data);
    }

    private async executeRequest(request: RequestInit): Promise<ApiResponse<any>> {
        const { method, headers, body, signal } = request;
        const url = (request as any).url || '';

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
            let data: any = null;
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
            const headersObj: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                headersObj[key] = value;
            });

            // Create success response
            return createSuccessResponse(data, response.status);

        } catch (error: any) {
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

    private normalizeError(error: any): ApiError {
        if (error && typeof error === 'object' && 'code' in error) {
            return error as ApiError;
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
