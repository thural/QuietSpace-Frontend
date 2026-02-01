/**
 * Data Service Module - Base Data Service Implementation
 * 
 * Clean implementation following Single Responsibility Principle.
 * Features extend this base class to implement feature-specific data services
 * with intelligent caching, real-time updates, and optimistic updates.
 */

import { useDIContainer } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { Container } from '@/core/di/container/Container';
import type { ICacheProvider } from '@/core/cache';
import type { IWebSocketService } from '@/core/websocket/types';
import { useCustomQuery } from '@/core/hooks/useCustomQuery';
import { useCustomMutation } from '@/core/hooks/useCustomMutation';
import { useCustomInfiniteQuery } from '@/core/hooks/useCustomInfiniteQuery';
import type {
  IBaseDataService as IBaseDataService,
  ICacheConfig,
  WebSocketUpdateStrategy,
  IDataServiceQueryOptions,
  IDataServiceMutationOptions,
  IDataServiceInfiniteQueryOptions,
  IDataRepository,
  IDataState,
  IDataStateManager
} from './interfaces';
import { DataServiceConfig } from './config/DataServiceConfig';
import type {
  ICacheManager,
  IUpdateStrategy,
  IWebSocketManager,
  IQueryExecutor
} from './services';
import {
  CacheManager,
  UpdateStrategy,
  WebSocketManager,
  QueryExecutor,
  DataStateManager
} from './services';

/**
 * Base Data Service
 * 
 * Clean implementation following Single Responsibility Principle.
 * Provides composed services for data coordination:
 * - CacheManager: Handles cache operations
 * - UpdateStrategy: Manages data update strategies
 * - WebSocketManager: Handles WebSocket connections and messages
 * - QueryExecutor: Coordinates query execution
 * 
 * Features extend this class and use the protected services
 * to implement their specific data logic.
 */
export abstract class BaseDataService implements IBaseDataService {
  // Core dependencies
  protected cache: ICacheProvider;
  protected webSocket: IWebSocketService;
  protected container: Container;

  // Composed services following SRP
  protected cacheManager: ICacheManager;
  protected updateStrategy: IUpdateStrategy;
  protected webSocketManager: IWebSocketManager;
  protected queryExecutor: IQueryExecutor;
  protected stateManager: IDataStateManager;

  // Centralized configuration
  protected readonly CACHE_CONFIG: ICacheConfig = DataServiceConfig.CACHE_CONFIG;

  constructor() {
    this.container = useDIContainer();
    this.cache = this.container.get<ICacheProvider>(TYPES.CACHE_SERVICE);
    this.webSocket = this.container.get<IWebSocketService>(TYPES.WEBSOCKET_SERVICE);

    // Initialize composed services
    this.cacheManager = new CacheManager(this.cache);
    this.updateStrategy = new UpdateStrategy();
    this.webSocketManager = new WebSocketManager(this.webSocket, this.updateStrategy);
    this.queryExecutor = new QueryExecutor();
    this.stateManager = new DataStateManager();
  }

  /**
   * Execute a query with intelligent caching and WebSocket integration
   * 
   * @param key Cache key for the query
   * @param fetcher Function to fetch data
   * @param options Query options including cache strategy and WebSocket topics
   * @returns Query result
   */
  protected executeQuery<T>(
    key: string | string[],
    fetcher: () => Promise<T>,
    options: IDataServiceQueryOptions<T> = {}
  ) {
    const {
      cacheStrategy = 'USER_CONTENT',
      websocketTopics = [],
      updateStrategy = 'merge',
      ...queryOptions
    } = options;

    const cacheConfig = this.CACHE_CONFIG[cacheStrategy];

    // Set up WebSocket listeners for real-time updates
    this.setupWebSocketListeners(key, websocketTopics, updateStrategy);

    // Execute query with optimal cache configuration
    return useCustomQuery<T>(key, fetcher, {
      ...cacheConfig,
      ...queryOptions,
    });
  }

  /**
   * Execute a mutation with optimistic updates and cache coordination
   * 
   * @param fetcher Function to perform the mutation
   * @param options Mutation options including invalidation and WebSocket events
   * @returns Mutation result
   */
  protected executeMutation<TData, TError, TVariables>(
    fetcher: (variables: TVariables) => Promise<TData>,
    options: IDataServiceMutationOptions<TData, TError, TVariables> = {}
  ) {
    const {
      invalidateQueries = [],
      optimisticUpdate,
      websocketEvents = [],
      ...mutationOptions
    } = options;

    return useCustomMutation<TData, TError, TVariables>(fetcher, {
      ...mutationOptions,
      invalidateQueries,
      optimisticUpdate: optimisticUpdate ? (cache, variables) => {
        return this.performOptimisticUpdate(cache, variables);
      } : undefined,
      cacheUpdate: (cache, data, variables) => {
        this.updateCacheAfterMutation(cache, data, variables);
      },
      onSuccess: (data, variables) => {
        this.emitWebSocketEvents(websocketEvents, data, variables);
        mutationOptions.onSuccess?.(data, variables);
      },
    });
  }

