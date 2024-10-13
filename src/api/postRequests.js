import { POST_URL, REACTION_PATH } from "../constants/ApiPath";
import { getApiResponse } from "./commonRequest";

export const fetchPosts = async (token) => {
    try {
        return await getApiResponse(POST_URL, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchCreatePost = async (body, token) => {
    try {
        return await getApiResponse(POST_URL, 'POST', body, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchEditPost = async (url, body, token, postId) => {
    try {
        return await getApiResponse(url + `/${postId}`, 'PUT', body, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchDeletePost = async (url, postId, token) => {
    try {
        return await getApiResponse(url + `/${postId}`, 'DELETE', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchPostQuery = async (queryText, token) => {
    try {
        return await getApiResponse(POST_URL + `/search?query=${queryText}`, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchLikePost = async (url, postId, token) => {
    try {
        return await getApiResponse(url + `/${postId}/toggle-like`, 'POST', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchReaction = async (reaction, token) => {
    try {
        return await getApiResponse(REACTION_PATH + "/toggle-reaction", 'POST', reaction, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchVotePoll = async (voteBody, token) => {
    try {
        return await getApiResponse(POST_URL + "/vote-poll", 'POST', voteBody, token);
    } catch (error) { throw new Error(error.message) }
}