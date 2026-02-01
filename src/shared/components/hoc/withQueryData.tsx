import { ReactNode } from 'react';
import { BaseClassComponent, IBaseComponentProps } from '../base/BaseClassComponent';

/**
 * Props for withQueryData HOC
 */
export interface IWithQueryDataProps {
  queryKey: string | string[];
  fetcher: () => Promise<any>;
  queryOptions?: {
    staleTime?: number;
    cacheTime?: number;
    enabled?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
  };
}

/**
 * State for withQueryData HOC
 */
export interface IWithQueryDataState {
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  data: any;
}

/**
 * Higher-order component that provides query data functionality
 * Wraps a component with custom query system integration
 */
export function withQueryData<P extends IBaseComponentProps>(
  WrappedComponent: React.ComponentType<P & { queryData: any }>
) {
  return class WithQueryData extends BaseClassComponent<
    P & IWithQueryDataProps,
    IWithQueryDataState
  > {
    private queryClient: any;
    private queryCache: any;
    private performanceMonitor: any;

    protected override getInitialState(): Partial<IWithQueryDataState> {
      return {
        isLoading: false,
        isFetching: false,
        error: null,
        data: null
      };
    }

    protected override onMount(): void {
      super.onMount();
      this.initializeQuerySystem();
      if (this.props.queryOptions?.enabled !== false) {
        this.executeQuery();
      }
    }

    protected override onUpdate(prevProps: P & IWithQueryDataProps): void {
      const queryKeyChanged = JSON.stringify(prevProps.queryKey) !== JSON.stringify(this.props.queryKey);
      const enabledChanged = prevProps.queryOptions?.enabled !== this.props.queryOptions?.enabled;

      if (queryKeyChanged || enabledChanged) {
        if (this.props.queryOptions?.enabled !== false) {
          this.executeQuery();
        }
      }
    }

    private initializeQuerySystem(): void {
      try {
        // Try to get query system from global or context
        this.queryClient = (globalThis as any).queryClient;
        this.queryCache = (globalThis as any).queryCache;
        this.performanceMonitor = (globalThis as any).performanceMonitor;
      } catch (error) {
        console.warn('Query system not available:', error);
      }
    }

    private async executeQuery(): Promise<void> {
      if (!this.props.queryKey || !this.props.fetcher) return;

      const key = Array.isArray(this.props.queryKey) ? this.props.queryKey.join(':') : this.props.queryKey;
      const trackingId = this.performanceMonitor?.startQuery?.(key) || Date.now().toString();

      try {
        this.safeSetState({
          isLoading: true,
          isFetching: true,
          error: null,
          data: null
        } as unknown as Partial<IWithQueryDataState>);

        // Check cache first
        if (this.queryCache && this.props.queryOptions?.cache !== false) {
          const cached = this.queryCache.get(key);
          if (cached && this.isCacheValid(cached, this.props.queryOptions)) {
            this.safeSetState({
              isLoading: false,
              isFetching: false,
              error: null,
              data: cached
            } as unknown as Partial<IWithQueryDataState>);

            this.performanceMonitor?.endQuery?.(trackingId, true, undefined, 'cache_hit');
            return;
          }
        }

        // Fetch data
        const result = await this.props.fetcher();

        // Cache result
        if (this.queryCache && this.props.queryOptions?.cache !== false) {
          this.queryCache.set(key, result, {
            staleTime: this.props.queryOptions?.staleTime || 5 * 60 * 1000,
            cacheTime: this.props.queryOptions?.cacheTime || 10 * 60 * 1000
          });
        }

        this.safeSetState({
          isLoading: false,
          isFetching: false,
          error: null,
          data: result
        } as unknown as Partial<IWithQueryDataState>);

        this.performanceMonitor?.endQuery?.(trackingId, true);
        this.props.queryOptions?.onSuccess?.(result);

      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));

        this.safeSetState({
          isLoading: false,
          isFetching: false,
          error: errorObj,
          data: null
        } as unknown as Partial<IWithQueryDataState>);

        this.performanceMonitor?.endQuery?.(trackingId, false, errorObj);
        this.props.queryOptions?.onError?.(errorObj);
      }
    }

    private isCacheValid(cached: any, options?: any): boolean {
      if (!cached || !cached.timestamp) return false;

      const now = Date.now();
      const staleTime = options?.staleTime || 5 * 60 * 1000;

      return now < cached.timestamp + staleTime;
    }

    private handleRefetch = (): Promise<void> => {
      return this.executeQuery();
    };

    private handleInvalidate = (): void => {
      if (this.props.queryKey && this.queryCache) {
        const key = Array.isArray(this.props.queryKey) ? this.props.queryKey.join(':') : this.props.queryKey;
        this.queryCache.invalidate(key);
      }
    };

    protected override renderContent(): ReactNode {
      const { isLoading, isFetching, error, data } = this.state;
      const { queryKey, fetcher, queryOptions, ...restProps } = this.props;

      return (
        <WrappedComponent
          {...(restProps as unknown as P)}
          queryData={{
            data,
            isLoading,
            isFetching,
            error,
            refetch: this.handleRefetch,
            invalidate: this.handleInvalidate
          }}
        />
      );
    }
  };
}

export default withQueryData;
