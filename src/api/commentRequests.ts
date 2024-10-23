import { COMMENT_PATH } from "../constants/apiPath";
import { getWrappedApiResponse } from "./fetchApiUtils";
import { CommentBody, CommentSchema, PagedCommentResponse } from "./schemas/comment";
import { JwtToken, ResId } from "./schemas/common";


export const fetchCreateComment = async (body: CommentBody, token: JwtToken): Promise<CommentSchema> => (
    await getWrappedApiResponse(COMMENT_PATH, 'POST', body, token)
).json();

export const fetchDeleteComment = async (commentId: ResId, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(COMMENT_PATH + `/${commentId}`, 'DELETE', null, token)
);

export const fetchCommentsByPostId = async (postId: ResId, token: JwtToken): Promise<PagedCommentResponse> => (
    await getWrappedApiResponse(COMMENT_PATH + `/post/${postId}`, 'GET', null, token)
).json();