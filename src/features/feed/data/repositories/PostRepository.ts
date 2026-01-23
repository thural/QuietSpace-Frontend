import type {AxiosInstance} from 'axios';
import {Inject, Injectable} from '@/core/di';
import {TYPES} from '@/core/di/types';
import {POST_URL, REACTION_PATH} from "@/shared/constants/apiPath";
import {ResId} from "@/shared/api/models/common";
import {PostPage, PostRequest, PostResponse, RepostRequest, VoteBody} from "@/features/feed/data/models/post";
import {ReactionRequest} from "@/features/feed/data/models/reaction";
import type {IPostRepository, PostQuery} from "@/features/feed/domain/entities/IPostRepository";

/**
 * Post Repository - Handles post-related API operations
 */
@Injectable()
export class PostRepository implements IPostRepository {
    constructor(@Inject(TYPES.API_CLIENT) private apiClient: AxiosInstance) {}

    async getPosts(query: PostQuery, token: string): Promise<PostPage> {
        const pageParams = this.buildPageParams(query);
        const { data } = await this.apiClient.get(POST_URL + pageParams, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async getPostById(postId: ResId, token: string): Promise<PostResponse> {
        const { data } = await this.apiClient.get(POST_URL + `/${postId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async getSavedPosts(query: PostQuery, token: string): Promise<PostPage> {
        const pageParams = this.buildPageParams(query);
        const { data } = await this.apiClient.get(POST_URL + "/saved" + pageParams, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async getPostsByUserId(userId: ResId, query: PostQuery, token: string): Promise<PostPage> {
        const pageParams = this.buildPageParams(query);
        const { data } = await this.apiClient.get(POST_URL + `/user/${userId}` + pageParams, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async searchPosts(queryText: string, query: PostQuery, token: string): Promise<PostPage> {
        const pageParams = this.buildPageParams(query);
        const { data } = await this.apiClient.get(POST_URL + `/search?query=${queryText}` + pageParams, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async createRepost(repost: RepostRequest, token: string): Promise<PostResponse> {
        const { data } = await this.apiClient.post(POST_URL + "/repost", repost, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async createPost(post: PostRequest, token: string): Promise<PostResponse> {
        const { data } = await this.apiClient.post(POST_URL, post, {
            headers: {
                ...(post instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}),
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    }

    async getRepliedPosts(userId: ResId, query: PostQuery, token: string): Promise<PostPage> {
        const pageParams = this.buildPageParams(query);
        const { data } = await this.apiClient.get(POST_URL + `/user/${userId}/commented` + pageParams, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async editPost(postId: ResId, post: PostRequest, token: string): Promise<PostResponse> {
        const { data } = await this.apiClient.put(POST_URL + `/${postId}`, post, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async deletePost(postId: ResId, token: string): Promise<void> {
        await this.apiClient.delete(POST_URL + `/${postId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    async unsavePost(postId: ResId, token: string): Promise<void> {
        await this.apiClient.delete(POST_URL + `/saved/${postId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    async reaction(reaction: ReactionRequest, token: string): Promise<void> {
        await this.apiClient.post(REACTION_PATH + "/toggle-reaction", reaction, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    validatePostContent(content: string): boolean {
        return content.trim().length > 0 && content.length <= 2000;
    }

    calculateEngagementScore(post: PostResponse): number {
        const likesWeight = 1;
        const commentsWeight = 2;
        const sharesWeight = 3;
        const reactionsWeight = 0.5;
        
        const likes = post.likesCount || 0;
        const comments = post.commentsCount || 0;
        const shares = post.sharesCount || 0;
        const reactions = post.reactions?.length || 0;
        
        return (likes * likesWeight) + (comments * commentsWeight) + (shares * sharesWeight) + (reactions * reactionsWeight);
    }

    private buildPageParams(query: PostQuery): string {
        const params = new URLSearchParams();
        if (query.page) params.append('page', query.page.toString());
        if (query.size) params.append('size', query.size.toString());
        if (query.sortBy) params.append('sort', query.sortBy);
        if (query.sortDirection) params.append('direction', query.sortDirection);
        if (query.contentPrivacy) params.append('privacy', query.contentPrivacy);
        
        const paramString = params.toString();
        return paramString ? `?${paramString}` : '';
    }

    async votePoll(vote: VoteBody, token: string): Promise<void> {
        await this.apiClient.post(POST_URL + "/vote-poll", vote, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    async savePost(postId: ResId, token: string): Promise<void> {
        await this.apiClient.patch(POST_URL + `/saved/${postId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}
