/**
 * Settings Repository Implementation.
 * 
 * Concrete implementation of settings repository.
 * Integrates with existing API endpoints and data sources.
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
 * Settings Repository implementation.
 */
export class SettingsRepository implements ISettingsRepository {
    private token: JwtToken | null;

    constructor(token: JwtToken | null = null) {
        this.token = token;
    }

    /**
     * Get user profile settings.
     */
    async getProfileSettings(userId: string, token: JwtToken): Promise<UserProfileResponse> {
        try {
            console.log('SettingsRepository: Getting profile settings for user:', userId);
            
            // Use existing API - this will be connected to the existing user queries
            const response = await fetch(`/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch profile settings: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('SettingsRepository: Profile settings retrieved successfully');
            return data;
        } catch (error) {
            console.error('SettingsRepository: Error getting profile settings:', error);
            throw error;
        }
    }

    /**
     * Update user profile settings.
     */
    async updateProfileSettings(userId: string, settings: ProfileSettingsRequest, token: JwtToken): Promise<UserProfileResponse> {
        try {
            console.log('SettingsRepository: Updating profile settings for user:', userId);
            
            const response = await fetch(`/api/users/${userId}/settings`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update profile settings: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('SettingsRepository: Profile settings updated successfully');
            return data;
        } catch (error) {
            console.error('SettingsRepository: Error updating profile settings:', error);
            throw error;
        }
    }

    /**
     * Upload profile photo.
     */
    async uploadProfilePhoto(userId: string, file: File, token: JwtToken): Promise<UserProfileResponse> {
        try {
            console.log('SettingsRepository: Uploading profile photo for user:', userId);
            
            const formData = new FormData();
            formData.append('photo', file);
            
            const response = await fetch(`/api/users/${userId}/photo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Failed to upload profile photo: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('SettingsRepository: Profile photo uploaded successfully');
            return data;
        } catch (error) {
            console.error('SettingsRepository: Error uploading profile photo:', error);
            throw error;
        }
    }

    /**
     * Remove profile photo.
     */
    async removeProfilePhoto(userId: string, token: JwtToken): Promise<UserProfileResponse> {
        try {
            console.log('SettingsRepository: Removing profile photo for user:', userId);
            
            const response = await fetch(`/api/users/${userId}/photo`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to remove profile photo: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('SettingsRepository: Profile photo removed successfully');
            return data;
        } catch (error) {
            console.error('SettingsRepository: Error removing profile photo:', error);
            throw error;
        }
    }

    /**
     * Get privacy settings.
     */
    async getPrivacySettings(userId: string, token: JwtToken): Promise<PrivacySettings> {
        try {
            console.log('SettingsRepository: Getting privacy settings for user:', userId);
            
            const response = await fetch(`/api/users/${userId}/privacy`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch privacy settings: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('SettingsRepository: Privacy settings retrieved successfully');
            return data;
        } catch (error) {
            console.error('SettingsRepository: Error getting privacy settings:', error);
            throw error;
        }
    }

    /**
     * Update privacy settings.
     */
    async updatePrivacySettings(userId: string, settings: PrivacySettings, token: JwtToken): Promise<PrivacySettings> {
        try {
            console.log('SettingsRepository: Updating privacy settings for user:', userId);
            
            const response = await fetch(`/api/users/${userId}/privacy`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update privacy settings: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('SettingsRepository: Privacy settings updated successfully');
            return data;
        } catch (error) {
            console.error('SettingsRepository: Error updating privacy settings:', error);
            throw error;
        }
    }

    /**
     * Get notification settings.
     */
    async getNotificationSettings(userId: string, token: JwtToken): Promise<NotificationSettings> {
        try {
            console.log('SettingsRepository: Getting notification settings for user:', userId);
            
            const response = await fetch(`/api/users/${userId}/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch notification settings: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('SettingsRepository: Notification settings retrieved successfully');
            return data;
        } catch (error) {
            console.error('SettingsRepository: Error getting notification settings:', error);
            throw error;
        }
    }

    /**
     * Update notification settings.
     */
    async updateNotificationSettings(userId: string, settings: NotificationSettings, token: JwtToken): Promise<NotificationSettings> {
        try {
            console.log('SettingsRepository: Updating notification settings for user:', userId);
            
            const response = await fetch(`/api/users/${userId}/notifications`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update notification settings: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('SettingsRepository: Notification settings updated successfully');
            return data;
        } catch (error) {
            console.error('SettingsRepository: Error updating notification settings:', error);
            throw error;
        }
    }
}
