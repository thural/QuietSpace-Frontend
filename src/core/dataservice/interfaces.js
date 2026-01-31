/**
 * Data Service Module - Public Interfaces
 * 
 * Following Black Box Module pattern with clean public API
 * and hidden implementation details.
 */

/**
 * Data state interface for tracking operation status
 * @typedef {Object} IDataState
 * @property {boolean} isLoading - Whether the data is currently being loaded
 * @property {boolean} isFetching - Whether the data is currently being fetched (first load)
 * @property {boolean} isError - Whether there was an error during the last operation
 * @property {boolean} isSuccess - Whether the data was successfully loaded
 * @property {Error|null} error - Error information if isError is true
 * @property {number|null} lastUpdated - Timestamp of the last data update
 * @property {number} refetchCount - Number of times the data has been refetched
 */

/**
 * Extended data state with additional metadata
 * @typedef {Object} IDataStateWithMetadata
 * @property {boolean} isLoading - Whether the data is currently being loaded
 * @property {boolean} isFetching - Whether the data is currently being fetched (first load)
 * @property {boolean} isError - Whether there was an error during the last operation
 * @property {boolean} isSuccess - Whether the data was successfully loaded
 * @property {Error|null} error - Error information if isError is true
 * @property {number|null} lastUpdated - Timestamp of the last data update
 * @property {number} refetchCount - Number of times the data has been refetched
 * @property {*} data - The actual data payload
 * @property {Object} [metadata] - Additional metadata about the operation
 * @property {string} metadata.source - Data source (cache, network, websocket)
 * @property {boolean} metadata.cacheHit - Whether data came from cache
 * @property {number} metadata.requestDuration - Duration of the request
 * @property {number} metadata.retryCount - Number of retry attempts
 */

/**
 * Data state manager interface for state operations
 * @typedef {Object} IDataStateManager
 * @property {function} getState - Get current data state
 * @property {function} getStateWithData - Get data state with data payload
 * @property {function} setLoading - Set loading state
 * @property {function} setSuccess - Set success state with data
 * @property {function} setError - Set error state
 * @property {function} reset - Reset state to initial
 * @property {function} subscribe - Subscribe to state changes
 */

/**
 * Base interface for all data services
 * @typedef {Object} IBaseDataService
 * @property {function} getCacheStats - Get cache statistics for monitoring
 * @property {function} getDataState - Get current data state
 * @property {function} getStateManager - Get data state manager for advanced state operations
 * @property {function} destroy - Clean up resources when data service is destroyed
 */

/**
 * Cache configuration strategies
 * @typedef {Object} ICacheConfig
 * @property {Object} REALTIME - Real-time cache configuration
 * @property {number} REALTIME.staleTime - Time before data is considered stale
 * @property {number} REALTIME.cacheTime - Time before data is removed from cache
 * @property {number} REALTIME.refetchInterval - Interval for automatic refetching
 * @property {Object} USER_CONTENT - User content cache configuration
 * @property {number} USER_CONTENT.staleTime - Time before data is considered stale
 * @property {number} USER_CONTENT.cacheTime - Time before data is removed from cache
 * @property {number} USER_CONTENT.refetchInterval - Interval for automatic refetching
 * @property {Object} STATIC - Static content cache configuration
 * @property {number} STATIC.staleTime - Time before data is considered stale
 * @property {number} STATIC.cacheTime - Time before data is removed from cache
 * @property {number} [STATIC.refetchInterval] - Interval for automatic refetching
 * @property {Object} CRITICAL - Critical data cache configuration
 * @property {number} CRITICAL.staleTime - Time before data is considered stale
 * @property {number} CRITICAL.cacheTime - Time before data is removed from cache
 * @property {number} CRITICAL.refetchInterval - Interval for automatic refetching
 */

/**
 * WebSocket update strategies
 * @typedef {string} WebSocketUpdateStrategy
 */

/**
 * Extended query options with data service features
 * @typedef {Object} IDataServiceQueryOptions
 * @property {*} [queryKey] - Query key for caching
 * @property {function} [queryFn] - Query function
 * @property {boolean} [enabled] - Whether the query is enabled
 * @property {number} [staleTime] - Time before data is considered stale
 * @property {number} [cacheTime] - Time before data is removed from cache
 * @property {number} [refetchInterval] - Interval for automatic refetching
 * @property {string} [cacheStrategy] - Cache strategy to use
 * @property {string[]} [websocketTopics] - WebSocket topics to subscribe to
 * @property {WebSocketUpdateStrategy} [updateStrategy] - Strategy for WebSocket updates
 */

/**
 * Extended mutation options with data service features
 * @typedef {Object} IDataServiceMutationOptions
 * @property {*} [mutationKey] - Mutation key for caching
 * @property {function} [mutationFn] - Mutation function
 * @property {boolean} [enabled] - Whether the mutation is enabled
 * @property {function} [onSuccess] - Success callback
 * @property {function} [onError] - Error callback
 * @property {function} [onSettled] - Settled callback
 * @property {string[]} [invalidateQueries] - Queries to invalidate after mutation
 * @property {function} [optimisticUpdate] - Optimistic update function
 * @property {string[]} [websocketEvents] - WebSocket events to emit
 */

/**
 * Extended infinite query options with data service features
 * @typedef {Object} IDataServiceInfiniteQueryOptions
 * @property {*} [queryKey] - Query key for caching
 * @property {function} [queryFn] - Query function
 * @property {boolean} [enabled] - Whether the query is enabled
 * @property {number} [staleTime] - Time before data is considered stale
 * @property {number} [cacheTime] - Time before data is removed from cache
 * @property {function} [getNextPageParam] - Function to get next page parameter
 * @property {string} [cacheStrategy] - Cache strategy to use
 * @property {string[]} [websocketTopics] - WebSocket topics to subscribe to
 */

/**
 * Data service factory options
 * @typedef {Object} IDataServiceFactoryOptions
 * @property {*} [cache] - Cache provider instance
 * @property {*} [webSocket] - WebSocket service instance
 * @property {Object} [customCacheConfig] - Custom cache configuration
 */

/**
 * Repository interface for data service implementations
 * @typedef {Object} IDataRepository
 * @property {function} [getData] - Get data from repository
 * @property {function} [createData] - Create data in repository
 * @property {function} [updateData] - Update data in repository
 * @property {function} [deleteData] - Delete data from repository
 */

/**
 * Data service statistics
 * @typedef {Object} IDataServiceStats
 * @property {*} cache - Cache statistics
 * @property {Object} webSocket - WebSocket statistics
 * @property {boolean} webSocket.connected - WebSocket connection status
 * @property {number} webSocket.subscriptions - Number of active subscriptions
 * @property {string[]} webSocket.topics - Subscribed topics
 * @property {Object} performance - Performance statistics
 * @property {number} performance.averageResponseTime - Average response time
 * @property {number} performance.requestCount - Total request count
 * @property {number} performance.errorRate - Error rate percentage
 */

// Export all interfaces for use
export {
  // Types will be available via JSDoc typedefs
  // No direct exports needed for JavaScript with JSDoc
};
