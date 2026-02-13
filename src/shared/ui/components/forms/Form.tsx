/**
 * Form Component - Enterprise Form Management
 * 
 * A comprehensive form component with validation, error handling, and
 * enterprise-grade features. Follows enterprise patterns with class-based
 * architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent, createRef, RefObject } from 'react';
import { TableContainer } from '../data-display/Table.styles';

/**
 * Form validation rule interface
 */
export interface IFormValidationRule {
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
 * Form field configuration interface
 */
export interface IFormField {
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
  rules?: IFormValidationRule[];
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
  /** Field dirty state */
  dirty?: boolean;
  /** Custom render function */
  render?: (field: IFormField, onChange: (value: any) => void, onBlur: () => void) => React.ReactNode;
  /** Additional field properties */
  [key: string]: any;
}

/**
 * Form configuration interface
 */
export interface IFormConfig {
  /** Form fields */
  fields: IFormField[];
  /** Initial values */
  initialValues?: Record<string, any>;
  /** Form layout */
  layout?: 'vertical' | 'horizontal' | 'inline';
  /** Form size */
  size?: 'small' | 'medium' | 'large';
  /** Submit button text */
  submitText?: string;
  /** Reset button text */
  resetText?: string;
  /** Show reset button */
  showReset?: boolean;
  /** Show submit button */
  showSubmit?: boolean;
  /** Form validation mode */
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  /** Form CSS class */
  className?: string;
  /** Form style */
  style?: React.CSSProperties;
  /** Submit handler */
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  /** Reset handler */
  onReset?: (values: Record<string, any>) => void;
}

/**
 * Form state interface
 */
interface IFormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Form Component
 * 
 * Enterprise-grade form component with validation, error handling,
 * and comprehensive field management.
 */
export class Form extends PureComponent<IFormConfig, IFormState> {
  static defaultProps: Partial<IFormConfig> = {
    layout: 'vertical',
    size: 'medium',
    submitText: 'Submit',
    resetText: 'Reset',
    showReset: false,
    showSubmit: true,
    validationMode: 'onChange',
  };

  private formRef: RefObject<HTMLFormElement | null>;

  constructor(props: IFormConfig) {
    super(props);

    // Initialize form state
    const initialValues = props.initialValues || {};
    const values: Record<string, any> = {};
    const errors: Record<string, string> = {};
    const touched: Record<string, boolean> = {};
    const dirty: Record<string, boolean> = {};

    props.fields.forEach(field => {
      values[field.name] = initialValues[field.name] || field.defaultValue || '';
      errors[field.name] = '';
      touched[field.name] = false;
      dirty[field.name] = false;
    });

    this.state = {
      values,
      errors,
      touched,
      dirty,
      isSubmitting: false,
      isValid: this.validateForm(values),
    };

    this.formRef = createRef();
  }

