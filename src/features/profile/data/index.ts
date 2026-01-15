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
