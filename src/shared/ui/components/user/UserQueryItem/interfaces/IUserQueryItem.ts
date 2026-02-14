/**
 * User Query Item Component Interfaces
 * 
 * Enterprise-grade interfaces for UserQueryItem component
 * with comprehensive type definitions and documentation.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { IBaseComponentProps } from '@/shared/components/base/BaseClassComponent';
import { UserResponse } from '@/features/profile/data/models/user';
import { MouseEventFn } from '@/shared/types/genericTypes';
import { UserProfileResponse } from '@/features/profile/data/models/user';

/**
 * User Query Item Component State
 */
export interface IUserQueryItemState {
  /** Currently signed-in user */
  signedUser?: UserProfileResponse;
}

/**
 * User Query Item Component Props
 * 
 * Defines the properties accepted by the UserQueryItem component.
 * Extends base component with user-specific properties.
 */
export interface IUserQueryItemProps extends IBaseComponentProps {
  /** User data to be displayed in the item */
  data: UserResponse;

  /** Whether to display the follow toggle button */
  hasFollowToggle?: boolean;

  /** Optional function to handle item click events */
  handleItemClick?: MouseEventFn;

  /** Optional children to render alongside the user info */
  children?: ReactNode;
}
