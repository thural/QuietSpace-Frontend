/**
 * Profile Connections Hook
 * 
 * Enterprise-grade profile connections management with custom query system
 * and intelligent caching for follower/following operations
 */

import { useState, useCallback, useEffect } from 'react';
import { useCustomQuery, useCustomMutation } from '@/core/modules/hooks/useCustomQuery';
import { useCacheInvalidation } from '@/core/modules/hooks/migrationUtils';
import { useProfileServices } from './useProfileServices';
import { useFeatureAuth } from '@/core/modules/authentication';
import { UserConnectionEntity } from '@features/profile/domain/entities/IProfileRepository';
import { JwtToken } from '@/shared/api/models/common';
import { PROFILE_CACHE_TTL } from '../data/cache/ProfileCacheKeys';

/**
 * Profile Connections State interface.
 */
export interface ProfileConnectionsState {
    followers: UserConnectionEntity[] | null;
    followings: UserConnectionEntity[] | null;
    mutualConnections: UserConnectionEntity[] | null;
    blockedUsers: UserConnectionEntity[] | null;
    mutedUsers: UserConnectionEntity[] | null;
    isLoading: boolean;
    error: Error | null;
    selectedUserId: string | number | null;
    isFollowing: boolean;
    isBlocked: boolean;
    isMuted: boolean;
}

/**
 * Profile Connections Actions interface.
 */
export interface ProfileConnectionsActions {
    // Connection operations
    getFollowers: (userId: string | number, options?: { limit?: number; offset?: number; search?: string }) => Promise<void>;
    getFollowings: (userId: string | number, options?: { limit?: number; offset?: number; search?: string }) => Promise<void>;
    getMutualConnections: (userId1: string | number, userId2: string | number) => Promise<void>;

    // Connection management
    followUser: (userId: string | number, targetUserId: string | number) => Promise<UserConnectionEntity>;
    unfollowUser: (userId: string | number, targetUserId: string | number) => Promise<void>;
    blockUser: (userId: string | number, targetUserId: string | number) => Promise<void>;
    unblockUser: (userId: string | number, targetUserId: string | number) => Promise<void>;
    muteUser: (userId: string | number, targetUserId: string | number) => Promise<void>;
    unmuteUser: (userId: string | number, targetUserId: string | number) => Promise<void>;

    // Blocked and muted users
    getBlockedUsers: (userId: string | number, options?: { limit?: number; offset?: number }) => Promise<void>;
    getMutedUsers: (userId: string | number, options?: { limit?: number; offset?: number }) => Promise<void>;

    // State management
    setSelectedUserId: (userId: string | number | null) => void;
    checkConnectionStatus: (userId: string | number, targetUserId: string | number) => Promise<void>;
    clearError: () => void;
    refresh: () => void;
}

/**
 * Profile Connections Hook - Enterprise Edition
 * 
 * Hook that provides profile connections management functionality with enterprise-grade architecture.
 * Integrates with custom query system, intelligent caching, and connection management.
 */
