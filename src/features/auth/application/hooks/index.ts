/**
 * Auth Application Hooks Barrel Export.
 * 
 * Exports all hooks from the application layer.
 */

// Legacy Auth Hooks (for backward compatibility)
export { default as useJwtAuth } from './useJwtAuth';
export { default as useLoginForm } from './useLoginForm';
export { default as useSignupForm } from './useSignupForm';
export { default as useActivationForm } from './useActivationForm';
export { default as useSecurityMonitor } from './useSecurityMonitor';
export { default as useTimer } from './useTimer';

// Enterprise Auth Hooks (new - recommended for use)
export { default as useEnterpriseAuth } from './useEnterpriseAuth';
export { default as useEnterpriseAuthHook } from './useEnterpriseAuthHook';
export { useEnterpriseAuthWithSecurity } from './useEnterpriseAuthWithSecurity';

// Migration Hook (for gradual transition)
export { useAuthMigration, AuthMigrationUtils } from './useAuthMigration';

// Enterprise Services Hook
export { useAuthServices } from './useAuthServices';

// Re-export commonly used types and utilities
export type { LoginBody, SignupBody } from '@shared/types/auth.dto';
export type { AuthResponse, UserProfile, SecurityEvent } from '@features/auth/domain/entities/IAuthRepository';
