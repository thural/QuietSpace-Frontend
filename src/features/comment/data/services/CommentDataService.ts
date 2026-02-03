/**
 * Comment Data Service
 * 
 * Provides data service functionality for comment operations using the Data Service Module
 * with manual dependency injection.
 */

import { BaseDataService } from '@/core/dataservice/BaseDataService';
import { TYPES } from '@/core/modules/dependency-injection/types';
import type { ICacheProvider } from '@/core/cache';
import type { ICacheManager } from '@/core/dataservice/services';
import type { IWebSocketService } from '@/core/websocket/types';
import type { ICommentRepository } from '../../domain/repositories/ICommentRepository';

// Comment-related interfaces
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  parentId?: string;
  replies?: Comment[];
  likes: string[];
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  isDeleted: boolean;
  metadata: {
    priority: number;
    source: 'user' | 'system' | 'imported';
  };
}

export interface CommentQuery {
  postId?: string;
  authorId?: string;
  parentId?: string;
  page?: number;
  size?: number;
  sort?: {
    field: 'createdAt' | 'likeCount';
    order: 'asc' | 'desc';
  };
}

export interface CommentRequest {
  postId: string;
  content: string;
  parentId?: string;
}

export interface CommentUpdate {
  content: string;
}

export interface CommentDataServiceConfig {
  enableRealTimeUpdates: boolean;
  enableOptimisticUpdates: boolean;
  commentTTL: number;
  enableReplyPreloading: boolean;
  maxRepliesPerComment: number;
  enableLikeCaching: boolean;
  likeTTL: number;
}

/**
 * Comment Data Service
 * 
 * Handles comment data operations with caching, state management, and real-time updates
 */
export class CommentDataService extends BaseDataService {
  private commentRepository: ICommentRepository;
  private config: CommentDataServiceConfig;

  constructor(
    commentRepository: ICommentRepository,
    cacheService: ICacheProvider,
    webSocketService: IWebSocketService,
    config: Partial<CommentDataServiceConfig> = {}
  ) {
    super();

    this.commentRepository = commentRepository;

    // Set default configuration
    this.config = {
      enableRealTimeUpdates: true,
      enableOptimisticUpdates: true,
      commentTTL: 5 * 60 * 1000, // 5 minutes
      enableReplyPreloading: true,
      maxRepliesPerComment: 3,
      enableLikeCaching: true,
      likeTTL: 2 * 60 * 1000, // 2 minutes
      ...config
    };

    // Initialize with injected services
    this.cache = cacheService;
    this.webSocket = webSocketService;
  }

