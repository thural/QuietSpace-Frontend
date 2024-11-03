import BoxStyled from "@shared/BoxStyled";
import Conditional from "@shared/Conditional";
import Typography from "@shared/Typography";
import useMessage from "./hooks/useMessage";
import styles from "./styles/messageStyles";
import { Message } from "@/api/schemas/inferred/chat";
import { handleDeleteMessage } from "@/components/chat/container/utils/chatHandler";

const MessageBox = ({ message }: { message: Message }) => {

    const classes = styles();

    const {
        user,
        isHovering,
        wasSeenRef,
        appliedStyle,
        handleMouseOver,
        handleMouseOut,
    } = useMessage(message);

    return (
        <BoxStyled id={message.id} ref={wasSeenRef} className={classes.message}
            style={appliedStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <Conditional isEnabled={message.senderId === user.id && isHovering}>
                <BoxStyled className={classes.delete} onClick={handleDeleteMessage}>delete</BoxStyled>
            </Conditional>
            <BoxStyled className={classes.text}><Typography>{message.text}</Typography></BoxStyled>
        </BoxStyled>
    );
};

export default MessageBox;