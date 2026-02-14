/**
 * Loading Overlay Component
 * 
 * A versatile loading overlay component with spinner and message display.
 */

import React from 'react';
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { ILoadingOverlayProps, ILoadingOverlayState } from './interfaces';
import {
  createOverlayContainerStyles,
  createLoadingContentStyles,
  createSpinnerStyles,
  createMessageStyles,
  createFadeInStyles
} from './styles';

/**
 * Enterprise LoadingOverlay Component
 * 
 * Consolidated loading overlay component that handles both LoadingOverlay and FullLoadingOverlay use cases.
 * Features enhanced theme integration, accessibility, and enterprise patterns.
 */
export class LoadingOverlay extends BaseClassComponent<ILoadingOverlayProps, ILoadingOverlayState> {
  private timeoutId?: number | null;

  static defaultProps: Partial<ILoadingOverlayProps> = {
    visible: false,
    size: 'xl',
    radius: 'md',
    blur: 0,
    showSpinner: true,
    showContent: true
  };

  protected override getInitialState(): Partial<ILoadingOverlayState> {
    return {
      isVisible: this.props.visible || false
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.setupTimeout();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.clearTimeout();
  }

  protected override onUpdate(prevProps: ILoadingOverlayProps): void {
    if (prevProps.visible !== this.props.visible) {
      this.safeSetState({ isVisible: this.props.visible || false });
      this.setupTimeout();
    }
  }

  /**
   * Setup timeout for auto-hide functionality
   */
  private setupTimeout = (): void => {
    this.clearTimeout();

    const { timeout, onTimeout } = this.props;
    if (timeout && timeout > 0 && onTimeout) {
      this.timeoutId = window.setTimeout(() => {
        onTimeout();
        this.timeoutId = null;
      }, timeout);
    }
  };

  /**
   * Clear timeout
   */
  private clearTimeout = (): void => {
    if (this.timeoutId !== null && this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  };

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
   * Toggle the loading overlay
   */
  public toggle(): void {
    this.safeSetState({ isVisible: !this.state.isVisible });
  }

  /**
   * Check if overlay is visible
   */
  public isVisible(): boolean {
    return this.state.isVisible;
  }

  /**
   * Render spinner
   */
  private renderSpinner = (): React.ReactNode => {
    const { showSpinner = true, size, color } = this.props;

    if (!showSpinner) return null;

    return (
      <div css={createSpinnerStyles(size, color)} />
    );
  };

  /**
   * Render message
   */
  private renderMessage = (): React.ReactNode => {
    const { message, size } = this.props;

    if (!message) return null;

    return (
      <div css={createMessageStyles(size)}>
        {message}
      </div>
    );
  };

  /**
   * Render loading content
   */
  private renderLoadingContent = (): React.ReactNode => {
    const { showContent = true, radius, backgroundColor, children } = this.props;

    if (!showContent) return null;

    return (
      <div css={createLoadingContentStyles(radius, backgroundColor)}>
        {this.renderSpinner()}
        {this.renderMessage()}
        {children}
      </div>
    );
  };

  protected override renderContent(): React.ReactNode {
    const {
      visible = false,
      blur,
      overlayColor,
      className = '',
      testId,
      ariaLabel = 'Loading'
    } = this.props;
    const { isVisible } = this.state;

    const shouldShow = visible && isVisible;
    const containerStyles = createOverlayContainerStyles(shouldShow, blur, overlayColor);

    return (
      <div
        css={containerStyles}
        className={className}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-busy={shouldShow}
        data-testid={testId}
      >
        {shouldShow && (
          <div css={createFadeInStyles()}>
            {this.renderLoadingContent()}
          </div>
        )}
      </div>
    );
  }
}

export default LoadingOverlay;
