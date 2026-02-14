/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { 
    IDataTableProps, 
    IDataTableState,
    IDataTableColumn,
    IDataTableSelection,
    IDataTableSort,
    IDataTablePagination
} from './interfaces';
import { 
    createDataTableContainerStyles,
    createTableToolbarStyles,
    createSearchInputStyles,
    createFilterDropdownStyles,
    createExportButtonStyles,
    createTableStyles,
    createPaginationStyles,
    createLoadingOverlayStyles,
    createEmptyStateStyles
} from './styles';

/**
 * Enterprise DataTable Component
 * 
 * Provides advanced data table functionality with:
 * - Search and filtering capabilities
 * - Export functionality
 * - Pagination and sorting
 * - Row selection
 * - Responsive design
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class DataTable<T = any> extends BaseClassComponent<IDataTableProps<T>, IDataTableState> {
  private searchTimeout?: number;

  protected override getInitialState(): Partial<IDataTableState> {
    return {
      currentPage: 1,
      pageSize: 10,
      selectedRowKeys: [],
      searchQuery: '',
      activeFilters: {},
      loading: false
    };
  }

  protected override onMount(): void {
    super.onMount();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

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
   * Handle search
   */
  private handleSearch = (query: string): void => {
    const { search } = this.props;
    
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = window.setTimeout(() => {
      this.safeSetState({ searchQuery: query });
      
      if (search?.onSearch) {
        search.onSearch(query);
      }
    }, search?.debounceTime || 300);
  };

  /**
   * Handle filter change
   */
  private handleFilterChange = (key: string, value: any): void => {
    const { filters } = this.props;
    const { activeFilters } = this.state;
    
    const newFilters = { ...activeFilters, [key]: value };
    
    if (!value) {
      delete newFilters[key];
    }
    
    this.safeSetState({ activeFilters: newFilters });
    
    const filter = filters?.find(f => f.key === key);
    if (filter?.onChange) {
      filter.onChange(value);
    }
  };

  /**
   * Handle export
   */
  private handleExport = (format: string): void => {
    const { export: exportConfig, dataSource } = this.props;
    
    if (exportConfig?.onExport) {
      exportConfig.onExport(format, dataSource);
    }
  };

  /**
   * Handle sort change
   */
  private handleSortChange = (field: string): void => {
    const { sort } = this.state;
    let newSort: IDataTableSort;

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
   * Render toolbar
   */
  private renderToolbar = (): React.ReactNode => {
    const { search, filters, export: exportConfig } = this.props;
    const { activeFilters } = this.state;

    if (!search && !filters && !exportConfig) return null;

    return (
      <div css={createTableToolbarStyles()}>
        <div className="toolbar-left">
          {search && (
            <div css={createSearchInputStyles()}>
              <input
                type="text"
                className="search-input"
                placeholder={search.placeholder || 'Search...'}
                onChange={(e) => this.handleSearch(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          )}
          
          {filters && (
            <div css={createFilterDropdownStyles()}>
              <button className={`filter-button ${Object.keys(activeFilters).length > 0 ? 'active' : ''}`}>
                Filters {Object.keys(activeFilters).length > 0 && `(${Object.keys(activeFilters).length})`}
                <span>▼</span>
              </button>
              
              <div className="filter-dropdown" style={{ display: 'none' }}>
                {filters.map((filter) => (
                  <div key={filter.key} className="filter-item">
                    <label className="filter-label">{filter.label}</label>
                    {filter.type === 'text' && (
                      <input
                        type="text"
                        className="filter-input"
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => this.handleFilterChange(filter.key, e.target.value)}
                      />
                    )}
                    {filter.type === 'select' && (
                      <select
                        className="filter-select"
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => this.handleFilterChange(filter.key, e.target.value)}
                      >
                        <option value="">All</option>
                        {filter.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
                
                <div className="filter-actions">
                  <button onClick={() => this.safeSetState({ activeFilters: {} })}>
                    Clear
                  </button>
                  <button className="primary">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="toolbar-right">
          {exportConfig && exportConfig.showButton !== false && (
            <div css={createExportButtonStyles()}>
              <button className="export-button">
                Export <span>▼</span>
              </button>
              
              <div className="export-dropdown" style={{ display: 'none' }}>
                {exportConfig.formats.map((format) => (
                  <button
                    key={format}
                    className="export-option"
                    onClick={() => this.handleExport(format)}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render table header
   */
  private renderTableHeader = (): React.ReactNode => {
    const { columns, selection, size = 'middle' } = this.props;
    const { sort } = this.state;

    return (
      <thead>
        <tr>
          {selection && (
            <th>
              <input
                type={selection.type}
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
    const { dataSource, columns, selection, size = 'middle' } = this.props;
    const { selectedRowKeys } = this.state;

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
      <tbody>
        {dataSource.map((record, index) => {
          const rowKey = this.getRowKey(record, index);
          const isSelected = selectedRowKeys.includes(rowKey);

          return (
            <tr key={rowKey} className={isSelected ? 'selected' : ''}>
              {selection && (
                <td>
                  <input
                    type={selection.type}
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
                <td key={column.key}>
                  {column.render 
                    ? column.render((record as any)[column.key], record, index)
                    : column.format
                    ? column.format((record as any)[column.key])
                    : (record as any)[column.key]
                  }
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
    const { pagination, dataSource } = this.props;
    const { currentPage, pageSize } = this.state;

    if (!pagination) return null;

    const totalPages = Math.ceil(dataSource.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, dataSource.length);

    return (
      <div css={createPaginationStyles()}>
        <div className="pagination-info">
          Showing {startIndex}-{endIndex} of {dataSource.length} records
        </div>
        <div className="pagination-controls">
          <button
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
                className={pageNum === currentPage ? 'active' : ''}
                onClick={() => this.handlePageChange(pageNum, pageSize)}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
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
      showHeader = true,
      className = '',
      testId
    } = this.props;

    const containerStyles = createDataTableContainerStyles(size, bordered, className);
    const tableStyles = createTableStyles(size);

    return (
      <div css={containerStyles} data-testid={testId}>
        {this.renderToolbar()}
        
        <div style={{ overflowX: 'auto' }}>
          <table css={tableStyles}>
            {showHeader && this.renderTableHeader()}
            {this.renderTableBody()}
          </table>
        </div>
        
        {this.renderPagination()}
        {this.renderLoading()}
      </div>
    );
  }
}

export default DataTable;
