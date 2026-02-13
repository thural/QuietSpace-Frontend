/**
 * DataTable Component - Enterprise Data Management
 * 
 * An enhanced table component with built-in data management features including
 * filtering, searching, sorting, pagination, and export capabilities.
 * Follows enterprise patterns with class-based architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent } from 'react';
import { Table, ITableColumn, ITablePagination, ITableSelection } from './Table';
import { TableContainer } from './Table.styles';

/**
 * Data filter configuration interface
 */
export interface IDataTableFilter {
  /** Filter key */
  key: string;
  /** Filter label */
  label: string;
  /** Filter type */
  type: 'text' | 'select' | 'date' | 'number';
  /** Filter options for select type */
  options?: Array<{ label: string; value: any }>;
  /** Current filter value */
  value?: any;
  /** Filter change handler */
  onChange?: (value: any) => void;
}

/**
 * Data export configuration interface
 */
export interface IDataTableExport {
  /** Export formats available */
  formats: ('csv' | 'excel' | 'pdf')[];
  /** Export handler */
  onExport?: (format: string, data: any[]) => void;
  /** Show export button */
  showButton?: boolean;
}

/**
 * DataTable search configuration interface
 */
export interface IDataTableSearch {
  /** Search placeholder */
  placeholder?: string;
  /** Search handler */
  onSearch?: (query: string) => void;
  /** Show search input */
  showInput?: boolean;
  /** Search fields */
  fields?: string[];
}

/**
 * DataTable component props interface
 */
export interface IDataTableProps<T = any> {
  /** Data source */
  dataSource: T[];
  /** Table columns */
  columns: ITableColumn<T>[];
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
  /** Row click handler */
  onRowClick?: (record: T, index: number, event: React.MouseEvent) => void;
  /** Page change handler */
  onPageChange?: (page: number, pageSize: number) => void;
  /** Sort change handler */
  onSortChange?: (field: string, order: 'ascend' | 'descend') => void;
  /** Filter configuration */
  filters?: IDataTableFilter[];
  /** Search configuration */
  search?: IDataTableSearch;
  /** Export configuration */
  export?: IDataTableExport;
  /** Toolbar configuration */
  showToolbar?: boolean;
  /** Toolbar extra content */
  toolbarExtra?: React.ReactNode;
  /** Table row key extractor */
  rowKey?: string | ((record: T) => string | number);
  /** Scroll configuration */
  scroll?: {
    x?: number | string;
    y?: number | string;
  };
}

/**
 * DataTable component state interface
 */
interface IDataTableState<T = any> {
  filteredData: T[];
  searchQuery: string;
  activeFilters: Record<string, any>;
  currentPage: number;
  pageSize: number;
  sortField?: string | undefined;
  sortOrder: 'ascend' | 'descend' | null;
}

/**
 * DataTable Component
 * 
 * Enterprise-grade data table with filtering, searching, sorting,
 * pagination, and export capabilities following SOLID principles.
 */
