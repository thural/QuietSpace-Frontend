/**
 * Profile Repository Implementation.
 * 
 * Concrete implementation of IProfileRepository that handles
 * actual data fetching from APIs and transforms data to domain entities.
 */

import type {
  IProfileRepository,
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity,
  ProfileAccessEntity
} from "../domain";

import { ProfileAccessService } from "../domain";
import {
  createStatsEntity,
  mapApiUserToConnectionEntity,
  mapApiUserToUserProfileEntity
} from "./mappers/profileMappers";

export class ProfileRepository implements IProfileRepository {
  supportsFollowMutations = false;

  private error: Error | null = null;
  private loading: boolean = false;

  private externalData:
    | {
        userId: string | number;
        user: any;
        userPosts: any;
        followers: any;
        followings: any;
        signedUser: any;
      }
    | null = null;

  /**
   * Get user profile by ID.
   */
  async getUserProfile(userId: string | number): Promise<UserProfileEntity> {
    try {
      this.loading = true;
      this.error = null;

      if (!this.externalData || this.externalData.userId !== userId) {
        throw new Error("ProfileRepository not initialized with matching React data");
      }

      const apiUser = this.externalData.user?.data;
      if (!apiUser) {
        throw new Error("User data not available");
      }

      return mapApiUserToUserProfileEntity(apiUser);
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Get current user profile.
   */
  async getCurrentUserProfile(): Promise<UserProfileEntity> {
    try {
      this.loading = true;
      this.error = null;

      if (!this.externalData || !this.externalData.signedUser?.id) {
        throw new Error("Signed user data not available");
      }

      const currentUserId = this.externalData.signedUser.id;
      if (this.externalData.userId !== currentUserId) {
        throw new Error("Repository initialized for a different userId");
      }

      const apiUser = this.externalData.user?.data;
      if (!apiUser) {
        throw new Error("User data not available");
      }

      return mapApiUserToUserProfileEntity(apiUser);
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Get user profile statistics.
   */
  async getUserStats(userId: string | number): Promise<UserProfileStatsEntity> {
    try {
      this.loading = true;
      this.error = null;

      if (!this.externalData || this.externalData.userId !== userId) {
        throw new Error("ProfileRepository not initialized with matching React data");
      }

      const postsCount = this.externalData.userPosts?.data?.pages?.[0]?.totalElements || 0;
      const followersCount = this.externalData.followers?.data?.pages?.[0]?.totalElements || 0;
      const followingsCount = this.externalData.followings?.data?.pages?.[0]?.totalElements || 0;

      return createStatsEntity({ postsCount, followersCount, followingsCount });
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Get user followers.
   */
  async getUserFollowers(userId: string | number): Promise<UserConnectionEntity[]> {
    try {
      this.loading = true;
      this.error = null;

      if (!this.externalData || this.externalData.userId !== userId) {
        throw new Error("ProfileRepository not initialized with matching React data");
      }

      const pages = this.externalData.followers?.data?.pages;
      if (!pages) return [];

      const flattened = pages.flatMap((p: any) => p.content);
      return flattened.map(mapApiUserToConnectionEntity);
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Get user followings.
   */
  async getUserFollowings(userId: string | number): Promise<UserConnectionEntity[]> {
    try {
      this.loading = true;
      this.error = null;

      if (!this.externalData || this.externalData.userId !== userId) {
        throw new Error("ProfileRepository not initialized with matching React data");
      }

      const pages = this.externalData.followings?.data?.pages;
      if (!pages) return [];

      const flattened = pages.flatMap((p: any) => p.content);
      return flattened.map(mapApiUserToConnectionEntity);
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Check profile access permissions.
   */
  async getProfileAccess(userId: string | number, viewerId: string | number): Promise<ProfileAccessEntity> {
    try {
      this.loading = true;
      this.error = null;

      const profile = await this.getUserProfile(userId);
      const followers = await this.getUserFollowers(userId);
      const isFollowing = followers.some((f) => f.id === viewerId);

      return ProfileAccessService.create(profile, viewerId, isFollowing);
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Update user profile.
   */
  async updateProfile(userId: string | number, updates: Partial<UserProfileEntity>): Promise<UserProfileEntity> {
    try {
      this.loading = true;
      this.error = null;

      throw new Error("ProfileRepository.updateProfile is not implemented yet");
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Follow a user.
   */
  async followUser(userId: string | number): Promise<void> {
    try {
      this.loading = true;
      this.error = null;

      throw new Error("ProfileRepository.followUser is not implemented yet");
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Unfollow a user.
   */
  async unfollowUser(userId: string | number): Promise<void> {
    try {
      this.loading = true;
      this.error = null;

      throw new Error("ProfileRepository.unfollowUser is not implemented yet");
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Get loading state.
   */
  isLoading(): boolean {
    return this.loading;
  }

  /**
   * Get error state.
   */
  getError(): Error | null {
    return this.error;
  }

  /**
   * Clear error state.
   */
  clearError(): void {
    this.error = null;
  }

  /**
   * Initialize repository with React hook data.
   * This method should be called from a React hook context.
   */
  initializeWithReactData(hooks: {
    userId: string | number;
    user: any;
    userPosts: any;
    followers: any;
    followings: any;
    signedUser: any;
  }): void {
    this.externalData = {
      userId: hooks.userId,
      user: hooks.user,
      userPosts: hooks.userPosts,
      followers: hooks.followers,
      followings: hooks.followings,
      signedUser: hooks.signedUser
    };
    this.loading =
      !!hooks.user?.isLoading ||
      !!hooks.userPosts?.isLoading ||
      !!hooks.followers?.isLoading ||
      !!hooks.followings?.isLoading;
    this.error =
      hooks.user?.error || hooks.userPosts?.error || hooks.followers?.error || hooks.followings?.error || null;
  }

  /**
   * Update repository data when React hooks data changes.
   */
  updateReactData(hooks: {
    userId: string | number;
    user: any;
    userPosts: any;
    followers: any;
    followings: any;
    signedUser: any;
  }): void {
    this.initializeWithReactData(hooks);
  }
}
