/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { emojiTextContainerStyles } from './styles';
import { IEmojiTextProps, IEmojiTextState } from './interfaces';
import emoji from "react-easy-emoji";

/**
 * Enterprise EmojiText Component
 * 
 * A simple component that renders text with emojis converted from the text.
 * Built using enterprise BaseClassComponent pattern with Emotion CSS.
 * 
 * @example
 * ```tsx
 * <EmojiText text="Hello 👋 World 🌍" />
 * ```
 */
export class EmojiText extends BaseClassComponent<IEmojiTextProps, IEmojiTextState> {
  protected override getInitialState(): Partial<IEmojiTextState> {
    return {};
  }

  protected override renderContent(): React.ReactNode {
    const { text, className, testId, id, onClick, style } = this.props;

    return (
      <div 
        css={emojiTextContainerStyles}
        className={className}
        data-testid={testId}
        id={id?.toString()}
        onClick={onClick}
        style={style}
      >
        {emoji(text)}
      </div>
    );
  }
}
