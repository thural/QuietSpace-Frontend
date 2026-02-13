/**
 * Table Component - Enterprise Data Display
 * 
 * A comprehensive table component with sorting, pagination, and selection features.
 * Follows enterprise patterns with class-based architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent } from 'react';
import { GenericWrapper } from '../../types/sharedComponentTypes';

/**
 * Table column definition interface
 */
export interface ITableColumn<T = any> {
  /** Column key */
  key: string;
  /** Column header text */
  title: string;
  /** Data key for accessing row data */
  dataIndex: keyof T;
  /** Column width */
  width?: string | number;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Custom render function for cell content */
  render?: (value: any, record: T, index: number) => React.ReactNode;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Whether column is resizable */
  resizable?: boolean;
}

/**
 * Table pagination interface
 */
export interface ITablePagination {
  /** Current page number */
  current: number;
  /** Total number of items */
  total: number;
  /** Page size */
  pageSize: number;
  /** Available page sizes */
  pageSizeOptions?: number[];
  /** Show total items count */
  showTotal?: boolean;
  /** Show quick jumper */
  showQuickJumper?: boolean;
  /** Show size changer */
  showSizeChanger?: boolean;
}

/**
 * Table selection configuration
 */
export interface ITableSelection {
  /** Selection type */
  type?: 'checkbox' | 'radio';
  /** Selected row keys */
  selectedRowKeys?: (string | number)[];
  /** Get selected rows callback */
  getSelectedRows?: (selectedRows: any[], selectedRowKeys: (string | number)[]) => void;
  /** Row selection handler */
  onSelect?: (selectedRowKeys: (string | number)[], selectedRows: any[]) => void;
  /** Select all handler */
  onSelectAll?: (selected: boolean, selectedRows: any[], changeRows: any[]) => void;
}

/**
 * Table component props interface
 */
export interface ITableProps<T = any> extends GenericWrapper {
  /** Table data array */
  dataSource: T[];
  /** Table columns definition */
  columns: ITableColumn<T>[];
  /** Table row key extractor */
  rowKey?: string | ((record: T) => string | number);
  /** Loading state */
  loading?: boolean;
  /** Empty state text */
  emptyText?: React.ReactNode;
  /** Table size */
  size?: 'small' | 'middle' | 'large';
  /** Border configuration */
  bordered?: boolean;
  /** Show header */
  showHeader?: boolean;
  /** Show footer */
  showFooter?: boolean;
  /** Pagination configuration */
  pagination?: ITablePagination | false;
  /** Selection configuration */
  rowSelection?: ITableSelection;
  /** Sorting configuration */
  sortDirections?: ('ascend' | 'descend')[];
  /** Default sort info */
  defaultSortInfo?: {
    field: string;
    order: 'ascend' | 'descend';
  };
  /** Scroll configuration */
  scroll?: {
    x?: number | string;
    y?: number | string;
  };
  /** Row click handler */
  onRowClick?: (record: T, index: number, event: React.MouseEvent) => void;
  /** Page change handler */
  onPageChange?: (page: number, pageSize: number) => void;
  /** Sort change handler */
  onSortChange?: (field: string, order: 'ascend' | 'descend') => void;
}

/**
 * Table component state interface
 */
interface ITableState<T = any> {
  selectedRowKeys: (string | number)[];
  selectedRows: T[];
  sortField?: string | undefined;
  sortOrder: 'ascend' | 'descend' | null;
  currentPage: number;
  pageSize: number;
  isResizing: boolean;
  resizingColumn?: string | undefined;
}

/**
 * Table Component
 * 
 * Enterprise-grade table component with sorting, pagination, selection,
 * and advanced features following SOLID principles and enterprise patterns.
 */
