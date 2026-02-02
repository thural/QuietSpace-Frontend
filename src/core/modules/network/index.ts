/**
 * Network Module Index - Black Box Pattern
 *
 * Exports only public interfaces and factory functions.
 * Internal implementation classes are completely hidden.
 */

// Public interfaces - Clean API for consumers
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

// Factory functions - Clean API for service creation
export {
    createApiClient,
    createApiClientFromDI,
    createRestClient,
    createAuthenticatedApiClient,
    createMockApiClient
} from './factory';

// Authenticated factory functions - Pre-configured with authentication
export {
    createAuthenticatedApiClient as createAuthApiClient,
    createAuthenticatedApiClientFromDI as createAuthApiClientFromDI,
    createTokenProvider,
    createAutoAuthApiClient,
    SimpleTokenProvider
} from './authenticatedFactory';

// DI-based factory functions
export {
    createDIAuthenticatedApiClient,
    createAutoAuthApiClient as createDIAutoAuthApiClient,
    createTokenProvider as createDITokenProvider,
    createApiClientFactory
} from './factory/diApiClientFactory';

// Token provider interface
export type { ITokenProvider } from './authenticatedFactory';

// Authenticated services - DI-based singleton services
export {
    AuthenticatedApiService
} from './services/AuthenticatedApiService';

// DI Container utilities
export {
    createNetworkContainer,
    registerNetworkServices,
    getAuthenticatedApiService,
    getApiClient
} from './di/NetworkDIContainer';

// Constants and utilities - Public API
export {
    HTTP_METHODS,
    HTTP_STATUS,
    ERROR_CODES,
    CONTENT_TYPES,
    COMMON_HEADERS,
    TIMEOUTS,
    RETRY_CONFIG,
    CACHE_CONFIG,
    RATE_LIMITS,
    REQUEST_PRIORITIES,
    ENVIRONMENT_CONFIG,
    DEFAULT_API_CONFIG,
    DEFAULT_REQUEST_HEADERS,
    DEFAULT_RESPONSE_HEADERS
} from './constants';

// Utility functions - Public API
export {
    createApiError,
    createNetworkError,
    createTimeoutError,
    createAuthenticationError,
    createAuthorizationError,
    createValidationError,
    createNotFoundError,
    createServerError,
    isApiError,
    isApiResponse,
    isSuccessStatus,
    isClientError,
    isServerError,
    getErrorMessage,
    getStatusCode,
    shouldRetryError,
    generateRequestId,
    buildQueryString,
    parseQueryString,
    mergeHeaders,
    getContentType,
    isJsonContent,
    parseJsonResponse,
    createSuccessResponse,
    createErrorResponse
} from './utils';

// Type guards and enums - Public API
export {
    RequestState,
    CacheStrategy,
    RetryStrategy,
    AuthType,
    Environment,
    LogLevel,
    RequestPriority,
    STATUS_CATEGORIES
} from './types';

// Default client instance for convenience
export { defaultApiClient } from './factory';

// Legacy exports for backward compatibility (deprecated)
// These will be removed in a future major version
export { ApiClient as _ApiClient } from './api/ApiClient';
export { RestClient as _RestClient } from './rest/RestClient';

/**
 * Network Module Version
 */
export const NETWORK_MODULE_VERSION = '1.0.0';

/**
 * Network Module Info
 */
export const NETWORK_MODULE_INFO = {
    name: 'Enterprise Network Module',
    version: NETWORK_MODULE_VERSION,
    description: 'Centralized network management with enterprise patterns',
    features: [
        'HTTP client with full REST support',
        'Authentication management',
        'Error handling and retry logic',
        'Request/response interceptors',
        'Environment-specific configurations',
        'Dependency injection support',
        'Type safety throughout',
        'Timeout and cancellation support',
        'Response parsing for multiple formats'
    ],
    dependencies: [
        '@core/di',
        '@core/cache',
        '@core/services'
    ]
};
