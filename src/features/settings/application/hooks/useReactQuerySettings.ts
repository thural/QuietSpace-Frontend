/**
 * React Query Settings Hook.
 * 
 * Hook that provides React Query-based settings functionality.
 * Can be toggled on/off based on configuration.
 */

import { useState, useEffect, useCallback } from 'react';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type { ProfileSettingsRequest, UserProfileResponse } from "@/api/schemas/inferred/user";
import type { 
    ProfileSettings, 
    PrivacySettings, 
    NotificationSettings 
} from "../../domain/entities/SettingsEntities";
import { useAuthStore } from '@services/store/zustand';
import { ReactQuerySettingsService, type IReactQuerySettingsService } from "../services/ReactQuerySettingsService";
import { useSettingsDI } from "../../di/useSettingsDI";
import type { JwtToken } from "@/api/schemas/inferred/common";

/**
 * React Query Settings State interface.
 */
export interface ReactQuerySettingsState {
    profile: UseQueryResult<UserProfileResponse, Error>;
    privacy: UseQueryResult<PrivacySettings, Error>;
    notifications: UseQueryResult<NotificationSettings, Error>;
    isLoading: boolean;
    error: Error | null;
}

/**
 * React Query Settings Actions interface.
 */
export interface ReactQuerySettingsActions {
    updateProfileSettings: UseMutationResult<UserProfileResponse, Error, { userId: string; settings: ProfileSettingsRequest; token: JwtToken }>;
    uploadProfilePhoto: UseMutationResult<UserProfileResponse, Error, { userId: string; file: File; token: JwtToken }>;
    removeProfilePhoto: UseMutationResult<UserProfileResponse, Error, { userId: string; token: JwtToken }>;
    updatePrivacySettings: UseMutationResult<PrivacySettings, Error, { userId: string; settings: PrivacySettings; token: JwtToken }>;
    updateNotificationSettings: UseMutationResult<NotificationSettings, Error, { userId: string; settings: NotificationSettings; token: JwtToken }>;
    prefetchProfileSettings: (userId: string) => Promise<void>;
    prefetchPrivacySettings: (userId: string) => Promise<void>;
    prefetchNotificationSettings: (userId: string) => Promise<void>;
    invalidateSettingsCache: () => void;
}

/**
 * React Query Settings Hook.
 * 
 * Provides React Query-based settings functionality with toggle support.
 */
export const useReactQuerySettings = (
    userId: string
): ReactQuerySettingsState & ReactQuerySettingsActions => {
    const [token, setToken] = useState<JwtToken | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Get DI container and configuration
    const diContainer = useSettingsDI();
    const config = diContainer.getConfig();

    // Initialize React Query service
    const [reactQueryService, setReactQueryService] = useState<IReactQuerySettingsService | null>(null);

    useEffect(() => {
        // Get token from auth store
        const authStore = useAuthStore.getState();
        const currentToken = authStore.data.accessToken || null;
        setToken(currentToken);

        // Initialize React Query service
        if (config.useReactQuery && !reactQueryService) {
            const settingsRepository = diContainer.getSettingsRepository();
            setReactQueryService(new ReactQuerySettingsService(settingsRepository));
        }

        setIsInitialized(true);
    }, [config.useReactQuery, reactQueryService, diContainer]);

    // Get settings results
    const profile = reactQueryService?.getProfileSettings(userId, token || '') || 
        { data: null, isLoading: false, error: null, refetch: () => {} } as UseQueryResult<UserProfileResponse, Error>;
    
    const privacy = reactQueryService?.getPrivacySettings(userId, token || '') || 
        { data: null, isLoading: false, error: null, refetch: () => {} } as UseQueryResult<PrivacySettings, Error>;
    
    const notifications = reactQueryService?.getNotificationSettings(userId, token || '') || 
        { data: null, isLoading: false, error: null, refetch: () => {} } as UseQueryResult<NotificationSettings, Error>;

    // Combined loading state
    const isLoading = profile.isLoading || privacy.isLoading || notifications.isLoading;
    const error = profile.error || privacy.error || notifications.error;

    // Actions
    const updateProfileSettings = reactQueryService?.updateProfileSettings() || 
        { mutate: () => {}, isPending: false, error: null } as unknown as UseMutationResult<UserProfileResponse, Error, { userId: string; settings: ProfileSettingsRequest; token: JwtToken }>;
    
    const uploadProfilePhoto = reactQueryService?.uploadProfilePhoto() || 
        { mutate: () => {}, isPending: false, error: null } as unknown as UseMutationResult<UserProfileResponse, Error, { userId: string; file: File; token: JwtToken }>;
    
    const removeProfilePhoto = reactQueryService?.removeProfilePhoto() || 
        { mutate: () => {}, isPending: false, error: null } as unknown as UseMutationResult<UserProfileResponse, Error, { userId: string; token: JwtToken }>;
    
    const updatePrivacySettings = reactQueryService?.updatePrivacySettings() || 
        { mutate: () => {}, isPending: false, error: null } as unknown as UseMutationResult<PrivacySettings, Error, { userId: string; settings: PrivacySettings; token: JwtToken }>;
    
    const updateNotificationSettings = reactQueryService?.updateNotificationSettings() || 
        { mutate: () => {}, isPending: false, error: null } as unknown as UseMutationResult<NotificationSettings, Error, { userId: string; settings: NotificationSettings; token: JwtToken }>;

    const prefetchProfileSettings = useCallback(async (userId: string) => {
        if (reactQueryService && token) {
            await reactQueryService.prefetchProfileSettings(userId, token);
        }
    }, [reactQueryService, token]);

    const prefetchPrivacySettings = useCallback(async (userId: string) => {
        if (reactQueryService && token) {
            await reactQueryService.prefetchPrivacySettings(userId, token);
        }
    }, [reactQueryService, token]);

    const prefetchNotificationSettings = useCallback(async (userId: string) => {
        if (reactQueryService && token) {
            await reactQueryService.prefetchNotificationSettings(userId, token);
        }
    }, [reactQueryService, token]);

    const invalidateSettingsCache = useCallback(() => {
        if (reactQueryService) {
            reactQueryService.invalidateSettingsCache();
        }
    }, [reactQueryService]);

    return {
        // State
        profile,
        privacy,
        notifications,
        isLoading,
        error,
        
        // Actions
        updateProfileSettings,
        uploadProfilePhoto,
        removeProfilePhoto,
        updatePrivacySettings,
        updateNotificationSettings,
        prefetchProfileSettings,
        prefetchPrivacySettings,
        prefetchNotificationSettings,
        invalidateSettingsCache
    };
};
