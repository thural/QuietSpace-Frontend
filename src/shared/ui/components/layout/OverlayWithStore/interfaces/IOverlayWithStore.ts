/**
 * OverlayWithStore Component Interfaces
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ReactNode } from 'react';

/**
 * OverlayWithStore Props
 */
export interface IOverlayWithStoreProps extends IBaseComponentProps {
  closable?: Object;
  children?: ReactNode;
}

/**
 * OverlayWithStore State
 */
export interface IOverlayWithStoreState extends IBaseComponentState {
  active: boolean;
}
