import React, { PureComponent, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { getSpacing, getColor, getTypography, getRadius, getBorderWidth, getTransition } from '../utils';

interface TextAreaStyledProps extends GenericWrapper {
  name: string;
  value: string | number;
  handleChange: (value: string | number) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  hidden?: boolean;
  disabled?: boolean;
  error?: boolean;
  rows?: number;
  className?: string;
  theme?: any;
}

/**
 * Enterprise TextArea Component
 * 
 * Replaces JSS-based TextAreaStyled with enterprise styled-components
 * following theme system patterns and class component best practices.
 */
class TextAreaStyled extends PureComponent<TextAreaStyledProps> {
  static defaultProps: Partial<TextAreaStyledProps> = {
    name: "",
    value: "",
    placeholder: "",
    maxLength: 999,
    minLength: 0,
    hidden: false,
    disabled: false,
    error: false,
    rows: 4
  };

  private handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { handleChange } = this.props;
    handleChange(event.target.value);
  };

  private renderHelperText = (theme: any): ReactNode => {
    const { error } = this.props;

    if (!error) return null;

    return (
      <div style={{
        fontSize: getSpacing(theme, 12),
        marginTop: getSpacing(theme, 4),
        color: getColor(theme, 'semantic.error')
      }}>
        This field has an error
      </div>
    );
  };

  override render(): ReactNode {
    const {
      name,
      value,
      placeholder,
      maxLength,
      minLength,
      hidden,
      disabled,
      error,
      rows,
      className,
      theme,
      ...props
    } = this.props;

    return (
      <TextAreaContainer className={className} theme={theme} disabled={disabled || false} error={error || false}>
        <textarea
          className="textarea-field"
          name={name}
          value={value}
          onChange={this.handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          hidden={hidden}
          disabled={disabled}
          style={{
            borderColor: error ? getColor(theme, 'semantic.error') : undefined,
            boxShadow: error ? `0 0 0 3px ${getColor(theme, 'semantic.error')}20` : undefined
          }}
          rows={rows}
          {...props}
        />
        {this.renderHelperText(theme)}
      </TextAreaContainer>
    );
  }
}

// Enterprise styled-components for textarea styling
const TextAreaContainer = styled.div<{ theme: any; disabled?: boolean; error?: boolean }>`
  position: relative;
  width: 100%;
  
  .textarea-field {
    width: 100%;
    resize: none;
    outline: none;
    box-sizing: border-box;
    border-radius: ${props => getRadius(props.theme, 'md')};
    padding: ${props => getSpacing(props.theme, 'md')} ${props => getSpacing(props.theme, 'lg')};
    font-size: ${props => getTypography(props.theme, 'fontSize.base')};
    font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
    font-weight: ${props => props.theme?.typography?.fontWeight?.normal || '400'};
    color: ${props => getColor(props.theme, 'text.primary')};
    background: ${props => getColor(props.theme, 'background.primary')};
    border: ${props => getBorderWidth(props.theme, 'sm')} solid ${props => getColor(props.theme, 'border.medium')};
    transition: ${props => getTransition(props.theme, 'all', 'normal', 'ease')};
    
    &::placeholder {
      color: ${props => getColor(props.theme, 'text.tertiary')};
    }
    
    &:focus {
      border-color: ${props => getColor(props.theme, 'brand.500')};
      box-shadow: 0 0 0 3px ${props => getColor(props.theme, 'brand.200')};
      outline: none;
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
    
    ${props => props.error && css`
      border-color: ${props => getColor(props.theme, 'semantic.error')};
      box-shadow: 0 0 0 3px ${props => getColor(props.theme, 'semantic.error')}20;
      
      &:focus {
        border-color: ${props => getColor(props.theme, 'semantic.error')};
        box-shadow: 0 0 0 3px ${props => getColor(props.theme, 'semantic.error')}30;
      }
    `}
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme?.breakpoints?.sm || '640px'}) {
    .textarea-field {
      padding: ${props => getSpacing(props.theme, 'sm')} ${props => getSpacing(props.theme, 'md')};
      font-size: ${props => getTypography(props.theme, 'fontSize.sm')};
    }
  }
`;

export default TextAreaStyled