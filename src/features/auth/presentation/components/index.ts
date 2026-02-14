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
 * - Authentication guards and route protection
 */

// Performance Monitoring
export { AuthPerformanceMonitor } from './AuthPerformanceMonitor';
export { default } from './AuthPerformanceMonitor';

// Security Analytics
export { SecurityMonitor } from './SecurityMonitor';

// Authentication Guards
export {
  AuthGuard,
  ProtectedRoute,
  withAuth,
  useAuth,
  PermissionGate,
  EnterpriseRoutes
} from './guards';

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
