/**
 * FormStyled Props Interface
 * 
 * Defines the contract for the FormStyled component which provides
 * enterprise-grade form container styling with theme integration.
 * 
 * @interface IFormStyledProps
 */

import { ReactNode } from 'react';
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";

/**
 * Props interface for FormStyled component
 */
export interface IFormStyledProps extends Omit<GenericWrapperWithRef, 'style'> {
  /** Child elements to render inside the form container */
  children?: ReactNode;
}
