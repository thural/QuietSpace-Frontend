/**
 * Post Data Service
 * 
 * Provides data service functionality for post operations using the Data Service Module
 * with DI decorators for dependency injection.
 */

import { Injectable, Inject } from '@/core/di/decorators';
import { BaseDataService } from '@/core/dataservice/BaseDataService';
import { TYPES } from '@/core/di/types';
import type { ICacheProvider } from '@/core/cache';
import type { ICacheManager } from '@/core/dataservice/services';
import type { IWebSocketService } from '@/core/websocket/types';
import type { IPostRepository } from '../../domain/repositories/IPostRepository';
import type { ICommentRepository } from '@/features/feed/comments/domain/repositories/ICommentRepository';

// Post-related interfaces
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  likeCount: number;
  comments: any[];
  commentCount: number;
  tags: string[];
  isEdited: boolean;
  metadata: {
    visibility: 'public' | 'private' | 'friends';
    priority: number;
    source: 'user' | 'system' | 'imported';
  };
}

export interface PostQuery {
  page?: number;
  size?: number;
  authorId?: string;
  tags?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  sort?: {
    field: 'createdAt' | 'updatedAt' | 'likeCount' | 'commentCount';
    order: 'asc' | 'desc';
  };
}

export interface PostRequest {
  title: string;
  content: string;
  tags?: string[];
  visibility?: 'public' | 'private' | 'friends';
}

export interface PostUpdate {
  title?: string;
  content?: string;
  tags?: string[];
  visibility?: 'public' | 'private' | 'friends';
}

export interface PostDataServiceConfig {
  enableRealTimeUpdates: boolean;
  enableOptimisticUpdates: boolean;
  postTTL: number;
  enableCommentPreloading: boolean;
  maxCommentsPerPost: number;
  enableLikeCaching: boolean;
  likeTTL: number;
}

/**
 * Post Data Service
 * 
 * Handles post data operations with caching, state management, and real-time updates
 */
@Injectable({
  lifetime: 'singleton',
  dependencies: [
    TYPES.IPOST_REPOSITORY,
    TYPES.ICOMMENT_REPOSITORY,
    TYPES.CACHE_SERVICE,
    TYPES.WEBSOCKET_SERVICE
  ]
})
export class PostDataService extends BaseDataService {
  private postRepository: IPostRepository;
  private commentRepository: ICommentRepository;
  private config: PostDataServiceConfig;

  constructor(
    @Inject(TYPES.IPOST_REPOSITORY) postRepository: IPostRepository,
    @Inject(TYPES.ICOMMENT_REPOSITORY) commentRepository: ICommentRepository,
    @Inject(TYPES.CACHE_SERVICE) cacheService: ICacheProvider,
    @Inject(TYPES.WEBSOCKET_SERVICE) webSocketService: IWebSocketService,
    config: Partial<PostDataServiceConfig> = {}
  ) {
    super();

    this.postRepository = postRepository;
    this.commentRepository = commentRepository;

    // Set default configuration
    this.config = {
      enableRealTimeUpdates: true,
      enableOptimisticUpdates: true,
      postTTL: 10 * 60 * 1000, // 10 minutes
      enableCommentPreloading: false,
      maxCommentsPerPost: 5,
      enableLikeCaching: true,
      likeTTL: 2 * 60 * 1000, // 2 minutes
      ...config
    };

    // Initialize with injected services
    this.cache = cacheService;
    this.webSocket = webSocketService;
  }

