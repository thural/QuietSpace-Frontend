/**
 * Toast Component Interface
 * 
 * Defines the contract for the Toast notification component with
 * enterprise-grade features including positioning, auto-dismiss, and
 * comprehensive accessibility support.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';

/**
 * Toast item interface
 */
export interface IToastItem {
  /** Toast unique key */
  key: string;
  /** Toast type */
  type: 'success' | 'error' | 'warning' | 'info';
  /** Toast title */
  title?: string;
  /** Toast message */
  message: string;
  /** Toast duration in milliseconds */
  duration?: number;
  /** Show close button */
  closable?: boolean;
  /** Show progress bar */
  showProgress?: boolean;
  /** Toast icon */
  icon?: ReactNode;
  /** Custom render function */
  render?: (item: IToastItem) => ReactNode;
  /** Click handler */
  onClick?: (item: IToastItem) => void;
  /** Close handler */
  onClose?: (item: IToastItem) => void;
}

/**
 * Toast component props interface
 */
export interface IToastProps {
  /** Toast items */
  items?: IToastItem[];
  /** Container position */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  /** Maximum number of toasts to show */
  maxCount?: number;
  /** Component size */
  size?: 'small' | 'medium' | 'large';
  /** Component CSS class */
  className?: string;
  /** Component style */
  style?: React.CSSProperties;
  /** Auto-dismiss toasts */
  autoDismiss?: boolean;
  /** Default duration */
  defaultDuration?: number;
  /** Show icons */
  showIcons?: boolean;
  /** Enable sounds */
  enableSounds?: boolean;
  /** Pause on hover */
  pauseOnHover?: boolean;
  /** Click handler */
  onClick?: (item: IToastItem) => void;
  /** Toast add handler */
  onAdd?: (item: IToastItem) => void;
  /** Toast remove handler */
  onRemove?: (key: string) => void;
  /** Toast clear handler */
  onClear?: () => void;
}
