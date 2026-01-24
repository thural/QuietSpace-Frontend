/**
 * Profile Migration Hook
 * 
 * Provides backward compatibility during migration from legacy profile hooks to enterprise profile hooks
 * Allows gradual migration with feature flags and fallback mechanisms
 */

import { useEffect, useState } from 'react';
import { useEnterpriseProfile } from './useEnterpriseProfile';
import { useProfile } from './useProfile';
import { useProfileConnections } from './useProfileConnections';
import { useProfileSettings } from './useProfileSettings';

/**
 * Migration configuration
 */
interface ProfileMigrationConfig {
  useEnterpriseHooks: boolean;
  enableFallback: boolean;
  logMigrationEvents: boolean;
  userManagementLevel: 'basic' | 'enhanced' | 'maximum';
  socialFeaturesLevel: 'disabled' | 'basic' | 'enhanced';
}

/**
 * Migration state
 */
interface ProfileMigrationState {
  isUsingEnterprise: boolean;
  migrationErrors: string[];
  performanceMetrics: {
    enterpriseHookTime: number;
    legacyHookTime: number;
    userManagementTime: number;
    socialFeaturesTime: number;
  };
  features: {
    advancedUserManagement: boolean;
    socialFeaturesEnabled: boolean;
    profileCompletenessTracking: boolean;
    activityStatusTracking: boolean;
  };
}

/**
 * Profile Migration Hook
 * 
 * Provides seamless migration between legacy and enterprise profile hooks
 * with feature flags, performance monitoring, and error handling
 */
