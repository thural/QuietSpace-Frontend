/**
 * InputStyled Component Interfaces
 * 
 * Type definitions for the InputStyled component with enhanced styling.
 */

import { GenericWrapperWithRef, ComponentSize } from "../../../types";

export interface IInputStyledProps extends GenericWrapperWithRef {
  isStyled?: boolean;
  placeholder?: string;
  onFocus?: (event: React.FocusEvent) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent) => void;
  variant?: 'default' | 'outlined' | 'filled';
  size?: ComponentSize;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  id?: string; // Restrict id to string only for HTML input compatibility
}
