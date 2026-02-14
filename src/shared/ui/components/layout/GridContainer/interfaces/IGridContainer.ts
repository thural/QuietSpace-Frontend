/**
 * GridContainer Component Interface
 * 
 * Defines the contract for the GridContainer component with enterprise-grade
 * layout functionality including responsive grid design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { BaseComponentProps } from '../../../types';

/**
 * GridContainer component props interface
 */
export interface IGridContainerProps extends BaseComponentProps {
  /** Number of columns in the grid */
  columns?: number;
  /** Gap between grid items */
  gap?: string;
  /** Children to render */
  children?: ReactNode;
}
