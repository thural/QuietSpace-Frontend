/**
 * Network Module Types
 * 
 * Defines types and enums for the network system.
 * Implements the interfaces with additional type definitions.
 */

// Import types from interfaces
/**
 * @typedef {import('./interfaces.js').ApiError} ApiError
 * @typedef {import('./interfaces.js').ApiResponse} ApiResponse
 * @typedef {import('./interfaces.js').IApiClientConfig} IApiClientConfig
 * @typedef {import('./interfaces.js').RetryConfig} RetryConfig
 * @typedef {import('./interfaces.js').CacheConfig} CacheConfig
 */

/**
 * HTTP Status Codes
 * @readonly
 * @enum {number}
 */
export const HTTP_STATUS = Object.freeze({
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    LENGTH_REQUIRED: 411,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    URI_TOO_LONG: 414,
    UNSUPPORTED_MEDIA_TYPE: 415,
    RANGE_NOT_SATISFIABLE: 416,
    EXPECTATION_FAILED: 417,
    IM_A_TEAPOT: 418,
    MISDIRECTED_REQUEST: 421,
    UNPROCESSABLE_ENTITY: 422,
    LOCKED: 423,
    FAILED_DEPENDENCY: 424,
    TOO_EARLY: 425,
    UPGRADE_REQUIRED: 426,
    PRECONDITION_REQUIRED: 428,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    NETWORK_TIMEOUT: 504
});

/**
 * HTTP Methods
 * @readonly
 * @enum {string}
 */
export const HTTP_METHODS = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    HEAD: 'HEAD',
    OPTIONS: 'OPTIONS',
    TRACE: 'TRACE'
});

/**
 * Content Types
 * @readonly
 * @enum {string}
 */
export const CONTENT_TYPES = Object.freeze({
    JSON: 'application/json',
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
    FORM_DATA: 'multipart/form-data',
    TEXT: 'text/plain',
    HTML: 'text/html',
    XML: 'application/xml',
    BINARY: 'application/octet-stream',
    STREAM: 'application/octet-stream'
});

/**
 * Request methods
 * @readonly
 * @enum {string}
 */
export const REQUEST_METHODS = Object.freeze({
    JSON: 'json',
    FORM: 'form',
    URL_ENCODED: 'urlencoded',
    MULTIPART: 'multipart',
    BINARY: 'binary'
});

/**
 * Response types
 * @readonly
 * @enum {string}
 */
export const RESPONSE_TYPES = Object.freeze({
    JSON: 'json',
    TEXT: 'text',
    BLOB: 'blob',
    ARRAY_BUFFER: 'arraybuffer',
    FORM_DATA: 'form-data',
    URL_ENCODED: 'urlencoded',
    BINARY: 'binary'
});

/**
 * Error codes
 * @readonly
 * @enum {string}
 */
export const ERROR_CODES = Object.freeze({
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND_ERROR: 'ERROR_NOT_FOUND',
    SERVER_ERROR: 'SERVER_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
});

/**
 * Request priority levels
 * @readonly
 * @enum {string}
 */
export const REQUEST_PRIORITY = Object.freeze({
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent',
    CRITICAL: 'critical'
});

/**
 * Cache strategies
 * @readonly
 * @enum {string}
 */
export const CACHE_STRATEGIES = Object.freeze({
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    NO_CACHE: 'no-cache',
    REVALIDATE_ONLY: 'revalidate-only'
});

/**
 * Retry strategies
 * @readonly
 * @enum {string}
 */
export const RETRY_STRATEGIES = Object.freeze({
    EXPONENTIAL_BACKOFF: 'exponential-backoff',
    LINEAR_BACKOFF: 'linear-backoff',
    FIXED_DELAY: 'fixed-delay',
    NO_RETRY: 'no-retry',
    CUSTOM: 'custom'
});

/**
 * Request timeout configuration
 * @typedef {Object} RequestTimeoutConfig
 * @property {number} [connectTimeout] - Connection timeout in milliseconds
 * @property {number} [requestTimeout] - Request timeout in milliseconds
 * @property {number} [responseTimeout] - Response timeout in milliseconds
 * @property {boolean} [enableRetry] - Enable retry logic
 * @property {RetryConfig} [retryConfig] - Retry configuration
 * @property {Function} [shouldRetry] - Custom retry condition function
 */
