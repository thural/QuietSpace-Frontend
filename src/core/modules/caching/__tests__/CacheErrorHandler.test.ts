/**
 * Cache Error Handler Tests
 * 
 * Tests the CacheErrorHandler implementation to ensure it properly
 * handles and categorizes cache-related errors.
 */

import { jest } from '@jest/globals';
import { CacheErrorHandler } from '../utils/CacheErrorHandler';
import type { CacheEvents } from '../types/interfaces';

describe('CacheErrorHandler', () => {
    let mockEvents: CacheEvents;
    let onErrorSpy: jest.Mock;

    beforeEach(() => {
        onErrorSpy = jest.fn();
        mockEvents = {
            onError: onErrorSpy,
            onHit: jest.fn(),
            onMiss: jest.fn(),
            onEvict: jest.fn()
        };
    });

    describe('handleOperation', () => {
        test('should handle successful async operations', async () => {
            const operation = jest.fn().mockResolvedValue('success');

            const result = await CacheErrorHandler.handleOperation(
                operation,
                mockEvents,
                'test-operation',
                'fallback'
            );

            expect(result).toBe('success');
            expect(operation).toHaveBeenCalled();
            expect(onErrorSpy).not.toHaveBeenCalled();
        });

        test('should handle failed async operations and return fallback', async () => {
            const error = new Error('Operation failed');
            const operation = jest.fn().mockRejectedValue(error);

            const result = await CacheErrorHandler.handleOperation(
                operation,
                mockEvents,
                'test-operation',
                'fallback'
            );

            expect(result).toBe('fallback');
            expect(operation).toHaveBeenCalled();
            expect(onErrorSpy).toHaveBeenCalledWith(error, 'test-operation', undefined);
        });

        test('should handle failed async operations with key context', async () => {
            const error = new Error('Operation failed');
            const operation = jest.fn().mockRejectedValue(error);

            const result = await CacheErrorHandler.handleOperation(
                operation,
                mockEvents,
                'test-operation',
                'fallback',
                'test-key'
            );

            expect(result).toBe('fallback');
            expect(onErrorSpy).toHaveBeenCalledWith(error, 'test-operation', 'test-key');
        });

        test('should handle synchronous operations that return promises', async () => {
            const operation = jest.fn().mockReturnValue(Promise.resolve('sync-success'));

            const result = await CacheErrorHandler.handleOperation(
                operation,
                mockEvents,
                'sync-operation',
                'fallback'
            );

            expect(result).toBe('sync-success');
            expect(onErrorSpy).not.toHaveBeenCalled();
        });

        test('should handle operations without events', async () => {
            const operation = jest.fn().mockResolvedValue('success');

            const result = await CacheErrorHandler.handleOperation(
                operation,
                undefined,
                'test-operation',
                'fallback'
            );

            expect(result).toBe('success');
            expect(operation).toHaveBeenCalled();
        });
    });

    describe('handleSyncOperation', () => {
        test('should handle successful sync operations', () => {
            const operation = jest.fn().mockReturnValue('success');

            const result = CacheErrorHandler.handleSyncOperation(
                operation,
                mockEvents,
                'test-operation',
                'fallback'
            );

            expect(result).toBe('success');
            expect(operation).toHaveBeenCalled();
            expect(onErrorSpy).not.toHaveBeenCalled();
        });

        test('should handle failed sync operations and return fallback', () => {
            const error = new Error('Operation failed');
            const operation = jest.fn().mockImplementation(() => {
                throw error;
            });

            const result = CacheErrorHandler.handleSyncOperation(
                operation,
                mockEvents,
                'test-operation',
                'fallback'
            );

            expect(result).toBe('fallback');
            expect(operation).toHaveBeenCalled();
            expect(onErrorSpy).toHaveBeenCalledWith(error, 'test-operation', undefined);
        });

        test('should handle failed sync operations with key context', () => {
            const error = new Error('Operation failed');
            const operation = jest.fn().mockImplementation(() => {
                throw error;
            });

            const result = CacheErrorHandler.handleSyncOperation(
                operation,
                mockEvents,
                'test-operation',
                'fallback',
                'test-key'
            );

            expect(result).toBe('fallback');
            expect(onErrorSpy).toHaveBeenCalledWith(error, 'test-operation', 'test-key');
        });

        test('should handle operations without events', () => {
            const operation = jest.fn().mockReturnValue('success');

            const result = CacheErrorHandler.handleSyncOperation(
                operation,
                undefined,
                'test-operation',
                'fallback'
            );

            expect(result).toBe('success');
            expect(operation).toHaveBeenCalled();
        });
    });

    describe('wrapAsyncFunction', () => {
        test('should wrap successful async functions', async () => {
            const originalFn = jest.fn().mockResolvedValue('success');
            const wrappedFn = CacheErrorHandler.wrapAsyncFunction(
                originalFn,
                mockEvents,
                'wrapped-operation'
            );

            const result = await wrappedFn('arg1', 'arg2');

            expect(result).toBe('success');
            expect(originalFn).toHaveBeenCalledWith('arg1', 'arg2');
            expect(onErrorSpy).not.toHaveBeenCalled();
        });

        test('should wrap failed async functions and re-throw', async () => {
            const error = new Error('Async operation failed');
            const originalFn = jest.fn().mockRejectedValue(error);
            const wrappedFn = CacheErrorHandler.wrapAsyncFunction(
                originalFn,
                mockEvents,
                'wrapped-operation'
            );

            await expect(wrappedFn('arg1')).rejects.toThrow('Async operation failed');
            expect(originalFn).toHaveBeenCalledWith('arg1');
            expect(onErrorSpy).toHaveBeenCalledWith(error, 'wrapped-operation');
        });

        test('should wrap functions without events', async () => {
            const originalFn = jest.fn().mockResolvedValue('success');
            const wrappedFn = CacheErrorHandler.wrapAsyncFunction(
                originalFn,
                undefined,
                'wrapped-operation'
            );

            const result = await wrappedFn();

            expect(result).toBe('success');
            expect(originalFn).toHaveBeenCalled();
        });
    });

    describe('wrapSyncFunction', () => {
        test('should wrap successful sync functions', () => {
            const originalFn = jest.fn().mockReturnValue('success');
            const wrappedFn = CacheErrorHandler.wrapSyncFunction(
                originalFn,
                mockEvents,
                'wrapped-operation',
                'fallback'
            );

            const result = wrappedFn('arg1', 'arg2');

            expect(result).toBe('success');
            expect(originalFn).toHaveBeenCalledWith('arg1', 'arg2');
            expect(onErrorSpy).not.toHaveBeenCalled();
        });

        test('should wrap failed sync functions and return fallback', () => {
            const error = new Error('Sync operation failed');
            const originalFn = jest.fn().mockImplementation(() => {
                throw error;
            });
            const wrappedFn = CacheErrorHandler.wrapSyncFunction(
                originalFn,
                mockEvents,
                'wrapped-operation',
                'fallback'
            );

            const result = wrappedFn('arg1');

            expect(result).toBe('fallback');
            expect(originalFn).toHaveBeenCalledWith('arg1');
            expect(onErrorSpy).toHaveBeenCalledWith(error, 'wrapped-operation');
        });

        test('should wrap functions without events', () => {
            const originalFn = jest.fn().mockReturnValue('success');
            const wrappedFn = CacheErrorHandler.wrapSyncFunction(
                originalFn,
                undefined,
                'wrapped-operation',
                'fallback'
            );

            const result = wrappedFn();

            expect(result).toBe('success');
            expect(originalFn).toHaveBeenCalled();
        });
    });

    describe('Error Types', () => {
        test('should handle different error types in async operations', async () => {
            const errors = [
                new Error('Generic error'),
                new TypeError('Type error'),
                new ReferenceError('Reference error'),
                new RangeError('Range error')
            ];

            for (const error of errors) {
                onErrorSpy.mockClear();
                const operation = jest.fn().mockRejectedValue(error);

                const result = await CacheErrorHandler.handleOperation(
                    operation,
                    mockEvents,
                    'test-operation',
                    'fallback'
                );

                expect(result).toBe('fallback');
                expect(onErrorSpy).toHaveBeenCalledWith(error, 'test-operation', undefined);
            }
        });

        test('should handle different error types in sync operations', () => {
            const errors = [
                new Error('Generic error'),
                new TypeError('Type error'),
                new ReferenceError('Reference error'),
                new RangeError('Range error')
            ];

            for (const error of errors) {
                onErrorSpy.mockClear();
                const operation = jest.fn().mockImplementation(() => {
                    throw error;
                });

                const result = CacheErrorHandler.handleSyncOperation(
                    operation,
                    mockEvents,
                    'test-operation',
                    'fallback'
                );

                expect(result).toBe('fallback');
                expect(onErrorSpy).toHaveBeenCalledWith(error, 'test-operation', undefined);
            }
        });
    });

    describe('Complex Scenarios', () => {
        test('should handle nested error handlers', async () => {
            const innerError = new Error('Inner operation failed');

            const innerOperation = jest.fn().mockRejectedValue(innerError);
            const outerOperation = jest.fn().mockImplementation(async () => {
                return await CacheErrorHandler.handleOperation(
                    innerOperation,
                    mockEvents,
                    'inner-operation',
                    'inner-fallback'
                );
            });

            const result = await CacheErrorHandler.handleOperation(
                outerOperation,
                mockEvents,
                'outer-operation',
                'outer-fallback'
            );

            expect(result).toBe('inner-fallback');
            expect(onErrorSpy).toHaveBeenCalledWith(innerError, 'inner-operation', undefined);
        });

        test('should handle operations that return null/undefined', async () => {
            const nullOperation = jest.fn().mockResolvedValue(null);
            const undefinedOperation = jest.fn().mockResolvedValue(undefined);

            const nullResult = await CacheErrorHandler.handleOperation(
                nullOperation,
                mockEvents,
                'null-operation',
                'fallback'
            );

            const undefinedResult = await CacheErrorHandler.handleOperation(
                undefinedOperation,
                mockEvents,
                'undefined-operation',
                'fallback'
            );

            expect(nullResult).toBeNull();
            expect(undefinedResult).toBeUndefined();
            expect(onErrorSpy).not.toHaveBeenCalled();
        });

        test('should handle operations with complex return types', async () => {
            const complexData = {
                id: 1,
                name: 'test',
                nested: { value: 'complex' },
                array: [1, 2, 3]
            };

            const operation = jest.fn().mockResolvedValue(complexData);

            const result = await CacheErrorHandler.handleOperation(
                operation,
                mockEvents,
                'complex-operation',
                null as any
            );

            expect(result).toEqual(complexData);
            expect(onErrorSpy).not.toHaveBeenCalled();
        });
    });
});
