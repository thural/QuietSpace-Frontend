import { POST_URL, REACTION_PATH } from "@/constants/apiPath";
import { JwtToken, ResId } from "../schemas/inferred/common";
import { PostResponse, PostRequest, PostPage, RepostRequest, VoteBody } from "../schemas/inferred/post";
import { ReactionRequest } from "../schemas/inferred/reaction";
import { getWrappedApiResponse } from "./fetchApiUtils";


export const fetchPosts = async (token: JwtToken, pageParams?: string | undefined): Promise<PostPage> => (
    await getWrappedApiResponse(POST_URL + (pageParams || ""), 'GET', null, token)
).json();

export const fetchPostById = async (postId: ResId, token: JwtToken): Promise<PostResponse> => (
    await getWrappedApiResponse(POST_URL + `/${postId}`, 'GET', null, token)
).json();

export const fetchSavedPostsByUser = async (token: JwtToken, pageParams?: string | undefined): Promise<PostPage> => (
    await getWrappedApiResponse(POST_URL + "/saved" + (pageParams || ""), 'GET', null, token)
).json();

export const fetchPostsByUserId = async (userId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<PostPage> => (
    await getWrappedApiResponse(POST_URL + `/user/${userId}` + (pageParams || ""), 'GET', null, token)
).json();

export const fetchPostQuery = async (queryText: string, token: JwtToken, pageParams?: string | undefined): Promise<PostPage> => (
    await getWrappedApiResponse(POST_URL + `/search?query=${queryText}` + (pageParams || ""), 'GET', null, token)
).json();

export const fetchCreateRepost = async (body: RepostRequest, token: JwtToken): Promise<PostResponse> => (
    await getWrappedApiResponse(POST_URL + "/repost", 'POST', body, token)
).json();

export const fetchCreatePost = async (body: PostRequest | FormData, token: JwtToken): Promise<PostResponse> => (
    await getWrappedApiResponse(POST_URL, 'POST', body, token, null)
).json();

export const fetchRepliedPostsByUserId = async (userId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<PostPage> => (
    await getWrappedApiResponse(POST_URL + `/user/${userId}/commented` + (pageParams || ""), 'GET', null, token)
).json()

export const fetchEditPost = async (body: PostRequest, token: JwtToken, postId: ResId): Promise<PostResponse> => (
    await getWrappedApiResponse(POST_URL + `/${postId}`, 'PUT', body, token)
).json();

export const fetchDeletePost = async (postId: ResId, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(POST_URL + `/${postId}`, 'DELETE', null, token)
);

export const fetchReaction = async (reaction: ReactionRequest, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(REACTION_PATH + "/toggle-reaction", 'POST', reaction, token)
);

export const fetchVotePoll = async (vote: VoteBody, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(POST_URL + "/vote-poll", 'POST', vote, token)
);

export const fetchSavePost = async (postId: ResId, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(POST_URL + `/saved/${postId}`, 'PATCH', token)
);