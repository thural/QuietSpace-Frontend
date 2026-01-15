/**
 * Mock Profile Repository Implementation.
 * 
 * Mock implementation of IProfileRepository for testing and UI development.
 * Provides predictable data and configurable scenarios for testing.
 */

import type {
  IProfileRepository,
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity,
  ProfileAccessEntity
} from "../domain";

interface MockProfileConfig {
  simulateLoading?: boolean;
  simulateError?: boolean;
  isPrivate?: boolean;
  isVerified?: boolean;
  followersCount?: number;
  followingsCount?: number;
  postsCount?: number;
  isFollowing?: boolean;
}

export class MockProfileRepository implements IProfileRepository {
  supportsFollowMutations = true;

  private error: Error | null = null;
  private loading: boolean = false;
  private config: MockProfileConfig;

  constructor(config: MockProfileConfig = {}) {
    this.config = {
      simulateLoading: false,
      simulateError: false,
      isPrivate: false,
      isVerified: false,
      followersCount: 150,
      followingsCount: 75,
      postsCount: 25,
      isFollowing: false,
      ...config
    };
  }

  /**
   * Simulate async operation with configurable delay.
   */
  private async simulateAsync<T>(data: T): Promise<T> {
    if (this.config.simulateLoading) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (this.config.simulateError) {
      throw new Error("Mock profile repository error");
    }

    return data;
  }

  /**
   * Create mock user profile.
   */
  private createMockUserProfile(userId: string | number): UserProfileEntity {
    return {
      id: userId,
      username: `user${userId}`,
      email: `user${userId}@example.com`,
      bio: "Passionate developer and tech enthusiast. Love building amazing products!",
      photo: {
        type: "avatar",
        id: `avatar-${userId}`,
        name: `User ${userId} Avatar`,
        url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
      },
      settings: {
        theme: "dark",
        language: "en",
        notifications: true
      },
      isPrivateAccount: this.config.isPrivate || false,
      isVerified: this.config.isVerified || false,
      createdAt: "2023-01-15T10:30:00Z",
      updatedAt: "2024-01-15T15:45:00Z"
    };
  }

  /**
   * Create mock user stats.
   */
  private createMockUserStats(): UserProfileStatsEntity {
    return {
      postsCount: this.config.postsCount || 25,
      followersCount: this.config.followersCount || 150,
      followingsCount: this.config.followingsCount || 75,
      likesCount: 1250,
      sharesCount: 320,
      commentsCount: 450
    };
  }

  /**
   * Create mock user connections.
   */
  private createMockUserConnections(type: 'followers' | 'followings', count: number): UserConnectionEntity[] {
    return Array.from({ length: count }, (_, index) => ({
      id: `user-${type}-${index}`,
      username: `${type}User${index}`,
      bio: `Mock ${type} user ${index}`,
      photo: {
        type: "avatar",
        id: `avatar-${type}-${index}`,
        name: `${type} User ${index}`,
        url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${type}-${index}`
      },
      isFollowing: type === 'followings' || Math.random() > 0.7,
      isMutual: Math.random() > 0.8,
      connectedAt: "2023-06-15T12:30:00Z"
    }));
  }

  /**
   * Create mock profile access.
   */
  private createMockProfileAccess(userId: string | number, viewerId: string | number): ProfileAccessEntity {
    const isOwner = userId === viewerId;
    const isPrivate = this.config.isPrivate || false;
    const isFollowing = this.config.isFollowing || false;

    let hasAccess = false;
    let reason: ProfileAccessEntity['reason'] = 'allowed';

    if (isOwner) {
      hasAccess = true;
      reason = 'allowed';
    } else if (isPrivate && !isFollowing) {
      hasAccess = false;
      reason = 'private';
    } else {
      hasAccess = true;
      reason = 'allowed';
    }

    return {
      hasAccess,
      isOwner,
      isFollowing,
      isPrivate,
      reason
    };
  }

  /**
   * Get user profile by ID.
   */
  async getUserProfile(userId: string | number): Promise<UserProfileEntity> {
    try {
      this.loading = true;
      this.error = null;

      const profile = this.createMockUserProfile(userId);
      return await this.simulateAsync(profile);
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    }
  }

  /**
   * Get current user profile.
   */
  async getCurrentUserProfile(): Promise<UserProfileEntity> {
    try {
      this.loading = true;
      this.error = null;

      const profile = this.createMockUserProfile("current-user");
      return await this.simulateAsync(profile);
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    }
  }

  /**
   * Get user profile statistics.
   */
  async getUserStats(userId: string | number): Promise<UserProfileStatsEntity> {
    try {
      this.loading = true;
      this.error = null;

      const stats = this.createMockUserStats();
      return await this.simulateAsync(stats);
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    }
  }

  /**
   * Get user followers.
   */
  async getUserFollowers(userId: string | number): Promise<UserConnectionEntity[]> {
    try {
      this.loading = true;
      this.error = null;

      const followers = this.createMockUserConnections('followers', this.config.followersCount || 150);
      return await this.simulateAsync(followers);
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    }
  }

  /**
   * Get user followings.
   */
  async getUserFollowings(userId: string | number): Promise<UserConnectionEntity[]> {
    try {
      this.loading = true;
      this.error = null;

      const followings = this.createMockUserConnections('followings', this.config.followingsCount || 75);
      return await this.simulateAsync(followings);
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    }
  }

  /**
   * Check profile access permissions.
   */
  async getProfileAccess(userId: string | number, viewerId: string | number): Promise<ProfileAccessEntity> {
    try {
      this.loading = true;
      this.error = null;

      const access = this.createMockProfileAccess(userId, viewerId);
      return await this.simulateAsync(access);
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    }
  }

  /**
   * Update user profile.
   */
  async updateProfile(userId: string | number, updates: Partial<UserProfileEntity>): Promise<UserProfileEntity> {
    try {
      this.loading = true;
      this.error = null;

      const currentProfile = this.createMockUserProfile(userId);
      const updatedProfile = { ...currentProfile, ...updates };
      return await this.simulateAsync(updatedProfile);
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    }
  }

  /**
   * Follow a user.
   */
  async followUser(userId: string | number): Promise<void> {
    try {
      this.loading = true;
      this.error = null;

      await this.simulateAsync(undefined);
      // Update follow state
      this.config.isFollowing = true;
      this.config.followersCount = (this.config.followersCount || 0) + 1;
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
    }
  }

  /**
   * Unfollow a user.
   */
  async unfollowUser(userId: string | number): Promise<void> {
    try {
      this.loading = true;
      this.error = null;

      await this.simulateAsync(undefined);
      // Update follow state
      this.config.isFollowing = false;
      this.config.followersCount = Math.max(0, (this.config.followersCount || 0) - 1);
    } catch (error) {
      this.error = error as Error;
      this.loading = false;
      throw error;
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
   * Update mock configuration.
   */
  updateMockConfig(newConfig: Partial<MockProfileConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Reset to default state.
   */
  reset(): void {
    this.error = null;
    this.loading = false;
    this.config = {
      simulateLoading: false,
      simulateError: false,
      isPrivate: false,
      isVerified: false,
      followersCount: 150,
      followingsCount: 75,
      postsCount: 25,
      isFollowing: false
    };
  }
}