export const useProfileConnections = (config?: { userId?: string | number, targetUserId?: string | number }): ProfileConnectionsState & ProfileConnectionsActions => {
    const { profileDataService } = useProfileServices();
    const invalidateCache = useCacheInvalidation();
    const { token, userId } = useFeatureAuth();

    // State
    const [selectedUserId, setSelectedUserId] = useState<string | number | null>(config?.userId || userId || null);
    const [targetUserId, setTargetUserId] = useState<string | number | null>(config?.targetUserId || null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Get current user ID and token
    const currentUserId = selectedUserId || userId || 'current-user';
    const getAuthToken = useCallback((): string => {
        return token || '';
    }, [token]);

    // Custom query for followers
    const followersQuery = useCustomQuery(
        ['profile', 'connections', 'followers', currentUserId],
        () => profileDataService.getUserFollowers(currentUserId, {}, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_FOLLOWERS,
            cacheTime: PROFILE_CACHE_TTL.USER_FOLLOWERS,
            refetchInterval: PROFILE_CACHE_TTL.USER_FOLLOWERS / 2,
            onSuccess: (data) => {
                console.log('Followers loaded:', {
                    userId: currentUserId,
                    count: data.length
                });

                // Check if target user is in followers
                if (targetUserId && data) {
                    const isTargetFollowing = data.some(follower => follower.id === targetUserId);
                    setIsFollowing(isTargetFollowing);
                }
            },
            onError: (error) => {
                setError(error);
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
        ['profile', 'connections', 'followings', currentUserId],
        () => profileDataService.getUserFollowings(currentUserId, {}, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_FOLLOWINGS,
            cacheTime: PROFILE_CACHE_TTL.USER_FOLLOWINGS,
            refetchInterval: PROFILE_CACHE_TTL.USER_FOLLOWINGS / 2,
            onSuccess: (data) => {
                console.log('Followings loaded:', {
                    userId: currentUserId,
                    count: data.length
                });

                // Check if target user is in followings
                if (targetUserId && data) {
                    const isTargetFollowing = data.some(following => following.id === targetUserId);
                    setIsFollowing(isTargetFollowing);
                }
            },
            onError: (error) => {
                setError(error);
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

    // Custom query for mutual connections
    const mutualConnectionsQuery = useCustomQuery(
        ['profile', 'connections', 'mutual', currentUserId, targetUserId],
        () => targetUserId ? profileDataService.getMutualConnections(currentUserId, targetUserId, getAuthToken()) : Promise.resolve([]),
        {
            staleTime: PROFILE_CACHE_TTL.USER_MUTUAL_CONNECTIONS,
            cacheTime: PROFILE_CACHE_TTL.USER_MUTUAL_CONNECTIONS,
            enabled: !!targetUserId,
            onSuccess: (data) => {
                console.log('Mutual connections loaded:', {
                    userId1: currentUserId,
                    userId2: targetUserId,
                    count: data.length
                });
            },
            onError: (error) => {
                console.error('Error fetching mutual connections:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for blocked users
    const blockedUsersQuery = useCustomQuery(
        ['profile', 'connections', 'blocked', currentUserId],
        () => profileDataService.getBlockedUsers(currentUserId, {}, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_BLOCKED,
            cacheTime: PROFILE_CACHE_TTL.USER_BLOCKED,
            refetchInterval: PROFILE_CACHE_TTL.USER_BLOCKED / 2,
            onSuccess: (data) => {
                console.log('Blocked users loaded:', {
                    userId: currentUserId,
                    count: data.length
                });

                // Check if target user is blocked
                if (targetUserId && data) {
                    const isTargetBlocked = data.some(blocked => blocked.id === targetUserId);
                    setIsBlocked(isTargetBlocked);
                }
            },
            onError: (error) => {
                console.error('Error fetching blocked users:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for muted users
    const mutedUsersQuery = useCustomQuery(
        ['profile', 'connections', 'muted', currentUserId],
        () => profileDataService.getMutedUsers(currentUserId, {}, getAuthToken()),
        {
            staleTime: PROFILE_CACHE_TTL.USER_MUTED,
            cacheTime: PROFILE_CACHE_TTL.USER_MUTED,
            refetchInterval: PROFILE_CACHE_TTL.USER_MUTED / 2,
            onSuccess: (data) => {
                console.log('Muted users loaded:', {
                    userId: currentUserId,
                    count: data.length
                });

                // Check if target user is muted
                if (targetUserId && data) {
                    const isTargetMuted = data.some(muted => muted.id === targetUserId);
                    setIsMuted(isTargetMuted);
                }
            },
            onError: (error) => {
                console.error('Error fetching muted users:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom mutation for following user
    const followUserMutation = useCustomMutation(
        ({ userId, targetUserId }: { userId: string | number; targetUserId: string | number }) =>
            profileDataService.followUser(userId, targetUserId, getAuthToken()),
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

                // Update connection status
                if (variables.userId === currentUserId) {
                    setIsFollowing(true);
                    followersQuery.refetch();
                    followingsQuery.refetch();
                }

                // Update target user status if it's the target
                if (variables.targetUserId === targetUserId) {
                    setIsFollowing(true);
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
            profileDataService.unfollowUser(userId, targetUserId, getAuthToken()),
        {
            onSuccess: (_, variables) => {
                console.log('User unfollowed:', {
                    userId: variables.userId,
                    targetUserId: variables.targetUserId
                });

                // Invalidate connection caches for both users
                invalidateCache.invalidateConnections(variables.userId);
                invalidateCache.invalidateConnections(variables.targetUserId);

                // Update connection status
                if (variables.userId === currentUserId) {
                    setIsFollowing(false);
                    followersQuery.refetch();
                    followingsQuery.refetch();
                }

                // Update target user status if it's the target
                if (variables.targetUserId === targetUserId) {
                    setIsFollowing(false);
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error unfollowing user:', error);
                throw error;
            }
        }
    );

    // Custom mutation for blocking user
    const blockUserMutation = useCustomMutation(
        ({ userId, targetUserId }: { userId: string | number; targetUserId: string | number }) =>
            profileDataService.blockUser(userId, targetUserId, getAuthToken()),
        {
            onSuccess: (_, variables) => {
                console.log('User blocked:', {
                    userId: variables.userId,
                    targetUserId: variables.targetUserId
                });

                // Invalidate connection caches for both users
                invalidateCache.invalidateConnections(variables.userId);
                invalidateCache.invalidateConnections(variables.targetUserId);

                // Update blocked status
                if (variables.userId === currentUserId) {
                    setIsBlocked(true);
                    blockedUsersQuery.refetch();
                }

                // Update target user status if it's the target
                if (variables.targetUserId === targetUserId) {
                    setIsBlocked(true);
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error blocking user:', error);
                throw error;
            }
        }
    );

    // Custom mutation for unblocking user
    const unblockUserMutation = useCustomMutation(
        ({ userId, targetUserId }: { userId: string | number; targetUserId: string | number }) =>
            profileDataService.unblockUser(userId, targetUserId, getAuthToken()),
        {
            onSuccess: (_, variables) => {
                console.log('User unblocked:', {
                    userId: variables.userId,
                    targetUserId: variables.targetUserId
                });

                // Invalidate connection caches for both users
                invalidateCache.invalidateConnections(variables.userId);
                invalidateCache.invalidateConnections(variables.targetUserId);

                // Update blocked status
                if (variables.userId === currentUserId) {
                    setIsBlocked(false);
                    blockedUsersQuery.refetch();
                }

                // Update target user status if it's the target
                if (variables.targetUserId === targetUserId) {
                    setIsBlocked(false);
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error unblocking user:', error);
                throw error;
            }
        }
    );

    // Custom mutation for muting user
    const muteUserMutation = useCustomMutation(
        ({ userId, targetUserId }: { userId: string | number; targetUserId: string | number }) =>
            profileDataService.muteUser(userId, targetUserId, getAuthToken()),
        {
            onSuccess: (_, variables) => {
                console.log('User muted:', {
                    userId: variables.userId,
                    targetUserId: variables.targetUserId
                });

                // Invalidate connection caches for both users
                invalidateCache.invalidateConnections(variables.userId);
                invalidateCache.invalidateConnections(variables.targetUserId);

                // Update muted status
                if (variables.userId === currentUserId) {
                    setIsMuted(true);
                    mutedUsersQuery.refetch();
                }

                // Update target user status if it's the target
                if (variables.targetUserId === targetUserId) {
                    setIsMuted(true);
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error muting user:', error);
                throw error;
            }
        }
    );

    // Custom mutation for unmuting user
    const unmuteUserMutation = useCustomMutation(
        ({ userId, targetUserId }: { userId: string | number; targetUserId: string | number }) =>
            profileDataService.unmuteUser(userId, targetUserId, getAuthToken()),
        {
            onSuccess: (_, variables) => {
                console.log('User unmuted:', {
                    userId: variables.userId,
                    targetUserId: variables.targetUserId
                });

                // Invalidate connection caches for both users
                invalidateCache.invalidateConnections(variables.userId);
                invalidateCache.invalidateConnections(variables.targetUserId);

                // Update muted status
                if (variables.userId === currentUserId) {
                    setIsMuted(false);
                    mutedUsersQuery.refetch();
                }

                // Update target user status if it's the target
                if (variables.targetUserId === targetUserId) {
                    setIsMuted(false);
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error unmuting user:', error);
                throw error;
            }
        }
    );

    // Action implementations
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

    const getMutualConnections = useCallback(async (userId1: string | number, userId2: string | number) => {
        try {
            setError(null);
            setSelectedUserId(userId1);
            setTargetUserId(userId2);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting mutual connections:', err);
        }
    }, [setSelectedUserId, setTargetUserId]);

    const followUser = useCallback(async (userId: string | number, targetUserId: string | number) => {
        await followUserMutation.mutateAsync({ userId, targetUserId });
    }, [followUserMutation]);

    const unfollowUser = useCallback(async (userId: string | number, targetUserId: string | number) => {
        await unfollowUserMutation.mutateAsync({ userId, targetUserId });
    }, [unfollowUserMutation]);

    const blockUser = useCallback(async (userId: string | number, targetUserId: string | number) => {
        await blockUserMutation.mutateAsync({ userId, targetUserId });
    }, [blockUserMutation]);

    const unblockUser = useCallback(async (userId: string | number, targetUserId: string | number) => {
        await unblockUserMutation.mutateAsync({ userId, targetUserId });
    }, [unblockUserMutation]);

    const muteUser = useCallback(async (userId: string | number, targetUserId: string | number) => {
        await muteUserMutation.mutateAsync({ userId, targetUserId });
    }, [muteUserMutation]);

    const unmuteUser = useCallback(async (userId: string | number, targetUserId: string | number) => {
        await unmuteUserMutation.mutateAsync({ userId, targetUserId });
    }, [unmuteUserMutation]);

    const getBlockedUsers = useCallback(async (userId: string | number, options?: { limit?: number; offset?: number }) => {
        try {
            setError(null);
            setSelectedUserId(userId);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting blocked users:', err);
        }
    }, [setSelectedUserId]);

    const getMutedUsers = useCallback(async (userId: string | number, options?: { limit?: number; offset?: number }) => {
        try {
            setError(null);
            setSelectedUserId(userId);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting muted users:', err);
        }
    }, [setSelectedUserId]);

    const checkConnectionStatus = useCallback(async (userId: string | number, targetUserId: string | number) => {
        try {
            setError(null);
            setSelectedUserId(userId);
            setTargetUserId(targetUserId);

            // Check if following
            const followings = followingsQuery.data || [];
            const isFollowing = followings.some(following => following.id === targetUserId);
            setIsFollowing(isFollowing);

            // Check if blocked
            const blocked = blockedUsersQuery.data || [];
            const isBlocked = blocked.some(blocked => blocked.id === targetUserId);
            setIsBlocked(isBlocked);

            // Check if muted
            const muted = mutedUsersQuery.data || [];
            const isMuted = muted.some(muted => muted.id === targetUserId);
            setIsMuted(isMuted);
        } catch (err) {
            setError(err as Error);
            console.error('Error checking connection status:', err);
        }
    }, [followingsQuery, blockedUsersQuery, mutedUsersQuery]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const refresh = useCallback(() => {
        followersQuery.refetch();
        followingsQuery.refetch();
        mutualConnectionsQuery.refetch();
        blockedUsersQuery.refetch();
        mutedUsersQuery.refetch();
    }, [followersQuery, followingsQuery, mutualConnectionsQuery, blockedUsersQuery, mutedUsersQuery]);

    // Auto-check connection status when target user changes
    useEffect(() => {
        if (currentUserId && targetUserId) {
            checkConnectionStatus(currentUserId, targetUserId);
        }
    }, [currentUserId, targetUserId, checkConnectionStatus]);

    return {
        // State
        followers: followersQuery.data,
        followings: followingsQuery.data,
        mutualConnections: mutualConnectionsQuery.data,
        blockedUsers: blockedUsersQuery.data,
        mutedUsers: mutedUsersQuery.data,
        isLoading: followersQuery.isLoading || followingsQuery.isLoading || mutualConnectionsQuery.isLoading || blockedUsersQuery.isLoading || mutedUsersQuery.isLoading,
        error: error || followersQuery.error || followingsQuery.error || mutualConnectionsQuery.error || blockedUsersQuery.error || mutedUsersQuery.error,
        selectedUserId,
        isFollowing,
        isBlocked,
        isMuted,

        // Actions
        getFollowers,
        getFollowings,
        getMutualConnections,
        followUser,
        unfollowUser,
        blockUser,
        unblockUser,
        muteUser,
        unmuteUser,
        getBlockedUsers,
        getMutedUsers,
        setSelectedUserId,
        checkConnectionStatus,
        clearError,
        refresh
    };
};
