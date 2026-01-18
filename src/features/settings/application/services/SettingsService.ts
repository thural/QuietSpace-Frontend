/**
 * Settings Service.
 * 
 * Service for managing settings operations and business logic.
 * Provides high-level operations for settings management.
 */

import type { ProfileSettingsRequest, UserProfileResponse } from "@/api/schemas/inferred/user";
import type { JwtToken } from "@/api/schemas/inferred/common";
import type { ISettingsRepository } from "../../domain/entities/SettingsRepository";
import type { 
    ProfileSettings, 
    PrivacySettings, 
    NotificationSettings,
    SharingSettings,
    MentionsSettings,
    RepliesSettings,
    BlockingSettings
} from "../../domain/entities/SettingsEntities";

/**
 * Settings Service interface.
 */
export interface ISettingsService {
    getProfileSettings(userId: string): Promise<UserProfileResponse>;
    updateProfileSettings(userId: string, settings: ProfileSettingsRequest): Promise<UserProfileResponse>;
    uploadProfilePhoto(userId: string, file: File): Promise<UserProfileResponse>;
    removeProfilePhoto(userId: string): Promise<UserProfileResponse>;
    getPrivacySettings(userId: string): Promise<PrivacySettings>;
    updatePrivacySettings(userId: string, settings: PrivacySettings): Promise<PrivacySettings>;
    getNotificationSettings(userId: string): Promise<NotificationSettings>;
    updateNotificationSettings(userId: string, settings: NotificationSettings): Promise<NotificationSettings>;
    validateSettings(settings: any): boolean;
    sanitizeSettings(settings: any): any;
}

/**
 * Settings Service implementation.
 */
export class SettingsService implements ISettingsService {
    constructor(private settingsRepository: ISettingsRepository) {}

    /**
     * Get user profile settings.
     */
    async getProfileSettings(userId: string): Promise<UserProfileResponse> {
        try {
            return await this.settingsRepository.getProfileSettings(userId, this.getToken());
        } catch (error) {
            console.error('SettingsService: Error getting profile settings:', error);
            throw error;
        }
    }

    /**
     * Update user profile settings.
     */
    async updateProfileSettings(userId: string, settings: ProfileSettingsRequest): Promise<UserProfileResponse> {
        try {
            // Validate settings before updating
            if (!this.validateSettings(settings)) {
                throw new Error('Invalid settings provided');
            }

            // Sanitize settings
            const sanitizedSettings = this.sanitizeSettings(settings);
            
            return await this.settingsRepository.updateProfileSettings(userId, sanitizedSettings, this.getToken());
        } catch (error) {
            console.error('SettingsService: Error updating profile settings:', error);
            throw error;
        }
    }

    /**
     * Upload profile photo.
     */
    async uploadProfilePhoto(userId: string, file: File): Promise<UserProfileResponse> {
        try {
            // Validate file
            if (!this.validatePhotoFile(file)) {
                throw new Error('Invalid photo file');
            }

            return await this.settingsRepository.uploadProfilePhoto(userId, file, this.getToken());
        } catch (error) {
            console.error('SettingsService: Error uploading profile photo:', error);
            throw error;
        }
    }

    /**
     * Remove profile photo.
     */
    async removeProfilePhoto(userId: string): Promise<UserProfileResponse> {
        try {
            return await this.settingsRepository.removeProfilePhoto(userId, this.getToken());
        } catch (error) {
            console.error('SettingsService: Error removing profile photo:', error);
            throw error;
        }
    }

    /**
     * Get privacy settings.
     */
    async getPrivacySettings(userId: string): Promise<PrivacySettings> {
        try {
            return await this.settingsRepository.getPrivacySettings(userId, this.getToken());
        } catch (error) {
            console.error('SettingsService: Error getting privacy settings:', error);
            throw error;
        }
    }

    /**
     * Update privacy settings.
     */
    async updatePrivacySettings(userId: string, settings: PrivacySettings): Promise<PrivacySettings> {
        try {
            // Validate settings before updating
            if (!this.validatePrivacySettings(settings)) {
                throw new Error('Invalid privacy settings provided');
            }

            return await this.settingsRepository.updatePrivacySettings(userId, settings, this.getToken());
        } catch (error) {
            console.error('SettingsService: Error updating privacy settings:', error);
            throw error;
        }
    }

    /**
     * Get notification settings.
     */
    async getNotificationSettings(userId: string): Promise<NotificationSettings> {
        try {
            return await this.settingsRepository.getNotificationSettings(userId, this.getToken());
        } catch (error) {
            console.error('SettingsService: Error getting notification settings:', error);
            throw error;
        }
    }

    /**
     * Update notification settings.
     */
    async updateNotificationSettings(userId: string, settings: NotificationSettings): Promise<NotificationSettings> {
        try {
            // Validate settings before updating
            if (!this.validateNotificationSettings(settings)) {
                throw new Error('Invalid notification settings provided');
            }

            return await this.settingsRepository.updateNotificationSettings(userId, settings, this.getToken());
        } catch (error) {
            console.error('SettingsService: Error updating notification settings:', error);
            throw error;
        }
    }

    /**
     * Validate settings data.
     */
    validateSettings(settings: any): boolean {
        if (!settings || typeof settings !== 'object') {
            return false;
        }

        // Basic validation for profile settings
        if (settings.bio && typeof settings.bio !== 'string') {
            return false;
        }

        if (settings.isPrivateAccount !== undefined && typeof settings.isPrivateAccount !== 'boolean') {
            return false;
        }

        return true;
    }

    /**
     * Sanitize settings data.
     */
    sanitizeSettings(settings: any): any {
        const sanitized = { ...settings };

        // Sanitize bio
        if (sanitized.bio) {
            sanitized.bio = sanitized.bio.trim().substring(0, 500); // Max 500 characters
        }

        // Ensure boolean values
        if (sanitized.isPrivateAccount !== undefined) {
            sanitized.isPrivateAccount = Boolean(sanitized.isPrivateAccount);
        }

        return sanitized;
    }

    /**
     * Validate privacy settings.
     */
    private validatePrivacySettings(settings: PrivacySettings): boolean {
        if (!settings || typeof settings !== 'object') {
            return false;
        }

        // Validate boolean fields
        const booleanFields = [
            'isPrivateAccount', 'showEmail', 'showPhone', 'allowTagging',
            'allowMentions', 'allowDirectMessages'
        ];

        for (const field of booleanFields) {
            if (settings[field] !== undefined && typeof settings[field] !== 'boolean') {
                return false;
            }
        }

        return true;
    }

    /**
     * Validate notification settings.
     */
    private validateNotificationSettings(settings: NotificationSettings): boolean {
        if (!settings || typeof settings !== 'object') {
            return false;
        }

        // Validate boolean fields
        const booleanFields = [
            'emailNotifications', 'pushNotifications', 'mentionNotifications',
            'followNotifications', 'likeNotifications', 'commentNotifications',
            'messageNotifications'
        ];

        for (const field of booleanFields) {
            if (settings[field] !== undefined && typeof settings[field] !== 'boolean') {
                return false;
            }
        }

        return true;
    }

    /**
     * Validate photo file.
     */
    private validatePhotoFile(file: File): boolean {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return false;
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            return false;
        }

        return true;
    }

    /**
     * Get authentication token from store.
     */
    import { useAuthStore } from '../../../services/store/zustand';
    private getToken(): JwtToken {
        const authStore = useAuthStore.getState();
        return authStore.data.accessToken || '';
    }
}
