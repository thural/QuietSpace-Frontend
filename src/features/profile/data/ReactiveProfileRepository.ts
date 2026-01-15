import type {
  IProfileRepository,
  ProfileAccessEntity,
  UserConnectionEntity,
  UserProfileEntity,
  UserProfileStatsEntity
} from "../domain";

import { ProfileAccessService } from "../domain";
import {
  createStatsEntity,
  mapApiUserToConnectionEntity,
  mapApiUserToUserProfileEntity
} from "./mappers/profileMappers";

export type ProfileExternalData = {
  userId: string | number;
  user: any;
  userPosts: any;
  followers: any;
  followings: any;
  signedUser: any;
};

/**
 * Data-layer adapter that makes a repository reactive to React Query results.
 *
 * This class is intentionally in the data layer so the domain repository
 * interface stays framework-agnostic.
 */
export class ReactiveProfileRepository implements IProfileRepository {
  supportsFollowMutations = false;

  private baseRepository: IProfileRepository;
  private externalData: ProfileExternalData | null = null;
  private loadingState = false;
  private error: Error | null = null;

  constructor(baseRepository: IProfileRepository) {
    this.baseRepository = baseRepository;

    // If the underlying repository supports mutations, expose it.
    this.supportsFollowMutations = !!baseRepository.supportsFollowMutations;
  }

  updateExternalData(external: ProfileExternalData): void {
    this.externalData = external;
    this.loadingState =
      !!external.user?.isLoading ||
      !!external.userPosts?.isLoading ||
      !!external.followers?.isLoading ||
      !!external.followings?.isLoading;

    this.error =
      external.user?.error ||
      external.userPosts?.error ||
      external.followers?.error ||
      external.followings?.error ||
      null;
  }

  private requireExternal(userId: string | number): ProfileExternalData {
    if (!this.externalData || this.externalData.userId !== userId) {
      throw new Error("ReactiveProfileRepository not initialized with matching external data");
    }
    return this.externalData;
  }

  async getUserProfile(userId: string | number): Promise<UserProfileEntity> {
    const ext = this.requireExternal(userId);
    const apiUser = ext.user?.data;
    if (!apiUser) throw new Error("User data not available");
    return mapApiUserToUserProfileEntity(apiUser);
  }

  async getCurrentUserProfile(): Promise<UserProfileEntity> {
    if (!this.externalData?.signedUser?.id) {
      throw new Error("Signed user data not available");
    }
    return this.getUserProfile(this.externalData.signedUser.id);
  }

  async getUserStats(userId: string | number): Promise<UserProfileStatsEntity> {
    const ext = this.requireExternal(userId);
    const postsCount = ext.userPosts?.data?.pages?.[0]?.totalElements || 0;
    const followersCount = ext.followers?.data?.pages?.[0]?.totalElements || 0;
    const followingsCount = ext.followings?.data?.pages?.[0]?.totalElements || 0;
    return createStatsEntity({ postsCount, followersCount, followingsCount });
  }

  async getUserFollowers(userId: string | number): Promise<UserConnectionEntity[]> {
    const ext = this.requireExternal(userId);
    const pages = ext.followers?.data?.pages;
    if (!pages) return [];
    const flattened = pages.flatMap((p: any) => p.content);
    return flattened.map(mapApiUserToConnectionEntity);
  }

  async getUserFollowings(userId: string | number): Promise<UserConnectionEntity[]> {
    const ext = this.requireExternal(userId);
    const pages = ext.followings?.data?.pages;
    if (!pages) return [];
    const flattened = pages.flatMap((p: any) => p.content);
    return flattened.map(mapApiUserToConnectionEntity);
  }

  async getProfileAccess(userId: string | number, viewerId: string | number): Promise<ProfileAccessEntity> {
    const profile = await this.getUserProfile(userId);
    const followers = await this.getUserFollowers(userId);
    const isFollowing = followers.some((f) => f.id === viewerId);
    return ProfileAccessService.create(profile, viewerId, isFollowing);
  }

  async updateProfile(userId: string | number, updates: Partial<UserProfileEntity>): Promise<UserProfileEntity> {
    if (this.baseRepository.updateProfile) {
      return await this.baseRepository.updateProfile(userId, updates);
    }
    throw new Error("updateProfile not supported");
  }

  async followUser(userId: string | number): Promise<void> {
    if (!this.supportsFollowMutations) throw new Error("followUser not supported");
    if (this.baseRepository.followUser) {
      await this.baseRepository.followUser(userId);
      return;
    }
    throw new Error("followUser not supported");
  }

  async unfollowUser(userId: string | number): Promise<void> {
    if (!this.supportsFollowMutations) throw new Error("unfollowUser not supported");
    if (this.baseRepository.unfollowUser) {
      await this.baseRepository.unfollowUser(userId);
      return;
    }
    throw new Error("unfollowUser not supported");
  }

  isLoading(): boolean {
    return this.loadingState;
  }

  getError(): Error | null {
    return this.error;
  }

  clearError(): void {
    this.error = null;
    if (this.baseRepository.clearError) {
      this.baseRepository.clearError();
    }
  }
}
