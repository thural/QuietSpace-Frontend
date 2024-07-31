import { getApiResponse } from "./commonRequest";

export const fetchPosts = async (url, token) => {
    try {
        return await getApiResponse(url, 'GET', null, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchCreatePost = async (url, body, token) => {
    try {
        return await getApiResponse(url, 'POST', body, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchEditPost = async (url, body, token, postId) => {
    try {
        return await getApiResponse(url + `/${postId}`, 'PUT', body, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchDeletePost = async (url, postId, token) => {
    try {
        return await getApiResponse(url + `/${postId}`, 'DELETE', null, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchLikePost = async (url, postId, token) => {
    try {
        return await getApiResponse(url + `/${postId}/toggle-like`, 'POST', null, token);
    } catch (error) { throw Error(error.message) }
}