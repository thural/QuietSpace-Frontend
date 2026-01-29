/**
 * Post Repository Interface.
 * 
 * Defines the contract for post data operations following the Repository pattern.
 * This interface enables dependency injection and mocking for testing.
 */

import type { ResId } from '@/shared/api/models/common';
import type {
    PostPage,
    PostResponse,
    PostRequest,
    RepostRequest,
    VoteBody,
    ContentPrivacy
} from '@/features/feed/data/models/post';
import { ReactionRequest } from '@feed/data/models/reaction';

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
    getPosts(query: PostQuery): Promise<PostPage>;
    getPostById(postId: ResId): Promise<PostResponse>;
    getPostsByUserId(userId: ResId, query: PostQuery): Promise<PostPage>;
    getSavedPosts(query: PostQuery): Promise<PostPage>;
    getRepliedPosts(userId: ResId, query: PostQuery): Promise<PostPage>;
    searchPosts(queryText: string, query: PostQuery): Promise<PostPage>;

    // Mutation operations
    createPost(post: PostRequest): Promise<PostResponse>;
    createRepost(repost: RepostRequest): Promise<PostResponse>;
    editPost(postId: ResId, post: PostRequest): Promise<PostResponse>;
    deletePost(postId: ResId): Promise<void>;

    // Interaction operations
    savePost(postId: ResId): Promise<void>;
    unsavePost(postId: ResId): Promise<void>;
    votePoll(vote: VoteBody): Promise<void>;
    reaction(reaction: ReactionRequest): Promise<void>;
}