export class RequestTimeoutConfig {
    /**
     * Creates request timeout configuration
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.connectTimeout = config.connectTimeout || 10000;
        this.requestTimeout = config.requestTimeout || 30000;
        this.responseTimeout = config.responseTimeout || 60000;
        this.enableRetry = config.enableRetry || false;
        this.retryConfig = config.retryConfig || {};
        this.shouldRetry = config.shouldRetry || null;
    }

    /**
     * Connection timeout in milliseconds
     * @type {number}
     */
    connectTimeout;

    /**
     * Request timeout in milliseconds
     * @type {number}
     */
    requestTimeout;

    /**
     * Response timeout in milliseconds
     * @type {number}
     */
    responseTimeout;

    /**
     * Enable retry logic
     * @type {boolean}
     */
    enableRetry;

    /**
     * Retry configuration
     * @type {RetryConfig}
     */
    retryConfig;

    /**
     * Custom retry condition function
     * @type {Function}
     */
    shouldRetry;
}

/**
 * Request interceptor configuration
 * @typedef {Object} InterceptorConfig
 * @property {Function} [requestInterceptor] - Request interceptor function
 * @property {Function} [responseInterceptor] - Response interceptor function
 * @property {Function} [errorInterceptor] - Error interceptor function
 * @property {boolean} [enableLogging] - Enable interceptor logging
 * @property {boolean} [enableMetrics] - Enable metrics collection
 */
export class InterceptorConfig {
    /**
     * Creates interceptor configuration
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.requestInterceptor = config.requestInterceptor || null;
        this.responseInterceptor = config.responseInterceptor || null;
        this.errorInterceptor = config.errorInterceptor || null;
        this.enableLogging = config.enableLogging || false;
        this.enableMetrics = config.enableMetrics || false;
    }

    /**
     * Request interceptor function
     * @type {Function}
     */
    requestInterceptor;

    /**
     * Response interceptor function
     * @type {Function}
     */
    responseInterceptor;

    /**
     * Error interceptor function
     * @type {Function}
     */
    errorInterceptor;

    /**
     * Enable interceptor logging
     * @type {boolean}
     */
    enableLogging;

    /**
     * Enable metrics collection
     * @type {boolean}
     */
    enableMetrics;
}

/**
 * Upload progress interface
 * @typedef {Object} UploadProgress
 * @property {number} loaded - Bytes uploaded
 * @property {number} total - Total bytes to upload
 * @property {number} percentage - Upload percentage (0-100)
 * @property {string} [fileName] - File name
 * @property {Date} [startTime] - Upload start time
 * @property {Date} [estimatedTime] - Estimated completion time
 * @property {boolean} [isComplete] - Upload completion status
 */
export class UploadProgress {
    /**
     * Creates upload progress instance
     * @param {Object} progress - Progress data
     */
    constructor(progress) {
        this.loaded = progress.loaded || 0;
        this.total = progress.total || 0;
        this.percentage = progress.percentage || 0;
        this.fileName = progress.fileName || '';
        this.startTime = progress.startTime || new Date();
        this.estimatedTime = progress.0;
        this.isComplete = progress.isComplete || false;
    }

    /**
     * Bytes uploaded
     * @type {number}
     */
    loaded;

    /**
     * Total bytes to upload
     * @type {number}
     */
    total;

    /**
     * Upload percentage (0-100)
     * @type {number}
     */
    percentage;

    /**
     * File name
     * @type {string}
     */
    fileName;

    /**
     * Upload start time
     * @type {Date}
     */
    startTime;

    /**
     * Estimated completion time
     * @type {number}
     */
    estimatedTime;

    /**
     * Upload completion status
     * @type {boolean}
     */
    isComplete;
}

