/**
 * Post Data Service Interface
 * 
 * Defines the contract for post data operations.
 * Follows dependency injection principles for better testability and flexibility.
 */

import type {
    PostQuery,
    PostResponse,
    PostRequest,
    RepostRequest,
    ReactionRequest
} from '@/features/feed/domain';
import type { ResId } from '@/shared/api/models/common';

/**
 * Interface for Post Data Service operations
 */
export interface IPostDataService {
    // ===== BASIC CRUD OPERATIONS =====

    /**
     * Get post by ID
     */
    getPostById(postId: ResId, token: string): Promise<PostResponse>;

    /**
     * Create new post
     */
    createPost(post: PostRequest, token: string): Promise<PostResponse>;

    /**
     * Update post
     */
    updatePost(postId: ResId, updateData: any, token: string): Promise<PostResponse>;

    /**
     * Delete post
     */
    deletePost(postId: ResId, token: string): Promise<void>;

    // ===== BATCH OPERATIONS =====

    /**
     * Get multiple posts by IDs
     */
    getPostsBatch(postIds: ResId[], token: string): Promise<Map<ResId, PostResponse>>;

    /**
     * Get posts (general query method)
     */
    getPosts(query: PostQuery, token: string): Promise<{ content: PostResponse[]; number: number; size: number; totalElements: number; first: boolean; last: number }>;

    // ===== INTERACTIONS =====

    /**
     * Add reaction to post
     */
    reaction(reaction: ReactionRequest, token: string): Promise<void>;

    /**
     * Vote on poll
     */
    votePoll(vote: any, token: string): Promise<void>;

    /**
     * Get posts for a specific user
     */
    getPostsByUserId(userId: ResId, options: any, token: string): Promise<PostResponse[]>;

    /**
     * Get user posts (alias for getPostsByUserId)
     */
    getUserPosts(userId: ResId, options: any, token: string): Promise<PostResponse[]>;

    // ===== CACHE MANAGEMENT =====

    /**
     * Invalidate post cache
     */
    invalidatePostCache(postId: ResId): void;

    /**
     * Invalidate user-specific post caches
     */
    invalidateUserCaches(userId: ResId): void;

    /**
     * Invalidate all post caches
     */
    invalidateAll(): void;

    /**
     * Get cache statistics
     */
    getCacheStats(): any;
}
