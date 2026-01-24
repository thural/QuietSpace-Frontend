/**
 * Settings Migration Hook.
 * 
 * Provides gradual migration from React Query to enterprise custom query system
 * Includes feature flags, fallback mechanisms, and performance monitoring
 */

import { useState, useEffect, useCallback } from 'react';
import { useEnterpriseSettings } from './useEnterpriseSettings';
import { useReactQuerySettings } from './useReactQuerySettings';
import { useSettingsDI } from '../di/useSettingsDI';

/**
 * Migration configuration interface.
 */
export interface SettingsMigrationConfig {
  useEnterpriseHooks: boolean;
  enableFallback: boolean;
  logMigrationEvents: boolean;
  performanceComparison: boolean;
}

/**
 * Migration state interface.
 */
export interface SettingsMigrationState {
  isUsingEnterprise: boolean;
  hasFallback: boolean;
  migrationErrors: string[];
  performanceMetrics: {
    enterprise: {
      loadTime: number;
      cacheHitRate: number;
      errorCount: number;
    };
    legacy: {
      loadTime: number;
      cacheHitRate: number;
      errorCount: number;
    };
  };
}

/**
 * Settings Migration Hook.
 * 
 * Facilitates gradual migration from React Query to enterprise hooks
 * with comprehensive monitoring and fallback capabilities.
 */
