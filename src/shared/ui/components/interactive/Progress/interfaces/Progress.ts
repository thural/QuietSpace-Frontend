/**
 * Progress Component Interfaces
 * 
 * Type definitions for the Progress component with various states.
 */

import { BaseComponentProps } from "../../../types";

export interface IProgressProps extends BaseComponentProps {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  striped?: boolean;
  animated?: boolean;
}
