/**
 * Pagination Component - Enterprise Navigation
 * 
 * A comprehensive pagination component with advanced features including
 * page size options, jump-to-page functionality, and responsive design.
 * Follows enterprise patterns with class-based architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent } from 'react';

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
export interface IPaginationProps {
  /** Pagination configuration */
  pagination: IPaginationConfig;
  /** Page change handler */
  onChange?: (page: number, pageSize: number) => void;
  /** Component size */
  size?: 'small' | 'medium' | 'large';
  /** Component CSS class */
  className?: string;
  /** Component style */
  style?: React.CSSProperties;
  /** Show page numbers */
  showPageNumbers?: boolean;
  /** Maximum page numbers to show */
  maxPageNumbers?: number;
  /** Custom page number render */
  renderPageNumber?: (page: number, isActive: boolean) => React.ReactNode;
  /** Custom total render */
  renderTotal?: (total: number, range: [number, number]) => React.ReactNode;
  /** Custom size changer render */
  renderSizeChanger?: (pageSize: number, options: number[], onChange: (size: number) => void) => React.ReactNode;
  /** Custom quick jumper render */
  renderQuickJumper?: (currentPage: number, totalPages: number, onChange: (page: number) => void) => React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Pagination Component
 * 
 * Enterprise-grade pagination component with advanced features including
 * page size options, jump-to-page functionality, and comprehensive accessibility.
 */
