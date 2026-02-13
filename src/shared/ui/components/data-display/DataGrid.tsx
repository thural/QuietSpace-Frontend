/**
 * DataGrid Component - Enterprise Advanced Grid
 * 
 * A sophisticated grid component with column resizing,
 * advanced filtering, and enterprise-grade performance features.
 * Follows enterprise patterns with class-based architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent, createRef, RefObject } from 'react';
import { TableContainer } from './Table.styles';

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
 * Data grid component props interface
 */
export interface IDataGridProps<T = any> {
  /** Data source */
  dataSource: T[];
  /** Enhanced columns with grid-specific features */
  columns: Array<{
    key: string;
    title: string;
    dataIndex: keyof T;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    sortable?: boolean;
    resizable?: boolean;
    editable?: boolean;
    render?: (value: any, record: T, index: number) => React.ReactNode;
    editor?: IDataGridCellEditor;
    align?: 'left' | 'center' | 'right';
  }>;
  /** Column resize configuration */
  columnResize?: {
    enabled: boolean;
    onResize?: (key: string, width: number) => void;
  };
  /** Row height */
  rowHeight?: number;
  /** Enable cell editing */
  cellEditing?: {
    enabled: boolean;
    mode: 'click' | 'doubleClick';
    onSave?: (rowKey: string | number, field: string, value: any) => void;
  };
  /** Grid height */
  height?: number | string;
  /** Grid width */
  width?: number | string;
  /** Show column headers */
  showColumnHeaders?: boolean;
  /** Show row numbers */
  showRowNumbers?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Empty state text */
  emptyText?: React.ReactNode;
  /** Table row key extractor */
  rowKey?: string | ((record: T) => string | number);
}

/**
 * Data grid component state interface
 */
interface IDataGridState<T = any> {
  columnWidths: Record<string, number>;
  resizingColumn: string | null;
  editingCell: { rowKey: string | number; field: string } | null;
}

/**
 * DataGrid Component
 * 
 * Enterprise-grade data grid with column resizing and cell editing capabilities.
 */
export class DataGrid<T = any> extends PureComponent<IDataGridProps<T>, IDataGridState<T>> {
  static defaultProps: Partial<IDataGridProps> = {
    columnResize: { enabled: false },
    rowHeight: 40,
    cellEditing: { enabled: false, mode: 'click' },
    showColumnHeaders: true,
    showRowNumbers: false,
    loading: false,
    emptyText: 'No data available',
  };

  private gridRef: RefObject<HTMLDivElement | null>;
  private resizeStartX: number = 0;
  private resizeStartWidth: number = 0;

  constructor(props: IDataGridProps<T>) {
    super(props);

    // Initialize column widths
    const columnWidths: Record<string, number> = {};
    props.columns.forEach(column => {
      columnWidths[column.key] = column.width || 120;
    });

    this.state = {
      columnWidths,
      resizingColumn: null,
      editingCell: null,
    };

    this.gridRef = createRef();
  }

  /**
   * Get row key for a record
   */
  private getRowKey = (record: T, index: number): string | number => {
    const { rowKey } = this.props;

    if (typeof rowKey === 'function') {
      return rowKey(record);
    }

    if (typeof rowKey === 'string') {
      return (record as any)[rowKey] || index;
    }

    return index;
  };

  /**
   * Handle column resize start
   */
  private handleColumnResizeStart = (columnKey: string, event: React.MouseEvent) => {
    const { columnResize } = this.props;
    if (!columnResize?.enabled) return;

    this.resizeStartX = event.clientX;
    this.resizeStartWidth = this.state.columnWidths[columnKey] || 120;
    this.setState({ resizingColumn: columnKey });

    document.addEventListener('mousemove', this.handleColumnResizeMove);
    document.addEventListener('mouseup', this.handleColumnResizeEnd);
  };

  /**
   * Handle column resize move
   */
  private handleColumnResizeMove = (event: MouseEvent) => {
    const { resizingColumn, columnWidths } = this.state;
    if (!resizingColumn) return;

    const deltaX = event.clientX - this.resizeStartX;
    const newWidth = Math.max(50, (this.resizeStartWidth || 120) + deltaX);

    this.setState({
      columnWidths: {
        ...columnWidths,
        [resizingColumn]: newWidth,
      },
    });
  };

  /**
   * Handle column resize end
   */
  private handleColumnResizeEnd = () => {
    const { resizingColumn, columnWidths } = this.state;
    const { columnResize } = this.props;

    if (resizingColumn && columnResize?.onResize) {
      columnResize.onResize(resizingColumn, columnWidths[resizingColumn]);
    }

    this.setState({ resizingColumn: null });
    document.removeEventListener('mousemove', this.handleColumnResizeMove);
    document.removeEventListener('mouseup', this.handleColumnResizeEnd);
  };

  /**
   * Handle cell edit start
   */
  private handleCellEditStart = (rowKey: string | number, field: string) => {
    const { cellEditing } = this.props;
    if (!cellEditing?.enabled) return;

    this.setState({ editingCell: { rowKey, field } });
  };