export class Table<T = any> extends PureComponent<ITableProps<T>, ITableState<T>> {
  static defaultProps: Partial<ITableProps> = {
    size: 'middle',
    bordered: true,
    showHeader: true,
    showFooter: false,
    loading: false,
    emptyText: 'No data',
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      showTotal: true,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50, 100],
    },
    sortDirections: ['ascend', 'descend'],
  };

  constructor(props: ITableProps<T>) {
    super(props);

    const pagination = props.pagination;
    const currentPage = pagination && pagination !== false ? pagination.current : 1;
    const pageSize = pagination && pagination !== false ? pagination.pageSize : 10;

    this.state = {
      selectedRowKeys: props.rowSelection?.selectedRowKeys || [],
      selectedRows: [],
      sortField: props.defaultSortInfo?.field || undefined,
      sortOrder: props.defaultSortInfo?.order || null,
      currentPage,
      pageSize,
      isResizing: false,
      resizingColumn: undefined,
    };
  }

  /**
   * Get row key for a record
   */
  private getRowKey = (record: T, index: number): string | number => {
    const { rowKey } = this.props;

    if (typeof rowKey === 'string') {
      return record[rowKey as keyof T] as string | number;
    } else if (typeof rowKey === 'function') {
      return rowKey(record);
    }

    return index;
  };

  /**
   * Handle row selection change
   */
  private handleRowSelection = (selected: boolean, record: T, index: number) => {
    const { rowSelection } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;

    if (!rowSelection) return;

    const rowKey = this.getRowKey(record, index);
    let newSelectedRowKeys: (string | number)[];
    let newSelectedRows: T[];

    if (rowSelection.type === 'radio') {
      // Radio selection - only one row can be selected
      newSelectedRowKeys = selected ? [rowKey] : [];
      newSelectedRows = selected ? [record] : [];
    } else {
      // Checkbox selection - multiple rows can be selected
      if (selected) {
        newSelectedRowKeys = [...selectedRowKeys, rowKey];
        newSelectedRows = [...selectedRows, record];
      } else {
        newSelectedRowKeys = selectedRowKeys.filter(key => key !== rowKey);
        newSelectedRows = selectedRows.filter((row, index) =>
          this.getRowKey(row, index) !== rowKey
        );
      }
    }

    this.setState({
      selectedRowKeys: newSelectedRowKeys,
      selectedRows: newSelectedRows,
    });

    if (rowSelection.onSelect) {
      rowSelection.onSelect(newSelectedRowKeys, newSelectedRows);
    }

    if (rowSelection.getSelectedRows) {
      rowSelection.getSelectedRows(newSelectedRows, newSelectedRowKeys);
    }
  };

  /**
   * Handle select all rows
   */
  private handleSelectAll = (selected: boolean) => {
    const { rowSelection } = this.props;
    if (!rowSelection) return;

    const { dataSource } = this.props;
    const newSelectedRowKeys = selected ? dataSource.map((record: T, index: number) => this.getRowKey(record, index)) : [];
    const newSelectedRows = selected ? dataSource : [];

    this.setState({
      selectedRowKeys: newSelectedRowKeys,
      selectedRows: newSelectedRows,
    });

    if (rowSelection.onSelectAll) {
      rowSelection.onSelectAll(selected, newSelectedRows, []);
    }
  };

  /**
   * Handle sort change
   */
  private handleSort = (column: ITableColumn<T>) => {
    const { sortField, sortOrder } = this.state;
    const { sortDirections, onSortChange } = this.props;

    if (!column.sortable || !sortDirections) return;

    let newOrder: 'ascend' | 'descend' | null = null;

    if (sortField === column.key) {
      // Toggle sort order or clear if at last direction
      const currentIndex = sortOrder ? sortDirections.indexOf(sortOrder) : -1;
      if (currentIndex === sortDirections.length - 1) {
        newOrder = null;
      } else {
        newOrder = sortDirections[currentIndex + 1] as 'ascend' | 'descend';
      }
    } else {
      // Start with first sort direction
      newOrder = sortDirections[0] as 'ascend' | 'descend';
    }

    this.setState({
      sortField: newOrder ? column.key : undefined,
      sortOrder: newOrder,
    });

    if (onSortChange && newOrder) {
      onSortChange(column.key, newOrder);
    }
  };

  /**
   * Handle page change
   */
  private handlePageChange = (page: number, pageSize?: number) => {
    const { onPageChange } = this.props;

    this.setState({
      currentPage: page,
      pageSize: pageSize || this.state.pageSize,
    });

    if (onPageChange) {
      onPageChange(page, pageSize || this.state.pageSize);
    }
  };

  /**
   * Get sorted data
   */
  private getSortedData = (): T[] => {
    const { dataSource } = this.props;
    const { sortField, sortOrder } = this.state;

    if (!sortField || !sortOrder) {
      return dataSource;
    }

    return [...dataSource].sort((a, b) => {
      const aValue = a[sortField as keyof T];
      const bValue = b[sortField as keyof T];

      if (aValue < bValue) {
        return sortOrder === 'ascend' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'ascend' ? 1 : -1;
      }
      return 0;
    });
  };

  /**
   * Get paginated data
   */
  private getPaginatedData = (): T[] => {
    const sortedData = this.getSortedData();
    const { currentPage, pageSize } = this.state;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return sortedData.slice(startIndex, endIndex);
  };

  /**
   * Render table header
   */
  private renderHeader = (): React.ReactNode => {
    const { columns, showHeader, rowSelection } = this.props;
    const { sortField, sortOrder } = this.state;

    if (!showHeader) return null;

    return (
      <thead className="table-header">
        <tr>
          {rowSelection && (
            <th className="table-selection-cell">
              {rowSelection.type === 'checkbox' && (
                <input
                  type="checkbox"
                  onChange={(e) => this.handleSelectAll(e.target.checked)}
                />
              )}
            </th>
          )}
          {columns.map(column => (
            <th
              key={column.key}
              className={`table-header-cell ${column.sortable ? 'sortable' : ''}`}
              style={{
                width: column.width,
                textAlign: column.align || 'left',
              }}
              onClick={() => column.sortable && this.handleSort(column)}
            >
              <div className="header-content">
                {column.title}
                {column.sortable && sortField === column.key && (
                  <span className="sort-indicator">
                    {sortOrder === 'ascend' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  /**
   * Render table body
   */
  private renderBody = (): React.ReactNode => {
    const { columns, onRowClick, emptyText, loading } = this.props;
    const { selectedRowKeys } = this.state;
    const paginatedData = this.getPaginatedData();

    if (loading) {
      return (
        <tbody className="table-body">
          <tr>
            <td colSpan={columns.length + 1} className="table-loading">
              Loading...
            </td>
          </tr>
        </tbody>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <tbody className="table-body">
          <tr>
            <td colSpan={columns.length + 1} className="table-empty">
              {emptyText}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="table-body">
        {paginatedData.map((record, index) => {
          const rowKey = this.getRowKey(record, index);
          const isSelected = selectedRowKeys.includes(rowKey);

          return (
            <tr
              key={rowKey}
              className={`table-row ${isSelected ? 'selected' : ''}`}
              onClick={(e) => onRowClick?.(record, index, e)}
            >
              {this.props.rowSelection && (
                <td className="table-selection-cell">
                  <input
                    type={this.props.rowSelection.type || 'checkbox'}
                    checked={isSelected}
                    onChange={(e) => this.handleRowSelection(e.target.checked, record, index)}
                  />
                </td>
              )}
              {columns.map(column => (
                <td
                  key={column.key}
                  className="table-cell"
                  style={{
                    textAlign: column.align || 'left',
                  }}
                >
                  {column.render
                    ? column.render(record[column.dataIndex], record, index)
                    : (record[column.dataIndex] as React.ReactNode)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    );
  };

  /**
   * Render pagination
   */
  private renderPagination = (): React.ReactNode => {
    const { pagination } = this.props;
    const { currentPage, pageSize } = this.state;

    if (!pagination) return null;

    const { total, showTotal, showQuickJumper, showSizeChanger, pageSizeOptions } = pagination;
    const totalPages = Math.ceil(total / pageSize);

    return (
      <div className="table-pagination">
        <div className="pagination-info">
          {showTotal && (
            <span>
              Total {total} items, showing {((currentPage - 1) * pageSize) + 1}-
              {Math.min(currentPage * pageSize, total)}
            </span>
          )}
        </div>

        <div className="pagination-controls">
          <button
            disabled={currentPage === 1}
            onClick={() => this.handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => this.handlePageChange(currentPage + 1)}
          >
            Next
          </button>

          {showQuickJumper && (
            <div className="quick-jumper">
              Go to
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    this.handlePageChange(page);
                  }
                }}
              />
            </div>
          )}

          {showSizeChanger && pageSizeOptions && (
            <select
              value={pageSize}
              onChange={(e) => {
                const newPageSize = parseInt(e.target.value);
                this.handlePageChange(1, newPageSize);
              }}
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render main component
   */
  public override render(): React.ReactNode {
    const { className, style, size, bordered, scroll } = this.props;

    return (
      <div
        className={`table-container table-${size} ${bordered ? 'bordered' : ''} ${className || ''}`}
        style={style}
      >
        <div className="table-wrapper" style={scroll}>
          <table className="table">
            {this.renderHeader()}
            {this.renderBody()}
          </table>
        </div>
        {this.renderPagination()}
      </div>
    );
  }
}

export default Table;
