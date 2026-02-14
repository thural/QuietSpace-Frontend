/**
 * Enterprise Input Component
 * 
 * A comprehensive input component that consolidates all input patterns:
 * - Base input functionality with theme integration
 * - Multiple variants (default, outlined, filled)
 * - Flexible sizing and styling options
 * - Validation states and error handling
 * - Accessibility features
 * - Enterprise BaseClassComponent pattern
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Input variants
 */
export type InputVariant = 'default' | 'outlined' | 'filled';

/**
 * Input sizes
 */
export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Input states
 */
export type InputState = 'default' | 'error' | 'success' | 'warning';

/**
 * Enterprise Input Props
 */
export interface IEnterpriseInputProps extends IBaseComponentProps {
  // Basic input props
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'file';
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;

  // Styling props
  variant?: InputVariant;
  size?: InputSize;
  state?: InputState;
  className?: string;

  // Custom styling
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  placeholderColor?: string;

  // Event handlers
  onChange?: ((value: string | number) => void) | React.ChangeEventHandler<HTMLInputElement>;
  onValueChange?: (value: string | number) => void; // Alternative: always use simple value function
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  // Validation
  validator?: (value: string | number) => string | null;
  showError?: boolean;
  errorMessage?: string;

  // Advanced features
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  label?: string;
  hideLabel?: boolean;

  // Theme control
  useTheme?: boolean;

  // Ref forwarding
  inputRef?: React.RefObject<HTMLInputElement>;
}

/**
 * Enterprise Input State
 */
export interface IEnterpriseInputState extends IBaseComponentState {
  isFocused: boolean;
  isHovered: boolean;
  internalValue: string | number;
  validationError: string | null;
  isValid: boolean;
}

/**
 * Enterprise Input Component
 * 
 * Provides comprehensive input functionality with:
 * - Multiple variants (default, outlined, filled)
 * - Flexible sizing options (xs, sm, md, lg, xl)
 * - Validation states and error handling
 * - Icon support and helper text
 * - Accessibility features
 * - Enterprise BaseClassComponent pattern
 */
export class EnterpriseInput extends BaseClassComponent<IEnterpriseInputProps, IEnterpriseInputState> {

  private inputRef = React.createRef<HTMLInputElement>();

  protected override getInitialState(): Partial<IEnterpriseInputState> {
    return {
      isFocused: false,
      isHovered: false,
      internalValue: this.props.value || this.props.defaultValue || '',
      validationError: null,
      isValid: true,
      error: null // BaseClassComponent error property
    };
  }

