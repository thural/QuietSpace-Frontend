/**
 * Network System Interfaces
 * 
 * Centralized interface definitions for the network system.
 * Provides clean type exports following Black Box pattern.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./types.js').IApiClient} IApiClient
 * @typedef {import('./types.js').IApiClientConfig} IApiClientConfig
 * @typedef {import('./types.js').ApiResponse} ApiResponse
 * @typedef {import('./types.js').ApiError} ApiError
 * @typedef {import('./types.js').AuthConfig} AuthConfig
 * @typedef {import('./types.js').RetryConfig} RetryConfig
 * @typedef {import('./types.js').CacheConfig} CacheConfig
 * @typedef {import('./types.js').ApiHealthStatus} ApiHealthStatus
 * @typedef {import('./types.js').ApiMetrics} ApiMetrics
 * @typedef {import('./types.js').ITokenProvider} ITokenProvider
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
 * @property {(token: string) => void} setAuth - Set authentication token
 * @property {() => void} clearAuth - Clear authentication
 * @property {() => string|null} getAuth - Get authentication token
 * @property {(config: ApiConfig) => void} updateConfig - Update configuration
 * @property {() => ApiConfig} getConfig - Get configuration
 * @property {() => Object} getHealth - Get health status
 * @property {() => Object} getMetrics - Get metrics
 */
export class IApiClient {
    /**
     * Performs HTTP GET request
     * @param {string} url - Request URL
     * @param {ApiConfig} [config] - Request configuration
     * @returns {Promise<ApiResponse>} Response data
     */
    get(url, config) {
        throw new Error('Method get() must be implemented');
    }

    /**
     * Performs HTTP POST request
     * @param {string} url - Request URL
     * @param {any} [data] - Request data
     * @param {ApiConfig} [config] - Request configuration
     * @returns {Promise<ApiResponse>} Response data
     */
    post(url, data, config) {
        throw new Error('Method post() must be implemented');
    }

    /**
     * Performs HTTP PUT request
     * @param {string} url - Request URL
     * @param {any} [data] - Request data
     * @param {ApiConfig} [config] - Request configuration
     * @returns {Promise<ApiResponse>} Response data
     */
    put(url, data, config) {
        throw new Error('Method put() must be implemented');
    }

    /**
     * Performs HTTP PATCH request
     * @param {string} url - Request URL
     * @param {any} [data] - Request data
     * @param {ApiConfig} [config] - Request configuration
     * @returns {Promise<ApiResponse>} Response data
     */
    patch(url, data, config) {
        throw new Error('Method patch() must be implemented');
    }

    /**
     * Performs HTTP DELETE request
     * @param {string} url - Request URL
     * @param {ApiConfig} [config] - Request configuration
     * @returns {Promise<ApiResponse>} Response data
     */
    delete(url, config) {
        throw new Error('Method delete() must be implemented');
    }

    /**
     * Set authentication token
     * @param {string} token - Authentication token
     * @returns {void}
     */
    setAuth(token) {
        throw new Error('Method setAuth() must be implemented');
    }

    /**
     * Clear authentication
     * @returns {void}
     */
    clearAuth() {
        throw new Error('Method clearAuth() must be implemented');
    }

    /**
     * Get authentication token
     * @returns {string|null} Authentication token
     */
    getAuth() {
        throw new Error('Method getAuth() must be implemented');
    }

    /**
     * Update configuration
     * @param {ApiConfig} config - Configuration
     * @returns {void}
     */
    updateConfig(config) {
        throw new Error('Method updateConfig() must be implemented');
    }

    /**
     * Get configuration
     * @returns {ApiConfig} Current configuration
     */
    getConfig() {
        throw new Error('Method getConfig() must be implemented');
    }

    /**
     * Get health status
     * @returns {Object} Health status
     */
    getHealth() {
        throw new Error('Method getHealth() must be implemented');
    }

