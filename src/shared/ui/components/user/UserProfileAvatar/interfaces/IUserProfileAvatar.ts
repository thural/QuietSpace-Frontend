/**
 * User Profile Avatar Component Interfaces
 * 
 * Enterprise-grade interfaces for UserProfileAvatar component
 * with comprehensive type definitions and documentation.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * User Status type for online presence indicators
 */
export type UserStatusType = 'online' | 'offline' | 'away' | 'busy' | 'invisible';

/**
 * User Profile Avatar Component Props
 * 
 * Defines the properties accepted by the UserProfileAvatar component.
 * Extends base component props with avatar-specific properties.
 */
export interface IUserProfileAvatarProps extends IBaseComponentProps {
  /** Image source for the avatar */
  src?: string;

  /** Alt text for accessibility */
  alt?: string;

  /** Display name for the user */
  name?: string;

  /** Username/handle for the user */
  username?: string;

  /** Online status of the user */
  status?: UserStatusType;

  /** Size of the avatar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string | number;

  /** Whether to show status indicator */
  showStatus?: boolean;

  /** Whether to show display name */
  showName?: boolean;

  /** Whether to show username */
  showUsername?: boolean;

  /** Whether the avatar is clickable */
  clickable?: boolean;

  /** Click handler for interactions */
  onClick?: () => void;

  /** Additional CSS class name */
  className?: string;

  /** Fallback text when image fails */
  fallback?: string;

  /** Position of status indicator */
  statusPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  /** Shape of the avatar */
  shape?: 'circle' | 'square' | 'rounded';

  /** Custom size in pixels (overrides size prop) */
  customSize?: string;

  /** Custom background color */
  backgroundColor?: string;

  /** Custom text color */
  textColor?: string;

  /** Border radius for custom shapes */
  radius?: string;

  /** Children content (for compatibility) */
  children?: React.ReactNode;

  /** Whether to use theme colors (default: true) */
  useTheme?: boolean;
}

/**
 * User Profile Avatar Component State
 * 
 * Defines the internal state management for UserProfileAvatar component.
 * Tracks image loading errors and hover states.
 */
export interface IUserProfileAvatarState extends IBaseComponentState {
  /** Whether the image failed to load */
  imageError: boolean;

  /** Whether the avatar is currently hovered */
  isHovered: boolean;
}
