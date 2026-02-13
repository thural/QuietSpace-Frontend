import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { getSpacing, getColor, getTypography, getRadius, getTransition } from '../utils';

// Enterprise styled-components for enhanced switch styling
const SwitchStyledContainer = styled.div<{ theme: any; size?: 'md' | 'sm' | 'lg'; disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => getSpacing(props.theme, 'sm')};
  opacity: ${props => props.disabled ? 0.6 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  .switch-label {
    font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
    font-size: ${props => {
    switch (props.size) {
      case 'sm': return getTypography(props.theme, 'fontSize.sm');
      case 'lg': return getTypography(props.theme, 'fontSize.lg');
      default: return getTypography(props.theme, 'fontSize.base');
    }
  }};
    font-weight: ${props => props.theme?.typography?.fontWeight?.medium || '500'};
    color: ${props => getColor(props.theme, props.disabled ? 'text.tertiary' : 'text.primary')};
    user-select: none;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: ${props => getTransition(props.theme, 'color', 'fast', 'ease')};
  }
  
  .switch-input {
    position: relative;
    display: inline-block;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    
    input[type="checkbox"] {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .switch-slider {
      position: relative;
      display: inline-block;
      cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
      background: ${props => getColor(props.theme, props.disabled ? 'border.light' : 'border.medium')};
      border-radius: ${props => {
    switch (props.size) {
      case 'sm': return getRadius(props.theme, 'sm');
      case 'lg': return getRadius(props.theme, 'lg');
      default: return getRadius(props.theme, 'md');
    }
  }};
      transition: ${props => getTransition(props.theme, 'all', 'normal', 'ease')};
      
      &:before {
        position: absolute;
        content: "";
        height: ${props => {
    switch (props.size) {
      case 'sm': return getSpacing(props.theme, 12);
      case 'lg': return getSpacing(props.theme, 24);
      default: return getSpacing(props.theme, 18);
    }
  }};
        width: ${props => {
    switch (props.size) {
      case 'sm': return getSpacing(props.theme, 12);
      case 'lg': return getSpacing(props.theme, 24);
      default: return getSpacing(props.theme, 18);
    }
  }};
        left: ${props => {
    switch (props.size) {
      case 'sm': return getSpacing(props.theme, 2);
      case 'lg': return getSpacing(props.theme, 3);
      default: return getSpacing(props.theme, 2);
    }
  }};
        bottom: ${props => {
    switch (props.size) {
      case 'sm': return getSpacing(props.theme, 2);
      case 'lg': return getSpacing(props.theme, 3);
      default: return getSpacing(props.theme, 2);
    }
  }};
        background-color: ${props => getColor(props.theme, 'text.inverse')};
        border-radius: 50%;
        transition: ${props => getTransition(props.theme, 'all', 'normal', 'ease')};
      }
    }
    
    input:checked + .switch-slider {
      background-color: ${props => getColor(props.theme, props.disabled ? 'border.light' : 'brand.500')};
      
      &:before {
        transform: translateX(${props => {
    switch (props.size) {
      case 'sm': return getSpacing(props.theme, 16);
      case 'lg': return getSpacing(props.theme, 32);
      default: return getSpacing(props.theme, 24);
    }
  }});
      }
    }
    
    input:focus + .switch-slider {
      box-shadow: 0 0 0 3px ${props => getColor(props.theme, 'brand.200')};
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
  onChange?: (checked: boolean) => void;
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
    const { disabled, onValueChange, value } = this.props;
    const isChecked = event.target.checked;

    if (!disabled) {
      // Call the enhanced onValueChange prop for Switch compatibility
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
   * Public method to turn on the switch
   */
  public turnOn(): void {
    const { onChange, disabled } = this.props;
    if (!disabled) {
      onChange?.(true);
    }
  }

  /**
   * Public method to turn off the switch
   */
  public turnOff(): void {
    const { onChange, disabled } = this.props;
    if (!disabled) {
      onChange?.(false);
    }
  }

  /**
   * Public method to toggle the switch
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
      <SwitchStyledContainer
        className={className}
        size={size}
        disabled={disabled}
        theme={theme}
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
            onChange={(e) => {
              const isChecked = e.target.checked;
              this.handleChange(e);
              // Also call the onChange prop directly with boolean value
              if (this.props.onChange) {
                this.props.onChange(isChecked);
              }
            }}
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
      </SwitchStyledContainer>
    );
  }
}

export default SwitchStyled;