/**
 * File upload options
 * @typedef {Object} UploadOptions
 * @property {string} [fileName] - File name
 * @property {string} [contentType] - Content type
 * @property {Object} [metadata] - File metadata
 * @property {boolean} [chunked] - Enable chunked upload
 * @property {number} [chunkSize] - Chunk size in bytes
 * @property {Function} [onProgress] - Progress callback function
 * @property {AbortController} [abortController] - Abort controller
 */
export class UploadOptions {
    /**
     * Creates upload options
     * @param {Object} options - Upload options
     */
    constructor(options) {
        this.fileName = options.fileName || '';
        this.contentType = options.contentType || 'application/octet-stream';
        this.metadata = options.metadata || {};
        this.chunked = options.chunked || false;
        this.chunkSize = options.chunkSize || 1024 * 1024; // 1MB chunks
        this.onProgress = options.onProgress || null;
        this.abortController = options.abortController || null;
    }

    /**
     * File name
     * @type {string}
     */
    fileName;

    /**
     * Content type
     * @type {string}
     */
    contentType;

    /**
     * File metadata
     * @type {Object}
     */
    metadata;

    /**
     * Enable chunked upload
     * @type {boolean}
     */
    chunked;

    /**
     * Chunk size in bytes
     * @type {number}
     */
    chunkSize;

    /**
     * Progress callback function
     * @type {Function}
     */
    onProgress;

    /**
     * Abort controller
     * @type {AbortController}
     */
    abortController;
}

/**
 * Download progress interface
 * @typedef {Object} DownloadProgress
 * @property {number} downloaded - Bytes downloaded
 * @property {number} total - Total bytes to download
 * @property {number} percentage - Download percentage (0-100)
 * @property {string} [fileName] - File name
 * @property {Date} [startTime] - Download start time
 * @property {Date} [estimatedTime] - Estimated completion time
 * @property {boolean} [isComplete] - Download completion status
 */
export class DownloadProgress {
    /**
     * Creates download progress instance
     * @param {Object} progress - Progress data
     */
    constructor(progress) {
        this.downloaded = progress.downloaded || 0;
        this.total = progress.total || 0;
        this.percentage = progress.percentage || 0;
        this.fileName = progress.fileName || '';
        this.startTime = progress.startTime || new Date();
        this.estimatedTime = progress.estimatedTime || 0;
        this.isComplete = progress.isComplete || false;
    }

    /**
     * Bytes downloaded
     * @type {number}
     */
    downloaded;

    /**
     * Total bytes to download
     * @type {number}
     */
    total;

    /**
     * Download percentage (0-100)
     * @type {number}
     */
    percentage;

    /**
     * File name
     * @type {string}
     */
    fileName;

    /**
     * Download start time
     * @type {Date}
     */
    startTime;

    /**
     * Estimated completion time
     * @type {number}
     */
    estimatedTime;

    /**
     * Download completion status
     * @type {boolean}
     */
    isComplete;
}

/**
 * Download options
 * @typedef {Object} DownloadOptions
 * @property {string} [fileName] - File name
 * @property {string} [savePath] - Save path
 * @property {boolean} [overwrite] - Overwrite existing files
 * @property {boolean} [createDirectories] - Create directories if needed
 * @property {Function} [onProgress] - Progress callback function
 * @property {AbortController} [abortController] - Abort controller
 */
export class DownloadOptions {
    /**
     * Creates download options
     * @param {Object} options - Download options
     */
    constructor(options) {
        this.fileName = options.fileName || '';
        this.savePath = options.savePath || '';
        this.overwrite = options.overwrite || false;
        this.createDirectories = options.createDirectories || false;
        this.onProgress = options.onProgress || null;
        this.abortController = options.abortController || null;
    }

    /**
     * File name
     * @type {string}
     */
    fileName;

    /**
     * Save path
     * @type {string}
     */
    savePath;

    /**
     * Overwrite existing files
     * @type {boolean}
     */
    overwrite;

    /**
     * Create directories if needed
     * @type {boolean}
     */
    createDirectories;

    /**
     * Progress callback function
     * @type {Function}
     */
    onProgress;

    /**
     * Abort controller
     * @type {AbortController}
     */
    abortController;
}