  /**
   * Execute infinite query with page-based caching
   * 
   * @param key Cache key for the infinite query
   * @param fetcher Function to fetch page data
   * @param options Infinite query options
   * @returns Infinite query result
   */
  protected executeInfiniteQuery<T>(
    key: string | string[],
    fetcher: (pageParam: number) => Promise<{ data: T[]; hasNextPage: boolean; hasPreviousPage?: boolean }>,
    options: IDataServiceInfiniteQueryOptions<T> = {}
  ) {
    const {
      cacheStrategy = 'USER_CONTENT',
      websocketTopics = [],
      ...infiniteOptions
    } = options;

    const cacheConfig = this.CACHE_CONFIG[cacheStrategy];

    // Set up WebSocket listeners for paginated data
    this.setupWebSocketListeners(key, websocketTopics, 'merge');

    return useCustomInfiniteQuery<T>(key, fetcher, {
      ...cacheConfig,
      ...infiniteOptions,
    });
  }

  /**
   * Set up WebSocket listeners for real-time cache updates
   * Delegates to WebSocketManager service
   */
  protected setupWebSocketListeners(
    queryKey: string | string[],
    topics: string[],
    updateStrategy: WebSocketUpdateStrategy
  ) {
    const cacheKey = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;

    this.webSocketManager.setupListeners(
      cacheKey,
      topics,
      updateStrategy,
      this.cacheManager,
      this.CACHE_CONFIG
    );
  }

  /**
   * Handle WebSocket message and update cache accordingly
   * Delegates to WebSocketManager service
   */
  protected handleWebSocketUpdate(
    cacheKey: string,
    message: any,
    updateStrategy: WebSocketUpdateStrategy
  ) {
    this.webSocketManager.handleMessage(
      cacheKey,
      message,
      updateStrategy,
      this.cacheManager,
      this.CACHE_CONFIG
    );
  }

  /**
   * Perform optimistic update before mutation completes
   * Override in subclasses for specific optimistic update logic
   */
  protected performOptimisticUpdate(cache: ICacheProvider, variables: any): (() => void) | void {
    // Override in subclasses for specific optimistic update logic
    return undefined;
  }

  /**
   * Update cache after successful mutation
   * Override in subclasses for specific post-mutation cache updates
   */
  protected updateCacheAfterMutation(cache: ICacheProvider, data: any, variables: any) {
    // Override in subclasses for specific post-mutation cache updates
  }

  /**
   * Emit WebSocket events after successful mutation
   * Override in subclasses for specific WebSocket event logic
   */
  protected emitWebSocketEvents(events: string[], data: any, variables: any) {
    events.forEach(event => {
      this.webSocket.send({
        type: event,
        data: { ...data, variables },
        timestamp: Date.now(),
      });
    });
  }

  /**
   * Invalidate related queries when data changes
   * Override in subclasses to define related query invalidation logic
   */
  protected invalidateRelatedQueries(cacheKey: string, newData: any) {
    // Override in subclasses to define related query invalidation logic
  }

  /**
   * Store unsubscribe function for cleanup
   * Delegates to WebSocketManager service
   */
  public storeUnsubscribeFunction(cacheKey: string, topic: string, unsubscribe: () => void) {
    this.webSocketManager.storeUnsubscribeFunction(cacheKey, topic, unsubscribe);
  }

  /**
   * Clean up WebSocket listeners
   * Delegates to WebSocketManager service
   */
  protected cleanupWebSocketListeners(cacheKey: string, topics: string[]) {
    this.webSocketManager.cleanup(cacheKey, topics);
  }

  /**
   * Manually invalidate cache entries
   * Delegates to CacheManager service
   */
  protected invalidateCache(key: string | string[]) {
    const cacheKey = Array.isArray(key) ? key.join(':') : key;
    this.cacheManager.invalidate(cacheKey);
  }

  /**
   * Manually update cache entries
   * Delegates to CacheManager service
   */
  protected updateCache<T>(key: string | string[], data: T, ttl?: number) {
    const cacheKey = Array.isArray(key) ? key.join(':') : key;
    const defaultTtl = this.CACHE_CONFIG.USER_CONTENT.cacheTime;
    this.cacheManager.set(cacheKey, data, ttl || defaultTtl);
  }

  /**
   * Get cached data for a specific key
   * Delegates to CacheManager service
   */
  protected getCachedData<T>(key: string | string[]): T | undefined {
    const cacheKey = Array.isArray(key) ? key.join(':') : key;
    return this.cacheManager.get<T>(cacheKey);
  }

  /**
   * Check if cached data is stale
   * Delegates to CacheManager service
   */
  protected isDataStale(key: string | string[], staleTime?: number): boolean {
    const cacheKey = Array.isArray(key) ? key.join(':') : key;
    const threshold = staleTime || this.CACHE_CONFIG.USER_CONTENT.staleTime;
    return this.cacheManager.isStale(cacheKey, threshold);
  }

  /**
   * Generate cache key from parameters
   * Delegates to CacheManager service
   */
  protected generateCacheKey(base: string, params: Record<string, any> = {}): string {
    return this.cacheManager.generateKey(base, params);
  }

  /**
   * Get cache statistics for monitoring
   */
  getCacheStats(): any {
    return this.cacheManager.getStats();
  }

  /**
   * Get current data state
   */
  getDataState(): IDataState {
    return this.stateManager.getState();
  }

  /**
   * Get data state manager for advanced state operations
   */
  getStateManager(): IDataStateManager {
    return this.stateManager;
  }

  /**
   * Clean up all resources when data service is destroyed
   */
  destroy() {
    // Clean up all WebSocket listeners
    // Individual cleanup should be handled by specific data services
  }
}
