import { ChangeEvent, PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { getBorderWidth, getColor, getRadius, getSpacing, getTransition, getTypography } from '../utils';

interface IFileInputProps extends BaseComponentProps {
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

const FileInputButton = styled.div<{ $size: string; $disabled: boolean; theme?: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => {
    switch (props.$size) {
      case 'sm': return getSpacing(props.theme, 'sm');
      case 'lg': return getSpacing(props.theme, 'lg');
      default: return getSpacing(props.theme, 'md');
    }
  }};
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return `${getSpacing(props.theme, 'sm')} ${getSpacing(props.theme, 'lg')}`;
      case 'lg': return `${getSpacing(props.theme, 'lg')} ${getSpacing(props.theme, 'xl')}`;
      default: return `${getSpacing(props.theme, 'md')} ${getSpacing(props.theme, 'xl')}`;
    }
  }};
  border: ${props => getBorderWidth(props.theme, 'md')} dashed ${props => getColor(props.theme, props.$disabled ? 'border.light' : 'brand.500')};
  border-radius: ${props => {
    switch (props.$size) {
      case 'sm': return getRadius(props.theme, 'sm');
      case 'lg': return getRadius(props.theme, 'md');
      default: return getRadius(props.theme, 'md');
    }
  }};
  background-color: ${props => getColor(props.theme, 'background.primary')};
  color: ${props => getColor(props.theme, props.$disabled ? 'text.secondary' : 'brand.500')};
  font-size: ${props => {
    switch (props.$size) {
      case 'sm': return getTypography(props.theme, 'fontSize.sm');
      case 'lg': return getTypography(props.theme, 'fontSize.base');
      default: return getTypography(props.theme, 'fontSize.sm');
    }
  }};
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || '500'};
  transition: ${props => getTransition(props.theme, 'all', 'fast', 'ease')};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background-color: ${props => props.$disabled ? 'transparent' : `${getColor(props.theme, 'brand.500')}10`};
  }
`;

const FileInputText = styled.span<{ $size: string; theme?: any }>`
  font-size: ${props => {
    switch (props.$size) {
      case 'sm': return getTypography(props.theme, 'fontSize.sm');
      case 'lg': return getTypography(props.theme, 'fontSize.base');
      default: return getTypography(props.theme, 'fontSize.sm');
    }
  }};
  color: ${props => getColor(props.theme, 'text.primary')};
`;

class FileInput extends PureComponent<IFileInputProps> {
  /**
   * Handle file input change event
   */
  private handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { onChange } = this.props;
    const file = e.target.files?.[0] || null;
    onChange?.(file);
  };

  override render(): ReactNode {
    const {
      value,
      placeholder = "Choose file or drag and drop",
      accept,
      disabled = false,
      multiple = false,
      size = 'md',
      className,
      style,
      testId
    } = this.props;

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
          onChange={this.handleChange}
          accept={accept}
          disabled={disabled}
          multiple={multiple}
        />
        <FileInputButton $size={size} $disabled={disabled} theme={undefined}>
          <FileInputText $size={size} theme={undefined}>{displayText}</FileInputText>
        </FileInputButton>
      </FileInputContainer>
    );
  }
}

export default FileInput;
