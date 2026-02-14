/**
 * Sidebar Component Interface
 * 
 * Defines contract for Sidebar component with enterprise-grade
 * navigation functionality including collapsible sections, user info, and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode, CSSProperties } from 'react';
import { BaseComponentProps } from '../../../types';
import { IMenuItem } from '../Menu/interfaces';

/**
 * Sidebar section interface
 */
export interface ISidebarSection {
  /** Unique identifier for the section */
  key: string;
  /** Display title for the section */
  title: string;
  /** Optional icon for the section */
  icon?: ReactNode;
  /** Menu items in the section */
  items: IMenuItem[];
  /** Whether the section is collapsible */
  collapsible?: boolean;
  /** Whether the section is collapsed by default */
  defaultCollapsed?: boolean;
}

/**
 * Sidebar component props interface
 */
export interface ISidebarProps extends BaseComponentProps {
  /** Array of sidebar sections */
  sections: ISidebarSection[];
  /** Sidebar width */
  width?: number | string;
  /** Whether the sidebar is collapsed */
  collapsed?: boolean;
  /** Whether the sidebar is fixed positioned */
  fixed?: boolean;
  /** Sidebar position */
  position?: 'left' | 'right';
  /** Sidebar theme variant */
  theme?: 'light' | 'dark';
  /** Component size variant */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show logo */
  showLogo?: boolean;
  /** Logo configuration */
  logo?: {
    src: string;
    alt: string;
    href?: string;
  };
  /** User information */
  user?: {
    name: string;
    avatar?: string;
    email?: string;
    href?: string;
  };
  /** Footer content */
  footer?: ReactNode;
  /** Collapse handler */
  onCollapse?: (collapsed: boolean) => void;
  /** Section toggle handler */
  onSectionToggle?: (sectionKey: string, collapsed: boolean) => void;
}

/**
 * Sidebar component internal state interface
 */
export interface ISidebarState {
  /** Set of collapsed section keys */
  collapsedSections: Set<string>;
}
