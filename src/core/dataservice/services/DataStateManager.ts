/**
 * Data Service Module - Data State Manager Implementation
 * 
 * Provides state management capabilities for data services
 * with loading, error, and success state tracking.
 */

import type { IDataState, IDataStateWithMetadata, IDataStateManager } from '../interfaces';

/**
 * Data State Manager Implementation
 * 
 * Manages data service state with subscription support
 * and metadata tracking for operations.
 */
export class DataStateManager implements IDataStateManager {
  private state: IDataState;
  private dataState: IDataStateWithMetadata;
  private subscribers: Set<(state: IDataState) => void> = new Set();

  constructor(initialState: Partial<IDataState> = {}) {
    this.state = {
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: false,
      error: null,
      lastUpdated: null,
      refetchCount: 0,
      ...initialState
    };

    this.dataState = {
      ...this.state,
      data: null,
      metadata: {
        source: 'network',
        cacheHit: false,
        requestDuration: 0,
        retryCount: 0
      }
    };
  }

  /**
   * Get current data state
   */
  getState(): IDataState {
    return { ...this.state };
  }

  /**
   * Get data state with data payload
   */
  getStateWithData<T>(): IDataStateWithMetadata<T> {
    return { ...this.dataState } as IDataStateWithMetadata<T>;
  }

  /**
   * Set loading state
   */
  setLoading(isFetching: boolean = false): void {
    this.state = {
      ...this.state,
      isLoading: true,
      isFetching,
      isError: false,
      isSuccess: false,
      error: null
    };

    this.dataState = {
      ...this.dataState,
      ...this.state
    };

    this.notifySubscribers();
  }

  /**
   * Set success state with data
   */
  setSuccess<T>(data: T, metadata?: Partial<IDataStateWithMetadata<T>['metadata']>): void {
    const now = Date.now();
    
    this.state = {
      ...this.state,
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
      lastUpdated: now,
      refetchCount: this.state.refetchCount + (this.state.lastUpdated ? 1 : 0)
    };

    this.dataState = {
      ...this.state,
      data,
      metadata: {
        ...this.dataState.metadata,
        ...metadata,
        source: metadata?.source || 'network',
        cacheHit: metadata?.cacheHit || false,
        requestDuration: metadata?.requestDuration || 0,
        retryCount: metadata?.retryCount || 0
      }
    };

    this.notifySubscribers();
  }

  /**
   * Set error state
   */
  setError(error: Error): void {
    this.state = {
      ...this.state,
      isLoading: false,
      isFetching: false,
      isError: true,
      isSuccess: false,
      error,
      lastUpdated: Date.now()
    };

    this.dataState = {
      ...this.dataState,
      ...this.state,
      data: null
    };

    this.notifySubscribers();
  }

  /**
   * Reset state to initial
   */
  reset(): void {
    this.state = {
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: false,
      error: null,
      lastUpdated: null,
      refetchCount: 0
    };

    this.dataState = {
      ...this.state,
      data: null,
      metadata: {
        source: 'network',
        cacheHit: false,
        requestDuration: 0,
        retryCount: 0
      }
    };

    this.notifySubscribers();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback: (state: IDataState) => void): () => void {
    this.subscribers.add(callback);
    
    // Immediately call with current state
    callback(this.getState());
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Notify all subscribers of state changes
   */
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback(this.getState());
      } catch (error) {
        console.error('Error in state subscriber callback:', error);
      }
    });
  }

  /**
   * Get derived state helpers
   */
  get helpers() {
    return {
      /**
       * Check if data is loading (initial load)
       */
      isLoading: () => this.state.isLoading,
      
      /**
       * Check if data is being fetched (refresh)
       */
      isFetching: () => this.state.isFetching,
      
      /**
       * Check if there's an error
       */
      isError: () => this.state.isError,
      
      /**
       * Check if data was successfully loaded
       */
      isSuccess: () => this.state.isSuccess,
      
      /**
       * Get error message
       */
      getError: () => this.state.error?.message || null,
      
      /**
       * Get last updated timestamp
       */
      getLastUpdated: () => this.state.lastUpdated,
      
      /**
       * Get refetch count
       */
      getRefetchCount: () => this.state.refetchCount,
      
      /**
       * Check if data is stale (older than specified milliseconds)
       */
      isStale: (maxAge: number) => {
        if (!this.state.lastUpdated) return true;
        return Date.now() - this.state.lastUpdated > maxAge;
      }
    };
  }
}
