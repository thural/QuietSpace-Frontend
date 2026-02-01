import { useEffect, useCallback } from 'react';

import type { ICacheProvider } from '@/core/cache';
import type { IWebSocketService } from '@/core/websocket/types';

import { useDIContainer } from '@/core/di';
import { TYPES } from '@/core/di/types';

/**
 * WebSocket cache update configuration
 */
export interface WebSocketCacheConfig {
  queryKey: string;
  updateStrategy: 'replace' | 'merge' | 'append' | 'prepend' | 'increment';
  messageProperty?: string; // Property path to extract data from WebSocket message
  mergeKey?: string; // Key for merging objects (e.g., 'id')
}

/**
 * Hook for integrating WebSocket updates with query cache
 *
 * @param topic WebSocket topic to subscribe to
 * @param config Cache update configuration
 */
export function useWebSocketCacheUpdater(
  topic: string,
  config: WebSocketCacheConfig
) {
  const container = useDIContainer();
  const cache = container.getByToken<ICacheProvider>(TYPES.CACHE_SERVICE);
  const webSocket = container.getByToken<IWebSocketService>(TYPES.WEBSOCKET_SERVICE);

  const updateCache = useCallback((message: any) => {
    const { queryKey, updateStrategy, messageProperty, mergeKey } = config;

    // Extract data from message if property specified
    const newData = messageProperty
      ? getNestedProperty(message, messageProperty)
      : message;

    if (!newData) return;

    // Get current cache entry
    const currentEntry = cache.getEntry(queryKey);
    const currentData = currentEntry?.data;

    let updatedData: any;

    switch (updateStrategy) {
      case 'replace':
        updatedData = newData;
        break;

      case 'merge':
        if (Array.isArray(currentData) && mergeKey) {
          // Merge array items by key
          updatedData = currentData.map((item: any) =>
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
        // For numeric values like like counts
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
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Hook for specific like count updates
 */
export function useLikeCountUpdater(postId: string) {
  return useWebSocketCacheUpdater(`post.${postId}.likes`, {
    queryKey: 'posts',
    updateStrategy: 'merge',
    messageProperty: 'data', // Assuming WebSocket message structure: { data: { postId, likes } }
    mergeKey: 'id'
  });
}

/**
 * Hook for real-time post updates
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
 */
export function useNewPostHandler() {
  return useWebSocketCacheUpdater('post.created', {
    queryKey: 'posts',
    updateStrategy: 'prepend'
  });
}
