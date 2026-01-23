import { PHOTO_PATH, USER_PATH, USER_PROFILE_URL } from "@/shared/constants/apiPath";
import { apiClient } from "@/core/network/rest/apiClient";
import { JwtToken, ResId } from "@/shared/api/models/common";
import { UserPage, UserResponse, ProfileSettingsRequest, ProfileSettingsResponse } from "@/features/profile/data/models/user";


export const fetchUser = async (token: JwtToken): Promise<UserResponse> => {
    const { data } = await apiClient.get(USER_PROFILE_URL);
    return data;
};

export const fetchUserById = async (userId: ResId, token: JwtToken): Promise<UserResponse> => {
    const { data } = await apiClient.get(USER_PATH + `/${userId}`);
    return data;
};

export const fetchUsersByQuery = async (queryText: string, token: JwtToken, pageParams?: string | undefined): Promise<UserPage> => {
    const { data } = await apiClient.get(USER_PATH + `/search?username=${queryText}` + (pageParams || ""));
    return data;
};

export const fetchToggleFollow = async (userId: ResId, token: JwtToken): Promise<Response> => (
    await apiClient.post(USER_PATH + `/follow/${userId}/toggle-follow`)
);

export const fetchFollowers = async (userId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<UserPage> => {
    const { data } = await apiClient.get(USER_PATH + `/${userId}/followers` + (pageParams || ""));
    return data;
};

export const fetchFollowings = async (userId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<UserPage> => {
    const { data } = await apiClient.get(USER_PATH + `/${userId}/followings` + (pageParams || ""));
    return data;
};

export const fetchSaveSettings = async (request: ProfileSettingsRequest, token: JwtToken): Promise<ProfileSettingsResponse> => {
    const { data } = await apiClient.patch(USER_PROFILE_URL + "/settings", request);
    return data;
};

export const fetchRemoveFollower = async (userId: ResId, token: JwtToken): Promise<Response> => (
    await apiClient.post(USER_PATH + `followers/remove/${userId}`)
);

export const fetchBlockUserById = async (userId: ResId, token: JwtToken): Promise<Response> => (
    await apiClient.post(USER_PROFILE_URL + `/block/${userId}`)
);

export const fetchUploadPhoto = async (body: FormData, token: JwtToken): Promise<string> => {
    const { data } = await apiClient.post(PHOTO_PATH + "/profile", body, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};