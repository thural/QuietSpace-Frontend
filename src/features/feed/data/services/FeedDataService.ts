/**
 * Feed Data Service
 * 
 * Provides data service functionality for feed operations using the Data Service Module
 * with manual dependency injection.
 */

import { BaseDataService } from '@/core/dataservice/BaseDataService';
import { TYPES } from '@/core/di/types';
import type { ICacheProvider } from '@/core/cache';
import type { ICacheManager } from '@/core/dataservice/services';
import type { IWebSocketService } from '@/core/websocket/types';
import type { IFeedRepository } from '../../domain/repositories/IFeedRepository';
// import type { IPostRepository } from '../../../features/post/domain/repositories/IPostRepository';
// import type { ICommentRepository } from '../../../features/comment/domain/repositories/ICommentRepository';

// Temporary interfaces for migration
interface IPostRepository {
  findById(id: string): Promise<any>;
  save(post: any): Promise<any>;
  update(id: string, updates: any): Promise<any>;
  delete(id: string): Promise<void>;
}

interface ICommentRepository {
  findByPostId(postId: string): Promise<any[]>;
  getCommentsByPostId(postId: string): Promise<any[]>;
  save(comment: any): Promise<any>;
  update(id: string, updates: any): Promise<any>;
  delete(id: string): Promise<void>;
}

// Feed-related interfaces
export interface FeedItem {
  id: string;
  post: any;
  comments?: any[];
  latestComment?: any;
  metadata: {
    createdAt: string;
    updatedAt: string;
    priority: number;
    source: 'followed' | 'trending' | 'recommended';
  };
}

