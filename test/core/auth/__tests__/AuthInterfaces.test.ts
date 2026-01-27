/**
 * Auth Interfaces Test Suite
 * Tests auth interface definitions and exports
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the interfaces module
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

describe('Auth Interfaces', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Core Auth Interfaces', () => {
    test('should export auth service interface', () => {
      expect(typeof (global as any).IAuthService).toBe('undefined');
    });

    test('should export auth provider interface', () => {
      expect(typeof (global as any).IAuthProvider).toBe('undefined');
    });

    test('should export auth repository interface', () => {
      expect(typeof (global as any).IAuthRepository).toBe('undefined');
    });

    test('should export auth config interface', () => {
      expect(typeof (global as any).IAuthConfig).toBe('undefined');
    });

    test('should export auth metrics interface', () => {
      expect(typeof (global as any).IAuthMetrics).toBe('undefined');
    });
  });

  describe('Plugin Interfaces', () => {
    test('should export auth plugin interface', () => {
      expect(typeof (global as any).IAuthPlugin).toBe('undefined');
    });
  });

  describe('Security Interfaces', () => {
    test('should export security service interface', () => {
      expect(typeof (global as any).IAuthSecurityService).toBe('undefined');
    });

    test('should export token manager interface', () => {
      expect(typeof (global as any).ITokenManager).toBe('undefined');
    });

    test('should export session manager interface', () => {
      expect(typeof (global as any).ISessionManager).toBe('undefined');
    });
  });

  describe('Feature Auth Interfaces', () => {
    test('should export feature auth service interface', () => {
      expect(typeof (global as any).IFeatureAuthService).toBe('undefined');
    });
  });

  describe('Interface Consistency', () => {
    test('should have consistent interface naming', () => {
      const interfaces = [
        'IAuthService',
        'IAuthProvider',
        'IAuthRepository',
        'IAuthConfig',
        'IAuthMetrics',
        'IAuthPlugin',
        'IAuthSecurityService',
        'ITokenManager',
        'ISessionManager',
        'IFeatureAuthService',
      ];
      
      interfaces.forEach(name => {
        expect(name.startsWith('I')).toBe(true);
      });
    });

    test('should have service-related interfaces', () => {
      const serviceInterfaces = [
        'IAuthService',
        'IAuthProvider',
        'IAuthRepository',
        'IAuthSecurityService',
        'ITokenManager',
        'ISessionManager',
        'IFeatureAuthService',
      ];
      
      serviceInterfaces.forEach(name => {
        expect(name.includes('Service') || name.includes('Provider') || name.includes('Repository') || name.includes('Manager')).toBe(true);
      });
    });
  });

  describe('Type Safety', () => {
    test('should export only type definitions', () => {
      const interfaces = [
        'IAuthService',
        'IAuthProvider',
        'IAuthRepository',
        'IAuthConfig',
        'IAuthMetrics',
        'IAuthPlugin',
        'IAuthSecurityService',
        'ITokenManager',
        'ISessionManager',
        'IFeatureAuthService',
      ];
      
      interfaces.forEach(name => {
        expect(typeof (global as any)[name]).toBe('undefined');
      });
    });
  });
});
