/**
 * Network Index Test Suite
 * Tests the main network module exports and API
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock all the dependencies before importing
jest.mock('../../../src/core/network/interfaces', () => ({
  IApiClient: 'IApiClient',
  IApiClientConfig: 'IApiClientConfig',
  ApiResponse: 'ApiResponse',
  ApiError: 'ApiError',
  AuthConfig: 'AuthConfig',
  RetryConfig: 'RetryConfig',
  CacheConfig: 'CacheConfig',
  InterceptorConfig: 'InterceptorConfig',
  RequestInterceptor: 'RequestInterceptor',
  ResponseInterceptor: 'ResponseInterceptor',
  ErrorInterceptor: 'ErrorInterceptor',
  ApiConfig: 'ApiConfig',
  ResponseMetadata: 'ResponseMetadata',
  ApiHealthStatus: 'ApiHealthStatus',
  ApiMetrics: 'ApiMetrics',
  HttpMethod: 'HttpMethod',
  ContentType: 'ContentType',
  ResponseType: 'ResponseType',
}));

jest.mock('../../../src/core/network/factory', () => ({
  createApiClient: jest.fn(),
  createApiClientFromDI: jest.fn(),
  createRestClient: jest.fn(),
  createAuthenticatedApiClient: jest.fn(),
  createMockApiClient: jest.fn(),
}));

jest.mock('../../../src/core/network/authenticatedFactory', () => ({
  createAuthenticatedApiClient: jest.fn(),
  createTokenProvider: jest.fn(),
  createAutoAuthApiClient: jest.fn(),
  SimpleTokenProvider: jest.fn(),
}));

jest.mock('../../../src/core/network/factory/diApiClientFactory', () => ({
  createDIAuthenticatedApiClient: jest.fn(),
  createTokenProvider: jest.fn(),
  createApiClientFactory: jest.fn(),
}));

jest.mock('../../../src/core/network/services/AuthenticatedApiService', () => ({
  AuthenticatedApiService: jest.fn(),
}));

jest.mock('../../../src/core/network/di/NetworkDIContainer', () => ({
  createNetworkContainer: jest.fn(),
  registerNetworkServices: jest.fn(),
  getAuthenticatedApiService: jest.fn(),
  getApiClient: jest.fn(),
}));

jest.mock('../../../src/core/network/constants', () => ({
  HTTP_METHODS: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
  },
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
  ERROR_CODES: {
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    AUTH_ERROR: 'AUTH_ERROR',
  },
  CONTENT_TYPES: {
    JSON: 'application/json',
    TEXT: 'text/plain',
    HTML: 'text/html',
  },
  COMMON_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}));

jest.mock('../../../src/core/network/utils', () => ({
  createApiError: jest.fn(),
  createNetworkError: jest.fn(),
  createTimeoutError: jest.fn(),
  createAuthenticationError: jest.fn(),
  createAuthorizationError: jest.fn(),
  createValidationError: jest.fn(),
  createNotFoundError: jest.fn(),
  createServerError: jest.fn(),
  isApiError: jest.fn(),
  isApiResponse: jest.fn(),
  isSuccessStatus: jest.fn(),
  isClientError: jest.fn(),
  isServerError: jest.fn(),
  getErrorMessage: jest.fn(),
  getStatusCode: jest.fn(),
  shouldRetryError: jest.fn(),
  generateRequestId: jest.fn(),
  buildQueryString: jest.fn(),
  parseQueryString: jest.fn(),
  mergeHeaders: jest.fn(),
  getContentType: jest.fn(),
  isJsonContent: jest.fn(),
  parseJsonResponse: jest.fn(),
  createSuccessResponse: jest.fn(),
  createErrorResponse: jest.fn(),
}));

jest.mock('../../../src/core/network/types', () => ({
  RequestState: 'RequestState',
  CacheStrategy: 'CacheStrategy',
  RetryStrategy: 'RetryStrategy',
  AuthType: 'AuthType',
  Environment: 'Environment',
  LogLevel: 'LogLevel',
  RequestPriority: 'RequestPriority',
  STATUS_CATEGORIES: 'STATUS_CATEGORIES',
}));

jest.mock('../../../src/core/network/api/ApiClient', () => ({
  ApiClient: jest.fn(),
}));

jest.mock('../../../src/core/network/rest/RestClient', () => ({
  RestClient: jest.fn(),
}));

// Now import the module
import * as networkModule from '../../../src/core/network';

describe('Network Index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Type Exports', () => {
    test('should export core interfaces', () => {
      // These are type exports, so we check they exist as undefined (types are erased at runtime)
      expect(typeof (networkModule as any).IApiClient).toBe('undefined');
      expect(typeof (networkModule as any).IApiClientConfig).toBe('undefined');
      expect(typeof (networkModule as any).ApiResponse).toBe('undefined');
      expect(typeof (networkModule as any).ApiError).toBe('undefined');
      expect(typeof (networkModule as any).AuthConfig).toBe('undefined');
      expect(typeof (networkModule as any).RetryConfig).toBe('undefined');
      expect(typeof (networkModule as any).CacheConfig).toBe('undefined');
    });

    test('should export interceptor interfaces', () => {
      expect(typeof (networkModule as any).InterceptorConfig).toBe('undefined');
      expect(typeof (networkModule as any).RequestInterceptor).toBe('undefined');
      expect(typeof (networkModule as any).ResponseInterceptor).toBe('undefined');
      expect(typeof (networkModule as any).ErrorInterceptor).toBe('undefined');
    });

    test('should export response and metadata types', () => {
      expect(typeof (networkModule as any).ResponseMetadata).toBe('undefined');
      expect(typeof (networkModule as any).ApiHealthStatus).toBe('undefined');
      expect(typeof (networkModule as any).ApiMetrics).toBe('undefined');
    });

    test('should export HTTP types', () => {
      expect(typeof (networkModule as any).HttpMethod).toBe('undefined');
      expect(typeof (networkModule as any).ContentType).toBe('undefined');
      expect(typeof (networkModule as any).ResponseType).toBe('undefined');
    });
  });

  describe('Factory Function Exports', () => {
    test('should export core factory functions', () => {
      expect(networkModule.createApiClient).toBeDefined();
      expect(networkModule.createApiClientFromDI).toBeDefined();
      expect(networkModule.createRestClient).toBeDefined();
      expect(networkModule.createAuthenticatedApiClient).toBeDefined();
      expect(networkModule.createMockApiClient).toBeDefined();
    });

    test('should export authenticated factory functions', () => {
      expect(networkModule.createAuthApiClient).toBeDefined();
      expect(networkModule.createAuthApiClientFromDI).toBeDefined();
      expect(networkModule.createTokenProvider).toBeDefined();
      expect(networkModule.createAutoAuthApiClient).toBeDefined();
      expect(networkModule.SimpleTokenProvider).toBeDefined();
    });

    test('should export DI-based factory functions', () => {
      expect(networkModule.createDIAuthenticatedApiClient).toBeDefined();
      expect(networkModule.createDIAutoAuthApiClient).toBeDefined();
      expect(networkModule.createDITokenProvider).toBeDefined();
      expect(networkModule.createApiClientFactory).toBeDefined();
    });

    test('should have correct factory function types', () => {
      expect(typeof networkModule.createApiClient).toBe('function');
      expect(typeof networkModule.createRestClient).toBe('function');
      expect(typeof networkModule.createAuthenticatedApiClient).toBe('function');
      expect(typeof networkModule.createMockApiClient).toBe('function');
    });
  });

  describe('Service Exports', () => {
    test('should export authenticated services', () => {
      expect(networkModule.AuthenticatedApiService).toBeDefined();
      expect(typeof networkModule.AuthenticatedApiService).toBe('function');
    });

    test('should export DI container utilities', () => {
      expect(networkModule.createNetworkContainer).toBeDefined();
      expect(networkModule.registerNetworkServices).toBeDefined();
      expect(networkModule.getAuthenticatedApiService).toBeDefined();
      expect(networkModule.getApiClient).toBeDefined();
    });

    test('should have correct service types', () => {
      expect(typeof networkModule.createNetworkContainer).toBe('function');
      expect(typeof networkModule.registerNetworkServices).toBe('function');
      expect(typeof networkModule.getAuthenticatedApiService).toBe('function');
      expect(typeof networkModule.getApiClient).toBe('function');
    });
  });

  describe('Constants Exports', () => {
    test('should export HTTP constants', () => {
      expect(networkModule.HTTP_METHODS).toBeDefined();
      expect(networkModule.HTTP_STATUS).toBeDefined();
      expect(networkModule.ERROR_CODES).toBeDefined();
      expect(networkModule.CONTENT_TYPES).toBeDefined();
    });

    test('should export configuration constants', () => {
      expect(networkModule.COMMON_HEADERS).toBeDefined();
      expect(networkModule.TIMEOUTS).toBeDefined();
      expect(networkModule.RETRY_CONFIG).toBeDefined();
      expect(networkModule.CACHE_CONFIG).toBeDefined();
    });

    test('should have correct HTTP method values', () => {
      expect(networkModule.HTTP_METHODS.GET).toBe('GET');
      expect(networkModule.HTTP_METHODS.POST).toBe('POST');
      expect(networkModule.HTTP_METHODS.PUT).toBe('PUT');
      expect(networkModule.HTTP_METHODS.DELETE).toBe('DELETE');
      expect(networkModule.HTTP_METHODS.PATCH).toBe('PATCH');
    });

    test('should have correct HTTP status codes', () => {
      expect(networkModule.HTTP_STATUS.OK).toBe(200);
      expect(networkModule.HTTP_STATUS.CREATED).toBe(201);
      expect(networkModule.HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(networkModule.HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(networkModule.HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(networkModule.HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });

    test('should have correct content types', () => {
      expect(networkModule.CONTENT_TYPES.JSON).toBe('application/json');
      expect(networkModule.CONTENT_TYPES.TEXT).toBe('text/plain');
      expect(networkModule.CONTENT_TYPES.HTML).toBe('text/html');
    });
  });

  describe('Utility Function Exports', () => {
    test('should export error creation utilities', () => {
      expect(networkModule.createApiError).toBeDefined();
      expect(networkModule.createNetworkError).toBeDefined();
      expect(networkModule.createTimeoutError).toBeDefined();
      expect(networkModule.createAuthenticationError).toBeDefined();
      expect(networkModule.createAuthorizationError).toBeDefined();
      expect(networkModule.createValidationError).toBeDefined();
      expect(networkModule.createNotFoundError).toBeDefined();
      expect(networkModule.createServerError).toBeDefined();
    });

    test('should export validation utilities', () => {
      expect(networkModule.isApiError).toBeDefined();
      expect(networkModule.isApiResponse).toBeDefined();
      expect(networkModule.isSuccessStatus).toBeDefined();
      expect(networkModule.isClientError).toBeDefined();
      expect(networkModule.isServerError).toBeDefined();
    });

    test('should export response utilities', () => {
      expect(networkModule.getErrorMessage).toBeDefined();
      expect(networkModule.getStatusCode).toBeDefined();
      expect(networkModule.shouldRetryError).toBeDefined();
      expect(networkModule.generateRequestId).toBeDefined();
    });

    test('should export parsing utilities', () => {
      expect(networkModule.buildQueryString).toBeDefined();
      expect(networkModule.parseQueryString).toBeDefined();
      expect(networkModule.mergeHeaders).toBeDefined();
      expect(networkModule.getContentType).toBeDefined();
      expect(networkModule.isJsonContent).toBeDefined();
      expect(networkModule.parseJsonResponse).toBeDefined();
    });

    test('should export response creation utilities', () => {
      expect(networkModule.createSuccessResponse).toBeDefined();
      expect(networkModule.createErrorResponse).toBeDefined();
    });
  });

  describe('Type Guard Exports', () => {
    test('should export type guards', () => {
      expect(networkModule.RequestState).toBeDefined();
      expect(networkModule.CacheStrategy).toBeDefined();
      expect(networkModule.RetryStrategy).toBeDefined();
      expect(networkModule.AuthType).toBeDefined();
      expect(networkModule.Environment).toBeDefined();
      expect(networkModule.LogLevel).toBeDefined();
      expect(networkModule.RequestPriority).toBeDefined();
      expect(networkModule.STATUS_CATEGORIES).toBeDefined();
    });
  });

  describe('Legacy Exports', () => {
    test('should export legacy implementation classes with underscore prefix', () => {
      expect(networkModule._ApiClient).toBeDefined();
      expect(networkModule._RestClient).toBeDefined();
    });

    test('should have correct legacy export types', () => {
      expect(typeof networkModule._ApiClient).toBe('function');
      expect(typeof networkModule._RestClient).toBe('function');
    });
  });

  describe('Module Information', () => {
    test('should export module version', () => {
      expect(networkModule.NETWORK_MODULE_VERSION).toBe('1.0.0');
    });

    test('should export module info', () => {
      expect(networkModule.NETWORK_MODULE_INFO).toBeDefined();
      expect(networkModule.NETWORK_MODULE_INFO.name).toBe('Enterprise Network Module');
      expect(networkModule.NETWORK_MODULE_INFO.version).toBe('1.0.0');
      expect(networkModule.NETWORK_MODULE_INFO.description).toBe('Centralized network management with enterprise patterns');
    });

    test('should include features in module info', () => {
      expect(networkModule.NETWORK_MODULE_INFO.features).toContain('HTTP client with full REST support');
      expect(networkModule.NETWORK_MODULE_INFO.features).toContain('Authentication management');
      expect(networkModule.NETWORK_MODULE_INFO.features).toContain('Error handling and retry logic');
      expect(networkModule.NETWORK_MODULE_INFO.features).toContain('Request/response interceptors');
    });

    test('should include dependencies in module info', () => {
      expect(networkModule.NETWORK_MODULE_INFO.dependencies).toContain('@core/di');
      expect(networkModule.NETWORK_MODULE_INFO.dependencies).toContain('@core/cache');
      expect(networkModule.NETWORK_MODULE_INFO.dependencies).toContain('@core/services');
    });
  });

  describe('Default Client Export', () => {
    test('should export default API client', () => {
      expect(networkModule.defaultApiClient).toBeDefined();
    });
  });

  describe('API Consistency', () => {
    test('should have consistent naming patterns', () => {
      const exports = Object.keys(networkModule);
      
      // Check that factory functions follow create* pattern
      const factoryExports = exports.filter(name => name.startsWith('create'));
      expect(factoryExports.length).toBeGreaterThan(0);
      
      // Check that utility functions follow descriptive patterns
      const utilExports = exports.filter(name => 
        name.startsWith('is') || 
        name.startsWith('get') || 
        name.startsWith('should') ||
        name.startsWith('build') ||
        name.startsWith('parse') ||
        name.startsWith('merge')
      );
      expect(utilExports.length).toBeGreaterThan(0);
    });

    test('should not export internal implementation details', () => {
      const exports = Object.keys(networkModule);
      
      // Should not export internal modules
      expect(exports).not.toContain('ApiClientImpl');
      expect(exports).not.toContain('RestClientImpl');
      expect(exports).not.toContain('NetworkService');
    });

    test('should follow Black Box pattern', () => {
      const exports = Object.keys(networkModule);
      
      // Should only export types, factories, utilities, and constants
      const allowedPatterns = [
        /^[A-Z][a-zA-Z]*$/, // Types and interfaces
        /^create/, // Factory functions
        /^is/, // Validation functions
        /^get/, // Utility functions
        /^should/, // Validation functions
        /^build/, // Builder functions
        /^parse/, // Parser functions
        /^merge/, // Merger functions
        /^[A-Z_]+$/, // Constants and legacy exports
      ];
      
      exports.forEach(exportName => {
        const matchesPattern = allowedPatterns.some(pattern => pattern.test(exportName));
        expect(matchesPattern).toBe(true);
      });
    });
  });

  describe('Factory Function Behavior', () => {
    test('should call factory functions correctly', () => {
      const mockConfig = { baseURL: 'https://api.example.com' };
      const mockClient = { get: jest.fn(), post: jest.fn() };
      
      networkModule.createApiClient.mockReturnValue(mockClient);
      
      const client = networkModule.createApiClient(mockConfig);
      expect(client).toEqual(mockClient);
      expect(networkModule.createApiClient).toHaveBeenCalledWith(mockConfig);
    });

    test('should handle different client types', () => {
      const restClient = { request: jest.fn() };
      const mockClient = { get: jest.fn(), post: jest.fn() };
      const authenticatedClient = { get: jest.fn(), post: jest.fn(), auth: jest.fn() };
      
      networkModule.createRestClient.mockReturnValue(restClient);
      networkModule.createApiClient.mockReturnValue(mockClient);
      networkModule.createAuthenticatedApiClient.mockReturnValue(authenticatedClient);
      
      const rest = networkModule.createRestClient();
      const api = networkModule.createApiClient();
      const auth = networkModule.createAuthenticatedApiClient();
      
      expect(rest).toEqual(restClient);
      expect(api).toEqual(mockClient);
      expect(auth).toEqual(authenticatedClient);
    });
  });

  describe('Utility Function Behavior', () => {
    test('should call error creation functions', () => {
      const mockError = { message: 'Test error', code: 500 };
      
      networkModule.createApiError.mockReturnValue(mockError);
      
      const error = networkModule.createApiError('Test error', 500);
      expect(error).toEqual(mockError);
      expect(networkModule.createApiError).toHaveBeenCalledWith('Test error', 500);
    });

    test('should call validation functions', () => {
      const mockResponse = { status: 200, data: {} };
      
      networkModule.isApiResponse.mockReturnValue(true);
      networkModule.isSuccessStatus.mockReturnValue(true);
      
      const isResponse = networkModule.isApiResponse(mockResponse);
      const isSuccess = networkModule.isSuccessStatus(200);
      
      expect(isResponse).toBe(true);
      expect(isSuccess).toBe(true);
    });

    test('should call parsing utilities', () => {
      const mockQuery = { page: 1, limit: 10 };
      const mockString = 'page=1&limit=10';
      
      networkModule.buildQueryString.mockReturnValue(mockString);
      networkModule.parseQueryString.mockReturnValue(mockQuery);
      
      const queryString = networkModule.buildQueryString(mockQuery);
      const parsedQuery = networkModule.parseQueryString(mockString);
      
      expect(queryString).toBe(mockString);
      expect(parsedQuery).toEqual(mockQuery);
    });
  });

  describe('Integration', () => {
    test('should work together for complete network setup', () => {
      const mockConfig = { baseURL: 'https://api.example.com' };
      const mockClient = { get: jest.fn(), post: jest.fn() };
      const mockError = { message: 'Network error', code: 0 };
      const mockResponse = { status: 200, data: { id: 1 } };
      
      networkModule.createApiClient.mockReturnValue(mockClient);
      networkModule.createNetworkError.mockReturnValue(mockError);
      networkModule.createSuccessResponse.mockReturnValue(mockResponse);
      networkModule.isApiError.mockReturnValue(false);
      networkModule.isSuccessStatus.mockReturnValue(true);
      
      const client = networkModule.createApiClient(mockConfig);
      const error = networkModule.createNetworkError('Network error');
      const response = networkModule.createSuccessResponse({ id: 1 });
      const isError = networkModule.isApiError(error);
      const isSuccess = networkModule.isSuccessStatus(response.status);
      
      expect(client).toBeDefined();
      expect(error).toBeDefined();
      expect(response).toBeDefined();
      expect(isError).toBe(false);
      expect(isSuccess).toBe(true);
    });

    test('should support authenticated client creation', () => {
      const mockAuthConfig = { token: 'test-token' };
      const mockAuthClient = { 
        get: jest.fn(), 
        post: jest.fn(), 
        setAuth: jest.fn(),
        refreshAuth: jest.fn()
      };
      
      networkModule.createAuthApiClient.mockReturnValue(mockAuthClient);
      
      const authClient = networkModule.createAuthApiClient(mockAuthConfig);
      expect(authClient).toEqual(mockAuthClient);
      expect(networkModule.createAuthApiClient).toHaveBeenCalledWith(mockAuthConfig);
    });
  });

  describe('Error Handling', () => {
    test('should handle factory function errors gracefully', () => {
      const error = new Error('Client creation failed');
      
      networkModule.createApiClient.mockImplementation(() => {
        throw error;
      });
      
      expect(() => {
        networkModule.createApiClient({});
      }).toThrow('Client creation failed');
    });

    test('should handle utility function errors gracefully', () => {
      const error = new Error('Validation failed');
      
      networkModule.isApiResponse.mockImplementation(() => {
        throw error;
      });
      
      expect(() => {
        networkModule.isApiResponse(null);
      }).toThrow('Validation failed');
    });
  });

  describe('Performance', () => {
    test('should handle multiple client creations efficiently', () => {
      const mockClient = { get: jest.fn(), post: jest.fn() };
      
      networkModule.createApiClient.mockReturnValue(mockClient);
      
      const startTime = performance.now();
      
      const clients = [];
      for (let i = 0; i < 100; i++) {
        clients.push(networkModule.createApiClient({ baseURL: `https://api${i}.example.com` }));
      }
      
      const endTime = performance.now();
      
      expect(clients).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should not cause memory leaks', () => {
      const mockClient = { get: jest.fn(), post: jest.fn() };
      
      networkModule.createApiClient.mockReturnValue(mockClient);
      
      const clients = [];
      for (let i = 0; i < 100; i++) {
        clients.push(networkModule.createApiClient({}));
      }
      
      // Clear references
      clients.length = 0;
      
      // Should not throw errors
      expect(() => {
        networkModule.createApiClient({});
      }).not.toThrow();
    });
  });
});
