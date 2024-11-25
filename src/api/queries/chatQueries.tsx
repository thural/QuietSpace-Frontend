import { DEFAULT_PAGE_SIZE } from "@/constants/params";
import { getInitInfinitePagesObject } from "@/utils/dataTemplates";
import { filterPageContentById, isPageIncludesEntity, pushToPageContent, setNotificationContentSeen, transformInfinetePages } from "@/utils/dataUtils";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Chat, ChatEvent, ChatList, Message, PagedMessage } from "../schemas/inferred/chat";
import { Page } from "../schemas/inferred/common";
import { ResId } from "../schemas/native/common";



const chatQueries = () => {

    const queryClient = useQueryClient();

    const getChatsCache = (): Array<Chat> | undefined => {
        return queryClient.getQueryData(['chats']);
    }

    const updateChatCache = (message: Message) => {
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            return oldData.map(chat => {
                if (chat.id !== message.chatId) return chat;
                chat.recentMessage = message;
                return chat;
            });
        });
    }

    const updateInitChatCache = (chatBody: Chat) => {
        console.log("inserting chat: ", chatBody);
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            return oldData.map(chat => {
                if (chat.id === "-1") return chatBody;
                else return chat;
            });
        });
    }

    const insertInitChatCache = (chatBody: Chat) => {
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            return [...oldData, chatBody];;
        });
    }

    const insertMessageCache = (messageBody: Message) => {
        queryClient.setQueryData(['messages', { id: messageBody.chatId }], (data: InfiniteData<PagedMessage>) => {
            const lastPageNumber = data.pages[0]?.number;
            const predicate = (page: Page<Message>) => page.number === lastPageNumber;
            if (data !== undefined) return pushToPageContent(data, messageBody, predicate);
            else return getInitInfinitePagesObject(DEFAULT_PAGE_SIZE, [messageBody]);
        });
    }

    const deleteMessageCache = (chatEvent: ChatEvent) => {
        queryClient.setQueryData(['messages', { id: chatEvent.chatId }], (oldData: InfiniteData<PagedMessage>) => {
            return transformInfinetePages(oldData, chatEvent.messageId as ResId, isPageIncludesEntity, filterPageContentById)
        });
    }

    const setMessageSeenCache = (chatEvent: ChatEvent) => {
        const { messageId, chatId } = chatEvent;
        queryClient.setQueryData(['messages', { id: chatId }], (data: InfiniteData<PagedMessage>) => {
            return transformInfinetePages(data, messageId as ResId, isPageIncludesEntity, setNotificationContentSeen);
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