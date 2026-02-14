/**
 * Settings Services Hook
 * 
 * Provides access to settings services through dependency injection
 * Follows enterprise patterns for service access
 */

import { TYPES } from '@/core/modules/dependency-injection/types';
import { useDIContainer } from '@/core/hooks/ui/dependency-injection';
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
