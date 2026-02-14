/**
 * Auth Status Component Interfaces
 */

import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * User interface for authentication user data
 */
export interface IAuthUser {
  userId: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
}

/**
 * Auth Status Props
 */
export interface IAuthStatusProps extends IBaseComponentProps {
  isAuthenticated: boolean;
  user?: IAuthUser | null;
  showUserId?: boolean;
  showRole?: boolean;
  showAvatar?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * Auth Status State
 */
export interface IAuthStatusState extends IBaseComponentState {
  isExpanded: boolean;
}
