import BoxStyled from "@shared/BoxStyled";
import EmojiInput from "@shared/EmojiInput";
import FormStyled from "@shared/FormStyled";
import styles from "../../../styles/chat/messageInputStyles";
import { ConsumerFn } from "@/types/genericTypes";
import { useRef } from "react";

interface MessageinputProps {
    value: string
    onChange: ConsumerFn
    onEnter: ConsumerFn
    placeholder: string
    enabled: boolean
}

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
    )
}

export default MessageInput