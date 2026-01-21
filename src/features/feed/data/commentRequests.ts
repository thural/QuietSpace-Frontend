import { COMMENT_PATH } from "@/shared/constants/apiPath";
import { getWrappedApiResponse } from "./fetchApiClient";
import { CommentRequest, CommentResponse, PagedComment } from "@/features/feed/data/models/comment";
import { JwtToken, ResId } from "@/shared/api/models/common";


export const fetchCreateComment = async (body: CommentRequest, token: JwtToken): Promise<CommentResponse> => (
    await getWrappedApiResponse(COMMENT_PATH, 'POST', body, token)
).json();

export const fetchDeleteComment = async (commentId: ResId, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(COMMENT_PATH + `/${commentId}`, 'DELETE', null, token)
);

export const fetchCommentsByPostId = async (postId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<PagedComment> => (
    await getWrappedApiResponse(COMMENT_PATH + `/post/${postId}` + (pageParams || ""), 'GET', null, token)
).json();

export const fetchLatestComment = async (userId: ResId, postId: ResId, token: JwtToken): Promise<CommentResponse> => (
    await getWrappedApiResponse(COMMENT_PATH + `/user/${userId}/post/${postId}/latest`, 'GET', null, token)
).json();