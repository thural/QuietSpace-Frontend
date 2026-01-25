/**
 * Feed WebSocket Adapter
 * 
 * Bridges existing feed WebSocket implementations with the enterprise WebSocket infrastructure.
 * Provides feed-specific functionality while leveraging enterprise patterns.
 */

import { Injectable } from '@/core/di';
import { 
  IEnterpriseWebSocketService, 
  IMessageRouter,
  IWebSocketCacheManager 
} from '@/core/websocket';
import { WebSocketFeatureConfig, WebSocketMessage } from '@/core/websocket/types';
import { PostResponse, PollResponse } from '../data/models/post';
import { ResId } from '@/shared/api/models/common';

// Feed-specific WebSocket message types
export interface FeedWebSocketMessage extends WebSocketMessage {
  feature: 'feed';
  messageType: 'post_created' | 'post_updated' | 'post_deleted' | 'reaction_added' | 'reaction_removed' | 
                'comment_added' | 'comment_removed' | 'poll_created' | 'poll_updated' | 'poll_voted' |
                'feed_refresh' | 'trending_update' | 'batch_update';
  userId?: string;
  postId?: string;
  data: any;
}

// Feed adapter configuration
export interface FeedAdapterConfig {
  enableRealtimeUpdates: boolean;
  enableTrendingUpdates: boolean;
  enableBatchProcessing: boolean;
  enableFeedRefresh: boolean;
  enablePollUpdates: boolean;
  batchSize: number;
  batchTimeout: number;
  updateInterval: number;
  trendingRefreshInterval: number;
  maxCacheSize: number;
  cacheTTL: number;
}

// Feed adapter metrics
export interface FeedAdapterMetrics {
  postsCreated: number;
  postsUpdated: number;
  postsDeleted: number;
  reactionsProcessed: number;
  commentsProcessed: number;
  pollsCreated: number;
  pollsUpdated: number;
  pollVotesProcessed: number;
  batchesProcessed: number;
  batchItemsProcessed: number;
  batchTimeouts: number;
  feedRefreshes: number;
  trendingUpdates: number;
  cacheHits: number;
  cacheMisses: number;
  connectionUptime: number;
  reconnectionAttempts: number;
  connectionErrors: number;
  averageUpdateLatency: number;
  updateSuccessRate: number;
  cacheHitRate: number;
  errorCount: number;
  validationErrors: number;
  processingErrors: number;
  lastActivity: number;
  activeSubscriptions: number;
  queuedUpdates: number;
}

// Feed event handlers
export interface FeedEventHandlers {
  onPostCreated?: (post: PostResponse) => void;
  onPostUpdated?: (post: PostResponse) => void;
  onPostDeleted?: (postId: ResId) => void;
  onReactionAdded?: (postId: ResId, userId: ResId, reactionType: string) => void;
  onReactionRemoved?: (postId: ResId, userId: ResId, reactionType: string) => void;
  onCommentAdded?: (postId: ResId, comment: any) => void;
  onCommentRemoved?: (postId: ResId, commentId: ResId) => void;
  onPollCreated?: (postId: ResId, poll: PollResponse) => void;
  onPollUpdated?: (postId: ResId, poll: PollResponse) => void;
  onPollVoted?: (postId: ResId, pollId: ResId, userId: ResId, option: string) => void;
  onFeedRefresh?: (feedId: string, posts: PostResponse[]) => void;
  onTrendingUpdate?: (trendingPosts: PostResponse[]) => void;
  onBatchUpdate?: (updates: any[]) => void;
  onError?: (error: FeedWebSocketError) => void;
  onConnectionChange?: (isConnected: boolean) => void;
}

// Feed WebSocket error
export interface FeedWebSocketError {
  type: 'connection' | 'post' | 'validation' | 'processing' | 'batch' | 'cache';
  message: string;
  code?: string;
  details?: any;
  timestamp: number;
  retryable: boolean;
  postId?: ResId;
  userId?: ResId;
}

// Feed subscription options
export interface FeedSubscriptionOptions {
  includeTypes?: string[];
  excludeTypes?: string[];
  includeReactions?: boolean;
  includeComments?: boolean;
  includePolls?: boolean;
  includeTrending?: boolean;
  priority?: 'low' | 'normal' | 'high';
  batchSize?: number;
  enableBatching?: boolean;
  updateInterval?: number;
}

/**
 * Feed WebSocket Adapter
 */
