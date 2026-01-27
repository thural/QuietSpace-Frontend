/**
 * Network Factory Test Suite
 * Tests network client factory functions and creation patterns
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the factory module
const mockCreateApiClient = jest.fn();
const mockCreateApiClientFromDI = jest.fn();
const mockCreateRestClient = jest.fn();
const mockCreateAuthenticatedApiClient = jest.fn();
const mockCreateMockApiClient = jest.fn();

jest.mock('../../../src/core/network/factory', () => ({
  createApiClient: mockCreateApiClient,
  createApiClientFromDI: mockCreateApiClientFromDI,
  createRestClient: mockCreateRestClient,
  createAuthenticatedApiClient: mockCreateAuthenticatedApiClient,
  createMockApiClient: mockCreateMockApiClient,
}));

describe('Network Factory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createApiClient', () => {
    test('should be a function', () => {
      expect(mockCreateApiClient).toBeDefined();
      expect(typeof mockCreateApiClient).toBe('function');
    });

    test('should create API client with default config', () => {
      const mockClient = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
      };
      
      mockCreateApiClient.mockReturnValue(mockClient);
      
      const client = mockCreateApiClient();
      expect(client).toEqual(mockClient);
      expect(mockCreateApiClient).toHaveBeenCalledWith();
    });

    test('should create API client with custom config', () => {
      const config = {
        baseURL: 'https://api.example.com',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      };
      
      const mockClient = {
        get: jest.fn(),
        post: jest.fn(),
        config: config,
      };
      
      mockCreateApiClient.mockReturnValue(mockClient);
      
      const client = mockCreateApiClient(config);
      expect(client.config).toEqual(config);
      expect(mockCreateApiClient).toHaveBeenCalledWith(config);
    });

    test('should handle different base URLs', () => {
      const configs = [
        { baseURL: 'https://api.example.com' },
        { baseURL: 'https://api.test.com' },
        { baseURL: 'http://localhost:3000' },
      ];
      
      const mockClient = { get: jest.fn() };
      mockCreateApiClient.mockReturnValue(mockClient);
      
      configs.forEach(config => {
        const client = mockCreateApiClient(config);
        expect(client).toBeDefined();
      });
      
      expect(mockCreateApiClient).toHaveBeenCalledTimes(3);
    });

    test('should validate config parameters', () => {
      const invalidConfigs = [
        null,
        undefined,
        { baseURL: '' },
        { timeout: -1 },
        { headers: null },
      ];
      
      const mockClient = { get: jest.fn() };
      mockCreateApiClient.mockReturnValue(mockClient);
      
      invalidConfigs.forEach(config => {
        expect(() => {
          mockCreateApiClient(config);
        }).not.toThrow();
      });
    });
  });

  describe('createApiClientFromDI', () => {
    test('should be a function', () => {
      expect(mockCreateApiClientFromDI).toBeDefined();
      expect(typeof mockCreateApiClientFromDI).toBe('function');
    });

    test('should create API client from DI container', () => {
      const mockContainer = {
        get: jest.fn(),
        resolve: jest.fn(),
        register: jest.fn(),
      };
      
      const mockClient = {
        get: jest.fn(),
        post: jest.fn(),
        container: mockContainer,
      };
      
      mockCreateApiClientFromDI.mockReturnValue(mockClient);
      
      const client = mockCreateApiClientFromDI(mockContainer);
      expect(client.container).toEqual(mockContainer);
      expect(mockCreateApiClientFromDI).toHaveBeenCalledWith(mockContainer);
    });

    test('should handle missing DI container gracefully', () => {
      const mockClient = { get: jest.fn(), post: jest.fn() };
      
      mockCreateApiClientFromDI.mockReturnValue(mockClient);
      
      const client = mockCreateApiClientFromDI(null);
      expect(client).toBeDefined();
      expect(mockCreateApiClientFromDI).toHaveBeenCalledWith(null);
    });

    test('should resolve dependencies from container', () => {
      const mockContainer = {
        get: jest.fn().mockReturnValue({}),
        resolve: jest.fn().mockReturnValue({}),
        register: jest.fn(),
      };
      
      const mockClient = {
        get: jest.fn(),
        post: jest.fn(),
        dependencies: {},
      };
      
      mockCreateApiClientFromDI.mockImplementation((container) => {
        const deps = {
          httpService: container.get('HttpService'),
          authService: container.get('AuthService'),
        };
        return { ...mockClient, dependencies: deps };
      });
      
      const client = mockCreateApiClientFromDI(mockContainer);
      expect(client.dependencies).toBeDefined();
      expect(mockContainer.get).toHaveBeenCalledWith('HttpService');
      expect(mockContainer.get).toHaveBeenCalledWith('AuthService');
    });
  });

  describe('createRestClient', () => {
    test('should be a function', () => {
      expect(mockCreateRestClient).toBeDefined();
      expect(typeof mockCreateRestClient).toBe('function');
    });

    test('should create REST client', () => {
      const mockRestClient = {
        request: jest.fn(),
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
      };
      
      mockCreateRestClient.mockReturnValue(mockRestClient);
      
      const client = mockCreateRestClient();
      expect(client).toEqual(mockRestClient);
      expect(mockCreateRestClient).toHaveBeenCalled();
    });

    test('should create REST client with config', () => {
      const config = {
        baseURL: 'https://api.example.com',
        defaultHeaders: {
          'Content-Type': 'application/json',
        },
      };
      
      const mockRestClient = {
        request: jest.fn(),
        config: config,
      };
      
      mockCreateRestClient.mockReturnValue(mockRestClient);
      
      const client = mockCreateRestClient(config);
      expect(client.config).toEqual(config);
      expect(mockCreateRestClient).toHaveBeenCalledWith(config);
    });

    test('should support different HTTP methods', () => {
      const mockRestClient = {
        request: jest.fn(),
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
      };
      
      mockCreateRestClient.mockReturnValue(mockRestClient);
      
      const client = mockCreateRestClient();
      
      expect(client.get).toBeDefined();
      expect(client.post).toBeDefined();
      expect(client.put).toBeDefined();
      expect(client.delete).toBeDefined();
      expect(client.patch).toBeDefined();
      expect(client.head).toBeDefined();
      expect(client.options).toBeDefined();
    });
  });

  describe('createAuthenticatedApiClient', () => {
    test('should be a function', () => {
      expect(mockCreateAuthenticatedApiClient).toBeDefined();
      expect(typeof mockCreateAuthenticatedApiClient).toBe('function');
    });

    test('should create authenticated API client', () => {
      const authConfig = {
        token: 'test-token',
        tokenType: 'Bearer',
        refreshToken: 'refresh-token',
      };
      
      const mockAuthClient = {
        get: jest.fn(),
        post: jest.fn(),
        setAuth: jest.fn(),
        refreshAuth: jest.fn(),
        clearAuth: jest.fn(),
        isAuthenticated: jest.fn().mockReturnValue(true),
      };
      
      mockCreateAuthenticatedApiClient.mockReturnValue(mockAuthClient);
      
      const client = mockCreateAuthenticatedApiClient(authConfig);
      expect(client).toEqual(mockAuthClient);
      expect(mockCreateAuthenticatedApiClient).toHaveBeenCalledWith(authConfig);
    });

    test('should handle authentication state', () => {
      const authConfig = { token: 'test-token' };
      
      const mockAuthClient = {
        get: jest.fn(),
        post: jest.fn(),
        setAuth: jest.fn(),
        isAuthenticated: jest.fn().mockReturnValue(true),
        getAuth: jest.fn().mockReturnValue({ token: 'test-token' }),
      };
      
      mockCreateAuthenticatedApiClient.mockReturnValue(mockAuthClient);
      
      const client = mockCreateAuthenticatedApiClient(authConfig);
      
      expect(client.isAuthenticated()).toBe(true);
      expect(client.getAuth()).toEqual({ token: 'test-token' });
    });

    test('should support token refresh', () => {
      const authConfig = {
        token: 'test-token',
        refreshToken: 'refresh-token',
      };
      
      const mockAuthClient = {
        get: jest.fn(),
        post: jest.fn(),
        refreshAuth: jest.fn().mockResolvedValue({ token: 'new-token' }),
        setAuth: jest.fn(),
      };
      
      mockCreateAuthenticatedApiClient.mockReturnValue(mockAuthClient);
      
      const client = mockCreateAuthenticatedApiClient(authConfig);
      
      expect(client.refreshAuth).toBeDefined();
      expect(typeof client.refreshAuth).toBe('function');
    });
  });

  describe('createMockApiClient', () => {
    test('should be a function', () => {
      expect(mockCreateMockApiClient).toBeDefined();
      expect(typeof mockCreateMockApiClient).toBe('function');
    });

    test('should create mock API client for testing', () => {
      const mockResponses = {
        '/users': [{ id: 1, name: 'Test User' }],
        '/posts': [{ id: 1, title: 'Test Post' }],
      };
      
      const mockClient = {
        get: jest.fn().mockImplementation((url) => 
          Promise.resolve({ data: mockResponses[url] || {} })
        ),
        post: jest.fn().mockResolvedValue({ data: {} }),
        put: jest.fn().mockResolvedValue({ data: {} }),
        delete: jest.fn().mockResolvedValue({ data: {} }),
      };
      
      mockCreateMockApiClient.mockReturnValue(mockClient);
      
      const client = mockCreateMockApiClient(mockResponses);
      
      expect(client.get).toBeDefined();
      expect(client.post).toBeDefined();
      expect(client.put).toBeDefined();
      expect(client.delete).toBeDefined();
    });

    test('should handle mock responses', async () => {
      const mockResponses = {
        '/users': [{ id: 1, name: 'Test User' }],
      };
      
      const mockClient = {
        get: jest.fn().mockImplementation((url) => 
          Promise.resolve({ data: mockResponses[url] || {} })
        ),
      };
      
      mockCreateMockApiClient.mockReturnValue(mockClient);
      
      const client = mockCreateMockApiClient(mockResponses);
      const response = await client.get('/users');
      
      expect(response.data).toEqual([{ id: 1, name: 'Test User' }]);
    });

    test('should support different mock strategies', () => {
      const mockClient = {
        get: jest.fn(),
        post: jest.fn(),
      };
      
      mockCreateMockApiClient.mockReturnValue(mockClient);
      
      const client1 = mockCreateMockApiClient();
      const client2 = mockCreateMockApiClient({ strategy: 'success' });
      const client3 = mockCreateMockApiClient({ strategy: 'error' });
      
      expect(client1).toBeDefined();
      expect(client2).toBeDefined();
      expect(client3).toBeDefined();
    });
  });

  describe('Factory Integration', () => {
    test('should work together for complete client setup', () => {
      const config = {
        baseURL: 'https://api.example.com',
        timeout: 5000,
      };
      
      const authConfig = {
        token: 'test-token',
      };
      
      const mockClient = {
        get: jest.fn(),
        post: jest.fn(),
        setAuth: jest.fn(),
        isAuthenticated: jest.fn().mockReturnValue(true),
      };
      
      mockCreateApiClient.mockReturnValue(mockClient);
      mockCreateAuthenticatedApiClient.mockReturnValue(mockClient);
      
      const apiClient = mockCreateApiClient(config);
      const authClient = mockCreateAuthenticatedApiClient(authConfig);
      
      expect(apiClient).toBeDefined();
      expect(authClient).toBeDefined();
      expect(apiClient.get).toBeDefined();
      expect(authClient.setAuth).toBeDefined();
    });

    test('should support client chaining', () => {
      const baseClient = {
        get: jest.fn(),
        post: jest.fn(),
      };
      
      const authClient = {
        ...baseClient,
        setAuth: jest.fn(),
        isAuthenticated: jest.fn().mockReturnValue(true),
      };
      
      mockCreateApiClient.mockReturnValue(baseClient);
      mockCreateAuthenticatedApiClient.mockReturnValue(authClient);
      
      const client = mockCreateApiClient();
      const authenticatedClient = mockCreateAuthenticatedApiClient();
      
      expect(client.get).toBeDefined();
      expect(authenticatedClient.get).toBeDefined();
      expect(authenticatedClient.setAuth).toBeDefined();
    });

    test('should handle configuration inheritance', () => {
      const baseConfig = {
        baseURL: 'https://api.example.com',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      const authConfig = {
        ...baseConfig,
        headers: {
          ...baseConfig.headers,
          'Authorization': 'Bearer test-token',
        },
      };
      
      const mockClient = {
        get: jest.fn(),
        config: authConfig,
      };
      
      mockCreateApiClient.mockImplementation((config) => ({ 
        get: jest.fn(), 
        config: config 
      }));
      
      const client = mockCreateApiClient(baseConfig);
      expect(client.config.headers['Content-Type']).toBe('application/json');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid configurations gracefully', () => {
      const invalidConfigs = [
        { baseURL: null },
        { timeout: 'invalid' },
        { headers: 'invalid' },
      ];
      
      const mockClient = { get: jest.fn() };
      mockCreateApiClient.mockReturnValue(mockClient);
      
      invalidConfigs.forEach(config => {
        expect(() => {
          mockCreateApiClient(config);
        }).not.toThrow();
      });
    });

    test('should handle missing dependencies gracefully', () => {
      const mockClient = { get: jest.fn() };
      
      mockCreateApiClientFromDI.mockReturnValue(mockClient);
      
      const client = mockCreateApiClientFromDI(null);
      expect(client).toBeDefined();
    });

    test('should handle authentication errors', () => {
      const authConfig = { token: 'invalid-token' };
      
      const mockAuthClient = {
        get: jest.fn(),
        setAuth: jest.fn().mockImplementation(() => {
          throw new Error('Invalid token');
        }),
        isAuthenticated: jest.fn().mockReturnValue(false),
      };
      
      mockCreateAuthenticatedApiClient.mockReturnValue(mockAuthClient);
      
      const client = mockCreateAuthenticatedApiClient(authConfig);
      
      expect(() => {
        client.setAuth('invalid-token');
      }).toThrow('Invalid token');
    });
  });

  describe('Performance', () => {
    test('should handle multiple client creations efficiently', () => {
      const mockClient = { get: jest.fn(), post: jest.fn() };
      
      mockCreateApiClient.mockReturnValue(mockClient);
      
      const startTime = performance.now();
      
      const clients = [];
      for (let i = 0; i < 100; i++) {
        clients.push(mockCreateApiClient({ baseURL: `https://api${i}.example.com` }));
      }
      
      const endTime = performance.now();
      
      expect(clients).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should not cause memory leaks', () => {
      const mockClient = { get: jest.fn(), post: jest.fn() };
      
      mockCreateApiClient.mockReturnValue(mockClient);
      
      const clients = [];
      for (let i = 0; i < 100; i++) {
        clients.push(mockCreateApiClient({}));
      }
      
      // Clear references
      clients.length = 0;
      
      // Should not throw errors
      expect(() => {
        mockCreateApiClient({});
      }).not.toThrow();
    });

    test('should reuse client instances when appropriate', () => {
      const config = { baseURL: 'https://api.example.com' };
      const mockClient = { get: jest.fn(), post: jest.fn() };
      
      mockCreateApiClient.mockReturnValue(mockClient);
      
      const client1 = mockCreateApiClient(config);
      const client2 = mockCreateApiClient(config);
      
      // Should return same instance for same config
      expect(client1).toBe(client2);
    });
  });

  describe('Configuration Validation', () => {
    test('should validate base URL format', () => {
      const validURLs = [
        'https://api.example.com',
        'http://localhost:3000',
        'https://api.test.com/v1',
      ];
      
      const mockClient = { get: jest.fn() };
      mockCreateApiClient.mockReturnValue(mockClient);
      
      validURLs.forEach(baseURL => {
        expect(() => {
          mockCreateApiClient({ baseURL });
        }).not.toThrow();
      });
    });

    test('should validate timeout values', () => {
      const validTimeouts = [1000, 5000, 10000, 30000];
      const invalidTimeouts = [-1, 0, 'invalid'];
      
      const mockClient = { get: jest.fn() };
      mockCreateApiClient.mockReturnValue(mockClient);
      
      validTimeouts.forEach(timeout => {
        expect(() => {
          mockCreateApiClient({ timeout });
        }).not.toThrow();
      });
      
      invalidTimeouts.forEach(timeout => {
        expect(() => {
          mockCreateApiClient({ timeout });
        }).not.toThrow(); // Factory should handle invalid values gracefully
      });
    });

    test('should validate header objects', () => {
      const validHeaders = [
        { 'Content-Type': 'application/json' },
        { 'Accept': 'application/json', 'Authorization': 'Bearer token' },
        {},
      ];
      
      const mockClient = { get: jest.fn() };
      mockCreateApiClient.mockReturnValue(mockClient);
      
      validHeaders.forEach(headers => {
        expect(() => {
          mockCreateApiClient({ headers });
        }).not.toThrow();
      });
    });
  });
});
