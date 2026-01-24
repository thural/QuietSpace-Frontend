import { DEFAULT_PAGE_SIZE } from "@/shared/constants/params";
import { getInitInfinitePagesObject } from "@/shared/utils/dataTemplates";
import { filterPageContentById, isPageIncludesEntity, pushToPageContent, setEntityContentSeen, transformInfinetePages } from "@/shared/utils/dataUtils";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { ChatEvent, ChatList, ChatResponse, MessageResponse, PagedMessage } from "@/features/chat/data/models/chat";
import { Page } from "@/shared/api/models/common";
import { ResId } from "@/shared/api/models/commonNative";



const chatQueries = () => {

    const queryClient = useQueryClient();


    const getChatsCache = (): ChatList | undefined => {
        return queryClient.getQueryData(['chats']);
    }

    const updateChatCache = (message: MessageResponse) => {
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            if (!oldData?.content) return oldData;
            return {
                ...oldData,
                content: oldData.content.map(chat => {
                    if (chat.id !== message.chatId) return chat;
                    chat.recentMessage = message;
                    return chat;
                })
            };
        });
    }

    const updateInitChatCache = (chatBody: ChatResponse) => {
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            if (!oldData?.content) return oldData;
            return {
                ...oldData,
                content: oldData.content.map(chat => {
                    if (chat.id === "-1") return chatBody;
                    else return chat;
                })
            };
        });
    }

    const insertInitChatCache = (chatBody: ChatResponse) => {
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            if (!oldData?.content) return oldData;
            return {
                ...oldData,
                content: [...oldData.content, chatBody]
            };
        });
    }

    const insertMessageCache = (messageBody: MessageResponse) => {
        const chatId = messageBody.chatId;
        queryClient.setQueryData(["chats", chatId, 'messages'], (data: InfiniteData<PagedMessage>) => {
            const lastPageNumber = data.pages[0]?.number;
            const predicate = (page: Page<MessageResponse>) => page.number === lastPageNumber;
            return data ? pushToPageContent(data, messageBody, predicate) : getInitInfinitePagesObject(DEFAULT_PAGE_SIZE, [messageBody]);
        });
    }

    const deleteMessageCache = (chatEvent: ChatEvent) => {
        const chatId = chatEvent.chatId;
        queryClient.setQueryData(["chats", chatId, 'messages'], (oldData: InfiniteData<PagedMessage>) => {
            return transformInfinetePages(oldData, chatEvent.messageId as ResId, isPageIncludesEntity, filterPageContentById)
        });
    }

    const setMessageSeenCache = (chatEvent: ChatEvent) => {
        const { messageId, chatId } = chatEvent;
        queryClient.setQueryData(["chats", chatId, 'messages'], (data: InfiniteData<PagedMessage>) => {
            return transformInfinetePages(data, messageId as ResId, isPageIncludesEntity, setEntityContentSeen);
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