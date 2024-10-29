import { useQueryClient } from "@tanstack/react-query";
import { Chat, ChatEvent, ChatList, Message, PagedMessage } from "../schemas/inferred/chat";



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

    const insertChatCache = (chatBody: Chat) => {
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            const updatedChats = oldData.map(chat => {
                if (chat.id === -1) return chatBody
                else return chat
            });
            console.log("updated chat data on chat creation");
            return updatedChats;
        });
    }

    const insertMessageCache = (messageBody: Message) => {
        queryClient.setQueryData(['messages', { id: messageBody.chatId }], (oldData: PagedMessage) => {
            return { ...oldData, content: [messageBody, ...oldData.content] };
        });

        queryClient.invalidateQueries({ queryKey: ["chats"] });
    }

    const deletedMessageCache = (chatEvent: ChatEvent) => {
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
        updateChatData: updateChatCache,
        addChatData: insertChatCache,
        handleReceivedMessage: insertMessageCache,
        handleDeletedMessage: deletedMessageCache,
        handleSeenMessage: setMessageSeenCache
    }
}

export default chatQueries