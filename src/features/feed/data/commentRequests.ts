import { COMMENT_PATH } from "@/shared/constants/apiPath";
import { createApiClient, type IApiClient } from "@/core/network";
import { CommentRequest, CommentResponse, PagedComment } from "@/features/feed/data/models/comment";
import { JwtToken, ResId } from "@/shared/api/models/common";

// Create authenticated API client
const apiClient: IApiClient = createApiClient();


export const fetchCreateComment = async (body: CommentRequest, token: JwtToken): Promise<CommentResponse> => {
    apiClient.setAuth(token);
    const response = await apiClient.post(COMMENT_PATH, body);
    return response.data;
};

export const fetchDeleteComment = async (commentId: ResId, token: JwtToken): Promise<void> => {
    apiClient.setAuth(token);
    await apiClient.delete(COMMENT_PATH + `/${commentId}`);
};

export const fetchCommentsByPostId = async (postId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<PagedComment> => {
    apiClient.setAuth(token);
    const response = await apiClient.get(COMMENT_PATH + `/post/${postId}` + (pageParams || ""));
    return response.data;
};

export const fetchLatestComment = async (userId: ResId, postId: ResId, token: JwtToken): Promise<CommentResponse> => {
    apiClient.setAuth(token);
    const response = await apiClient.get(COMMENT_PATH + `/user/${userId}/post/${postId}/latest`);
    return response.data;
};