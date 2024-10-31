import { useQueryClient } from "@tanstack/react-query";
import { Chat, ChatEvent, ChatList, Message, MessageList, PagedMessage } from "../schemas/inferred/chat";
import { PageContent } from "../schemas/inferred/common";



export const getChatsCache = (): PageContent<Chat> | undefined => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["chats"]);
}

export const updateChatCache = (message: Message) => {
    const queryClient = useQueryClient();
    queryClient.setQueryData(['chats'], (oldData: ChatList) => {
        const updatedChats = oldData.map(chat => {
            if (chat.id !== message.chatId) return chat;
            chat.recentMessage = message;
            return chat;
        });
        return updatedChats;
    });
}

export const updateInitChatCache = (chatBody: Chat) => {
    const queryClient = useQueryClient();
    console.log("inserting chat: ", chatBody);
    queryClient.setQueryData(['chats'], (oldData: ChatList) => {
        const updatedChats = oldData.map(chat => {
            if (chat.id === -1) return chatBody
            else return chat
        });
        return updatedChats;
    });
}

export const insertInitChatCache = (chatBody: Chat) => {
    const queryClient = useQueryClient();
    console.log("inserting chat: ", chatBody);
    queryClient.setQueryData(['chats'], (oldData: ChatList) => {
        const updatedChats = [...oldData, chatBody];
        console.log("updated chat data on chat creation: ", updatedChats);
        return updatedChats;
    });
}

export const insertMessageCache = (messageBody: Message) => {
    const queryClient = useQueryClient();
    queryClient.setQueryData(['messages', { id: messageBody.chatId }], (oldData: MessageList) => {
        console.log("old message data: ", oldData);
        console.log("type of old data: ", typeof oldData);
        console.log("insered message to cache: ", messageBody);
        if (oldData === undefined) return [messageBody];
        return [...oldData, messageBody];
    });
}

export const deleteMessageCache = (chatEvent: ChatEvent) => {
    const queryClient = useQueryClient();
    queryClient.setQueryData(['messages', { id: chatEvent.chatId }], (oldData: PagedMessage) => {
        const updatedMessages = oldData.content.filter(message => message.id !== chatEvent.messageId);
        return { ...oldData, content: updatedMessages };
    });

    queryClient.invalidateQueries({ queryKey: ["chats"] });
}

export const setMessageSeenCache = (chatEvent: ChatEvent) => {
    const queryClient = useQueryClient();
    const { messageId, chatId } = chatEvent;
    queryClient.setQueryData(['messages', { id: chatId }], (oldData: PagedMessage) => {
        const updatedMessages = oldData.content.map(message => {
            if (message.id !== messageId) return message;
            message.isSeen = true;
            return message;
        });
        return { ...oldData, content: updatedMessages };
    });
    queryClient.invalidateQueries({ queryKey: ["chats"] });
}