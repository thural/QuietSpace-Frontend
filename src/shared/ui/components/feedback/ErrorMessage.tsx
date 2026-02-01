import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Error Message Props
 */
export interface IErrorMessageProps extends IBaseComponentProps {
  error: string;
  onRetry?: () => void;
  onClear?: () => void;
  showRetry?: boolean;
  showClear?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * Error Message State
 */
export interface IErrorMessageState extends IBaseComponentState {
  isVisible: boolean;
  isExpanded: boolean;
}

/**
 * Reusable Error Message Component
 * 
 * A flexible error display component with retry and clear actions.
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
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
    this.hide();
  };

  /**
   * Toggle expanded state for detailed view
   */
  private toggleExpanded = (): void => {
    this.safeSetState(prev => ({ isExpanded: !prev.isExpanded }));
  };

  /**
   * Show the error message
   */
  public show(): void {
    this.safeSetState({ isVisible: true });
  }

  /**
   * Hide the error message
   */
  public hide(): void {
    this.safeSetState({ isVisible: false });
  }

  /**
   * Get variant classes
   */
  private getVariantClasses(): string {
    const { variant = 'default' } = this.props;
    const variantMap = {
      default: 'p-4',
      compact: 'p-2',
      detailed: 'p-6'
    };
    return variantMap[variant];
  }

  protected override renderContent(): React.ReactNode {
    const { 
      error, 
      showRetry = true, 
      showClear = true, 
      variant = 'default',
      className = '' 
    } = this.props;
    const { isVisible, isExpanded } = this.state;

    if (!isVisible || !error) {
      return null;
    }

    return (
      <div 
        className={`error-message ${this.getVariantClasses()} bg-red-50 border border-red-200 rounded-lg ${className}`}
        data-testid="error-message"
      >
        <div className="text-red-700">{error}</div>
        
        {/* Action Buttons */}
        {(showRetry || showClear) && (
          <div className="mt-2 flex space-x-2">
            {showRetry && (
              <button 
                onClick={this.handleRetry}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                data-testid="error-retry-button"
              >
                Retry
              </button>
            )}
            {showClear && (
              <button 
                onClick={this.handleClear}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                data-testid="error-clear-button"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Detailed View Toggle */}
        {variant === 'detailed' && (
          <div className="mt-3">
            <button
              onClick={this.toggleExpanded}
              className="text-xs text-red-600 hover:text-red-800 focus:outline-none"
              data-testid="error-details-toggle"
            >
              {isExpanded ? 'Hide' : 'Show'} Details
            </button>
            {isExpanded && (
              <div className="mt-2 text-xs text-gray-600 bg-red-100 p-2 rounded">
                <div>Timestamp: {new Date().toLocaleString()}</div>
                <div>Component: {this.constructor.name}</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ErrorMessage;
