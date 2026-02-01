import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Migration Status interface
 */
export interface IMigrationStatus {
  isUsingEnterprise: boolean;
  config: {
    securityLevel: 'basic' | 'enhanced' | 'maximum';
  };
  errors: Array<{
    message: string;
    timestamp: Date;
    severity: 'low' | 'medium' | 'high';
  }>;
  performance: {
    enterpriseHookTime: number;
    legacyHookTime: number;
    migrationTime: number;
  };
}

/**
 * Migration Info Props
 */
export interface IMigrationInfoProps extends IBaseComponentProps {
  migration: IMigrationStatus;
  showDetails?: boolean;
  showPerformance?: boolean;
  showErrors?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * Migration Info State
 */
export interface IMigrationInfoState extends IBaseComponentState {
  isExpanded: boolean;
  autoRefresh: boolean;
}

/**
 * Reusable Migration Information Component
 * 
 * Displays migration status and performance information for authentication system.
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class MigrationInfo extends BaseClassComponent<IMigrationInfoProps, IMigrationInfoState> {
  private refreshTimer: number | null = null;

  protected override getInitialState(): Partial<IMigrationInfoState> {
    return {
      isExpanded: false,
      autoRefresh: false
    };
  }

  protected override onMount(): void {
    super.onMount();
    if (this.state.autoRefresh) {
      this.startAutoRefresh();
    }
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.stopAutoRefresh();
  }

  /**
   * Start auto-refresh timer
   */
  private startAutoRefresh(): void {
    this.refreshTimer = window.setInterval(() => {
      // Force re-render to get updated migration data
      this.safeSetState({});
    }, 5000); // Refresh every 5 seconds
  }

  /**
   * Stop auto-refresh timer
   */
  private stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Toggle expanded state
   */
  private toggleExpanded = (): void => {
    this.safeSetState(prev => ({ isExpanded: !prev.isExpanded }));
  };

  /**
   * Toggle auto-refresh
   */
  private toggleAutoRefresh = (): void => {
    const newAutoRefresh = !this.state.autoRefresh;
    this.safeSetState({ autoRefresh: newAutoRefresh });
    
    if (newAutoRefresh) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  };

  /**
   * Get status badge classes
   */
  private getStatusBadgeClasses(isEnterprise: boolean): string {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium';
    return isEnterprise 
      ? `${baseClasses} bg-green-100 text-green-800`
      : `${baseClasses} bg-yellow-100 text-yellow-800`;
  };

  /**
   * Get performance improvement percentage
   */
  private getPerformanceImprovement(): number {
    const { migration } = this.props;
    const { enterpriseHookTime, legacyHookTime } = migration.performance;
    
    if (legacyHookTime === 0) return 0;
    
    const improvement = ((legacyHookTime - enterpriseHookTime) / legacyHookTime) * 100;
    return Math.round(improvement);
  }

  /**
   * Get security level badge classes
   */
  private getSecurityLevelClasses(level: string): string {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium';
    const levelMap = {
      basic: 'bg-gray-100 text-gray-800',
      enhanced: 'bg-blue-100 text-blue-800',
      maximum: 'bg-purple-100 text-purple-800'
    };
    return levelMap[level as keyof typeof levelMap] || baseClasses;
  };

  /**
   * Get error severity classes
   */
  private getErrorSeverityClasses(severity: string): string {
    const severityMap = {
      low: 'text-yellow-600 bg-yellow-50',
      medium: 'text-orange-600 bg-orange-50',
      high: 'text-red-600 bg-red-50'
    };
    return severityMap[severity as keyof typeof severityMap] || 'text-gray-600 bg-gray-50';
  }

  /**
   * Get variant classes
   */
  private getVariantClasses(): string {
    const { variant = 'default' } = this.props;
    const variantMap = {
      default: 'p-3',
      compact: 'p-2',
      detailed: 'p-4'
    };
    return variantMap[variant];
  }

  protected override renderContent(): React.ReactNode {
    const { 
      migration, 
      showDetails = true,
      showPerformance = true,
      showErrors = true,
      variant = 'default',
      className = '' 
    } = this.props;
    const { isExpanded, autoRefresh } = this.state;

    const performanceImprovement = this.getPerformanceImprovement();
    const hasErrors = migration.errors.length > 0;

    return (
      <div 
        className={`migration-info ${this.getVariantClasses()} bg-purple-50 border border-purple-200 rounded-lg ${className}`}
        data-testid="migration-info"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Migration Mode</span>
            <span className={this.getStatusBadgeClasses(migration.isUsingEnterprise)}>
              {migration.isUsingEnterprise ? 'Enterprise' : 'Legacy'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Auto-refresh Toggle */}
            <button
              onClick={this.toggleAutoRefresh}
              className={`text-xs px-2 py-1 rounded ${
                autoRefresh 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              data-testid="auto-refresh-toggle"
            >
              {autoRefresh ? '🔄' : '⏸'}
            </button>
            
            {/* Expand Toggle */}
            {showDetails && (
              <button
                onClick={this.toggleExpanded}
                className="text-xs text-purple-600 hover:text-purple-800"
                data-testid="migration-details-toggle"
              >
                {isExpanded ? 'Hide' : 'Show'} Info
              </button>
            )}
          </div>
        </div>

        {/* Basic Status */}
        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
          <span>Security: 
            <span className={`ml-1 ${this.getSecurityLevelClasses(migration.config.securityLevel)}`}>
              {migration.config.securityLevel}
            </span>
          </span>
          {hasErrors && (
            <span className="text-red-600">
              Errors: {migration.errors.length}
            </span>
          )}
          {showPerformance && (
            <span className={`${
              performanceImprovement > 0 ? 'text-green-600' : 'text-gray-600'
            }`}>
              Performance: {performanceImprovement > 0 ? '+' : ''}{performanceImprovement}%
            </span>
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && showDetails && (
          <div className="mt-3 space-y-3">
            {/* Performance Details */}
            {showPerformance && (
              <div className="text-xs bg-white p-2 rounded border border-purple-100">
                <div className="font-medium mb-1">Performance Metrics</div>
                <div className="space-y-1">
                  <div>Enterprise Hook: {migration.performance.enterpriseHookTime.toFixed(2)}ms</div>
                  <div>Legacy Hook: {migration.performance.legacyHookTime.toFixed(2)}ms</div>
                  <div>Migration Time: {migration.performance.migrationTime.toFixed(2)}ms</div>
                  <div className="font-medium text-green-600">
                    Improvement: {performanceImprovement}%
                  </div>
                </div>
              </div>
            )}

            {/* Error Details */}
            {showErrors && hasErrors && (
              <div className="text-xs bg-white p-2 rounded border border-purple-100">
                <div className="font-medium mb-1">Recent Errors</div>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {migration.errors.slice(0, 3).map((error, index) => (
                    <div 
                      key={index}
                      className={`p-1 rounded ${this.getErrorSeverityClasses(error.severity)}`}
                    >
                      <div className="font-medium">{error.message}</div>
                      <div className="text-xs opacity-75">
                        {error.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  {migration.errors.length > 3 && (
                    <div className="text-gray-500">
                      ... and {migration.errors.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Configuration */}
            <div className="text-xs bg-white p-2 rounded border border-purple-100">
              <div className="font-medium mb-1">Configuration</div>
              <div>Security Level: {migration.config.securityLevel}</div>
              <div>Auto-refresh: {autoRefresh ? 'Enabled' : 'Disabled'}</div>
              <div>Last Updated: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MigrationInfo;
