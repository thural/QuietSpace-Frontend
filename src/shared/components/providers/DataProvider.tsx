import React, { createContext, useContext, useEffect, useState } from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../base/BaseClassComponent';

/**
 * Configuration options for DataProvider
 */
export interface IDataProviderOptions<T> {
    fetchFn: () => Promise<T>;
    initialData?: T;
    dependencies?: any[];
    retryCount?: number;
    retryDelay?: number;
    cacheKey?: string;
    cacheTTL?: number;
}

/**
 * Props for DataProvider component
 */
export interface IDataProviderProps<T> extends IBaseComponentProps {
    children?: (data: T) => React.ReactNode;
    renderLoading?: () => React.ReactNode;
    renderError?: (error: Error) => React.ReactNode;
    renderSuccess?: (data: T) => React.ReactNode;
    fallback?: React.ReactNode;
    options: IDataProviderOptions<T>;
}

/**
 * State for DataProvider
 */
interface IDataProviderState<T> extends IBaseComponentState {
    data: T | null;
    loading: boolean;
    error: Error | null;
    retryAttempt: number;
    lastFetch: number;
}

/**
 * Data context for sharing data state
 */
const DataContext = createContext<{
    data: any;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
} | null>(null);

/**
 * Advanced DataProvider with multiple render props and enterprise features
 * 
 * Provides comprehensive data fetching with caching, retry logic,
 * error boundaries, and multiple rendering options.
 */
export class DataProvider<T> extends BaseClassComponent<IDataProviderProps<T>, IDataProviderState<T>> {
    private retryTimeout: NodeJS.Timeout | null = null;
    private cache = new Map<string, { data: T; timestamp: number }>();

    protected override getInitialState(): Partial<IDataProviderState<T>> {
        const { initialData, cacheKey } = this.props.options;
        
        // Check cache first
        if (cacheKey && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey)!;
            const now = Date.now();
            const ttl = this.props.options.cacheTTL || 300000; // 5 minutes default
            
            if (now - cached.timestamp < ttl) {
                return {
                    data: cached.data,
                    loading: false,
                    error: null,
                    retryAttempt: 0,
                    lastFetch: cached.timestamp
                };
            }
        }

        return {
            data: initialData || null,
            loading: false,
            error: null,
            retryAttempt: 0,
            lastFetch: 0
        };
    }

    protected override onMount(): void {
        this.fetchData();
    }

    protected override onUpdate(prevProps: IDataProviderProps<T>, prevState: IDataProviderState<T>): void {
        // Refetch if dependencies change
        if (this.props.options.dependencies) {
            const hasDependencyChanged = this.props.options.dependencies.some((dep, index) => {
                return prevProps.options.dependencies?.[index] !== this.props.options.dependencies?.[index];
            });
            
            if (hasDependencyChanged) {
                this.fetchData();
            }
        }
    }

    protected override onUnmount(): void {
        // Cleanup retry timeout
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
            this.retryTimeout = null;
        }
    }

    private fetchData = async (): Promise<void> => {
        const { fetchFn, retryCount = 3, retryDelay = 1000, cacheKey } = this.props.options;
        const { retryAttempt } = this.state;

        try {
            this.safeSetState({ loading: true, error: null });
            
            const data = await fetchFn();
            const now = Date.now();

            // Cache the result
            if (cacheKey) {
                this.cache.set(cacheKey, { data, timestamp: now });
            }

            this.safeSetState({ 
                data, 
                loading: false, 
                error: null, 
                retryAttempt: 0,
                lastFetch: now
            });
        } catch (error) {
            console.error('DataProvider fetch error:', error);
            
            if (retryAttempt < retryCount) {
                // Retry with exponential backoff
                const delay = retryDelay * Math.pow(2, retryAttempt);
                
                this.safeSetState({ 
                    error: error as Error, 
                    loading: false, 
                    retryAttempt: retryAttempt + 1 
                });
                
                this.retryTimeout = setTimeout(() => {
                    this.fetchData();
                }, delay);
            } else {
                // Final retry failed
                this.safeSetState({ 
                    error: error as Error, 
                    loading: false 
                });
            }
        }
    };

    private handleRefetch = (): void => {
        // Reset retry attempt and fetch again
        this.safeSetState({ retryAttempt: 0 });
        this.fetchData();
    };

    private handleRetry = (): void => {
        // Immediate retry
        this.fetchData();
    };

    private clearCache = (): void => {
        const { cacheKey } = this.props.options;
        if (cacheKey) {
            this.cache.delete(cacheKey);
        }
    };

    protected override renderContent(): React.ReactNode {
        const { data, loading, error } = this.state;
        const { 
            children, 
            renderLoading, 
            renderError, 
            renderSuccess, 
            fallback 
        } = this.props;

        const contextValue = {
            data,
            loading,
            error,
            refetch: this.handleRefetch
        };

        // Error state
        if (error) {
            if (renderError) {
                return (
                    <DataContext.Provider value={contextValue}>
                        {renderError(error)}
                    </DataContext.Provider>
                );
            }
            if (fallback) {
                return (
                    <DataContext.Provider value={contextValue}>
                        {fallback}
                    </DataContext.Provider>
                );
            }
            return (
                <DataContext.Provider value={contextValue}>
                    <div className="data-error">
                        <p>Error: {error.message}</p>
                        <button onClick={this.handleRetry}>Retry</button>
                    </div>
                </DataContext.Provider>
            );
        }

        // Loading state
        if (loading) {
            if (renderLoading) {
                return (
                    <DataContext.Provider value={contextValue}>
                        {renderLoading()}
                    </DataContext.Provider>
                );
            }
            return (
                <DataContext.Provider value={contextValue}>
                    <div className="data-loading">Loading...</div>
                </DataContext.Provider>
            );
        }

        // Success state
        if (data) {
            if (renderSuccess) {
                return (
                    <DataContext.Provider value={contextValue}>
                        {renderSuccess(data)}
                    </DataContext.Provider>
                );
            }
            if (children) {
                return (
                    <DataContext.Provider value={contextValue}>
                        {children(data)}
                    </DataContext.Provider>
                );
            }
        }

        // No data
        if (fallback) {
            return (
                <DataContext.Provider value={contextValue}>
                    {fallback}
                </DataContext.Provider>
            );
        }

        return (
            <DataContext.Provider value={contextValue}>
                <div>No data available</div>
            </DataContext.Provider>
        );
    }
}

export default DataProvider;
