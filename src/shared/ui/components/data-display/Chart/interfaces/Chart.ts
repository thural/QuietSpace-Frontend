/**
 * Chart Component Interfaces
 * 
 * Type definitions for the Chart component with various chart types and data structures.
 */

import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Chart data point interface
 */
export interface IChartDataPoint {
  /** X-axis value */
  x: string | number | Date;
  /** Y-axis value */
  y: number;
  /** Optional label for tooltips */
  label?: string;
  /** Optional color override */
  color?: string;
  /** Additional data properties */
  [key: string]: any;
}

/**
 * Chart series interface
 */
export interface IChartSeries {
  /** Series name */
  name: string;
  /** Series data points */
  data: IChartDataPoint[];
  /** Series color */
  color?: string;
  /** Chart type for this series */
  type?: 'line' | 'bar' | 'area' | 'scatter';
  /** Series styling */
  style?: {
    strokeWidth?: number;
    fillOpacity?: number;
    strokeOpacity?: number;
    dashArray?: string;
  };
}

/**
 * Chart axis configuration
 */
export interface IChartAxis {
  /** Axis type */
  type?: 'linear' | 'time' | 'category' | 'log';
  /** Axis position */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /** Axis label */
  label?: string;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Show grid lines */
  grid?: boolean;
  /** Tick format */
  tickFormat?: string;
}

/**
 * Chart legend configuration
 */
export interface IChartLegend {
  /** Show legend */
  show?: boolean;
  /** Legend position */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Legend orientation */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Chart tooltip configuration
 */
export interface IChartTooltip {
  /** Show tooltips */
  show?: boolean;
  /** Tooltip format */
  format?: string;
  /** Custom tooltip renderer */
  renderer?: (point: IChartDataPoint, series: IChartSeries) => React.ReactNode;
}

/**
 * Chart animation configuration
 */
export interface IChartAnimation {
  /** Enable animations */
  enabled?: boolean;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Animation easing */
  easing?: string;
}

/**
 * Chart Props
 */
export interface IChartProps extends IBaseComponentProps {
  /** Chart data series */
  data: IChartSeries[];
  /** Chart type */
  type?: 'line' | 'bar' | 'area' | 'scatter' | 'pie' | 'donut';
  /** Chart width */
  width?: number | string;
  /** Chart height */
  height?: number | string;
  /** Responsive sizing */
  responsive?: boolean;
  /** X-axis configuration */
  xAxis?: IChartAxis;
  /** Y-axis configuration */
  yAxis?: IChartAxis;
  /** Legend configuration */
  legend?: IChartLegend;
  /** Tooltip configuration */
  tooltip?: IChartTooltip;
  /** Animation configuration */
  animation?: IChartAnimation;
  /** Chart theme */
  theme?: 'light' | 'dark' | 'auto';
  /** Show data labels */
  showDataLabels?: boolean;
  /** Custom CSS class */
  className?: string;
}

/**
 * Chart State
 */
export interface IChartState extends IBaseComponentState {
  /** Chart dimensions */
  dimensions: {
    width: number;
    height: number;
  };
  /** Hovered data point */
  hoveredPoint?: {
    series: IChartSeries;
    point: IChartDataPoint;
    x: number;
    y: number;
  };
  /** Selected data points */
  selectedPoints: Array<{
    series: IChartSeries;
    point: IChartDataPoint;
  }>;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error?: Error;
}
