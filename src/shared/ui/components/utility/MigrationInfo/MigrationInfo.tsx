/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { migrationInfoContainerStyles } from './styles';
import { 
  IMigrationInfoProps, 
  IMigrationInfoState,
  IMigrationStatus
} from './interfaces';

/**
 * Enterprise MigrationInfo Component
 * 
 * Displays migration status and performance information for authentication system.
 * Built using enterprise BaseClassComponent pattern with Emotion CSS.
 * 
 * @example
 * ```tsx
 * <MigrationInfo 
 *   migration={migrationData}
 *   showDetails={true}
 *   showPerformance={true}
 *   variant="detailed"
 * />
 * ```
 */
export class MigrationInfo extends BaseClassComponent<IMigrationInfoProps, IMigrationInfoState> {
  private refreshTimer: number | null = null;

  protected override getInitialState(): Partial<IMigrationInfoState> {
    return {
      isExpanded: false,
      autoRefresh: false
    };
  }

  /**
   * Handle component mount
   */
  protected override onMount(): void {
    super.onMount();
    if (this.state.autoRefresh) {
      this.startAutoRefresh();
    }
  }

  /**
   * Handle component unmount
   */
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
   * Get performance improvement percentage
   */
  private getPerformanceImprovement(): number {
    const { migration } = this.props;
    const { enterpriseHookTime, legacyHookTime } = migration.performance;
    
    if (legacyHookTime === 0) return 0;
    
    const improvement = ((legacyHookTime - enterpriseHookTime) / legacyHookTime) * 100;
    return Math.round(improvement);
  }

  protected override renderContent(): React.ReactNode {
    const {
      migration,
      showDetails = false,
      showPerformance = false,
      showErrors = false,
      variant = 'default',
      className = ''
    } = this.props;
    const { isExpanded, autoRefresh } = this.state;

    const { isUsingEnterprise, config, errors, performance } = migration;
    const improvement = this.getPerformanceImprovement();

    return (
      <div 
        css={migrationInfoContainerStyles}
        className={`migration-info ${variant} ${className}`}
      >
        {/* Header */}
        <div className="migration-header">
          <h3 className="migration-title">
            Migration Status
          </h3>
          <div className="migration-status">
            {isUsingEnterprise ? 'Enterprise' : 'Legacy'}
          </div>
        </div>

        {/* Basic Status */}
        <div className="migration-content">
          <div>
            <strong>Status:</strong> {isUsingEnterprise ? 'Enterprise' : 'Legacy'} System
          </div>
          <div>
            <strong>Security Level:</strong> {config.securityLevel}
          </div>
          {showPerformance && (
            <div>
              <strong>Performance:</strong> {improvement}% improvement
            </div>
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="migration-details">
            {showDetails && (
              <>
                <div className="detail-section">
                  <div className="detail-title">Configuration</div>
                  <div className="detail-content">
                    Security Level: {config.securityLevel}
                  </div>
                </div>
              </>
            )}

            {showPerformance && (
              <div className="detail-section">
                <div className="detail-title">Performance Metrics</div>
                <div className="performance-metrics">
                  <div className="metric">
                    <div className="metric-value">{enterpriseHookTime}ms</div>
                    <div className="metric-label">Enterprise Hook</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value">{legacyHookTime}ms</div>
                    <div className="metric-label">Legacy Hook</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value">{improvement}%</div>
                    <div className="metric-label">Improvement</div>
                  </div>
                </div>
              </div>
            )}

            {showErrors && errors.length > 0 && (
              <div className="detail-section">
                <div className="detail-title">Migration Errors</div>
                <div className="migration-errors">
                  {errors.map((error, index) => (
                    <div 
                      key={index}
                      className={`error-item ${error.severity}`}
                    >
                      <strong>{error.severity.toUpperCase()}:</strong> {error.message}
                      <br />
                      <small>{error.timestamp.toLocaleString()}</small>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="migration-content">
          <button onClick={this.toggleExpanded}>
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
          <button onClick={this.toggleAutoRefresh}>
            Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    );
  }
}
