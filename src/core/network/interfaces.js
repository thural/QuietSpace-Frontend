/**
 * Network Module Interfaces
 * 
 * Defines public interfaces for the network system following Black Box pattern.
 * Internal implementation details are hidden from consumers.
 */

/**
 * API configuration interface
 * @typedef {Object} ApiConfig
 * @property {number} [timeout] - Request timeout
 * @property {Object} [headers] - Request headers
 * @property {AbortSignal} [signal] - Abort signal
 * @property {Function} [onUploadProgress] - Upload progress callback
 * @property {Function} [onDownloadProgress] - Download progress callback
 */

/**
 * API response interface
 * @typedef {Object} ApiResponse
 * @property {*} [data] - Response data
 * @property {boolean} success - Success flag
 * @property {string} [message] - Response message
 * @property {string} [error] - Error message
 * @property {number} [status] - HTTP status
 * @property {Object} [headers] - Response headers
 */

/**
 * API error interface
 * @typedef {Object} ApiError
 * @property {string} code - Error code
 * @property {string} message - Error message
 * @property {*} [details] - Error details
 * @property {number} timestamp - Error timestamp
 * @property {string} [stack] - Error stack trace
 */

/**
 * API Client interface for handling HTTP requests and responses
 * 
 * @interface IApiClient
 * @description Provides methods for HTTP operations, authentication, configuration, and health monitoring
 * @typedef {Object} IApiClient
 * @property {(url: string, config?: ApiConfig) => Promise<ApiResponse>} get - Performs HTTP GET request
 * @property {(url: string, data?: any, config?: ApiConfig) => Promise<ApiResponse>} post - Performs HTTP POST request
 * @property {(url: string, data?: any, config?: ApiConfig) => Promise<ApiResponse>} put - Performs HTTP PUT request
 * @property {(url: string, data?: any, config?: ApiConfig) => Promise<ApiResponse>} patch - Performs HTTP PATCH request
 * @property {(url: string, config?: ApiConfig) => Promise<ApiResponse>} delete - Performs HTTP DELETE request
 * @property {(token: string) => void} setAuth - Sets authentication token
 * @property {() => void} clearAuth - Clears authentication token
 * @property {() => string|null} getAuth - Gets current authentication token
 * @property {(config: Partial<IApiClientConfig>) => void} updateConfig - Updates API client configuration
 * @property {() => IApiClientConfig} getConfig - Gets current API client configuration
 * @property {() => ApiHealthStatus} getHealth - Gets health status
 * @property {() => ApiMetrics} getMetrics - Gets performance metrics
 */

/**
 * API Client configuration interface
 * 
 * @interface IApiClientConfig
 * @description Configuration options for the API client including base URL, timeout, headers, and advanced features
 * @typedef {Object} IApiClientConfig
 * @property {string} [baseURL] - Base URL for all API requests
 * @property {number} [timeout] - Request timeout in milliseconds
 * @property {Object} [headers] - Default headers to include with all requests
 * @property {Object} [auth] - Authentication configuration
 * @property {Object} [retry] - Retry configuration
 * @property {Object} [cache] - Cache configuration
 * @property {boolean} [enableMetrics] - Enable metrics collection
 * @property {boolean} [enableLogging] - Enable request logging
 * @property {Function} [transformRequest] - Request transformer
 * @property {Function} [transformResponse] - Response transformer
 * @property {Function} [validateStatus] - Status validator
 */

/**
 * Authentication configuration interface
 * @typedef {Object} AuthConfig
 * @property {string} [type] - Authentication type
 * @property {string} [token] - Authentication token
 * @property {Function} [refreshToken] - Token refresh function
 * @property {boolean} [autoRefresh] - Auto refresh tokens
 * @property {number} [refreshThreshold] - Refresh threshold in milliseconds
 */

/**
 * Retry configuration interface
 * @typedef {Object} RetryConfig
 * @property {number} [attempts] - Number of retry attempts
 * @property {number} [delay] - Delay between retries
 * @property {number} [backoffMultiplier] - Backoff multiplier
 * @property {Function} [condition] - Retry condition function
 * @property {Array<number>} [statusCodes] - Status codes to retry
 */

