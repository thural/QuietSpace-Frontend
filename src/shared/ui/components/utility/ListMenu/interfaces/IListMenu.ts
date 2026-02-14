/**
 * ListMenu Props Interface
 * 
 * Defines the contract for the ListMenu component which provides
 * enterprise-grade dropdown menu functionality with theme integration.
 * 
 * @interface IListMenuProps
 */

import { ReactNode } from 'react';
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import { IMenuListStyleProps } from './IMenuListStyleProps';

/**
 * Props interface for ListMenu component
 */
export interface IListMenuProps extends GenericWrapperWithRef {
  /** Icon to display for the menu trigger */
  menuIcon: ReactNode;
  
  /** Optional style properties for menu customization */
  styleProps?: IMenuListStyleProps;
  
  /** Child elements to render inside the menu */
  children?: ReactNode;
}
