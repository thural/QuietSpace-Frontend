/**
 * Notification Migration Hook
 * 
 * Provides backward compatibility during migration from legacy notification hooks to enterprise notification hooks
 * Allows gradual migration with feature flags and fallback mechanisms
 */

import { useEffect, useState } from 'react';
import { useEnterpriseNotifications } from './useEnterpriseNotifications';
import { useNotifications } from './useNotifications';
import { useAdvancedNotifications } from './useAdvancedNotifications';
import { usePushNotifications } from './usePushNotifications';

/**
 * Migration configuration
 */
interface NotificationMigrationConfig {
  useEnterpriseHooks: boolean;
  enableFallback: boolean;
  logMigrationEvents: boolean;
  realTimeLevel: 'basic' | 'enhanced' | 'maximum';
  pushNotificationLevel: 'disabled' | 'basic' | 'enhanced';
}

/**
 * Migration state
 */
interface NotificationMigrationState {
  isUsingEnterprise: boolean;
  migrationErrors: string[];
  performanceMetrics: {
    enterpriseHookTime: number;
    legacyHookTime: number;
    realTimeConnectionTime: number;
    pushSubscriptionTime: number;
  };
  features: {
    realTimeEnabled: boolean;
    pushNotificationsEnabled: boolean;
    advancedFiltering: boolean;
    intelligentCaching: boolean;
  };
}

/**
 * Notification Migration Hook
 * 
 * Provides seamless migration between legacy and enterprise notification hooks
 * with feature flags, performance monitoring, and error handling
 */
