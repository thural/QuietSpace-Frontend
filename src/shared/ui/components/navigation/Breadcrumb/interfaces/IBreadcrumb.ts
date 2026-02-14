/**
 * Breadcrumb Component Interface
 * 
 * Defines the contract for the Breadcrumb component with enterprise-grade
 * navigation functionality including separators, truncation, and accessibility.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode, CSSProperties } from 'react';
import { BaseComponentProps } from '../../../types';

/**
 * Individual breadcrumb item interface
 */
export interface IBreadcrumbItem {
  /** Unique identifier for the item */
  key: string;
  /** Display label for the item */
  label: string;
  /** Navigation link/href */
  href?: string;
  /** Whether the item is clickable */
  clickable?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Optional icon for the item */
  icon?: ReactNode;
  /** Custom render function for the item */
  render?: (item: IBreadcrumbItem) => ReactNode;
  /** Click handler for the item */
  onClick?: (item: IBreadcrumbItem) => void;
}

/**
 * Breadcrumb separator configuration interface
 */
export interface IBreadcrumbSeparator {
  /** Separator content */
  content: ReactNode;
  /** Custom render function for separator */
  render?: () => ReactNode;
}

/**
 * Breadcrumb component props interface
 */
export interface IBreadcrumbProps extends BaseComponentProps {
  /** Array of breadcrumb items */
  items: IBreadcrumbItem[];
  /** Separator configuration */
  separator?: IBreadcrumbSeparator | string;
  /** Maximum items to show before truncating */
  maxItems?: number;
  /** Whether to show home icon/item */
  showHome?: boolean;
  /** Home item configuration */
  homeItem?: Partial<IBreadcrumbItem>;
  /** Whether to enable responsive behavior */
  responsive?: boolean;
  /** Component size variant */
  size?: 'small' | 'medium' | 'large';
  /** Click handler for breadcrumb items */
  onItemClick?: (item: IBreadcrumbItem, index: number) => void;
}
