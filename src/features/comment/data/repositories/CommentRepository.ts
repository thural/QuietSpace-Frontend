import type { AxiosInstance } from 'axios';
import { Inject, Injectable } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { POST_URL, COMMENT_PATH } from "@/core/shared/apiPath";
import { CommentRequest, CommentResponse, PagedComment } from "../models/comment";
import { ResId } from "@/shared/api/models/common";
import type { ICommentRepository } from "../../domain/repositories/ICommentRepository";

/**
 * Comment Repository - Handles comment-related API operations
 */
@Injectable()
export class CommentRepository implements ICommentRepository {
    constructor(@Inject(TYPES.API_CLIENT) private apiClient: AxiosInstance) { }

    async createComment(body: CommentRequest): Promise<CommentResponse> {
        const { data } = await this.apiClient.post(COMMENT_PATH, body);
        return data;
    }

    async deleteComment(commentId: ResId): Promise<Response> {
        return await this.apiClient.delete(COMMENT_PATH + `/${commentId}`);
    }

    async getCommentsByPostId(postId: ResId, pageParams?: string): Promise<PagedComment> {
        const { data } = await this.apiClient.get(COMMENT_PATH + `/post/${postId}` + (pageParams || ""));
        return data;
    }

    async getLatestComment(userId: ResId, postId: ResId): Promise<CommentResponse> {
        const { data } = await this.apiClient.get(COMMENT_PATH + `/user/${userId}/post/${postId}/latest`);
        return data;
    }
}
