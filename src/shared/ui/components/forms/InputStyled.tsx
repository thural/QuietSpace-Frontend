import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import { Input } from "@/shared/ui/components/interactive";
import styled, { css } from 'styled-components';
import { EnhancedTheme } from '@/core/modules/theming/internal/types';
import React, { PureComponent, ReactNode } from 'react';
import { ComponentSize } from '../../utils/themeTokenHelpers';

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
    color: ${props => props.theme?.colors?.text?.primary || '#212529'};
    background: ${props => props.theme?.colors?.background?.primary || '#ffffff'};
    border: 1px solid ${props => props.theme?.colors?.border?.medium || '#6c757d'};
    border-radius: ${props => props.theme?.radius?.md || '6px'};
    transition: all ${props => props.theme?.animation?.duration?.normal || '0.3s'} ${props => props.theme?.animation?.easing?.ease || 'ease'};
    outline: none;
    
    /* Size variants using theme spacing tokens */
    ${props => {
    const size = props.size || 'md';
    const paddingMap = {
      xs: `${props.theme?.spacing?.xs || '4px'} ${props.theme?.spacing?.sm || '8px'}`,
      sm: `${props.theme?.spacing?.sm || '8px'} ${props.theme?.spacing?.md || '16px'}`,
      md: `${props.theme?.spacing?.md || '16px'} ${props.theme?.spacing?.lg || '24px'}`,
      lg: `${props.theme?.spacing?.lg || '24px'} ${props.theme?.spacing?.xl || '32px'}`,
      xl: `${props.theme?.spacing?.xl || '32px'} ${props.theme?.spacing?.xl || '32px'}`
    };
    return `padding: ${paddingMap[size]};`;
  }}
    
    /* Font size using theme typography tokens */
    ${props => {
    const size = props.size || 'md';
    const fontSizeMap = {
      xs: props.theme?.typography?.fontSize?.xs || '12px',
      sm: props.theme?.typography?.fontSize?.sm || '14px',
      md: props.theme?.typography?.fontSize?.base || '16px',
      lg: props.theme?.typography?.fontSize?.lg || '18px',
      xl: props.theme?.typography?.fontSize?.xl || '20px'
    };
    return `font-size: ${fontSizeMap[size]};`;
  }}
    
    &::placeholder {
      color: ${props => props.theme?.colors?.text?.tertiary || '#6c757d'};
    }
    
    &:focus {
      border-color: ${props => props.theme?.colors?.brand?.[500] || '#007bff'};
      box-shadow: 0 0 0 3px ${props => props.theme?.colors?.brand?.[200] || '#80bdff'};
    }
    
    &:hover:not(:focus):not(:disabled) {
      border-color: ${props => props.theme?.colors?.border?.dark || '#495057'};
    }
    
    &:disabled {
      background: ${props => props.theme?.colors?.background?.tertiary || '#e9ecef'};
      color: ${props => props.theme?.colors?.text?.tertiary || '#6c757d'};
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    /* Error state using theme semantic tokens */
    ${props => props.error && css`
      border-color: ${props.theme?.colors?.semantic?.error || '#dc3545'};
      
      &:focus {
        border-color: ${props.theme?.colors?.semantic?.error || '#dc3545'};
        box-shadow: 0 0 0 3px ${props.theme?.colors?.semantic?.error || '#f1b0b7'};
      }
    `}
    
    /* Variant styles */
    ${props => props.variant === 'outlined' && css`
      background: transparent;
      border-width: 2px;
    `}
    
    ${props => props.variant === 'filled' && css`
      background: ${props.theme?.colors?.background?.tertiary || '#e9ecef'};
      border: none;
      
      &:focus {
        background: ${props.theme?.colors?.background?.primary || '#ffffff'};
        border: 1px solid ${props.theme?.colors?.brand?.[500] || '#007bff'};
      }
    `}
  }
  
  /* Responsive design using theme breakpoints */
  @media (max-width: ${props => props.theme?.breakpoints?.sm || '768px'}) {
    .input-field {
      ${props => {
    const size = props.size || 'md';
    const paddingMap = {
      xs: `${props.theme?.spacing?.xs || '4px'} ${props.theme?.spacing?.xs || '4px'}`,
      sm: `${props.theme?.spacing?.xs || '4px'} ${props.theme?.spacing?.sm || '8px'}`,
      md: `${props.theme?.spacing?.sm || '8px'} ${props.theme?.spacing?.md || '16px'}`,
      lg: `${props.theme?.spacing?.md || '16px'} ${props.theme?.spacing?.lg || '24px'}`,
      xl: `${props.theme?.spacing?.lg || '24px'} ${props.theme?.spacing?.lg || '24px'}`
    };
    return `padding: ${paddingMap[size]};`;
  }}
      
      font-size: ${props => props.theme?.typography?.fontSize?.sm || '14px'};
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
    const { error, helperText } = this.props;

    if (!helperText) return null;

    return (
      <div
        style={{
          fontSize: '12px',
          marginTop: '4px',
          color: error ? '#dc3544' : '#6b7280'
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