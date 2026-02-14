/**
 * SwitchStyled Component Interfaces
 * 
 * Type definitions for the SwitchStyled component.
 */

import { IBaseComponentProps } from '@/shared/components/base/BaseClassComponent';

export interface ISwitchStyledProps extends IBaseComponentProps {
  checked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  labelPosition?: 'left' | 'right';
  onChange?: ((checked: boolean) => void) | React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  theme?: any;

  // Enhanced props for Switch compatibility
  name?: string;
  required?: boolean;
  autoFocus?: boolean;

  // Event handling compatibility
  onValueChange?: (value: string | number, checked: boolean) => void;
  value?: string | number;
}
