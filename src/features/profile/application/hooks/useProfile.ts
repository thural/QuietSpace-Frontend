/**
 * Profile Hook - Enterprise Edition
 * 
 * Hook for managing profile functionality with enterprise-grade architecture.
 * Uses custom query system, intelligent caching, and advanced profile management.
 */

import { useState, useCallback, useEffect } from 'react';
import { useCustomQuery } from '@/core/modules/hooks/useCustomQuery';
import { useCustomMutation } from '@/core/modules/hooks/useCustomMutation';
import { useCacheInvalidation } from '@/core/modules/hooks/migrationUtils';
import { useProfileServices } from './useProfileServices';
import { useFeatureAuth } from '@/core/modules/authentication';
import { UserProfileEntity, UserProfileStatsEntity, UserConnectionEntity } from '@features/profile/domain/entities/IProfileRepository';
import { JwtToken } from '@/shared/api/models/common';
import { PROFILE_CACHE_TTL } from '../data/cache/ProfileCacheKeys';

/**
 * Profile State interface.
 */
export interface ProfileState {
    profile: UserProfileEntity | null;
    stats: UserProfileStatsEntity | null;
    followers: UserConnectionEntity[] | null;
    followings: UserConnectionEntity[] | null;
    searchResults: UserProfileEntity[] | null;
    suggestions: UserProfileEntity[] | null;
    settings: any | null;
    privacy: any | null;
    isLoading: boolean;
    error: Error | null;
    selectedUserId: string | number | null;
}

/**
 * Profile Actions interface.
 */
export interface ProfileActions {
    // Profile operations
    getProfile: (userId: string | number) => Promise<void>;
    getCurrentProfile: () => Promise<void>;
    updateProfile: (userId: string | number, updates: Partial<UserProfileEntity>) => Promise<UserProfileEntity>;
    deleteProfile: (userId: string | number) => Promise<void>;

    // Profile statistics
    getStats: (userId: string | number) => Promise<void>;
    updateStats: (userId: string | number, stats: Partial<UserProfileStatsEntity>) => Promise<UserProfileStatsEntity>;

    // Connection operations
    getFollowers: (userId: string | number, options?: { limit?: number; offset?: number; search?: string }) => Promise<void>;
    getFollowings: (userId: string | number, options?: { limit?: number; offset?: number; search?: string }) => Promise<void>;
    followUser: (userId: string | number, targetUserId: string | number) => Promise<UserConnectionEntity>;
    unfollowUser: (userId: string | number, targetUserId: string | number) => Promise<void>;

    // Search and discovery
    searchUsers: (query: string, options?: { limit?: number; offset?: number; filters?: Record<string, any> }) => Promise<void>;
    getUserSuggestions: (userId: string | number, options?: { limit?: number; type?: 'mutual' | 'popular' | 'new' }) => Promise<void>;

    // Settings and privacy
    getSettings: (userId: string | number) => Promise<void>;
    updateSettings: (userId: string | number, settings: any) => Promise<any>;
    getPrivacy: (userId: string | number) => Promise<void>;
    updatePrivacy: (userId: string | number, privacy: any) => Promise<any>;

    // State management
    setSelectedUserId: (userId: string | number | null) => void;
    clearError: () => void;
    refresh: () => void;
}

/**
 * Profile Hook - Enterprise Edition
 * 
 * Hook that provides profile functionality with enterprise-grade architecture.
 * Integrates with custom query system, intelligent caching, and advanced profile management.
 */
