/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { InputProps } from '../types';
import { createInputStyles } from '../emotion-utils';

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
            size = 'md',
            variant,
            onMouseEnter,
            onMouseLeave,
            loading,
            ...inputProps
        } = this.props;

        const inputStyles = createInputStyles(theme || {} as any, size as 'sm' | 'md' | 'lg', {
            error,
            disabled
        });

        return (
            <div className={className} data-testid={testId}>
                {label && (
                    <label
                        htmlFor={id}
                        css={css`
                            display: block;
                            margin-bottom: 4px;
                            font-size: 14px;
                            color: ${theme ? theme.colors.text.primary : '#333'};
                        `}
                    >
                        {label}
                    </label>
                )}

                <div css={css`display: flex; align-items: center;`}>
                    {startAdornment && (
                        <span css={css`margin-right: 8px;`}>{startAdornment}</span>
                    )}

                    <input
                        css={inputStyles as any}
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
                        <span css={css`margin-left: 8px;`}>{endAdornment}</span>
                    )}
                </div>

                {helperText && (
                    <div css={css`
                        font-size: 12px;
                        margin-top: 6px;
                        color: ${error
                            ? (theme ? theme.colors.semantic.error : '#dc3545')
                            : (theme ? theme.colors.text.secondary : '#666')
                        };
                    `}>
                        {helperText}
                    </div>
                )}
            </div>
        );
    }
}

export default Input;