@Injectable()
export class FeedWebSocketAdapter {
  private config: FeedAdapterConfig;
  private metrics: FeedAdapterMetrics;
  private eventHandlers: FeedEventHandlers = {};
  private activeSubscriptions: Map<string, () => void> = new Map();
  private updateQueue: FeedWebSocketMessage[] = [];
  private batchProcessor: NodeJS.Timeout | null = null;
  private trendingProcessor: NodeJS.Timeout | null = null;
  private isInitialized = false;
  private startTime = Date.now();

  constructor(
    private enterpriseWebSocket: IEnterpriseWebSocketService,
    private messageRouter: IMessageRouter,
    private cacheManager: IWebSocketCacheManager
  ) {
    this.config = this.getDefaultConfig();
    this.metrics = this.getDefaultMetrics();
  }

  /**
   * Initialize the feed WebSocket adapter
   */
  async initialize(config?: Partial<FeedAdapterConfig>): Promise<void> {
    if (this.isInitialized) return;

    this.config = { ...this.config, ...config };

    const featureConfig: WebSocketFeatureConfig = {
      name: 'feed',
      enabled: true,
      priority: 1,
      maxConnections: 5,
      heartbeatInterval: 30000,
      reconnectAttempts: 5,
      messageValidation: true,
      cacheInvalidation: true,
      customRoutes: this.getFeedMessageRoutes()
    };

    await this.enterpriseWebSocket.registerFeature(featureConfig);
    await this.registerMessageHandlers();
    this.setupConnectionMonitoring();

    if (this.config.enableBatchProcessing) {
      this.startBatchProcessor();
    }

    if (this.config.enableTrendingUpdates) {
      this.startTrendingProcessor();
    }

    this.isInitialized = true;
    this.startTime = Date.now();
  }

  /**
   * Send post creation event
   */
  async sendPostCreated(post: PostResponse): Promise<void> {
    const message: FeedWebSocketMessage = {
      id: `post_created_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      feature: 'feed',
      messageType: 'post_created',
      type: 'post_update',
      userId: String(post.userId),
      postId: String(post.id),
      data: post,
      timestamp: Date.now(),
      priority: 'high'
    };

    await this.sendMessage(message);
    this.metrics.postsCreated++;
    await this.updatePostCache(post);
  }

  /**
   * Send post update event
   */
  async sendPostUpdated(post: PostResponse): Promise<void> {
    const message: FeedWebSocketMessage = {
      id: `post_updated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      feature: 'feed',
      messageType: 'post_updated',
      type: 'post_update',
      userId: String(post.userId),
      postId: String(post.id),
      data: post,
      timestamp: Date.now(),
      priority: 'normal'
    };

    await this.sendMessage(message);
    this.metrics.postsUpdated++;
  }

  /**
   * Send post deletion event
   */
  async sendPostDeleted(postId: ResId, userId?: ResId): Promise<void> {
    const message: FeedWebSocketMessage = {
      id: `post_deleted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      feature: 'feed',
      messageType: 'post_deleted',
      type: 'post_update',
      userId: userId || '',
      postId: String(postId),
      data: { postId, deletedAt: Date.now() },
      timestamp: Date.now(),
      priority: 'high'
    };

    await this.sendMessage(message);
    this.metrics.postsDeleted++;
    await this.invalidatePostCache(postId);
  }

  /**
   * Send reaction event
   */
  async sendReactionAdded(postId: ResId, userId: ResId, reactionType: string): Promise<void> {
    const message: FeedWebSocketMessage = {
      id: `reaction_added_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      feature: 'feed',
      messageType: 'reaction_added',
      type: 'reaction_update',
      userId: String(userId),
      postId: String(postId),
      data: { postId, userId, reactionType, timestamp: Date.now() },
      timestamp: Date.now(),
      priority: 'normal'
    };

    await this.sendMessage(message);
    this.metrics.reactionsProcessed++;
  }

  /**
   * Send reaction removal event
   */
  async sendReactionRemoved(postId: ResId, userId: ResId, reactionType: string): Promise<void> {
    const message: FeedWebSocketMessage = {
      id: `reaction_removed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      feature: 'feed',
      messageType: 'reaction_removed',
      type: 'reaction_update',
      userId: String(userId),
      postId: String(postId),
      data: { postId, userId, reactionType, timestamp: Date.now() },
      timestamp: Date.now(),
      priority: 'normal'
    };

    await this.sendMessage(message);
    this.metrics.reactionsProcessed++;
  }

  /**
   * Send comment addition event
   */
  async sendCommentAdded(postId: ResId, comment: any): Promise<void> {
    const message: FeedWebSocketMessage = {
      id: `comment_added_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      feature: 'feed',
      messageType: 'comment_added',
      type: 'comment_update',
      userId: String(comment.userId),
      postId: String(postId),
      data: { postId, comment, timestamp: Date.now() },
      timestamp: Date.now(),
      priority: 'normal'
    };

    await this.sendMessage(message);
    this.metrics.commentsProcessed++;
  }

