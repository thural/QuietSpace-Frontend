/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import {
  IDataGridProps,
  IDataGridState,
  IDataGridSort,
  IDataGridPagination
} from './interfaces';
import {
  createDataGridContainerStyles,
  createTableStyles,
  createTableHeaderStyles,
  createTableBodyStyles,
  createCellStyles,
  createPaginationStyles,
  createSelectionColumnStyles,
  createResizeHandleStyles,
  createLoadingOverlayStyles,
  createEmptyStateStyles,
  createExpandedRowStyles
} from './styles';

/**
 * Enterprise DataGrid Component
 * 
 * Provides advanced data grid functionality with:
 * - Column resizing and sorting
 * - Row selection and expansion
 * - Pagination and filtering
 * - Cell editing capabilities
 * - Virtual scrolling support
 * - Responsive design
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class DataGrid<T = any> extends BaseClassComponent<IDataGridProps<T>, IDataGridState> {
  private tableRef = React.createRef<HTMLTableElement>();
  private containerRef = React.createRef<HTMLDivElement>();

  protected override getInitialState(): Partial<IDataGridState> {
    return {
      currentPage: 1,
      pageSize: 10,
      selectedRowKeys: [],
      expandedRowKeys: [],
      filters: [],
      columnWidths: {},
      loading: false
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.initializeColumnWidths();
  }

  protected override onUpdate(prevProps: IDataGridProps<T>): void {
    if (prevProps.dataSource !== this.props.dataSource) {
      this.safeSetState({ loading: false });
    }
  }

  /**
   * Initialize column widths
   */
  private initializeColumnWidths = (): void => {
    const { columns } = this.props;
    const columnWidths: Record<string, number> = {};

    columns.forEach((column) => {
      columnWidths[column.key] = column.width || 150;
    });

    this.safeSetState({ columnWidths });
  };

  /**
   * Get row key
   */
  private getRowKey = (record: T, index: number): string | number => {
    const { rowKey } = this.props;

    if (typeof rowKey === 'function') {
      return rowKey(record);
    }

    return (record as any)[rowKey] || index;
  };

  /**
   * Handle page change
   */
  private handlePageChange = (page: number, pageSize: number): void => {
    const { pagination } = this.props;

    this.safeSetState({
      currentPage: page,
      pageSize
    });

    if (pagination && pagination.onChange) {
      pagination.onChange(page, pageSize);
    }
  };

  /**
   * Handle sort change
   */
  private handleSortChange = (field: string): void => {
    const { sort } = this.state;
    let newSort: IDataGridSort;

    if (sort?.field === field) {
      newSort = {
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc'
      };
    } else {
      newSort = {
        field,
        direction: 'asc'
      };
    }

    this.safeSetState({ sort: newSort });
  };

  /**
   * Handle selection change
   */
  private handleSelectionChange = (selectedRowKeys: (string | number)[]): void => {
    const { selection } = this.props;

    this.safeSetState({ selectedRowKeys });

    if (selection?.onChange) {
      const selectedRows = this.props.dataSource.filter((record, index) =>
        selectedRowKeys.includes(this.getRowKey(record, index))
      );
      selection.onChange(selectedRowKeys, selectedRows);
    }
  };

  /**
   * Handle row expansion
   */
  private handleRowExpansion = (expandedRowKeys: (string | number)[]): void => {
    const { expandable } = this.props;

    this.safeSetState({ expandedRowKeys });

    if (expandable?.onExpandedRowsChange) {
      expandable.onExpandedRowsChange(expandedRowKeys);
    }
  };

  /**
   * Render table header
   */
  private renderTableHeader = (): React.ReactNode => {
    const { columns, selection, size = 'middle' } = this.props;
    const { sort } = this.state;

    return (
      <thead css={createTableHeaderStyles(size)}>
        <tr>
          {selection && (
            <th css={createSelectionColumnStyles()}>
              <input
                type={selection.type}
                className="selection-checkbox"
                checked={this.state.selectedRowKeys.length === this.props.dataSource.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    const allKeys = this.props.dataSource.map((record, index) =>
                      this.getRowKey(record, index)
                    );
                    this.handleSelectionChange(allKeys);
                  } else {
                    this.handleSelectionChange([]);
                  }
                }}
              />
            </th>
          )}
          {columns.map((column) => (
            <th
              key={column.key}
              className={column.sortable ? 'sortable' : ''}
              css={css`
                  ${column.sortable && sort?.field === column.key ?
                  (sort.direction === 'asc' ? 'sorted-asc' : 'sorted-desc') :
                  ''
                }
              `}
              onClick={() => column.sortable && this.handleSortChange(column.key)}
            >
              {column.title}
              {column.resizable && (
                <div css={createResizeHandleStyles()} />
              )}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  /**
   * Render table body
   */
  private renderTableBody = (): React.ReactNode => {
    const { dataSource, columns, selection, expandable, size = 'middle' } = this.props;
    const { selectedRowKeys, expandedRowKeys } = this.state;

    if (dataSource.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length + (selection ? 1 : 0)}>
              <div css={createEmptyStateStyles()}>
                <div className="empty-icon">📊</div>
                <div className="empty-title">No Data</div>
                <div className="empty-description">
                  There are no records to display
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody css={createTableBodyStyles()}>
        {dataSource.map((record, index) => {
          const rowKey = this.getRowKey(record, index);
          const isSelected = selectedRowKeys.includes(rowKey);
          const isExpanded = expandedRowKeys.includes(rowKey);

          return (
            <React.Fragment key={rowKey}>
              <tr className={isSelected ? 'selected' : ''}>
                {selection && (
                  <td css={createSelectionColumnStyles()}>
                    <input
                      type={selection.type}
                      className="selection-checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const newSelection = e.target.checked
                          ? [...selectedRowKeys, rowKey]
                          : selectedRowKeys.filter(key => key !== rowKey);
                        this.handleSelectionChange(newSelection);
                      }}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    css={createCellStyles(column.align, !!column.editor)}
                  >
                    {column.render
                      ? column.render((record as any)[column.key], record, index)
                      : (record as any)[column.key]
                    }
                  </td>
                ))}
              </tr>
              {expandable && isExpanded && (
                <tr>
                  <td
                    colSpan={columns.length + (selection ? 1 : 0)}
                    css={createExpandedRowStyles()}
                  >
                    <div className="expanded-content">
                      {expandable.expandedRowRender?.(record, index, 0, true)}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    );
  };

  /**
   * Render pagination
   */
  private renderPagination = (): React.ReactNode => {
    const { pagination, dataSource } = this.props;
    const { currentPage, pageSize } = this.state;

    if (!pagination) return null;

    const totalPages = Math.ceil(dataSource.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, dataSource.length);

    return (
      <div css={createPaginationStyles(pagination.current ? 'middle' : 'middle')}>
        <div className="pagination-info">
          Showing {startIndex}-{endIndex} of {dataSource.length} records
        </div>
        <div className="pagination-controls">
          <button
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => this.handlePageChange(currentPage - 1, pageSize)}
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                className={`pagination-button ${pageNum === currentPage ? 'active' : ''}`}
                onClick={() => this.handlePageChange(pageNum, pageSize)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className="pagination-button"
            disabled={currentPage === totalPages}
            onClick={() => this.handlePageChange(currentPage + 1, pageSize)}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  /**
   * Render loading overlay
   */
  private renderLoading = (): React.ReactNode => {
    const { loading } = this.props;

    if (!loading) return null;

    return (
      <div css={createLoadingOverlayStyles()}>
        <div className="spinner" />
      </div>
    );
  };

  protected override renderContent(): React.ReactNode {
    const {
      size = 'middle',
      bordered = false,
      tableLayout = 'auto',
      virtual = false,
      className = '',
      testId
    } = this.props;

    const containerStyles = createDataGridContainerStyles(size, bordered, className);
    const tableStyles = createTableStyles(tableLayout, virtual);

    return (
      <div
        ref={this.containerRef}
        css={containerStyles}
        data-testid={testId}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            ref={this.tableRef}
            css={tableStyles}
          >
            {this.renderTableHeader()}
            {this.renderTableBody()}
          </table>
        </div>

        {this.renderPagination()}
        {this.renderLoading()}
      </div>
    );
  }
}

export default DataGrid;
