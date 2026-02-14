/** @jsxImportSource @emotion/react */
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import { PureComponent, ReactNode } from 'react';
import InputEmoji from "react-input-emoji";
import { css } from '@emotion/react';
import { getSpacing, getColor, getTypography, getRadius, getBorderWidth, getTransition, getShadow, getBreakpoint } from '../utils';

// Enterprise Emotion CSS using theme system
const emojiInputWrapperStyles = (theme?: any) => css`
  position: relative;
  
  .react-input-emoji--container {
    background: ${getColor(theme, 'background.primary')};
    border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
    border-radius: ${getRadius(theme, 'md')};
    transition: ${getTransition(theme, 'all', 'normal', 'ease')};
    
    &:focus-within {
      border-color: ${getColor(theme, 'brand.500')};
      box-shadow: 0 0 0 ${getSpacing(theme, 3)} solid ${getColor(theme, 'brand.200')};
    }
  }
  
  .react-emoji-picker--wrapper {
    position: absolute;
    top: ${getSpacing(theme, 48)};
    right: 0;
    height: ${getSpacing(theme, 435)};
    width: ${getSpacing(theme, 352)};
    overflow: hidden;
    z-index: 10;
    background: ${getColor(theme, 'background.primary')};
    border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
    border-radius: ${getRadius(theme, 'lg')};
    box-shadow: ${getShadow(theme, 'xl')};
  }
  
  .react-input-emoji--button {
    color: ${getColor(theme, 'text.secondary')};
    right: 0;
    width: fit-content;
    display: flex;
    padding: ${getSpacing(theme, 'md')};
    position: absolute;
    font-size: ${getTypography(theme, 'fontSize.base')};
    font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
    z-index: 1;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: ${getRadius(theme, 'md')};
    transition: ${getTransition(theme, 'all', 'fast', 'ease')};
    
    &:hover {
      background: ${getColor(theme, 'background.tertiary')};
      color: ${getColor(theme, 'text.primary')};
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  .react-input-emoji--input {
    padding: ${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')};
    font-size: ${getTypography(theme, 'fontSize.base')};
    font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
    color: ${getColor(theme, 'text.primary')};
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    
    &::placeholder {
      color: ${getColor(theme, 'text.tertiary')};
    }
  }
  
  // Responsive design
  @media (max-width: ${getBreakpoint(theme, 'sm')}) {
    .react-emoji-picker--wrapper {
      width: ${getSpacing(theme, 280)};
      height: ${getSpacing(theme, 350)};
    }
  }
`;

interface IEmojiInputProps extends GenericWrapperWithRef {
  isEnabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  fontSize?: number;
  onEnter?: () => void;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  disabled?: boolean;
  theme?: any;
}

class EmojiInput extends PureComponent<IEmojiInputProps> {
  static defaultProps: Partial<IEmojiInputProps> = {
    isEnabled: true,
    maxLength: 255,
    fontSize: 15,
    size: 'md',
    placeholder: 'Type a message...'
  };

  override render(): ReactNode {
    const {
      forwardedRef,
      value,
      onChange,
      fontSize,
      maxLength,
      onEnter,
      variant,
      size,
      placeholder,
      disabled,
      theme,
      ...props
    } = this.props;

    return (
      <div css={emojiInputWrapperStyles(theme)}>
        <InputEmoji
          ref={forwardedRef}
          value={value || ''}
          onChange={onChange || (() => { })}
          fontSize={fontSize}
          maxLength={maxLength}
          cleanOnEnter
          background="transparent"
          onEnter={onEnter || (() => { })}
          theme="auto"
          shouldReturn={true}
          shouldConvertEmojiToImage={false}
          placeholder={placeholder}
          {...props}
        />
      </div>
    );
  }
}

export default withForwardedRefAndErrBoundary(EmojiInput);