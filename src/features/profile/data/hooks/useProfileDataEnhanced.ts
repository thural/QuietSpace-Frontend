import { useCallback, useEffect, useMemo } from "react";
import { useGetUserById, useGetFollowers, useGetFollowings } from "@/services/data/useUserData";
import { useGetPostsByUserId } from "@/services/data/usePostData";
import useUserQueries from "@/api/queries/userQueries";
import type { ResId } from "@/api/schemas/inferred/common";

import { createMockProfileRepository, createProfileRepository } from "../ProfileRepositoryFactory";
import type { IProfileRepository } from "../../domain";
import { createCompleteProfile } from "../../domain";
import { ProfileAccessService } from "../../domain";

import { createStatsEntity, mapApiUserToConnectionEntity, mapApiUserToUserProfileEntity } from "../mappers/profileMappers";
import { ReactiveProfileRepository } from "../ReactiveProfileRepository";

export interface ProfileRepositoryConfig {
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
}

export const useProfileDataEnhanced = (userId: ResId, config?: ProfileRepositoryConfig) => {
  const { getSignedUserElseThrow } = useUserQueries();
  const signedUser = getSignedUserElseThrow();

  const user = useGetUserById(userId);
  const userPosts = useGetPostsByUserId(userId);
  const followers = useGetFollowers(userId);
  const followings = useGetFollowings(userId);

  const repository: IProfileRepository = useMemo(() => {
    if (config?.useMockRepositories) {
      return createMockProfileRepository(config.mockConfig);
    }
    return createProfileRepository(config);
  }, [config]);

  // Keep repository updated with React Query data (reactive repository pattern)
  useEffect(() => {
    const payload = {
      userId,
      user,
      userPosts,
      followers,
      followings,
      signedUser
    };

    if (repository instanceof ReactiveProfileRepository) {
      repository.updateExternalData(payload);
    }
  }, [repository, userId, user, userPosts, followers, followings, signedUser]);

  const postsCount = userPosts.data?.pages?.[0]?.totalElements || 0;
  const followingsCount = followings.data?.pages?.[0]?.totalElements || 0;
  const followersCount = followers.data?.pages?.[0]?.totalElements || 0;

  const userProfile = useMemo(() => {
    if (!user.data) return null;
    return mapApiUserToUserProfileEntity(user.data);
  }, [user.data]);

  const userStats = useMemo(() => {
    return createStatsEntity({ postsCount, followersCount, followingsCount });
  }, [postsCount, followersCount, followingsCount]);

  const userConnections = useMemo(() => {
    if (!followers.data || !followings.data) return { followers: [], followings: [] };

    const followerUsers = followers.data.pages.flatMap((p: any) => p.content);
    const followingUsers = followings.data.pages.flatMap((p: any) => p.content);

    return {
      followers: followerUsers.map(mapApiUserToConnectionEntity),
      followings: followingUsers.map(mapApiUserToConnectionEntity)
    };
  }, [followers.data, followings.data]);

  const profileAccess = useMemo(() => {
    if (!userProfile) return null;
    const isFollowing = userConnections.followers.some((f) => f.id === signedUser.id);
    return ProfileAccessService.create(userProfile, signedUser.id, isFollowing);
  }, [signedUser.id, userConnections.followers, userProfile]);

  const completeProfile = useMemo(() => {
    if (!userProfile || !profileAccess) return null;
    return createCompleteProfile(
      userProfile,
      userStats,
      profileAccess,
      userConnections.followers,
      userConnections.followings
    );
  }, [profileAccess, userConnections.followers, userConnections.followings, userProfile, userStats]);

  const isLoading = user.isLoading || userPosts.isLoading || followers.isLoading || followings.isLoading;
  const error = (user.error as any) || (userPosts.error as any) || (followers.error as any) || (followings.error as any) || null;

  const hasAccess = useMemo(() => {
    return profileAccess ? ProfileAccessService.canAccess(profileAccess) : false;
  }, [profileAccess]);

  const refreshProfile = useCallback(async () => {
    if (user?.refetch) {
      await user.refetch();
    }
  }, [user]);

  return {
    user,
    postsCount,
    followingsCount,
    followersCount,
    followers,
    followings,
    isHasAccess: { data: hasAccess, isLoading, isError: !!error },
    userPosts,
    viewFollowers: false,
    viewFollowings: false,
    toggleFollowers: () => {},
    toggleFollowings: () => {},

    userProfile,
    userStats,
    profileAccess,
    completeProfile,
    userConnections,
    isLoading,
    error,

    repository,
    refreshProfile
  };
};
