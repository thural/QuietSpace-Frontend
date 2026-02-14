/**
 * UserAvatarPhoto Component Interface
 * 
 * Defines contract for UserAvatarPhoto component with enterprise-grade
 * avatar photo functionality including data fetching and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';

/**
 * User data interface for avatar photo
 */
export interface IUserAvatarPhotoData {
  id: string;
  username: string;
  photo?: {
    type: string;
    data: string;
  };
}

/**
 * UserAvatarPhoto component props interface
 */
export interface IUserAvatarPhotoProps extends BaseComponentProps {
  /** User ID for fetching user data */
  userId: string;
  /** Avatar size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * UserAvatarPhoto component internal state interface
 */
export interface IUserAvatarPhotoState {
  /** User data object */
  user?: IUserAvatarPhotoData;
  /** Formatted photo data URL */
  photoData?: string | null;
  /** Username for avatar fallback */
  username: string;
}
