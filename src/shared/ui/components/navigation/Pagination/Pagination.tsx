/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { useTheme } from '@/core/modules/theming';
import { IPaginationProps, IPaginationConfig } from './interfaces';
import {
  paginationContainerStyles,
  paginationButtonStyles,
  paginationNumberStyles,
  paginationIconStyles,
  paginationTotalStyles,
  paginationJumperStyles,
  paginationJumperInputStyles,
  paginationSizerStyles,
  paginationSizerSelectStyles,
  paginationResponsiveStyles
} from './styles';

/**
 * Pagination Component
 * 
 * Enterprise-grade pagination component with comprehensive theme integration,
 * page size options, quick jumpers, and responsive design.
 */
export class Pagination extends PureComponent<IPaginationProps> {
  static defaultProps: Partial<IPaginationProps> = {
    size: 'medium',
    showPageNumbers: true,
    maxPageNumbers: 5,
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
  private handlePageChange = (page: number): void => {
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
  private handlePageSizeChange = (pageSize: number): void => {
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
  private renderFirstButton = (): ReactNode => {
    const { pagination, size = 'medium', disabled } = this.props;
    const totalPages = this.getTotalPages();
    const isFirst = pagination.current === 1;
    const theme = useTheme();

    return (
      <button
        css={paginationButtonStyles(theme, size, isFirst || disabled, false)}
        disabled={isFirst || disabled}
        onClick={() => this.handlePageChange(1)}
        aria-label="First page"
        title="Go to first page"
      >
        <span css={paginationIconStyles(theme, size)}>«</span>
      </button>
    );
  };

  /**
   * Render last button
   */
  private renderLastButton = (): ReactNode => {
    const { pagination, size = 'medium', disabled } = this.props;
    const totalPages = this.getTotalPages();
    const isLast = pagination.current === totalPages;
    const theme = useTheme();

    return (
      <button
        css={paginationButtonStyles(theme, size, isLast || disabled, false)}
        disabled={isLast || disabled}
        onClick={() => this.handlePageChange(totalPages)}
        aria-label="Last page"
        title="Go to last page"
      >
        <span css={paginationIconStyles(theme, size)}>»</span>
      </button>
    );
  };

  /**
   * Render prev button
   */
  private renderPrevButton = (): ReactNode => {
    const { pagination, size = 'medium', disabled } = this.props;
    const isFirst = pagination.current === 1;
    const theme = useTheme();

    return (
      <button
        css={paginationButtonStyles(theme, size, isFirst || disabled, false)}
        disabled={isFirst || disabled}
        onClick={() => this.handlePageChange(pagination.current - 1)}
        aria-label="Previous page"
        title="Go to previous page"
      >
        <span css={paginationIconStyles(theme, size)}>‹</span>
      </button>
    );
  };

  /**
   * Render next button
   */
  private renderNextButton = (): ReactNode => {
    const { pagination, size = 'medium', disabled } = this.props;
    const totalPages = this.getTotalPages();
    const isLast = pagination.current === totalPages;
    const theme = useTheme();

    return (
      <button
        css={paginationButtonStyles(theme, size, isLast || disabled, false)}
        disabled={isLast || disabled}
        onClick={() => this.handlePageChange(pagination.current + 1)}
        aria-label="Next page"
        title="Go to next page"
      >
        <span css={paginationIconStyles(theme, size)}>›</span>
      </button>
    );
  };

  /**
   * Render page numbers
   */
  private renderPageNumbers = (): ReactNode => {
    const { pagination, size = 'medium', renderPageNumber } = this.props;
    const visiblePages = this.getVisiblePageNumbers();
    const currentPage = pagination.current;
    const theme = useTheme();

    return (
      <div style={{ display: 'flex', gap: theme.spacing?.spacing?.xs || '4px' }}>
        {visiblePages.map(page => {
          const isActive = page === currentPage;
          const pageNumber = renderPageNumber ? (
            renderPageNumber(page, isActive)
          ) : (
            <button
              key={page}
              css={paginationNumberStyles(theme, size, isActive)}
              onClick={() => this.handlePageChange(page)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          );
          return pageNumber;
        })}
      </div>
    );
  };

  /**
   * Render quick jumper
   */
  private renderQuickJumper = (): ReactNode => {
    const { pagination, size = 'medium', renderQuickJumper } = this.props;
    const totalPages = this.getTotalPages();
    const theme = useTheme();

    if (renderQuickJumper) {
      return renderQuickJumper(pagination.current, totalPages, this.handlePageChange);
    }

    return (
      <div css={paginationJumperStyles(theme, size)}>
        <span>Go to</span>
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
          css={paginationJumperInputStyles(theme, size)}
          aria-label="Jump to page"
        />
      </div>
    );
  };

  /**
   * Render size changer
   */
  private renderSizeChanger = (): ReactNode => {
    const { pagination, size = 'medium', renderSizeChanger } = this.props;
    const { pageSizeOptions } = pagination;
    const theme = useTheme();

    if (renderSizeChanger) {
      return renderSizeChanger(pagination.pageSize, pageSizeOptions || [], this.handlePageSizeChange);
    }

    return (
      <div css={paginationSizerStyles(theme, size)}>
        <select
          value={pagination.pageSize}
          onChange={(e) => {
            const pageSize = parseInt(e.target.value, 10);
            if (!isNaN(pageSize)) {
              this.handlePageSizeChange(pageSize);
            }
          }}
          css={paginationSizerSelectStyles(theme, size)}
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
  private renderTotal = (): ReactNode => {
    const { pagination, renderTotal, showTotal } = this.props;
    const theme = useTheme();
    
    if (!showTotal) return null;

    const range = this.getPageRange();
    const totalText = renderTotal ? (
      renderTotal(pagination.total, range)
    ) : (
      <span css={paginationTotalStyles(theme)}>
        {pagination.totalTemplate?.(pagination.total, range) || `${range[0]}-${range[1]} of ${pagination.total} items`}
      </span>
    );

    return <div>{totalText}</div>;
  };

  override render(): ReactNode {
    const {
      pagination,
      size = 'medium',
      className,
      testId,
      id,
      onClick,
      style,
      showPageNumbers = true,
      showFirstLast = false,
      showPrevNext = true,
      disabled = false,
    } = this.props;

    const totalPages = this.getTotalPages();
    const hasMultiplePages = totalPages > 1;
    const theme = useTheme();

    return (
      <div
        css={[
          paginationContainerStyles(theme, size),
          paginationResponsiveStyles(theme)
        ]}
        className={className}
        data-testid={testId}
        id={id?.toString()}
        onClick={onClick}
        style={style}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing?.spacing?.sm || '8px' }}>
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
