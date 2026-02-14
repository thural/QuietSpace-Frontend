/**
 * FlexStyled Component Interfaces
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import { ReactNode } from 'react';

/**
 * FlexStyled Props
 */
export interface IFlexStyledProps extends IBaseComponentProps, GenericWrapperWithRef {
  /** Child elements to render inside the flex container */
  children?: ReactNode;
}

/**
 * FlexStyled State
 */
export interface IFlexStyledState extends IBaseComponentState {
  // No additional state needed for this component
}
