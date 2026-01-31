/**
 * Data Service Module - Base Data Service Implementation
 * 
 * Clean implementation following Single Responsibility Principle.
 * Features extend this base class to implement feature-specific data services
 * with intelligent caching, real-time updates, and optimistic updates.
 */

import { useDIContainer } from '../di/index.js';
import { DataServiceConfig } from './config/DataServiceConfig.js';
import {
  CacheManager,
  DataStateManager,
  QueryExecutor,
  UpdateStrategy,
  WebSocketManager
} from './services/index.js';

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
export class BaseDataService {
  // Core dependencies
  /** @type {Object} */
  #cache;
  /** @type {Object} */
  #webSocket;
  /** @type {Object} */
  #container;

  // Composed services following SRP
  /** @type {Object} */
  #cacheManager;
  /** @type {Object} */
  #updateStrategy;
  /** @type {Object} */
  #webSocketManager;
  /** @type {Object} */
  #queryExecutor;
  /** @type {Object} */
  #stateManager;

  // Centralized configuration
  /** @type {Object} */
  #CACHE_CONFIG = DataServiceConfig.CACHE_CONFIG;

  constructor() {
    this.#container = useDIContainer();
    this.#cache = this.#container.get('CACHE_SERVICE');
    this.#webSocket = this.#container.get('WEBSOCKET_SERVICE');

    // Initialize composed services
    this.#cacheManager = new CacheManager(this.#cache);
    this.#updateStrategy = new UpdateStrategy();
    this.#webSocketManager = new WebSocketManager(this.#webSocket, this.#updateStrategy);
    this.#queryExecutor = new QueryExecutor();
    this.#stateManager = new DataStateManager();
  }

  /**
   * Execute a query with intelligent caching and WebSocket integration
   * 
   * @param {string|string[]} key - Cache key for the query
   * @param {function} fetcher - Function to fetch data
   * @param {Object} [options] - Query options including cache strategy and WebSocket topics
   * @returns {Object} Query result
   */
  executeQuery(key, fetcher, options = {}) {
    const {
      cacheStrategy = 'USER_CONTENT',
      websocketTopics = [],
      updateStrategy = 'merge',
      ...queryOptions
    } = options;

    return this.#queryExecutor.execute(key, fetcher, {
      ...queryOptions,
      cacheConfig: this.#CACHE_CONFIG[cacheStrategy],
      websocketTopics,
      updateStrategy
    });
  }

  /**
   * Execute a mutation with optimistic updates and cache invalidation
   * 
   * @param {function} mutator - Mutation function
   * @param {Object} [options] - Mutation options
   * @returns {Object} Mutation result
   */
  executeMutation(mutator, options = {}) {
    const {
      invalidateQueries = [],
      optimisticUpdate,
      websocketEvents = [],
      ...mutationOptions
    } = options;

    return this.#queryExecutor.mutate(mutator, {
      ...mutationOptions,
      invalidateQueries,
      optimisticUpdate: optimisticUpdate ?
        () => optimisticUpdate(this.#cacheManager) : undefined,
      websocketEvents
    });
  }

  /**
   * Execute an infinite query with pagination support
   * 
   * @param {string|string[]} key - Cache key for the query
   * @param {function} fetcher - Function to fetch data
   * @param {function} getNextPageParam - Function to get next page parameter
   * @param {Object} [options] - Query options
   * @returns {Object} Infinite query result
   */
  executeInfiniteQuery(key, fetcher, getNextPageParam, options = {}) {
    const {
      cacheStrategy = 'USER_CONTENT',
      websocketTopics = [],
      ...queryOptions
    } = options;

    return this.#queryExecutor.executeInfinite(key, fetcher, getNextPageParam, {
      ...queryOptions,
      cacheConfig: this.#CACHE_CONFIG[cacheStrategy],
      websocketTopics
    });
  }

  /**
   * Get cache statistics for monitoring
   * 
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return this.#cacheManager.getStats();
  }

  /**
   * Get current data state
   * 
   * @returns {Object} Current data state
   */
  getDataState() {
    return this.#stateManager.getState();
  }

  /**
   * Get data state manager for advanced state operations
   * 
   * @returns {Object} Data state manager
   */
  getStateManager() {
    return this.#stateManager;
  }

  /**
   * Clean up resources when data service is destroyed
   */
  destroy() {
    this.#webSocketManager.destroy();
    this.#cacheManager.destroy();
    this.#stateManager.destroy();
  }

  // Protected getters for extending classes
  /** @protected */
  get cache() {
    return this.#cache;
  }

  /** @protected */
  get webSocket() {
    return this.#webSocket;
  }

  /** @protected */
  get container() {
    return this.#container;
  }

  /** @protected */
  get cacheManager() {
    return this.#cacheManager;
  }

  /** @protected */
  get updateStrategy() {
    return this.#updateStrategy;
  }

  /** @protected */
  get webSocketManager() {
    return this.#webSocketManager;
  }

  /** @protected */
  get queryExecutor() {
    return this.#queryExecutor;
  }

  /** @protected */
  get stateManager() {
    return this.#stateManager;
  }

  /** @protected */
  get CACHE_CONFIG() {
    return this.#CACHE_CONFIG;
  }
}
