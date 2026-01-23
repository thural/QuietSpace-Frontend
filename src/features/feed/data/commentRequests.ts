import {COMMENT_PATH} from "@/shared/constants/apiPath";
import {apiClient} from "@/core/network/rest/apiClient";
import {CommentRequest, CommentResponse, PagedComment} from "@/features/feed/data/models/comment";
import {JwtToken, ResId} from "@/shared/api/models/common";


export const fetchCreateComment = async (body: CommentRequest, token: JwtToken): Promise<CommentResponse> => {
    const { data } = await apiClient.post(COMMENT_PATH, body);
    return data;
};

export const fetchDeleteComment = async (commentId: ResId, token: JwtToken): Promise<Response> => (
    await apiClient.delete(COMMENT_PATH + `/${commentId}`)
);

export const fetchCommentsByPostId = async (postId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<PagedComment> => {
    const { data } = await apiClient.get(COMMENT_PATH + `/post/${postId}` + (pageParams || ""));
    return data;
};

export const fetchLatestComment = async (userId: ResId, postId: ResId, token: JwtToken): Promise<CommentResponse> => {
    const { data } = await apiClient.get(COMMENT_PATH + `/user/${userId}/post/${postId}/latest`);
    return data;
};