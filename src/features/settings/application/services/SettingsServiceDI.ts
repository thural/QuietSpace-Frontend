import 'reflect-metadata';
import { useAuthStore } from '@services/store/zustand';
import * as React from 'react';
import { Injectable, Inject, useService } from '@core/di';

// Settings service interfaces
interface ISettingsService {
  getSettings(): Promise<UserSettings>;
  updateSettings(settings: Partial<UserSettings>): Promise<UserSettings>;
  resetToDefaults(): Promise<UserSettings>;
  exportSettings(): Promise<string>;
  importSettings(settingsJson: string): Promise<UserSettings>;
}

interface ISettingsRepository {
  find(): Promise<UserSettings | null>;
  save(settings: UserSettings): Promise<UserSettings>;
  update(updates: Partial<UserSettings>): Promise<UserSettings>;
  delete(): Promise<void>;
}

interface UserSettings {
  // Theme settings
  theme: 'light' | 'dark' | 'auto';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  
  // Privacy settings
  profileVisibility: 'public' | 'private' | 'friends';
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  showEmail: boolean;
  showPhone: boolean;
  
  // Notification settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  notificationSound: boolean;
  
  // Content settings
  contentLanguage: string;
  autoPlayVideos: boolean;
  showSensitiveContent: boolean;
  
  // Account settings
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  
  // Accessibility settings
  reduceMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  
  // Performance settings
  dataSaver: boolean;
  lowPowerMode: boolean;
  
  // Metadata
  lastUpdated: Date;
  version: string;
}

// Default settings
const DEFAULT_SETTINGS: UserSettings = {
  theme: 'auto',
  accentColor: '#007bff',
  fontSize: 'medium',
  
  profileVisibility: 'public',
  showOnlineStatus: true,
  allowDirectMessages: true,
  showEmail: false,
  showPhone: false,
  
  emailNotifications: true,
  pushNotifications: true,
  inAppNotifications: true,
  notificationSound: true,
  
  contentLanguage: 'en',
  autoPlayVideos: false,
  showSensitiveContent: false,
  
  twoFactorAuth: false,
  loginAlerts: true,
  sessionTimeout: 3600,
  
  reduceMotion: false,
  highContrast: false,
  screenReader: false,
  
  dataSaver: false,
  lowPowerMode: false,
  
  lastUpdated: new Date(),
  version: '1.0.0'
};

// Mock settings repository
@Injectable({ lifetime: 'singleton' })
export class SettingsRepository implements ISettingsRepository {
  private settings: UserSettings | null = null;

  async find(): Promise<UserSettings | null> {
    if (!this.settings) {
      // Simulate loading from storage
      await new Promise(resolve => setTimeout(resolve, 100));
      this.settings = { ...DEFAULT_SETTINGS };
    }
    return this.settings;
  }

  async save(settings: UserSettings): Promise<UserSettings> {
    this.settings = {
      ...settings,
      lastUpdated: new Date()
    };
    
    // Simulate saving to storage
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return this.settings;
  }

  async update(updates: Partial<UserSettings>): Promise<UserSettings> {
    const currentSettings = await this.find();
    if (!currentSettings) {
      throw new Error('No settings found');
    }
    
    const updatedSettings = {
      ...currentSettings,
      ...updates,
      lastUpdated: new Date()
    };
    
    return await this.save(updatedSettings);
  }

