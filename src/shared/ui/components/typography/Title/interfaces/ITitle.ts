/**
 * Title Component Props Interface
 * 
 * Defines the contract for the Title component which provides
 * enterprise-grade heading typography with theme integration.
 * 
 * @interface ITitleProps
 */

import { ReactNode } from 'react';
import { TypographyProps } from '../../../types';

/**
 * Props interface for Title component
 */
export interface ITitleProps extends TypographyProps {
  /** Child elements to render as title content */
  children?: ReactNode;
}
