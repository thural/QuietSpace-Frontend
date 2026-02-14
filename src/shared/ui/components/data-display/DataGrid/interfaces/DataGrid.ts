/**
 * DataGrid Component Interfaces
 * 
 * Type definitions for the DataGrid component with advanced grid features.
 */

import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Column resize configuration interface
 */
export interface IDataGridColumnResize {
  /** Column key */
  key: string;
  /** Current width */
  width: number;
  /** Minimum width */
  minWidth?: number;
  /** Maximum width */
  maxWidth?: number;
  /** Resize handler */
  onResize?: (key: string, width: number) => void;
}

/**
 * Data grid cell editor configuration interface
 */
export interface IDataGridCellEditor {
  /** Editor type */
  type: 'text' | 'number' | 'select' | 'date' | 'checkbox';
  /** Editor options for select type */
  options?: Array<{ label: string; value: any }>;
  /** Validation function */
  validate?: (value: any) => boolean | string;
  /** Edit handler */
  onEdit?: (rowKey: string | number, field: string, value: any) => void;
}

/**
 * Data grid column configuration interface
 */
export interface IDataGridColumn<T = any> {
  /** Column key */
  key: string;
  /** Column title */
  title: string;
  /** Column width */
  width?: number;
  /** Minimum width */
  minWidth?: number;
  /** Maximum width */
  maxWidth?: number;
  /** Column is resizable */
  resizable?: boolean;
  /** Column is sortable */
  sortable?: boolean;
  /** Column is filterable */
  filterable?: boolean;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Column render function */
  render?: (value: any, record: T, index: number) => React.ReactNode;
  /** Cell editor configuration */
  editor?: IDataGridCellEditor;
  /** Column fixed position */
  fixed?: 'left' | 'right';
}

/**
 * Data grid pagination configuration interface
 */
export interface IDataGridPagination {
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
 * Data grid selection configuration interface
 */
export interface IDataGridSelection {
  /** Selection type */
  type: 'checkbox' | 'radio';
  /** Selected row keys */
  selectedRowKeys: (string | number)[];
  /** Selection change handler */
  onChange?: (selectedRowKeys: (string | number)[], selectedRows: any[]) => void;
  /** Get checkbox props */
  getCheckboxProps?: (record: any) => { disabled?: boolean };
}

/**
 * Data grid filter configuration interface
 */
export interface IDataGridFilter {
  /** Filter key */
  key: string;
  /** Filter value */
  value: any;
  /** Filter operator */
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
}

/**
 * Data grid sort configuration interface
 */
export interface IDataGridSort {
  /** Sort field */
  field: string;
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Data grid scroll configuration interface
 */
export interface IDataGridScroll {
  /** Horizontal scroll */
  x?: number | string;
  /** Vertical scroll */
  y?: number | string;
}

/**
 * Data grid Props
 */
export interface IDataGridProps<T = any> extends IBaseComponentProps {
  /** Data source */
  dataSource: T[];
  /** Columns configuration */
  columns: IDataGridColumn<T>[];
  /** Row key */
  rowKey: string | ((record: T) => string | number);
  /** Loading state */
  loading?: boolean;
  /** Pagination configuration */
  pagination?: IDataGridPagination | false;
  /** Selection configuration */
  selection?: IDataGridSelection;
  /** Filters */
  filters?: IDataGridFilter[];
  /** Sort configuration */
  sort?: IDataGridSort;
  /** Scroll configuration */
  scroll?: IDataGridScroll;
  /** Row selection */
  rowSelection?: IDataGridSelection;
  /** Expandable rows */
  expandable?: {
    expandedRowKeys: (string | number)[];
    onExpandedRowsChange?: (expandedRows: (string | number)[]) => void;
    expandedRowRender?: (record: T, index: number, indent: number, expanded: boolean) => React.ReactNode;
  };
  /** Virtual scrolling */
  virtual?: boolean;
  /** Bordered */
  bordered?: boolean;
  /** Size */
  size?: 'small' | 'middle' | 'large';
  /** Table layout */
  tableLayout?: 'auto' | 'fixed';
  /** Custom CSS class */
  className?: string;
}

/**
 * Data grid State
 */
export interface IDataGridState extends IBaseComponentState {
  /** Current page */
  currentPage: number;
  /** Page size */
  pageSize: number;
  /** Selected row keys */
  selectedRowKeys: (string | number)[];
  /** Expanded row keys */
  expandedRowKeys: (string | number)[];
  /** Filters */
  filters: IDataGridFilter[];
  /** Sort configuration */
  sort?: IDataGridSort;
  /** Column widths */
  columnWidths: Record<string, number>;
  /** Editing cell */
  editingCell?: {
    rowKey: string | number;
    field: string;
    value: any;
  };
  /** Loading state */
  loading: boolean;
  /** Error state */
  error?: Error;
}
