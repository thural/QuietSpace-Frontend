import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

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
export interface IFormFieldProps extends IBaseComponentProps {
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
export interface IFormFieldState extends IBaseComponentState {
  value: any;
  errorMessage: string;
  touched: boolean;
  focused: boolean;
}
