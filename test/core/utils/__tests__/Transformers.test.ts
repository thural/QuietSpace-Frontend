/**
 * Transformers Utils Test Suite
 */

import {
  transformPost,
  transformError,
  sanitizeInput,
  isValidEmail,
  formatFileSize
} from '../../../src/core/utils/transformers';

// Mock the error classes since they're from a different module
jest.mock('../../../src/core/errors/failures', () => ({
  ValidationError: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
    }
  },
  AuthenticationFailure: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AuthenticationFailure';
    }
  },
  AuthorizationFailure: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AuthorizationFailure';
    }
  },
  NetworkFailure: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'NetworkFailure';
    }
  }
}));

describe('Transformers Utils', () => {
  describe('transformPost', () => {
    test('should transform API post response', () => {
      const apiPost = {
        id: '123',
        title: 'Test Post',
        content: 'Test content',
        author: 'Test Author'
      };

      const transformed = transformPost(apiPost);

      expect(transformed).toEqual({
        id: '123',
        title: 'Test Post',
        content: 'Test content',
        author: 'Test Author',
        transformedAt: expect.any(String)
      });
    });

    test('should add transformedAt timestamp', () => {
      const apiPost = { id: '123' };
      const transformed = transformPost(apiPost);

      expect(transformed.transformedAt).toBeDefined();
      expect(new Date(transformed.transformedAt)).toBeInstanceOf(Date);
    });

    test('should preserve all original properties', () => {
      const apiPost = {
        id: '123',
        title: 'Test',
        content: 'Content',
        metadata: { tags: ['test'] },
        author: { name: 'Author', id: '456' }
      };

      const transformed = transformPost(apiPost);

      expect(transformed.id).toBe('123');
      expect(transformed.title).toBe('Test');
      expect(transformed.content).toBe('Content');
      expect(transformed.metadata).toEqual({ tags: ['test'] });
      expect(transformed.author).toEqual({ name: 'Author', id: '456' });
    });

    test('should handle empty post object', () => {
      const apiPost = {};
      const transformed = transformPost(apiPost);

      expect(transformed).toEqual({
        transformedAt: expect.any(String)
      });
    });

    test('should handle null/undefined post', () => {
      expect(() => transformPost(null)).not.toThrow();
      expect(() => transformPost(undefined)).not.toThrow();
    });
  });

  describe('transformError', () => {
    test('should transform 400 error to ValidationError', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid input' }
        }
      };

      const transformed = transformError(error);

      expect(transformed).toBeInstanceOf(Error);
      expect(transformed.name).toBe('ValidationError');
      expect(transformed.message).toBe('Invalid input');
    });

    test('should transform 401 error to AuthenticationFailure', () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };

      const transformed = transformError(error);

      expect(transformed.name).toBe('AuthenticationFailure');
      expect(transformed.message).toBe('Unauthorized');
    });

    test('should transform 403 error to AuthorizationFailure', () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Forbidden' }
        }
      };

      const transformed = transformError(error);

      expect(transformed.name).toBe('AuthorizationFailure');
      expect(transformed.message).toBe('Forbidden');
    });

    test('should transform 404 error to NetworkFailure', () => {
      const error = {
        response: {
          status: 404
        }
      };

      const transformed = transformError(error);

      expect(transformed.name).toBe('NetworkFailure');
      expect(transformed.message).toBe('Resource not found');
    });

    test('should transform 429 error to NetworkFailure', () => {
      const error = {
        response: {
          status: 429
        }
      };

      const transformed = transformError(error);

      expect(transformed.name).toBe('NetworkFailure');
      expect(transformed.message).toBe('Too many requests');
    });

    test('should transform 500 error to NetworkFailure', () => {
      const error = {
        response: {
          status: 500
        }
      };

      const transformed = transformError(error);

      expect(transformed.name).toBe('NetworkFailure');
      expect(transformed.message).toBe('Server error');
    });

    test('should transform unknown status code to NetworkFailure', () => {
      const error = {
        response: {
          status: 418,
          data: { message: "I'm a teapot" }
        }
      };

      const transformed = transformError(error);

      expect(transformed.name).toBe('NetworkFailure');
      expect(transformed.message).toBe("I'm a teapot");
    });

    test('should transform network error to NetworkFailure', () => {
      const error = {
        request: {},
        message: 'Network error'
      };

      const transformed = transformError(error);

      expect(transformed.name).toBe('NetworkFailure');
      expect(transformed.message).toBe('Network connection failed');
    });

    test('should transform unknown error to NetworkFailure', () => {
      const error = {
        message: 'Unknown error occurred'
      };

      const transformed = transformError(error);

      expect(transformed.name).toBe('NetworkFailure');
      expect(transformed.message).toBe('Unknown error occurred');
    });

    test('should handle error without message', () => {
      const error = {};

      const transformed = transformError(error);

      expect(transformed.name).toBe('NetworkFailure');
      expect(transformed.message).toBe('Unknown error');
    });
  });

  describe('sanitizeInput', () => {
    test('should trim whitespace', () => {
      const input = '  hello world  ';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('hello world');
    });

    test('should remove script tags', () => {
      const input = '<script>alert("xss")</script>hello';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('hello');
    });

    test('should remove javascript: protocol', () => {
      const input = 'javascript:alert("xss")';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('alert("xss")');
    });

    test('should limit input length to 1000 characters', () => {
      const longInput = 'a'.repeat(1500);
      const sanitized = sanitizeInput(longInput);
      expect(sanitized.length).toBe(1000);
    });

    test('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
    });

    test('should handle complex XSS attempts', () => {
      const input = '<script src="evil.js"></script><img onload="alert(1)" href="javascript:alert(2)">test';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('javascript:');
    });

    test('should preserve valid HTML-like content', () => {
      const input = 'Hello <world> this is <not> html';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('Hello <world> this is <not> html');
    });

    test('should handle special characters', () => {
      const input = 'Hello & world < > " \' test';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('Hello & world < > " \' test');
    });
  });

  describe('isValidEmail', () => {
    test('should validate valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
        'a@b.co'
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    test('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'test@',
        'test..test@example.com',
        'test@example',
        'test@.com',
        'test@example.',
        'test space@example.com',
        'test@example.com ',
        ' test@example.com'
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    test('should handle edge cases', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null as any)).toBe(false);
      expect(isValidEmail(undefined as any)).toBe(false);
    });

    test('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      expect(isValidEmail(longEmail)).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    test('should format bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1)).toBe('1 Bytes');
      expect(formatFileSize(512)).toBe('512 Bytes');
      expect(formatFileSize(1023)).toBe('1023 Bytes');
    });

    test('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
    });

    test('should format megabytes', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1572864)).toBe('1.5 MB');
      expect(formatFileSize(2097152)).toBe('2 MB');
    });

    test('should format gigabytes', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB');
      expect(formatFileSize(1610612736)).toBe('1.5 GB');
      expect(formatFileSize(2147483648)).toBe('2 GB');
    });

    test('should format terabytes', () => {
      expect(formatFileSize(1099511627776)).toBe('1 TB');
      expect(formatFileSize(1649267441664)).toBe('1.5 TB');
    });

    test('should handle decimal places correctly', () => {
      expect(formatFileSize(1234)).toBe('1.21 KB');
      expect(formatFileSize(1234567)).toBe('1.18 MB');
      expect(formatFileSize(1234567890)).toBe('1.15 GB');
    });

    test('should handle very large numbers', () => {
      const veryLarge = 1024 * 1024 * 1024 * 1024 * 1024; // 1 PB
      expect(formatFileSize(veryLarge)).toBe('1024 TB');
    });

    test('should handle negative numbers', () => {
      expect(formatFileSize(-1024)).toBe('-1 KB');
      expect(formatFileSize(-1)).toBe('-1 Bytes');
    });

    test('should handle edge cases', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1023.999)).toBe('1023 Bytes');
    });
  });

  describe('Edge Cases', () => {
    test('should handle null/undefined inputs gracefully', () => {
      expect(() => transformPost(null)).not.toThrow();
      expect(() => transformError(null)).not.toThrow();
      expect(() => sanitizeInput(null)).not.toThrow();
      expect(() => isValidEmail(null)).not.toThrow();
      expect(() => formatFileSize(null as any)).not.toThrow();
    });

    test('should handle malformed inputs', () => {
      expect(() => transformPost('not an object')).not.toThrow();
      expect(() => transformError('not an error')).not.toThrow();
      expect(() => sanitizeInput(123 as any)).not.toThrow();
      expect(() => isValidEmail(123 as any)).not.toThrow();
    });
  });

  describe('Performance', () => {
    test('should handle rapid function calls', () => {
      const iterations = 1000;
      
      const startTime = Date.now();
      
      for (let i = 0; i < iterations; i++) {
        transformPost({ id: i.toString() });
        transformError({ response: { status: 400 } });
        sanitizeInput('test input');
        isValidEmail('test@example.com');
        formatFileSize(1024);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle large inputs efficiently', () => {
      const largeInput = 'a'.repeat(10000);
      const largeEmail = 'a'.repeat(100) + '@example.com';
      
      const startTime = Date.now();
      
      sanitizeInput(largeInput);
      isValidEmail(largeEmail);
      formatFileSize(Number.MAX_SAFE_INTEGER);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100); // Should complete within 100ms
    });
  });

  describe('Type Safety', () => {
    test('should handle TypeScript compilation', () => {
      const post: any = { id: 'test' };
      const error: any = { response: { status: 400 } };
      const input: string = 'test input';
      const email: string = 'test@example.com';
      const bytes: number = 1024;

      const transformedPost = transformPost(post);
      const transformedError = transformError(error);
      const sanitized = sanitizeInput(input);
      const valid = isValidEmail(email);
      const formatted = formatFileSize(bytes);

      expect(transformedPost).toBeDefined();
      expect(transformedError).toBeInstanceOf(Error);
      expect(typeof sanitized).toBe('string');
      expect(typeof valid).toBe('boolean');
      expect(typeof formatted).toBe('string');
    });
  });
});