/**
 * Request configuration interface
 * @typedef {Object} RequestConfig
 * @property {string} [url] - Request URL
 * @property {string} [method] - HTTP method
 * @property {Object} [headers] - Request headers
 * @property {any} [data] - Request data
 * @property {Object} [params] - URL parameters
 * @property {Object} [query] - Query parameters
 * @property {RequestTimeoutConfig} [timeout] - Timeout configuration
 * @property {InterceptorConfig} [interceptors] - Interceptor configuration
 * @property {CacheConfig} [cache] - Cache configuration
 *property {boolean} [enableMetrics] - Enable metrics collection
 * @property {boolean} [enableLogging] - Enable request logging
 * @property {string} [requestId] - Unique request identifier
 * @property {AbortController} [abortController] - Abort controller
 */
export class RequestConfig {
    /**
     * Creates request configuration
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.url = config.url || '';
        this.method = config.method || 'GET';
        this.headers = config.headers || {};
        this.data = config.data || null;
        this.params = config.params || {};
        this.query = config.query || {};
        this.timeout = config.timeout || {};
        this.interceptors = config.interceptors || {};
        this.cache = config.cache || {};
        this.enableMetrics = config.enableMetrics || false;
        this.enableLogging = config.enableLogging || false;
        this.requestId = config.requestId || '';
        this.abortController = config.abortController || null;
    }

    /**
     * Request URL
     * @type {string}
     */
    url;

    /**
     * HTTP method
     * @type {string}
     */
    method;

    /**
     * Request headers
     * @type {Object}
     */
    headers;

    /**
     * Request data
     * @type {any}
     */
    data;

    /**
     * URL parameters
     * @type {Object}
     */
    params;

    /**
     * Query parameters
     * @type {Object}
     */
    query;

    /**
     * Timeout configuration
     * @type {RequestTimeoutConfig}
     */
    timeout;

    /**
     * Interceptor configuration
     * @type {InterceptorConfig}
     */
    interceptors;

    /**
     * Cache configuration
     * @type {CacheConfig}
     */
    cache;

    /**
     * Enable metrics collection
     * @type {boolean}
     */
    enableMetrics;

    /**
     * Enable request logging
     * @ @type {boolean}
     */
    enableLogging;

    /**
     * Unique request identifier
     * @type {string}
     */
    requestId;

    /**
     * Abort controller
     * @type {AbortController}
     */
    abortController;
}

/**
 * Response configuration interface
 * @typedef {Object} ResponseConfig
 * @property {boolean} [validateStatus] - Validate response status
 * @property {Array<number>} [successStatusCodes] - Array of success status codes
 * @property {Array<number>} [errorStatusCodes] - Array of error status codes
 * @property {boolean} [enableLogging] - Enable response logging
 * @property {boolean} [enableMetrics] - Enable metrics collection
 * @property {Function} [transformRequest] - Request transformer
 * @property {Function} [transformResponse] - Response transformer
 * @property {Function} [validateStatus] - Status validator function
 */
export class ResponseConfig {
    /**
     * Creates response configuration
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.validateStatus = config.validateStatus || false;
        this.successStatusCodes = config.successStatusCodes || [200, 201, 202, 204];
        this.errorStatusCodes = config.errorStatusCodes || [400, 401, 403, 404, 500];
        this.enableLogging = config.enableLogging || false;
        this.enableMetrics = config.enableMetrics || false;
        this.transformRequest = config.transformRequest || null;
        this.transformResponse = config.transformResponse || null;
        this.validateStatus = config.validateStatus || null;
    }

    /**
     * Validate response status
     * @type {boolean}
     */
    validateStatus;

    /**
     * Array of success status codes
     * @type {Array<number>}
     */
    successStatusCodes;

    /**
     * Array of error status codes
     * @type {Array<number>}
     */
    errorStatusCodes;

    /**
     * Enable response logging
     * @type {boolean}
     */
    enableLogging;

    /**
     * Enable metrics collection
     * @type {boolean}
     */
    enableMetrics;

    /**
     * Request transformer
     * @type {Function}
     */
    transformRequest;

    /**
     * Response transformer
     * @type {Function}
     */
    transformResponse;

