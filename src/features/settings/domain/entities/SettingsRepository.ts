/**
 * Settings Repository Interface.
 * 
 * Defines the contract for settings data access operations.
 * Provides abstraction for settings CRUD operations.
 */

import type { ProfileSettingsRequest, UserProfileResponse } from "@/api/schemas/inferred/user";
import type { JwtToken } from "@/api/schemas/inferred/common";

/**
 * Settings Repository interface.
 */
export interface ISettingsRepository {
    /**
     * Get user profile settings.
     * 
     * @param userId - The user ID
     * @param token - Authentication token
     * @returns Promise resolving to user profile response
     */
    getProfileSettings(userId: string, token: JwtToken): Promise<UserProfileResponse>;

    /**
     * Update user profile settings.
     * 
     * @param userId - The user ID
     * @param settings - The settings to update
     * @param token - Authentication token
     * @returns Promise resolving to updated profile response
     */
    updateProfileSettings(userId: string, settings: ProfileSettingsRequest, token: JwtToken): Promise<UserProfileResponse>;

    /**
     * Upload profile photo.
     * 
     * @param userId - The user ID
     * @param file - The photo file to upload
     * @param token - Authentication token
     * @returns Promise resolving to updated profile response
     */
    uploadProfilePhoto(userId: string, file: File, token: JwtToken): Promise<UserProfileResponse>;

    /**
     * Remove profile photo.
     * 
     * @param userId - The user ID
     * @param token - Authentication token
     * @returns Promise resolving to updated profile response
     */
    removeProfilePhoto(userId: string, token: JwtToken): Promise<UserProfileResponse>;

    /**
     * Get privacy settings.
     * 
     * @param userId - The user ID
     * @param token - Authentication token
     * @returns Promise resolving to privacy settings
     */
    getPrivacySettings(userId: string, token: JwtToken): Promise<any>;

    /**
     * Update privacy settings.
     * 
     * @param userId - The user ID
     * @param settings - Privacy settings to update
     * @param token - Authentication token
     * @returns Promise resolving to updated privacy settings
     */
    updatePrivacySettings(userId: string, settings: any, token: JwtToken): Promise<any>;

    /**
     * Get notification settings.
     * 
     * @param userId - The user ID
     * @param token - Authentication token
     * @returns Promise resolving to notification settings
     */
    getNotificationSettings(userId: string, token: JwtToken): Promise<any>;

    /**
     * Update notification settings.
     * 
     * @param userId - The user ID
     * @param settings - Notification settings to update
     * @param token - Authentication token
     * @returns Promise resolving to updated notification settings
     */
    updateNotificationSettings(userId: string, settings: any, token: JwtToken): Promise<any>;
}
