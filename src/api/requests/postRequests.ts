import { POST_URL, REACTION_PATH } from "../../constants/apiPath";
import { JwtToken, ResId } from "../schemas/inferred/common";
import { Post, PostBody, PostPage, RepostBody, VoteBody } from "../schemas/inferred/post";
import { UserReaction } from "../schemas/inferred/reaction";
import { getWrappedApiResponse } from "./fetchApiUtils";


export const fetchPosts = async (token: JwtToken): Promise<PostPage> => (
    await getWrappedApiResponse(POST_URL, 'GET', null, token)
).json();

export const fetchPostById = async (postId: ResId, token: JwtToken): Promise<Post> => (
    await getWrappedApiResponse(POST_URL + `/${postId}`, 'GET', null, token)
).json();

export const fetchSavedPostsByUser = async (token: JwtToken): Promise<PostPage> => (
    await getWrappedApiResponse(POST_URL + "/saved", 'GET', null, token)
).json();

export const fetchPostsByUserId = async (userId: ResId, token: JwtToken): Promise<PostPage> => (
    await getWrappedApiResponse(POST_URL + `/user/${userId}`, 'GET', null, token)
).json();

export const fetchPostQuery = async (queryText: string, token: JwtToken): Promise<PostPage> => (
    await getWrappedApiResponse(POST_URL + `/search?query=${queryText}`, 'GET', null, token)
).json();

export const fetchCreateRepost = async (body: RepostBody, token: JwtToken): Promise<Post> => (
    await getWrappedApiResponse(POST_URL + "/repost", 'POST', body, token)
).json();

export const fetchCreatePost = async (body: PostBody, token: JwtToken): Promise<Post> => (
    await getWrappedApiResponse(POST_URL, 'POST', body, token)
).json();

export const fetchRepliedPostsByUserId = async (userId: ResId, token: JwtToken): Promise<PostPage> => (
    await getWrappedApiResponse(POST_URL + `/user/${userId}/commented`, 'GET', null, token)
).json()

export const fetchEditPost = async (body: PostBody, token: JwtToken, postId: ResId): Promise<Response> => (
    await getWrappedApiResponse(POST_URL + `/${postId}`, 'PUT', body, token)
);

export const fetchDeletePost = async (postId: ResId, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(POST_URL + `/${postId}`, 'DELETE', null, token)
);

export const fetchReaction = async (reaction: UserReaction, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(REACTION_PATH + "/toggle-reaction", 'POST', reaction, token)
);

export const fetchVotePoll = async (vote: VoteBody, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(POST_URL + "/vote-poll", 'POST', vote, token)
);

export const fetchSavePost = async (postId: ResId, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(POST_URL + `/saved/${postId}`, 'PATCH', token)
);