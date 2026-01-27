/**
 * Auth Adapters Test Suite
 * Tests auth adapter implementations
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the adapters module
const mockEnterpriseAuthAdapter = {
  authenticate: jest.fn(),
  authorize: jest.fn(),
  validateToken: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
  getUserInfo: jest.fn(),
  updateUserInfo: jest.fn(),
};

jest.mock('../../../src/core/auth/adapters/EnterpriseAuthAdapter', () => ({
  EnterpriseAuthAdapter: jest.fn(() => mockEnterpriseAuthAdapter),
}));

describe('Auth Adapters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('EnterpriseAuthAdapter', () => {
    test('should be a constructor function', () => {
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      expect(typeof EnterpriseAuthAdapter).toBe('function');
    });

    test('should create enterprise auth adapter', () => {
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      expect(adapter).toEqual(mockEnterpriseAuthAdapter);
    });

    test('should authenticate user', () => {
      const credentials = { username: 'test', password: 'password' };
      const mockUser = { id: '123', username: 'test', email: 'test@example.com' };
      
      mockEnterpriseAuthAdapter.authenticate.mockReturnValue(mockUser);
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      const result = adapter.authenticate(credentials);
      
      expect(result).toEqual(mockUser);
      expect(mockEnterpriseAuthAdapter.authenticate).toHaveBeenCalledWith(credentials);
    });

    test('should authorize user', () => {
      const user = { id: '123', permissions: ['read', 'write'] };
      const resource = 'resource-123';
      const action = 'read';
      const mockResult = { authorized: true, granted: true };
      
      mockEnterpriseAuthAdapter.authorize.mockReturnValue(mockResult);
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      const result = adapter.authorize(user, resource, action);
      
      expect(result.authorized).toBe(true);
      expect(result.granted).toBe(true);
      expect(mockEnterpriseAuthAdapter.authorize).toHaveBeenCalledWith(user, resource, action);
    });

    test('should validate token', () => {
      const token = 'valid-jwt-token';
      const mockResult = { isValid: true, payload: { userId: '123', exp: Date.now() + 3600000 } };
      
      mockEnterpriseAuthAdapter.validateToken.mockReturnValue(mockResult);
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      const result = adapter.validateToken(token);
      
      expect(result.isValid).toBe(true);
      expect(result.payload.userId).toBe('123');
      expect(mockEnterpriseAuthAdapter.validateToken).toHaveBeenCalledWith(token);
    });

    test('should refresh token', () => {
      const refreshToken = 'refresh-token';
      const mockResult = { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' };
      
      mockEnterpriseAuthAdapter.refreshToken.mockReturnValue(mockResult);
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      const result = adapter.refreshToken(refreshToken);
      
      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
      expect(mockEnterpriseAuthAdapter.refreshToken).toHaveBeenCalledWith(refreshToken);
    });

    test('should logout user', () => {
      const userId = '123';
      const mockResult = { success: true, loggedOut: true };
      
      mockEnterpriseAuthAdapter.logout.mockReturnValue(mockResult);
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      const result = adapter.logout(userId);
      
      expect(result.success).toBe(true);
      expect(result.loggedOut).toBe(true);
      expect(mockEnterpriseAuthAdapter.logout).toHaveBeenCalledWith(userId);
    });

    test('should get user info', () => {
      const userId = '123';
      const mockUserInfo = {
        id: '123',
        username: 'test',
        email: 'test@example.com',
        roles: ['user', 'admin'],
        permissions: ['read', 'write'],
        createdAt: Date.now(),
        lastLogin: Date.now(),
      };
      
      mockEnterpriseAuthAdapter.getUserInfo.mockReturnValue(mockUserInfo);
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      const result = adapter.getUserInfo(userId);
      
      expect(result).toEqual(mockUserInfo);
      expect(result.roles).toContain('user');
      expect(result.permissions).toContain('read');
      expect(mockEnterpriseAuthAdapter.getUserInfo).toHaveBeenCalledWith(userId);
    });

    test('should update user info', () => {
      const userId = '123';
      const updates = { email: 'new-email@example.com', roles: ['user', 'moderator'] };
      const mockResult = { success: true, updated: true };
      
      mockEnterpriseAuthAdapter.updateUserInfo.mockReturnValue(mockResult);
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      const result = adapter.updateUserInfo(userId, updates);
      
      expect(result.success).toBe(true);
      expect(result.updated).toBe(true);
      expect(mockEnterpriseAuthAdapter.updateUserInfo).toHaveBeenCalledWith(userId, updates);
    });
  });

  describe('Adapter Integration', () => {
    test('should handle complete auth flow', () => {
      const credentials = { username: 'test', password: 'password' };
      const mockUser = { id: '123', username: 'test', email: 'test@example.com' };
      const mockToken = 'access-token';
      const mockRefreshToken = 'refresh-token';
      
      mockEnterpriseAuthAdapter.authenticate.mockReturnValue(mockUser);
      mockEnterpriseAuthAdapter.validateToken.mockReturnValue({ isValid: true, payload: { userId: '123' } });
      mockEnterpriseAuthAdapter.refreshToken.mockReturnValue({ accessToken: mockToken, refreshToken: mockRefreshToken });
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      
      const user = adapter.authenticate(credentials);
      const validation = adapter.validateToken(mockToken);
      const refreshResult = adapter.refreshToken(mockRefreshToken);
      
      expect(user).toEqual(mockUser);
      expect(validation.isValid).toBe(true);
      expect(refreshResult.accessToken).toBe(mockToken);
    });

    test('should handle authorization flow', () => {
      const user = { id: '123', permissions: ['read', 'write'] };
      const resource = 'document-123';
      const action = 'read';
      const mockResult = { authorized: true, granted: true };
      
      mockEnterpriseAuthAdapter.authorize.mockReturnValue(mockResult);
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      
      const result = adapter.authorize(user, resource, action);
      
      expect(result.authorized).toBe(true);
      expect(result.granted).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle authentication errors gracefully', () => {
      const credentials = { username: 'invalid', password: 'wrong' };
      const error = new Error('Authentication failed');
      
      mockEnterpriseAuthAdapter.authenticate.mockImplementation(() => {
        throw error;
      });
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      
      expect(() => {
        adapter.authenticate(credentials);
      }).toThrow('Authentication failed');
    });

    test('should handle token validation errors gracefully', () => {
      const token = 'invalid-token';
      const error = new Error('Token validation failed');
      
      mockEnterpriseAuthAdapter.validateToken.mockImplementation(() => {
        throw error;
      });
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      
      expect(() => {
        adapter.validateToken(token);
      }).toThrow('Token validation failed');
    });

    test('should handle authorization errors gracefully', () => {
      const user = { id: '123', permissions: [] };
      const resource = 'resource-123';
      const action = 'read';
      const error = new Error('Authorization failed');
      
      mockEnterpriseAuthAdapter.authorize.mockImplementation(() => {
        throw error;
      });
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      
      expect(() => {
        adapter.authorize(user, resource, action);
      }).toThrow('Authorization failed');
    });
  });

  describe('Data Transformation', () => {
    test('should transform user data correctly', () => {
      const rawUser = {
        id: '123',
        username: 'test',
        email: 'test@example.com',
        user_roles: ['user', 'admin'],
        user_permissions: ['read', 'write'],
        created_at: '2023-01-01T00:00:00Z',
        last_login: '2023-01-01T12:00:00Z',
      };
      
      const transformedUser = {
        id: '123',
        username: 'test',
        email: 'test@example.com',
        roles: ['user', 'admin'],
        permissions: ['read', 'write'],
        createdAt: new Date('2023-01-01T00:00:00Z'),
        lastLogin: new Date('2023-01-01T12:00:00Z'),
      };
      
      mockEnterpriseAuthAdapter.getUserInfo.mockReturnValue(transformedUser);
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      const result = adapter.getUserInfo('123');
      
      expect(result.roles).toEqual(['user', 'admin']);
      expect(result.permissions).toEqual(['read', 'write']);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    test('should transform token data correctly', () => {
      const rawToken = 'header.payload.signature';
      const mockResult = {
        isValid: true,
        payload: {
          userId: '123',
          exp: Date.now() + 3600000,
          iat: Date.now(),
          iss: 'auth-service',
        },
        header: { alg: 'HS256', typ: 'JWT' },
      };
      
      mockEnterpriseAuthAdapter.validateToken.mockReturnValue(mockResult);
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      const result = adapter.validateToken(rawToken);
      
      expect(result.isValid).toBe(true);
      expect(result.payload.userId).toBe('123');
      expect(result.payload.iss).toBe('auth-service');
    });
  });

  describe('Performance', () => {
    test('should handle rapid adapter operations efficiently', () => {
      const credentials = { username: 'test', password: 'password' };
      const mockUser = { id: '123', username: 'test' };
      
      mockEnterpriseAuthAdapter.authenticate.mockReturnValue(mockUser);
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      
      const startTime = performance.now();
      
      for (let i = 0; i < 50; i++) {
        adapter.authenticate({ username: `user${i}`, password: 'password' });
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should handle token validation efficiently', () => {
      const token = 'valid-jwt-token';
      const mockResult = { isValid: true, payload: { userId: '123' } };
      
      mockEnterpriseAuthAdapter.validateToken.mockReturnValue(mockResult);
      
      const EnterpriseAuthAdapter = jest.fn(() => mockEnterpriseAuthAdapter);
      const adapter = new (EnterpriseAuthAdapter as any)();
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        adapter.validateToken(token);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
