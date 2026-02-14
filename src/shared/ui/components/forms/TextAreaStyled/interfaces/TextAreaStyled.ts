/**
 * TextAreaStyled Component Interfaces
 * 
 * Type definitions for the TextAreaStyled component.
 */

import { GenericWrapper } from "@shared-types/sharedComponentTypes";

export interface TextAreaStyledProps extends GenericWrapper {
  name: string;
  value: string | number;
  handleChange: (value: string | number) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  hidden?: boolean;
  disabled?: boolean;
  error?: boolean;
  rows?: number;
  className?: string;
  theme?: any;
}
