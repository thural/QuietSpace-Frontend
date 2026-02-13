/**
 * Enterprise Button Component
 * 
 * A versatile button component that replaces the original Button component
 * with enhanced theme integration and enterprise patterns.
 */

import { PureComponent, ReactNode, MouseEvent } from 'react';
import styled from 'styled-components';
import { ButtonProps } from '../types';
import { getButtonVariantStyles, getSizeStyles, getBorderWidth, getRadius, getColor } from '../utils';

// Styled component implementation
const StyledButton = styled.button<{ theme: any; $props: ButtonProps }>`
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: all ${(props) => props.theme.animation?.duration?.fast || '0.2s'} ${(props) => props.theme.animation?.easing?.ease || 'ease'};
  outline: none;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus:not(:disabled) {
    outline: ${(props) => getBorderWidth(props.theme, 'md')} solid ${(props) => getColor(props.theme, 'brand.500')};
    outline-offset: ${(props) => props.theme.spacing?.xs || '4px'};
  }
  
  ${(props) => getButtonVariantStyles(props.$props.variant || 'primary', props.theme)}
  ${(props) => getSizeStyles(props.$props.size || 'md', props.theme)}
  
  ${(props) => props.$props.fullWidth && 'width: 100%;'}
  ${(props) => props.$props.rounded && `border-radius: ${getRadius(props.theme, 'round')};`}
  ${(props: any) => props.$props.outlined && `
    background: transparent;
    border: ${(props: any) => getBorderWidth(props.theme, 'md')} solid;
  `}
  ${(props: any) => props.$props.gradient && `
    background: ${props.theme.colors?.gradient || `linear-gradient(45deg, ${getColor(props.theme, 'brand.500')}, ${getColor(props.theme, 'brand.600')})`};
    color: ${(props: any) => getColor(props.theme, 'text.inverse')};
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
class Button extends PureComponent<ButtonProps> {
  /**
   * Handle button click event
   */
  private handleClick = (event: MouseEvent): void => {
    const { disabled = false, loading = false, onClick } = this.props;

    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  override render(): ReactNode {
    const {
      children,
      theme,
      className,
      testId,
      disabled = false,
      loading = false,
      type = 'button',
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      ...buttonProps
    } = this.props;

    return (
      <StyledButton
        theme={theme}
        $props={this.props}
        className={className}
        data-testid={testId}
        disabled={disabled || loading}
        type={type}
        onClick={this.handleClick}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...buttonProps}
      >
        {loading ? 'Loading...' : children}
      </StyledButton>
    );
  }
}

export default Button;
