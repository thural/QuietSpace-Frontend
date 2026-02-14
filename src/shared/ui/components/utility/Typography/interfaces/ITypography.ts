/**
 * Typography Component Props Interface
 * 
 * Defines the contract for the Typography component which provides
 * enterprise-grade typography rendering with theme integration.
 * 
 * @interface ITypographyProps
 */

import { ReactNode } from 'react';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

/**
 * Heading size type for Typography component
 */
export type headingSize = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "small";

/**
 * Props interface for Typography component
 */
export interface ITypographyProps extends Omit<GenericWrapper, 'children'> {
  /** Type of typography element to render */
  type?: headingSize;
  
  /** Child elements to render */
  children?: ReactNode;
}
