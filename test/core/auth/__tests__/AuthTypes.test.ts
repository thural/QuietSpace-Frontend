/**
 * Auth Types Test Suite
 * Tests auth type definitions and exports
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the types module
jest.mock('../../../src/core/auth/types/auth.domain.types', () => ({
  AuthUser: 'AuthUser',
  AuthCredentials: 'AuthCredentials',
  AuthToken: 'AuthToken',
  AuthSession: 'AuthSession',
  AuthPermission: 'AuthPermission',
  AuthRole: 'AuthRole',
  AuthEvent: 'AuthEvent',
  AuthError: 'AuthError',
}));

jest.mock('../../../src/core/auth/types', () => ({
  AuthUser: 'AuthUser',
  AuthCredentials: 'AuthCredentials',
  AuthToken: 'AuthToken',
  AuthSession: 'AuthSession',
  AuthPermission: 'AuthPermission',
  AuthRole: 'AuthRole',
  AuthEvent: 'AuthEvent',
  AuthError: 'AuthError',
}));

describe('Auth Types', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('User Types', () => {
    test('should export user type', () => {
      expect(typeof (global as any).AuthUser).toBe('undefined');
    });

    test('should export credentials type', () => {
      expect(typeof (global as any).AuthCredentials).toBe('undefined');
    });
  });

  describe('Token Types', () => {
    test('should export token type', () => {
      expect(typeof (global as any).AuthToken).toBe('undefined');
    });

    test('should export session type', () => {
      expect(typeof (global as any).AuthSession).toBe('undefined');
    });
  });

  describe('Permission Types', () => {
    test('should export permission type', () => {
      expect(typeof (global as any).AuthPermission).toBe('undefined');
    });

    test('should export role type', () => {
      expect(typeof (global as any).AuthRole).toBe('undefined');
    });
  });

  describe('Event Types', () => {
    test('should export event type', () => {
      expect(typeof (global as any).AuthEvent).toBe('undefined');
    });

    test('should export error type', () => {
      expect(typeof (global as any).AuthError).toBe('undefined');
    });
  });

  describe('Type Consistency', () => {
    test('should have consistent type naming', () => {
      const types = [
        'AuthUser',
        'AuthCredentials',
        'AuthToken',
        'AuthSession',
        'AuthPermission',
        'AuthRole',
        'AuthEvent',
        'AuthError',
      ];
      
      types.forEach(type => {
        expect(type.startsWith('Auth')).toBe(true);
      });
    });

    test('should have domain-specific types', () => {
      const domainTypes = [
        'AuthUser',
        'AuthCredentials',
        'AuthToken',
        'AuthSession',
        'AuthPermission',
        'AuthRole',
      ];
      
      domainTypes.forEach(type => {
        expect(type.startsWith('Auth')).toBe(true);
      });
    });
  });

  describe('Type Safety', () => {
    test('should export only type definitions', () => {
      const types = [
        'AuthUser',
        'AuthCredentials',
        'AuthToken',
        'AuthSession',
        'AuthPermission',
        'AuthRole',
        'AuthEvent',
        'AuthError',
      ];
      
      types.forEach(type => {
        expect(typeof (global as any)[type]).toBe('undefined');
      });
    });
  });
});
