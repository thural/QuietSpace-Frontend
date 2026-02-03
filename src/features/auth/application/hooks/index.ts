/**
 * Auth Application Hooks Barrel Export.
 * 
 * Exports all hooks from the application layer.
 */

// Enterprise Auth Hooks (recommended for use)
export { useLoginForm } from './useLoginForm';
export { useSignupForm } from './useSignupForm';
export { useActivationForm } from './useActivationForm';
export { useSecurityMonitor } from './useSecurityMonitor';
export { useTimer } from './useTimer';

// Enterprise Auth Hooks (new - recommended for use)
export { default as useEnterpriseAuthHook } from './useEnterpriseAuthHook';
export { useEnterpriseAuthWithSecurity } from './useEnterpriseAuthWithSecurity';

// Migration Hook (for gradual transition)
export { useAuthMigration, AuthMigrationUtils } from './useAuthMigration';

// Re-export commonly used types and utilities
export type { LoginBody, SignupBody } from '@shared/types/auth.dto';
export type { AuthResponse, UserProfile, SecurityEvent } from '@features/auth/domain/entities/IAuthRepository';