  /**
   * Size mapping for consistent styling
   */
  private readonly sizeMap = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
    xl: 'px-6 py-3 text-xl'
  } as const;

  /**
   * Get input size classes
   */
  private getSizeClasses(): string {
    const { size = 'md' } = this.props;
    return this.sizeMap[size] || this.sizeMap.md;
  }

  /**
   * Get variant-specific classes
   */
  private getVariantClasses(): string {
    const { variant = 'default', useTheme = true } = this.props;

    if (!useTheme) {
      return 'border border-gray-300 bg-white';
    }

    const variants = {
      default: 'border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
      outlined: 'border-2 border-gray-300 bg-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
      filled: 'border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-200'
    };

    return variants[variant] || variants.default;
  }

  /**
   * Get state-specific classes
   */
  private getStateClasses(): string {
    const { state = 'default' } = this.props;

    const states = {
      default: '',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-200',
      success: 'border-green-500 focus:border-green-500 focus:ring-green-200',
      warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-200'
    };

    return states[state] || states.default;
  }

  /**
   * Get disabled classes
   */
  private getDisabledClasses(): string {
    const { disabled } = this.props;
    return disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : '';
  }

  /**
   * Validate input value
   */
  private validateValue = (value: string | number): string | null => {
    const { validator, required, minLength, maxLength, pattern } = this.props;

    // Required validation
    if (required && (!value || value.toString().trim() === '')) {
      return 'This field is required';
    }

    // Min length validation
    if (minLength && value.toString().length < minLength) {
      return `Minimum length is ${minLength} characters`;
    }

    // Max length validation
    if (maxLength && value.toString().length > maxLength) {
      return `Maximum length is ${maxLength} characters`;
    }

    // Pattern validation
    if (pattern && !new RegExp(pattern).test(value.toString())) {
      return 'Invalid format';
    }

    // Custom validator
    if (validator) {
      return validator(value);
    }

    return null;
  };

  /**
   * Handle input change
   */
  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { onChange, onValueChange, type } = this.props;

    // For file inputs, pass the event directly to access files
    if (type === 'file') {
      // Update internal state for consistency
      this.safeSetState({ internalValue: event.target.value });

      // Call external onChange handlers with the event for file inputs
      if (onChange) {
        if (typeof onChange === 'function' && onChange.length === 1) {
          // For file inputs, still pass the event to access files
          (onChange as React.ChangeEventHandler<HTMLInputElement>)(event);
        } else {
          (onChange as React.ChangeEventHandler<HTMLInputElement>)(event);
        }
      }

      // Call onValueChange if provided (pass filename as string)
      if (onValueChange && event.target.files && event.target.files.length > 0 && event.target.files[0]) {
        onValueChange(event.target.files[0].name);
      }
      return;
    }

    let value: string | number = event.target.value;

    // Convert to number if type is number
    if (type === 'number' && value !== '') {
      const numValue = parseFloat(value);
      value = isNaN(numValue) ? value : numValue;
    }

    // Update internal state
    this.safeSetState({ internalValue: value });

    // Validate if validator is provided
    if (this.props.validator) {
      const error = this.validateValue(value);
      this.safeSetState({
        validationError: error,
        isValid: !error
      });
    }

    // Call external onChange handlers
    if (onChange) {
      // Check if onChange is a React event handler or simple value function
      if (typeof onChange === 'function' && onChange.length === 1) {
        // Simple value function: (value: string | number) => void
        (onChange as (value: string | number) => void)(value);
      } else {
        // React event handler: React.ChangeEventHandler<HTMLInputElement>
        (onChange as React.ChangeEventHandler<HTMLInputElement>)(event);
      }
    }

    // Always call onValueChange if provided (simple value function)
    if (onValueChange) {
      onValueChange(value);
    }
  };

  /**
   * Handle input change for the native input element
   * This method ensures type compatibility with the HTML input onChange
   */
  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // Call the main handleChange method
    this.handleChange(event);
  };

  /**
   * Handle focus
   */
  private handleFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    const { onFocus } = this.props;
    this.safeSetState({ isFocused: true });

    if (onFocus) {
      onFocus(event);
    }
  };

  /**
   * Handle blur
   */
  private handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    const { onBlur } = this.props;
    this.safeSetState({ isFocused: false });

    if (onBlur) {
      onBlur(event);
    }
  };

  /**
   * Handle mouse enter
   */
  private handleMouseEnter = (): void => {
    this.safeSetState({ isHovered: true });
  };

  /**
   * Handle mouse leave
   */
  private handleMouseLeave = (): void => {
    this.safeSetState({ isHovered: false });
  };

  /**
   * Get container classes
   */
  private getContainerClasses(): string {
    const { className = '' } = this.props;
    const { isFocused } = this.state;

    const baseClasses = 'relative flex items-center';
    const focusClasses = isFocused ? 'ring-2 ring-blue-200' : '';

    return `${baseClasses} ${focusClasses} ${className}`;
  }

  /**
   * Get input classes
   */
  private getInputClasses(): string {
    const { leftIcon, rightIcon } = this.props;
    const { isFocused } = this.state;

    const sizeClasses = this.getSizeClasses();
    const variantClasses = this.getVariantClasses();
    const stateClasses = this.getStateClasses();
    const disabledClasses = this.getDisabledClasses();

    const iconPadding = leftIcon ? 'pl-10' : '';
    const rightIconPadding = rightIcon ? 'pr-10' : '';

    const transitionClasses = 'transition-all duration-200 ease-in-out';
    const focusClasses = isFocused ? 'outline-none' : '';

    return [
      'w-full',
      'border',
      'rounded-md',
      sizeClasses,
      variantClasses,
      stateClasses,
      disabledClasses,
      iconPadding,
      rightIconPadding,
      transitionClasses,
      focusClasses
    ].filter(Boolean).join(' ');
  }

  /**
   * Public method to focus the input
   */
  public focus(): void {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  /**
   * Public method to blur the input
   */
  public blur(): void {
    if (this.inputRef.current) {
      this.inputRef.current.blur();
    }
  }

  /**
   * Public method to get current value
   */
  public getValue(): string | number {
    return this.state.internalValue;
  }

  /**
   * Public method to set value
   */
  public setValue(value: string | number): void {
    this.safeSetState({ internalValue: value });
  }

  /**
   * Public method to validate
   */
  public validate(): boolean {
    const error = this.validateValue(this.state.internalValue);
    this.safeSetState({ validationError: error, isValid: !error });
    return !error;
  }

  protected override renderContent(): React.ReactNode {
    const {
      name,
      placeholder,
      type = 'text',
      disabled,
      required,
      readOnly,
      autoFocus,
      maxLength,
      minLength,
      pattern,
      leftIcon,
      rightIcon,
      helperText,
      label,
      hideLabel = false,
      showError = true,
      errorMessage,
      inputRef,
      useTheme = true,
      testId,
      backgroundColor,
      borderColor,
      textColor,
      placeholderColor,
      size,
      variant,
      state,
      onChange,
      onValueChange,
      validator,
      ...rest
    } = this.props;

    const { internalValue, validationError, isValid } = this.state;
    const displayError = validationError || errorMessage;
    const hasError = !isValid && (showError || displayError);

    // Custom styles
    const customStyles: React.CSSProperties = {};
    if (backgroundColor) customStyles.backgroundColor = backgroundColor;
    if (borderColor) customStyles.borderColor = borderColor;
    if (textColor) customStyles.color = textColor;

    // Handle placeholder color with inline style
    const placeholderStyle: React.CSSProperties = {};
    if (placeholderColor && !useTheme) {
      placeholderStyle.color = placeholderColor;
    }

    return (
      <div className={this.getContainerClasses()}>
        {/* Label */}
        {label && !hideLabel && (
          <label
            className={`
              block text-sm font-medium mb-2
              ${hasError ? 'text-red-600' : 'text-gray-700'}
              ${disabled ? 'opacity-60' : ''}
            `}
            htmlFor={name}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative w-full">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={inputRef || this.inputRef}
            name={name}
            type={type}
            value={internalValue}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            className={this.getInputClasses()}
            style={customStyles}
            onChange={this.handleInputChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            data-testid={testId || 'enterprise-input'}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined}
            {...rest}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {hasError && displayError && (
          <p
            id={`${name}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {displayError}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !hasError && (
          <p
            id={`${name}-helper`}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
}

export default EnterpriseInput;
