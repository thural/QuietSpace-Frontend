/**
 * Profile Settings Hook
 * 
 * Enterprise-grade profile settings management with custom query system
 * and intelligent caching for user preferences and privacy settings
 */

import { useState, useCallback, useEffect } from 'react';
import { useCustomQuery } from '@/core/hooks/useCustomQuery';
import { useCustomMutation } from '@/core/hooks/useCustomMutation';
import { useCacheInvalidation } from '@/core/hooks/useCacheInvalidation';
import { useProfileServices } from './useProfileServices';
import { useAuthStore } from '@services/store/zustand';
import { JwtToken } from '@/shared/api/models/common';
import { PROFILE_CACHE_TTL } from '../data/cache/ProfileCacheKeys';

/**
 * Profile Settings State interface.
 */
export interface ProfileSettingsState {
    settings: any | null;
    privacy: any | null;
    isLoading: boolean;
    error: Error | null;
    selectedUserId: string | number | null;
    hasUnsavedChanges: boolean;
}

/**
 * Profile Settings Actions interface.
 */
export interface ProfileSettingsActions {
    // Settings operations
    getSettings: (userId: string | number) => Promise<void>;
    updateSettings: (userId: string | number, settings: any) => Promise<any>;
    resetSettings: (userId: string | number) => Promise<void>;
    
    // Privacy operations
    getPrivacy: (userId: string | number) => Promise<void>;
    updatePrivacy: (userId: string | number, privacy: any) => Promise<any>;
    resetPrivacy: (userId: string | number) => Promise<void>;
    
    // Batch operations
    updateAllSettings: (userId: string | number, settings: any, privacy: any) => Promise<{ settings: any; privacy: any }>;
    
    // State management
    setSelectedUserId: (userId: string | number | null) => void;
    clearError: () => void;
    refresh: () => void;
    checkUnsavedChanges: () => boolean;
    discardChanges: () => void;
}

/**
 * Profile Settings Hook - Enterprise Edition
 * 
 * Hook that provides profile settings management functionality with enterprise-grade architecture.
 * Integrates with custom query system, intelligent caching, and settings management.
 */
