import { PureComponent, ReactNode, ErrorInfo } from 'react';
import { Container } from '@/core/di';

/**
 * Base interface for all class component props
 */
export interface IBaseComponentProps {
  className?: string;
  testId?: string;
  children?: ReactNode;
}

/**
 * Base interface for all class component state
 */
export interface IBaseComponentState {
  hasError?: boolean;
  error?: Error | null;
  errorInfo?: ErrorInfo | null;
  isMounted?: boolean;
}

/**
 * Base class component with common functionality
 * Provides error handling, lifecycle management, and DI integration
 */
export abstract class BaseClassComponent<
  P extends IBaseComponentProps = IBaseComponentProps,
  S extends IBaseComponentState = IBaseComponentState
> extends PureComponent<P, S> {
  protected isDestroyed: boolean = false;
  protected subscriptions: Array<() => void> = [];
  protected timers: Array<number | NodeJS.Timeout> = [];

  constructor(props: P) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isMounted: false,
      ...this.getInitialState()
    } as S;
  }

  /**
   * Override to provide initial state specific to component
   */
  protected getInitialState(): Partial<S> {
    return {};
  }

  /**
   * Override to get DI container if needed
   */
  protected getContainer?(): Container;

  override componentDidMount(): void {
    this.setState({ isMounted: true });
    this.onMount();
  }

  override componentDidUpdate(prevProps: P, prevState: S): void {
    this.onUpdate(prevProps, prevState);
  }

  override componentWillUnmount(): void {
    this.isDestroyed = true;
    this.setState({ isMounted: false });
    this.cleanup();
    this.onUnmount();
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`${this.constructor.name} error:`, { error, errorInfo });
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
    this.onError(error, errorInfo);
  }

  /**
   * Override to implement mount-specific logic
   */
  protected onMount(): void {
    // Override in subclasses
  }

  /**
   * Override to implement update-specific logic
   */
  protected onUpdate(_prevProps: P, _prevState: S): void {
    // Override in subclasses
  }

  /**
   * Override to implement unmount-specific logic
   */
  protected onUnmount(): void {
    // Override in subclasses
  }

  /**
   * Override to implement error-specific logic
   */
  protected onError(_error: Error, _errorInfo: ErrorInfo): void {
    // Override in subclasses
  }

  /**
   * Safe setState that checks if component is mounted
   */
  protected safeSetState<K extends keyof S>(
    state: ((prevState: Readonly<S>, props: Readonly<P>) => Pick<S, K> | S | null) | Pick<S, K> | S | null,
    callback?: () => void
  ): void {
    if (!this.isDestroyed && this.state.isMounted) {
      this.setState(state, callback);
    }
  }

  /**
   * Add subscription to cleanup list
   */
  protected addSubscription(unsubscribe: () => void): void {
    this.subscriptions.push(unsubscribe);
  }

  /**
   * Add timer to cleanup list
   */
  protected addTimer(timer: number | NodeJS.Timeout): void {
    this.timers.push(timer);
  }

  /**
   * Cleanup all subscriptions and timers
   */
  protected cleanup(): void {
    // Cleanup subscriptions
    this.subscriptions.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        console.error('Error cleaning up subscription:', error);
      }
    });
    this.subscriptions = [];

    // Cleanup timers
    this.timers.forEach(timer => {
      try {
        clearTimeout(timer);
      } catch (error) {
        console.error('Error cleaning up timer:', error);
      }
    });
    this.timers = [];
  }

  /**
   * Render error fallback
   */
  protected renderError(): ReactNode {
    const { error, errorInfo } = this.state;

    return (
      <div className="error-boundary-fallback" data-testid="error-fallback">
        <h2>Something went wrong</h2>
        <details>
          <summary>Error details</summary>
          <pre>{error?.message}</pre>
          {process.env.NODE_ENV === 'development' && (
            <pre>{errorInfo?.componentStack}</pre>
          )}
        </details>
        <button onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}>
          Try Again
        </button>
      </div>
    );
  }

  /**
   * Main render method - override in subclasses
   */
  protected renderContent(): ReactNode {
    return this.props.children || null;
  }

  override render(): ReactNode {
    const { hasError } = this.state;
    const { className, testId } = this.props;

    if (hasError) {
      return this.renderError();
    }

    return (
      <div
        className={className}
        data-testid={testId}
        data-component={this.constructor.name}
      >
        {this.renderContent()}
      </div>
    );
  }
}

/**
 * Container component class with DI integration
 */
export abstract class ContainerClassComponent<
  P extends IBaseComponentProps = IBaseComponentProps,
  S extends IBaseComponentState = IBaseComponentState
