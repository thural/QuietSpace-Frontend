import { POST_URL, REACTION_PATH } from "../constants/ApiPath";
import { genericFetchErrorHandler, getApiResponse } from "./commonRequest";
import { JwtToken, ResId } from "./schemas/common";
import { PagedPostresponse, PostBody, VoteBody } from "./schemas/post";
import { UserReaction } from "./schemas/reaction";

export const fetchPosts = async (token: JwtToken): Promise<PagedPostresponse> => (
    await genericFetchErrorHandler(() => getApiResponse(POST_URL, 'GET', null, token))
).json();

export const fetchPostsByUserId = async (userId: ResId, token: JwtToken): Promise<PagedPostresponse> => (
    await genericFetchErrorHandler(() => getApiResponse(POST_URL + `/user/${userId}`, 'GET', null, token))
).json();

export const fetchCreatePost = async (body: PostBody, token: JwtToken): Promise<Response> => (
    await genericFetchErrorHandler(() => getApiResponse(POST_URL, 'POST', body, token))
);

export const fetchEditPost = async (body: PostBody, token: JwtToken, postId: ResId): Promise<Response> => (
    await genericFetchErrorHandler(() => getApiResponse(POST_URL + `/${postId}`, 'PUT', body, token))
);

export const fetchDeletePost = async (postId: ResId, token: JwtToken): Promise<Response> => (
    await genericFetchErrorHandler(() => getApiResponse(POST_URL + `/${postId}`, 'DELETE', null, token))
);

export const fetchPostQuery = async (queryText: string, token: JwtToken): Promise<PagedPostresponse> => (
    await genericFetchErrorHandler(() => getApiResponse(POST_URL + `/search?query=${queryText}`, 'GET', null, token))
).json();


export const fetchReaction = async (reaction: UserReaction, token: JwtToken): Promise<Response> => (
    await genericFetchErrorHandler(() => getApiResponse(REACTION_PATH + "/toggle-reaction", 'POST', reaction, token))
);

export const fetchVotePoll = async (vote: VoteBody, token: JwtToken): Promise<Response> => (
    await genericFetchErrorHandler(() => getApiResponse(POST_URL + "/vote-poll", 'POST', vote, token))
);