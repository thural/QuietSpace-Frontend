import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../base/BaseClassComponent';

/**
 * Configuration options for withData HOC
 */
export interface IWithDataOptions<T> {
    fetchFn: () => Promise<T>;
    initialValue?: T;
    dependencies?: any[];
    retryCount?: number;
    retryDelay?: number;
}

/**
 * Props injected by withData HOC
 */
export interface IWithDataProps<T> extends IBaseComponentProps {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

/**
 * State for withData HOC
 */
interface IWithDataState<T> extends IBaseComponentState {
    data: T | null;
    loading: boolean;
    error: Error | null;
    retryAttempt: number;
}

/**
 * Higher-order component that provides data fetching functionality
 * 
 * Provides enterprise-grade data fetching with retry logic, error handling,
 * and loading states while maintaining BaseClassComponent patterns.
 * 
 * @param options - Configuration options for data fetching
 * @returns A higher-order component that injects data props
 */
export function withData<T, P extends IBaseComponentProps>(
    options: IWithDataOptions<T>
) {
    return (WrappedComponent: React.ComponentType<P & IWithDataProps<T>>) => {
        return class WithData extends BaseClassComponent<P, IWithDataState<T>> {
            private retryTimeout: NodeJS.Timeout | null = null;

            protected override getInitialState(): Partial<IWithDataState<T>> {
                return {
                    data: options.initialValue || null,
                    loading: false,
                    error: null,
                    retryAttempt: 0
                };
            }

            protected override onMount(): void {
                this.fetchData();
            }

            protected override onUpdate(prevProps: P, prevState: IWithDataState<T>): void {
                // Refetch if dependencies change
                if (options.dependencies) {
                    const hasDependencyChanged = options.dependencies.some((dep, index) => {
                        return prevProps[dep as keyof P] !== this.props[dep as keyof P];
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
                const { retryCount = 3, retryDelay = 1000 } = options;
                const { retryAttempt } = this.state;

                try {
                    this.safeSetState({ loading: true, error: null });
                    
                    const data = await options.fetchFn();
                    this.safeSetState({ 
                        data, 
                        loading: false, 
                        error: null, 
                        retryAttempt: 0 
                    });
                } catch (error) {
                    console.error('Data fetch error:', error);
                    
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

            protected override renderContent(): React.ReactNode {
                const { data, loading, error } = this.state;
                const dataProps: IWithDataProps<T> = {
                    data,
                    loading,
                    error,
                    refetch: this.handleRefetch
                };

                return <WrappedComponent {...this.props} {...dataProps} />;
            }
        };
    };
}

export default withData;
