import emoji from "react-easy-emoji";
import React, { PureComponent, ReactNode } from 'react';

/**
 * EmojiText component.
 * 
 * This component takes a string of text and renders it with emojis converted from the text. 
 * Each emoji representation is wrapped in a paragraph element for proper styling and layout.
 * 
 * @param {{ text: string }} props - The component props.
 * @param {string} props.text - The text string containing emojis to be rendered.
 * @returns {JSX.Element} - The rendered EmojiText component.
 */
interface IEmojiTextProps {
    text: string;
}

class EmojiText extends PureComponent<IEmojiTextProps> {
    render(): ReactNode {
        const { text } = this.props;

        return (
            <>
                {emoji(text)}
            </>
        );
    }
}

export default EmojiText;