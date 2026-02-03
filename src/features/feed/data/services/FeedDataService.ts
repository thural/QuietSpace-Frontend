/**
 * Feed Data Service
 * 
 * Provides data service functionality for feed operations
 */

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

interface IFeedRepository {
  getFeedPosts(params: any): Promise<any[]>;
}

// Import and re-export types from interface file
import type {
  FeedItem,
  FeedPage,
  FeedDataServiceConfig
} from './interfaces/IFeedDataService';
import type { PagedComment } from '@/features/feed/data/models/comment';

// Re-export for use in other modules
export type { FeedItem, FeedPage, FeedDataServiceConfig, PagedComment };

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


/**
 * Feed Data Service
 * 
 * Handles feed data operations with caching, state management, and real-time updates
 */
export class FeedDataService {
  private feedRepository: IFeedRepository;
  private postRepository: IPostRepository;
  private commentRepository: ICommentRepository;
  private config: FeedDataServiceConfig;
  private cache: Map<string, any> = new Map();

  constructor(
    feedRepository: IFeedRepository,
    postRepository: IPostRepository,
    commentRepository: ICommentRepository,
    config: Partial<FeedDataServiceConfig> = {}
  ) {
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
  }

  /**
   * Get feed with pagination and filtering
   */
  async getFeed(query: FeedQuery = {}): Promise<FeedPage> {
    const cacheKey = `feed:${JSON.stringify(query)}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && !this.isDataStale(cacheKey)) {
      return cached;
    }

    try {
      // Fetch feed from repository using correct method
      const feedItems = await this.feedRepository.getFeedPosts({
        page: query.page || 1,
        limit: query.size || 20,
        filters: query.filters
      });

      // Transform to FeedPage format
      const feedPage: FeedPage = {
        items: feedItems.map((item: any) => ({
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

      // Cache the result
      this.cache.set(cacheKey, feedPage);

      return feedPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get single post with comments
   */
  async getPostWithComments(postId: string): Promise<FeedItem> {
    const cacheKey = `post-with-comments:${postId}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && !this.isDataStale(cacheKey)) {
      return cached;
    }

    try {
      // Get post from repository
      const post = await this.postRepository.findById(postId);

      // Get comments for the post
      const comments = await this.commentRepository.getCommentsByPostId(postId);

      // Transform comments array to PagedComment structure
      const pagedComments: PagedComment = {
        content: comments || [],
        pageable: {
          pageNumber: 0,
          pageSize: comments?.length || 0,
          sort: { sorted: false, unsorted: true, empty: true },
          offset: 0,
          paged: false,
          unpaged: true
        },
        totalPages: 1,
        totalElements: comments?.length || 0,
        last: true,
        first: true,
        size: comments?.length || 0,
        number: 0,
        sort: { sorted: false, unsorted: true, empty: true },
        numberOfElements: comments?.length || 0,
        empty: !comments || comments.length === 0
      };

      // Transform to FeedItem format
      const feedItem: FeedItem = {
        id: postId,
        post: post,
        comments: pagedComments,
        latestComment: comments?.[0] || null,
        metadata: {
          createdAt: post.createdAt || new Date().toISOString(),
          updatedAt: post.updatedAt || new Date().toISOString(),
          priority: 1,
          source: 'followed'
        }
      };

      // Cache the result
      this.cache.set(cacheKey, feedItem);

      return feedItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Preload comments for feed items
   */
  private async preloadComments(items: FeedItem[]): Promise<void> {
    if (!this.config.enableCommentPreloading) return;

    const commentPromises = items.slice(0, this.config.maxCommentsPerPost).map(async (item) => {
      try {
        // Use correct method signature from ICommentRepository
        const comments = await this.commentRepository.getCommentsByPostId(item.id);

        // Transform comments array to PagedComment structure
        const pagedComments: PagedComment = {
          content: comments || [],
          pageable: {
            pageNumber: 0,
            pageSize: comments?.length || 0,
            sort: { sorted: false, unsorted: true, empty: true },
            offset: 0,
            paged: false,
            unpaged: true
          },
          totalPages: 1,
          totalElements: comments?.length || 0,
          last: true,
          first: true,
          size: comments?.length || 0,
          number: 0,
          sort: { sorted: false, unsorted: true, empty: true },
          numberOfElements: comments?.length || 0,
          empty: !comments || comments.length === 0
        };

        item.comments = pagedComments;
        item.latestComment = comments?.[0] || null;
      } catch (error) {
        // Log error but don't fail the entire feed
        console.warn(`Failed to preload comments for post ${item.id}:`, error);
      }
    });

    await Promise.allSettled(commentPromises);
  }

  /**
   * Check if cached data is stale
   */
  private isDataStale(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return true;

    // Simple TTL check - in a real implementation, you'd store timestamps
    return false; // For now, assume cached data is fresh
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
