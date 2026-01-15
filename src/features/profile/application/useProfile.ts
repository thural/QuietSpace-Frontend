/**
 * Profile Application Layer Hooks.
 * 
 * Custom hooks that orchestrate profile functionality by combining
 * data layer operations with business logic and state management.
 * These hooks provide the bridge between the data layer and presentation layer.
 */

import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ResId } from "@/api/schemas/inferred/common";
import { useProfileData, useProfileDataWithRepository } from "../data";
import { useProfileWithState, useRealTimeProfile } from "../state";
import useUserQueries from "@/api/queries/userQueries";
import type {
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity,
  ProfileAccessEntity,
  CompleteProfileEntity
} from "../domain";
import {
  canAccessProfile,
  getAccessDeniedReason,
  getProfileCompletion,
  calculateEngagementRate,
  getProfileStrength
} from "../domain";

/**
 * Configuration for profile hooks.
 */
export interface ProfileConfig {
  /** Whether to use repository pattern */
  useRepositoryPattern?: boolean;
  /** Repository configuration for dependency injection */
  repositoryConfig?: {
    useMockRepositories?: boolean;
    mockConfig?: {
      simulateLoading?: boolean;
      simulateError?: boolean;
      isPrivate?: boolean;
      isVerified?: boolean;
      followersCount?: number;
      followingsCount?: number;
      postsCount?: number;
      isFollowing?: boolean;
    };
  };
  /** Whether to enable state persistence */
  enablePersistence?: boolean;
  /** Whether to enable real-time updates */
  enableRealTime?: boolean;
}

/**
 * Custom hook for managing user profile and behavior.
 * 
 * This hook orchestrates the profile functionality by:
 * - Managing user profile data and statistics
 * - Handling follower/following relationships
 * - Controlling profile access and privacy
 * - Supporting both legacy and repository pattern implementations
 * - Providing navigation and UI state management
 * 
 * @param {ResId} userId - The user ID to fetch profile for
 * @param {ProfileConfig} config - Configuration for profile behavior
 * @returns {{
 *   userProfile: UserProfileEntity | null,
 *   userStats: UserProfileStatsEntity | null,
 *   profileAccess: ProfileAccessEntity | null,
 *   completeProfile: CompleteProfileEntity | null,
 *   userConnections: { followers: UserConnectionEntity[], followings: UserConnectionEntity[] },
 *   isLoading: boolean,
 *   error: Error | null,
 *   viewFollowers: boolean,
 *   viewFollowings: boolean,
 *   toggleFollowers: () => void,
 *   toggleFollowings: () => void,
 *   navigateToProfile: (userId: ResId) => void,
 *   refreshProfile: () => Promise<void>,
 *   followUser: () => Promise<void>,
 *   unfollowUser: () => Promise<void>,
 *   canViewProfile: boolean,
 *   accessDeniedReason: string,
 *   profileCompletion: number,
 *   engagementRate: number,
 *   profileStrength: number,
 *   repository?: any
 * }} - Complete profile state and actions
 */
export const useProfile = (userId: ResId, config: ProfileConfig = {}) => {
  const navigate = useNavigate();
  const [viewFollowers, setViewFollowers] = useState(false);
  const [viewFollowings, setViewFollowings] = useState(false);

  // Choose data source based on configuration
  const data = config.useRepositoryPattern 
    ? useProfileDataWithRepository(userId, config.repositoryConfig)
    : useProfileData(userId);

  // Extract data from data layer
  const {
    userProfile,
    userStats,
    profileAccess,
    completeProfile,
    userConnections,
    isLoading,
    error
  } = data;

  // Repository access (if available)
  const repository = (data as any).repository;

  // Legacy compatibility data
  const {
    user,
    postsCount,
    followingsCount,
    followersCount,
    followers,
    followings,
    isHasAccess,
    userPosts,
    toggleFollowers: legacyToggleFollowers,
    toggleFollowings: legacyToggleFollowings
  } = data;

  // Navigation actions
  const navigateToProfile = useCallback((userId: ResId) => {
    navigate(`/profile/${userId}`);
  }, [navigate]);

  // Toggle followers view
  const toggleFollowers = useCallback(() => {
    setViewFollowers(prev => !prev);
  }, []);

  // Toggle followings view
  const toggleFollowings = useCallback(() => {
    setViewFollowings(prev => !prev);
  }, []);

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (repository?.refreshProfile) {
      await repository.refreshProfile();
    }
    // Fallback to React Query refetch if available
    if (user?.refetch) {
      await user.refetch();
    }
  }, [repository, user]);

  // Follow user action
  const followUser = useCallback(async () => {
    if (repository?.followUser && userProfile) {
      await repository.followUser(userProfile.id);
      await refreshProfile();
    }
    // Fallback to legacy follow logic
    console.log('Follow user action - would implement follow logic');
  }, [repository, userProfile, refreshProfile]);

  // Unfollow user action
  const unfollowUser = useCallback(async () => {
    if (repository?.unfollowUser && userProfile) {
      await repository.unfollowUser(userProfile.id);
      await refreshProfile();
    }
    // Fallback to legacy unfollow logic
    console.log('Unfollow user action - would implement unfollow logic');
  }, [repository, userProfile, refreshProfile]);

  // Computed values
  const canViewProfile = useMemo(() => {
    return profileAccess ? canAccessProfile(profileAccess) : isHasAccess?.data || false;
  }, [profileAccess, isHasAccess]);

  const accessDeniedReason = useMemo(() => {
    return profileAccess ? getAccessDeniedReason(profileAccess) : '';
  }, [profileAccess]);

  const profileCompletion = useMemo(() => {
    return userProfile ? getProfileCompletion(userProfile) : 0;
  }, [userProfile]);

  const engagementRate = useMemo(() => {
    return userStats ? calculateEngagementRate(userStats) : 0;
  }, [userStats]);

  const profileStrength = useMemo(() => {
    return userProfile && userStats ? getProfileStrength(userProfile, userStats) : 0;
  }, [userProfile, userStats]);

  return {
    // New domain entities
    userProfile,
    userStats,
    profileAccess,
    completeProfile,
    userConnections,
    
    // Legacy compatibility
    user,
    postsCount,
    followingsCount,
    followersCount,
    followers,
    followings,
    isHasAccess,
    userPosts,
    
    // UI state
    viewFollowers,
    viewFollowings,
    isLoading,
    error,
    
    // Actions
    toggleFollowers,
    toggleFollowings,
    navigateToProfile,
    refreshProfile,
    followUser,
    unfollowUser,
    
    // Computed values
    canViewProfile,
    accessDeniedReason,
    profileCompletion,
    engagementRate,
    profileStrength,
    
    // Repository access (for advanced usage)
    repository
  };
};