    /**
     * Status validator function
     * @type {Function}
     */
    validateStatus;
}

/**
 * Network configuration interface
 * @typedef {Object} NetworkConfig
 * @property {string} [baseURL] - Base URL for all API requests
 * @property {RequestTimeoutConfig} [timeout] - Timeout configuration
 * @property {ResponseConfig} [response] - Response configuration
 * @property {InterceptorConfig} [interceptors] - Interceptor configuration
 * @property {CacheConfig} [cache] - Cache configuration
 * @property {boolean} [enableMetrics] - Enable metrics collection
 * @property {boolean} [enableLogging] - Enable request logging
 * @property {Object} [defaultHeaders] - Default headers for all requests
 * @property {Object} [defaultConfig] - Default configuration
 */
export class NetworkConfig {
    /**
     * Creates network configuration
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.baseURL = config.baseURL || '';
        this.timeout = config.timeout || {};
        this.response = config.response || {};
        this.interceptors = config.interceptors || {};
        this.cache = config.cache || {};
        this.enableMetrics = config.enableMetrics || false;
        this.enableLogging = config.enableLogging || false;
        this.defaultHeaders = config.defaultHeaders || {};
        this.defaultConfig = config.defaultConfig || {};
    }

    /**
     * Base URL for all API requests
     * @type {string}
     */
    baseURL;

    /**
     * Timeout configuration
     * @type {RequestTimeoutConfig}
     */
    timeout;

    /**
     * Response configuration
     * @type {ResponseConfig}
     */
    response;

    /**
     * Interceptor configuration
     * @type {InterceptorConfig}
     */
    interceptors;

    /**
     * Cache configuration
     * @type {CacheConfig}
     */
    cache;

    /**
     * Enable metrics collection
     * @type {boolean}
     */
    enableMetrics;

    /**
     * Enable request logging
     * @type {boolean}
     */
    enableLogging;

    /**
     * Default headers for all requests
     * @type {Object}
     */
    defaultHeaders;

    /**
     * Default configuration
     * @type {Object}
     */
    defaultConfig;
}

/**
 * Default network configuration
 * @readonly
 * @type {Object}
 */
export const DEFAULT_NETWORK_CONFIG = Object.freeze({
    baseURL: '',
    timeout: {
        connectTimeout: 10000,
        requestTimeout: 30000,
        responseTimeout: 60000
    },
    response: {
        validateStatus: false,
        successStatusCodes: [200, 201, 202, 204],
        errorStatusCodes: [400, 401, 403, 404, 500],
        enableLogging: false,
        enableMetrics: false
    },
    interceptors: {},
    cache: {
        enabled: false,
        ttl: 300000, // 5 minutes
        maxSize: 100
    },
    enableMetrics: false,
    enableLogging: false,
    defaultHeaders: {
        'Content-Type': 'application/json'
    },
    defaultConfig: {
        timeout: 30000
    }
});

/**
 * Service configuration interface
 * @typedef {Object} ServiceConfig
 * @property {string} [name] - Service name
 * @property {string} [version] - Service version
 * @property {Object} [config] - Service configuration
 * @property {boolean} [enabled] - Service enabled status
 * @property {Object} [dependencies] - Service dependencies
 * @property {Object} [healthCheck] - Health check configuration
 * @property {Object} [metrics] - Metrics configuration
 */
export class ServiceConfig {
    /**
     * Creates service configuration
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.name = config.name || '';
        this.version = config.version || '1.0.0';
        this.config = config.config || {};
        this.enabled = config.enabled || true;
        this.dependencies = config.dependencies || [];
        this.healthCheck = config.healthCheck || {};
        this.metrics = config.metrics || {};
    }

    /**
     * Service name
     * @type {string}
     */
    name;

    /**
     * Service version
     * @type {string}
     */
    version;

    /**
     * Service configuration
     * @type {Object}
     */
    config;

    /**
     * Service enabled status
     * @type {boolean}
     */
    enabled;

    /**
     * Service dependencies
     * @type {Array<Object>}
     */
    dependencies;

    /**
     * Health check configuration
     * @type {Object}
     */
    healthCheck;