export const useProfile = (config?: { userId?: string | number }): ProfileState & ProfileActions => {
    const { profileDataService, profileFeatureService } = useProfileServices();
    const invalidateCache = useCacheInvalidation();
    const { token, userId } = useFeatureAuth();

    // State
    const [selectedUserId, setSelectedUserId] = useState<string | number | null>(config?.userId || null);
    const [error, setError] = useState<Error | null>(null);

    // Get current user ID and token
    const currentUserId = String(selectedUserId || userId || 'current-user');
    const getAuthToken = useCallback((): string => {
        return token || '';
    }, [token]);

    // Custom query for profile with enterprise caching
    const profileQuery = useCustomQuery(
        ['profile', 'user', currentUserId],
        () => profileDataService.getUserProfile(currentUserId, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_PROFILE,
            cacheTime: PROFILE_CACHE_TTL.USER_PROFILE,
            refetchInterval: PROFILE_CACHE_TTL.USER_PROFILE / 2, // Refresh at half TTL
            onSuccess: (data) => {
                console.log('Profile loaded:', {
                    userId: data.id,
                    username: data.username,
                    isVerified: data.isVerified
                });
            },
            onError: (error) => {
                setError(error);
                console.error('Error fetching profile:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for current user profile
    const currentProfileQuery = useCustomQuery(
        ['profile', 'current', 'user'],
        () => profileDataService.getCurrentUserProfile(getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.CURRENT_USER_PROFILE,
            cacheTime: PROFILE_CACHE_TTL.CURRENT_USER_PROFILE,
            refetchInterval: PROFILE_CACHE_TTL.CURRENT_USER_PROFILE / 3, // Refresh more frequently for current user
            onSuccess: (data) => {
                console.log('Current profile loaded:', {
                    userId: data.id,
                    username: data.username
                });
            },
            onError: (error) => {
                console.error('Error fetching current profile:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for user stats
    const statsQuery = useCustomQuery(
        ['profile', 'stats', currentUserId],
        () => profileDataService.getUserStats(currentUserId, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_STATS,
            cacheTime: PROFILE_CACHE_TTL.USER_STATS,
            refetchInterval: PROFILE_CACHE_TTL.USER_STATS / 2,
            onSuccess: (data) => {
                console.log('Profile stats loaded:', {
                    userId: currentUserId,
                    followersCount: data.followersCount,
                    followingsCount: data.followingsCount
                });
            },
            onError: (error) => {
                console.error('Error fetching profile stats:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for followers
    const followersQuery = useCustomQuery(
        ['profile', 'followers', currentUserId],
        () => profileDataService.getUserFollowers(currentUserId, {}, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_FOLLOWERS,
            cacheTime: PROFILE_CACHE_TTL.USER_FOLLOWERS,
            onSuccess: (data) => {
                console.log('Followers loaded:', {
                    userId: currentUserId,
                    count: data.length
                });
            },
            onError: (error) => {
                console.error('Error fetching followers:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for followings
    const followingsQuery = useCustomQuery(
        ['profile', 'followings', currentUserId],
        () => profileDataService.getUserFollowings(currentUserId, {}, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_FOLLOWINGS,
            cacheTime: PROFILE_CACHE_TTL.USER_FOLLOWINGS,
            onSuccess: (data) => {
                console.log('Followings loaded:', {
                    userId: currentUserId,
                    count: data.length
                });
            },
            onError: (error) => {
                console.error('Error fetching followings:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for search results
    const searchQuery = useCustomQuery(
        ['profile', 'search'],
        () => profileDataService.searchUsers('', {}, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_SEARCH,
            cacheTime: PROFILE_CACHE_TTL.USER_SEARCH,
            enabled: false, // Disabled by default, only enabled when searching
            onSuccess: (data) => {
                console.log('Search results loaded:', { count: data.length });
            },
            onError: (error) => {
                console.error('Error searching users:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for suggestions
    const suggestionsQuery = useCustomQuery(
        ['profile', 'suggestions', currentUserId],
        () => profileDataService.getUserSuggestions(currentUserId, {}, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_SUGGESTIONS,
            cacheTime: PROFILE_CACHE_TTL.USER_SUGGESTIONS,
            onSuccess: (data) => {
                console.log('Suggestions loaded:', {
                    userId: currentUserId,
                    count: data.length
                });
            },
            onError: (error) => {
                console.error('Error fetching suggestions:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for settings
    const settingsQuery = useCustomQuery(
        ['profile', 'settings', currentUserId],
        () => profileDataService.getUserSettings(currentUserId, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_SETTINGS,
            cacheTime: PROFILE_CACHE_TTL.USER_SETTINGS,
            onSuccess: (data) => {
                console.log('Settings loaded:', {
                    userId: currentUserId,
                    theme: data?.theme
                });
            },
            onError: (error) => {
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

    // Custom query for privacy
    const privacyQuery = useCustomQuery(
        ['profile', 'privacy', currentUserId],
        () => profileDataService.getUserPrivacy(currentUserId, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_PRIVACY,
            cacheTime: PROFILE_CACHE_TTL.USER_PRIVACY,
            onSuccess: (data) => {
                console.log('Privacy settings loaded:', {
                    userId: currentUserId,
                    profileVisibility: data?.profileVisibility
                });
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

    // Custom mutation for updating profile
    const updateProfileMutation = useCustomMutation(
        ({ userId, updates }: { userId: string | number; updates: Partial<UserProfileEntity> }) =>
            profileFeatureService.updateProfile(userId, updates, getAuthToken()),
        {
            onSuccess: (result, variables) => {
                console.log('Profile updated:', {
                    userId: variables.userId,
                    updatedFields: Object.keys(variables.updates)
                });

                // Invalidate profile cache
                invalidateCache.invalidateProfile(variables.userId);

                // Refetch profile if it's the current user
                if (variables.userId === currentUserId) {
                    profileQuery.refetch();
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error updating profile:', error);
                throw error;
            }
        }
    );

    // Custom mutation for following user
    const followUserMutation = useCustomMutation(
        ({ userId, targetUserId }: { userId: string | number; targetUserId: string | number }) =>
            profileFeatureService.followUser(userId, targetUserId, getAuthToken()),
        {
            onSuccess: (result, variables) => {
                console.log('User followed:', {
                    userId: variables.userId,
                    targetUserId: variables.targetUserId,
                    connectionId: result.id
                });

                // Invalidate connection caches for both users
                invalidateCache.invalidateConnections(variables.userId);
                invalidateCache.invalidateConnections(variables.targetUserId);

                // Refetch connections if it's the current user
                if (variables.userId === currentUserId) {
                    followersQuery.refetch();
                    followingsQuery.refetch();
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error following user:', error);
                throw error;
            }
        }
    );

    // Custom mutation for unfollowing user
    const unfollowUserMutation = useCustomMutation(
        ({ userId, targetUserId }: { userId: string | number; targetUserId: string | number }) =>
            profileFeatureService.unfollowUser(userId, targetUserId, getAuthToken()),
        {
            onSuccess: (_, variables) => {
                console.log('User unfollowed:', {
                    userId: variables.userId,
                    targetUserId: variables.targetUserId
                });

                // Invalidate connection caches for both users
                invalidateCache.invalidateConnections(variables.userId);
                invalidateCache.invalidateConnections(variables.targetUserId);

                // Refetch connections if it's the current user
                if (variables.userId === currentUserId) {
                    followersQuery.refetch();
                    followingsQuery.refetch();
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error unfollowing user:', error);
                throw error;
            }
        }
    );

    // Custom mutation for updating settings
    const updateSettingsMutation = useCustomMutation(
        ({ userId, settings }: { userId: string | number; settings: any }) =>
            profileFeatureService.updateSettings(userId, settings, getAuthToken()),
        {
            onSuccess: (result, variables) => {
                console.log('Settings updated:', {
                    userId: variables.userId,
                    updatedFields: Object.keys(variables.settings)
                });

                // Invalidate settings cache
                invalidateCache.invalidateSettings(variables.userId);

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

    // Action implementations
    const getProfile = useCallback(async (userId: string | number) => {
        try {
            setError(null);
            setSelectedUserId(userId);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting profile:', err);
        }
    }, [setSelectedUserId]);

    const getCurrentProfile = useCallback(async () => {
        try {
            setError(null);
            currentProfileQuery.refetch();
        } catch (err) {
            setError(err as Error);
            console.error('Error getting current profile:', err);
        }
    }, [currentProfileQuery]);

    const updateProfile = useCallback(async (userId: string | number, updates: Partial<UserProfileEntity>) => {
        await updateProfileMutation.mutateAsync({ userId, updates });
    }, [updateProfileMutation]);

    const deleteProfile = useCallback(async (userId: string | number) => {
        try {
            setError(null);
            await profileFeatureService.deleteProfile(userId, getAuthToken());

            // Clear selected user if it was the deleted one
            if (selectedUserId === userId) {
                setSelectedUserId(null);
            }
        } catch (err) {
            setError(err as Error);
            console.error('Error deleting profile:', err);
        }
    }, [selectedUserId, setSelectedUserId, getAuthToken]);

    const getStats = useCallback(async (userId: string | number) => {
        try {
            setError(null);
            setSelectedUserId(userId);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting stats:', err);
        }
    }, [setSelectedUserId]);

    const updateStats = useCallback(async (userId: string | number, stats: Partial<UserProfileStatsEntity>) => {
        try {
            setError(null);
            const result = await profileFeatureService.updateStats(userId, stats, getAuthToken());

            // Refetch stats if it's the current user
            if (userId === currentUserId) {
                statsQuery.refetch();
            }

            return result;
        } catch (err) {
            setError(err as Error);
            console.error('Error updating stats:', err);
            throw err;
        }
    }, [currentUserId, statsQuery, getAuthToken]);

    const getFollowers = useCallback(async (userId: string | number, options?: { limit?: number; offset?: number; search?: string }) => {
        try {
            setError(null);
            setSelectedUserId(userId);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting followers:', err);
        }
    }, [setSelectedUserId]);

    const getFollowings = useCallback(async (userId: string | number, options?: { limit?: number; offset?: number; search?: string }) => {
        try {
            setError(null);
            setSelectedUserId(userId);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting followings:', err);
        }
    }, [setSelectedUserId]);

    const followUser = useCallback(async (userId: string | number, targetUserId: string | number) => {
        await followUserMutation.mutateAsync({ userId, targetUserId });
    }, [followUserMutation]);

    const unfollowUser = useCallback(async (userId: string | number, targetUserId: string | number) => {
        await unfollowUserMutation.mutateAsync({ userId, targetUserId });
    }, [unfollowUserMutation]);

    const searchUsers = useCallback(async (query: string, options?: { limit?: number; offset?: number; filters?: Record<string, any> }) => {
        try {
            setError(null);
            // Enable search query with the provided parameters
            searchQuery.setQueryKey(['profile', 'search', query, JSON.stringify(options)]);
            searchQuery.refetch();
        } catch (err) {
            setError(err as Error);
            console.error('Error searching users:', err);
        }
    }, [searchQuery]);

    const getUserSuggestions = useCallback(async (userId: string | number, options?: { limit?: number; type?: 'mutual' | 'popular' | 'new' }) => {
        try {
            setError(null);
            setSelectedUserId(userId);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting suggestions:', err);
        }
    }, [setSelectedUserId]);

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
        await updateSettingsMutation.mutateAsync({ userId, settings });
    }, [updateSettingsMutation]);

    const getPrivacy = useCallback(async (userId: string | number) => {
        try {
            setError(null);
            setSelectedUserId(userId);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting privacy:', err);
        }
    }, [setSelectedUserId]);

    const updatePrivacy = useCallback(async (userId: string | number, privacy: any) => {
        try {
            setError(null);
            const result = await profileFeatureService.updatePrivacy(userId, privacy, getAuthToken());

            // Refetch privacy if it's the current user
            if (userId === currentUserId) {
                privacyQuery.refetch();
            }

            return result;
        } catch (err) {
            setError(err as Error);
            console.error('Error updating privacy:', err);
            throw err;
        }
    }, [currentUserId, privacyQuery, getAuthToken]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const refresh = useCallback(() => {
        profileQuery.refetch();
        currentProfileQuery.refetch();
        statsQuery.refetch();
        followersQuery.refetch();
        followingsQuery.refetch();
        suggestionsQuery.refetch();
        settingsQuery.refetch();
        privacyQuery.refetch();
    }, [profileQuery, currentProfileQuery, statsQuery, followersQuery, followingsQuery, suggestionsQuery, settingsQuery, privacyQuery]);

    // Auto-refresh current user profile on mount
    useEffect(() => {
        if (!config?.userId) {
            currentProfileQuery.refetch();
        }
    }, [currentProfileQuery, config?.userId]);

    return {
        // State
        profile: profileQuery.data,
        stats: statsQuery.data,
        followers: followersQuery.data,
        followings: followingsQuery.data,
        searchResults: searchQuery.data,
        suggestions: suggestionsQuery.data,
        settings: settingsQuery.data,
        privacy: privacyQuery.data,
        isLoading: profileQuery.isLoading || currentProfileQuery.isLoading || statsQuery.isLoading || followersQuery.isLoading || followingsQuery.isLoading || searchQuery.isLoading || suggestionsQuery.isLoading || settingsQuery.isLoading || privacyQuery.isLoading,
        error: error || profileQuery.error || currentProfileQuery.error || statsQuery.error || followersQuery.error || followingsQuery.error || searchQuery.error || suggestionsQuery.error || settingsQuery.error || privacyQuery.error,
        selectedUserId,

        // Actions
        getProfile,
        getCurrentProfile,
        updateProfile,
        deleteProfile,
        getStats,
        updateStats,
        getFollowers,
        getFollowings,
        followUser,
        unfollowUser,
        searchUsers,
        getUserSuggestions,
        getSettings,
        updateSettings,
        getPrivacy,
        updatePrivacy,
        setSelectedUserId,
        clearError,
        refresh
    };
};
