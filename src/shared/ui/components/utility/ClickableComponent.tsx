/** @jsxImportSource @emotion/react */
import React, { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getTransition } from '../utils';

interface IClickableProps {
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  height?: string;
}

// Enterprise Emotion CSS for clickable container
const clickableContainerStyles = (theme?: any, variant?: 'default' | 'primary' | 'secondary', disabled?: boolean) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  border-radius: ${getRadius(theme, 'sm')};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  user-select: none;
  
  ${variant === 'primary' ? css`
    background: ${disabled ? getColor(theme, 'border.light') : getColor(theme, 'brand.500')};
    color: ${getColor(theme, 'text.inverse')};
    border: 1px solid ${getColor(theme, 'brand.500')};
    
    &:hover:not(:disabled) {
      background: ${getColor(theme, 'brand.600')};
      border-color: ${getColor(theme, 'brand.600')};
    }
  ` : variant === 'secondary' ? css`
    background: ${getColor(theme, 'background.secondary')};
    color: ${getColor(theme, 'text.primary')};
    border: 1px solid ${getColor(theme, 'border.medium')};
    
    &:hover:not(:disabled) {
      background: ${getColor(theme, 'background.tertiary')};
      border-color: ${getColor(theme, 'border.dark')};
    }
  ` : css`
    background: transparent;
    color: ${getColor(theme, 'text.primary')};
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background: ${getColor(theme, 'background.secondary')};
    }
  `}
  
  &:active {
    transform: scale(0.98);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${getColor(theme, 'brand.200')};
  }
`;

/**
 * Enterprise Clickable Component
 * 
 * Replaces JSS-based clickableStyles.ts with enterprise Emotion CSS
 * following theme system patterns and class component best practices.
 */
class ClickableComponent extends PureComponent<IClickableProps> {
  static defaultProps: Partial<IClickableProps> = {
    disabled: false,
    variant: 'default'
  };

  private handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { disabled, onClick } = this.props;
    if (!disabled) {
      onClick?.(event);
    }
  };

  override render(): ReactNode {
    const {
      children,
      fontSize,
      fontWeight,
      padding,
      height,
      disabled = false,
      variant = 'default',
      className,
      onClick,
      ...props
    } = this.props;

    return (
      <div
        css={clickableContainerStyles(undefined, variant, disabled)}
        className={className}
        onClick={disabled ? undefined : this.handleClick}
        style={{
          fontSize: fontSize || 'inherit',
          fontWeight: fontWeight || 'inherit',
          padding: padding || getSpacing({} as any, 'sm'),
          height: height || 'auto',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
}

export default ClickableComponent;
