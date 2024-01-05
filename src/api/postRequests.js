import {getApiResponse} from "./commonRequest";

export const fetchPosts = async (url, token) => {
    try {
        const response = await getApiResponse(url, 'GET', null, token);
        return response;
    } catch (err) { console.log(err) }
}

export const fetchCreatePost = async (url, body, token) => {
    try {
        const response = await getApiResponse(url, 'POST', body, token);
        return response;
    } catch (err) { console.log(err) }
}

export const fetchEditPost = async (url, body, token, postId) => {
    try {
        const response = await getApiResponse(url + `/${postId}`, 'PUT', body, token);
        return response;
    } catch (err) { console.log(err) }
}

export const fetchDeletePost = async (url, token, postId) => {
    try {
        const response = await getApiResponse(url + `/${postId}`, 'DELETE', null, token);
        return response;
    } catch (err) { console.log(err) }
}