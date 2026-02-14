/**
 * FollowToggle Component Props Interface
 * 
 * Defines the contract for the FollowToggle component which provides
 * enterprise-grade follow/unfollow functionality with theme integration.
 * 
 * @interface IFollowToggleProps
 */

import { ReactNode, ComponentType } from 'react';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { UserResponse } from "@/features/profile/data/models/user";

/**
 * Props interface for FollowToggle component
 */
export interface IFollowToggleProps extends GenericWrapper {
  /** User object containing follow status */
  user: UserResponse;
  
  /** Custom button component to use */
  Button?: ComponentType<any>;
}
