/**
 * WebSocket Cache Manager.
 *
 * Integrates WebSocket communications with the enterprise cache system
 * for real-time cache invalidation and message persistence.
 */

import { type FeatureCacheService } from '../../cache';
import { Inject, Injectable } from '../../di';
import { TYPES } from '../../di/types';
import { LoggerService } from '../../services/LoggerService';
import { WebSocketMessage } from '../services/EnterpriseWebSocketService';

export interface CacheInvalidationStrategy {
  feature: string;
  patterns: string[];
  conditions?: (message: WebSocketMessage) => boolean;
  priority: number;
}

export interface CacheInvalidationConfig {
  enableAutoInvalidation: boolean;
  enableMessagePersistence: boolean;
  enableMetrics: boolean;
  defaultTTL: number;
  maxCacheSize: number;
}

export interface CacheMetrics {
  invalidations: number;
  hits: number;
  misses: number;
  messagesPersisted: number;
  averageInvalidationTime: number;
}

/**
 * WebSocket Cache Manager Interface
 */
export interface IWebSocketCacheManager {
  // Core cache operations
  get(key: string): unknown;
  set(key: string, value: unknown, ttl?: number): void;
  invalidate(key: string): boolean;
  clear(): void;
  has(key: string): boolean;

  // WebSocket-specific operations
  invalidateCache(message: WebSocketMessage): Promise<void>;
  persistMessage(message: WebSocketMessage): Promise<void>;
  getMessage(messageId: string): Promise<WebSocketMessage | null>;
  getFeatureMessages(feature: string, limit?: number): Promise<WebSocketMessage[]>;

  // Metrics and monitoring
  getMetrics(): CacheMetrics;
  getCacheStats(): Promise<Record<string, unknown>>;

  // Lifecycle
  cleanup(): Promise<void>;
  dispose(): Promise<void>;

  // Backward compatibility methods for external adapters
  set(key: string, value: unknown, ttl?: number): void;
  invalidate(key: string): boolean;
  invalidatePattern(pattern: string): number;
}

/**
 * WebSocket Cache Manager Implementation
 */
@Injectable()
export class WebSocketCacheManager implements IWebSocketCacheManager {
  private readonly invalidationStrategies: Map<string, CacheInvalidationStrategy[]> = new Map();
  private metrics: CacheMetrics;
  private readonly config: CacheInvalidationConfig;

  constructor(
    @Inject(TYPES.CACHE_SERVICE) private readonly cacheManager: FeatureCacheService,
    private readonly logger: LoggerService
  ) {
    this.config = this.getDefaultConfig();
    this.metrics = this.getDefaultMetrics();
    this.initializeDefaultStrategies();
  }

  /**
   * Get the WebSocket cache provider
   */
  private get wsCache() {
    return this.cacheManager.getCache('websocket');
  }

  registerInvalidationStrategy(strategy: CacheInvalidationStrategy): void {
    if (!this.invalidationStrategies.has(strategy.feature)) {
      this.invalidationStrategies.set(strategy.feature, []);
    }

    const strategies = this.invalidationStrategies.get(strategy.feature)!;
    strategies.push(strategy);

    // Sort by priority (higher priority first)
    strategies.sort((a, b) => b.priority - a.priority);

    this.logger.info(`[WebSocketCacheManager] Registered invalidation strategy for: ${strategy.feature}`);
  }

