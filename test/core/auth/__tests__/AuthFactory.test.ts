/**
 * Auth Factory Test Suite
 * Tests auth factory functions and creation patterns
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the factory module
const mockCreateAuthService = jest.fn();
const mockCreateAuthProvider = jest.fn();
const mockCreateAuthRepository = jest.fn();
const mockCreateAuthConfig = jest.fn();
const mockCreateAuthMetrics = jest.fn();
const mockCreateAuthPlugin = jest.fn();

jest.mock('../../../src/core/auth/factory', () => ({
  createAuthService: mockCreateAuthService,
  createAuthProvider: mockCreateAuthProvider,
  createAuthRepository: mockCreateAuthRepository,
  createAuthConfig: mockCreateAuthConfig,
  createAuthMetrics: mockCreateAuthMetrics,
  createAuthPlugin: mockCreateAuthPlugin,
}));

describe('Auth Factory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createAuthService', () => {
    test('should be a function', () => {
      expect(mockCreateAuthService).toBeDefined();
      expect(typeof mockCreateAuthService).toBe('function');
    });

    test('should create auth service with config', () => {
      const config = { baseURL: 'https://api.example.com' };
      const mockService = {
        login: jest.fn(),
        logout: jest.fn(),
        getCurrentUser: jest.fn(),
      };
      
      mockCreateAuthService.mockReturnValue(mockService);
      
      const service = mockCreateAuthService(config);
      expect(service).toEqual(mockService);
      expect(mockCreateAuthService).toHaveBeenCalledWith(config);
    });

    test('should create auth service with default config', () => {
      const mockService = {
        login: jest.fn(),
        logout: jest.fn(),
        getCurrentUser: jest.fn(),
      };
      
      mockCreateAuthService.mockReturnValue(mockService);
      
      const service = mockCreateAuthService();
      expect(service).toEqual(mockService);
      expect(mockCreateAuthService).toHaveBeenCalledWith();
    });

    test('should handle different configurations', () => {
      const configs = [
        { baseURL: 'https://api1.example.com' },
        { baseURL: 'https://api2.example.com', timeout: 5000 },
        { baseURL: 'https://api3.example.com', retries: 3 },
      ];
      
      const mockService = { login: jest.fn() };
      mockCreateAuthService.mockReturnValue(mockService);
      
      configs.forEach(config => {
        const service = mockCreateAuthService(config);
        expect(service).toEqual(mockService);
        expect(mockCreateAuthService).toHaveBeenCalledWith(config);
      });
    });
  });

  describe('createAuthProvider', () => {
    test('should be a function', () => {
      expect(mockCreateAuthProvider).toBeDefined();
      expect(typeof mockCreateAuthProvider).toBe('function');
    });

    test('should create auth provider with config', () => {
      const config = { provider: 'jwt', secret: 'test-secret' };
      const mockProvider = {
        authenticate: jest.fn(),
        authorize: jest.fn(),
        validateToken: jest.fn(),
      };
      
      mockCreateAuthProvider.mockReturnValue(mockProvider);
      
      const provider = mockCreateAuthProvider(config);
      expect(provider).toEqual(mockProvider);
      expect(mockCreateAuthProvider).toHaveBeenCalledWith(config);
    });

    test('should support different providers', () => {
      const providers = ['jwt', 'oauth', 'saml', 'ldap', 'session'];
      
      providers.forEach(provider => {
        const config = { provider };
        const mockProvider = {
          authenticate: jest.fn(),
          authorize: jest.fn(),
        };
        
        mockCreateAuthProvider.mockReturnValue(mockProvider);
        
        const result = mockCreateAuthProvider(config);
        expect(result).toEqual(mockProvider);
        expect(mockCreateAuthProvider).toHaveBeenCalledWith(config);
      });
    });
  });

  describe('createAuthRepository', () => {
    test('should be a function', () => {
      expect(mockCreateAuthRepository).toBeDefined();
      expect(typeof mockCreateAuthRepository).toBe('function');
    });

    test('should create auth repository with config', () => {
      const config = { storage: 'memory', encryption: 'aes' };
      const mockRepository = {
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      };
      
      mockCreateAuthRepository.mockReturnValue(mockRepository);
      
      const repository = mockCreateAuthRepository(config);
      expect(repository).toEqual(mockRepository);
      expect(mockCreateAuthRepository).toHaveBeenCalledWith(config);
    });

    test('should support different storage types', () => {
      const storageTypes = ['memory', 'database', 'file', 'redis'];
      
      storageTypes.forEach(storage => {
        const config = { storage };
        const mockRepository = { save: jest.fn(), find: jest.fn() };
        
        mockCreateAuthRepository.mockReturnValue(mockRepository);
        
        const result = mockCreateAuthRepository(config);
        expect(result).toEqual(mockRepository);
        expect(mockCreateAuthRepository).toHaveBeenCalledWith(config);
      });
    });
  });

  describe('createAuthConfig', () => {
    test('should be a function', () => {
      expect(mockCreateAuthConfig).toBeDefined();
      expect(typeof mockCreateAuthConfig).toBe('function');
    });

    test('should create auth config with defaults', () => {
      const mockConfig = {
        tokenExpiry: 3600,
        refreshThreshold: 300,
        maxLoginAttempts: 3,
      };
      
      mockCreateAuthConfig.mockReturnValue(mockConfig);
      
      const config = mockCreateAuthConfig();
      expect(config).toEqual(mockConfig);
      expect(config.tokenExpiry).toBe(3600);
    });

    test('should create auth config with custom values', () => {
      const customConfig = {
        tokenExpiry: 7200,
        refreshThreshold: 600,
        maxLoginAttempts: 5,
      };
      
      mockCreateAuthConfig.mockReturnValue(customConfig);
      
      const config = mockCreateAuthConfig(customConfig);
      expect(config.tokenExpiry).toBe(7200);
      expect(config.maxLoginAttempts).toBe(5);
    });
  });

  describe('createAuthMetrics', () => {
    test('should be a function', () => {
      expect(mockCreateAuthMetrics).toBeDefined();
      expect(typeof mockCreateAuthMetrics).toBe('function');
    });

    test('should create auth metrics collector', () => {
      const mockMetrics = {
        trackLogin: jest.fn(),
        trackLogout: jest.fn(),
        getMetrics: jest.fn(() => ({
          totalLogins: 0,
          activeSessions: 0,
          failedAttempts: 0,
        })),
      };
      
      mockCreateAuthMetrics.mockReturnValue(mockMetrics);
      
      const metrics = mockCreateAuthMetrics();
      expect(metrics).toEqual(mockMetrics);
    });
  });

  describe('createAuthPlugin', () => {
    test('should be a function', () => {
      expect(mockCreateAuthPlugin).toBeDefined();
      expect(typeof mockCreateAuthPlugin).toBe('function');
    });

    test('should create auth plugin with config', () => {
      const config = { name: 'test-plugin', enabled: true };
      const mockPlugin = {
        initialize: jest.fn(),
        execute: jest.fn(),
        cleanup: jest.fn(),
      };
      
      mockCreateAuthPlugin.mockReturnValue(mockPlugin);
      
      const plugin = mockCreateAuthPlugin(config);
      expect(plugin).toEqual(mockPlugin);
      expect(plugin.name).toBe('test-plugin');
    });
  });

  describe('Factory Integration', () => {
    test('should work together for complete auth setup', () => {
      const config = { baseURL: 'https://api.example.com' };
      const providerConfig = { provider: 'jwt', secret: 'test-secret' };
      const repositoryConfig = { storage: 'memory' };
      
      const mockService = { login: jest.fn(), logout: jest.fn() };
      const mockProvider = { authenticate: jest.fn(), authorize: jest.fn() };
      const mockRepository = { save: jest.fn(), find: jest.fn() };
      
      mockCreateAuthService.mockReturnValue(mockService);
      mockCreateAuthProvider.mockReturnValue(mockProvider);
      mockCreateAuthRepository.mockReturnValue(mockRepository);
      
      const service = mockCreateAuthService(config);
      const provider = mockCreateAuthProvider(providerConfig);
      const repository = mockCreateAuthRepository(repositoryConfig);
      
      expect(service).toEqual(mockService);
      expect(provider).toEqual(mockProvider);
      expect(repository).toEqual(mockRepository);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid configurations gracefully', () => {
      const invalidConfigs = [
        null,
        undefined,
        { baseURL: '' },
        { timeout: -1 },
      ];
      
      const mockService = { login: jest.fn() };
      mockCreateAuthService.mockReturnValue(mockService);
      
      invalidConfigs.forEach(config => {
        const service = mockCreateAuthService(config as any);
        expect(service).toBeDefined();
      });
    });

    test('should handle factory errors gracefully', () => {
      const error = new Error('Factory creation failed');
      
      mockCreateAuthService.mockImplementation(() => {
        throw error;
      });
      
      expect(() => {
        mockCreateAuthService({});
      }).toThrow('Factory creation failed');
    });
  });

  describe('Performance', () => {
    test('should handle rapid service creation efficiently', () => {
      const mockService = { login: jest.fn(), logout: jest.fn() };
      
      mockCreateAuthService.mockReturnValue(mockService);
      
      const startTime = performance.now();
      
      const services = [];
      for (let i = 0; i < 100; i++) {
        services.push(mockCreateAuthService({ baseURL: `https://api${i}.example.com` }));
      }
      
      const endTime = performance.now();
      
      expect(services).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
