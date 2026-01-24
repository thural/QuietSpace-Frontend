/**
 * Settings Hooks Index
 * 
 * Exports all settings hooks with proper organization
 * Enterprise hooks are prioritized over legacy implementations
 */

// Enterprise hooks (recommended)
export { useEnterpriseSettings } from './useEnterpriseSettings';
export type { EnterpriseSettingsState, EnterpriseSettingsActions } from './useEnterpriseSettings';

// Migration hook (for gradual transition)
export { useSettingsMigration } from './useSettingsMigration';
export type { SettingsMigrationConfig, SettingsMigrationState } from './useSettingsMigration';

// Legacy hooks (deprecated, maintained for backward compatibility)
export { useReactQuerySettings } from './useReactQuerySettings';
export type { ReactQuerySettingsState, ReactQuerySettingsActions } from './useReactQuerySettings';

// Other existing hooks
export { useSettings } from './useSettings';
export { useProfileSettings } from './useProfileSettings';

// Recommended usage:
// import { useEnterpriseSettings } from '@features/settings/application/hooks';
// For migration: import { useSettingsMigration } from '@features/settings/application/hooks';
