/**
 * Settings Services Hook
 * 
 * Provides access to settings services through dependency injection
 * Follows enterprise patterns for service access
 */

import { useDIContainer } from '@/core/di';
import { TYPES } from '@/core/di/types';
import type { SettingsDataService } from '../services/SettingsDataService';
import type { SettingsFeatureService } from '../services/SettingsFeatureService';
import type { ISettingsRepository } from '../domain/entities/SettingsRepository';

/**
 * Settings Services Hook
 * 
 * Provides access to all settings services through the enterprise DI container
 */
export const useSettingsServices = () => {
  const container = useDIContainer();
  
  return {
    settingsDataService: container.get<SettingsDataService>(TYPES.SETTINGS_DATA_SERVICE),
    settingsFeatureService: container.get<SettingsFeatureService>(TYPES.SETTINGS_FEATURE_SERVICE),
    settingsRepository: container.get<ISettingsRepository>(TYPES.SETTINGS_REPOSITORY)
  };
};

/**
 * Legacy Settings DI Hook.
 * 
 * Maintained for backward compatibility during migration
 * @deprecated Use useSettingsServices instead
 */
export const useSettingsDI = () => {
  console.warn('useSettingsDI is deprecated. Use useSettingsServices instead.');
  return useSettingsServices();
};

/**
 * Hook to get settings repository from DI container.
 * @deprecated Use useSettingsServices instead
 */
export const useSettingsRepository = () => {
  console.warn('useSettingsRepository is deprecated. Use useSettingsServices instead.');
  const { settingsRepository } = useSettingsServices();
  return settingsRepository;
};

/**
 * Hook to get settings service from DI container.
 * @deprecated Use useSettingsServices instead
 */
export const useSettingsService = () => {
  console.warn('useSettingsService is deprecated. Use useSettingsServices instead.');
  const { settingsFeatureService } = useSettingsServices();
  return settingsFeatureService;
};
