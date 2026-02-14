/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { css, keyframes } from '@emotion/react';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getSpacing, getColor, getBorderWidth, getTransition } from '../utils';

// Emotion CSS utility functions
const spinKeyframes = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const createLoadingSpinnerContainerStyles = (theme: any) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${getSpacing(theme, 'md')};
`;

const createSpinnerElementStyles = (
  theme: any,
  size: string,
  color: string
) => css`
  animation: ${spinKeyframes} 1s linear infinite;
  border-radius: 50%;
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'background.secondary')};
  border-top: ${getBorderWidth(theme, 'sm')} solid ${color};
  width: ${size};
  height: ${size};
  transition: ${getTransition(theme, 'all', 'normal', 'ease')};
`;

/**
 * Loading Spinner Props
 */
export interface ILoadingSpinnerProps extends BaseComponentProps {
  size?: ComponentSize | number;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  visible?: boolean;
  customSize?: string;
  customColor?: string;
  theme?: any;
}

/**
 * Reusable Loading Spinner Component
 * 
 * A flexible loading spinner that can be customized for different sizes and colors.
 * Built using enterprise class-based pattern with theme token integration.
 */
export class LoadingSpinner extends PureComponent<ILoadingSpinnerProps> {
  static defaultProps: Partial<ILoadingSpinnerProps> = {
    size: 'md',
    color: 'primary',
    visible: true
  };

  /**
   * Size mapping for consistent sizing using theme tokens
   */
  private readonly sizeMap: Record<ComponentSize, string> = {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '32px',
    xl: '40px'
  };

  /**
   * Color mapping for theme colors using semantic tokens
   */
  private readonly colorMap: Record<'primary' | 'secondary' | 'success' | 'error' | 'warning', string> = {
    primary: 'brand.500',
    secondary: 'text.secondary',
    success: 'semantic.success',
    error: 'semantic.error',
    warning: 'semantic.warning'
  };

  /**
   * Get size in pixels based on prop
   */
  private getSizePixels = (theme: any): string => {
    const { size, customSize } = this.props;

    if (customSize) {
      return customSize;
    }

    if (typeof size === 'number') {
      return getSpacing(theme, size);
    }

    return getSpacing(theme, parseInt(this.sizeMap[size as ComponentSize] || this.sizeMap.md));
  };

  /**
   * Get color based on prop using theme tokens
   */
  private getColor = (theme: any): string => {
    const { color, customColor } = this.props;

    if (customColor) {
      return customColor;
    }

    if (color && this.colorMap[color]) {
      return getColor(theme, this.colorMap[color]);
    }

    return getColor(theme, this.colorMap.primary);
  };

  /**
   * Show the spinner (for programmatic control)
   */
  public show(): void {
    // This would need to be implemented with state management
    // For now, it's controlled by the visible prop
    console.log('LoadingSpinner.show() - use visible prop instead');
  }

  /**
   * Hide the spinner (for programmatic control)
   */
  public hide(): void {
    // This would need to be implemented with state management
    // For now, it's controlled by the visible prop
    console.log('LoadingSpinner.hide() - use visible prop instead');
  }

  /**
   * Toggle spinner visibility (for programmatic control)
   */
  public toggle(): void {
    // This would need to be implemented with state management
    // For now, it's controlled by the visible prop
    console.log('LoadingSpinner.toggle() - use visible prop instead');
  }

  override render(): ReactNode {
    const { className = '', visible = true, testId, theme } = this.props;

    if (!visible) {
      return null;
    }

    const size = this.getSizePixels(theme || {});
    const color = this.getColor(theme || {});

    return React.createElement(
      'div',
      {
        css: createLoadingSpinnerContainerStyles(theme || {} as any),
        className,
        'data-testid': testId || 'loading-spinner',
        theme
      },
      React.createElement(
        'div',
        {
          css: createSpinnerElementStyles(theme || {} as any, size, color),
          role: 'status',
          'aria-label': 'Loading'
        },
        React.createElement(
          'span',
          {
            style: { position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: '0' }
          },
          'Loading...'
        )
      )
    );
  }
}

export default LoadingSpinner;
