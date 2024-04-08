import React, { useState } from "react";
import Message from "./Message";
import InputEmoji from "react-input-emoji";
import styles from "./styles/messageContainerStyles";
import { fetchMessages, fetchCreateMessage } from "../../api/messageRequests";
import { MESSAGE_PATH } from "../../constants/ApiPath";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Text } from "@mantine/core";


const MessageContainer = ({ currentChatId }) => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const auth = queryClient.getQueryData("auth");
    const chats = queryClient.getQueryData(["chats"]);
    const senderId = auth["userId"];

    const currentChat = chats?.find(chat => chat.id === currentChatId);

    console.log("user in message container: ", user);
    console.log("chats in message container: ", chats);
    console.log("currentchat in message container: ", currentChat);
    console.log("is mesages query enabled?: ", !!user.id && !!currentChatId);

    const [messageData, setMessageData] = useState({ chatId: currentChatId, senderId, text: '' });


    const { data: messages, isError, isLoading, isSuccess } = useQuery({
        queryKey: ["messages"],
        queryFn: async () => {
            const response = await fetchMessages(MESSAGE_PATH, currentChatId, auth.token);
            return await response.json();
        },
        retry: 3,
        retryDelay: 1000,
        select: (data) => data.content,
        enabled: !!user.id && !!currentChatId, // if userQuery could fetch the current user
        staleTime: 1000 * 60 * 3, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 60 * 6 // refetch data after 6 minutes on idle
    });

    const handleInputChange = (event) => {
        setMessageData({ ...messageData, text: event });
    }

    console.log("messages in message container: ", messages);

    const newMessageMutation = useMutation({
        mutationFn: async () => {
            const response = await fetchCreateMessage(MESSAGE_PATH, messageData, auth["token"]);
            return response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueryData(["messages", data.id], messageData); // manually cache data before refetch
            setMessageData({ ...messageData, text: '' });
            console.log("message sent successfully:", data);
        },
        onError: (error, variables, context) => {
            console.log("error on sending message: ", error.message);
        },
    })

    const handleSendMessage = () => {
        newMessageMutation.mutate();
    }

    const handleSubmit = () => {
        if (messageData.text.length === 0) return;
        handleSendMessage();
    }

    const classes = styles();

    return (
        <div className={classes.chatboard}>
            {isLoading ? (<Text className="system-message" ta="center">loading messages ...</Text>) :
                isError ? (<Text className="system-message" ta="center">error loading messages</Text>) :
                    currentChatId === null ? (<Text className="system-message" ta="center">you have no messages yet</Text>) :
                        messages.length === 0 ? (
                        <Text className="system-message" ta="center">{`send your first message to ${currentChat.users[1].username}`}</Text>) :
                            (
                                <div className={classes.messages}>
                                    {
                                        messages?.map(message =>
                                            <Message
                                                key={message.id}
                                                message={message}
                                                currentChatId={currentChatId}
                                            />
                                        )
                                    }
                                </div>
                            )
            }

            <div className={classes.inputSection}>
                <form className={classes.chatInput}>
                    <InputEmoji
                        className={classes.messageInput}
                        value={messageData.text}
                        onChange={handleInputChange}
                        fontSize={15}
                        maxLength="128"
                        cleanOnEnter
                        buttonElement
                        borderColor="#FFFFFF"
                        onEnter={handleSubmit}
                        theme="light"
                        placeholder="write a message"
                        enabled={isSuccess}
                    />
                </form>
            </div>
        </div>
    )
}

export default MessageContainer