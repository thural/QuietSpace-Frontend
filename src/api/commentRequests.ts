import { COMMENT_PATH } from "../constants/ApiPath";
import { getApiResponse } from "./commonRequest";


export const fetchCreateComment = async (body, token) => {
    try {
        return await getApiResponse(COMMENT_PATH, 'POST', body, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchDeleteComment = async (commentId, token) => {
    try {
        return await getApiResponse(COMMENT_PATH + `/${commentId}`, 'DELETE', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchCommentsByPostId = async (postId, token) => {
    try {
        return await getApiResponse(COMMENT_PATH + `/post/${postId}`, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}