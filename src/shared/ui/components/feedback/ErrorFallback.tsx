import { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getColor, getSpacing, getTypography, getRadius, getBorderWidth, getShadow, getTransition } from '../utils';

// Styled components with theme token integration
const ErrorFallbackContainer = styled.div<{ theme?: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${props => getColor(props.theme, 'background.secondary')};
  font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
`;

const ErrorCard = styled.div<{ theme?: any }>`
  max-width: 28rem;
  width: 100%;
  padding: ${props => getSpacing(props.theme, 'xl')};
  background-color: ${props => getColor(props.theme, 'background.primary')};
  border-radius: ${props => getRadius(props.theme, 'lg')};
  box-shadow: ${props => getShadow(props.theme, 'md')};
`;

const ErrorContent = styled.div<{ theme?: any }>`
  text-align: center;
`;

const ErrorIconContainer = styled.div<{ theme?: any }>`
  margin-bottom: ${props => getSpacing(props.theme, 'lg')};
`;

const ErrorTitle = styled.h3<{ theme?: any }>`
  font-size: ${props => getTypography(props.theme, 'fontSize.xl')};
  font-weight: ${props => props.theme?.typography?.fontWeight?.semibold || '600'};
  color: ${props => getColor(props.theme, 'text.primary')};
  margin-bottom: ${props => getSpacing(props.theme, 'sm')};
`;

const ErrorMessage = styled.p<{ theme?: any }>`
  font-size: ${props => getTypography(props.theme, 'fontSize.base')};
  color: ${props => getColor(props.theme, 'text.secondary')};
  margin-bottom: ${props => getSpacing(props.theme, 'xl')};
  line-height: ${props => props.theme?.typography?.lineHeight?.relaxed || '1.625'};
`;

const ActionButtonsContainer = styled.div<{ theme?: any }>`
  display: flex;
  flex-direction: column;
  gap: ${props => getSpacing(props.theme, 'md')};
`;

const StyledButton = styled.button<{ theme?: any; variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: ${props => getSpacing(props.theme, 'md')} ${props => getSpacing(props.theme, 'lg')};
  border: ${props => getBorderWidth(props.theme, 'md')} solid ${props => props.variant === 'primary'
        ? getColor(props.theme, 'brand.500')
        : getColor(props.theme, 'border.medium')};
  background-color: ${props => props.variant === 'primary'
        ? getColor(props.theme, 'brand.500')
        : 'transparent'};
  color: ${props => props.variant === 'primary'
        ? getColor(props.theme, 'text.inverse')
        : getColor(props.theme, 'brand.500')};
  border-radius: ${props => getRadius(props.theme, 'md')};
  font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
  font-size: ${props => getTypography(props.theme, 'fontSize.base')};
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || '500'};
  cursor: pointer;
  transition: ${props => getTransition(props.theme, 'all', 'fast', 'ease')};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => getShadow(props.theme, 'md')};
    ${props => props.variant === 'primary' && `
      background-color: ${getColor(props.theme, 'brand.600')};
      border-color: ${getColor(props.theme, 'brand.600')};
    `}
    ${props => props.variant === 'secondary' && `
      background-color: ${getColor(props.theme, 'background.secondary')};
      border-color: ${getColor(props.theme, 'border.dark')};
      color: ${getColor(props.theme, 'brand.500')};
    `}
  }
  
  &:focus {
    outline: 2px solid ${props => getColor(props.theme, 'brand.300')};
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
        return (
            <svg
                style={{
                    width: getSpacing(this.props.theme || {}, 64),
                    height: getSpacing(this.props.theme || {}, 64),
                    margin: '0 auto',
                    color: getColor(this.props.theme || {}, 'semantic.error')
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
        const { onRetry, variant } = this.props;

        if (variant === 'auth') {
            return (
                <ActionButtonsContainer>
                    <StyledButton variant="secondary" onClick={this.handleGoToSignIn}>
                        Go to Sign In
                    </StyledButton>
                </ActionButtonsContainer>
            );
        }

        return (
            <ActionButtonsContainer>
                <StyledButton variant="primary" onClick={onRetry || this.handleRetry}>
                    Try Again
                </StyledButton>
                <StyledButton variant="secondary" onClick={this.handleRetry}>
                    Reload Page
                </StyledButton>
            </ActionButtonsContainer>
        );
    };

    override render(): ReactNode {
        const { error, variant, className, testId, theme } = this.props;

        return (
            <ErrorFallbackContainer className={className} data-testid={testId} theme={theme}>
                <ErrorCard theme={theme}>
                    <ErrorContent theme={theme}>
                        {/* Error Icon */}
                        <ErrorIconContainer theme={theme}>
                            {this.renderErrorIcon()}
                        </ErrorIconContainer>

                        {/* Error Message */}
                        <ErrorTitle theme={theme}>
                            {variant === 'auth' ? 'Authentication Error' : 'Something went wrong'}
                        </ErrorTitle>

                        <ErrorMessage theme={theme}>
                            {error}
                        </ErrorMessage>

                        {/* Action Buttons */}
                        {this.renderActionButtons()}
                    </ErrorContent>
                </ErrorCard>
            </ErrorFallbackContainer>
        );
    }
}

export default ErrorFallback;
