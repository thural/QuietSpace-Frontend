/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { errorMessageContainerStyles } from './styles';
import { IErrorMessageProps, IErrorMessageState } from './interfaces';

/**
 * Enterprise ErrorMessage Component
 * 
 * A flexible error display component with retry and clear actions.
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 * 
 * @example
 * ```tsx
 * <ErrorMessage 
 *   error="Something went wrong"
 *   onRetry={handleRetry}
 *   showRetry={true}
 * />
 * ```
 */
export class ErrorMessage extends BaseClassComponent<IErrorMessageProps, IErrorMessageState> {
  
  protected override getInitialState(): Partial<IErrorMessageState> {
    return {
      isVisible: true,
      isExpanded: false
    };
  }

  /**
   * Handle retry action
   */
  private handleRetry = (): void => {
    const { onRetry } = this.props;
    if (onRetry) {
      onRetry();
    }
  };

  /**
   * Handle clear action
   */
  private handleClear = (): void => {
    const { onClear } = this.props;
    if (onClear) {
      onClear();
    }
    this.safeSetState({ isVisible: false });
  };

  /**
   * Toggle expanded state for detailed view
   */
  private toggleExpanded = (): void => {
    this.safeSetState(prev => ({ isExpanded: !prev.isExpanded }));
  };

  protected override renderContent(): React.ReactNode {
    const { 
      error, 
      showRetry = false, 
      showClear = false, 
      variant = 'default',
      className = '' 
    } = this.props;
    const { isVisible, isExpanded } = this.state;

    if (!isVisible) {
      return null;
    }

    return (
      <div 
        css={errorMessageContainerStyles}
        className={`error-message error-${variant} ${className}`}
        role="alert"
        aria-live="polite"
      >
        <div className="error-header">
          <div className="error-title">Error</div>
          <div className="error-actions">
            {showRetry && (
              <button 
                className="error-button"
                onClick={this.handleRetry}
                aria-label="Retry action"
              >
                Retry
              </button>
            )}
            {showClear && (
              <button 
                className="error-button"
                onClick={this.handleClear}
                aria-label="Clear error"
              >
                Clear
              </button>
            )}
            {variant === 'detailed' && (
              <button 
                className="error-button"
                onClick={this.toggleExpanded}
                aria-label={isExpanded ? "Show less" : "Show more"}
              >
                {isExpanded ? 'Less' : 'More'}
              </button>
            )}
          </div>
        </div>
        
        <div className="error-content">
          {error}
        </div>

        {variant === 'detailed' && isExpanded && (
          <div className="error-details">
            <strong>Additional Details:</strong><br />
            Timestamp: {new Date().toLocaleString()}<br />
            Component: ErrorMessage<br />
            Variant: {variant}
          </div>
        )}
      </div>
    );
  }
}
