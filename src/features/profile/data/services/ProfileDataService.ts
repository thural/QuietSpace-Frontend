import { Injectable, Inject } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { CacheService } from '@/core/cache/CacheProvider';
import { IProfileRepository, UserProfileEntity, UserProfileStatsEntity, UserConnectionEntity, ProfileAccessEntity } from '@features/profile/domain/entities/IProfileRepository';
import { JwtToken } from '@/shared/api/models/common';
import { PROFILE_CACHE_KEYS, PROFILE_CACHE_TTL, PROFILE_CACHE_INVALIDATION } from '../cache/ProfileCacheKeys';

/**
 * Profile Data Service
 * 
 * Provides intelligent caching and orchestration for profile data
 * Implements enterprise-grade caching with user profile management strategies
 */
@Injectable()
export class ProfileDataService {
  constructor(
    @Inject(TYPES.CACHE_SERVICE) private cache: CacheService,
    @Inject(TYPES.PROFILE_REPOSITORY) private repository: IProfileRepository
  ) {}

  // User profile operations with caching
  async getUserProfile(userId: string | number, token: JwtToken): Promise<UserProfileEntity> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_PROFILE(userId);
    
    let data = this.cache.get<UserProfileEntity>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserProfile(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_PROFILE);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async getCurrentUserProfile(token: JwtToken): Promise<UserProfileEntity> {
    const cacheKey = PROFILE_CACHE_KEYS.CURRENT_USER_PROFILE();
    
    let data = this.cache.get<UserProfileEntity>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getCurrentUser();
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.CURRENT_USER_PROFILE);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string | number, updates: Partial<UserProfileEntity>, token: JwtToken): Promise<UserProfileEntity> {
    try {
      const result = await this.repository.updateUserProfile(userId, updates);
      
      // Invalidate relevant caches
      this.invalidateProfileCaches(userId);
      
      return result;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async deleteUserProfile(userId: string | number, token: JwtToken): Promise<void> {
    try {
      await this.repository.deleteUserProfile(userId);
      
      // Invalidate all user-related caches
      this.invalidateAllUserCaches(userId);
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  }

  // User statistics operations with caching
  async getUserStats(userId: string | number, token: JwtToken): Promise<UserProfileStatsEntity> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_STATS(userId);
    
    let data = this.cache.get<UserProfileStatsEntity>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserStats(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_STATS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  async updateUserStats(userId: string | number, stats: Partial<UserProfileStatsEntity>, token: JwtToken): Promise<UserProfileStatsEntity> {
    try {
      const result = await this.repository.updateUserStats(userId, stats);
      
      // Invalidate stats cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_STATS(userId));
      
      return result;
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  // User connections operations with caching
  async getUserFollowers(userId: string | number, options: {
    limit?: number;
    offset?: number;
    search?: string;
  } = {}, token: JwtToken): Promise<UserConnectionEntity[]> {
    const page = options.offset || 0;
    const size = options.limit || 50;
    const cacheKey = PROFILE_CACHE_KEYS.USER_FOLLOWERS(userId, page, size);
    
    let data = this.cache.get<UserConnectionEntity[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserFollowers(userId, options);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_FOLLOWERS);
      }
      
      return data;
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
    const page = options.offset || 0;
    const size = options.limit || 50;
    const cacheKey = PROFILE_CACHE_KEYS.USER_FOLLOWINGS(userId, page, size);
    
    let data = this.cache.get<UserConnectionEntity[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserFollowings(userId, options);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_FOLLOWINGS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user followings:', error);
      throw error;
    }
  }

  async followUser(userId: string | number, targetUserId: string | number, token: JwtToken): Promise<UserConnectionEntity> {
    try {
      const result = await this.repository.followUser(userId, targetUserId);
      
      // Invalidate connection caches for both users
      this.invalidateConnectionCaches(userId);
      this.invalidateConnectionCaches(targetUserId);
      
      return result;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  async unfollowUser(userId: string | number, targetUserId: string | number, token: JwtToken): Promise<void> {
    try {
      await this.repository.unfollowUser(userId, targetUserId);
      
      // Invalidate connection caches for both users
      this.invalidateConnectionCaches(userId);
      this.invalidateConnectionCaches(targetUserId);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  // User search and discovery with caching
  async searchUsers(query: string, options: {
    limit?: number;
    offset?: number;
    filters?: Record<string, any>;
  } = {}, token: JwtToken): Promise<UserProfileEntity[]> {
    const page = options.offset || 0;
    const size = options.limit || 20;
    const cacheKey = PROFILE_CACHE_KEYS.USER_SEARCH(query, page, size);
    
    let data = this.cache.get<UserProfileEntity[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.searchUsers(query, options);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_SEARCH);
      }
      
      return data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  async getUserSuggestions(userId: string | number, options: {
    limit?: number;
    type?: 'mutual' | 'popular' | 'new';
  } = {}, token: JwtToken): Promise<UserProfileEntity[]> {
    const limit = options.limit || 10;
    const cacheKey = PROFILE_CACHE_KEYS.USER_SUGGESTIONS(userId, limit);
    
    let data = this.cache.get<UserProfileEntity[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserSuggestions(userId, options);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_SUGGESTIONS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user suggestions:', error);
      throw error;
    }
  }

  // User settings operations with caching
  async getUserSettings(userId: string | number, token: JwtToken): Promise<any> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_SETTINGS(userId);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserSettings(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_SETTINGS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  }

  async updateUserSettings(userId: string | number, settings: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.updateUserSettings(userId, settings);
      
      // Invalidate settings cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_SETTINGS(userId));
      
      return result;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }

  // User privacy operations with caching
  async getUserPrivacy(userId: string | number, token: JwtToken): Promise<any> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_PRIVACY(userId);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserPrivacy(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_PRIVACY);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user privacy:', error);
      throw error;
    }
  }

  async updateUserPrivacy(userId: string | number, privacy: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.updateUserPrivacy(userId, privacy);
      
      // Invalidate privacy cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_PRIVACY(userId));
      
      return result;
    } catch (error) {
      console.error('Error updating user privacy:', error);
      throw error;
    }
  }

  // User activity operations with caching
  async getUserActivity(userId: string | number, options: {
    limit?: number;
    offset?: number;
    period?: string;
    type?: string;
  } = {}, token: JwtToken): Promise<any[]> {
    const page = options.offset || 0;
    const size = options.limit || 20;
    const period = options.period || '7d';
    const cacheKey = PROFILE_CACHE_KEYS.USER_ACTIVITY(userId, period, page, size);
    
    let data = this.cache.get<any[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserActivity(userId, options);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_ACTIVITY);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  }

  // User achievements and badges with caching
  async getUserAchievements(userId: string | number, options: {
    limit?: number;
    offset?: number;
  } = {}, token: JwtToken): Promise<any[]> {
    const page = options.offset || 0;
    const size = options.limit || 20;
    const cacheKey = PROFILE_CACHE_KEYS.USER_ACHIEVEMENTS(userId, page, size);
    
    let data = this.cache.get<any[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserAchievements(userId, options);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_ACHIEVEMENTS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      throw error;
    }
  }

  async getUserBadges(userId: string | number, token: JwtToken): Promise<any[]> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_BADGES(userId);
    
    let data = this.cache.get<any[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserBadges(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_BADGES);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user badges:', error);
      throw error;
    }
  }

  // User reputation with caching
  async getUserReputation(userId: string | number, token: JwtToken): Promise<any> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_REPUTATION(userId);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserReputation(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_REPUTATION);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user reputation:', error);
      throw error;
    }
  }

  async updateUserReputation(userId: string | number, reputation: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.updateUserReputation(userId, reputation);
      
      // Invalidate reputation cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_REPUTATION(userId));
      
      return result;
    } catch (error) {
      console.error('Error updating user reputation:', error);
      throw error;
    }
  }

  // User engagement with caching
  async getUserEngagement(userId: string | number, period?: string, token: JwtToken): Promise<any> {
    const engagementPeriod = period || '30d';
    const cacheKey = PROFILE_CACHE_KEYS.USER_ENGAGEMENT(userId, engagementPeriod);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserEngagement(userId, engagementPeriod);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_ENGAGEMENT);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user engagement:', error);
      throw error;
    }
  }

  // User online status with caching
  async getUserOnlineStatus(userId: string | number, token: JwtToken): Promise<any> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_ONLINE_STATUS(userId);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserOnlineStatus(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_ONLINE_STATUS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user online status:', error);
      throw error;
    }
  }

  async updateUserOnlineStatus(userId: string | number, status: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.updateUserOnlineStatus(userId, status);
      
      // Invalidate online status cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_ONLINE_STATUS(userId));
      
      return result;
    } catch (error) {
      console.error('Error updating user online status:', error);
      throw error;
    }
  }

  // Profile views with caching
  async getProfileViews(userId: string | number, period?: string, token: JwtToken): Promise<any> {
    const viewPeriod = period || '7d';
    const cacheKey = PROFILE_CACHE_KEYS.PROFILE_VIEWS(userId, viewPeriod);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getProfileViews(userId, viewPeriod);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.PROFILE_VIEWS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching profile views:', error);
      throw error;
    }
  }

  async incrementProfileView(userId: string | number, viewerId?: string | number, token: JwtToken): Promise<void> {
    try {
      await this.repository.incrementProfileView(userId, viewerId);
      
      // Invalidate profile views cache
      this.cache.delete(PROFILE_CACHE_KEYS.PROFILE_VIEWS(userId));
    } catch (error) {
      console.error('Error incrementing profile view:', error);
      throw error;
    }
  }

  // Mutual connections with caching
  async getMutualConnections(userId1: string | number, userId2: string | number, token: JwtToken): Promise<UserConnectionEntity[]> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_MUTUAL_CONNECTIONS(userId1, userId2);
    
    let data = this.cache.get<UserConnectionEntity[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getMutualConnections(userId1, userId2);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_MUTUAL_CONNECTIONS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching mutual connections:', error);
      throw error;
    }
  }

  // Blocked and muted users with caching
  async getBlockedUsers(userId: string | number, options: {
    limit?: number;
    offset?: number;
  } = {}, token: JwtToken): Promise<UserConnectionEntity[]> {
    const page = options.offset || 0;
    const size = options.limit || 50;
    const cacheKey = PROFILE_CACHE_KEYS.USER_BLOCKED(userId, page, size);
    
    let data = this.cache.get<UserConnectionEntity[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getBlockedUsers(userId, options);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_BLOCKED);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      throw error;
    }
  }

  async getMutedUsers(userId: string | number, options: {
    limit?: number;
    offset?: number;
  } = {}, token: JwtToken): Promise<UserConnectionEntity[]> {
    const page = options.offset || 0;
    const size = options.limit || 50;
    const cacheKey = PROFILE_CACHE_KEYS.USER_MUTED(userId, page, size);
    
    let data = this.cache.get<UserConnectionEntity[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getMutedUsers(userId, options);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_MUTED);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching muted users:', error);
      throw error;
    }
  }

  async blockUser(userId: string | number, targetUserId: string | number, token: JwtToken): Promise<void> {
    try {
      await this.repository.blockUser(userId, targetUserId);
      
      // Invalidate blocked users cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_BLOCKED(userId));
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }

  async unblockUser(userId: string | number, targetUserId: string | number, token: JwtToken): Promise<void> {
    try {
      await this.repository.unblockUser(userId, targetUserId);
      
      // Invalidate blocked users cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_BLOCKED(userId));
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  }

  async muteUser(userId: string | number, targetUserId: string | number, token: JwtToken): Promise<void> {
    try {
      await this.repository.muteUser(userId, targetUserId);
      
      // Invalidate muted users cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_MUTED(userId));
    } catch (error) {
      console.error('Error muting user:', error);
      throw error;
    }
  }

  async unmuteUser(userId: string | number, targetUserId: string | number, token: JwtToken): Promise<void> {
    try {
      await this.repository.unmuteUser(userId, targetUserId);
      
      // Invalidate muted users cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_MUTED(userId));
    } catch (error) {
      console.error('Error unmuting user:', error);
      throw error;
    }
  }

  // Profile completion with caching
  async getProfileCompletion(userId: string | number, token: JwtToken): Promise<any> {
    const cacheKey = PROFILE_CACHE_KEYS.PROFILE_COMPLETION(userId);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getProfileCompletion(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.PROFILE_COMPLETION);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching profile completion:', error);
      throw error;
    }
  }

  async updateProfileCompletion(userId: string | number, completion: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.updateProfileCompletion(userId, completion);
      
      // Invalidate profile completion cache
      this.cache.delete(PROFILE_CACHE_KEYS.PROFILE_COMPLETION(userId));
      
      return result;
    } catch (error) {
      console.error('Error updating profile completion:', error);
      throw error;
    }
  }

  // User verification with caching
  async getUserVerification(userId: string | number, token: JwtToken): Promise<any> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_VERIFICATION(userId);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserVerification(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_VERIFICATION);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user verification:', error);
      throw error;
    }
  }

  async requestUserVerification(userId: string | number, verificationData: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.requestUserVerification(userId, verificationData);
      
      // Invalidate verification cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_VERIFICATION(userId));
      
      return result;
    } catch (error) {
      console.error('Error requesting user verification:', error);
      throw error;
    }
  }

  // Profile analytics with caching
  async getProfileAnalytics(userId: string | number, period?: string, token: JwtToken): Promise<any> {
    const analyticsPeriod = period || '30d';
    const cacheKey = PROFILE_CACHE_KEYS.PROFILE_ANALYTICS(userId, analyticsPeriod);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getProfileAnalytics(userId, analyticsPeriod);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.PROFILE_ANALYTICS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching profile analytics:', error);
      throw error;
    }
  }

  // Social links with caching
  async getUserSocialLinks(userId: string | number, token: JwtToken): Promise<any> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_SOCIAL_LINKS(userId);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserSocialLinks(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_SOCIAL_LINKS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user social links:', error);
      throw error;
    }
  }

  async updateUserSocialLinks(userId: string | number, links: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.updateUserSocialLinks(userId, links);
      
      // Invalidate social links cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_SOCIAL_LINKS(userId));
      
      return result;
    } catch (error) {
      console.error('Error updating user social links:', error);
      throw error;
    }
  }

  // Interests and skills with caching
  async getUserInterests(userId: string | number, token: JwtToken): Promise<any> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_INTERESTS(userId);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserInterests(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_INTERESTS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user interests:', error);
      throw error;
    }
  }

  async updateUserInterests(userId: string | number, interests: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.updateUserInterests(userId, interests);
      
      // Invalidate interests cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_INTERESTS(userId));
      
      return result;
    } catch (error) {
      console.error('Error updating user interests:', error);
      throw error;
    }
  }

  async getUserSkills(userId: string | number, token: JwtToken): Promise<any> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_SKILLS(userId);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserSkills(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_SKILLS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user skills:', error);
      throw error;
    }
  }

  async updateUserSkills(userId: string | number, skills: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.updateUserSkills(userId, skills);
      
      // Invalidate skills cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_SKILLS(userId));
      
      return result;
    } catch (error) {
      console.error('Error updating user skills:', error);
      throw error;
    }
  }

  // Education and work experience with caching
  async getUserEducation(userId: string | number, token: JwtToken): Promise<any> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_EDUCATION(userId);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserEducation(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_EDUCATION);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user education:', error);
      throw error;
    }
  }

  async updateUserEducation(userId: string | number, education: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.updateUserEducation(userId, education);
      
      // Invalidate education cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_EDUCATION(userId));
      
      return result;
    } catch (error) {
      console.error('Error updating user education:', error);
      throw error;
    }
  }

  async getUserWorkExperience(userId: string | number, token: JwtToken): Promise<any> {
    const cacheKey = PROFILE_CACHE_KEYS.USER_WORK_EXPERIENCE(userId);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserWorkExperience(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_WORK_EXPERIENCE);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user work experience:', error);
      throw error;
    }
  }

  async updateUserWorkExperience(userId: string | number, workExperience: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.updateUserWorkExperience(userId, workExperience);
      
      // Invalidate work experience cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_WORK_EXPERIENCE(userId));
      
      return result;
    } catch (error) {
      console.error('Error updating user work experience:', error);
      throw error;
    }
  }

  // Portfolio with caching
  async getUserPortfolio(userId: string | number, options: {
    limit?: number;
    offset?: number;
  } = {}, token: JwtToken): Promise<any[]> {
    const page = options.offset || 0;
    const size = options.limit || 20;
    const cacheKey = PROFILE_CACHE_KEYS.USER_PORTFOLIO(userId, page, size);
    
    let data = this.cache.get<any[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserPortfolio(userId, options);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_PORTFOLIO);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user portfolio:', error);
      throw error;
    }
  }

  async addPortfolioItem(userId: string | number, item: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.addPortfolioItem(userId, item);
      
      // Invalidate portfolio cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_PORTFOLIO(userId));
      
      return result;
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      throw error;
    }
  }

  async updatePortfolioItem(userId: string | number, itemId: string, item: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.updatePortfolioItem(userId, itemId, item);
      
      // Invalidate portfolio cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_PORTFOLIO(userId));
      
      return result;
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      throw error;
    }
  }

  async deletePortfolioItem(userId: string | number, itemId: string, token: JwtToken): Promise<void> {
    try {
      await this.repository.deletePortfolioItem(userId, itemId);
      
      // Invalidate portfolio cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_PORTFOLIO(userId));
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      throw error;
    }
  }

  // Testimonials and recommendations with caching
  async getUserTestimonials(userId: string | number, options: {
    limit?: number;
    offset?: number;
  } = {}, token: JwtToken): Promise<any[]> {
    const page = options.offset || 0;
    const size = options.limit || 10;
    const cacheKey = PROFILE_CACHE_KEYS.USER_TESTIMONIALS(userId, page, size);
    
    let data = this.cache.get<any[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserTestimonials(userId, options);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_TESTIMONIALS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user testimonials:', error);
      throw error;
    }
  }

  async addTestimonial(userId: string | number, testimonial: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.addTestimonial(userId, testimonial);
      
      // Invalidate testimonials cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_TESTIMONIALS(userId));
      
      return result;
    } catch (error) {
      console.error('Error adding testimonial:', error);
      throw error;
    }
  }

  async getUserRecommendations(userId: string | number, options: {
    limit?: number;
    offset?: number;
  } = {}, token: JwtToken): Promise<any[]> {
    const page = options.offset || 0;
    const size = options.limit || 10;
    const cacheKey = PROFILE_CACHE_KEYS.USER_RECOMMENDATIONS(userId, page, size);
    
    let data = this.cache.get<any[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserRecommendations(userId, options);
      
      if (data) {
        this.cache.set(cacheKey, data, PROFILE_CACHE_TTL.USER_RECOMMENDATIONS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user recommendations:', error);
      throw error;
    }
  }

  async addRecommendation(userId: string | number, recommendation: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.addRecommendation(userId, recommendation);
      
      // Invalidate recommendations cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_RECOMMENDATIONS(userId));
      
      return result;
    } catch (error) {
      console.error('Error adding recommendation:', error);
      throw error;
    }
  }

  // Batch operations
  async batchUpdateProfiles(updates: Array<{ userId: string | number; updates: Partial<UserProfileEntity> }>, token: JwtToken): Promise<UserProfileEntity[]> {
    try {
      const result = await this.repository.batchUpdateProfiles(updates);
      
      // Invalidate caches for all updated users
      updates.forEach(update => {
        this.invalidateProfileCaches(update.userId);
      });
      
      return result;
    } catch (error) {
      console.error('Error batch updating profiles:', error);
      throw error;
    }
  }

  async batchGetProfiles(userIds: Array<string | number>, token: JwtToken): Promise<UserProfileEntity[]> {
    try {
      const result = await this.repository.batchGetProfiles(userIds);
      
      // Cache individual profiles
      result.forEach(profile => {
        if (profile) {
          const cacheKey = PROFILE_CACHE_KEYS.USER_PROFILE(profile.id);
          this.cache.set(cacheKey, profile, PROFILE_CACHE_TTL.USER_PROFILE);
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error batch getting profiles:', error);
      throw error;
    }
  }

  // Data cleanup and maintenance
  async cleanupOldActivity(olderThan: Date, token: JwtToken): Promise<number> {
    try {
      const result = await this.repository.cleanupOldActivity(olderThan);
      
      // Invalidate activity caches
      this.invalidateSearchData();
      
      return result;
    } catch (error) {
      console.error('Error cleaning up old activity:', error);
      throw error;
    }
  }

  async refreshUserStats(userId: string | number, token: JwtToken): Promise<UserProfileStatsEntity> {
    try {
      const result = await this.repository.refreshUserStats(userId);
      
      // Invalidate stats cache
      this.cache.delete(PROFILE_CACHE_KEYS.USER_STATS(userId));
      
      return result;
    } catch (error) {
      console.error('Error refreshing user stats:', error);
      throw error;
    }
  }

  // Cache management utilities
  private invalidateProfileCaches(userId: string | number): void {
    const patterns = PROFILE_CACHE_INVALIDATION.invalidateUser(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  private invalidateConnectionCaches(userId: string | number): void {
    const patterns = PROFILE_CACHE_INVALIDATION.invalidateConnections(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  private invalidateSettingsCaches(userId: string | number): void {
    const patterns = PROFILE_CACHE_INVALIDATION.invalidateSettings(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  private invalidateAchievementsCaches(userId: string | number): void {
    const patterns = PROFILE_CACHE_INVALIDATION.invalidateAchievements(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  private invalidateProfileDataCaches(userId: string | number): void {
    const patterns = PROFILE_CACHE_INVALIDATION.invalidateProfileData(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  private invalidateAllUserCaches(userId: string | number): void {
    const patterns = PROFILE_CACHE_INVALIDATION.invalidateAllUserData(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  private invalidateSearchData(): void {
    const patterns = PROFILE_CACHE_INVALIDATION.invalidateSearchData();
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  // Cache statistics and monitoring
  getCacheStats() {
    return this.cache.getStats();
  }

  clearCache(): void {
    this.cache.clear();
  }
}
