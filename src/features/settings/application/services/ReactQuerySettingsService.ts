/**
 * React Query Settings Service.
 * 
 * Service that wraps React Query for settings operations.
 * Provides caching, prefetching, and background updates.
 */

import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from '@tanstack/react-query';
import type { ProfileSettingsRequest, UserProfileResponse } from "@/features/profile/data/models/user";
import type { JwtToken } from "@/shared/api/models/common";
import type { ISettingsRepository } from "../../domain/entities/SettingsRepository";
import type {
    ProfileSettings,
    PrivacySettings,
    NotificationSettings
} from "../../domain/entities/SettingsEntities";
import { useAuthStore } from "@services/store/zustand";

/**
 * React Query Settings Service interface.
 */
export interface IReactQuerySettingsService {
    // Profile settings
    getProfileSettings(userId: string, token: JwtToken): UseQueryResult<UserProfileResponse, Error>;
    updateProfileSettings(): UseMutationResult<UserProfileResponse, Error, { userId: string; settings: ProfileSettingsRequest; token: JwtToken }>;
    uploadProfilePhoto(): UseMutationResult<UserProfileResponse, Error, { userId: string; file: File; token: JwtToken }>;
    removeProfilePhoto(): UseMutationResult<UserProfileResponse, Error, { userId: string; token: JwtToken }>;

    // Privacy settings
    getPrivacySettings(userId: string, token: JwtToken): UseQueryResult<PrivacySettings, Error>;
    updatePrivacySettings(): UseMutationResult<PrivacySettings, Error, { userId: string; settings: PrivacySettings; token: JwtToken }>;

    // Notification settings
    getNotificationSettings(userId: string, token: JwtToken): UseQueryResult<NotificationSettings, Error>;
    updateNotificationSettings(): UseMutationResult<NotificationSettings, Error, { userId: string; settings: NotificationSettings; token: JwtToken }>;

    // Cache management
    prefetchProfileSettings(userId: string, token: JwtToken): Promise<void>;
    prefetchPrivacySettings(userId: string, token: JwtToken): Promise<void>;
    prefetchNotificationSettings(userId: string, token: JwtToken): Promise<void>;
    invalidateSettingsCache(): void;
}

/**
 * React Query Settings Service implementation.
 */
export class ReactQuerySettingsService implements IReactQuerySettingsService {
    private queryClient = useQueryClient();

    constructor(private settingsRepository: ISettingsRepository) { }

    /**
     * Get profile settings with React Query.
     */
    getProfileSettings(userId: string, token: JwtToken): UseQueryResult<UserProfileResponse, Error> {
        return useQuery({
            queryKey: ['profileSettings', userId],
            queryFn: async () => await this.settingsRepository.getProfileSettings(userId, token),
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            enabled: !!userId && !!token
        });
    }

    /**
     * Update profile settings with React Query mutation.
     */
    updateProfileSettings(): UseMutationResult<UserProfileResponse, Error, { userId: string; settings: ProfileSettingsRequest; token: JwtToken }> {
        return useMutation({
            mutationFn: async ({ userId, settings, token }) =>
                await this.settingsRepository.updateProfileSettings(userId, settings, token),
            onSuccess: (data, variables) => {
                // Update cache with new data
                this.queryClient.setQueryData(['profileSettings', variables.userId], data);
            },
            onError: (error) => {
                console.error('ReactQuerySettingsService: Error updating profile settings:', error);
            }
        });
    }

    /**
     * Upload profile photo with React Query mutation.
     */
    uploadProfilePhoto(): UseMutationResult<UserProfileResponse, Error, { userId: string; file: File; token: JwtToken }> {
        return useMutation({
            mutationFn: async ({ userId, file, token }) =>
                await this.settingsRepository.uploadProfilePhoto(userId, file, token),
            onSuccess: (data, variables) => {
                // Update cache with new data
                this.queryClient.setQueryData(['profileSettings', variables.userId], data);
            },
            onError: (error) => {
                console.error('ReactQuerySettingsService: Error uploading profile photo:', error);
            }
        });
    }

