import type { ICacheProvider } from '../../../../core/cache';
import { BaseDataService } from '../../../../core/dataservice/BaseDataService';
import type { IWebSocketService } from '../../../../core/websocket/types';
import type { ProfileSettingsRequest, UserProfileResponse } from '../../../profile/data/models/user';
import { JwtToken } from '../../../../shared/api/models/common';
import { ISettingsRepository } from '../../domain/entities/SettingsRepository';
import { SETTINGS_CACHE_INVALIDATION, SETTINGS_CACHE_KEYS, SETTINGS_CACHE_TTL } from '../cache/SettingsCacheKeys';

/**
 * Settings Data Service
 * 
 * Provides intelligent caching and orchestration for settings data
 * Implements enterprise-grade caching with security-conscious strategies
 * Extends BaseDataService for composed services and proper separation of concerns
 */
export class SettingsDataService extends BaseDataService {
  private repository: ISettingsRepository;

  constructor(
    repository: ISettingsRepository,
    cacheService: ICacheProvider,
    webSocketService: IWebSocketService
  ) {
    super(); // Initialize BaseDataService with composed services
    this.repository = repository;
  }

  // Profile Settings Operations
  async getProfileSettings(userId: string, token: JwtToken): Promise<UserProfileResponse> {
    const cacheKey = super.generateCacheKey('profile-settings', { userId });

    try {
      // Check cache first
      const cachedData = super.getCachedData<UserProfileResponse>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.getProfileSettings(userId, token);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get profile settings:', error);
      throw error;
    }
  }

  async updateProfileSettings(userId: string, settings: ProfileSettingsRequest, token: JwtToken): Promise<UserProfileResponse> {
    try {
      // Update via repository
      const result = await this.repository.updateProfileSettings(userId, settings, token);

      // Invalidate cache
      const cacheKey = super.generateCacheKey('profile-settings', { userId });
      super.invalidateCache(cacheKey);

      return result;
    } catch (error) {
      console.error('Failed to update profile settings:', error);
      throw error;
    }
  }

  async uploadProfilePhoto(userId: string, file: File, token: JwtToken): Promise<UserProfileResponse> {
    try {
      // Upload via repository
      const result = await this.repository.uploadProfilePhoto(userId, file, token);

      // Invalidate cache
      const cacheKey = super.generateCacheKey('profile-settings', { userId });
      super.invalidateCache(cacheKey);

      return result;
    } catch (error) {
      console.error('Failed to upload profile photo:', error);
      throw error;
    }
  }

  async removeProfilePhoto(userId: string, token: JwtToken): Promise<UserProfileResponse> {
    try {
      const result = await this.repository.removeProfilePhoto(userId, token);

      // Invalidate profile-related caches
      const cacheKey = super.generateCacheKey('profile-settings', { userId });
      super.invalidateCache(cacheKey);

      return result;
    } catch (error) {
      console.error('Failed to remove profile photo:', error);
      throw error;
    }
  }

  // Privacy Settings Operations
  async getPrivacySettings(userId: string, token: JwtToken): Promise<any> {
    const cacheKey = super.generateCacheKey('privacy-settings', { userId });

    try {
      // Check cache first
      const cachedData = super.getCachedData<any>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.getPrivacySettings(userId, token);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get privacy settings:', error);
      throw error;
    }
  }

  async updatePrivacySettings(userId: string, settings: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.updatePrivacySettings(userId, settings, token);

      // Invalidate privacy-related caches
      const cacheKey = super.generateCacheKey('privacy-settings', { userId });
      super.invalidateCache(cacheKey);

      return result;
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      throw error;
    }
  }

  // Notification Settings Operations
  async getNotificationSettings(userId: string, token: JwtToken): Promise<any> {
    const cacheKey = super.generateCacheKey('notification-settings', { userId });

    try {
      // Check cache first
      const cachedData = super.getCachedData<any>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.getNotificationSettings(userId, token);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get notification settings:', error);
      throw error;
    }
  }

  async updateNotificationSettings(userId: string, settings: any, token: JwtToken): Promise<any> {
    try {
      const result = await this.repository.updateNotificationSettings(userId, settings, token);

      // Invalidate notification-related caches
      const cacheKey = super.generateCacheKey('notification-settings', { userId });
      super.invalidateCache(cacheKey);

      return result;
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  }

  // Batch operations for performance
  async getAllSettings(userId: string, token: JwtToken): Promise<{
    profile: UserProfileResponse;
    privacy: any;
    notifications: any;
  }> {
    const cacheKey = super.generateCacheKey('all-settings', { userId });

    try {
      // Check cache first
      const cachedData = super.getCachedData<{ profile: UserProfileResponse; privacy: any; notifications: any }>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch available settings in parallel for better performance
      const [profile, privacy, notifications] = await Promise.all([
        this.getProfileSettings(userId, token),
        this.getPrivacySettings(userId, token),
        this.getNotificationSettings(userId, token)
      ]);

      const allSettings = {
        profile,
        privacy,
        notifications
      };

      super.updateCache(cacheKey, allSettings);

      return allSettings;
    } catch (error) {
      console.error('Failed to get all settings:', error);
      throw error;
    }
  }

  // Cache management utilities
  invalidateUserSettings(userId: string): void {
    try {
      // Use BaseDataService cache invalidation
      const cacheKeys = [
        super.generateCacheKey('profile-settings', { userId }),
        super.generateCacheKey('privacy-settings', { userId }),
        super.generateCacheKey('notification-settings', { userId })
      ];

      // Invalidate all user-related cache entries
      cacheKeys.forEach(key => super.invalidateCache(key));
    } catch (error) {
      console.error('Failed to invalidate user settings cache:', error);
    }
  }

  clearAllSettingsCache(): void {
    try {
      // Use BaseDataService cache invalidation
      super.invalidateCache('all-settings');
    } catch (error) {
      console.error('Failed to clear all settings cache:', error);
    }
  }

  // Performance monitoring
  getCacheStats(): any {
    try {
      // Use BaseDataService cache statistics
      return super.getCacheStats();
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return null;
    }
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
