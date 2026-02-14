/**
 * FilterTabs Component Interface
 * 
 * Defines the contract for the FilterTabs component with enterprise-grade
 * navigation functionality including variants, animations, and accessibility.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { BaseComponentProps } from '../../../types';

/**
 * Individual filter tab interface
 */
export interface IFilterTab {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Optional icon for the tab */
  icon?: string;
  /** Optional badge count for notifications */
  badge?: number;
  /** Whether the tab is disabled */
  disabled?: boolean;
}

/**
 * FilterTabs component props interface
 */
export interface IFilterTabsProps extends BaseComponentProps {
  /** Array of filter tabs */
  tabs: IFilterTab[];
  /** Currently active tab ID (controlled mode) */
  activeTabId?: string;
  /** Default active tab ID (uncontrolled mode) */
  defaultTabId?: string;
  /** Callback when tab changes */
  onTabChange?: (tabId: string) => void;
  /** Whether the entire component is disabled */
  disabled?: boolean;
  /** Additional CSS class for the container */
  className?: string;
  /** Visual variant for tabs */
  variant?: 'default' | 'pills' | 'underline';
  /** Size variant for tabs */
  size?: 'sm' | 'md' | 'lg';
  /** Whether tabs should take full width */
  fullWidth?: boolean;
  /** Whether to show badges on tabs */
  showBadge?: boolean;
}

/**
 * FilterTabs component internal state interface
 */
export interface IFilterTabsState {
  /** Currently active tab ID */
  activeTabId: string;
  /** Whether a transition/animation is in progress */
  isAnimating: boolean;
}
