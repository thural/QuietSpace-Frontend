import { getApiResponse } from "./commonRequest";
import post from "../components/Posts/Post";

export const fetchPosts = async (url, token) => {
    return await getApiResponse(url, 'GET', null, token);
}

export const fetchCreatePost = async (url, body, token) => {
    return await getApiResponse(url, 'POST', body, token);
}

export const fetchEditPost = async (url, body, token, postId) => {
    return await getApiResponse(url + `/${postId}`, 'PUT', body, token);
}

export const fetchDeletePost = async (url, postId, token) => {
    return await getApiResponse(url + `/${postId}`, 'DELETE', null, token);
}

export const fetchLikePost = async (url, postId, token) => {
    return await getApiResponse(url + `/${postId}/toggle-like`, 'POST', null, token);
}

export const fetchVotePoll = async (url, voteBody, token) => {
    return await getApiResponse(url + "/vote-poll", 'POST', voteBody, token);
}