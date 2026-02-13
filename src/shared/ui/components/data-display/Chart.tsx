/**
 * Chart Component - Enterprise Data Visualization
 * 
 * A comprehensive chart component supporting multiple chart types with
 * enterprise-grade features including animations, tooltips, legends, and
 * responsive design. Follows enterprise patterns with class-based architecture.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent, createRef, RefObject } from 'react';
import { TableContainer } from './Table.styles';
import { getColor, getTypography } from '../utils';

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
 * Chart component props interface
 */
export interface IChartProps {
  /** Chart data series */
  data: IChartSeries[];
  /** Chart type */
  type?: 'line' | 'bar' | 'area' | 'scatter' | 'pie' | 'doughnut';
  /** Chart dimensions */
  width?: number | string;
  /** Chart height */
  height?: number | string;
  /** Chart title */
  title?: string;
  /** Chart subtitle */
  subtitle?: string;
  /** Show data labels */
  showDataLabels?: boolean;
  /** Data label format function */
  dataLabelFormat?: (point: IChartDataPoint) => string;
  /** Responsive configuration */
  responsive?: boolean;
  /** Theme colors */
  colors?: string[];
  /** Loading state */
  loading?: boolean;
  /** Empty state text */
  emptyText?: React.ReactNode;
  /** Click handler */
  onClick?: (point: IChartDataPoint, series: IChartSeries) => void;
  /** Hover handler */
  onHover?: (point: IChartDataPoint | null, series: IChartSeries | null) => void;
  /** Theme object */
  theme?: any;
}

/**
 * Chart component state interface
 */
interface IChartState {
  hoveredPoint: IChartDataPoint | null;
  hoveredSeries: IChartSeries | null;
  animationProgress: number;
}

/**
 * Chart Component
 * 
 * Enterprise-grade chart component with multiple chart types,
 * animations, tooltips, legends, and responsive design.
 */
export class Chart extends PureComponent<IChartProps, IChartState> {
  static defaultProps: Partial<IChartProps> = {
    type: 'line',
    width: '100%',
    height: 400,
    responsive: true,
    colors: [], // Will be populated from theme
    loading: false,
    emptyText: 'No data available',
    showDataLabels: false,
  };

  private canvasRef: RefObject<HTMLCanvasElement | null>;
  private containerRef: RefObject<HTMLDivElement | null>;
  private animationFrameId: number | null = null;

  constructor(props: IChartProps) {
    super(props);

    this.state = {
      hoveredPoint: null,
      hoveredSeries: null,
      animationProgress: 0,
    };

    this.canvasRef = createRef();
    this.containerRef = createRef();
  }

  override componentDidMount() {
    this.drawChart();
    this.setupEventListeners();
  }

  override componentDidUpdate(prevProps: IChartProps) {
    if (prevProps.data !== this.props.data || prevProps.type !== this.props.type) {
      this.drawChart();
    }
  }

  override componentWillUnmount() {
    this.cleanup();
  }

  /**
   * Clean up resources
   */
  private cleanup = () => {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  };

  /**
   * Get theme colors for chart
   */
  private getThemeColors = (): string[] => {
    const { colors, theme } = this.props;

    // If custom colors are provided, use them
    if (colors && colors.length > 0) {
      return colors;
    }

    // Otherwise, use theme colors with fallbacks
    if (theme) {
      return [
        getColor(theme, 'brand.500') || '#3b82f6',
        getColor(theme, 'semantic.success') || '#10b981',
        getColor(theme, 'semantic.warning') || '#f59e0b',
        getColor(theme, 'semantic.error') || '#ef4444',
        getColor(theme, 'brand.600') || '#2563eb',
        getColor(theme, 'text.primary') || '#8b5cf6'
      ];
    }

    // Fallback to default colors
    return ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  };

  /**
   * Setup event listeners
   */
  private setupEventListeners = () => {
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', this.handleMouseMove);
    canvas.addEventListener('mouseleave', this.handleMouseLeave);
    canvas.addEventListener('click', this.handleClick);
  };

