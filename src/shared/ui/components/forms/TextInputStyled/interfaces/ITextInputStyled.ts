import { ChangeEvent } from 'react';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

/**
 * TextInputStyled component props interface
 */
export interface ITextInputStyledProps extends GenericWrapper {
  /** Input name attribute */
  name: string;
  /** Input value */
  value: string | number;
  /** Change handler function */
  handleChange: (value: string | number) => void;
  /** Input placeholder text */
  placeholder?: string;
  /** Maximum length allowed */
  maxLength?: string;
  /** Minimum length required */
  minLength?: string;
  /** Whether input should be hidden */
  hidden?: boolean;
  /** Whether to apply styling */
  isStyled?: boolean;
}

/**
 * TextInputStyled component state interface
 */
export interface ITextInputStyledState {
  /** Additional state if needed */
}
