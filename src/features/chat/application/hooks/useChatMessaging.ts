import chatQueries from "@features/chat/data/queries/chatQueries";
import { ChatResponse, CreateChatRequest } from "@/features/chat/data/models/chat";
import { ResId } from "@/shared/api/models/commonNative";
import { useCreateChat, useGetChats } from "@features/chat/data/useChatData";
import { useAuthStore, useChatStore } from "@/core/store/zustand";
import { useNavigate } from "react-router-dom";


export const useChatMessaging = () => {

    const { data: { userId: senderId } } = useAuthStore();
    const { clientMethods } = useChatStore();
    const { sendChatMessage, isClientConnected } = clientMethods;
    const chats = useGetChats();
    const navigate = useNavigate();
    const { updateInitChatCache } = chatQueries();



    const onSuccess = (data: ChatResponse) => {
        console.log("chat created successfully:", data);
        updateInitChatCache(data);
        navigate(`/chat/${data.id}`);
    };

    const onError = (error: Error) => {
        console.log("error on fetching created chat: ", error.message);
    };

    const createChatMutation = useCreateChat({ onSuccess, onError });



    const findOrCreateChat = (recipientId: ResId, text?: string) => {
        const existingChat = chats.data?.find(chat =>
            chat.members.some(member => member.id === recipientId)
        );

        if (existingChat) return existingChat.id;

        const createChatRequestBody: CreateChatRequest = {
            isGroupChat: false,
            recipientId,
            text: text || '',
            userIds: [senderId, recipientId]
        };
        createChatMutation.mutate(createChatRequestBody);

        return undefined;
    }



    const sendMessage = (params: {
        recipientId: ResId,
        text: string,
        postId?: ResId
    }) => {
        const { recipientId, text, postId } = params;
        const chatId = findOrCreateChat(recipientId, text);

        if (chatId) {
            sendChatMessage({ chatId, senderId, recipientId, text });

            if (postId) {
                sendChatMessage({ chatId, senderId, recipientId, text: `##MP## ${postId}` });
            }
        }
    }



    return {
        sendMessage,
        isClientConnected,
        findOrCreateChat
    };
};