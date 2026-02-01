/**
 * Network Module Interfaces
 *
 * Defines public interfaces for the network system following Black Box pattern.
 * Internal implementation details are hidden from consumers.
 */

export interface IApiClient {
    // HTTP Methods
    get<T>(url: string, config?: ApiConfig): Promise<ApiResponse<T>>;
    post<T>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>>;
    put<T>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>>;
    patch<T>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>>;
    delete<T>(url: string, config?: ApiConfig): Promise<ApiResponse<T>>;

    // Authentication Management
    setAuth(token: string): void;
    clearAuth(): void;
    getAuth(): string | null;

    // Configuration
    updateConfig(config: Partial<IApiClientConfig>): void;
    getConfig(): IApiClientConfig;

    // Health and Metrics
    getHealth(): ApiHealthStatus;
    getMetrics(): ApiMetrics;
}

export interface IApiClientConfig {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
    auth?: AuthConfig;
    retryConfig?: RetryConfig;
    cacheConfig?: CacheConfig;
    interceptors?: InterceptorConfig;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    success: boolean;
    error?: ApiError;
    metadata?: ResponseMetadata;
}

export interface ApiError {
    code: string;
    message: string;
    details?: any;
    timestamp: number;
    stack?: string;
}

export interface AuthConfig {
    type: 'bearer' | 'basic' | 'custom';
    token?: string;
    username?: string;
    password?: string;
    customHeaders?: Record<string, string>;
}

export interface RetryConfig {
    maxAttempts: number;
    retryDelay: number;
    retryCondition?: (error: ApiError) => boolean;
    exponentialBackoff?: boolean;
}

export interface CacheConfig {
    enabled: boolean;
    ttl: number;
    maxSize?: number;
    keyGenerator?: (url: string, config?: ApiConfig) => string;
}

export interface InterceptorConfig {
    request?: RequestInterceptor[];
    response?: ResponseInterceptor[];
    error?: ErrorInterceptor[];
}

export type RequestInterceptor = (config: ApiConfig) => ApiConfig;

export type ResponseInterceptor = (response: ApiResponse<any>) => ApiResponse<any>;

export type ErrorInterceptor = (error: ApiError) => ApiError | Promise<ApiError>;

export interface ApiConfig {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    params?: Record<string, any>;
    data?: any;
    timeout?: number;
    signal?: AbortSignal;
}

export interface ResponseMetadata {
    duration: number;
    cached: boolean;
    retryCount: number;
    requestId: string;
}

export interface ApiHealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    lastCheck: number;
    responseTime: number;
    errorRate: number;
    uptime: number;
}

export interface ApiMetrics {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    cacheHitRate: number;
    retryRate: number;
    errorRate: number;
    requestsByStatus: Record<number, number>;
}

// Token Provider Interface
export interface ITokenProvider {
    getToken(): string | null;
    setToken(token: string): void;
    clearToken(): void;
    isAuthenticated(): boolean;
    refreshToken(): Promise<string | null>;
}

// HTTP Method Types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

// Content Types
export type ContentType = 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';

// Response Types
export type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream';
