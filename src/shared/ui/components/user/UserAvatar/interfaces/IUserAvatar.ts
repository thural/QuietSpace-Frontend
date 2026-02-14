/**
 * UserAvatar Component Interface
 * 
 * Defines contract for UserAvatar component with enterprise-grade
 * avatar functionality including size variants, colors, and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';

/**
 * UserAvatar component props interface
 */
export interface IUserAvatarProps extends BaseComponentProps {
  /** Avatar size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Avatar background color */
  color?: string;
  /** Avatar border radius style */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full' | 'round';
  /** Avatar image source URL */
  src?: string;
  /** Avatar fallback text/initials */
  chars?: string;
  /** Forwarded ref for component composition */
  forwardedRef?: any;
}
