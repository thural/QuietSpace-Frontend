/**
 * BoxStyled Component Props Interface
 * 
 * Defines the contract for the BoxStyled component which provides
 * enterprise-grade box container functionality with theme integration.
 * 
 * @interface IBoxStyledProps
 */

import { ReactNode } from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { GenericWrapperWithRef } from '@shared-types/sharedComponentTypes';

/**
 * Props interface for BoxStyled component
 */
export interface IBoxStyledProps extends IBaseComponentProps, GenericWrapperWithRef {
  /** Child elements to render inside the box */
  children?: ReactNode;
}

/**
 * State interface for BoxStyled component
 */
export interface IBoxStyledState extends IBaseComponentState {
  // No additional state needed for this component
}