export const useProfileMigration = (config: ProfileMigrationConfig = {
  useEnterpriseHooks: true,
  enableFallback: true,
  logMigrationEvents: true,
  userManagementLevel: 'enhanced',
  socialFeaturesLevel: 'enhanced'
}) => {
  const [migrationState, setMigrationState] = useState<ProfileMigrationState>({
    isUsingEnterprise: config.useEnterpriseHooks,
    migrationErrors: [],
    performanceMetrics: {
      enterpriseHookTime: 0,
      legacyHookTime: 0,
      userManagementTime: 0,
      socialFeaturesTime: 0
    },
    features: {
      advancedUserManagement: false,
      socialFeaturesEnabled: false,
      profileCompletenessTracking: false,
      activityStatusTracking: false
    }
  });

  // Enterprise hooks
  const enterpriseProfile = useEnterpriseProfile();
  const legacyProfile = useProfile();
  const profileConnections = useProfileConnections();
  const profileSettings = useProfileSettings();

  // Performance monitoring
  useEffect(() => {
    if (config.logMigrationEvents) {
      const startTime = performance.now();
      
      // Simulate performance measurement
      setTimeout(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        setMigrationState(prev => ({
          ...prev,
          performanceMetrics: {
            ...prev.performanceMetrics,
            enterpriseHookTime: duration
          }
        }));
        
        console.log(`👤 Enterprise profile hook performance: ${duration.toFixed(2)}ms`);
      }, 0);
    }
  }, [config.logMigrationEvents]);

  // Error handling and fallback
  useEffect(() => {
    const errors: string[] = [];
    
    if (enterpriseProfile.error) {
      errors.push(`Enterprise profile error: ${enterpriseProfile.error}`);
    }
    
    if (legacyProfile.error) {
      errors.push(`Legacy profile error: ${legacyProfile.error}`);
    }
    
    if (errors.length > 0) {
      setMigrationState(prev => ({
        ...prev,
        migrationErrors: errors
      }));
      
      if (config.logMigrationEvents) {
        console.warn('👤 Profile migration errors:', errors);
      }
    }
  }, [
    enterpriseProfile.error,
    legacyProfile.error,
    config.logMigrationEvents
  ]);

  // Feature monitoring
  useEffect(() => {
    setMigrationState(prev => ({
      ...prev,
      features: {
        advancedUserManagement: enterpriseProfile.profileCompleteness > 0,
        socialFeaturesEnabled: !!enterpriseProfile.followers || !!enterpriseProfile.followings,
        profileCompletenessTracking: enterpriseProfile.profileCompleteness > 0,
        activityStatusTracking: enterpriseProfile.activityStatus !== 'active'
      }
    }));
  }, [
    enterpriseProfile.profileCompleteness,
    enterpriseProfile.followers,
    enterpriseProfile.followings,
    enterpriseProfile.activityStatus
  ]);

  // Determine which hooks to use based on configuration and errors
  const shouldUseEnterprise = config.useEnterpriseHooks && 
    (migrationState.migrationErrors.length === 0 || !config.enableFallback);

  // Update migration state
  useEffect(() => {
    setMigrationState(prev => ({
      ...prev,
      isUsingEnterprise: shouldUseEnterprise
    }));
  }, [shouldUseEnterprise]);

  // Return appropriate hook data based on migration state and feature levels
  if (shouldUseEnterprise) {
    if (config.userManagementLevel === 'maximum' && config.socialFeaturesLevel === 'enhanced') {
      // Use full enterprise profile with all features
      return {
        // Enterprise profile data
        profile: enterpriseProfile.profile,
        stats: enterpriseProfile.stats,
        followers: enterpriseProfile.followers,
        followings: enterpriseProfile.followings,
        searchResults: enterpriseProfile.searchResults,
        suggestions: enterpriseProfile.suggestions,
        settings: enterpriseProfile.settings,
        privacy: enterpriseProfile.privacy,
        selectedUserId: enterpriseProfile.selectedUserId,
        isLoading: enterpriseProfile.isLoading,
        error: enterpriseProfile.error,
        connectionStatus: enterpriseProfile.connectionStatus,
        profileCompleteness: enterpriseProfile.profileCompleteness,
        lastUpdateTime: enterpriseProfile.lastUpdateTime,
        cacheHitRate: enterpriseProfile.cacheHitRate,
        isOnline: enterpriseProfile.isOnline,
        activityStatus: enterpriseProfile.activityStatus,

        // Enterprise profile actions
        getProfile: enterpriseProfile.getProfile,
        getCurrentProfile: enterpriseProfile.getCurrentProfile,
        updateProfile: enterpriseProfile.updateProfile,
        deleteProfile: enterpriseProfile.deleteProfile,
        refreshProfile: enterpriseProfile.refreshProfile,
        getStats: enterpriseProfile.getStats,
        updateStats: enterpriseProfile.updateStats,
        trackActivity: enterpriseProfile.trackActivity,
        getFollowers: enterpriseProfile.getFollowers,
        getFollowings: enterpriseProfile.getFollowings,
        followUser: enterpriseProfile.followUser,
        unfollowUser: enterpriseProfile.unfollowUser,
        blockUser: enterpriseProfile.blockUser,
        unblockUser: enterpriseProfile.unblockUser,
        getConnections: enterpriseProfile.getConnections,
        searchProfiles: enterpriseProfile.searchProfiles,
        getSuggestions: enterpriseProfile.getSuggestions,
        getRecommendedConnections: enterpriseProfile.getRecommendedConnections,
        getSettings: enterpriseProfile.getSettings,
        updateSettings: enterpriseProfile.updateSettings,
        getPrivacy: enterpriseProfile.getPrivacy,
        updatePrivacy: enterpriseProfile.updatePrivacy,
        setProfileVisibility: enterpriseProfile.setProfileVisibility,
        uploadAvatar: enterpriseProfile.uploadAvatar,
        uploadCoverPhoto: enterpriseProfile.uploadCoverPhoto,
        updateBio: enterpriseProfile.updateBio,
        updateInterests: enterpriseProfile.updateInterests,
        updateSkills: enterpriseProfile.updateSkills,
        addExperience: enterpriseProfile.addExperience,
        updateExperience: enterpriseProfile.updateExperience,
        removeExperience: enterpriseProfile.removeExperience,
        getRecentActivity: enterpriseProfile.getRecentActivity,
        updateActivityStatus: enterpriseProfile.updateActivityStatus,
        setOnlineStatus: enterpriseProfile.setOnlineStatus,
        setSelectedUser: enterpriseProfile.setSelectedUser,
        clearError: enterpriseProfile.clearError,
        retry: enterpriseProfile.retry,
        invalidateCache: enterpriseProfile.invalidateCache,
        calculateProfileCompleteness: enterpriseProfile.calculateProfileCompleteness,

        // Migration state
        migration: {
          isUsingEnterprise: true,
          errors: migrationState.migrationErrors,
          performance: migrationState.performanceMetrics,
          features: migrationState.features,
          config
        }
      };
    } else {
      // Use basic enterprise profile
      return {
        // Basic enterprise profile data
        profile: enterpriseProfile.profile,
        stats: enterpriseProfile.stats,
        followers: config.socialFeaturesLevel !== 'disabled' ? enterpriseProfile.followers : null,
        followings: config.socialFeaturesLevel !== 'disabled' ? enterpriseProfile.followings : null,
        searchResults: enterpriseProfile.searchResults,
        suggestions: enterpriseProfile.suggestions,
        settings: enterpriseProfile.settings,
        privacy: enterpriseProfile.privacy,
        selectedUserId: enterpriseProfile.selectedUserId,
        isLoading: enterpriseProfile.isLoading,
        error: enterpriseProfile.error,
        connectionStatus: config.socialFeaturesLevel !== 'disabled' ? enterpriseProfile.connectionStatus : 'none',
        profileCompleteness: config.userManagementLevel === 'maximum' ? enterpriseProfile.profileCompleteness : 0,
        lastUpdateTime: enterpriseProfile.lastUpdateTime,
        cacheHitRate: enterpriseProfile.cacheHitRate,
        isOnline: false,
        activityStatus: 'active',

        // Basic enterprise profile actions
        getProfile: enterpriseProfile.getProfile,
        getCurrentProfile: enterpriseProfile.getCurrentProfile,
        updateProfile: enterpriseProfile.updateProfile,
        deleteProfile: enterpriseProfile.deleteProfile,
        refreshProfile: enterpriseProfile.refreshProfile,
        getStats: enterpriseProfile.getStats,
        updateStats: config.userManagementLevel !== 'basic' ? enterpriseProfile.updateStats : async () => {},
        trackActivity: config.userManagementLevel === 'maximum' ? enterpriseProfile.trackActivity : async () => {},
        getFollowers: config.socialFeaturesLevel !== 'disabled' ? enterpriseProfile.getFollowers : async () => {},
        getFollowings: config.socialFeaturesLevel !== 'disabled' ? enterpriseProfile.getFollowings : async () => {},
        followUser: config.socialFeaturesLevel !== 'disabled' ? enterpriseProfile.followUser : async () => {},
        unfollowUser: config.socialFeaturesLevel !== 'disabled' ? enterpriseProfile.unfollowUser : async () => {},
        blockUser: config.socialFeaturesLevel === 'enhanced' ? enterpriseProfile.blockUser : async () => {},
        unblockUser: config.socialFeaturesLevel === 'enhanced' ? enterpriseProfile.unblockUser : async () => {},
        getConnections: config.socialFeaturesLevel !== 'disabled' ? enterpriseProfile.getConnections : async () => {},
        searchProfiles: enterpriseProfile.searchProfiles,
        getSuggestions: enterpriseProfile.getSuggestions,
        getRecommendedConnections: config.socialFeaturesLevel === 'enhanced' ? enterpriseProfile.getRecommendedConnections : async () => {},
        getSettings: enterpriseProfile.getSettings,
        updateSettings: enterpriseProfile.updateSettings,
        getPrivacy: enterpriseProfile.getPrivacy,
        updatePrivacy: enterpriseProfile.updatePrivacy,
        setProfileVisibility: enterpriseProfile.setProfileVisibility,
        uploadAvatar: enterpriseProfile.uploadAvatar,
        uploadCoverPhoto: enterpriseProfile.uploadCoverPhoto,
        updateBio: enterpriseProfile.updateBio,
        updateInterests: enterpriseProfile.updateInterests,
        updateSkills: enterpriseProfile.updateSkills,
        addExperience: config.userManagementLevel === 'maximum' ? enterpriseProfile.addExperience : async () => {},
        updateExperience: config.userManagementLevel === 'maximum' ? enterpriseProfile.updateExperience : async () => {},
        removeExperience: config.userManagementLevel === 'maximum' ? enterpriseProfile.removeExperience : async () => {},
        getRecentActivity: config.userManagementLevel === 'maximum' ? enterpriseProfile.getRecentActivity : async () => {},
        updateActivityStatus: config.userManagementLevel === 'maximum' ? enterpriseProfile.updateActivityStatus : async () => {},
        setOnlineStatus: config.userManagementLevel === 'maximum' ? enterpriseProfile.setOnlineStatus : async () => {},
        setSelectedUser: enterpriseProfile.setSelectedUser,
        clearError: enterpriseProfile.clearError,
        retry: enterpriseProfile.retry,
        invalidateCache: enterpriseProfile.invalidateCache,
        calculateProfileCompleteness: config.userManagementLevel === 'maximum' ? enterpriseProfile.calculateProfileCompleteness : async () => {},

        // Migration state
        migration: {
          isUsingEnterprise: true,
          errors: migrationState.migrationErrors,
          performance: migrationState.performanceMetrics,
          features: migrationState.features,
          config
        }
      };
    }
  }

  // Fallback to legacy behavior
  return {
    // Legacy profile data
    profile: legacyProfile.profile,
    stats: legacyProfile.stats,
    followers: legacyProfile.followers,
    followings: legacyProfile.followings,
    searchResults: legacyProfile.searchResults,
    suggestions: legacyProfile.suggestions,
    settings: legacyProfile.settings,
    privacy: legacyProfile.privacy,
    selectedUserId: legacyProfile.selectedUserId,
    isLoading: legacyProfile.isLoading,
    error: legacyProfile.error,
    connectionStatus: 'none',
    profileCompleteness: 0,
    lastUpdateTime: null,
    cacheHitRate: 0,
    isOnline: false,
    activityStatus: 'active',

    // Legacy profile actions
    getProfile: legacyProfile.getProfile || (async () => {}),
    getCurrentProfile: legacyProfile.getCurrentProfile || (async () => {}),
    updateProfile: legacyProfile.updateProfile || (async () => {}),
    deleteProfile: legacyProfile.deleteProfile || (async () => {}),
    refreshProfile: async () => {},
    getStats: legacyProfile.getStats || (async () => {}),
    updateStats: async () => {},
    trackActivity: async () => {},
    getFollowers: legacyProfile.getFollowers || (async () => {}),
    getFollowings: legacyProfile.getFollowings || (async () => {}),
    followUser: legacyProfile.followUser || (async () => {}),
    unfollowUser: legacyProfile.unfollowUser || (async () => {}),
    blockUser: async () => {},
    unblockUser: async () => {},
    getConnections: async () => {},
    searchProfiles: legacyProfile.searchProfiles || (async () => {}),
    getSuggestions: legacyProfile.getSuggestions || (async () => {}),
    getRecommendedConnections: async () => {},
    getSettings: legacyProfile.getSettings || (async () => {}),
    updateSettings: legacyProfile.updateSettings || (async () => {}),
    getPrivacy: legacyProfile.getPrivacy || (async () => {}),
    updatePrivacy: legacyProfile.updatePrivacy || (async () => {}),
    setProfileVisibility: async () => {},
    uploadAvatar: async () => {},
    uploadCoverPhoto: async () => {},
    updateBio: async () => {},
    updateInterests: async () => {},
    updateSkills: async () => {},
    addExperience: async () => {},
    updateExperience: async () => {},
    removeExperience: async () => {},
    getRecentActivity: async () => {},
    updateActivityStatus: async () => {},
    setOnlineStatus: async () => {},
    setSelectedUser: legacyProfile.setSelectedUser || (() => {}),
    clearError: legacyProfile.setError || (() => {}),
    retry: () => {},
    invalidateCache: async () => {},
    calculateProfileCompleteness: async () => {},

    // Migration state
    migration: {
      isUsingEnterprise: false,
      errors: ['Enterprise hooks disabled'],
      performance: migrationState.performanceMetrics,
      features: migrationState.features,
      config
    }
  };
};

