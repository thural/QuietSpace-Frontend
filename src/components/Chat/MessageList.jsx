import BoxStyled from "@shared/BoxStyled";
import ComponentList from "@shared/ComponentList";
import Message from "./Message";
import styles from "./styles/messageListStyles";

const MessagesList = ({ messages, deleteChatMessage, setMessageSeen, isClientConnected }) => {

    const classes = styles();

    const handleDeleteMessage = (message) => deleteChatMessage(message.id);

    return (
        <BoxStyled className={classes.messages}>
            <ComponentList
                list={messages}
                Component={Message}
                handleDeleteMessage={handleDeleteMessage}
                setMessageSeen={setMessageSeen}
                isClientConnected={isClientConnected}
            />
        </BoxStyled>
    );
};

export default MessagesList