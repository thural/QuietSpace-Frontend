import { Injectable, Inject } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { SettingsDataService } from '@features/settings/data/services/SettingsDataService';
import { 
  ProfileSettings, 
  PrivacySettings, 
  NotificationSettings, 
  SharingSettings, 
  MentionsSettings, 
  RepliesSettings, 
  BlockingSettings 
} from '@features/settings/domain/entities/SettingsEntities';
import { JwtToken } from '@/shared/api/models/common';
import type { ProfileSettingsRequest, UserProfileResponse } from '@/features/profile/data/models/user';

/**
 * Settings Feature Service
 * 
 * Provides business logic and validation for settings operations
 * Implements enterprise-grade validation and business rules
 */
@Injectable()
export class SettingsFeatureService {
  constructor(
    @Inject(TYPES.SETTINGS_DATA_SERVICE) private dataService: SettingsDataService
  ) {}

  // Profile Settings Business Logic
  async validateProfileSettings(settings: ProfileSettingsRequest): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Username validation
    if (!settings.username || settings.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (settings.username && !/^[a-zA-Z0-9_]+$/.test(settings.username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    // Email validation
    if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      errors.push('Invalid email format');
    }

    // Bio validation
    if (settings.bio && settings.bio.length > 500) {
      errors.push('Bio must be less than 500 characters');
    }

    // Display name validation
    if (settings.displayName && settings.displayName.length > 50) {
      errors.push('Display name must be less than 50 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async updateProfileSettingsWithValidation(
    userId: string, 
    settings: ProfileSettingsRequest, 
    token: JwtToken
  ): Promise<{ success: boolean; data?: UserProfileResponse; errors?: string[] }> {
    // Validate settings first
    const validation = await this.validateProfileSettings(settings);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    try {
      const data = await this.dataService.updateProfileSettings(userId, settings, token);
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Failed to update profile settings']
      };
    }
  }

  async uploadProfilePhotoWithValidation(
    userId: string, 
    file: File, 
    token: JwtToken
  ): Promise<{ success: boolean; data?: UserProfileResponse; errors?: string[] }> {
    const errors: string[] = [];

    // File validation
    if (!file) {
      errors.push('No file provided');
    } else {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        errors.push('File size must be less than 5MB');
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        errors.push('Only JPEG, PNG, and WebP images are allowed');
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        errors
      };
    }

    try {
      const data = await this.dataService.uploadProfilePhoto(userId, file, token);
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Failed to upload profile photo']
      };
    }
  }

  // Privacy Settings Business Logic
  async validatePrivacySettings(settings: PrivacySettings): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Business rule validation
    if (settings.isPrivateAccount && settings.allowTagging) {
      // Warning: Private accounts typically don't allow tagging
      console.warn('Privacy settings warning: Private account with tagging enabled');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async updatePrivacySettingsWithValidation(
    userId: string, 
    settings: PrivacySettings, 
    token: JwtToken
  ): Promise<{ success: boolean; data?: PrivacySettings; errors?: string[] }> {
    const validation = await this.validatePrivacySettings(settings);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    try {
      const data = await this.dataService.updatePrivacySettings(userId, settings, token);
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Failed to update privacy settings']
      };
    }
  }

  // Notification Settings Business Logic
  async validateNotificationSettings(settings: NotificationSettings): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Business rule: If push notifications are disabled, warn user
    if (!settings.pushNotifications) {
      console.warn('Notification settings warning: Push notifications disabled');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async updateNotificationSettingsWithValidation(
    userId: string, 
    settings: NotificationSettings, 
    token: JwtToken
  ): Promise<{ success: boolean; data?: NotificationSettings; errors?: string[] }> {
    const validation = await this.validateNotificationSettings(settings);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    try {
      const data = await this.dataService.updateNotificationSettings(userId, settings, token);
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Failed to update notification settings']
      };
    }
  }

  // Batch operations with business logic
  async getAllSettingsWithBusinessLogic(userId: string, token: JwtToken): Promise<{
    profile: UserProfileResponse;
    privacy: PrivacySettings;
    notifications: NotificationSettings;
    sharing: SharingSettings;
    mentions: MentionsSettings;
    replies: RepliesSettings;
    blocking: BlockingSettings;
    recommendations: {
      privacy: string[];
      notifications: string[];
      security: string[];
    };
  }> {
    const allSettings = await this.dataService.getAllSettings(userId, token);
    
    // Generate business recommendations
    const recommendations = {
      privacy: this.generatePrivacyRecommendations(allSettings.privacy),
      notifications: this.generateNotificationRecommendations(allSettings.notifications),
      security: this.generateSecurityRecommendations(allSettings.privacy, allSettings.blocking)
    };

    return {
      ...allSettings,
      recommendations
    };
  }

  // Business recommendation engines
  private generatePrivacyRecommendations(privacy: PrivacySettings): string[] {
    const recommendations: string[] = [];

    if (!privacy.isPrivateAccount) {
      recommendations.push('Consider making your account private for better privacy');
    }

    if (privacy.showEmail) {
      recommendations.push('Hide your email address to prevent spam');
    }

    if (privacy.allowDirectMessages && privacy.isPrivateAccount) {
      recommendations.push('Consider restricting direct messages for private accounts');
    }

    return recommendations;
  }

  private generateNotificationRecommendations(notifications: NotificationSettings): string[] {
    const recommendations: string[] = [];

    if (!notifications.pushNotifications) {
      recommendations.push('Enable push notifications for real-time updates');
    }

    if (!notifications.emailNotifications) {
      recommendations.push('Enable email notifications for important updates');
    }

    return recommendations;
  }

  private generateSecurityRecommendations(privacy: PrivacySettings, blocking: BlockingSettings): string[] {
    const recommendations: string[] = [];

    if (blocking.blockedUsers.length === 0) {
      recommendations.push('Review your blocked users list for better security');
    }

    if (privacy.allowTagging) {
      recommendations.push('Consider limiting who can tag you for better control');
    }

    return recommendations;
  }

  // Settings health check
  async getSettingsHealthCheck(userId: string, token: JwtToken): Promise<{
    overall: 'healthy' | 'warning' | 'critical';
    issues: Array<{
      type: 'privacy' | 'security' | 'performance';
      severity: 'low' | 'medium' | 'high';
      message: string;
      recommendation: string;
    }>;
  }> {
    const allSettings = await this.dataService.getAllSettings(userId, token);
    const issues: Array<{
      type: 'privacy' | 'security' | 'performance';
      severity: 'low' | 'medium' | 'high';
      message: string;
      recommendation: string;
    }> = [];

    // Privacy checks
    if (!allSettings.privacy.isPrivateAccount) {
      issues.push({
        type: 'privacy',
        severity: 'medium',
        message: 'Account is public',
        recommendation: 'Consider making your account private for better privacy'
      });
    }

    // Security checks
    if (allSettings.privacy.allowDirectMessages) {
      issues.push({
        type: 'security',
        severity: 'low',
        message: 'Direct messages are enabled',
        recommendation: 'Review who can send you direct messages'
      });
    }

    // Performance checks
    const cacheStats = this.dataService.getCacheStats();
    if (cacheStats.hitRate < 0.7) {
      issues.push({
        type: 'performance',
        severity: 'medium',
        message: 'Low cache hit rate',
        recommendation: 'Cache performance is below optimal levels'
      });
    }

    const overall = issues.length === 0 ? 'healthy' : 
                   issues.some(i => i.severity === 'high') ? 'critical' : 'warning';

    return {
      overall,
      issues
    };
  }
}
