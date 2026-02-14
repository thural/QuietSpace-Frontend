import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

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
