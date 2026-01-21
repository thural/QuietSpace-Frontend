/**
 * Mock Settings Repository.
 * 
 * Mock implementation of settings repository for testing and UI development.
 * Provides in-memory data storage and simulated API responses.
 */

import type { ProfileSettingsRequest, UserProfileResponse } from "@/features/profile/data/models/user";
import type { JwtToken } from "@/shared/api/models/common";
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
 * Mock Settings Repository implementation.
 */
export class MockSettingsRepository implements ISettingsRepository {
    private token: JwtToken | null;
    private mockData: Map<string, any> = new Map();

    constructor(token: JwtToken | null = null) {
        this.token = token;
        this.initializeMockData();
    }

    /**
     * Initialize mock data for testing.
     */
    private initializeMockData(): void {
        // Mock profile data
        this.mockData.set('profile', {
            id: 'mock-user-123',
            username: 'mockuser',
            email: 'mock@example.com',
            bio: 'This is a mock bio for testing purposes.',
            photo: null,
            isPrivateAccount: false,
            settings: {
                bio: 'This is a mock bio for testing purposes.',
                isPrivateAccount: false
            }
        });

        // Mock privacy settings
        this.mockData.set('privacy', {
            isPrivateAccount: false,
            showEmail: true,
            showPhone: false,
            allowTagging: true,
            allowMentions: true,
            allowDirectMessages: true
        });

        // Mock notification settings
        this.mockData.set('notifications', {
            emailNotifications: true,
            pushNotifications: true,
            mentionNotifications: true,
            followNotifications: true,
            likeNotifications: true,
            commentNotifications: true,
            messageNotifications: true
        });

        // Mock sharing settings
        this.mockData.set('sharing', {
            allowSharing: true,
            shareToFacebook: false,
            shareToTwitter: false,
            shareToInstagram: false,
            autoShare: false
        });

        // Mock mentions settings
        this.mockData.set('mentions', {
            allowMentions: true,
            mentionFromFollowersOnly: false,
            mentionFromVerifiedOnly: false,
            mentionNotifications: true
        });

        // Mock replies settings
        this.mockData.set('replies', {
            allowReplies: true,
            repliesFromFollowersOnly: false,
            repliesFromVerifiedOnly: false,
            replyNotifications: true
        });

        // Mock blocking settings
        this.mockData.set('blocking', {
            blockedUsers: [],
            mutedUsers: [],
            blockedWords: [],
            hideBlockedContent: true
        });
    }

    /**
     * Get user profile settings.
     */
    async getProfileSettings(userId: string, token: JwtToken): Promise<UserProfileResponse> {
        console.log('MockSettingsRepository: Getting profile settings for user:', userId);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));

        const profileData = this.mockData.get('profile');
        return {
            ...profileData,
            id: userId
        };
    }

    /**
     * Update user profile settings.
     */
    async updateProfileSettings(userId: string, settings: ProfileSettingsRequest, token: JwtToken): Promise<UserProfileResponse> {
        console.log('MockSettingsRepository: Updating profile settings for user:', userId);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const currentProfile = this.mockData.get('profile');
        const updatedProfile = {
            ...currentProfile,
            ...settings,
            id: userId
        };

        this.mockData.set('profile', updatedProfile);
        return updatedProfile;
    }

    /**
     * Upload profile photo.
     */
    async uploadProfilePhoto(userId: string, file: File, token: JwtToken): Promise<UserProfileResponse> {
        console.log('MockSettingsRepository: Uploading profile photo for user:', userId);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const currentProfile = this.mockData.get('profile');
        const updatedProfile = {
            ...currentProfile,
            photo: URL.createObjectURL(file), // Mock photo URL
            id: userId
        };

        this.mockData.set('profile', updatedProfile);
        return updatedProfile;
    }

    /**
     * Remove profile photo.
     */
    async removeProfilePhoto(userId: string, token: JwtToken): Promise<UserProfileResponse> {
        console.log('MockSettingsRepository: Removing profile photo for user:', userId);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const currentProfile = this.mockData.get('profile');
        const updatedProfile = {
            ...currentProfile,
            photo: null,
            id: userId
        };

        this.mockData.set('profile', updatedProfile);
        return updatedProfile;
    }

    /**
     * Get privacy settings.
     */
    async getPrivacySettings(userId: string, token: JwtToken): Promise<PrivacySettings> {
        console.log('MockSettingsRepository: Getting privacy settings for user:', userId);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));

        return this.mockData.get('privacy');
    }

    /**
     * Update privacy settings.
     */
    async updatePrivacySettings(userId: string, settings: PrivacySettings, token: JwtToken): Promise<PrivacySettings> {
        console.log('MockSettingsRepository: Updating privacy settings for user:', userId);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        this.mockData.set('privacy', settings);
        return settings;
    }

    /**
     * Get notification settings.
     */
    async getNotificationSettings(userId: string, token: JwtToken): Promise<NotificationSettings> {
        console.log('MockSettingsRepository: Getting notification settings for user:', userId);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));

        return this.mockData.get('notifications');
    }

    /**
     * Update notification settings.
     */
    async updateNotificationSettings(userId: string, settings: NotificationSettings, token: JwtToken): Promise<NotificationSettings> {
        console.log('MockSettingsRepository: Updating notification settings for user:', userId);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        this.mockData.set('notifications', settings);
        return settings;
    }
}
