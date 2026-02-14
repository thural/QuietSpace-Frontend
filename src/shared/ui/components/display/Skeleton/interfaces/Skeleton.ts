/**
 * Skeleton Component Interfaces
 * 
 * Type definitions for the Skeleton component with loading states.
 */

import { BaseComponentProps } from "../../../types";
import { ComponentSize } from "../../../types";

export interface ISkeletonProps extends Omit<BaseComponentProps, 'ref' | 'id'> {
  width?: string | number;
  height?: string | number;
  radius?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  size?: ComponentSize;
  visible?: boolean;
  ref?: React.RefObject<HTMLDivElement>;
  id?: string;
  theme?: any;
}
