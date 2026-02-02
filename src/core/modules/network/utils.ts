/**
 * Network Module Utilities
 *
 * Utility functions for the network system.
 * Provides helpers for error handling, validation, and common operations.
 */

import { ERROR_CODES } from './types';

import type { ApiError, ApiResponse } from './interfaces';

// Re-export ERROR_CODES for factory use
export { ERROR_CODES };

/**
 * Creates a standardized API error
 */
export function createApiError(
    code: string,
    message: string,
    details?: unknown
): ApiError {
    return {
        code,
        message,
        details,
        timestamp: Date.now(),
        stack: new Error().stack || ''
    };
}

/**
 * Creates a network error
 */
export function createNetworkError(message?: string): ApiError {
    return createApiError(
        ERROR_CODES.NETWORK_ERROR,
        message || 'Network error occurred',
        { type: 'network' }
    );
}

/**
 * Creates a timeout error
 */
export function createTimeoutError(timeout: number): ApiError {
    return createApiError(
        ERROR_CODES.TIMEOUT_ERROR,
        `Request timeout after ${timeout}ms`,
        { timeout }
    );
}

/**
 * Creates an authentication error
 */
export function createAuthenticationError(message?: string): ApiError {
    return createApiError(
        ERROR_CODES.AUTHENTICATION_ERROR,
        message || 'Authentication failed',
        { type: 'auth' }
    );
}

/**
 * Creates an authorization error
 */
export function createAuthorizationError(message?: string): ApiError {
    return createApiError(
        ERROR_CODES.AUTHORIZATION_ERROR,
        message || 'Access denied',
        { type: 'authorization' }
    );
}

/**
 * Creates a validation error
 */
export function createValidationError(details?: unknown): ApiError {
    return createApiError(
        ERROR_CODES.VALIDATION_ERROR,
        'Validation failed',
        details
    );
}

/**
 * Creates a not found error
 */
export function createNotFoundError(resource?: string): ApiError {
    return createApiError(
        ERROR_CODES.NOT_FOUND_ERROR,
        resource ? `${resource} not found` : 'Resource not found',
        { resource }
    );
}

/**
 * Creates a server error
 */
export function createServerError(status: number, message?: string): ApiError {
    return createApiError(
        ERROR_CODES.SERVER_ERROR,
        message || `Server error: ${status}`,
        { status }
    );
}

/**
 * Checks if an error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
    return Boolean(error && typeof error === 'object' && 'code' in error && 'message' in error);
}

/**
 * Checks if a response is an API response
 */
export function isApiResponse(response: unknown): response is ApiResponse<unknown> {
    return Boolean(
        response &&
        typeof response === 'object' &&
        'data' in response &&
        'status' in response
    );
}

/**
 * Checks if a status code indicates success
 */
export function isSuccessStatus(status: number): boolean {
    return status >= 200 && status < 300;
}

/**
 * Checks if a status code indicates a client error
 */
export function isClientError(status: number): boolean {
    return status >= 400 && status < 500;
}

/**
 * Checks if a status code indicates a server error
 */
export function isServerError(status: number): boolean {
    return status >= 500;
}

/**
 * Gets error message from various error types
 */
export function getErrorMessage(error: unknown): string {
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
 */
export function getStatusCode(error: unknown): number {
    if (isApiError(error)) {
        return (error.details as { status?: number })?.status || 500;
    }

    if ((error as { response?: { status?: number } })?.response?.status) {
        return (error as { response: { status: number } }).response.status;
    }

    return 500;
}

/**
 * Checks if an error should be retried
 */
export function shouldRetryError(error: unknown): boolean {
    if (!isApiError(error)) {
        return false;
    }

    const statusCode = getStatusCode(error);
    return statusCode >= 500 || statusCode === 429; // Retry server errors and rate limits
}

/**
 * Generates a unique request ID
 */
export function generateRequestId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `req_${timestamp}_${random}`;
}

/**
 * Builds query string from parameters
 */
export function buildQueryString(params: Record<string, unknown>): string {
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
 */
export function parseQueryString(queryString: string): Record<string, string> {
    const params: Record<string, string> = {};

    if (queryString.startsWith('?')) {
        queryString = queryString.slice(1);
    }

    const searchParams = new URLSearchParams(queryString);

    // Convert URLSearchParams to array first for compatibility
    const entries = Array.from(searchParams.entries());
    for (const [key, value] of entries) {
        params[key] = value;
    }

    return params;
}

/**
 * Merges headers with proper precedence
 */
export function mergeHeaders(...headers: Record<string, string>[]): Record<string, string> {
    const merged: Record<string, string> = {};

    for (const headerSet of headers) {
        for (const [key, value] of Object.entries(headerSet)) {
            merged[key] = value;
        }
    }

    return merged;
}

/**
 * Gets content type from headers
 */
export function getContentType(headers: Record<string, string>): string | null {
    const contentType = headers['Content-Type'] || headers['content-type'];
    return contentType || null;
}

/**
 * Checks if content type is JSON
 */
export function isJsonContent(headers: Record<string, string>): boolean {
    const contentType = getContentType(headers);
    return contentType ? contentType.includes('application/json') : false;
}

/**
 * Parses JSON response safely
 */
export function parseJsonResponse<T>(response: string): T | null {
    try {
        return JSON.parse(response) as T;
    } catch {
        return null;
    }
}

/**
 * Creates a success response
 */
export function createSuccessResponse<T>(data: T, status: number = 200): ApiResponse<T> {
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
 */
export function createErrorResponse<T>(error: ApiError, status: number = 500): ApiResponse<T> {
    return {
        data: null as T,
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