export class Pagination extends PureComponent<IPaginationProps> {
  static defaultProps: Partial<IPaginationProps> = {
    size: 'medium',
    showPageNumbers: true,
    maxPageNumbers: 5,
    showTotal: true,
    showQuickJumper: false,
    showSizeChanger: false,
    showFirstLast: false,
    showPrevNext: true,
    pageSizeOptions: [10, 20, 50, 100],
    totalTemplate: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total} items`,
    pageSizeTemplate: (pageSize: number) => `${pageSize} / page`,
    disabled: false,
  };

  /**
   * Calculate total pages
   */
  private getTotalPages = (): number => {
    const { pagination } = this.props;
    return Math.ceil(pagination.total / pagination.pageSize);
  };

  /**
   * Get page range for display
   */
  private getPageRange = (): [number, number] => {
    const { pagination } = this.props;
    const currentPage = pagination.current;
    
    return [
      (currentPage - 1) * pagination.pageSize + 1,
      Math.min(currentPage * pagination.pageSize, pagination.total)
    ];
  };

  /**
   * Handle page change
   */
  private handlePageChange = (page: number) => {
    const { pagination, onChange } = this.props;
    const totalPages = this.getTotalPages();
    
    if (page < 1 || page > totalPages || page === pagination.current) {
      return;
    }

    if (onChange) {
      onChange(page, pagination.pageSize);
    }
  };

  /**
   * Handle page size change
   */
  private handlePageSizeChange = (pageSize: number) => {
    const { pagination, onChange } = this.props;
    const totalPages = Math.ceil(pagination.total / pageSize);
    const newPage = Math.min(pagination.current, totalPages);
    
    if (onChange) {
      onChange(newPage, pageSize);
    }
  };

  /**
   * Get visible page numbers
   */
  private getVisiblePageNumbers = (): number[] => {
    const { pagination, maxPageNumbers } = this.props;
    const totalPages = this.getTotalPages();
    const currentPage = pagination.current;
    const maxPageNumbersValue = maxPageNumbers || 5;
    
    if (totalPages <= maxPageNumbersValue) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfMax = Math.floor(maxPageNumbersValue / 2);
    let start = Math.max(1, currentPage - halfMax);
    let end = Math.min(totalPages, start + maxPageNumbersValue - 1);

    if (end - start + 1 < maxPageNumbersValue) {
      start = Math.max(1, end - maxPageNumbersValue + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  /**
   * Render first button
   */
  private renderFirstButton = () => {
    const { pagination, size, disabled } = this.props;
    const totalPages = this.getTotalPages();
    const isFirst = pagination.current === 1;

    return (
      <button
        className={`pagination-button pagination-button-${size} ${isFirst ? 'pagination-button-disabled' : ''}`}
        disabled={isFirst || disabled}
        onClick={() => this.handlePageChange(1)}
        aria-label="First page"
        title="Go to first page"
      >
        <span className="pagination-icon">«</span>
      </button>
    );
  };

  /**
   * Render last button
   */
  private renderLastButton = () => {
    const { pagination, size, disabled } = this.props;
    const totalPages = this.getTotalPages();
    const isLast = pagination.current === totalPages;

    return (
      <button
        className={`pagination-button pagination-button-${size} ${isLast ? 'pagination-button-disabled' : ''}`}
        disabled={isLast || disabled}
        onClick={() => this.handlePageChange(totalPages)}
        aria-label="Last page"
        title="Go to last page"
      >
        <span className="pagination-icon">»</span>
      </button>
    );
  };

  /**
   * Render prev button
   */
  private renderPrevButton = () => {
    const { pagination, size, disabled } = this.props;
    const isFirst = pagination.current === 1;

    return (
      <button
        className={`pagination-button pagination-button-${size} ${isFirst ? 'pagination-button-disabled' : ''}`}
        disabled={isFirst || disabled}
        onClick={() => this.handlePageChange(pagination.current - 1)}
        aria-label="Previous page"
        title="Go to previous page"
      >
        <span className="pagination-icon">‹</span>
      </button>
    );
  };

  /**
   * Render next button
   */
  private renderNextButton = () => {
    const { pagination, size, disabled } = this.props;
    const totalPages = this.getTotalPages();
    const isLast = pagination.current === totalPages;

    return (
      <button
        className={`pagination-button pagination-button-${size} ${isLast ? 'pagination-button-disabled' : ''}`}
        disabled={isLast || disabled}
        onClick={() => this.handlePageChange(pagination.current + 1)}
        aria-label="Next page"
        title="Go to next page"
      >
        <span className="pagination-icon">›</span>
      </button>
    );
  };

  /**
   * Render page numbers
   */
  private renderPageNumbers = () => {
    const { pagination, size, renderPageNumber } = this.props;
    const visiblePages = this.getVisiblePageNumbers();
    const currentPage = pagination.current;

    return (
      <div className={`pagination-numbers pagination-numbers-${size}`}>
        {visiblePages.map(page => {
          const isActive = page === currentPage;
          const pageNumber = renderPageNumber ? (
            renderPageNumber(page, isActive)
          ) : (
            <button
              key={page}
              className={`pagination-number ${isActive ? 'pagination-number-active' : ''}`}
              onClick={() => this.handlePageChange(page)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          );
        })}
      </div>
    );
  };

  /**
   * Render quick jumper
   */
  private renderQuickJumper = () => {
    const { pagination, size, renderQuickJumper } = this.props;
    const totalPages = this.getTotalPages();

    if (renderQuickJumper) {
      return renderQuickJumper(pagination.current, totalPages, this.handlePageChange);
    }

    return (
      <div className={`pagination-jumper pagination-jumper-${size}`}>
        <span className="pagination-jumper-text">Go to</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={pagination.current}
          onChange={(e) => {
            const page = parseInt(e.target.value, 10);
            if (!isNaN(page)) {
              this.handlePageChange(page);
            }
          }}
          className="pagination-jumper-input"
          aria-label="Jump to page"
        />
      </div>
    );
  };

  /**
   * Render size changer
   */
  private renderSizeChanger = () => {
    const { pagination, size, renderSizeChanger } = this.props;
    const { pageSizeOptions } = pagination;

    if (renderSizeChanger) {
      return renderSizeChanger(pagination.pageSize, pageSizeOptions || [], this.handlePageSizeChange);
    }

    return (
      <div className={`pagination-sizer pagination-sizer-${size}`}>
        <select
          value={pagination.pageSize}
          onChange={(e) => {
            const pageSize = parseInt(e.target.value, 10);
            if (!isNaN(pageSize)) {
              this.handlePageSizeChange(pageSize);
            }
          }}
          className="pagination-sizer-select"
          aria-label="Items per page"
        >
          {(pageSizeOptions || [10, 20, 50, 100]).map(size => (
            <option key={size} value={size}>
              {size} items
            </option>
          ))}
        </select>
      </div>
    );
  };

  /**
   * Render total items
   */
  private renderTotal = () => {
    const { pagination, renderTotal, showTotal } = this.props;
    
    if (!showTotal) return null;

    const range = this.getPageRange();
    const totalText = renderTotal ? (
      renderTotal(pagination.total, range)
    ) : (
      <span className="pagination-total">
        {pagination.totalTemplate?.(pagination.total, range) || `${range[0]}-${range[1]} of ${pagination.total} items`}
      </span>
    );

    return <div className="pagination-total">{totalText}</div>;
  };

  override render() {
    const {
      pagination,
      size,
      className,
      style,
      showPageNumbers,
      showFirstLast,
      showPrevNext,
      disabled,
    } = this.props;

    const totalPages = this.getTotalPages();
    const hasMultiplePages = totalPages > 1;

    return (
      <div className={`pagination pagination-${size} ${className || ''}`} style={style}>
        <div className="pagination-content">
          {showFirstLast && this.renderFirstButton()}
          {showPrevNext && this.renderPrevButton()}
          
          {showPageNumbers && hasMultiplePages && this.renderPageNumbers()}
          
          {showPrevNext && this.renderNextButton()}
          {showFirstLast && this.renderLastButton()}
          
          {pagination.showTotal && this.renderTotal()}
          
          {pagination.showQuickJumper && this.renderQuickJumper()}
          {pagination.showSizeChanger && this.renderSizeChanger()}
        </div>
      </div>
    );
  }
}

export default Pagination;
