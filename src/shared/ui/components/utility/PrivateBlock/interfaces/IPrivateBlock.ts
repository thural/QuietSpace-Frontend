/**
 * PrivateBlock Component Props Interface
 * 
 * Defines the contract for the PrivateBlock component which provides
 * enterprise-grade private content blocking with theme integration.
 * 
 * @interface IPrivateBlockProps
 */

import { ReactNode, ComponentType } from 'react';
import { TypographyProps } from "@/shared/Typography";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

/**
 * Props interface for PrivateBlock component
 */
export interface IPrivateBlockProps extends TypographyProps, GenericWrapper {
  /** Message to display in the private block */
  message: string;
  
  /** Optional icon component to display alongside message */
  Icon?: ComponentType<any>;
  
  /** Additional child elements to render */
  children?: ReactNode;
}
