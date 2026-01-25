import { InputSection, InputForm } from "../../styles/MessageInputStyles";
import { ConsumerFn } from "@/shared/types/genericTypes";
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
 * Now uses enhanced version with real-time typing indicators.
 *
 * @param {MessageinputProps} props - The props for the MessageInput component.
 * @returns {JSX.Element} - The rendered message input component.
 */
const MessageInput: React.FC<MessageinputProps> = ({ value, onChange, onEnter, placeholder, enabled }) => {
    const { chatId } = useParams();

    // If chatId is available, use enhanced version with typing indicators
    if (chatId) {
        const EnhancedMessageInput = require('./EnhancedMessageInput').default;
        return (
            <EnhancedMessageInput
                value={value}
                onChange={onChange}
                onEnter={onEnter}
                placeholder={placeholder}
                enabled={enabled}
                chatId={chatId}
                onTypingStart={() => console.log('User started typing')}
                onTypingStop={() => console.log('User stopped typing')}
            />
        );
    }

    // Fallback to basic input if no chatId
    const messageInput = useRef("");

    return (
        <InputSection>
            <FormStyled>
                <EmojiInput
                    ref={messageInput}
                    value={value}
                    onChange={onChange}
                    cleanOnEnter
                    buttonElement
                    onEnter={onEnter}
                    placeholder={placeholder}
                    enabled={enabled}
                />
            </FormStyled>
        </InputSection>
    );
}

export default MessageInput;