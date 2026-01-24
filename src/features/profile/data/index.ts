/**
 * Profile Data Layer Barrel Exports.
 * 
 * Provides a clean public API for the profile data layer.
 * This barrel export consolidates all data layer exports
 * for easy importing and clean dependency management.
 */

// Repository implementations
export { ProfileRepository } from "./ProfileRepository";
export { MockProfileRepository } from "./MockProfileRepository";

// Data services (Enterprise)
export { ProfileDataService } from './services/ProfileDataService';

// Cache exports (Enterprise)
export { PROFILE_CACHE_KEYS, PROFILE_CACHE_TTL, PROFILE_CACHE_INVALIDATION, ProfileCacheUtils } from './cache/ProfileCacheKeys';

// Types and interfaces (Enterprise)
export type { 
  IProfileRepository,
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity,
  ProfileAccessEntity,
  UserProfileQuery,
  UserConnectionQuery,
  UserActivityQuery,
  UserSearchQuery,
  UserSuggestionQuery,
  UserSettingsData,
  UserPrivacyData,
  UserActivityData,
  UserAchievementData,
  UserBadgeData,
  UserReputationData,
  UserEngagementData,
  UserOnlineStatusData,
  ProfileViewData,
  ProfileCompletionData,
  UserVerificationData,
  ProfileAnalyticsData,
  UserSocialLinkData,
  UserInterestData,
  UserSkillData,
  UserEducationData,
  UserWorkExperienceData,
  PortfolioItemData,
  TestimonialData,
  RecommendationData
} from '../domain/entities/IProfileRepository';

// Factory and convenience functions
export {
  ProfileRepositoryFactory,
  createProfileRepository,
  createMockProfileRepository,
  getProfileRepositoryFactory
} from "./ProfileRepositoryFactory";

// Data hooks
export {
  useProfileData,
  useProfileDataWithRepository,
  useCurrentProfileData
} from "./useProfileData";

export { useProfileDataEnhanced, type ProfileRepositoryConfig } from "./hooks";

export * as ProfileMappers from "./mappers";

export * as ProfileRepositories from "./repositories";

export { ReactiveProfileRepository, type ProfileExternalData } from "./ReactiveProfileRepository";

// Public API - Cross-feature data hooks
export * from './useUserData';

// Legacy exports (for backward compatibility)
export { UserProfileEntity as UserProfileEntityLegacy } from '../domain/entities';
