/**
 * CenterContainer Component Interface
 * 
 * Defines the contract for the CenterContainer component with enterprise-grade
 * layout functionality including theme integration and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';

/**
 * CenterContainer component props interface
 */
export interface ICenterContainerProps extends BaseComponentProps {
  /** Container variant for different layout behaviors */
  variant?: 'default' | 'fullscreen' | 'inline';
  /** Children to render */
  children?: ReactNode;
}
