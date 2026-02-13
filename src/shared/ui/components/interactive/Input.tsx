/**
 * Enterprise Input Component
 * 
 * A versatile input component that replaces the original Input component
 * with enhanced theme integration and enterprise patterns.
 */

import { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { InputProps } from '../types';
import { getColor, getSpacing, getRadius, getBorderWidth, getMicroSpacing, getTypography, getSizeStyles, getTransition } from '../utils';

// Styled component implementation
const StyledInput = styled.input<{ theme: any; $props: InputProps }>`
  box-sizing: border-box;
  border: ${(props) => getBorderWidth(props.theme, 'sm')} solid ${(props) => getColor(props.theme, 'border.light')};
  border-radius: ${(props) => getRadius(props.theme, 'md')};
  padding: ${(props) => getSpacing(props.theme, 'sm')} ${(props) => getSpacing(props.theme, 'md')};
  font-size: ${(props) => getTypography(props.theme, 'fontSize.base')};
  font-family: inherit;
  transition: all ${(props) => getTransition(props.theme, 'all', 'fast', 'ease')};
  outline: none;
  
  &:focus {
    border-color: ${(props) => getColor(props.theme, 'brand.500')};
    box-shadow: 0 0 0 ${(props) => getBorderWidth(props.theme, 'sm')} ${(props) => getColor(props.theme, 'brand.500')}20;
  }
  
  &:disabled {
    background-color: ${(props) => getColor(props.theme, 'background.secondary')};
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:error {
    border-color: ${(props) => getColor(props.theme, 'semantic.error')};
  }
  
  ${(props) => getSizeStyles(props.$props.size || 'md', props.theme)}
`;

/**
 * Input Component
 * 
 * A comprehensive input component with validation states,
 * sizing options, and theme integration.
 * 
 * @param props - Input props for styling and behavior
 * @returns JSX Element
 */
class Input extends PureComponent<InputProps> {
    override render(): ReactNode {
        const {
            theme,
            className,
            testId,
            disabled = false,
            error = false,
            type = 'text',
            value,
            defaultValue,
            placeholder,
            name,
            id,
            required = false,
            readOnly = false,
            maxLength,
            minLength,
            pattern,
            autoComplete,
            autoFocus = false,
            helperText,
            label,
            startAdornment,
            endAdornment,
            onClick,
            onFocus,
            onBlur,
            onChange,
            size,
            variant,
            onMouseEnter,
            onMouseLeave,
            loading,
            ...inputProps
        } = this.props;

        return (
            <div className={className} data-testid={testId}>
                {label && (
                    <label htmlFor={id} style={{
                        display: 'block',
                        marginBottom: getMicroSpacing(theme || {} as any, '4px'),
                        fontSize: getTypography(theme || {} as any, 'fontSize.sm'),
                        color: getColor(theme || {} as any, 'text.primary')
                    }}>
                        {label}
                    </label>
                )}

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {startAdornment && (
                        <span style={{ marginRight: getMicroSpacing(theme || {} as any, '8px') }}>{startAdornment}</span>
                    )}

                    <StyledInput
                        theme={theme}
                        $props={this.props}
                        type={type}
                        value={value}
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                        name={name}
                        id={id}
                        required={required}
                        readOnly={readOnly}
                        maxLength={maxLength}
                        minLength={minLength}
                        pattern={pattern}
                        autoComplete={autoComplete}
                        autoFocus={autoFocus}
                        disabled={disabled}
                        onClick={onClick}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={onChange}
                        {...inputProps}
                    />

                    {endAdornment && (
                        <span style={{ marginLeft: getMicroSpacing(theme || {} as any, '8px') }}>{endAdornment}</span>
                    )}
                </div>

                {helperText && (
                    <div style={{
                        fontSize: getTypography(theme || {} as any, 'fontSize.xs'),
                        marginTop: getMicroSpacing(theme || {} as any, '6px'),
                        color: error ? getColor(theme || {} as any, 'semantic.error') : getColor(theme || {} as any, 'text.secondary')
                    }}>
                        {helperText}
                    </div>
                )}
            </div>
        );
    }
}

export default Input;
