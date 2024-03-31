import { getApiResponse } from "./commonRequest";

export const fetchPosts = async (url, token) => {
    try {
        return await getApiResponse(url, 'GET', null, token);
    } catch (err) { console.log(err) }
}

export const fetchCreatePost = async (url, body, token) => {
    try {
        return await getApiResponse(url, 'POST', body, token);
    } catch (err) { console.log(err) }
}

export const fetchEditPost = async (url, body, token, postId) => {
    try {
        return await getApiResponse(url + `/${postId}`, 'PUT', body, token);
    } catch (err) { console.log(err) }
}

export const fetchDeletePost = async (url, postId, token) => {
    try {
        return await getApiResponse(url + `/${postId}`, 'DELETE', null, token);
    } catch (err) { console.log(err) }
}

export const fetchLikePost = async (url, postId, token) => {
    try {
        return await getApiResponse(url + `/${postId}/toggle-like`, 'POST', null, token);
    } catch (err) { console.log(err) }
}