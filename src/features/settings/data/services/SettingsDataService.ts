import { Injectable, Inject } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { CacheService } from '@/core/cache/CacheProvider';
import { ISettingsRepository, ProfileSettings, PrivacySettings, NotificationSettings, SharingSettings, MentionsSettings, RepliesSettings, BlockingSettings } from '@features/settings/domain/entities/SettingsRepository';
import { JwtToken } from '@/shared/api/models/common';
import { SETTINGS_CACHE_KEYS, SETTINGS_CACHE_TTL, SETTINGS_CACHE_INVALIDATION } from '../cache/SettingsCacheKeys';
import type { ProfileSettingsRequest, UserProfileResponse } from '@/features/profile/data/models/user';

/**
 * Settings Data Service
 * 
 * Provides intelligent caching and orchestration for settings data
 * Implements enterprise-grade caching with security-conscious strategies
 */
@Injectable()
export class SettingsDataService {
  constructor(
    @Inject(TYPES.CACHE_SERVICE) private cache: CacheService,
    @Inject(TYPES.SETTINGS_REPOSITORY) private repository: ISettingsRepository
  ) {}

  // Profile Settings Operations
  async getProfileSettings(userId: string, token: JwtToken): Promise<UserProfileResponse> {
    const cacheKey = SETTINGS_CACHE_KEYS.PROFILE_SETTINGS(userId);
    
    let data = this.cache.get<UserProfileResponse>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getProfileSettings(userId, token);
    this.cache.set(cacheKey, data, SETTINGS_CACHE_TTL.PROFILE_SETTINGS);
    
    return data;
  }

  async updateProfileSettings(userId: string, settings: ProfileSettingsRequest, token: JwtToken): Promise<UserProfileResponse> {
    const result = await this.repository.updateProfileSettings(userId, settings, token);
    
    // Invalidate relevant caches
    SETTINGS_CACHE_INVALIDATION.PROFILE_UPDATE(userId).forEach(key => {
      this.cache.invalidatePattern(key);
    });
    
    // Cache the updated data
    const cacheKey = SETTINGS_CACHE_KEYS.PROFILE_SETTINGS(userId);
    this.cache.set(cacheKey, result, SETTINGS_CACHE_TTL.PROFILE_SETTINGS);
    
    return result;
  }

  async uploadProfilePhoto(userId: string, file: File, token: JwtToken): Promise<UserProfileResponse> {
    const result = await this.repository.uploadProfilePhoto(userId, file, token);
    
    // Invalidate profile-related caches
    SETTINGS_CACHE_INVALIDATION.PROFILE_UPDATE(userId).forEach(key => {
      this.cache.invalidatePattern(key);
    });
    
    // Cache the updated data
    const cacheKey = SETTINGS_CACHE_KEYS.PROFILE_SETTINGS(userId);
    this.cache.set(cacheKey, result, SETTINGS_CACHE_TTL.PROFILE_SETTINGS);
    
    return result;
  }

  async removeProfilePhoto(userId: string, token: JwtToken): Promise<UserProfileResponse> {
    const result = await this.repository.removeProfilePhoto(userId, token);
    
    // Invalidate profile-related caches
    SETTINGS_CACHE_INVALIDATION.PROFILE_UPDATE(userId).forEach(key => {
      this.cache.invalidatePattern(key);
    });
    
    // Cache the updated data
    const cacheKey = SETTINGS_CACHE_KEYS.PROFILE_SETTINGS(userId);
    this.cache.set(cacheKey, result, SETTINGS_CACHE_TTL.PROFILE_SETTINGS);
    
    return result;
  }

  // Privacy Settings Operations
  async getPrivacySettings(userId: string, token: JwtToken): Promise<PrivacySettings> {
    const cacheKey = SETTINGS_CACHE_KEYS.PRIVACY_SETTINGS(userId);
    
    let data = this.cache.get<PrivacySettings>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getPrivacySettings(userId, token);
    this.cache.set(cacheKey, data, SETTINGS_CACHE_TTL.PRIVACY_SETTINGS);
    
    return data;
  }

  async updatePrivacySettings(userId: string, settings: PrivacySettings, token: JwtToken): Promise<PrivacySettings> {
    const result = await this.repository.updatePrivacySettings(userId, settings, token);
    
    // Invalidate privacy-related caches
    SETTINGS_CACHE_INVALIDATION.PRIVACY_UPDATE(userId).forEach(key => {
      this.cache.invalidatePattern(key);
    });
    
    // Cache the updated data
    const cacheKey = SETTINGS_CACHE_KEYS.PRIVACY_SETTINGS(userId);
    this.cache.set(cacheKey, result, SETTINGS_CACHE_TTL.PRIVACY_SETTINGS);
    
    return result;
  }

