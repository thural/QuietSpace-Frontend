import { Injectable, Inject } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { ProfileDataService } from '../services/ProfileDataService';
import { IProfileRepository, UserProfileEntity, UserProfileStatsEntity, UserConnectionEntity } from '@features/profile/domain/entities/IProfileRepository';
import { JwtToken } from '@/shared/api/models/common';

/**
 * Profile Feature Service
 * 
 * Implements business logic and orchestration for profile features
 * Provides validation, data processing, and cross-service coordination
 */
@Injectable()
export class ProfileFeatureService {
  constructor(
    @Inject(TYPES.PROFILE_DATA_SERVICE) private profileDataService: ProfileDataService
  ) {}

  // User profile business logic
  async getUserProfile(userId: string | number, token: JwtToken): Promise<UserProfileEntity> {
    await this.validateUserProfileRequest(userId);
    
    try {
      const result = await this.profileDataService.getUserProfile(userId, token);
      await this.processUserProfileData(result, userId);
      return result;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async getCurrentUserProfile(token: JwtToken): Promise<UserProfileEntity> {
    try {
      const result = await this.profileDataService.getCurrentUser(token);
      await this.processCurrentUserProfileData(result);
      return result;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string | number, updates: Partial<UserProfileEntity>, token: JwtToken): Promise<UserProfileEntity> {
    await this.validateProfileUpdateData(userId, updates);
    
    try {
      const result = await this.profileDataService.updateUserProfile(userId, updates, token);
      await this.handleProfileUpdated(result, userId, updates);
      return result;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // User statistics business logic
  async getUserStats(userId: string | number, token: JwtToken): Promise<UserProfileStatsEntity> {
    try {
      const result = await this.profileDataService.getUserStats(userId, token);
      await this.processUserStatsData(result, userId);
      return result;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  // User connections business logic
  async getUserFollowers(userId: string | number, options: {
    limit?: number;
    offset?: number;
    search?: string;
  } = {}, token: JwtToken): Promise<UserConnectionEntity[]> {
    await this.validateConnectionRequest(userId, options);
    
    try {
      const result = await this.profileDataService.getUserFollowers(userId, options, token);
      await this.processFollowersData(result, userId);
      return result;
    } catch (error) {
      console.error('Error fetching user followers:', error);
      throw error;
    }
  }

  async getUserFollowings(userId: string | number, options: {
    limit?: number;
    offset?: number;
    search?: string;
  } = {}, token: JwtToken): Promise<UserConnectionEntity[]> {
    await this.validateConnectionRequest(userId, options);
    
    try {
      const result = await this.profileDataService.getUserFollowings(userId, options, token);
      await this.processFollowingsData(result, userId);
      return result;
    } catch (error) {
      console.error('Error fetching user followings:', error);
      throw error;
    }
  }

  async followUser(userId: string | number, targetUserId: string | number, token: JwtToken): Promise<UserConnectionEntity> {
    await this.validateFollowRequest(userId, targetUserId);
    
    try {
      const result = await this.profileDataService.followUser(userId, targetUserId, token);
      await this.handleUserFollowed(userId, targetUserId, result);
      return result;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  async unfollowUser(userId: string | number, targetUserId: string | number, token: JwtToken): Promise<void> {
    await this.validateUnfollowRequest(userId, targetUserId);
    
    try {
      await this.profileDataService.unfollowUser(userId, targetUserId, token);
      await this.handleUserUnfollowed(userId, targetUserId);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  // User search and discovery
  async searchUsers(query: string, options: {
    limit?: number;
    offset?: number;
    filters?: Record<string, any>;
  } = {}, token: JwtToken): Promise<UserProfileEntity[]> {
    await this.validateSearchRequest(query, options);
    
    try {
      const result = await this.profileDataService.searchUsers(query, options, token);
      await this.processSearchResults(result, query, options);
      return result;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  async getUserSuggestions(userId: string | number, options: {
    limit?: number;
    type?: 'mutual' | 'popular' | 'new';
  } = {}, token: JwtToken): Promise<UserProfileEntity[]> {
    await this.validateSuggestionsRequest(userId, options);
    
    try {
      const result = await this.profileDataService.getUserSuggestions(userId, options, token);
      await this.processSuggestionsData(result, userId, options);
      return result;
    } catch (error) {
      console.error('Error fetching user suggestions:', error);
      throw error;
    }
  }

  // User settings and privacy
  async getUserSettings(userId: string | number, token: JwtToken): Promise<any> {
    try {
      const result = await this.profileDataService.getUserSettings(userId, token);
      await this.processUserSettingsData(result, userId);
      return result;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  }

  async updateUserSettings(userId: string | number, settings: any, token: JwtToken): Promise<any> {
    await this.validateSettingsUpdateData(userId, settings);
    
    try {
      const result = await this.profileDataService.updateUserSettings(userId, settings, token);
      await this.handleSettingsUpdated(result, userId, settings);
      return result;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }

  // Private validation methods
  private async validateUserProfileRequest(userId: string | number): Promise<void> {
    if (!userId || typeof userId !== 'string' && typeof userId !== 'number') {
      throw new Error('Valid user ID is required');
    }
  }

  private async validateProfileUpdateData(userId: string | number, updates: Partial<UserProfileEntity>): Promise<void> {
    if (!userId || typeof userId !== 'string' && typeof userId !== 'number') {
      throw new Error('Valid user ID is required');
    }
    
    if (!updates || typeof updates !== 'object') {
      throw new Error('Valid updates object is required');
    }
    
    if (updates.username !== undefined && (typeof updates.username !== 'string' || updates.username.length < 3)) {
      throw new Error('Username must be at least 3 characters long');
    }
    
    if (updates.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        throw new Error('Valid email address is required');
      }
    }
  }

  private async validateConnectionRequest(userId: string | number, options: any): Promise<void> {
    if (!userId || typeof userId !== 'string' && typeof userId !== 'number') {
      throw new Error('Valid user ID is required');
    }
    
    if (options.limit && (typeof options.limit !== 'number' || options.limit < 1 || options.limit > 100)) {
      throw new Error('Limit must be between 1 and 100');
    }
  }

  private async validateFollowRequest(userId: string | number, targetUserId: string | number): Promise<void> {
    if (!userId || !targetUserId) {
      throw new Error('Valid user IDs are required');
    }
    
    if (userId === targetUserId) {
      throw new Error('Cannot follow yourself');
    }
  }

  private async validateUnfollowRequest(userId: string | number, targetUserId: string | number): Promise<void> {
    if (!userId || !targetUserId) {
      throw new Error('Valid user IDs are required');
    }
    
    if (userId === targetUserId) {
      throw new Error('Cannot unfollow yourself');
    }
  }

  private async validateSearchRequest(query: string, options: any): Promise<void> {
    if (!query || typeof query !== 'string' || query.length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }
    
    if (options.limit && (typeof options.limit !== 'number' || options.limit < 1 || options.limit > 50)) {
      throw new Error('Search limit must be between 1 and 50');
    }
  }

  private async validateSuggestionsRequest(userId: string | number, options: any): Promise<void> {
    if (!userId) {
      throw new Error('Valid user ID is required');
    }
    
    if (options.limit && (typeof options.limit !== 'number' || options.limit < 1 || options.limit > 20)) {
      throw new Error('Suggestions limit must be between 1 and 20');
    }
  }

  private async validateSettingsUpdateData(userId: string | number, settings: any): Promise<void> {
    if (!userId) {
      throw new Error('Valid user ID is required');
    }
    
    if (!settings || typeof settings !== 'object') {
      throw new Error('Valid settings object is required');
    }
  }

  // Private processing methods
  private async processUserProfileData(profile: UserProfileEntity, userId: string | number): Promise<void> {
    console.log('Profile data processed:', { userId, username: profile.username });
  }

  private async processCurrentUserProfileData(profile: UserProfileEntity): Promise<void> {
    console.log('Current user profile data processed:', { username: profile.username });
  }

  private async handleProfileUpdated(profile: UserProfileEntity, userId: string | number, updates: Partial<UserProfileEntity>): Promise<void> {
    console.log('Profile updated:', { userId, updatedFields: Object.keys(updates) });
  }

  private async processUserStatsData(stats: UserProfileStatsEntity, userId: string | number): Promise<void> {
    console.log('User stats processed:', { userId, followersCount: stats.followersCount });
  }

  private async processFollowersData(followers: UserConnectionEntity[], userId: string | number): Promise<void> {
    console.log('Followers data processed:', { userId, count: followers.length });
  }

  private async processFollowingsData(followings: UserConnectionEntity[], userId: string | number): Promise<void> {
    console.log('Followings data processed:', { userId, count: followings.length });
  }

  private async handleUserFollowed(userId: string | number, targetUserId: string | number, connection: UserConnectionEntity): Promise<void> {
    console.log('User followed:', { userId, targetUserId, connectionId: connection.id });
  }

  private async handleUserUnfollowed(userId: string | number, targetUserId: string | number): Promise<void> {
    console.log('User unfollowed:', { userId, targetUserId });
  }

  private async processSearchResults(results: UserProfileEntity[], query: string, options: any): Promise<void> {
    console.log('Search results processed:', { query, count: results.length });
  }

  private async processSuggestionsData(suggestions: UserProfileEntity[], userId: string | number, options: any): Promise<void> {
    console.log('Suggestions processed:', { userId, type: options.type, count: suggestions.length });
  }

  private async processUserSettingsData(settings: any, userId: string | number): Promise<void> {
    console.log('User settings processed:', { userId, theme: settings.theme });
  }

  private async handleSettingsUpdated(settings: any, userId: string | number, updates: any): Promise<void> {
    console.log('Settings updated:', { userId, updatedFields: Object.keys(updates) });
  }
}
