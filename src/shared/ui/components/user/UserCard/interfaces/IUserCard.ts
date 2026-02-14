/**
 * UserCard Component Interface
 * 
 * Defines contract for UserCard component with enterprise-grade
 * user card functionality including avatar, details, and navigation.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';

/**
 * User data interface for card display
 */
export interface IUserCardData {
  /** User unique identifier */
  id: string;
  /** User display name */
  username: string;
  /** User email address */
  email?: string;
  /** User avatar URL */
  avatar?: string;
  /** User role/status */
  role?: string;
}

/**
 * UserCard component props interface
 */
export interface IUserCardProps extends BaseComponentProps {
  /** User data for the card */
  user?: IUserCardData;
  /** User ID for fetching user data */
  userId?: string;
  /** Whether to display user email */
  isDisplayEmail?: boolean;
  /** Whether to display user name */
  isDisplayName?: boolean;
  /** Whether to disable navigation on click */
  isIgnoreNavigation?: boolean;
  /** Additional children to render */
  children?: ReactNode;
}

/**
 * UserCard component internal state interface
 */
export interface IUserCardState {
  /** Loading state indicator */
  isLoading: boolean;
  /** User data object */
  user?: IUserCardData;
  /** Signed in user data */
  signedUser?: IUserCardData;
}
