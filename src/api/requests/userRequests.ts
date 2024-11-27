import { USER_PATH, USER_PROFILE_URL } from "../../constants/apiPath";
import { getWrappedApiResponse } from "./fetchApiUtils";
import { JwtToken, ResId } from "../schemas/inferred/common";
import { UserPage, UserResponse, ProfileSettingsRequest, ProfileSettingsResponse } from "../schemas/inferred/user";


export const fetchUser = async (token: JwtToken): Promise<UserResponse> => (
    await getWrappedApiResponse(USER_PROFILE_URL, 'GET', null, token)
).json();

export const fetchUserById = async (userId: ResId, token: JwtToken): Promise<UserResponse> => (
    await getWrappedApiResponse(USER_PATH + `/${userId}`, 'GET', null, token)
).json();

export const fetchUsersByQuery = async (queryText: string, token: JwtToken, pageParams?: string | undefined): Promise<UserPage> => (
    await getWrappedApiResponse(USER_PATH + `/search?username=${queryText}` + (pageParams || ""), 'GET', null, token)
).json();

export const fetchToggleFollow = async (userId: ResId, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(USER_PATH + `/follow/${userId}/toggle-follow`, 'POST', null, token)
);

export const fetchFollowers = async (userId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<UserPage> => (
    await getWrappedApiResponse(USER_PATH + `/${userId}/followers` + (pageParams || ""), 'GET', null, token)
).json();

export const fetchFollowings = async (userId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<UserPage> => (
    await getWrappedApiResponse(USER_PATH + `/${userId}/followings` + (pageParams || ""), 'GET', null, token)
).json();

export const fetchSaveSettings = async (request: ProfileSettingsRequest, token: JwtToken): Promise<ProfileSettingsResponse> => (
    await getWrappedApiResponse(USER_PROFILE_URL + "/settings", 'PATCH', request, token)
).json();

export const fetchRemoveFollower = async (userId: ResId, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(USER_PATH + `followers/remove/${userId}`, 'POST', null, token)
);

export const fetchBlockUserById = async (userId: ResId, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(USER_PROFILE_URL + `/block/${userId}`, 'POST', null, token)
);