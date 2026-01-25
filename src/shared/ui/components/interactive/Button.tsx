/**
 * Enterprise Button Component
 * 
 * A versatile button component that replaces the original Button component
 * with enhanced theme integration and enterprise patterns.
 */

import React from 'react';
import styled from 'styled-components';
import { ButtonProps } from '../types';
import { getButtonVariantStyles, getSizeStyles } from '../utils';

// Styled component implementation
const StyledButton = styled.button<{ theme: any; $props: ButtonProps }>`
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus:not(:disabled) {
    outline: 2px solid ${(props) => props.theme.colors?.primary || '#007bff'};
    outline-offset: 2px;
  }
  
  ${(props) => getButtonVariantStyles(props.$props.variant || 'primary', props.theme)}
  ${(props) => getSizeStyles(props.$props.size || 'md', props.theme)}
  
  ${(props) => props.$props.fullWidth && 'width: 100%;'}
  ${(props) => props.$props.rounded && 'border-radius: 50px;'}
  ${(props) => props.$props.outlined && `
    background: transparent;
    border: 2px solid;
  `}
  ${(props) => props.$props.gradient && `
    background: ${props.theme.colors?.gradient || 'linear-gradient(45deg, #007bff, #6f42c1)'};
    color: white;
    border: none;
  `}
`;

/**
 * Button Component
 * 
 * A comprehensive button component with multiple variants, sizes,
 * and states for consistent user interactions.
 * 
 * @param props - Button props for styling and behavior
 * @returns JSX Element
 */
export const Button: React.FC<ButtonProps> = (props) => {
    const {
        children,
        theme,
        className,
        testId,
        disabled = false,
        loading = false,
        type = 'button',
        onClick,
        onFocus,
        onBlur,
        onMouseEnter,
        onMouseLeave,
        ...buttonProps
    } = props;

    const handleClick = (event: React.MouseEvent) => {
        if (!disabled && !loading && onClick) {
            onClick(event);
        }
    };

    return (
        <StyledButton
            theme={theme}
            $props={props}
            className={className}
            data-testid={testId}
            disabled={disabled || loading}
            type={type}
            onClick={handleClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {loading ? 'Loading...' : children}
        </StyledButton>
    );
};

Button.displayName = 'Button';

export default Button;
