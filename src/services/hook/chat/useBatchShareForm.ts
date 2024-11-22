
import { ResId } from "@/api/schemas/native/common";
import { useGetChats } from "@/services/data/useChatData";
import { useAuthStore, useChatStore } from "@/services/store/zustand";
import { ConsumerFn } from "@/types/genericTypes";
import { useState } from "react";

const useBatchShareForm = (postId: ResId, toggleForm: ConsumerFn) => {

    const { data: { userId: senderId } } = useAuthStore();
    const { clientMethods } = useChatStore();
    const { sendChatMessage, isClientConnected } = clientMethods;

    const userChats = useGetChats();

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

    const handleSend = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        selectedUsers.forEach(userId => {
            console.log("user chats: ", userChats.data);
            if (userChats.data?.some(chat => chat.members.some(member => member.id === userId))) {
                const chatId = userChats.data.find(chat => chat.members.some(member => member.id === senderId))?.id;
                console.log("sent message to: ", { chatId, senderId, recipientId: userId, text: message });
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