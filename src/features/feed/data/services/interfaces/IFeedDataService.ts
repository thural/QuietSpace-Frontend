/**
 * Feed Data Service Interface
 * 
 * Defines the contract for feed data operations.
 * Follows dependency injection principles for better testability and flexibility.
 */

import type {
    CommentRequest,
    CommentResponse,
    PagedComment
} from '@/features/feed/data/models/comment';
import type {
    PostQuery,
    PostRequest,
    PostResponse,
    ReactionRequest,
    VoteBody
} from '@/features/feed/domain';
import type { ResId } from '@/shared/api/models/common';

export interface FeedItem {
    id: string;
    post: PostResponse;
    comments?: PagedComment;
    latestComment?: CommentResponse;
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

export interface FeedDataServiceConfig {
    enableCommentPreloading: boolean;
    maxCommentsPerPost: number;
    feedTTL: number;
    enableSmartCaching: boolean;
    enableWebSocketRealtime: boolean;
    enableOptimisticUpdates: boolean;
}

/**
 * Main interface for Feed Data Service
 * Defines all operations that can be performed on feed data
 */
export interface IFeedDataService {
    // ===== CORE FEED OPERATIONS =====

    /**
     * Get feed with comments preloaded
     */
    getFeedWithComments(query: PostQuery, token: string): Promise<FeedPage>;

    /**
     * Get single post with comments
     */
    getPostWithComments(postId: ResId, token: string): Promise<FeedItem>;

    /**
     * Get single post
     */
    getPost(postId: string, token: string): Promise<PostResponse>;

    /**
     * Get post comments with pagination
     */
    getPostComments(postId: string, options: { page?: number; limit?: number }, token: string): Promise<any[]>;

    // ===== CRUD OPERATIONS =====

    /**
     * Create post with cache invalidation
     */
    createPostWithCache(post: PostRequest, token: string): Promise<PostResponse>;

    /**
     * Create comment with cache invalidation
     */
    createCommentWithCache(comment: CommentRequest): Promise<CommentResponse>;

    /**
     * Delete post with full cache invalidation
     */
    deletePostWithFullCacheInvalidation(postId: ResId, token: string): Promise<void>;

    /**
     * Delete comment with full cache invalidation
     */
    deleteCommentWithFullInvalidation(
        commentId: ResId,
        postId: ResId,
        userId: ResId
    ): Promise<Response>;

    // ===== INTERACTIONS =====

    /**
     * Vote on poll with cache invalidation
     */
    voteOnPollWithCache(vote: VoteBody, token: string): Promise<void>;

    /**
     * React to post with cache invalidation
     */
    reactToPostWithCache(reaction: ReactionRequest, token: string): Promise<void>;

    // ===== BATCH OPERATIONS =====

    /**
     * Get multiple posts with comments
     */
    getMultiplePostsWithComments(postIds: ResId[], token: string): Promise<FeedItem[]>;

    // ===== WEBSOCKET AND REAL-TIME =====

    /**
     * Setup WebSocket listeners for real-time updates
     */
    setupWebSocketListeners(): void;

    /**
     * Cleanup WebSocket listeners and resources
     */
    cleanup(): void;

    // ===== CACHE MANAGEMENT =====

    /**
     * Clear all caches
     */
    clearAllCaches(): void;

    /**
     * Get cache configuration and statistics
     */
    getCacheConfiguration(): any;

    /**
     * Invalidate feed caches
     */
    invalidateFeedCaches(): void;

    /**
     * Invalidate user-specific caches
     */
    invalidateUserCaches(userId: ResId): void;
}

/**
 * Factory interface for creating FeedDataService instances
 */
export interface IFeedDataServiceFactory {
    create(config?: Partial<FeedDataServiceConfig>): IFeedDataService;
    createWithDependencies(
        postService: any,
        commentService: any,
        config?: Partial<FeedDataServiceConfig>
    ): IFeedDataService;
}
