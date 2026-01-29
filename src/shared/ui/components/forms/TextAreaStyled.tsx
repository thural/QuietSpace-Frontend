import { ConsumerFn } from "@/shared/types/genericTypes";
import React, { PureComponent, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { EnhancedTheme } from '@/core/theme';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

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

    private renderHelperText = (): ReactNode => {
        const { error } = this.props;

        if (!error) return null;

        return (
            <div style={{
                fontSize: '12px',
                marginTop: '4px',
                color: '#ef4444'
            }}>
                This field has an error
            </div>
        );
    };

    render(): ReactNode {
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
            ...props
        } = this.props;

        return (
            <TextAreaContainer className={className}>
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
                        borderColor: error ? '#ef4444' : undefined,
                        boxShadow: error ? `0 0 0 3px rgba(239, 68, 68, 0.2)` : undefined
                    }}
                    rows={rows}
                    {...props}
                />
                {this.renderHelperText()}
            </TextAreaContainer>
        );
    }
}

// Enterprise styled-components for textarea styling
const TextAreaContainer = styled.div<{ theme: EnhancedTheme; disabled?: boolean; error?: boolean }>`
  position: relative;
  width: 100%;
  
  .textarea-field {
    width: 100%;
    resize: none;
    outline: none;
    box-sizing: border-box;
    border-radius: ${props => props.theme.radius.md};
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
    font-size: ${props => props.theme.typography.fontSize.base};
    font-family: ${props => props.theme.typography.fontFamily.sans.join(', ')};
    font-weight: ${props => props.theme.typography.fontWeight.normal};
    color: ${props => props.theme.colors.text.primary};
    background: ${props => props.theme.colors.background.primary};
    border: 1px solid ${props => props.theme.colors.border.medium};
    transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
    
    &::placeholder {
      color: ${props => props.theme.colors.text.tertiary};
    }
    
    &:focus {
      border-color: ${props => props.theme.colors.brand[500]};
      box-shadow: 0 0 0 3px ${props => props.theme.colors.brand[200]};
      outline: none;
    }
    
    &:hover:not(:focus):not(:disabled) {
      border-color: ${props => props.theme.colors.border.dark};
    }
    
    &:disabled {
      background: ${props => props.theme.colors.background.tertiary};
      color: ${props => props.theme.colors.text.tertiary};
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    ${props => props.error && css`
      border-color: ${props.theme.colors.semantic.error};
      box-shadow: 0 0 0 3px ${props.theme.colors.semantic.error}20;
      
      &:focus {
        border-color: ${props.theme.colors.semantic.error};
        box-shadow: 0 0 0 3px ${props.theme.colors.semantic.error}30;
      }
    `}
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    .textarea-field {
      padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
      font-size: ${props => props.theme.typography.fontSize.sm};
    }
  }
`;

export default TextAreaStyled