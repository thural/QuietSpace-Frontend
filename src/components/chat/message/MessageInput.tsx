import styles from "@/styles/chat/messageInputStyles";
import { ConsumerFn } from "@/types/genericTypes";
import BoxStyled from "@shared/BoxStyled";
import EmojiInput from "@shared/EmojiInput";
import FormStyled from "@shared/FormStyled";
import { useRef } from "react";

/**
 * Props for the MessageInput component.
 *
 * @interface MessageinputProps
 * @property {string} value - The current value of the input.
 * @property {ConsumerFn} onChange - Callback function to handle input changes.
 * @property {ConsumerFn} onEnter - Callback function to handle the Enter key press.
 * @property {string} placeholder - Placeholder text for the input.
 * @property {boolean} enabled - Indicates if the input is enabled.
 */
interface MessageinputProps {
    value: string;
    onChange: ConsumerFn;
    onEnter: ConsumerFn;
    placeholder: string;
    enabled: boolean;
}

/**
 * MessageInput component for sending messages with emoji support.
 *
 * @param {MessageinputProps} props - The props for the MessageInput component.
 * @returns {JSX.Element} - The rendered message input component.
 */
const MessageInput: React.FC<MessageinputProps> = ({ value, onChange, onEnter, placeholder, enabled }) => {
    const classes = styles();
    const messageInput = useRef("");

    return (
        <BoxStyled className={classes.inputSection}>
            <FormStyled className={classes.inputForm}>
                <EmojiInput
                    ref={messageInput}
                    className={classes.messageInput}
                    value={value}
                    onChange={onChange}
                    cleanOnEnter
                    buttonElement
                    onEnter={onEnter}
                    placeholder={placeholder}
                    enabled={enabled}
                />
            </FormStyled>
        </BoxStyled>
    );
}

export default MessageInput;