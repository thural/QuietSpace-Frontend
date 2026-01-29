import React from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

interface FileInputProps extends BaseComponentProps {
    value?: File | null;
    onChange?: (file: File | null) => void;
    placeholder?: string;
    accept?: string;
    disabled?: boolean;
    multiple?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const FileInputContainer = styled.div<{ $size: string }>`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const FileInputInput = styled.input<{ $size: string }>`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const FileInputButton = styled.div<{ $size: string; $disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.$size === 'sm' ? '0.5rem' : props.$size === 'lg' ? '1rem' : '0.75rem'};
  padding: ${props => props.$size === 'sm' ? '0.5rem 1rem' : props.$size === 'lg' ? '1rem 2rem' : '0.75rem 1.5rem'};
  border: 2px dashed ${props => props.$disabled ? props.theme.colors?.border || '#e1e4e8' : props.theme.colors?.primary || '#007bff'};
  border-radius: ${props => props.$size === 'sm' ? '0.25rem' : props.$size === 'lg' ? '0.5rem' : '0.375rem'};
  background-color: ${props => props.theme.colors?.surface || '#ffffff'};
  color: ${props => props.$disabled ? props.theme.colors?.text?.secondary || '#666666' : props.theme.colors?.primary || '#007bff'};
  font-size: ${props => props.$size === 'sm' ? '0.75rem' : props.$size === 'lg' ? '1rem' : '0.875rem'};
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background-color: ${props => props.$disabled ? 'transparent' : props.theme.colors?.primary || '#007bff'}10;
  }
`;

const FileInputText = styled.span<{ $size: string }>`
  font-size: ${props => props.$size === 'sm' ? '0.75rem' : props.$size === 'lg' ? '1rem' : '0.875rem'};
  color: ${props => props.theme.colors?.text?.primary || '#1a1a1a'};
`;

export const FileInput: React.FC<FileInputProps> = ({
    value,
    onChange,
    placeholder = "Choose file or drag and drop",
    accept,
    disabled = false,
    multiple = false,
    size = 'md',
    className,
    style,
    testId,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange?.(file);
    };

    const displayText = value ? value.name : placeholder;

    return (
        <FileInputContainer
            className={className}
            style={style}
            data-testid={testId}
        >
            <FileInputInput
                type="file"
                $size={size}
                onChange={handleChange}
                accept={accept}
                disabled={disabled}
                multiple={multiple}
            />
            <FileInputButton $size={size} $disabled={disabled}>
                <FileInputText $size={size}>{displayText}</FileInputText>
            </FileInputButton>
        </FileInputContainer>
    );
};
