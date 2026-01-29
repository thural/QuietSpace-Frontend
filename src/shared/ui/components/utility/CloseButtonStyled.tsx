import { ConsumerFn } from "@/shared/types/genericTypes";
import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';
import { Container } from '@/shared/ui/components/layout/Container';

interface CloseButtonProps {
  handleToggle: ConsumerFn;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'danger';
}

/**
 * Enterprise Close Button Component
 * 
 * Replaces JSS-based CloseButtonStyled with enterprise styled-components
 * following theme system patterns and class component best practices.
 */
class CloseButtonStyled extends PureComponent<CloseButtonProps> {
  static defaultProps: Partial<CloseButtonProps> = {
    disabled: false,
    variant: 'default'
  };

  private handleClick = (): void => {
    const { disabled, handleToggle } = this.props;
    if (!disabled) {
      handleToggle();
    }
  };

  private getVariantStyles = (): string => {
    const { variant } = this.props;
    return `close-button-${variant}`;
  };

  render(): ReactNode {
    const { className, disabled, variant } = this.props;

    return (
      <CloseButtonContainer
        onClick={this.handleClick}
        disabled={disabled}
        className={`close-button ${className || ''} ${this.getVariantStyles()}`}
        aria-label="Close"
      >
        ×
      </CloseButtonContainer>
    );
  }
}

// Enterprise styled-components for close button styling
const CloseButtonContainer = styled.button<{ theme: EnhancedTheme }>`
  display: none;
  position: fixed;
  top: ${props => props.theme.spacing.xs};
  right: ${props => props.theme.spacing.sm};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.xl};
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.radius.md};
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  z-index: 1000;
  
  &:hover {
    background: ${props => props.theme.colors.background.tertiary};
    color: ${props => props.theme.colors.text.secondary};
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.brand[500]};
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  // Responsive design - show on mobile
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    display: block;
  }
`;

export default CloseButtonStyled