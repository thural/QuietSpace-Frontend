/**
 * Settings Application Barrel Export.
 * 
 * Exports all application services and hooks.
 */

// Application services
export { SettingsService, type ISettingsService } from './services/SettingsService';
export { ReactQuerySettingsService, type IReactQuerySettingsService } from './services/ReactQuerySettingsService';

// Application hooks
export { useSettings } from './hooks/useSettings';
export { useReactQuerySettings } from './hooks/useReactQuerySettings';
export type { SettingsState, SettingsActions } from './hooks/useSettings';
export type { ReactQuerySettingsState, ReactQuerySettingsActions } from './hooks/useReactQuerySettings';

// Profile settings hook
export { default as useProfileSettings } from './hooks/useProfileSettings';
