/**
 * Post Repository Interface.
 * 
 * Defines the contract for post data operations following the Repository pattern.
 * This interface enables dependency injection and mocking for testing.
 */

import type { ResId } from '../../../../api/schemas/inferred/common';
import type { 
    PostPage, 
    PostResponse, 
    PostRequest, 
    RepostRequest, 
    VoteBody,
    ContentPrivacy 
} from '../../../../api/schemas/inferred/post';

/**
 * Query parameters for post filtering and pagination
 */
export interface PostQuery {
    userId?: ResId;
    query?: string;
    page?: number;
    size?: number;
    sortBy?: 'createdAt' | 'likesCount' | 'commentsCount';
    sortDirection?: 'asc' | 'desc';
    contentPrivacy?: ContentPrivacy;
}

/**
 * Filters for post queries
 */
export interface PostFilters {
    userId?: ResId;
    contentPrivacy?: ContentPrivacy;
    dateRange?: {
        from: Date;
        to: Date;
    };
    hasMedia?: boolean;
    isPinned?: boolean;
}

/**
 * Repository interface for post data operations
 */
export interface IPostRepository {
    // Query operations
    getPosts(query: PostQuery, token: string): Promise<PostPage>;
    getPostById(postId: ResId, token: string): Promise<PostResponse>;
    getPostsByUserId(userId: ResId, query: PostQuery, token: string): Promise<PostPage>;
    getSavedPosts(query: PostQuery, token: string): Promise<PostPage>;
    getRepliedPosts(userId: ResId, query: PostQuery, token: string): Promise<PostPage>;
    searchPosts(queryText: string, query: PostQuery, token: string): Promise<PostPage>;
    
    // Mutation operations
    createPost(post: PostRequest, token: string): Promise<PostResponse>;
    createRepost(repost: RepostRequest, token: string): Promise<PostResponse>;
    editPost(postId: ResId, post: PostRequest, token: string): Promise<PostResponse>;
    deletePost(postId: ResId, token: string): Promise<void>;
    
    // Interaction operations
    savePost(postId: ResId, token: string): Promise<void>;
    unsavePost(postId: ResId, token: string): Promise<void>;
    votePoll(vote: VoteBody, token: string): Promise<void>;
    
    // Utility operations
    validatePostContent(content: string): boolean;
    calculateEngagementScore(post: PostResponse): number;
}
