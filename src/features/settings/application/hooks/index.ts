/**
 * Settings Hooks Index
 * 
 * Exports all settings hooks with proper organization
 * Enterprise hooks are prioritized over legacy implementations
 */

// Enterprise hooks (recommended)
export { useEnterpriseSettings } from './useEnterpriseSettings';
export type { EnterpriseSettingsState, EnterpriseSettingsActions } from './useEnterpriseSettings';

// Other existing hooks
export { useSettings } from './useSettings';

// Recommended usage:
// import { useEnterpriseSettings } from '@features/settings/application/hooks';
// For migration: import { useSettingsMigration } from '@features/settings/application/hooks';
