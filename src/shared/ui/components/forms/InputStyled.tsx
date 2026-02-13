import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "../types";
import Input from "../interactive/Input";
import styled, { css } from 'styled-components';
import { EnhancedTheme } from '@/core/modules/theming';
import React, { PureComponent, ReactNode } from 'react';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getSpacing, getColor, getTypography, getRadius, getBorderWidth, getTransition } from '../utils';

// Enterprise styled-components for enhanced input styling with theme tokens
const InputStyledContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['variant', 'disabled', 'size', 'error'].includes(prop),
}) <{
  theme?: EnhancedTheme;
  variant?: 'default' | 'outlined' | 'filled' | undefined;
  disabled?: boolean | undefined;
  size?: ComponentSize | undefined;
  error?: boolean | undefined;
}>`
  position: relative;
  display: flex;
  align-items: center;
  
  .input-field {
    width: 100%;
    font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
    font-weight: ${props => props.theme?.typography?.fontWeight?.normal || '400'};
    color: ${props => getColor(props.theme, 'text.primary')};
    background: ${props => getColor(props.theme, 'background.primary')};
    border: ${props => getBorderWidth(props.theme, 'xs')} solid ${props => getColor(props.theme, 'border.medium')};
    border-radius: ${props => getRadius(props.theme, 'md')};
    transition: ${props => getTransition(props.theme)};
    outline: none;
    
    /* Size variants using theme spacing tokens */
    ${props => {
    const size = props.size || 'md';
    const paddingMap = {
      xs: `${getSpacing(props.theme, 'xs')} ${getSpacing(props.theme, 'sm')}`,
      sm: `${getSpacing(props.theme, 'sm')} ${getSpacing(props.theme, 'md')}`,
      md: `${getSpacing(props.theme, 'md')} ${getSpacing(props.theme, 'lg')}`,
      lg: `${getSpacing(props.theme, 'lg')} ${getSpacing(props.theme, 'xl')}`,
      xl: `${getSpacing(props.theme, 'xl')} ${getSpacing(props.theme, '2xl')}`
    };
    return `padding: ${paddingMap[size]};`;
  }}
    
    /* Font size using theme typography tokens */
    ${props => {
    const size = props.size || 'md';
    const fontSizeMap = {
      xs: getTypography(props.theme, 'fontSize.xs'),
      sm: getTypography(props.theme, 'fontSize.sm'),
      md: getTypography(props.theme, 'fontSize.base'),
      lg: getTypography(props.theme, 'fontSize.lg'),
      xl: getTypography(props.theme, 'fontSize.xl')
    };
    return `font-size: ${fontSizeMap[size]};`;
  }}
    
    &::placeholder {
      color: ${props => getColor(props.theme, 'text.tertiary')};
    }
    
    &:focus {
      border-color: ${props => getColor(props.theme, 'brand.500')};
      box-shadow: 0 0 0 3px ${props => props.theme?.colors?.brand?.[200] || '#80bdff'};
    }
    
    &:hover:not(:focus):not(:disabled) {
      border-color: ${props => getColor(props.theme, 'border.dark')};
    }
    
    &:disabled {
      background: ${props => getColor(props.theme, 'background.tertiary')};
      color: ${props => getColor(props.theme, 'text.tertiary')};
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    /* Error state using theme semantic tokens */
    ${props => props.error && css`
      border-color: ${props => getColor(props.theme, 'semantic.error')};
      
      &:focus {
        border-color: ${props => getColor(props.theme, 'semantic.error')};
        box-shadow: 0 0 0 3px ${props => getColor(props.theme, 'semantic.error')};
      }
    `}
    
    /* Variant styles */
    ${props => props.variant === 'outlined' && css`
      background: transparent;
      border-width: ${props => getBorderWidth(props.theme, 'sm')};
    `}
    
    ${props => props.variant === 'filled' && css`
      background: ${props => getColor(props.theme, 'background.tertiary')};
      border: none;
      
      &:focus {
        background: ${props => getColor(props.theme, 'background.primary')};
        border: ${props => getBorderWidth(props.theme, 'xs')} solid ${props => getColor(props.theme, 'brand.500')};
      }
    `}
  }
  
  /* Responsive design using theme breakpoints */
  @media (max-width: ${props => props.theme?.breakpoints?.sm || '768px'}) {
    .input-field {
      ${props => {
    const size = props.size || 'md';
    const paddingMap = {
      xs: `${getSpacing(props.theme, 'xs')} ${getSpacing(props.theme, 'xs')}`,
      sm: `${getSpacing(props.theme, 'xs')} ${getSpacing(props.theme, 'sm')}`,
      md: `${getSpacing(props.theme, 'sm')} ${getSpacing(props.theme, 'md')}`,
      lg: `${getSpacing(props.theme, 'md')} ${getSpacing(props.theme, 'lg')}`,
      xl: `${getSpacing(props.theme, 'lg')} ${getSpacing(props.theme, 'lg')}`
    };
    return `padding: ${paddingMap[size]};`;
  }}
      
      font-size: ${props => getTypography(props.theme, 'fontSize.sm')};
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
          fontSize: getTypography(theme, 'fontSize.xs'),
          marginTop: getSpacing(theme, 'xs'),
          color: error ? getColor(theme, 'semantic.error') : getColor(theme, 'text.tertiary')
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
      ...props
    } = this.props;

    if (isStyled) {
      const containerProps: any = {
        variant: variant || 'default',
        disabled: disabled || false,
        size: size || 'md',
        error: error || false
      };

      return (
        <InputStyledContainer {...containerProps}>
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
        </InputStyledContainer>
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