/**
 * Post Repository Implementation.
 * 
 * Concrete implementation of IPostRepository that handles all post data operations.
 * This class maps API responses to domain entities and handles data transformation.
 */

import type { ResId } from '@api/schemas/inferred/common';
import type { 
    PostPage, 
    PostResponse, 
    PostRequest, 
    RepostRequest, 
    VoteBody 
} from '@api/schemas/inferred/post';
import type { JwtToken } from '@api/schemas/inferred/common';
import type { 
    IPostRepository, 
    PostQuery, 
    PostFilters 
} from '../../domain/entities/IPostRepository';
import { PostFactory } from '../../domain/entities/PostEntities';
import { 
    fetchPosts,
    fetchPostById,
    fetchPostsByUserId,
    fetchSavedPostsByUser,
    fetchRepliedPostsByUserId,
    fetchPostQuery,
    fetchCreatePost,
    fetchCreateRepost,
    fetchEditPost,
    fetchDeletePost,
    fetchSavePost,
    fetchVotePoll
} from '@api/requests/postRequests';
import { buildPageParams } from '@utils/fetchUtils';

/**
 * Concrete implementation of post repository
 */
export class PostRepository implements IPostRepository {
    private readonly token: JwtToken;

    constructor(token: JwtToken) {
        this.token = token;
    }

    // Query operations
    async getPosts(query: PostQuery, token: string): Promise<PostPage> {
        let pageParams = buildPageParams(query.page || 0, query.size || 10);
        
        // Add sorting parameters
        if (query.sortBy) {
            pageParams += `&sort=${query.sortBy},${query.sortDirection || 'desc'}`;
        }
        
        // Add filter parameters
        if (query.contentPrivacy) {
            pageParams += `&privacy=${query.contentPrivacy}`;
        }

        return await fetchPosts(token, pageParams);
    }

    async getPostById(postId: ResId, token: string): Promise<PostResponse> {
        return await fetchPostById(postId, token);
    }

    async getPostsByUserId(userId: ResId, query: PostQuery, token: string): Promise<PostPage> {
        const pageParams = buildPageParams(query.page || 0, query.size || 10);
        return await fetchPostsByUserId(userId, token, pageParams);
    }

    async getSavedPosts(query: PostQuery, token: string): Promise<PostPage> {
        const pageParams = buildPageParams(query.page || 0, query.size || 10);
        return await fetchSavedPostsByUser(token, pageParams);
    }

    async getRepliedPosts(userId: ResId, query: PostQuery, token: string): Promise<PostPage> {
        const pageParams = buildPageParams(query.page || 0, query.size || 10);
        return await fetchRepliedPostsByUserId(userId, token, pageParams);
    }

    async searchPosts(queryText: string, query: PostQuery, token: string): Promise<PostPage> {
        const pageParams = buildPageParams(query.page || 0, query.size || 10);
        return await fetchPostQuery(queryText, token, pageParams);
    }

    // Mutation operations
    async createPost(post: PostRequest, token: string): Promise<PostResponse> {
        return await fetchCreatePost(post, token);
    }

    async createRepost(repost: RepostRequest, token: string): Promise<PostResponse> {
        return await fetchCreateRepost(repost, token);
    }

    async editPost(postId: ResId, post: PostRequest, token: string): Promise<PostResponse> {
        return await fetchEditPost(post, token, postId);
    }

    async deletePost(postId: ResId, token: string): Promise<void> {
        await fetchDeletePost(postId, token);
    }

    // Interaction operations
    async savePost(postId: ResId, token: string): Promise<void> {
        await fetchSavePost(postId, token);
    }

    async unsavePost(postId: ResId, token: string): Promise<void> {
        // Note: API might need an unsave endpoint, for now using save with toggle
        await fetchSavePost(postId, token);
    }

    async votePoll(vote: VoteBody, token: string): Promise<void> {
        await fetchVotePoll(vote, token);
    }

    // Utility operations
    validatePostContent(content: string): boolean {
        // Basic validation - can be enhanced with more complex rules
        return content.trim().length > 0 && content.trim().length <= 2000;
    }

    calculateEngagementScore(post: PostResponse): number {
        // Convert API response to domain entity for calculation
        const domainPost = PostFactory.fromApiResponse(post);
        return domainPost.getEngagementRate();
    }

    /**
     * Apply filters to post query
     */
    private applyFilters(query: PostQuery, filters: PostFilters): string {
        let params = '';

        if (filters.userId) {
            params += `&userId=${filters.userId}`;
        }

        if (filters.contentPrivacy) {
            params += `&privacy=${filters.contentPrivacy}`;
        }

        if (filters.dateRange) {
            params += `&from=${filters.dateRange.from.toISOString()}`;
            params += `&to=${filters.dateRange.to.toISOString()}`;
        }

        if (filters.hasMedia !== undefined) {
            params += `&hasMedia=${filters.hasMedia}`;
        }

        if (filters.isPinned !== undefined) {
            params += `&isPinned=${filters.isPinned}`;
        }

        return params;
    }
}
