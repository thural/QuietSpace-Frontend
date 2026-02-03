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

  // Missing repository methods for Phase 6 implementation
  private uploadedAvatars = new Map<string | number, string>();
  private uploadedCoverPhotos = new Map<string | number, string>();
  private userActivities = new Map<string | number, any[]>();
  private userOnlineStatus = new Map<string | number, boolean>();
  private userExperiences = new Map<string | number, any[]>();

  async uploadAvatar(userId: string | number, file: File): Promise<string> {
    try {
      // Simulate file upload with mock URL generation
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const mockUrl = `https://cdn.example.com/avatars/${userId}/${Date.now()}.${fileExtension}`;

      this.uploadedAvatars.set(userId, mockUrl);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return mockUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new Error('Failed to upload avatar');
    }
  }

  async uploadCoverPhoto(userId: string | number, file: File): Promise<string> {
    try {
      // Simulate file upload with mock URL generation
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const mockUrl = `https://cdn.example.com/covers/${userId}/${Date.now()}.${fileExtension}`;

      this.uploadedCoverPhotos.set(userId, mockUrl);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      return mockUrl;
    } catch (error) {
      console.error('Error uploading cover photo:', error);
      throw new Error('Failed to upload cover photo');
    }
  }

  async trackUserActivity(userId: string | number, activity: any): Promise<void> {
    try {
      const activities = this.userActivities.get(userId) || [];
      const newActivity = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        userId,
        type: activity.type || 'general',
        content: activity.content || {},
        metadata: activity.metadata || {},
        timestamp: new Date().toISOString(),
        isPublic: activity.isPublic !== false
      };

      activities.push(newActivity);

      // Keep only last 100 activities per user
      if (activities.length > 100) {
        activities.splice(0, activities.length - 100);
      }

      this.userActivities.set(userId, activities);
    } catch (error) {
      console.error('Error tracking user activity:', error);
      throw new Error('Failed to track user activity');
    }
  }

  async updateUserActivityStatus(userId: string | number, status: string): Promise<void> {
    try {
      await this.trackUserActivity(userId, {
        type: 'status_update',
        content: { status },
        metadata: { updatedAt: new Date().toISOString() }
      });
    } catch (error) {
      console.error('Error updating user activity status:', error);
      throw new Error('Failed to update user activity status');
    }
  }

  async setUserOnlineStatus(userId: string | number, isOnline: boolean): Promise<void> {
    try {
      this.userOnlineStatus.set(userId, isOnline);

      // Track online status change as activity
      await this.trackUserActivity(userId, {
        type: 'online_status_change',
        content: { isOnline },
        metadata: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      console.error('Error setting user online status:', error);
      throw new Error('Failed to set user online status');
    }
  }

  async getUserOnlineStatus(userId: string | number): Promise<boolean> {
    try {
      return this.userOnlineStatus.get(userId) || false;
    } catch (error) {
      console.error('Error getting user online status:', error);
      return false;
    }
  }

  async getUserActivity(userId: string | number, options?: {
    limit?: number;
    offset?: number;
    type?: string;
  }): Promise<any[]> {
    try {
      const activities = this.userActivities.get(userId) || [];
      let filteredActivities = activities;

      // Filter by type if specified
      if (options?.type) {
        filteredActivities = activities.filter(activity => activity.type === options.type);
      }

      // Sort by timestamp (newest first)
      filteredActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Apply pagination
      const offset = options?.offset || 0;
      const limit = options?.limit || 50;

      return filteredActivities.slice(offset, offset + limit);
    } catch (error) {
      console.error('Error getting user activity:', error);
      return [];
    }
  }

  async addUserExperience(userId: string | number, experience: Partial<any>): Promise<any> {
    try {
      const experiences = this.userExperiences.get(userId) || [];
      const newExperience = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        userId,
        company: experience.company || '',
        position: experience.position || '',
        department: experience.department || '',
        startDate: experience.startDate || new Date(),
        endDate: experience.endDate,
        isCurrent: experience.isCurrent !== false,
        description: experience.description || '',
        achievements: experience.achievements || [],
        isPublic: experience.isPublic !== false,
        addedAt: new Date(),
        lastUpdated: new Date()
      };

      experiences.push(newExperience);
      this.userExperiences.set(userId, experiences);

      // Track experience addition as activity
      await this.trackUserActivity(userId, {
        type: 'experience_added',
        content: { experienceId: newExperience.id, company: newExperience.company },
        isPublic: newExperience.isPublic
      });

      return newExperience;
    } catch (error) {
      console.error('Error adding user experience:', error);
      throw new Error('Failed to add user experience');
    }
  }

  async updateUserExperience(userId: string | number, experienceId: string, updates: Partial<any>): Promise<any> {
    try {
      const experiences = this.userExperiences.get(userId) || [];
      const experienceIndex = experiences.findIndex(exp => exp.id === experienceId);

      if (experienceIndex === -1) {
        throw new Error('Experience not found');
      }

      const updatedExperience = {
        ...experiences[experienceIndex],
        ...updates,
        lastUpdated: new Date()
      };

      experiences[experienceIndex] = updatedExperience;
      this.userExperiences.set(userId, experiences);

      // Track experience update as activity
      await this.trackUserActivity(userId, {
        type: 'experience_updated',
        content: { experienceId, updates },
        isPublic: updatedExperience.isPublic
      });

      return updatedExperience;
    } catch (error) {
      console.error('Error updating user experience:', error);
      throw new Error('Failed to update user experience');
    }
  }

  async removeUserExperience(userId: string | number, experienceId: string): Promise<void> {
    try {
      const experiences = this.userExperiences.get(userId) || [];
      const experienceIndex = experiences.findIndex(exp => exp.id === experienceId);

      if (experienceIndex === -1) {
        throw new Error('Experience not found');
      }

      const removedExperience = experiences[experienceIndex];
      experiences.splice(experienceIndex, 1);
      this.userExperiences.set(userId, experiences);

      // Track experience removal as activity
      await this.trackUserActivity(userId, {
        type: 'experience_removed',
        content: { experienceId, company: removedExperience.company },
        isPublic: false
      });
    } catch (error) {
      console.error('Error removing user experience:', error);
      throw new Error('Failed to remove user experience');
    }
  }

  async getUserRecentActivity(userId: string | number, limit?: number): Promise<any[]> {
    try {
      return this.getUserActivity(userId, { limit: limit || 10 });
    } catch (error) {
      console.error('Error getting user recent activity:', error);
      return [];
    }
  }
}
