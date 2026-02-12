/**
 * Error Factory Tests
 * 
 * Unit tests for the centralized error factory.
 */

import { errorFactory } from '../factories/ErrorFactory';
import { NetworkError, ValidationError, AuthenticationError, SystemError } from '../classes';
import { ErrorCategory, ErrorSeverity } from '../types';

describe('ErrorFactory', () => {
  describe('create', () => {
    it('should create error with all required properties', () => {
      const error = errorFactory.create(
        'Test error',
        'TEST_ERROR',
        ErrorCategory.NETWORK,
        ErrorSeverity.MEDIUM,
        true,
        'manual',
        'User message',
        ['Action 1', 'Action 2'],
        { key: 'value' }
      );

      expect(error.id).toBeDefined();
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.category).toBe(ErrorCategory.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.recoverable).toBe(true);
      expect(error.recoveryStrategy).toBe('manual');
      expect(error.userMessage).toBe('User message');
      expect(error.suggestedActions).toEqual(['Action 1', 'Action 2']);
      expect(error.metadata).toEqual({ key: 'value' });
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should create error with minimal properties', () => {
      const error = errorFactory.create(
        'Test error',
        'TEST_ERROR',
        ErrorCategory.UNKNOWN,
        ErrorSeverity.MEDIUM,
        false,
        'none',
        'User message',
        [],
        {}
      );

      expect(error.id).toBeDefined();
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.category).toBe(ErrorCategory.UNKNOWN);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.recoverable).toBe(false);
      expect(error.recoveryStrategy).toBe('none');
      expect(error.userMessage).toBe('User message');
      expect(error.suggestedActions).toEqual([]);
      expect(error.metadata).toEqual({});
    });
  });

  describe('fromError', () => {
    it('should convert generic Error to IError', () => {
      const originalError = new Error('Original error');
      const error = errorFactory.fromError(originalError);

      expect(error.id).toBeDefined();
      expect(error.message).toBe('Original error');
      expect(error.code).toBe('UNKNOWN_ERROR');
      expect(error.category).toBe(ErrorCategory.UNKNOWN);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.recoverable).toBe(true);
      expect(error.userMessage).toBe('Original error');
      expect(error.suggestedActions).toContain('Try again');
      expect(error.cause).toBe(originalError);
    });

    it('should convert Error with custom category', () => {
      const originalError = new Error('Network error');
      const error = errorFactory.fromError(
        originalError,
        ErrorCategory.NETWORK,
        ErrorSeverity.HIGH
      );

      expect(error.category).toBe(ErrorCategory.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
    });

    it('should convert Error with context', () => {
      const originalError = new Error('Context error');
      const context = {
        component: 'TestComponent',
        action: 'testAction',
        userId: 'user123'
      };
      const error = errorFactory.fromError(originalError, undefined, undefined, context);

      expect(error.context).toEqual(context);
    });
  });

  describe('createNetworkError', () => {
    it('should create network error', () => {
      const error = errorFactory.createNetworkError('Connection failed', 500, '/api/test');

      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toBe('Connection failed');
      expect(error.category).toBe(ErrorCategory.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.statusCode).toBe(500);
      expect(error.endpoint).toBe('/api/test');
    });

    it('should create network error with minimal parameters', () => {
      const error = errorFactory.createNetworkError('Connection failed');

      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toBe('Connection failed');
      expect(error.category).toBe(ErrorCategory.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
    });
  });

  describe('createValidationError', () => {
    it('should create validation error', () => {
      const error = errorFactory.createValidationError('Invalid field', 'email', 'invalid-email');

      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Invalid field');
      expect(error.category).toBe(ErrorCategory.VALIDATION);
      expect(error.severity).toBe(ErrorSeverity.LOW);
      expect(error.field).toBe('email');
      expect(error.value).toBe('invalid-email');
    });

    it('should create validation error with minimal parameters', () => {
      const error = errorFactory.createValidationError('Invalid field');

      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Invalid field');
      expect(error.category).toBe(ErrorCategory.VALIDATION);
      expect(error.severity).toBe(ErrorSeverity.LOW);
    });
  });

  describe('createAuthenticationError', () => {
    it('should create authentication error', () => {
      const error = errorFactory.createAuthenticationError('Login failed', 'oauth');

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.message).toBe('Login failed');
      expect(error.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.authType).toBe('oauth');
    });

    it('should create authentication error with minimal parameters', () => {
      const error = errorFactory.createAuthenticationError('Login failed');

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.message).toBe('Login failed');
      expect(error.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
    });
  });

  describe('createSystemError', () => {
    it('should create system error', () => {
      const error = errorFactory.createSystemError('System failure', 'SystemService', 'initialize');

      expect(error).toBeInstanceOf(SystemError);
      expect(error.message).toBe('System failure');
      expect(error.category).toBe(ErrorCategory.SYSTEM);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.component).toBe('SystemService');
      expect(error.operation).toBe('initialize');
    });

    it('should create system error with minimal parameters', () => {
      const error = errorFactory.createSystemError('System failure');

      expect(error).toBeInstanceOf(SystemError);
      expect(error.message).toBe('System failure');
      expect(error.category).toBe(ErrorCategory.SYSTEM);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
    });
  });

  describe('toJSON', () => {
    it('should serialize error to JSON', () => {
      const error = errorFactory.createNetworkError('Test error', 500, '/api/test');
      const json = error.toJSON();

      expect(json).toEqual({
        id: error.id,
        message: 'Test error',
        code: 'NETWORK_ERROR',
        category: 'network',
        severity: 'medium',
        recoverable: true,
        recoveryStrategy: 'delayed',
        userMessage: 'Network connection issue',
        suggestedActions: expect.any(Array),
        timestamp: error.timestamp.toISOString(),
        metadata: expect.any(Object),
        stack: expect.any(String),
        statusCode: 500,
        endpoint: '/api/test'
      });
    });
  });

  describe('copy', () => {
    it('should create copy with modifications', () => {
      const originalError = errorFactory.createNetworkError('Original error', 500, '/api/test');
      const copiedError = originalError.copy({
        message: 'Modified error',
        severity: ErrorSeverity.HIGH
      });

      expect(copiedError.id).toBe(originalError.id);
      expect(copiedError.message).toBe('Modified error');
      expect(copiedError.severity).toBe(ErrorSeverity.HIGH);
      expect(copiedError.category).toBe(originalError.category);
      expect(copiedError.statusCode).toBe(originalError.statusCode);
      expect(copiedError.endpoint).toBe(originalError.endpoint);
    });

    it('should create copy without modifications', () => {
      const originalError = errorFactory.createNetworkError('Original error', 500, '/api/test');
      const copiedError = originalError.copy();

      expect(copiedError.id).toBe(originalError.id);
      expect(copiedError.message).toBe(originalError.message);
      expect(copiedError.severity).toBe(originalError.severity);
      expect(copiedError.category).toBe(originalError.category);
      expect(copiedError.statusCode).toBe(originalError.statusCode);
      expect(copiedError.endpoint).toBe(originalError.endpoint);
    });
  });

  describe('error inheritance', () => {
    it('should maintain inheritance chain', () => {
      const error = errorFactory.createNetworkError('Test error', 500, '/api/test');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.name).toBe('NetworkError');
    });

    it('should have correct error type', () => {
      const networkError = errorFactory.createNetworkError('Network error', 500, '/api/test');
      const validationError = errorFactory.createValidationError('Validation error');
      const authError = errorFactory.createAuthenticationError('Auth error');
      const systemError = errorFactory.createSystemError('System error');

      expect(networkError.category).toBe(ErrorCategory.NETWORK);
      expect(validationError.category).toBe(ErrorCategory.VALIDATION);
      expect(authError.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(systemError.category).toBe(ErrorCategory.SYSTEM);
    });
  });

  describe('error immutability', () => {
    it('should have readonly properties', () => {
      const error = errorFactory.createNetworkError('Test error', 500, '/api/test');

      // These should be TypeScript errors if strict readonly checks are enabled
      expect(() => {
        // @ts-expect-error
        (error as any).id = 'new-id';
      }).toThrow();

      expect(() => {
        // @ts-expect-error
        (error as any).message = 'new message';
      }).toThrow();
    });
  });

  describe('error metadata', () => {
    it('should store and retrieve metadata', () => {
      const metadata = {
        userId: '123',
        sessionId: 'abc',
        requestId: 'req-123'
      };
      
      const error = errorFactory.create(
        'Test error',
        'TEST_ERROR',
        ErrorCategory.NETWORK,
        ErrorSeverity.MEDIUM,
        true,
        'manual',
        'User message',
        ['Action 1'],
        metadata
      );

      expect(error.metadata).toEqual(metadata);
      expect(error.metadata.userId).toBe('123');
      expect(error.metadata.sessionId).toBe('abc');
      expect(error.metadata.requestId).toBe('req-123');
    });

    it('should allow metadata modification through copy', () => {
      const error = errorFactory.createNetworkError('Test error', 500, '/api/test');
      const modifiedError = error.copy({
        metadata: { ...error.metadata, modified: true }
      });

      expect(modifiedError.metadata.modified).toBe(true);
      expect(error.metadata.modified).toBeUndefined();
    });
  });

  describe('error context', () => {
    it('should store and retrieve context', () => {
      const context = {
        component: 'TestComponent',
        action: 'testAction',
        userId: 'user123',
        sessionId: 'session-abc'
      };
      
      const error = errorFactory.create(
        'Test error',
        'TEST_ERROR',
        ErrorCategory.NETWORK,
        ErrorSeverity.MEDIUM,
        true,
        'manual',
        'User message',
        ['Action 1'],
        {},
        undefined,
        context
      );

      expect(error.context).toEqual(context);
      expect(error.context?.component).toBe('TestComponent');
      expect(error.context?.action).toBe('testAction');
      expect(error.context?.userId).toBe('user123');
      expect(error.context?.sessionId).toBe('session-abc');
    });
  });

  describe('error cause', () => {
    it('should store original error as cause', () => {
      const originalError = new Error('Original error');
      const error = errorFactory.fromError(originalError);

      expect(error.cause).toBe(originalError);
      expect(error.cause?.message).toBe('Original error');
    });

    it('should handle undefined cause', () => {
      const error = errorFactory.createNetworkError('Test error', 500, '/api/test');

      expect(error.cause).toBeUndefined();
    });
  });

  describe('error stack trace', () => {
    it('should preserve stack trace', () => {
      const originalError = new Error('Original error');
      originalError.stack = 'Error stack trace';
      
      const error = errorFactory.fromError(originalError);

      expect(error.stack).toBe('Error stack trace');
    });

    it('should generate stack trace for created errors', () => {
      const error = errorFactory.createNetworkError('Test error', 500, '/api/test');

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });
  });

  describe('concurrent error creation', () => {
    it('should handle concurrent error creation', () => {
      const errors = Array.from({ length: 10 }, (_, i) => 
        errorFactory.createNetworkError(`Error ${i}`, 500, `/api/test${i}`)
      );

      expect(errors).toHaveLength(10);
      expect(errors.every(error => error.id)).toBe(true);
      expect(errors.every(error => error.category === ErrorCategory.NETWORK)).toBe(true);
      expect(errors.every(error => error.severity === ErrorSeverity.MEDIUM)).toBe(true);
    });
  });

  describe('error validation', () => {
    it('should validate required properties', () => {
      const error = errorFactory.createNetworkError('Test error', 500, '/api/test');

      expect(error.id).toBeDefined();
      expect(typeof error.id).toBe('string');
      expect(error.id.length).toBeGreaterThan(0);
      
      expect(error.message).toBeDefined();
      expect(typeof error.message).toBe('string');
      
      expect(error.code).toBeDefined();
      expect(typeof error.code).toBe('string');
      
      expect(error.category).toBeDefined();
      expect(Object.values(ErrorCategory)).toContain(error.category);
      
      expect(error.severity).toBeDefined();
      expect(Object.values(ErrorSeverity)).toContain(error.severity);
      
      expect(error.timestamp).toBeDefined();
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should validate optional properties', () => {
      const error = errorFactory.createNetworkError('Test error', 500, '/api/test');

      expect(error.userMessage).toBeDefined();
      expect(error.suggestedActions).toBeDefined();
      expect(Array.isArray(error.suggestedActions)).toBe(true);
      expect(error.metadata).toBeDefined();
      expect(typeof error.metadata).toBe('object');
    });
  });
});
