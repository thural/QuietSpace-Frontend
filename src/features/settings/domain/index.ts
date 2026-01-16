/**
 * Settings Domain Barrel Export.
 * 
 * Exports all domain entities and interfaces.
 */

// Repository interfaces
export type { ISettingsRepository } from './entities/SettingsRepository';

// Domain entities
export type {
    SettingsQuery,
    SettingsFilters,
    SettingsResult,
    ProfileSettings,
    PrivacySettings,
    NotificationSettings,
    SharingSettings,
    MentionsSettings,
    RepliesSettings,
    BlockingSettings
} from './entities/SettingsEntities';
