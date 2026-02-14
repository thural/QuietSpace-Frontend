/**
 * BoxStyled Component Props Interface
 * 
 * Defines the contract for the BoxStyled component which provides
 * enterprise-grade box container functionality with theme integration.
 * 
 * @interface IBoxStyledProps
 */

import { ReactNode } from 'react';
import { GenericWrapperWithRef } from '@shared-types/sharedComponentTypes';

/**
 * Props interface for BoxStyled component
 */
export interface IBoxStyledProps extends GenericWrapperWithRef {
  /** Child elements to render inside the box */
  children?: ReactNode;
}
