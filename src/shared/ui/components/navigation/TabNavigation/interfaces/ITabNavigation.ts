/**
 * TabNavigation Component Interface
 * 
 * Defines the contract for the TabNavigation component with enterprise-grade
 * navigation functionality including variants, animations, and accessibility.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { BaseComponentProps } from '../../../types';

/**
 * Individual navigation tab interface
 */
export interface INavigationTab {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Optional icon for the tab */
  icon?: string;
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Optional badge count for notifications */
  badge?: number;
  /** Optional content to render when tab is active */
  content?: ReactNode;
}

/**
 * TabNavigation component props interface
 */
export interface ITabNavigationProps extends BaseComponentProps {
  /** Array of navigation tabs */
  tabs: INavigationTab[];
  /** Default active tab ID */
  defaultTabId?: string;
  /** Callback when tab changes */
  onTabChange?: (tabId: string) => void;
  /** Whether the entire navigation is disabled */
  disabled?: boolean;
  /** Additional CSS class for navigation container */
  className?: string;
  /** Visual variant for tabs */
  variant?: 'default' | 'pills' | 'cards';
  /** Size variant for tabs */
  size?: 'sm' | 'md' | 'lg';
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Whether to show tab content */
  showContent?: boolean;
  /** Additional CSS class for content container */
  contentClassName?: string;
}

/**
 * TabNavigation component internal state interface
 */
export interface ITabNavigationState {
  /** Currently active tab ID */
  activeTabId: string;
  /** Whether a transition is in progress */
  isTransitioning: boolean;
}
