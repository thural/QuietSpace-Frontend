/**
 * ComponentList Component Props Interface
 * 
 * Defines the contract for the ComponentList component which provides
 * enterprise-grade list rendering functionality with theme integration.
 * 
 * @interface IComponentListProps
 */

import { ReactNode, ComponentType } from 'react';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

/**
 * Props interface for ComponentList component
 */
export interface IComponentListProps extends GenericWrapper {
  /** Component type to render for each list item */
  Component: ComponentType<any>;
  
  /** Array of objects containing data for each list item */
  list: Array<Object>;
}