export class DataTable<T = any> extends PureComponent<IDataTableProps<T>, IDataTableState<T>> {
  static defaultProps: Partial<IDataTableProps> = {
    loading: false,
    emptyText: 'No data available',
    size: 'middle',
    bordered: false,
    showHeader: true,
    showToolbar: true,
    pagination: {
      current: 1,
      total: 0,
      pageSize: 10,
      showTotal: true,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50, 100],
    },
    sortDirections: ['ascend', 'descend'],
    search: {
      placeholder: 'Search...',
      showInput: true,
    },
    export: {
      formats: ['csv', 'excel'],
      showButton: true,
    },
  };

  constructor(props: IDataTableProps<T>) {
    super(props);

    const pagination = props.pagination;
    const currentPage = pagination && typeof pagination !== 'boolean' ? pagination.current : 1;
    const pageSize = pagination && typeof pagination !== 'boolean' ? pagination.pageSize : 10;

    this.state = {
      filteredData: props.dataSource,
      searchQuery: '',
      activeFilters: {},
      currentPage,
      pageSize,
      sortField: props.defaultSortInfo?.field || undefined,
      sortOrder: props.defaultSortInfo?.order || null,
    };
  }

  /**
   * Update filtered data when props change
   */
  override componentDidUpdate(prevProps: IDataTableProps<T>) {
    if (prevProps.dataSource !== this.props.dataSource) {
      this.applyFiltersAndSearch();
    }
  }

  /**
   * Apply filters and search to data
   */
  private applyFiltersAndSearch = () => {
    const { dataSource, search, filters } = this.props;
    const { searchQuery, activeFilters } = this.state;

    let filteredData = [...dataSource];

    // Apply search
    if (searchQuery && search?.showInput) {
      const searchFields = search?.fields || [];
      filteredData = filteredData.filter(record => {
        if (searchFields.length === 0) {
          // Search all string fields
          return Object.values(record as any).some(value =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else {
          // Search specific fields
          return searchFields.some(field => {
            const value = (record as any)[field];
            return typeof value === 'string' &&
              value.toLowerCase().includes(searchQuery.toLowerCase());
          });
        }
      });
    }

    // Apply filters
    if (filters && filters.length > 0) {
      filteredData = filteredData.filter(record => {
        return filters.every(filter => {
          const filterValue = activeFilters[filter.key];
          if (filterValue === undefined || filterValue === '') {
            return true;
          }

          const recordValue = (record as any)[filter.key];

          switch (filter.type) {
            case 'text':
              return String(recordValue).toLowerCase().includes(String(filterValue).toLowerCase());
            case 'select':
              return recordValue === filterValue;
            case 'number':
              return recordValue === Number(filterValue);
            case 'date':
              return new Date(recordValue).toISOString() === new Date(filterValue).toISOString();
            default:
              return true;
          }
        });
      });
    }

    this.setState({ filteredData });
  };

  /**
   * Handle search input change
   */
  private handleSearch = (query: string) => {
    this.setState({ searchQuery: query }, () => {
      this.applyFiltersAndSearch();
      this.props.search?.onSearch?.(query);
    });
  };

  /**
   * Handle filter change
   */
  private handleFilterChange = (filterKey: string, value: any) => {
    const { activeFilters } = this.state;
    const newFilters = { ...activeFilters, [filterKey]: value };

    this.setState({ activeFilters: newFilters }, () => {
      this.applyFiltersAndSearch();

      const filter = this.props.filters?.find(f => f.key === filterKey);
      filter?.onChange?.(value);
    });
  };

  /**
   * Handle page change
   */
  private handlePageChange = (page: number, pageSize: number) => {
    this.setState({ currentPage: page, pageSize });
    this.props.onPageChange?.(page, pageSize);
  };

  /**
   * Handle sort change
   */
  private handleSortChange = (field: string, order: 'ascend' | 'descend') => {
    this.setState({ sortField: field, sortOrder: order });
    this.props.onSortChange?.(field, order);
  };

  /**
   * Handle export
   */
  private handleExport = (format: string) => {
    const { filteredData } = this.state;
    this.props.export?.onExport?.(format, filteredData);
  };

  /**
   * Render search input
   */
  private renderSearch = () => {
    const { search } = this.props;
    const { searchQuery } = this.state;

    if (!search?.showInput) return null;

    return (
      <div className="data-table-search">
        <input
          type="text"
          placeholder={search.placeholder}
          value={searchQuery}
          onChange={(e) => this.handleSearch(e.target.value)}
          className="search-input"
        />
      </div>
    );
  };

  /**
   * Render filters
   */
  private renderFilters = () => {
    const { filters } = this.props;
    const { activeFilters } = this.state;

    if (!filters || filters.length === 0) return null;

    return (
      <div className="data-table-filters">
        {filters.map(filter => (
          <div key={filter.key} className="filter-item">
            <label>{filter.label}</label>
            {filter.type === 'text' && (
              <input
                type="text"
                value={activeFilters[filter.key] || ''}
                onChange={(e) => this.handleFilterChange(filter.key, e.target.value)}
                className="filter-input"
              />
            )}
            {filter.type === 'select' && (
              <select
                value={activeFilters[filter.key] || ''}
                onChange={(e) => this.handleFilterChange(filter.key, e.target.value)}
                className="filter-select"
              >
                <option value="">All</option>
                {filter.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {filter.type === 'number' && (
              <input
                type="number"
                value={activeFilters[filter.key] || ''}
                onChange={(e) => this.handleFilterChange(filter.key, e.target.value)}
                className="filter-input"
              />
            )}
            {filter.type === 'date' && (
              <input
                type="date"
                value={activeFilters[filter.key] || ''}
                onChange={(e) => this.handleFilterChange(filter.key, e.target.value)}
                className="filter-input"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  /**
   * Render export buttons
   */
  private renderExport = () => {
    const { export: exportConfig } = this.props;

    if (!exportConfig?.showButton) return null;

    return (
      <div className="data-table-export">
        {exportConfig.formats.map(format => (
          <button
            key={format}
            onClick={() => this.handleExport(format)}
            className="export-button"
          >
            Export {format.toUpperCase()}
          </button>
        ))}
      </div>
    );
  };

  /**
   * Render toolbar
   */
  private renderToolbar = () => {
    const { showToolbar, toolbarExtra } = this.props;

    if (!showToolbar) return null;

    return (
      <div className="data-table-toolbar">
        <div className="toolbar-left">
          {this.renderSearch()}
          {this.renderFilters()}
        </div>
        <div className="toolbar-right">
          {toolbarExtra}
          {this.renderExport()}
        </div>
      </div>
    );
  };

  override render() {
    const {
      columns,
      loading,
      emptyText,
      size,
      bordered,
      showHeader,
      pagination,
      rowSelection,
      sortDirections,
      onRowClick,
      rowKey,
      scroll,
    } = this.props;

    const { filteredData, currentPage, pageSize, sortField, sortOrder } = this.state;

    // Calculate pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const tablePagination = pagination === false ? false : {
      current: currentPage,
      total: filteredData.length,
      pageSize,
      showTotal: true,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50, 100],
      ...pagination,
    };

    const tableProps: any = {
      dataSource: paginatedData,
      columns,
      loading,
      emptyText,
      size,
      bordered,
      showHeader,
      pagination: tablePagination,
      rowSelection,
      sortDirections,
      defaultSortInfo: sortField && sortOrder ? { field: sortField, order: sortOrder } : undefined,
      onRowClick,
      onPageChange: this.handlePageChange,
      onSortChange: this.handleSortChange,
      scroll,
    };

    if (rowKey) {
      tableProps.rowKey = rowKey;
    }

    return (
      <TableContainer className="data-table">
        {this.renderToolbar()}
        <Table {...tableProps} />
      </TableContainer>
    );
  }
}

export default DataTable;
