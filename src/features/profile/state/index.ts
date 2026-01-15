/**
 * Profile State Layer Barrel Exports.
 * 
 * Provides a clean public API for the profile state layer.
 * This barrel export consolidates all state layer exports
 * for easy importing and clean dependency management.
 */

// Zustand store and state management
export { useProfileStore } from "./ProfileStore";
export type { ProfileState, ProfileActions } from "./ProfileStore";

// State management hooks
export { 
  useProfileWithState,
  useRealTimeProfile
} from "./useProfileState";
export { useAdvancedProfileState } from "./useAdvancedProfileState";
