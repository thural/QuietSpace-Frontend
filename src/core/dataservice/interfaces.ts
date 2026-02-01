/**
 * Data Service Module - Public Interfaces
 * 
 * Following Black Box Module pattern with clean public API
 * and hidden implementation details.
 */

import type { ICacheProvider } from '@/core/cache';
import type { IWebSocketService } from '@/core/websocket/types';
import type { QueryOptions } from '@/core/hooks/useCustomQuery';
import type { MutationOptions } from '@/core/hooks/useCustomMutation';
import type { InfiniteQueryOptions } from '@/core/hooks/useCustomInfiniteQuery';

/**
 * Data state interface for tracking operation status
 */
export interface IDataState {
  /**
   * Whether the data is currently being loaded
   */
  isLoading: boolean;

  /**
   * Whether the data is currently being fetched (first load)
   */
  isFetching: boolean;

  /**
   * Whether there was an error during the last operation
   */
  isError: boolean;

  /**
   * Whether the data was successfully loaded
   */
  isSuccess: boolean;

  /**
   * Error information if isError is true
   */
  error: Error | null;

  /**
   * Timestamp of the last data update
   */
  lastUpdated: number | null;

  /**
   * Number of times the data has been refetched
   */
  refetchCount: number;
}

/**
 * Extended data state with additional metadata
 */
export interface IDataStateWithMetadata<T = any> extends IDataState {
  /**
   * The actual data payload
   */
  data: T | null;

  /**
   * Additional metadata about the operation
   */
  metadata?: {
    source: 'cache' | 'network' | 'websocket';
    cacheHit: boolean;
    requestDuration: number;
    retryCount: number;
  };
}

/**
 * Data state manager interface for state operations
 */
export interface IDataStateManager {
  /**
   * Get current data state
   */
  getState(): IDataState;

  /**
   * Get data state with data payload
   */
  getStateWithData<T>(): IDataStateWithMetadata<T>;

  /**
   * Set loading state
   */
  setLoading(isFetching?: boolean): void;

  /**
   * Set success state with data
   */
  setSuccess<T>(data: T, metadata?: Partial<IDataStateWithMetadata<T>['metadata']>): void;

  /**
   * Set error state
   */
  setError(error: Error): void;

  /**
   * Reset state to initial
   */
  reset(): void;

  /**
   * Subscribe to state changes
   */
  subscribe(callback: (state: IDataState) => void): () => void;
}

/**
 * Base interface for all data services
 */
export interface IBaseDataService {
  /**
   * Get cache statistics for monitoring
   */
  getCacheStats(): any;

  /**
   * Get current data state
   */
  getDataState(): IDataState;

  /**
   * Get data state manager for advanced state operations
   */
  getStateManager(): IDataStateManager;

  /**
   * Clean up resources when data service is destroyed
   */
  destroy(): void;
}

/**
 * Cache configuration strategies
 */
export interface ICacheConfig {
  REALTIME: {
    staleTime: number;
    cacheTime: number;
    refetchInterval: number;
  };
  USER_CONTENT: {
    staleTime: number;
    cacheTime: number;
    refetchInterval: number;
  };
  STATIC: {
    staleTime: number;
    cacheTime: number;
    refetchInterval: number | undefined;
  };
  CRITICAL: {
    staleTime: number;
    cacheTime: number;
    refetchInterval: number;
  };
}

/**
 * WebSocket update strategies
 */
export type WebSocketUpdateStrategy = 'merge' | 'replace' | 'append' | 'prepend';

/**
 * Extended query options with data service features
 */
export interface IDataServiceQueryOptions<T> extends QueryOptions<T> {
  cacheStrategy?: keyof ICacheConfig;
  websocketTopics?: string[];
  updateStrategy?: WebSocketUpdateStrategy;
}

/**
 * Extended mutation options with data service features
 */
export interface IDataServiceMutationOptions<TData, TError, TVariables> extends MutationOptions<TData, TError, TVariables> {
  invalidateQueries?: string[];
  optimisticUpdate?: (cache: ICacheProvider, variables: TVariables) => (() => void) | void;
  websocketEvents?: string[];
}

/**
 * Extended infinite query options with data service features
 */
export interface IDataServiceInfiniteQueryOptions<T> extends InfiniteQueryOptions<T> {
  cacheStrategy?: keyof ICacheConfig;
  websocketTopics?: string[];
}

/**
 * Data service factory options
 */
export interface IDataServiceFactoryOptions {
  cache?: ICacheProvider;
  webSocket?: IWebSocketService;
  customCacheConfig?: Partial<ICacheConfig>;
}

/**
 * Repository interface for data service implementations
 */
export interface IDataRepository {
  // Base repository methods - to be extended by specific repositories
  getData?(options: any): Promise<any>;
  createData?(data: any): Promise<any>;
  updateData?(id: string, data: any): Promise<any>;
  deleteData?(id: string): Promise<boolean>;
}

/**
 * Data service statistics
 */
export interface IDataServiceStats {
  cache: any;
  webSocket: {
    connected: boolean;
    subscriptions: number;
    topics: string[];
  };
  performance: {
    averageResponseTime: number;
    requestCount: number;
    errorRate: number;
  };
}