  // Notification Settings Operations
  async getNotificationSettings(userId: string, token: JwtToken): Promise<NotificationSettings> {
    const cacheKey = SETTINGS_CACHE_KEYS.NOTIFICATION_SETTINGS(userId);
    
    let data = this.cache.get<NotificationSettings>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getNotificationSettings(userId, token);
    this.cache.set(cacheKey, data, SETTINGS_CACHE_TTL.NOTIFICATION_SETTINGS);
    
    return data;
  }

  async updateNotificationSettings(userId: string, settings: NotificationSettings, token: JwtToken): Promise<NotificationSettings> {
    const result = await this.repository.updateNotificationSettings(userId, settings, token);
    
    // Invalidate notification-related caches
    SETTINGS_CACHE_INVALIDATION.NOTIFICATION_UPDATE(userId).forEach(key => {
      this.cache.invalidatePattern(key);
    });
    
    // Cache the updated data
    const cacheKey = SETTINGS_CACHE_KEYS.NOTIFICATION_SETTINGS(userId);
    this.cache.set(cacheKey, result, SETTINGS_CACHE_TTL.NOTIFICATION_SETTINGS);
    
    return result;
  }

  // Additional Settings Categories (if needed)
  async getSharingSettings(userId: string, token: JwtToken): Promise<SharingSettings> {
    const cacheKey = SETTINGS_CACHE_KEYS.SHARING_SETTINGS(userId);
    
    let data = this.cache.get<SharingSettings>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getSharingSettings(userId, token);
    this.cache.set(cacheKey, data, SETTINGS_CACHE_TTL.SHARING_SETTINGS);
    
    return data;
  }

  async getMentionsSettings(userId: string, token: JwtToken): Promise<MentionsSettings> {
    const cacheKey = SETTINGS_CACHE_KEYS.MENTIONS_SETTINGS(userId);
    
    let data = this.cache.get<MentionsSettings>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getMentionsSettings(userId, token);
    this.cache.set(cacheKey, data, SETTINGS_CACHE_TTL.MENTIONS_SETTINGS);
    
    return data;
  }

  async getRepliesSettings(userId: string, token: JwtToken): Promise<RepliesSettings> {
    const cacheKey = SETTINGS_CACHE_KEYS.REPLIES_SETTINGS(userId);
    
    let data = this.cache.get<RepliesSettings>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getRepliesSettings(userId, token);
    this.cache.set(cacheKey, data, SETTINGS_CACHE_TTL.REPLIES_SETTINGS);
    
    return data;
  }

  async getBlockingSettings(userId: string, token: JwtToken): Promise<BlockingSettings> {
    const cacheKey = SETTINGS_CACHE_KEYS.BLOCKING_SETTINGS(userId);
    
    let data = this.cache.get<BlockingSettings>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getBlockingSettings(userId, token);
    this.cache.set(cacheKey, data, SETTINGS_CACHE_TTL.BLOCKING_SETTINGS);
    
    return data;
  }

  // Batch operations for performance
  async getAllSettings(userId: string, token: JwtToken): Promise<{
    profile: UserProfileResponse;
    privacy: PrivacySettings;
    notifications: NotificationSettings;
    sharing: SharingSettings;
    mentions: MentionsSettings;
    replies: RepliesSettings;
    blocking: BlockingSettings;
  }> {
    const cacheKey = SETTINGS_CACHE_KEYS.ALL_SETTINGS(userId);
    
    let data = this.cache.get(cacheKey);
    if (data) return data;
    
    // Fetch all settings in parallel for better performance
    const [
      profile,
      privacy,
      notifications,
      sharing,
      mentions,
      replies,
      blocking
    ] = await Promise.all([
      this.getProfileSettings(userId, token),
      this.getPrivacySettings(userId, token),
      this.getNotificationSettings(userId, token),
      this.getSharingSettings(userId, token),
      this.getMentionsSettings(userId, token),
      this.getRepliesSettings(userId, token),
      this.getBlockingSettings(userId, token)
    ]);
    
    const allSettings = {
      profile,
      privacy,
      notifications,
      sharing,
      mentions,
      replies,
      blocking
    };
    
    this.cache.set(cacheKey, allSettings, SETTINGS_CACHE_TTL.ALL_SETTINGS);
    
    return allSettings;
  }

  // Cache management utilities
  invalidateUserSettings(userId: string): void {
    SETTINGS_CACHE_INVALIDATION.ALL_USER_SETTINGS(userId).forEach(key => {
      this.cache.invalidatePattern(key);
    });
  }

  clearAllSettingsCache(): void {
    this.cache.invalidatePattern(SETTINGS_CACHE_KEYS.ALL_SETTINGS_PATTERN);
  }

  // Performance monitoring
  getCacheStats() {
    return this.cache.getStats();
  }

  // Prefetching for better UX
  async prefetchUserSettings(userId: string, token: JwtToken): Promise<void> {
    // Prefetch commonly accessed settings
    await Promise.all([
      this.getProfileSettings(userId, token),
      this.getPrivacySettings(userId, token),
      this.getNotificationSettings(userId, token)
    ]);
  }
}
