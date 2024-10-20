import BoxStyled from "@shared/BoxStyled";
import Conditional from "@shared/Conditional";
import Typography from "@shared/Typography";
import useMessage from "./hooks/useMessage";
import styles from "./styles/messageStyles";

const Message = ({ data: message, handleDeleteMessage, setMessageSeen, isClientConnected }) => {

    const classes = styles();

    const {
        user,
        isHovering,
        setIsHovering,
        wasSeen,
        ref,
        appliedStyle,
        handleMouseOver,
        handleMouseOut,
    } = useMessage(message, setMessageSeen, isClientConnected);

    return (
        <BoxStyled id={message.id} ref={ref} className={classes.message}
            style={appliedStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <Conditional isEnabled={message.senderId === user.id && isHovering}>
                <BoxStyled className={classes.delete} onClick={() => handleDeleteMessage(message)}>delete</BoxStyled>
            </Conditional>
            <BoxStyled className={classes.text}><Typography>{message.text}</Typography></BoxStyled>
        </BoxStyled>
    );
};

export default Message;