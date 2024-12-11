import { DEFAULT_PAGE_SIZE } from "@/constants/params";
import { getInitInfinitePagesObject } from "@/utils/dataTemplates";
import { filterPageContentById, isPageIncludesEntity, pushToPageContent, setEntityContentSeen, transformInfinetePages } from "@/utils/dataUtils";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { ChatEvent, ChatList, ChatResponse, MessageResponse, PagedMessage } from "../schemas/inferred/chat";
import { Page } from "../schemas/inferred/common";
import { ResId } from "../schemas/native/common";



const chatQueries = () => {

    const queryClient = useQueryClient();


    const getChatsCache = (): Array<ChatResponse> | undefined => {
        return queryClient.getQueryData(['chats']);
    }

    const updateChatCache = (message: MessageResponse) => {
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            return oldData.map(chat => {
                if (chat.id !== message.chatId) return chat;
                chat.recentMessage = message;
                return chat;
            });
        });
    }

    const updateInitChatCache = (chatBody: ChatResponse) => {
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            return oldData.map(chat => {
                if (chat.id === "-1") return chatBody;
                else return chat;
            });
        });
    }

    const insertInitChatCache = (chatBody: ChatResponse) => {
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            return [...oldData, chatBody];;
        });
    }

    const insertMessageCache = (messageBody: MessageResponse) => {
        const chatId = messageBody.chatId;
        queryClient.setQueryData(["chats", chatId, 'messages'], (data: InfiniteData<PagedMessage>) => {
            const lastPageNumber = data.pages[0]?.number;
            const predicate = (page: Page<MessageResponse>) => page.number === lastPageNumber;
            if (data !== undefined) return pushToPageContent(data, messageBody, predicate);
            else return getInitInfinitePagesObject(DEFAULT_PAGE_SIZE, [messageBody]);
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