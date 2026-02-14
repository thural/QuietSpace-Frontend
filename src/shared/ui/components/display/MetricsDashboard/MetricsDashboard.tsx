/**
 * Metrics Dashboard Component
 * 
 * A comprehensive metrics display component with grid layout and
 * flexible configuration for analytics and monitoring dashboards.
 */

import React from 'react';
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { IMetricsDashboardProps, IMetricsDashboardState, IDashboardMetric, IDashboardSection } from './interfaces';
import { MetricCard } from '../MetricCard';
import { 
    createDashboardStyles,
    createSectionStyles,
    createSectionHeaderStyles,
    createGridStyles,
    createLoadingContainerStyles,
    createErrorContainerStyles,
    createRefreshButtonStyles
} from './styles';

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
      isRefreshing: false,
      lastRefreshTime: new Date()
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
        lastRefreshTime: new Date()
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
   * Render loading state
   */
  private renderLoading = (): React.ReactNode => {
    return (
      <div css={createLoadingContainerStyles()}>
        <div className="spinner"></div>
        <span>Loading dashboard...</span>
      </div>
    );
  };

  /**
   * Render error state
   */
  protected override renderError = (): React.ReactNode => {
    const { error } = this.props;

    return (
      <div css={createErrorContainerStyles()}>
        <div className="error-icon">⚠️</div>
        <div className="error-title">Dashboard Error</div>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  };

  /**
   * Render refresh button
   */
  private renderRefreshButton = (): React.ReactNode => {
    const { onRefresh } = this.props;
    const { isRefreshing } = this.state;

    if (!onRefresh) return null;

    return (
      <button
        css={createRefreshButtonStyles()}
        onClick={this.handleRefresh}
        disabled={isRefreshing}
      >
        <span className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`}>
          🔄
        </span>
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    );
  };

  /**
   * Render dashboard section
   */
  private renderSection = (section: IDashboardSection): React.ReactNode => {
    const { size = 'md', showSectionHeaders = true } = this.props;
    const columns = section.columns || 3;

    return (
      <div key={section.id} css={createSectionStyles(showSectionHeaders, columns)}>
        {showSectionHeaders && (
          <div css={createSectionHeaderStyles()}>
            <div>
              <h3>{section.title}</h3>
              {section.description && <p>{section.description}</p>}
            </div>
          </div>
        )}
        
        <div css={createGridStyles(columns, size)}>
          {section.metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              label={metric.label}
              value={metric.value}
              change={metric.change}
              icon={metric.icon}
              description={metric.description}
              trend={metric.trend}
              loading={metric.loading}
              error={metric.error}
              variant={metric.variant}
              size={metric.size || size}
              color={metric.color}
              onClick={() => this.handleMetricClick(metric)}
              className={metric.className}
              testId={metric.testId}
            />
          ))}
        </div>
      </div>
    );
  };

  protected override renderContent(): React.ReactNode {
    const { 
      sections, 
      loading = false, 
      error, 
      variant = 'default', 
      size = 'md', 
      gridColumns = 3,
      className = ''
    } = this.props;
    const { isRefreshing } = this.state;

    const dashboardStyles = createDashboardStyles(variant, size, gridColumns, className);

    return (
      <div css={dashboardStyles}>
        {/* Header with refresh button */}
        <div css={createSectionHeaderStyles()}>
          <div>
            <h2>Metrics Dashboard</h2>
            {this.state.lastRefreshTime && (
              <p>Last updated: {this.state.lastRefreshTime.toLocaleTimeString()}</p>
            )}
          </div>
          {this.renderRefreshButton()}
        </div>

        {/* Loading State */}
        {loading && this.renderLoading()}

        {/* Error State */}
        {error && !loading && this.renderError()}

        {/* Normal State */}
        {!loading && !error && (
          <>
            {sections.map((section) => this.renderSection(section))}
          </>
        )}

        {/* Refreshing overlay */}
        {isRefreshing && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            pointerEvents: 'none'
          }}>
            <div css={createLoadingContainerStyles()}>
              <div className="spinner"></div>
              <span>Refreshing...</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MetricsDashboard;
