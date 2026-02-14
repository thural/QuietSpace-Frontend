/**
 * Loading Overlay Component Interfaces
 * 
 * Type definitions for the Loading Overlay component with overlay and loading states.
 */

import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Loading Overlay Props
 */
export interface ILoadingOverlayProps extends IBaseComponentProps {
  visible?: boolean;
  size?: string;
  color?: string;
  message?: string;
  blur?: number;
  overlayColor?: string;
  backgroundColor?: string;
  radius?: string;
  showSpinner?: boolean;
  showContent?: boolean;
  timeout?: number;
  onTimeout?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Loading Overlay State
 */
export interface ILoadingOverlayState extends IBaseComponentState {
  isVisible: boolean;
}
