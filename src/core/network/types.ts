/**
 * Network Module Types
 * 
 * Defines types and enums for the network system.
 * Complements the interfaces with additional type definitions.
 */

// Import types from interfaces
import type {
    ApiError,
    ApiResponse,
    IApiClientConfig,
    RetryConfig,
    CacheConfig
} from './interfaces';

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
} as const;

// HTTP Methods
export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    HEAD: 'HEAD',
    OPTIONS: 'OPTIONS'
} as const;

// Content Types
export const CONTENT_TYPES = {
    JSON: 'application/json',
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
    FORM_DATA: 'multipart/form-data',
    TEXT: 'text/plain',
    HTML: 'text/html',
    XML: 'application/xml'
} as const;

// Error Codes
export const ERROR_CODES = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    CONFIGURATION_ERROR: 'CONFIGURATION_ERROR'
} as const;

// Request States
export enum RequestState {
    PENDING = 'pending',
    SUCCESS = 'success',
    ERROR = 'error',
    CANCELLED = 'cancelled'
}

// Cache Strategies
export enum CacheStrategy {
    NO_CACHE = 'no-cache',
    CACHE_FIRST = 'cache-first',
    NETWORK_FIRST = 'network-first',
    STALE_WHILE_REVALIDATE = 'stale-while-revalidate'
}

// Retry Strategies
export enum RetryStrategy {
    NONE = 'none',
    LINEAR = 'linear',
    EXPONENTIAL = 'exponential',
    FIXED = 'fixed'
}

// Auth Types
export enum AuthType {
    NONE = 'none',
    BEARER = 'bearer',
    BASIC = 'basic',
    API_KEY = 'api-key',
    CUSTOM = 'custom'
}

// Environment Types
export enum Environment {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
    TEST = 'test'
}

// Log Levels
export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

// Request Priority
export enum RequestPriority {
    LOW = 'low',
    NORMAL = 'normal',
    HIGH = 'high',
    CRITICAL = 'critical'
}

// HTTP Status Categories
export const STATUS_CATEGORIES = {
    INFORMATIONAL: (status: number) => status >= 100 && status < 200,
    SUCCESS: (status: number) => status >= 200 && status < 300,
    REDIRECTION: (status: number) => status >= 300 && status < 400,
    CLIENT_ERROR: (status: number) => status >= 400 && status < 500,
    SERVER_ERROR: (status: number) => status >= 500 && status < 600
} as const;

// Type Guards
export function isApiError(error: any): error is ApiError {
    return error && typeof error === 'object' && 'code' in error && 'message' in error;
}

export function isApiResponse(response: any): response is ApiResponse<any> {
    return response && typeof response === 'object' && 'data' in response && 'status' in response;
}

export function isSuccessStatus(status: number): boolean {
    return status >= 200 && status < 300;
}

export function isClientError(status: number): boolean {
    return status >= 400 && status < 500;
}

export function isServerError(status: number): boolean {
    return status >= 500;
}

// Utility Types
export type Partial<T> = {
    [P in keyof T]?: T[P];
};

export type Required<T> = {
    [P in keyof T]-?: T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Default Configurations
export const DEFAULT_API_CONFIG: IApiClientConfig = {
    timeout: 10000,
    headers: {
        'Content-Type': CONTENT_TYPES.JSON
    },
    retryConfig: {
        maxAttempts: 3,
        retryDelay: 1000,
        exponentialBackoff: true
    },
    cacheConfig: {
        enabled: true,
        ttl: 300000 // 5 minutes
    }
};

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxAttempts: 3,
    retryDelay: 1000,
    exponentialBackoff: true
};

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
    enabled: true,
    ttl: 300000
};

// Type Imports (re-export for convenience)
export type {
    IApiClient,
    IApiClientConfig,
    ApiResponse,
    ApiError,
    AuthConfig,
    RetryConfig,
    CacheConfig,
    InterceptorConfig,
    RequestInterceptor,
    ResponseInterceptor,
    ErrorInterceptor,
    ApiConfig,
    ResponseMetadata,
    ApiHealthStatus,
    ApiMetrics,
    HttpMethod,
    ContentType,
    ResponseType
} from './interfaces';
