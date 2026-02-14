import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import React, { ReactNode } from 'react';
import { CheckboxWrapper, CheckboxInput, CheckboxLabel } from "./CheckboxStyles";

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

/**
 * Enterprise Checkbox Component
 * 
 * Consolidated checkbox component that handles both CheckboxComponent and CheckBox use cases.
 * Features enhanced theme integration, accessibility, and enterprise patterns.
 */
class CheckboxComponent extends BaseClassComponent<ICheckboxProps, ICheckboxState> {
  static defaultProps: Partial<ICheckboxProps> = {
    checked: false,
    disabled: false,
    variant: 'default'
  };

  protected override getInitialState(): Partial<ICheckboxState> {
    return {
      isFocused: false
    };
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { onChange, onValueChange, value } = this.props;
    const checked = event.target.checked;

    // Call standard onChange
    if (onChange) {
      onChange(checked);
    }

    // Call enhanced onValueChange if value is provided
    if (onValueChange && value !== undefined) {
      onValueChange(value, checked);
    }
  };

  private handleFocus = (): void => {
    this.setState({ isFocused: true });
  };

  private handleBlur = (): void => {
    this.setState({ isFocused: false });
  };

  override render(): ReactNode {
    const {
      checked = false,
      disabled = false,
      variant = 'default',
      label,
      className,
      theme,
      value,
      name,
      required,
      autoFocus,
      ariaLabel,
      ariaDescribedBy,
      testId
    } = this.props;

    return (
      React.createElement('div', {
        css: CheckboxWrapper(theme || {} as any),
        className,
        children: [
          React.createElement('input', {
            css: CheckboxInput(theme || {} as any, variant),
            type: 'checkbox',
            checked,
            disabled,
            onChange: this.handleChange,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,
            value,
            name,
            required,
            autoFocus,
            'aria-label': ariaLabel || label,
            'aria-describedby': ariaDescribedBy,
            'data-testid': testId || 'checkbox-component'
          }),
          label && React.createElement('label', {
            css: CheckboxLabel(theme || {} as any),
            children: label
          })
        ]
      })
    );
  }
}

export default CheckboxComponent;
