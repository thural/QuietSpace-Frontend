/** @jsxImportSource @emotion/react */
import React, { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
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
 * Replaces JSS-based TextAreaStyled with Emotion CSS
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

    const textAreaContainerStyles = (theme?: any, error?: boolean) => css`
            position: relative;
            width: 100%;
            
            .textarea-field {
                width: 100%;
                resize: none;
                outline: none;
                box-sizing: border-box;
                border-radius: ${getRadius(theme, 'md')};
                padding: ${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')};
                font-size: ${getTypography(theme, 'fontSize.base')};
                font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
                font-weight: ${theme?.typography?.fontWeight?.normal || '400'};
                color: ${getColor(theme, 'text.primary')};
                background: ${getColor(theme, 'background.primary')};
                border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
                transition: ${getTransition(theme, 'all', 'normal', 'ease')};
                
                &::placeholder {
                    color: ${getColor(theme, 'text.tertiary')};
                }
                
                &:focus {
                    border-color: ${getColor(theme, 'brand.500')};
                    box-shadow: 0 0 0 3px ${getColor(theme, 'brand.200')};
                    outline: none;
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
                
                ${error && css`
                    border-color: ${getColor(theme, 'semantic.error')};
                    box-shadow: 0 0 0 3px ${getColor(theme, 'semantic.error')}20;
                    
                    &:focus {
                        border-color: ${getColor(theme, 'semantic.error')};
                        box-shadow: 0 0 0 3px ${getColor(theme, 'semantic.error')}30;
                    }
                `}
            }
            
            /* Responsive design */
            @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
                .textarea-field {
                    padding: ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')};
                    font-size: ${getTypography(theme, 'fontSize.sm')};
                }
            }
        `;

    return (
      <div css={textAreaContainerStyles(theme || {} as any, error)} className={className}>
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
            borderColor: error ? getColor(theme || {} as any, 'semantic.error') : undefined,
            boxShadow: error ? `0 0 0 3px ${getColor(theme || {} as any, 'semantic.error')}20` : undefined
          }}
          rows={rows}
          {...props}
        />
        {this.renderHelperText(theme || {} as any)}
      </div>
    );
  }
}

export default TextAreaStyled;