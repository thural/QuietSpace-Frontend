/**
 * BaseCard Component Props Interface
 * 
 * Defines the contract for the BaseCard component which provides
 * enterprise-grade card container functionality with theme integration.
 * 
 * @interface IBaseCardProps
 */

import { ReactNode } from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { GenericWrapper } from '@shared-types/sharedComponentTypes';

/**
 * Props interface for BaseCard component
 */
export interface IBaseCardProps extends IBaseComponentProps, GenericWrapper {
  /** Child elements to render inside the card */
  children?: ReactNode;
}

/**
 * State interface for BaseCard component
 */
export interface IBaseCardState extends IBaseComponentState {
  // No additional state needed for this component
}
