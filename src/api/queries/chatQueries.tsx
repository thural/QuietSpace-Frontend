import { useQueryClient } from "@tanstack/react-query";
import { Chat, ChatEvent, ChatList, Message, PagedMessage } from "../schemas/inferred/chat";
import { PageContent } from "../schemas/inferred/common";
import { getInitPageObject } from "@/utils/dataTemplates";



const chatQueries = () => {

    const queryClient = useQueryClient();

    const getChatsCache = (): PageContent<Chat> | undefined => {
        return queryClient.getQueryData(["chats"]);
    }

    const updateChatCache = (message: Message) => {

        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            const updatedChats = oldData.map(chat => {
                if (chat.id !== message.chatId) return chat;
                chat.recentMessage = message;
                return chat;
            });
            return updatedChats;
        });
    }

    const updateInitChatCache = (chatBody: Chat) => {
        console.log("inserting chat: ", chatBody);
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            const updatedChats = oldData.map(chat => {
                if (chat.id === -1) return chatBody
                else return chat
            });
            return updatedChats;
        });
    }

    const insertInitChatCache = (chatBody: Chat) => {
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            const updatedChats = [...oldData, chatBody];
            console.log("updated chat data on chat creation: ", updatedChats);
            return updatedChats;
        });
    }

    const insertMessageCache = (messageBody: Message) => {
        queryClient.setQueryData(['messages', { id: messageBody.chatId }], (oldData: PagedMessage) => {
            if (oldData !== undefined) return { ...oldData, content: [messageBody, ...oldData.content] };
            return getInitPageObject(25, [messageBody]);
        });
    }

    const deleteMessageCache = (chatEvent: ChatEvent) => {
        queryClient.setQueryData(['messages', { id: chatEvent.chatId }], (oldData: PagedMessage) => {
            const updatedMessages = oldData.content.filter(message => message.id !== chatEvent.messageId);
            return { ...oldData, content: updatedMessages };
        });
    }

    const setMessageSeenCache = (chatEvent: ChatEvent) => {
        const { messageId, chatId } = chatEvent;
        queryClient.setQueryData(['messages', { id: chatId }], (oldData: PagedMessage) => {
            const updatedMessages = oldData.content.map(message => {
                if (message.id !== messageId) return message;
                message.isSeen = true;
                return message;
            });
            return { ...oldData, content: updatedMessages };
        });
    }



    return {
        getChatsCache,
        updateChatCache,
        updateInitChatCache,
        insertInitChatCache,
        insertMessageCache,
        deleteMessageCache,
        setMessageSeenCache
    }
}


export default chatQueries