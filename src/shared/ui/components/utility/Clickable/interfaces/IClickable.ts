/**
 * Clickable Component Props Interface
 * 
 * Defines the contract for the Clickable component which provides
 * enterprise-grade clickable functionality with theme integration.
 * 
 * @interface IClickableProps
 */

import { ReactNode, MouseEventHandler } from 'react';
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import { IMenuListStyleProps } from "../ListMenu";

/**
 * Props interface for Clickable component
 */
export interface IClickableProps extends GenericWrapperWithRef {
  /** Click event handler */
  handleClick: MouseEventHandler<HTMLDivElement>;

  /** Optional style properties for customization */
  styleProps?: MenuListStyleProps;

  /** Alternative text for accessibility */
  altText?: string;

  /** Text content to display */
  text: string;

  /** Child elements to render */
  children?: ReactNode;
}