  async delete(): Promise<void> {
    this.settings = null;
    // Simulate clearing storage
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

// DI-enabled Settings Service
@Injectable({ lifetime: 'singleton' })
export class SettingsService implements ISettingsService {
  constructor(
    @Inject(SettingsRepository) private settingsRepository: ISettingsRepository
  ) {}

  async getSettings(): Promise<UserSettings> {
    const settings = await this.settingsRepository.find();
    if (!settings) {
      return await this.resetToDefaults();
    }
    return settings;
  }

  async updateSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
    return await this.settingsRepository.update(updates);
  }

  async resetToDefaults(): Promise<UserSettings> {
    return await this.settingsRepository.save({ ...DEFAULT_SETTINGS });
  }

  async exportSettings(): Promise<string> {
    const settings = await this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  async importSettings(settingsJson: string): Promise<UserSettings> {
    try {
      const importedSettings = JSON.parse(settingsJson);
      
      // Validate imported settings
      const validatedSettings: UserSettings = {
        ...DEFAULT_SETTINGS,
        ...importedSettings,
        lastUpdated: new Date(),
        version: '1.0.0'
      };
      
      return await this.settingsRepository.save(validatedSettings);
    } catch (error) {
      throw new Error('Invalid settings format');
    }
  }

  // Utility methods for specific settings categories
  async updateThemeSettings(theme: Partial<Pick<UserSettings, 'theme' | 'accentColor' | 'fontSize'>>): Promise<UserSettings> {
    return await this.updateSettings(theme);
  }

  async updatePrivacySettings(privacy: Partial<Pick<UserSettings, 'profileVisibility' | 'showOnlineStatus' | 'allowDirectMessages' | 'showEmail' | 'showPhone'>>): Promise<UserSettings> {
    return await this.updateSettings(privacy);
  }

  async updateNotificationSettings(notifications: Partial<Pick<UserSettings, 'emailNotifications' | 'pushNotifications' | 'inAppNotifications' | 'notificationSound'>>): Promise<UserSettings> {
    return await this.updateSettings(notifications);
  }

  async updateAccessibilitySettings(accessibility: Partial<Pick<UserSettings, 'reduceMotion' | 'highContrast' | 'screenReader'>>): Promise<UserSettings> {
    return await this.updateSettings(accessibility);
  }

  async updatePerformanceSettings(performance: Partial<Pick<UserSettings, 'dataSaver' | 'lowPowerMode'>>): Promise<UserSettings> {
    return await this.updateSettings(performance);
  }
}

// DI-enabled Settings Hook
export const useSettingsDI = () => {
  const settingsService = useService(SettingsService);
  const [settings, setSettings] = React.useState<UserSettings | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchSettings = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const settingsData = await settingsService.getSettings();
      setSettings(settingsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, [settingsService]);

  const updateSettings = React.useCallback(async (updates: Partial<UserSettings>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedSettings = await settingsService.updateSettings(updates);
      setSettings(updatedSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  }, [settingsService]);

  const resetToDefaults = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const defaultSettings = await settingsService.resetToDefaults();
      setSettings(defaultSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset settings');
    } finally {
      setLoading(false);
    }
  }, [settingsService]);

  const exportSettings = React.useCallback(async (): Promise<string | null> => {
    try {
      return await settingsService.exportSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export settings');
      return null;
    }
  }, [settingsService]);

  const importSettings = React.useCallback(async (settingsJson: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const importedSettings = await settingsService.importSettings(settingsJson);
      setSettings(importedSettings);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import settings');
      return false;
    } finally {
      setLoading(false);
    }
  }, [settingsService]);

  // Convenience methods for specific categories
  const updateThemeSettings = React.useCallback(async (theme: Partial<Pick<UserSettings, 'theme' | 'accentColor' | 'fontSize'>>) => {
    return await updateSettings(theme);
  }, [updateSettings]);

  const updatePrivacySettings = React.useCallback(async (privacy: Partial<Pick<UserSettings, 'profileVisibility' | 'showOnlineStatus' | 'allowDirectMessages' | 'showEmail' | 'showPhone'>>) => {
    return await updateSettings(privacy);
  }, [updateSettings]);

  const updateNotificationSettings = React.useCallback(async (notifications: Partial<Pick<UserSettings, 'emailNotifications' | 'pushNotifications' | 'inAppNotifications' | 'notificationSound'>>) => {
    return await updateSettings(notifications);
  }, [updateSettings]);

  const updateAccessibilitySettings = React.useCallback(async (accessibility: Partial<Pick<UserSettings, 'reduceMotion' | 'highContrast' | 'screenReader'>>) => {
    return await updateSettings(accessibility);
  }, [updateSettings]);

  const updatePerformanceSettings = React.useCallback(async (performance: Partial<Pick<UserSettings, 'dataSaver' | 'lowPowerMode'>>) => {
    return await updateSettings(performance);
  }, [updateSettings]);

  // Auto-fetch settings on mount
  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    resetToDefaults,
    exportSettings,
    importSettings,
    updateThemeSettings,
    updatePrivacySettings,
    updateNotificationSettings,
    updateAccessibilitySettings,
    updatePerformanceSettings
  };
};
