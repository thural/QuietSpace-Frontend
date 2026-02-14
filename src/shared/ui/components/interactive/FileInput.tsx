/** @jsxImportSource @emotion/react */
import { ChangeEvent, PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
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

const createFileInputContainerStyles = () => css`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const createFileInputInputStyles = (disabled: boolean) => css`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const createFileInputButtonStyles = (theme: any, size: 'sm' | 'md' | 'lg', disabled: boolean) => {
  const gapStyles = {
    sm: getSpacing(theme, 'sm'),
    lg: getSpacing(theme, 'lg'),
    md: getSpacing(theme, 'md')
  };

  const paddingStyles = {
    sm: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'lg')}`,
    lg: `${getSpacing(theme, 'lg')} ${getSpacing(theme, 'xl')}`,
    md: `${getSpacing(theme, 'md')} ${getSpacing(theme, 'xl')}`
  };

  const radiusStyles = {
    sm: getRadius(theme, 'sm'),
    lg: getRadius(theme, 'md'),
    md: getRadius(theme, 'md')
  };

  const fontSizeStyles = {
    sm: getTypography(theme, 'fontSize.sm'),
    lg: getTypography(theme, 'fontSize.base'),
    md: getTypography(theme, 'fontSize.sm')
  };

  return css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${gapStyles[size]};
    padding: ${paddingStyles[size]};
    border: ${getBorderWidth(theme, 'md')} dashed ${getColor(theme, disabled ? 'border.light' : 'brand.500')};
    border-radius: ${radiusStyles[size]};
    background-color: ${getColor(theme, 'background.primary')};
    color: ${getColor(theme, disabled ? 'text.secondary' : 'brand.500')};
    font-size: ${fontSizeStyles[size]};
    font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
    transition: ${getTransition(theme, 'all', 'fast', 'ease')};
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
  
    &:hover {
      background-color: ${disabled ? 'transparent' : `${getColor(theme, 'brand.500')}10`};
    }
  `;
};

const createFileInputTextStyles = (theme: any, size: 'sm' | 'md' | 'lg') => {
  const fontSizeStyles = {
    sm: getTypography(theme, 'fontSize.sm'),
    lg: getTypography(theme, 'fontSize.base'),
    md: getTypography(theme, 'fontSize.sm')
  };

  return css`
    font-size: ${fontSizeStyles[size]};
    color: ${getColor(theme, 'text.primary')};
  `;
};

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
      testId,
      theme
    } = this.props;

    const displayText = value ? value.name : placeholder;

    return (
      <div
        css={createFileInputContainerStyles()}
        className={className}
        style={style}
        data-testid={testId}
      >
        <input
          css={createFileInputInputStyles(disabled)}
          type="file"
          onChange={this.handleChange}
          accept={accept}
          disabled={disabled}
          multiple={multiple}
        />
        <div css={createFileInputButtonStyles(theme || {} as any, size, disabled)}>
          <span css={createFileInputTextStyles(theme || {} as any, size)}>{displayText}</span>
        </div>
      </div>
    );
  }
}

export default FileInput;
