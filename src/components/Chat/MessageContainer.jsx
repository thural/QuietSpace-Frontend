import React from "react";
import Message from "./Message";
import InputEmoji from "react-input-emoji";
import styles from "./styles/messageContainerStyles";
import ChatMenu from "./ChatMenu";
import UserAvatar from "../Shared/UserAvatar";
import { Flex, Text, Title } from "@mantine/core";
import { toUpperFirstChar } from "../../utils/stringUtils";
import { useMessageContainer } from "./hooks/useMessageContainer";

const MessagesList = ({ messages, deleteChatMessage, setMessageSeen, isClientConnected }) => {
    const classes = styles();
    return (
        <div className={classes.messages}>
            {messages.map(message => (
                <Message
                    key={message.id}
                    message={message}
                    handleDeleteMessage={() => deleteChatMessage(message.id)}
                    setMessageSeen={setMessageSeen}
                    isClientConnected={isClientConnected}
                />
            ))}
        </div>
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

    if (!chats?.length) return <Text style={{ margin: "1rem" }} ta="center">there's no messages yet</Text>;
    if (isLoading) return <Text className="system-message" ta="center">loading messages ...</Text>;
    if (isError) return <Text className="system-message" ta="center">error loading messages</Text>;
    if (activeChatId === null) return <Text className="system-message" ta="center">you have no messages yet</Text>;
    if (messages.length === 0) {
        return <Text className="system-message" ta="center">{`send your first message to `}<strong>{recipientName}</strong></Text>;
    }

    return (
        <div className={classes.chatboard}>
            <Flex className={classes.chatHeadline}>
                <UserAvatar radius="10rem" chars={toUpperFirstChar(recipientName)} />
                <Title className="title" order={5}>{recipientName}</Title>
                <ChatMenu handleDeleteChat={handleDeleteChat} isMutable={true} />
            </Flex>

            <MessagesList
                messages={messages}
                deleteChatMessage={deleteChatMessage}
                setMessageSeen={setMessageSeen}
                isClientConnected={isClientConnected}
            />

            <div className={classes.inputSection}>
                <form className={classes.chatInput}>
                    <InputEmoji
                        className={classes.messageInput}
                        value={inputData.text}
                        onChange={handleInputChange}
                        fontSize={15}
                        maxLength="128"
                        cleanOnEnter
                        buttonElement
                        borderColor="#FFFFFF"
                        onEnter={() => sendChatMessage(inputData)}
                        theme="light"
                        placeholder="write a message"
                        enabled={enabled}
                    />
                </form>
            </div>
        </div>
    )
}

export default MessageContainer