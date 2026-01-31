/**
 * Network Module Utilities
 * 
 * Utility functions for the network system.
 * Provides helpers for error handling, validation, and common operations.
 */

import { ERROR_CODES, HTTP_STATUS } from './types.js';

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
 * API response interface
 * @typedef {Object} ApiResponse
 * @property {*} [data] - Response data
 * @property {boolean} success - Success flag
 * @property {string} [message] - Response message
 * @property {string} [error] - Error message
 * @property {number} [status] - HTTP status
 * @property {Object} [headers] - Response headers
 * @property {Object} [metadata] - Response metadata
 */

// Re-export ERROR_CODES for factory use
export { ERROR_CODES };

/**
 * Creates a standardized API error
 * 
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {*} [details] - Error details
 * @returns {ApiError} API error object
 */
export function createApiError(
    code,
    message,
    details
) {
    return {
        code,
        message,
        details,
        timestamp: Date.now(),
        stack: new Error().stack
    };
}

/**
 * Creates a network error
 * 
 * @param {string} [message] - Error message
 * @returns {ApiError} Network error object
 */
export function createNetworkError(message) {
    return createApiError(
        ERROR_CODES.NETWORK_ERROR,
        message || 'Network error occurred',
        { type: 'network' }
    );
}

/**
 * Creates a timeout error
 * 
 * @param {number} timeout - Timeout duration
 * @returns {ApiError} Timeout error object
 */
export function createTimeoutError(timeout) {
    return createApiError(
        ERROR_CODES.TIMEOUT_ERROR,
        `Request timeout after ${timeout}ms`,
        { timeout }
    );
}

/**
 * Creates an authentication error
 * 
 * @param {string} [message] - Error message
 * @returns {ApiError} Authentication error object
 */
export function createAuthenticationError(message) {
    return createApiError(
        ERROR_CODES.AUTHENTICATION_ERROR,
        message || 'Authentication failed',
        { type: 'auth' }
    );
}

/**
 * Creates an authorization error
 * 
 * @param {string} [message] - Error message
 * @returns {ApiError} Authorization error object
 */
export function createAuthorizationError(message) {
    return createApiError(
        ERROR_CODES.AUTHORIZATION_ERROR,
        message || 'Access denied',
        { type: 'authorization' }
    );
}

/**
 * Creates a validation error
 * 
 * @param {*} [details] - Error details
 * @returns {ApiError} Validation error object
 */
export function createValidationError(details) {
    return createApiError(
        ERROR_CODES.VALIDATION_ERROR,
        'Validation failed',
        details
    );
}

/**
 * Creates a not found error
 * 
 * @param {string} [resource] - Resource name
 * @returns {ApiError} Not found error object
 */
export function createNotFoundError(resource) {
    return createApiError(
        ERROR_CODES.NOT_FOUND_ERROR,
        resource ? `${resource} not found` : 'Resource not found',
        { resource }
    );
}

/**
 * Creates a server error
 * 
 * @param {number} status - HTTP status code
 * @param {string} [message] - Error message
 * @returns {ApiError} Server error object
 */
export function createServerError(status, message) {
    return createApiError(
        ERROR_CODES.SERVER_ERROR,
        message || `Server error: ${status}`,
        { status }
    );
}

/**
 * Checks if an error is an API error
 * 
 * @param {*} error - Error to check
 * @returns {error is ApiError} True if error is an API error
 */
export function isApiError(error) {
    return error && typeof error === 'object' && 'code' in error && 'message' in error;
}

/**
 * Checks if a response is an API response
 * 
 * @param {*} response - Response to check
 * @returns {response is ApiResponse} True if response is an API response
 */
export function isApiResponse(response) {
    return response && typeof response === 'object' && 'data' in response && 'status' in response;
}

/**
 * Checks if a status code indicates success
 * 
 * @param {number} status - HTTP status code
 * @returns {boolean} True if status indicates success
 */
export function isSuccessStatus(status) {
    return status >= 200 && status < 300;
}

/**
 * Checks if a status code indicates a client error
 * 
 * @param {number} status - HTTP status code
 * @returns {boolean} True if status indicates client error
 */
export function isClientError(status) {
    return status >= 400 && status < 500;
}

