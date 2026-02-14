/**
 * Container Component Interface
 * 
 * Defines the contract for the Container component with enterprise-grade
 * layout functionality including variants, spacing, and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode, RefObject } from 'react';
import { LayoutProps, ComponentSize } from '../../../types';

/**
 * Container component props interface
 */
export interface IContainerProps extends LayoutProps {
  /** Container variant for different layout behaviors */
  variant?: 'default' | 'centered' | 'fluid' | 'constrained';
  /** Container size for responsive design */
  size?: ComponentSize;
  /** Container padding */
  padding?: ComponentSize | string;
  /** Container margin */
  margin?: ComponentSize | string;
  /** Ref forwarded to container element */
  ref?: RefObject<HTMLDivElement>;
  /** Maximum width for constrained variant */
  maxWidth?: string;
  /** Minimum width */
  minWidth?: string;
  /** Full height */
  fullHeight?: boolean;
  /** Vertical alignment */
  verticalAlign?: 'top' | 'center' | 'bottom' | 'stretch';
  /** Horizontal alignment */
  horizontalAlign?: 'left' | 'center' | 'right' | 'stretch';
  /** Enable overflow handling */
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  /** Background color */
  backgroundColor?: string;
  /** Border radius */
  borderRadius?: string;
  /** Box shadow */
  boxShadow?: string;
  /** Custom CSS class */
  containerClassName?: string;
}
