/**
 * WebSocket Manager Implementation
 * 
 * Handles WebSocket connections and real-time data updates
 */

import type { IWebSocketService } from '@/core/websocket/types';
import type { IUpdateStrategy } from './IUpdateStrategy';
import type { ICacheManager } from './ICacheManager';
import type { IWebSocketManager } from './IWebSocketManager';

export class WebSocketManager implements IWebSocketManager {
  private unsubscribeFunctions = new Map<string, Map<string, () => void>>();

  constructor(
    private webSocket: IWebSocketService,
    private updateStrategy: IUpdateStrategy
  ) {}

  setupListeners(
    queryKey: string,
    topics: string[],
    updateStrategyType: string,
    cacheManager: ICacheManager,
    cacheConfig: any
  ): void {
    const cacheKey = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;

    topics.forEach(topic => {
      const unsubscribe = this.webSocket.subscribe(topic, (message) => {
        this.handleMessage(cacheKey, message, updateStrategyType, cacheManager, cacheConfig);
      });

      this.storeUnsubscribeFunction(cacheKey, topic, unsubscribe);
    });
  }

  handleMessage(
    cacheKey: string,
    message: any,
    updateStrategyType: string,
    cacheManager: ICacheManager,
    cacheConfig: any
  ): void {
    try {
      const currentEntry = cacheManager.getEntry(cacheKey);
      const currentData = currentEntry?.data;
      const newData = message.data || message;

      if (!newData) return;

      const updatedData = this.updateStrategy.apply(currentData, newData, updateStrategyType as any);

      // Update cache with same TTL as original
      const ttl = currentEntry?.ttl || cacheConfig.USER_CONTENT?.cacheTime;
      cacheManager.set(cacheKey, updatedData, ttl);

    } catch (error) {
      console.error(`Error handling WebSocket update for ${cacheKey}:`, error);
    }
  }

  cleanup(cacheKey: string, topics: string[]): void {
    topics.forEach(topic => {
      const unsubscribeKey = `${cacheKey}:${topic}`;
      const unsubscribe = this.getUnsubscribeFunction(unsubscribeKey);
      if (unsubscribe) {
        unsubscribe();
        this.removeUnsubscribeFunction(unsubscribeKey);
      }
    });
  }

  storeUnsubscribeFunction(cacheKey: string, topic: string, unsubscribe: () => void): void {
    const unsubscribeKey = `${cacheKey}:${topic}`;
    
    if (!this.unsubscribeFunctions.has(cacheKey)) {
      this.unsubscribeFunctions.set(cacheKey, new Map());
    }
    
    this.unsubscribeFunctions.get(cacheKey)!.set(topic, unsubscribe);
  }

  private getUnsubscribeFunction(unsubscribeKey: string): (() => void) | undefined {
    const [cacheKey, topic] = unsubscribeKey.split(':');
    const cacheMap = this.unsubscribeFunctions.get(cacheKey);
    return cacheMap?.get(topic);
  }

  private removeUnsubscribeFunction(unsubscribeKey: string): void {
    const [cacheKey, topic] = unsubscribeKey.split(':');
    const cacheMap = this.unsubscribeFunctions.get(cacheKey);
    if (cacheMap) {
      cacheMap.delete(topic);
      if (cacheMap.size === 0) {
        this.unsubscribeFunctions.delete(cacheKey);
      }
    }
  }
}
