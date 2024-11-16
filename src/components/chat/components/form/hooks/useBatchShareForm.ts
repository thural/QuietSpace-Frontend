
import { ResId } from "@/api/schemas/native/common";
import { useGetChatsByUserId } from "@/services/data/useChatData";
import { useAuthStore, useChatStore } from "@/services/store/zustand";
import { ConsumerFn } from "@/types/genericTypes";
import { useState } from "react";

const useBatchShareForm = (postId: ResId, toggleForm: ConsumerFn) => {
    const { data: { userId: senderId } } = useAuthStore();
    const { clientMethods } = useChatStore();
    const { sendChatMessage, isClientConnected } = clientMethods;

    const userChats = useGetChatsByUserId(senderId);



    const [selectedUsers, setSelectedUsers] = useState<Array<ResId>>([]);

    const [message, setMessage] = useState('');

    const handleUserSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const value = e.target.value;
        setSelectedUsers(prevSelected =>
            prevSelected.includes(value) ? prevSelected.filter(user => user !== value)
                : [...prevSelected, value]);
    }

    const handleInputClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setMessage(e.target.value);
    }

    const handleSend = () => {
        selectedUsers.forEach(userId => {
            if (userChats.data?.some(chat => chat.members.some(member => member.id === userId))) {
                const chatId = userChats.data.find(chat => chat.members.some(member => member.id === senderId))?.id;
                sendChatMessage({ chatId, senderId, recipientId: userId, text: message });
                sendChatMessage({ chatId, senderId, recipientId: userId, text: `##MP## ${postId}` });
            }
        })
        // TODO: refactor chatService, handle chat creation users if not present
        console.log("sharing post:", postId);
        toggleForm();
    }

    return {
        isClientConnected,
        handleUserSelect,
        handleInputClick,
        handleMessageChange,
        handleSend
    }
}

export default useBatchShareForm