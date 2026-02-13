/**
 * FormField Component - Enterprise Form Field
 * 
 * A comprehensive form field component with validation, error handling,
 * and enterprise-grade features. Can be used standalone or within Form.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent } from 'react';

/**
 * Form field validation rule interface
 */
export interface IFormFieldValidationRule {
  /** Rule name */
  name: string;
  /** Validation function */
  validate: (value: any) => boolean | string;
  /** Error message */
  message: string;
  /** Required field */
  required?: boolean;
}

/**
 * Form field props interface
 */
export interface IFormFieldProps {
  /** Field name */
  name: string;
  /** Field label */
  label?: string;
  /** Field type */
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date';
  /** Field value */
  value?: any;
  /** Default value */
  defaultValue?: any;
  /** Placeholder */
  placeholder?: string;
  /** Validation rules */
  rules?: IFormFieldValidationRule[];
  /** Field is disabled */
  disabled?: boolean;
  /** Field is readonly */
  readonly?: boolean;
  /** Field is required */
  required?: boolean;
  /** Field options for select/radio */
  options?: Array<{ label: string; value: any }>;
  /** Field help text */
  helpText?: string;
  /** Field error message */
  error?: string;
  /** Field touched state */
  touched?: boolean;
  /** Field size */
  size?: 'small' | 'medium' | 'large';
  /** Field layout */
  layout?: 'vertical' | 'horizontal' | 'inline';
  /** Field CSS class */
  className?: string;
  /** Field style */
  style?: React.CSSProperties;
  /** Change handler */
  onChange?: (value: any) => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Focus handler */
  onFocus?: () => void;
  /** Custom render function */
  render?: (field: IFormFieldProps, onChange: (value: any) => void, onBlur: () => void) => React.ReactNode;
  /** Additional field properties */
  [key: string]: any;
}

/**
 * Form field state interface
 */
interface IFormFieldState {
  value: any;
  error: string;
  touched: boolean;
  focused: boolean;
}

/**
 * FormField Component
 * 
 * Enterprise-grade form field component with validation and error handling.
 */
export class FormField extends PureComponent<IFormFieldProps, IFormFieldState> {
  static defaultProps: Partial<IFormFieldProps> = {
    type: 'text',
    size: 'medium',
    layout: 'vertical',
    required: false,
    disabled: false,
    readonly: false,
  };

  constructor(props: IFormFieldProps) {
    super(props);

    this.state = {
      value: props.value !== undefined ? props.value : props.defaultValue || '',
      error: props.error || '',
      touched: props.touched || false,
      focused: false,
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
  private handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { type, onChange } = this.props;
    let value: any;

    switch (type) {
      case 'checkbox':
        value = (event.target as HTMLInputElement).checked;
        break;
      case 'number':
        value = (event.target as HTMLInputElement).value;
        break;
      default:
        value = event.target.value;
    }

    this.setState({ value }, () => {
      // Validate on change if touched
      if (this.state.touched) {
        const error = this.validateField(value);
        this.setState({ error });
      }

      if (onChange) {
        onChange(value);
      }
    });
  };

  /**
   * Handle blur
   */
  private handleBlur = () => {
    const { onBlur } = this.props;
    const { value } = this.state;

    this.setState({
      touched: true,
      error: this.validateField(value),
    });

    if (onBlur) {
      onBlur();
    }
  };

  /**
   * Handle focus
   */
  private handleFocus = () => {
    const { onFocus } = this.props;

    this.setState({ focused: true });

    if (onFocus) {
      onFocus();
    }
  };

  /**
   * Render input element
   */
  private renderInput = () => {
    const { type, disabled, readonly, placeholder, options, className } = this.props;
    const { value, error, focused } = this.state;
    const size = this.props.size || 'medium';

    const inputProps = {
      value,
      disabled,
      readOnly: readonly,
      placeholder,
      className: `form-input form-input-${size} ${error ? 'form-input-error' : ''} ${focused ? 'form-input-focused' : ''} ${className || ''}`,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      onFocus: this.handleFocus,
    };

    switch (type) {
      case 'select':
        return (
          <select {...inputProps}>
            <option value="">{placeholder || 'Select...'}</option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            {...inputProps}
            rows={4}
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value}
            {...inputProps}
          />
        );

      case 'radio':
        return (
          <div className="form-radio-group">
            {options?.map(option => (
              <label key={option.value} className="form-radio-label">
                <input
                  type="radio"
                  name={this.props.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={this.handleChange}
                  className="form-radio"
                />
                {option.label}
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            {...inputProps}
          />
        );

      default:
        return (
          <input
            type={type}
            {...inputProps}
          />
        );
    }
  };

  override render() {
    const {
      label,
      required,
      helpText,
      layout,
      className,
      style,
      render,
    } = this.props;

    const { error, touched } = this.state;
    const size = this.props.size || 'medium';
    const hasError = touched && !!error;

    // Custom render function
    if (render) {
      return (
        <div className={`form-field form-field-${layout} ${className || ''}`} style={style}>
          {render(
            this.props,
            (value: any) => this.setState({ value }, () => {
              if (touched) {
                this.setState({ error: this.validateField(value) });
              }
            }),
            this.handleBlur
          )}
          {hasError && <div className="form-field-error">{error}</div>}
        </div>
      );
    }

    // Default field rendering
    return (
      <div className={`form-field form-field-${layout} ${className || ''}`} style={style}>
        {label && (
          <label className={`form-label form-label-${size}`}>
            {label}
            {required && <span className="form-required">*</span>}
          </label>
        )}

        <div className="form-input-wrapper">
          {this.renderInput()}
        </div>

        {helpText && (
          <div className="form-help-text">{helpText}</div>
        )}

        {hasError && (
          <div className="form-field-error">{error}</div>
        )}
      </div>
    );
  }
}

export default FormField;
