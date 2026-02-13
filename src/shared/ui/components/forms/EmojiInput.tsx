import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import { PureComponent, ReactNode } from 'react';
import InputEmoji from "react-input-emoji";
import styled from 'styled-components';
import { getSpacing, getColor, getTypography, getRadius, getBorderWidth, getTransition, getShadow } from '../utils';

// Enterprise styled-components using theme system
const EmojiInputWrapper = styled.div<{ theme: any }>`
  position: relative;
  
  .react-input-emoji--container {
    background: ${props => getColor(props.theme, 'background.primary')};
    border: ${props => getBorderWidth(props.theme, 'sm')} solid ${props => getColor(props.theme, 'border.medium')};
    border-radius: ${props => getRadius(props.theme, 'md')};
    transition: ${props => getTransition(props.theme, 'all', 'normal', 'ease')};
    
    &:focus-within {
      border-color: ${props => getColor(props.theme, 'brand.500')};
      box-shadow: 0 0 0 3px ${props => getColor(props.theme, 'brand.200')};
    }
  }
  
  .react-emoji-picker--wrapper {
    position: absolute;
    top: ${props => getSpacing(props.theme, 48)};
    right: 0;
    height: ${props => getSpacing(props.theme, 435)};
    width: ${props => getSpacing(props.theme, 352)};
    overflow: hidden;
    z-index: 10;
    background: ${props => getColor(props.theme, 'background.primary')};
    border: ${props => getBorderWidth(props.theme, 'sm')} solid ${props => getColor(props.theme, 'border.medium')};
    border-radius: ${props => getRadius(props.theme, 'lg')};
    box-shadow: ${props => getShadow(props.theme, 'xl')};
  }
  
  .react-input-emoji--button {
    color: ${props => getColor(props.theme, 'text.secondary')};
    right: 0;
    width: fit-content;
    display: flex;
    padding: ${props => getSpacing(props.theme, 'md')};
    position: absolute;
    font-size: ${props => getTypography(props.theme, 'fontSize.base')};
    font-weight: ${props => props.theme?.typography?.fontWeight?.medium || '500'};
    z-index: 1;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: ${props => getRadius(props.theme, 'md')};
    transition: ${props => getTransition(props.theme, 'all', 'fast', 'ease')};
    
    &:hover {
      background: ${props => getColor(props.theme, 'background.tertiary')};
      color: ${props => getColor(props.theme, 'text.primary')};
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  .react-input-emoji--input {
    padding: ${props => getSpacing(props.theme, 'md')} ${props => getSpacing(props.theme, 'lg')};
    font-size: ${props => getTypography(props.theme, 'fontSize.base')};
    font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
    color: ${props => getColor(props.theme, 'text.primary')};
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    
    &::placeholder {
      color: ${props => getColor(props.theme, 'text.tertiary')};
    }
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme?.breakpoints?.sm || '640px'}) {
    .react-emoji-picker--wrapper {
      width: ${props => getSpacing(props.theme, 280)};
      height: ${props => getSpacing(props.theme, 350)};
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
      <EmojiInputWrapper theme={theme}>
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
      </EmojiInputWrapper>
    );
  }
}

export default withForwardedRefAndErrBoundary(EmojiInput);