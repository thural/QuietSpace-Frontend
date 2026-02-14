/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { BaseComponentProps } from '../types';
import { getColor, getSpacing, getTypography, getRadius, getBorderWidth, getShadow, getTransition } from '../utils';

// Emotion CSS utility functions
const createErrorFallbackContainerStyles = (theme: any) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${getColor(theme, 'background.secondary')};
  font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
`;

const createErrorCardStyles = (theme: any) => css`
  max-width: 28rem;
  width: 100%;
  padding: ${getSpacing(theme, 'xl')};
  background-color: ${getColor(theme, 'background.primary')};
  border-radius: ${getRadius(theme, 'lg')};
  box-shadow: ${getShadow(theme, 'md')};
`;

const createErrorContentStyles = () => css`
  text-align: center;
`;

const createErrorIconContainerStyles = (theme: any) => css`
  margin-bottom: ${getSpacing(theme, 'lg')};
`;

const createErrorTitleStyles = (theme: any) => css`
  font-size: ${getTypography(theme, 'fontSize.xl')};
  font-weight: ${theme?.typography?.fontWeight?.semibold || '600'};
  color: ${getColor(theme, 'text.primary')};
  margin-bottom: ${getSpacing(theme, 'sm')};
`;

const createErrorMessageStyles = (theme: any) => css`
  font-size: ${getTypography(theme, 'fontSize.base')};
  color: ${getColor(theme, 'text.secondary')};
  margin-bottom: ${getSpacing(theme, 'xl')};
  line-height: ${theme?.typography?.lineHeight?.relaxed || '1.625'};
`;

const createActionButtonsContainerStyles = (theme: any) => css`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(theme, 'md')};
`;

const createStyledButtonStyles = (theme: any, variant: 'primary' | 'secondary' = 'primary') => css`
  width: 100%;
  padding: ${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')};
  border: ${getBorderWidth(theme, 'md')} solid ${variant === 'primary'
        ? getColor(theme, 'brand.500')
        : getColor(theme, 'border.medium')};
  background-color: ${variant === 'primary'
        ? getColor(theme, 'brand.500')
        : 'transparent'};
  color: ${variant === 'primary'
        ? getColor(theme, 'text.inverse')
        : getColor(theme, 'brand.500')};
  border-radius: ${getRadius(theme, 'md')};
  font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
  font-size: ${getTypography(theme, 'fontSize.base')};
  font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
  cursor: pointer;
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${getShadow(theme, 'md')};
    ${variant === 'primary' && css`
      background-color: ${getColor(theme, 'brand.600')};
      border-color: ${getColor(theme, 'brand.600')};
    `}
    ${variant === 'secondary' && css`
      background-color: ${getColor(theme, 'background.secondary')};
      border-color: ${getColor(theme, 'border.dark')};
      color: ${getColor(theme, 'brand.500')};
    `}
  }
  
  &:focus {
    outline: 2px solid ${getColor(theme, 'brand.300')};
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

interface IErrorFallbackProps extends BaseComponentProps {
    error?: string;
    onRetry?: () => void;
    variant?: 'default' | 'auth';
}

/**
 * ErrorFallback component for displaying user-friendly error messages
 * 
 * Provides clear error feedback with retry option for better user experience.
 * Used when authentication or user data loading fails.
 */
class ErrorFallback extends PureComponent<IErrorFallbackProps> {
    static defaultProps: Partial<IErrorFallbackProps> = {
        error: 'An error occurred',
        variant: 'default'
    };

    // Default retry handler - reloads the page
    private handleRetry = (): void => {
        window.location.reload();
    };

    // Navigate to sign-in page
    private handleGoToSignIn = (): void => {
        window.location.href = '/signin';
    };

    // Render error icon SVG
    private renderErrorIcon = (): ReactNode => {
        const { theme } = this.props;
        return (
            <svg
                style={{
                    width: getSpacing(theme, 64),
                    height: getSpacing(theme, 64),
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

    // Render action buttons
    private renderActionButtons = (): ReactNode => {
        const { onRetry, variant, theme } = this.props;

        if (variant === 'auth') {
            return (
                <div css={createActionButtonsContainerStyles(theme || {} as any)}>
                    <button
                        css={createStyledButtonStyles(theme || {} as any, 'secondary')}
                        onClick={this.handleGoToSignIn}
                    >
                        Go to Sign In
                    </button>
                </div>
            );
        }

        return (
            <div css={createActionButtonsContainerStyles(theme || {} as any)}>
                <button
                    css={createStyledButtonStyles(theme || {} as any, 'primary')}
                    onClick={onRetry || this.handleRetry}
                >
                    Try Again
                </button>
                <button
                    css={createStyledButtonStyles(theme || {} as any, 'secondary')}
                    onClick={this.handleRetry}
                >
                    Reload Page
                </button>
            </div>
        );
    };

    override render(): ReactNode {
        const { error, variant, className, testId, theme } = this.props;

        return (
            <div
                css={createErrorFallbackContainerStyles(theme || {} as any)}
                className={className}
                data-testid={testId}
            >
                <div css={createErrorCardStyles(theme || {} as any)}>
                    <div css={createErrorContentStyles()}>
                        <div css={createErrorIconContainerStyles(theme || {} as any)}>
                            {this.renderErrorIcon()}
                        </div>
                        <div css={createErrorTitleStyles(theme || {} as any)}>
                            {variant === 'auth' ? 'Authentication Error' : 'Something went wrong'}
                        </div>
                        <div css={createErrorMessageStyles(theme || {} as any)}>
                            {error}
                        </div>
                        {this.renderActionButtons()}
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorFallback;
