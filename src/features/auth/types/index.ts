/**
 * Auth Types Barrel Export.
 * 
 * Exports all authentication-related types for public consumption.
 */

// Note: UseAuthStoreProps removed as we're migrating to useFeatureAuth

// Form types
export type { AuthState, SetAuthState, AuthFormProps, SignupFormProps, ActivationFormProps } from './auth.ui.types';

// Enums
export { AuthPages } from './auth.ui.types';