  /**
   * Handle mouse move
   */
  private handleMouseMove = (event: MouseEvent) => {
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const point = this.getPointAtPosition(x, y);
    const series = point ? this.getSeriesForPoint(point) : null;

    if (point !== this.state.hoveredPoint || series !== this.state.hoveredSeries) {
      this.setState({ hoveredPoint: point, hoveredSeries: series });
      this.props.onHover?.(point, series);
    }
  };

  /**
   * Handle mouse leave
   */
  private handleMouseLeave = () => {
    if (this.state.hoveredPoint || this.state.hoveredSeries) {
      this.setState({ hoveredPoint: null, hoveredSeries: null });
      this.props.onHover?.(null, null);
    }
  };

  /**
   * Handle click
   */
  private handleClick = (event: MouseEvent) => {
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const point = this.getPointAtPosition(x, y);
    const series = point ? this.getSeriesForPoint(point) : null;

    if (point && series) {
      this.props.onClick?.(point, series);
    }
  };

  /**
   * Get point at position
   */
  private getPointAtPosition = (x: number, y: number): IChartDataPoint | null => {
    const canvas = this.canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Simple hit detection - can be enhanced with more sophisticated algorithms
    const { data, type } = this.props;
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    for (const series of data) {
      for (const point of series.data) {
        let px = 0;
        let py = 0;

        switch (type) {
          case 'line':
          case 'area':
            px = padding + (this.getXPosition(point.x, series.data) * chartWidth);
            py = padding + chartHeight - (this.getYPosition(point.y, data) * chartHeight);
            break;
          case 'bar':
            px = padding + (this.getXPosition(point.x, series.data) * chartWidth);
            py = padding + chartHeight - (this.getYPosition(point.y, data) * chartHeight);
            break;
          case 'scatter':
            px = padding + (this.getXPosition(point.x, series.data) * chartWidth);
            py = padding + chartHeight - (this.getYPosition(point.y, data) * chartHeight);
            break;
        }

        if (Math.abs(x - px) < 10 && Math.abs(y - py) < 10) {
          return point;
        }
      }
    }

    return null;
  };

  /**
   * Get series for point
   */
  private getSeriesForPoint = (point: IChartDataPoint): IChartSeries | null => {
    return this.props.data.find(series => series.data.includes(point)) || null;
  };

  /**
   * Get X position for value
   */
  private getXPosition = (value: any, data: IChartDataPoint[]): number => {
    const allValues = data.map(d => typeof d.x === 'number' ? d.x : 0);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min;

    if (range === 0) return 0.5;
    return ((typeof value === 'number' ? value : 0) - min) / range;
  };

  /**
   * Get Y position for value
   */
  private getYPosition = (value: number, data: IChartSeries[]): number => {
    const allValues = data.flatMap(s => s.data).map(d => d.y);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min;

    if (range === 0) return 0.5;
    return (value - min) / range;
  };

  /**
   * Draw chart
   */
  private drawChart = () => {
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, type, data, colors, showDataLabels } = this.props;

