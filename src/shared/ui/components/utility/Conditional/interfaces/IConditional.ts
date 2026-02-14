/**
 * Conditional Component Props Interface
 * 
 * Defines the contract for the Conditional component which provides
 * enterprise-grade conditional rendering functionality.
 * 
 * @interface IConditionalProps
 */

import { ReactNode } from 'react';

/**
 * Props interface for Conditional component
 */
export interface IConditionalProps {
  /** Whether to render the children */
  isEnabled: boolean;
  
  /** Child elements to conditionally render */
  children: ReactNode;
}