/**
 * Cache configuration interface
 * @typedef {Object} CacheConfig
 * @property {boolean} [enabled] - Enable caching
 * @property {number} [ttl] - Time to live in milliseconds
 * @property {number} [maxSize] - Maximum cache size
 * @property {string} [strategy] - Cache strategy
 * @property {Function} [keyGenerator] - Cache key generator
 */

/**
 * API health status interface
 * @typedef {Object} ApiHealthStatus
 * @property {boolean} healthy - Health status
 * @property {string} status - Status message
 * @property {number} responseTime - Response time in milliseconds
 * @property {number} uptime - Uptime percentage
 */

/**
 * API metrics interface
 * @typedef {Object} ApiMetrics
 * @property {number} totalRequests - Total number of requests
 * @property {number} successfulRequests - Number of successful requests
 * @property {number} failedRequests - Number of failed requests
 * @property {number} averageResponseTime - Average response time in milliseconds
 * @property {number} cacheHitRate - Cache hit rate as percentage
 * @property {number} retryRate - Retry rate as percentage
 * @property {number} errorRate - Error rate as percentage
 * @property {Object} requestsByStatus - Request count grouped by HTTP status code
 */

/**
 * Token provider interface
 * 
 * @interface ITokenProvider
 * @description Interface for managing authentication tokens
 * @typedef {Object} ITokenProvider
 * @property {() => string|null} getToken - Gets current authentication token
 * @property {(token: string) => void} setToken - Sets authentication token
 * @property {() => void} clearToken - Clears authentication token
 * @property {() => boolean} isAuthenticated - Checks if authenticated
 * @property {() => boolean} isExpired - Checks if token is expired
 * @property {() => Promise<string|null>} refreshToken - Refreshes token
 */

// Export all interfaces for external use
export {
    IApiClient,
    IApiClientConfig,
    ApiConfig,
    ApiResponse,
    ApiError,
    AuthConfig,
    RetryConfig,
    CacheConfig,
    ApiHealthStatus,
    ApiMetrics,
    ITokenProvider
};
     * 
     * @type { AuthConfig }
     */
auth ?: AuthConfig;

/**
 * Retry configuration for failed requests
 * 
 * @type {RetryConfig}
 */
retryConfig ?: RetryConfig;

/**
 * Cache configuration for request caching
 * 
 * @type {CacheConfig}
 */
cacheConfig ?: CacheConfig;

/**
 * Interceptor configuration for request/response processing
 * 
 * @type {InterceptorConfig}
 */
interceptors ?: InterceptorConfig;
}

/**
 * API response wrapper interface
 * 
 * @interface ApiResponse
 * @description Wraps API response data with metadata and error information
 * @template T - The response data type
 */
export interface ApiResponse<T> {
    /**
     * Response data payload
     * 
     * @type {T}
     */
    data: T;

    /**
     * HTTP status code
     * 
     * @type {number}
     */
    status: number;

    /**
     * HTTP status text
     * 
     * @type {string}
     */
    statusText: string;

    /**
     * Response headers
     * 
     * @type {Record<string, string>}
     */
    headers: Record<string, string>;

    /**
     * Whether the request was successful
     * 
     * @type {boolean}
     */
    success: boolean;

    /**
     * Error information if request failed
     * 
     * @type {ApiError}
     */
    error?: ApiError;

    /**
     * Additional response metadata
     * 
     * @type {ResponseMetadata}
     */
    metadata?: ResponseMetadata;
}

/**
 * API error interface
 * 
 * @interface ApiError
 * @description Contains error details for failed API requests
 */
export interface ApiError {
    /**
     * Error code for programmatic handling
     * 
     * @type {string}
     */
    code: string;

    /**
     * Human-readable error message
     * 
     * @type {string}
     */
    message: string;

    /**
     * Additional error details
     * 
     * @type {any}
     */
    details?: any;

    /**
     * Error timestamp
     * 
     * @type {number}
     */
    timestamp: number;

    /**
     * Error stack trace for debugging
     * 
     * @type {string}
     */
    stack?: string;
}

/**
 * Authentication configuration interface
 * 
 * @interface AuthConfig
 * @description Configuration for authentication methods and credentials
 */
