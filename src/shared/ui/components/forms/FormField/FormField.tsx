import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ChangeEvent, ReactNode } from 'react';
import { IFormFieldProps, IFormFieldState, IFormFieldValidationRule } from './interfaces';
import { FormFieldContainer, LabelStyles, InputStyles, ErrorStyles, HelpTextStyles } from './styles';

/**
 * Extended props interface for FormField component
 */
interface IFormFieldExtendedProps extends IFormFieldProps, IBaseComponentProps {
  /** Additional className for styling */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Extended state interface for FormField component
 */
interface IFormFieldExtendedState extends IFormFieldState, IBaseComponentState {
  /** Additional state properties if needed */
}

/**
 * Enterprise FormField Component
 * 
 * A comprehensive form field component with validation, error handling,
 * and enterprise-grade features. Can be used standalone or within Form.
 * Follows enterprise architecture patterns with proper decoupling.
 */
export class FormField extends BaseClassComponent<IFormFieldExtendedProps, IFormFieldExtendedState> {
  static defaultProps: Partial<IFormFieldExtendedProps> = {
    type: 'text',
    size: 'medium',
    layout: 'vertical',
    required: false,
    disabled: false,
    readonly: false
  };

  protected override getInitialState(): Partial<IFormFieldExtendedState> {
    const { value, defaultValue, error, touched } = this.props;
    
    return {
      value: value !== undefined ? value : defaultValue || '',
      errorMessage: error || '',
      touched: touched || false,
      focused: false
    };
  }

  /**
   * Validate field value
   */
  private validateField = (value: any): string => {
    const { rules, required } = this.props;

    if (required && (!value || value === '')) {
      return 'This field is required';
    }

    if (!rules || rules.length === 0) {
      return '';
    }

    for (const rule of rules) {
      if (value !== '' && value !== null && value !== undefined) {
        const result = rule.validate(value);
        if (result !== true) {
          return typeof result === 'string' ? result : rule.message;
        }
      }
    }

    return '';
  };

  /**
   * Handle value change
   */
  private handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { type, onChange } = this.props;
    let value: any;

    switch (type) {
      case 'checkbox':
        value = (event.target as HTMLInputElement).checked;
        break;
      case 'number':
        value = parseFloat(event.target.value);
        break;
      default:
        value = event.target.value;
    }

    const errorMessage = this.validateField(value);

    this.safeSetState({
      value,
      errorMessage,
      touched: true
    });

    if (onChange) {
      onChange(value);
    }
  };

  /**
   * Handle blur event
   */
  private handleBlur = (): void => {
    const { onBlur } = this.props;
    const { value } = this.state;

    const errorMessage = this.validateField(value);

    this.safeSetState({
      errorMessage,
      touched: true,
      focused: false
    });

    if (onBlur) {
      onBlur();
    }
  };

  /**
   * Handle focus event
   */
  private handleFocus = (): void => {
    const { onFocus } = this.props;

    this.safeSetState({ focused: true });

    if (onFocus) {
      onFocus();
    }
  };

  protected override renderContent(): ReactNode {
    const {
      name,
      label,
      type = 'text',
      placeholder,
      options,
      helpText,
      size = 'medium',
      layout = 'vertical',
      disabled = false,
      readonly = false,
      required = false,
      className,
      testId = 'form-field',
      theme,
      render,
      ...rest
    } = this.props;

    const { value, errorMessage, touched } = this.state;
    const hasError = touched && !!errorMessage;

    // Use custom render function if provided
    if (render) {
      return render(this.props, this.handleChange, this.handleBlur);
    }

    return (
      <div
        css={FormFieldContainer(theme, layout)}
        className={className}
        data-testid={testId}
      >
        {label && (
          <label css={LabelStyles(theme, required)} htmlFor={name}>
            {label}
          </label>
        )}

        {type === 'select' ? (
          <select
            css={InputStyles(theme, size, hasError)}
            id={name}
            name={name}
            value={value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            disabled={disabled}
            {...rest}
          >
            <option value="">Select an option</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            css={InputStyles(theme, size, hasError)}
            id={name}
            name={name}
            value={value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readonly}
            {...rest}
          />
        ) : (
          <input
            css={InputStyles(theme, size, hasError)}
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readonly}
            {...rest}
          />
        )}

        {hasError && (
          <div css={ErrorStyles(theme)} data-testid={`${testId}-error`}>
            {errorMessage}
          </div>
        )}

        {helpText && (
          <div css={HelpTextStyles(theme)} data-testid={`${testId}-help`}>
            {helpText}
          </div>
        )}
      </div>
    );
  }
}

export default FormField;
