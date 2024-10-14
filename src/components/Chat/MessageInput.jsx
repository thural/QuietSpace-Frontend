import BoxStyled from "../Shared/BoxStyled";
import EmojiInput from "../Shared/EmojiInput";
import FormStyled from "../Shared/FormStyled";
import styles from "./styles/messageInputStyles";

const MessageInput = ({ value, onChange, onEnter, placeholder, enabled }) => {
    const classes = styles();

    return (
        <BoxStyled className={classes.inputSection}>
            <FormStyled className={classes.inputForm}>
                <EmojiInput
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