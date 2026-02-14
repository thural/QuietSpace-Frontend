/**
 * Text Component Props Interface
 * 
 * Defines the contract for the Text component which provides
 * enterprise-grade typography with theme integration.
 * 
 * @interface ITextProps
 */

import { ReactNode } from 'react';
import { TypographyProps } from '../../../types';

/**
 * Props interface for Text component
 */
export interface ITextProps extends TypographyProps {
  /** Child elements to render as text content */
  children?: ReactNode;
}
