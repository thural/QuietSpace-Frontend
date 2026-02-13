import React, { PureComponent, ReactNode, ChangeEvent } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { getSpacing, getColor, getRadius, getTransition, getTypography, getShadow } from '../utils';

interface ISwitchProps extends BaseComponentProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    labelPosition?: 'left' | 'right';
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const SwitchContainer = styled.div<{ $size: string; $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${props => getSpacing(props.theme, props.$size === 'sm' ? 'xs' : props.$size === 'lg' ? 'sm' : 'sm')};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.6 : 1};
`;

const SwitchInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const SwitchTrack = styled.div<{ $checked: boolean; $size: string; $disabled: boolean }>`
  position: relative;
  width: ${props => getSpacing(props.theme, props.$size === 'sm' ? '2xl' : props.$size === 'lg' ? '3xl' : '2.5xl')};
  height: ${props => getSpacing(props.theme, props.$size === 'sm' ? 'lg' : props.$size === 'lg' ? 'xl' : '2xl')};
  background-color: ${props =>
        props.$disabled
            ? getColor(props.theme, 'border.light')
            : props.$checked
                ? getColor(props.theme, 'brand.500')
                : getColor(props.theme, 'border.light')
    };
  border-radius: ${props => getRadius(props.theme, props.$size === 'sm' ? 'sm' : props.$size === 'lg' ? 'md' : 'sm')};
  transition: ${props => getTransition(props.theme)};
`;

const SwitchThumb = styled.div<{ $checked: boolean; $size: string }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(${props => props.$checked ?
        getSpacing(props.theme, props.$size === 'sm' ? 'lg' : props.$size === 'lg' ? 'xl' : '2xl') : '0'
    });
  width: ${props => getSpacing(props.theme, props.$size === 'sm' ? 'sm' : props.$size === 'lg' ? 'md' : 'sm')};
  height: ${props => getSpacing(props.theme, props.$size === 'sm' ? 'sm' : props.$size === 'lg' ? 'md' : 'sm')};
  background-color: ${props => getColor(props.theme, 'text.inverse')};
  border-radius: ${getRadius(props.theme, 'full')};
  transition: ${props => getTransition(props.theme, 'transform')};
  box-shadow: ${props => getShadow(props.theme, 'sm')};
`;

const SwitchLabel = styled.span<{ $size: string }>`
  font-size: ${props => getTypography(props.theme, props.$size === 'sm' ? 'fontSize.xs' : props.$size === 'lg' ? 'fontSize.base' : 'fontSize.sm')};
  color: ${props => getColor(props.theme, 'text.primary')};
  user-select: none;
`;

class Switch extends PureComponent<ISwitchProps> {
    /**
     * Handle switch change event
     */
    private handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(e.target.checked);
        }
    };

    /**
     * Render switch content
     */
    private renderSwitchContent = (): ReactNode => {
        const { checked = false, disabled = false, size = 'md' } = this.props;

        return (
            <>
                <SwitchInput
                    type="checkbox"
                    checked={checked}
                    onChange={this.handleChange}
                    disabled={disabled}
                />
                <SwitchTrack $checked={checked} $size={size} $disabled={disabled}>
                    <SwitchThumb $checked={checked} $size={size} />
                </SwitchTrack>
            </>
        );
    };

    override render(): ReactNode {
        const {
            checked = false,
            label,
            labelPosition = 'right',
            disabled = false,
            size = 'md',
            className,
            style,
            testId
        } = this.props;

        if (label) {
            return (
                <SwitchContainer
                    $size={size}
                    $disabled={disabled}
                    className={className}
                    style={style}
                    data-testid={testId}
                >
                    {labelPosition === 'left' && (
                        <SwitchLabel $size={size}>{label}</SwitchLabel>
                    )}
                    {this.renderSwitchContent()}
                    {labelPosition === 'right' && (
                        <SwitchLabel $size={size}>{label}</SwitchLabel>
                    )}
                </SwitchContainer>
            );
        }

        return (
            <SwitchContainer
                $size={size}
                $disabled={disabled}
                className={className}
                style={style}
                data-testid={testId}
            >
                {this.renderSwitchContent()}
            </SwitchContainer>
        );
    }
}

export default Switch;
