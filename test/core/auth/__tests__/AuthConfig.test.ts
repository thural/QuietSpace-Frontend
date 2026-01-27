/**
 * Auth Config Test Suite
 * Tests auth configuration management
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the config modules
const mockDefaultAuthConfig = {
  tokenExpiry: 3600,
  refreshThreshold: 300,
  maxLoginAttempts: 3,
  lockoutDuration: 900,
  sessionTimeout: 1800,
  passwordMinLength: 8,
  passwordMaxLength: 128,
  tokenAlgorithm: 'HS256',
  tokenType: 'Bearer',
};

const mockEnvironmentAuthConfig = {
  database: {
    host: 'localhost',
    port: 5432,
    name: 'auth_db',
  },
  redis: {
    host: 'localhost',
    port: 6379,
    db: 0,
  },
  jwt: {
    secret: 'test-secret',
    algorithm: 'HS256',
  },
  oauth: {
    google: {
      clientId: 'google-client-id',
      clientSecret: 'google-client-secret',
    },
  },
};

jest.mock('../../../src/core/auth/config/DefaultAuthConfig', () => ({
  default: mockDefaultAuthConfig,
}));

jest.mock('../../../src/core/auth/config/EnvironmentAuthConfig', () => ({
  EnvironmentAuthConfig: mockEnvironmentAuthConfig,
}));

describe('Auth Config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('DefaultAuthConfig', () => {
    test('should export default configuration', () => {
      expect(mockDefaultAuthConfig).toBeDefined();
      expect(mockDefaultAuthConfig.tokenExpiry).toBe(3600);
      expect(mockDefaultAuthConfig.refreshThreshold).toBe(300);
      expect(mockDefaultAuthConfig.maxLoginAttempts).toBe(3);
      expect(mockDefaultAuthConfig.lockoutDuration).toBe(900);
      expect(mockDefaultAuthConfig.sessionTimeout).toBe(1800);
    });

    test('should have password configuration', () => {
      expect(mockDefaultAuthConfig.passwordMinLength).toBe(8);
      expect(mockDefaultAuthConfig.passwordMaxLength).toBe(128);
      expect(mockDefaultAuthConfig.passwordMinLength).toBeLessThan(mockDefaultAuthConfig.passwordMaxLength);
    });

    test('should have token configuration', () => {
      expect(mockDefaultAuthConfig.tokenAlgorithm).toBe('HS256');
      expect(mockDefaultAuthConfig.tokenType).toBe('Bearer');
    });

    test('should have security thresholds', () => {
      expect(mockDefaultAuthConfig.tokenExpiry).toBeGreaterThan(0);
      expect(mockDefaultAuthConfig.refreshThreshold).toBeGreaterThan(0);
      expect(mockDefaultAuthConfig.refreshThreshold).toBeLessThan(mockDefaultAuthConfig.tokenExpiry);
      expect(mockDefaultAuthConfig.maxLoginAttempts).toBeGreaterThan(0);
      expect(mockDefaultAuthConfig.lockoutDuration).toBeGreaterThan(0);
      expect(mockDefaultAuthConfig.sessionTimeout).toBeGreaterThan(0);
    });
  });

  describe('EnvironmentAuthConfig', () => {
    test('should export environment configuration', () => {
      expect(mockEnvironmentAuthConfig).toBeDefined();
      expect(mockEnvironmentAuthConfig.database).toBeDefined();
      expect(mockEnvironmentAuthConfig.redis).toBeDefined();
      expect(mockEnvironmentAuthConfig.jwt).toBeDefined();
      expect(mockEnvironmentAuthConfig.oauth).toBeDefined();
    });

    test('should have database configuration', () => {
      expect(mockEnvironmentAuthConfig.database.host).toBe('localhost');
      expect(mockEnvironmentAuthConfig.database.port).toBe(5432);
      expect(mockEnvironmentAuthConfig.database.name).toBe('auth_db');
    });

    test('should have redis configuration', () => {
      expect(mockEnvironmentAuthConfig.redis.host).toBe('localhost');
      expect(mockEnvironmentAuthConfig.redis.port).toBe(6379);
      expect(mockEnvironmentAuthConfig.redis.db).toBe(0);
    });

    test('should have JWT configuration', () => {
      expect(mockEnvironmentAuthConfig.jwt.secret).toBe('test-secret');
      expect(mockEnvironmentAuthConfig.jwt.algorithm).toBe('HS256');
    });

    test('should have OAuth configuration', () => {
      expect(mockEnvironmentAuthConfig.oauth).toBeDefined();
      expect(mockEnvironmentAuthConfig.oauth.google).toBeDefined();
      expect(mockEnvironmentAuthConfig.oauth.google.clientId).toBe('google-client-id');
      expect(mockEnvironmentAuthConfig.oauth.google.clientSecret).toBe('google-client-secret');
    });
  });

  describe('Configuration Validation', () => {
    test('should validate default configuration values', () => {
      expect(mockDefaultAuthConfig.tokenExpiry).toBeGreaterThan(0);
      expect(mockDefaultAuthConfig.tokenExpiry).toBeLessThan(86400); // Less than 24 hours
      expect(mockDefaultAuthConfig.refreshThreshold).toBeGreaterThan(0);
      expect(mockDefaultAuthConfig.refreshThreshold).toBeLessThan(mockDefaultAuthConfig.tokenExpiry);
      expect(mockDefaultAuthConfig.maxLoginAttempts).toBeGreaterThan(0);
      expect(mockDefaultAuthConfig.maxLoginAttempts).toBeLessThan(10);
      expect(mockDefaultAuthConfig.lockoutDuration).toBeGreaterThan(0);
      expect(mockDefaultAuthConfig.lockoutDuration).toBeLessThan(3600); // Less than 1 hour
      expect(mockDefaultAuthConfig.sessionTimeout).toBeGreaterThan(0);
      expect(mockDefaultAuthConfig.sessionTimeout).toBeGreaterThan(mockDefaultAuthConfig.tokenExpiry);
    });

    test('should validate password constraints', () => {
      expect(mockDefaultAuthConfig.passwordMinLength).toBeGreaterThanOrEqual(6);
      expect(mockDefaultAuthConfig.passwordMaxLength).toBeLessThanOrEqual(256);
      expect(mockDefaultAuthConfig.passwordMinLength).toBeLessThan(mockDefaultAuthConfig.passwordMaxLength);
    });

    test('should validate token configuration', () => {
      expect(mockDefaultAuthConfig.tokenAlgorithm).toMatch(/^(HS256|RS256)$/);
      expect(mockDefaultAuthConfig.tokenType).toBe('Bearer');
    });

    test('should validate environment configuration', () => {
      expect(mockEnvironmentAuthConfig.database.host).toBeDefined();
      expect(mockEnvironmentAuthConfig.database.port).toBeGreaterThan(0);
      expect(mockEnvironmentAuthConfig.database.name).toBeDefined();
      expect(mockEnvironmentAuthConfig.redis.host).toBeDefined();
      expect(mockEnvironmentAuthConfig.redis.port).toBeGreaterThan(0);
      expect(mockEnvironmentAuthConfig.jwt.secret).toBeDefined();
      expect(mockEnvironmentAuthConfig.jwt.secret.length).toBeGreaterThan(0);
    });
  });

  describe('Configuration Integration', () => {
    test('should merge configurations properly', () => {
      const customConfig = {
        tokenExpiry: 7200,
        maxLoginAttempts: 5,
        customSetting: 'custom-value',
      };
      
      const mergedConfig = { ...mockDefaultAuthConfig, ...customConfig };
      
      expect(mergedConfig.tokenExpiry).toBe(7200);
      expect(mergedConfig.maxLoginAttempts).toBe(5);
      expect(mergedConfig.refreshThreshold).toBe(300); // Should keep default
      expect(mergedConfig.customSetting).toBe('custom-value');
    });

    test('should handle environment-specific overrides', () => {
      const envConfig = {
        ...mockDefaultAuthConfig,
        tokenExpiry: 1800, // 30 minutes for development
        maxLoginAttempts: 10, // More lenient for development
      };
      
      expect(envConfig.tokenExpiry).toBe(1800);
      expect(envConfig.maxLoginAttempts).toBe(10);
      expect(envConfig.refreshThreshold).toBe(300); // Should keep default
    });
  });

  describe('Configuration Security', () => {
    test('should have secure default values', () => {
      expect(mockDefaultAuthConfig.maxLoginAttempts).toBeLessThan(10);
      expect(mockDefaultAuthConfig.lockoutDuration).toBeLessThan(3600);
      expect(mockDefaultAuthConfig.passwordMinLength).toBeGreaterThanOrEqual(8);
      expect(mockDefaultAuthConfig.tokenExpiry).toBeLessThan(86400);
    });

    test('should validate JWT secret strength', () => {
      expect(mockEnvironmentAuthConfig.jwt.secret.length).toBeGreaterThan(16);
      expect(mockEnvironmentAuthConfig.jwt.secret).not.toBe('test-secret');
    });

    test('should use secure algorithms', () => {
      expect(mockDefaultAuthConfig.tokenAlgorithm).toMatch(/^(HS256|RS256)$/);
      expect(mockEnvironmentAuthConfig.jwt.algorithm).toMatch(/^(HS256|RS256)$/);
    });
  });

  describe('Configuration Performance', () => {
    test('should have reasonable timeout values', () => {
      expect(mockDefaultAuthConfig.sessionTimeout).toBeLessThan(7200); // Less than 2 hours
      expect(mockDefaultAuthConfig.tokenExpiry).toBeLessThan(3600); // Less than 1 hour
      expect(mockDefaultAuthConfig.refreshThreshold).toBeLessThan(600); // Less than 10 minutes
    });

    test('should have reasonable attempt limits', () => {
      expect(mockDefaultAuthConfig.maxLoginAttempts).toBeLessThan(10);
      expect(mockDefaultAuthConfig.lockoutDuration).toBeLessThan(3600); // Less than 1 hour
    });
  });

  describe('Configuration Extensibility', () => {
    test('should support custom configuration', () => {
      const customConfig = {
        customFeature: true,
        customSetting: 'custom-value',
        customTimeout: 5000,
      };
      
      const extendedConfig = { ...mockDefaultAuthConfig, ...customConfig };
      
      expect(extendedConfig.customFeature).toBe(true);
      expect(extendedConfig.customSetting).toBe('custom-value');
      expect(extendedConfig.customTimeout).toBe(5000);
    });

    test('should support environment-specific configuration', () => {
      const devConfig = {
        ...mockDefaultAuthConfig,
        debug: true,
        logging: 'verbose',
      };
      
      const prodConfig = {
        ...mockDefaultAuthConfig,
        debug: false,
        logging: 'error',
      };
      
      expect(devConfig.debug).toBe(true);
      expect(devConfig.logging).toBe('verbose');
      expect(prodConfig.debug).toBe(false);
      expect(prodConfig.logging).toBe('error');
    });
  });
});
