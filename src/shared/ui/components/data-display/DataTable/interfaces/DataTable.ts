/**
 * DataTable Component Interfaces
 * 
 * Type definitions for the DataTable component with data management features.
 */

import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

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
  /** Search fields */
  fields?: string[];
  /** Search handler */
  onSearch?: (query: string) => void;
  /** Show search button */
  showButton?: boolean;
  /** Search debounce time in ms */
  debounceTime?: number;
}

/**
 * DataTable column configuration interface
 */
export interface IDataTableColumn<T = any> {
  /** Column key */
  key: string;
  /** Column title */
  title: string;
  /** Column width */
  width?: number;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Column is sortable */
  sortable?: boolean;
  /** Column is filterable */
  filterable?: boolean;
  /** Column render function */
  render?: (value: any, record: T, index: number) => React.ReactNode;
  /** Column format function */
  format?: (value: any) => string;
  /** Column fixed position */
  fixed?: 'left' | 'right';
}

/**
 * DataTable pagination configuration interface
 */
export interface IDataTablePagination {
  /** Current page */
  current: number;
  /** Page size */
  pageSize: number;
  /** Total records */
  total: number;
  /** Show size changer */
  showSizeChanger?: boolean;
  /** Show quick jumper */
  showQuickJumper?: boolean;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Page change handler */
  onChange?: (page: number, pageSize: number) => void;
}

/**
 * DataTable selection configuration interface
 */
export interface IDataTableSelection {
  /** Selection type */
  type: 'checkbox' | 'radio';
  /** Selected row keys */
  selectedRowKeys: (string | number)[];
  /** Selection change handler */
  onChange?: (selectedRowKeys: (string | number)[], selectedRows: any[]) => void;
}

/**
 * DataTable sort configuration interface
 */
export interface IDataTableSort {
  /** Sort field */
  field: string;
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * DataTable Props
 */
export interface IDataTableProps<T = any> extends IBaseComponentProps {
  /** Data source */
  dataSource: T[];
  /** Columns configuration */
  columns: IDataTableColumn<T>[];
  /** Row key */
  rowKey: string | ((record: T) => string | number);
  /** Loading state */
  loading?: boolean;
  /** Search configuration */
  search?: IDataTableSearch;
  /** Filters */
  filters?: IDataTableFilter[];
  /** Export configuration */
  export?: IDataTableExport;
  /** Pagination configuration */
  pagination?: IDataTablePagination | false;
  /** Selection configuration */
  selection?: IDataTableSelection;
  /** Sort configuration */
  sort?: IDataTableSort;
  /** Bordered */
  bordered?: boolean;
  /** Size */
  size?: 'small' | 'middle' | 'large';
  /** Show header */
  showHeader?: boolean;
  /** Show footer */
  showFooter?: boolean;
  /** Custom CSS class */
  className?: string;
}

/**
 * DataTable State
 */
export interface IDataTableState extends IBaseComponentState {
  /** Current page */
  currentPage: number;
  /** Page size */
  pageSize: number;
  /** Selected row keys */
  selectedRowKeys: (string | number)[];
  /** Search query */
  searchQuery: string;
  /** Active filters */
  activeFilters: Record<string, any>;
  /** Sort configuration */
  sort?: IDataTableSort;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error?: Error;
}
