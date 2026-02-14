/**
 * BaseCard Component Props Interface
 * 
 * Defines the contract for the BaseCard component which provides
 * enterprise-grade card container functionality with theme integration.
 * 
 * @interface IBaseCardProps
 */

import { ReactNode } from 'react';
import { GenericWrapper } from '@shared-types/sharedComponentTypes';

/**
 * Props interface for BaseCard component
 */
export interface IBaseCardProps extends GenericWrapper {
  /** Child elements to render inside the card */
  children?: ReactNode;
}