    // Set canvas size
    const parseDimension = (value: number | string | undefined, fallback: number): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? fallback : parsed;
      }
      return fallback;
    };

    canvas.width = parseDimension(width, 800);
    canvas.height = parseDimension(height, 400);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw based on chart type
    switch (type) {
      case 'line':
        this.drawLineChart(ctx, data, colors || []);
        break;
      case 'bar':
        this.drawBarChart(ctx);
        break;
      case 'area':
        this.drawAreaChart(ctx);
        break;
      case 'scatter':
        this.drawScatterChart(ctx);
        break;
      case 'pie':
        this.drawPieChart(ctx);
        break;
      case 'doughnut':
        this.drawDoughnutChart(ctx);
        break;
      default:
        this.drawLineChart(ctx, data, colors || []);
    }

    if (showDataLabels) {
      this.drawDataLabels(ctx);
    }

    // Draw axes
    this.drawAxes(ctx);
  };

  /**
   * Draw line chart
   */
  private drawLineChart = (ctx: CanvasRenderingContext2D, data: IChartSeries[], colors: string[]) => {
    const padding = 40;
    const chartWidth = ctx.canvas.width - padding * 2;
    const chartHeight = ctx.canvas.height - padding * 2;
    const themeColors = this.getThemeColors();

    data.forEach((series, seriesIndex) => {
      const color = series.color || (colors && colors[seriesIndex % colors.length]) || themeColors[seriesIndex % themeColors.length] || '#3b82f6';
      const points = series.data.map(point => ({
        x: padding + (this.getXPosition(point.x, series.data) * chartWidth),
        y: padding + chartHeight - (this.getYPosition(point.y, data) * chartHeight),
      }));

      // Draw line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();

      // Draw points
      points.forEach(point => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };

  /**
   * Draw bar chart
   */
  private drawBarChart = (ctx: CanvasRenderingContext2D) => {
    const { data, colors } = this.props;
    const padding = 40;
    const chartWidth = ctx.canvas.width - padding * 2;
    const chartHeight = ctx.canvas.height - padding * 2;
    const barWidth = chartWidth / ((data[0]?.data.length) || 1) * 0.8;
    const themeColors = this.getThemeColors();

    data.forEach((series, seriesIndex) => {
      const color = series.color || (colors && colors[seriesIndex % colors.length]) || themeColors[seriesIndex % themeColors.length] || '#3b82f6';

      series.data.forEach((point, pointIndex) => {
        const x = padding + ((pointIndex / ((series.data.length - 1) || 1)) * chartWidth);
        const barHeight = (this.getYPosition(point.y, data) * chartHeight);
        const y = padding + chartHeight - barHeight;

        ctx.fillStyle = color;
        ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);
      });
    });
  };

  /**
   * Draw area chart
   */
  private drawAreaChart = (ctx: CanvasRenderingContext2D) => {
    const { data, colors } = this.props;
    const padding = 40;
    const chartWidth = ctx.canvas.width - padding * 2;
    const chartHeight = ctx.canvas.height - padding * 2;
    const themeColors = this.getThemeColors();

    data.forEach((series, seriesIndex) => {
      const color = series.color || (colors && colors[seriesIndex % colors.length]) || themeColors[seriesIndex % themeColors.length] || '#3b82f6';
      const points = series.data.map(point => ({
        x: padding + (this.getXPosition(point.x, series.data) * chartWidth),
        y: padding + chartHeight - (this.getYPosition(point.y, data) * chartHeight),
      }));

      // Draw area
      ctx.fillStyle = (color || '#3b82f6') + '33'; // Add transparency
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, padding + chartHeight);
          ctx.lineTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      if (points.length > 0) {
        const lastPoint = points[points.length - 1];
        if (lastPoint) {
          ctx.lineTo(lastPoint.x, padding + chartHeight);
        }
      }
      ctx.closePath();
      ctx.fill();

      // Draw line
      ctx.strokeStyle = color || '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });
  };

  /**
   * Draw scatter chart
   */
  private drawScatterChart = (ctx: CanvasRenderingContext2D) => {
    const { data, colors } = this.props;
    const padding = 40;
    const chartWidth = ctx.canvas.width - padding * 2;
    const chartHeight = ctx.canvas.height - padding * 2;
    const themeColors = this.getThemeColors();

    data.forEach((series, seriesIndex) => {
      const color = series.color || (colors && colors[seriesIndex % colors.length]) || themeColors[seriesIndex % themeColors.length] || '#3b82f6';

      series.data.forEach(point => {
        const x = padding + (this.getXPosition(point.x, series.data) * chartWidth);
        const y = padding + chartHeight - (this.getYPosition(point.y, data) * chartHeight);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };

  /**
   * Draw pie chart
   */
  private drawPieChart = (ctx: CanvasRenderingContext2D) => {
    const { data } = this.props;
    const padding = 40;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - padding;
    const themeColors = this.getThemeColors();

    const total = data.reduce((sum, series) => {
      return sum + series.data.reduce((s, p) => s + p.y, 0);
    }, 0);

    let currentAngle = -Math.PI / 2;

    data.forEach((series, seriesIndex) => {
      const seriesTotal = series.data.reduce((s, p) => s + p.y, 0);
      const angle = (seriesTotal / total) * 2 * Math.PI;
      const color = series.color || themeColors[seriesIndex % themeColors.length] || '#3b82f6';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle);
      ctx.closePath();
      ctx.fill();

      currentAngle += angle;
    });
  };

  /**
   * Draw doughnut chart
   */
  private drawDoughnutChart = (ctx: CanvasRenderingContext2D) => {
    const { data } = this.props;
    const padding = 40;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) - padding;
    const innerRadius = outerRadius * 0.6;
    const themeColors = this.getThemeColors();

    const total = data.reduce((sum, series) => {
      return sum + series.data.reduce((s, p) => s + p.y, 0);
    }, 0);

    let currentAngle = -Math.PI / 2;

    data.forEach((series, seriesIndex) => {
      const seriesTotal = series.data.reduce((s, p) => s + p.y, 0);
      const angle = (seriesTotal / total) * 2 * Math.PI;
      const color = series.color || themeColors[seriesIndex % themeColors.length] || '#3b82f6';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + angle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + angle, currentAngle, true);
      ctx.closePath();
      ctx.fill();

      currentAngle += angle;
    });
  };

  /**
   * Draw data labels
   */
  private drawDataLabels = (ctx: CanvasRenderingContext2D) => {
    const { theme, data, dataLabelFormat } = this.props;
    const chartWidth = ctx.canvas.width - 80;
    const chartHeight = ctx.canvas.height - 80;

    ctx.fillStyle = theme ? getColor(theme, 'text.primary') : '#333';
    ctx.font = theme ? getTypography(theme, 'fontSize.sm') + ' sans-serif' : '12px sans-serif';
    ctx.textAlign = 'center';

    data.forEach(series => {
      series.data.forEach(point => {
        const x = 40 + (this.getXPosition(point.x, series.data) * chartWidth);
        const y = 40 + chartHeight - (this.getYPosition(point.y, data) * chartHeight);

        const label = dataLabelFormat ? dataLabelFormat(point) : String(point.y);
        ctx.fillText(label, x, y - 10);
      });
    });
  };

  /**
   * Draw axes
   */
  private drawAxes = (ctx: CanvasRenderingContext2D) => {
    const { theme } = this.props;
    const chartWidth = ctx.canvas.width - 80;
    const chartHeight = ctx.canvas.height - 80;

    ctx.strokeStyle = theme ? getColor(theme, 'border.light') : '#ccc';
    ctx.lineWidth = 1;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(40, 40 + chartHeight);
    ctx.lineTo(40 + chartWidth, 40 + chartHeight);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(40, 40);
    ctx.lineTo(40, 40 + chartHeight);
    ctx.stroke();
  };

  override render() {
    const { width, height, title, subtitle, loading, emptyText } = this.props;

    return (
      <TableContainer className="chart-container" ref={this.containerRef}>
        {(title || subtitle) && (
          <div className="chart-header">
            {title && <h3 className="chart-title">{title}</h3>}
            {subtitle && <p className="chart-subtitle">{subtitle}</p>}
          </div>
        )}

        <div className="chart-content" style={{ position: 'relative' }}>
          <canvas
            ref={this.canvasRef}
            width={width}
            height={height}
            className="chart-canvas"
          />

          {loading && (
            <div className="chart-loading">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading...</div>
            </div>
          )}

          {!loading && this.props.data.length === 0 && (
            <div className="chart-empty">
              {emptyText}
            </div>
          )}
        </div>
      </TableContainer>
    );
  }
}

export default Chart;
