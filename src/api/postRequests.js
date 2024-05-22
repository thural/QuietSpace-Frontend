import { getApiResponse } from "./commonRequest";
import {POST_URL} from "../constants/ApiPath";

export const fetchPosts = async (token) => {
    return await getApiResponse(POST_URL, 'GET', null, token);
}

export const fetchCreatePost = async (body, token) => {
    return await getApiResponse(POST_URL, 'POST', body, token);
}

export const fetchEditPost = async (body, token, postId) => {
    return await getApiResponse(POST_URL + `/${postId}`, 'PUT', body, token);
}

export const fetchPostQuery = async (queryText, token) => {
    return await getApiResponse(POST_URL + `/search?query=${queryText}`, 'GET',null,  token);
}

export const fetchDeletePost = async (postId, token) => {
    return await getApiResponse(POST_URL + `/${postId}`, 'DELETE', null, token);
}

export const fetchReaction = async (reaction, token) => {
    return await getApiResponse(POST_URL + "/toggle-reaction", 'POST', reaction, token);
}

export const fetchVotePoll = async (voteBody, token) => {
    return await getApiResponse(POST_URL + "/vote-poll", 'POST', voteBody, token);
}