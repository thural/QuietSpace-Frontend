/**
 * SegmentedControl Component Interface
 * 
 * Defines the contract for the SegmentedControl component with enterprise-grade
 * navigation functionality including variants, animations, and accessibility.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { BaseComponentProps } from '../../../types';

/**
 * Individual segmented control item interface
 */
export interface ISegmentedControlItem {
  /** Unique identifier for the segment */
  value: string;
  /** Display label for the segment */
  label: string;
  /** Whether the segment is disabled */
  disabled?: boolean;
}

/**
 * SegmentedControl component props interface
 */
export interface ISegmentedControlProps extends BaseComponentProps {
  /** Array of segment options */
  data: ISegmentedControlItem[];
  /** Current selected value (controlled mode) */
  value?: string;
  /** Default selected value (uncontrolled mode) */
  defaultValue?: string;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Theme color for active segments */
  color?: string;
  /** Component size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether the control should take full width */
  fullWidth?: boolean;
  /** Whether the entire control is disabled */
  disabled?: boolean;
}

/**
 * SegmentedControl component internal state interface
 */
export interface ISegmentedControlState {
  /** Internal selected value for uncontrolled mode */
  internalValue: string;
}
