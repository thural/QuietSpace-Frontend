/**
 * DefaultContainer Component Props Interface
 * 
 * Defines the contract for the DefaultContainer component which provides
 * enterprise-grade default container functionality with theme integration.
 * 
 * @interface IDefaultContainerProps
 */

import { ReactNode } from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { GenericWrapper } from '@shared-types/sharedComponentTypes';

/**
 * Props interface for DefaultContainer component
 */
export interface IDefaultContainerProps extends IBaseComponentProps, GenericWrapper {
  /** Child elements to render inside the container */
  children?: ReactNode;

  /** Maximum width of the container */
  size?: string;
}

/**
 * State interface for DefaultContainer component
 */
export interface IDefaultContainerState extends IBaseComponentState {
  // No additional state needed for this component
}
