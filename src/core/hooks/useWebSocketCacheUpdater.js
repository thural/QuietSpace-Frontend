import { useEffect, useCallback } from 'react';
import { useDIContainer } from '../di/index.js';
import { TYPES } from '../di/types.js';

/**
 * Cache provider interface
 * @typedef {Object} ICacheProvider
 * @property {(key: string, value: any, ttl?: number) => Promise<void>} set - Set cache value
 * @property {(key: string) => Promise<any>} get - Get cache value
 * @property {(key: string) => Promise<void>} invalidate - Invalidate cache entry
 * @property {(key: string) => Promise<boolean>} has - Check if key exists
 * @property {(key: string) => Promise<void>} delete - Delete cache entry
 * @property {() => Promise<void>} clear - Clear all cache
 * @property {(key: string) => Object} getEntry - Get cache entry with metadata
 * @property {() => Object} getStats - Get cache statistics
 */

/**
 * WebSocket service interface
 * @typedef {Object} IWebSocketService
 * @property {(topic: string, callback: Function) => Function} subscribe - Subscribe to topic
 * @property {(topic: string, message: any) => Promise<void>} publish - Publish message
 * @property {() => Promise<void>} connect - Connect to WebSocket
 * @property {() => Promise<void>} disconnect - Disconnect from WebSocket
 * @property {() => boolean} isConnected - Check connection status
 */

/**
 * WebSocket cache update configuration
 * @typedef {Object} WebSocketCacheConfig
 * @property {string} queryKey - Cache key to update
 * @property {string} updateStrategy - Strategy for updating cache
 * @property {string} [messageProperty] - Property path to extract data from WebSocket message
 * @property {string} [mergeKey] - Key for merging objects (e.g., 'id')
 */

/**
 * Hook for integrating WebSocket updates with query cache
 * 
 * @param {string} topic - WebSocket topic to subscribe to
 * @param {WebSocketCacheConfig} config - Cache update configuration
 * @returns {void}
 */
export function useWebSocketCacheUpdater(topic, config) {
  const container = useDIContainer();
  const cache = container.getByToken(TYPES.CACHE_SERVICE);
  const webSocket = container.getByToken(TYPES.WEBSOCKET_SERVICE);

  const updateCache = useCallback((message) => {
    const { queryKey, updateStrategy, messageProperty, mergeKey } = config;

    // Extract data from message if property specified
    const newData = messageProperty
      ? getNestedProperty(message, messageProperty)
      : message;

    if (!newData) return;

    // Get current cache entry
    const currentEntry = cache.getEntry(queryKey);
    const currentData = currentEntry?.data;

    let updatedData;

    switch (updateStrategy) {
      case 'replace':
        updatedData = newData;
        break;

      case 'merge':
        if (Array.isArray(currentData) && mergeKey) {
          // Merge array items by key
          updatedData = currentData.map((item) =>
            item[mergeKey] === newData[mergeKey] ? { ...item, ...newData } : item
          );
        } else if (typeof currentData === 'object' && typeof newData === 'object') {
          // Merge objects
          updatedData = { ...currentData, ...newData };
        } else {
          updatedData = newData;
        }
        break;

      case 'append':
        updatedData = Array.isArray(currentData)
          ? [...currentData, newData]
          : newData;
        break;

      case 'prepend':
        updatedData = Array.isArray(currentData)
          ? [newData, ...currentData]
          : newData;
        break;

      case 'increment':
        // For numeric values like counts
        if (typeof currentData === 'number' && typeof newData === 'number') {
          updatedData = currentData + newData;
        } else if (typeof currentData === 'object' && typeof newData === 'object') {
          // Increment specific fields in an object
          updatedData = { ...currentData };
          Object.keys(newData).forEach(key => {
            if (typeof updatedData[key] === 'number' && typeof newData[key] === 'number') {
              updatedData[key] += newData[key];
            }
          });
        } else {
          updatedData = newData;
        }
        break;

      default:
        updatedData = newData;
    }

    // Update cache with same TTL as original entry
    const ttl = currentEntry?.ttl || 10 * 60 * 1000; // Default 10 minutes
    cache.set(queryKey, updatedData, ttl);

  }, [cache, config]);

  useEffect(() => {
    // Subscribe to WebSocket topic
    const unsubscribe = webSocket.subscribe(topic, updateCache);

    return () => {
      unsubscribe();
    };
  }, [webSocket, topic, updateCache]);
}

/**
 * Helper function to get nested property from object
 * 
 * @param {any} obj - Object to get property from
 * @param {string} path - Dot-separated path to property
 * @returns {any} - Property value or undefined
 */
function getNestedProperty(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Hook for specific like count updates
 * 
 * @param {string} postId - Post ID to track likes for
 * @returns {void}
 */
export function useLikeCountUpdater(postId) {
  return useWebSocketCacheUpdater(`post.${postId}.likes`, {
    queryKey: `posts`,
    updateStrategy: 'merge',
    messageProperty: 'data', // Assuming WebSocket message structure: { data: { postId, likes } }
    mergeKey: 'id'
  });
}

/**
 * Hook for real-time post updates
 * 
 * @returns {void}
 */
export function usePostUpdater() {
  return useWebSocketCacheUpdater('post.updates', {
    queryKey: 'posts',
    updateStrategy: 'merge',
    mergeKey: 'id'
  });
}

/**
 * Hook for new post notifications
 * 
 * @returns {void}
 */
export function useNewPostHandler() {
  return useWebSocketCacheUpdater('post.created', {
    queryKey: 'posts',
    updateStrategy: 'prepend'
  });
}