export interface AuthConfig {
    /**
     * Authentication type
     * 
     * @type {'bearer' | 'basic' | 'custom'}
     */
    type: 'bearer' | 'basic' | 'custom';

    /**
     * Authentication token for bearer type
     * 
     * @type {string}
     */
    token?: string;

    /**
     * Username for basic authentication
     * 
     * @type {string}
     */
    username?: string;

    /**
     * Password for basic authentication
     * 
     * @type {string}
     */
    password?: string;

    /**
     * Custom headers for custom authentication
     * 
     * @type {Record<string, string>}
     */
    customHeaders?: Record<string, string>;
}

/**
 * Retry configuration interface
 * 
 * @interface RetryConfig
 * @description Configuration for request retry behavior
 */
export interface RetryConfig {
    /**
     * Maximum number of retry attempts
     * 
     * @type {number}
     */
    maxAttempts: number;

    /**
     * Delay between retry attempts in milliseconds
     * 
     * @type {number}
     */
    retryDelay: number;

    /**
     * Function to determine if a request should be retried
     * 
     * @param {ApiError} error - The error that occurred
     * @returns {boolean} Whether to retry the request
     */
    retryCondition?: (error: ApiError) => boolean;

    /**
     * Whether to use exponential backoff for retries
     * 
     * @type {boolean}
     */
    exponentialBackoff?: boolean;
}

/**
 * Cache configuration interface
 * 
 * @interface CacheConfig
 * @description Configuration for request caching behavior
 */
export interface CacheConfig {
    /**
     * Whether caching is enabled
     * 
     * @type {boolean}
     */
    enabled: boolean;

    /**
     * Time to live for cache entries in milliseconds
     * 
     * @type {number}
     */
    ttl: number;

    /**
     * Maximum cache size
     * 
     * @type {number}
     */
    maxSize?: number;

    /**
     * Function to generate cache keys
     * 
     * @param {string} url - The request URL
     * @param {ApiConfig} [config] - Optional request configuration
     * @returns {string} The cache key
     */
    keyGenerator?: (url: string, config?: ApiConfig) => string;
}

/**
 * Interceptor configuration interface
 * 
 * @interface InterceptorConfig
 * @description Configuration for request/response interceptors
 */
export interface InterceptorConfig {
    /**
     * Request interceptors
     * 
     * @type {RequestInterceptor[]}
     */
    request?: RequestInterceptor[];

    /**
     * Response interceptors
     * 
     * @type {ResponseInterceptor[]}
     */
    response?: ResponseInterceptor[];

    /**
     * Error interceptors
     * 
     * @type {ErrorInterceptor[]}
     */
    error?: ErrorInterceptor[];
}

/**
 * Request interceptor function interface
 * 
 * @interface RequestInterceptor
 * @description Function to transform request configuration before sending
 */
export interface RequestInterceptor {
    /**
     * Intercepts and transforms request configuration
     * 
     * @param {ApiConfig} config - The request configuration
     * @returns {ApiConfig} The transformed configuration
     */
    (config: ApiConfig): ApiConfig;
}

/**
 * Response interceptor function interface
 * 
 * @interface ResponseInterceptor
 * @description Function to transform response data after receiving
 */
export interface ResponseInterceptor {
    /**
     * Intercepts and transforms response data
     * 
     * @param {ApiResponse<any>} response - The API response
     * @returns {ApiResponse<any>} The transformed response
     */
    (response: ApiResponse<any>): ApiResponse<any>;
}

/**
 * Error interceptor function interface
 * 
 * @interface ErrorInterceptor
 * @description Function to handle or transform errors
 */
export interface ErrorInterceptor {
    /**
     * Intercepts and handles errors
     * 
     * @param {ApiError} error - The error that occurred
     * @returns {ApiError | Promise<ApiError>} The handled error or a promise resolving to one
     */
    (error: ApiError): ApiError | Promise<ApiError>;
}

/**
 * API request configuration interface
 * 
 * @interface ApiConfig
 * @description Configuration for individual API requests
 */
export interface ApiConfig {
    /**
     * Request URL
     * 
     * @type {string}
     */
    url?: string;

    /**
     * HTTP method
     * 
     * @type {string}
     */
    method?: string;

    /**
     * Request headers
     * 
     * @type {Record<string, string>}
     */
    headers?: Record<string, string>;

