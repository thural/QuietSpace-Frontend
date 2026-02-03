import type { AxiosInstance } from 'axios';
import { Inject, Injectable } from '@/core/modules/dependency-injection';
import { TYPES } from '@/core/modules/dependency-injection/types';
import { POST_URL, COMMENT_PATH } from "@/core/shared/apiPath";
import { ResId } from "@/shared/api/models/common";
import { PostPage, PostRequest, PostResponse, RepostRequest, VoteBody } from "../models/post";
import { ReactionRequest } from "@/features/feed/data/models/reaction";
import type { IPostRepository, PostQuery } from "../../domain/repositories/IPostRepository";

/**
 * Post Repository - Handles post-related API operations
 */
@Injectable()
export class PostRepository implements IPostRepository {
    constructor(@Inject(TYPES.API_CLIENT) private apiClient: AxiosInstance) { }

    async getPosts(query: PostQuery): Promise<PostPage> {
        const pageParams = this.buildPageParams(query);
        const { data } = await this.apiClient.get(POST_URL + pageParams);
        return data;
    }

    async getPostById(postId: ResId): Promise<PostResponse> {
        const { data } = await this.apiClient.get(POST_URL + `/${postId}`);
        return data;
    }

    async getSavedPosts(query: PostQuery): Promise<PostPage> {
        const pageParams = this.buildPageParams(query);
        const { data } = await this.apiClient.get(POST_URL + "/saved" + pageParams);
        return data;
    }

    async getPostsByUserId(userId: ResId, query: PostQuery): Promise<PostPage> {
        const pageParams = this.buildPageParams(query);
        const { data } = await this.apiClient.get(POST_URL + `/user/${userId}` + pageParams);
        return data;
    }

    async searchPosts(queryText: string, query: PostQuery): Promise<PostPage> {
        const pageParams = this.buildPageParams(query);
        const { data } = await this.apiClient.get(POST_URL + `/search?query=${queryText}` + pageParams);
        return data;
    }

    async createRepost(repost: RepostRequest): Promise<PostResponse> {
        const { data } = await this.apiClient.post(POST_URL + "/repost", repost);
        return data;
    }

    async createPost(post: PostRequest): Promise<PostResponse> {
        const { data } = await this.apiClient.post(POST_URL, post, {
            headers: {
                ...(post instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {})
            }
        });
        return data;
    }

    async getRepliedPosts(userId: ResId, query: PostQuery): Promise<PostPage> {
        const pageParams = this.buildPageParams(query);
        const { data } = await this.apiClient.get(POST_URL + `/user/${userId}/commented` + pageParams);
        return data;
    }

    async editPost(postId: ResId, post: PostRequest): Promise<PostResponse> {
        const { data } = await this.apiClient.put(POST_URL + `/${postId}`, post);
        return data;
    }

    async deletePost(postId: ResId): Promise<void> {
        await this.apiClient.delete(POST_URL + `/${postId}`);
    }

    async unsavePost(postId: ResId): Promise<void> {
        await this.apiClient.delete(POST_URL + `/saved/${postId}`);
    }

    async reaction(reaction: ReactionRequest): Promise<void> {
        await this.apiClient.post(COMMENT_PATH + "/toggle-reaction", reaction);
    }

    async votePoll(vote: VoteBody): Promise<void> {
        await this.apiClient.post(POST_URL + "/vote-poll", vote);
    }

    async savePost(postId: ResId): Promise<void> {
        await this.apiClient.patch(POST_URL + `/saved/${postId}`, {});
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
}
