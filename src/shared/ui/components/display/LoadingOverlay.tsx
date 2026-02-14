/** @jsxImportSource @emotion/react */
import type { ReactNode } from 'react';
import { css, keyframes } from '@emotion/react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { getColor, getSpacing, getRadius, getShadow, getBorderWidth, getTypography } from '../utils';

// Emotion CSS utility functions
const spinKeyframes = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const createOverlayContainerStyles = (theme: any, visible: boolean, blur?: number, overlayColor?: string) => css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${overlayColor || getColor(theme, 'overlay') || 'rgba(0, 0, 0, 0.5)'};
  backdrop-filter: ${blur ? `blur(${blur}px)` : 'none'};
  display: ${visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const createLoadingContentStyles = (theme: any, radius?: string, backgroundColor?: string) => css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${getSpacing(theme, 'md')};
  padding: ${getSpacing(theme, 'lg')};
  background-color: ${backgroundColor || getColor(theme, 'background.primary')};
  border-radius: ${getRadius(theme, radius || 'md')};
  box-shadow: ${getShadow(theme, 'lg')};
`;

const createSpinnerStyles = (theme: any, size?: string, color?: string) => css`
  width: ${getSpacing(theme, size || 'xl')};
  height: ${getSpacing(theme, size || 'xl')};
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'background.secondary')};
  border-top: ${getBorderWidth(theme, 'sm')} solid ${color || getColor(theme, 'brand.500')};
  border-radius: ${getRadius(theme, 'full')};
  animation: ${spinKeyframes} 1s linear infinite;
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
      <div
        css={createOverlayContainerStyles((this.props as any).theme || {} as any, shouldShow, blur, overlayColor)}
        className={className}
        data-testid={testId || 'loading-overlay'}
        role="dialog"
        aria-modal={true}
        aria-label={ariaLabel}
      >
        <div
          css={createLoadingContentStyles((this.props as any).theme || {} as any, radius, backgroundColor)}
        >
          {children || (
            <>
              <div css={createSpinnerStyles((this.props as any).theme || {} as any, size, color)} />
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
        </div>
      </div>
    );
  }
}

export default LoadingOverlay;
