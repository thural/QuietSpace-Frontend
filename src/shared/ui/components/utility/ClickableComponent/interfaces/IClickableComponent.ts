/**
 * Clickable Component Props Interface
 * 
 * Defines the contract for the ClickableComponent which provides
 * enterprise-grade clickable functionality with variants and themes.
 * 
 * @interface IClickableComponentProps
 */

import { ReactNode, MouseEvent } from 'react';

/**
 * Props interface for ClickableComponent
 */
export interface IClickableComponentProps {
  /** Child elements to render inside the clickable container */
  children: ReactNode;
  
  /** Click event handler */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  
  /** Additional CSS class name */
  className?: string;
  
  /** Whether the clickable component is disabled */
  disabled?: boolean;
  
  /** Visual variant of the clickable component */
  variant?: 'default' | 'primary' | 'secondary';
  
  /** Custom font size */
  fontSize?: string;
  
  /** Custom font weight */
  fontWeight?: string;
  
  /** Custom padding */
  padding?: string;
  
  /** Custom height */
  height?: string;
}
