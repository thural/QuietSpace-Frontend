/**
 * Pagination Component Interface
 * 
 * Defines the contract for the Pagination component with enterprise-grade
 * navigation functionality including page size options, quick jumpers, and accessibility.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode, CSSProperties } from 'react';
import { BaseComponentProps } from '../../../types';

/**
 * Pagination configuration interface
 */
export interface IPaginationConfig {
  /** Current page number */
  current: number;
  /** Total number of items */
  total: number;
  /** Number of items per page */
  pageSize: number;
  /** Available page sizes */
  pageSizeOptions?: number[];
  /** Show total items count */
  showTotal?: boolean;
  /** Show quick jumper */
  showQuickJumper?: boolean;
  /** Show size changer */
  showSizeChanger?: boolean;
  /** Show first/last buttons */
  showFirstLast?: boolean;
  /** Show prev/next buttons */
  showPrevNext?: boolean;
  /** Total items text template */
  totalTemplate?: (total: number, range: [number, number]) => string;
  /** Page size text template */
  pageSizeTemplate?: (pageSize: number) => string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Pagination component props interface
 */
export interface IPaginationProps extends BaseComponentProps {
  /** Pagination configuration */
  pagination: IPaginationConfig;
  /** Page change handler */
  onChange?: (page: number, pageSize: number) => void;
  /** Component size variant */
  size?: 'small' | 'medium' | 'large';
  /** Show page numbers */
  showPageNumbers?: boolean;
  /** Maximum page numbers to show */
  maxPageNumbers?: number;
  /** Custom page number render function */
  renderPageNumber?: (page: number, isActive: boolean) => ReactNode;
  /** Custom total render function */
  renderTotal?: (total: number, range: [number, number]) => ReactNode;
  /** Custom size changer render function */
  renderSizeChanger?: (pageSize: number, options: number[], onChange: (size: number) => void) => ReactNode;
  /** Custom quick jumper render function */
  renderQuickJumper?: (currentPage: number, totalPages: number, onChange: (page: number) => void) => ReactNode;
  /** Disabled state */
  disabled?: boolean;
}
