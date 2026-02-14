/**
 * LoaderStyled Component Interfaces
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ReactNode } from 'react';

/**
 * LoaderStyled Props
 */
export interface ILoaderStyledProps extends IBaseComponentProps {
  color?: string;
  size?: number | string;
  theme?: any;
}

/**
 * LoaderStyled State
 */
export interface ILoaderStyledState extends IBaseComponentState {
  // No additional state needed for this component
}
