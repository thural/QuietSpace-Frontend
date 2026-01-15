/**
 * Profile Application Layer Barrel Exports.
 * 
 * Provides a clean public API for the profile application layer.
 * This barrel export consolidates all application layer exports
 * for easy importing and clean dependency management.
 */

// Enhanced hooks with repository pattern support
export { 
  useProfile, 
  useProfileEnhanced, 
  useProfileEnhancedWithState,
  useProfileAdvanced,
  type ProfileConfig
} from "./useProfile";
