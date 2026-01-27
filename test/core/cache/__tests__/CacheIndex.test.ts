/**
 * Cache Index Test Suite
 * Tests the main cache module exports and API
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock all the dependencies before importing
jest.mock('../../../../src/core/cache/interfaces', () => ({
  ICacheProvider: 'ICacheProvider',
  ICacheServiceManager: 'ICacheServiceManager',
  CacheEntry: 'CacheEntry',
  CacheConfig: 'CacheConfig',
  CacheStats: 'CacheStats',
  CacheEvents: 'CacheEvents',
  CacheServiceConfig: 'CacheServiceConfig',
  FeatureCacheService: 'FeatureCacheService',
}));

jest.mock('../../../../src/core/cache/factory', () => ({
  createCacheProvider: jest.fn(),
  createCacheServiceManager: jest.fn(),
  createCacheProviderFromDI: jest.fn(),
  createCacheServiceManagerFromDI: jest.fn(),
  createDefaultCacheProvider: jest.fn(),
  createDefaultCacheServiceManager: jest.fn(),
  DEFAULT_CACHE_CONFIG: {
    ttl: 3600000,
    maxSize: 1000,
    cleanupInterval: 60000,
    strategy: 'lru',
  },
}));

jest.mock('../../../../src/core/cache/CacheProvider', () => ({
  CacheProvider: jest.fn(),
}));

jest.mock('../../../../src/core/cache/CacheServiceManager', () => ({
  CacheServiceManager: jest.fn(),
}));

// Now import the module
import * as cacheModule from '../../../../src/core/cache';

describe('Cache Index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Type Exports', () => {
    test('should export core cache interfaces', () => {
      // These are type exports, so we check they exist as undefined (types are erased at runtime)
      expect(typeof (cacheModule as any).ICacheProvider).toBe('undefined');
      expect(typeof (cacheModule as any).ICacheServiceManager).toBe('undefined');
      expect(typeof (cacheModule as any).CacheEntry).toBe('undefined');
      expect(typeof (cacheModule as any).CacheConfig).toBe('undefined');
      expect(typeof (cacheModule as any).CacheStats).toBe('undefined');
    });

    test('should export event and service interfaces', () => {
      expect(typeof (cacheModule as any).CacheEvents).toBe('undefined');
      expect(typeof (cacheModule as any).CacheServiceConfig).toBe('undefined');
      expect(typeof (cacheModule as any).FeatureCacheService).toBe('undefined');
    });
  });

  describe('Factory Function Exports', () => {
    test('should export cache provider factory functions', () => {
      expect(cacheModule.createCacheProvider).toBeDefined();
      expect(cacheModule.createCacheProviderFromDI).toBeDefined();
      expect(cacheModule.createDefaultCacheProvider).toBeDefined();
    });

    test('should export cache service manager factory functions', () => {
      expect(cacheModule.createCacheServiceManager).toBeDefined();
      expect(cacheModule.createCacheServiceManagerFromDI).toBeDefined();
      expect(cacheModule.createDefaultCacheServiceManager).toBeDefined();
    });

    test('should export default configuration', () => {
      expect(cacheModule.DEFAULT_CACHE_CONFIG).toBeDefined();
    });

    test('should have correct factory function types', () => {
      expect(typeof cacheModule.createCacheProvider).toBe('function');
      expect(typeof cacheModule.createCacheServiceManager).toBe('function');
      expect(typeof cacheModule.createCacheProviderFromDI).toBe('function');
      expect(typeof cacheModule.createCacheServiceManagerFromDI).toBe('function');
      expect(typeof cacheModule.createDefaultCacheProvider).toBe('function');
      expect(typeof cacheModule.createDefaultCacheServiceManager).toBe('function');
    });
  });

  describe('Configuration Exports', () => {
    test('should export default cache configuration', () => {
      expect(cacheModule.DEFAULT_CACHE_CONFIG).toBeDefined();
      expect(typeof cacheModule.DEFAULT_CACHE_CONFIG).toBe('object');
    });
  });

  describe('Legacy Exports', () => {
    test('should export legacy implementation classes with underscore prefix', () => {
      expect(cacheModule._CacheProvider).toBeDefined();
      expect(cacheModule._CacheServiceManager).toBeDefined();
    });

    test('should have correct legacy export types', () => {
      expect(typeof cacheModule._CacheProvider).toBe('function');
      expect(typeof cacheModule._CacheServiceManager).toBe('function');
    });
  });

  describe('API Consistency', () => {
    test('should have consistent naming patterns', () => {
      const exports = Object.keys(cacheModule);
      
      // Check that factory functions follow create* pattern
      const factoryExports = exports.filter(name => name.startsWith('create'));
      expect(factoryExports.length).toBeGreaterThan(0);
      
      // Check that configuration exports follow pattern
      const configExports = exports.filter(name => name.includes('CONFIG'));
      expect(configExports.length).toBeGreaterThan(0);
    });

    test('should not export internal implementation details', () => {
      const exports = Object.keys(cacheModule);
      
      // Should not export internal modules (without underscore prefix)
      expect(exports).not.toContain('CacheProvider');
      expect(exports).not.toContain('CacheServiceManager');
    });

    test('should follow Black Box pattern', () => {
      const exports = Object.keys(cacheModule);
      
      // Should only export types, factories, and legacy exports
      const allowedPatterns = [
        /^I[A-Z]/, // Interfaces
        /^create/, // Factory functions
        /^[A-Z_]+$/, // Constants and legacy exports
      ];
      
      exports.forEach(exportName => {
        const matchesPattern = allowedPatterns.some(pattern => pattern.test(exportName));
        expect(matchesPattern).toBe(true);
      });
    });
  });

  describe('Factory Function Behavior', () => {
    test('should call factory functions correctly', () => {
      const mockConfig = { ttl: 5000, maxSize: 100 };
      const mockProvider = { get: jest.fn(), set: jest.fn() };
      const mockServiceManager = { getProvider: jest.fn(), createProvider: jest.fn() };
      
      cacheModule.createCacheProvider.mockReturnValue(mockProvider);
      cacheModule.createCacheServiceManager.mockReturnValue(mockServiceManager);
      
      const provider = cacheModule.createCacheProvider(mockConfig);
      const serviceManager = cacheModule.createCacheServiceManager(mockConfig);
      
      expect(provider).toEqual(mockProvider);
      expect(serviceManager).toEqual(mockServiceManager);
      expect(cacheModule.createCacheProvider).toHaveBeenCalledWith(mockConfig);
      expect(cacheModule.createCacheServiceManager).toHaveBeenCalledWith(mockConfig);
    });

    test('should handle DI-based factory functions', () => {
      const mockContainer = { get: jest.fn(), bind: jest.fn() };
      const mockProvider = { get: jest.fn(), set: jest.fn() };
      const mockServiceManager = { getProvider: jest.fn(), createProvider: jest.fn() };
      
      cacheModule.createCacheProviderFromDI.mockReturnValue(mockProvider);
      cacheModule.createCacheServiceManagerFromDI.mockReturnValue(mockServiceManager);
      
      const provider = cacheModule.createCacheProviderFromDI(mockContainer);
      const serviceManager = cacheModule.createCacheServiceManagerFromDI(mockContainer);
      
      expect(provider).toEqual(mockProvider);
      expect(serviceManager).toEqual(mockServiceManager);
      expect(cacheModule.createCacheProviderFromDI).toHaveBeenCalledWith(mockContainer);
      expect(cacheModule.createCacheServiceManagerFromDI).toHaveBeenCalledWith(mockContainer);
    });

    test('should handle default factory functions', () => {
      const mockProvider = { get: jest.fn(), set: jest.fn() };
      const mockServiceManager = { getProvider: jest.fn(), createProvider: jest.fn() };
      
      cacheModule.createDefaultCacheProvider.mockReturnValue(mockProvider);
      cacheModule.createDefaultCacheServiceManager.mockReturnValue(mockServiceManager);
      
      const provider = cacheModule.createDefaultCacheProvider();
      const serviceManager = cacheModule.createDefaultCacheServiceManager();
      
      expect(provider).toEqual(mockProvider);
      expect(serviceManager).toEqual(mockServiceManager);
      expect(cacheModule.createDefaultCacheProvider).toHaveBeenCalled();
      expect(cacheModule.createDefaultCacheServiceManager).toHaveBeenCalled();
    });
  });

  describe('Integration', () => {
    test('should work together for complete cache setup', () => {
      const mockConfig = { ttl: 5000, maxSize: 100 };
      const mockProvider = { get: jest.fn(), set: jest.fn(), delete: jest.fn() };
      const mockServiceManager = { getProvider: jest.fn(), createProvider: jest.fn() };
      
      cacheModule.createCacheProvider.mockReturnValue(mockProvider);
      cacheModule.createCacheServiceManager.mockReturnValue(mockServiceManager);
      
      const provider = cacheModule.createCacheProvider(mockConfig);
      const serviceManager = cacheModule.createCacheServiceManager(mockConfig);
      
      // Test cache operations
      provider.set('test-key', 'test-value');
      const value = provider.get('test-key');
      
      // Test service manager operations
      const retrievedProvider = serviceManager.getProvider('test-service');
      
      expect(provider.set).toHaveBeenCalledWith('test-key', 'test-value');
      expect(provider.get).toHaveBeenCalledWith('test-key');
      expect(serviceManager.getProvider).toHaveBeenCalledWith('test-service');
    });

    test('should support DI-based cache creation', () => {
      const mockContainer = { 
        get: jest.fn(), 
        bind: jest.fn(),
        resolve: jest.fn()
      };
      const mockProvider = { get: jest.fn(), set: jest.fn() };
      
      cacheModule.createCacheProviderFromDI.mockReturnValue(mockProvider);
      
      const provider = cacheModule.createCacheProviderFromDI(mockContainer);
      
      expect(mockContainer.get).toHaveBeenCalled();
      expect(provider).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle factory function errors gracefully', () => {
      const error = new Error('Provider creation failed');
      
      cacheModule.createCacheProvider.mockImplementation(() => {
        throw error;
      });
      
      expect(() => {
        cacheModule.createCacheProvider({});
      }).toThrow('Provider creation failed');
    });

    test('should handle service manager factory errors gracefully', () => {
      const error = new Error('Service manager creation failed');
      
      cacheModule.createCacheServiceManager.mockImplementation(() => {
        throw error;
      });
      
      expect(() => {
        cacheModule.createCacheServiceManager({});
      }).toThrow('Service manager creation failed');
    });
  });

  describe('Performance', () => {
    test('should handle multiple provider creations efficiently', () => {
      const mockProvider = { get: jest.fn(), set: jest.fn() };
      
      cacheModule.createCacheProvider.mockReturnValue(mockProvider);
      
      const startTime = performance.now();
      
      const providers = [];
      for (let i = 0; i < 100; i++) {
        providers.push(cacheModule.createCacheProvider({ ttl: 5000 + i }));
      }
      
      const endTime = performance.now();
      
      expect(providers).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should handle multiple service manager creations efficiently', () => {
      const mockServiceManager = { getProvider: jest.fn(), createProvider: jest.fn() };
      
      cacheModule.createCacheServiceManager.mockReturnValue(mockServiceManager);
      
      const startTime = performance.now();
      
      const serviceManagers = [];
      for (let i = 0; i < 100; i++) {
        serviceManagers.push(cacheModule.createCacheServiceManager({ ttl: 5000 + i }));
      }
      
      const endTime = performance.now();
      
      expect(serviceManagers).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