  /**
   * Get posts with pagination and filtering
   */
  async getPosts(query: PostQuery = {}): Promise<Post[]> {
    const cacheKey = this.generateCacheKey('posts', query);

    // Check cache first
    const cached = this.getCachedData<Post[]>(cacheKey);
    if (cached && !this.isDataStale(cacheKey, this.config.postTTL)) {
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

      // Fetch posts from repository
      const posts = await this.postRepository.getPosts({
        page: query.page || 1,
        limit: query.size || 20,
        authorId: query.authorId,
        tags: query.tags,
        dateRange: query.dateRange,
        sort: query.sort
      });

      const duration = Date.now() - startTime;

      // Cache the result
      this.cacheManager.set(cacheKey, posts, this.config.postTTL);

      // Set success state
      this.stateManager.setSuccess(posts, {
        source: 'network',
        cacheHit: false,
        requestDuration: duration,
        retryCount: 0
      });

      return posts;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Get a single post by ID
   */
  async getPost(id: string): Promise<Post> {
    const cacheKey = `post:${id}`;

    // Check cache first
    const cached = this.getCachedData<Post>(cacheKey);
    if (cached && !this.isDataStale(cacheKey, this.config.postTTL)) {
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

      // Fetch post from repository
      const post = await this.postRepository.getPost(id);

      const duration = Date.now() - startTime;

      // Cache the result
      this.cacheManager.set(cacheKey, post, this.config.postTTL);

      // Set success state
      this.stateManager.setSuccess(post, {
        source: 'network',
        cacheHit: false,
        requestDuration: duration,
        retryCount: 0
      });

      return post;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Create a new post
   */
  async createPost(postData: PostRequest): Promise<Post> {
    // Set loading state
    this.stateManager.setLoading(true);

    try {
      const startTime = Date.now();

      // Create post in repository
      const newPost = await this.postRepository.createPost(postData);

      const duration = Date.now() - startTime;

      // Invalidate posts cache
      this.invalidateCache('posts');

      // Cache the new post
      const cacheKey = `post:${newPost.id}`;
      this.cacheManager.set(cacheKey, newPost, this.config.postTTL);

      // Set success state
      this.stateManager.setSuccess(newPost, {
        source: 'network',
        cacheHit: false,
        requestDuration: duration,
        retryCount: 0
      });

      return newPost;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Update an existing post
   */
  async updatePost(id: string, updateData: PostUpdate): Promise<Post> {
    // Set loading state
    this.stateManager.setLoading(true);

    try {
      const startTime = Date.now();

      // Update post in repository
      const updatedPost = await this.postRepository.updatePost(id, updateData);

      const duration = Date.now() - startTime;

      // Update cache
      const cacheKey = `post:${id}`;
      this.cacheManager.set(cacheKey, updatedPost, this.config.postTTL);

      // Invalidate posts cache
      this.invalidateCache('posts');

      // Set success state
      this.stateManager.setSuccess(updatedPost, {
        source: 'network',
        cacheHit: false,
        requestDuration: duration,
        retryCount: 0
      });

      return updatedPost;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<boolean> {
    // Set loading state
    this.stateManager.setLoading(true);

    try {
      const startTime = Date.now();

      // Delete post from repository
      const success = await this.postRepository.deletePost(id);

      const duration = Date.now() - startTime;

      if (success) {
        // Remove from cache
        this.cacheManager.delete(`post:${id}`);

        // Invalidate posts cache
        this.invalidateCache('posts');
      }

      // Set success state
      this.stateManager.setSuccess(success, {
        source: 'network',
        cacheHit: false,
        requestDuration: duration,
        retryCount: 0
      });

      return success;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Toggle like on a post
   */
  async togglePostLike(postId: string, userId: string): Promise<{
    likes: string[];
    likeCount: number;
    isLiked: boolean;
  }> {
    const likeCacheKey = `post:${postId}:likes`;

    // Check like cache first
    if (this.config.enableLikeCaching) {
      const cached = this.getCachedData(likeCacheKey);
      if (cached && !this.isDataStale(likeCacheKey, this.config.likeTTL)) {
        return cached;
      }
    }

    try {
      // Toggle like in repository
      const result = await this.postRepository.togglePostLike(postId, userId);

      const likeResult = {
        likes: result.likes,
        likeCount: result.likeCount,
        isLiked: result.likes.includes(userId)
      };

      // Cache like result
      if (this.config.enableLikeCaching) {
        this.cacheManager.set(likeCacheKey, likeResult, this.config.likeTTL);
      }

      // Update post cache
      const postCacheKey = `post:${postId}`;
      const cachedPost = this.getCachedData<Post>(postCacheKey);
      if (cachedPost) {
        cachedPost.likes = result.likes;
        cachedPost.likeCount = result.likeCount;
        this.cacheManager.set(postCacheKey, cachedPost, this.config.postTTL);
      }

      return likeResult;
    } catch (error) {
      console.warn(`Failed to toggle like for post ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Get posts with infinite scrolling support
   */
  async getPostsNextPage(pageParam: any, query: PostQuery = {}): Promise<{
    data: Post[];
    nextPage?: any;
    hasMore?: boolean;
  }> {
    const pageQuery = { ...query, page: pageParam };
    const posts = await this.getPosts(pageQuery);

    return {
      data: posts,
      nextPage: posts.length === (query.size || 20) ? pageParam + 1 : undefined,
      hasMore: posts.length === (query.size || 20)
    };
  }

  /**
   * Subscribe to real-time post updates
   */
  subscribeToPostUpdates(postId: string, callback: (update: Post) => void): () => void {
    if (!this.config.enableRealTimeUpdates) {
      return () => { }; // No-op if real-time updates are disabled
    }

    const unsubscribe = this.webSocket.subscribe(`post-updates:${postId}`, (message) => {
      try {
        const update = JSON.parse(message.data);
        callback(update);

        // Update cache
        const cacheKey = `post:${postId}`;
        this.cacheManager.set(cacheKey, update, this.config.postTTL);

        // Invalidate posts cache
        this.invalidateCache('posts');
      } catch (error) {
        console.warn(`Failed to process post update for ${postId}:`, error);
      }
    });

    return unsubscribe;
  }

  /**
   * Get post configuration
   */
  getConfig(): PostDataServiceConfig {
    return { ...this.config };
  }

  /**
   * Update post configuration
   */
  updateConfig(updates: Partial<PostDataServiceConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}
