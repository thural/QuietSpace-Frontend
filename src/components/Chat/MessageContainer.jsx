import BoxStyled from "@shared/BoxStyled";
import Typography from "@shared/Typography";
import React from "react";
import ChatHeadline from "./ChatHeadline";
import { useMessageContainer } from "./hooks/useMessageContainer";
import MessageInput from "./MessageInput";
import MessagesList from "./MessageList";
import styles from "./styles/messageContainerStyles";

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
    if (messages.length === 0) return <Typography className="system-message" ta="center">{`send your first message to `}<strong>{recipientName}</strong></Typography>;

    return (
        <BoxStyled className={classes.chatboard}>
            <ChatHeadline
                recipientName={recipientName}
                handleDeleteChat={handleDeleteChat}
            />
            <MessagesList
                messages={messages}
                deleteChatMessage={deleteChatMessage}
                setMessageSeen={setMessageSeen}
                isClientConnected={isClientConnected}
            />
            <MessageInput
                value={inputData.text}
                onChange={handleInputChange}
                onEnter={() => sendChatMessage(inputData)}
                placeholder="write a message"
                enabled={enabled}
            />
        </BoxStyled>
    )
}

export default MessageContainer