/**
 * Checks if a status code indicates a server error
 * 
 * @param {number} status - HTTP status code
 * @returns {boolean} True if status indicates server error
 */
export function isServerError(status) {
    return status >= 500;
}

/**
 * Gets error message from various error types
 * 
 * @param {*} error - Error object
 * @returns {string} Error message
 */
export function getErrorMessage(error) {
    if (isApiError(error)) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'Unknown error occurred';
}

/**
 * Gets status code from error or response
 * 
 * @param {*} error - Error object
 * @returns {number} HTTP status code
 */
export function getStatusCode(error) {
    if (isApiError(error)) {
        return error.details?.status || 500;
    }

    if (error?.response?.status) {
        return error.response.status;
    }

    return 500;
}

/**
 * Checks if an error should be retried
 * 
 * @param {*} error - Error object
 * @returns {boolean} True if error should be retried
 */
export function shouldRetryError(error) {
    if (!isApiError(error)) {
        return false;
    }

    const status = getStatusCode(error);

    // Retry on network errors, timeouts, and 5xx errors
    return (
        error.code === ERROR_CODES.NETWORK_ERROR ||
        error.code === ERROR_CODES.TIMEOUT_ERROR ||
        isServerError(status)
    );
}

/**
 * Generates a unique request ID
 * 
 * @returns {string} Unique request ID
 */
export function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Builds query string from parameters
 * 
 * @param {Record<string, any>} params - Query parameters
 * @returns {string} Query string
 */
export function buildQueryString(params) {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    }

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

/**
 * Parses query string to parameters object
 * 
 * @param {string} queryString - Query string
 * @returns {Record<string, string>} Parsed parameters
 */
export function parseQueryString(queryString) {
    const params = {};

    if (queryString.startsWith('?')) {
        queryString = queryString.slice(1);
    }

    const searchParams = new URLSearchParams(queryString);

    for (const [key, value] of searchParams.entries()) {
        params[key] = value;
    }

    return params;
}

/**
 * Merges headers with proper precedence
 * 
 * @param {...Record<string, string>} headers - Header objects to merge
 * @returns {Record<string, string>} Merged headers
 */
export function mergeHeaders(...headers) {
    const merged = {};

    for (const headerSet of headers) {
        for (const [key, value] of Object.entries(headerSet)) {
            merged[key] = value;
        }
    }

    return merged;
}

/**
 * Gets content type from headers
 * 
 * @param {Record<string, string>} headers - Response headers
 * @returns {string|null} Content type or null
 */
export function getContentType(headers) {
    const contentType = headers['Content-Type'] || headers['content-type'];
    return contentType || null;
}

/**
 * Checks if content type is JSON
 * 
 * @param {Record<string, string>} headers - Response headers
 * @returns {boolean} True if content type is JSON
 */
export function isJsonContent(headers) {
    const contentType = getContentType(headers);
    return contentType ? contentType.includes('application/json') : false;
}

/**
 * Parses JSON response safely
 * 
 * @template T
 * @param {string} response - Response string
 * @returns {T|null} Parsed object or null
 */
export function parseJsonResponse(response) {
    try {
        return JSON.parse(response);
    } catch {
        return null;
    }
}

/**
 * Creates a success response
 * 
 * @template T
 * @param {T} data - Response data
 * @param {number} [status] - HTTP status code
 * @returns {ApiResponse<T>} API response object
 */
export function createSuccessResponse(data, status = 200) {
    return {
        data,
        status,
        statusText: 'Success',
        headers: {},
        success: true,
        metadata: {
            duration: 0,
            cached: false,
            retryCount: 0,
            requestId: generateRequestId()
        }
    };
}

/**
 * Creates an error response
 * 
 * @template T
 * @param {ApiError} error - Error object
 * @param {number} [status] - HTTP status code
 * @returns {ApiResponse<T>} API response object
 */
export function createErrorResponse(error, status = 500) {
    return {
        data: null,
        status,
        statusText: 'Error',
        headers: {},
        success: false,
        error,
        metadata: {
            duration: 0,
            cached: false,
            retryCount: 0,
            requestId: generateRequestId()
        }
    };
}
