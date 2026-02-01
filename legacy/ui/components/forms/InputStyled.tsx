import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import { Input } from "@/shared/ui/components";
import styled, { css } from 'styled-components';
import { EnhancedTheme } from '@/core/theme';
import React, { PureComponent, ReactNode } from 'react';

// Enterprise styled-components for enhanced input styling
const InputStyledContainer = styled.div<{ theme: EnhancedTheme; variant?: 'default' | 'outlined' | 'filled'; disabled?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  
  .input-field {
    width: 100%;
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
    font-size: ${props => props.theme.typography.fontSize.base};
    font-family: ${props => props.theme.typography.fontFamily.sans.join(', ')};
    font-weight: ${props => props.theme.typography.fontWeight.normal};
    color: ${props => props.theme.colors.text.primary};
    background: ${props => props.theme.colors.background.primary};
    border: 1px solid ${props => props.theme.colors.border.medium};
    border-radius: ${props => props.theme.radius.md};
    transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
    outline: none;
    
    &::placeholder {
      color: ${props => props.theme.colors.text.tertiary};
    }
    
    &:focus {
      border-color: ${props => props.theme.colors.brand[500]};
      box-shadow: 0 0 0 3px ${props => props.theme.colors.brand[200]};
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
    
    ${props => props.variant === 'outlined' && css`
      background: transparent;
      border-width: 2px;
    `}
    
    ${props => props.variant === 'filled' && css`
      background: ${props => props.theme.colors.background.tertiary};
      border: none;
      
      &:focus {
        background: ${props => props.theme.colors.background.primary};
      }
    `}
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    .input-field {
      padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
      font-size: ${props => props.theme.typography.fontSize.sm};
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
    size?: 'sm' | 'md' | 'lg';
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

    private getInputStyles = (): React.CSSProperties => {
        const { size, error } = this.props;

        const sizeStyles = {
            sm: { padding: '8px 12px', fontSize: '14px' },
            md: { padding: '12px 16px', fontSize: '16px' },
            lg: { padding: '16px 20px', fontSize: '18px' }
        };

        return {
            ...sizeStyles[size as keyof typeof sizeStyles],
            borderColor: error ? '#ef4444' : undefined
        };
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
                    color: error ? '#ef4444' : '#6b7280'
                }}
            >
                {helperText}
            </div>
        );
    };

    render(): ReactNode {
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
            return (
                <InputStyledContainer variant={variant} disabled={disabled}>
                    <input
                        ref={forwardedRef}
                        className="input-field"
                        placeholder={placeholder}
                        disabled={disabled}
                        onFocus={this.handleFocus}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        style={this.getInputStyles()}
                        {...props}
                    />
                    {this.renderHelperText()}
                </InputStyledContainer>
            );
        }

        return (
            <Input
                ref={forwardedRef}
                placeholder={placeholder}
                onFocus={this.handleFocus}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                {...props}
            />
        );
    }
}

export default withForwardedRefAndErrBoundary(InputStyled);
