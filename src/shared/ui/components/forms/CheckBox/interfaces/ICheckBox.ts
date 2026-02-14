import { ChangeEvent } from 'react';
import { ResId } from '@/shared/api/models/commonNative';

/**
 * CheckBox component props interface
 */
export interface ICheckBoxProps {
  /** The value to be returned when checked */
  value: ResId;
  /** Change event handler */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Size variant of the checkbox */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Whether the checkbox is in error state */
  error?: boolean;
  /** Theme object for styling */
  theme?: any;
}

/**
 * CheckBox component state interface
 */
export interface ICheckBoxState {
  /** Internal checked state */
  checked: boolean;
  /** Whether the component is focused */
  isFocused: boolean;
}
