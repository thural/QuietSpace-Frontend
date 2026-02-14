/**
 * Overlay Component Interface
 * 
 * Defines the contract for the Overlay component with enterprise-grade
 * overlay functionality including theme integration and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { IBaseComponentProps } from '@/shared/components/base/BaseClassComponent';
import { ConsumerFn } from '@/shared/types/genericTypes';

/**
 * Overlay component props interface
 */
export interface IOverlayProps extends IBaseComponentProps {
  /** Whether the overlay is open/visible */
  isOpen?: boolean;
  /** Optional function to handle overlay close events */
  onClose?: ConsumerFn;
  /** Optional children to render inside the overlay */
  children?: ReactNode;
}
