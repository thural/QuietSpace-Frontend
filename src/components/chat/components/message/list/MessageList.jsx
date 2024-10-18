import BoxStyled from "@shared/BoxStyled";
import ComponentList from "@shared/ComponentList";
import MessageBox from "../base/MessageBox";
import styles from "./styles/messageListStyles";

const MessagesList = ({ messages, deleteChatMessage, setMessageSeen, isClientConnected }) => {

    const classes = styles();

    const handleDeleteMessage = (message) => deleteChatMessage(message.id);

    return (
        <BoxStyled className={classes.messages}>
            <ComponentList
                list={messages}
                Component={MessageBox}
                handleDeleteMessage={handleDeleteMessage}
                setMessageSeen={setMessageSeen}
                isClientConnected={isClientConnected}
            />
        </BoxStyled>
    );
};

export default MessagesList