> extends BaseClassComponent<P, S> {
  protected abstract container: Container;

  protected override getContainer(): Container {
    return this.container;
  }

  /**
   * Get service from DI container
   */
  protected getService<T>(token: string | symbol): T {
    return this.container.get<T>(token);
  }

  /**
   * Get service from DI container with fallback
   */
  protected getServiceSafe<T>(token: string | symbol, fallback: T): T {
    try {
      return this.container.get<T>(token as any);
    } catch {
      return fallback;
    }
  }
}

/**
 * Query-aware component class with custom query system integration
 */
export abstract class QueryClassComponent<
  P extends IBaseComponentProps = IBaseComponentProps,
  S extends IBaseComponentState = IBaseComponentState
> extends ContainerClassComponent<P, S> {
  protected queryClient: any;
  protected queryCache: any;
  protected performanceMonitor: any;

  protected override getInitialState(): Partial<S> {
    return {
      ...super.getInitialState(),
      queryState: {
        isLoading: false,
        isFetching: false,
        error: null,
        data: null
      }
    } as Partial<S>;
  }

  protected override onMount(): void {
    super.onMount();
    this.initializeQuerySystem();
  }

  /**
   * Initialize custom query system integration
   */
  protected initializeQuerySystem(): void {
    try {
      // Get query client from DI container
      this.queryClient = this.getService('QueryClient');
      this.queryCache = this.getService('QueryCache');
      this.performanceMonitor = this.getService('PerformanceMonitor');
    } catch (error) {
      console.warn('Query system not available:', error);
    }
  }

  /**
   * Get query data from cache
   */
  protected getQueryData<T>(queryKey: string | string[]): T | null {
    if (!this.queryCache) return null;

    const key = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;
    return this.queryCache.get(key);
  }

  /**
   * Set query data in cache
   */
  protected setQueryData<T>(queryKey: string | string[], data: T, options?: any): void {
    if (!this.queryCache) return;

    const key = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;
    this.queryCache.set(key, data, options);
  }

  /**
   * Invalidate query cache
   */
  protected invalidateQuery(queryKey: string | string[]): void {
    if (!this.queryCache) return;

    const key = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;
    this.queryCache.invalidate(key);
  }

  /**
   * Subscribe to query changes
   */
  protected subscribeToQuery(queryKey: string | string[], callback: (data: any) => void): (() => void) | null {
    if (!this.queryCache) return null;

    const key = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;
    return this.queryCache.subscribe(key, callback) || (() => { });
  }

  /**
   * Execute query with performance tracking
   */
  protected async executeQuery<T>(
    queryKey: string | string[],
    fetcher: () => Promise<T>,
    options?: any
  ): Promise<T> {
    if (!this.queryClient || !this.performanceMonitor) {
      return fetcher();
    }

    const key = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;
    const trackingId = this.performanceMonitor.startQuery(key);

    try {
      this.safeSetState({
        queryState: {
          isLoading: true,
          isFetching: true,
          error: null,
          data: null
        }
      } as unknown as Pick<S, keyof S>);

      // Check cache first
      if (options?.cache !== false) {
        const cached = this.getQueryData<T>(queryKey);
        if (cached && this.isCacheValid(cached, options)) {
          this.safeSetState({
            queryState: {
              isLoading: false,
              isFetching: false,
              error: null,
              data: cached
            }
          } as unknown as Pick<S, keyof S>);

          this.performanceMonitor.endQuery(trackingId, true, undefined, 'cache_hit');
          return cached;
        }
      }

      // Fetch data
      const result = await fetcher();

      // Cache result
      if (options?.cache !== false) {
        this.setQueryData(queryKey, result, {
          staleTime: options?.staleTime || 5 * 60 * 1000,
          cacheTime: options?.cacheTime || 10 * 60 * 1000
        });
      }

      this.safeSetState({
        queryState: {
          isLoading: false,
          isFetching: false,
          error: null,
          data: result
        }
      } as unknown as Pick<S, keyof S>);

      this.performanceMonitor.endQuery(trackingId, true);
      return result;

    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));

      this.safeSetState({
        queryState: {
          isLoading: false,
          isFetching: false,
          error: errorObj,
          data: null
        }
      } as unknown as Pick<S, keyof S>);

      this.performanceMonitor.endQuery(trackingId, false, errorObj);
      throw errorObj;
    }
  }

  /**
   * Check if cache entry is valid
   */
  private isCacheValid(cached: any, options?: any): boolean {
    if (!cached || !cached.timestamp) return false;

    const now = Date.now();
    const staleTime = options?.staleTime || 5 * 60 * 1000;

    return now < cached.timestamp + staleTime;
  }
}

export default BaseClassComponent;
