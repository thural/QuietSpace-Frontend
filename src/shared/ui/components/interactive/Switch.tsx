import React from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

interface SwitchProps extends BaseComponentProps {
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
  gap: ${props => props.$size === 'sm' ? '0.5rem' : props.$size === 'lg' ? '0.75rem' : '0.625rem'};
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
  width: ${props => props.$size === 'sm' ? '2rem' : props.$size === 'lg' ? '3rem' : '2.5rem'};
  height: ${props => props.$size === 'sm' ? '1rem' : props.$size === 'lg' ? '1.5rem' : '1.25rem'};
  background-color: ${props =>
        props.$disabled
            ? props.theme.colors?.border || '#e1e4e8'
            : props.$checked
                ? props.theme.colors?.primary || '#007bff'
                : props.theme.colors?.border || '#e1e4e8'
    };
  border-radius: ${props => props.$size === 'sm' ? '0.5rem' : props.$size === 'lg' ? '0.75rem' : '0.625rem'};
  transition: all 0.2s ease;
`;

const SwitchThumb = styled.div<{ $checked: boolean; $size: string }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(${props => props.$checked ?
        (props.$size === 'sm' ? '1rem' : props.$size === 'lg' ? '1.5rem' : '1.25rem') : '0'
    });
  width: ${props => props.$size === 'sm' ? '0.75rem' : props.$size === 'lg' ? '1.125rem' : '0.9375rem'};
  height: ${props => props.$size === 'sm' ? '0.75rem' : props.$size === 'lg' ? '1.125rem' : '0.9375rem'};
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const SwitchLabel = styled.span<{ $size: string }>`
  font-size: ${props => props.$size === 'sm' ? '0.75rem' : props.$size === 'lg' ? '1rem' : '0.875rem'};
  color: ${props => props.theme.colors?.text?.primary || '#1a1a1a'};
  user-select: none;
`;

export const Switch: React.FC<SwitchProps> = ({
    checked = false,
    onChange,
    label,
    labelPosition = 'right',
    disabled = false,
    size = 'md',
    className,
    style,
    testId,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.checked);
        }
    };

    const switchContent = (
        <>
            <SwitchInput
                type="checkbox"
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
            />
            <SwitchTrack $checked={checked} $size={size} $disabled={disabled}>
                <SwitchThumb $checked={checked} $size={size} />
            </SwitchTrack>
        </>
    );

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
                {switchContent}
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
            {switchContent}
        </SwitchContainer>
    );
};
