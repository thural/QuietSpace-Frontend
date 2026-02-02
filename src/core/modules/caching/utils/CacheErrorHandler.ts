/**
 * Cache Error Handler Component
 * 
 * Provides centralized error handling for cache operations.
 * Follows DRY principle by eliminating repeated error handling patterns.
 */

import type { CacheEvents } from '../types/interfaces';

export class CacheErrorHandler {
    /**
     * Handles cache operations with consistent error handling
     * 
     * @param operation - The operation to execute
     * @param events - Cache event handlers
     * @param operationName - Name of the operation for error reporting
     * @param fallbackValue - Value to return on error
     * @param key - Optional cache key for error context
     * @returns Operation result or fallback value
     */
    static async handleOperation<T>(
        operation: () => Promise<T> | T,
        events: CacheEvents | undefined,
        operationName: string,
        fallbackValue: T,
        key?: string
    ): Promise<T> {
        try {
            return await operation();
        } catch (error) {
            events?.onError?.(error as Error, operationName, key);
            return fallbackValue;
        }
    }

    /**
     * Handles synchronous cache operations with consistent error handling
     * 
     * @param operation - The synchronous operation to execute
     * @param events - Cache event handlers
     * @param operationName - Name of the operation for error reporting
     * @param fallbackValue - Value to return on error
     * @param key - Optional cache key for error context
     * @returns Operation result or fallback value
     */
    static handleSyncOperation<T>(
        operation: () => T,
        events: CacheEvents | undefined,
        operationName: string,
        fallbackValue: T,
        key?: string
    ): T {
        try {
            return operation();
        } catch (error) {
            events?.onError?.(error as Error, operationName, key);
            return fallbackValue;
        }
    }

    /**
     * Creates a wrapped async function with error handling
     * 
     * @param fn - The function to wrap
     * @param events - Cache event handlers
     * @param operationName - Name of the operation for error reporting
     * @returns Wrapped function with error handling
     */
    static wrapAsyncFunction<T, A extends any[]>(
        fn: (...args: A) => Promise<T>,
        events: CacheEvents | undefined,
        operationName: string
    ): (...args: A) => Promise<T> {
        return async (...args: A): Promise<T> => {
            try {
                return await fn(...args);
            } catch (error) {
                events?.onError?.(error as Error, operationName);
                throw error; // Re-throw for async functions that should fail
            }
        };
    }

    /**
     * Creates a wrapped synchronous function with error handling
     * 
     * @param fn - The function to wrap
     * @param events - Cache event handlers
     * @param operationName - Name of the operation for error reporting
     * @param fallbackValue - Value to return on error
     * @returns Wrapped function with error handling
     */
    static wrapSyncFunction<T, A extends any[]>(
        fn: (...args: A) => T,
        events: CacheEvents | undefined,
        operationName: string,
        fallbackValue: T
    ): (...args: A) => T {
        return (...args: A): T => {
            try {
                return fn(...args);
            } catch (error) {
                events?.onError?.(error as Error, operationName);
                return fallbackValue;
            }
        };
    }
}
