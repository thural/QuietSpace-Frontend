import { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from "./models/chat";
import { ResId } from "@/shared/api/models/common";
import { useCustomQuery } from '@/core/hooks';
import { useCustomMutation } from '@/core/hooks';
import { useCustomInfiniteQuery } from '@/core/hooks';
import { useChatServices } from '../application/hooks/useChatServices';
import { useCacheInvalidation } from '@/core/hooks/migrationUtils';
import { CHAT_CACHE_KEYS } from '../data/cache/ChatCacheKeys';
import { CACHE_TIME_MAPPINGS } from '@/core/hooks/migrationUtils';
import { useAuthStore } from "@/core/store/zustand";


export const useGetChats = () => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { chatDataService } = useChatServices();
    
    return useCustomQuery(
        ['chats', authData.userId],
        async (): Promise<ChatList> => {
            if (!isAuthenticated) return { content: [], totalElements: 0, totalPages: 0, last: true, first: true, size: 0, number: 0, numberOfElements: 0, empty: true, pageable: { pageNumber: 0, pageSize: 0, sort: { sorted: false, unsorted: true, empty: true }, offset: 0, paged: false, unpaged: true }, sort: { sorted: false, unsorted: true, empty: true } };
            return await chatDataService.getChats(authData.userId, authData.accessToken);
        },
        {
            retry: 3,
            retryDelay: 1000,
            enabled: isAuthenticated,
            staleTime: CACHE_TIME_MAPPINGS.CHAT_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME,
            refetchInterval: CACHE_TIME_MAPPINGS.CHAT_REFETCH_INTERVAL,
            onSuccess: (data) => {
                console.log('CustomChatData: Chats loaded:', { 
                    userId: authData.userId, 
                    count: data.content?.length || 0 
                });
            },
            onError: (error) => {
                console.error('CustomChatData: Error loading chats:', error);
            }
        }
    );
};


export const useCreateChat = ({
    onSuccess,
    onError,
}: {
    onSuccess?: (data: ChatResponse) => void;
    onError?: (error: Error) => void;
}) => {
    const { data: authData } = useAuthStore();
    const { chatFeatureService } = useChatServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async (chatBody: CreateChatRequest): Promise<ChatResponse> => {
            return await chatFeatureService.createChatWithValidation(chatBody, authData.accessToken);
        },
        {
            onSuccess: (data) => {
            console.log('CustomChatData: Chat created successfully:', data.id);
            invalidateCache.invalidateUserChatData(authData.userId);
            onSuccess?.(data);
        },
            onError: (error) => {
                console.error('CustomChatData: Error creating chat:', error);
                onError?.(error);
            },
            optimisticUpdate: (cache, variables) => {
                const optimisticChat: ChatResponse = {
                    id: `temp-${Date.now()}`,
                    createDate: new Date().toISOString(),
                    updateDate: new Date().toISOString(),
                    userIds: variables.userIds || [],
                    members: [], // Would need to be populated based on userIds
                    recentMessage: undefined
                };
                
                const cacheKey = CHAT_CACHE_KEYS.USER_CHATS(authData.userId);
                const existingChats = cache.get<any>(cacheKey) || { content: [] };
                cache.set(cacheKey, {
                    ...existingChats,
                    content: [optimisticChat, ...existingChats.content]
                });
                
                return () => {
                    const updatedChats = cache.get<any>(cacheKey) || { content: [] };
                    const filtered = updatedChats.content.filter((chat: any) => chat.id !== optimisticChat.id);
                    cache.set(cacheKey, { ...updatedChats, content: filtered });
                };
            },
            retry: 2,
            retryDelay: 1000
        }
    );
};


export const useGetMessagesByChatId = (chatId: ResId) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { chatDataService } = useChatServices();
    
    return useCustomInfiniteQuery(
        ['chats', chatId, 'messages'],
        async (pageParam = 0) => {
            const pagedMessage = await chatDataService.getMessages(chatId, pageParam, authData.accessToken);
            return {
                data: pagedMessage.content || [],
                hasNextPage: !pagedMessage.last,
                hasPreviousPage: !pagedMessage.first
            };
        },
        {
            getNextPageParam: (lastPage, allPages) => {
                return lastPage.hasNextPage ? allPages.length : undefined;
            },
            staleTime: CACHE_TIME_MAPPINGS.CHAT_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME,
            enabled: isAuthenticated && !!chatId,
            refetchInterval: CACHE_TIME_MAPPINGS.MESSAGES_REFETCH_INTERVAL,
            onSuccess: (data, allPages) => {
                console.log('CustomChatData: Messages loaded:', { 
                    chatId, 
                    totalPages: allPages.length,
                    totalMessages: data.length 
                });
            },
            onError: (error) => {
                console.error('CustomChatData: Error loading messages:', error);
            }
        }
    );
};


export interface UseDeleteChatProps {
    chatId: ResId;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

export const useDeleteChat = ({
    chatId, onSuccess, onError,
}: UseDeleteChatProps) => {
    if (chatId === undefined) throw new Error("chatId is undefined");
    const { data: authData } = useAuthStore();
    const { chatDataService } = useChatServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async (): Promise<Response> => {
            return await chatDataService.deleteChat(chatId, authData.accessToken);
        },
        {
            onSuccess: (data) => {
                console.log('CustomChatData: Chat deleted successfully:', chatId);
                invalidateCache.invalidateChatData(chatId);
                invalidateCache.invalidateUserChatData(authData.userId);
                onSuccess?.(data);
            },
            onError: (error) => {
                console.error('CustomChatData: Error deleting chat:', error);
                onError?.(error);
            },
            optimisticUpdate: (cache) => {
                const cacheKey = CHAT_CACHE_KEYS.USER_CHATS(authData.userId);
                const existingChats = cache.get<any>(cacheKey) || { content: [] };
                const deletedChat = existingChats.content.find((chat: any) => chat.id === chatId);
                const filteredChats = existingChats.content.filter((chat: any) => chat.id !== chatId);
                cache.set(cacheKey, { ...existingChats, content: filteredChats });
                
                return () => {
                    if (deletedChat) {
                        const restoredChats = cache.get<any>(cacheKey) || { content: [] };
                        cache.set(cacheKey, { 
                            ...restoredChats, 
                            content: [deletedChat, ...restoredChats.content] 
                        });
                    }
                };
            },
            retry: 2,
            retryDelay: 1000
        }
    );
};