/**
 * Profile Domain Layer Barrel Exports.
 * 
 * Provides a clean public API for the profile domain layer.
 * This barrel export consolidates all domain layer exports
 * for easy importing and clean dependency management.
 */

// Core entities
export type {
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity,
  ProfileAccessEntity,
  ProfileStateEntity,
  CompleteProfileEntity
} from "./entities";

// Repository and service interfaces
export type {
  IProfileRepository,
  IProfileService
} from "./IProfileRepository";

// Business logic functions
export {
  isProfilePrivate,
  isUserVerified,
  hasCompleteProfile,
  getProfileCompletion,
  canAccessProfile,
  getAccessDeniedReason,
  getActiveConnections,
  getMutualConnections,
  calculateEngagementRate,
  getProfileStrength,
  createProfileAccess,
  createCompleteProfile
} from "./profileLogic";

export {
  ProfileMetricsService,
  ProfileAccessService,
  ProfileConnectionsService
} from "./services";
