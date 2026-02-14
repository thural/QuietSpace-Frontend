/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { useTheme } from '@/core/modules/theming';
import { IFullLoadingOverlayProps } from './interfaces';
import {
  fullLoadingOverlayStyles,
  loadingContentStyles,
  loadingSpinnerStyles,
  loadingMessageStyles,
  loadingOverlayHiddenStyles,
  loadingOverlayVisibleStyles
} from './styles';

/**
 * FullLoadingOverlay Component
 * 
 * Enterprise-grade full loading overlay component with customizable
 * blur effects, content, and comprehensive accessibility features.
 */
export class FullLoadingOverlay extends PureComponent<IFullLoadingOverlayProps> {
  static defaultProps: Partial<IFullLoadingOverlayProps> = {
    visible: true,
    radius: 'md',
    blur: 2,
    showSpinner: true,
  };

  override render(): ReactNode {
    const { 
      visible, 
      radius, 
      blur, 
      children, 
      message, 
      showSpinner,
      customSpinner,
      backgroundColor,
      zIndex
    } = this.props;

    const theme = useTheme();

    if (!visible) {
      return null;
    }

    return (
      <div
        css={[
          fullLoadingOverlayStyles(theme, { blur, backgroundColor, zIndex }),
          visible ? loadingOverlayVisibleStyles : loadingOverlayHiddenStyles
        ]}
        role="progressbar"
        aria-busy="true"
        aria-label="Loading content"
      >
        <div css={loadingContentStyles(theme, radius)}>
          {showSpinner && (
            <div css={loadingSpinnerStyles(theme)}>
              {customSpinner || (
                <div aria-hidden="true">
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="283"
                      strokeDashoffset="283"
                      style={{
                        animation: 'spin 1s linear infinite',
                        transformOrigin: 'center'
                      }}
                    />
                  </svg>
                </div>
              )}
            </div>
          )}
          
          {message && (
            <div css={loadingMessageStyles(theme)}>
              {message}
            </div>
          )}
          
          {children}
        </div>
      </div>
    );
  }
}

export default FullLoadingOverlay;
