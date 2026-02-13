import { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getSpacing, getColor, getBorderWidth, getTransition } from '../utils';

// Styled components with theme token integration
const LoadingSpinnerContainer = styled.div<{ theme?: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => getSpacing(props.theme, 'md')};
`;

const SpinnerElement = styled.div<{
  $size?: string;
  $color?: string;
  theme?: any;
}>`
  animation: spin 1s linear infinite;
  border-radius: 50%;
  border: ${props => getBorderWidth(props.theme, 'sm')} solid ${props => getColor(props.theme, 'background.secondary')};
  border-top: ${props => getBorderWidth(props.theme, 'sm')} solid ${props => props.$color || getColor(props.theme, 'brand.500')};
  width: ${props => props.$size || '24px'};
  height: ${props => props.$size || '24px'};
  transition: ${props => getTransition(props.theme, 'all', 'normal', 'ease')};
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
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

    return (
      <LoadingSpinnerContainer
        className={className}
        data-testid={testId || 'loading-spinner'}
        theme={theme}
      >
        <SpinnerElement
          $size={size}
          $color={color}
          theme={theme}
          role="status"
          aria-label="Loading"
        >
          <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
            Loading...
          </span>
        </SpinnerElement>
      </LoadingSpinnerContainer>
    );
  }
}

export default LoadingSpinner;
