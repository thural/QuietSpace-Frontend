/**
 * Enterprise Input Component
 * 
 * A versatile input component that replaces the original Input component
 * with enhanced theme integration and enterprise patterns.
 */

import React from 'react';
import styled from 'styled-components';
import { InputProps } from '../types';
import { getSizeStyles } from '../utils';

// Styled component implementation
const StyledInput = styled.input<{ theme: any; $props: InputProps }>`
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.colors?.border || '#ccc'};
  border-radius: ${(props) => props.theme.radius?.md || '4px'};
  padding: ${(props) => props.theme.spacing(props.theme.spacingFactor.sm)} ${(props) => props.theme.spacing(props.theme.spacingFactor.md)};
  font-size: ${(props) => props.theme.typography.fontSize.primary};
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;
  
  &:focus {
    border-color: ${(props) => props.theme.colors?.primary || '#007bff'};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors?.primary + '20' || 'rgba(0, 123, 255, 0.2)'};
  }
  
  &:disabled {
    background-color: ${(props) => props.theme.colors?.backgroundSecondary || '#f5f5f5'};
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:error {
    border-color: ${(props) => props.theme.colors?.danger || '#dc3545'};
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
export const Input: React.FC<InputProps> = (props) => {
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
        ...inputProps
    } = props;

    return (
        <div className={className} data-testid={testId}>
            {label && (
                <label htmlFor={id} style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                    {label}
                </label>
            )}

            <div style={{ display: 'flex', alignItems: 'center' }}>
                {startAdornment && (
                    <span style={{ marginRight: '8px' }}>{startAdornment}</span>
                )}

                <StyledInput
                    theme={theme}
                    $props={props}
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
                    <span style={{ marginLeft: '8px' }}>{endAdornment}</span>
                )}
            </div>

            {helperText && (
                <div style={{ fontSize: '12px', marginTop: '4px', color: error ? '#dc3545' : '#666' }}>
                    {helperText}
                </div>
            )}
        </div>
    );
};

Input.displayName = 'Input';

export default Input;
