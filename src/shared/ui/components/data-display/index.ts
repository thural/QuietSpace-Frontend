/**
 * Data Display Components Index
 * 
 * Exports all data display components from the shared UI library.
 * Includes Table, DataTable, DataGrid, and future data visualization components.
 */

export { Table } from './Table';
export type { ITableProps, ITableColumn, ITablePagination, ITableSelection } from './Table';

export { DataTable } from './DataTable';
export type { IDataTableProps, IDataTableFilter, IDataTableExport, IDataTableSearch } from './DataTable';

export { DataGrid } from './DataGrid';
export type { IDataGridProps, IDataGridColumnResize, IDataGridCellEditor } from './DataGrid';

// Re-export styles for convenience
export { TableStyles } from './Table.styles';