  /**
   * Validate single field
   */
  private validateField = (field: IFormField, value: any): string => {
    if (!field.rules || field.rules.length === 0) {
      return '';
    }

    for (const rule of field.rules) {
      if (rule.required && (!value || value === '')) {
        return rule.message;
      }

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
   * Validate entire form
   */
  private validateForm = (values: Record<string, any>): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    this.props.fields.forEach(field => {
      const error = this.validateField(field, values[field.name]);
      errors[field.name] = error;
      if (error) {
        isValid = false;
      }
    });

    this.setState({ errors });
    return isValid;
  };

  /**
   * Handle field value change
   */
  private handleFieldChange = (fieldName: string, value: any) => {
    const { fields, validationMode } = this.props;
    const field = fields.find(f => f.name === fieldName);

    if (!field) return;

    const newValues = { ...this.state.values, [fieldName]: value };
    const newDirty = { ...this.state.dirty, [fieldName]: true };
    const newErrors = { ...this.state.errors };

    // Validate field if validation mode is onChange
    if (validationMode === 'onChange') {
      newErrors[fieldName] = this.validateField(field, value);
    }

    this.setState({
      values: newValues,
      dirty: newDirty,
      errors: newErrors,
      isValid: this.validateForm(newValues),
    });
  };

  /**
   * Handle field blur
   */
  private handleFieldBlur = (fieldName: string) => {
    const { fields, validationMode } = this.props;
    const field = fields.find(f => f.name === fieldName);

    if (!field) return;

    const newTouched = { ...this.state.touched, [fieldName]: true };
    const newErrors = { ...this.state.errors };

    // Validate field if validation mode is onBlur or onSubmit
    if (validationMode === 'onBlur' || validationMode === 'onSubmit') {
      newErrors[fieldName] = this.validateField(field, this.state.values[fieldName]);
    }

    this.setState({
      touched: newTouched,
      errors: newErrors,
      isValid: this.validateForm(this.state.values),
    });
  };

  /**
   * Handle form submit
   */
  private handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { validationMode, onSubmit } = this.props;
    const { values } = this.state;

    // Validate all fields if validation mode is onSubmit
    if (validationMode === 'onSubmit') {
      const isValid = this.validateForm(values);
      if (!isValid) {
        return;
      }
    }

    this.setState({ isSubmitting: true });

    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  /**
   * Handle form reset
   */
  private handleReset = () => {
    const { initialValues, fields, onReset } = this.props;

    const resetValues: Record<string, any> = {};
    const resetErrors: Record<string, string> = {};
    const resetTouched: Record<string, boolean> = {};
    const resetDirty: Record<string, boolean> = {};

    fields.forEach(field => {
      resetValues[field.name] = initialValues?.[field.name] || field.defaultValue || '';
      resetErrors[field.name] = '';
      resetTouched[field.name] = false;
      resetDirty[field.name] = false;
    });

    this.setState({
      values: resetValues,
      errors: resetErrors,
      touched: resetTouched,
      dirty: resetDirty,
      isValid: true,
    });

    if (onReset) {
      onReset(resetValues);
    }
  };

  /**
   * Get field error message
   */
  private getFieldError = (fieldName: string): string => {
    const { validationMode } = this.props;
    const { errors, touched } = this.state;

    if (validationMode === 'onSubmit') {
      return errors[fieldName] || '';
    }

    return touched[fieldName] ? errors[fieldName] || '' : '';
  };

  /**
   * Check if field has error
   */
  private hasFieldError = (fieldName: string): boolean => {
    return !!this.getFieldError(fieldName);
  };

  /**
   * Render form field
   */
  private renderField = (field: IFormField) => {
    const { size, layout } = this.props;
    const { values, errors, touched } = this.state;
    const error = this.getFieldError(field.name);
    const hasError = this.hasFieldError(field.name);

    // Custom render function
    if (field.render) {
      return (
        <div key={field.name} className={`form-field form-field-${layout}`}>
          {field.render(
            field,
            (value: any) => this.handleFieldChange(field.name, value),
            () => this.handleFieldBlur(field.name)
          )}
          {error && <div className="form-field-error">{error}</div>}
        </div>
      );
    }

    // Default field rendering
    return (
      <div key={field.name} className={`form-field form-field-${layout}`}>
        {field.label && (
          <label className={`form-label form-label-${size}`}>
            {field.label}
            {field.required && <span className="form-required">*</span>}
          </label>
        )}

        <div className="form-input-wrapper">
          {this.renderInput(field)}
        </div>

        {field.helpText && (
          <div className="form-help-text">{field.helpText}</div>
        )}

        {error && (
          <div className="form-field-error">{error}</div>
        )}
      </div>
    );
  };

  /**
   * Render input element
   */
  private renderInput = (field: IFormField) => {
    const { size } = this.props;
    const { values } = this.state;
    const value = values[field.name];
    const error = this.hasFieldError(field.name);

    const inputProps = {
      value,
      disabled: field.disabled,
      readOnly: field.readonly,
      placeholder: field.placeholder,
      className: `form-input form-input-${size} ${error ? 'form-input-error' : ''}`,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        this.handleFieldChange(field.name, e.target.value);
      },
      onBlur: () => this.handleFieldBlur(field.name),
    };

    switch (field.type) {
      case 'select':
        return (
          <select
            {...inputProps}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              this.handleFieldChange(field.name, e.target.value);
            }}
          >
            <option value="">{field.placeholder || 'Select...'}</option>
            {field.options?.map(option => (
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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              this.handleFieldChange(field.name, e.target.value);
            }}
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value}
            {...inputProps}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              this.handleFieldChange(field.name, e.target.checked);
            }}
          />
        );

      case 'radio':
        return (
          <div className="form-radio-group">
            {field.options?.map(option => (
              <label key={option.value} className="form-radio-label">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.handleFieldChange(field.name, e.target.value);
                  }}
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
            type={field.type}
            {...inputProps}
          />
        );
    }
  };

  override render() {
    const {
      fields,
      layout,
      size,
      submitText,
      resetText,
      showReset,
      showSubmit,
      className,
      style,
    } = this.props;

    const { isSubmitting, isValid } = this.state;

    return (
      <TableContainer className={`form form-${layout} form-${size} ${className || ''}`} style={style}>
        <form ref={this.formRef} onSubmit={this.handleSubmit} className="form-content">
          {fields.map(field => this.renderField(field))}

          {(showSubmit || showReset) && (
            <div className={`form-actions form-actions-${layout}`}>
              {showReset && (
                <button
                  type="button"
                  onClick={this.handleReset}
                  disabled={isSubmitting}
                  className="form-button form-button-reset"
                >
                  {resetText}
                </button>
              )}

              {showSubmit && (
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="form-button form-button-submit"
                >
                  {isSubmitting ? 'Submitting...' : submitText}
                </button>
              )}
            </div>
          )}
        </form>
      </TableContainer>
    );
  }
}

export default Form;
