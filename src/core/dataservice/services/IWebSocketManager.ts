/**
 * WebSocket Manager Interface
 *
 * Single responsibility: WebSocket connection and message handling
 */

import type { ICacheManager } from './ICacheManager';
import type { IUpdateStrategy } from './IUpdateStrategy';
import type { IWebSocketService } from '@/core/websocket/types';

export interface IWebSocketManager {
  /**
   * Set up WebSocket listeners for real-time updates
   */
  setupListeners(
    queryKey: string,
    topics: string[],
    updateStrategy: string,
    cacheManager: ICacheManager,
    cacheConfig: any
  ): void;

  /**
   * Handle WebSocket message and update cache
   */
  handleMessage(
    cacheKey: string,
    message: any,
    updateStrategy: string,
    cacheManager: ICacheManager,
    cacheConfig: any
  ): void;

  /**
   * Clean up WebSocket listeners
   */
  cleanup(cacheKey: string, topics: string[]): void;

  /**
   * Store unsubscribe function for cleanup
   */
  storeUnsubscribeFunction(cacheKey: string, topic: string, unsubscribe: () => void): void;
}
