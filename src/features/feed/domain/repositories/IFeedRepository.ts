/**
 * Feed Repository Interface.
 * 
 * Defines the contract for feed data operations following the Repository pattern.
 * This interface enables dependency injection and mocking for testing.
 * 
 * This interface combines post and comment operations specifically for the FeedDataLayer,
 * providing a unified interface for all feed-related data operations.
 */

import type { ResId } from '@/shared/api/models/common';
import type {
    PostPage,
    PostResponse,
    PostRequest
} from '@/features/feed/data/models/post';
import type {
    CommentRequest,
    CommentResponse,
    PagedComment
} from '@/features/feed/data/models/comment';

/**
 * Query parameters for feed operations
 */
export interface FeedQueryOptions {
    page?: number;
    limit?: number;
    userId?: string;
    filters?: any;
}

/**
 * Comment query options
 */
export interface CommentQueryOptions {
    page?: number;
    limit?: number;
}

/**
 * Like toggle result
 */
export interface LikeToggleResult {
    likes: string[];
    likeCount: number;
}

/**
 * Repository interface for feed data operations
 * 
 * This interface provides a unified API for all feed-related operations
 * that the FeedDataLayer needs to perform.
 */
export interface IFeedRepository {
    // Feed operations
    getFeedPosts(options: FeedQueryOptions): Promise<any[]>;
    
    // Post operations
    getPost(postId: string): Promise<any>;
    createPost(postData: PostRequest): Promise<any>;
    updatePost(postId: string, updateData: any): Promise<any>;
    togglePostLike(postId: string, userId: string): Promise<LikeToggleResult>;
    
    // Comment operations
    getPostComments(postId: string, options: CommentQueryOptions): Promise<any>;
    addComment(postId: string, commentData: CommentRequest): Promise<CommentResponse>;
}
