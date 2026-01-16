/**
 * Settings Hook.
 * 
 * Hook for managing settings functionality with repository pattern.
 * Provides settings state management and operations.
 */

import { useState, useCallback, useEffect } from 'react';
import type { ProfileSettingsRequest, UserProfileResponse } from "@/api/schemas/inferred/user";
import type { 
    ProfileSettings, 
    PrivacySettings, 
    NotificationSettings 
} from "../../domain/entities/SettingsEntities";
import { useSettingsService } from "../../di/useSettingsDI";

/**
 * Settings State interface.
 */
export interface SettingsState {
    profile: UserProfileResponse | null;
    privacy: PrivacySettings | null;
    notifications: NotificationSettings | null;
    isLoading: boolean;
    error: Error | null;
}

/**
 * Settings Actions interface.
 */
export interface SettingsActions {
    getProfileSettings: () => Promise<void>;
    updateProfileSettings: (settings: ProfileSettingsRequest) => Promise<void>;
    getPrivacySettings: () => Promise<void>;
    updatePrivacySettings: (settings: PrivacySettings) => Promise<void>;
    getNotificationSettings: () => Promise<void>;
    updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
    uploadProfilePhoto: (file: File) => Promise<void>;
    removeProfilePhoto: () => Promise<void>;
    clearError: () => void;
}

/**
 * Settings Hook.
 * 
 * @param userId - The user ID
 * @returns Settings state and actions
 */
export const useSettings = (userId: string): SettingsState & SettingsActions => {
    const settingsService = useSettingsService();
    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [privacy, setPrivacy] = useState<PrivacySettings | null>(null);
    const [notifications, setNotifications] = useState<NotificationSettings | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const getProfileSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const profileData = await settingsService.getProfileSettings(userId);
            setProfile(profileData);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const updateProfileSettings = useCallback(async (settings: ProfileSettingsRequest) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedProfile = await settingsService.updateProfileSettings(userId, settings);
            setProfile(updatedProfile);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const getPrivacySettings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const privacyData = await settingsService.getPrivacySettings(userId);
            setPrivacy(privacyData);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const updatePrivacySettings = useCallback(async (settings: PrivacySettings) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedPrivacy = await settingsService.updatePrivacySettings(userId, settings);
            setPrivacy(updatedPrivacy);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const getNotificationSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const notificationData = await settingsService.getNotificationSettings(userId);
            setNotifications(notificationData);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const updateNotificationSettings = useCallback(async (settings: NotificationSettings) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedNotifications = await settingsService.updateNotificationSettings(userId, settings);
            setNotifications(updatedNotifications);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const uploadProfilePhoto = useCallback(async (file: File) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedProfile = await settingsService.uploadProfilePhoto(userId, file);
            setProfile(updatedProfile);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const removeProfilePhoto = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedProfile = await settingsService.removeProfilePhoto(userId);
            setProfile(updatedProfile);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // Load initial data
    useEffect(() => {
        if (userId) {
            getProfileSettings();
        }
    }, [userId, getProfileSettings]);

    return {
        // State
        profile,
        privacy,
        notifications,
        isLoading,
        error,
        
        // Actions
        getProfileSettings,
        updateProfileSettings,
        getPrivacySettings,
        updatePrivacySettings,
        getNotificationSettings,
        updateNotificationSettings,
        uploadProfilePhoto,
        removeProfilePhoto,
        clearError
    };
};