export const useProfileSettings = (config?: { userId?: string | number }): ProfileSettingsState & ProfileSettingsActions => {
    const { profileDataService } = useProfileServices();
    const invalidateCache = useCacheInvalidation();
    const { data: authData } = useAuthStore();

    // State
    const [selectedUserId, setSelectedUserId] = useState<string | number | null>(config?.userId || authData?.userId || null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [originalSettings, setOriginalSettings] = useState<{ settings: any; privacy: any } | null>(null);
    const [error, setError] = useState<Error | null>(null);

    // Get current user ID and token
    const currentUserId = selectedUserId || authData?.userId || 'current-user';
    const getAuthToken = useCallback((): string => {
        try {
            const authStore = useAuthStore.getState();
            return authStore.data.accessToken || '';
        } catch (err) {
            console.error('useProfileSettings: Error getting auth token', err);
            return '';
        }
    }, []);

    // Custom query for user settings
    const settingsQuery = useCustomQuery(
        ['profile', 'settings', currentUserId],
        () => profileDataService.getUserSettings(currentUserId, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_SETTINGS,
            cacheTime: PROFILE_CACHE_TTL.USER_SETTINGS,
            refetchInterval: PROFILE_CACHE_TTL.USER_SETTINGS / 2,
            onSuccess: (data) => {
                console.log('Settings loaded:', { 
                    userId: currentUserId,
                    theme: data?.theme,
                    language: data?.language 
                });
                
                // Set original settings for change detection
                if (!originalSettings) {
                    setOriginalSettings({ settings: data, privacy: null });
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error fetching settings:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for privacy settings
    const privacyQuery = useCustomQuery(
        ['profile', 'privacy', currentUserId],
        () => profileDataService.getUserPrivacy(currentUserId, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_PRIVACY,
            cacheTime: PROFILE_CACHE_TTL.USER_PRIVACY,
            refetchInterval: PROFILE_CACHE_TTL.USER_PRIVACY / 2,
            onSuccess: (data) => {
                console.log('Privacy settings loaded:', { 
                    userId: currentUserId,
                    profileVisibility: data?.profileVisibility 
                });
                
                // Update original settings for change detection
                if (originalSettings) {
                    setOriginalSettings(prev => ({ 
                        settings: prev.settings, 
                        privacy: data 
                    }));
                }
            },
            onError: (error) => {
                console.error('Error fetching privacy settings:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom mutation for updating settings
    const updateSettingsMutation = useCustomMutation(
        ({ userId, settings }: { userId: string | number; settings: any }) => 
            profileDataService.updateSettings(userId, settings, getAuthToken()),
        {
            onSuccess: (result, variables) => {
                console.log('Settings updated:', { 
                    userId: variables.userId,
                    updatedFields: Object.keys(variables.settings)
                });
                
                // Invalidate settings cache
                invalidateCache.invalidateSettings(variables.userId);
                
                // Update original settings
                if (originalSettings) {
                    setOriginalSettings(prev => ({ 
                        settings: result, 
                        privacy: prev.privacy 
                    }));
                }
                
                setHasUnsavedChanges(false);
                
                // Refetch settings if it's the current user
                if (variables.userId === currentUserId) {
                    settingsQuery.refetch();
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error updating settings:', error);
                throw error;
            }
        }
    );

    // Custom mutation for updating privacy
    const updatePrivacyMutation = useCustomMutation(
        ({ userId, privacy }: { userId: string | number; privacy: any }) => 
            profileDataService.updatePrivacy(userId, privacy, getAuthToken()),
        {
            onSuccess: (result, variables) => {
                console.log('Privacy settings updated:', { 
                    userId: variables.userId,
                    updatedFields: Object.keys(variables.privacy)
                });
                
                // Invalidate privacy cache
                invalidateCache.invalidateSettings(variables.userId);
                
                // Update original settings
                if (originalSettings) {
                    setOriginalSettings(prev => ({ 
                        settings: prev.settings, 
                        privacy: result 
                    }));
                }
                
                setHasUnsavedChanges(false);
                
                // Refetch privacy if it's the current user
                if (variables.userId === currentUserId) {
                    privacyQuery.refetch();
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error updating privacy settings:', error);
                throw error;
            }
        }
    );

    // Custom mutation for batch update
    const updateAllSettingsMutation = useCustomMutation(
        ({ userId, settings, privacy }: { userId: string | number; settings: any; privacy: any }) => 
            Promise.all([
                profileDataService.updateSettings(userId, settings, getAuthToken()),
                profileDataService.updatePrivacy(userId, privacy, getAuthToken())
            ]),
        {
            onSuccess: (result, variables) => {
                console.log('All settings updated:', { 
                    userId: variables.userId,
                    settingsUpdated: !!result[0],
                    privacyUpdated: !!result[1]
                });
                
                // Invalidate caches
                invalidateCache.invalidateSettings(variables.userId);
                
                // Update original settings
                setOriginalSettings({ settings: result[0], privacy: result[1] });
                setHasUnsavedChanges(false);
                
                // Refetch if it's the current user
                if (variables.userId === currentUserId) {
                    settingsQuery.refetch();
                    privacyQuery.refetch();
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error updating all settings:', error);
                throw error;
            }
        }
    );

    // Custom mutation for resetting settings
    const resetSettingsMutation = useCustomMutation(
        ({ userId }: { userId: string | number }) => 
            profileDataService.updateSettings(userId, {
                theme: 'light',
                language: 'en',
                timezone: 'UTC',
                notifications: {
                    email: true,
                    push: true,
                    sms: false,
                    marketing: false,
                    security: true,
                    mentions: true,
                    follows: true,
                    likes: true,
                    comments: true
                }
            }, getAuthToken()),
        {
            onSuccess: (result, variables) => {
                console.log('Settings reset:', { userId: variables.userId });
                
                // Invalidate settings cache
                invalidateCache.invalidateSettings(variables.userId);
                
                // Update original settings
                if (originalSettings) {
                    setOriginalSettings(prev => ({ 
                        settings: result, 
                        privacy: prev.privacy 
                    }));
                }
                
                setHasUnsavedChanges(false);
                
                // Refetch settings if it's the current user
                if (variables.userId === currentUserId) {
                    settingsQuery.refetch();
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error resetting settings:', error);
                throw error;
            }
        }
    );

    // Custom mutation for resetting privacy
    const resetPrivacyMutation = useCustomMutation(
        ({ userId }: { userId: string | number }) => 
            profileDataService.updatePrivacy(userId, {
                profileVisibility: 'public',
                showEmail: false,
                showPhone: false,
                showLocation: false,
                showBirthdate: false,
                showFollowers: true,
                showFollowing: true,
                allowFollowRequests: true,
                allowTagging: true,
                allowSearchIndexing: true
            }, getAuthToken()),
        {
            onSuccess: (result, variables) => {
                console.log('Privacy settings reset:', { userId: variables.userId });
                
                // Invalidate privacy cache
                invalidateCache.invalidateSettings(variables.userId);
                
                // Update original settings
                if (originalSettings) {
                    setOriginalSettings(prev => ({ 
                        settings: prev.settings, 
                        privacy: result 
                    }));
                }
                
                setHasUnsavedChanges(false);
                
                // Refetch privacy if it's the current user
                if (variables.userId === currentUserId) {
                    privacyQuery.refetch();
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error resetting privacy settings:', error);
                throw error;
            }
        }
    );

    // Action implementations
    const getSettings = useCallback(async (userId: string | number) => {
        try {
            setError(null);
            setSelectedUserId(userId);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting settings:', err);
        }
    }, [setSelectedUserId]);

    const updateSettings = useCallback(async (userId: string | number, settings: any) => {
        try {
            setError(null);
            const result = await updateSettingsMutation.mutateAsync({ userId, settings });
            
            // Check for unsaved changes
            if (originalSettings) {
                const hasChanges = JSON.stringify(originalSettings.settings) !== JSON.stringify(result);
                setHasUnsavedChanges(hasChanges);
            }
            
            return result;
        } catch (err) {
            setError(err as Error);
            console.error('Error updating settings:', err);
            throw err;
        }
    }, [updateSettingsMutation, originalSettings]);

    const resetSettings = useCallback(async (userId: string | number) => {
        await resetSettingsMutation.mutateAsync({ userId });
    }, [resetSettingsMutation]);

    const getPrivacy = useCallback(async (userId: string | number) => {
        try {
            setError(null);
            setSelectedUserId(userId);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting privacy settings:', err);
        }
    }, [setSelectedUserId]);

    const updatePrivacy = useCallback(async (userId: string | number, privacy: any) => {
        try {
            setError(null);
            const result = await updatePrivacyMutation.mutateAsync({ userId, privacy });
            
            // Check for unsaved changes
            if (originalSettings) {
                const hasChanges = JSON.stringify(originalSettings.privacy) !== JSON.stringify(result);
                setHasUnsavedChanges(hasChanges);
            }
            
            return result;
        } catch (err) {
            setError(err as Error);
            console.error('Error updating privacy settings:', err);
            throw err;
        }
    }, [updatePrivacyMutation, originalSettings]);

    const resetPrivacy = useCallback(async (userId: string | number) => {
        await resetPrivacyMutation.mutateAsync({ userId });
    }, [resetPrivacyMutation]);

    const updateAllSettings = useCallback(async (userId: string | number, settings: any, privacy: any) => {
        try {
            setError(null);
            const result = await updateAllSettingsMutation.mutateAsync({ userId, settings, privacy });
            
            // Update original settings
            setOriginalSettings({ settings: result[0], privacy: result[1] });
            setHasUnsavedChanges(false);
            
            return result;
        } catch (err) {
            setError(err as Error);
            console.error('Error updating all settings:', err);
            throw err;
        }
    }, [updateAllSettingsMutation]);

    const checkUnsavedChanges = useCallback((): boolean => {
        if (!originalSettings) return false;
        
        const currentSettings = settingsQuery.data;
        const currentPrivacy = privacyQuery.data;
        
        if (!currentSettings || !currentPrivacy) return false;
        
        const settingsChanged = JSON.stringify(originalSettings.settings) !== JSON.stringify(currentSettings);
        const privacyChanged = JSON.stringify(originalSettings.privacy) !== JSON.stringify(currentPrivacy);
        
        return settingsChanged || privacyChanged;
    }, [originalSettings, settingsQuery.data, privacyQuery.data]);

    const discardChanges = useCallback(() => {
        if (originalSettings) {
            // Reset to original settings
            updateSettingsMutation.mutateAsync({ 
                userId: currentUserId, 
                settings: originalSettings.settings 
            }).catch(err => {
                console.error('Error discarding settings changes:', err);
            });
            
            updatePrivacyMutation.mutateAsync({ 
                userId: currentUserId, 
                privacy: originalSettings.privacy 
            }).catch(err => {
                console.error('Error discarding privacy changes:', err);
            });
        }
        
        setHasUnsavedChanges(false);
    }, [originalSettings, currentUserId, updateSettingsMutation, updatePrivacyMutation]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const refresh = useCallback(() => {
        settingsQuery.refetch();
        privacyQuery.refetch();
    }, [settingsQuery, privacyQuery]);

    // Auto-check for unsaved changes when data changes
    useEffect(() => {
        if (settingsQuery.data && privacyQuery.data && originalSettings) {
            const settingsChanged = JSON.stringify(originalSettings.settings) !== JSON.stringify(settingsQuery.data);
            const privacyChanged = JSON.stringify(originalSettings.privacy) !== JSON.stringify(privacyQuery.data);
            
            setHasUnsavedChanges(settingsChanged || privacyChanged);
        }
    }, [settingsQuery.data, privacyQuery.data, originalSettings]);

    return {
        // State
        settings: settingsQuery.data,
        privacy: privacyQuery.data,
        isLoading: settingsQuery.isLoading || privacyQuery.isLoading,
        error: error || settingsQuery.error || privacyQuery.error,
        selectedUserId,
        hasUnsavedChanges,

        // Actions
        getSettings,
        updateSettings,
        resetSettings,
        getPrivacy,
        updatePrivacy,
        resetPrivacy,
        updateAllSettings,
        setSelectedUserId,
        clearError,
        refresh,
        checkUnsavedChanges,
        discardChanges
    };
};
