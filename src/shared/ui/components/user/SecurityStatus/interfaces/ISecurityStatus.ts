/**
 * Security Status Component Interfaces
 * 
 * Enterprise-grade interfaces for SecurityStatus component
 * with comprehensive type definitions and documentation.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Security Status Component Props
 * 
 * Defines the properties accepted by the SecurityStatus component.
 * Extends base component props with security-specific properties.
 */
export interface ISecurityStatusProps extends IBaseComponentProps {
  /** Whether two-factor authentication is required */
  requiresTwoFactor: boolean;

  /** Whether the current device is trusted */
  deviceTrusted: boolean;

  /** Session expiry date/time */
  sessionExpiry: Date | null;

  /** Optional callback for trusting the device */
  onTrustDevice?: () => void;

  /** Whether to show session expiry information */
  showSessionExpiry?: boolean;

  /** Visual variant of the component */
  variant?: 'default' | 'compact' | 'detailed';

  /** Additional CSS class name */
  className?: string;
}

/**
 * Security Status Component State
 * 
 * Defines the internal state management for the SecurityStatus component.
 * Tracks session expiry countdown and expiration warnings.
 */
export interface ISecurityStatusState extends IBaseComponentState {
  /** Formatted time string until session expiry */
  timeUntilExpiry: string;

  /** Whether session is expiring soon (within 5 minutes) */
  isExpiringSoon: boolean;
}
