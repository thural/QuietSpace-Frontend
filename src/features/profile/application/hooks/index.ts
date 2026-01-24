/**
 * Profile Hooks Barrel Export.
 * 
 * Exports all hooks from the application layer.
 */

// Legacy Profile Hooks (for backward compatibility)
export { default as useProfile } from './useProfile';
export { default as useProfileConnections } from './useProfileConnections';
export { default as useProfileSettings } from './useProfileSettings';
export { default as useUserConnection } from './useUserConnection';
export { default as useUserProfile } from './useUserProfile';
export { default as useProfileDI } from '../services/ProfileServiceDI';

// Enterprise Profile Hooks (new - recommended for use)
export { useEnterpriseProfile } from './useEnterpriseProfile';

// Migration Hook (for gradual transition)
export { useProfileMigration, ProfileMigrationUtils } from './useProfileMigration';

// Enterprise Services Hook
export { useProfileServices } from './useProfileServices';

// Re-export commonly used types and utilities
export type { 
  UserProfileEntity, 
  UserProfileStatsEntity, 
  UserConnectionEntity,
  ProfileAccessEntity 
} from '@features/profile/domain/entities/IProfileRepository';
export type { JwtToken } from '@/shared/api/models/common';
