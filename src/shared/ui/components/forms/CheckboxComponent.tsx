import { CheckboxWrapper, CheckboxInput, CheckboxLabel } from "./CheckboxStyles";
import React, { PureComponent, ReactNode } from 'react';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

interface ICheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
  label?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
}

/**
 * Enterprise Checkbox Component
 * 
 * Replaces JSS-based checkboxStyles.ts with enterprise styled-components
 * following theme system patterns and class component best practices.
 */
class CheckboxComponent extends PureComponent<ICheckboxProps> {
  static defaultProps: Partial<ICheckboxProps> = {
    checked: false,
    disabled: false,
    variant: 'default'
  };

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { disabled, onChange } = this.props;
    if (!disabled) {
      onChange?.(event.target.checked);
    }
  };

  render(): ReactNode {
    const {
      checked,
      disabled,
      variant,
      label,
      className,
      ...props
    } = this.props;

    return (
      <CheckboxWrapper>
        <CheckboxInput
          type="checkbox"
          checked={checked}
          disabled={disabled}
          variant={variant}
          onChange={this.handleChange}
          {...props}
        />
        {label && (
          <CheckboxLabel>
            {label}
          </CheckboxLabel>
        )}
      </CheckboxWrapper>
    );
  }
}

export default CheckboxComponent;
