/**
 * SearchBar Component Interfaces
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ReactNode } from 'react';

/**
 * Search bar component props interface
 */
export interface ISearchBarProps extends IBaseComponentProps {
  /** Search input placeholder */
  placeholder?: string;
  /** Current search value */
  value?: string;
  /** Search input change handler */
  onChange?: (value: string) => void;
  /** Search submit handler */
  onSearch?: (value: string) => void;
  /** Clear search handler */
  onClear?: () => void;
  /** Whether to show clear button */
  showClear?: boolean;
  /** Whether to show search icon */
  showIcon?: boolean;
  /** Whether to show microphone button */
  showMicrophone?: boolean;
  /** Microphone click handler */
  onMicrophone?: () => void;
  /** Search variant */
  variant?: 'default' | 'secondary' | 'minimal';
  /** Search size */
  size?: 'small' | 'medium' | 'large';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
}

/**
 * Search bar component state interface
 */
export interface ISearchBarState extends IBaseComponentState {
  isFocused: boolean;
  internalValue: string;
  isListening: boolean;
}
