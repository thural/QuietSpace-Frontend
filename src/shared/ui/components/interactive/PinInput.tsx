import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

interface PinInputProps extends BaseComponentProps {
    length?: number;
    value?: string;
    onChange?: (value: string) => void;
    type?: 'text' | 'number';
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const PinInputContainer = styled.div<{ $size: string }>`
  display: flex;
  gap: ${props => props.$size === 'sm' ? '0.5rem' : props.$size === 'lg' ? '1rem' : '0.75rem'};
`;

const PinInputField = styled.input<{ $size: string }>`
  width: ${props => props.$size === 'sm' ? '2rem' : props.$size === 'lg' ? '3.5rem' : '3rem'};
  height: ${props => props.$size === 'sm' ? '2rem' : props.$size === 'lg' ? '3.5rem' : '3rem'};
  font-size: ${props => props.$size === 'sm' ? '1rem' : props.$size === 'lg' ? '1.5rem' : '1.25rem'};
  text-align: center;
  border: 2px solid ${props => props.theme.colors?.border || '#e1e4e8'};
  border-radius: ${props => props.$size === 'sm' ? '0.25rem' : props.$size === 'lg' ? '0.5rem' : '0.375rem'};
  background-color: ${props => props.theme.colors?.surface || '#ffffff'};
  color: ${props => props.theme.colors?.text?.primary || '#1a1a1a'};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors?.primary || '#007bff'};
    box-shadow: 0 0 0 2px ${props => props.theme.colors?.primary || '#007bff'}20;
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors?.border || '#e1e4e8'};
    cursor: not-allowed;
  }
  
  &::selection {
    background-color: ${props => props.theme.colors?.primary || '#007bff'};
    color: white;
  }
`;

export const PinInput: React.FC<PinInputProps> = ({
    length = 6,
    value = '',
    onChange,
    type = 'number',
    disabled = false,
    size = 'md',
    className,
    style,
    testId,
}) => {
    const [pinValues, setPinValues] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Update pinValues when value prop changes
    useEffect(() => {
        const values = value.split('').slice(0, length);
        const paddedValues = [...values, ...Array(length - values.length).fill('')];
        setPinValues(paddedValues);
    }, [value, length]);

    const handleChange = (index: number, inputValue: string) => {
        // Filter input based on type
        const filteredValue = type === 'number'
            ? inputValue.replace(/[^0-9]/g, '')
            : inputValue.replace(/[^a-zA-Z0-9]/g, '');

        if (filteredValue.length > 1) {
            // Handle paste case
            const values = filteredValue.split('').slice(0, length - index);
            const newPinValues = [...pinValues];
            values.forEach((val, i) => {
                if (index + i < length) {
                    newPinValues[index + i] = val;
                }
            });
            setPinValues(newPinValues);

            // Focus the next empty input or the last filled one
            const nextEmptyIndex = newPinValues.findIndex((val, i) => i > index && val === '');
            const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
            inputRefs.current[focusIndex]?.focus();

            onChange?.(newPinValues.join(''));
        } else {
            // Handle single character input
            const newPinValues = [...pinValues];
            newPinValues[index] = filteredValue;
            setPinValues(newPinValues);

            // Move to next input if a character was entered
            if (filteredValue && index < length - 1) {
                inputRefs.current[index + 1]?.focus();
            }

            onChange?.(newPinValues.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newPinValues = [...pinValues];

            if (pinValues[index]) {
                // Clear current input
                newPinValues[index] = '';
                setPinValues(newPinValues);
                onChange?.(newPinValues.join(''));
            } else if (index > 0) {
                // Move to previous input and clear it
                newPinValues[index - 1] = '';
                setPinValues(newPinValues);
                inputRefs.current[index - 1]?.focus();
                onChange?.(newPinValues.join(''));
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            e.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const filteredValue = type === 'number'
            ? pastedData.replace(/[^0-9]/g, '')
            : pastedData.replace(/[^a-zA-Z0-9]/g, '');

        handleChange(0, filteredValue);
    };

    return (
        <PinInputContainer
            className={className}
            style={style}
            data-testid={testId}
        >
            {Array.from({ length }, (_, index) => (
                <PinInputField
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type={type}
                    value={pinValues[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    $size={size}
                    maxLength={1}
                    inputMode={type === 'number' ? 'numeric' : 'text'}
                    autoComplete="off"
                />
            ))}
        </PinInputContainer>
    );
};
