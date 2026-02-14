/**
 * DefaultContainer Component Props Interface
 * 
 * Defines the contract for the DefaultContainer component which provides
 * enterprise-grade default container functionality with theme integration.
 * 
 * @interface IDefaultContainerProps
 */

import { ReactNode } from 'react';
import { GenericWrapper } from '@shared-types/sharedComponentTypes';

/**
 * Props interface for DefaultContainer component
 */
export interface IDefaultContainerProps extends GenericWrapper {
  /** Child elements to render inside the container */
  children?: ReactNode;
  
  /** Maximum width of the container */
  size?: string;
}
