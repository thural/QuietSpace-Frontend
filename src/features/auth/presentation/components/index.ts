import React from 'react';
import { AuthPerformanceMonitor } from './AuthPerformanceMonitor';

/**
 * Auth Components Barrel Export
 * 
 * Exports all auth presentation components including:
 * - Performance monitoring
 * - Session timeout management
 * - Security analytics
 * - Multi-factor authentication (MFA)
 */

// Performance Monitoring
export { AuthPerformanceMonitor } from './AuthPerformanceMonitor';
export { default } from './AuthPerformanceMonitor';

// Security Analytics
export { SecurityMonitor } from './SecurityMonitor';
export { default as SecurityAnalyticsExample } from './SecurityAnalyticsExample';

// Session Timeout Management
export { SessionTimeoutManager, createSessionTimeoutManager } from '@core/auth/services/SessionTimeoutManager';
export type {
  SessionTimeoutConfig,
  SessionTimeoutState,
  SessionTimeoutEvents,
  SessionTimeoutMetrics
} from '@core/auth/services/SessionTimeoutManager';

export { useSessionTimeout, useSessionTimeoutUI, useSessionTimeoutAnalytics } from '@features/auth/application/hooks/useSessionTimeout';
export type {
  UseSessionTimeoutOptions,
  UseSessionTimeoutReturn
} from '@features/auth/application/hooks/useSessionTimeout';

export {
  SessionTimeoutWarning,
  SessionTimeoutFinalWarning,
  SessionTimeoutExpired,
  SessionTimeoutIndicator
} from '@features/auth/presentation/components/SessionTimeoutModals';

export {
  SessionTimeoutProvider,
  useSessionTimeoutContext,
  useSessionTimeoutSimple,
  useSessionTimeoutAnalyticsData,
  SessionTimeoutGuard,
  SessionTimeoutStatus,
  SessionTimeoutDebugPanel
} from '@features/auth/presentation/components/SessionTimeoutProvider';

export type {
  SessionTimeoutProviderProps,
  SessionTimeoutContextValue,
  SessionTimeoutGuardProps,
  SessionTimeoutStatusProps
} from '@features/auth/presentation/components/SessionTimeoutProvider';

export { default as SessionTimeoutExample } from '@features/auth/presentation/components/SessionTimeoutExample';

// Multi-Factor Authentication (MFA)
export { MFAService, createMFAService } from '@core/auth/services/MFAService';
export type {
  MFAConfig,
  MFAEnrollment,
  MFAVerification,
  MFAChallenge,
  MFAMethod,
  TOTPEnrollmentData,
  SMSEnrollmentData,
  BackupCodesEnrollmentData,
  BiometricEnrollmentData,
  SecurityKeyEnrollmentData,
  EmailEnrollmentData
} from '@core/auth/services/MFAService';

export { useMFA, useMFAEnrollment, useMFAVerification, useMFAAnalytics } from '@features/auth/application/hooks/useMFA';
export type {
  UseMFAOptions,
  UseMFAReturn
} from '@features/auth/application/hooks/useMFA';

export { default as MFAEnrollment } from '@features/auth/presentation/components/MFAEnrollment';
export { default as MFAVerification, MFAManagement } from '@features/auth/presentation/components/MFAVerification';
export { default as MFAExample } from '@features/auth/presentation/components/MFAExample';

/**
 * Quick Start Guide
 * 
 * Basic Session Timeout Usage:
 * ```tsx
 * import { SessionTimeoutProvider } from '@features/auth/presentation/components';
 * 
 * function App() {
 *   return (
 *     <SessionTimeoutProvider>
 *       <YourApp />
 *     </SessionTimeoutProvider>
 *   );
 * }
 * ```
 * 
 * Security Analytics Usage:
 * ```tsx
 * import { SecurityMonitor } from '@features/auth/presentation/components';
 * 
 * function SecurityDashboard() {
 *   return <SecurityMonitor userId="user-123" />;
 * }
 * ```
 * 
 * MFA Enrollment Usage:
 * ```tsx
 * import { MFAEnrollment } from '@features/auth/presentation/components';
 * 
 * function SecuritySettings() {
 *   return <MFAEnrollment userId="user-123" />;
 * }
 * ```
 * 
 * MFA Verification Usage:
 * ```tsx
 * import { MFAVerification } from '@features/auth/presentation/components';
 * 
 * function LoginWithMFA() {
 *   const handleVerification = (success) => {
 *     if (success) {
 *       // Proceed with login
 *     }
 *   };
 * 
 *   return (
 *     <MFAVerification
 *       userId="user-123"
 *       onVerificationComplete={handleVerification}
 *     />
 *   );
 * }
 * ```
 */
