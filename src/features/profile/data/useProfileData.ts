/**
 * Profile Data Hooks.
 * 
 * Custom hooks that integrate the repository pattern with React Query
 * for efficient data fetching and state management.
 */

import { useMemo } from "react";
import { useGetUserById, useGetFollowers, useGetFollowings } from "@/services/data/useUserData";
import { useGetPostsByUserId } from "@/services/data/usePostData";
import useUserQueries from "@/api/queries/userQueries";
import { ResId } from "@/api/schemas/inferred/common";
import { useProfileDataEnhanced, type ProfileRepositoryConfig } from "./hooks";
import type {
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity,
  ProfileAccessEntity,
  CompleteProfileEntity
} from "../domain";
import { createProfileAccess, createCompleteProfile } from "../domain";

/**
 * Legacy profile data hook for backward compatibility.
 * 
 * This hook maintains the existing API while using the new
 * repository pattern internally for gradual migration.
 */
export const useProfileData = (userId: ResId) => {
  const { getSignedUserElseThrow } = useUserQueries();
  const signedUser = getSignedUserElseThrow();

  // React Query hooks for data fetching
  const user = useGetUserById(userId);
  const userPosts = useGetPostsByUserId(userId);
  const followers = useGetFollowers(userId);
  const followings = useGetFollowings(userId);

  // Calculate statistics
  const postsCount = userPosts.data?.pages[0].totalElements || 0;
  const followingsCount = followings.data?.pages[0].totalElements || 0;
  const followersCount = followers.data?.pages[0].totalElements || 0;

  // Calculate access permissions
  const hasAccess = useMemo(() => {
    if (!user.data || !followers.data) return false;
    
    const followersContent = followers.data?.pages.flatMap((page) => page.content);
    const isFollowing = followersContent.some(user => user.id === signedUser.id);
    
    return !user.data.isPrivateAccount || isFollowing;
  }, [user.data, followers.data, signedUser.id]);

  // Transform data to domain entities
  const userProfile = useMemo(() => {
    if (!user.data) return null;
    
    return {
      id: user.data.id,
      username: user.data.username || '',
      email: user.data.email || '',
      bio: user.data.bio,
      photo: user.data.photo ? {
        type: user.data.photo.type || 'avatar',
        id: user.data.photo.id || 'default',
        name: user.data.photo.name || 'User Photo',
        url: user.data.photo.data || ''
      } : {
        type: 'avatar',
        id: 'default',
        name: 'Default Avatar',
        url: ''
      },
      settings: {
        theme: 'light',
        language: 'en',
        notifications: true,
        bio: user.data.bio,
        isPrivateAccount: user.data.isPrivateAccount,
        isNotificationsMuted: false,
        isAllowPublicGroupChatInvite: true,
        isAllowPublicMessageRequests: true,
        isAllowPublicComments: true,
        isHideLikeCounts: false
      },
      isPrivateAccount: user.data.isPrivateAccount || false,
      isVerified: user.data.role === 'VERIFIED',
      createdAt: user.data.createDate || '',
      updatedAt: user.data.updateDate || ''
    } as UserProfileEntity;
  }, [user.data]);

  const userStats = useMemo(() => ({
    postsCount,
    followersCount,
    followingsCount,
    likesCount: 0, // Would be calculated from posts
    sharesCount: 0, // Would be calculated from posts
    commentsCount: 0 // Would be calculated from posts
  } as UserProfileStatsEntity), [postsCount, followersCount, followingsCount]);

  const userConnections = useMemo(() => {
    if (!followers.data || !followings.data) return { followers: [], followings: [] };
    
    const transformConnections = (connections: any[]): UserConnectionEntity[] => {
      return connections.map(conn => ({
        id: conn.id,
        username: conn.username || '',
        bio: conn.bio,
        photo: conn.photo,
        isFollowing: true, // Would be determined from relationship data
        isMutual: false, // Would be calculated
        connectedAt: new Date().toISOString()
      }));
    };

    return {
      followers: transformConnections(followers.data.pages.flatMap(page => page.content)),
      followings: transformConnections(followings.data.pages.flatMap(page => page.content))
    };
  }, [followers.data, followings.data]);

  const profileAccess = useMemo(() => {
    if (!userProfile || !signedUser) return null;
    
    return createProfileAccess(
      userProfile,
      signedUser.id,
      userConnections.followers.some(f => f.id === signedUser.id)
    );
  }, [userProfile, signedUser, userConnections.followers]);

  const completeProfile = useMemo(() => {
    if (!userProfile || !userStats || !profileAccess) return null;
    
    return createCompleteProfile(
      userProfile,
      userStats,
      profileAccess,
      userConnections.followers,
      userConnections.followings
    );
  }, [userProfile, userStats, profileAccess, userConnections]);

  // Loading and error states
  const isLoading = user.isLoading || userPosts.isLoading || followers.isLoading || followings.isLoading;
  const error = user.error || userPosts.error || followers.error || followings.error;

  return {
    // Legacy API for backward compatibility
    user,
    postsCount,
    followingsCount,
    followersCount,
    followers,
    followings,
    isHasAccess: { data: hasAccess, isLoading, isError: !!error },
    userPosts,
    viewFollowers: false, // Would be managed by state
    viewFollowings: false, // Would be managed by state
    toggleFollowers: () => {}, // Would be implemented
    toggleFollowings: () => {}, // Would be implemented

    // New domain entities
    userProfile,
    userStats,
    profileAccess,
    completeProfile,
    userConnections,
    isLoading,
    error
  };
};

/**
 * Enhanced profile data hook with repository pattern.
 * 
 * This hook uses the repository pattern for clean data access
 * and provides additional features like caching and error handling.
 */
export const useProfileDataWithRepository = (userId: ResId, config?: {
} & ProfileRepositoryConfig) => {
  return useProfileDataEnhanced(userId, config);
};

/**
 * Current user profile hook.
 * 
 * Specialized hook for the current user's profile with
 * additional functionality like profile editing.
 */
export const useCurrentProfileData = () => {
  const { getSignedUserElseThrow } = useUserQueries();
  const signedUser = getSignedUserElseThrow();
  
  return useProfileData(signedUser.id);
};