    /**
     * Metrics configuration
     * @type {Object}
     */
    metrics;
}

/**
 * Health check configuration interface
 * @typedef {Object} HealthCheckConfig
 * @property {number} [interval] - Health check interval in milliseconds
 * @property {number} [timeout] - Health check timeout in milliseconds
 * @property {boolean} [enabled] - Enable health checks
 * @property {boolean} [logFailures] - Log failed health checks
 * @property {Object} [alerting] - Alerting configuration
 * @property {Object} [recovery] - Recovery configuration
 */
export class HealthCheckConfig {
    /**
     * Creates health check configuration
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.interval = config.interval || 30000; // 30 seconds
        this.timeout = config.timeout || 5000;
        this.enabled = config.enabled || false;
        this.logFailures = config.logFailures || false;
        this.alerting = config.alerting || {};
        this.recovery = config.recovery || {};
    }

    /**
     * Health check interval in milliseconds
     * @type {number}
     */
    interval;

    /**
     * Health check timeout in milliseconds
     * @type {number}
     */
    timeout;

    /**
     * Enable health checks
     * @type {boolean}
     */
    enabled;

    /**
     * Log failed health checks
     * @type {boolean}
     */
    logFailures;

    /**
     * Alerting configuration
     * @type {Object}
     */
    alerting;

    /**
     * Recovery configuration
     * @type {Object}
     */
    recovery;
}

/**
 * Alerting configuration interface
 * @typedef {Object} AlertingConfig
 * @property {boolean} [enabled] - Enable alerting
 * @property {string} [level] - Alert level
 * @property {Array<string>} [channels] - Alert channels
 * @property {Object} [webhook] - Webhook configuration
 * @property {Object} [email] - Email configuration
 * @property {Object} [slack] - Slack configuration
 */
export class AlertingConfig {
    /**
     * Creates alerting configuration
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.enabled = config.enabled || false;
        this.level = config.level || 'error';
        this.channels = config.channels || [];
        this.webhook = config.webhook || {};
        this.email = config.email || {};
    }

    /**
     * Enable alerting
     * @type {boolean}
     */
    enabled;

    /**
     * Alert level
     * @type {string}
     */
    level;

    /**
     * Alert channels
     * @type {Array<string>}
     */
    channels;

    /**
     * Webhook configuration
     * @type {Object}
     */
    webhook;

    /**
     * Email configuration
     * @type {Object}
     */
    email;
}

/**
 * Recovery configuration interface
 * @typedef {Object} RecoveryConfig
 * @property {number} [maxRetries] - Maximum recovery attempts
 * @property {number} [retryDelay] - Retry delay in milliseconds
 * @property {boolean} [enableBackoff] - Enable exponential backoff
 * @property {number} [backoffFactor] - Backoff multiplication factor
 * @property {boolean} [enableJitter] - Enable jitter in retry delays
 * @property {Array<string>} [retryableErrors] - Retryable error types
 * @property {Function} [shouldRecover] - Custom recovery condition
 */
export class RecoveryConfig {
    /**
     * Creates recovery configuration
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.maxRetries = config.maxRetries || 3;
        this.retryDelay = config.retryDelay || 1000;
        this.enableBackoff = config.enableBackoff || true;
        this.backoffFactor = config.backoffFactor || 2;
        this.enableJitter = config.enableJitter || false;
        this.retryableErrors = config.retryableErrors || [];
        this.shouldRecover = config.shouldRecover || null;
    }

    /**
     * Maximum recovery attempts
     * @type {number}
     */
    maxRetries;

    /**
     * Retry delay in milliseconds
     * @type {number}
     */
    retryDelay;

    /**
     * Enable exponential backoff
     * @type {boolean}
     */
    enableBackoff;

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
     * Retryable error types
     * @type {Array<string>}
     */
    retryableErrors;

    /**
     * Custom recovery condition
     * @type {Function}
     */
    shouldRecover;
}

/**
 * Default health check configuration
 * @readonly
 * @type {Object}
 */