  async invalidateCache(message: WebSocketMessage): Promise<void> {
    if (!this.config.enableAutoInvalidation) {
      return;
    }

    const startTime = Date.now();

    try {
      const strategies = this.invalidationStrategies.get(message.feature) || [];
      const invalidatedPatterns: string[] = [];

      for (const strategy of strategies) {
        // Check conditions if specified
        if (strategy.conditions && !strategy.conditions(message)) {
          continue;
        }

        // Invalidate cache patterns
        for (const pattern of strategy.patterns) {
          this.cacheManager.invalidatePattern(pattern);
          invalidatedPatterns.push(pattern);
        }
      }

      // Update metrics
      const processingTime = Date.now() - startTime;
      this.updateMetrics(processingTime, invalidatedPatterns.length);

      if (invalidatedPatterns.length > 0) {
        this.logger.debug(`[WebSocketCacheManager] Invalidated ${invalidatedPatterns.length} cache patterns for: ${message.feature}`);
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('[WebSocketCacheManager] Cache invalidation failed:', new Error(errorMessage));
      throw new Error(errorMessage);
    }
  }

  async persistMessage(message: WebSocketMessage): Promise<void> {
    if (!this.config.enableMessagePersistence) {
      return;
    }

    try {
      const cacheKey = `ws:message:${message.feature}:${message.id}`;

      await this.wsCache.set(cacheKey, {
        message,
        persistedAt: new Date(),
        feature: message.feature
      }, this.config.defaultTTL);

      // Also add to feature message list
      const featureListKey = `ws:messages:${message.feature}`;
      const existingMessages = this.wsCache.get<string[]>(featureListKey) || [];

      // Add message ID to the list (keep most recent)
      const updatedMessages = [message.id, ...existingMessages.filter(id => id !== message.id)]
        .slice(0, this.config.maxCacheSize);

      this.wsCache.set(featureListKey, updatedMessages, this.config.defaultTTL);

      this.metrics.messagesPersisted++;

      this.logger.debug(`[WebSocketCacheManager] Persisted message: ${message.id} for feature: ${message.feature}`);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('[WebSocketCacheManager] Message persistence failed:', new Error(errorMessage));
      throw new Error(errorMessage);
    }
  }

  async getMessage(messageId: string): Promise<WebSocketMessage | null> {
    try {
      const cached = this.wsCache.get(`ws:message:*:${messageId}`);

      if (cached && typeof cached === 'object' && cached !== null && 'message' in cached) {
        this.metrics.hits++;
        return (cached as { message: WebSocketMessage }).message;
      }

      this.metrics.misses++;
      return null;

    } catch (error: unknown) {
      this.logger.error('[WebSocketCacheManager] Failed to get message:', error instanceof Error ? error : new Error(String(error)));
      this.metrics.misses++;
      return null;
    }
  }

  async getFeatureMessages(feature: string, limit: number = 50): Promise<WebSocketMessage[]> {
    try {
      const featureListKey = `ws:messages:${feature}`;
      const messageIds = this.wsCache.get<string[]>(featureListKey) || [];

      const limitedIds = messageIds.slice(0, limit);
      const messagePromises = limitedIds.map(id => this.getMessage(id));

      const messages = await Promise.all(messagePromises);
      return messages.filter((msg): msg is WebSocketMessage => msg !== null);

    } catch (error) {
      this.logger.error('[WebSocketCacheManager] Failed to get feature messages:', error instanceof Error ? error : new Error(String(error)));
      return [];
    }
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  clearMetrics(): void {
    this.metrics = this.getDefaultMetrics();
    this.logger.info('[WebSocketCacheManager] Metrics cleared');
  }

  private initializeDefaultStrategies(): void {
    // Chat feature cache invalidation
    this.registerInvalidationStrategy({
      feature: 'chat',
      patterns: [
        'chat:*',
        'message:*',
        'conversation:*',
        'user:*:online_status'
      ],
      priority: 5
    });

    // Notification feature cache invalidation
    this.registerInvalidationStrategy({
      feature: 'notification',
      patterns: [
        'notification:*',
        'user:*:notifications',
        'notification:*:unread'
      ],
      priority: 4
    });

    // Feed feature cache invalidation
    this.registerInvalidationStrategy({
      feature: 'feed',
      patterns: [
        'feed:*',
        'post:*',
        'comment:*',
        'user:*:feed'
      ],
      conditions: (message) => {
        // Only invalidate for certain message types
        return ['create', 'update', 'delete'].includes(message.type);
      },
      priority: 3
    });

    // Search feature cache invalidation
    this.registerInvalidationStrategy({
      feature: 'search',
      patterns: [
        'search:*',
        'search:*:results',
        'trending:*'
      ],
      priority: 2
    });

    this.logger.info('[WebSocketCacheManager] Default invalidation strategies initialized');
  }

  private updateMetrics(processingTime: number, invalidations: number): void {
    if (!this.config.enableMetrics) {
      return;
    }

    this.metrics.invalidations += invalidations;

    // Update average processing time
    const totalOperations = this.metrics.invalidations;
    this.metrics.averageInvalidationTime =
      (this.metrics.averageInvalidationTime * (totalOperations - invalidations) + processingTime) / totalOperations;
  }

  private getDefaultConfig(): CacheInvalidationConfig {
    return {
      enableAutoInvalidation: true,
      enableMessagePersistence: true,
      enableMetrics: true,
      defaultTTL: 300000, // 5 minutes
      maxCacheSize: 1000
    };
  }

  private getDefaultMetrics(): CacheMetrics {
    return {
      invalidations: 0,
      hits: 0,
      misses: 0,
      messagesPersisted: 0,
      averageInvalidationTime: 0
    };
  }

  /**
   * Cleanup old messages and cache entries
   */
  async cleanup(): Promise<void> {
    try {
      // Clean up old message lists
      const allFeatures = ['chat', 'notification', 'feed', 'search'];

      for (const feature of allFeatures) {
        const featureListKey = `ws:messages:${feature}`;
        const messageIds = this.wsCache.get<string[]>(featureListKey) || [];

        // Keep only recent messages
        const recentIds = messageIds.slice(0, this.config.maxCacheSize);

        if (recentIds.length !== messageIds.length) {
          this.wsCache.set(featureListKey, recentIds, this.config.defaultTTL);
        }
      }

      this.logger.info('[WebSocketCacheManager] Cleanup completed');

    } catch (error) {
      this.logger.error('[WebSocketCacheManager] Cleanup failed:', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Get cache statistics for monitoring
   */
  async getCacheStats(): Promise<Record<string, unknown>> {
    try {
      const stats = this.wsCache.getStats();

      return {
        cacheStats: stats,
        webSocketMetrics: this.metrics,
        invalidationStrategies: Array.from(this.invalidationStrategies.entries()).map(
          ([feature, strategies]) => ({
            feature,
            strategyCount: strategies.length,
            patterns: strategies.flatMap(s => s.patterns)
          })
        )
      };

    } catch (error) {
      this.logger.error('[WebSocketCacheManager] Failed to get cache stats:', error instanceof Error ? error : new Error(String(error)));
      return {};
    }
  }

  /**
   * Get cache value
   */
  get(key: string): unknown {
    try {
      const websocketCache = this.cacheManager.getCache('websocket');
      return websocketCache.get(key);
    } catch (error) {
      this.logger.error('[WebSocketCacheManager] Cache get failed:', error instanceof Error ? error : new Error(String(error)));
      return undefined;
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    try {
      const websocketCache = this.cacheManager.getCache('websocket');
      websocketCache.clear();
      this.logger.info('[WebSocketCacheManager] Cache cleared');
    } catch (error) {
      this.logger.error('[WebSocketCacheManager] Cache clear failed:', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    try {
      const websocketCache = this.cacheManager.getCache('websocket');
      return websocketCache.has(key);
    } catch (error) {
      this.logger.error('[WebSocketCacheManager] Cache has check failed:', error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }

  /**
   * Dispose of cache manager
   */
  async dispose(): Promise<void> {
    try {
      this.clear();
      this.invalidationStrategies.clear();
      this.logger.info('[WebSocketCacheManager] Disposed');
    } catch (error) {
      this.logger.error('[WebSocketCacheManager] Dispose failed:', error instanceof Error ? error : new Error(String(error)));
    }
  }

  // ===== BACKWARD COMPATIBILITY METHODS FOR EXTERNAL ADAPTERS =====

  /**
   * Set cache value (for external adapter compatibility)
   */
  set(key: string, value: unknown, ttl?: number): void {
    try {
      const websocketCache = this.cacheManager.getCache('websocket');
      websocketCache.set(key, value, ttl || this.config.defaultTTL);
      this.logger.debug(`[WebSocketCacheManager] Cache set: ${key}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('[WebSocketCacheManager] Cache set failed:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Invalidate specific cache key (for external adapter compatibility)
   */
  invalidate(key: string): boolean {
    try {
      const websocketCache = this.cacheManager.getCache('websocket');
      const result = websocketCache.invalidate(key);
      this.logger.debug(`[WebSocketCacheManager] Cache invalidated: ${key}, success: ${result}`);
      return result;
    } catch (error) {
      this.logger.error('[WebSocketCacheManager] Cache invalidate failed:', error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }

  /**
   * Invalidate cache entries matching pattern (for external adapter compatibility)
   */
  invalidatePattern(pattern: string): number {
    try {
      // Use the cache manager's pattern invalidation
      const invalidatedCount = this.cacheManager.invalidatePattern(pattern);
      this.logger.debug(`[WebSocketCacheManager] Cache pattern invalidated: ${pattern}, count: ${invalidatedCount}`);
      return invalidatedCount;
    } catch (error) {
      this.logger.error('[WebSocketCacheManager] Cache pattern invalidate failed:', error instanceof Error ? error : new Error(String(error)));
      return 0;
    }
  }
}
