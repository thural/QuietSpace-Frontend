/**
 * Anchor Styled Component Interfaces
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";

/**
 * Anchor Styled Props
 */
export interface IAnchorStyledProps extends IBaseComponentProps, GenericWrapperWithRef {
  href?: string;
  target?: string;
  label?: string;
  theme?: any;
}

/**
 * Anchor Styled State
 */
export interface IAnchorStyledState extends IBaseComponentState {
  // No additional state needed for this component
}
