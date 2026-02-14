import { ReactNode } from 'react';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

/**
 * InputBoxStyled component props interface
 */
export interface IInputBoxStyledProps extends GenericWrapper {
  /** Child elements to render inside the box */
  children?: ReactNode;
}

/**
 * InputBoxStyled component state interface
 */
export interface IInputBoxStyledState {
  /** Additional state if needed */
}