export const useNotificationMigration = (config: NotificationMigrationConfig = {
  useEnterpriseHooks: true,
  enableFallback: true,
  logMigrationEvents: true,
  realTimeLevel: 'enhanced',
  pushNotificationLevel: 'enhanced'
}) => {
  const [migrationState, setMigrationState] = useState<NotificationMigrationState>({
    isUsingEnterprise: config.useEnterpriseHooks,
    migrationErrors: [],
    performanceMetrics: {
      enterpriseHookTime: 0,
      legacyHookTime: 0,
      realTimeConnectionTime: 0,
      pushSubscriptionTime: 0
    },
    features: {
      realTimeEnabled: false,
      pushNotificationsEnabled: false,
      advancedFiltering: false,
      intelligentCaching: false
    }
  });

  // Enterprise hooks
  const enterpriseNotifications = useEnterpriseNotifications();
  const legacyNotifications = useNotifications();
  const advancedNotifications = useAdvancedNotifications();
  const pushNotifications = usePushNotifications();

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

        console.log(`🔔 Enterprise notification hook performance: ${duration.toFixed(2)}ms`);
      }, 0);
    }
  }, [config.logMigrationEvents]);

  // Error handling and fallback
  useEffect(() => {
    const errors: string[] = [];

    if (enterpriseNotifications.error) {
      errors.push(`Enterprise notification error: ${enterpriseNotifications.error}`);
    }

    if (legacyNotifications.error) {
      errors.push(`Legacy notification error: ${legacyNotifications.error}`);
    }

    if (errors.length > 0) {
      setMigrationState(prev => ({
        ...prev,
        migrationErrors: errors
      }));

      if (config.logMigrationEvents) {
        console.warn('🔔 Notification migration errors:', errors);
      }
    }
  }, [
    enterpriseNotifications.error,
    legacyNotifications.error,
    config.logMigrationEvents
  ]);

  // Feature monitoring
  useEffect(() => {
    setMigrationState(prev => ({
      ...prev,
      features: {
        realTimeEnabled: enterpriseNotifications.realTimeEnabled || false,
        pushNotificationsEnabled: enterpriseNotifications.pushNotificationStatus.enabled,
        advancedFiltering: !!enterpriseNotifications.filters,
        intelligentCaching: !!enterpriseNotifications.lastSyncTime
      }
    }));
  }, [
    enterpriseNotifications.realTimeEnabled,
    enterpriseNotifications.pushNotificationStatus,
    enterpriseNotifications.filters,
    enterpriseNotifications.lastSyncTime
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
    if (config.realTimeLevel === 'maximum' && config.pushNotificationLevel === 'enhanced') {
      // Use full enterprise notifications with all features
      return {
        // Enterprise notification data
        notifications: enterpriseNotifications.notifications,
        unreadCount: enterpriseNotifications.unreadCount,
        selectedNotification: enterpriseNotifications.selectedNotification,
        isLoading: enterpriseNotifications.isLoading,
        error: enterpriseNotifications.error,
        filters: enterpriseNotifications.filters,
        searchQuery: enterpriseNotifications.searchQuery,
        activeFilter: enterpriseNotifications.activeFilter,
        realTimeEnabled: enterpriseNotifications.realTimeEnabled,
        pushNotificationStatus: enterpriseNotifications.pushNotificationStatus,
        quietHours: enterpriseNotifications.quietHours,
        preferences: enterpriseNotifications.preferences,
        lastSyncTime: enterpriseNotifications.lastSyncTime,
        syncInProgress: enterpriseNotifications.syncInProgress,

        // Enterprise notification actions
        fetchNotifications: enterpriseNotifications.fetchNotifications,
        fetchNotificationsByType: enterpriseNotifications.fetchNotificationsByType,
        fetchUnreadCount: enterpriseNotifications.fetchUnreadCount,
        refreshNotifications: enterpriseNotifications.refreshNotifications,
        markAsRead: enterpriseNotifications.markAsRead,
        markMultipleAsRead: enterpriseNotifications.markMultipleAsRead,
        markAllAsRead: enterpriseNotifications.markAllAsRead,
        deleteNotification: enterpriseNotifications.deleteNotification,
        deleteMultipleNotifications: enterpriseNotifications.deleteMultipleNotifications,
        getNotificationById: enterpriseNotifications.getNotificationById,
        searchNotifications: enterpriseNotifications.searchNotifications,
        enableRealTimeNotifications: enterpriseNotifications.enableRealTimeNotifications,
        disableRealTimeNotifications: enterpriseNotifications.disableRealTimeNotifications,
        subscribeToPushNotifications: enterpriseNotifications.subscribeToPushNotifications,
        unsubscribeFromPushNotifications: enterpriseNotifications.unsubscribeFromPushNotifications,
        updateNotificationSettings: enterpriseNotifications.updateNotificationSettings,
        updateNotificationPreferences: enterpriseNotifications.updateNotificationPreferences,
        setQuietHours: enterpriseNotifications.setQuietHours,
        clearQuietHours: enterpriseNotifications.clearQuietHours,
        setSelectedNotification: enterpriseNotifications.setSelectedNotification,
        setFilters: enterpriseNotifications.setFilters,
        clearError: enterpriseNotifications.clearError,
        retry: enterpriseNotifications.retry,
        syncNotifications: enterpriseNotifications.syncNotifications,

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
      // Use basic enterprise notifications
      return {
        // Basic enterprise notification data
        notifications: enterpriseNotifications.notifications,
        unreadCount: enterpriseNotifications.unreadCount,
        selectedNotification: enterpriseNotifications.selectedNotification,
        isLoading: enterpriseNotifications.isLoading,
        error: enterpriseNotifications.error,
        filters: enterpriseNotifications.filters,
        searchQuery: '',
        activeFilter: null,
        realTimeEnabled: config.realTimeLevel !== 'basic',
        pushNotificationStatus: config.pushNotificationLevel === 'disabled'
          ? { enabled: false, subscribed: false, deviceCount: 0, activeDevices: 0 }
          : { enabled: true, subscribed: false, deviceCount: 0, activeDevices: 0 },
        quietHours: null,
        preferences: null,
        lastSyncTime: null,
        syncInProgress: false,

        // Basic enterprise notification actions
        fetchNotifications: enterpriseNotifications.fetchNotifications,
        fetchNotificationsByType: enterpriseNotifications.fetchNotificationsByType,
        fetchUnreadCount: enterpriseNotifications.fetchUnreadCount,
        refreshNotifications: enterpriseNotifications.refreshNotifications,
        markAsRead: enterpriseNotifications.markAsRead,
        markMultipleAsRead: enterpriseNotifications.markMultipleAsRead,
        markAllAsRead: enterpriseNotifications.markAllAsRead,
        deleteNotification: enterpriseNotifications.deleteNotification,
        deleteMultipleNotifications: enterpriseNotifications.deleteMultipleNotifications,
        getNotificationById: enterpriseNotifications.getNotificationById,
        searchNotifications: enterpriseNotifications.searchNotifications,
        enableRealTimeNotifications: config.realTimeLevel !== 'basic' ? enterpriseNotifications.enableRealTimeNotifications : async () => { },
        disableRealTimeNotifications: config.realTimeLevel !== 'basic' ? enterpriseNotifications.disableRealTimeNotifications : async () => { },
        subscribeToPushNotifications: config.pushNotificationLevel !== 'disabled' ? enterpriseNotifications.subscribeToPushNotifications : async () => { },
        unsubscribeFromPushNotifications: config.pushNotificationLevel !== 'disabled' ? enterpriseNotifications.unsubscribeFromPushNotifications : async () => { },
        updateNotificationSettings: enterpriseNotifications.updateNotificationSettings,
        updateNotificationPreferences: enterpriseNotifications.updateNotificationPreferences,
        setQuietHours: enterpriseNotifications.setQuietHours,
        clearQuietHours: enterpriseNotifications.clearQuietHours,
        setSelectedNotification: enterpriseNotifications.setSelectedNotification,
        setFilters: enterpriseNotifications.setFilters,
        clearError: enterpriseNotifications.clearError,
        retry: enterpriseNotifications.retry,
        syncNotifications: enterpriseNotifications.syncNotifications,

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
    // Legacy notification data
    notifications: legacyNotifications.notifications,
    unreadCount: legacyNotifications.unreadCount || 0,
    selectedNotification: legacyNotifications.selectedNotification,
    isLoading: legacyNotifications.isLoading,
    error: legacyNotifications.error,
    filters: legacyNotifications.filters || {},
    searchQuery: legacyNotifications.searchQuery || '',
    activeFilter: legacyNotifications.activeFilter,
    realTimeEnabled: false,
    pushNotificationStatus: { enabled: false, subscribed: false, deviceCount: 0, activeDevices: 0 },
    quietHours: null,
    preferences: null,
    lastSyncTime: null,
    syncInProgress: false,

    // Legacy notification actions
    fetchNotifications: legacyNotifications.fetchNotifications || (async () => { }),
    fetchNotificationsByType: legacyNotifications.fetchNotificationsByType || (async () => { }),
    fetchUnreadCount: legacyNotifications.fetchUnreadCount || (async () => { }),
    refreshNotifications: async () => { },
    markAsRead: legacyNotifications.markAsRead || (async () => { }),
    markMultipleAsRead: legacyNotifications.markMultipleAsRead || (async () => { }),
    markAllAsRead: legacyNotifications.markAllAsRead || (async () => { }),
    deleteNotification: legacyNotifications.deleteNotification || (async () => { }),
    deleteMultipleNotifications: legacyNotifications.deleteMultipleNotifications || (async () => { }),
    getNotificationById: legacyNotifications.getNotificationById || (async () => { }),
    searchNotifications: legacyNotifications.searchNotifications || (async () => { }),
    enableRealTimeNotifications: async () => { },
    disableRealTimeNotifications: async () => { },
    subscribeToPushNotifications: async () => { },
    unsubscribeFromPushNotifications: async () => { },
    updateNotificationSettings: async () => { },
    updateNotificationPreferences: async () => { },
    setQuietHours: async () => { },
    clearQuietHours: async () => { },
    setSelectedNotification: legacyNotifications.setSelectedNotification || (() => { }),
    setFilters: legacyNotifications.setFilters || (() => { }),
    clearError: legacyNotifications.setError || (() => { }),
    retry: () => { },
    syncNotifications: async () => { },

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
 * Notification Migration Utilities
 */
export const NotificationMigrationUtils = {
  /**
   * Check if migration is complete
   */
  isMigrationComplete: (migrationState: NotificationMigrationState) => {
    return migrationState.isUsingEnterprise && migrationState.migrationErrors.length === 0;
  },

  /**
   * Get migration recommendations
   */
  getMigrationRecommendations: (migrationState: NotificationMigrationState, config: NotificationMigrationConfig) => {
    const recommendations: string[] = [];

    if (!migrationState.isUsingEnterprise) {
      recommendations.push('Enable enterprise hooks for better performance and features');
    }

    if (migrationState.migrationErrors.length > 0) {
      recommendations.push('Fix migration errors before completing migration');
    }

    if (config.realTimeLevel !== 'maximum') {
      recommendations.push('Consider using maximum real-time level for best experience');
    }

    if (config.pushNotificationLevel !== 'enhanced') {
      recommendations.push('Consider enabling enhanced push notifications');
    }

    if (!migrationState.features.realTimeEnabled) {
      recommendations.push('Enable real-time notifications for instant updates');
    }

    if (!migrationState.features.pushNotificationsEnabled) {
      recommendations.push('Enable push notifications for better user engagement');
    }

    if (migrationState.performanceMetrics.enterpriseHookTime > 100) {
      recommendations.push('Consider optimizing notification queries for better performance');
    }

    return recommendations;
  },

  /**
   * Generate migration report
   */
  generateMigrationReport: (migrationState: NotificationMigrationState, config: NotificationMigrationConfig) => {
    return {
      status: migrationState.isUsingEnterprise ? 'Enterprise' : 'Legacy',
      realTimeLevel: config.realTimeLevel,
      pushNotificationLevel: config.pushNotificationLevel,
      errors: migrationState.migrationErrors,
      performance: migrationState.performanceMetrics,
      features: migrationState.features,
      isComplete: NotificationMigrationUtils.isMigrationComplete(migrationState),
      recommendations: NotificationMigrationUtils.getMigrationRecommendations(migrationState, config)
    };
  },

  /**
   * Get feature score
   */
  getFeatureScore: (migrationState: NotificationMigrationState) => {
    let score = 0;
    const maxScore = 100;

    // Base score for enterprise hooks
    if (migrationState.isUsingEnterprise) score += 30;

    // Feature scores
    if (migrationState.features.realTimeEnabled) score += 25;
    if (migrationState.features.pushNotificationsEnabled) score += 20;
    if (migrationState.features.advancedFiltering) score += 15;
    if (migrationState.features.intelligentCaching) score += 10;

    // No errors
    if (migrationState.migrationErrors.length === 0) score += 10;

    return Math.min(score, maxScore);
  }
};

export default useNotificationMigration;
