import { getApiResponse } from "./commonRequest";


export const fetchCreateComment = async (url, body, token) => {
    try {
        return await getApiResponse(url, 'POST', body, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchDeleteComment = async (url, token) => {
    try {
        return await getApiResponse(url, 'DELETE', null, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchCommentsByPostId = async (url, postId, token) => {
    try {
        return await getApiResponse(url + `/post/${postId}`, 'GET', null, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchLikeComment = async (url, commentId, token) => {
    try {
        return await getApiResponse(url + `/${commentId}/toggle-like`, 'POST', null, token);
    } catch (error) { throw Error(error.message) }
}