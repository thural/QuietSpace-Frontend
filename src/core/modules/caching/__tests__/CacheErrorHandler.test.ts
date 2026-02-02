/**
 * Cache Error Handler Tests
 * 
 * Tests the CacheErrorHandler implementation to ensure it properly
 * handles and categorizes cache-related errors.
 */

import { CacheErrorHandler } from '../utils/CacheErrorHandler';

describe('CacheErrorHandler', () => {
    let errorHandler: CacheErrorHandler;

    beforeEach(() => {
        errorHandler = new CacheErrorHandler();
    });

    describe('Error Classification', () => {
        test('should classify storage errors correctly', () => {
            const storageError = new Error('Storage quota exceeded');
            const classification = errorHandler.classifyError(storageError);

            expect(classification.type).toBe('STORAGE_ERROR');
            expect(classification.severity).toBe('HIGH');
            expect(classification.recoverable).toBe(false);
        });

        test('should classify network errors correctly', () => {
            const networkError = new Error('Network timeout');
            const classification = errorHandler.classifyError(networkError);

            expect(classification.type).toBe('NETWORK_ERROR');
            expect(classification.severity).toBe('MEDIUM');
            expect(classification.recoverable).toBe(true);
        });

        test('should classify serialization errors correctly', () => {
            const serializationError = new Error('Failed to serialize data');
            const classification = errorHandler.classifyError(serializationError);

            expect(classification.type).toBe('SERIALIZATION_ERROR');
            expect(classification.severity).toBe('MEDIUM');
            expect(classification.recoverable).toBe(true);
        });

        test('should classify validation errors correctly', () => {
            const validationError = new Error('Invalid cache key format');
            const classification = errorHandler.classifyError(validationError);

            expect(classification.type).toBe('VALIDATION_ERROR');
            expect(classification.severity).toBe('LOW');
            expect(classification.recoverable).toBe(true);
        });

        test('should classify unknown errors as generic', () => {
            const unknownError = new Error('Some unknown error');
            const classification = errorHandler.classifyError(unknownError);

            expect(classification.type).toBe('UNKNOWN_ERROR');
            expect(classification.severity).toBe('MEDIUM');
            expect(classification.recoverable).toBe(true);
        });

        test('should handle null/undefined errors', () => {
            const classification1 = errorHandler.classifyError(null as any);
            const classification2 = errorHandler.classifyError(undefined as any);

            expect(classification1.type).toBe('UNKNOWN_ERROR');
            expect(classification1.severity).toBe('MEDIUM');
            expect(classification2.type).toBe('UNKNOWN_ERROR');
            expect(classification2.severity).toBe('MEDIUM');
        });
    });

    describe('Error Handling Strategies', () => {
        test('should provide recovery strategy for recoverable errors', () => {
            const recoverableError = new Error('Network timeout');
            const strategy = errorHandler.getRecoveryStrategy(recoverableError);

            expect(strategy).toBeDefined();
            expect(strategy.canRecover).toBe(true);
            expect(strategy.retryDelay).toBeGreaterThan(0);
            expect(strategy.maxRetries).toBeGreaterThan(0);
        });

        test('should not provide recovery strategy for non-recoverable errors', () => {
            const nonRecoverableError = new Error('Storage quota exceeded');
            const strategy = errorHandler.getRecoveryStrategy(nonRecoverableError);

            expect(strategy).toBeDefined();
            expect(strategy.canRecover).toBe(false);
            expect(strategy.retryDelay).toBe(0);
            expect(strategy.maxRetries).toBe(0);
        });

        test('should provide fallback strategy for all errors', () => {
            const error = new Error('Any error');
            const fallback = errorHandler.getFallbackStrategy(error);

            expect(fallback).toBeDefined();
            expect(typeof fallback.action).toBe('function');
            expect(fallback.description).toBeDefined();
        });

        test('should handle error with custom message patterns', () => {
            const customError = new Error('Custom cache operation failed');
            const classification = errorHandler.classifyError(customError);

            expect(classification.type).toBe('UNKNOWN_ERROR');
            expect(classification.message).toBe(customError.message);
        });
    });

    describe('Error Logging and Monitoring', () => {
        test('should log errors with appropriate context', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            
            const error = new Error('Test error');
            const context = { operation: 'get', key: 'test-key' };

            errorHandler.logError(error, context);

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Cache Error'),
                expect.objectContaining({
                    error: error.message,
                    operation: 'get',
                    key: 'test-key'
                })
            );

            consoleSpy.mockRestore();
        });

        test('should track error statistics', () => {
            const error1 = new Error('Network timeout');
            const error2 = new Error('Storage quota exceeded');
            const error3 = new Error('Network timeout');

            errorHandler.recordError(error1);
            errorHandler.recordError(error2);
            errorHandler.recordError(error3);

            const stats = errorHandler.getErrorStats();

            expect(stats.totalErrors).toBe(3);
            expect(stats.errorsByType.NETWORK_ERROR).toBe(2);
            expect(stats.errorsByType.STORAGE_ERROR).toBe(1);
            expect(stats.errorsBySeverity.HIGH).toBe(1);
            expect(stats.errorsBySeverity.MEDIUM).toBe(2);
        });

        test('should reset error statistics', () => {
            errorHandler.recordError(new Error('Test error'));
            expect(errorHandler.getErrorStats().totalErrors).toBe(1);

            errorHandler.resetStats();
            expect(errorHandler.getErrorStats().totalErrors).toBe(0);
        });

        test('should provide error rate calculation', () => {
            // Record some errors
            for (let i = 0; i < 5; i++) {
                errorHandler.recordError(new Error(`Error ${i}`));
            }

            const stats = errorHandler.getErrorStats();
            expect(stats.errorRate).toBeGreaterThan(0);
            expect(stats.errorRate).toBeLessThanOrEqual(1);
        });
    });

    describe('Circuit Breaker Pattern', () => {
        test('should detect high error rates and trigger circuit breaker', () => {
            // Simulate high error rate
            for (let i = 0; i < 100; i++) {
                errorHandler.recordError(new Error(`Error ${i}`));
            }

            const circuitBreakerState = errorHandler.getCircuitBreakerState();
            expect(circuitBreakerState.isOpen).toBe(true);
        });

        test('should close circuit breaker when error rate decreases', () => {
            // Trigger circuit breaker
            for (let i = 0; i < 100; i++) {
                errorHandler.recordError(new Error(`Error ${i}`));
            }

            expect(errorHandler.getCircuitBreakerState().isOpen).toBe(true);

            // Reset and simulate low error rate
            errorHandler.resetStats();
            errorHandler.recordError(new Error('Single error'));

            expect(errorHandler.getCircuitBreakerState().isOpen).toBe(false);
        });

        test('should provide circuit breaker status', () => {
            const status = errorHandler.getCircuitBreakerState();
            
            expect(status).toHaveProperty('isOpen');
            expect(status).toHaveProperty('errorThreshold');
            expect(status).toHaveProperty('currentErrorRate');
            expect(status).toHaveProperty('lastErrorTime');
        });
    });

    describe('Error Recovery Mechanisms', () => {
        test('should implement retry logic for recoverable errors', async () => {
            const retryableOperation = jest.fn()
                .mockRejectedValueOnce(new Error('Network timeout'))
                .mockRejectedValueOnce(new Error('Network timeout'))
                .mockResolvedValue('success');

            const result = await errorHandler.executeWithRetry(
                retryableOperation,
                { maxRetries: 3, retryDelay: 10 }
            );

            expect(result).toBe('success');
            expect(retryableOperation).toHaveBeenCalledTimes(3);
        });

        test('should fail after max retries exceeded', async () => {
            const failingOperation = jest.fn().mockRejectedValue(new Error('Always fails'));

            await expect(
                errorHandler.executeWithRetry(failingOperation, { maxRetries: 2, retryDelay: 10 })
            ).rejects.toThrow('Always fails');

            expect(failingOperation).toHaveBeenCalledTimes(3); // Initial + 2 retries
        });

        test('should not retry non-recoverable errors', async () => {
            const nonRetryableOperation = jest.fn().mockRejectedValue(new Error('Storage quota exceeded'));

            await expect(
                errorHandler.executeWithRetry(nonRetryableOperation, { maxRetries: 3, retryDelay: 10 })
            ).rejects.toThrow('Storage quota exceeded');

            expect(nonRetryableOperation).toHaveBeenCalledTimes(1); // No retries
        });

        test('should implement exponential backoff', async () => {
            const startTime = Date.now();
            const delays: number[] = [];

            const retryableOperation = jest.fn()
                .mockImplementation(() => {
                    delays.push(Date.now() - startTime);
                    return Promise.reject(new Error('Retry needed'));
                });

            try {
                await errorHandler.executeWithRetry(retryableOperation, {
                    maxRetries: 3,
                    retryDelay: 50,
                    useExponentialBackoff: true
                });
            } catch (error) {
                // Expected to fail
            }

            // Verify exponential backoff (delays should increase)
            expect(delays.length).toBe(4); // Initial + 3 retries
            if (delays.length >= 3) {
                expect(delays[2]).toBeGreaterThan(delays[1]);
                expect(delays[1]).toBeGreaterThan(delays[0]);
            }
        });
    });

    describe('Error Context and Metadata', () => {
        test('should enrich errors with context information', () => {
            const originalError = new Error('Original error');
            const context = {
                operation: 'set',
                key: 'test-key',
                ttl: 5000,
                cacheSize: 100
            };

            const enrichedError = errorHandler.enrichError(originalError, context);

            expect(enrichedError).toBe(originalError);
            expect((enrichedError as any).context).toEqual(context);
            expect((enrichedError as any).timestamp).toBeDefined();
        });

        test('should handle missing context gracefully', () => {
            const error = new Error('No context error');
            const enrichedError = errorHandler.enrichErrorError(error);

            expect(enrichedError).toBe(error);
            expect((enrichedError as any).context).toBeDefined();
        });

        test('should provide error correlation IDs', () => {
            const error1 = new Error('Error 1');
            const error2 = new Error('Error 2');

            const enriched1 = errorHandler.enrichError(error1);
            const enriched2 = errorHandler.enrichError(error2);

            expect((enriched1 as any).correlationId).toBeDefined();
            expect((enriched2 as any).correlationId).toBeDefined();
            expect((enriched1 as any).correlationId).not.toBe((enriched2 as any).correlationId);
        });
    });

    describe('Performance Monitoring', () => {
        test('should track error handling performance', () => {
            const startTime = performance.now();
            
            errorHandler.recordError(new Error('Performance test'));
            
            const endTime = performance.now();
            const handlingTime = endTime - startTime;

            expect(handlingTime).toBeLessThan(10); // Should be very fast
        });

        test('should provide performance metrics', () => {
            // Record various errors
            errorHandler.recordError(new Error('Error 1'));
            errorHandler.recordError(new Error('Error 2'));
            errorHandler.recordError(new Error('Error 3'));

            const metrics = errorHandler.getPerformanceMetrics();

            expect(metrics).toHaveProperty('totalErrorsHandled');
            expect(metrics).toHaveProperty('averageHandlingTime');
            expect(metrics).toHaveProperty('errorsPerSecond');
            expect(metrics.totalErrorsHandled).toBe(3);
        });

        test('should handle high error volumes efficiently', () => {
            const startTime = performance.now();
            const errorCount = 10000;

            for (let i = 0; i < errorCount; i++) {
                errorHandler.recordError(new Error(`Error ${i}`));
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(1000); // Should handle 10k errors quickly
            expect(errorHandler.getErrorStats().totalErrors).toBe(errorCount);
        });
    });

    describe('Integration Scenarios', () => {
        test('should handle complete error lifecycle', async () => {
            const error = new Error('Network timeout during cache get');
            const context = { operation: 'get', key: 'user-profile' };

            // Classify error
            const classification = errorHandler.classifyError(error);
            expect(classification.type).toBe('NETWORK_ERROR');

            // Log error
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            errorHandler.logError(error, context);
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();

            // Record error
            errorHandler.recordError(error);
            const stats = errorHandler.getErrorStats();
            expect(stats.totalErrors).toBe(1);

            // Get recovery strategy
            const strategy = errorHandler.getRecoveryStrategy(error);
            expect(strategy.canRecover).toBe(true);

            // Execute with retry
            const mockOperation = jest.fn().mockResolvedValue('success');
            const result = await errorHandler.executeWithRetry(mockOperation, strategy);
            expect(result).toBe('success');
        });

        test('should handle cascading errors', () => {
            const primaryError = new Error('Primary storage failure');
            const secondaryError = new Error('Fallback storage failure');

            errorHandler.recordError(primaryError);
            errorHandler.recordError(secondaryError);

            const stats = errorHandler.getErrorStats();
            expect(stats.totalErrors).toBe(2);
            expect(stats.cascadingFailures).toBeGreaterThan(0);
        });

        test('should maintain error history', () => {
            const errors = [
                new Error('Error 1'),
                new Error('Error 2'),
                new Error('Error 3')
            ];

            errors.forEach(error => errorHandler.recordError(error));

            const history = errorHandler.getErrorHistory();
            expect(history).toHaveLength(3);
            expect(history[0].error.message).toBe('Error 1');
            expect(history[1].error.message).toBe('Error 2');
            expect(history[2].error.message).toBe('Error 3');
        });

        test('should limit error history size', () => {
            // Create more errors than the history limit
            for (let i = 0; i < 150; i++) {
                errorHandler.recordError(new Error(`Error ${i}`));
            }

            const history = errorHandler.getErrorHistory();
            expect(history.length).toBeLessThanOrEqual(100); // Assuming limit of 100
        });
    });

    describe('Configuration and Customization', () => {
        test('should allow custom error classification rules', () => {
            const customRules = {
                'CUSTOM_ERROR': {
                    pattern: /custom/i,
                    severity: 'HIGH' as const,
                    recoverable: false
                }
            };

            const customHandler = new CacheErrorHandler(customRules);
            const customError = new Error('Custom error occurred');

            const classification = customHandler.classifyError(customError);
            expect(classification.type).toBe('CUSTOM_ERROR');
            expect(classification.severity).toBe('HIGH');
            expect(classification.recoverable).toBe(false);
        });

        test('should allow custom circuit breaker thresholds', () => {
            const customConfig = {
                circuitBreaker: {
                    errorThreshold: 0.1, // 10% error rate
                    recoveryTimeout: 30000
                }
            };

            const customHandler = new CacheErrorHandler({}, customConfig);
            
            // Should trigger at lower error rate
            for (let i = 0; i < 20; i++) {
                customHandler.recordError(new Error(`Error ${i}`));
            }

            const state = customHandler.getCircuitBreakerState();
            expect(state.isOpen).toBe(true);
        });
    });
});
