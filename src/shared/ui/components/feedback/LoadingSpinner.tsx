import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Loading Spinner Props
 */
export interface ILoadingSpinnerProps extends IBaseComponentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  className?: string;
  /**
   * Whether to show/hide the spinner (default: true)
   */
  visible?: boolean;
  /**
   * Custom size in pixels (overrides size prop)
   */
  customSize?: string;
  /**
   * Whether to use theme colors (default: true)
   */
  useTheme?: boolean;
  /**
   * Custom color value when useTheme is false
   */
  customColor?: string;
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
   * Size mapping for consistent sizing
   */
  private readonly sizeMap = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  } as const;

  private readonly validSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

  /**
   * Get size classes based on prop
   */
  private getSizeClasses(): string {
    const { size = 'md', customSize } = this.props;

    if (customSize) {
      return `h-[${customSize}] w-[${customSize}]`;
    }

    if (typeof size === 'number') {
      return `h-[${size}px] w-[${size}px]`;
    }

    // At this point, TypeScript knows size is a string (not number or undefined)
    const sizeString = size as string;

    // Handle predefined size values
    if (this.validSizes.includes(sizeString as any)) {
      return this.sizeMap[sizeString as keyof typeof this.sizeMap];
    }

    // Handle string values with 'px' suffix
    if (sizeString.includes('px')) {
      return `h-[${sizeString}] w-[${sizeString}]`;
    }

    return this.sizeMap.md;
  }

  /**
   * Color mapping for theme colors
   */
  private readonly colorMap: Record<'primary' | 'secondary' | 'success' | 'error' | 'warning', string> = {
    primary: 'border-blue-500',
    secondary: 'border-gray-500',
    success: 'border-green-500',
    error: 'border-red-500',
    warning: 'border-yellow-500'
  };

  /**
   * Get color classes based on prop
   */
  private getColorClasses(): string {
    const { color = 'primary', useTheme = true, customColor } = this.props;

    if (!useTheme && customColor) {
      // Use custom color when theme is disabled
      return customColor;
    }

    // At this point, color is guaranteed to be a valid color type due to the default value
    const colorValue: 'primary' | 'secondary' | 'success' | 'error' | 'warning' = color || 'primary';

    // Handle string color that's a valid key in colorMap
    return this.colorMap[colorValue];
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

  /**
   * Toggle spinner visibility
   */
  public toggle(): void {
    this.safeSetState(prevState => ({ isVisible: !prevState.isVisible }));
  }

  protected override renderContent(): React.ReactNode {
    const { className = '', visible = true, testId } = this.props;
    const { isVisible } = this.state;

    // Check both prop and state visibility
    const shouldShow = visible && isVisible;

    if (!shouldShow) {
      return null;
    }

    return (
      <div
        className={`flex items-center justify-center p-4 ${className}`}
        data-testid={testId || 'loading-spinner'}
      >
        <div
          className={`animate-spin rounded-full border-2 border-transparent border-t-current ${this.getSizeClasses()} ${this.getColorClasses()}`}
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
}

export default LoadingSpinner;
