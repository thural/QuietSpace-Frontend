/**
 * Comment Repository Interface.
 * 
 * Defines the contract for comment data operations following the Repository pattern.
 * This interface enables dependency injection and mocking for testing.
 */

import type { ResId } from '@/shared/api/models/common';
import type {
    CommentRequest,
    CommentResponse,
    PagedComment
} from '@/features/feed/data/models/comment';

/**
 * Query parameters for comment filtering and pagination
 */
export interface CommentQuery {
    postId?: ResId;
    userId?: ResId;
    page?: number;
    size?: number;
    sortBy?: 'createdAt' | 'likesCount';
    sortDirection?: 'asc' | 'desc';
}

/**
 * Repository interface for comment data operations
 */
export interface ICommentRepository {
    // Query operations
    getCommentsByPostId(postId: ResId, pageParams?: string): Promise<PagedComment>;
    getLatestComment(userId: ResId, postId: ResId): Promise<CommentResponse>;
    
    // Mutation operations
    createComment(body: CommentRequest): Promise<CommentResponse>;
    deleteComment(commentId: ResId): Promise<Response>;
}
