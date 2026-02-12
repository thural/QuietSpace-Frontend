/**
 * Error Utilities Tests
 * 
 * Unit tests for error utility functions.
 */

import { 
  isCriticalError,
  isRecoverableError,
  combineErrors,
  getErrorSummary,
  formatErrorForDisplay,
  getErrorContext,
  createErrorContext
} from '../utils/ErrorUtils';
import { NetworkError, ValidationError, AuthenticationError, SystemError } from '../classes';
import { ErrorCategory, ErrorSeverity } from '../types';

describe('ErrorUtils', () => {
  describe('isCriticalError', () => {
    it('should return true for critical errors', () => {
      const error = new SystemError('Critical failure', 'SystemService', 'critical');
      error.severity = ErrorSeverity.CRITICAL;
      
      expect(isCriticalError(error)).toBe(true);
    });

    it('should return false for non-critical errors', () => {
      const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/test');
      
      expect(isCriticalError(error)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isCriticalError(undefined)).toBe(false);
    });
  });

  describe('isRecoverableError', () => {
    it('should return true for recoverable errors', () => {
      const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/test');
      error.recoverable = true;
      
      expect(isRecoverableError(error)).toBe(true);
    });

    it('should return false for non-recoverable errors', () => {
      const error = new SystemError('Critical failure', 'SystemService', 'critical');
      error.recoverable = false;
      
      expect(isRecoverableError(error)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isRecoverableError(undefined)).toBe(false);
    });
  });

  describe('combineErrors', () => {
    it('should combine multiple errors', () => {
      const error1 = new NetworkError('Network error 1', 'NETWORK_ERROR', 500, '/api/test1');
      const error2 = new ValidationError('Validation error', 'field', 'invalid');
      const error3 = new AuthenticationError('Auth error', 'oauth', 'user123');

      const combined = combineErrors([error1, error2, error3]);

      expect(combined.id).toBeDefined();
      expect(combined.message).toContain('Multiple errors occurred');
      expect(combined.category).toBe(ErrorCategory.UNKNOWN);
      expect(combined.severity).toBe(ErrorSeverity.HIGH);
      expect(combined.suggestedActions).toContain('Check network connection');
      expect(combined.suggestedActions).toContain('Fix validation errors');
      expect(combined.suggestedActions).toContain('Check authentication');
    });

    it('should handle empty array', () => {
      const combined = combineErrors([]);
      
      expect(combined.id).toBeDefined();
      expect(combined.message).toBe('No errors to combine');
    });

    it('should handle single error', () => {
      const error = new NetworkError('Network error', 'NETWORK_ERROR', 500, '/api/test');
      const combined = combineErrors([error]);

      expect(combined.id).toBe(error.id);
      expect(combined.message).toBe(error.message);
    });
  });

  describe('getErrorSummary', () => {
    it('should create error summary', () => {
      const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/test');
      const summary = getErrorSummary(error);

      expect(summary.id).toBe(error.id);
      expect(summary.message).toBe(error.message);
      expect(summary.category).toBe(error.category);
      expect(summary.severity).toBe(error.severity);
      expect(summary.recoverable).toBe(error.recoverable);
      expect(summary.timestamp).toBe(error.timestamp);
    });

    it('should handle undefined', () => {
      const summary = getErrorSummary(undefined);
      
      expect(summary).toBeNull();
    });
  });

  describe('formatErrorForDisplay', () => {
    it('should format error for display', () => {
      const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/test');
      const formatted = formatErrorForDisplay(error);

      expect(formatted.title).toBeDefined();
      expect(formatted.message).toBe(error.userMessage);
      expect(formatted.severity).toBe(error.severity);
      expect(formatted.category).toBe(error.category);
      expect(formatted.timestamp).toBe(error.timestamp);
      expect(formatted.suggestedActions).toEqual(error.suggestedActions);
    });

    it('should handle undefined', () => {
      const formatted = formatErrorForDisplay(undefined);
      
      expect(formatted).toBeNull();
    });
  });

  describe('getErrorContext', () => {
    it('should create error context', () => {
      const context = getErrorContext({
        component: 'TestComponent',
        action: 'testAction'
      });

      expect(context.component).toBe('TestComponent');
      expect(context.action).toBe('testAction');
      expect(context.environment).toBeDefined();
      expect(context.url).toBeDefined();
      expect(context.userAgent).toBeDefined();
    });

    it('should handle empty context', () => {
      const context = getErrorContext();

      expect(context.component).toBe('Unknown');
      expect(context.action).toBe('unknown');
      expect(context.environment).toBeDefined();
    });
  });

  describe('createErrorContext', () => {
    it('should create error context with provided data', () => {
      const context = createErrorContext({
        component: 'TestComponent',
        action: 'testAction',
        userId: 'user123',
        sessionId: 'session-abc'
      });

      expect(context.component).toBe('TestComponent');
      expect(context.action).toBe('testAction');
      expect(context.userId).toBe('user123');
      expect(context.sessionId).toBe('session-abc');
      expect(context.environment).toBeDefined();
    });

    it('should create context with defaults', () => {
      const context = createErrorContext();

      expect(context.component).toBe('Unknown');
      expect(context.action).toBe('unknown');
      expect(context.environment).toBe('browser');
    });
  });

  describe('error severity comparison', () => {
    it('should compare error severities correctly', () => {
      const lowError = new ValidationError('Low error', 'field', 'value');
      lowError.severity = ErrorSeverity.LOW;
      
      const mediumError = new NetworkError('Medium error', 'NETWORK_ERROR', 500, '/api/test');
      mediumError.severity = ErrorSeverity.MEDIUM;
      
      const highError = new AuthenticationError('High error', 'oauth', 'user123');
      highError.severity = ErrorSeverity.HIGH;
      
      const criticalError = new SystemError('Critical error', 'SystemService', 'critical');
      criticalError.severity = ErrorSeverity.CRITICAL;

      expect(isCriticalError(criticalError)).toBe(true);
      expect(isCriticalError(highError)).toBe(false);
      expect(isCriticalError(mediumError)).toBe(false);
      expect(isCriticalError(lowError)).toBe(false);

      expect(isRecoverableError(lowError)).toBe(true);
      expect(isRecoverableError(mediumError)).toBe(true);
      expect(isRecoverableError(highError)).toBe(true);
      expect(isRecoverableError(criticalError)).toBe(false);
    });
  });

  describe('error category filtering', () => {
    it('should filter errors by category', () => {
      const networkError = new NetworkError('Network error', 'NETWORK_ERROR', 500, '/api/test');
      const validationError = new ValidationError('Validation error', 'field', 'value');
      const authError = new AuthenticationError('Auth error', 'oauth', 'user123');

      const errors = [networkError, validationError, authError];
      
      const networkErrors = errors.filter(error => error.category === ErrorCategory.NETWORK);
      const validationErrors = errors.filter(error => error.category === ErrorCategory.VALIDATION);
      const authErrors = errors.filter(error => error.category === ErrorCategory.AUTHENTICATION);

      expect(networkErrors).toHaveLength(1);
      expect(validationErrors).toHaveLength(1);
      expect(authErrors).toHaveLength(1);
      expect(networkErrors[0]).toBe(networkError);
      expect(validationErrors[0]).toBe(validationError);
      expect(authErrors[0]).toBe(authError);
    });
  });

  describe('error timestamp handling', () => {
    it('should handle error timestamps', () => {
      const error = new NetworkError('Network error', 'NETWORK_ERROR', 500, '/api/test');
      const before = new Date();
      
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });
  });

  describe('error metadata handling', () => {
    it('should handle error metadata', () => {
      const error = new NetworkError('Network error', 'NETWORK_ERROR', 500, '/api/test');
      error.metadata = {
        requestId: 'req-123',
        userId: 'user-456',
        sessionId: 'session-789'
      };

      expect(error.metadata.requestId).toBe('req-123');
      expect(error.metadata.userId).toBe('user-456');
      expect(error.metadata.sessionId).toBe('session-789');
    });
  });

  describe('error suggestions', () => {
    it('should provide relevant suggestions for different error types', () => {
      const networkError = new NetworkError('Network error', 'NETWORK_ERROR', 500, '/api/test');
      const validationError = new ValidationError('Validation error', 'field', 'invalid');
      const authError = new AuthenticationError('Auth error', 'oauth', 'user123');

      expect(networkError.suggestedActions).toContain('Check network connection');
      expect(validationError.suggestedActions).toContain('Fix validation errors');
      expect(authError.suggestedActions).toContain('Check authentication');
    });
  });

  describe('error user messages', () => {
    it('should provide user-friendly messages', () => {
      const networkError = new NetworkError('Network error', 'NETWORK_ERROR', 500, '/api/test');
      const validationError = new ValidationError('Validation error', 'field', 'invalid');
      const authError = new AuthenticationError('Auth error', 'oauth', 'user123');

      expect(networkError.userMessage).toBe('Network connection issue');
      expect(validationError.userMessage).toBe('Invalid input provided');
      expect(authError.userMessage).toBe('Authentication required');
    });
  });

  describe('error code handling', () => {
    it('should have proper error codes', () => {
      const networkError = new NetworkError('Network error', 'NETWORK_ERROR', 500, '/api/test');
      const validationError = new ValidationError('Validation error', 'field', 'invalid');
      const authError = new AuthenticationError('Auth error', 'oauth', 'user123');
      const systemError = new SystemError('System error', 'SystemService', 'initialize');

      expect(networkError.code).toBe('NETWORK_ERROR');
      expect(validationError.code).toBe('VALIDATION_ERROR');
      expect(authError.code).toBe('AUTHENTICATION_ERROR');
      expect(systemError.code).toBe('SYSTEM_ERROR');
    });
  });

  describe('error recovery strategies', () => {
    it('should have appropriate recovery strategies', () => {
      const networkError = new NetworkError('Network error', 'NETWORK_ERROR', 500, '/api/test');
      const validationError = new ValidationError('Validation error', 'field', 'invalid');
      const authError = new AuthenticationError('Auth error', 'oauth', 'user123');
      const systemError = new SystemError('System error', 'SystemService', 'critical');

      expect(networkError.recoveryStrategy).toBe('delayed');
      expect(validationError.recoveryStrategy).toBe('manual');
      expect(authError.recoveryStrategy).toBe('manual');
      expect(systemError.recoveryStrategy).toBe('automatic');
    });
  });

  describe('error immutability', () => {
    it('should create immutable error objects', () => {
      const error = new NetworkError('Test error', 'NETWORK_ERROR', 500, '/api/test');
      const originalId = error.id;
      const originalMessage = error.message;

      // These should be TypeScript errors if strict readonly checks are enabled
      expect(() => {
        // @ts-expect-error
        (error as any).id = 'new-id';
      }).toThrow();

      expect(() => {
        // @ts-expect-error
        (error as any).message = 'new message';
      }).toThrow();

      // Original values should remain unchanged
      expect(error.id).toBe(originalId);
      expect(error.message).toBe(originalMessage);
    });
  });

  describe('error inheritance', () => {
    it('should maintain proper inheritance chain', () => {
      const networkError = new NetworkError('Network error', 'NETWORK_ERROR', 500, '/api/test');
      const validationError = new ValidationError('Validation error', 'field', 'invalid');
      const authError = new AuthenticationError('Auth error', 'oauth', 'user123');
      const systemError = new SystemError('System error', 'SystemService', 'initialize');

      expect(networkError).toBeInstanceOf(Error);
      expect(networkError).toBeInstanceOf(NetworkError);
      expect(validationError).toBeInstanceOf(Error);
      expect(validationError).toBeInstanceOf(ValidationError);
      expect(authError).toBeInstanceOf(Error);
      expect(authError).toBeInstanceOf(AuthenticationError);
      expect(systemError).toBeInstanceOf(Error);
      expect(systemError).toBeInstanceOf(SystemError);
    });
  });
});
