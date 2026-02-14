/** @jsxImportSource @emotion/react */
import React, { ReactNode } from 'react';
import { css } from '@emotion/react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { getSpacing } from '../../../utils';
import { ISwitchStyledProps } from './interfaces';
import { createSwitchStyledContainerStyles } from './styles';

// Type guard to check if onChange is the boolean signature
function isBooleanOnChange(fn: any): fn is (checked: boolean) => void {
  return typeof fn === 'function' && fn.length === 1;
}

interface ISwitchStyledState extends IBaseComponentState {
  isFocused: boolean;
}

/**
 * SwitchStyled Component
 * 
 * An enterprise switch component with theme integration and accessibility.
 * Provides multiple sizes, label positions, and comprehensive event handling.
 */
class SwitchStyled extends BaseClassComponent<ISwitchStyledProps, ISwitchStyledState> {
  static defaultProps: Partial<ISwitchStyledProps> = {
    checked: false,
    disabled: false,
    size: 'md',
    labelPosition: 'right'
  };

  protected override getInitialState(): Partial<ISwitchStyledState> {
    return {
      isFocused: false
    };
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { disabled, onChange, onValueChange, value } = this.props;
    const isChecked = event.target.checked;

    if (!disabled) {
      // Call the enhanced onValueChange prop for Switch compatibility
      if (onValueChange && value !== undefined) {
        onValueChange(value, isChecked);
      }

      // Handle both onChange signatures using type guard
      if (onChange) {
        if (isBooleanOnChange(onChange)) {
          // Boolean signature: (checked: boolean) => void
          onChange(isChecked);
        } else {
          // Event handler signature: (event: ChangeEvent) => void
          onChange(event);
        }
      }
    }
  };

  private handleFocus = (): void => {
    this.safeSetState({ isFocused: true });
  };

  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.handleChange(event);
  };

  private handleBlur = (): void => {
    this.safeSetState({ isFocused: false });
  };

  /**
   * Public method to turn on the switch
   */
  public turnOn(): void {
    const { onChange, disabled } = this.props;
    if (!disabled && onChange) {
      if (isBooleanOnChange(onChange)) {
        onChange(true);
      }
    }
  }

  /**
   * Public method to turn off the switch
   */
  public turnOff(): void {
    const { onChange, disabled } = this.props;
    if (!disabled && onChange) {
      if (isBooleanOnChange(onChange)) {
        onChange(false);
      }
    }
  }

  /**
   * Public method to toggle the switch
   */
  public toggle(): void {
    const { checked, onChange, disabled } = this.props;
    if (!disabled && onChange) {
      if (isBooleanOnChange(onChange)) {
        onChange(!checked);
      }
    }
  }

  /**
   * Public method to get current checked state
   */
  public isOn(): boolean {
    return this.props.checked || false;
  }

  protected override renderContent(): ReactNode {
    const {
      checked = false,
      disabled = false,
      size = 'md',
      label,
      labelPosition = 'right',
      className = '',
      value,
      name,
      required,
      autoFocus,
      ariaLabel,
      ariaDescribedBy,
      onChange,
      onValueChange,
      testId,
      ...props
    } = this.props;

    const { theme } = this.props;

    const switchSize = {
      sm: { width: getSpacing(theme || {}, 32), height: getSpacing(theme || {}, 16) },
      md: { width: getSpacing(theme || {}, 48), height: getSpacing(theme || {}, 24) },
      lg: { width: getSpacing(theme || {}, 64), height: getSpacing(theme || {}, 32) }
    };

    const currentSize = switchSize[size] || switchSize.md;

    return (
      <div
        css={createSwitchStyledContainerStyles(theme, size, disabled)}
        className={className}
        data-testid={testId || 'switch-styled'}
      >
        {label && labelPosition === 'left' && (
          <label className="switch-label">
            {label}
            {required && <span className="required-indicator" aria-label="required">*</span>}
          </label>
        )}

        <label className="switch-input">
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            value={value}
            name={name}
            required={required}
            autoFocus={autoFocus}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-checked={checked}
            onChange={this.handleInputChange as React.ChangeEventHandler<HTMLInputElement>}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            {...props}
          />
          <span
            className="switch-slider"
            css={css`
              width: ${currentSize.width};
              height: ${currentSize.height};
            `}
          />
        </label>

        {label && labelPosition === 'right' && (
          <label className="switch-label">
            {label}
            {required && <span className="required-indicator" aria-label="required">*</span>}
          </label>
        )}
      </div>
    );
  }
}

export default SwitchStyled;