    /**
     * URL parameters
     * 
     * @type {Record<string, any>}
     */
    params?: Record<string, any>;

    /**
     * Request payload data
     * 
     * @type {any}
     */
    data?: any;

    /**
     * Request timeout in milliseconds
     * 
     * @type {number}
     */
    timeout?: number;

    /**
     * Abort signal for cancelling requests
     * 
     * @type {AbortSignal}
     */
    signal?: AbortSignal;
}

/**
 * Response metadata interface
 * 
 * @interface ResponseMetadata
 * @description Additional metadata about the API response
 */
export interface ResponseMetadata {
    /**
     * Request duration in milliseconds
     * 
     * @type {number}
     */
    duration: number;

    /**
     * Whether the response was served from cache
     * 
     * @type {boolean}
     */
    cached: boolean;

    /**
     * Number of retry attempts
     * 
     * @type {number}
     */
    retryCount: number;

    /**
     * Unique request identifier
     * 
     * @type {string}
     */
    requestId: string;
}

/**
 * API health status interface
 * 
 * @interface ApiHealthStatus
 * @description Health monitoring information for the API client
 */
export interface ApiHealthStatus {
    /**
     * Current health status
     * 
     * @type {'healthy' | 'degraded' | 'unhealthy'}
     */
    status: 'healthy' | 'degraded' | 'unhealthy';

    /**
     * Timestamp of last health check
     * 
     * @type {number}
     */
    lastCheck: number;

    /**
     * Average response time in milliseconds
     * 
     * @type {number}
     */
    responseTime: number;

    /**
     * Current error rate as percentage
     * 
     * @type {number}
     */
    errorRate: number;

    /**
     * Uptime percentage
     * 
     * @type {number}
     */
    uptime: number;
}

/**
 * API metrics interface
 * 
 * @interface ApiMetrics
 * @description Performance metrics for the API client
 */
export interface ApiMetrics {
    /**
     * Total number of requests made
     * 
     * @type {number}
     */
    totalRequests: number;

    /**
     * Number of successful requests
     * 
     * @type {number}
     */
    successfulRequests: number;

    /**
     * Number of failed requests
     * 
     * @type {number}
     */
    failedRequests: number;

    /**
     * Average response time in milliseconds
     * 
     * @type {number}
     */
    averageResponseTime: number;

    /**
     * Cache hit rate as percentage
     * 
     * @type {number}
     */
    cacheHitRate: number;

    /**
     * Retry rate as percentage
     * 
     * @type {number}
     */
    retryRate: number;

    /**
     * Error rate as percentage
     * 
     * @type {number}
     */
    errorRate: number;

    /**
     * Request count grouped by HTTP status code
     * 
     * @type {Record<number, number>}
     */
    requestsByStatus: Record<number, number>;
}

/**
 * Token provider interface
 * 
 * @interface ITokenProvider
 * @description Interface for managing authentication tokens
 */
export interface ITokenProvider {
    /**
     * Gets the current authentication token
     * 
     * @returns {string | null} The current token or null if not authenticated
     */
    getToken(): string | null;

    /**
     * Sets the authentication token
     * 
     * @param {string} token - The token to set
     * @returns {void}
     */
    setToken(token: string): void;

    /**
     * Clears the authentication token
     * 
     * @returns {void}
     */
    clearToken(): void;

    /**
     * Checks if currently authenticated
     * 
     * @returns {boolean} True if authenticated, false otherwise
     */
    isAuthenticated(): boolean;

    /**
     * Refreshes the authentication token
     * 
     * @returns {Promise<string | null>} The new token or null if refresh failed
     */
    refreshToken(): Promise<string | null>;
}

/**
 * HTTP method type
 * 
 * @typedef {('GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS')} HttpMethod
 * @description Supported HTTP methods for API requests
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * Content type for API requests
 * 
 * @typedef {('application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain')} ContentType
 * @description Supported content types for request payloads
 */
export type ContentType = 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';

/**
 * Response type for API responses
 * 
 * @typedef {('json' | 'text' | 'blob' | 'arrayBuffer' | 'stream')} ResponseType
 * @description Supported response types for API responses
 */
export type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream';
