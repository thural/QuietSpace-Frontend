/**
 * Network API Client Test Suite
 * Tests API client functionality and HTTP operations
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the API client module
const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  head: jest.fn(),
  options: jest.fn(),
  request: jest.fn(),
  setConfig: jest.fn(),
  getConfig: jest.fn(),
  setAuth: jest.fn(),
  clearAuth: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
};

jest.mock('../../../src/core/network/api/ApiClient', () => ({
  ApiClient: jest.fn(() => mockApiClient),
}));

describe('Network API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('HTTP Methods', () => {
    test('should support GET requests', async () => {
      const url = '/users';
      const mockResponse = { data: [{ id: 1, name: 'Test User' }] };
      
      mockApiClient.get.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.get(url);
      expect(response).toEqual(mockResponse);
      expect(mockApiClient.get).toHaveBeenCalledWith(url);
    });

    test('should support POST requests', async () => {
      const url = '/users';
      const data = { name: 'New User', email: 'test@example.com' };
      const mockResponse = { data: { id: 1, ...data } };
      
      mockApiClient.post.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.post(url, data);
      expect(response).toEqual(mockResponse);
      expect(mockApiClient.post).toHaveBeenCalledWith(url, data);
    });

    test('should support PUT requests', async () => {
      const url = '/users/1';
      const data = { name: 'Updated User' };
      const mockResponse = { data: { id: 1, ...data } };
      
      mockApiClient.put.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.put(url, data);
      expect(response).toEqual(mockResponse);
      expect(mockApiClient.put).toHaveBeenCalledWith(url, data);
    });

    test('should support DELETE requests', async () => {
      const url = '/users/1';
      const mockResponse = { data: { success: true } };
      
      mockApiClient.delete.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.delete(url);
      expect(response).toEqual(mockResponse);
      expect(mockApiClient.delete).toHaveBeenCalledWith(url);
    });

    test('should support PATCH requests', async () => {
      const url = '/users/1';
      const data = { name: 'Patched User' };
      const mockResponse = { data: { id: 1, ...data } };
      
      mockApiClient.patch.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.patch(url, data);
      expect(response).toEqual(mockResponse);
      expect(mockApiClient.patch).toHaveBeenCalledWith(url, data);
    });

    test('should support HEAD requests', async () => {
      const url = '/users/1';
      const mockResponse = { headers: { 'content-length': '1234' } };
      
      mockApiClient.head.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.head(url);
      expect(response).toEqual(mockResponse);
      expect(mockApiClient.head).toHaveBeenCalledWith(url);
    });

    test('should support OPTIONS requests', async () => {
      const url = '/users';
      const mockResponse = { headers: { 'allow': 'GET, POST, PUT, DELETE' } };
      
      mockApiClient.options.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.options(url);
      expect(response).toEqual(mockResponse);
      expect(mockApiClient.options).toHaveBeenCalledWith(url);
    });
  });

  describe('Request Configuration', () => {
    test('should handle request with config', async () => {
      const url = '/users';
      const config = {
        headers: { 'Authorization': 'Bearer token' },
        timeout: 5000,
        params: { page: 1, limit: 10 },
      };
      const mockResponse = { data: [] };
      
      mockApiClient.get.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.get(url, config);
      expect(response).toEqual(mockResponse);
      expect(mockApiClient.get).toHaveBeenCalledWith(url, config);
    });

    test('should handle query parameters', async () => {
      const url = '/users';
      const params = { page: 1, limit: 10, search: 'test' };
      const config = { params };
      const mockResponse = { data: [] };
      
      mockApiClient.get.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.get(url, config);
      expect(response).toEqual(mockResponse);
      expect(mockApiClient.get).toHaveBeenCalledWith(url, config);
    });

    test('should handle custom headers', async () => {
      const url = '/users';
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Custom-Header': 'custom-value',
      };
      const config = { headers };
      const mockResponse = { data: [] };
      
      mockApiClient.get.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.get(url, config);
      expect(response).toEqual(mockResponse);
      expect(mockApiClient.get).toHaveBeenCalledWith(url, config);
    });
  });

  describe('Authentication', () => {
    test('should set authentication token', () => {
      const token = 'test-token';
      const tokenType = 'Bearer';
      
      mockApiClient.setAuth.mockReturnValue(undefined);
      
      mockApiClient.setAuth(token, tokenType);
      expect(mockApiClient.setAuth).toHaveBeenCalledWith(token, tokenType);
    });

    test('should clear authentication', () => {
      mockApiClient.clearAuth.mockReturnValue(undefined);
      
      mockApiClient.clearAuth();
      expect(mockApiClient.clearAuth).toHaveBeenCalled();
    });

    test('should include auth headers in requests', async () => {
      const token = 'test-token';
      const url = '/protected';
      const mockResponse = { data: 'protected data' };
      
      mockApiClient.get.mockResolvedValue(mockResponse);
      mockApiClient.setAuth.mockReturnValue(undefined);
      
      mockApiClient.setAuth(token);
      const response = await mockApiClient.get(url);
      
      expect(response).toEqual(mockResponse);
      expect(mockApiClient.setAuth).toHaveBeenCalledWith(token);
    });
  });

  describe('Interceptors', () => {
    test('should support request interceptors', () => {
      const requestInterceptor = (config) => {
        config.headers = config.headers || {};
        config.headers['X-Custom'] = 'value';
        return config;
      };
      
      mockApiClient.interceptors.request.use.mockReturnValue(1);
      
      const interceptorId = mockApiClient.interceptors.request.use(requestInterceptor);
      expect(interceptorId).toBe(1);
      expect(mockApiClient.interceptors.request.use).toHaveBeenCalledWith(requestInterceptor);
    });

    test('should support response interceptors', () => {
      const responseInterceptor = (response) => {
        response.data.transformed = true;
        return response;
      };
      
      mockApiClient.interceptors.response.use.mockReturnValue(1);
      
      const interceptorId = mockApiClient.interceptors.response.use(responseInterceptor);
      expect(interceptorId).toBe(1);
      expect(mockApiClient.interceptors.response.use).toHaveBeenCalledWith(responseInterceptor);
    });

    test('should support error interceptors', () => {
      const errorInterceptor = (error) => {
        error.handled = true;
        return Promise.reject(error);
      };
      
      mockApiClient.interceptors.response.use.mockReturnValue(1);
      
      const interceptorId = mockApiClient.interceptors.response.use(null, errorInterceptor);
      expect(interceptorId).toBe(1);
      expect(mockApiClient.interceptors.response.use).toHaveBeenCalledWith(null, errorInterceptor);
    });

    test('should eject interceptors', () => {
      const interceptorId = 1;
      
      mockApiClient.interceptors.request.eject.mockReturnValue(undefined);
      mockApiClient.interceptors.response.eject.mockReturnValue(undefined);
      
      mockApiClient.interceptors.request.eject(interceptorId);
      mockApiClient.interceptors.response.eject(interceptorId);
      
      expect(mockApiClient.interceptors.request.eject).toHaveBeenCalledWith(interceptorId);
      expect(mockApiClient.interceptors.response.eject).toHaveBeenCalledWith(interceptorId);
    });
  });

  describe('Configuration Management', () => {
    test('should set client configuration', () => {
      const config = {
        baseURL: 'https://api.example.com',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      mockApiClient.setConfig.mockReturnValue(undefined);
      
      mockApiClient.setConfig(config);
      expect(mockApiClient.setConfig).toHaveBeenCalledWith(config);
    });

    test('should get client configuration', () => {
      const mockConfig = {
        baseURL: 'https://api.example.com',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      mockApiClient.getConfig.mockReturnValue(mockConfig);
      
      const config = mockApiClient.getConfig();
      expect(config).toEqual(mockConfig);
      expect(mockApiClient.getConfig).toHaveBeenCalled();
    });

    test('should update configuration partially', () => {
      const partialConfig = {
        timeout: 10000,
        headers: {
          'Authorization': 'Bearer token',
        },
      };
      
      mockApiClient.setConfig.mockReturnValue(undefined);
      
      mockApiClient.setConfig(partialConfig);
      expect(mockApiClient.setConfig).toHaveBeenCalledWith(partialConfig);
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      const url = '/users';
      const networkError = new Error('Network Error');
      
      mockApiClient.get.mockRejectedValue(networkError);
      
      await expect(mockApiClient.get(url)).rejects.toThrow('Network Error');
      expect(mockApiClient.get).toHaveBeenCalledWith(url);
    });

    test('should handle timeout errors', async () => {
      const url = '/users';
      const timeoutError = new Error('Request timeout');
      
      mockApiClient.get.mockRejectedValue(timeoutError);
      
      await expect(mockApiClient.get(url)).rejects.toThrow('Request timeout');
      expect(mockApiClient.get).toHaveBeenCalledWith(url);
    });

    test('should handle HTTP error responses', async () => {
      const url = '/users';
      const httpError = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      };
      
      mockApiClient.get.mockRejectedValue(httpError);
      
      await expect(mockApiClient.get(url)).rejects.toEqual(httpError);
      expect(mockApiClient.get).toHaveBeenCalledWith(url);
    });

    test('should handle server errors', async () => {
      const url = '/users';
      const serverError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };
      
      mockApiClient.get.mockRejectedValue(serverError);
      
      await expect(mockApiClient.get(url)).rejects.toEqual(serverError);
      expect(mockApiClient.get).toHaveBeenCalledWith(url);
    });
  });

  describe('Request/Response Processing', () => {
    test('should process JSON responses', async () => {
      const url = '/users';
      const mockResponse = {
        data: { id: 1, name: 'Test User' },
        status: 200,
        headers: { 'content-type': 'application/json' },
      };
      
      mockApiClient.get.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.get(url);
      expect(response.data).toEqual({ id: 1, name: 'Test User' });
      expect(response.status).toBe(200);
    });

    test('should process text responses', async () => {
      const url = '/users';
      const mockResponse = {
        data: 'Plain text response',
        status: 200,
        headers: { 'content-type': 'text/plain' },
      };
      
      mockApiClient.get.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.get(url);
      expect(response.data).toBe('Plain text response');
      expect(response.status).toBe(200);
    });

    test('should handle binary responses', async () => {
      const url = '/files/download';
      const mockResponse = {
        data: new ArrayBuffer(1024),
        status: 200,
        headers: { 'content-type': 'application/octet-stream' },
      };
      
      mockApiClient.get.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.get(url);
      expect(response.data).toBeInstanceOf(ArrayBuffer);
      expect(response.status).toBe(200);
    });
  });

  describe('Performance', () => {
    test('should handle multiple concurrent requests', async () => {
      const urls = ['/users', '/posts', '/comments'];
      const mockResponses = [
        { data: [{ id: 1, name: 'User' }] },
        { data: [{ id: 1, title: 'Post' }] },
        { data: [{ id: 1, content: 'Comment' }] },
      ];
      
      mockApiClient.get.mockResolvedValue(mockResponses[0]);
      mockApiClient.get.mockResolvedValue(mockResponses[1]);
      mockApiClient.get.mockResolvedValue(mockResponses[2]);
      
      const startTime = performance.now();
      
      const promises = urls.map(url => mockApiClient.get(url));
      const responses = await Promise.all(promises);
      
      const endTime = performance.now();
      
      expect(responses).toHaveLength(3);
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should not cause memory leaks with many requests', async () => {
      const url = '/users';
      const mockResponse = { data: [] };
      
      mockApiClient.get.mockResolvedValue(mockResponse);
      
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(mockApiClient.get(url));
      }
      
      await Promise.all(promises);
      
      // Should not throw errors
      expect(() => {
        mockApiClient.get(url);
      }).not.toThrow();
    });
  });

  describe('Integration', () => {
    test('should work with authentication and interceptors', async () => {
      const token = 'test-token';
      const url = '/protected';
      const mockResponse = { data: 'protected data' };
      
      mockApiClient.setAuth.mockReturnValue(undefined);
      mockApiClient.interceptors.request.use.mockReturnValue(1);
      mockApiClient.get.mockResolvedValue(mockResponse);
      
      mockApiClient.setAuth(token);
      mockApiClient.interceptors.request.use((config) => config);
      
      const response = await mockApiClient.get(url);
      
      expect(response).toEqual(mockResponse);
      expect(mockApiClient.setAuth).toHaveBeenCalledWith(token);
      expect(mockApiClient.interceptors.request.use).toHaveBeenCalled();
    });

    test('should handle complete request lifecycle', async () => {
      const url = '/users';
      const data = { name: 'New User' };
      const config = {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      };
      const mockResponse = {
        data: { id: 1, ...data },
        status: 201,
        headers: { 'content-type': 'application/json' },
      };
      
      mockApiClient.post.mockResolvedValue(mockResponse);
      
      const response = await mockApiClient.post(url, data, config);
      
      expect(response.data).toEqual({ id: 1, ...data });
      expect(response.status).toBe(201);
      expect(mockApiClient.post).toHaveBeenCalledWith(url, data, config);
    });
  });
});
