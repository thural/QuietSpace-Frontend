import { POST_URL, COMMENT_PATH } from "@/shared/constants/apiPath";
import { createApiClient, type IApiClient } from "@/core/network";
import { JwtToken, ResId } from "@/shared/api/models/common";
import { PostResponse, PostRequest, PostPage, RepostRequest, VoteBody } from "@/features/feed/data/models/post";
import { ReactionRequest } from "@/features/feed/data/models/reaction";

// Create authenticated API client
const apiClient: IApiClient = createApiClient();

export const fetchPosts = async (token: JwtToken, pageParams?: string | undefined): Promise<PostPage> => {
    const { data } = await apiClient.get(POST_URL + (pageParams || ""));
    return data;
};

export const fetchPostById = async (postId: ResId, token: JwtToken): Promise<PostResponse> => {
    const { data } = await apiClient.get(POST_URL + `/${postId}`);
    return data;
};

export const fetchSavedPostsByUser = async (token: JwtToken, pageParams?: string | undefined): Promise<PostPage> => {
    const { data } = await apiClient.get(POST_URL + "/saved" + (pageParams || ""));
    return data;
};

export const fetchPostsByUserId = async (userId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<PostPage> => {
    const { data } = await apiClient.get(POST_URL + `/user/${userId}` + (pageParams || ""));
    return data;
};

export const fetchPostQuery = async (queryText: string, token: JwtToken, pageParams?: string | undefined): Promise<PostPage> => {
    apiClient.setAuth(token);
    const response = await apiClient.get(POST_URL + `/search?query=${queryText}` + (pageParams || ""));
    return response.data;
};

export const fetchCreateRepost = async (body: RepostRequest, token: JwtToken): Promise<PostResponse> => {
    apiClient.setAuth(token);
    const response = await apiClient.post(POST_URL + "/repost", body);
    return response.data;
};

export const fetchCreatePost = async (body: PostRequest | FormData, token: JwtToken): Promise<PostResponse> => {
    apiClient.setAuth(token);
    const response = await apiClient.post(POST_URL, body, {
        headers: body instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
};

export const fetchRepliedPostsByUserId = async (userId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<PostPage> => {
    apiClient.setAuth(token);
    const response = await apiClient.get(POST_URL + `/user/${userId}/commented` + (pageParams || ""));
    return response.data;
};

export const fetchEditPost = async (body: PostRequest, token: JwtToken, postId: ResId): Promise<PostResponse> => {
    apiClient.setAuth(token);
    const response = await apiClient.put(POST_URL + `/${postId}`, body);
    return response.data;
};

export const fetchDeletePost = async (postId: ResId, token: JwtToken): Promise<void> => {
    apiClient.setAuth(token);
    await apiClient.delete(POST_URL + `/${postId}`);
};

export const fetchReaction = async (reaction: ReactionRequest, token: JwtToken): Promise<void> => {
    apiClient.setAuth(token);
    await apiClient.post(COMMENT_PATH + "/toggle-reaction", reaction);
};

export const fetchVotePoll = async (vote: VoteBody, token: JwtToken): Promise<void> => {
    apiClient.setAuth(token);
    await apiClient.post(POST_URL + "/vote-poll", vote);
};

export const fetchSavePost = async (postId: ResId, token: JwtToken): Promise<void> => {
    apiClient.setAuth(token);
    await apiClient.patch(POST_URL + `/saved/${postId}`);
};