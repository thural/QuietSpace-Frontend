/** @jsxImportSource @emotion/react */
import React, { ReactNode } from 'react';
import { css } from '@emotion/react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { getSpacing, getColor, getTypography, getRadius, getTransition } from '../utils';

// Enterprise Emotion CSS for enhanced switch styling
const switchStyledContainerStyles = (theme?: any, size?: 'md' | 'sm' | 'lg', disabled?: boolean) => css`
  display: flex;
  align-items: center;
  gap: ${getSpacing(theme, 'sm')};
  opacity: ${disabled ? 0.6 : 1};
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  
  .switch-label {
    font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
    font-size: ${size === 'sm' ? getTypography(theme || {}, 'fontSize.sm') : size === 'lg' ? getTypography(theme || {}, 'fontSize.lg') : getTypography(theme || {}, 'fontSize.base')};
    font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
    color: ${getColor(theme, disabled ? 'text.tertiary' : 'text.primary')};
    user-select: none;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    transition: ${getTransition(theme, 'color', 'fast', 'ease')};
  }
  
  .switch-input {
    position: relative;
    display: inline-block;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    
    input[type="checkbox"] {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .switch-slider {
      position: relative;
      display: inline-block;
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      background: ${getColor(theme, disabled ? 'border.light' : 'border.medium')};
      border-radius: ${size === 'sm' ? getRadius(theme || {}, 'sm') : size === 'lg' ? getRadius(theme || {}, 'lg') : getRadius(theme || {}, 'md')};
      transition: ${getTransition(theme, 'all', 'normal', 'ease')};
      
      &:before {
        position: absolute;
        content: "";
        height: ${size === 'sm' ? getSpacing(theme || {}, 12) : size === 'lg' ? getSpacing(theme || {}, 24) : getSpacing(theme || {}, 18)};
        width: ${size === 'sm' ? getSpacing(theme || {}, 12) : size === 'lg' ? getSpacing(theme || {}, 24) : getSpacing(theme || {}, 18)};
        left: ${size === 'sm' ? getSpacing(theme || {}, 2) : size === 'lg' ? getSpacing(theme || {}, 3) : getSpacing(theme || {}, 2)};
        bottom: ${size === 'sm' ? getSpacing(theme || {}, 2) : size === 'lg' ? getSpacing(theme || {}, 3) : getSpacing(theme || {}, 2)};
        background-color: ${getColor(theme, 'text.inverse')};
        border-radius: 50%;
        transition: ${getTransition(theme, 'all', 'normal', 'ease')};
      }
    }
    
    input:checked + .switch-slider {
      background-color: ${getColor(theme, disabled ? 'border.light' : 'brand.500')};
      
      &:before {
        transform: translateX(${size === 'sm' ? getSpacing(theme || {}, 16) : size === 'lg' ? getSpacing(theme || {}, 32) : getSpacing(theme || {}, 24)});
      }
    }
    
    input:focus + .switch-slider {
      box-shadow: 0 0 0 3px ${getColor(theme, 'brand.200')};
    }
    
    input:disabled + .switch-slider {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

interface ISwitchStyledProps extends IBaseComponentProps {
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

  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

// Type guard to check if onChange is the boolean signature
function isBooleanOnChange(fn: any): fn is (checked: boolean) => void {
  return typeof fn === 'function' && fn.length === 1;
}

interface ISwitchStyledState extends IBaseComponentState {
  isFocused: boolean;
}

/**
 * Enterprise Switch Component
 * 
 * Consolidated switch component that handles both SwitchStyled and Switch use cases.
 * Features enhanced theme integration, accessibility, and enterprise patterns.
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
        css={switchStyledContainerStyles(theme, size, disabled)}
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
            style={{
              width: currentSize.width,
              height: currentSize.height
            }}
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