    /**
     * Remove profile photo with React Query mutation.
     */
    removeProfilePhoto(): UseMutationResult<UserProfileResponse, Error, { userId: string; token: JwtToken }> {
        return useMutation({
            mutationFn: async ({ userId, token }) =>
                await this.settingsRepository.removeProfilePhoto(userId, token),
            onSuccess: (data, variables) => {
                // Update cache with new data
                this.queryClient.setQueryData(['profileSettings', variables.userId], data);
            },
            onError: (error) => {
                console.error('ReactQuerySettingsService: Error removing profile photo:', error);
            }
        });
    }

    /**
     * Get privacy settings with React Query.
     */
    getPrivacySettings(userId: string, token: JwtToken): UseQueryResult<PrivacySettings, Error> {
        return useQuery({
            queryKey: ['privacySettings', userId],
            queryFn: async () => await this.settingsRepository.getPrivacySettings(userId, token),
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            enabled: !!userId && !!token
        });
    }

    /**
     * Update privacy settings with React Query mutation.
     */
    updatePrivacySettings(): UseMutationResult<PrivacySettings, Error, { userId: string; settings: PrivacySettings; token: JwtToken }> {
        return useMutation({
            mutationFn: async ({ userId, settings, token }) =>
                await this.settingsRepository.updatePrivacySettings(userId, settings, token),
            onSuccess: (data, variables) => {
                // Update cache with new data
                this.queryClient.setQueryData(['privacySettings', variables.userId], data);
            },
            onError: (error) => {
                console.error('ReactQuerySettingsService: Error updating privacy settings:', error);
            }
        });
    }

    /**
     * Get notification settings with React Query.
     */
    getNotificationSettings(userId: string, token: JwtToken): UseQueryResult<NotificationSettings, Error> {
        return useQuery({
            queryKey: ['notificationSettings', userId],
            queryFn: async () => await this.settingsRepository.getNotificationSettings(userId, token),
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            enabled: !!userId && !!token
        });
    }

    /**
     * Update notification settings with React Query mutation.
     */
    updateNotificationSettings(): UseMutationResult<NotificationSettings, Error, { userId: string; settings: NotificationSettings; token: JwtToken }> {
        return useMutation({
            mutationFn: async ({ userId, settings, token }) =>
                await this.settingsRepository.updateNotificationSettings(userId, settings, token),
            onSuccess: (data, variables) => {
                // Update cache with new data
                this.queryClient.setQueryData(['notificationSettings', variables.userId], data);
            },
            onError: (error) => {
                console.error('ReactQuerySettingsService: Error updating notification settings:', error);
            }
        });
    }

    /**
     * Prefetch profile settings.
     */
    async prefetchProfileSettings(userId: string, token: JwtToken): Promise<void> {
        await this.queryClient.prefetchQuery({
            queryKey: ['profileSettings', userId],
            queryFn: async () => await this.settingsRepository.getProfileSettings(userId, token),
            staleTime: 5 * 60 * 1000
        });
    }

    /**
     * Prefetch privacy settings.
     */
    async prefetchPrivacySettings(userId: string, token: JwtToken): Promise<void> {
        await this.queryClient.prefetchQuery({
            queryKey: ['privacySettings', userId],
            queryFn: async () => await this.settingsRepository.getPrivacySettings(userId, token),
            staleTime: 5 * 60 * 1000
        });
    }

    /**
     * Prefetch notification settings.
     */
    async prefetchNotificationSettings(userId: string, token: JwtToken): Promise<void> {
        await this.queryClient.prefetchQuery({
            queryKey: ['notificationSettings', userId],
            queryFn: async () => await this.settingsRepository.getNotificationSettings(userId, token),
            staleTime: 5 * 60 * 1000
        });
    }

    /**
     * Invalidate all settings cache.
     */
    invalidateSettingsCache(): void {
        this.queryClient.invalidateQueries({ queryKey: ['profileSettings'] });
        this.queryClient.invalidateQueries({ queryKey: ['privacySettings'] });
        this.queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
    }
}