    /**
     * Get metrics
     * @returns {Object} Performance metrics
     */
    getMetrics() {
        throw new Error('Method getMetrics() must be implemented');
    }
}

/**
 * API Client configuration interface
 * 
 * @interface IApiClientConfig
 * @description Configuration options for the API client including base URL, timeout, headers, and advanced features
 * @typedef {Object} IApiClientConfig
 * @property {string} [baseURL] - Base URL for all API requests
 * @property {number} [timeout] - Request timeout in milliseconds
 * @property {Object} [headers] - Default headers for requests
 * @property {number} [retries] - Number of retry attempts
 * @property {number} [retryDelay] - Delay between retries in milliseconds
 * @property {boolean} [enableCache] - Enable request caching
 * @property {Object} [cacheConfig] - Cache configuration
 * @property {boolean} [enableMetrics] - Enable performance metrics
 * @property {boolean} [enableLogging] - Enable request logging
 */
export class IApiClientConfig {
    /**
     * Creates API client configuration
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.baseURL = config.baseURL || '';
        this.timeout = config.timeout || 10000;
        this.headers = config.headers || {};
        this.retries = config.retries || 3;
        this.retryDelay = config.retryDelay || 1000;
        this.enableCache = config.enableCache || false;
        this.cacheConfig = config.cacheConfig || {};
        this.enableMetrics = config.enableMetrics || false;
        this.enableLogging = config.enableLogging || false;
    }

    /**
     * Base URL for all API requests
     * @type {string}
     */
    baseURL;

    /**
     * Request timeout in milliseconds
     * @type {number}
     */
    timeout;

    /**
     * Default headers for requests
     * @type {Object}
     */
    headers;

    /**
     * Number of retry attempts
     * @type {number}
     */
    retries;

    /**
     * Delay between retries in milliseconds
     * @type {number}
     */
    retryDelay;

    /**
     * Enable request caching
     * @type {boolean}
     */
    enableCache;

    /**
     * Cache configuration
     * @type {Object}
     */
    cacheConfig;

    /**
     * Enable performance metrics
     * @type {boolean}
     */
    enableMetrics;

    /**
     * Enable request logging
     * @type {boolean}
     */
    enableLogging;
}

/**
 * API response wrapper interface
 * 
 * @interface ApiResponse
 * @description Wraps API response data with metadata and error information
 * @template T - The response data type
 * @typedef {Object} ApiResponse
 * @property {T} data - Response data payload
 * @property {boolean} success - Whether request was successful
 * @property {number} [status] - HTTP status code
 * @property {string} [statusText] - HTTP status text
 * @property {Object} [headers] - Response headers
 * @property {ApiError} [error] - Error information if request failed
 * @property {number} [timestamp] - Response timestamp
 * @property {string} [requestId] - Unique request identifier
 */
export class ApiResponse {
    /**
     * Creates an API response
     * @param {T} data - Response data
     * @param {boolean} success - Success status
     * @param {number} [status] - HTTP status code
     * @param {string} [statusText] - HTTP status text
     * @param {Object} [headers] - Response headers
     * @param {ApiError} [error] - Error information
     * @param {number} [timestamp] - Response timestamp
     * @param {string} [requestId] - Request identifier
     */
    constructor(data, success, status, statusText, headers, error, timestamp, requestId) {
        this.data = data;
        this.success = success;
        this.status = status;
        this.statusText = statusText;
        this.headers = headers;
        this.error = error;
        this.timestamp = timestamp || Date.now();
        this.requestId = requestId;
    }

    /**
     * Response data payload
     * @type {T}
     */
    data;

    /**
     * Whether request was successful
     * @type {boolean}
     */
    success;

    /**
     * HTTP status code
     * @type {number}
     */
    status;

    /**
     * HTTP status text
     * @type {string}
     */
    statusText;

    /**
     * Response headers
     * @type {Object}
     */
    headers;

    /**
     * Error information if request failed
     * @type {ApiError}
     */
    error;