  /**
   * Send poll vote event
   */
  async sendPollVoted(postId: ResId, pollId: ResId, userId: ResId, option: string): Promise<void> {
    const message: FeedWebSocketMessage = {
      id: `poll_voted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      feature: 'feed',
      messageType: 'poll_voted',
      type: 'poll_update',
      userId: String(userId),
      postId: String(postId),
      data: { postId, pollId, userId, option, timestamp: Date.now() },
      timestamp: Date.now(),
      priority: 'normal'
    };

    await this.sendMessage(message);
    this.metrics.pollVotesProcessed++;
  }

  /**
   * Send trending update event
   */
  async sendTrendingUpdate(trendingPosts: PostResponse[]): Promise<void> {
    if (!this.config.enableTrendingUpdates) return;

    const message: FeedWebSocketMessage = {
      id: `trending_update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      feature: 'feed',
      messageType: 'trending_update',
      type: 'trending_update',
      data: { 
        posts: trendingPosts, 
        timestamp: Date.now(),
        algorithm: 'engagement',
        timeWindow: 'hour'
      },
      timestamp: Date.now(),
      priority: 'normal'
    };

    await this.sendMessage(message);
    this.metrics.trendingUpdates++;
  }

  /**
   * Subscribe to post updates
   */
  subscribeToPosts(
    callback: (post: PostResponse) => void,
    options?: FeedSubscriptionOptions
  ): () => void {
    const subscriptionId = `posts_${Date.now()}`;
    
    const unsubscribe = this.messageRouter.subscribe(
      { feature: 'feed', messageType: 'post_created' },
      async (message: FeedWebSocketMessage) => {
        if (this.shouldProcessUpdate(message, options)) {
          callback(message.data as PostResponse);
        }
      }
    );

    this.activeSubscriptions.set(subscriptionId, unsubscribe);
    this.metrics.activeSubscriptions = this.activeSubscriptions.size;

    return () => {
      unsubscribe();
      this.activeSubscriptions.delete(subscriptionId);
      this.metrics.activeSubscriptions = this.activeSubscriptions.size;
    };
  }

  /**
   * Subscribe to reactions
   */
  subscribeToReactions(
    callback: (postId: ResId, userId: ResId, reactionType: string, action: 'added' | 'removed') => void
  ): () => void {
    const subscriptionId = `reactions_${Date.now()}`;
    
    const unsubscribeAdded = this.messageRouter.subscribe(
      { feature: 'feed', messageType: 'reaction_added' },
      async (message: FeedWebSocketMessage) => {
        const { postId, userId, reactionType } = message.data;
        callback(postId as ResId, userId as ResId, reactionType, 'added');
      }
    );

    const unsubscribeRemoved = this.messageRouter.subscribe(
      { feature: 'feed', messageType: 'reaction_removed' },
      async (message: FeedWebSocketMessage) => {
        const { postId, userId, reactionType } = message.data;
        callback(postId as ResId, userId as ResId, reactionType, 'removed');
      }
    );

    this.activeSubscriptions.set(subscriptionId, () => {
      unsubscribeAdded();
      unsubscribeRemoved();
    });

    return () => {
      unsubscribeAdded();
      unsubscribeRemoved();
      this.activeSubscriptions.delete(subscriptionId);
    };
  }

  /**
   * Subscribe to trending updates
   */
  subscribeToTrendingUpdates(
    callback: (trendingPosts: PostResponse[]) => void
  ): () => void {
    const subscriptionId = `trending_${Date.now()}`;
    
    const unsubscribe = this.messageRouter.subscribe(
      { feature: 'feed', messageType: 'trending_update' },
      async (message: FeedWebSocketMessage) => {
        callback(message.data.posts as PostResponse[]);
      }
    );

    this.activeSubscriptions.set(subscriptionId, unsubscribe);
    this.metrics.activeSubscriptions = this.activeSubscriptions.size;

    return () => {
      unsubscribe();
      this.activeSubscriptions.delete(subscriptionId);
      this.metrics.activeSubscriptions = this.activeSubscriptions.size;
    };
  }

  /**
   * Get current connection status
   */
  get isConnected(): boolean {
    return this.enterpriseWebSocket.isConnected;
  }

