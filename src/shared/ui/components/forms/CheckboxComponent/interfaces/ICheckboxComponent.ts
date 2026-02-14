import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

interface ICheckboxProps extends IBaseComponentProps {
  checked?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
  label?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
  theme?: any;

  // Enhanced props for CheckBox compatibility
  value?: string | number;
  name?: string;
  required?: boolean;
  autoFocus?: boolean;

  // Event handling compatibility
  onValueChange?: (value: string | number, checked: boolean) => void;

  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
  testId?: string;
}

interface ICheckboxState extends IBaseComponentState {
  isFocused: boolean;
}

export type { ICheckboxProps, ICheckboxState };
