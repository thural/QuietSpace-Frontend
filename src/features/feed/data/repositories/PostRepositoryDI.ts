/**
 * DI-Enabled Post Repository Implementation.
 * 
 * Uses dependency injection to get the API client instead of manual token management.
 * This demonstrates the benefits of DI for centralized HTTP handling.
 */

import type { ResId } from '../../../../shared/api/models/common';
import type {
    PostPage,
    PostResponse,
    PostRequest,
    RepostRequest,
    VoteBody
} from '../models/post';
import type {
    IPostRepository,
    PostQuery,
    PostFilters
} from '../../domain/entities/IPostRepository';
import { PostFactory } from '../../domain/entities/PostEntities';
import { buildPageParams } from '../../../../shared/utils/fetchUtils';
import { AxiosInstance } from 'axios';

/**
 * DI-enabled post repository that receives API client via constructor
 */
export class PostRepositoryDI implements IPostRepository {
    constructor(private readonly apiClient: AxiosInstance) {}

    // Query operations
    async getPosts(query: PostQuery): Promise<PostPage> {
        let pageParams = buildPageParams(query.page || 0, query.size || 10);

        // Add sorting parameters
        if (query.sortBy) {
            pageParams += `&sort=${query.sortBy},${query.sortDirection || 'desc'}`;
        }

        // Add filter parameters
        if (query.contentPrivacy) {
            pageParams += `&privacy=${query.contentPrivacy}`;
        }

        const response = await this.apiClient.get<PostPage>(`/posts${pageParams ? '?' + pageParams : ''}`);
        return response.data;
    }

    async getPostById(postId: ResId): Promise<PostResponse> {
        const response = await this.apiClient.get<PostResponse>(`/posts/${postId}`);
        return response.data;
    }

    async getPostsByUserId(userId: ResId, query: PostQuery): Promise<PostPage> {
        const pageParams = buildPageParams(query.page || 0, query.size || 10);
        const response = await this.apiClient.get<PostPage>(`/posts/user/${userId}${pageParams ? '?' + pageParams : ''}`);
        return response.data;
    }

    async getSavedPosts(query: PostQuery): Promise<PostPage> {
        const pageParams = buildPageParams(query.page || 0, query.size || 10);
        const response = await this.apiClient.get<PostPage>(`/posts/saved${pageParams ? '?' + pageParams : ''}`);
        return response.data;
    }

    async getRepliedPosts(userId: ResId, query: PostQuery): Promise<PostPage> {
        const pageParams = buildPageParams(query.page || 0, query.size || 10);
        const response = await this.apiClient.get<PostPage>(`/posts/user/${userId}/commented${pageParams ? '?' + pageParams : ''}`);
        return response.data;
    }

    async searchPosts(queryText: string, query: PostQuery): Promise<PostPage> {
        const pageParams = buildPageParams(query.page || 0, query.size || 10);
        const response = await this.apiClient.get<PostPage>(`/posts/search?query=${queryText}${pageParams ? '&' + pageParams : ''}`);
        return response.data;
    }

    // Mutation operations
    async createPost(post: PostRequest): Promise<PostResponse> {
        const response = await this.apiClient.post<PostResponse>('/posts', post);
        return response.data;
    }

    async createRepost(repost: RepostRequest): Promise<PostResponse> {
        const response = await this.apiClient.post<PostResponse>('/posts/repost', repost);
        return response.data;
    }

    async editPost(postId: ResId, post: PostRequest): Promise<PostResponse> {
        const response = await this.apiClient.put<PostResponse>(`/posts/${postId}`, post);
        return response.data;
    }

    async deletePost(postId: ResId): Promise<void> {
        await this.apiClient.delete(`/posts/${postId}`);
    }

    // Interaction operations
    async savePost(postId: ResId): Promise<void> {
        await this.apiClient.patch(`/posts/saved/${postId}`);
    }

    async unsavePost(postId: ResId): Promise<void> {
        // Note: API might need an unsave endpoint, for now using save with toggle
        await this.apiClient.patch(`/posts/saved/${postId}`);
    }

    async votePoll(vote: VoteBody): Promise<void> {
        await this.apiClient.post('/posts/vote-poll', vote);
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
