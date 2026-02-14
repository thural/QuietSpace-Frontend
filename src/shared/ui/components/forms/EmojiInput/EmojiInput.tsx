/** @jsxImportSource @emotion/react */
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRefAndErrBoundary";
import { PureComponent, ReactNode } from 'react';
import InputEmoji from "react-input-emoji";
import { IEmojiInputProps } from './interfaces';
import { createEmojiInputWrapperStyles } from './styles';

/**
 * EmojiInput Component
 * 
 * An input component with emoji picker support and enterprise styling.
 * Provides rich text input with emoji selection and proper accessibility.
 */
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
      <div css={createEmojiInputWrapperStyles(theme)}>
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