/**
 * Profile Migration Utilities
 */
export const ProfileMigrationUtils = {
  /**
   * Check if migration is complete
   */
  isMigrationComplete: (migrationState: ProfileMigrationState) => {
    return migrationState.isUsingEnterprise && migrationState.migrationErrors.length === 0;
  },

  /**
   * Get migration recommendations
   */
  getMigrationRecommendations: (migrationState: ProfileMigrationState, config: ProfileMigrationConfig) => {
    const recommendations: string[] = [];
    
    if (!migrationState.isUsingEnterprise) {
      recommendations.push('Enable enterprise hooks for better profile management');
    }
    
    if (migrationState.migrationErrors.length > 0) {
      recommendations.push('Fix migration errors before completing migration');
    }
    
    if (config.userManagementLevel !== 'maximum') {
      recommendations.push('Consider using maximum user management level for advanced features');
    }
    
    if (config.socialFeaturesLevel !== 'enhanced') {
      recommendations.push('Consider enabling enhanced social features for better user engagement');
    }
    
    if (!migrationState.features.advancedUserManagement) {
      recommendations.push('Enable advanced user management for profile completeness tracking');
    }
    
    if (!migrationState.features.socialFeaturesEnabled) {
      recommendations.push('Enable social features for better user connections');
    }
    
    if (migrationState.performanceMetrics.enterpriseHookTime > 150) {
      recommendations.push('Consider optimizing profile queries for better performance');
    }
    
    return recommendations;
  },

  /**
   * Generate migration report
   */
  generateMigrationReport: (migrationState: ProfileMigrationState, config: ProfileMigrationConfig) => {
    return {
      status: migrationState.isUsingEnterprise ? 'Enterprise' : 'Legacy',
      userManagementLevel: config.userManagementLevel,
      socialFeaturesLevel: config.socialFeaturesLevel,
      errors: migrationState.migrationErrors,
      performance: migrationState.performanceMetrics,
      features: migrationState.features,
      isComplete: ProfileMigrationUtils.isMigrationComplete(migrationState),
      recommendations: ProfileMigrationUtils.getMigrationRecommendations(migrationState, config)
    };
  },

  /**
   * Get profile score
   */
  getProfileScore: (migrationState: ProfileMigrationState) => {
    let score = 0;
    const maxScore = 100;

    // Base score for enterprise hooks
    if (migrationState.isUsingEnterprise) score += 30;

    // Feature scores
    if (migrationState.features.advancedUserManagement) score += 25;
    if (migrationState.features.socialFeaturesEnabled) score += 20;
    if (migrationState.features.profileCompletenessTracking) score += 15;
    if (migrationState.features.activityStatusTracking) score += 10;

    // No errors
    if (migrationState.migrationErrors.length === 0) score += 10;

    return Math.min(score, maxScore);
  }
};

export default useProfileMigration;
