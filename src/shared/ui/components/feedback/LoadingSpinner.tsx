import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Loading Spinner Props
 */
export interface ILoadingSpinnerProps extends IBaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  className?: string;
}

/**
 * Loading Spinner State
 */
export interface ILoadingSpinnerState extends IBaseComponentState {
  isVisible: boolean;
}

/**
 * Reusable Loading Spinner Component
 * 
 * A flexible loading spinner that can be customized for different sizes and colors.
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class LoadingSpinner extends BaseClassComponent<ILoadingSpinnerProps, ILoadingSpinnerState> {

  protected override getInitialState(): Partial<ILoadingSpinnerState> {
    return {
      isVisible: true
    };
  }

  /**
   * Get size classes based on prop
   */
  private getSizeClasses(): string {
    const { size = 'md' } = this.props;
    const sizeMap = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8'
    };
    return sizeMap[size];
  }

  /**
   * Get color classes based on prop
   */
  private getColorClasses(): string {
    const { color = 'primary' } = this.props;
    const colorMap = {
      primary: 'border-blue-500',
      secondary: 'border-gray-500',
      success: 'border-green-500',
      error: 'border-red-500',
      warning: 'border-yellow-500'
    };
    return colorMap[color];
  }

  /**
   * Show the spinner
   */
  public show(): void {
    this.safeSetState({ isVisible: true });
  }

  /**
   * Hide the spinner
   */
  public hide(): void {
    this.safeSetState({ isVisible: false });
  }

  protected override renderContent(): React.ReactNode {
    const { className = '' } = this.props;
    const { isVisible } = this.state;

    if (!isVisible) {
      return null;
    }

    return (
      <div className={`flex justify-center p-4 ${className}`}>
        <div
          className={`animate-spin rounded-full ${this.getSizeClasses()} border-b-2 ${this.getColorClasses()}`}
          data-testid="loading-spinner"
        />
      </div>
    );
  }
}

export default LoadingSpinner;
