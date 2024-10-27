import BoxStyled from "@shared/BoxStyled";
import Conditional from "@shared/Conditional";
import Typography from "@shared/Typography";
import useMessage from "./hooks/useMessage";
import styles from "./styles/messageStyles";

const MessageBox = ({ data: message }) => {

    const classes = styles();

    const {
        user,
        isHovering,
        ref,
        appliedStyle,
        handleMouseOver,
        handleMouseOut,
        deleteChatMessage,
    } = useMessage(message);

    return (
        <BoxStyled id={message.id} ref={ref} className={classes.message}
            style={appliedStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <Conditional isEnabled={message.senderId === user.id && isHovering}>
                <BoxStyled className={classes.delete} onClick={() => deleteChatMessage(message)}>delete</BoxStyled>
            </Conditional>
            <BoxStyled className={classes.text}><Typography>{message.text}</Typography></BoxStyled>
        </BoxStyled>
    );
};

export default MessageBox;