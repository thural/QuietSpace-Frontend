import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import React, { ReactNode } from 'react';
import { CheckboxInput, CheckboxLabel, CheckboxWrapper } from "./CheckboxStyles";

interface ICheckboxProps extends IBaseComponentProps {
  checked?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
  label?: string;
  onChange?: (checked: boolean) => void;
  className?: string;

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
    const { disabled, onChange, onValueChange, value } = this.props;
    const isChecked = event.target.checked;

    if (!disabled) {
      // Call the original onChange prop
      onChange?.(isChecked);

      // Call the enhanced onValueChange prop for CheckBox compatibility
      if (onValueChange && value !== undefined) {
        onValueChange(value, isChecked);
      }
    }
  };

  private handleFocus = (): void => {
    this.safeSetState({ isFocused: true });
  };

  private handleBlur = (): void => {
    this.safeSetState({ isFocused: false });
  };

  /**
   * Public method to check the checkbox
   */
  public check(): void {
    const { onChange, disabled } = this.props;
    if (!disabled) {
      onChange?.(true);
    }
  }

  /**
   * Public method to uncheck the checkbox
   */
  public uncheck(): void {
    const { onChange, disabled } = this.props;
    if (!disabled) {
      onChange?.(false);
    }
  }

  /**
   * Public method to toggle the checkbox
   */
  public toggle(): void {
    const { checked, onChange, disabled } = this.props;
    if (!disabled) {
      onChange?.(!checked);
    }
  }

  /**
   * Public method to get current checked state
   */
  public isChecked(): boolean {
    return this.props.checked || false;
  }

  protected override renderContent(): ReactNode {
    const {
      checked = false,
      disabled = false,
      variant = 'default',
      label,
      className = '',
      value,
      name,
      required,
      autoFocus,
      ariaLabel,
      ariaDescribedBy,
      testId,
      ...props
    } = this.props;

    const { isFocused } = this.state;

    return (
      <CheckboxWrapper className={className}>
        <CheckboxInput
          type="checkbox"
          checked={checked}
          disabled={disabled}
          variant={variant}
          value={value}
          name={name}
          required={required}
          autoFocus={autoFocus}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-checked={checked}
          data-testid={testId || 'checkbox-component'}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          {...props}
        />
        {label && (
          <CheckboxLabel
            variant={variant}
            disabled={disabled}
            focused={isFocused}
          >
            {label}
            {required && <span className="required-indicator" aria-label="required">*</span>}
          </CheckboxLabel>
        )}
      </CheckboxWrapper>
    );
  }
}

export default CheckboxComponent;
