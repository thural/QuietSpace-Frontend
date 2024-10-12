import React from "react";
import { toUpperFirstChar } from "../../utils/stringUtils";
import BoxStyled from "../Shared/BoxStyled";
import EmojiInput from "../Shared/EmojiInput";
import FlexStyled from "../Shared/FlexStyled";
import FormStyled from "../Shared/Form";
import Typography from "../Shared/Typography";
import UserAvatar from "../Shared/UserAvatar";
import ChatMenu from "./ChatMenu";
import { useMessageContainer } from "./hooks/useMessageContainer";
import Message from "./Message";
import styles from "./styles/messageContainerStyles";

const MessagesList = ({ messages, deleteChatMessage, setMessageSeen, isClientConnected }) => {

    const classes = styles();

    return (
        <BoxStyled className={classes.messages}>
            {messages.map(message => (
                <Message
                    key={message.id}
                    message={message}
                    handleDeleteMessage={() => deleteChatMessage(message.id)}
                    setMessageSeen={setMessageSeen}
                    isClientConnected={isClientConnected}
                />
            ))}
        </BoxStyled>
    );
};

const MessageContainer = () => {
    const classes = styles();
    const {
        chats,
        activeChatId,
        recipientName,
        messages,
        isError,
        isLoading,
        sendChatMessage,
        deleteChatMessage,
        setMessageSeen,
        isClientConnected,
        inputData,
        handleInputChange,
        handleDeleteChat,
        enabled
    } = useMessageContainer();

    if (!chats?.length) return <Typography style={{ margin: "1rem" }} ta="center">there's no messages yet</Typography>;
    if (isLoading) return <Typography className="system-message" ta="center">loading messages ...</Typography>;
    if (isError) return <Typography className="system-message" ta="center">error loading messages</Typography>;
    if (activeChatId === null) return <Typography className="system-message" ta="center">you have no messages yet</Typography>;
    if (messages.length === 0) {
        return <Typography className="system-message" ta="center">{`send your first message to `}<strong>{recipientName}</strong></Typography>;
    }

    return (
        <BoxStyled className={classes.chatboard}>
            <FlexStyled className={classes.chatHeadline}>
                <UserAvatar radius="10rem" chars={toUpperFirstChar(recipientName)} />
                <Typography className="title" type="h5">{recipientName}</Typography>
                <ChatMenu handleDeleteChat={handleDeleteChat} isMutable={true} />
            </FlexStyled>

            <MessagesList
                messages={messages}
                deleteChatMessage={deleteChatMessage}
                setMessageSeen={setMessageSeen}
                isClientConnected={isClientConnected}
            />

            <BoxStyled className={classes.inputSection}>
                <FormStyled className={classes.chatInput}>
                    <EmojiInput
                        className={classes.messageInput}
                        value={inputData.text}
                        onChange={handleInputChange}
                        cleanOnEnter
                        buttonElement
                        onEnter={() => sendChatMessage(inputData)}
                        placeholder="write a message"
                        enabled={enabled}
                    />
                </FormStyled>
            </BoxStyled>
        </BoxStyled>
    )
}

export default MessageContainer