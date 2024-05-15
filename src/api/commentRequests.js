import { getApiResponse } from "./commonRequest";


export const fetchCreateComment = async (url, body, token) => {
    return await getApiResponse(url, 'POST', body, token);
}

export const fetchDeleteComment = async (url, token) => {
    return await getApiResponse(url, 'DELETE', null, token);
}

export const fetchCommentsByPostId = async (url, postId, token) => {
    return await getApiResponse(url + `/post/${postId}`, 'GET', null, token);
}

export const fetchLikeComment = async (url, commentId, token) => {
    return await getApiResponse(url + `/${commentId}/toggle-like`, 'POST', null, token);
}