  /**
   * Get connection state
   */
  get connectionState(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' {
    return this.enterpriseWebSocket.connectionState;
  }

  /**
   * Get adapter metrics
   */
  getMetrics(): FeedAdapterMetrics {
    return {
      ...this.metrics,
      connectionUptime: Date.now() - this.startTime,
      queuedUpdates: this.updateQueue.length,
      cacheHitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100 || 0
    };
  }

  /**
   * Set event handlers
   */
  setEventHandlers(handlers: FeedEventHandlers): void {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  /**
   * Cleanup adapter resources
   */
  async cleanup(): Promise<void> {
    this.activeSubscriptions.forEach(unsubscribe => unsubscribe());
    this.activeSubscriptions.clear();

    if (this.batchProcessor) {
      clearInterval(this.batchProcessor);
      this.batchProcessor = null;
    }

    if (this.trendingProcessor) {
      clearInterval(this.trendingProcessor);
      this.trendingProcessor = null;
    }

    this.updateQueue = [];
    this.eventHandlers = {};
    
    await this.enterpriseWebSocket.unregisterFeature('feed');
    this.isInitialized = false;
  }

  /**
   * Send message with batch processing
   */
  private async sendMessage(message: FeedWebSocketMessage): Promise<void> {
    try {
      if (this.config.enableBatchProcessing && this.config.batchSize > 1) {
        this.addToBatch(message);
      } else {
        await this.enterpriseWebSocket.sendMessage(message);
      }

      this.metrics.lastActivity = Date.now();
    } catch (error) {
      this.metrics.errorCount++;
      this.eventHandlers.onError?.(error as FeedWebSocketError);
      throw error;
    }
  }

  /**
   * Add message to batch
   */
  private addToBatch(message: FeedWebSocketMessage): void {
    this.updateQueue.push(message);
    this.metrics.queuedUpdates = this.updateQueue.length;

    if (this.updateQueue.length >= this.config.batchSize) {
      this.processBatch();
    }
  }

  /**
   * Process message batch
   */
  private async processBatch(): Promise<void> {
    if (this.updateQueue.length === 0) return;

    const batch = this.updateQueue.splice(0, this.config.batchSize);
    this.metrics.queuedUpdates = this.updateQueue.length;

    try {
      const batchMessage: FeedWebSocketMessage = {
        id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        feature: 'feed',
        messageType: 'batch_update',
        type: 'batch_update',
        data: {
          updates: batch,
          batchId: `batch_${Date.now()}`,
          timestamp: Date.now()
        },
        timestamp: Date.now(),
        priority: 'normal'
      };

      await this.enterpriseWebSocket.sendMessage(batchMessage);
      this.metrics.batchesProcessed++;
      this.metrics.batchItemsProcessed += batch.length;

    } catch (error) {
      this.metrics.errorCount++;
      this.eventHandlers.onError?.(error as FeedWebSocketError);
      this.updateQueue.unshift(...batch);
    }
  }

  /**
   * Start batch processor
   */
  private startBatchProcessor(): void {
    this.batchProcessor = setInterval(() => {
      if (this.updateQueue.length > 0) {
        this.processBatch();
      }
    }, this.config.batchTimeout);
  }

  /**
   * Start trending processor
   */
  private startTrendingProcessor(): void {
    this.trendingProcessor = setInterval(() => {
      // This would typically fetch trending posts from API
      // For now, we'll just update metrics
      this.metrics.lastActivity = Date.now();
    }, this.config.trendingRefreshInterval);
  }

  /**
   * Check if update should be processed
   */
  private shouldProcessUpdate(
    message: FeedWebSocketMessage,
    options?: FeedSubscriptionOptions
  ): boolean {
    if (!options) return true;

    // Add filtering logic based on options
    return true;
  }

  /**
   * Update post cache
   */
  private async updatePostCache(post: PostResponse): Promise<void> {
    try {
      const cacheKey = `feed:post:${post.id}`;
      await this.cacheManager.set(cacheKey, post, this.config.cacheTTL);
      this.metrics.cacheHits++;
    } catch (error) {
      this.metrics.cacheMisses++;
    }
  }

  /**
   * Invalidate post cache
   */
  private async invalidatePostCache(postId: ResId): Promise<void> {
    try {
      const cacheKey = `feed:post:${postId}`;
      await this.cacheManager.invalidate(cacheKey);
    } catch (error) {
      console.error('Failed to invalidate post cache:', error);
    }
  }

  /**
   * Get feed message routes
   */
  private getFeedMessageRoutes(): any[] {
    return [
      {
        pattern: { feature: 'feed', messageType: 'post_created' },
        handler: 'handlePostCreated',
        priority: 'high',
        validation: true
      },
      {
        pattern: { feature: 'feed', messageType: 'post_updated' },
        handler: 'handlePostUpdated',
        priority: 'medium',
        validation: true
      },
      {
        pattern: { feature: 'feed', messageType: 'post_deleted' },
        handler: 'handlePostDeleted',
        priority: 'high',
        validation: false
      },
      {
        pattern: { feature: 'feed', messageType: 'reaction_added' },
        handler: 'handleReactionAdded',
        priority: 'medium',
        validation: false
      },
      {
        pattern: { feature: 'feed', messageType: 'reaction_removed' },
        handler: 'handleReactionRemoved',
        priority: 'medium',
        validation: false
      },
      {
        pattern: { feature: 'feed', messageType: 'comment_added' },
        handler: 'handleCommentAdded',
        priority: 'medium',
        validation: false
      },
      {
        pattern: { feature: 'feed', messageType: 'trending_update' },
        handler: 'handleTrendingUpdate',
        priority: 'normal',
        validation: false
      }
    ];
  }

  /**
   * Register message handlers
   */
  private async registerMessageHandlers(): Promise<void> {
    this.messageRouter.registerHandler('handlePostCreated', async (message: FeedWebSocketMessage) => {
      this.eventHandlers.onPostCreated?.(message.data as PostResponse);
    });

    this.messageRouter.registerHandler('handlePostUpdated', async (message: FeedWebSocketMessage) => {
      this.eventHandlers.onPostUpdated?.(message.data as PostResponse);
    });

    this.messageRouter.registerHandler('handlePostDeleted', async (message: FeedWebSocketMessage) => {
      this.eventHandlers.onPostDeleted?.(message.data.postId as ResId);
    });

    this.messageRouter.registerHandler('handleReactionAdded', async (message: FeedWebSocketMessage) => {
      const { postId, userId, reactionType } = message.data;
      this.eventHandlers.onReactionAdded?.(postId as ResId, userId as ResId, reactionType);
    });

    this.messageRouter.registerHandler('handleReactionRemoved', async (message: FeedWebSocketMessage) => {
      const { postId, userId, reactionType } = message.data;
      this.eventHandlers.onReactionRemoved?.(postId as ResId, userId as ResId, reactionType);
    });

    this.messageRouter.registerHandler('handleCommentAdded', async (message: FeedWebSocketMessage) => {
      const { postId, comment } = message.data;
      this.eventHandlers.onCommentAdded?.(postId as ResId, comment);
    });

    this.messageRouter.registerHandler('handleTrendingUpdate', async (message: FeedWebSocketMessage) => {
      this.eventHandlers.onTrendingUpdate?.(message.data.posts as PostResponse[]);
    });
  }

  /**
   * Set up connection monitoring
   */
  private setupConnectionMonitoring(): void {
    this.enterpriseWebSocket.onConnect(() => {
      this.eventHandlers.onConnectionChange?.(true);
    });

    this.enterpriseWebSocket.onDisconnect(() => {
      this.eventHandlers.onConnectionChange?.(false);
    });
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): FeedAdapterConfig {
    return {
      enableRealtimeUpdates: true,
      enableTrendingUpdates: true,
      enableBatchProcessing: true,
      enableFeedRefresh: true,
      enablePollUpdates: true,
      batchSize: 10,
      batchTimeout: 2000,
      updateInterval: 5000,
      trendingRefreshInterval: 30000,
      maxCacheSize: 1000,
      cacheTTL: 300000
    };
  }

  /**
   * Get default metrics
   */
  private getDefaultMetrics(): FeedAdapterMetrics {
    return {
      postsCreated: 0,
      postsUpdated: 0,
      postsDeleted: 0,
      reactionsProcessed: 0,
      commentsProcessed: 0,
      pollsCreated: 0,
      pollsUpdated: 0,
      pollVotesProcessed: 0,
      batchesProcessed: 0,
      batchItemsProcessed: 0,
      batchTimeouts: 0,
      feedRefreshes: 0,
      trendingUpdates: 0,
      cacheHits: 0,
      cacheMisses: 0,
      connectionUptime: 0,
      reconnectionAttempts: 0,
      connectionErrors: 0,
      averageUpdateLatency: 0,
      updateSuccessRate: 100,
      cacheHitRate: 0,
      errorCount: 0,
      validationErrors: 0,
      processingErrors: 0,
      lastActivity: Date.now(),
      activeSubscriptions: 0,
      queuedUpdates: 0
    };
  }
}
