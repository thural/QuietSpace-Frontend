/**
 * Profile Presentation Layer Barrel Exports.
 * 
 * Provides a clean public API for the profile presentation layer.
 * This barrel export consolidates all presentation layer exports
 * for easy importing and clean dependency management.
 */

// Enhanced components with new architecture
export { default as EnhancedProfileContainer } from "./EnhancedProfileContainer";

// Legacy components for backward compatibility
export { default as ProfileContainer } from "../ProfileContainer";
