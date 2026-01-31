/**
 * Network Module Constants
 * 
 * Defines constants for the network system.
 * Provides standardized values for HTTP methods, status codes, and error codes.
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

// HTTP Methods
export const HTTP_METHODS = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    HEAD: 'HEAD',
    OPTIONS: 'OPTIONS'
});

// HTTP Status Codes
export const HTTP_STATUS = Object.freeze({
    // Success
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    PARTIAL_CONTENT: 206,

    // Redirection
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    NOT_MODIFIED: 304,
    TEMPORARY_REDIRECT: 307,

    // Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    GONE: 410,
    PAYLOAD_TOO_LARGE: 413,
    UNSUPPORTED_MEDIA_TYPE: 415,
    TOO_MANY_REQUESTS: 429,

    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    NETWORK_AUTHENTICATION_REQUIRED: 511
});

// Error Codes
export const ERROR_CODES = Object.freeze({
    // Network Errors
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    CONNECTION_ERROR: 'CONNECTION_ERROR',

    // Authentication Errors
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',

    // Request Errors
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
    METHOD_NOT_ALLOWED_ERROR: 'METHOD_NOT_ALLOWED_ERROR',
    UNSUPPORTED_MEDIA_TYPE_ERROR: 'UNSUPPORTED_MEDIA_TYPE_ERROR',

    // Server Errors
    SERVER_ERROR: 'SERVER_ERROR',
    SERVICE_UNAVAILABLE_ERROR: 'SERVICE_UNAVAILABLE_ERROR',
    BAD_GATEWAY_ERROR: 'BAD_GATEWAY_ERROR',

    // Generic Errors
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    PARSE_ERROR: 'PARSE_ERROR',
    CONFIGURATION_ERROR: 'CONFIGURATION_ERROR'
});

// Content Types
export const CONTENT_TYPES = Object.freeze({
    JSON: 'application/json',
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
    FORM_DATA: 'multipart/form-data',
    TEXT: 'text/plain',
    HTML: 'text/html',
    XML: 'application/xml',
    PDF: 'application/pdf',
    IMAGE: 'image/*',
    VIDEO: 'video/*',
    AUDIO: 'audio/*'
});

// Common Headers
export const COMMON_HEADERS = Object.freeze({
    ACCEPT: 'Accept',
    AUTHORIZATION: 'Authorization',
    CONTENT_TYPE: 'Content-Type',
    CONTENT_LENGTH: 'Content-Length',
    USER_AGENT: 'User-Agent',
    CACHE_CONTROL: 'Cache-Control',
    PRAGMA: 'Pragma',
    EXPIRES: 'Expires',
    LAST_MODIFIED: 'Last-Modified',
    ETAG: 'ETag',
    IF_NONE_MATCH: 'If-None-Match',
    IF_MODIFIED_SINCE: 'If-Modified-Since',
    ORIGIN: 'Origin',
    ACCESS_CONTROL_ALLOW_ORIGIN: 'Access-Control-Allow-Origin',
    ACCESS_CONTROL_ALLOW_METHODS: 'Access-Control-Allow-Methods',
    ACCESS_CONTROL_ALLOW_HEADERS: 'Access-Control-Allow-Headers'
});

// Default Timeouts (in milliseconds)
export const TIMEOUTS = Object.freeze({
    DEFAULT: 10000,        // 10 seconds
    SHORT: 5000,           // 5 seconds
    LONG: 30000,           // 30 seconds
    UPLOAD: 60000,         // 1 minute
    DOWNLOAD: 120000       // 2 minutes
});

// Retry Configuration
export const RETRY_CONFIG = Object.freeze({
    DEFAULT_MAX_ATTEMPTS: 3,
    DEFAULT_DELAY: 1000,   // 1 second
    MAX_DELAY: 30000,      // 30 seconds
    BACKOFF_MULTIPLIER: 2
});

// Cache Configuration
export const CACHE_CONFIG = Object.freeze({
    DEFAULT_TTL: 300000,   // 5 minutes
    SHORT_TTL: 60000,      // 1 minute
    LONG_TTL: 1800000,     // 30 minutes
    MAX_SIZE: 1000         // Maximum cache entries
});

// Rate Limiting
export const RATE_LIMITS = Object.freeze({
    DEFAULT_REQUESTS_PER_MINUTE: 60,
    DEFAULT_REQUESTS_PER_HOUR: 1000,
    DEFAULT_REQUESTS_PER_DAY: 10000
});

// Request Priorities
export const REQUEST_PRIORITIES = Object.freeze({
    LOW: 1,
    NORMAL: 2,
    HIGH: 3,
    CRITICAL: 4
});

// Common Request Headers (defined early to avoid circular dependency)
export const DEFAULT_REQUEST_HEADERS = Object.freeze({
    [COMMON_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
    [COMMON_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
    [COMMON_HEADERS.USER_AGENT]: 'QuietSpace-Frontend/1.0.0'
});

// Environment-specific configurations
export const ENVIRONMENT_CONFIG = Object.freeze({
    development: {
        baseURL: 'http://localhost:3000/api',
        timeout: TIMEOUTS.DEFAULT,
        headers: DEFAULT_REQUEST_HEADERS,
        retryConfig: {
            maxAttempts: 3,
            retryDelay: 1000,
            exponentialBackoff: true
        }
    },
    staging: {
        baseURL: 'https://api-staging.quietspace.com',
        timeout: TIMEOUTS.DEFAULT,
        headers: DEFAULT_REQUEST_HEADERS,
        retryConfig: {
            maxAttempts: 2,
            retryDelay: 2000,
            exponentialBackoff: true
        }
    },
    production: {
        baseURL: 'https://api.quietspace.com',
        timeout: TIMEOUTS.SHORT,
        headers: DEFAULT_REQUEST_HEADERS,
        retryConfig: {
            maxAttempts: 2,
            retryDelay: 1000,
            exponentialBackoff: true
        }
    }
});

// HTTP Status Categories
export const STATUS_CATEGORIES = Object.freeze({
    INFORMATIONAL: (status) => status >= 100 && status < 200,
    SUCCESS: (status) => status >= 200 && status < 300,
    REDIRECTION: (status) => status >= 300 && status < 400,
    CLIENT_ERROR: (status) => status >= 400 && status < 500,
    SERVER_ERROR: (status) => status >= 500 && status < 600
});

// Common Response Headers
export const DEFAULT_RESPONSE_HEADERS = Object.freeze({
    [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN]: '*',
    [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_METHODS]: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_HEADERS]: 'Content-Type, Authorization'
});

// Default API Configuration
export const DEFAULT_API_CONFIG = {
    timeout: TIMEOUTS.DEFAULT,
    headers: DEFAULT_REQUEST_HEADERS,
    retryConfig: {
        maxAttempts: RETRY_CONFIG.DEFAULT_MAX_ATTEMPTS,
        retryDelay: RETRY_CONFIG.DEFAULT_DELAY,
        exponentialBackoff: true
    },
    cacheConfig: {
        enabled: true,
        ttl: CACHE_CONFIG.DEFAULT_TTL,
        maxSize: CACHE_CONFIG.MAX_SIZE
    }
};
