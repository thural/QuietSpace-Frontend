/** @jsxImportSource @emotion/react */
import { ConsumerFn } from "@/shared/types/genericTypes";
import React, { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getTransition, getTypography } from '../utils';

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

  override render(): ReactNode {
    const { className, disabled, variant } = this.props;

    return (
      <button
        css={getCloseButtonStyles(undefined, variant, disabled)}
        onClick={this.handleClick}
        disabled={disabled}
        className={`close-button ${className || ''} close-button-${variant}`}
        aria-label="Close"
      >
        ×
      </button>
    );
  }
}

// Enterprise Emotion CSS for close button styling
const getCloseButtonStyles = (theme?: any, variant?: string, disabled?: boolean) => css`
  display: none;
  position: fixed;
  top: ${getSpacing(theme, 'xs')};
  right: ${getSpacing(theme, 'sm')};
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  font-size: ${getTypography(theme, 'fontSize.xl')};
  background: none;
  border: none;
  color: ${getColor(theme, 'text.primary')};
  padding: ${getSpacing(theme, 'sm')};
  border-radius: ${getRadius(theme, 'md')};
  transition: all ${getTransition(theme, 'all', 'fast', 'ease')};
  z-index: 1000;
  
  &:hover {
    background: ${getColor(theme, 'background.tertiary')};
    color: ${getColor(theme, 'text.secondary')};
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:focus {
    outline: 2px solid ${getColor(theme, 'brand.500')};
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  // Responsive design - show on mobile
  @media (max-width: 768px) {
    display: block;
  }
`;

export default CloseButtonStyled