/**
 * Enterprise LoadingOverlay Component
 * 
 * A loading overlay component that replaces the original LoadingOverlay component
 * with enhanced theme integration and enterprise patterns.
 * Consolidated to handle both LoadingOverlay and FullLoadingOverlay use cases.
 */

import type { ReactNode } from 'react';
import styled from 'styled-components';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { getColor, getSpacing, getRadius, getShadow, getBorderWidth, getTypography } from '../utils';

// Styled components
interface OverlayContainerProps {
  visible?: boolean;
  blur?: number;
}

const OverlayContainer = styled.div<OverlayContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => getColor(props.theme, 'overlay', 'rgba(0, 0, 0, 0.5)')};
  backdrop-filter: ${props => props.blur ? `blur(${props.blur}px)` : 'none'};
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingContent = styled.div<{ radius?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => getSpacing(props.theme, 'md')};
  padding: ${props => getSpacing(props.theme, 'lg')};
  background-color: ${props => getColor(props.theme, 'background.primary')};
  border-radius: ${props => getRadius(props.theme, props.radius || 'md')};
  box-shadow: ${props => getShadow(props.theme, 'lg')};
`;

interface SpinnerProps {
  size?: string;
  color?: string;
}

const Spinner = styled.div<SpinnerProps>`
  width: ${props => getSpacing(props.theme, props.size || 'xl')};
  height: ${props => getSpacing(props.theme, props.size || 'xl')};
  border: ${props => getBorderWidth(props.theme, 'sm')} solid ${getColor(props.theme, 'background.secondary')};
  border-top: ${props => getBorderWidth(props.theme, 'sm')} solid ${props.color || getColor(props.theme, 'brand.500')};
  border-radius: ${getRadius(props.theme, 'full')};
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Props interfaces
interface ILoadingOverlayProps extends IBaseComponentProps {
  visible?: boolean;
  size?: string;
  color?: string;
  message?: string;

  // Enhanced props for FullLoadingOverlay compatibility
  radius?: 'sm' | 'md' | 'lg' | 'xl' | string;
  blur?: number;

  // Custom styling
  backgroundColor?: string;
  overlayColor?: string;

  // Content
  children?: ReactNode;

  // Accessibility
  ariaLabel?: string;
}

interface ILoadingOverlayState extends IBaseComponentState {
  isVisible: boolean;
}

/**
 * Enterprise LoadingOverlay Component
 * 
 * Consolidated loading overlay component that handles both LoadingOverlay and FullLoadingOverlay use cases.
 * Features enhanced theme integration, accessibility, and enterprise patterns.
 */
class LoadingOverlay extends BaseClassComponent<ILoadingOverlayProps, ILoadingOverlayState> {
  static defaultProps: Partial<ILoadingOverlayProps> = {
    visible: false,
    size: 'xl',
    radius: 'md',
    blur: 0
  };

  protected override getInitialState(): Partial<ILoadingOverlayState> {
    return {
      isVisible: this.props.visible || false
    };
  }

  /**
   * Show the loading overlay
   */
  public show(): void {
    this.safeSetState({ isVisible: true });
  }

  /**
   * Hide the loading overlay
   */
  public hide(): void {
    this.safeSetState({ isVisible: false });
  }

  /**
   * Toggle the loading overlay visibility
   */
  public toggle(): void {
    this.safeSetState(prev => ({ isVisible: !prev.isVisible }));
  }

  /**
   * Check if overlay is visible
   */
  public isShowing(): boolean {
    const { visible = false } = this.props;
    const { isVisible } = this.state;
    return visible && isVisible;
  }

  protected override renderContent(): ReactNode {
    const {
      visible = false,
      size = '40px',
      color,
      message,
      radius = 'md',
      blur = 0,
      backgroundColor,
      overlayColor,
      children,
      ariaLabel = 'Loading...',
      testId,
      className = ''
    } = this.props;

    const { isVisible } = this.state;
    const shouldShow = visible && isVisible;

    if (!shouldShow) {
      return null;
    }

    return (
      <OverlayContainer
        visible={shouldShow}
        blur={blur}
        style={{
          backgroundColor: overlayColor || undefined
        }}
        className={className}
        data-testid={testId || 'loading-overlay'}
        role="dialog"
        aria-modal={true}
        aria-label={ariaLabel}
      >
        <LoadingContent
          radius={radius}
          style={{
            backgroundColor: backgroundColor || undefined
          }}
        >
          {children || (
            <>
              <Spinner size={size} {...(color !== undefined && { color })} />
              {message && (
                <div style={{
                  marginTop: getSpacing((this.props as any).theme, 'xs'),
                  fontSize: getTypography((this.props as any).theme, 'fontSize.sm'),
                  color: getColor((this.props as any).theme, 'text.primary'),
                  textAlign: 'center'
                }}>
                  {message}
                </div>
              )}
            </>
          )}
        </LoadingContent>
      </OverlayContainer>
    );
  }
}

export default LoadingOverlay;