  /**
   * Handle cell edit save
   */
  private handleCellEditSave = (rowKey: string | number, field: string, value: any) => {
    const { cellEditing } = this.props;

    // Validate value if validation function provided
    const column = this.props.columns.find(col => col.key === field);
    if (column?.editor?.validate) {
      const validation = column.editor.validate(value);
      if (validation !== true) {
        console.error('Validation failed:', validation);
        return;
      }
    }

    // Call save handler
    cellEditing?.onSave?.(rowKey, field, value);
    column?.editor?.onEdit?.(rowKey, field, value);

    this.setState({ editingCell: null });
  };

  /**
   * Handle cell edit cancel
   */
  private handleCellEditCancel = () => {
    this.setState({ editingCell: null });
  };

  /**
   * Render cell editor
   */
  private renderCellEditor = (record: T, field: string, value: any) => {
    const column = this.props.columns.find(col => col.key === field);
    if (!column?.editor) return null;

    const { type, options } = column.editor;

    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            defaultValue={value}
            autoFocus
            onBlur={(e) => this.handleCellEditSave(this.getRowKey(record, 0), field, (e.target as HTMLInputElement).value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                this.handleCellEditSave(this.getRowKey(record, 0), field, (e.target as HTMLInputElement).value);
              } else if (e.key === 'Escape') {
                this.handleCellEditCancel();
              }
            }}
            className="data-grid-cell-editor"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            defaultValue={value}
            autoFocus
            onBlur={(e) => this.handleCellEditSave(this.getRowKey(record, 0), field, Number((e.target as HTMLInputElement).value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                this.handleCellEditSave(this.getRowKey(record, 0), field, Number((e.target as HTMLInputElement).value));
              } else if (e.key === 'Escape') {
                this.handleCellEditCancel();
              }
            }}
            className="data-grid-cell-editor"
          />
        );
      case 'select':
        return (
          <select
            defaultValue={value}
            autoFocus
            onBlur={(e) => this.handleCellEditSave(this.getRowKey(record, 0), field, (e.target as HTMLSelectElement).value)}
            onChange={(e) => this.handleCellEditSave(this.getRowKey(record, 0), field, (e.target as HTMLSelectElement).value)}
            className="data-grid-cell-editor"
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'date':
        return (
          <input
            type="date"
            defaultValue={value}
            autoFocus
            onBlur={(e) => this.handleCellEditSave(this.getRowKey(record, 0), field, (e.target as HTMLInputElement).value)}
            className="data-grid-cell-editor"
          />
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            defaultChecked={value}
            autoFocus
            onChange={(e) => this.handleCellEditSave(this.getRowKey(record, 0), field, (e.target as HTMLInputElement).checked)}
            className="data-grid-cell-editor"
          />
        );
      default:
        return null;
    }
  };

  /**
   * Render column headers
   */
  private renderColumnHeaders = () => {
    const { columns, showColumnHeaders, columnResize } = this.props;
    const { columnWidths } = this.state;

    if (!showColumnHeaders) return null;

    return (
      <div className="data-grid-headers">
        {columns.map(column => (
          <div
            key={column.key}
            className="data-grid-header-cell"
            style={{ width: columnWidths[column.key] }}
          >
            {column.title}
            {columnResize?.enabled && column.resizable && (
              <div
                className="data-grid-resize-handle"
                onMouseDown={(e) => this.handleColumnResizeStart(column.key, e)}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  /**
   * Render data rows
   */
  private renderDataRows = () => {
    const { dataSource, columns, rowHeight, cellEditing, showRowNumbers } = this.props;
    const { editingCell } = this.state;

    return dataSource.map((record, index) => {
      const rowKey = this.getRowKey(record, index);

      return (
        <div
          key={rowKey}
          className="data-grid-row"
          style={{ height: rowHeight }}
        >
          {showRowNumbers && (
            <div className="data-grid-cell data-grid-row-number">
              {index + 1}
            </div>
          )}
          {columns.map(column => {
            const value = (record as any)[column.dataIndex];
            const isEditing = editingCell?.rowKey === rowKey && editingCell?.field === column.key;

            return (
              <div
                key={column.key}
                className={`data-grid-cell ${isEditing ? 'editing' : ''}`}
                style={{ width: this.state.columnWidths[column.key] }}
                onClick={() => {
                  if (cellEditing?.enabled && column.editable) {
                    this.handleCellEditStart(rowKey, column.key);
                  }
                }}
              >
                {isEditing ? (
                  this.renderCellEditor(record, column.key, value)
                ) : (
                  column.render ? column.render(value, record, index) : value
                )}
              </div>
            );
          })}
        </div>
      );
    });
  };

  override render() {
    const {
      dataSource,
      loading,
      emptyText,
      height = 400,
      width = '100%',
    } = this.props;

    const gridStyle = {
      height,
      width,
      overflow: 'auto',
    };

    return (
      <TableContainer className="data-grid" ref={this.gridRef} style={gridStyle}>
        {this.renderColumnHeaders()}

        <div className="data-grid-body">
          {loading ? (
            <div className="data-grid-loading">Loading...</div>
          ) : dataSource.length === 0 ? (
            <div className="data-grid-empty">{emptyText}</div>
          ) : (
            this.renderDataRows()
          )}
        </div>
      </TableContainer>
    );
  }
}

export default DataGrid;
