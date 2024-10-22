import { COMMENT_PATH } from "../constants/ApiPath";
import { genericFetchErrorHandler, getApiResponse } from "./commonRequest";
import { CommentBody, CommentShema, PagedCommentResponse } from "./schemas/comment";
import { JwtToken, ResId } from "./schemas/common";

export const fetchCreateComment = async (body: CommentBody, token: JwtToken): Promise<CommentShema> => (
    await genericFetchErrorHandler(() => getApiResponse(COMMENT_PATH, 'POST', body, token))
).json();

export const fetchDeleteComment = async (commentId: CommentBody, token: JwtToken): Promise<Response> => (
    await genericFetchErrorHandler(() => getApiResponse(COMMENT_PATH + `/${commentId}`, 'DELETE', null, token))
);

export const fetchCommentsByPostId = async (postId: ResId, token: JwtToken): Promise<PagedCommentResponse> => (
    await genericFetchErrorHandler(() => getApiResponse(COMMENT_PATH + `/post/${postId}`, 'GET', null, token))
).json();