export const DEFAULT_HEALTH_CHECK_CONFIG = Object.freeze({
    interval: 30000, // 30 seconds
    timeout: 5000, // 5 seconds
    enabled: false,
    logFailures: false,
    alerting: {
        enabled: false,
        level: 'error',
        channels: [],
        webhook: {},
        email: {}
    },
    recovery: {
        maxRetries: 3,
        retryDelay: 1000,
        enableBackoff: true,
        backoffFactor: 2,
        enableJitter: false,
        retryableErrors: ['timeout', 'connection']
    }
});

/**
 * Network metrics collector
 * @class NetworkMetrics
 * @description Collects and analyzes network performance metrics
 */
export class NetworkMetrics {
    /**
     * Creates network metrics collector
     */
    constructor() {
        this.requests = [];
        this.errors = [];
        this.responseTimes = [];
        this.statusCodes = {};
        this.lastRequest = null;
        this.startTime = Date.now();
    }

    /**
     * Records a request
     * @param {Object} request - Request data
     */
    recordRequest(request) {
        this.requests.push({
            url: request.url,
            method: request.method,
            status: request.status,
            timestamp: request.timestamp,
            duration: request.duration
        });
        this.lastRequest = request.timestamp;
        this.updateStatusCodes(request.status);
    }

    /**
     * Records an error
     * @param {Object} error - Error data
     */
    recordError(error) {
        this.errors.push({
            message: error.message,
            code: error.code,
            timestamp: error.timestamp,
            url: error.url || 'unknown',
            details: error.details || {}
        });
    }

    /**
     * Records response time
     * @param {number} responseTime - Response time in milliseconds
     */
    recordResponseTime(responseTime) {
        this.responseTimes.push(responseTime);
    }

    /**
     * Updates status code statistics
     * @param {number} statusCode - HTTP status code
     */
    updateStatusCodes(statusCode) {
        this.statusCodes[statusCode] = (this.statusCodes[statusCode] || 0) + 1;
    }

    /**
     * Gets total number of requests
     * @returns {number} Total requests
     */
    getTotalRequests() {
        return this.requests.length;
    }

    /**
     * Gets successful requests count
     * @returns {number} Successful requests count
     */
    getSuccessfulRequests() {
        return this.requests.filter(r => r.status >= 200 && r.status < 300).length;
    }

    /**
     * Gets failed requests count
     * @returns {number} Failed requests count
     */
    getFailedRequests() {
        return this.errors.length;
    }

    /**
     * Gets average response time
     * @returns {number} Average response time
     */
    getAverageResponseTime() {
        if (this.responseTimes.length === 0) return 0;
        return this.responseTimes.reduce((sum, time) => sum + time) / this.responseTimes.length;
    }

    /**
     * Gets requests per second
     * @returns {number} Requests per second
     */
    getRequestsPerSecond() {
        const now = Date.now();
        const recentRequests = this.requests.filter(r => now - r.timestamp < 60000); // Last minute
        return recentRequests.length / 60; // Requests per minute
    }

    /**
     * Gets error rate percentage
     * @returns {number} Error rate as percentage
     */
    getErrorRate() {
        const total = this.getTotalRequests();
        return total > 0 ? (this.getFailedRequests() / total) * 100 : 0;
    }

    /**
     * Gets status code distribution
     * @returns {Object} Status code distribution
     */
    getStatusDistribution() {
        return { ...this.statusCodes };
    }

    /**
     * Gets metrics summary
     * @returns {Object} Metrics summary
     */
    getMetrics() {
        return {
            totalRequests: this.getTotalRequests(),
            successfulRequests: this.getSuccessfulRequests(),
            failedRequests: this.getFailedRequests(),
            averageResponseTime: this.getAverageResponseTime(),
            requestsPerSecond: this.getRequestsPerSecond(),
            errorRate: this.getErrorRate(),
            statusDistribution: this.getStatusDistribution(),
            lastRequest: this.lastRequest,
            startTime: this.startTime
        };
    }

    /**
     * Resets all metrics
     */
    reset() {
        this.requests = [];
        this.errors = [];
        this.responseTimes = [];
        this.statusCodes = {};
        this.lastRequest = null;
        this.startTime = Date.now();
    }
}
