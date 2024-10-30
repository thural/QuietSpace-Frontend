import { useQueryClient } from "@tanstack/react-query";
import { Chat, ChatEvent, ChatList, Message, MessageList, PagedMessage } from "../schemas/inferred/chat";



const chatQueries = () => {

    const queryClient = useQueryClient();



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
        console.log("inserting chat: ", chatBody);
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            const updatedChats = [...oldData, chatBody];
            console.log("updated chat data on chat creation: ", updatedChats);
            return updatedChats;
        });
    }

    const insertMessageCache = (messageBody: Message) => {
        queryClient.setQueryData(['messages', { id: messageBody.chatId }], (oldData: MessageList) => {
            console.log("old message data: ", oldData);
            console.log("type of old data: ", typeof oldData);
            console.log("insered message to cache: ", messageBody);
            if (oldData === undefined) return [messageBody];
            return [...oldData, messageBody];
        });
    }

    const deleteMessageCache = (chatEvent: ChatEvent) => {
        queryClient.setQueryData(['messages', { id: chatEvent.chatId }], (oldData: PagedMessage) => {
            const updatedMessages = oldData.content.filter(message => message.id !== chatEvent.messageId);
            return { ...oldData, content: updatedMessages };
        });

        queryClient.invalidateQueries({ queryKey: ["chats"] });
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
        queryClient.invalidateQueries({ queryKey: ["chats"] });
    }



    return {
        updateChatCache,
        updateInitChatCache,
        insertInitChatCache,
        insertMessageCache,
        deleteMessageCache,
        setMessageSeenCache,
    }
}

export default chatQueries