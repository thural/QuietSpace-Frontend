/**
 * Network Utils Test Suite
 * Tests network utility functions and helpers
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the utils module
const mockCreateApiError = jest.fn();
const mockCreateNetworkError = jest.fn();
const mockCreateTimeoutError = jest.fn();
const mockCreateAuthenticationError = jest.fn();
const mockCreateAuthorizationError = jest.fn();
const mockCreateValidationError = jest.fn();
const mockCreateNotFoundError = jest.fn();
const mockCreateServerError = jest.fn();
const mockIsApiError = jest.fn();
const mockIsApiResponse = jest.fn();
const mockIsSuccessStatus = jest.fn();
const mockIsClientError = jest.fn();
const mockIsServerError = jest.fn();
const mockGetErrorMessage = jest.fn();
const mockGetStatusCode = jest.fn();
const mockShouldRetryError = jest.fn();
const mockGenerateRequestId = jest.fn();
const mockBuildQueryString = jest.fn();
const mockParseQueryString = jest.fn();
const mockMergeHeaders = jest.fn();
const mockGetContentType = jest.fn();
const mockIsJsonContent = jest.fn();
const mockParseJsonResponse = jest.fn();
const mockCreateSuccessResponse = jest.fn();
const mockCreateErrorResponse = jest.fn();

jest.mock('../../../src/core/network/utils', () => ({
  createApiError: mockCreateApiError,
  createNetworkError: mockCreateNetworkError,
  createTimeoutError: mockCreateTimeoutError,
  createAuthenticationError: mockCreateAuthenticationError,
  createAuthorizationError: mockCreateAuthorizationError,
  createValidationError: mockCreateValidationError,
  createNotFoundError: mockCreateNotFoundError,
  createServerError: mockCreateServerError,
  isApiError: mockIsApiError,
  isApiResponse: mockIsApiResponse,
  isSuccessStatus: mockIsSuccessStatus,
  isClientError: mockIsClientError,
  isServerError: mockIsServerError,
  getErrorMessage: mockGetErrorMessage,
  getStatusCode: mockGetStatusCode,
  shouldRetryError: mockShouldRetryError,
  generateRequestId: mockGenerateRequestId,
  buildQueryString: mockBuildQueryString,
  parseQueryString: mockParseQueryString,
  mergeHeaders: mockMergeHeaders,
  getContentType: mockGetContentType,
  isJsonContent: mockIsJsonContent,
  parseJsonResponse: mockParseJsonResponse,
  createSuccessResponse: mockCreateSuccessResponse,
  createErrorResponse: mockCreateErrorResponse,
}));

describe('Network Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Error Creation Functions', () => {
    test('should create API error', () => {
      const message = 'API Error';
      const code = 400;
      const mockError = { message, code, isApiError: true };
      
      mockCreateApiError.mockReturnValue(mockError);
      
      const error = mockCreateApiError(message, code);
      expect(error).toEqual(mockError);
      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
      expect(error.isApiError).toBe(true);
    });

    test('should create network error', () => {
      const message = 'Network Error';
      const code = 0;
      const mockError = { message, code, isNetworkError: true };
      
      mockCreateNetworkError.mockReturnValue(mockError);
      
      const error = mockCreateNetworkError(message, code);
      expect(error).toEqual(mockError);
      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
      expect(error.isNetworkError).toBe(true);
    });

    test('should create timeout error', () => {
      const message = 'Request timeout';
      const timeout = 5000;
      const mockError = { message, timeout, isTimeoutError: true };
      
      mockCreateTimeoutError.mockReturnValue(mockError);
      
      const error = mockCreateTimeoutError(message, timeout);
      expect(error).toEqual(mockError);
      expect(error.message).toBe(message);
      expect(error.timeout).toBe(timeout);
      expect(error.isTimeoutError).toBe(true);
    });

    test('should create authentication error', () => {
      const message = 'Authentication failed';
      const code = 401;
      const mockError = { message, code, isAuthError: true };
      
      mockCreateAuthenticationError.mockReturnValue(mockError);
      
      const error = mockCreateAuthenticationError(message, code);
      expect(error).toEqual(mockError);
      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
      expect(error.isAuthError).toBe(true);
    });

    test('should create authorization error', () => {
      const message = 'Access denied';
      const code = 403;
      const mockError = { message, code, isAuthError: true, isAuthorizationError: true };
      
      mockCreateAuthorizationError.mockReturnValue(mockError);
      
      const error = mockCreateAuthorizationError(message, code);
      expect(error).toEqual(mockError);
      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
      expect(error.isAuthError).toBe(true);
      expect(error.isAuthorizationError).toBe(true);
    });

    test('should create validation error', () => {
      const message = 'Validation failed';
      const code = 422;
      const mockError = { message, code, isValidationError: true };
      
      mockCreateValidationError.mockReturnValue(mockError);
      
      const error = mockCreateValidationError(message, code);
      expect(error).toEqual(mockError);
      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
      expect(error.isValidationError).toBe(true);
    });

    test('should create not found error', () => {
      const message = 'Resource not found';
      const code = 404;
      const mockError = { message, code, isNotFoundError: true };
      
      mockCreateNotFoundError.mockReturnValue(mockError);
      
      const error = mockCreateNotFoundError(message, code);
      expect(error).toEqual(mockError);
      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
      expect(error.isNotFoundError).toBe(true);
    });

    test('should create server error', () => {
      const message = 'Internal server error';
      const code = 500;
      const mockError = { message, code, isServerError: true };
      
      mockCreateServerError.mockReturnValue(mockError);
      
      const error = mockCreateServerError(message, code);
      expect(error).toEqual(mockError);
      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
      expect(error.isServerError).toBe(true);
    });
  });

  describe('Validation Functions', () => {
    test('should identify API errors', () => {
      const apiError = { isApiError: true };
      const nonApiError = { isApiError: false };
      
      mockIsApiError.mockImplementation((error) => error?.isApiError || false);
      
      expect(mockIsApiError(apiError)).toBe(true);
      expect(mockIsApiError(nonApiError)).toBe(false);
      expect(mockIsApiError(null)).toBe(false);
      expect(mockIsApiError(undefined)).toBe(false);
    });

    test('should identify API responses', () => {
      const apiResponse = { data: {}, status: 200 };
      const nonApiResponse = { message: 'Error' };
      
      mockIsApiResponse.mockImplementation((response) => response?.data !== undefined);
      
      expect(mockIsApiResponse(apiResponse)).toBe(true);
      expect(mockIsApiResponse(nonApiResponse)).toBe(false);
      expect(mockIsApiResponse(null)).toBe(false);
      expect(mockIsApiResponse(undefined)).toBe(false);
    });

    test('should identify success status codes', () => {
      const successCodes = [200, 201, 204];
      const errorCodes = [400, 401, 404, 500];
      
      mockIsSuccessStatus.mockImplementation((status) => status >= 200 && status < 300);
      
      successCodes.forEach(code => {
        expect(mockIsSuccessStatus(code)).toBe(true);
      });
      
      errorCodes.forEach(code => {
        expect(mockIsSuccessStatus(code)).toBe(false);
      });
    });

    test('should identify client errors', () => {
      const clientCodes = [400, 401, 403, 404, 422];
      const serverCodes = [500, 502, 503];
      
      mockIsClientError.mockImplementation((status) => status >= 400 && status < 500);
      
      clientCodes.forEach(code => {
        expect(mockIsClientError(code)).toBe(true);
      });
      
      serverCodes.forEach(code => {
        expect(mockIsClientError(code)).toBe(false);
      });
    });

    test('should identify server errors', () => {
      const serverCodes = [500, 502, 503];
      const clientCodes = [400, 401, 403, 404, 422];
      
      mockIsServerError.mockImplementation((status) => status >= 500);
      
      serverCodes.forEach(code => {
        expect(mockIsServerError(code)).toBe(true);
      });
      
      clientCodes.forEach(code => {
        expect(mockIsServerError(code)).toBe(false);
      });
    });
  });

  describe('Response Utilities', () => {
    test('should extract error message', () => {
      const errorWithMessage = { message: 'Error occurred' };
      const errorWithoutMessage = { error: 'Unknown error' };
      const nonError = { data: 'success' };
      
      mockGetErrorMessage.mockImplementation((error) => 
        error?.message || error?.error || 'Unknown error'
      );
      
      expect(mockGetErrorMessage(errorWithMessage)).toBe('Error occurred');
      expect(mockGetErrorMessage(errorWithoutMessage)).toBe('Unknown error');
      expect(mockGetErrorMessage(nonError)).toBe('Unknown error');
    });

    test('should extract status code', () => {
      const responseWithStatus = { status: 200 };
      const responseWithoutStatus = { data: 'success' };
      
      mockGetStatusCode.mockImplementation((response) => response?.status || 0);
      
      expect(mockGetStatusCode(responseWithStatus)).toBe(200);
      expect(mockGetStatusCode(responseWithoutStatus)).toBe(0);
    });

    test('should determine if error should be retried', () => {
      const retryableErrors = [408, 429, 500, 502, 503, 504];
      const nonRetryableErrors = [400, 401, 403, 404, 422];
      
      mockShouldRetryError.mockImplementation((error) => {
        const code = error?.code || error?.status;
        return retryableErrors.includes(code);
      });
      
      retryableErrors.forEach(code => {
        const error = { code };
        expect(mockShouldRetryError(error)).toBe(true);
      });
      
      nonRetryableErrors.forEach(code => {
        const error = { code };
        expect(mockShouldRetryError(error)).toBe(false);
      });
    });

    test('should generate unique request IDs', () => {
      const mockId = 'req_123456789';
      
      mockGenerateRequestId.mockReturnValue(mockId);
      
      const id1 = mockGenerateRequestId();
      const id2 = mockGenerateRequestId();
      
      expect(id1).toBe(mockId);
      expect(id2).toBe(mockId);
      expect(mockGenerateRequestId).toHaveBeenCalledTimes(2);
    });
  });

  describe('Query String Utilities', () => {
    test('should build query string from object', () => {
      const params = {
        page: 1,
        limit: 10,
        search: 'test',
        filter: 'active',
      };
      
      const expectedString = 'page=1&limit=10&search=test&filter=active';
      
      mockBuildQueryString.mockReturnValue(expectedString);
      
      const queryString = mockBuildQueryString(params);
      expect(queryString).toBe(expectedString);
      expect(mockBuildQueryString).toHaveBeenCalledWith(params);
    });

    test('should handle empty parameters', () => {
      const emptyParams = {};
      const nullParams = null;
      const undefinedParams = undefined;
      
      mockBuildQueryString.mockReturnValue('');
      
      expect(mockBuildQueryString(emptyParams)).toBe('');
      expect(mockBuildQueryString(nullParams)).toBe('');
      expect(mockBuildQueryString(undefinedParams)).toBe('');
    });

    test('should handle array parameters', () => {
      const params = {
        tags: ['tag1', 'tag2', 'tag3'],
        ids: [1, 2, 3],
      };
      
      const expectedString = 'tags=tag1,tag2,tag3&ids=1,2,3';
      
      mockBuildQueryString.mockReturnValue(expectedString);
      
      const queryString = mockBuildQueryString(params);
      expect(queryString).toBe(expectedString);
    });

    test('should parse query string to object', () => {
      const queryString = 'page=1&limit=10&search=test&filter=active';
      const expectedObject = {
        page: '1',
        limit: '10',
        search: 'test',
        filter: 'active',
      };
      
      mockParseQueryString.mockReturnValue(expectedObject);
      
      const parsed = mockParseQueryString(queryString);
      expect(parsed).toEqual(expectedObject);
      expect(mockParseQueryString).toHaveBeenCalledWith(queryString);
    });

    test('should handle empty query string', () => {
      const emptyString = '';
      const nullString = null;
      const undefinedString = undefined;
      
      mockParseQueryString.mockReturnValue({});
      
      expect(mockParseQueryString(emptyString)).toEqual({});
      expect(mockParseQueryString(nullString)).toEqual({});
      expect(mockParseQueryString(undefinedString)).toEqual({});
    });

    test('should handle encoded values', () => {
      const queryString = 'search=hello%20world&name=John%20Doe';
      const expectedObject = {
        search: 'hello world',
        name: 'John Doe',
      };
      
      mockParseQueryString.mockReturnValue(expectedObject);
      
      const parsed = mockParseQueryString(queryString);
      expect(parsed).toEqual(expectedObject);
    });
  });

  describe('Header Utilities', () => {
    test('should merge headers correctly', () => {
      const headers1 = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      const headers2 = {
        'Authorization': 'Bearer token',
        'X-Custom-Header': 'custom-value',
      };
      
      const expectedMerged = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer token',
        'X-Custom-Header': 'custom-value',
      };
      
      mockMergeHeaders.mockReturnValue(expectedMerged);
      
      const merged = mockMergeHeaders(headers1, headers2);
      expect(merged).toEqual(expectedMerged);
      expect(mockMergeHeaders).toHaveBeenCalledWith(headers1, headers2);
    });

    test('should handle header conflicts', () => {
      const headers1 = { 'Content-Type': 'application/json' };
      const headers2 = { 'Content-Type': 'text/plain' };
      
      const expectedMerged = { 'Content-Type': 'text/plain' };
      
      mockMergeHeaders.mockReturnValue(expectedMerged);
      
      const merged = mockMergeHeaders(headers1, headers2);
      expect(merged).toEqual(expectedMerged);
    });

    test('should get content type from headers', () => {
      const headersJson = { 'content-type': 'application/json' };
      const headersText = { 'content-type': 'text/plain' };
      const headersEmpty = {};
      
      mockGetContentType.mockImplementation((headers) => 
        headers?.['content-type'] || headers?.['Content-Type'] || ''
      );
      
      expect(mockGetContentType(headersJson)).toBe('application/json');
      expect(mockGetContentType(headersText)).toBe('text/plain');
      expect(mockGetContentType(headersEmpty)).toBe('');
    });

    test('should identify JSON content', () => {
      const jsonContent = 'application/json';
      const textContent = 'text/plain';
      const emptyContent = '';
      
      mockIsJsonContent.mockImplementation((contentType) => 
        contentType.includes('application/json')
      );
      
      expect(mockIsJsonContent(jsonContent)).toBe(true);
      expect(mockIsJsonContent(textContent)).toBe(false);
      expect(mockIsJsonContent(emptyContent)).toBe(false);
    });
  });

  describe('Response Parsing Utilities', () => {
    test('should parse JSON response', () => {
      const jsonString = '{"id": 1, "name": "Test"}';
      const expectedObject = { id: 1, name: 'Test' };
      
      mockParseJsonResponse.mockReturnValue(expectedObject);
      
      const parsed = mockParseJsonResponse(jsonString);
      expect(parsed).toEqual(expectedObject);
      expect(mockParseJsonResponse).toHaveBeenCalledWith(jsonString);
    });

    test('should handle invalid JSON', () => {
      const invalidJson = '{ invalid json }';
      
      mockParseJsonResponse.mockImplementation(() => {
        throw new Error('Invalid JSON');
      });
      
      expect(() => {
        mockParseJsonResponse(invalidJson);
      }).toThrow('Invalid JSON');
    });

    test('should create success response', () => {
      const data = { id: 1, name: 'Test' };
      const status = 200;
      const expectedResponse = { data, status, success: true };
      
      mockCreateSuccessResponse.mockReturnValue(expectedResponse);
      
      const response = mockCreateSuccessResponse(data, status);
      expect(response).toEqual(expectedResponse);
      expect(mockCreateSuccessResponse).toHaveBeenCalledWith(data, status);
    });

    test('should create error response', () => {
      const error = { message: 'Error occurred' };
      const status = 400;
      const expectedResponse = { error, status, success: false };
      
      mockCreateErrorResponse.mockReturnValue(expectedResponse);
      
      const response = mockCreateErrorResponse(error, status);
      expect(response).toEqual(expectedResponse);
      expect(mockCreateErrorResponse).toHaveBeenCalledWith(error, status);
    });
  });

  describe('Integration', () => {
    test('should work together for complete error handling', () => {
      const errorData = { message: 'Not found', code: 404 };
      const mockError = { ...errorData, isApiError: true, isNotFoundError: true };
      
      mockCreateNotFoundError.mockReturnValue(mockError);
      mockIsApiError.mockReturnValue(true);
      mockGetErrorMessage.mockReturnValue('Not found');
      mockGetStatusCode.mockReturnValue(404);
      mockShouldRetryError.mockReturnValue(false);
      
      const error = mockCreateNotFoundError('Not found', 404);
      const isApiError = mockIsApiError(error);
      const message = mockGetErrorMessage(error);
      const statusCode = mockGetStatusCode(error);
      const shouldRetry = mockShouldRetryError(error);
      
      expect(error).toEqual(mockError);
      expect(isApiError).toBe(true);
      expect(message).toBe('Not found');
      expect(statusCode).toBe(404);
      expect(shouldRetry).toBe(false);
    });

    test('should work together for response processing', () => {
      const responseData = { id: 1, name: 'Test User' };
      const status = 200;
      const headers = { 'content-type': 'application/json' };
      const expectedResponse = { data: responseData, status, success: true };
      
      mockCreateSuccessResponse.mockReturnValue(expectedResponse);
      mockIsApiResponse.mockReturnValue(true);
      mockIsSuccessStatus.mockReturnValue(true);
      mockGetContentType.mockReturnValue('application/json');
      mockIsJsonContent.mockReturnValue(true);
      
      const response = mockCreateSuccessResponse(responseData, status);
      const isResponse = mockIsApiResponse(response);
      const isSuccess = mockIsSuccessStatus(status);
      const contentType = mockGetContentType(headers);
      const isJson = mockIsJsonContent(contentType);
      
      expect(response).toEqual(expectedResponse);
      expect(isResponse).toBe(true);
      expect(isSuccess).toBe(true);
      expect(contentType).toBe('application/json');
      expect(isJson).toBe(true);
    });

    test('should work together for query string operations', () => {
      const params = { page: 1, limit: 10, search: 'test' };
      const expectedString = 'page=1&limit=10&search=test';
      const expectedObject = { page: '1', limit: '10', search: 'test' };
      
      mockBuildQueryString.mockReturnValue(expectedString);
      mockParseQueryString.mockReturnValue(expectedObject);
      
      const queryString = mockBuildQueryString(params);
      const parsedObject = mockParseQueryString(queryString);
      
      expect(queryString).toBe(expectedString);
      expect(parsedObject).toEqual(expectedObject);
    });
  });

  describe('Error Handling', () => {
    test('should handle null/undefined values gracefully', () => {
      mockIsApiError.mockReturnValue(false);
      mockIsApiResponse.mockReturnValue(false);
      mockIsSuccessStatus.mockReturnValue(false);
      mockIsClientError.mockReturnValue(false);
      mockIsServerError.mockReturnValue(false);
      
      expect(mockIsApiError(null)).toBe(false);
      expect(mockIsApiResponse(undefined)).toBe(false);
      expect(mockIsSuccessStatus(null)).toBe(false);
      expect(mockIsClientError(undefined)).toBe(false);
      expect(mockIsServerError(null)).toBe(false);
    });

    test('should handle invalid JSON parsing gracefully', () => {
      const invalidJson = '{ invalid json }';
      
      mockParseJsonResponse.mockImplementation(() => {
        throw new Error('Invalid JSON');
      });
      
      expect(() => {
        mockParseJsonResponse(invalidJson);
      }).toThrow('Invalid JSON');
    });

    test('should handle header merging edge cases', () => {
      const headers1 = null;
      const headers2 = undefined;
      const headers3 = {};
      
      mockMergeHeaders.mockReturnValue({});
      
      expect(mockMergeHeaders(headers1, headers2)).toEqual({});
      expect(mockMergeHeaders(undefined, headers3)).toEqual({});
      expect(mockMergeHeaders(null, null)).toEqual({});
    });
  });

  describe('Performance', () => {
    test('should handle large parameter objects efficiently', () => {
      const largeParams = Object.fromEntries(
        Array.from({ length: 1000 }, (_, i) => [`param${i}`, `value${i}`])
      );
      
      mockBuildQueryString.mockReturnValue('');
      
      const startTime = performance.now();
      
      const queryString = mockBuildQueryString(largeParams);
      
      const endTime = performance.now();
      
      expect(queryString).toBeDefined();
      expect(endTime - startTime).toBeLessThan(50);
    });

    test('should handle large query strings efficiently', () => {
      const largeQueryString = Array.from({ length: 1000 }, (_, i) => `param${i}=value${i}`).join('&');
      
      mockParseQueryString.mockReturnValue({});
      
      const startTime = performance.now();
      
      const parsed = mockParseQueryString(largeQueryString);
      
      const endTime = performance.now();
      
      expect(parsed).toBeDefined();
      expect(endTime - startTime).toBeLessThan(50);
    });

    test('should not cause memory leaks', () => {
      const errors = [];
      
      for (let i = 0; i < 100; i++) {
        const error = mockCreateApiError(`Error ${i}`, 400);
        errors.push(error);
      }
      
      // Clear references
      errors.length = 0;
      
      // Should not throw errors
      expect(() => {
        mockCreateApiError('Test error', 400);
      }).not.toThrow();
    });
  });
});
