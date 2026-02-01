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
  background-color: ${(props) => (props.theme as any)?.colors?.overlay || 'rgba(0, 0, 0, 0.5)'};
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
  gap: ${(props) => (props.theme as any)?.spacing?.((props.theme as any)?.spacingFactor?.md) || '1rem'};
  padding: ${(props) => (props.theme as any)?.spacing?.((props.theme as any)?.spacingFactor?.lg) || '1.5rem'};
  background-color: ${(props) => (props.theme as any)?.colors?.background || '#ffffff'};
  border-radius: ${(props) => {
    switch (props.radius) {
      case 'sm': return '4px';
      case 'md': return '8px';
      case 'lg': return '12px';
      case 'xl': return '16px';
      default: return props.radius || '8px';
    }
  }};
  box-shadow: ${(props) => (props.theme as any)?.shadows?.lg || '0 4px 6px rgba(0, 0, 0, 0.1)'};
`;

interface SpinnerProps {
  size?: string;
  color?: string;
}

const Spinner = styled.div<SpinnerProps>`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid ${(props) => (props.theme as any)?.colors?.backgroundSecondary || '#f0f0f0'};
  border-top: 3px solid ${props => props.color || (props.theme as any)?.colors?.primary || '#007bff'};
  border-radius: 50%;
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
    size: '40px',
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
                  marginTop: '0.5rem',
                  fontSize: '14px',
                  color: (this.props as any).theme?.colors?.text?.primary || '#333',
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
