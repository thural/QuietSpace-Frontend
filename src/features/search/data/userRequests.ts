import { USER_URL, SEARCH_URL, USER_PROFILE_URL, USER_PATH, PHOTO_PATH } from "@/core/shared/apiPath";
import { Inject, Injectable } from '@/core/modules/dependency-injection';
import { TYPES } from '@/core/modules/dependency-injection/types';
import type { IApiClient } from '@/core/network';
import { UserPage, UserResponse, ProfileSettingsRequest, ProfileSettingsResponse } from '@/features/profile/data/models/user';
import { JwtToken, ResId } from '@/shared/api/models/common';

@Injectable({ lifetime: 'singleton' })
export class UserRequestService {
    constructor(
        @Inject(TYPES.API_CLIENT) private apiClient: IApiClient
    ) { }

    async fetchUser(): Promise<UserResponse> {
        const response = await this.apiClient.get(USER_PROFILE_URL);
        return response.data;
    }

    async fetchUserById(userId: ResId): Promise<UserResponse> {
        const response = await this.apiClient.get(USER_PATH + `/${userId}`);
        return response.data;
    }

    async fetchUsersByQuery(queryText: string, pageParams?: string | undefined): Promise<UserPage> {
        const response = await this.apiClient.get(USER_PATH + `/search?username=${queryText}` + (pageParams || ""));
        return response.data;
    }

    async fetchToggleFollow(userId: ResId): Promise<void> {
        await this.apiClient.post(USER_PATH + `/follow/${userId}/toggle-follow`);
    }

    async fetchFollowers(userId: ResId, pageParams?: string | undefined): Promise<UserPage> {
        const response = await this.apiClient.get(USER_PATH + `/${userId}/followers` + (pageParams || ""));
        return response.data;
    }

    async fetchFollowings(userId: ResId, pageParams?: string | undefined): Promise<UserPage> {
        const response = await this.apiClient.get(USER_PATH + `/${userId}/followings` + (pageParams || ""));
        return response.data;
    }

    async fetchSaveSettings(request: ProfileSettingsRequest): Promise<ProfileSettingsResponse> {
        const response = await this.apiClient.patch(USER_PROFILE_URL + "/settings", request);
        return response.data;
    }

    async fetchRemoveFollower(userId: ResId): Promise<void> {
        await this.apiClient.post(USER_PATH + `followers/remove/${userId}`);
    }

    async fetchBlockUserById(userId: ResId): Promise<void> {
        await this.apiClient.post(USER_PROFILE_URL + `/block/${userId}`);
    }

    async fetchUploadPhoto(body: FormData): Promise<string> {
        const response = await this.apiClient.post(PHOTO_PATH + "/profile", body, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
}

// Create singleton instance for backward compatibility
const userRequestService = new UserRequestService();

// Export functions for backward compatibility
export const fetchUser = () => userRequestService.fetchUser();
export const fetchUserById = (userId: ResId) => userRequestService.fetchUserById(userId);
export const fetchUsersByQuery = (queryText: string, pageParams?: string | undefined) =>
    userRequestService.fetchUsersByQuery(queryText, pageParams);
export const fetchToggleFollow = (userId: ResId) => userRequestService.fetchToggleFollow(userId);
export const fetchFollowers = (userId: ResId, pageParams?: string | undefined) =>
    userRequestService.fetchFollowers(userId, pageParams);
export const fetchFollowings = (userId: ResId, pageParams?: string | undefined) =>
    userRequestService.fetchFollowings(userId, pageParams);
export const fetchSaveSettings = (request: ProfileSettingsRequest) =>
    userRequestService.fetchSaveSettings(request);
export const fetchRemoveFollower = (userId: ResId) => userRequestService.fetchRemoveFollower(userId);
export const fetchBlockUserById = (userId: ResId) => userRequestService.fetchBlockUserById(userId);
export const fetchUploadPhoto = (body: FormData) => userRequestService.fetchUploadPhoto(body);