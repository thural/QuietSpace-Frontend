import type {AxiosInstance} from 'axios';
import {Inject, Injectable} from '@/core/di';
import {TYPES} from '@/core/di/types';
import {PHOTO_PATH, USER_PATH, USER_PROFILE_URL} from "@/shared/constants/apiPath";
import {ResId} from "@/shared/api/models/common";
import {
    ProfileSettingsRequest,
    ProfileSettingsResponse,
    UserPage,
    UserResponse
} from "@/features/profile/data/models/user";

/**
 * User Repository - Handles user-related API operations
 */
@Injectable()
export class UserRepository {
    constructor(@Inject(TYPES.API_CLIENT) private apiClient: AxiosInstance) {}

    async getUser(): Promise<UserResponse> {
        const { data } = await this.apiClient.get(USER_PROFILE_URL);
        return data;
    }

    async getUserById(userId: ResId): Promise<UserResponse> {
        const { data } = await this.apiClient.get(USER_PATH + `/${userId}`);
        return data;
    }

    async getUsersByQuery(queryText: string, pageParams?: string): Promise<UserPage> {
        const { data } = await this.apiClient.get(USER_PATH + `/search?username=${queryText}` + (pageParams || ""));
        return data;
    }

    async toggleFollow(userId: ResId): Promise<Response> {
        return await this.apiClient.post(USER_PATH + `/follow/${userId}/toggle-follow`);
    }

    async getFollowers(userId: ResId, pageParams?: string): Promise<UserPage> {
        const { data } = await this.apiClient.get(USER_PATH + `/${userId}/followers` + (pageParams || ""));
        return data;
    }

    async getFollowings(userId: ResId, pageParams?: string): Promise<UserPage> {
        const { data } = await this.apiClient.get(USER_PATH + `/${userId}/followings` + (pageParams || ""));
        return data;
    }

    async saveSettings(request: ProfileSettingsRequest): Promise<ProfileSettingsResponse> {
        const { data } = await this.apiClient.patch(USER_PROFILE_URL + "/settings", request);
        return data;
    }

    async removeFollower(userId: ResId): Promise<Response> {
        return await this.apiClient.post(USER_PATH + `followers/remove/${userId}`);
    }

    async blockUserById(userId: ResId): Promise<Response> {
        return await this.apiClient.post(USER_PROFILE_URL + `/block/${userId}`);
    }

    async uploadPhoto(body: FormData): Promise<string> {
        const { data } = await this.apiClient.post(PHOTO_PATH + "/profile", body, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    }
}
