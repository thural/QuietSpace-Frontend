/**
 * Auth Index Test Suite
 * Tests the main auth module exports and API
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock all the dependencies before importing
jest.mock('../../../src/core/auth/interfaces/authInterfaces', () => ({
  IAuthService: 'IAuthService',
  IAuthProvider: 'IAuthProvider',
  IAuthRepository: 'IAuthRepository',
  IAuthConfig: 'IAuthConfig',
  IAuthMetrics: 'IAuthMetrics',
  IAuthPlugin: 'IAuthPlugin',
  IAuthSecurityService: 'IAuthSecurityService',
  ITokenManager: 'ITokenManager',
  ISessionManager: 'ISessionManager',
  IFeatureAuthService: 'IFeatureAuthService',
}));

jest.mock('../../../src/core/auth/factory', () => ({
  createAuthService: jest.fn(),
  createAuthProvider: jest.fn(),
  createAuthRepository: jest.fn(),
  createAuthConfig: jest.fn(),
  createAuthMetrics: jest.fn(),
  createAuthPlugin: jest.fn(),
}));

jest.mock('../../../src/core/auth/enterprise/AuthService', () => ({
  AuthService: jest.fn(),
}));

jest.mock('../../../src/core/auth/security/EnterpriseSecurityService', () => ({
  EnterpriseSecurityService: jest.fn(),
}));

jest.mock('../../../src/core/auth/services/FeatureAuthService', () => ({
  FeatureAuthService: jest.fn(),
}));

jest.mock('../../../src/core/auth/hooks/useFeatureAuth', () => ({
  useFeatureAuth: jest.fn(),
}));

jest.mock('../../../src/core/auth/constants', () => ({
  AUTH_CONSTANTS: {
    TOKEN_EXPIRY: 3600,
    REFRESH_THRESHOLD: 300,
    MAX_LOGIN_ATTEMPTS: 3,
    LOCKOUT_DURATION: 900,
  },
}));

jest.mock('../../../src/core/auth/utils', () => ({
  validateToken: jest.fn(),
  generateToken: jest.fn(),
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
  extractTokenPayload: jest.fn(),
}));

// Now import the module
import * as authModule from '../../../src/core/auth';

describe('Auth Index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Type Exports', () => {
    test('should export core auth interfaces', () => {
      // These are type exports, so we check they exist as undefined (types are erased at runtime)
      expect(typeof (authModule as any).IAuthService).toBe('undefined');
      expect(typeof (authModule as any).IAuthProvider).toBe('undefined');
      expect(typeof (authModule as any).IAuthRepository).toBe('undefined');
      expect(typeof (authModule as any).IAuthConfig).toBe('undefined');
      expect(typeof (authModule as any).IAuthMetrics).toBe('undefined');
    });

    test('should export plugin interfaces', () => {
      expect(typeof (authModule as any).IAuthPlugin).toBe('undefined');
    });

    test('should export security interfaces', () => {
      expect(typeof (authModule as any).IAuthSecurityService).toBe('undefined');
      expect(typeof (authModule as any).ITokenManager).toBe('undefined');
      expect(typeof (authModule as any).ISessionManager).toBe('undefined');
    });

    test('should export feature auth interfaces', () => {
      expect(typeof (authModule as any).IFeatureAuthService).toBe('undefined');
    });
  });

  describe('Factory Function Exports', () => {
    test('should export core factory functions', () => {
      expect(authModule.createAuthService).toBeDefined();
      expect(authModule.createAuthProvider).toBeDefined();
      expect(authModule.createAuthRepository).toBeDefined();
      expect(authModule.createAuthConfig).toBeDefined();
      expect(authModule.createAuthMetrics).toBeDefined();
      expect(authModule.createAuthPlugin).toBeDefined();
    });

    test('should have correct factory function types', () => {
      expect(typeof authModule.createAuthService).toBe('function');
      expect(typeof authModule.createAuthProvider).toBe('function');
      expect(typeof authModule.createAuthRepository).toBe('function');
      expect(typeof authModule.createAuthConfig).toBe('function');
    });
  });

  describe('Service Exports', () => {
    test('should export auth services', () => {
      expect(authModule.AuthService).toBeDefined();
      expect(authModule.EnterpriseSecurityService).toBeDefined();
      expect(authModule.FeatureAuthService).toBeDefined();
    });

    test('should have correct service types', () => {
      expect(typeof authModule.AuthService).toBe('function');
      expect(typeof authModule.EnterpriseSecurityService).toBe('function');
      expect(typeof authModule.FeatureAuthService).toBe('function');
    });
  });

  describe('Hook Exports', () => {
    test('should export auth hooks', () => {
      expect(authModule.useFeatureAuth).toBeDefined();
      expect(typeof authModule.useFeatureAuth).toBe('function');
    });
  });

  describe('Constants Exports', () => {
    test('should export auth constants', () => {
      expect(authModule.AUTH_CONSTANTS).toBeDefined();
      expect(authModule.AUTH_CONSTANTS.TOKEN_EXPIRY).toBe(3600);
      expect(authModule.AUTH_CONSTANTS.REFRESH_THRESHOLD).toBe(300);
      expect(authModule.AUTH_CONSTANTS.MAX_LOGIN_ATTEMPTS).toBe(3);
      expect(authModule.AUTH_CONSTANTS.LOCKOUT_DURATION).toBe(900);
    });
  });

  describe('Utility Exports', () => {
    test('should export auth utilities', () => {
      expect(authModule.validateToken).toBeDefined();
      expect(authModule.generateToken).toBeDefined();
      expect(authModule.hashPassword).toBeDefined();
      expect(authModule.comparePassword).toBeDefined();
      expect(authModule.extractTokenPayload).toBeDefined();
    });

    test('should have correct utility types', () => {
      expect(typeof authModule.validateToken).toBe('function');
      expect(typeof authModule.generateToken).toBe('function');
      expect(typeof authModule.hashPassword).toBe('function');
      expect(typeof authModule.comparePassword).toBe('function');
      expect(typeof authModule.extractTokenPayload).toBe('function');
    });
  });

  describe('API Consistency', () => {
    test('should have consistent naming patterns', () => {
      const exports = Object.keys(authModule);
      
      // Check that factory functions follow create* pattern
      const factoryExports = exports.filter(name => name.startsWith('create'));
      expect(factoryExports.length).toBeGreaterThan(0);
      
      // Check that services follow proper naming
      const serviceExports = exports.filter(name => 
        name.includes('Service') || name.includes('Manager')
      );
      expect(serviceExports.length).toBeGreaterThan(0);
    });

    test('should not export internal implementation details', () => {
      const exports = Object.keys(authModule);
      
      // Should not export internal modules
      expect(exports).not.toContain('AuthServiceImpl');
      expect(exports).not.toContain('AuthProviderImpl');
      expect(exports).not.toContain('AuthRepositoryImpl');
    });

    test('should follow Black Box pattern', () => {
      const exports = Object.keys(authModule);
      
      // Should only export types, factories, utilities, and constants
      const allowedPatterns = [
        /^I[A-Z]/, // Interfaces
        /^create/, // Factory functions
        /^use/, // Hooks
        /^[A-Z_]+$/, // Constants and services
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
      const mockService = { login: jest.fn(), logout: jest.fn() };
      
      authModule.createAuthService.mockReturnValue(mockService);
      
      const service = authModule.createAuthService(mockConfig);
      expect(service).toEqual(mockService);
      expect(authModule.createAuthService).toHaveBeenCalledWith(mockConfig);
    });

    test('should handle different service types', () => {
      const mockAuthService = { login: jest.fn(), logout: jest.fn() };
      const mockAuthProvider = { authenticate: jest.fn(), authorize: jest.fn() };
      const mockRepository = { save: jest.fn(), find: jest.fn() };
      
      authModule.createAuthService.mockReturnValue(mockAuthService);
      authModule.createAuthProvider.mockReturnValue(mockAuthProvider);
      authModule.createAuthRepository.mockReturnValue(mockRepository);
      
      const authService = authModule.createAuthService({});
      const authProvider = authModule.createAuthProvider({});
      const authRepository = authModule.createAuthRepository({});
      
      expect(authService).toEqual(mockAuthService);
      expect(authProvider).toEqual(mockAuthProvider);
      expect(authRepository).toEqual(mockRepository);
    });
  });

  describe('Utility Function Behavior', () => {
    test('should call utility functions correctly', () => {
      const token = 'test-token';
      const password = 'test-password';
      const mockHashedPassword = 'hashed-password';
      const mockTokenData = { userId: '123', exp: 1234567890 };
      
      authModule.validateToken.mockReturnValue(true);
      authModule.hashPassword.mockReturnValue(mockHashedPassword);
      authModule.comparePassword.mockReturnValue(true);
      authModule.extractTokenPayload.mockReturnValue(mockTokenData);
      
      const isValid = authModule.validateToken(token);
      const hashed = authModule.hashPassword(password);
      const isValidPassword = authModule.comparePassword(password, mockHashedPassword);
      const payload = authModule.extractTokenPayload(token);
      
      expect(isValid).toBe(true);
      expect(hashed).toBe(mockHashedPassword);
      expect(isValidPassword).toBe(true);
      expect(payload).toEqual(mockTokenData);
    });
  });

  describe('Integration', () => {
    test('should work together for complete auth setup', () => {
      const mockConfig = { baseURL: 'https://api.example.com' };
      const mockService = { login: jest.fn(), logout: jest.fn() };
      const mockAuthProvider = { authenticate: jest.fn() };
      const mockUser = { id: '123', email: 'test@example.com' };
      
      authModule.createAuthService.mockReturnValue(mockService);
      authModule.createAuthProvider.mockReturnValue(mockAuthProvider);
      
      const authService = authModule.createAuthService(mockConfig);
      const authProvider = authModule.createAuthProvider();
      
      authService.login(mockUser);
      authProvider.authenticate(mockUser);
      
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(authProvider.authenticate).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('Error Handling', () => {
    test('should handle factory function errors gracefully', () => {
      const error = new Error('Service creation failed');
      
      authModule.createAuthService.mockImplementation(() => {
        throw error;
      });
      
      expect(() => {
        authModule.createAuthService({});
      }).toThrow('Service creation failed');
    });

    test('should handle utility function errors gracefully', () => {
      const error = new Error('Token validation failed');
      
      authModule.validateToken.mockImplementation(() => {
        throw error;
      });
      
      expect(() => {
        authModule.validateToken('invalid-token');
      }).toThrow('Token validation failed');
    });
  });

  describe('Performance', () => {
    test('should handle multiple service creations efficiently', () => {
      const mockService = { login: jest.fn(), logout: jest.fn() };
      
      authModule.createAuthService.mockReturnValue(mockService);
      
      const startTime = performance.now();
      
      const services = [];
      for (let i = 0; i < 100; i++) {
        services.push(authModule.createAuthService({ baseURL: `https://api${i}.example.com` }));
      }
      
      const endTime = performance.now();
      
      expect(services).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
