/**
 * Cache Error Handler Component
 * 
 * Provides centralized error handling for cache operations.
 * Follows DRY principle by eliminating repeated error handling patterns.
 */

import type { CacheEvents } from '../types/interfaces';

// Import centralized error handling
import { createSystemError } from '../../error';

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
     * Wraps an async function with error handling
     * 
     * @param operation - The async function to wrap
     * @param events - Cache event handlers
     * @param operationName - Name of the operation for error reporting
     * @param fallbackValue - Value to return on error
     * @param key - Optional cache key for error context
     * @returns Wrapped function with error handling
     */
    static wrapAsyncFunction<T extends (...args: any[]) => Promise<T>>(
        operation: T,
        events: CacheEvents | undefined,
        operationName: string,
        fallbackValue: T,
        key?: string
    ): T {
        return async (...args: any[]): Promise<T> => {
            try {
                return await operation(...args);
            } catch (error) {
                events?.onError?.(error as Error, operationName, key);
                return fallbackValue;
            }
        };
    }

    /**
     * Wraps a synchronous function with error handling
     * 
     * @param operation - The synchronous function to wrap
     * @param events - Cache event handlers
     * @param operationName - Name of the operation for error reporting
     * @param fallbackValue - Value to return on error
     * @param key - Optional cache key for error context
     * @returns Wrapped function with error handling
     */
    static wrapSyncFunction<T extends (...args: any[]) => T>(
        operation: T,
        events: CacheEvents | undefined,
        operationName: string,
        fallbackValue: T,
        key?: string
    ): T {
        return (...args: any[]): T => {
            try {
                return operation(...args);
            } catch (error) {
                events?.onError?.(error as Error, operationName, key);
                return fallbackValue;
            }
        };
    }

    /**
     * Creates a cache operation with error handling
     * 
     * @param operation - The operation to execute
     * @param events - Cache event handlers
     * @param operationName - Name of the operation for error reporting
     * @param fallbackValue - Value to return on error
     * @param key - Optional cache key for error context
     * @returns Promise that resolves to the operation result or fallback value
     */
    static createOperation<T>(
        operation: () => Promise<T> | T,
        events: CacheEvents | undefined,
        operationName: string,
        fallbackValue: T,
        key?: string
    ): Promise<T> {
        return this.handleOperation(operation, events, operationName, fallbackValue, key);
    }

    /**
     * Creates a synchronous cache operation with error handling
     * 
     * @param operation - The synchronous operation to execute
     * @param events - Cache event handlers
     * @param operationName - Name of the operation for error reporting
     * @param fallbackValue - Value to return on error
     * @param key - Optional cache key for error context
     * @returns Function that executes the operation with error handling
     */
    static createSyncOperation<T>(
        operation: () => T,
        events: CacheEvents | undefined,
        operationName: string,
        fallbackValue: T,
        key?: string
    ): () => T {
        return () => {
            try {
                return operation();
            } catch (error) {
                events?.onError?.(error as Error, operationName, key);
                return fallbackValue;
            }
        };
    }

    /**
     * Handles multiple cache operations in parallel
     * 
     * @param operations - Array of operations to execute
     * @param events - Cache event handlers
     * @param fallbackValues - Array of fallback values
     * @returns Promise that resolves to an array of results
     */
    static async handleParallelOperations<T>(
        operations: Array<() => Promise<T>>,
        events: CacheEvents | undefined,
        operationNames: string[],
        fallbackValues: T[]
    ): Promise<T[]> {
        try {
            const results = await Promise.allSettled(
                operations.map(op => op()),
                fallbackValues
            );
            return results;
        } catch (error) {
            events?.onError?.(error as Error, 'parallel-operations');
            return fallbackValues;
        }
    }

    /**
     * Handles cache operations with retry logic
     * 
     * @param operation - The operation to execute
     * @param events - Cache event handlers
     * @param operationName - Name of the operation for error reporting
     * @param fallbackValue - Value to return on error
     * @param maxRetries - Maximum number of retry attempts
     * @param retryDelay - Delay between retries in milliseconds
     * @param key - Optional cache key for error context
     * @returns Promise that resolves to the operation result or fallback value
     */
    static async handleOperationWithRetry<T>(
        operation: () => Promise<T> | T,
        events: CacheEvents | undefined,
        operationName: string,
        fallbackValue: T,
        maxRetries: number = 3,
        retryDelay: number = 1000,
        key?: string
    ): Promise<T> {
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;

                if (attempt < maxRetries) {
                    events?.onError?.(error, `${operationName} (attempt ${attempt}/${maxRetries})`, key);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                } else {
                    events?.onError?.(lastError, `${operationName} (max retries exceeded)`, key);
                    break;
                }
            }
        }

        if (lastError) {
            events?.onError?.(lastError, `${operationName} (failed after ${maxRetries} retries)`, key);
            return fallbackValue;
        }

        return fallbackValue;
    }

    /**
     * Validates cache configuration
     * 
     * @param config - Configuration to validate
     * @returns Validation result
     */
    static validateConfig(config: any): { success: boolean; error?: string } {
        try {
            // Basic validation - in a real implementation, this would be more comprehensive
            if (!config) {
                return { success: false, error: 'Configuration is required' };
            }

            // Check required properties
            const requiredProps = ['url', 'ttl', 'maxSize'];
            for (const prop of requiredProps) {
                if (!(prop in config)) {
                    return { success: false, error: `Missing required property: ${prop}` };
                }
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown validation error' };
        }
    }

    /**
     * Creates a cache error with context
     * 
     * @param message - Error message
     * @param operationName - Name of the operation
     * @param key - Cache key
     * @returns System error instance
     */
    private static createCacheError(
        message: string,
        operationName: string,
        key?: string
    ): Error {
        return createSystemError(
            `Cache error: ${message}`,
            'CacheErrorHandler',
            operationName
        );
    }

    /**
     * Logs an error with context
     * 
     * @param error - Error instance
     * @param operationName - Name of the operation
     * @param key - Cache key
     */
    private static logError(
        error: Error,
        operationName: string,
        key?: string
    ): void {
        // In a real implementation, this would use a proper logging service
        console.error(`[CacheErrorHandler] ${operationName}:`, error, { key });
    }
}