export const useSettingsMigration = (
  userId: string,
  config: SettingsMigrationConfig = {
    useEnterpriseHooks: true,
    enableFallback: true,
    logMigrationEvents: true,
    performanceComparison: false
  }
) => {
  const [migrationState, setMigrationState] = useState<SettingsMigrationState>({
    isUsingEnterprise: config.useEnterpriseHooks,
    hasFallback: config.enableFallback,
    migrationErrors: [],
    performanceMetrics: {
      enterprise: { loadTime: 0, cacheHitRate: 0, errorCount: 0 },
      legacy: { loadTime: 0, cacheHitRate: 0, errorCount: 0 }
    }
  });

  const [shouldUseEnterprise, setShouldUseEnterprise] = useState(config.useEnterpriseHooks);

  // Get both implementations
  const enterpriseSettings = useEnterpriseSettings(userId);
  const legacySettings = useReactQuerySettings(userId);

  // Performance monitoring
  const measurePerformance = useCallback((implementation: 'enterprise' | 'legacy', fn: () => void) => {
    if (!config.performanceComparison) return fn();

    const startTime = performance.now();
    const initialErrorCount = implementation === 'enterprise' 
      ? migrationState.performanceMetrics.enterprise.errorCount
      : migrationState.performanceMetrics.legacy.errorCount;

    try {
      fn();
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      setMigrationState(prev => ({
        ...prev,
        performanceMetrics: {
          ...prev.performanceMetrics,
          [implementation]: {
            ...prev.performanceMetrics[implementation],
            loadTime
          }
        }
      }));

      if (config.logMigrationEvents) {
        console.log(`Settings Migration (${implementation}): Load time ${loadTime.toFixed(2)}ms`);
      }
    } catch (error) {
      setMigrationState(prev => ({
        ...prev,
        performanceMetrics: {
          ...prev.performanceMetrics,
          [implementation]: {
            ...prev.performanceMetrics[implementation],
            errorCount: initialErrorCount + 1
          }
        }
      }));

      if (config.logMigrationEvents) {
        console.error(`Settings Migration (${implementation}): Error occurred`, error);
      }
    }
  }, [config.performanceComparison, config.logMigrationEvents, migrationState.performanceMetrics]);

  // Error handling and fallback
  const handleError = useCallback((error: Error, implementation: 'enterprise' | 'legacy') => {
    const errorMessage = `${implementation} implementation error: ${error.message}`;
    
    setMigrationState(prev => ({
      ...prev,
      migrationErrors: [...prev.migrationErrors, errorMessage]
    }));

    if (config.logMigrationEvents) {
      console.error('Settings Migration: Error detected', { error, implementation });
    }

    // Auto-fallback to legacy if enterprise fails and fallback is enabled
    if (implementation === 'enterprise' && config.enableFallback && shouldUseEnterprise) {
      console.warn('Settings Migration: Falling back to React Query due to error');
      setShouldUseEnterprise(false);
      setMigrationState(prev => ({
        ...prev,
        isUsingEnterprise: false
      }));
    }
  }, [config.enableFallback, shouldUseEnterprise, config.logMigrationEvents]);

  // Monitor enterprise implementation health
  useEffect(() => {
    if (!shouldUseEnterprise) return;

    const hasErrors = enterpriseSettings.error !== null;
    if (hasErrors) {
      handleError(enterpriseSettings.error as Error, 'enterprise');
    }
  }, [enterpriseSettings.error, shouldUseEnterprise, handleError]);

  // Monitor legacy implementation health
  useEffect(() => {
    if (shouldUseEnterprise) return; // Only monitor legacy when it's active

    const hasErrors = legacySettings.error !== null;
    if (hasErrors) {
      handleError(legacySettings.error as Error, 'legacy');
    }
  }, [legacySettings.error, shouldUseEnterprise, handleError]);

  // Choose implementation based on configuration and health
  const activeImplementation = shouldUseEnterprise ? enterpriseSettings : legacySettings;

  // Enhanced actions with migration logic
  const enhancedActions = {
    updateProfileSettings: async (settings: any) => {
      try {
        measurePerformance(shouldUseEnterprise ? 'enterprise' : 'legacy', () => {
          // Performance measurement wrapper
        });

        if (shouldUseEnterprise) {
          return await enterpriseSettings.updateProfileSettings(settings);
        } else {
          const result = await legacySettings.updateProfileSettings.mutateAsync(settings);
          return { success: true, data: result };
        }
      } catch (error) {
        handleError(error as Error, shouldUseEnterprise ? 'enterprise' : 'legacy');
        throw error;
      }
    },

    uploadProfilePhoto: async (file: File) => {
      try {
        if (shouldUseEnterprise) {
          return await enterpriseSettings.uploadProfilePhoto(file);
        } else {
          const result = await legacySettings.uploadProfilePhoto.mutateAsync({ userId, file, token: '' });
          return { success: true, data: result };
        }
      } catch (error) {
        handleError(error as Error, shouldUseEnterprise ? 'enterprise' : 'legacy');
        throw error;
      }
    },

    removeProfilePhoto: async () => {
      try {
        if (shouldUseEnterprise) {
          return await enterpriseSettings.removeProfilePhoto();
        } else {
          const result = await legacySettings.removeProfilePhoto.mutateAsync({ userId, token: '' });
          return { success: true, data: result };
        }
      } catch (error) {
        handleError(error as Error, shouldUseEnterprise ? 'enterprise' : 'legacy');
        throw error;
      }
    },

    updatePrivacySettings: async (settings: any) => {
      try {
        if (shouldUseEnterprise) {
          return await enterpriseSettings.updatePrivacySettings(settings);
        } else {
          const result = await legacySettings.updatePrivacySettings.mutateAsync({ userId, settings, token: '' });
          return { success: true, data: result };
        }
      } catch (error) {
        handleError(error as Error, shouldUseEnterprise ? 'enterprise' : 'legacy');
        throw error;
      }
    },

    updateNotificationSettings: async (settings: any) => {
      try {
        if (shouldUseEnterprise) {
          return await enterpriseSettings.updateNotificationSettings(settings);
        } else {
          const result = await legacySettings.updateNotificationSettings.mutateAsync({ userId, settings, token: '' });
          return { success: true, data: result };
        }
      } catch (error) {
        handleError(error as Error, shouldUseEnterprise ? 'enterprise' : 'legacy');
        throw error;
      }
    },

    invalidateSettingsCache: () => {
      if (shouldUseEnterprise) {
        enterpriseSettings.invalidateSettingsCache();
      } else {
        legacySettings.invalidateSettingsCache();
      }
    },

    prefetchSettings: async () => {
      try {
        if (shouldUseEnterprise) {
          await enterpriseSettings.prefetchSettings();
        } else {
          await Promise.all([
            legacySettings.prefetchProfileSettings(userId),
            legacySettings.prefetchPrivacySettings(userId),
            legacySettings.prefetchNotificationSettings(userId)
          ]);
        }
      } catch (error) {
        handleError(error as Error, shouldUseEnterprise ? 'enterprise' : 'legacy');
      }
    }
  };

  // Migration control methods
  const switchToEnterprise = useCallback(() => {
    setShouldUseEnterprise(true);
    setMigrationState(prev => ({
      ...prev,
      isUsingEnterprise: true
    }));

    if (config.logMigrationEvents) {
      console.log('Settings Migration: Switched to enterprise implementation');
    }
  }, [config.logMigrationEvents]);

  const switchToLegacy = useCallback(() => {
    setShouldUseEnterprise(false);
    setMigrationState(prev => ({
      ...prev,
      isUsingEnterprise: false
    }));

    if (config.logMigrationEvents) {
      console.log('Settings Migration: Switched to legacy implementation');
    }
  }, [config.logMigrationEvents]);

  const clearMigrationErrors = useCallback(() => {
    setMigrationState(prev => ({
      ...prev,
      migrationErrors: []
    }));
  }, []);

  return {
    // Active implementation state and actions
    ...activeImplementation,
    ...enhancedActions,

    // Migration state and control
    migration: {
      ...migrationState,
      isUsingEnterprise: shouldUseEnterprise,
      switchToEnterprise,
      switchToLegacy,
      clearMigrationErrors
    },

    // Additional enterprise features (only available when using enterprise)
    ...(shouldUseEnterprise ? {
      loadAllSettings: enterpriseSettings.loadAllSettings,
      saveAllSettings: enterpriseSettings.saveAllSettings,
      resetChanges: enterpriseSettings.resetChanges,
      markAsChanged: enterpriseSettings.markAsChanged,
      hasUnsavedChanges: enterpriseSettings.hasUnsavedChanges,
      sharing: enterpriseSettings.sharing,
      mentions: enterpriseSettings.mentions,
      replies: enterpriseSettings.replies,
      blocking: enterpriseSettings.blocking
    } : {})
  };
};
