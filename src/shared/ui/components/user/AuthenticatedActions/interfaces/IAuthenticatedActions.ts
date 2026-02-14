/**
 * Authenticated Actions Component Interfaces
 * 
 * Enterprise-grade interfaces for the AuthenticatedActions component
 * with comprehensive type definitions and documentation.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { IBaseComponentProps, IBaseComponentState } from '@shared/components/base/BaseClassComponent';

/**
 * Authenticated Actions Component Props
 * 
 * Defines the properties accepted by the AuthenticatedActions component.
 * Extends base component props with authentication-specific actions.
 */
export interface IAuthenticatedActionsProps extends IBaseComponentProps {
  /** Callback function to refresh authentication token */
  onRefreshToken?: () => void;

  /** Callback function to check current session validity */
  onCheckSession?: () => void;

  /** Callback function to perform logout action */
  onLogout?: () => void;

  /** Callback function to navigate to user profile */
  onProfile?: () => void;

  /** Callback function to navigate to settings */
  onSettings?: () => void;

  /** Visual variant of the component */
  variant?: 'default' | 'compact' | 'horizontal';

  /** Whether to show text labels alongside icons */
  showLabels?: boolean;

  /** Whether the component is disabled */
  disabled?: boolean;

  /** Additional CSS class name */
  className?: string;
}

/**
 * Authenticated Actions Component State
 * 
 * Defines the internal state management for the AuthenticatedActions component.
 * Tracks loading states and last performed action.
 */
export interface IAuthenticatedActionsState extends IBaseComponentState {
  /** Whether token refresh is in progress */
  isRefreshing: boolean;

  /** Whether session check is in progress */
  isCheckingSession: boolean;

  /** Whether logout action is in progress */
  isLoggingOut: boolean;

  /** The last action performed by the user */
  lastAction: string | null;
}
