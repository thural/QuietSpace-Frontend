/**
 * Enterprise SegmentedControl Component
 * 
 * A segmented control component that replaces the original SegmentedControl component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

// Styled components
const SegmentedContainer = styled.div<{ theme: any }>`
  display: flex;
  background-color: ${props => props.theme.colors?.backgroundSecondary || '#f5f5f5'};
  border-radius: ${props => props.theme.radius?.md || '4px'};
  padding: 4px;
  width: fit-content;
`;

const SegmentedButton = styled.button<{ theme: any; active?: boolean; color?: string }>`
  background: ${props => props.active ?
        (props.color || props.theme.colors?.primary || '#007bff') :
        'transparent'};
  color: ${props => props.active ?
        '#ffffff' :
        props.theme.colors?.text || '#333'};
  border: none;
  padding: ${props => props.theme.spacing(props.theme.spacingFactor.sm)} ${props => props.theme.spacing(props.theme.spacingFactor.lg)};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.primary};
  border-radius: ${props => props.theme.radius?.sm || '2px'};
  transition: all 0.2s ease;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background: ${props => props.active ?
        (props.color || props.theme.colors?.primary || '#007bff') :
        props.theme.colors?.backgroundTertiary || '#e0e0e0'};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(props => props.theme.colors?.primary || '#007bff') + '20'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Props interfaces
export interface SegmentedControlItem {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SegmentedControlProps extends BaseComponentProps {
    data: SegmentedControlItem[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    color?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    disabled?: boolean;
}

// Size styles
const getSizeStyles = (size: string, theme: any) => {
    const sizes = {
        xs: { padding: `${theme.spacing(theme.spacingFactor.xs)} ${theme.spacing(theme.spacingFactor.sm)}`, fontSize: '12px' },
        sm: { padding: `${theme.spacing(theme.spacingFactor.sm)} ${theme.spacing(theme.spacingFactor.md)}`, fontSize: '13px' },
        md: { padding: `${theme.spacing(theme.spacingFactor.sm)} ${theme.spacing(theme.spacingFactor.lg)}`, fontSize: '14px' },
        lg: { padding: `${theme.spacing(theme.spacingFactor.md)} ${theme.spacing(theme.spacingFactor.xl)}`, fontSize: '16px' },
        xl: { padding: `${theme.spacing(theme.spacingFactor.md)} ${theme.spacing(theme.spacingFactor.xxl)}`, fontSize: '18px' }
    };
    return sizes[size as keyof typeof sizes] || sizes.md;
};

// Main SegmentedControl component
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
    data,
    value: controlledValue,
    defaultValue,
    onChange,
    color,
    size = 'md',
    fullWidth = false,
    disabled = false,
    className,
    testId,
    ...props
}) => {
    const [internalValue, setInternalValue] = useState(defaultValue || data[0]?.value || '');
    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = (newValue: string) => {
        if (disabled) return;

        if (isControlled && onChange) {
            onChange(newValue);
        } else if (!isControlled) {
            setInternalValue(newValue);
        }
    };

    const sizeStyles = getSizeStyles(size, {
        spacing: () => '8px',
        spacingFactor: { xs: 0.5, sm: 0.75, md: 1, lg: 1.5, xl: 2, xxl: 3 }
    } as any);

    return (
        <SegmentedContainer
            className={className}
            data-testid={testId}
            style={{
                width: fullWidth ? '100%' : 'fit-content'
            }}
            {...props}
        >
            {data.map((item) => (
                <SegmentedButton
                    key={item.value}
                    active={item.value === activeValue}
                    color={color}
                    disabled={disabled || item.disabled}
                    onClick={() => handleValueChange(item.value)}
                    style={sizeStyles}
                >
                    {item.label}
                </SegmentedButton>
            ))}
        </SegmentedContainer>
    );
};

SegmentedControl.displayName = 'SegmentedControl';

export default SegmentedControl;
