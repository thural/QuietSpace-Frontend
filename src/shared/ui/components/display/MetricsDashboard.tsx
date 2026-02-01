/**
 * Metrics Dashboard Component
 * 
 * A comprehensive metrics display component with grid layout and
 * flexible configuration for analytics and monitoring dashboards.
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Import reusable components from shared UI
import { MetricCard, IMetricCardProps } from '@shared/ui/components';

/**
 * Dashboard Metric interface
 */
export interface IDashboardMetric extends Omit<IMetricCardProps, 'onClick'> {
  id: string;
  onClick?: (metric: IDashboardMetric) => void;
}

/**
 * Dashboard Section interface
 */
export interface IDashboardSection {
  id: string;
  title: string;
  description?: string;
  metrics: IDashboardMetric[];
  columns?: number;
}

/**
 * Metrics Dashboard Props
 */
export interface IMetricsDashboardProps extends IBaseComponentProps {
  sections: IDashboardSection[];
  loading?: boolean;
  error?: string;
  variant?: 'default' | 'compact' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  gridColumns?: number;
  showSectionHeaders?: boolean;
  refreshInterval?: number;
  onRefresh?: () => void;
  onMetricClick?: (metric: IDashboardMetric) => void;
  className?: string;
}

/**
 * Metrics Dashboard State
 */
export interface IMetricsDashboardState extends IBaseComponentState {
  lastRefresh: Date | null;
  isRefreshing: boolean;
  expandedSections: Set<string>;
}

/**
 * Metrics Dashboard Component
 * 
 * Provides comprehensive metrics display with:
 * - Multiple dashboard sections with configurable layouts
 * - Flexible metric cards with various sizes and colors
 * - Real-time refresh capabilities
 * - Expandable/collapsible sections
 * - Loading and error states
 * - Responsive grid layouts
 * - Click interactions and hover effects
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class MetricsDashboard extends BaseClassComponent<IMetricsDashboardProps, IMetricsDashboardState> {
  private refreshTimer: number | null = null;

  protected override getInitialState(): Partial<IMetricsDashboardState> {
    return {
      lastRefresh: new Date(),
      isRefreshing: false,
      expandedSections: new Set()
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.startRefreshTimer();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.stopRefreshTimer();
  }

  /**
   * Start refresh timer
   */
  private startRefreshTimer = (): void => {
    const { refreshInterval } = this.props;

    if (refreshInterval && refreshInterval > 0) {
      this.refreshTimer = window.setInterval(() => {
        this.handleRefresh();
      }, refreshInterval);
    }
  };

  /**
   * Stop refresh timer
   */
  private stopRefreshTimer = (): void => {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  };

  /**
   * Handle refresh
   */
  private handleRefresh = (): void => {
    const { onRefresh } = this.props;

    this.safeSetState({ isRefreshing: true });

    if (onRefresh) {
      onRefresh();
    }

    setTimeout(() => {
      this.safeSetState({ 
        isRefreshing: false,
        lastRefresh: new Date()
      });
    }, 1000);
  };

  /**
   * Handle metric click
   */
  private handleMetricClick = (metric: IDashboardMetric): void => {
    const { onMetricClick } = this.props;

    if (onMetricClick) {
      onMetricClick(metric);
    }

    if (metric.onClick) {
      metric.onClick(metric);
    }
  };

  /**
   * Toggle section expansion
   */
  private toggleSection = (sectionId: string): void => {
    this.safeSetState(prev => {
      const newExpanded = new Set(prev.expandedSections);
      if (newExpanded.has(sectionId)) {
        newExpanded.delete(sectionId);
      } else {
        newExpanded.add(sectionId);
      }
      return { expandedSections: newExpanded };
    });
  };

  /**
   * Get grid columns styles
   */
  private getGridColumns = (sectionColumns?: number): string => {
    const { gridColumns = 4 } = this.props;
    const columns = sectionColumns || gridColumns;

    const gridStyles = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    };

    return gridStyles[columns as keyof typeof gridStyles] || gridStyles[4];
  };

  /**
   * Get container styles
   */
  private getContainerStyles = (): string => {
    const { variant = 'default', className = '' } = this.props;

    const baseStyles = 'metrics-dashboard';
    const variantStyles = {
      default: 'space-y-6',
      compact: 'space-y-4',
      detailed: 'space-y-8'
    };

    return `${baseStyles} ${variantStyles[variant]} ${className}`;
  };

  /**
   * Render loading state
   */
  private renderLoading = (): React.ReactNode => {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  };

  /**
   * Render error state
   */
  private renderError = (): React.ReactNode => {
    const { error } = this.props;

    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-2">Error Loading Dashboard</div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button
          onClick={this.handleRefresh}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  };

  /**
   * Render refresh indicator
   */
  private renderRefreshIndicator = (): React.ReactNode => {
    const { refreshInterval, onRefresh } = this.props;
    const { isRefreshing, lastRefresh } = this.state;

    if (!refreshInterval || !onRefresh) {
      return null;
    }

    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
          <span>
            {isRefreshing ? 'Refreshing...' : `Last updated: ${lastRefresh?.toLocaleTimeString()}`}
          </span>
        </div>
        <button
          onClick={this.handleRefresh}
          disabled={isRefreshing}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
    );
  };

  /**
   * Render section header
   */
  private renderSectionHeader = (section: IDashboardSection): React.ReactNode => {
    const { showSectionHeaders = true } = this.props;
    const { expandedSections } = this.state;

    if (!showSectionHeaders) {
      return null;
    }

    const isExpanded = expandedSections.has(section.id);

    return (
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
          {section.description && (
            <p className="text-sm text-gray-600 mt-1">{section.description}</p>
          )}
        </div>
        <button
          onClick={() => this.toggleSection(section.id)}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>
    );
  };

  /**
   * Render section
   */
  private renderSection = (section: IDashboardSection): React.ReactNode => {
    const { variant = 'default', size = 'md' } = this.props;
    const { expandedSections } = this.state;
    const isExpanded = expandedSections.has(section.id);

    return (
      <div key={section.id} className="dashboard-section">
        {this.renderSectionHeader(section)}
        
        <div className={`transition-all duration-300 ${
          isExpanded ? 'max-h-none opacity-100' : 'max-h-96 opacity-100'
        }`}>
          <div className={`grid ${this.getGridColumns(section.columns)} gap-4`}>
            {section.metrics.map((metric) => (
              <MetricCard
                key={metric.id}
                {...metric}
                size={size}
                variant={variant}
                onClick={() => this.handleMetricClick(metric)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render empty state
   */
  private renderEmpty = (): React.ReactNode => {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No Metrics Available</div>
        <div className="text-gray-400 text-sm">There are no metrics to display at this time.</div>
      </div>
    );
  };

  protected override renderContent(): React.ReactNode {
    const { sections, loading = false, error } = this.props;

    // Loading state
    if (loading) {
      return this.renderLoading();
    }

    // Error state
    if (error) {
      return this.renderError();
    }

    // Empty state
    if (sections.length === 0) {
      return this.renderEmpty();
    }

    return (
      <div className={this.getContainerStyles()}>
        {/* Refresh indicator */}
        {this.renderRefreshIndicator()}

        {/* Dashboard sections */}
        {sections.map((section) => this.renderSection(section))}
      </div>
    );
  }
}

export default MetricsDashboard;
