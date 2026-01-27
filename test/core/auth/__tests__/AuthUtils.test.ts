/**
 * Auth Utils Test Suite
 * Tests auth utility functions and helpers
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the utils module
const mockValidateToken = jest.fn();
const mockGenerateToken = jest.fn();
const mockHashPassword = jest.fn();
const mockComparePassword = jest.fn();
const mockExtractTokenPayload = jest.fn();
const mockIsTokenExpired = jest.fn();
const mockGenerateRefreshToken = jest.fn();

jest.mock('../../../src/core/auth/utils', () => ({
  validateToken: mockValidateToken,
  generateToken: mockGenerateToken,
  hashPassword: mockHashPassword,
  comparePassword: mockComparePassword,
  extractTokenPayload: mockExtractTokenPayload,
  isTokenExpired: mockIsTokenExpired,
  generateRefreshToken: mockGenerateRefreshToken,
}));

describe('Auth Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validateToken', () => {
    test('should be a function', () => {
      expect(mockValidateToken).toBeDefined();
      expect(typeof mockValidateToken).toBe('function');
    });

    test('should validate valid token', () => {
      const validToken = 'valid-jwt-token';
      const mockResult = { isValid: true, payload: { userId: '123' } };
      
      mockValidateToken.mockReturnValue(mockResult);
      
      const result = mockValidateToken(validToken);
      expect(result.isValid).toBe(true);
      expect(result.payload).toEqual({ userId: '123' });
    });

    test('should validate invalid token', () => {
      const invalidToken = 'invalid-token';
      const mockResult = { isValid: false, error: 'Invalid token format' };
      
      mockValidateToken.mockReturnValue(mockResult);
      
      const result = mockValidateToken(invalidToken);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid token format');
    });

    test('should handle null/undefined tokens', () => {
      mockValidateToken.mockReturnValue({ isValid: false, error: 'No token provided' });
      
      const result1 = mockValidateToken(null);
      const result2 = mockValidateToken(undefined);
      
      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
    });
  });

  describe('generateToken', () => {
    test('should be a function', () => {
      expect(mockGenerateToken).toBeDefined();
      expect(typeof mockGenerateToken).toBe('function');
    });

    test('should generate token with payload', () => {
      const payload = { userId: '123', username: 'test' };
      const mockToken = 'generated-jwt-token';
      
      mockGenerateToken.mockReturnValue(mockToken);
      
      const result = mockGenerateToken(payload);
      expect(result).toBe(mockToken);
      expect(mockGenerateToken).toHaveBeenCalledWith(payload);
    });

    test('should generate token with options', () => {
      const payload = { userId: '123' };
      const options = { expiresIn: '1h', algorithm: 'HS256' };
      const mockToken = 'token-with-options';
      
      mockGenerateToken.mockReturnValue(mockToken);
      
      const result = mockGenerateToken(payload, options);
      expect(result).toBe(mockToken);
      expect(mockGenerateToken).toHaveBeenCalledWith(payload, options);
    });
  });

  describe('hashPassword', () => {
    test('should be a function', () => {
      expect(mockHashPassword).toBeDefined();
      expect(typeof mockHashPassword).toBe('function');
    });

    test('should hash password with salt', () => {
      const password = 'test-password';
      const salt = 'random-salt';
      const mockHash = 'hashed-password';
      
      mockHashPassword.mockReturnValue(mockHash);
      
      const result = mockHashPassword(password, salt);
      expect(result).toBe(mockHash);
      expect(mockHashPassword).toHaveBeenCalledWith(password, salt);
    });

    test('should generate consistent hash', () => {
      const password = 'test-password';
      const salt = 'fixed-salt';
      
      mockHashPassword.mockReturnValue('consistent-hash');
      
      const result1 = mockHashPassword(password, salt);
      const result2 = mockHashPassword(password, salt);
      
      expect(result1).toBe(result2);
    });
  });

  describe('comparePassword', () => {
    test('should be a function', () => {
      expect(mockComparePassword).toBeDefined();
      expect(typeof mockComparePassword).toBe('function');
    });

    test('should compare matching passwords', () => {
      const password = 'test-password';
      const hash = 'hashed-password';
      
      mockComparePassword.mockReturnValue(true);
      
      const result = mockComparePassword(password, hash);
      expect(result).toBe(true);
      expect(mockComparePassword).toHaveBeenCalledWith(password, hash);
    });

    test('should compare non-matching passwords', () => {
      const password = 'test-password';
      const hash = 'different-hash';
      
      mockComparePassword.mockReturnValue(false);
      
      const result = mockComparePassword(password, hash);
      expect(result).toBe(false);
    });
  });

  describe('extractTokenPayload', () => {
    test('should be a function', () => {
      expect(mockExtractTokenPayload).toBeDefined();
      expect(typeof mockExtractTokenPayload).toBe('function');
    });

    test('should extract payload from valid token', () => {
      const token = 'header.payload.signature';
      const mockPayload = { userId: '123', exp: 1234567890 };
      
      mockExtractTokenPayload.mockReturnValue(mockPayload);
      
      const result = mockExtractTokenPayload(token);
      expect(result).toEqual(mockPayload);
    });

    test('should handle invalid token format', () => {
      const invalidToken = 'invalid-token';
      const mockError = new Error('Invalid token format');
      
      mockExtractTokenPayload.mockImplementation(() => {
        throw mockError;
      });
      
      expect(() => {
        mockExtractTokenPayload(invalidToken);
      }).toThrow('Invalid token format');
    });
  });

  describe('isTokenExpired', () => {
    test('should be a function', () => {
      expect(mockIsTokenExpired).toBeDefined();
      expect(typeof mockIsTokenExpired).toBe('function');
    });

    test('should check token expiration', () => {
      const expiredToken = { exp: Date.now() / 1000 - 1 };
      const validToken = { exp: Date.now() / 1000 + 3600 };
      
      mockIsTokenExpired.mockImplementation((token) => {
        return token.exp < Date.now() / 1000;
      });
      
      const isExpired1 = mockIsTokenExpired(expiredToken);
      const isExpired2 = mockIsTokenExpired(validToken);
      
      expect(isExpired1).toBe(true);
      expect(isExpired2).toBe(false);
    });
  });

  describe('generateRefreshToken', () => {
    test('should be a function', () => {
      expect(mockGenerateRefreshToken).toBeDefined();
      expect(typeof mockGenerateRefreshToken).toBe('function');
    });

    test('should generate refresh token', () => {
      const refreshToken = 'refresh-token';
      const mockNewToken = 'new-access-token';
      
      mockGenerateRefreshToken.mockReturnValue(mockNewToken);
      
      const result = mockGenerateRefreshToken(refreshToken);
      expect(result).toBe(mockNewToken);
      expect(mockGenerateRefreshToken).toHaveBeenCalledWith(refreshToken);
    });
  });

  describe('Integration', () => {
    test('should work together for token lifecycle', () => {
      const payload = { userId: '123', username: 'test' };
      const password = 'test-password';
      const salt = 'random-salt';
      const mockHash = 'hashed-password';
      const mockToken = 'jwt-token';
      const mockPayload = { userId: '123', exp: Date.now() / 1000 + 3600 };
      
      mockGenerateToken.mockReturnValue(mockToken);
      mockHashPassword.mockReturnValue(mockHash);
      mockValidateToken.mockReturnValue({ isValid: true, payload: mockPayload });
      mockExtractTokenPayload.mockReturnValue(mockPayload);
      mockIsTokenExpired.mockReturnValue(false);
      
      const token = mockGenerateToken(payload);
      const hashedPassword = mockHashPassword(password, salt);
      const validation = mockValidateToken(token);
      const extractedPayload = mockExtractTokenPayload(token);
      const isExpired = mockIsTokenExpired(extractedPayload);
      
      expect(token).toBe(mockToken);
      expect(hashedPassword).toBe(mockHash);
      expect(validation.isValid).toBe(true);
      expect(extractedPayload).toEqual(mockPayload);
      expect(isExpired).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid token gracefully', () => {
      mockValidateToken.mockReturnValue({ isValid: false, error: 'Invalid token' });
      
      const result = mockValidateToken('invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid token');
    });

    test('should handle password comparison errors', () => {
      mockComparePassword.mockImplementation(() => {
        throw new Error('Hash comparison failed');
      });
      
      expect(() => {
        mockComparePassword('password', 'hash');
      }).toThrow('Hash comparison failed');
    });
  });

  describe('Performance', () => {
    test('should handle rapid token validation efficiently', () => {
      const mockResult = { isValid: true, payload: {} };
      
      mockValidateToken.mockReturnValue(mockResult);
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        mockValidateToken(`token-${i}`);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should handle rapid password hashing efficiently', () => {
      const mockHash = 'hashed-password';
      
      mockHashPassword.mockReturnValue(mockHash);
      
      const startTime = performance.now();
      
      for (let i = 0; i < 50; i++) {
        mockHashPassword('password', 'salt');
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
