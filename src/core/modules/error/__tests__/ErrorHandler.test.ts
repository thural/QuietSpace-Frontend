/**
 * Error Handler Tests
 * 
 * Unit tests for the centralized error handler.
 */

import { ErrorHandler } from '../handlers/ErrorHandler';
import { IError, ErrorCategory, ErrorSeverity, ErrorRecoveryStrategy, IErrorContext } from '../types';
import { NetworkError, ValidationError, AuthenticationError, SystemError } from '../classes';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;
  let mockContext: IErrorContext;

  beforeEach(() => {
    errorHandler = new ErrorHandler({
      maxHistorySize: 100,
      enableReporting: false,
      enableLogging: false
    });

    mockContext = {
      component: 'TestComponent',
      action: 'testAction',
      environment: 'test',
      userId: 'test-user-123'
    };
  });

  describe('handle', () => {
    it('should handle generic Error and convert to IError', async () => {
      const originalError = new Error('Test error');
      const handledError = await errorHandler.handle(originalError, mockContext);

      expect(handledError).toBeDefined();
      expect(handledError.id).toBeDefined();
      expect(handledError.message).toBe('Test error');
      expect(handledError.code).toBe('UNKNOWN_ERROR');
      expect(handledError.category).toBe(ErrorCategory.UNKNOWN);
      expect(handledError.severity).toBe(ErrorSeverity.MEDIUM);
      expect(handledError.recoverable).toBe(true);
      expect(handledError.userMessage).toBe('Test error');
      expect(handledError.suggestedActions).toContain('Try again');
      expect(handledError.timestamp).toBeInstanceOf(Date);
      expect(handledError.cause).toBe(originalError);
      expect(handledError.context).toEqual(mockContext);
    });

    it('should handle IError without conversion', async () => {
      const originalError = new NetworkError('Network failed', 'NETWORK_ERROR', 500, '/api/test');
      const handledError = await errorHandler.handle(originalError, mockContext);

      expect(handledError).toBe(originalError);
    });

    it('should add error to history', async () => {
      const error = new Error('Test error');
      await errorHandler.handle(error, mockContext);

      const history = errorHandler.getErrorHistory();
      expect(history).toHaveLength(1);
      expect(history[0].message).toBe('Test error');
    });

    it('should update statistics', async () => {
      const error = new Error('Test error');
      await errorHandler.handle(error, mockContext);

      const stats = errorHandler.getStatistics();
      expect(stats.totalErrors).toBe(1);
      expect(stats.byCategory[ErrorCategory.UNKNOWN]).toBe(1);
      expect(stats.bySeverity[ErrorSeverity.MEDIUM]).toBe(1);
      expect(stats.recoverable).toBe(1);
      expect(stats.nonRecoverable).toBe(0);
    });

    it('should emit error_occurred event', async () => {
      const eventListener = jest.fn();
      const unsubscribe = errorHandler.subscribe('error_occurred', eventListener);

      const error = new Error('Test error');
      await errorHandler.handle(error, mockContext);

      expect(eventListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error_occurred',
          error: expect.any(Object),
          context: mockContext
        })
      );

      unsubscribe();
    });
  });

  describe('classify', () => {
    it('should classify network errors', () => {
      const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/test');
      const classification = errorHandler.classify(error, mockContext);

      expect(classification.type).toBe(ErrorCategory.NETWORK);
      expect(classification.severity).toBe(ErrorSeverity.MEDIUM);
      expect(classification.recoverable).toBe(true);
      expect(classification.userMessage).toBe('Network connection issue');
      expect(classification.suggestedActions).toContain('Check internet connection');
    });

    it('should classify validation errors', () => {
      const error = new ValidationError('Invalid input', 'field', 'value');
      const classification = errorHandler.classify(error, mockContext);

      expect(classification.type).toBe(ErrorCategory.VALIDATION);
      expect(classification.severity).toBe(ErrorSeverity.LOW);
      expect(classification.recoverable).toBe(true);
      expect(classification.userMessage).toBe('Invalid input provided');
    });

    it('should classify authentication errors', () => {
      const error = new AuthenticationError('Login failed', 'oauth', 'user123');
      const classification = errorHandler.classify(error, mockContext);

      expect(classification.type).toBe(ErrorCategory.AUTHENTICATION);
      expect(classification.severity).toBe(ErrorSeverity.HIGH);
      expect(classification.recoverable).toBe(true);
      expect(classification.userMessage).toBe('Authentication required');
    });

    it('should classify system errors', () => {
      const error = new SystemError('System failure', 'SystemService', 'initialize');
      const classification = errorHandler.classify(error, mockContext);

      expect(classification.type).toBe(ErrorCategory.SYSTEM);
      expect(classification.severity).toBe(ErrorSeverity.HIGH);
      expect(classification.recoverable).toBe(true);
      expect(classification.userMessage).toBe('System error occurred');
    });

    it('should handle unknown errors', () => {
      const error = new Error('Unknown error');
      const classification = errorHandler.classify(error, mockContext);

      expect(classification.type).toBe(ErrorCategory.UNKNOWN);
      expect(classification.severity).toBe(ErrorSeverity.MEDIUM);
      expect(classification.recoverable).toBe(true);
      expect(classification.userMessage).toBe('An error occurred');
    });
  });

  describe('recover', () => {
    it('should recover from recoverable errors', async () => {
      const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/test');
      const success = await errorHandler.recover(error);

      expect(success).toBe(true);
    });

    it('should not recover from non-recoverable errors', async () => {
      const error = new SystemError('Critical failure', 'SystemService', 'critical');
      const success = await errorHandler.recover(error);

      expect(success).toBe(false);
    });

    it('should respect max retry attempts', async () => {
      const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/test');
      const success = await errorHandler.recover(error, {
        maxRetries: 0
      });

      expect(success).toBe(false);
    });

    it('should use custom recovery function', async () => {
      const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/test');
      const customRecovery = jest.fn().mockResolvedValue(true);

      const success = await errorHandler.recover(error, {
        customRecovery
      });

      expect(customRecovery).toHaveBeenCalledWith(error);
      expect(success).toBe(true);
    });

    it('should use fallback action on failure', async () => {
      const error = new SystemError('Critical failure', 'SystemService', 'critical');
      error.recoverable = false;
      const fallbackAction = jest.fn();

      const success = await errorHandler.recover(error, {
        fallbackAction
      });

      expect(success).toBe(false);
      expect(fallbackAction).toHaveBeenCalled();
    });

    it('should emit recovery events', async () => {
      const successListener = jest.fn();
      const failListener = jest.fn();

      errorHandler.subscribe('error_recovered', successListener);
      errorHandler.subscribe('error_recovery_failed', failListener);

      const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/test');
      await errorHandler.recover(error);

      expect(successListener).toHaveBeenCalled();
      expect(failListener).not.toHaveBeenCalled();
    });
  });

  describe('report', () => {
    it('should report error successfully', async () => {
      const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/test');

      // Should not throw
      await expect(errorHandler.report(error, mockContext)).resolves.toBeUndefined();
    });
  });

  describe('getStatistics', () => {
    it('should return initial statistics', () => {
      const stats = errorHandler.getStatistics();

      expect(stats.totalErrors).toBe(0);
      expect(stats.byCategory).toEqual({});
      expect(stats.bySeverity).toEqual({});
      expect(stats.recoverable).toBe(0);
      expect(stats.nonRecoverable).toBe(0);
    });

    it('should update statistics after handling errors', async () => {
      await errorHandler.handle(new Error('Error 1'), mockContext);
      await errorHandler.handle(new NetworkError('Network error', 'NETWORK_ERROR', 500, '/api'), mockContext);
      await errorHandler.handle(new ValidationError('Validation error', 'field', 'value'), mockContext);

      const stats = errorHandler.getStatistics();

      expect(stats.totalErrors).toBe(3);
      expect(stats.byCategory[ErrorCategory.UNKNOWN]).toBe(1);
      expect(stats.byCategory[ErrorCategory.NETWORK]).toBe(1);
      expect(stats.byCategory[ErrorCategory.VALIDATION]).toBe(1);
      expect(stats.recoverable).toBe(3);
      expect(stats.nonRecoverable).toBe(0);
    });

    it('should track oldest and newest errors', async () => {
      const error1 = new Error('First error');
      const error2 = new Error('Second error');

      await errorHandler.handle(error1, mockContext);
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      await errorHandler.handle(error2, mockContext);

      const stats = errorHandler.getStatistics();

      expect(stats.oldestError?.message).toBe('First error');
      expect(stats.newestError?.message).toBe('Second error');
    });
  });

  describe('subscribe', () => {
    it('should subscribe to error events', () => {
      const listener = jest.fn();
      const unsubscribe = errorHandler.subscribe('error_occurred', listener);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should call listener when event occurs', async () => {
      const listener = jest.fn();
      errorHandler.subscribe('error_occurred', listener);

      const error = new Error('Test error');
      await errorHandler.handle(error, mockContext);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error_occurred',
          error: expect.any(Object),
          context: mockContext
        })
      );
    });

    it('should unsubscribe correctly', async () => {
      const listener = jest.fn();
      const unsubscribe = errorHandler.subscribe('error_occurred', listener);

      unsubscribe();

      const error = new Error('Test error');
      await errorHandler.handle(error, mockContext);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should handle listener errors gracefully', async () => {
      const faultyListener = jest.fn().mockImplementation(() => {
        throw new Error('Listener error');
      });

      errorHandler.subscribe('error_occurred', faultyListener);

      const error = new Error('Test error');

      // Should not throw
      await expect(errorHandler.handle(error, mockContext)).resolves.toBeDefined();
    });
  });

  describe('getErrorHistory', () => {
    it('should return empty history initially', () => {
      const history = errorHandler.getErrorHistory();
      expect(history).toEqual([]);
    });

    it('should return handled errors in order', async () => {
      const error1 = new Error('First error');
      const error2 = new Error('Second error');

      await errorHandler.handle(error1, mockContext);
      await errorHandler.handle(error2, mockContext);

      const history = errorHandler.getErrorHistory();
      expect(history).toHaveLength(2);
      expect(history[0].message).toBe('First error');
      expect(history[1].message).toBe('Second error');
    });

    it('should respect limit parameter', async () => {
      for (let i = 0; i < 10; i++) {
        await errorHandler.handle(new Error(`Error ${i}`), mockContext);
      }

      const limitedHistory = errorHandler.getErrorHistory(5);
      expect(limitedHistory).toHaveLength(5);
      expect(limitedHistory[0].message).toBe('Error 5'); // Last 5 errors
    });
  });

  describe('clearHistory', () => {
    it('should clear error history', async () => {
      await errorHandler.handle(new Error('Test error'), mockContext);
      expect(errorHandler.getErrorHistory()).toHaveLength(1);

      errorHandler.clearHistory();
      expect(errorHandler.getErrorHistory()).toHaveLength(0);
    });

    it('should reset statistics', async () => {
      await errorHandler.handle(new Error('Test error'), mockContext);
      expect(errorHandler.getStatistics().totalErrors).toBe(1);

      errorHandler.clearHistory();
      expect(errorHandler.getStatistics().totalErrors).toBe(0);
    });
  });

  describe('maxHistorySize', () => {
    it('should limit history size', async () => {
      const limitedHandler = new ErrorHandler({ maxHistorySize: 3 });

      for (let i = 0; i < 5; i++) {
        await limitedHandler.handle(new Error(`Error ${i}`), mockContext);
      }

      const history = limitedHandler.getErrorHistory();
      expect(history).toHaveLength(3);
      expect(history[0].message).toBe('Error 2'); // Last 3 errors
    });
  });

  describe('error context', () => {
    it('should use provided context', async () => {
      const error = new Error('Test error');
      const handledError = await errorHandler.handle(error, mockContext);

      expect(handledError.context).toEqual(mockContext);
    });

    it('should work without context', async () => {
      const error = new Error('Test error');
      const handledError = await errorHandler.handle(error);

      expect(handledError.context).toBeDefined();
      expect(handledError.context?.component).toBe('Unknown');
    });
  });

  describe('error metadata', () => {
    it('should preserve error metadata', async () => {
      const error = new Error('Test error');
      const metadata = { userId: '123', sessionId: 'abc' };

      const handledError = await errorHandler.handle(error, {
        ...mockContext,
        additionalData: metadata
      });

      expect(handledError.metadata).toBeDefined();
      if (handledError.metadata?.additionalData) {
        expect(handledError.metadata.additionalData).toEqual(metadata);
      }
    });
  });

  describe('concurrent operations', () => {
    it('should handle multiple concurrent errors', async () => {
      const errors = Array.from({ length: 10 }, (_, i) => new Error(`Error ${i}`));

      const promises = errors.map(error => errorHandler.handle(error, mockContext));
      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      expect(results.every((result: IError) => result.id)).toBe(true);

      const stats = errorHandler.getStatistics();
      expect(stats.totalErrors).toBe(10);
    });
  });

  describe('error recovery edge cases', () => {
    it('should handle timeout during recovery', async () => {
      const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/test');
      const slowRecovery = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 2000))
      );

      const success = await errorHandler.recover(error, {
        customRecovery: slowRecovery,
        timeout: 1000
      });

      expect(success).toBe(false);
    });

    it('should handle recovery exceptions', async () => {
      const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/test');
      const faultyRecovery = jest.fn().mockRejectedValue(new Error('Recovery failed'));

      const success = await errorHandler.recover(error, {
        customRecovery: faultyRecovery
      });

      expect(success).toBe(false);
    });
  });
});
