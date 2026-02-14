/**
 * CloseButtonStyled Props Interface
 * 
 * Defines the contract for the CloseButtonStyled component which provides
 * enterprise-grade close button functionality with theme integration.
 * 
 * @interface ICloseButtonStyledProps
 */

import { ConsumerFn } from "@/shared/types/genericTypes";

/**
 * Props interface for CloseButtonStyled component
 */
export interface ICloseButtonStyledProps {
  /** Function to handle close button click */
  handleToggle: ConsumerFn;
  
  /** Additional CSS class name */
  className?: string;
  
  /** Whether the close button is disabled */
  disabled?: boolean;
  
  /** Visual variant of the close button */
  variant?: 'default' | 'primary' | 'danger';
}
