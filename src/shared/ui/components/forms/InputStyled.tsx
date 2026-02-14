/** @jsxImportSource @emotion/react */
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "../types";
import Input from "../interactive/Input";
import { css } from '@emotion/react';
import React, { PureComponent, ReactNode } from 'react';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getSpacing, getColor, getTypography, getRadius, getBorderWidth, getTransition } from '../utils';

// Enterprise Emotion CSS for enhanced input styling with theme tokens
const inputStyledContainerStyles = (theme?: any, variant?: 'default' | 'outlined' | 'filled', size?: ComponentSize, error?: boolean) => css`
  position: relative;
  display: flex;
  align-items: center;
  
  .input-field {
    width: 100%;
    font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
    font-weight: ${theme?.typography?.fontWeight?.normal || '400'};
    color: ${getColor(theme, 'text.primary')};
    background: ${getColor(theme, 'background.primary')};
    border: ${getBorderWidth(theme, 'xs')} solid ${getColor(theme, 'border.medium')};
    border-radius: ${getRadius(theme, 'md')};
    transition: ${getTransition(theme, 'all', 'normal', 'ease')};
    outline: none;
    
    /* Size variants using theme spacing tokens */
    ${(() => {
    const currentSize = size || 'md';
    const paddingMap = {
      xs: `${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')}`,
      sm: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')}`,
      md: `${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')}`,
      lg: `${getSpacing(theme, 'lg')} ${getSpacing(theme, 'xl')}`,
      xl: `${getSpacing(theme, 'xl')} ${getSpacing(theme, '2xl')}`
    };
    return css`padding: ${paddingMap[currentSize]};`;
  })()}
    
    /* Font size using theme typography tokens */
    ${(() => {
    const currentSize = size || 'md';
    const fontSizeMap = {
      xs: getTypography(theme, 'fontSize.xs'),
      sm: getTypography(theme, 'fontSize.sm'),
      md: getTypography(theme, 'fontSize.base'),
      lg: getTypography(theme, 'fontSize.lg'),
      xl: getTypography(theme, 'fontSize.xl')
    };
    return css`font-size: ${fontSizeMap[currentSize]};`;
  })()}
    
    &::placeholder {
      color: ${getColor(theme, 'text.tertiary')};
    }
    
    &:focus {
      border-color: ${getColor(theme, 'brand.500')};
      box-shadow: 0 0 0 3px ${theme?.colors?.brand?.[200] || '#80bdff'};
    }
    
    &:hover:not(:focus):not(:disabled) {
      border-color: ${getColor(theme, 'border.dark')};
    }
    
    &:disabled {
      background: ${getColor(theme, 'background.tertiary')};
      color: ${getColor(theme, 'text.tertiary')};
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    /* Error state using theme semantic tokens */
    ${error && css`
      border-color: ${getColor(theme, 'semantic.error')};
      
      &:focus {
        border-color: ${getColor(theme, 'semantic.error')};
        box-shadow: 0 0 0 3px ${getColor(theme, 'semantic.error')};
      }
    `}
    
    /* Variant styles */
    ${variant === 'outlined' && css`
      background: transparent;
      border-width: ${getBorderWidth(theme, 'sm')};
    `}
    
    ${variant === 'filled' && css`
      background: ${getColor(theme, 'background.tertiary')};
      border: none;
      
      &:focus {
        background: ${getColor(theme, 'background.primary')};
        border: ${getBorderWidth(theme, 'xs')} solid ${getColor(theme, 'brand.500')};
      }
    `}
  }
  
  /* Responsive design using theme breakpoints */
  @media (max-width: ${theme?.breakpoints?.sm || '768px'}) {
    .input-field {
      ${(() => {
    const currentSize = size || 'md';
    const paddingMap = {
      xs: `${getSpacing(theme, 'xs')} ${getSpacing(theme, 'xs')}`,
      sm: `${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')}`,
      md: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')}`,
      lg: `${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')}`,
      xl: `${getSpacing(theme, 'lg')} ${getSpacing(theme, 'lg')}`
    };
    return css`padding: ${paddingMap[currentSize]};`;
  })()}
        
        font-size: ${getTypography(theme, 'fontSize.sm')};
    }
  }
`;

interface IInputStyledProps extends GenericWrapperWithRef {
  isStyled?: boolean;
  placeholder?: string;
  onFocus?: (event: React.FocusEvent) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent) => void;
  variant?: 'default' | 'outlined' | 'filled';
  size?: ComponentSize;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  id?: string; // Restrict id to string only for HTML input compatibility
}

class InputStyled extends PureComponent<IInputStyledProps> {
  static defaultProps: Partial<IInputStyledProps> = {
    isStyled: false,
    variant: 'default',
    size: 'md',
    disabled: false,
    error: false
  };

  private handleFocus = (event: React.FocusEvent): void => {
    const { onFocus } = this.props;
    onFocus?.(event);
  };

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { onChange } = this.props;
    onChange?.(event);
  };

  private handleBlur = (event: React.FocusEvent): void => {
    const { onBlur } = this.props;
    onBlur?.(event);
  };

  private renderHelperText = (): ReactNode => {
    const { error, helperText, theme } = this.props;

    if (!helperText) return null;

    return (
      <div
        style={{
          fontSize: getTypography(theme || {} as any, 'fontSize.xs'),
          marginTop: getSpacing(theme || {} as any, 'xs'),
          color: error ? getColor(theme || {} as any, 'semantic.error') : getColor(theme || {} as any, 'text.tertiary')
        }}
      >
        {helperText}
      </div>
    );
  };

  override render(): ReactNode {
    const {
      isStyled,
      forwardedRef,
      placeholder,
      variant,
      size,
      disabled,
      error,
      theme,
      ...props
    } = this.props;

    if (isStyled) {
      return (
        <div
          css={inputStyledContainerStyles(theme, variant, size, error)}
        >
          <input
            ref={forwardedRef}
            className="input-field"
            placeholder={placeholder}
            disabled={disabled}
            onFocus={this.handleFocus}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            {...props}
          />
          {this.renderHelperText()}
        </div>
      );
    }

    const inputProps: any = {
      placeholder: placeholder || '',
      onFocus: this.handleFocus,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      ...props
    };

    if (forwardedRef) {
      inputProps.ref = forwardedRef;
    }

    return <Input {...inputProps} />;
  }
}

export default withForwardedRefAndErrBoundary(InputStyled);