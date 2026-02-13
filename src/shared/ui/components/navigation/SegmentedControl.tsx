/**
 * Enterprise SegmentedControl Component
 * 
 * A segmented control component that replaces the original SegmentedControl component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { getColor, getRadius, getSpacing, getTransition, getTypography } from '../utils';

// Styled components
const SegmentedContainer = styled.div<{ theme: any }>`
  display: flex;
  background-color: ${props => getColor(props.theme, 'background.secondary')};
  border-radius: ${props => getRadius(props.theme, 'sm')};
  padding: ${props => getSpacing(props.theme, 'xs')};
  width: fit-content;
`;

const SegmentedButton = styled.button<{ theme: any; active?: boolean; color?: string }>`
  background: ${props => props.active ?
        getColor(props.theme, props.color || 'brand.500') :
        'transparent'};
  color: ${props => props.active ?
        getColor(props.theme, 'text.inverse') :
        getColor(props.theme, 'text.primary')};
  border: none;
  padding: ${props => getSpacing(props.theme, 'sm')} ${props => getSpacing(props.theme, 'lg')};
  cursor: pointer;
  font-size: ${props => getTypography(props.theme, 'fontSize.base')};
  border-radius: ${props => getRadius(props.theme, 'xs')};
  transition: ${props => getTransition(props.theme, 'all', 'fast', 'ease')};
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || '500'};
  white-space: nowrap;

  &:hover {
    background: ${props => props.active ?
        getColor(props.theme, props.color || 'brand.500') :
        getColor(props.theme, 'background.tertiary')};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${props => getSpacing(props.theme, 2)} solid ${props => getColor(props.theme, 'brand.200')};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Props interfaces
export interface ISegmentedControlItem {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface ISegmentedControlProps extends BaseComponentProps {
    data: ISegmentedControlItem[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    color?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    disabled?: boolean;
}

interface ISegmentedControlState {
    internalValue: string;
}

// Size styles
const getSizeStyles = (size: string, theme: any) => {
    const sizes = {
        xs: { padding: `${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')}`, fontSize: getTypography(theme, 'fontSize.xs') },
        sm: { padding: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')}`, fontSize: getTypography(theme, 'fontSize.sm') },
        md: { padding: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'lg')}`, fontSize: getTypography(theme, 'fontSize.base') },
        lg: { padding: `${getSpacing(theme, 'md')} ${getSpacing(theme, 'xl')}`, fontSize: getTypography(theme, 'fontSize.lg') },
        xl: { padding: `${getSpacing(theme, 'md')} ${getSpacing(theme, 'xxl')}`, fontSize: getTypography(theme, 'fontSize.xl') }
    };
    return sizes[size as keyof typeof sizes] || sizes.md;
};

// Main SegmentedControl component
class SegmentedControl extends PureComponent<ISegmentedControlProps, ISegmentedControlState> {
    constructor(props: ISegmentedControlProps) {
        super(props);

        const { defaultValue, data } = props;
        this.state = {
            internalValue: defaultValue || data[0]?.value || ''
        };
    }

    /**
     * Handle value change
     */
    private handleValueChange = (newValue: string): void => {
        const { disabled, value: controlledValue, onChange } = this.props;
        const { internalValue } = this.state;
        const isControlled = controlledValue !== undefined;
        const activeValue = isControlled ? controlledValue : internalValue;

        if (disabled) return;

        if (isControlled && onChange) {
            onChange(newValue);
        } else if (!isControlled) {
            this.setState({ internalValue: newValue });
        }
    };

    /**
     * Get active value
     */
    private getActiveValue = (): string => {
        const { value: controlledValue } = this.props;
        const { internalValue } = this.state;
        const isControlled = controlledValue !== undefined;
        return isControlled ? controlledValue : internalValue;
    };

    /**
     * Get size styles
     */
    private getSizeStyles = (): React.CSSProperties => {
        const { size = 'md', theme } = this.props;
        return getSizeStyles(size, theme);
    };

    override render(): ReactNode {
        const {
            data,
            color,
            size = 'md',
            fullWidth = false,
            disabled = false,
            className,
            testId,
            theme,
            ...props
        } = this.props;

        const activeValue = this.getActiveValue();
        const sizeStyles = this.getSizeStyles();

        return (
            <SegmentedContainer
                className={className}
                data-testid={testId}
                theme={theme}
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
                        onClick={() => this.handleValueChange(item.value)}
                        style={sizeStyles}
                        theme={theme}
                    >
                        {item.label}
                    </SegmentedButton>
                ))}
            </SegmentedContainer>
        );
    }
}

SegmentedControl.displayName = 'SegmentedControl';

export default SegmentedControl;
