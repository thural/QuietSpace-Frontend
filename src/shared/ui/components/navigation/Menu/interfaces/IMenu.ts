/**
 * Menu Component Interface
 * 
 * Defines the contract for the Menu component with enterprise-grade
 * navigation functionality including submenus, groups, and accessibility.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode, CSSProperties } from 'react';
import { BaseComponentProps } from '../../../types';

/**
 * Individual menu item interface
 */
export interface IMenuItem {
  /** Unique identifier for the item */
  key: string;
  /** Display label for the item */
  label: string;
  /** Optional icon for the item */
  icon?: ReactNode;
  /** Navigation link/href */
  href?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Whether the item is active/selected */
  active?: boolean;
  /** Submenu items */
  children?: IMenuItem[];
  /** Item type */
  type?: 'item' | 'divider' | 'group';
  /** Group title for group type items */
  groupTitle?: string;
  /** Click handler for the item */
  onClick?: (item: IMenuItem) => void;
  /** Custom render function for the item */
  render?: (item: IMenuItem) => ReactNode;
}

/**
 * Menu component props interface
 */
export interface IMenuProps extends BaseComponentProps {
  /** Array of menu items */
  items: IMenuItem[];
  /** Menu layout mode */
  mode?: 'vertical' | 'horizontal' | 'inline';
  /** Menu theme variant */
  theme?: 'light' | 'dark';
  /** Component size variant */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show icons */
  showIcons?: boolean;
  /** Whether to expand submenus on hover */
  expandOnHover?: boolean;
  /** Default open submenu keys */
  defaultOpenKeys?: string[];
  /** Currently selected item keys */
  selectedKeys?: string[];
  /** Click handler for menu items */
  onClick?: (item: IMenuItem) => void;
  /** Select handler for menu items */
  onSelect?: (item: IMenuItem) => void;
  /** Open change handler for submenus */
  onOpenChange?: (openKeys: string[]) => void;
}

/**
 * Menu component internal state interface
 */
export interface IMenuState {
  /** Set of currently open submenu keys */
  openKeys: Set<string>;
  /** Set of currently selected item keys */
  selectedKeys: Set<string>;
}
