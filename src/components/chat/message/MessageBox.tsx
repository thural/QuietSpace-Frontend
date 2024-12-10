import React from 'react';
import { MessageResponse } from "@/api/schemas/inferred/chat";
import { useMessage } from "@/services/hook/chat/useMessage";
import styles from "@/styles/chat/messageStyles";
import BoxStyled from "@shared/BoxStyled";
import Conditional from "@shared/Conditional";
import Typography from "@shared/Typography";
import { ResId } from '@/api/schemas/native/common';
import useHoverState from '@/services/hook/shared/useHoverState';


interface MessageBoxProps {
    message: MessageResponse;
    style?: React.CSSProperties;
    onDelete?: (messageId: ResId) => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({
    message,
    style,
    onDelete
}) => {
    const classes = styles();

    const { user, wasSeenRef } = useMessage(message);
    const {
        isHovering,
        handleMouseOver,
        handleMouseOut
    } = useHoverState();

    const handleDeleteMessage = () => {
        if (onDelete) {
            onDelete(message.id);
        } else {
            const { handleDeleteMessage: defaultDelete } = useMessage(message);
            defaultDelete();
        }
    };

    return (
        <BoxStyled
            id={message.id}
            ref={wasSeenRef}
            className={classes.message}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            style={style}
        >
            <Conditional isEnabled={message.senderId === user.id && isHovering}>
                <BoxStyled
                    className={classes.delete}
                    onClick={handleDeleteMessage}
                >
                    delete
                </BoxStyled>
            </Conditional>

            <BoxStyled className={classes.text}>
                <Typography>{message.text}</Typography>
            </BoxStyled>
        </BoxStyled>
    );
};


const MemoizedMessageBox = React.memo(MessageBox, (prevProps, nextProps) =>
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.text === nextProps.message.text &&
    prevProps.message.isSeen === nextProps.message.isSeen
);

export { MessageBox, MemoizedMessageBox };
export default MessageBox;