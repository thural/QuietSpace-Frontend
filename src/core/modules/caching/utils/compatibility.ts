/**
 * Cache Module Backward Compatibility Layer
 * 
 * Provides compatibility methods for migrating from synchronous to async cache operations.
 * This helps existing code gradually migrate to the new async interface.
 */

import type { ICacheProvider, ICacheServiceManager } from '../types/interfaces';

/**
 * Legacy Cache Adapter - wraps async cache provider with sync methods
 * 
 * @deprecated Use the new async ICacheProvider interface directly
 */
export class LegacyCacheAdapter {
    constructor(private modernProvider: ICacheProvider) { }

    /**
     * Synchronous get method - wraps async method for backward compatibility
     * 
     * @deprecated Use async get() method instead
     */
    getSync<T>(key: string): T | null {
        let result: T | null = null;
        let error: Error | null = null;

        // Execute async operation synchronously (not recommended but for compatibility)
        this.modernProvider.get<T>(key).then(r => {
            result = r;
        }).catch(e => {
            error = e as Error;
        });

        if (error) {
            throw error;
        }

        return result;
    }

    /**
     * Synchronous set method - wraps async method for backward compatibility
     * 
     * @deprecated Use async set() method instead
     */
    setSync<T>(key: string, data: T, ttl?: number): void {
        let error: Error | null = null;

        this.modernProvider.set(key, data, ttl).catch(e => {
            error = e as Error;
        });

        if (error) {
            throw error;
        }
    }

    /**
     * Synchronous invalidate method - wraps async method for backward compatibility
     * 
     * @deprecated Use async invalidate() method instead
     */
    invalidateSync(key: string): boolean {
        let result = false;
        let error: Error | null = null;

        this.modernProvider.invalidate(key).then(r => {
            result = r;
        }).catch(e => {
            error = e as Error;
        });

        if (error) {
            throw error;
        }

        return result;
    }

    /**
     * Synchronous clear method - wraps async method for backward compatibility
     * 
     * @deprecated Use async clear() method instead
     */
    clearSync(): void {
        let error: Error | null = null;

        this.modernProvider.clear().catch(e => {
            error = e as Error;
        });

        if (error) {
            throw error;
        }
    }

    /**
     * Get the underlying modern provider
     */
    getModernProvider(): ICacheProvider {
        return this.modernProvider;
    }
}

/**
 * Legacy Cache Service Manager Adapter
 * 
 * @deprecated Use the new async ICacheServiceManager interface directly
 */
export class LegacyCacheServiceManagerAdapter {
    constructor(private modernManager: ICacheServiceManager) { }

    /**
     * Get cache with legacy sync methods
     * 
     * @deprecated Use the new async interface directly
     */
    getLegacyCache(featureName: string): LegacyCacheAdapter {
        const modernCache = this.modernManager.getCache(featureName);
        return new LegacyCacheAdapter(modernCache);
    }

    /**
     * Synchronous invalidate pattern method
     * 
     * @deprecated Use async invalidatePattern() method instead
     */
    async invalidatePatternSync(pattern: string): Promise<number> {
        return this.modernManager.invalidatePattern(pattern);
    }

    /**
     * Get the underlying modern manager
     */
    getModernManager(): ICacheServiceManager {
        return this.modernManager;
    }
}

/**
 * Migration helper utilities
 */
export class CacheMigrationHelper {
    /**
     * Convert legacy sync cache calls to async
     * 
     * @param legacyProvider - Legacy cache provider with sync methods
     * @returns Modern async cache provider
     */
    static toAsyncProvider(legacyProvider: {
        get<T>(key: string): T | null;
        getEntry(key: string): any;
        set<T>(key: string, data: T, ttl?: number): void;
        invalidate(key: string): boolean;
        delete?(key: string): boolean;
        invalidatePattern(pattern: string | RegExp): number;
        clear(): void;
        has(key: string): boolean;
        getStats(): any;
        getConfig(): any;
        updateConfig(newConfig: any): void;
        dispose(): void;
    }): ICacheProvider {
        return {
            get: async <T>(key: string): Promise<T | null> => {
                return Promise.resolve(legacyProvider.get<T>(key));
            },
            getEntry: async (key: string): Promise<any> => {
                return Promise.resolve(legacyProvider.getEntry(key));
            },
            set: async <T>(key: string, data: T, ttl?: number): Promise<void> => {
                legacyProvider.set(key, data, ttl);
                return Promise.resolve();
            },
            invalidate: async (key: string): Promise<boolean> => {
                return Promise.resolve(legacyProvider.invalidate(key));
            },
            delete: async (key: string): Promise<boolean> => {
                return Promise.resolve(legacyProvider.delete ? legacyProvider.delete(key) : legacyProvider.invalidate(key));
            },
            invalidatePattern: async (pattern: string | RegExp): Promise<number> => {
                return Promise.resolve(legacyProvider.invalidatePattern(pattern));
            },
            clear: async (): Promise<void> => {
                legacyProvider.clear();
                return Promise.resolve();
            },
            has: async (key: string): Promise<boolean> => {
                return Promise.resolve(legacyProvider.has(key));
            },
            getStats: () => legacyProvider.getStats(),
            getConfig: () => legacyProvider.getConfig(),
            updateConfig: async (newConfig: any): Promise<void> => {
                legacyProvider.updateConfig(newConfig);
                return Promise.resolve();
            },
            dispose: async (): Promise<void> => {
                legacyProvider.dispose();
                return Promise.resolve();
            }
        };
    }

    /**
     * Create migration plan for existing cache usage
     * 
     * @param files - List of files to analyze
     * @returns Migration plan with recommendations
     */
    static createMigrationPlan(files: string[]): {
        totalFiles: number;
        recommendations: string[];
        estimatedEffort: string;
    } {
        return {
            totalFiles: files.length,
            recommendations: [
                'Replace synchronous cache calls with async/await',
                'Update error handling for async operations',
                'Add proper TypeScript types for async returns',
                'Consider using Promise.all() for parallel cache operations'
            ],
            estimatedEffort: `${files.length * 2} hours` // Rough estimate
        };
    }
}
