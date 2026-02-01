import { EnhancedTheme } from '@/core/theme';
import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Enterprise styled-components for enhanced switch styling
const SwitchStyledContainer = styled.div<{ theme: EnhancedTheme; size?: 'md' | 'sm' | 'lg'; disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  opacity: ${props => props.disabled ? 0.6 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  .switch-label {
    font-family: ${props => props.theme.typography.fontFamily.sans.join(', ')};
    font-size: ${props => {
    switch (props.size) {
      case 'sm': return props.theme.typography.fontSize.sm;
      case 'lg': return props.theme.typography.fontSize.lg;
      default: return props.theme.typography.fontSize.base;
    }
  }};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    color: ${props => props.disabled ? props.theme.colors.text.tertiary : props.theme.colors.text.primary};
    user-select: none;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: color ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
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
      background: ${props => props.disabled ? props.theme.colors.border.light : props.theme.colors.border.medium};
      border-radius: ${props => {
    switch (props.size) {
      case 'sm': return props.theme.radius.sm;
      case 'lg': return props.theme.radius.lg;
      default: return props.theme.radius.md;
    }
  }};
      transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
      
      &:before {
        position: absolute;
        content: "";
        height: ${props => {
    switch (props.size) {
      case 'sm': return '12px';
      case 'lg': return '24px';
      default: return '18px';
    }
  }};
        width: ${props => {
    switch (props.size) {
      case 'sm': return '12px';
      case 'lg': return '24px';
      default: return '18px';
    }
  }};
        left: ${props => {
    switch (props.size) {
      case 'sm': return '2px';
      case 'lg': return '3px';
      default: return '2px';
    }
  }};
        bottom: ${props => {
    switch (props.size) {
      case 'sm': return '2px';
      case 'lg': return '3px';
      default: return '2px';
    }
  }};
        background-color: white;
        border-radius: 50%;
        transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
      }
    }
    
    input:checked + .switch-slider {
      background-color: ${props => props.disabled ? props.theme.colors.border.light : props.theme.colors.brand[500]};
      
      &:before {
        transform: translateX(${props => {
    switch (props.size) {
      case 'sm': return '16px';
      case 'lg': return '32px';
      default: return '24px';
    }
  }});
      }
    }
    
    input:focus + .switch-slider {
      box-shadow: 0 0 0 3px ${props => props.theme.colors.brand[200]};
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
    const { disabled, onChange, onValueChange, value } = this.props;
    const isChecked = event.target.checked;

    if (!disabled) {
      // Call the original onChange prop
      onChange?.(isChecked);

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

    const { isFocused } = this.state;

    const switchSize = {
      sm: { width: '32px', height: '16px' },
      md: { width: '48px', height: '24px' },
      lg: { width: '64px', height: '32px' }
    };

    const currentSize = switchSize[size] || switchSize.md;

    return (
      <SwitchStyledContainer
        className={className}
        size={size}
        disabled={disabled}
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
            onChange={this.handleChange}
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