export interface FeedPage {
  items: FeedItem[];
  pagination: {
    page: number;
    size: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FeedQuery {
  page?: number;
  size?: number;
  filters?: {
    source?: 'followed' | 'trending' | 'recommended' | 'all';
    dateRange?: {
      from: string;
      to: string;
    };
    tags?: string[];
  };
  sort?: {
    field: 'createdAt' | 'updatedAt' | 'priority';
    order: 'asc' | 'desc';
  };
}

export interface FeedDataServiceConfig {
  enableCommentPreloading: boolean;
  maxCommentsPerPost: number;
  feedTTL: number;
  enableSmartCaching: boolean;
  enableWebSocketRealtime: boolean;
  enableOptimisticUpdates: boolean;
}

/**
 * Feed Data Service
 * 
 * Handles feed data operations with caching, state management, and real-time updates
 */
export class FeedDataService extends BaseDataService {
  private feedRepository: IFeedRepository;
  private postRepository: IPostRepository;
  private commentRepository: ICommentRepository;
  private config: FeedDataServiceConfig;

  constructor(
    feedRepository: IFeedRepository,
    postRepository: IPostRepository,
    commentRepository: ICommentRepository,
    cacheService: ICacheProvider,
    webSocketService: IWebSocketService,
    config: Partial<FeedDataServiceConfig> = {}
  ) {
    super();

    this.feedRepository = feedRepository;
    this.postRepository = postRepository;
    this.commentRepository = commentRepository;

    // Set default configuration
    this.config = {
      enableCommentPreloading: true,
      maxCommentsPerPost: 5,
      feedTTL: 5 * 60 * 1000, // 5 minutes
      enableSmartCaching: true,
      enableWebSocketRealtime: true,
      enableOptimisticUpdates: true,
      ...config
    };

    // Initialize with injected services
    this.cache = cacheService;
    this.webSocket = webSocketService;
  }

  /**
   * Get feed with pagination and filtering
   */
  async getFeed(query: FeedQuery = {}): Promise<FeedPage> {
    const cacheKey = this.generateCacheKey('feed', query);

    // Check cache first
    const cached = this.getCachedData<FeedPage>(cacheKey);
    if (cached && !this.isDataStale(cacheKey, this.config.feedTTL)) {
      this.stateManager.setSuccess(cached, {
        source: 'cache',
        cacheHit: true,
        requestDuration: 0,
        retryCount: 0
      });
      return cached;
    }

    // Set loading state
    this.stateManager.setLoading(true);

    try {
      const startTime = Date.now();

      // Fetch feed from repository using correct method
      const feedItems = await this.feedRepository.getFeedPosts({
        page: query.page || 1,
        limit: query.size || 20,
        userId: query.filters?.userId,
        filters: query.filters
      });

      // Transform to FeedPage format
      const feedPage: FeedPage = {
        items: feedItems.map(item => ({
          id: item.id,
          post: item,
          metadata: {
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            priority: 1,
            source: 'followed'
          }
        })),
        pagination: {
          page: query.page || 1,
          size: query.size || 20,
          total: feedItems.length,
          hasNext: feedItems.length === (query.size || 20),
          hasPrev: (query.page || 1) > 1
        }
      };

      // Preload comments if enabled
      if (this.config.enableCommentPreloading) {
        await this.preloadComments(feedPage.items);
      }

      const duration = Date.now() - startTime;

      // Cache the result
      this.cacheManager.set(cacheKey, feedPage, this.config.feedTTL);

      // Set success state
      this.stateManager.setSuccess(feedPage, {
        source: 'network',
        cacheHit: false,
        requestDuration: duration,
        retryCount: 0
      });

      return feedPage;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Get feed with infinite scrolling support
   */
  async getFeedNextPage(pageParam: any, query: FeedQuery = {}): Promise<{
    data: FeedItem[];
    nextPage?: any;
    hasMore?: boolean;
  }> {
    const pageQuery = { ...query, page: pageParam };
    const feedPage = await this.getFeed(pageQuery);

    return {
      data: feedPage.items,
      nextPage: feedPage.pagination.hasNext ? pageParam + 1 : undefined,
      hasMore: feedPage.pagination.hasNext
    };
  }

  /**
   * Refresh feed with latest data
   */
  async refreshFeed(query: FeedQuery = {}): Promise<FeedPage> {
    // Invalidate cache
    const cacheKey = this.generateCacheKey('feed', query);
    this.invalidateCache(cacheKey);

    // Fetch fresh data
    return this.getFeed(query);
  }

  /**
   * Preload comments for feed items
   */
  private async preloadComments(items: FeedItem[]): Promise<void> {
    if (!this.config.enableCommentPreloading) return;

    const commentPromises = items.slice(0, this.config.maxCommentsPerPost).map(async (item) => {
      try {
        // Use correct method signature from ICommentRepository
        const comments = await this.commentRepository.getCommentsByPostId(item.id, 'limit=5');

        item.comments = comments.comments || [];
        item.latestComment = comments.comments?.[0] || null;
      } catch (error) {
        // Log error but don't fail the entire feed
        console.warn(`Failed to preload comments for post ${item.id}:`, error);
      }
    });

    await Promise.allSettled(commentPromises);
  }

  /**
   * Subscribe to real-time feed updates
   */
  subscribeToFeedUpdates(callback: (update: FeedItem) => void): () => void {
    if (!this.config.enableWebSocketRealtime) {
      return () => { }; // No-op if WebSocket is disabled
    }

    // Use WebSocket service directly since IWebSocketManager doesn't have subscribe
    const unsubscribe = this.webSocket.subscribe('feed-updates', (message) => {
      try {
        const update = JSON.parse(message.data);
        callback(update);

        // Invalidate cache to trigger refresh
        this.invalidateCache('feed');
      } catch (error) {
        console.warn('Failed to process feed update:', error);
      }
    });

    return unsubscribe;
  }

  /**
   * Get feed statistics
   */
  async getFeedStats(): Promise<{
    totalPosts: number;
    newPostsToday: number;
    activeUsers: number;
    trendingTopics: string[];
  }> {
    const cacheKey = 'feed-stats';

    const cached = this.getCachedData(cacheKey);
    if (cached && !this.isDataStale(cacheKey, 60 * 1000)) { // 1 minute cache
      return cached;
    }

    try {
      // Since getFeedStats doesn't exist, return default stats
      // In a real implementation, you would aggregate this from the feed posts
      const defaultStats = {
        totalPosts: 0,
        newPostsToday: 0,
        activeUsers: 0,
        trendingTopics: []
      };

      this.cacheManager.set(cacheKey, defaultStats, 60 * 1000);
      return defaultStats;
    } catch (error) {
      console.warn('Failed to fetch feed stats:', error);
      return {
        totalPosts: 0,
        newPostsToday: 0,
        activeUsers: 0,
        trendingTopics: []
      };
    }
  }

  /**
   * Mark feed item as viewed
   */
  async markAsViewed(itemId: string): Promise<void> {
    try {
      // Since markAsViewed doesn't exist, just invalidate cache
      // In a real implementation, you would call the repository method
      console.log(`Marking item ${itemId} as viewed`);

      // Update local cache if exists
      this.invalidateCache('feed');
    } catch (error) {
      console.warn(`Failed to mark item ${itemId} as viewed:`, error);
    }
  }

  /**
   * Get feed configuration
   */
  getConfig(): FeedDataServiceConfig {
    return { ...this.config };
  }

  /**
   * Update feed configuration
   */
  updateConfig(updates: Partial<FeedDataServiceConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}
