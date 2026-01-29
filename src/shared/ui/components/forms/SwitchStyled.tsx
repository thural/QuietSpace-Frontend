import { EnhancedTheme } from '@/core/theme';
import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';

// Enterprise styled-components for enhanced switch styling
const SwitchStyledContainer = styled.div<{ theme: EnhancedTheme; size?: 'md' | 'sm' | 'lg' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
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
    color: ${props => props.theme.colors.text.primary};
    user-select: none;
    cursor: pointer;
    transition: color ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  }
  
  .switch-input {
    position: relative;
    display: inline-block;
    cursor: pointer;
    
    input[type="checkbox"] {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .switch-slider {
      position: relative;
      display: inline-block;
      cursor: pointer;
      background: ${props => props.theme.colors.border.medium};
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
      case 'sm': return '16px';
      case 'lg': return '24px';
      default: return '20px';
    }
  }};
        width: ${props => {
    switch (props.size) {
      case 'sm': return '16px';
      case 'lg': return '24px';
      default: return '20px';
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
        background-color: ${props => props.theme.colors.background.inverse};
        border-radius: 50%;
        transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
        box-shadow: ${props => props.theme.shadows.sm};
      }
      
      &:hover {
        background: ${props => props.theme.colors.border.dark};
      }
    }
    
    input:checked + .switch-slider {
      background: ${props => props.theme.colors.brand[500]};
      border-color: ${props => props.theme.colors.brand[500]};
      
      &:before {
        transform: translateX(${props => {
    switch (props.size) {
      case 'sm': return '16px';
      case 'lg': return '24px';
      default: return '20px';
    }
  }});
      }
      
      &:hover {
        background: ${props => props.theme.colors.brand[600]};
      }
    }
    
    input:focus + .switch-slider {
      outline: 2px solid ${props => props.theme.colors.brand[500]};
      outline-offset: 2px;
    }
    
    input:disabled + .switch-slider {
      opacity: 0.6;
      cursor: not-allowed;
      background: ${props => props.theme.colors.border.light};
      
      &:hover {
        background: ${props => props.theme.colors.border.light};
      }
    }
  }
  
  // Responsive adjustments
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: ${props => props.theme.spacing.xs};
    
    .switch-label {
      font-size: ${props => props.theme.typography.fontSize.sm};
    }
  }
`;

interface ISwitchStyledProps {
  label?: string;
  size?: "md" | "sm" | "lg";
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'success';
}

class SwitchStyled extends PureComponent<ISwitchStyledProps> {
  static defaultProps: Partial<ISwitchStyledProps> = {
    label: "switch label",
    size: "md",
    checked: false,
    onChange: (checked: boolean) => console.log("missing change event for switch: ", checked),
    disabled: false,
    variant: 'default'
  };

  private getVariantStyles = (): string => {
    const { variant } = this.props;
    return `switch-${variant}`;
  };

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { onChange } = this.props;
    onChange?.(event.target.checked);
  };

  private renderSwitch = (): ReactNode => {
    const { checked, disabled, id, size } = this.props;

    return (
      <label className="switch-input">
        <input
          type="checkbox"
          checked={checked}
          onChange={this.handleChange}
          disabled={disabled}
          id={id}
        />
        <span className="switch-slider" />
      </label>
    );
  };

  render(): ReactNode {
    const { label, size, disabled, className } = this.props;

    return (
      <SwitchStyledContainer
        size={size}
        className={`switch-styled ${className || ''} ${this.getVariantStyles()}`}
      >
        {this.renderSwitch()}
        {label && (
          <span
            className="switch-label"
            style={{ opacity: disabled ? 0.6 : 1 }}
          >
            {label}
          </span>
        )}
      </SwitchStyledContainer>
    );
  }
}

export default SwitchStyled;