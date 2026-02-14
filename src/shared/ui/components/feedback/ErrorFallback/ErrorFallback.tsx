/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { useTheme } from '@/core/modules/theming';
import { getSpacing, getColor } from '../../utils';
import { IErrorFallbackProps } from './interfaces';
import {
  errorFallbackContainerStyles,
  errorCardStyles,
  errorContentStyles,
  errorIconContainerStyles,
  errorTitleStyles,
  errorMessageStyles,
  actionButtonsContainerStyles,
  styledButtonStyles,
  errorDetailsStyles,
  errorCodeStyles
} from './styles';

/**
 * ErrorFallback Component
 * 
 * Enterprise-grade error fallback component with customizable error
 * messages, recovery actions, and comprehensive accessibility features.
 */
export class ErrorFallback extends PureComponent<IErrorFallbackProps> {
  static defaultProps: Partial<IErrorFallbackProps> = {
    error: 'An error occurred',
    variant: 'default',
    showIcon: true,
    showDetails: false,
  };

  /**
   * Default retry handler - reloads page
   */
  private handleRetry = (): void => {
    window.location.reload();
  };

  /**
   * Navigate to sign-in page
   */
  private handleGoToSignIn = (): void => {
    window.location.href = '/signin';
  };

  /**
   * Render error icon SVG
   */
  private renderErrorIcon = (): ReactNode => {
    const theme = useTheme();
    const { customIcon } = this.props;

    if (customIcon) {
      return customIcon;
    }

    return (
      <svg
        css={{
          width: getSpacing(theme, 'xl'),
          height: getSpacing(theme, 'xl'),
          margin: '0 auto',
          color: getColor(theme, 'semantic.error')
        }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 2.502-3.159L13.562 9.17c-.406-1.492-1.749-2.583-3.159-2.583H6.597c-1.41 0-2.753 1.091-3.159 2.583L2.582 16.841C2.582 18.333 3.542 20 5.082 20h13.836c1.54 0 2.502-1.667 2.502-3.159L18.418 9.17c-.406-1.492-1.749-2.583-3.159-2.583z"
        />
      </svg>
    );
  };

  /**
   * Render action buttons
   */
  private renderActionButtons = (): ReactNode => {
    const { onRetry, variant, actions } = this.props;
    const theme = useTheme();

    // If custom actions are provided, render them
    if (actions) {
      return (
        <div css={actionButtonsContainerStyles(theme)}>
          {actions}
        </div>
      );
    }

    if (variant === 'auth') {
      return (
        <div css={actionButtonsContainerStyles(theme)}>
          <button
            css={styledButtonStyles(theme, 'secondary')}
            onClick={this.handleGoToSignIn}
          >
            Go to Sign In
          </button>
        </div>
      );
    }

    return (
      <div css={actionButtonsContainerStyles(theme)}>
        <button
          css={styledButtonStyles(theme, 'primary')}
          onClick={onRetry || this.handleRetry}
        >
          Try Again
        </button>
        <button
          css={styledButtonStyles(theme, 'secondary')}
          onClick={this.handleRetry}
        >
          Reload Page
        </button>
      </div>
    );
  };

  override render(): ReactNode {
    const {
      error,
      variant,
      className,
      testId,
      title,
      showIcon,
      showDetails,
      errorCode
    } = this.props;

    const theme = useTheme();

    return (
      <div
        css={errorFallbackContainerStyles(theme)}
        className={className}
        data-testid={testId}
      >
        <div css={errorCardStyles(theme)}>
          <div css={errorContentStyles()}>
            {showIcon && (
              <div css={errorIconContainerStyles(theme)}>
                {this.renderErrorIcon()}
              </div>
            )}

            <div css={errorTitleStyles(theme)}>
              {title || (variant === 'auth' ? 'Authentication Error' : 'Something went wrong')}
            </div>

            <div css={errorMessageStyles(theme)}>
              {error}
            </div>

            {errorCode && (
              <div css={errorCodeStyles(theme)}>
                Error Code: {errorCode}
              </div>
            )}

            {showDetails && (
              <div css={errorDetailsStyles(theme)}>
                <details>
                  <summary>Technical Details</summary>
                  <pre>
                    {JSON.stringify({
                      error,
                      variant,
                      timestamp: new Date().toISOString(),
                      userAgent: navigator.userAgent,
                      url: window.location.href
                    }, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {this.renderActionButtons()}
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorFallback;
