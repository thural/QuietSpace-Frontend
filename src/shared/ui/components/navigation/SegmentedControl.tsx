/** @jsxImportSource @emotion/react */
import React, { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { BaseComponentProps } from '../types';
import { getColor, getRadius, getSpacing, getTransition, getTypography } from '../utils';

// Emotion CSS utility functions
const createSegmentedContainerStyles = (theme: any) => css`
  display: flex;
  background-color: ${getColor(theme, 'background.secondary')};
  border-radius: ${getRadius(theme, 'sm')};
  padding: ${getSpacing(theme, 'xs')};
  width: fit-content;
`;

const createSegmentedButtonStyles = (theme: any, active: boolean, color?: string) => css`
  background: ${active ?
        getColor(theme, color || 'brand.500') :
        'transparent'};
  color: ${active ?
        getColor(theme, 'text.inverse') :
        getColor(theme, 'text.primary')};
  border: none;
  padding: ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'lg')};
  cursor: pointer;
  font-size: ${getTypography(theme, 'fontSize.base')};
  border-radius: ${getRadius(theme, 'xs')};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
  white-space: nowrap;

  &:hover {
    background: ${active ?
        getColor(theme, color || 'brand.500') :
        getColor(theme, 'background.tertiary')};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${getSpacing(theme, 2)} solid ${getColor(theme, 'brand.200')};
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
            onChange: _onChange,
            value: _value,
            defaultValue: _defaultValue,
            ...restProps
        } = this.props;

        const activeValue = this.getActiveValue();
        const sizeStyles = this.getSizeStyles();
        console.log('Active value:', activeValue); // Debug log to use the variable

        return (
            <div
                css={createSegmentedContainerStyles(theme || {} as any)}
                className={className}
                data-testid={testId}
                style={{
                    width: fullWidth ? '100%' : 'fit-content'
                }}
                {...restProps}
            >
                {data.map((item) => (
                    <button
                        key={item.value}
                        css={createSegmentedButtonStyles(theme || {} as any, item.value === activeValue, color)}
                        disabled={disabled || item.disabled}
                        onClick={() => this.handleValueChange(item.value)}
                        style={sizeStyles}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        );
    }
}

(SegmentedControl as any).displayName = 'SegmentedControl';

export default SegmentedControl;
