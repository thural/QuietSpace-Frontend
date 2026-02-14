/**
 * Enterprise Data HOC
 * 
 * Enterprise-grade higher-order component for data fetching.
 * Uses enterprise patterns with proper error handling and retry logic.
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../base/BaseClassComponent';

/**
 * Configuration options for EnterpriseWithData HOC
 */
export interface IEnterpriseWithDataOptions<T> {
    fetchFn: () => Promise<T>;
    initialValue?: T;
    dependencies?: any[];
    retryCount?: number;
    retryDelay?: number;
    cacheKey?: string;
    cacheTimeout?: number;
}

/**
 * Props injected by EnterpriseWithData HOC
 */
export interface IEnterpriseWithDataProps<T> extends IBaseComponentProps {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
    retryCount: number;
    lastUpdated: Date | null;
}

/**
 * State for EnterpriseWithData HOC
 */
interface IEnterpriseWithDataState<T> extends IBaseComponentState {
    data: T | null;
    loading: boolean;
    error: Error | null;
    retryCount: number;
    lastUpdated: Date | null;
}

/**
 * Simple cache interface for data caching
 */
interface DataCache<T> {
    data: T;
    timestamp: Date;
    timeout: number;
}

// Global cache store
const dataCache = new Map<string, DataCache<any>>();

/**
 * EnterpriseWithData - Enterprise data fetching HOC
 * 
 * Provides enterprise-grade data fetching with caching, retry logic,
 * error handling, and performance optimization.
 */
export function EnterpriseWithData<T = any>(
    options: IEnterpriseWithDataOptions<T>
) {
    return (WrappedComponent: React.ComponentType<any>) => {
        return class EnterpriseWithData extends BaseClassComponent<any, IEnterpriseWithDataState<T>> {
            private retryTimeout: number | null = null;
            private isMounted: boolean = false;

            protected override getInitialState(): Partial<IEnterpriseWithDataState<T>> {
                // Check cache first
                const cachedData = this.getCachedData();
                
                return {
                    data: cachedData || options.initialValue || null,
                    loading: !cachedData,
                    error: null,
                    retryCount: 0,
                    lastUpdated: cachedData ? new Date() : null
                };
            }

            protected override onMount(): void {
                this.isMounted = true;
                
                if (!this.state.data) {
                    this.fetchData();
                }
            }

            protected override onUnmount(): void {
                this.isMounted = false;
                
                // Clear any pending retry timeout
                if (this.retryTimeout) {
                    clearTimeout(this.retryTimeout);
                    this.retryTimeout = null;
                }
            }

            /**
             * Get cached data if available and not expired
             */
            private getCachedData = (): T | null => {
                if (!options.cacheKey) return null;

                const cached = dataCache.get(options.cacheKey);
                if (!cached) return null;

                const now = new Date();
                const cacheAge = now.getTime() - cached.timestamp.getTime();
                const timeout = options.cacheTimeout || 300000; // 5 minutes default

                if (cacheAge > timeout) {
                    dataCache.delete(options.cacheKey);
                    return null;
                }

                return cached.data;
            };

            /**
             * Set cached data
             */
            private setCachedData = (data: T): void => {
                if (!options.cacheKey) return;

                dataCache.set(options.cacheKey, {
                    data,
                    timestamp: new Date(),
                    timeout: options.cacheTimeout || 300000
                });
            };

            /**
             * Fetch data with retry logic
             */
            private fetchData = async (): Promise<void> => {
                if (!this.isMounted) return;

                try {
                    this.safeSetState({
                        loading: true,
                        error: null
                    });

                    const data = await options.fetchFn();
                    
                    if (this.isMounted) {
                        // Cache the data
                        this.setCachedData(data);
                        
                        this.safeSetState({
                            data,
                            loading: false,
                            error: null,
                            lastUpdated: new Date()
                        });
                    }

                } catch (error) {
                    if (!this.isMounted) return;

                    const errorObj = error instanceof Error ? error : new Error('Unknown error occurred');
                    
                    if (this.state.retryCount < (options.retryCount || 3)) {
                        // Schedule retry
                        const retryDelay = options.retryDelay || 1000;
                        const nextRetryCount = this.state.retryCount + 1;
                        
                        this.retryTimeout = window.setTimeout(() => {
                            if (this.isMounted) {
                                this.safeSetState({ retryCount: nextRetryCount });
                                this.fetchData();
                            }
                        }, retryDelay * nextRetryCount); // Exponential backoff
                    } else {
                        // Max retries reached
                        this.safeSetState({
                            loading: false,
                            error: errorObj
                        });
                    }
                }
            };

            /**
             * Manual refetch
             */
            private handleRefetch = (): void => {
                // Clear cache to force fresh fetch
                if (options.cacheKey) {
                    dataCache.delete(options.cacheKey);
                }
                
                this.safeSetState({
                    retryCount: 0,
                    error: null
                });
                
                this.fetchData();
            };

            /**
             * Clear cache
             */
            private clearCache = (): void => {
                if (options.cacheKey) {
                    dataCache.delete(options.cacheKey);
                }
            };

            protected override renderContent(): React.ReactNode {
                const { data, loading, error, retryCount, lastUpdated } = this.state;
                
                const injectedProps: IEnterpriseWithDataProps<T> = {
                    data,
                    loading,
                    error,
                    refetch: this.handleRefetch,
                    retryCount,
                    lastUpdated
                };

                return <WrappedComponent {...this.props} {...injectedProps} />;
            }
        };
    };
}

/**
 * Utility function to clear all cached data
 */
export const clearAllDataCache = (): void => {
    dataCache.clear();
};

/**
 * Utility function to clear specific cache key
 */
export const clearDataCache = (key: string): void => {
    dataCache.delete(key);
};

export default EnterpriseWithData;