    /**
     * Response timestamp
     * @type {number}
     */
    timestamp;

    /**
     * Unique request identifier
     * @type {string}
     */
    requestId;
}

/**
 * API error interface
 * 
 * @interface ApiError
 * @description Standardized error structure for API responses
 * @typedef {Object} ApiError
 * @property {string} code - Error code
 * @property {string} message - Error message
 * @property {string} [type] - Error type
 * @property {any} [details] - Additional error details
 * @property {number} [timestamp] - Error timestamp
 * @property {string} [requestId] - Associated request identifier
 */
export class ApiError {
    /**
     * Creates an API error
     * @param {string} code - Error code
     * @param {string} message - Error message
     * @param {string} [type] - Error type
     * @param {any} [details] - Additional error details
     * @param {number} [timestamp] - Error timestamp
     * @param {string} [requestId] - Request identifier
     */
    constructor(code, message, type, details, timestamp, requestId) {
        this.code = code;
        this.message = message;
        this.type = type || 'error';
        this.details = details;
        this.timestamp = timestamp || Date.now();
        this.requestId = requestId;
    }

    /**
     * Error code
     * @type {string}
     */
    code;

    /**
     * Error message
     * @type {string}
     */
    message;

    /**
     * Error type
     * @type {string}
     */
    type;

    /**
     * Additional error details
     * @type {any}
     */
    details;

    /**
     * Error timestamp
     * @type {number}
     */
    timestamp;

    /**
     * Associated request identifier
     * @type {string}
     */
    requestId;
}

/**
 * Authentication configuration interface
 * 
 * @interface AuthConfig
 * @description Configuration options for authentication and authorization
 * @typedef {Object} AuthConfig
 * @property {string} [provider] - Authentication provider type
 * @property {string} [tokenEndpoint] - Token endpoint URL
 * @property {string} [refreshEndpoint] - Refresh token endpoint URL
 * @property {string} [logoutEndpoint] - Logout endpoint URL
 * @property {number} [tokenRefreshThreshold] - Token refresh threshold in milliseconds
 * @property {boolean} [enableAutoRefresh] - Enable automatic token refresh
 * @property {boolean} [enableSessionTimeout] - Enable session timeout
 * @property {number} [sessionTimeout] - Session timeout in milliseconds
 * @property {Object} [providerConfig] - Provider-specific configuration
 */
export class AuthConfig {
    /**
     * Creates authentication configuration
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.provider = config.provider || 'jwt';
        this.tokenEndpoint = config.tokenEndpoint || '/auth/token';
        this.refreshEndpoint = config.refreshEndpoint || '/auth/refresh';
        this.logoutEndpoint = config.logoutEndpoint || '/auth/logout';
        this.tokenRefreshThreshold = config.tokenRefreshThreshold || 300000; // 5 minutes
        this.enableAutoRefresh = config.enableAutoRefresh || true;
        this.enableSessionTimeout = config.enableSessionTimeout || false;
        this.sessionTimeout = config.sessionTimeout || 3600000; // 1 hour
        this.providerConfig = config.providerConfig || {};
    }

    /**
     * Authentication provider type
     * @type {string}
     */
    provider;

    /**
     * Token endpoint URL
     * @type {string}
     */
    tokenEndpoint;

    /**
     * Refresh token endpoint URL
     * @type {string}
     */
    refreshEndpoint;

    /**
     * Logout endpoint URL
     * @type {string}
     */
    logoutEndpoint;

    /**
     * Token refresh threshold in milliseconds
     * @type {number}
     */
    tokenRefreshThreshold;

    /**
     * Enable automatic token refresh
     * @type {boolean}
     */
    enableAutoRefresh;

    /**
     * Enable session timeout
     * @type {boolean}
     */
    enableSessionTimeout;

    /**
     * Session timeout in milliseconds
     * @type {number}
     */
    sessionTimeout;

