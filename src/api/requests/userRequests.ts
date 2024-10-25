import { USER_PATH, USER_PROFILE_URL } from "../../constants/apiPath";
import { getWrappedApiResponse } from "./fetchApiUtils";
import { JwtToken, ResId } from "../schemas/inferred/common";
import { UserPage, User } from "../schemas/inferred/user";


export const fetchUser = async (token: JwtToken): Promise<User> => (
    await getWrappedApiResponse(USER_PROFILE_URL, 'GET', null, token)
).json();

export const fetchUserById = async (userId: ResId, token: JwtToken): Promise<User> => (
    await getWrappedApiResponse(USER_PATH + `/${userId}`, 'GET', null, token)
).json();

export const fetchUsersByQuery = async (queryText: string, token: JwtToken): Promise<UserPage> => (
    await getWrappedApiResponse(USER_PATH + `/search?username=${queryText}`, 'GET', null, token)
).json();

export const fetchToggleFollow = async (userId: ResId, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(USER_PATH + `/follow/${userId}/toggle-follow`, 'POST', null, token)
);

export const fetchFollowers = async (userId: ResId, token: JwtToken): Promise<UserPage> => (
    await getWrappedApiResponse(USER_PATH + `/${userId}/followers`, 'GET', null, token)
).json();

export const fetchFollowings = async (userId: ResId, token: JwtToken): Promise<UserPage> => (
    await getWrappedApiResponse(USER_PATH + `/${userId}/followings`, 'GET', null, token)
).json();

export const fetchRemoveFollower = async (token: JwtToken, userId: ResId): Promise<Response> => (
    await getWrappedApiResponse(USER_PATH + `followers/remove/${userId}`, 'POST', null, token)
);