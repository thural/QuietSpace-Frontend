import { Message } from "@/api/schemas/inferred/chat";
import BoxStyled from "@shared/BoxStyled";
import Conditional from "@shared/Conditional";
import Typography from "@shared/Typography";
import useMessage from "../../../services/hook/chat/useMessage";
import styles from "../../../styles/chat/messageStyles";

interface MessageBoxProps {
    message: Message
    style: React.CSSProperties
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, style }) => {

    const classes = styles();

    const {
        user,
        isHovering,
        wasSeenRef,
        handleMouseOver,
        handleMouseOut,
        handleDeleteMessage
    } = useMessage(message);

    return (
        <BoxStyled id={message.id} ref={wasSeenRef} className={classes.message}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            style={style}
        >
            <Conditional isEnabled={message.senderId === user.id && isHovering}>
                <BoxStyled className={classes.delete} onClick={handleDeleteMessage}>delete</BoxStyled>
            </Conditional>
            <BoxStyled className={classes.text}><Typography>{message.text}</Typography></BoxStyled>
        </BoxStyled>
    );
};

export default MessageBox;