    /**
     * Provider-specific configuration
     * @type {Object}
     */
    providerConfig;
}

/**
 * Retry configuration interface
 * 
 * @interface RetryConfig
 * @description Configuration for request retry logic
 * @typedef {Object} RetryConfig
 * @property {number} [maxRetries] - Maximum number of retry attempts
 * @property {number} [initialDelay] - Initial retry delay in milliseconds
 * @property {number} [maxDelay] - Maximum retry delay in milliseconds
 * @property {number} [backoffFactor] - Backoff multiplication factor
 * @property {boolean} [enableJitter] - Enable jitter in retry delays
 * @property {number} [jitterFactor] - Jitter multiplication factor
 * @property {Array<number>} [retryableStatusCodes] - HTTP status codes to retry
 * @property {Function} [shouldRetry] - Custom retry condition function
 */
export class RetryConfig {
    /**
     * Creates retry configuration
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.maxRetries = config.maxRetries || 3;
        this.initialDelay = config.initialDelay || 1000;
        this.maxDelay = config.maxDelay || 10000;
        this.backoffFactor = config.backoffFactor || 2;
        this.enableJitter = config.enableJitter || false;
        this.jitterFactor = config.jitterFactor || 0.1;
        this.retryableStatusCodes = config.retryableStatusCodes || [408, 429, 500, 502, 503, 504];
        this.shouldRetry = config.shouldRetry || null;
    }

    /**
     * Maximum number of retry attempts
     * @type {number}
     */
    maxRetries;

    /**
     * Initial retry delay in milliseconds
     * @type {number}
     */
    initialDelay;

    /**
     * Maximum retry delay in milliseconds
     * @type {number}
     */
    maxDelay;

    /**
     * Backoff multiplication factor
     * @type {number}
     */
    backoffFactor;

    /**
     * Enable jitter in retry delays
     * @type {boolean}
     */
    enableJitter;

    /**
     * Jitter multiplication factor
     * @type {number}
     */
    jitterFactor;

    /**
     * HTTP status codes to retry
     * @type {Array<number>}
     */
    retryableStatusCodes;

    /**
     * Custom retry condition function
     * @type {Function}
     */
    shouldRetry;
}

/**
 * Cache configuration interface
 * 
 * @interface CacheConfig
 * @description Configuration for request caching
 * @typedef {Object} CacheConfig
 * @property {boolean} [enabled] - Enable caching
 * @property {number} [ttl] - Time to live in milliseconds
 * @property {number} [maxSize] - Maximum cache size
 * @property {string} [storageType] - Storage type ('memory', 'localStorage', 'sessionStorage')
 * @property {boolean} [enableCompression] - Enable data compression
 * @property {string} [keyPrefix] - Cache key prefix
 * @property {Function} [keyGenerator] - Custom key generation function
 */
export class CacheConfig {
    /**
     * Creates cache configuration
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.enabled = config.enabled || false;
        this.ttl = config.ttl || 300000; // 5 minutes
        this.maxSize = config.maxSize || 100;
        this.storageType = config.storageType || 'memory';
        this.enableCompression = config.enableCompression || false;
        this.keyPrefix = config.keyPrefix || 'api_';
        this.keyGenerator = config.keyGenerator || null;
    }

    /**
     * Enable caching
     * @type {boolean}
     */
    enabled;

    /**
     * Time to live in milliseconds
     * @type {number}
     */
    ttl;

    /**
     * Maximum cache size
     * @type {number}
     */
    maxSize;

    /**
     * Storage type
     * @type {string}
     */
    storageType;

    /**
     * Enable data compression
     * @type {boolean}
     */
    enableCompression;

    /**
     * Cache key prefix
     * @type {string}
     */
    keyPrefix;

    /**
     * Custom key generation function
     * @type {Function}
     */
    keyGenerator;
}