/**
 * Enhanced profile hook that always uses repository pattern.
 */
export const useProfileEnhanced = (
  userId: ResId,
  repositoryConfig?: ProfileConfig["repositoryConfig"]
) => {
  return useProfile(userId, {
    useRepositoryPattern: true,
    repositoryConfig,
    enablePersistence: true,
    enableRealTime: true
  });
};

/**
 * Enhanced profile hook with state management integration.
 * 
 * This hook combines repository pattern with Zustand state management
 * for the ultimate profile management experience.
 * 
 * @param {ResId} userId - The user ID to manage profile for
 * @param {ProfileConfig['repositoryConfig']} repositoryConfig - Repository configuration
 * @returns {{
 *   userProfile: UserProfileEntity | null,
 *   userStats: UserProfileStatsEntity | null,
 *   profileAccess: ProfileAccessEntity | null,
 *   followers: UserConnectionEntity[],
 *   followings: UserConnectionEntity[],
 *   isLoading: boolean,
 *   error: Error | null,
 *   viewFollowers: boolean,
 *   viewFollowings: boolean,
 *   activeTab: string,
 *   isOnline: boolean,
 *   needsSync: boolean,
 *   lastSyncTime: number | null,
 *   actions: Object,
 *   computed: Object,
 *   realTime: Object,
 *   stateManagement: Object
 * }} - Enhanced profile state with full state management capabilities
 */
export const useProfileAdvanced = (
  userId: ResId,
  config: {
    enableRealTime?: boolean;
    syncInterval?: number;
  } = {}
) => {
  const navigate = useNavigate();

  const state = useProfileWithState(userId, {
    enableRealTime: config.enableRealTime ?? true,
    syncInterval: config.syncInterval ?? 30000
  });

  const realTime = useRealTimeProfile();

  const navigateToProfile = useCallback(
    (targetUserId: ResId) => {
      navigate(`/profile/${targetUserId}`);
    },
    [navigate]
  );

  return {
    ...state,
    realTime,
    navigateToProfile
  };
};

/**
 * Backwards-friendly alias name (enhanced + state management).
 */
export const useProfileEnhancedWithState = (
  userId: ResId,
  _repositoryConfig?: ProfileConfig["repositoryConfig"]
) => {
  return useProfileAdvanced(userId);
};

/**
 * Current user profile hook.
 * 
 * Specialized hook for the current user's profile with
 * additional functionality like profile editing and settings.
 * 
 * @param {ProfileConfig} config - Configuration for profile behavior
 * @returns {ReturnType<typeof useProfile> & {
 *   isCurrentUser: boolean,
 *   editProfile: (updates: Partial<UserProfileEntity>) => Promise<void>,
 *   updateSettings: (settings: UserProfileEntity['settings']) => Promise<void>
 * }} - Current user profile state and actions
 */
export const useCurrentProfile = (config: ProfileConfig = {}) => {
  const { getSignedUserElseThrow } = useUserQueries();
  const signedUser = getSignedUserElseThrow();
  
  const profileData = useProfile(signedUser.id, config);
  
  // Edit profile action
  const editProfile = useCallback(async (updates: Partial<UserProfileEntity>) => {
    if (profileData.repository?.updateProfile && profileData.userProfile) {
      const updatedProfile = await profileData.repository.updateProfile(
        profileData.userProfile.id, 
        updates
      );
      await profileData.refreshProfile();
      return updatedProfile;
    }
    console.log('Edit profile action - would implement edit logic');
  }, [profileData.repository, profileData.userProfile, profileData.refreshProfile]);

  // Update settings action
  const updateSettings = useCallback(async (settings: UserProfileEntity['settings']) => {
    if (profileData.userProfile) {
      await editProfile({ settings });
    }
  }, [profileData.userProfile, editProfile]);

  return {
    ...profileData,
    isCurrentUser: true,
    editProfile,
    updateSettings
  };
};