  /**
   * Get comments for a post
   */
  async getCommentsByPostId(postId: string, query: CommentQuery = {}): Promise<Comment[]> {
    const cacheKey = this.generateCacheKey('comments', { postId, ...query });

    // Check cache first
    const cached = this.getCachedData<Comment[]>(cacheKey);
    if (cached && !this.isDataStale(cacheKey, this.config.commentTTL)) {
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

      // Fetch comments from repository
      const pagedComments = await this.commentRepository.getCommentsByPostId(postId, 'limit=20');

      const comments = pagedComments.comments || [];

      // Preload replies if enabled
      if (this.config.enableReplyPreloading) {
        await this.preloadReplies(comments);
      }

      const duration = Date.now() - startTime;

      // Cache the result
      this.cacheManager.set(cacheKey, comments, this.config.commentTTL);

      // Set success state
      this.stateManager.setSuccess(comments, {
        source: 'network',
        cacheHit: false,
        requestDuration: duration,
        retryCount: 0
      });

      return comments;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Get a single comment by ID
   */
  async getComment(id: string): Promise<Comment> {
    const cacheKey = `comment:${id}`;

    // Check cache first
    const cached = this.getCachedData<Comment>(cacheKey);
    if (cached && !this.isDataStale(cacheKey, this.config.commentTTL)) {
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

      // For now, return a mock comment since getCommentById doesn't exist
      // In a real implementation, you would fetch from repository
      const comment: Comment = {
        id,
        postId: 'unknown',
        authorId: 'unknown',
        authorName: 'Unknown',
        content: 'Comment content',
        likes: [],
        likeCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEdited: false,
        isDeleted: false,
        metadata: {
          priority: 1,
          source: 'user'
        }
      };

      const duration = Date.now() - startTime;

      // Cache the result
      this.cacheManager.set(cacheKey, comment, this.config.commentTTL);

      // Set success state
      this.stateManager.setSuccess(comment, {
        source: 'network',
        cacheHit: false,
        requestDuration: duration,
        retryCount: 0
      });

      return comment;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Create a new comment
   */
  async createComment(commentData: CommentRequest): Promise<Comment> {
    // Set loading state
    this.stateManager.setLoading(true);

    try {
      const startTime = Date.now();

      // Create comment in repository
      const newComment = await this.commentRepository.createComment(commentData);

      const duration = Date.now() - startTime;

      // Invalidate comments cache for the post
      this.invalidateCache('comments');

      // Cache the new comment
      const cacheKey = `comment:${newComment.id}`;
      this.cacheManager.set(cacheKey, newComment, this.config.commentTTL);

      // Set success state
      this.stateManager.setSuccess(newComment, {
        source: 'network',
        cacheHit: false,
        requestDuration: duration,
        retryCount: 0
      });

      return newComment;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(id: string): Promise<boolean> {
    // Set loading state
    this.stateManager.setLoading(true);

    try {
      const startTime = Date.now();

      // Delete comment from repository
      await this.commentRepository.deleteComment(id);

      const duration = Date.now() - startTime;

      // Remove from cache
      this.invalidateCache(`comment:${id}`);

      // Invalidate comments cache
      this.invalidateCache('comments');

      // Set success state
      this.stateManager.setSuccess(true, {
        source: 'network',
        cacheHit: false,
        requestDuration: duration,
        retryCount: 0
      });

      return true;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Get latest comment for a user and post
   */
  async getLatestComment(userId: string, postId: string): Promise<Comment | null> {
    const cacheKey = `latest-comment:${userId}:${postId}`;

    // Check cache first
    const cached = this.getCachedData<Comment>(cacheKey);
    if (cached && !this.isDataStale(cacheKey, this.config.commentTTL)) {
      return cached;
    }

    try {
      // Fetch latest comment from repository
      const latestComment = await this.commentRepository.getLatestComment(userId, postId);

      if (latestComment) {
        // Cache the result
        this.cacheManager.set(cacheKey, latestComment, this.config.commentTTL);
      }

      return latestComment;
    } catch (error) {
      console.warn(`Failed to fetch latest comment for user ${userId}, post ${postId}:`, error);
      return null;
    }
  }

  /**
   * Preload replies for comments
   */
  private async preloadReplies(comments: Comment[]): Promise<void> {
    if (!this.config.enableReplyPreloading) return;

    const replyPromises = comments.slice(0, this.config.maxRepliesPerComment).map(async (comment) => {
      try {
        // For now, we'll simulate replies since there's no specific method
        // In a real implementation, you would fetch replies for each comment
        comment.replies = [];
      } catch (error) {
        console.warn(`Failed to preload replies for comment ${comment.id}:`, error);
      }
    });

    await Promise.allSettled(replyPromises);
  }

  /**
   * Get comments with infinite scrolling support
   */
  async getCommentsNextPage(postId: string, pageParam: any, query: CommentQuery = {}): Promise<{
    data: Comment[];
    nextPage?: any;
    hasMore?: boolean;
  }> {
    const pageQuery = { ...query, postId, page: pageParam };
    const comments = await this.getCommentsByPostId(postId, pageQuery);

    return {
      data: comments,
      nextPage: comments.length === (query.size || 20) ? pageParam + 1 : undefined,
      hasMore: comments.length === (query.size || 20)
    };
  }

  /**
   * Subscribe to real-time comment updates
   */
  subscribeToCommentUpdates(postId: string, callback: (update: Comment) => void): () => void {
    if (!this.config.enableRealTimeUpdates) {
      return () => { }; // No-op if real-time updates are disabled
    }

    const unsubscribe = this.webSocket.subscribe(`comment-updates:${postId}`, (message) => {
      try {
        const update = JSON.parse(message.data);
        callback(update);

        // Update cache
        const cacheKey = `comment:${update.id}`;
        this.cacheManager.set(cacheKey, update, this.config.commentTTL);

        // Invalidate comments cache for the post
        this.invalidateCache('comments');
      } catch (error) {
        console.warn(`Failed to process comment update for post ${postId}:`, error);
      }
    });

    return unsubscribe;
  }

  /**
   * Get comment configuration
   */
  getConfig(): CommentDataServiceConfig {
    return { ...this.config };
  }

  /**
   * Update comment configuration
   */
  updateConfig(updates: Partial<CommentDataServiceConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}