/**
 * API health status interface
 * 
 * @interface ApiHealthStatus
 * @description Represents the health status of API services
 * @typedef {Object} ApiHealthStatus
 * @property {string} status - Health status ('healthy', 'degraded', 'unhealthy')
 * @property {number} [responseTime] - Average response time in milliseconds
 * @property {number} [errorRate] - Error rate as percentage
 * @property {Date} [lastCheck] - Last health check timestamp
 * @property {Object} [details] - Additional health details
 */
export class ApiHealthStatus {
    /**
     * Creates API health status
     * @param {Object} status - Health status information
     */
    constructor(status) {
        this.status = status.status || 'unknown';
        this.responseTime = status.responseTime || 0;
        this.errorRate = status.errorRate || 0;
        this.lastCheck = status.lastCheck || new Date();
        this.details = status.details || {};
    }

    /**
     * Health status
     * @type {string}
     */
    status;

    /**
     * Average response time in milliseconds
     * @type {number}
     */
    responseTime;

    /**
     * Error rate as percentage
     * @type {number}
     */
    errorRate;

    /**
     * Last health check timestamp
     * @type {Date}
     */
    lastCheck;

    /**
     * Additional health details
     * @type {Object}
     */
    details;
}

/**
 * API metrics interface
 * 
 * @interface ApiMetrics
 * @description Performance metrics for API operations
 * @typedef {Object} ApiMetrics
 * @property {number} totalRequests - Total number of requests
 * @property {number} successfulRequests - Number of successful requests
 * @property {number} failedRequests - Number of failed requests
 * @property {number} averageResponseTime - Average response time in milliseconds
 * @property {number} requestsPerSecond - Requests per second
 * @property {Date} [lastRequest] - Last request timestamp
 * @property {Object} [errorDistribution] - Error distribution by type
 */
export class ApiMetrics {
    /**
     * Creates API metrics
     * @param {Object} metrics - Metrics data
     */
    constructor(metrics) {
        this.totalRequests = metrics.totalRequests || 0;
        this.successfulRequests = metrics.successfulRequests || 0;
        this.failedRequests = metrics.failedRequests || 0;
        this.averageResponseTime = metrics.averageResponseTime || 0;
        this.requestsPerSecond = metrics.requestsPerSecond || 0;
        this.lastRequest = metrics.lastRequest || new Date();
        this.errorDistribution = metrics.errorDistribution || {};
    }

    /**
     * Total number of requests
     * @type {number}
     */
    totalRequests;

    /**
     * Number of successful requests
     * @type {number}
     */
    successfulRequests;

    /**
     * Number of failed requests
     * @type {number}
     */
    failedRequests;

    /**
     * Average response time in milliseconds
     * @type {number}
     */
    averageResponseTime;

    /**
     * Requests per second
     * @type {number}
     */
    requestsPerSecond;

    /**
     * Last request timestamp
     * @type {Date}
     */
    lastRequest;

    /**
     * Error distribution by type
     * @type {Object}
     */
    errorDistribution;
}

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
export class ITokenProvider {
    /**
     * Gets current authentication token
     * @returns {string|null} Authentication token
     */
    getToken() {
        throw new Error('Method getToken() must be implemented');
    }

    /**
     * Sets authentication token
     * @param {string} token - Authentication token
     * @returns {void}
     */
    setToken(token) {
        throw new Error('Method setToken() must be implemented');
    }

    /**
     * Clears authentication token
     * @returns {void}
     */
    clearToken() {
        throw new Error('Method clearToken() must be implemented');
    }

    /**
     * Checks if authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        throw new Error('Method isAuthenticated() must be implemented');
    }

    /**
     * Checks if token is expired
     * @returns {boolean} Expiration status
     */
    isExpired() {
        throw new Error('Method isExpired() must be implemented');
    }

    /**
     * Refreshes token
     * @returns {Promise<string|null>} New token or null
     */
    refreshToken() {
        throw new Error('Method refreshToken() must be implemented');
    }
}
