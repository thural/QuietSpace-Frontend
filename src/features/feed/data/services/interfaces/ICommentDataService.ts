/**
 * Comment Data Service Interface
 * 
 * Defines the contract for comment data operations.
 * Follows dependency injection principles for better testability and flexibility.
 */

import type {
    CommentRequest,
    CommentResponse,
    PagedComment
} from '@/features/feed/data/models/comment';
import type { ResId } from '@/shared/api/models/common';

/**
 * Interface for Comment Data Service operations
 */
export interface ICommentDataService {
    // ===== BASIC CRUD OPERATIONS =====

    /**
     * Get comments by post ID
     */
    getCommentsByPostId(postId: ResId, queryParams: string): Promise<PagedComment>;

    /**
     * Create new comment
     */
    createComment(comment: CommentRequest): Promise<CommentResponse>;

    /**
     * Update comment
     */
    updateComment(commentId: ResId, updateData: any): Promise<CommentResponse>;

    /**
     * Delete comment
     */
    deleteComment(commentId: ResId): Promise<void>;

    /**
     * Delete comment with post ID validation
     */
    deleteCommentWithPostId(commentId: ResId, postId: ResId, userId: ResId): Promise<Response>;

    // ===== BATCH OPERATIONS =====

    /**
     * Get comments for multiple posts
     */
    getCommentsForMultiplePosts(postIds: ResId[], queryParams: string): Promise<Map<ResId, PagedComment>>;

    // ===== HEALTH AND MONITORING =====

    /**
     * Health check for the service
     */
    healthCheck(): Promise<{ status: string; timestamp: number }>;

    // ===== CACHE MANAGEMENT =====

    /**
     * Invalidate comments for a specific post
     */
    invalidatePostComments(postId: ResId): void;

    /**
     * Invalidate all comment caches
     */
    invalidateAllCommentCaches(): void;

    /**
     * Get cache statistics
     */
    getCacheStats(): any;
}
