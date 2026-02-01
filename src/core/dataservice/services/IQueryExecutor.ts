/**
 * Query Executor Interface
 *
 * Single responsibility: Query execution and coordination
 */

import type { ICacheManager } from './ICacheManager';
import type { IWebSocketManager } from './IWebSocketManager';

export interface IQueryExecutor {
  /**
   * Execute a query with intelligent caching and WebSocket integration
   */
  executeQuery<T>(
    key: string | string[],
    fetcher: () => Promise<T>,
    options: any,
    cacheManager: ICacheManager,
    webSocketManager: IWebSocketManager
  ): Promise<T>;

  /**
   * Execute a mutation with optimistic updates
   */
  executeMutation<TData, TError, TVariables>(
    fetcher: (variables: TVariables) => Promise<TData>,
    options: any,
    cacheManager: ICacheManager,
    webSocketManager: IWebSocketManager
  ): Promise<TData>;

  /**
   * Execute infinite query with pagination
   */
  executeInfiniteQuery<T>(
    key: string | string[],
    fetcher: (pageParam: number) => Promise<{ data: T[]; hasNextPage: boolean; hasPreviousPage?: boolean }>,
    options: any,
    cacheManager: ICacheManager,
    webSocketManager: IWebSocketManager
  ): Promise<{ data: T[]; hasNextPage: boolean; hasPreviousPage?: boolean }>;
}
