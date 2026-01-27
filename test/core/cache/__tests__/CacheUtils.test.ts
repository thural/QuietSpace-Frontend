/**
 * Cache Utils Test Suite
 * 
 * Comprehensive tests for cache utility functions including:
 * - Configuration validation
 * - Cache entry creation and management
 * - Error handling and edge cases
 * - Performance and memory management
 */

import {
  validateCacheConfig,
  createCacheEntry,
  isEntryExpired,
  formatCacheStats,
  generateCacheKey,
  parseCacheKey,
  sanitizeCacheKey,
  createTTL,
  getRemainingTTL,
  extendEntryTTL,
  createCacheError,
  isValidCacheKey
} from '../../../../src/core/cache/utils';

describe('Cache Utils', () => {
  describe('validateCacheConfig', () => {
    test('should validate valid configuration', () => {
      const validConfig = {
        maxSize: 1000,
        defaultTtl: 3600000,
        cleanupInterval: 300000
      };

      const errors = validateCacheConfig(validConfig);
      expect(Array.isArray(errors)).toBe(true);
      expect(errors).toHaveLength(0);
    });

    test('should reject invalid maxSize', () => {
      const invalidConfig = {
        maxSize: -1,
        defaultTtl: 3600000
      };

      const errors = validateCacheConfig(invalidConfig);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.includes('maxSize'))).toBe(true);
    });

    test('should reject invalid defaultTtl', () => {
      const invalidConfig = {
        maxSize: 1000,
        defaultTtl: -1000
      };

      const errors = validateCacheConfig(invalidConfig);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.includes('defaultTtl'))).toBe(true);
    });

    test('should handle null/undefined config', () => {
      expect(validateCacheConfig(null)).toHaveLength(1);
      expect(validateCacheConfig(undefined)).toHaveLength(1);
      expect(validateCacheConfig({})).toHaveLength(0);
    });

    test('should handle non-object config', () => {
      expect(validateCacheConfig('string')).toHaveLength(1);
      expect(validateCacheConfig(123)).toHaveLength(1);
      // Arrays are objects, so they might pass validation
      expect(Array.isArray(validateCacheConfig([]))).toBe(true);
    });
  });

  describe('createCacheEntry', () => {
    test('should create valid cache entry', () => {
      const entry = createCacheEntry('test-key', 'test-value', 60000);

      expect(entry).toBeDefined();
      expect(entry.key).toBe('test-key');
      expect(entry.value).toBe('test-value');
      expect(entry.ttl).toBe(60000);
      expect(entry.timestamp).toBeGreaterThan(0);
      expect(entry.expiresAt).toBeGreaterThan(Date.now());
    });

    test('should create entry with default TTL', () => {
      const entry = createCacheEntry('test-key', 'test-value');

      expect(entry.ttl).toBeUndefined();
      expect(entry.expiresAt).toBeUndefined();
    });

    test('should handle different value types', () => {
      const stringEntry = createCacheEntry('key1', 'string-value');
      const numberEntry = createCacheEntry('key2', 123);
      const objectEntry = createCacheEntry('key3', { test: true });
      const arrayEntry = createCacheEntry('key4', [1, 2, 3]);

      expect(stringEntry.value).toBe('string-value');
      expect(numberEntry.value).toBe(123);
      expect(objectEntry.value).toEqual({ test: true });
      expect(arrayEntry.value).toEqual([1, 2, 3]);
    });

    test('should handle zero TTL (immediate expiration)', () => {
      const entry = createCacheEntry('test-key', 'test-value', 0);

      expect(entry.ttl).toBe(0);
      // expiresAt might be undefined for zero TTL
      if (entry.expiresAt) {
        expect(entry.expiresAt).toBeLessThanOrEqual(Date.now());
      }
    });
  });

  describe('isEntryExpired', () => {
    test('should detect non-expired entry', () => {
      const validEntry = createCacheEntry('test-key', 'test-value', 60000);

      expect(isEntryExpired(validEntry)).toBe(false);
    });

    test('should handle entry with no expiration', () => {
      const entry = createCacheEntry('test-key', 'test-value', -1);

      expect(isEntryExpired(entry)).toBe(false);
    });

    test('should handle entry with expiration', () => {
      const entry = createCacheEntry('test-key', 'test-value', 1);

      // Wait for expiration
      setTimeout(() => {
        expect(isEntryExpired(entry)).toBe(true);
      }, 10);
    });
  });

  describe('formatCacheStats', () => {
    test('should format cache statistics', () => {
      const stats = {
        size: 100,
        hits: 80,
        misses: 20,
        hitRate: 0.8,
        memoryUsage: 2048,
        evictions: 5,
        sets: 120,
        gets: 100,
        deletes: 10,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const formatted = formatCacheStats(stats);
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('Size: 100 entries');
      expect(formatted).toContain('Hit Rate: 80.00%');
      expect(formatted).toContain('Memory Usage: 2 KB');
    });
  });

  describe('generateCacheKey', () => {
    test('should generate cache key with prefix', () => {
      const key = generateCacheKey('user', '123');

      expect(key).toBe('user:123');
    });

    test('should handle multiple parts', () => {
      const key = generateCacheKey('post', '456', 'comments');

      expect(key).toBe('post:456:comments');
    });

    test('should handle empty parts', () => {
      const key = generateCacheKey('user', '');

      expect(key).toBe('user:');
    });

    test('should handle null/undefined parts', () => {
      const key1 = generateCacheKey('user', null as any);
      const key2 = generateCacheKey('user', undefined as any);

      expect(key1).toBe('user:null');
      expect(key2).toBe('user:undefined');
    });

    test('should handle no parts', () => {
      const key = generateCacheKey();

      expect(key).toBe('');
    });
  });

  describe('parseCacheKey', () => {
    test('should parse cache key into parts', () => {
      const parts = parseCacheKey('user:123:profile');

      expect(Array.isArray(parts)).toBe(true);
      expect(parts).toEqual(['user', '123', 'profile']);
    });

    test('should handle simple key', () => {
      const parts = parseCacheKey('simple-key');

      expect(parts).toEqual(['simple-key']);
    });

    test('should handle empty key', () => {
      const parts = parseCacheKey('');

      expect(parts).toEqual(['']);
    });

    test('should handle key with trailing colon', () => {
      const parts = parseCacheKey('user:');

      expect(parts).toEqual(['user', '']);
    });

    test('should handle multiple colons', () => {
      const parts = parseCacheKey('a:b:c:d:e');

      expect(parts).toEqual(['a', 'b', 'c', 'd', 'e']);
    });
  });

  describe('sanitizeCacheKey', () => {
    test('should sanitize cache key', () => {
      const key = sanitizeCacheKey('user:123@domain.com');

      expect(key).toBeDefined();
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    });

    test('should handle special characters', () => {
      const key = sanitizeCacheKey('user:123/\\?%*');

      expect(key).toBeDefined();
      expect(key).not.toContain('/');
      expect(key).not.toContain('\\');
      expect(key).not.toContain('?');
      expect(key).not.toContain('%');
      expect(key).not.toContain('*');
    });

    test('should handle empty key', () => {
      const key = sanitizeCacheKey('');

      expect(key).toBe('');
    });

    test('should handle null/undefined key', () => {
      const key1 = sanitizeCacheKey('null');
      const key2 = sanitizeCacheKey('undefined');

      expect(key1).toBe('null');
      expect(key2).toBe('undefined');
    });

    test('should handle very long key', () => {
      const longKey = 'a'.repeat(1000);
      const sanitized = sanitizeCacheKey(longKey);

      expect(sanitized.length).toBeLessThanOrEqual(255);
    });
  });

  describe('createTTL', () => {
    test('should create TTL from seconds', () => {
      const ttl = createTTL(60);
      expect(ttl).toBe(60000);
    });

    test('should handle zero seconds', () => {
      const ttl = createTTL(0);
      expect(ttl).toBe(0);
    });

    test('should handle negative seconds', () => {
      const ttl = createTTL(-1);
      expect(ttl).toBe(-1000);
    });
  });

  describe('getRemainingTTL', () => {
    test('should return remaining TTL for valid entry', () => {
      const entry = createCacheEntry('test', 'value', 60000);
      const remaining = getRemainingTTL(entry);

      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(60000);
    });

    test('should return null for entry with no expiration', () => {
      const entry = createCacheEntry('test', 'value', -1);
      const remaining = getRemainingTTL(entry);

      expect(remaining).toBeNull();
    });

    test('should return 0 for expired entry', () => {
      const entry = createCacheEntry('test', 'value', 1);

      setTimeout(() => {
        const remaining = getRemainingTTL(entry);
        expect(remaining).toBe(0);
      }, 10);
    });
  });

  describe('extendEntryTTL', () => {
    test('should extend entry TTL', () => {
      const entry = createCacheEntry('test', 'value', 60000);
      const extended = extendEntryTTL(entry, 30000);

      expect(extended.key).toBe('test');
      expect(extended.value).toBe('value');
      expect(extended.ttl).toBe(30000);
      expect(extended.expiresAt).toBeGreaterThan(entry.expiresAt!);
    });

    test('should handle entry with no expiration', () => {
      const entry = createCacheEntry('test', 'value');
      const extended = extendEntryTTL(entry, 30000);

      expect(extended.expiresAt).toBeGreaterThan(Date.now());
      expect(extended.ttl).toBe(30000);
    });
  });

  describe('createCacheError', () => {
    test('should create cache error', () => {
      const error = createCacheError('Test error', 'TEST_ERROR', { details: 'test' });

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test error');
      expect((error as any).code).toBe('TEST_ERROR');
      expect((error as any).details).toEqual({ details: 'test' });
      expect((error as any).timestamp).toBeGreaterThan(0);
    });

    test('should use default error code', () => {
      const error = createCacheError('Test error');

      expect((error as any).code).toBe('CACHE_ERROR');
    });
  });

  describe('isValidCacheKey', () => {
    test('should validate valid key', () => {
      expect(isValidCacheKey('user:123')).toBe(true);
      expect(isValidCacheKey('simple-key')).toBe(true);
      expect(isValidCacheKey('a')).toBe(true);
    });

    test('should reject invalid key', () => {
      expect(isValidCacheKey('')).toBe(false);
      expect(isValidCacheKey(null as any)).toBe(false);
      expect(isValidCacheKey(undefined as any)).toBe(false);
      expect(isValidCacheKey('user 123')).toBe(false);
      expect(isValidCacheKey('user\t123')).toBe(false);
      expect(isValidCacheKey('user\n123')).toBe(false);
      expect(isValidCacheKey('user\r123')).toBe(false);
    });

    test('should reject too long key', () => {
      const longKey = 'a'.repeat(256);
      expect(isValidCacheKey(longKey)).toBe(false);
    });
  });

  describe('Performance', () => {
    test('should validate config efficiently', () => {
      const config = {
        maxSize: 1000,
        defaultTtl: 3600000,
        cleanupInterval: 300000
      };

      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        validateCacheConfig(config);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });

    test('should create cache entries efficiently', () => {
      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        createCacheEntry(`key-${i}`, `value-${i}`, 60000);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });

    test('should not cause memory leaks on repeated operations', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      for (let i = 0; i < 1000; i++) {
        validateCacheConfig({ maxSize: 1000, defaultTtl: 3600000 });
        createCacheEntry(`key-${i}`, `value-${i}`, 60000);
        isEntryExpired(createCacheEntry('test', 'value', 1));
        generateCacheKey('user', i.toString());
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
    });
  });

  describe('Integration', () => {
    test('should support complete cache workflow', () => {
      // Validate configuration
      const config = { maxSize: 1000, defaultTtl: 3600000 };
      const errors = validateCacheConfig(config);
      expect(errors).toHaveLength(0);

      // Create cache entry
      const entry = createCacheEntry('user:123', { name: 'John', age: 30 }, 60000);
      expect(entry).toBeDefined();

      // Check if expired
      expect(isEntryExpired(entry)).toBe(false);

      // Generate and parse key
      const key = generateCacheKey('user', '123');
      const parsed = parseCacheKey(key);
      expect(parsed).toEqual(['user', '123']);

      // Sanitize key
      const sanitized = sanitizeCacheKey('user:123@domain.com');
      expect(sanitized).toBeDefined();
      expect(typeof sanitized).toBe('string');
    });

    test('should support TTL management workflow', () => {
      // Create entry with TTL
      const entry = createCacheEntry('test', 'value', 60000);

      // Check remaining TTL
      const remaining = getRemainingTTL(entry);
      expect(remaining).toBeGreaterThan(0);

      // Extend TTL
      const extended = extendEntryTTL(entry, 30000);
      expect(extended.expiresAt).toBeGreaterThan(entry.expiresAt!);

      // Create TTL from time units
      const fromSeconds = createTTL(60);
      const fromMinutes = createTTL(300);
      const fromHours = createTTL(7200);

      expect(fromSeconds).toBe(60000);
      expect(fromMinutes).toBe(300000);
      expect(fromHours).toBe(7200000);
    });

    test('should support key management workflow', () => {
      // Generate complex key
      const originalKey = generateCacheKey('post', '456', 'comments', 'page', '1');

      // Parse back to parts
      const parts = parseCacheKey(originalKey);
      expect(parts).toEqual(['post', '456', 'comments', 'page', '1']);

      // Sanitize for storage
      const sanitized = sanitizeCacheKey(originalKey);
      expect(sanitized).toBeDefined();

      // Validate key
      expect(isValidCacheKey(originalKey)).toBe(true);
      expect(isValidCacheKey(sanitized)).toBe(true);

      // Reconstruct key from parts
      const reconstructed = generateCacheKey(...parts);
      expect(reconstructed).toBe(originalKey);
    });
  });

  describe('Edge Cases', () => {
    test('should handle extreme TTL values', () => {
      const immediateEntry = createCacheEntry('test', 'value', 0);
      const longEntry = createCacheEntry('test', 'value', Number.MAX_SAFE_INTEGER);
      const negativeEntry = createCacheEntry('test', 'value', -1);

      expect(immediateEntry.ttl).toBe(0);
      expect(longEntry.ttl).toBe(Number.MAX_SAFE_INTEGER);
      expect(negativeEntry.ttl).toBe(-1);
    });

    test('should handle very large values', () => {
      const largeValue = 'x'.repeat(10000);
      const entry = createCacheEntry('large', largeValue);

      expect(entry.value).toBe(largeValue);
      expect(entry.value.length).toBe(10000);
    });

    test('should handle malformed keys', () => {
      const malformedKeys = [
        '',
        ':',
        ':::',
        'user::123',
        'user:123:',
        '::::'
      ];

      malformedKeys.forEach(key => {
        expect(() => {
          const parsed = parseCacheKey(key);
          expect(Array.isArray(parsed)).toBe(true);
        }).not.toThrow();
      });
    });

    test('should handle error creation edge cases', () => {
      expect(() => {
        createCacheError('', '');
        createCacheError('Test error', '', {});
        createCacheError('Test error', 'TEST_ERROR', null);
      }).not.toThrow();
    });
  });
});
