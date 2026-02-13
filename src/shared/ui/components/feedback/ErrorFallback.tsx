import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';

// Styled components with theme token integration
const ErrorFallbackContainer = styled.div<{ theme?: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${props => props.theme?.colors?.background?.secondary || '#f8f9fa'};
  font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
`;

const ErrorCard = styled.div<{ theme?: any }>`
  max-width: 28rem;
  width: 100%;
  padding: ${props => props.theme?.spacing?.xl || '32px'};
  background-color: ${props => props.theme?.colors?.background?.primary || '#ffffff'};
  border-radius: ${props => props.theme?.radius?.lg || '8px'};
  box-shadow: ${props => props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
`;

const ErrorContent = styled.div<{ theme?: any }>`
  text-align: center;
`;

const ErrorIconContainer = styled.div<{ theme?: any }>`
  margin-bottom: ${props => props.theme?.spacing?.lg || '24px'};
`;

const ErrorTitle = styled.h3<{ theme?: any }>`
  font-size: ${props => props.theme?.typography?.fontSize?.xl || '20px'};
  font-weight: ${props => props.theme?.typography?.fontWeight?.semibold || '600'};
  color: ${props => props.theme?.colors?.text?.primary || '#111827'};
  margin-bottom: ${props => props.theme?.spacing?.sm || '8px'};
`;

const ErrorMessage = styled.p<{ theme?: any }>`
  font-size: ${props => props.theme?.typography?.fontSize?.base || '16px'};
  color: ${props => props.theme?.colors?.text?.secondary || '#6b7280'};
  margin-bottom: ${props => props.theme?.spacing?.xl || '32px'};
  line-height: ${props => props.theme?.typography?.lineHeight?.relaxed || '1.625'};
`;

const ActionButtonsContainer = styled.div<{ theme?: any }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme?.spacing?.md || '16px'};
`;

const StyledButton = styled.button<{ theme?: any; variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: ${props => props.theme?.spacing?.md || '16px'} ${props => props.theme?.spacing?.lg || '24px'};
  border: 2px solid ${props => props.variant === 'primary'
        ? (props.theme?.colors?.brand?.[500] || '#007bff')
        : (props.theme?.colors?.border?.medium || '#6c757d')};
  background-color: ${props => props.variant === 'primary'
        ? (props.theme?.colors?.brand?.[500] || '#007bff')
        : 'transparent'};
  color: ${props => props.variant === 'primary'
        ? (props.theme?.colors?.text?.inverse || '#ffffff')
        : (props.theme?.colors?.brand?.[500] || '#007bff')};
  border-radius: ${props => props.theme?.radius?.md || '6px'};
  font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
  font-size: ${props => props.theme?.typography?.fontSize?.base || '16px'};
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || '500'};
  cursor: pointer;
  transition: all ${props => props.theme?.animation?.duration?.fast || '0.2s'} ${props => props.theme?.animation?.easing?.ease || 'ease'};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
    ${props => props.variant === 'primary' && `
      background-color: ${props.theme?.colors?.brand?.[600] || '#0056b3'};
      border-color: ${props.theme?.colors?.brand?.[600] || '#0056b3'};
    `}
    ${props => props.variant === 'secondary' && `
      background-color: ${props.theme?.colors?.background?.secondary || '#f8f9fa'};
      border-color: ${props.theme?.colors?.border?.dark || '#495057'};
      color: ${props.theme?.colors?.brand?.[500] || '#007bff'};
    `}
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme?.colors?.brand?.[300] || '#80bdff'};
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
                    width: '64px',
                    height: '64px',
                    margin: '0 auto',
                    color: '#ef4444'
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
        const { error, variant, className, testId } = this.props;

        return (
            <ErrorFallbackContainer className={className} data-testid={testId}>
                <ErrorCard>
                    <ErrorContent>
                        {/* Error Icon */}
                        <ErrorIconContainer>
                            {this.renderErrorIcon()}
                        </ErrorIconContainer>

                        {/* Error Message */}
                        <ErrorTitle>
                            {variant === 'auth' ? 'Authentication Error' : 'Something went wrong'}
                        </ErrorTitle>

                        <ErrorMessage>
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
