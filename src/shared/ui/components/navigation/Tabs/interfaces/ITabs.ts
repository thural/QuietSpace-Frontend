/**
 * Tabs Component Interface
 * 
 * Defines the contract for the Tabs component with enterprise-grade
 * navigation functionality including variants, animations, and accessibility.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { BaseComponentProps } from '../../../types';

/**
 * Individual tab item props interface
 */
export interface ITabProps {
  /** Unique identifier for the tab */
  value: string;
  /** Tab label content */
  label?: ReactNode;
  /** Left section content (icon, etc.) */
  leftSection?: ReactNode;
  /** Right section content (badge, etc.) */
  rightSection?: ReactNode;
  /** Whether the tab is disabled */
  disabled?: boolean;
}

/**
 * Tabs list container props interface
 */
export interface ITabsListProps {
  /** Tab items to render */
  children: ReactNode;
  /** Horizontal alignment of tabs */
  justify?: 'center' | 'start' | 'end';
  /** Whether tabs should grow to fill available space */
  grow?: boolean;
}

/**
 * Tab panel content props interface
 */
export interface ITabPanelProps {
  /** Value that corresponds to an active tab */
  value: string;
  /** Panel content to display when tab is active */
  children: ReactNode;
}

/**
 * Main tabs component props interface
 */
export interface ITabsProps extends BaseComponentProps {
  /** Default active tab value (uncontrolled mode) */
  defaultValue?: string;
  /** Current active tab value (controlled mode) */
  value?: string;
  /** Callback when tab value changes */
  onValueChange?: (value: string) => void;
  /** Theme color for active tabs and indicators */
  color?: string;
  /** Horizontal alignment of tabs */
  justify?: 'center' | 'start' | 'end';
  /** Whether tabs should grow to fill available space */
  grow?: boolean;
  /** Tab items and panels */
  children: ReactNode;
}

/**
 * Tabs component internal state interface
 */
export interface ITabsState {
  /** Internal active tab value for uncontrolled mode */
  internalValue: string;
}
