/**
 * OverlayComponent Component Interfaces
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ReactNode } from 'react';

/**
 * OverlayComponent Props
 */
export interface IOverlayComponentProps extends IBaseComponentProps {
  show: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  backdrop?: boolean;
  closeable?: boolean;
}

/**
 * OverlayComponent State
 */
export interface IOverlayComponentState extends IBaseComponentState {
  // No additional state needed for this component
}
